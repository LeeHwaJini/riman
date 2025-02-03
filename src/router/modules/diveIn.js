import NoFooterNavLayout from '@/layout/NoFooterNavLayout.vue'
import SubLayout from '@/layout/SubLayout.vue'

const subLayoutDivein = {
  path: '/diveIn',
  component: SubLayout,
  children: [
    {
      name: 'DiveInList',
      path: '',
      meta: {
        title: 'Dive In'
      },
      component: () => import('@views/diveIn/DiveInListView')
    }
  ]
}
const noFooterNavLayoutDivein = {
  path: '/diveIn',
  component: NoFooterNavLayout,
  children: [
    {
      name: 'DiveInDetail',
      path: ':userNumber',
      meta: {
        title: 'Dive In'
      },
      component: () => import('@views/diveIn/DiveInView')
    }
  ]
}
export default [subLayoutDivein, noFooterNavLayoutDivein]
