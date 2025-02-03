import NoFooterSimpleNavLayout from '@/layout/NoFooterSimpleNavLayout'
import ContentLayout from '@/layout/ContentLayout'
import NoFooterLayout from '@/layout/NoFooterLayout'

const order = {
  path: '/order',
  component: NoFooterSimpleNavLayout,
  children: [
    {
      name: 'OrderPayment',
      path: '',
      meta: {
        title: 'OP_Order'
      },
      component: () => import('@views/order/Payment')
    },
    {
      name: 'NonuserOrderPayment',
      path: '/order/guest',
      component: () => import('@views/order/NonUserPayment'),
      meta: {
        title: 'NAV_NonUserOrder',
        backPage: 'CartList'
      }
    },
    {
      name: 'NonUserPaymentInfo',
      path: '/order/nonuser/info',
      component: () => import('@views/order/NonUserPaymentInfo'),
      meta: {
        title: 'NAV_NonUserOrder'
      }
    }
  ]
}

const order1 = {
  path: '/order',
  component: NoFooterLayout,
  children: [
    {
      name: 'OrderPaymentSuccess',
      path: '/order/success',
      component: () => import('@views/order/PaymentSuccess'),
      meta: {
        title: 'NAV_OrderComplete',
        layoutClass: 'signupMain'
      }
    },
    {
      name: 'OrderGuestPaymentSuccess',
      path: '/order/guest/success',
      component: () => import('@views/order/PaymentGuestSuccess'),
      meta: {
        title: 'NAV_OrderComplete',
        layoutClass: 'signupMain'
      }
    }
  ]
}

const easyBagOrder = {
  component: ContentLayout,
  children: [{
    path: '/beauty-planner',
    component: () => import('@views/order/EasyBagOrder'),
    meta: {
      title: 'NAV_EasyBagOrder'
    }
  }]
}

export default [order, order1, easyBagOrder]
