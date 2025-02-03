/**
 * name: i18n-setup.js
 * description: 다국어 설정
 * create by chjm (2022-04-20)
 */

import { createI18n } from 'vue-i18n'
import { localDataManager, DATA_LANG } from '@utils/dataManager'

export const locale = 'ko-KR' // default 설정값
export const locales = ['ko-KR', 'en-US', 'zh-TW']

export const i18n = createI18n({
  legacy: false, // you must set `false`, to use Composition API
  locale: locale, // set locale
  fallbackLocale: 'en-US',
  globalInjection: true
})

const loadedLanguages = []

// 다국어 적용
export async function loadLocale() {
  const lang = localDataManager.get(DATA_LANG)
  if (lang && locales.includes(lang)) {
    await loadMessage(lang)
  } else {
    await loadMessage(locale)
  }
}

// 다국어 변경
export function changeLocale(lang) {
  loadMessage(lang)
}

// i18n 설정
function setI18n(lang) {
  i18n.global.locale = lang
  localDataManager.set(DATA_LANG, lang)
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

// 다국어 파일 로딩
export function loadMessage(lang) {
  if (i18n.locale !== lang || loadedLanguages.length === 0) {
    if (!loadedLanguages.includes(lang)) {
      return import(`../assets/lang/${lang}/index.js`).then(
        (msgs) => {
          i18n.global.setLocaleMessage(lang, msgs.default)
          loadedLanguages.push(lang)
          return setI18n(lang)
        }
      )
    }
    return Promise.resolve(setI18n(lang))
  }
  return Promise.resolve(lang)
}

export function getLocale() {
  return localDataManager.get(DATA_LANG) ?? 'ko-KR'
  // return i18n.locale
}

/** 이미지 위치 조회 (다국어) **/
export function getLocaleImagePath(val) {
  return require('@images/' + i18n.locale + '/' + val)
}
