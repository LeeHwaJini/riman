<template>
  <div class="notic-wrap search-result-wrap max-width-1400-wrap pb144">
    <div v-if="keyword !== ''" class="search-result-title-area">
      <h3 class="bold gray07-color ">‘<span class="primary04-color">{{ keyword.length > 8 ? keyword.slice(0, 8) + '...' : keyword }}</span>’ {{ $t('SCH_Result') }}</h3>
      <div class="result-count-text">
        {{ $t('CM_Total') }} <span class="text-underline type02 primary04-color">{{ total }}</span>건
      </div>
    </div>
    <div class="notice-search result-search">
      <div class="input-search type02 mt24">
        <RInput v-model.trim="inputText" :placeholder="$t('CM_EnterKeyword')" class="login-input login-input--id " @keyup.enter="onSearch"/>
        <RButton label="" @click="onSearch">
          <template #content>
            <i class="ico search-g"></i>
          </template>
        </RButton>
      </div>
    </div>

    <swiper
      :slides-per-view="'auto'"
      :free-mode="true"
      :pagination="{
        type: 'progressbar',
        clickable: true,
      }"
      :navigation="true"
      :modules="modules"
      class="category-option-area slide-bar-color-none mt24"
    >
      <swiper-slide
        v-for="tab in tabs"
        :key="tab.value"
        :class="{ active: activeSlide === tab.value }"
        @click="() => onClickTab(tab.value)"
      >
        {{ tab.label }} <span class="ml6">{{ tab.count }}</span>
      </swiper-slide>
    </swiper>
    <template v-if="!isFirstRender">
      <!--전체보기 탭-->
      <template v-if="activeSlide === 'ALL'">
        <!-- //상품 -->
        <div class="search-result-sub-title-area">
          <div class="text-area">
            <h3>{{ $t('CM_Product') }}</h3>
            <span>{{ productTotal }}</span>
          </div>
          <a href="javascript::void(0)" class="mypage-more-btn" @click.prevent="onClickTab('PRODUCT')">{{ $t('CM_LoadMore') }}</a>
        </div>
        <ProductList :product-data="productListData"/>

        <!-- //상품 -->

        <!-- 이벤트 -->
        <div class="search-result-sub-title-area">
          <div class="text-area">
            <h3>{{ $t('NAV_Event') }}</h3>
            <span>{{ eventTotal }}</span>
          </div>
          <a href="javascript::void(0)" class="mypage-more-btn" @click.prevent="onClickTab('EVENT')">{{ $t('CM_LoadMore') }}</a>
        </div>
        <EventList :event-is-progress-data="eventIsProgressListData" :event-not-progress-data="eventNotProgressListData"/>
        <!-- //이벤트 -->

        <!-- 공지사항 -->
        <div class="search-result-sub-title-area">
          <div class="text-area">
            <h3>{{ $t('NAV_Notice') }}</h3>
            <span>{{ noticeTotal }}</span>
          </div>
          <a href="javascript::void(0)" class="mypage-more-btn" @click.prevent="onClickTab('NOTICE')">{{ $t('CM_LoadMore') }}</a>
        </div>

        <NoticeList :notice-data="noticeListData"/>
        <!-- //공지사항 -->

        <!-- 리만 뉴스 -->
        <div class="search-result-sub-title-area">
          <div class="text-area">
            <h3>{{ $t('NAV_News') }}</h3>
            <span>{{ newsTotal }}</span>
          </div>
          <!-- 상세보기일때는 제거 -->
          <a href="javascript::void(0)" class="mypage-more-btn" @click.prevent="onClickTab('NEWS')">{{ $t('CM_LoadMore') }}</a>
        </div>
        <NewsList :news-data="newsListData" />
        <!-- //리만 뉴스 -->

        <!-- FAQ -->
        <div class="search-result-sub-title-area">
          <div class="text-area">
            <h3>{{ $t('CS_FAQs') }}</h3>
            <span>{{ faqTotal }}</span>
          </div>
          <!-- 상세보기일때는 제거 -->
          <a href="javascript::void(0)" class="mypage-more-btn" @click.prevent="onClickTab('FAQ')">{{ $t('CM_LoadMore') }}</a>
        </div>
        <FaqList :faq-data="faqListData" />
      <!-- // FAQ -->
      </template>
      <ProductTab v-if="activeSlide === 'PRODUCT'" :keyword="keyword"/>
      <EventTab v-if="activeSlide === 'EVENT'" :keyword="keyword"/>
      <NoticeTab v-if="activeSlide === 'NOTICE'" :keyword="keyword"/>
      <NewsTab v-if="activeSlide === 'NEWS'" :keyword="keyword"/>
      <FaqTab v-if="activeSlide === 'FAQ'" :keyword="keyword"/>
    </template>
  </div>

