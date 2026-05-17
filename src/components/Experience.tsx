import SkillsRadarSection from './SkillsRadarSection';

const Experience = () => {
  const experiences = [
    {
      role: 'Software Engineer',
      company: 'Meta Platforms',
      location: 'New York, NY',
      period: 'Mar 2025 - Present',
      accent: 'blue',
      metrics: ['108M+ users', '1.5T+ daily signals', '96% precision'],
      chapters: [
        {
          title: 'Instagram Integrity & Youth Protection',
          period: 'Jan 2026 - Present',
          bullets: [
            'Own the Problematic Anonymous Accounts LLM detection pipeline, leveraging Llama and Gemini to identify high-risk accounts across 55M+ users in 5 markets, expanding to 108M+ users across 10 markets.',
            'Improved detection precision from 70% to 96%, fully eliminating manual review dependency.',
            'Co-lead the Instagram Comment Integrity System, processing 1.5T+ daily comment signals across 3B+ users and reducing violating pinned comment exposure by 98%.',
            'Partner with policy, privacy, and product teams to translate safety requirements into enforcement logic, review workflows, and user experience.',
          ],
        },
        {
          title: 'Horizon Creator Platform & Monetization',
          period: 'Mar 2025 - Jan 2026',
          bullets: [
            'Built core capabilities for the Meta Horizon Creator Portal, enabling creators to generate, list, and monetize digital assets with Generative AI and cross-surface tooling.',
            'Grew active creator base from 20 to 800 to 8,000+ through end-to-end publishing and monetization workflows across Horizon, Facebook, and Instagram.',
            'Architected scalable integrity systems for user-generated avatar items, including a modular enforcement framework and creator strike pipeline.',
            'Designed a real-time digital item tiering system with scalable backend persistence and implemented region-specific compliance logic for international expansion.',
          ],
        },
      ],
      tech: ['Python', 'Llama', 'Gemini', 'GraphQL', 'React', 'PHP (Hack)', 'Integrity Systems'],
    },
    {
      role: 'Software Engineer',
      company: 'Bank of America',
      location: 'Jersey City, NJ',
      period: 'Jul 2021 - Mar 2025',
      accent: 'sky',
      metrics: ['Enterprise analytics', 'Platform stability', 'Internal automation'],
      chapters: [
        {
          title: 'Enterprise Data Platforms',
          period: 'Jul 2021 - Mar 2025',
          bullets: [
            'Developed cloud-based data visualization platforms using Java, Spring Boot, and AWS, supporting enterprise reporting and analytics across multiple business lines.',
            'Led a critical framework upgrade across thousands of source files under tight timelines, reducing build failures and improving system stability across the platform.',
            'Built internal Python tooling and automation utilities to support platform reliability and technology lifecycle management.',
          ],
        },
      ],
      tech: ['Java', 'Spring Boot', 'AWS', 'Python', 'SQL', 'JavaScript'],
    },
    {
      role: 'Research Assistant',
      company: 'The Ohio State University',
      location: 'Columbus, OH',
      period: 'Jan 2020 - May 2021',
      accent: 'violet',
      metrics: ['Computer vision', 'Applied research', 'Data tooling'],
      chapters: [
        {
          title: 'Applied Research Systems',
          period: 'Jan 2020 - May 2021',
          bullets: [
            'Developed computer vision and data analysis pipelines using Python and OpenCV for applied research in aviation, agriculture, and cognitive science.',
            'Built end-to-end data collection and visualization tools, including mobile and web applications, to support real-world experimentation and cross-disciplinary research.',
          ],
        },
      ],
      tech: ['Python', 'OpenCV', 'Computer Vision', 'Data Analysis', 'Web Apps'],
    },
  ];

  const education = [
    {
      school: 'Columbia University',
      degree: 'Master of Science in Computer Science',
      track: 'Machine Learning Track',
      period: 'Sep 2023 - May 2025',
      location: 'New York, NY',
    },
    {
      school: 'Stanford University',
      degree: 'Artificial Intelligence Graduate Program',
      track: 'Non-degree Option',
      period: 'Sep 2021 - Mar 2023',
      location: 'Stanford, CA',
    },
    {
      school: 'The Ohio State University',
      degree: 'Bachelor of Science in Computer Science and Engineering',
      track: 'Artificial Intelligence',
      period: 'Aug 2016 - May 2021',
      location: 'Columbus, OH',
    },
  ];

  const accentClasses = {
    blue: {
      dot: 'bg-blue-500 ring-blue-100',
      border: 'border-blue-500',
      text: 'text-blue-700',
      pill: 'bg-blue-50 text-blue-700 border-blue-100',
    },
    sky: {
      dot: 'bg-sky-500 ring-sky-100',
      border: 'border-sky-500',
      text: 'text-sky-700',
      pill: 'bg-sky-50 text-sky-700 border-sky-100',
    },
    violet: {
      dot: 'bg-violet-500 ring-violet-100',
      border: 'border-violet-500',
      text: 'text-violet-700',
      pill: 'bg-violet-50 text-violet-700 border-violet-100',
    },
  };

  return (
    <section id="experience" data-section="2" className="theme-section min-h-screen py-20 px-6 snap-start">
      <div className="max-w-6xl mx-auto">
        <div className="mb-14 text-center">
          <p className="theme-kicker mb-4">
            Career Timeline
          </p>
          <h2 className="theme-heading">
            Professional Experience
          </h2>
        </div>

        <div className="relative">
          <div className="theme-timeline-line absolute left-4 md:left-[9.5rem] top-0 bottom-0 w-px" />

          <div className="space-y-10">
            {experiences.map((exp) => {
              const accent = accentClasses[exp.accent as keyof typeof accentClasses];

              return (
                <article key={`${exp.company}-${exp.period}`} className="relative grid gap-5 md:grid-cols-[10rem_1fr]">
                  <div className="pl-12 md:pl-0 md:pr-8 md:text-right">
                    <div className="theme-time">{exp.period}</div>
                    <div className="theme-muted mt-1 text-sm">{exp.location}</div>
                  </div>

                  <div className="theme-dot absolute left-2.5 md:left-[9rem] top-1.5 h-3 w-3 rounded-full" />

                  <div className={`theme-card theme-job-card ml-12 md:ml-0 p-6 md:p-8 ${accent.border}`}>
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="theme-card-title">{exp.role}</h3>
                        <p className="theme-accent mt-1 text-lg font-medium">{exp.company}</p>
                      </div>

                      <div className="flex flex-wrap gap-2 md:justify-end">
                        {exp.metrics.map((metric) => (
                          <span key={metric} className="theme-pill">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 space-y-7">
                      {exp.chapters.map((chapter) => (
                        <div key={chapter.title} className="theme-divider pt-6 first:border-t-0 first:pt-0">
                          <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                            <h4 className="theme-subtitle">{chapter.title}</h4>
                            <span className="theme-muted text-sm">{chapter.period}</span>
                          </div>

                          <ul className="mt-4 space-y-3">
                            {chapter.bullets.map((highlight) => (
                              <li key={highlight} className="theme-list-item flex gap-3 text-sm leading-6">
                                <span className="theme-bullet mt-2 h-1.5 w-1.5 flex-none rounded-full" />
                                <span>{highlight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="mt-7 flex flex-wrap gap-2">
                      {exp.tech.map((tool) => (
                        <span key={tool} className="theme-tech">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-20">
          <h3 className="theme-heading text-center mb-10">Education</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {education.map((edu) => (
              <div key={edu.school} className="theme-card p-6">
                <div className="theme-muted text-sm font-medium">{edu.period}</div>
                <div className="theme-card-title mt-3 text-lg">{edu.school}</div>
                <div className="theme-list-item mt-2 text-sm leading-6">{edu.degree}</div>
                <div className="theme-muted text-sm">{edu.track}</div>
                <div className="theme-accent mt-4 text-sm font-medium">{edu.location}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20">
          <h3 className="theme-heading text-center mb-12">Technical Skills Overview</h3>
          <SkillsRadarSection />
        </div>
      </div>
    </section>
  );
};

export default Experience;
