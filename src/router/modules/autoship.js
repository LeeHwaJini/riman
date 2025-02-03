import NoFooterSimpleNavLayout from '@/layout/NoFooterSimpleNavLayout'
import BillingFail from '@components/billing/BillingFail'
import BillingSuccess from '@components/billing/BillingSuccess'

const autoship = {
  path: '/autoship',
  meta: {
    requiresAuth: true
  },
  component: NoFooterSimpleNavLayout,
  children: [
    {
      name: 'AutoshipListView',
      path: '',
      component: () => import('@views/autoship/AutoshipView')
    },
    {
      name: 'AutoshipInitView',
      path: 'init',
      component: () => import('@views/autoship/AutoshipInitView'),
      meta: {
      }
    },
    {
      name: 'AutoshipPayResult',
      path: 'paymentResult/:salesOrderId',
      component: () => import('@views/autoship/AutoshipPayResult'),
      meta: {
      }
    },
    /* 카드 등록 인증 성공 */
    {
      name: 'BillingSuccess',
      path: '/billing/success',
      component: BillingSuccess
    },
    /* 카드 등록 인증 실패 */
    {
      name: 'BillingFail',
      path: '/billing/fail',
      component: BillingFail
    }
  ]
}
export default [autoship]
