import i18n from 'i18n-js';
import memoize from 'lodash.memoize';
import { I18nManager } from 'react-native';
import * as RNLocalize from 'react-native-localize';

import EN from './en.json';
import FR from './fr.json';

const translationGetters = {
  en: () => EN,
  fr: () => FR,
};

export const translate = memoize(
  (key, config) => i18n.t(key, config),
  (key, config) => (config ? key + JSON.stringify(config) : key),
);

export const setI18nConfig = () => {
  // fallback if no available language fits
  const fallback = { languageTag: 'fr', isRTL: false };
  const keys = Object.keys(translationGetters);
  const { languageTag, isRTL } = RNLocalize.findBestAvailableLanguage(keys) || fallback;

  // clear translation cache
  translate.cache.clear();
  // update layout direction
  I18nManager.forceRTL(isRTL);
  // set i18n-js config
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
};
