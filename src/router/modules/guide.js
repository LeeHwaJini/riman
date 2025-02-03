const routeItem = {
  name: 'Guide',
  path: '/guide',
  meta: {
    title: 'NAV_Guide',
    icon: 'icon_menu_etc.svg',
    isHeader: false,
    isFooter: false
  },
  children: [
    {
      path: '/guide',
      component: () => import('@views/guide/GuideView'),
      meta: {
        title: 'NAV_Guide'
      }
    },
    {
      path: '/guideItem',
      component: () => import('@views/guide/GuideItem'),
      meta: {
        title: 'NAV_Guide'
      }
    },
    {
      path: '/sample',
      component: () => import('@views/guide/SampleView'),
      meta: {
        title: 'Sample Page'
      }
    }
  ]

}

export default routeItem
