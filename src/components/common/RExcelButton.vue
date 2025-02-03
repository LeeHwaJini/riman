<!--
ISMS 다운로드 버튼
create by jhchoi (2024-03-29)
-->
<template>
  <RButton v-if="isShowExcelBtn" icon="download" :label="$t('CM_ExcelDown')" v-bind="props" @click="onBtnClick"/>
</template>

<script setup>
import { defineProps, ref, defineEmits, onMounted } from 'vue'
import http from '@utils/http'
import aesCipher from '@/utils/aesCipher'
const emit = defineEmits(['onClick'])

const props = defineProps({
  class: {
    type: String,
    default: ''
  },
  disable: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'isms' // isms, default
  }
})

const onBtnClick = (e) => {
  emit('onClick', e)
}

const isShowExcelBtn = ref(false)
const checkAllowIp = async () => {
  // const response = await http().url('/abo/member/sys/check-personal-info-download-allow-ip').post()
  // if (response) {
  //   const encResult = aesCipher.serverSideDecrypt(response.data)
  //   isShowExcelBtn.value = encResult
  // }
  isShowExcelBtn.value = true
}

onMounted(() => {
  if (props.type === 'isms') {
    checkAllowIp()
  } else {
    isShowExcelBtn.value = true
  }
})
</script>
