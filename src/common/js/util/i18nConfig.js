import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { webStorage, } from '@yh/ta-utils'

Vue.use(VueI18n)

function loadLocaleMessages (locales) {
  const messages = {}
  const commonLocales = require.context('common/locales/common', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      if (commonLocales.keys().indexOf(key) >= 0) {
        messages[locale] = commonLocales(key)
      }
      messages[locale] = {
        ...messages[locale],
        ...locales(key),
      }
    }
  })
  return messages
}

const i18nFunc = (locales) => {
  const localeStorage = webStorage.createWebStorage(process.env.VUE_APP_LOCALE_STORAGE_KEY, { isLocal: true, })
  // 添加localStorage的storage事件监听
  // window.addEventListener('storage', (e) => {
  //   if (e.key === 'locale') {
  //     i18n.locale = e.newValue
  //   }
  // })
  return new VueI18n({
    locale: localeStorage.get('locale') ?? process.env.VUE_APP_I18N_LOCALE,
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE,
    messages: loadLocaleMessages(locales),
    silentTranslationWarn: true,
  })
}

const i18nMixins = {
  created () {
    window.pageVmObj = this
  },
}
export {
  i18nFunc,
  i18nMixins,
}
