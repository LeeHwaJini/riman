import { Dialog } from 'quasar'
import http from '@utils/http'
// import { saveAs } from 'file-saver'
import axios from 'axios'
import progress from '@/utils/progressHelper'
import alertHelper from '@/utils/alertHelper'
import { date } from 'quasar'
import { nowDate, formatDate, subtractDate, isSameOrBefore, isSameOrAfter } from '@utils/dateFormat'
import { ROLES_BE } from './constant'
import { useMainStore } from '@/store/mainStore'
import { i18n, getLocale } from './i18n'
import { getToken, getRefreshToken } from '@utils/token'
import router from '@/router'
import { queryClient } from '@/http/queryClient'
import orderService from '@/http/services/order'
// export async function downloadFile(uri, filename, params, method) {
//   try {
//     const response = await http().getFile(uri, params, {}, { responseType: 'blob' }, false, method)
//     console.log('[downloadFile] response=', response)
//     if (!response.data.iserror) {
//       const nav = window.navigator
//       if (nav && nav.msSaveOrOpenBlob) {
//         nav.msSaveBlob(response.data, filename)
//       } else {
//         const blob = new Blob([response.data], {
//           type: response.headers['content-type']
//         })
//         saveAs(blob, filename)
//       }
//     } else {
//       console.log('Error', response.data)
//     }
//   } catch (e) {
//     console.error(e)
//   }
// }

/**
 * 플래너: 만 19세 , 커스터머 : 만 14세 이상 이상인지 체크
 * @param {*} value
 * @returns true/false
 */
export async function isOldEnough(value, enoughAge) {
  const birthDate = date.formatDate(value, 'YYYY-MM-DD')
  const oldEnough = subtractDate(nowDate('YYYY-MM-DD'), 'YYYY-MM-DD', { years: enoughAge })
  return isSameOrBefore(birthDate, oldEnough)
}

export async function openPopupShop(userId) {
  const response = await http().url(`/member/v1/users/${userId}/shop-login`).get()
  if (response && response.code === '2000') {
    const result = windowOpenPopup(
      '',
      1100,
      800,
      null,
      'PopupShop'
    )

    const form = document.createElement('form')
    form.target = 'PopupShop'
    form.method = 'get'
    form.action = `${process.env.VUE_APP_SHOP_LOGIN_URL}`
    form.appendChild(createElement('accessType', 'bo'))
    form.appendChild(createElement('email', response.data.email))
    form.appendChild(createElement('mobileNumber', response.data.mobileNumber))
    form.appendChild(createElement('user_id', response.data.user_id))
    form.appendChild(createElement('user_display_name', response.data.user_display_name))
    form.appendChild(createElement('first_name', response.data.firstName))
    form.appendChild(createElement('last_name', response.data.lastName))
    form.appendChild(createElement('user_number', response.data.userNumber))
    form.appendChild(createElement('user_type', response.data.user_type))
    form.appendChild(createElement('accessToken', response.data.access_token))
    form.appendChild(createElement('refreshToken', response.data.refresh_token))
    document.body.appendChild(form)
    form.submit()
  }
}

