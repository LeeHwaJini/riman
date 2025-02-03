import NavLayout from '@/layout/NavLayout'
import NoFooterNavLayout from '@/layout/NoFooterNavLayout'

const list = {
  path: '/update',
  component: NavLayout,
  children: [
    {
      path: '/update',
      component: () => import('@views/update/UpdateList'),
      meta: {
        title: 'NAV_NoticeAndEvent'
      }
    },
    {
      path: '/update/notice',
      component: () => import('@views/update/NoticeList'),
      meta: {
        title: 'NAV_Notice'
      }
    },
    {
      path: '/update/event',
      component: () => import('@views/update/EventList'),
      meta: {
        title: 'NAV_Event'
      }
    },
    {
      path: '/update/news',
      component: () => import('@views/update/NewsList'),
      meta: {
        title: 'NAV_News'
      }
    }
  ]
}

const detail = {
  path: '/update',
  component: NoFooterNavLayout,
  children: [
    {
      path: '/update/notice/:eventId',
      component: () => import('@views/update/NoticeDetail'),
      meta: {
        title: 'NAV_Notice'
      }
    },
    {
      path: '/update/event/:eventId',
      component: () => import('@views/update/EventDetail'),
      meta: {
        title: 'NAV_Event'
      }
    },
    {
      path: '/update/news/:eventId',
      component: () => import('@views/update/NewsDetail'),
      meta: {
        title: 'NAV_News'
      }
    }
  ]
}

export default [list, detail]

