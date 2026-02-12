const Experience = () => {
  const experiences = [
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Meta_Platforms_Inc._logo.svg/2560px-Meta_Platforms_Inc._logo.svg.png",
      title: "Software Engineer",
      company: "Meta Platforms",
      team: "Integrity & Youth Protection (Instagram) | Horizon Creator Platform & Monetization",
      period: "Mar 2025 - Present",
      location: "New York, NY",
      highlights: [
        "Built scalable data pipelines in Python leveraging large language models (Llama and Gemini) to automatically identify and label high-risk anonymous accounts, improving detection of bullying and harassment content",
        "Designed and built an Instagram comment filtering system to control content visibility and reduce exposure to bullying and harassment, improving safety signals and enforcement effectiveness",
        "Built core capabilities for the Meta Horizon Creator Portal, enabling creators to generate, list, and monetize digital assets using Generative AI and platform-aligned creation tooling",
        "Designed and launched end-to-end publishing and monetization workflows with cross-surface support across Horizon, Facebook, and Instagram",
        "Led integrity workstreams by architecting scalable systems to detect, review, and enforce policy on user-generated avatar items",
        "Designed and delivered a digital item tiering system with real-time calculation, differentiated UI representation, and scalable backend persistence"
      ],
      tech: ["Python", "Llama", "Gemini", "GraphQL", "React", "PHP (Hack)", "AI/ML Pipelines"]
    },
    {
      logo: "https://logos-world.net/wp-content/uploads/2021/02/Bank-of-America-Logo.png",
      title: "Software Engineer", 
      company: "Bank of America",
      period: "Jul 2021 - Mar 2025",
      location: "Jersey City, NJ",
      highlights: [
        "Developed cloud-based data visualization platforms using Java, Spring Boot, Maven, and JBoss",
        "Implemented 200+ production features across enterprise systems using Java, JavaScript, SQL, and HTML",
        "Led a critical framework upgrade across thousands of files under tight timelines, significantly improving system stability and maintainability",
        "Built internal tooling and Python-based utilities to support platform reliability and technology lifecycle management"
      ],
      tech: ["Java", "Spring Boot", "MySQL", "JavaScript", "Python", "Maven", "JBoss"]
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Ohio_State_Buckeyes_logo.svg/1200px-Ohio_State_Buckeyes_logo.svg.png", 
      title: "Research Assistant",
      company: "The Ohio State University",
      period: "Jan 2020 - May 2021",
      location: "Columbus, OH",
      highlights: [
        "Conducted applied research across aviation, agriculture, and cognitive science domains, developing computer vision and data analysis pipelines using Python and OpenCV",
        "Built end-to-end data collection and visualization tools, including mobile and web-based applications, to support real-world experimentation and analysis",
        "Collaborated with cross-disciplinary researchers to translate research requirements into scalable engineering solutions and production-ready prototypes"
      ],
      tech: ["Python", "OpenCV", "Computer Vision", "Data Analysis", "Mobile Apps"]
    }
  ];

  const education = [
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Columbia_University_Logo.png/1200px-Columbia_University_Logo.png",
      school: "Columbia University",
      degree: "Master of Science in Computer Science",
      track: "Machine Learning Track",
      period: "Sep 2023 - May 2025",
      location: "New York, NY"
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Stanford_University_seal_2003.svg/1200px-Stanford_University_seal_2003.svg.png",
      school: "Stanford University",
      degree: "Artificial Intelligence Graduate Program",
      track: "Non-degree Option",
      period: "Sep 2021 - Mar 2023", 
      location: "Stanford, CA"
    },
    {
      logo: "https://upload.wikimedia.org/wikipedia/en/thumb/e/e1/Ohio_State_Buckeyes_logo.svg/1200px-Ohio_State_Buckeyes_logo.svg.png",
      school: "The Ohio State University", 
      degree: "Bachelor of Science in Computer Science and Engineering",
      track: "Artificial Intelligence",
      period: "Aug 2016 - May 2021",
      location: "Columbus, OH"
    }
  ];

  return (
    <section id="experience" data-section="2" className="min-h-screen bg-white dark:bg-gray-100 py-20 px-6 snap-start">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light text-center mb-16 text-blue-600">
          Professional Experience
        </h2>
        
        {/* Work Experience */}
        <div className="space-y-8 mb-16">
          {experiences.map((exp, index) => (
            <div key={index} className="bg-white border-l-4 border-blue-500 p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 flex-shrink-0">
                  <img src={exp.logo} alt={`${exp.company} logo`} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <div className="text-blue-600 font-bold text-xl">• {exp.title}</div>
                  <div className="text-gray-800 font-semibold text-lg">
                    {exp.company} {exp.team && `• ${exp.team}`}
                  </div>
                  <div className="text-gray-600 mb-4">{exp.period} • {exp.location}</div>
                  
                  <ul className="space-y-2 mb-4">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="text-gray-700 text-sm leading-relaxed">◦ {highlight}</li>
                    ))}
                  </ul>

                  <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
                    <div>// Tech Stack</div>
                    <div>const tools = {JSON.stringify(exp.tech)};</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <h3 className="text-3xl font-light text-center mb-12 text-purple-600">Education</h3>
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="bg-white border-l-4 border-purple-500 p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0">
                  <img src={edu.logo} alt={`${edu.school} logo`} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <div className="text-purple-600 font-bold text-lg">• {edu.degree}</div>
                  <div className="text-gray-800 font-semibold">{edu.school}</div>
                  {edu.track && <div className="text-gray-600">{edu.track}</div>}
                  <div className="text-gray-600">{edu.period} • {edu.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;