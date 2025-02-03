<template>
  <div class="search-result-sub-title-area">
    <div class="text-area">
      <h3>{{ $t('NAV_Event') }}</h3>
      <span v-if="eventIsProgressData && eventNotProgressData">{{ eventTotal }}</span>
    </div>
  </div>

  <RTabs :model-value="eventTab" :tab-list="tabList" class="tab type04" @update:model-value="onUpdateTab"/>
  <q-tab-panels v-model="eventTab" class="tab-list type04">
    <q-tab-panel name="progress">
      <ul v-if="eventIsProgressData && eventIsProgressData.list.length > 0" class="grid-list type03">
        <li v-for="item in eventIsProgressData.list" :key="item.eventId">
          <div class="img-area" @click="router.push(`/update/event/${item.eventId}?isInProgress=${eventTab === 'progress'}&sortType=NEWEST`)">
            <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
            <!-- 사용 안 할 경우 제거 -->

            <div class="prd-icon-area notic-icon-area">
              <span v-if="isRecentItem(item.eventStartDate, 14)" class="prd-icon new">NEW</span>
              <span v-if="getDday(item.eventdDate) > 5 && getDday(item.eventEndDate) <= 30" class="prd-icon date">D-{{ getDday(item.eventEndDate) }}</span>
              <span v-if="getDday(item.eventEndDate) <= 5" class="prd-icon deadline">{{ getDday(item.eventEndDate) === 0 ? $t('UP_EndToday') : $t('UP_EndSoon') }}</span>
            </div>
            <!-- //사용 안 할 경우 제거 -->
          </div>

          <div class="event-title">{{ item.eventName }}</div>

          <span class="event-date">{{ item.eventPeriod }}</span>
        </li>
      </ul>
      <!-- 결과 없을경우 -->
      <div v-else class="cart-none-area faq-none-area">
        <img src="@assets/images/search_none.svg" alt="">
        <p class="title">{{ $t('SRH_NonResult') }}</p>
        <ul class="result-none-text-area max-w186">
          <li>{{ $t('SCH_CheckWrongInput') }}</li>
          <li>{{ $t('SCH_SearchOther') }}</li>
        </ul>
      </div>
    </q-tab-panel>

    <q-tab-panel name="progressEnd">
      <ul v-if="eventNotProgressData && eventNotProgressData.list.length > 0" class="grid-list type03">
        <li v-for="item in eventNotProgressData.list" :key="item.eventId">
          <div class="img-area" @click="router.push(`/update/event/${item.eventId}?isInProgress=${eventTab === 'progress'}&sortType=NEWEST`)">
            <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
            <!-- 종료된 이벤트일 경우 추가 -->
            <div class="w-dim-area" />
            <!-- //종료된 이벤트일 경우 추가 -->
          </div>

          <div class="event-title">{{ item.eventName }}</div>

          <span class="event-date">{{ item.eventPeriod }}</span>
        </li>
      </ul>
      <!-- 결과 없을경우 -->
      <div v-else class="cart-none-area faq-none-area">
        <img src="@assets/images/search_none.svg" alt="">
        <p class="title">{{ $t('SRH_NonResult') }}</p>
        <ul class="result-none-text-area max-w186">
          <li>{{ $t('SCH_CheckWrongInput') }}</li>
          <li>{{ $t('SCH_SearchOther') }}</li>
        </ul>
      </div>
    </q-tab-panel>

  </q-tab-panels>

  <Pagination
    v-if="pageInfo.totalSize !== 0"
    v-model:page-info="pageInfo"
    class-name="pagenation type03"
    :is-more-btn="false"
  />
</template>

<script setup>
import searchService from '@/http/services/search'
import { useMainStore } from '@/store/mainStore'
import { addPrefixForImage, isRecentItem } from '@/utils/common'
import { getDday } from '@/utils/dateFormat'
import { isLogin } from '@/utils/login'
import { computed, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const { proxy } = getCurrentInstance()
const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
})
const isLogined = computed(() => isLogin())
const mainStore = useMainStore()
const eventTab = ref('progress')
const router = useRouter()
const tabList = computed(() => [
  { label: proxy.$t('UP_InProgressEvent'), name: 'progress' },
  { label: proxy.$t('UP_EndedEvent'), name: 'progressEnd' }
])
const pageInfo = reactive({
  pageSize: 8,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5
})
const eventIsProgressParam = reactive({
  searchKeyword: computed(() => props.keyword),
  eventCategory: 'EVENT',
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  isInProgress: true,
  sortType: 'NEWEST',
  pageSize: computed(() => pageInfo.pageSize),
  pageNumber: computed(() => pageInfo.pageNumber)
})
const eventNotProgressParam = reactive({
  searchKeyword: computed(() => props.keyword),
  eventCategory: 'EVENT',
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  isInProgress: false,
  sortType: 'NEWEST',
  pageSize: computed(() => pageInfo.pageSize),
  pageNumber: computed(() => pageInfo.pageNumber)
})
const { data: eventIsProgressData } = searchService.getEventSearch(eventIsProgressParam)
const { data: eventNotProgressData } = searchService.getEventSearch(eventNotProgressParam)
const eventTotal = computed(() => {
  return eventIsProgressData.value && eventNotProgressData.value ? eventIsProgressData.value.totalSize + eventNotProgressData.value.totalSize : 0
})
const data = computed(() => {
  if (eventIsProgressData.value && eventNotProgressData.value) {
    if (eventTab.value === 'progress') {
      return eventIsProgressData.value
    } else {
      return eventNotProgressData.value
    }
  } else {
    return null
  }
})
const onUpdateTab = (tab) => {
  eventTab.value = tab
  pageInfo.pageNumber = 1
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
