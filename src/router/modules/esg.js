import Layout from '@/layout/Layout'

const esgLayout = {
  path: '/esg',
  component: Layout,
  children: [
    {
      path: 'compliance',
      name: 'Compliance',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/esg/ko-KR/ComplianceView')
    },
    {
      path: 'customer',
      name: 'Customer',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/esg/ko-KR/CustomerView')
    },
    {
      path: 'ethics',
      name: 'Ethics',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/esg/ko-KR/EthicsView')
    },
    {
      path: 'fair',
      name: 'FairTrade',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/esg/ko-KR/FairTradeView')
    },
    {
      path: 'safety',
      name: 'Safety',
      component: () => // 추후 다국어 적용시 ko-KR -> ${getLocale()} 로 바꿈
        import('@views/esg/ko-KR/SafetyView')
    }
  ]
}
export default [esgLayout]
