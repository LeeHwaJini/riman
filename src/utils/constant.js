/**
 * name: constant.js
 * description: 전역으로 사용될 공통 상수 정의
 */

export const ROLES_BE = {
  consumer: 'BEAUTY_CONSUMER',
  no_referral_consumer: 'NON_REF_CUSTOMER', // 추천인 없는 소비자 (본사소속 커스터머)
  planner: 'SOLE_PROPRIETORSHIP'
}

export const NO_SNS = 'NONE'

export const SALES_STATUS = {
  sold_out: 'SOLD_OUT',
  almost_sold_out: 'ALMOST_SOLD_OUT'
}
export const DATE_FORMAT = 'YYYY-MM-DD'

export const OTHER_MENU = {
  categoryId: '9999999999',
  categoryName: '리만 스토리',
  level: 1,
  parentId: null,
  path: '/about/ev',
  children: [
    {
      cagegoryId: '999999998',
      categoryName: '기업소개',
      level: 2,
      parentId: '9999999999',
      children: [
        {
          cagegoryId: '999999996',
          categoryName: '기업가치',
          level: 3,
          parentId: '999999998',
          path: '/about/ev'
        },
        {
          cagegoryId: '999999995',
          categoryName: '우리의 발자취',
          level: 3,
          parentId: '999999998',
          path: '/about/history'
        },
        {
          cagegoryId: '999999994',
          categoryName: 'R&D',
          level: 3,
          parentId: '999999998',
          path: '/about/rnd'
        }
      ]
    },
    {
      cagegoryId: '999999997',
      categoryName: '지속가능경영',
      level: 2,
      parentId: '9999999999',
      children: [
        {
          cagegoryId: '999999993',
          categoryName: '공정거래',
          level: 3,
          parentId: '999999997',
          path: '/esg/fair'
        },
        {
          cagegoryId: '999999992',
          categoryName: '윤리준법경영',
          level: 3,
          parentId: '999999997',
          path: '/esg/ethics'
        },
        {
          cagegoryId: '999999991',
          categoryName: '소비자중심경영',
          level: 3,
          parentId: '999999997',
          path: '/esg/customer'
        },
        {
          cagegoryId: '999999990',
          categoryName: '안전보건경영',
          level: 3,
          parentId: '999999997',
          path: '/esg/safety'
        },
        {
          cagegoryId: '999999989',
          categoryName: '사이버신고센터',
          level: 3,
          parentId: '999999997',
          path: '/esg/compliance'
        }
      ]
    }
  ]
}
