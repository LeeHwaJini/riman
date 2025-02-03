<template>
  <template v-if="props.newsData && props.newsData.list.length > 0">
    <ul class="grid-list type05">
      <li v-for="item in props.newsData.list" :key="item.eventId">
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
import { DATE_FORMAT } from '@/utils/constant'
import { formatDate } from '@/utils/dateFormat'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { useRouter } from 'vue-router'

const props = defineProps({
  newsData: {
    type: Object,
    default: null
  }
})
const router = useRouter()
const vCleanHtml = buildVueDompurifyHTMLDirective()
</script>

