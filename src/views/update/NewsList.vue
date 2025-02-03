<template>
  <div class="notic-wrap max-width-1400-wrap mo-pt-24 pb144">
    <h3 class="bold mt96 mb48 primary09-color main-title-area">{{ $t('NAV_NoticeAndEvent') }}</h3>

    <swiper
      :slides-per-view="'auto'"
      :free-mode="true"
      :pagination="{
        type: 'progressbar',
        clickable: true,
      }"
      :navigation="true"
      :modules="modules"
      class="category-option-area slide-bar-color-none mo-ml16"
    >
      <swiper-slide
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ active: activeSlide === index }"
        @click="setActiveSlide(index)"
      >
        {{ slide }}
      </swiper-slide>
    </swiper>

    <div class="notice-search">
      <div class="input-search type02 mt24">
        <RInput v-model="inputText" :placeholder="$t('CM_SearchComment')" class="login-input login-input--id " @keyup.enter="onSearchNewsList"/>
        <RButton label="" @click="onSearchNewsList">
          <template #content>
            <i class="ico search-g"></i>
          </template>
        </RButton>
      </div>
    </div>

    <div class="notic-area">
      <hgroup class="notic-title-area">
        <h4 class="primary09-color bold">{{ $t('NAV_News') }}</h4>
      </hgroup>

      <ul class="grid-list type05">
        <li v-for="item in news" :key="item">
          <div class="img-area" @click="router.push(`/update/news/${item.eventId}`)">
            <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
          </div>
          <div class="text-area">
            <span class="block event-date gray03-color">{{ formatDate(item.eventStartDate, 'YYYY-MM-DD') }}</span>
            <div class="event-title" @click="router.push(`/update/news/${item.eventId}`)">{{ item.eventName }}</div>
            <p v-if="item.eventSummary" v-clean-html="item.eventSummary" class="content-text gray04-color"></p>
          </div>

        </li>
      </ul>
      <Pagination
        v-if="pageInfo.totalSize !== 0"
        v-model:page-info="pageInfo"
        class-name="pagenation type03"
        :is-more-btn="false"
        @search-event="onSearchNewsList"
      />
      <div v-if="news.length === 0" class="cart-none-area">
        <img src="@assets/images/cart_none.svg" alt="">
        <p class="title">{{ $t('UP_NoNews') }}</p>
        <ul class="result-none-text-area">
          <li>{{ $t('UP_NewsWillNotify') }}</li>
          <li>{{ $t('CM_NoSearchResults') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { useRouter } from 'vue-router'
import updateService from '@/http/services/update'
import { addPrefixForImage } from '@/utils/common'
import { formatDate } from '@/utils/dateFormat'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const modules = [Autoplay, FreeMode, Scrollbar, Navigation]
const router = useRouter()

const { proxy } = getCurrentInstance()
const isMobile = computed(() => proxy.$isTablet())

const slides = computed(() => [proxy.$t('CM_All'), proxy.$t('NAV_Notice'), proxy.$t('NAV_Event'), proxy.$t('NAV_News')])
const activeSlide = ref(3)

const news = ref([])
const inputText = ref('')

const pageInfo = reactive({
  pageSize: 8,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5
})
const vCleanHtml = buildVueDompurifyHTMLDirective()

onMounted(() => {
  if (isMobile.value) {
    pageInfo.pageSize = 5
    pageInfo.maxPagination = 3
  }

  onSearchNewsList()
})

const setActiveSlide = (index) => {
  activeSlide.value = index
  switch (index) {
    case 0:
      router.push('/update')
      break
    case 1:
      router.push('/update/notice')
      break
    case 2:
      router.push('/update/event')
      break
    case 3:
      router.push('/update/news')
      break
    default:
      router.push('/update')
  }
}

const onSearchNewsList = async () => {
  window.scrollTo({
    top: 0
  })

  const params = {
    eventCategory: 'NEWS',
    searchKeyword: inputText.value,
    pageNumber: pageInfo.pageNumber,
    pageSize: pageInfo.pageSize
  }

  const result = await updateService.getNewsList(params)

  if (result) {
    news.value = result.data.list
    pageInfo.totalSize = result.data.totalSize
  }
}

</script>

<style lang="scss" scoped>

</style>
