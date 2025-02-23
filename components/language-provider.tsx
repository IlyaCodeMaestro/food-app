'use client';

import { useEffect } from 'react';
import i18n from '@/i18n/client';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Get saved language from localStorage or use default (kk)
    const savedLanguage = localStorage.getItem('language') || 'kk';
    
    // Set the language
    i18n.changeLanguage(savedLanguage);

    // Save language preference when it changes
    i18n.on('languageChanged', (lng) => {
      localStorage.setItem('language', lng);
    });

    return () => {
      i18n.off('languageChanged');
    };
  }, []);

  return <>{children}</>;
}
