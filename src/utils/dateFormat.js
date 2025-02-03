/**
 * Date Format Utils
 * create by 최정민 (2022-02-14)
 */
import { date } from 'quasar'

/**
 * 현재 날짜 구하기
 * 원하는 Format으로 현재 Date 정보 Return
 *
 * @param format
 * @returns {string} (default: 'YYYY-MM-DD HH:mm:ss')
 */
export function nowDate(format = 'YYYY-MM-DD HH:mm:ss') {
  return date.formatDate(Date.now(), format)
}

/**
 * 원하는 Format으로 Date 정보 Return
 *
 * @param format
 * @returns {string} (default: 'YYYY-MM-DD HH:mm:ss')
 */
export function formatDate(_date, format = 'YYYY-MM-DD HH:mm:ss') {
  return date.formatDate(new Date(_date), format)
}

/**
 * add 날짜 구하기
 * 이후 Date 정보 Return
 * @param _date : 설정할 Date
 * @param format : Date 출력 Format (default: 'YYYY-MM-DD HH:mm:ss')
 * @param param : default: 12개월 이후
 */
export function addDate(_date, format = 'YYYY-MM-DD HH:mm:ss', param) {
  return date.formatDate(date.addToDate(new Date(_date), param), format)
}

/**
 * subtract 날짜 구하기
 * 이전 Date 정보 Return
 * @param _date : 설정할 Date
 * @param format : Date 출력 Format (default: 'YYYY-MM-DD HH:mm:ss')
 * @param param : default: 12개월 이전
 */
export function subtractDate(_date, format = 'YYYY-MM-DD HH:mm:ss', param) {
  return date.formatDate(date.subtractFromDate(new Date(_date), param), format)
}

/**
 * Date between 정보 전달
 * */
export function isBetweenDates(_date, minDate, maxDate) {
  return date.isBetweenDates(
    new Date(_date),
    new Date(minDate),
    new Date(maxDate)
  )
}

/**
 * 이전, 이후 날짜 체크 유무
 * startDate < endDate  Return true
 * */
export function isValidDates(startDate, endDate) {
  return new Date(startDate) < new Date(endDate)
}

/**
 * 같은 날짜 포함 , 이전 날짜 체크
 * startDate <= endDate  Return true
 * */
export function isSameOrBefore(startDate, endDate) {
  return new Date(startDate) <= new Date(endDate)
}

/**
 * 같은 날짜 포함 , 이후 날짜 체크
 * startDate >= endDate  Return true
 * */
export function isSameOrAfter(startDate, endDate) {
  return new Date(startDate) >= new Date(endDate)
}

/**
 * 이전, 이후 Time 체크 유무
 * startDate < endDate  Return true
 * */
export function isValidTimes(startTime, endTime) {
  return new Time(startTime) < new Time(endTime)
}

/**
 * 시작 시간 구하기
 * @param _date : 설정할 Date
 * @param format : Date 출력 Format (default: 'YYYY-MM-DD HH:mm:ss')
 * @param param : 재 설정할 단위
 * */
export function startOf(_date, format = 'YYYY-MM-DD HH:mm:ss', param) {
  return date.formatDate(date.startOfDate(_date, param), format)
}

/**
 * dday 구하기
 * @param {string} endDate - 비교할 날짜
 * @returns {number} - 남은 일수
 */
export function getDday(endDate) {
  const today = new Date(formatDate(nowDate(), 'YYYY-MM-DD'))
  const targetDate = new Date(formatDate(endDate, 'YYYY-MM-DD'))

  const differenceInTime = targetDate.getTime() - today.getTime()
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24))

  return differenceInDays
}
