<!--
  FileUpload Component
  create by yjh (2024-03-25)
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
      width="830px"
      :move-able="true"
      :title="$t('CM_FileUpload')"
      :disabled-close-button="false"
      :footer-btn="[
        { type: 'action1', label: 'Upload', class: 'button button--success layer-button'},
        { type: 'action2', label: 'Close', class: 'button button--cancel layer-button' },
      ]"
      @action1Evt="onClickUpload"
      @action2Evt="onClickCancel"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <q-card-section>
          <div class="modal-layer t_center pb30">
            <div class="fileupload-layer">
              <div class="popCont">
                <RButton icon="download" class="bg_lightGray col-2" label="Attachment Form" @click="props.attach" />
              </div>
              <q-file ref="refFileUpload" v-model="model" class="w400 col-4 mr10" :accept="props.fileExtension" filled bottom-slots counter>
                <template #append>
                  <q-icon v-if="model !== null" name="close" class="cursor-pointer" @click.stop.prevent="model = null" />
                </template>

                <template #hint>
                  <p>※ (Selectable Extensions : {{ props.fileExtension }})</p>
                </template>
              </q-file>
              <RButton class="bg_gray col-2" label="Select File" @click.stop.prevent="refUpload" />
            </div>
          </div>

        </q-card-section>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
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
  },
  fileExtension: {
    type: String,
    default: '.xls, .xlsx, .pdf'
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
  if (model.value === null) {
    proxy.$alertError(proxy.$t('ALT_FileError'))
  } else {
    props.upload()
    modalHide()
  }
}

// Cancel onClick 버튼 이벤트 처리
const onClickCancel = () => {
  modalHide()
}
</script>
