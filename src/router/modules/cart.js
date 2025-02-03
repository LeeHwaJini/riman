import NoFooterSimpleNavLayout from '@/layout/NoFooterSimpleNavLayout'

const cart = {
  path: '/cart',
  component: NoFooterSimpleNavLayout,
  children: [
    {
      name: 'CartList',
      path: '',
      component: () => import('@views/cart/CartListView'),
      meta: {
        title: 'NAV_Cart'
      }
    }
  ]
}
export default [cart]
