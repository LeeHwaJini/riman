<!--
sampleModal 팝업
create by chjm (2022-02-28)

position="standard, top, right, bottom, left"
transition-show="fade, slide-up"
transition-hide="fade, slide-down"
maximized="true"
-->
<template>
  <q-dialog
    ref="modal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    @hide="hide"
  >
    <layout-modal
      ref="layoutModal"
      :move-able="true"
      width="500px"
      :footer-btn="[
        { type: 'action1', label: 'CM_Ok', class: 'button button--success'},
        { type: 'action2', label: 'CM_Cancel', class: 'button button--cancel' },
        { type: 'disableBtn', label: 'CM_Disable', disable: true },
      ]"
      @action1Evt="onClickOk"
      @action2Evt="onClickCancel"
      @disableBtnEvt="onClickDisableBtn"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <q-card-section>
          <div class="popCont">
            팝업 내용
            <br >
            <br >
            <br >
            <br >팝업 내용
            <br >
            <br >
            <br >
            <br >팝업 내용
            <br >
            <br >
            <br >
            <br >팝업 내용
            <br >
            <br >
            <br >
            <br >팝업 내용
            <br >
            <br >
            <br >
            <br >전달 받은 값 :
            <br >
            {{ propData }}
            <br >
            <br >
            <br >
            <br >
          </div>
        </q-card-section>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>

// const { proxy } = getCurrentInstance()
const emit = defineEmits(['ok', 'cancel'])

// const props = defineProps({
//   propData: {
//     type: Object,
//     default: null
//   }
// })

const modal = ref()

// 팝업 show 호출
// const show = () => {
//   nextTick(() => {
//     modal.value.show()
//   })
// }

// 팝업 Hide 호출
const hide = () => {
  console.log('hide')
}

// 팝업 닫기
const modalHide = () => {
  modal.value.hide()
}

// Ok onClick 버튼 이벤트 처리
const onClickOk = () => {
  emit('ok')
  modalHide()
}

// Cancel onClick 버튼 이벤트 처리
const onClickCancel = () => {
  emit('cancel')
  modalHide()
}

// onClick 버튼 이벤트 처리
const onClickDisableBtn = () => {
  console.log(' modal onClickDisableBtn')
}
</script>
