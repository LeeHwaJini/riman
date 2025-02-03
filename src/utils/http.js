/**
 * name: http.js
 * description: axios를 사용 progress와 성공/실패 alert의 동작을
 *              옵션에 따라서 선택적으로 실행 가능하도록 만든 helper
 * create by chjm (2022-05-13)
 */
import axios from 'axios'
import { getToken, getRefreshToken, saveToken } from './token'
import router from '@/router'
import progress from '@/utils/progressHelper'
import alertHelper from '@/utils/alertHelper'
import mime from 'mime-types'
import { i18n, getLocale } from '@utils/i18n'
import { useMainStore } from '@store/mainStore'
import { nowDate, isSameOrAfter } from '@utils/dateFormat'

const baseUrl = import.meta.env.VITE_APP_API_BASE_URL

const defaultHeaders = {
  'Content-Type': 'application/json;charset=UTF-8',
  'x-client-id': '85ffea5b-5fae-42fc-a454-5895ad815668',
  'Accept-Language': getLocale(),
  Authorization: `Bearer ${getToken()}`
}

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 30000,
  'Content-Type': defaultHeaders['Content-Type'],
  isToken: true,
  isAbledAlertError: true,
  headers: {
    'Accept-Language': getLocale()
  }
})

instance.interceptors.request.use((config) => {
  if (config.isToken && getToken()) {
    config.headers.Authorization = `Bearer ${getToken()}`
  }
  return config
},
(error) => { Promise.reject(error) })

instance.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const mainStore = useMainStore()
  const statusCode = error.response?.status
  error.response.data.status = statusCode
  const msg = error.response?.data?.error

  switch (statusCode) {
    case 409:
      // 요구사항에 맞지 않은 요청일 경우
      if ((error.response.data.code === '4005' || error.response.data.code === '6009' || error.response.data.code === '4099' || error.response.data.code === '6099' || error.response.data.code === '1106') &&
        error.config.isAbledAlertError) {
        progress.hide()
        alertError(error.response.data.message, 'info')
      } else if (error.response.data.code === '5001') {
        progress.hide()
        alertError('An error occurred because a lot of data was inquired.\n Please modify the search conditions')
      } else if (error.response.data.code === '1100') {
        // 사용자 번호가 존재하지 않습니다.
        singupAlert()
      } else if (error.response.data.code === '9002') {
        // 탈퇴 후 재가입 기간 충족하지 못할 경우
        withdrawlAlert(error.response.data.data)
      }
      break
    case 403:
      console.log('token expired or no auth info exists!!!')
      try {
        // 엑세스 토큰 재발급
        const refreshToken = getRefreshToken()

        const headers = {
          'x-client-id': '85ffea5b-5fae-42fc-a454-5895ad815668',
          Authorization: 'Bearer ' + refreshToken
        }

        const result = await instance.get('/oauth/token', { headers: headers })
        saveToken(result.data.access_token)
        return await instance(error.config)
      } catch (e) {
        return Promise.reject(error)
      }
    case 401:
      if (error.config.url === '/oauth/token') {
        progress.hide()
        if (msg === 'invalid_token') { // 리프레시 토큰 검증 실패
          alertError(i18n.global.t('UTI_InvalidToken'))
          await mainStore.onLogout()
          router.push('/')
        } else if (error.response.data.code === '9001') { // 사용자 없음
          singupAlert()
          return
        } else if (error.response.data.code === '9002') { // 사용자 상태(탈퇴, 징계 등) 안내
          if (error.response.data.messageCode.code === 'WITHDRAWAL') {
            withdrawlAlert(error.response.data.data)
            return
          }
          alertError(error.response.data.message)
        } else if (error.response.data.code === '1101' || error.response.data.code === '1102') { // 비밀번호 오류
          alertError(error.response.data.message)
        }
      }
      break
    case 400:
      if (error.response.data.code === 'G-4009') {
        // vm.$alertError('<strong>시스템 점검 중입니다.</strong>')
        console.log('gateway throws error [G-4009]')
        window.location.href = '/'
      }
      break
    default:
    // await alertError('알수 없는 에러가 발생하였습니다.')
  }
  return Promise.reject(error)
})

