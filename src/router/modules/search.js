import Layout from '@/layout/Layout'

const autoship = {
  path: '/search',
  component: Layout,
  children: [
    {
      name: 'Search',
      path: '',
      component: () => import('@views/search/SearchView')
    }
  ]
}

export default [autoship]
