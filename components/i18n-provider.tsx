'use client';

import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/client';
import { LanguageProvider } from './language-provider';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageProvider>
        {children}
      </LanguageProvider>
    </I18nextProvider>
  );
}
