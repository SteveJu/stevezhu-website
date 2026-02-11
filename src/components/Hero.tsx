'use client';

const Hero = () => {
  return (
    <section data-section="0" className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-gray-900 dark:text-white snap-start">
      <div className="text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-light tracking-tight">
          Steve Zhu
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
          Software Engineer • AI Enthusiast • Photographer
        </p>
        
        {/* Quick Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mt-8">
          {[
            { name: 'About Me', section: 1, icon: '👋' },
            { name: 'Experience', section: 2, icon: '💼' },
            { name: 'Photography', section: 3, icon: '📸' },
            { name: 'Contact', section: 4, icon: '💬' }
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => {
                const section = document.querySelector(`[data-section="${item.section}"]`);
                if (section) {
                  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              className="group flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-full hover:border-gray-900 dark:hover:border-white transition-all duration-200"
            >
              <span className="group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;