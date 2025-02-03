import NoFooterSimpleNavLayout from '@/layout/NoFooterSimpleNavLayout.vue'

const custormerNoFooterSimpleNavLayout = {
  path: '/feedback',
  component: NoFooterSimpleNavLayout,
  children: [
    {
      path: ':id',
      name: 'FeedbackDetail',
      component: () => import('@views/feedback/FeedbackDetailView'),
      meta: {
        title: '고객의 소리 등록내역'
      }
    },
    {
      path: 'search',
      name: 'FeedbackSearch',
      component: () => import('@views/feedback/FeedbackSearchView'),
      meta: {
        title: '고객의 소리'
      }
    },
    {
      path: 'write',
      name: 'FeedbackWrite',
      component: () => import('@views/feedback/FeedbackWriteView'),
      meta: {
        title: '고객의 소리 등록하기'
      }
    },
    {
      path: '',
      name: 'FeedbackList',
      component: () => import('@views/feedback/FeedbackListView'),
      meta: {
        title: '고객의 소리 등록내역'
      }
    },
    {
      path: 'resetpw',
      name: 'FeedbackResetPassword',
      component: () => import('@views/feedback/ResetPasswordView'),
      meta: {
        title: '비밀번호 재설정'
      }
    },
    {
      path: 'resetpw/confirm',
      name: 'FeedbackResetPasswordConfirm',
      component: () => import('@views/feedback/ResetPasswordConfirmView'),
      meta: {
        title: '비밀번호 재설정'
      }
    }
  ]
}
export default [custormerNoFooterSimpleNavLayout]
