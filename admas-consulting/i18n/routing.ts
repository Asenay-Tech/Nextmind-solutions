import { locales } from '../i18n';

export const routing = {
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en' as const,

  // Always use locale prefix in URL
  localePrefix: 'always' as const
};

