import { createRouter, createWebHistory } from 'vue-router'
import { checkPlanner, checkCustomer } from '@/utils/common'

import { isLogin } from '@/utils/login'
import Layout from '@/layout/Layout'
import NoFooterLayout from '@/layout/NoFooterLayout'
import NoFooterSimpleNavLayout from '@/layout/NoFooterSimpleNavLayout'
import SimpleNavLayout from '@/layout/SimpleNavLayout'

import alertHelper from '@/utils/alertHelper'
import CertError from '@components/certificate/CertError'
import CertSuccess from '@components/certificate/CertSuccess'
import CardResult from '@components/cardCertificate/CardResult'
import { useMainStore } from '@store/mainStore'

// import menuList from './modules/menuList'
import guide from './modules/guide'
import signup from './modules/signup'
import product from './modules/product'
import cart from './modules/cart'
import mypage from './modules/mypage'
import order from './modules/order'
import autoship from './modules/autoship'
import update from './modules/update'
import footer from './modules/footer'
import customer from './modules/customer'
import migrate from './modules/migrate'
import search from './modules/search'
import diveIn from './modules/diveIn'
import feedback from './modules/feedback'
import about from './modules/about'
import esg from './modules/esg'
import { i18n } from '@utils/i18n'

import { useMypageStore } from '@store/mypageStore'
import { ROLES_BE } from '@/utils/constant'
// import { getToken } from '@/utils/token'

// export const navigationMenus = [
//   ...menuList
// ]

export const routeFile = [
  guide
]

const routes = [
  {
    path: '',
    meta: {
      title: 'NAV_Home'
    },
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        meta: {
          title: 'NAV_Home',
          layoutClass: 'main'
        },
        component: () => import('@views/home/HomePage')
      }
    ]
  },
  {
    path: '/',
    meta: {
      title: 'NAV_Home'
    },
    component: NoFooterLayout,
    children: [
      {
        name: 'Login',
        path: '/login/:userNumber?',
        component: () => import('@views/auth/LoginView'),
        meta: {
          title: 'NAV_Login',
          layoutClass: 'signupMain'
        }
      },
      /* BACKOFFICE 로그인 접속 */
      {
        name: 'BoLogin',
        path: '/boAccess/login',
        component: () => import('@views/auth/LoginView')
      },
      /* RBO 로그인 접속 */
      {
        name: 'rboLogin',
        path: '/ssoLogin',
        component: () => import('@views/auth/LoginView')
      }
    ]
  },
  /* 휴대폰 인증 성공 */
  {
    name: 'CertSuccess/:EncodeData',
    path: '/cert/success',
    component: CertSuccess
  },
  /* 휴대폰 인증 실패 */
  {
    name: 'CertError',
    path: '/cert/error',
    component: CertError
  },
  /* 카드 인증 결과 */
  {
    path: '/cardcert/result',
    name: 'CardCertResult',
    component: CardResult
  },
  {
    component: NoFooterSimpleNavLayout,
    children: [
      {
        path: '/findAccount',
        meta: {
          title: 'NAV_FindAccount'
        },
        component: () => import('@views/findUserInfo/findAccount/FindAccountMain')
      },
      {
        path: '/resetPassword',
        meta: {
          title: 'NAV_ResetPassword'
        },
        component: () => import('@views/findUserInfo/resetPW/ResetPasswordRoot')
      }
    ]
  },
  {
    component: SimpleNavLayout,
    children: [
      {
        path: '/notification/:category',
        meta: {
          title: 'NAV_Notification'
        },
        component: () => import('@views/notification/Notification')
      }
    ]
  },
  {
    name: 'signupNaver',
    path: '/signup/naver/signupResult',
    component: () => import('@views/signup/naver/SignupResult')
  },
  {
    name: 'signupNaverModal',
    path: '/signup/naver/signupNaverModal',
    component: () => import('@views/signup/naver/SignupNaverModal')
  },
  {
    name: 'signupAppleModal',
    path: '/signup/apple/signupAppleModal',
    component: () => import('@views/signup/apple/SignupAppleModal')
  },
  {
    name: 'teaser',
    path: '/teaser',
    component: () => import('@views/home/Teaser')
  },
  {
    path: '/:pathMatch(.*)*', // 모든 잘못된 경로를 처리
    redirect: '/'
  },
  // ...navigationMenus,
  ...signup,
  ...routeFile,
  ...mypage,
  ...order,
  ...product,
  ...update,
  ...cart,
  ...autoship,
  ...footer,
  ...customer,
  ...migrate,
  ...search,
  ...diveIn,
  ...feedback,
  ...about,
  ...esg
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.name === 'ProductList') return false
    return { left: 0, top: 0 }
  }
})

// Before each route evaluates...
router.beforeEach(async (to, from, next) => {
  // [CHJM] 추후 적용 필요
  // if (to.path !== '/login') {
  //   if (await getToken()) {
  //     next()
  //   } else {
  //     next('/guideItem')
  //   }
  // } else {
  //   next('/guideItem')
  // }

  if (to.name === 'Login' && isLogin()) {
    // 로그인 페이지 진입
    if (to?.query?.redirect) {
      // redirect 페이지 이동
      next({ path: to?.query?.redirect })
    } else {
      // 로그인 했을 경우 로그인 페이지 진입 방지
      next({ name: 'Home' })
    }
  }

  if (to.meta.requiresAuth && !isLogin()) {
    // 로그인 필요 페이지 진입
    alertHelper.show('confirm', i18n.global.t('CM_UseAferLogin'), {
      title: i18n.global.t('CM_RecommLogin'),
      ok: function () {
        router.push({ path: '/login', query: { redirect: to.fullPath } })
      },
      cancel: function () {
        router.push('/')
      },
      okLabel: i18n.global.t('CM_MovePage'),
      cancelLabel: i18n.global.t('CM_No')
    })
    next(false)
  }

  if (to.meta.requiresPlanner) {
    // 플래너 등급만 사용 가능
    if (checkPlanner()) {
      next()
    } else {
      alertHelper.show('alert', i18n.global.t('ALT_PlannerOnly'), {
        ok: function () {
          router.push({ path: '/' })
        }
      })
      next(false)
    }
  }

  if (to.meta.requiresCustomer) {
    // 커스터머 등급만 사용 가능
    if (checkCustomer()) {
      next()
    } else if (useMainStore().getUser.userType === ROLES_BE.no_referral_consumer) {
      // 추천인 없는 소비자
      alertHelper.show('alert', i18n.global.t('ALT_RejectRefCustomer'))
      next(false)
    } else {
      alertHelper.show('alert', i18n.global.t('ALT_CustomerOnly'), {
        ok: function () {
          router.push({ path: '/' })
        }
      })
      next(false)
    }
  }

  if (to.meta.requiresPassword) {
    // 개인정보 수정 > 비밀번호 확인 여부 체크
    const isCheckPassword = useMypageStore().isCheckPassword

    if (isCheckPassword) {
      next()
    } else {
      router.push({ path: '/mypage/checkPassword', query: { redirect: to.fullPath } })
    }
  }

  next()
})

// Before resolve route evaluates...
// setupBeforeResolve(router)

// When each route is finished evaluating...
export function setupAfterEach(router) {
  router.afterEach(() => {})
}

export default router