function alertError(message, type = '', options) {
  alertHelper.show(type, message, options)
}

function withdrawlAlert(data) {
  if (isSameOrAfter(nowDate('YYYY-MM-DD'), data.rejoinPossibleDate)) {
    // 탈퇴 후 재가입 가능
    singupAlert()
  } else {
    // 탈퇴 후 재가입 불가능
    alertError(i18n.global.t('SIG_AltRejoin', { date: data.rejoinPossibleDate }), 'alert', {
      title: i18n.global.t('SIG_AltRejoinTitle')
    })
  }
}

function singupAlert() {
  alertError(i18n.global.t('SIG_Confirm'), 'confirm', {
    title: i18n.global.t('ALT_NoMatchingMemberInfo'),
    ok: () => {
      router.push('/signup/selectType')
    },
    okLabel: i18n.global.t('CM_MovePage'),
    cancelLabel: i18n.global.t('CM_No')
  })
}

async function ajax(
  type,
  url,
  param,
  config,
  isDisabledProgress,
  isVueQuery
) {
  try {
    isDisabledProgress ? null : progress.show()

    let result = null
    if (type === 'GET') {
      result = await instance.get(url, { params: param, ...config })
    } else if (type === 'PUT') {
      result = await instance.put(url, param, config)
    } else if (type === 'PATCH') {
      result = await instance.patch(url, param, config)
    } else if (type === 'DELETE') {
      result = await instance.delete(url, { data: param, ...config })
    } else {
      result = await instance.post(url, param, config)
    }
    return result.data
  } catch (ex) {
    /* vue-query는 error를 throw 해줘야 훅에서 받을 수 있음
      vue-query를 사용할 경우 false를 return하지 않고
      에러를 throw하여 에러처리를 vue-query에서 하도록 처리가 필요
      isVueQuery가 true일 경우 error를 throw
      ※ useMutation일 경우에만 해당되는 내용.
      useQuery는 에러가 발생했을때 error를 throw하는 것 없이도 error로 받을 수 있음
    */
    if (isVueQuery) {
      throw new Error(ex)
    }
    return false
  } finally {
    isDisabledProgress ? null : progress.hide()
  }
}

/**
 * http()
 *     .url('/test')                    - 필수
 *     .param({ xx:123 })               - 선택
 *     .disabledProgress()              - 선택 progress 비활성화
 *     .post() /.get()/.delete()/.put() - 필수 / 마지막에 호출
 *     .useVueQuery()                   - 선택 / vue-query 사용
 */
