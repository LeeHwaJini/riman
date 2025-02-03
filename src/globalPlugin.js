/**
 * vue에서 공통으로 사용하는 기능 전역으로 등록
 * create by CHJM (2022-02-25)
 */

import progressHelper from '@utils/progressHelper'
import alertHelper from '@utils/alertHelper'
import { Dialog, Screen, Notify } from 'quasar'
import { useMainStore } from '@store/mainStore'

const globalPlugin = {
  install(Vue) {
    Vue.mixin({
      methods: {
        /**
         * 화면 모바일 사이즈 체크 (767 이하 일 경우)
         * @returns true/false
         */
        $isMobile() {
          return Screen.lt.md
        },
        /**
         * 화면 tablet 사이즈 체크 (1023 이하 일 경우)
         * @returns true/false
         */
        $isTablet() {
          return Screen.lt.lg
        },
        /**
         * modal 생성
         * @param {*} modalInfo = {
         * parent: this, // 필수
         * component: ModalModeless, // 필수 - 사용할 팝업창
         * modeless: boolean, // 선택
         * moveAble: boolean, // 선택
         * position: {top: 0, left: 0, bottom: 0, right: 0} - style의 top/left/bottom/right와 동일
         * componentProps: { key: value } // 선택 - 팝업창에 전달할 값들 추가 (props)
         * }
         *
         */
        openModal(modalInfo) {
          // 팝업 오픈 시 오픈 데이터를 store에 저장
          useMainStore().pOpen(modalInfo.direction ? modalInfo.direction : 'right')
          return Dialog.create(modalInfo)
        },

        /**
         * Error alert
         * @param {string} message - 출력메세지 / 다국어 키 / 필수
         * @param {object} param - 선택
         *              - ok : ok 버튼 클릭시 실행 메소드
         *              - okLabel : ok 버튼 글씨 (다국어키)
         */
        $alertError(
          message,
          {
            title = 'CM_Error',
            okLabel = 'CM_Ok',
            cancelLabel = 'CM_Cancel' } = {}
        ) {
          return alertHelper.show('error',
            message,
            {
              title: title,
              okLabel: okLabel,
              cancelLabel: cancelLabel
            })
        },

        /**
         * Notice alert
         * @param {string} message - 출력메세지 / 다국어 키 / 필수
         * @param {string} title - alert title / 다국어 키 / default '알림'([다국어]'CM_Notice')
         * @param {object} param - 선택
         *              - ok : ok 버튼 클릭시 실행 메소드
         *              - okLabel : ok 버튼 글씨 (다국어키)
         */
        $alert(
          message,
          {
            title = '',
            ok = null,
            okLabel = 'CM_Ok',
            cancelLabel = 'CM_Cancel',
            disabledButton = false,
            wrapClassName = null,
            iconClassName = 'notifications'
          } = {}
        ) {
          return alertHelper.show('info', message, {
            title: title,
            ok: ok,
            okLabel: okLabel,
            cancelLabel: cancelLabel,
            disabledButton: disabledButton,
            wrapClassName: wrapClassName,
            iconClassName: iconClassName
          })
        },

        $confirm(
          message,
          {
            title = 'CM_Confirm',
            ok = null,
            okLabel = 'CM_Ok',
            cancel = null,
            cancelLabel = 'CM_Cancel',
            okClassName = null,
            cancelClassName = null,
            wrapClassName = null,
            iconClassName = 'notifications'
          } = {}
        ) {
          return alertHelper.show('confirm', message, {
            title: title,
            ok: ok,
            okLabel: okLabel,
            cancel: cancel,
            cancelLabel: cancelLabel,
            okClassName: okClassName,
            cancelClassName: cancelClassName,
            wrapClassName: wrapClassName,
            iconClassName: iconClassName
          })
        },

        $notify(
          message,
          title = '',
          className = '',
          timeout = 5000
        ) {
          Notify.create({
            classes: 'tooltip-area ' + className,
            message: '<div class="tooltip-text-area"><Strong>' + title + '</Strong> <p>' + message + '</div>',
            color: 'tooltip',
            textColor: 'tooltip',
            html: true,
            position: 'center',
            timeout: timeout,
            actions: [{ icon: 'close' }],
            badgeStyle: { display: 'none' }
          })
        },

        /**
         * showProgress
         */
        $showProgress() {
          progressHelper.show()
        },

        /**
         * hideProgress
         */
        $hideProgress() {
          progressHelper.hide()
        }
      }
    })
  }
}

export default globalPlugin
