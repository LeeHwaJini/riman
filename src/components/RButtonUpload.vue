<!--
아이콘 클릭 시, 이미지 업로드
create by jhchoi (2024-03-29)
-->
<template>
  <q-file
    v-model="file"
    v-bind="props"
    class="input-upload"
    :max-file-size="maxFileSize"
    @rejected="rejected"
  >
    <!-- 파일 명 미 노출-->
    <template #file />
    <slot name="content" />
  </q-file>
</template>

<script setup>
import { getCurrentInstance } from 'vue'

const file = defineModel()
const { proxy } = getCurrentInstance()

const rejected = (e) => {
  if (e[0].failedPropValidation === 'max-file-size') {
    proxy.$alert(proxy.$t('ALT_ImageValidation', { size: props.maxFileSize / 1000000 }))
  }
}

const props = defineProps({
  stackLabel: {
    type: Boolean,
    default: true
  },
  maxFileSize: {
    type: Number,
    default: 20000000
  }
})
</script>
