<template>
  <div class="search-result-sub-title-area">
    <div class="text-area">
      <h3>{{ $t('CS_FAQs') }}</h3>
      <span v-if="data">{{ data?.totalSize }}</span>
    </div>
  </div>

  <template v-if="data && data.list.length > 0">
    <q-list bordered class="dropdown type03 mt-pc48-mo24">
      <q-expansion-item v-for="item in data.list" :key="item.faqId">
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

    <Pagination
      v-model:page-info="pageInfo"
      class-name="pagenation type03"
      :is-more-btn="false"
    />
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
  <!-- //결과 없을경우 -->
</template>

<script setup>
import searchService from '@/http/services/search'
import { useMainStore } from '@/store/mainStore'
import { addPrefixForImage } from '@/utils/common'
import http from '@/utils/http'
import { computed, onMounted, reactive, watch } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
})
const vCleanHtml = buildVueDompurifyHTMLDirective()
const mainStore = useMainStore()
const pageInfo = reactive({
  pageSize: 8,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5
})
const faqParam = reactive({
  faqCategory: 'ALL',
  userType: mainStore.userInfo.userType ?? 'ALL',
  keyword: computed(() => props.keyword),
  pageSize: computed(() => pageInfo.pageSize),
  pageNumber: computed(() => pageInfo.pageNumber)
})
const { data } = searchService.getFaqSearch(faqParam)
const onDownload = (file) => {
  http().downloadFileS3(addPrefixForImage(file.attachmentUrl), file.attachmentFileName + '.' + file.attachmentExtension)
}
onMounted(() => {
  if (data.value) {
    pageInfo.totalPageNumber = data.value.totalPageNumber
    pageInfo.totalSize = data.value.totalSize
  }
})
watch(data, v => {
  if (v) {
    pageInfo.totalPageNumber = v.totalPageNumber
    pageInfo.totalSize = v.totalSize
  }
})
</script>

<style lang="scss" scoped>

</style>
