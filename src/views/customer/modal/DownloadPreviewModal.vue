<template>
  <FullPageModalWider ref="modal">
    <template #title>
      <h4>{{ props.data?.title }}</h4>
    </template>
    <template #body>
      <div>
        <template v-if="props.data?.attachmentUrl.length > 0">
          <div class="download-icon-area">
            {{ $t('CS_DownloadAll') }}
            <i class="ico download" @click="onDownloadAll" />
          </div>

          <ul class="file-info-area resource-file-info-area">
            <li
              v-for="(url, index) in props.data?.attachmentUrl"
              :key="url"
              @click="onDownload(url, index)"
            >
              <i :class="`ico ${getExtentionName(index)}`" />
              <span class="font-14 gray06-color block">{{ props.data?.attachmentFileName[index] }} </span>
            </li>
          </ul>
        </template>

        <div
          v-clean-html="props.data?.content"
          class="download-img-area scroll type01"
        ></div>
      </div>
    </template>
  </FullPageModalWider>
</template>

<script setup>
import { addPrefixForImage } from '@/utils/common'
import http from '@/utils/http'
import { ref } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
const modal = ref(null)
const vCleanHtml = buildVueDompurifyHTMLDirective()
const onDownload = (url, index) => {
  http().downloadFileS3(
    addPrefixForImage(url),
    props.data?.attachmentFileName[index]
  )
}
const onDownloadAll = () => {
  props.data.attachmentUrl.map((url, index) => {
    onDownload(url, index)
  })
}

function show() {
  modal.value.show()
}
function getExtentionName(index) {
  let extentionName = ''
  const arr = props.data?.attachmentFileName[index].split('.')
  extentionName = arr[arr.length - 1]
  return extentionName.toLowerCase()
}
defineExpose({
  show
})
</script>

<style lang="scss" scoped></style>