const http = () => {
  let _url = ''
  let _param = null
  let _config = null
  let _file = null
  let _isDisabledProgress = false
  let _isVueQuery = false

  return {
    /**
     * 요청 URL
     * @param {string} url - 필수
     */
    url(url) {
      _url = url
      return this
    },

    /**
     * URL 요청시 보낼 데이터
     * @param {object} param - 선택
     */
    param(param) {
      _param = param
      return this
    },

    /**
     * Axios Config (https://github.com/axios/axios#request-config)
     * @param {*} config
     */
    config(config) {
      _config = config
      return this
    },

    /* progress 사용 하지 않을 때 */
    disabledProgress() {
      _isDisabledProgress = true
      return this
    },

    /* API 요청시 토큰 미사용 */
    noToken() {
      _config = { ..._config, isToken: false }
      return this
    },

    /* alertError를 사용 하지 않을 때 */
    disabledAlertError() {
      _config = { ..._config, isAbledAlertError: false }
      return this
    },

    file(file) {
      _file = file
      return this
    },

    useVueQuery() {
      _isVueQuery = true
      return this
    },

    /* http - get 방식 요청 */
    get() {
      return ajax(
        'GET',
        _url,
        _param,
        _config,
        _isDisabledProgress,
        _isVueQuery
      )
    },

    /* http - post 방식 요청 */
    post() {
      return ajax(
        'POST',
        _url,
        _param,
        _config,
        _isDisabledProgress,
        _isVueQuery
      )
    },

    /* http - put 방식 요청 */
    put() {
      return ajax(
        'PUT',
        _url,
        _param,
        _config,
        _isDisabledProgress,
        _isVueQuery
      )
    },

    /* http - put 방식 요청 */
    patch() {
      return ajax(
        'PATCH',
        _url,
        _param,
        _config,
        _isDisabledProgress,
        _isVueQuery
      )
    },

    /* http - delete 방식 요청 */
    delete() {
      return ajax(
        'DELETE',
        _url,
        _param,
        _config,
        _isDisabledProgress,
        _isVueQuery
      )
    },

    /**
     * 파일 업로드
     * @param {string} _fileKey formdata file key 값
     * @returns
     */
    async fileUpload(_fileKey = 'files') {
      const formData = new FormData()
      if (_param) {
        for (const key in _param) {
          formData.append(key, _param[key])
        }
      }

      if (_file) {
        _file.map((file) => {
          formData.append(_fileKey, file)
        })
      }

      try {
        const result = await instance.post(_url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return result.data
      } catch (err) {
        console.log('try: ', err)
        throw err
      }
    },
    /**
     * 이미지(blob)파일 upload
     * @param {string} _fileKey formdata file key 값
     * @returns
     */
    async fileBlobUpload(_fileKey = 'files') {
      const formData = new FormData()

      formData.append('data', new Blob([JSON.stringify(_param)], {
        type: 'application/json'
      }))

      if (_file) {
        _file.map((file) => {
          formData.append(_fileKey, file)
        })
      }

      try {
        const result = await instance.post(_url, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return result.data
      } catch (err) {
        console.log('try: ', err)
        throw err
      }
    },
    /**
     * 파일 다운로드
     * @param {string} filename 파일명
     * @param {object} additionalConfig config
     * @returns
     */
    async fileDownload(type = 'get', filename, additionalConfig = { responseType: 'blob' }) {
      const mimeType = mime.lookup(filename)
      const config = {
        ..._config,
        ...additionalConfig
      }
      let result
      try {
        if (type === 'get') {
          result = await instance.get(_url, { params: _param, ...config })
        } else {
          result = await instance.post(_url, _param, config)
        }
        if (window.navigator.appVersion.toString().indexOf('.NET') > 0) {
          window.navigator.msSaveBlob(result.data, filename)
        } else {
          const url = window.URL.createObjectURL(new Blob([result.data], { type: mimeType }))
          const downloadLink = document.createElement('a')
          downloadLink.href = url
          downloadLink.setAttribute('download', filename)
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        }
      } catch (error) {
        console.log('[fileDownload]' + error.result)
        return false
      }
    },

    /**
     *
     */
    async downloadFileS3(link, filename) {
      try {
        const mimeType = mime.lookup(filename)
        const { data } = await axios.get(`${link}?time=${new Date()}`, { responseType: 'blob' })
        if (window.navigator.appVersion.toString().indexOf('.NET') > 0) {
          window.navigator.msSaveBlob(data, filename)
        } else {
          const url = window.URL.createObjectURL(new Blob([data], { type: mimeType }))
          const downloadLink = document.createElement('a')
          downloadLink.href = url
          downloadLink.setAttribute('download', filename)
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
        }
      } catch (e) {
        return false
      }
    },

    getFile(
      uri,
      params = {},
      headers = {},
      additionalConfig = {},
      isHideLoading,
      method
    ) {
      defaultHeaders.Authorization = `Bearer ${getToken()}`
      const url = `${baseUrl}${uri}`
      const config = {
        headers: {
          ...defaultHeaders,
          ...headers
        },
        ...additionalConfig
      }
      if (!isHideLoading) {
        // showLoading()
        progress.show()
      }

      let promise
      if (method && method !== 'get') {
        promise = axios[method](url, params, config)
      } else {
        config['params'] = params
        promise = axios.get(url, config)
      }

      return promise
        .then((response) => {
          return response
        })
        .catch(error => {
          return error.response
        })
        .finally(() => {
          if (!isHideLoading) {
            // hideLoading()
            progress.hide()
          }
        })
    },

    async convertImage(image) {
      const response = await instance.get(image, { responseType: 'arraybuffer' })
      return response
    }
  }
}
export default http
