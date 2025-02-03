import middlewareSignup from '@/middleware/signup'
import NoFooterLayout from '@/layout/NoFooterLayout'
import NoFooterSimpleNavLayout from '@/layout/NoFooterSimpleNavLayout'

const headerSignup = {
  path: '/signup',
  component: NoFooterLayout,
  children: [
    {
      name: 'SelectType',
      path: 'selectType',
      meta: {
        layoutClass: 'signupMain'
      },
      component: () => import('@views/signup/SelectType')
    },
    {
      name: 'SignupComplete',
      path: 'complete',
      meta: {
        layoutClass: 'signupComplete'
      },
      beforeEnter: middlewareSignup,
      component: () => import('@views/signup/SignupComplete')
    }
  ]
}

const naviSignup = {
  path: '/signup',
  meta: {
    closePage: 'SelectType',
    isShowNavCloseBtn: true
  },
  component: NoFooterSimpleNavLayout,
  children: [
    {
      path: 'selectReferrer',
      name: 'SelectReferrer',
      meta: {
        title: 'NAV_SignUp',
        backPage: 'SelectType'
      },
      beforeEnter: middlewareSignup,
      component: () => import('@views/signup/SelectReferrer')
    },
    {
      path: 'enterInformation',
      name: 'EnterInformation',
      meta: {
        title: 'NAV_SignUp'
      },
      // beforeEnter: middlewareSignup,
      component: () => import('@views/signup/EnterInformation')
    },
    {
      path: 'agreeTerms',
      name: 'AgreeTerms',
      meta: {
        title: 'NAV_SignUp'
      },
      beforeEnter: middlewareSignup,
      component: () => import('@views/signup/AgreeTerms')
    },
    {
      path: '/signupReject/:uuid',
      name: 'SignupReject',
      meta: {
        title: 'NAV_SignupReject'
      },
      component: () => import('@views/signup/SignupReject')
    }
  ]
}

export default [headerSignup, naviSignup]
