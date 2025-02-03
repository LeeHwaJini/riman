<template>
  <h6 class="bold pd16 gray07-color">{{ $t('PT_History') }}</h6>

  <div class="">
    <div class="order-top-filter-area pd16">
      <div class="input-date-area field">
        <RDatepickerGroup
          ref="datePicker"
          v-model:startDate="pageState.startDate"
          v-model:endDate="pageState.endDate"
        />
      </div>

      <div class="flex-btn-area field">
        <RButton
          :label="$t('CM_Searching')"
          class="btn full small type02"
          @click="onSearch"
        />
        <RButton
          :label="''"
          class="btn small type03 flex-shrink0 w44"
          @click="onResetForm"
        >
          <template #content>
            <i class="ico reset"></i>
          </template>
        </RButton>
      </div>
    </div>

    <ul v-if="pointList && pointList.length > 0" ref="listWrap" class="point-list">
      <li v-for="item in pointList" :key="item.pointHistorySummaryId">
        <div class="date-text-area">
          <span>{{ item.pointChangeDateTime.split(' ')[0] + ' (' +generateWeek(item.dayOfWeek) + ') ' + item.pointChangeDateTime.split(' ')[1] }}</span>
        </div>

        <!--
        class="error-color" //차감
        class="success04-color" //적립
        -->
        <div class="flex align-center justify-between" :class="{'success04-color' : item.changePoint >= 0, 'error-color' : item.changePoint < 0}">
          <span class="left-text">{{ item.changePoint >= 0 ? $t('PT_Earning') : $t('PT_Subtract') }}</span>
          <div class="right-text font-14">
            <b>{{ $moneyFormat(item.changePoint) }}</b>P
          </div>
        </div>

        <div class="flex align-center justify-between gray05-color mt4 font-12">
          <span>{{ item.returnOrderNumber ?? item.salesOrderNumber }}</span>
          <div class="right-text flex align-center gap2">
            <span>{{ $t('PT_Remain') }}</span>
            <span class="medium">{{ $moneyFormat(item.totalPoint) }}</span>
            <span>P</span>
          </div>
        </div>
      </li>
    </ul>
    <div
      v-else
      class="cart-none-area"
    >
      <img src="@assets/images/cart_none.svg" alt="">
      <p class="title">{{ $t('PT_Empty_txt1') }}</p>
      <ul class="result-none-text-area">
        <li>{{ $t('PT_Empty_txt2') }}</li>
        <li>{{ $t('RET_NonResult2') }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import orderService from '@/http/services/order'
import { getCurrentInstance, onMounted, onUnmounted, reactive, ref, watch } from 'vue'

const pointList = ref([])
const listWrap = ref()
const isFetchingNextPage = ref(false)
const isLastPage = ref(false)
const datePicker = ref()
const { proxy } = getCurrentInstance()
const pageState = reactive({
  pageSize: 10,
  pageNumber: 1,
  startDate: null,
  endDate: null,
  typeSearch: 'ALL'
})
const onSearch = () => {
  pageState.pageNumber = 1
  getPointList('search')
}
const onResetForm = () => {
  datePicker.value.init()
}
function fetchNext() {
  if (!listWrap.value) return
  const productListBottom = listWrap.value.getBoundingClientRect().bottom
  const windowHeight = window.innerHeight
  if (productListBottom <= windowHeight) {
    if (!isFetchingNextPage.value && !isLastPage.value) {
      pageState.pageNumber += 1
      getPointList()
    }
  }
}
async function getPointList(type) {
  isFetchingNextPage.value = true
  const res = await orderService.getPointList(pageState)
  if (res) {
    if (type === 'search') {
      pointList.value = res.data.list
    } else {
      pointList.value = [...pointList.value, ...res.data.list]
    }
    isLastPage.value = res.data.pageNumber === res.data.totalPageNumber
  }
  isFetchingNextPage.value = false
}
function generateWeek(week) {
  switch (week) {
    case 'MONDAY':
      return proxy.$t('CM_Monday')
    case 'TUESDAY':
      return proxy.$t('CM_Tuesday')
    case 'WEDNESDAY':
      return proxy.$t('CM_Wednesday')
    case 'THURSDAY':
      return proxy.$t('CM_Thursday')
    case 'FRIDAY':
      return proxy.$t('CM_Friday')
    case 'SATURDAY':
      return proxy.$t('CM_Saturday')
    case 'SUNDAY':
      return proxy.$t('CM_Sunday')
    default:
      break
  }
}
onMounted(() => {
  getPointList()
})
onUnmounted(() => {
  document.removeEventListener('scroll', fetchNext)
})
watch(listWrap, v => {
  if (v) {
    document.addEventListener('scroll', fetchNext)
  }
})
</script>

  <style lang="scss" scoped>

  </style>
