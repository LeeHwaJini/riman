import NavLayout from '@/layout/NavLayout'

const termsLayout = {
  path: '',
  component: NavLayout,
  children: [
    {
      path: '/use_terms',
      component: () => import('@views/footer/Terms'),
      meta: {
        title: 'NAV_Terms'
      }
    },
    {
      path: '/privacy_policy',
      component: () => import('@views/footer/Terms'),
      meta: {
        title: 'NAV_PrivacyPolicy'
      }
    }
  ]
}
export default [termsLayout]
