/**
 * name: format
 * description: 전역으로 사용될 format 함수
 */

export const format = {

  // $moneyFormat 전역으로 등록됨
  money(value) {
    const type = typeof (value)
    try {
      if (type === 'number') {
        return value.toLocaleString()
      } else {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      }
    } catch (error) {
      return ''
    }
    // return Number(value).toLocaleString()
    // return Number(value).toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
  },
  displayMaxNumber(value, max = 99) {
    return Number(value) > max ? max + '+' : Number(value)
  },
  eventDateFormat(val) {
    if (val.indexOf('9999') > -1) {
      return '-'
    } else {
      return val.substring(0, 10)
    }
  },
  // 대만 주소 표시
  addressFormat(data) {
    return data.city + data.address + data.state + data.detailAddress
  },
  // 대만 주소 표시 (회원 정보 사용)
  addressFormat01(data) {
    if (data && data.address1) {
      const zipCode = data.zipCode ? data.zipCode : data.zipcode
      const country = data.country ? data.country : ''
      return country +
      zipCode +
      data.city +
      data.state +
      data.address1 +
      data.address2
    }
    return ''
  },
  // 대만 성+이름 표시
  nameFormat(lastName, firstName) {
    if (!!lastName && !!firstName) {
      return lastName + firstName
    } else if (lastName) {
      return lastName
    }
  },
  // EasyPay에서 결제된 승인 번호를 AP+번호에서 TP+번호 형식으로 변경
  paymentNumberFormat(val) {
    if (val !== null && val.startsWith('AP')) {
      const v = val.replace('AP', 'TP')

      return v
    } else {
      return val
    }
  },
  // 핸드폰번호 Format ###-####-####
  mobileFormat(val) {
    if (!val) return ''
    const phoneStr = val.toString().replace(/\D/g, '')
    const match = phoneStr.match(/^(\d{3})(\d{4})(\d{4})$/)
    if (match) {
      return `${match[1]}-${match[2]}-${match[3]}`
    }
    return val
  }
}
export default format
