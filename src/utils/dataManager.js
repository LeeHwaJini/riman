/**
 * name: dataManager.js
 * description: 사용자 웹브라우저에 데이터 저장
 * -. localDataManager : localStorage 사용
 * -. sessionDataManager : sessionStorage 사용
 * -. cookieDataManager: cookie 사용
 * create by chjm (2022-04-21)
 */

import { Cookies } from 'quasar'
import aesCipher from '@utils/aesCipher'

/**
 * 웹 브라우저에 데이터 저장 - localStorage
 */
export const localDataManager = {
  /**
   * 데이터 저장
   * 저장 데이터는 모두 문자열로 저장됨
   * @param {*} name - 데이터 저장 이름
   * @param {*} value - 데이터 값
   */
  set(name, value) {
    localStorage.setItem(name, value)
  },

  // 암호화 처리하여 데이터 저장
  setEncrypt(name, value) {
    localStorage.setItem(name, aesCipher.encrypt(value))
  },

  /**
   *
   * @param {*} name - 데이터 이름
   *  return -> string / null
   */
  get(name) {
    return localStorage.getItem(name)
  },

  getDecrypt(name) {
    if (localStorage.getItem(name) != null) {
      return aesCipher.decrypt(localStorage.getItem(name))
    } else {
      return null
    }
  },

  /**
   *
   * @param {*} name - 삭제할 데이터 이름
   */
  remove(name) {
    localStorage.removeItem(name)
  },

  /**
  * sessionStorage 초기화
  */
  clear() {
    localStorage.clear()
  }
}

/**
 * 웹 브라우저에 데이터 저장 - sessionStorage
 */
export const sessionDataManager = {
  /**
   * 데이터 저장
   * 저장 데이터는 모두 문자열로 저장됨
   * @param {*} name - 데이터 저장 이름
   * @param {*} value - 데이터 값
   */
  set(name, value) {
    sessionStorage.setItem(name, value)
  },

  /**
   * @param {*} name - 데이터 이름
   *  return -> string / null
   */
  get(name) {
    return sessionStorage.getItem(name)
  },

  /**
   * @param {*} name - 삭제할 데이터 이름
   */
  remove(name) {
    sessionStorage.removeItem(name)
  },

  /**
   * sessionStorage 초기화
   */
  clear() {
    sessionStorage.clear()
  }
}

/**
 * 웹 브라우저에 데이터 저장 - cookie
 */
export const cookieDataManager = {
  /**
   * 데이터 저장
   * @param {*} name - 데이터 저장 이름
   * @param {*} value - 데이터 값
   * @param {*} expires - 기간 / 기본값 30일
   */
  set(name, value, expires = 30) {
    Cookies.set(name, value, { expires: expires })
  },

  /**
   *
   * @param {*} name - 데이터 이름
   */
  get(name) {
    return Cookies.get(name)
  },

  /**
   *
   * @param {*} name - 삭제할 데이터 이름
   */
  remove(name) {
    Cookies.remove(name)
  }
}

export const DATA_LANG = 'r_lang'
export const DATA_LOGIN_ID = 'login_id'
export const DATA_AUTO_LOGIN = 'auto_login'
export const ID_TOKEN_KEY = 'r_token'
export const ID_REFESH_TOKEN_KEY = 'r_refreshtoken'
export const CART_NO_AUTH = 'cart_no_auth'
export const ORDER_DATA_NO_AUTH = 'order_data_no_auth'
export const ORDER_DATA = 'order_data'
export const SUBS_ORDER_DATA = 'subs_order_data'
export const ORDER_PREPATH = 'order_prepath'

/**
 * signup
 */
export const SIGNUP_CURRENT_STEP = 'signup_current_step'
export const SIGNUP_USER_TYPE = 'signup_user_type'
export const SIGNUP_SERVICE_TYPE = 'signup_service_type'
export const SIGNUP_SNS_DATA = 'signup_sns_data'
export const SIGNUP_REFERRER_NUMBER = 'signup_referrer_number'
export const SIGNUP_CERTI_INFO = 'signup_certi_info'
export const SIGNUP_USER_INFO = 'signup_user_info'
export const SIGNUP_COMPLETE = 'signup_complete'
export const SIGNUP_CART = 'signup_cart'
export const SIGNUP_REFERRER_CODE = 'signup_referrer_code'
export const SIGNUP_REFERRER_BRANCH_ID = 'signup_referrer_branch_id'

/**
 * conversion to planner
 */
export const CONVERSION_CURRENT_STEP = 'conversion_current_step'
export const CONVERSION_CERTI_INFO = 'conversion_certi_info'
export const CONVERSION_USER_INFO = 'conversion_user_info'

/**
 * migrate
 */
export const MIGRATE_INFO = 'migrate_info'
export const MIGRATE_COMPLETE = 'migrate_complete'
export const PAYMENT_INFO = 'paymentInfo'
export const PAYMENT_RESULT = 'paymentResult'
export const NON_USER_INFO = 'nonUserInfo'

/**
 * main
 */
export const SHOP_REFERRER_CODE = 'shop_referrer_code'
