import {en, es} from './locales';

export type Resources = {
  [K in LanguageCode]: {translation: {[key in string]: string}};
};

const LANGUAGES = {
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de',
  it: 'it',
  pt: 'pt',
  ru: 'ru',
  zh: 'zh',
  ja: 'ja',
  ko: 'ko',
  ar: 'ar',
  hi: 'hi',
  tr: 'tr',
  nl: 'nl',
  pl: 'pl',
  sv: 'sv',
  da: 'da',
  fi: 'fi',
  no: 'no',
  el: 'el',
  he: 'he',
};

export const resources: Partial<Resources> = {
  en: {
    translation: en,
  },
  es: {
    translation: es,
  },
};

export type LanguageCode = keyof typeof LANGUAGES;
export default LANGUAGES;