</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import ProductTab from './tabs/ProductTab.vue'
import NewsTab from './tabs/NewsTab.vue'
import FaqTab from './tabs/FaqTab.vue'
import EventTab from './tabs/EventTab.vue'
import { useMainStore } from '@/store/mainStore'
import searchService from '@/http/services/search'
import NoticeTab from './tabs/NoticeTab.vue'
import ProductList from './components/ProductList.vue'
import EventList from './components/EventList.vue'
import NoticeList from './components/NoticeList.vue'
import NewsList from './components/NewsList.vue'
import FaqList from './components/FaqList.vue'
import { isLogin } from '@/utils/login'
import { useRoute, useRouter } from 'vue-router'
import productService from '@/http/services/product'
import progressHelper from '@/utils/progressHelper'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const keyword = ref('')
const inputText = ref(route.query.keyword ?? '')
const activeSlide = ref(route.query.tab ?? 'ALL')
const isLogined = computed(() => isLogin())
const isFirstRender = ref(true)
const productTotal = computed(() => {
  return data.value ? data.value.pages[0].data.totalSize : 0
})
const eventTotal = computed(() => {
  return eventIsProgressListData.value && eventNotProgressListData.value ? eventIsProgressListData.value.totalSize + eventNotProgressListData.value.totalSize : 0
})
const noticeTotal = computed(() => {
  return noticeListData.value ? noticeListData.value.eventList.totalSize + noticeListData.value.pinnedList.length : 0
})
const newsTotal = computed(() => {
  return newsListData.value ? newsListData.value.totalSize : 0
})
const faqTotal = computed(() => {
  return faqListData.value ? faqListData.value.totalSize : 0
})
const total = computed(() => {
  return productTotal.value + eventTotal.value + noticeTotal.value + newsTotal.value + faqTotal.value
})
const tabs = computed(() => [
  { label: proxy.$t('CM_All'), value: 'ALL', count: total },
  { label: proxy.$t('CM_Product'), value: 'PRODUCT', count: productTotal },
  { label: proxy.$t('NAV_Event'), value: 'EVENT', count: eventTotal },
  { label: proxy.$t('NAV_Notice'), value: 'NOTICE', count: noticeTotal },
  { label: proxy.$t('NAV_News'), value: 'NEWS', count: newsTotal },
  { label: proxy.$t('CS_FAQs'), value: 'FAQ', count: faqTotal }
])
const mainStore = useMainStore()
const userId = mainStore.getUser.userSeqNo

const noticeParam = reactive({
  searchKeyword: computed(() => keyword.value),
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  pageNumber: 1,
  pageSize: 5
})
const eventIsProgressParam = reactive({
  searchKeyword: computed(() => keyword.value),
  eventCategory: 'EVENT',
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  isInProgress: true,
  sortType: 'NEWEST',
  pageNumber: 1,
  pageSize: 4
})
const eventNotProgressParam = reactive({
  searchKeyword: computed(() => keyword.value),
  eventCategory: 'EVENT',
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  isInProgress: false,
  sortType: 'NEWEST',
  pageNumber: 1,
  pageSize: 4
})
const newsParam = reactive({
  searchKeyword: computed(() => keyword.value),
  eventCategory: 'NEWS',
  pageNumber: 1,
  pageSize: 4
})
const faqParam = reactive({
  faqCategory: 'ALL',
  userType: mainStore.userInfo.userType ?? 'ALL',
  keyword: computed(() => keyword.value),
  pageNumber: 1,
  pageSize: 5
})
const { data } = searchService.getProductSearch(keyword, userId)
const param = computed(() => data.value && data.value.pages[0].data.list)
const { data: productListData, isFetching: isFetchingProduct } = productService.getUpperProductsByIds(param, 'get-product-search', userId)
const { data: noticeListData, isFetching: isFetchingNotice } = searchService.getNoticeSearch(noticeParam)
const { data: eventIsProgressListData, isFetching: isFetchingEventIs } = searchService.getEventSearch(eventIsProgressParam)
const { data: eventNotProgressListData, isFetching: isFetchingEventNot } = searchService.getEventSearch(eventNotProgressParam)
const { data: newsListData, isFetching: isFetchingNews } = searchService.getNewsSearch(newsParam)
const { data: faqListData, isFetching: isFetchingFaq } = searchService.getFaqSearch(faqParam)
const isFetching = computed(() => isFetchingProduct.value || isFetchingNotice.value || isFetchingEventIs.value || isFetchingEventNot.value || isFetchingNews.value || isFetchingFaq.value)
const onSearch = () => {
  if (isFirstRender.value) {
    isFirstRender.value = false
  }
  if (inputText.value !== '') {
    router.push({
      name: 'Search',
      query: {
        keyword: inputText.value,
        tab: activeSlide.value
      }
    })
  }
}
const onClickTab = (tab) => {
  router.replace({
    name: 'Search',
    query: {
      keyword: inputText.value,
      tab
    }
  })
}

onMounted(() => {
  if (route.query.keyword && route.query.keyword !== '') {
    isFirstRender.value = false
  }
  if (!route.query.keyword) return
  keyword.value = route.query.keyword
})
watch(isFetching, v => {
  if (v) {
    progressHelper.show()
  } else {
    progressHelper.hide()
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>

</style>
