<template>
  <template v-if="props.faqData && props.faqData.list.length > 0">
    <q-list bordered class="dropdown type03 mt-pc48-mo24">
      <q-expansion-item v-for="item in props.faqData.list" :key="item.faqId">
        <template #header>
          <q-item-section class="left-area">
            <div class="category-text">{{ item.faqCategory.text }}</div>
            <div class="cs-notice-text">{{ item.title }}</div>
          </q-item-section>
        </template>
        <q-card>
          <div v-clean-html="item.contents"></div>

          <ul class="file-info-area mt24 pd0">
            <li v-for="file in item.attachments" :key="file.faqAttachmentId" @click="() => onDownload(file)">
              <i :class="`ico ${file.attachmentExtension}`"></i>
              <span class="font-14 gray06-color block">{{ file.attachmentFileName }}</span>
            </li>
          </ul>
        </q-card>
      </q-expansion-item>
    </q-list>
  </template>

  <!-- 결과 없을경우 -->
  <div v-else class="cart-none-area faq-none-area">
    <img src="@assets/images/search_none.svg" alt="">
    <p class="title">{{ $t('SRH_NonResult') }}</p>
    <ul class="result-none-text-area max-w186">
      <li>{{ $t('SCH_CheckWrongInput') }}</li>
      <li>{{ $t('SCH_SearchOther') }}</li>
    </ul>
  </div>
</template>

<script setup>
import { addPrefixForImage } from '@/utils/common'
import http from '@/utils/http'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const props = defineProps({
  faqData: {
    type: Object,
    default: null
  }
})
const vCleanHtml = buildVueDompurifyHTMLDirective()
const onDownload = (file) => {
  http().downloadFileS3(addPrefixForImage(file.attachmentUrl), file.attachmentFileName + '.' + file.attachmentExtension)
}
</script>

<style lang="scss" scoped>

</style>
