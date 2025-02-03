<!--
이미지 업로드
create by jhchoi (2024-03-29)
-->
<template>
  <q-uploader
    v-bind="props"
    ref="uploader"
    @added="onUpdate"
    @removed="onUpdate"
    @rejected="rejected"
  >
    <template #header="scope">
      <div v-for="file in scope.files" :key="file.__key" class="btn file-upload">
        <img :src="file.__img.src">
        <RButton
          class="btn file-close"
          @click="async () => {
            if(await onRemove()) {
              scope.removeFile(file)
            }
          }" >
          <template #content>
            <i class="ico close"></i>
          </template>
        </RButton>
      </div>

      <RButton v-if="scope.files.length < filesCount" :key="index" class="btn file-upload" :icon="`img:${CameraIcon}`" @click="scope.pickFiles">
        <template #content>
          <q-uploader-add-trigger />
        </template>
      </RButton>
    </template>

  </q-uploader>
</template>
<script setup>
import { defineProps, getCurrentInstance, ref } from 'vue'
import CameraIcon from '@/assets/images/icons/ico_camera.svg'

const { proxy } = getCurrentInstance()

const emit = defineEmits(['fileUpdated'])
const uploader = ref(null)

const onUpdate = () => {
  emit('fileUpdated', uploader.value.files)
}

const onRemove = async () => {
  return new Promise((resolve) => {
    proxy.$confirm(proxy.$t('UTI_ConfRemoveImage'), {
      title: '',
      ok: () => {
        resolve(true)
      },
      cancel: () => {
        resolve(false)
      },
      okLabel: proxy.$t('CM_Delete')
    })
  })
}

const rejected = (e) => {
  console.log('rejected')

  if (e[0].failedPropValidation === 'max-files') {
    proxy.$alert(proxy.$t('UTI_ValidateMaxFiles', { maxFiles: props.maxFiles }))
  }

  if (e[0].failedPropValidation === 'max-file-size') {
    proxy.$alert(proxy.$t('UTI_ValidateMaxFileSize', { maxFiles: props.maxFileSize / 1000 }))
  }
}
const reset = () => {
  uploader.value.reset()
}
const props = defineProps({
  maxFiles: {
    type: Number,
    default: 3
  },
  maxFileSize: {
    type: Number,
    default: 20000000
  },
  label: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  accept: {
    type: String,
    default: '.jpeg, .jpg, .png'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  filesCount: {
    type: Number,
    default: 3
  }
})
defineExpose({
  reset
})
</script>
