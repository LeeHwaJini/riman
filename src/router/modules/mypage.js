import middlewareConversionToPlanner from '@/middleware/conversionToPlanner'
import Layout from '@/layout/Layout'
import SimpleNavLayout from '@/layout/SimpleNavLayout'
import NoFooterSimpleNavLayout from '@/layout/NoFooterSimpleNavLayout'
import NoFooterLayout from '@/layout/NoFooterLayout'

const mypageLayout = {
  path: '/mypage',
  component: Layout,
  children: [
    {
      path: '/mypage',
      name: 'MyPageMain',
      meta: {
        requiresAuth: true,
        layoutClass: 'mypageLayout'

      },
      component: () =>
        import('@views/mypage/Mypage')
    }
  ]
}

const mypageNoFooterSimpleNavLayout = {
  path: '/mypage',
  component: NoFooterSimpleNavLayout,
  children: [
    {
      path: 'changePassWord',
      name: 'ChangePassword',
      meta: {
        title: 'MUI_ChangePassword'
      },
      component: () =>
        import('@views/mypage/ChangePassword.vue')
    },
    {
      path: 'conversionToPlanner/certificate',
      name: 'ConversionCertificate',
      meta: {
        title: 'MCC_Title',
        requiresCustomer: true
      },
      component: () =>
        import('@views/mypage/conversionToPlanner/ConversionCertificate.vue')
    },
    {
      path: 'conversionToPlanner/enterInformation',
      name: 'ConversionEnterInformation',
      meta: {
        title: 'MCC_Title',
        requiresCustomer: true
      },
      beforeEnter: middlewareConversionToPlanner,
      component: () =>
        import('@views/mypage/conversionToPlanner/ConversionEnterInformation.vue')
    },
    {
      path: 'conversionToPlanner/agreeTerms',
      name: 'ConversionAgreeTerms',
      meta: {
        title: 'MCC_Title',
        requiresCustomer: true
      },
      beforeEnter: middlewareConversionToPlanner,
      component: () =>
        import('@views/mypage/conversionToPlanner/ConversionAgreeTerms.vue')
    },
    {
      path: '/mypage/checkPlannerDocument',
      name: 'CheckPlannerDocument',
      meta: {
        title: 'NAV_CheckPlannerDocumet',
        requiresAuth: true
      },
      component: () =>
        import('@views/mypage/CheckPlannerDocument.vue')
    },
    {
      path: 'allowanceInfo',
      name: 'AllowanceInfo',
      meta: {
        title: 'NAV_AllowancePayment',
        requiresAuth: true
      },
      component: () =>
        import('@views/mypage/AllowanceInfo.vue')
    },
    {
      path: 'checkPassword',
      name: 'CheckPassword',
      meta: {
        title: 'CPW_checkPassword'
      },
      component: () =>
        import('@views/mypage/CheckPassword.vue')
    },
    {
      path: 'userInfo',
      name: 'UserInfo',
      meta: {
        title: 'MY_ManageUserInfo',
        requiresPassword: true
      },
      component: () =>
        import('@views/mypage/UserInfo.vue')
    },
    {
      path: 'sns',
      name: 'Sns',
      meta: {
        title: 'MY_ManageUserInfo',
        requiresPassword: true
      },
      component: () =>
        import('@views/mypage/Sns.vue')
    },
    {
      path: 'refundAccount',
      name: 'RefundAccount',
      meta: {
        title: 'MY_ManageUserInfo',
        requiresPassword: true
      },
      component: () =>
        import('@views/mypage/RefundAccount.vue')
    },
    {
      path: 'withdrawal',
      name: 'Withdrawal',
      meta: {
        title: 'MUI_WithdrawlMember',
        requiresPassword: true
      },
      component: () =>
        import('@views/mypage/withdrawal/WithdrawalRoot.vue')
    },
    {
      path: 'autoshipCard',
      name: 'autoshipCard',
      component: () => import('@views/mypage/card/AutoshipCard.vue')
    },
    {
      path: 'coupon',
      name: 'coupon',
      component: () => import('@views/mypage/coupon/CouponView.vue'),
      meta: {
        requiresAuth: true,
        title: 'CM_Coupon'
      }
    },
    {
      path: 'point',
      name: 'point',
      component: () => import('@views/mypage/point/PointView.vue'),
      meta: {
        requiresAuth: true,
        title: 'OP_Point'
      }
    }
  ]
}

