const routeItem = [
  {
    path: '/',
    meta: {
      title: 'Guide'
    },
    component: () => import('@layout/Layout'),
    children: [
      {
        path: '/guide',
        name: 'NAV_Guide',
        meta: {
          title: 'NAV_Guide'
        },
        component: () => import('@views/guide/GuideView')
      },
      {
        path: '/guideItem',
        name: 'NAV_Guide',
        meta: {
          title: 'NAV_Guide'
        },
        component: () => import('@views/guide/GuideItem')
      }
    ]
  }
]

export default routeItem
