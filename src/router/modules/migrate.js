import NoFooterSimpleNavLayout from '@/layout/NoFooterSimpleNavLayout'
import NoFooterLayout from '@/layout/NoFooterLayout'

const routes = [
  {
    path: '/migrate',
    component: NoFooterSimpleNavLayout,
    children: [
      {
        path: '',
        name: 'MigrateMain',
        meta: { title: 'NAV_Migrate' },
        component: () => import('@views/migrate/MigrateMain')
      }
    ]
  },
  {
    path: '/migrate',
    component: NoFooterLayout,
    children: [
      {
        path: 'complete',
        name: 'MigrateComplete',
        component: () => import('@views/migrate/MigrateComplete')
      }
    ]
  }
]

export default routes
