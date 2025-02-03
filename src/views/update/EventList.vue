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
        <RInput v-model="inputText" :placeholder="$t('CM_SearchComment')" class="login-input login-input--id " @keyup.enter="onSearchEventList"/>
        <RButton label="" @click="onSearchEventList">
          <template #content>
            <i class="ico search-g"></i>
          </template>
        </RButton>
      </div>
    </div>

    <div class="notic-area">
      <hgroup class="notic-title-area">
        <h4 class="primary09-color bold">{{ $t('NAV_Event') }}</h4>
      </hgroup>

      <div class="event-top-area">
        <div class="event-select-area">
          <RSelectBox
            v-if="eventTab === 'progress'"
            v-model="selectSortType"
            :options="sortOptions"
            :disable="false"
            class="select-box type01"
            popup-content-class="select-list type03"
            @update:model-value="onSearchEventList"
          />
        </div>

        <RTabs v-model="eventTab" :tab-list="tabList" class="tab type04" @update:model-value="onSearchEventList"/>
      </div>

      <q-tab-panels v-model="eventTab" class="tab-list type04">
        <q-tab-panel name="progress">
          <ul class="grid-list type03">
            <li v-for="item in event" :key="item.eventId">
              <div class="img-area" @click="router.push(`/update/event/${item.eventId}?isInProgress=${item.isInProgress}&sortType=${item.sortType}`)">
                <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
                <div class="prd-icon-area notic-icon-area">
                  <span v-if="isRecentItem(item.startDate, 14)" class="prd-icon new">NEW</span>
                  <span v-if="getDday(item.endDate) > 5 && getDday(item.endDate) <= 30" class="prd-icon date">D-{{ getDday(item.endDate) }}</span>
                  <span v-if="getDday(item.endDate) <= 5" class="prd-icon deadline">{{ getDday(item.endDate) === 0 ? $t('UP_EndToday') : $t('UP_EndSoon') }}</span>
                </div>
              </div>

              <div class="event-title" @click="router.push(`/update/event/${item.eventId}?isInProgress=${item.isInProgress}&sortType=${item.sortType}`)">{{ item.eventName }}</div>
              <span class="event-date">{{ item.period }}</span>
            </li>
          </ul>

          <Pagination
            v-if="pageInfo.totalSize !== 0"
            v-model:page-info="pageInfo"
            class-name="pagenation type03"
            :is-more-btn="false"
            @search-event="onSearchEventList"
          />
        </q-tab-panel>
        <q-tab-panel name="progressEnd">
          <ul class="grid-list type03">
            <li v-for="item in endEvent" :key="item.eventId">
              <div class="img-area" @click="router.push(`/update/event/${item.eventId}?isInProgress=${item.isInProgress}`)">
                <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
                <div class="w-dim-area" />
              </div>

              <div class="event-title">{{ item.eventName }}</div>
              <span class="event-date">{{ item.period }}</span>
            </li>
          </ul>
          <Pagination
            v-if="pageInfo.totalSize !== 0"
            v-model:page-info="pageInfo"
            class-name="pagenation type03"
            :is-more-btn="false"
            @search-event="onSearchEventList"
          />
        </q-tab-panel>
      </q-tab-panels>

      <div
        v-if="isNoData() && eventTab === 'progress'"
        class="cart-none-area"
      >
        <img src="@assets/images/cart_none.svg" alt="">
        <p class="title">{{ $t('UP_NoEvent') }}</p>
        <ul class="result-none-text-area">
          <li>{{ $t('UP_EventWillNotify') }}</li>
          <li>{{ $t('CM_NoSearchResults') }}</li>
        </ul>
      </div>

      <div v-if="isNoData() && eventTab === 'progressEnd'" class="notic-none-area gray02-color bold">
        {{ $t('UP_NoEndedEvent') }}
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store/mainStore'
import updateService from '@/http/services/update'
import { getDday, isSameOrAfter, isSameOrBefore, nowDate, subtractDate } from '@/utils/dateFormat'
import { addPrefixForImage, isRecentItem } from '@/utils/common'

const modules = [Autoplay, FreeMode, Scrollbar, Navigation]
const router = useRouter()

const mainStore = useMainStore()

const { proxy } = getCurrentInstance()
const isMobile = computed(() => proxy.$isTablet())

const slides = computed(() => [proxy.$t('CM_All'), proxy.$t('NAV_Notice'), proxy.$t('NAV_Event'), proxy.$t('NAV_News')])
const activeSlide = ref(2)

const event = ref([])
const endEvent = ref([])
const inputText = ref('')

const pageInfo = reactive({
  pageSize: 12,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5
})

onMounted(() => {
  if (isMobile.value) {
    pageInfo.pageSize = 4
    pageInfo.maxPagination = 3
  }

  onSearchEventList()
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

const onSearchEventList = async () => {
  window.scrollTo({
    top: 0
  })

  const params = {
    eventCategory: 'EVENT',
    rank: mainStore.userInfo.rank ?? 'ALL',
    searchKeyword: inputText.value,
    isInProgress: eventTab.value === 'progress',
    sortType: selectSortType.value,
    pageNumber: pageInfo.pageNumber,
    pageSize: pageInfo.pageSize
  }

  const result = await updateService.getEventList(params)

  if (result) {
    const wholeEvent = result.data.list.map(item => {
      return {
        eventId: item.eventId,
        eventName: item.eventName,
        startDate: item.eventStartDate,
        endDate: item.eventEndDate,
        period: item.eventPeriod,
        thumbnailImageUrl: item.thumbnailImageUrl,
        isEndEvent: !isSameOrBefore(nowDate(), item.eventEndDate) &&
                     isSameOrAfter(item.eventStartDate, subtractDate(nowDate(), 'YYYY-MM-DD', { year: 1 })), // 1년 이내 시작한 이벤트만 노출
        isInProgress: eventTab.value === 'progress',
        sortType: selectSortType.value
      }
    })

    event.value = wholeEvent.filter(item => !item.isEndEvent)
    endEvent.value = wholeEvent.filter(item => item.isEndEvent)
    pageInfo.totalSize = result.data.totalSize
  }
}

const eventTab = ref('progress')

const tabList = computed(() => [
  { label: proxy.$t('UP_InProgressEvent'), name: 'progress' },
  { label: proxy.$t('UP_EndedEvent'), name: 'progressEnd' }
])

const selectSortType = ref('NEWEST')

const sortOptions = computed(() => [
  { label: proxy.$t('CM_Newest'), value: 'NEWEST' },
  { label: proxy.$t('CM_EndingSoon'), value: 'ENDING_SOON' }
])

const isNoData = () => {
  const isProgressTab = eventTab.value === 'progress'
  const isProgressEndTab = eventTab.value === 'progressEnd'
  const isEventEmpty = event.value.length === 0
  const isEndEventEmpty = endEvent.value.length === 0

  return (isProgressTab && isEventEmpty) || (isProgressEndTab && isEndEventEmpty)
}

</script>

<style lang="scss" scoped>

</style>
