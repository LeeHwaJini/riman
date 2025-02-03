/**
 * name: login
 * description: 전역으로 사용될 login 함수
 */
import { useMainStore } from '@store/mainStore'
import { getToken } from '@utils/token'
import http from '@utils/http'
import { i18n } from '@utils/i18n'
import alertHelper from '@/utils/alertHelper'

// 로그인 여부 (로그인 : true)
export function isLogin() {
  const mainStore = useMainStore()
  try {
    if (getToken() &&
    mainStore.userInfo.userSeqNo !== null) {
      return true
    }
  } catch (error) {
    console.log('[login] isLogin :' + error)
    return false
  }
  return false
}

/* 카카오 로그인 callback function */
let callbackFunc = null

// 카카오 로그인
export async function doKakaoLogin(callback) {
  if (callback) {
    callbackFunc = callback // callback 함수 저장
  }

  const result = await chkKakaoToken()
  if (window.Kakao.Auth.getAccessToken() === null || !result) {
    getKakaoToken()
  } else {
    getKakaoInfo(callbackFunc)
  }
}

// kakao token 검증
async function chkKakaoToken() {
  const headers = { Authorization: `Bearer ${window.Kakao.Auth.getAccessToken()}` }
  return await http().url('https://kapi.kakao.com/v1/user/access_token_info').config({ headers }).noToken().get()
}

// kakao token 발급
function getKakaoToken() {
  window.Kakao.Auth.login({
    scope: 'account_email, name', // 동의 항목 설정
    success: (response) => {
      window.Kakao.Auth.setAccessToken(response.access_token)
      doKakaoLogin()
    },
    fail: (err) => {
      console.error(JSON.stringify(err))
      alertHelper.show('error', i18n.global.t('LOG_KakaoFailed'))
    }
  })
}

// kakao 사용자 정보 조회
function getKakaoInfo(callback) {
  window.Kakao.API.request({
    url: '/v2/user/me',
    success: (res) => {
      const data = {
        grant_type: 'social',
        serviceType: 'KAKAO',
        email: res.kakao_account.email,
        id: res.id,
        name: (res.kakao_account.name ? res.kakao_account.name : null),
        isEmailVerified: res.kakao_account.is_email_valid // 이메일 제공 동의 여부 [false면 마스킹 처리 되어있음]
      }
      // callback 함수
      callback(data)
    },
    fail: (err) => {
      console.error(JSON.stringify(err))
      alertHelper.show('error', i18n.global.t('LOG_KakaoFailed'))
    }
  })
}

export default { isLogin, doKakaoLogin }
