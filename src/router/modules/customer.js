import NavLayout from '@/layout/NavLayout.vue'
import NoFooterNavLayout from '@/layout/NoFooterNavLayout.vue'
import NoFooterSimpleNavLayout from '@/layout/NoFooterSimpleNavLayout.vue'

const custormerNavLayout = {
  path: '/customer',
  component: NavLayout,
  children: [
    {
      path: '',
      name: 'CustomerMain',
      component: () => import('@views/customer/CustomerMainView'),
      meta: {
        title: 'CS_Center'
      }
    },
    {
      path: 'faq',
      name: 'Faq',
      component: () => import('@views/customer/faq/FaqView'),
      meta: {
        title: 'FAQs'
      }
    },
    {
      path: 'guide',
      name: 'EasyGuide',
      component: () => import('@views/customer/buttons/EasyGuideView'),
      meta: {
        title: 'CS_EasyGuide'
      }
    },
    {
      path: 'resource',
      name: 'Resource',
      component: () => import('@views/customer/buttons/ResourceRoomView'),
      meta: {
        title: 'CS_Resource실'
      }
    },
    {
      path: 'certificate',
      name: 'Certificate',
      component: () => import('@views/customer/buttons/CertificateIssuanceView'),
      meta: {
        requiresAuth: true,
        title: 'CS_Certificate'
      }
    },
    {
      path: 'partnership',
      name: 'Partnership',
      component: () => import('@views/customer/PartnershipView'),
      meta: {
        title: 'CS_Partner'
      }
    }
  ]
}

const custormerNoFooterNavLayout = {
  path: '/customer',
  component: NoFooterNavLayout,
  children: [
    {
      path: 'center',
      name: 'Center',
      component: () => import('@views/customer/buttons/CenterListView'),
      meta: {
        title: 'CS_FindCenter'
      }
    },
    {
      path: 'center/search',
      name: 'CenterSearch',
      component: () => import('@views/customer/buttons/CenterSearchView'),
      meta: {
        title: 'CS_FindCenter'
      }
    }
  ]
}
const custormerNoFooterSimpleNavLayout = {
  path: '/customer',
  component: NoFooterSimpleNavLayout,
  children: [
    {
      path: 'inquiry',
      name: 'Inquiry',
      component: () => import('@views/customer/inquiry/InquiryWriteView'),
      meta: {
        requiresAuth: true,
        title: 'CS_InquiryP2p'
      }
    },
    {
      path: 'inquiry/list',
      name: 'InquiryList',
      component: () => import('@views/customer/inquiry/InquiryListView'),
      meta: {
        requiresAuth: true,
        title: 'CS_MyInquiry'
      }
    },
    {
      path: 'inquiry/detail/:inquiryId',
      name: 'InquiryDetail',
      component: () => import('@views/customer/inquiry/InquiryDetailView'),
      meta: {
        requiresAuth: true,
        title: 'CS_MyInquiry'
      }
    }
  ]
}
export default [custormerNavLayout, custormerNoFooterNavLayout, custormerNoFooterSimpleNavLayout]
