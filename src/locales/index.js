import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import React from 'react';
import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';

// Code sourced from online tutorial
// URL: https://medium.com/better-programming/creating-a-multi-language-app-in-react-native-9828b138c274

const translationGetters = {
  en: () => require('./en.json'),
  fr: () => require('./fr.json'),
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = {languageTag: 'fr', isRTL: false};

  const {languageTag, isRTL} =
    RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
    fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = {[languageTag]: translationGetters[languageTag]()};
  i18n.locale = languageTag;
};

// export function getLanguage() {
//   try {
//     const choice = Localization.locale;
//     I18n.locale = choice.substr(0, 2);
//     I18n.initAsync();
//   } catch (err) {
//     console.log('Error during get langauge: ' + err);
//   }
// }

// export function t(name) {
//   return I18n.t(name);
// }
