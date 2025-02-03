import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App'
import router from './router'

import { storePlugin } from 'pinia-plugin-store'
import aesCipher from '@utils/aesCipher'
import { i18n } from '@utils/i18n'
import VueGtm from 'vue-gtm'

import globalPlugin from '@/globalPlugin' // 전역 Plugin 적용
import globalPrototype from '@/globalPrototype' // 전역 Plugin 적용

import { Quasar } from 'quasar'
import quasarUserOptions from './quasar-user-options'
import 'quasar/src/css/index.sass'
import '@quasar/extras/material-icons/material-icons.css'
import 'aos/dist/aos.css'

import '@/assets/css/common.scss'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

import gsap from 'gsap'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { queryClient } from './http/queryClient'
import Aos from 'aos'

const isEncrypt = import.meta.env.VITE_APP_STORAGE_ENCRYPT === 'true' // storage 암호화 처리 여부 (사용: true, 미사용: false)
const paymentClientKey = import.meta.env.VITE_TOSS_PAYMENT_CLIENT_KEY
const brandClientKey = import.meta.env.VITE_TOSS_BRAND_CLIENT_KEY

const pinia = createPinia()
const piniaPlugin = storePlugin({
  stores: [{ name: 'mainStore', ciphertext: isEncrypt }],
  storage: sessionStorage,
  encrypt(val) { return aesCipher.encrypt(val) },
  decrypt(val) { return aesCipher.decrypt(val) }
})
pinia.use(piniaPlugin)

const app = createApp(App)

// 전역 컴포넌트 등록 처리
const components = import.meta.glob('/src/components/**/*.vue', { eager: true })
Object.entries(components).forEach(([path, component]) => {
  // 컴포넌트의 파스칼표기법 이름 가져오기
  const fileName = path.split('/').pop().replace(/\.\w+$/, '')

  // 컴포넌트를 전역적으로 등록
  app.component(fileName, component.default || component)
})

// kakao JS SDK init
window.Kakao.init(import.meta.env.VITE_APP_KAKAO_JOIN_JAVASCRIPT_KEY)

// TossPayments
window.payments = TossPayments(paymentClientKey)
window.brandpay = TossPayments(brandClientKey)

const vueQueryPluginOptions = {
  queryClient
}

app.use(VueGtm, {
  id: 'GTM-5T5HFJR3', // [GTM] Tracking ID
  defer: false,
  enabled: true,
  debug: false,
  vueRouter: router
}
)

app.use(Quasar, quasarUserOptions)
app.use(pinia)
app.use(router)
app.use(i18n)
app.use(globalPlugin)
app.use(globalPrototype)
app.use(VueQueryPlugin, vueQueryPluginOptions)
app.use(gsap)

app.mount('#app')
Aos.init()
// global 사용 정의부
app.config.globalProperties.$i18n = i18n
