<!--
fileupload 팝업
create by hbkang (2022-07-04)

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
  >
    <layout-modal
      ref="layoutModal"
      :move-able="true"
      class="layer layer--fileupload"
      :disabled-close-button="false"
      :footer-btn="[
        { type: 'action1', label: 'Upload', class: 'button button--success layer-button'},
        { type: 'action2', label: 'Close', class: 'button button--cancel layer-button' },
      ]"
      @action1-evt="onClickUpload"
      @action2-evt="onClickCancel"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <q-card-section>
          <div class="fileupload-layer">
            <div class="popCont">
              <q-btn
                icon="attachment"
                label="Attachment Form"
                class="button button--attachment"
                @click="attach"
              />
            </div>
            <div>
              <q-file ref="refFileUpload" v-model="model" filled bottom-slots counter>
                <template #append>
                  <q-icon v-if="model !== null" name="close" class="cursor-pointer" @click.stop.prevent="model = null" />
                </template>

                <template #hint>
                  ※ Only Excel files can be selected (Selectable Extensions : xls, xlsx)
                </template>

                <template #after>
                  <q-btn label="Select File" class="button" @click.stop.prevent="refUpload" />
                </template>
              </q-file>
            </div>
          </div>

        </q-card-section>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

// const { proxy } = getCurrentInstance()
// const emit = defineEmits(['cancel'])

const props = defineProps({
  propData: {
    type: Object,
    default: null
  },
  upload: {
    type: Function,
    default: null
  },
  attach: {
    type: Function,
    default: null
  }
})

const modal = ref()
const model = ref(null)
const refFileUpload = ref()

// 팝업 닫기
const modalHide = () => {
  modal.value.hide()
}

// SELECT FILE버튼 클릭시 파일 선택
const refUpload = () => {
  refFileUpload.value.pickFiles()
}

// Ok onClick 버튼 이벤트 처리
const onClickUpload = () => {
  props.upload()
  modalHide()
}

// Cancel onClick 버튼 이벤트 처리
const onClickCancel = () => {
  modalHide()
}
</script>
