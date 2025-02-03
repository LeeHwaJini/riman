<!--
휴대폰 인증 모달
create by chjm
-->
<template>
  <form id="form_chk" method="post" target="popupChk" >
    <input type="hidden" name="m" value="checkplusService">
    <input type="hidden" name="recvMethodType" value="get">
    <input type="hidden" name="EncodeData" >
  </form>
</template>

<script setup>
import { nextTick, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

/**
 * @param data api(/v1/customer/cert/site-info) response data
 */
const showModal = (data) => {
  nextTick(() => {
    const popup = window.open('', 'popupChk', 'width=500, height=550, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no')

    if (isPopupBlockerActivated(popup)) {
      proxy.$alert(proxy.$t('UTI_AltBlockPopup'))
    } else {
      const frm = document.getElementById('form_chk')
      frm.action = data.reqUrl // 나이스 URL
      frm.EncodeData.value = data.encData // 암호화 된 업체정보
      frm.submit()
    }
  })
}

const isPopupBlockerActivated = (popup) => {
  if (popup) {
    if (/chrome/.test(navigator.userAgent.toLowerCase())) {
      try {
        popup.focus()
      } catch (e) {
        return true
      }
    } else {
      popup.onload = function () {
        return (popup.innerHeight > 0) === false
      }
    }
  } else {
    return true
  }
  return false
}

defineExpose({
  showModal
})
</script>
