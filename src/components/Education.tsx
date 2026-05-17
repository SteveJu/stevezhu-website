const Education = () => {
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

  return (
    <section id="education" data-section="3" className="theme-section min-h-screen flex items-center px-6 py-20 snap-start">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-14 text-center">
          <p className="theme-kicker mb-4">Academic Path</p>
          <h2 className="theme-heading">Education</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {education.map((edu) => (
            <div key={edu.school} className="theme-card p-7 min-h-72 flex flex-col">
              <div className="theme-muted text-sm font-medium">{edu.period}</div>
              <div className="theme-card-title mt-5 text-xl">{edu.school}</div>
              <div className="theme-list-item mt-4 text-sm leading-6">{edu.degree}</div>
              <div className="theme-muted text-sm">{edu.track}</div>
              <div className="theme-accent mt-auto pt-8 text-sm font-medium">{edu.location}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
