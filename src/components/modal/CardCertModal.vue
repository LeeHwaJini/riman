<!--
휴대폰 인증 모달
create by chjm
-->
<template>
  <form id="form_civs" name="CivsForm" method="post" target="popupCivs" >
    <input type="hidden" name="certInfo">
    <input type="hidden" name="cpParam">
    <input type="hidden" name="nr">
  </form>
</template>

<script setup>
import { nextTick, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const showModal = (data) => {
  nextTick(() => {
    const popup = window.open('', 'popupCivs', 'width=430px, height=725px, scrollbars=yes, resizable=yes, menubar=no, toolbar=no, location=no, status=no, titlebar=0')
    if (isPopupBlockerActivated(popup)) {
      proxy.$alert(proxy.$t('UTI_AltBlockPopup'))
    } else {
      const frm = document.getElementById('form_civs')
      frm.action = data.baseUrl + '/check'
      frm.certInfo.value = data.certInfo
      frm.cpParam.value = data.cpParam
      frm.nr.value = data.nr
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
