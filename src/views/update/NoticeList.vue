<template>
  <div class="notic-wrap max-width-1400-wrap pb144 mo-pt-24">
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
        <RInput v-model="inputText" :placeholder="$t('CM_SearchComment')" class="login-input login-input--id " @keyup.enter="onSearchNoticeList"/>
        <RButton label="" @click="onSearchNoticeList">
          <template #content>
            <i class="ico search-g"></i>
          </template>
        </RButton>
      </div>
    </div>

    <div class="notic-area">
      <hgroup class="notic-title-area">
        <h4 class="primary09-color bold">{{ $t('NAV_Notice') }}</h4>
      </hgroup>
      <DataTable
        v-model:page-info="pageInfo"
        title=""
        :columns="columns"
        :row-data="notice"
        :is-pagination="notice.length !== 0"
        wrap-class-name="notic-list"
        hide-header
        :hide-no-data="true"
        :is-more-btn="false"
        @search-event="onSearchNoticeList"
      >
        <template #default="scope">
          <div :class="scope.value.isPinned ? 'list active' : 'list'">
            <div class="list-text-area" @click="router.push(`/update/notice/${scope.value.eventId}`)">
              <div class="flex align-center gap4 no-wrap">
                <div class="title-text gray09-color medium">{{ scope.value.eventName }}</div>
                <span :class="['notic-icon new', { 'opacity0': !isRecentItem(scope.value.date, 14) }]">N</span>

              </div>
              <span class="date-text gray03-color font-montserrat">{{ scope.value.date }}</span>
            </div>
            <i class="ico arrow-right-light-g flex-shrink0" @click="router.push(`/update/notice/${scope.value.eventId}`)"></i>
          </div>
        </template>
      </DataTable>

      <div v-if="notice.length === 0" class="cart-none-area">
        <img src="@assets/images/cart_none.svg" alt="">
        <p class="title">{{ $t('UP_NoNotice') }}</p>
        <ul class="result-none-text-area">
          <li>{{ $t('UP_NoticeWillNotify') }}</li>
          <li>{{ $t('CM_NoSearchResults') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, onMounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { useRouter } from 'vue-router'
import { formatDate } from '@/utils/dateFormat'
import updateService from '@/http/services/update'
import { useMainStore } from '@/store/mainStore'
import { isRecentItem } from '@/utils/common'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const router = useRouter()

const mainStore = useMainStore()

const { proxy } = getCurrentInstance()
const isMobile = computed(() => proxy.$isTablet())

const slides = computed(() => [proxy.$t('CM_All'), proxy.$t('NAV_Notice'), proxy.$t('NAV_Event'), proxy.$t('NAV_News')])
const activeSlide = ref(1)

const notice = ref([])
const inputText = ref('')

const pageInfo = reactive({
  pageSize: 15,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5
})

const columns = [
  {
    name: 'cellrender', // customerType 적용
    field: 'value',
    cellrender: [
      {
        type: 'html'
      }
    ]
  }]

onMounted(() => {
  if (isMobile.value) {
    pageInfo.pageSize = 10
    pageInfo.maxPagination = 3
  }

  onSearchNoticeList()
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

const onSearchNoticeList = async () => {
  window.scrollTo({
    top: 0
  })

  const params = {
    eventCategory: 'NOTICE',
    rank: mainStore.userInfo.rank ?? 'ALL',
    searchKeyword: inputText.value,
    pageNumber: pageInfo.pageNumber,
    pageSize: pageInfo.pageSize
  }

  const result = await updateService.getNoticeList(params)

  if (result) {
    notice.value = [...result.data.pinnedList, ...result.data.eventList.list]
      .map(item => {
        return { value: { eventName: item.eventName, date: formatDate(item.eventStartTime, 'YYYY-MM-DD'), eventId: item.eventId, isPinned: item.isPinned } }
      })

    pageInfo.totalSize = result.data.eventList.totalSize
  } else {
    notice.value = []
  }
}

</script>

<style lang="scss" scoped>

</style>
