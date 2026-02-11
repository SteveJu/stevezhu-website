const Experience = () => {
  const experiences = [
    {
      logo: "🔵", // Meta placeholder
      title: "Software Engineer",
      company: "Meta Platforms",
      team: "Instagram Youth Protection",
      period: "Mar 2025 - Present",
      location: "New York, NY",
      highlights: [
        "Built core capabilities for the Meta Horizon Creator Portal, enabling creators to generate, list, and monetize digital assets using Generative AI",
        "Designed and launched end-to-end publishing and monetization workflows with cross-surface support across Horizon, Facebook, and Instagram",
        "Led integrity workstreams by architecting scalable systems to detect, review, and enforce policy on user-generated avatar items",
        "Built AI data pipeline with Llama4/Gemini to predict problematic anonymous school accounts for bully & harassment detection"
      ],
      tech: ["Llama4", "Gemini", "Python", "GraphQL", "React", "AI Pipeline"]
    },
    {
      logo: "🏦", // BofA placeholder
      title: "Software Engineer", 
      company: "Bank of America",
      period: "Jul 2021 - Mar 2025",
      location: "Jersey City, NJ",
      highlights: [
        "Developed a cloud-based data visualization dashboard using Spring Framework, Spring Boot, Maven and JBoss",
        "Implemented 200+ pivotal features and pages using Java, JavaScript, SQL, and HTML",
        "Earned recognition for completing a major framework update, modifying thousands of files in one week",
        "Created and modified database views and tables in MySQL to optimize data storage and retrieval",
        "Developed Python plugins for managing bank's technology stack such as status of security patches"
      ],
      tech: ["Java", "Spring Boot", "MySQL", "JavaScript", "Python", "Maven"]
    }
  ];

  const education = [
    {
      logo: "🎓", // Columbia
      school: "Columbia University",
      degree: "Master of Science in Computer Science",
      track: "Machine Learning Track",
      period: "Sept 2023 - May 2025",
      location: "New York, NY"
    },
    {
      logo: "🌲", // Stanford  
      school: "Stanford University",
      degree: "Artificial Intelligence Graduate Program",
      track: "Non-degree Option",
      period: "Sept 2021 - Mar 2023", 
      location: "Stanford, CA"
    },
    {
      logo: "🌰", // OSU
      school: "The Ohio State University", 
      degree: "Bachelor of Science in Computer Science and Engineering",
      track: "Specialized in Artificial Intelligence",
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
                <div className="text-4xl">{exp.logo}</div>
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
                <div className="text-3xl">{edu.logo}</div>
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