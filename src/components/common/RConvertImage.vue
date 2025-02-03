<!--
ISMS > 이미지 경로 암호화
create by jhchoi (2024-03-29)
-->
<template>
  <img :src="imageUrl" @click="onImageClick">
</template>

<script setup>
import { defineProps, ref, defineEmits, onMounted } from 'vue'
import http from '@utils/http'
const emit = defineEmits(['onClick'])

const props = defineProps({
  url: {
    type: String,
    default: ''
  }
})

const onImageClick = (e) => {
  emit('onClick', e)
}

const imageUrl = ref('')
const getImage = async (url) => {
  try {
    const response = await http().convertImage(url, { responseType: 'arraybuffer' })
    if (response) {
      const contentType = response.headers['content-type']
      const binaryData = Buffer.from(response.data, 'binary')
      const base64 = binaryData.toString('base64')
      const dataUrl = `data:${contentType};base64,${base64}`
      imageUrl.value = dataUrl
    }
  } catch (e) {
    console.log(e)
  }
}

onMounted(async () => {
  getImage(props.url)
})
</script>