const mypageSimpleNavLayout = {
  path: '/mypage',
  component: SimpleNavLayout,
  children: [
    {
      name: 'OrderList',
      path: '/mypage/orderList',
      meta: {
        title: 'NAV_OrderList'
      },
      component: () => import('@views/mypage/order/OrderList')
    },
    {
      name: 'orderDetail',
      path: '/mypage/orderDetail',
      meta: {
        title: 'NAV_OrderDetail'
      },
      component: () => import('@views/mypage/order/OrderDetail')
    },
    {
      name: 'ReturnList',
      path: '/mypage/returnList',
      meta: {
        title: 'NAV_ReturnList'
      },
      component: () => import('@views/mypage/return/ReturnList')
    },
    {
      name: 'ReturnDetail',
      path: '/mypage/returnDetail',
      meta: {
        title: 'NAV_ReturnDetail'
      },
      component: () => import('@views/mypage/return/ReturnDetail')
    }
  ]
}

const mypageNoFooter = {
  path: '/mypage',
  component: NoFooterLayout,
  children: [
    {
      name: 'ConversionComplete',
      path: 'conversionToPlanner/complete',
      meta: {
        requiresCustomer: true
      },
      beforeEnter: middlewareConversionToPlanner,
      component: () => import('@views/mypage/conversionToPlanner/ConversionComplete.vue')
    }
  ]
}

const plannerPage = {
  path: '/mypage',
  component: NoFooterSimpleNavLayout,
  meta: {
    requiresPlanner: true
  },
  children: [
    {
      path: '/mypage/personalMall',
      component: () => import('@views/mypage/PersonalMall'),
      meta: {
        isToggleTranslate: true,
        title: 'PM_ManagePersonalMall'
      }
    }, {
      path: '/mypage/easybag',
      component: () => import('@views/mypage/easybag/EasyBagList'),
      meta: {
        title: 'NAV_EasyBag'
      }
    },
    {
      path: '/mypage/easybag/:bagId',
      component: () => import('@views/mypage/easybag/EasyBagDetail'),
      meta: {
        title: 'NAV_EasyBagDetail'
      }
    },
    {
      path: '/mypage/easybag/add/1',
      component: () => import('@views/mypage/easybag/AddEasyBag1'),
      meta: {
        title: 'NAV_EasyBagStep1'
      }
    },
    {
      path: '/mypage/easybag/add/2',
      component: () => import('@views/mypage/easybag/AddEasyBag2'),
      meta: {
        title: 'NAV_EasyBagStep2'
      }
    },
    {
      path: '/mypage/easybag/add/3',
      component: () => import('@views/mypage/easybag/AddEasyBag3'),
      meta: {
        title: 'NAV_EasyBagStep3'
      }
    }]
}

const requestReturn = {
  path: '/return',
  component: NoFooterSimpleNavLayout,
  children: [
    {
      path: '/return/step1/:salesOrderId',
      component: () => import('@views/mypage/return/RequestReturnStep1'),
      meta: {
        title: 'NAV_RequestReturn'
      }
    },
    {
      path: '/return/step2/:salesOrderId',
      component: () => import('@views/mypage/return/RequestReturnStep2'),
      meta: {
        title: 'NAV_RequestReturn'
      }
    },
    {
      path: '/return/step3/:salesOrderId',
      component: () => import('@views/mypage/return/RequestReturnStep3'),
      meta: {
        title: 'NAV_RequestReturn'
      }
    }
  ]
}

export default [mypageLayout, mypageNoFooterSimpleNavLayout, mypageSimpleNavLayout, mypageNoFooter, plannerPage, requestReturn]
