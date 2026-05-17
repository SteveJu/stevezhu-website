import { NextResponse } from 'next/server';
import { isOwnerUnlocked } from '@/lib/ownerAuth';
import { loadTravelPlannerPayload, type SharedJellyCard } from '@/lib/travelPlannerState';

type AiFillRequest = {
  moduleId?: SharedJellyCard['moduleId'];
  imageBase64?: string;
  mimeType?: string;
  shareCode?: string;
};

const moduleFields: Record<SharedJellyCard['moduleId'], string[]> = {
  flight: ['出发日期', '出发时间', '到达日期', '到达时间', '出发机场', '到达机场', '航班号', '费用', '备注'],
  car: ['提车日期', '提车时间', '还车日期', '还车时间', '提车地点', '还车地点同提车地点', '还车地点', '租车公司', '价格', '备注'],
  hotel: ['住宿类型', '名字', '入住日期', '入住时间', '退房日期', '退房时间', '地点', 'Brand', '费用', '备注'],
  restaurant: ['名字', '地点', '开始日期', '开始时间', 'Period', '是否已经订位', '备注'],
  activity: ['活动名称', '日期', '时间', '地点', '是否需要门票', '是否已经订票', '价格', '备注'],
};

const supportedMimeTypes = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/heic', 'image/heif']);
const moduleIds = Object.keys(moduleFields) as SharedJellyCard['moduleId'][];

const isSharedAccessAllowed = async (shareCode?: string) => {
  if (!shareCode) return false;

  const payload = await loadTravelPlannerPayload();
  return payload.travels.some((travel) => travel.shareCode === shareCode);
};

const cleanBase64 = (value: string) => {
  return value.includes(',') ? value.split(',').at(-1) ?? '' : value;
};

const parseGeminiJson = (text: string) => {
  const trimmedText = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(trimmedText) as { moduleId?: SharedJellyCard['moduleId'] | 'none'; fields?: Record<string, string> };
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as AiFillRequest | null;

  if (!body?.imageBase64 || !body.mimeType || (body.moduleId && !moduleFields[body.moduleId])) {
    return NextResponse.json({ error: 'Invalid AI fill request.' }, { status: 400 });
  }

  if (!supportedMimeTypes.has(body.mimeType)) {
    return NextResponse.json({ error: 'Unsupported image type.' }, { status: 400 });
  }

  const hasAccess = await isOwnerUnlocked() || await isSharedAccessAllowed(body.shareCode);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Gemini API key is not configured.' }, { status: 500 });
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
  const isGeneralFill = !body.moduleId;
  const fields = body.moduleId ? moduleFields[body.moduleId] : Object.values(moduleFields).flat();
  const prompt = [
    'You extract travel booking details from a screenshot into JSON. Treat the screenshot primarily as an OCR/document-understanding task.',
    'First read all visible text carefully. Use logos, airline icons, hotel logos, car rental branding, and other visual cues only to help classify the booking type or brand when text also supports it.',
    'Do not infer dates, times, locations, prices, booking status, or names from decorative graphics alone.',
    isGeneralFill
      ? `First classify the screenshot as exactly one of these travel item types: ${moduleIds.join(', ')}. If no clear travel booking info is present, use moduleId "none".`
      : `Travel item type: ${body.moduleId}.`,
    isGeneralFill
      ? `Allowed output shape: {"moduleId":"flight|car|hotel|restaurant|activity|none","fields":{...}}. Use only fields for the selected module.`
      : `Allowed output shape: {"fields":{...}}. Allowed field keys: ${fields.join(', ')}.`,
    'Return ONLY valid JSON. Do not include markdown.',
    'Use these formats: dates as YYYY-MM-DD, times as HH:mm in 24-hour format, booleans as "true" or "false", prices as numeric strings without currency symbols.',
    'Only include fields supported by visible text in the screenshot. Do not invent missing values.',
    'Extract only information that belongs to this travel item type. Ignore unrelated hotels, flights, cars, restaurants, activities, ads, headers, and page navigation.',
    'If a field is missing, uncertain, or belongs to another booking type, omit that field entirely. It is better to return fewer fields than to guess.',
    'If the screenshot contains only generic app UI, navigation, marketing text, or no clear booking details, return moduleId "none" for general classification or an empty fields object for a fixed travel item type.',
    'Use Chinese field keys exactly as listed.',
  ].join('\n');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: body.mimeType,
                    data: cleanBase64(body.imageBase64),
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
            response_mime_type: 'application/json',
          },
        }),
      },
    );

    if (!response.ok) {
      return NextResponse.json({ error: await response.text() }, { status: 500 });
    }

    const result = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: 'Gemini returned no extracted fields.' }, { status: 500 });
    }

    const parsedResult = parseGeminiJson(text);
    const detectedModuleId = isGeneralFill ? parsedResult.moduleId : body.moduleId;

    if (!detectedModuleId || detectedModuleId === 'none' || !moduleFields[detectedModuleId]) {
      return NextResponse.json({ moduleId: null, fields: {} });
    }

    const allowedFields = moduleFields[detectedModuleId];
    const extractedFields = parsedResult.fields ?? {};
    const filteredFields = Object.fromEntries(
      Object.entries(extractedFields).filter(([key, value]) => allowedFields.includes(key) && typeof value === 'string' && value.trim()),
    );

    return NextResponse.json({ moduleId: detectedModuleId, fields: filteredFields });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to extract fields.' },
      { status: 500 },
    );
  }
}
