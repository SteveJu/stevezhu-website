'use client';

import { useState } from 'react';

const LanguageToggle = () => {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'zh' : 'en';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
    // For now, just a visual toggle - full i18n would require more setup
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
    >
      {language === 'en' ? '中文' : 'EN'}
    </button>
  );
};

export default LanguageToggle;