import i18n, {LanguageDetectorAsyncModule} from 'i18next';
import {initReactI18next} from 'react-i18next';

import * as RNLocalize from 'react-native-localize';
import LANGUAGES, {LanguageCode, resources} from './localeHelper';

const LANG_CODES = Object.keys(LANGUAGES) as LanguageCode[];

const LANGUAGE_DETECTOR: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    const tag = RNLocalize.findBestLanguageTag(LANG_CODES);
    // AsyncStorage.getItem('user-language', (err, language) => {
    //   if (err || !language) {
    //     if (err) {
    //       console.log('Error fetching Languages from asyncstorage ', err);
    //     } else {
    //       console.log('No language is set, choosing English as fallback');
    //     }
    //     const findBestAvailableLanguage =
    //       RNLocalize.findBestAvailableLanguage(LANG_CODES);
    //     callback(findBestAvailableLanguage?.languageTag || 'en');
    //     return;
    //   }
    //   callback(language);
    // });
    callback(tag?.languageTag);
  },
  init: () => {},
  cacheUserLanguage: _language => {
    // AsyncStorage.setItem('user-language', language);
  },
};

i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
  });

export default i18n;
