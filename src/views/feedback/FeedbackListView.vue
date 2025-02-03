<template>
  <div class="max-width-wrap  full-width-wrap inquiry-wrap pb144">
    <div class="main-title-area">
      <h3 class="">고객의 소리 등록내역</h3>
    </div>

    <div class="inquiry-filter-area">
      <div class="text-area">
        <b>나의 등록내역</b>
        <span>(4)</span>
      </div>

      <RSelectBox
        v-model="param.sortOptions"
        :options="sortOptions"
        :disable="false"
        class="select-box type01"
        popup-content-class="select-list type03 small"
      />
    </div>
    <template v-if="queryListData && queryListData.content.length > 0">
      <ul class="border-bottom-list">
        <li v-for="item in 5" :key="item.inquiryId">
          <div class="text-area">
            <span v-if="0" class="font-12 error-color">{{ $t('CS_AnswerPending') }}</span>
            <span v-else class="font-12 success04-color">{{ $t('CS_AnswerFinish') }}</span>
            <div class="content-text">테스트 문의</div>
            <span class="date-text">2024-11-19 16:29:30</span>
          </div>
          <i class="ico arrow-right-light-g" />
        </li>
      </ul>

      <Pagination
        v-model:page-info="pageInfo"
        class-name="pagenation type03 mt-pc48-mo24"
        :is-more-btn="false"
      />

    </template>

    <!-- 데이터 없을 경우 -->
    <template v-else>
      <div class="cart-none-area">
        <img src="@assets/images/cart_none.svg" alt="">
        <p class="title">고객의 소리 등록 내역이 없어요.</p>
        <p class="text">{{ $t('CS_NeedHelp') }}</p>

        <RButton
          :label="'고객의 소리 등록하기'"
          class="btn medium type03"
          @click="$router.push('/feedback/write')"
        />
      </div>
      <!-- //데이터 없을 경우 -->

    </template>

  </div>

</template>

<script setup>
import customerService from '@/http/services/customer'
import { onMounted, ref, reactive, computed, getCurrentInstance, watch } from 'vue'
import { useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const inquiryCateList = [{
  label: '일반 문의',
  value: 'normal'
},
{
  label: '주문 후 문의',
  value: 'order'
}]
const inquiryCate = ref('normal')
const router = useRouter()
const sortOptions = [
  { label: proxy.$t('CM_Newest'), value: 'NEWEST' },
  { label: proxy.$t('CM_Oldest'), value: 'OLDEST' },
  { label: proxy.$t('CS_AnswerPending'), value: 'WAITING' },
  { label: proxy.$t('CS_AnswerFinish'), value: 'COMPLETE' }
]
const pageInfo = reactive({
  pageSize: 10,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5
})
console.log(pageInfo, 'p')

const param = reactive({
  pageSize: computed(() => pageInfo.pageSize),
  pageNumber: computed(() => pageInfo.pageNumber),
  isOrder: computed(() => inquiryCate.value === 'order'),
  sortOptions: 'NEWEST'
})
const { data: queryListData } = customerService.getInquiryList(param)

onMounted(() => {
  if (queryListData.value) {
    pageInfo.totalPageNumber = queryListData.value.totalPages
    pageInfo.totalSize = queryListData.value.totalElements
  }
})
watch(queryListData, v => {
  if (v) {
    pageInfo.totalPageNumber = v.totalPages
    pageInfo.totalSize = v.totalElements
  }
})
</script>

<style lang="scss" scoped>

</style>
