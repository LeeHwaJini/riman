<!--
파일 업로드
create by jhchoi (2024-03-29)
-->
<template>
  <q-file
    v-bind="props"
    ref="file"
    v-model="model"
    clearable
    bottom-slots
    stack-label
    class="input-file"
    input-class="file-name-text"
    clear-icon="close"
    no-error-icon
    @rejected="rejected"
  >
    <template #default>
      <div v-if="placeholderText !== '' && model === null" class="text-grey-6">
        {{ placeholderText }}
      </div>
    </template>
    <template v-if="hint !== ''" #hint>
      {{ hint }}
    </template>
    <template #append>
      <i class="ico file" @click="openFilePicker"></i>
    </template>
  </q-file>

</template>

<script setup>
import { defineProps, defineModel, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const props = defineProps({
  maxFiles: {
    type: Number,
    default: 3
  },
  label: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: '.xls, .xlsx, .pdf'
  },
  placeholderText: {
    type: String,
    default: ''
  },
  maxFileSize: {
    type: Number,
    default: 10000000
  }
})

const model = defineModel()

const openFilePicker = () => {
  proxy.$refs.file.pickFiles()
}

const rejected = (e) => {
  if (e[0].failedPropValidation === 'max-file-size') {
    proxy.$alert(proxy.$t('ALT_ImageValidation', { size: props.maxFileSize / 1000000 }))
  }
}
</script>
