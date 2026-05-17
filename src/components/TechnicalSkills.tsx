import SkillsRadarSection from './SkillsRadarSection';

const TechnicalSkills = () => {
  return (
    <section id="skills" data-section="4" className="theme-section min-h-screen flex items-center px-6 py-20 snap-start">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-12 text-center">
          <p className="theme-kicker mb-4">Capability Map</p>
          <h2 className="theme-heading">Technical Skills</h2>
        </div>

        <SkillsRadarSection />
      </div>
    </section>
  );
};

export default TechnicalSkills;
