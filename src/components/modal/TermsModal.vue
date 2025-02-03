<!--
약관 팝업
create by jhchoi
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
    class="agree-modal full-page-modal"
    @hide="hide"
  >
    <layout-modal
      ref="layoutModal"
      :move-able="true"
      class="layer"
      :disabled-close-button="true"
      @action1-evt="onClickOk"
    >
      <!-- 팝업 내용 -->
      <!-- <template #body>
        <div v-clean-html="content"></div>
      </template> -->

      <template #body>
        <div class="title-top-area">
          <slot name="title"></slot>
          <button class="menu-close-btn" @click="modalHide">
            <i class="ico close" />
          </button>
        </div>

        <div class="agree-modal-title-area">{{ title }}</div>
        <div v-clean-html="content" class="content scroll type01"></div>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const vCleanHtml = buildVueDompurifyHTMLDirective()
const emit = defineEmits(['ok', 'cancel'])

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
})

const modal = ref()

const footerButtons = computed(() => {
  return [
    { type: 'action1', label: 'CM_Ok', class: 'button button--success' }
  ]
})

// Ok onClick 버튼 이벤트 처리
const onClickOk = () => {
  emit('ok')
  modalHide()
}

// 팝업 닫기
const modalHide = () => {
  modal.value.hide()
}

</script>
