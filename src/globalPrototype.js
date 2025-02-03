/**
 * 자주 사용하는 함수를 전역으로 등록
 * create by chjm (2022-07-29)
 */
import format from '@/utils/format'
import { isLogin } from '@/utils/login'
import { getLocaleImagePath } from '@/utils/i18n'
import { metaInfo, ogMetaInfo } from '@/utils/meta'

export default {
  install(Vue) {
    Vue.config.globalProperties.$moneyFormat = format.money
    Vue.config.globalProperties.$displayMaxNumber = format.displayMaxNumber
    Vue.config.globalProperties.$eventDateFormat = format.eventDateFormat
    Vue.config.globalProperties.$addressFormat = format.addressFormat
    Vue.config.globalProperties.$addressFormat01 = format.addressFormat01
    Vue.config.globalProperties.$nameFormat = format.nameFormat
    Vue.config.globalProperties.$isLogin = isLogin
    Vue.config.globalProperties.$getLocaleImage = getLocaleImagePath
    Vue.config.globalProperties.$metaInfo = metaInfo
    Vue.config.globalProperties.$ogMetaInfo = ogMetaInfo
  }
}
