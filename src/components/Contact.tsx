const Contact = () => {
  return (
    <section id="contact" data-section="4" className="min-h-screen bg-white dark:bg-black flex items-center justify-center px-6 snap-start">
      <div className="max-w-4xl w-full text-center space-y-12">
        <h2 className="text-5xl md:text-6xl font-light text-gray-900 dark:text-white">
          Get In Touch
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          I'm always open to discussing new opportunities, collaborations, 
          or just having a conversation about technology and photography.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {/* Email */}
          <div className="group p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-200">
            <div className="text-2xl mb-4">📧</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">Email</h3>
            <a 
              href="mailto:steveju546@gmail.com"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              steveju546@gmail.com
            </a>
          </div>

          {/* LinkedIn */}
          <div className="group p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-200">
            <div className="text-2xl mb-4">💼</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">LinkedIn</h3>
            <a 
              href="https://linkedin.com/in/zhengqi-zhu-967714139"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              zhengqi-zhu
            </a>
          </div>

          {/* GitHub */}
          <div className="group p-8 border border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-600 transition-colors duration-200">
            <div className="text-2xl mb-4">🚀</div>
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">GitHub</h3>
            <a 
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
            >
              stevezhu
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;