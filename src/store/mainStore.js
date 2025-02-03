// 참고) https://pinia.vuejs.org

import { defineStore } from 'pinia'
import http from '@utils/http'
import { getLocale } from '@utils/i18n'
import { getToken, saveToken, saveRefreshToken, destroyToken, destroyLocalToken } from '@utils/token'
import { localDataManager, DATA_AUTO_LOGIN, cookieDataManager, DATA_LOGIN_ID, ID_REFESH_TOKEN_KEY } from '@utils/dataManager'
import { format } from '@utils/format'
import { queryClient } from '@/http/queryClient'

// import sampleService from '@/http/services/sample'
const oauthToken = import.meta.env.VITE_OAUTH_TOKEN

export const useMainStore = defineStore({
  id: 'mainStore',
  state: () => ({
    userInfo: {},
    managerInfo: {}, // [CHJM] 추후 삭제
    routerInfo: null,
    modalContents: [],
    modalWidth: 0,
    standardCartBadge: 0, //  일반장바구니 담긴 갯수,
    headerHeight: 0, // 헤더 높이
    isPersonalMallShow: false // 퍼스널몰 배너 노출 여부
  }),
  actions: {
    pCheck() {
      if (useMainStore().modalContents.length > 1) {
        useMainStore().modalWidth = 50
      } else {
        useMainStore().modalWidth = 70
      }
    },
    pOpen(direction) {
      useMainStore().modalContents.push(direction)
      this.pCheck()
    },
    pClose() {
      useMainStore().modalContents.pop()
      this.pCheck()
    },
    async managerList() { // [CHJM] 추후 삭제
      const result = await http()
        .url('/product/v1/public/products/main')
        .get()
      return result
      // return result.data;
    },
    /**
     * 현재 로그인 사용자 정보 조회
     */
    async getMe() {
      const result = await http().url('/member/v1/users/me').get()
      if (result) {
        const userInfo = {
          userSeqNo: result.data.userSeqNo, // 홍콩 기반으로 제작 되어 userSeqNo값이 usertId로 매칭
          userNumber: result.data.userNumber,
          userType: result.data.userType.code,
          email: result.data.email,
          mobileNumber: result.data.mobileNumber,
          requiredPasswordChangeDate: result.data.requiredPasswordChangeDate,
          rank: result.data.rank.code,
          referralUserNumber: result.data.referralUserNumber,
          referralName: result.data.referralName,
          lastName: result.data.lastName,
          firstName: result.data.firstName,
          fullName: format.nameFormat(result.data.lastName, result.data.firstName),
          joinDatetime: result.data.joinDatetime,
          beautyPlannerDatetime: result.data.beautyPlannerDatetime,
          isForeign: result.data.isForeign,
          centerName: result.data.centerName
        }

        useMainStore().userInfo = userInfo
      }
    },
    // Login
    async onLogin(params) {
      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-client-id': '85ffea5b-5fae-42fc-a454-5895ad815668',
        'Accept-Language': getLocale(),
        Authorization: 'Basic ' + oauthToken
      }

      const form = new FormData()

      form.append('grant_type', params.grant_type)

      if (params.grant_type === 'social') {
        form.append('token_social', params.id)
        form.append('service_type', params.serviceType)
      } else {
        form.append('username', params.userNumber)
        form.append('password', params.password)
      }
      // form.append('scope', 'write')
      // form.append('region_code', 'US')

      try {
        const result = await http().url('/oauth/token').param(form).config({ headers: headers }).noToken().post()

        if (result.access_token && result.refresh_token) {
          await saveToken(result.access_token)
          await saveRefreshToken(result.refresh_token)
          await this.getMe()

          return result
        } else {
          return false
        }
      } catch (error) {
        console.log(error)
      }
    },
    // logout
    async onLogout() {
      destroyToken()
      useMainStore().userInfo = {}
      useMainStore().standardCartBadge = 0

      if (cookieDataManager.get(DATA_AUTO_LOGIN)) {
        destroyLocalToken()
        cookieDataManager.remove(DATA_AUTO_LOGIN)
      }
      queryClient.invalidateQueries({ queryKey: ['get-category-list', ''] }).then(() => {
        queryClient.refetchQueries({ queryKey: ['get-category-list', ''] })
      })

      return true
    },
    async validToken() {
      try {
        if (getToken()) {
          const result = await http()
            .url('/v1/etc/auth/token/valid')
            .param({})
            .disabledProgress()
            .get()
          return result
        }
      } catch (e) {
        return false
      }
    },
    onSaveRouteInfo(route) {
      useMainStore().routerInfo = route
    },
    // Two Factor : send mail
    async sendAuthenticationMail(params) {
      return await http().url('/abo/mail/v1/public/sendAuthenticationMail').param(params).post()
    },
    // Two Factor : 인증번호 유효성 체크
    async checkAuthenticationNumber(params) {
      return await http().url('/abo/mail/v1/public/checkAuthenticationNumber').param(params).post()
    },
    updateStandardCartBadge(payload) {
      this.standardCartBadge = payload
    }
  },
  getters: {
    getUser: (state) => state.userInfo,
    getCartCount: (state) => {
      return state.standardCartBadge
    }
  }
})

