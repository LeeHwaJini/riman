<template>
  <div class="search-result-sub-title-area">
    <div class="text-area">
      <h3>{{ $t('NAV_Notice') }}</h3>
      <span v-if="data">{{ data?.eventList.totalSize + data?.pinnedList.length }}</span>
    </div>
  </div>

  <DataTable
    v-if="data && (data.eventList.list.length > 0 || data.pinnedList.length > 0)"
    v-model:page-info="pageInfo"
    title=""
    :columns="columns"
    :row-data="rowData"
    :is-pagination="true"
    wrap-class-name="notic-list"
    hide-header
  >
    <template #default="scope">
      <div class="list" :class="{active: scope.value.isPinned}">
        <div class="list-text-area" @click="router.push(`/update/notice/${scope.value.eventId}`)">
          <div class="flex align-center gap4 no-wrap">
            <div class="title-text gray09-color font-16 medium">{{ scope.value.eventName }}</div>
            <!-- 뱃지 사용 안 할 경우 제거 -->
            <span v-if="isRecentItem(scope.value.date, 14)" class="ico new flex-shrink0">N</span>
            <!-- //뱃지 사용 안 할 경우 제거 -->
          </div>
          <span class="date-text gray03-color font-montserrat">{{ scope.value.date }}</span>
        </div>
        <i class="ico arrow-right-light-g flex-shrink0" @click="router.push(`/update/notice/${scope.value.eventId}`)"></i>
      </div>
    </template>
  </DataTable>

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
import { isRecentItem } from '@/utils/common'
import { DATE_FORMAT } from '@/utils/constant'
import { formatDate } from '@/utils/dateFormat'
import { isLogin } from '@/utils/login'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
const isLogined = computed(() => isLogin())
const mainStore = useMainStore()
const router = useRouter()
const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
})
const rowData = ref()
const columns = [
  {
    name: 'cellrender', // customerType 적용
    field: 'value',
    cellrender: [
      {
        type: 'html'
      }
    ]
  }
]

const pageInfo = reactive({
  pageSize: 5,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5
})

const noticeParam = reactive({
  searchKeyword: computed(() => props.keyword),
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  pageNumber: computed(() => pageInfo.pageNumber),
  pageSize: computed(() => pageInfo.pageSize)
})

const { data } = searchService.getNoticeSearch(noticeParam)
function initNoticeList(data) {
  rowData.value = [...data.pinnedList, ...data.eventList.list].map(item => ({ value: { eventName: item?.eventName, date: formatDate(item?.eventStartTime, DATE_FORMAT), eventId: item?.eventId, isPinned: item?.isPinned } }))
  pageInfo.totalPageNumber = data.eventList.totalPageNumber
  pageInfo.totalSize = data.eventList.totalSize
}
onMounted(() => {
  if (data.value) {
    initNoticeList(data.value)
  }
})
watch(data, v => {
  if (v) {
    initNoticeList(v)
  }
})

</script>

<style lang="scss" scoped>

</style>
