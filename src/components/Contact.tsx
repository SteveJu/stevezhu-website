const Contact = () => {
  return (
    <section id="contact" data-section="4" className="theme-section min-h-screen flex items-center justify-center px-6 py-20 snap-start">
      <div className="max-w-4xl w-full text-center space-y-12">
        <p className="theme-kicker">Transmit Signal</p>
        <h2 className="theme-heading">
          Get In Touch
        </h2>
        
        <p className="theme-copy text-lg max-w-2xl mx-auto">
          I&apos;m always open to discussing new opportunities, collaborations,
          or just having a conversation about technology and photography.
        </p>

        <div className="flex justify-center mb-8">
          <a
            href="/Zhengqi_Zhu_Resume.pdf"
            download="Zhengqi_Zhu_Resume.pdf"
            className="theme-button"
          >
            <span>Download Resume</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="theme-card group p-8 transition-colors duration-200">
            <div className="theme-card-title text-xl mb-2">Email</div>
            <a 
              href="mailto:steveju546@gmail.com"
              className="theme-copy transition-colors duration-200"
            >
              steveju546@gmail.com
            </a>
          </div>

          <div className="theme-card group p-8 transition-colors duration-200">
            <div className="theme-card-title text-xl mb-2">LinkedIn</div>
            <a 
              href="https://linkedin.com/in/zhengqi-zhu-967714139"
              target="_blank"
              rel="noopener noreferrer"
              className="theme-copy transition-colors duration-200"
            >
              zhengqi-zhu
            </a>
          </div>

          <div className="theme-card group p-8 transition-colors duration-200">
            <div className="theme-card-title text-xl mb-2">GitHub</div>
            <a 
              href="https://github.com/SteveJu"
              target="_blank"
              rel="noopener noreferrer"
              className="theme-copy transition-colors duration-200"
            >
              SteveJu
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
