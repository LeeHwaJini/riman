<template>
  <div class="search-result-sub-title-area">
    <div class="text-area">
      <h3>{{ $t('NAV_News') }}</h3>
      <span v-if="data">{{ data?.totalSize }}</span>
    </div>
  </div>
  <template v-if="data && data.list.length > 0">
    <ul class="grid-list type05">
      <li v-for="item in data.list" :key="item.eventId">
        <div class="img-area" @click="router.push(`/update/news/${item.eventId}`)">
          <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
        </div>
        <div class="text-area">
          <span class="block event-date gray03-color">{{ formatDate(item.eventStartDate, DATE_FORMAT) }}</span>
          <div class="event-title" @click="router.push(`/update/news/${item.eventId}`)">{{ item.eventName }}</div>
          <p v-clean-html="item.eventSummary" class="content-text gray04-color"></p>
        </div>

      </li>
    </ul>
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

</template>
<script setup>
import searchService from '@/http/services/search'
import { addPrefixForImage } from '@/utils/common'
import { DATE_FORMAT } from '@/utils/constant'
import { formatDate } from '@/utils/dateFormat'
import { computed, onMounted, reactive, watch } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { useRouter } from 'vue-router'
const vCleanHtml = buildVueDompurifyHTMLDirective()
const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
})
const router = useRouter()
const pageInfo = reactive({
  pageSize: 4,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5
})
const newsParam = reactive({
  searchKeyword: computed(() => props.keyword),
  eventCategory: 'NEWS',
  pageSize: computed(() => pageInfo.pageSize),
  pageNumber: computed(() => pageInfo.pageNumber)
})

const { data } = searchService.getNewsSearch(newsParam)
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