export async function openPopupRbo(userNumber, empdloyeeUdserId) {
  const oauthToken = import.meta.env.VITE_OAUTH_TOKEN

  const instance = axios.create({
    baseURL: process.env.VUE_APP_RBO_API_BASE_URL,
    timeout: 30000,
    'Content-Type': 'application/x-www-form-urlencoded'
  })
  const headers = {
    'x-client-id': '85ffea5b-5fae-42fc-a454-5895ad815668',
    Authorization: `Basic ${oauthToken}`
  }
  const form = new FormData()
  form.append('grant_type', 'password')
  form.append('scope', 'write')
  form.append('login_type', 'SURROGATE')
  form.append('username', userNumber)
  form.append('employee_user_id', empdloyeeUdserId)
  form.append('region_code', 'TW')

  try {
    progress.show()
    const response = await instance.post('/oauth/token', form, { headers })
    if (response.status === 200) {
      const result = windowOpenPopup(
        '',
        1300,
        1000,
        null,
        'PopupRbo'
      )

      const form = document.createElement('form')
      form.target = 'PopupRbo'
      form.method = 'get'
      form.action = `${process.env.VUE_APP_RBO_LOGIN_URL}`
      form.appendChild(createElement('accessType', 'bo'))
      form.appendChild(createElement('email', response.data.email))
      form.appendChild(createElement('mobileNumber', response.data.mobileNumber))
      form.appendChild(createElement('userId', response.data.user_id))
      form.appendChild(createElement('userName', response.data.user_display_name))
      form.appendChild(createElement('userType', response.data.user_type))
      form.appendChild(createElement('userMasterId', response.data.user_master_id))
      form.appendChild(createElement('regionCode', response.data.regionCode))
      form.appendChild(createElement('nationalCode', response.data.nationalCode))
      form.appendChild(createElement('rank', response.data.rank))
      form.appendChild(createElement('accessToken', response.data.access_token))
      form.appendChild(createElement('refreshToken', response.data.refresh_token))
      document.body.appendChild(form)
      form.submit()
    }
  } catch (e) {
    console.log('[openPopupRbo axios] ' + e)
  } finally {
    progress.hide()
  }
}
export const addPrefixForImage = (image) => {
  const VITE_APP_S3_URL = import.meta.env.VITE_APP_S3_URL
  return `${VITE_APP_S3_URL}/${image}`
}
export function windowOpenPopup(
  popUrl,
  popWidth,
  popHeight,
  resizeyn = null,
  popupName = null
) {
  const winHeight = window.screen.availHeight // 현재창의 높이
  const winWidth = document.body.clientWidth // 현재창의 너비
  const winX = window.screenX || window.screenLeft || 0 // 현재창의 x좌표
  const winY = window.screenY || window.screenTop || 0 // 현재창의 y좌표
  const popX = winX + (winWidth - popWidth) / 2
  const popY = winY + (winHeight - popHeight) / 2
  const rn = Math.round(Math.random() * 100)
  const popName = popupName || `popup${rn}`
  const strResize = resizeyn || 'yes'

  return window.open(
    popUrl,
    popName,
    `width=${popWidth}px,height=${popHeight}px,top=${popY},left=${popX},toolbar=no, menubar=no, scrollbars=yes, resizable=${strResize}`
  )
}

export function createElement(key, val) {
  const hiddenField = document.createElement('input')
  hiddenField.setAttribute('type', 'hidden')
  hiddenField.setAttribute('name', key)
  hiddenField.setAttribute('value', val)
  return hiddenField
}

export const randString = () => Math.random().toString(36).substring(2, 7)

function alert(message) {
  alertHelper.show('info', message, { title: '' })
}

/** 텍스트 복사 공통 기능 */
export async function copyClipboard(param) {
  try {
    if (param === null || param === '' || param === undefined) {
      alert(i18n.global.t('ALT_CopyItemMissing'))
    } else {
      await navigator.clipboard.writeText(`${param}`)
      alert(i18n.global.t('ALT_CopySuccess'))
    }
  } catch (e) {
    alert(i18n.global.t('ALT_CopyFailed'))
  }
}

export function toNumberFormatFilledWithZero(val, size) {
  return val.toString().padStart(size, '0')
}
export function getOptionType(product) {
  if (!product) return
  return product.option.items[0].optionImageUrl === '' ? 'text' : 'image'
}
export function getOptionUi(product) {
  if (!product) return
  return product.option.items[0].optionUi.code === 'BUTTON' ? 'button' : 'select'
}
export function getSoldoutText(productdata) {
  let text = i18n.global.t('PR_Soldout')
  if (productdata.soldOutMessage && productdata.soldOutMessage !== '') {
    text = productdata.soldOutMessage
  }
  return text
}

export function generateOptionObj(optionProduct, mainProductPrice) {
  const obj = {
    icon: null,
    description: null,
    disable: false,
    quantity: 1,
    rightText: false
  }
  if (optionProduct.optionImageUrl && optionProduct.optionImageUrl !== '') {
    obj.icon = `img:${addPrefixForImage(optionProduct.optionImageUrl)}`
  }
  obj.label = optionProduct.optionValue
  obj.value = optionProduct.optionValue
  if (optionProduct.salesStatus.code === 'SOLD_OUT') {
    obj.description = i18n.global.t('PR_Soldout')
    obj.disable = true
    obj.textRight = true
  } else {
    obj.description = generateDescription(mainProductPrice, optionProduct.priceOriginal)
    obj.disable = false
  }
  return Object.assign(obj, optionProduct)
}
export function generateDescription(mainPrice, optionPrice) {
  let description = ''
  const diff = optionPrice - mainPrice
  if (diff > 0) {
    description = `+${diff}원`
  } else if (diff < 0) {
    description = `${diff}원`
  }
  return description
}
export function getProductId(product) {
  return product.productOptionId ? product.productOptionId : product.productId
}
/**
 * 최신 여부 체크
 * @param {string} datetime - 비교할 날짜
 * @param {number} days - 최신 기준 일수
 * @returns {boolean}
 */
