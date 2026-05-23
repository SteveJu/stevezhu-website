import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const sensitiveEnvNames = new Set([
  'OWNER_PASSCODE',
  'SUPABASE_SERVICE_ROLE_KEY',
  'GEMINI_API_KEY',
  'R2_ACCESS_KEY_ID',
  'R2_SECRET_ACCESS_KEY',
]);

const tokenPatterns = [
  ['OpenAI-like API key', /\bsk-[A-Za-z0-9_-]{20,}\b/g],
  ['GitHub token', /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/g],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{20,}\b/g],
  ['Bearer token literal', /\bBearer\s+[A-Za-z0-9._~+/=-]{20,}/g],
];

const allowlistedFiles = new Set(['.env.example']);
const trackedFiles = execFileSync('git', ['ls-files'], { encoding: 'utf8' })
  .trim()
  .split('\n')
  .filter(Boolean);
const findings = [];

for (const file of trackedFiles) {
  let content;
  try {
    content = readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  if (content.includes('\u0000')) continue;

  const lines = content.split(/\r?\n/);
  lines.forEach((line, index) => {
    const envMatch = line.match(/^([A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSCODE|PASSWORD)[A-Z0-9_]*)=(.+)$/);
    if (
      envMatch &&
      sensitiveEnvNames.has(envMatch[1]) &&
      envMatch[2].trim() &&
      !allowlistedFiles.has(file)
    ) {
      findings.push(`${file}:${index + 1}: non-empty sensitive env assignment for ${envMatch[1]}`);
    }

    for (const [label, pattern] of tokenPatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        findings.push(`${file}:${index + 1}: ${label}`);
      }
    }
  });
}

if (findings.length > 0) {
  console.error('Potential secrets found:');
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`Secret scan passed for ${trackedFiles.length} tracked files.`);
