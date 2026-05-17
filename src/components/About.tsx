const About = () => {
  return (
    <section id="about" data-section="1" className="theme-section min-h-screen flex items-center px-6 py-20 snap-start">
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[0.8fr_1.2fr] items-center">
        <div>
          <p className="theme-kicker mb-5">Profile</p>
          <h2 className="theme-heading">
            Engineering rigor with a visual memory.
          </h2>
        </div>

        <div className="theme-card p-7 md:p-9">
          <p className="theme-copy text-lg md:text-xl leading-relaxed">
            I&apos;m a software engineer at Meta working on Instagram&apos;s Youth Protection team,
            building AI systems to detect bullying and harassment. With a background in ML
            from Columbia and Stanford, I combine technical depth with a focus on safer digital spaces.
          </p>
          <p className="theme-copy mt-6 text-base md:text-lg leading-relaxed">
            Outside of code, I spend time photographing people, cities, and the small unscripted moments
            that make a technical life feel less mechanical.
          </p>

          <div className="theme-mini-grid mt-8">
            <div><strong>Meta</strong><span>Instagram integrity</span></div>
            <div><strong>Columbia</strong><span>ML track</span></div>
            <div><strong>NYC</strong><span>Photography base</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
