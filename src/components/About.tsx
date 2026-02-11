const About = () => {
  return (
    <section id="about" data-section="1" className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 snap-start">
      <div className="max-w-3xl text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-light text-gray-900 dark:text-white">
          About Me
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          I'm a software engineer at Meta working on Instagram's Youth Protection team, 
          building AI systems to detect bullying and harassment. With a background in ML 
          from Columbia and Stanford, I combine technical expertise with a passion for 
          creating safer digital spaces.
        </p>
        <p className="text-base md:text-lg text-gray-500 dark:text-gray-500">
          When not coding, you'll find me capturing moments through photography, 
          exploring NYC with friends, or experimenting with the latest AI tools.
        </p>
      </div>
    </section>
  );
};

export default About;