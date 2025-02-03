<template>
  <DataTable
    v-if="props.noticeData && (props.noticeData.eventList.list.length > 0 || props.noticeData.pinnedList.length > 0)"
    title=""
    :columns="columns"
    :row-data="rowData"
    :is-pagination="false"
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
</template>

<script setup>
import { isRecentItem } from '@/utils/common'
import { DATE_FORMAT } from '@/utils/constant'
import { formatDate } from '@/utils/dateFormat'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  noticeData: {
    type: Object,
    default: null
  }
})
const router = useRouter()
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
function getPinnedList(data) {
  let _data = data.pinnedList ?? []
  if (_data.length > 3) {
    _data = _data.slice(0, 3)
  }
  return _data
}
function getEventList(data, pinnedListLength) {
  let _data = data.eventList.list ?? []
  switch (pinnedListLength) {
    case 0:
      _data = _data.slice(0, 5)
      break
    case 1:
      _data = _data.slice(0, 4)
      break
    case 2:
      _data = _data.slice(0, 3)
      break
    case 3:
      _data = _data.slice(0, 2)
      break
    default:
      break
  }
  return _data
}
function initNoticeList(data) {
  const pinndedListData = getPinnedList(data)
  const eventListadata = getEventList(data, pinndedListData.length)
  rowData.value = [...pinndedListData, ...eventListadata].map(item => ({ value: { eventName: item?.eventName, date: formatDate(item?.eventStartTime, DATE_FORMAT), eventId: item?.eventId, isPinned: item?.isPinned } }))
}
onMounted(() => {
  if (props.noticeData) {
    initNoticeList(props.noticeData)
  }
})
watch(props, v => {
  if (v.noticeData) {
    initNoticeList(props.noticeData)
  }
})

</script>
