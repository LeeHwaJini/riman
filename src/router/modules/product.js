import Layout from '@/layout/Layout'
import NoFooterSubLayout from '@/layout/NoFooterSubLayout'

const layoutProduct = {
  path: '/product',
  component: Layout,
  children: [
    {
      name: 'ProductList',
      path: ':categoryName',
      component: () => import('@views/product/ProductListView')
    }
  ]
}

const SubLayoutProduct = {
  path: '/product',
  component: NoFooterSubLayout,
  children: [
    {
      name: 'ProductDetail',
      path: 'detail/:productId',
      component: () =>
        import('@views/product/ProductDetailView')
    }
  ]
}

export default [layoutProduct, SubLayoutProduct]
