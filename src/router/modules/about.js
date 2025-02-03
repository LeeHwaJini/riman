import Layout from '@/layout/Layout'
import { getLocale } from '@/utils/i18n'

const aboutLayout = {
  path: '/about',
  component: Layout,
  children: [
    {
      path: 'business',
      name: 'BusinessChance',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/about/ko-KR/BusinessChanceView')
    },
    {
      path: 'ci',
      name: 'CiBi',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/about/ko-KR/CibiView')
    },
    {
      path: 'contribution',
      name: 'Contribution',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/about/ko-KR/ContributionView')
    },
    {
      path: 'ev',
      name: 'EnterpriseValue',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/about/ko-KR/EnterpriseValueView.vue')
    },
    {
      path: 'history',
      name: 'History',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/about/ko-KR/HistoryView')
    },
    {
      path: 'location',
      name: 'Location',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/about/ko-KR/LocationView')
    },
    {
      path: 'rnd',
      name: 'Rnd',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/about/ko-KR/RndView')
    }
  ]
}
export default [aboutLayout]