export function isRecentItem(datetime, days) {
  const baseDate = subtractDate(new Date(), 'YYYY-MM-DD', { day: days })

  return isSameOrAfter(formatDate(datetime, 'YYYY-MM-DD'), baseDate)
}
export function checkPlanner() {
  return useMainStore().getUser.userType === ROLES_BE.planner
}
export function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

export const onClickDetail = async (productId, queryKey, productOptionId) => {
  const res = await checkProductStatus(productId, productOptionId)
  if (!res) {
    if (queryKey) {
      queryClient.invalidateQueries({
        queryKey: [queryKey]
      })
    }
    return 'stopSelling'
  }
  router.push(`/product/detail/${productId}`)
}
export function checkProductStatus(productId, productOptionId) {
  const params = {
    productInfo: [{
      productId,
      productOptionId: productOptionId ?? null
    }]
  }
  return orderService.getProductDetailStatus(params)
}
export function esgFileOpen(url) {
  const _url = 'https://korprod-static-contents.s3.ap-northeast-2.amazonaws.com/HP-Brand-Rimankorea/download/' + url
  window.open(_url, '_blank')
}
export function getViewCount(count, round) {
  if (!count) return
  let _round = round
  if (!_round) {
    _round = 1
  } else {
    _round += 1
  }
  let unit = ''
  switch (_round) {
    case 2:
      unit = 'K'
      break
    case 3:
      unit = 'M'
      break
    case 4:
      unit = 'B'
      break
    case 5:
      unit = 'T'
      break
    default:
      break
  }
  let _count = count
  if (_count < 1000) {
    _count = _count.toString()
    const pointIndex = _count.indexOf('.')
    if (pointIndex > -1) {
      if (_count.split('')[pointIndex + 1] !== '0') {
        _count = _count.substring(0, pointIndex + 2)
      } else {
        _count = _count.substring(0, pointIndex)
      }
    }
    return _count + unit
  } else {
    _count = _count / 1000
    return getViewCount(_count, _round)
  }
}
export function goRboSite(type = '') {
  if (getToken()) {
    if (checkPlanner()) {
      const rboUrl = import.meta.env.VITE_APP_RBO_URL + '/login?accessType=nmkr&lang=' + getLocale() + '&type=' + type + '&refreshToken=' + getRefreshToken() + '&accessToken=' + getToken()
      // const rboUrl = 'http://localhost:8080/login?accessType=nmkr&lang=' + getLocale() + '&refreshToken=' + getRefreshToken() + '&accessToken=' + getToken()

      // console.log(rboUrl)
      window.location.href = rboUrl
    } else {
      router.push('/mypage/conversionToPlanner/certificate')
    }
  } else {
    router.push('/signup/selectType')
  }
}

