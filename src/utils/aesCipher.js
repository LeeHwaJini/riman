/**
 * name: aesCipher
 * description: 암호화 기능
 * create by chjm (2022-06-15)
 */

import CryptoJS from 'crypto-js'

const key = 'MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDE='
const iv = '0000000000000000'

const aesCipher = {
  /**
   * 암호화 키 길이 제한 없이 암호화 처리
   * @param {*} data
   * @param {*} key
   */
  encryptUI (data, key) {
    return CryptoJS.AES.encrypt(data, key).toString()
  },

  /**
   * 암호화 키 길이 제한 없이 복호화 처리
   * @param {*} data
   * @param {*} key
   */
  decryptUI (data, key) {
    const decStr = CryptoJS.AES.decrypt(data, key)
    return decStr.toString(CryptoJS.enc.Utf8)
  },

  /**
   * aes 256 인코딩
   * 암호화키가 16자리 인경우
   * 서버와 통신하여 암/복호화 할때 사용
   * @param {*} rawData
   * @param {*} key - 16자리 암호화키
   */
  encrypt (rawData) {
    const keys = CryptoJS.enc.Utf8.parse(key)
    const encryptResult = CryptoJS.AES.encrypt(rawData, keys, {
      iv: CryptoJS.enc.Utf8.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return encryptResult.toString()
  },

  /**
   * 암호화키가 16자리 인경우
   * 서버와 통신하여 암/복호화 할때 사용
   * @param {*} encData
   * @param {*} key - 16자리 암호화키
   */
  decrypt (encData) {
    const keys = CryptoJS.enc.Utf8.parse(key)
    const plaintext = CryptoJS.AES.decrypt(
      encData,
      keys,
      {
        iv: CryptoJS.enc.Utf8.parse(iv),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )
    return plaintext.toString(CryptoJS.enc.Utf8)
  },

  /**
   * 서버에서 암호화하여 온 데이터를 복호화 할때 사용
   * @param {*} encData
   * @returns json object
   */
  serverSideDecrypt (encData) {
    const _key = CryptoJS.enc.Base64.parse(key)
    const _encData = CryptoJS.enc.Base64.parse(encData)

    const encryptResult = CryptoJS.AES.decrypt({ ciphertext: _encData }, _key,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
    )

    return JSON.parse(encryptResult.toString(CryptoJS.enc.Utf8))
  }
}

export default aesCipher
