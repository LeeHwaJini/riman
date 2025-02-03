/**
 * name: validate.js
 * description: validate Util
 * create by chjm (2022-06-20)
 */
import {
  i18n
} from '@utils/i18n'

export const validate = {

  /* isValidId
   * 아이디 규칙 (# 추후 협의 필요)
   * 4자 ~ 20자 이상의 알파벳과 숫자 검증.
   */
  async isValidId(val) {
    if (!(/^[A-Za-z0-9]{4,20}$/).test(val)) {
      return i18n.global.t('UTI_Valid_LoginId')
    }
    return true
  },
  /* isValidPassword
   * 패스워드 규칙
   * 영문, 숫자, 특수문자 조합 8자리 이상
   */
  async isValidPassword(val) {
    if (!val) {
      return i18n.global.t('VA_EnterPassword')
    } else if (!/^.{8,}$/.test(val)) {
      return i18n.global.t('VA_PasswordLength')
    } else if (!(/^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+=?.,~-]).*$/).test(val)) {
      return i18n.global.t('VA_PasswordContain')
    }
    return true
  },
  /* isValidNickname
   * 닉네임 규칙
   * 영문, 숫자 3-20글자 입력
   */
  async isValidNickname(val) {
    return (/^[A-Za-z0-9]{3,20}$/).test(val)
  },
  /* isValidUserNumber
   * 회원 번호 규칙
   * 10 자리 입력
   */
  async isValidUserNumber(val) {
    if (!val) {
      return i18n.global.t('LOG_ValidUserNumber')
    } else if (val.length < 10) {
      return i18n.global.t('VA_UserNumberLength1')
    } else if (val.length > 10) {
      return i18n.global.t('VA_UserNumberLength2')
    }
    return true
  },
  /**
   * 이메일 규칙 체크
   * @param {*} val
   */
  isValidEmail(val) {
    return (/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(val)
  },
  /**
   * 패스워드 규칙 > 영문 포함
   * @param {*} value
   * @returns
   */
  hasEnglish(value) {
    return value && /[A-Za-z]/.test(value)
  },
  /**
   * 패스워드 규칙 > 특수문자 포함
   * @param {*} value
   * @returns
   */
  hasSpecialChar(value) {
    return value && /[!@#$%^&*(),.?":{}|<>]/.test(value)
  },
  /**
   * 패스워드 규칙 > 숫자 포함
   * @param {*} value
   * @returns
   */
  hasNumber(value) {
    return value && /\d/.test(value)
  },
  /**
   * 패스워드 규칙 > 8자 이상, 16자 이하
   * @param {*} value
   * @returns
   */
  checkLength(value, minLength = '', maxLength = '') {
    const regex = new RegExp(`^.{${minLength},${maxLength}}$`)
    return value && regex.test(value)
  },
  checkSameLength(value, length) {
    return value && value.length === length
  },
  /**
   * 필수값 체크 함수
   * @param {*} value - 검증할 값
   * @returns {boolean} - 값이 있으면 true
   */
  isRequired(value) {
    return !value || value.trim() === ''
  },

  /**
 * 휴대폰 번호 유효성 검사 함수
 * @param {*} value - 검증할 값
 * @returns {boolean|string} - 유효한 경우 true, 아니면 에러 메시지 반환
 */
  isValidPhoneNumber(value) {
    // 필수값 검사
    if (!value || value.trim() === '') {
      return i18n.global.t('ALT_InputMobile')
    }

    // 숫자만 포함되어 있는지 체크
    const isNumeric = /^\d+$/.test(value)
    if (!isNumeric) {
      return i18n.global.t('VA_MobileOnlyNumber')
    }

    // 최대 11글자 검사
    if (value.length > 11) {
      return i18n.global.t('VA_MobileLength')
    }

    // 유효성 검사 통과
    return true
  }
}

export default validate