export function checkCustomer() {
  return useMainStore().getUser.userType === ROLES_BE.consumer
}
// 추후 DB로 관리 될 것.. 임시
export const inputForm = {
  delete: '안녕하세요? 리만코리아입니다.\n본인 확인 절차가 진행되지 않아 뷰티플래너 탈퇴가 지연되고 있습니다.\n탈퇴를 원하실 경우 1522-8144번으로 연락 부탁드립니다. 감사합니다.\n※ 업무시간 : 평일 9시 30분 ~ 17시 30분',
  deletePaper:
    '안녕하세요? 리만코리아입니다.\n탈퇴 시 필요한 서류를 안내 드리오니, Fax 또는 이메일로 접수 바랍니다.\n탈퇴신청서는 마이오피스 자료실에서 확인하시기 바랍니다. 감사합니다.\n①탈퇴신청서 ②신분증사본(주민번호 앞자리) ③본인 통화\nFax : 053-767-0225\nE-mail : cs.kr@riman.com',
  email:
    '안녕하세요? 리만코리아입니다.\n문의하신 통합지원센터 이메일 주소를 안내드립니다.감사합니다.\nE-mail : cs.kr@riman.com',
  fax:
    '안녕하세요? 리만코리아입니다.\n문의하신 통합지원센터 Fax번호를 안내드립니다. 감사합니다.\nFax : 053-767-0225, 053-719-0225',
  address:
    '안녕하세요? 리만코리아입니다.\n문의하신 ㈜리만코리아 주소를 안내드립니다. 감사합니다.\n주소 : 대구 수성구 동대구로 86 리만타워 5, 6층\n연락처 : 1522-8144',
  warehouseRelease:
    '안녕하세요? 리만코리아입니다.\n문의하신 물류센터 주소를 안내드립니다. 감사합니다.\n주소 : 경기도 군포시 부곡동 451번지 한국복합물류센터 C동 2층 KBCI물류센터\n연락처 : 1522-8144',
  warehouseReturn:
    '안녕하세요? 리만코리아입니다.\n문의하신 물류관리팀 주소, Fax, 이메일 안내드립니다. 감사합니다.\n주소 : 대구광역시 수성구 노변공원로 87-6 물류관리팀\n물류관리팀 Fax : 053-792-0989\n물류관리팀 E-mail : return@riman.com',
  foreignerRegPaper:
    '안녕하세요? 리만코리아입니다.\n외국인 뷰티플래너 등록 시 필요한 서류를 안내 드리오니, Fax 또는 이메일로 접수 바랍니다. 외국인등록신청서는 마이오피스 자료실에서 확인하시기 바랍니다. 감사합니다.\n①외국인등록신청서 ②외국인등록증 앞면 ③외국인등록증 뒷면 ④통장사본\nFax : 053-767-0225\nE-mail : cs.kr@riman.com\n등록가능 체류코드 : F2, F4, F5, F6',
  foreignerRegInfo:
    '안녕하세요? 리만코리아입니다.\n    님, 뷰티플래너 등록이 완료 되었습니다. 감사합니다.\n뷰티플래너번호(아이디) : \n비밀번호 : 개별 문자 확인 ',
  memberInfo:
    '안녕하세요? 리만코리아입니다.\n뷰티플래너 정보 변경 시 필요한 서류를 안내 드리오니, Fax 또는 이메일로 접수 바랍니다. 뷰티플래너 정보변경신청서는 마이오피스 자료실에서 확인하시기 바랍니다. 감사합니다.\n①뷰티플래너 정보변경신청서 ②신분증 ③기본증명서 ④통장사본\nFax : 053-767-0225\nE-mail : cs.kr@riman.com',
  changeAccount1:
    '안녕하세요? 리만코리아입니다.\n문의하신 계좌변경 시 필요한 서류를 안내드리며, 변경된 계좌는 마이오피스를 통해 확인 가능합니다. 계좌변경 신청서는 마이오피스 자료실에서 확인하시기 바랍니다. 감사합니다.\n①계좌변경 신청서 ②통장사본\n계좌변경 기간: 매월 20일~매월 영업마감일(~18:00)\nFax : 053-767-0225\nE-mail : cs.kr@riman.com',
  changeAccount2:
    '안녕하세요? 리만코리아입니다.\n직계가족 계좌로 변경 시 필요한 서류를 안내드리며, 변경된 계좌는 익월 마이오피스를 통해 확인 가능합니다. 계좌변경 신청서는 마이오피스 자료실에서 확인하시기 바랍니다. 감사합니다.\n①계좌변경신청서 ②예금주신분증 ③통장사본 ④가족관계증명서 ⑤사유서\n계좌변경 기간 : 매월 20일~매월 영업마감일(~18:00)\nFax : 053-767-0225\nE-mail : cs.kr@riman.com',
  changeAccount3:
    '안녕하세요? 리만코리아입니다.\n마이오피스 계좌번호 변경 방법입니다.\n①로그인→②내정보관리→③내정보수정\n계좌변경은 매월 20일~매월 영업마감일(18:00)까지 가능하며, 변경된 계좌는 익월 마이오피스를 통해 확인 가능합니다. 감사합니다.',
  changeAccount4:
    '안녕하세요? 리만코리아입니다.\n요청하신 계좌 변경이 완료되었습니다. 변경된 계좌는 익월 마이오피스를 통해 확인 가능합니다. 감사합니다.',
  invoiceNo:
    '안녕하세요? 리만코리아입니다.\n문의하신 송장번호 안내드립니다. 감사합니다.\n송장번호 : \n※CJ 대한통운 고객센터 : 1588-1255',
  exchange:
    '안녕하세요? 리만코리아입니다.\n제품 발송 시 아래 내용 첨부 요청드립니다. 감사합니다.\n①뷰티플래너정보 ②불량사유 ③연락처 ④수령주소\n주소 : 대구 수성구 노변공원로 87-6 물류관리팀\n연락처 : 1522-8144',
  notAcceptedrefund:
    '안녕하세요, 리만코리아입니다.\n님 반품신청서 접수해주시기 바랍니다.\n반품하는 상품으로 인해 지급된 수당이 있을 경우, 기 지급된 수당 환수 후 제품 대금이 환불됩니다.\n감사합니다.\n물류관리팀 Fax : 053-792-0989\n물류관리팀 E-mail : return@riman.com',
  refund1:
    '안녕하세요? 리만코리아입니다.\n[이름] 님의 [ ]월 주문건에 대한 반품신청서 접수되었습니다.\n반품 제품 입고시 제품 확인 및 검수 작업은 순차적으로 진행될 예정입니다.\n입고 확인 이후 반품 철회는 불가할 수 있습니다.\n반품하는 제품으로 인해 지급된 수당이 있을 경우 수당 환수가 진행됩니다.\n감사합니다.',
  refund2:
    '안녕하세요? 리만코리아입니다.\n000 판매점장님 산하 [이름] 님의\n[ ]월 주문건에 대한 반품신청서가 접수되었습니다.\n반품 제품 입고시 제품 확인 및 검수 작업은 순차적으로 진행될 예정입니다.\n입고 확인 이후 반품 철회는 불가할 수 있습니다.\n반품하는 제품으로 인해 지급된 수당이 있을 경우 수당 환수가 진행됩니다.\n반품으로 인해 판매점장님 판매장려금 변동이 있을 수 있습니다.\n감사합니다.',
  refundCardFinish:
    '안녕하세요? 리만코리아입니다.\n000 님 반품 절차 완료되어 결제취소가 되었음을 안내드립니다.\n카드 승인 취소는 영업일 기준 3~5일 정도 소요됩니다.\n감사합니다.',
  refundAccountFinish:
    '안녕하세요? 리만코리아입니다.\n000 님 반품 절차 완료되어 결제취소가 되었음을 안내드립니다.\n가상 계좌 환불은 영업일 기준 3일 정도 소요됩니다.\n감사합니다.',
  refundPointFinish:
    '안녕하세요? 리만코리아입니다.\n000 님 반품 절차 완료되어 마일리지 환불 완료되었습니다.\n감사합니다.',
  refundInfo1:
    '안녕하세요? 리만코리아입니다.\n000 님 반품 신청하신 제품이 검수 완료되었습니다.\n수당 환수는 수당 지급일 이후 문자 발송 예정이며 문자에 기재된 금액을 안내 계좌로 꼭 입금해 주시기 바랍니다.\n결제하셨던 수단으로 환불될 예정입니다.\n카드 승인 취소는 카드사 영업일 기준으로 3~5일 정도 걸리며 가상 계좌 환불은 영업일 기준 3일 정도 소요됩니다.\n감사합니다.',
  refundInfo2:
    '안녕하세요? 리만코리아입니다.\n000 님 반품 요청하신 제품 검수 완료되었습니다.\n[ ]월 주문으로 수당 환수 뒤 반품 가능합니다.\n0월 0일 오후 수당 환수 문자를 발송해 드릴 예정이며\n수당환수금액 입금 시 순차적으로 결제취소가 진행됩니다.\n카드 승인 취소는 카드사 영업일 기준으로 3~5일 정도 걸리며 가상 계좌 환불은 영업일 기준 3일 정도 소요됩니다.\n감사합니다.',
  cancelRefund:
    '안녕하세요? 리만코리아입니다.\n000 님 반품 철회 완료되었습니다.\n감사합니다.',
  notReceivedRefund:
    '안녕하세요? 리만코리아입니다.\n님 반품신청서 접수 후 한 달이상 반품 제품 미입고되어 반품 신청이 철회되었습니다.\n감사합니다.'
}
