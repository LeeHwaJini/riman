<!--
   반품내역
  create by jhchoi
-->
<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t('RET_Title') }}</h3>
    </div>

    <div>
      <!-- <div v-if="isPlanner" class="primary05-bg">
        <div class="order-list-explanation-area">
          <i class="ico question-b"></i>
          <b class="">{{ $t('ORD_IconText') }}</b>
        </div>
        <p class="font-14 gray07-color">{{ $t('ORD_IconText2') }}</p>
      </div> -->

      <div class="order-list-content">
        <div class="order-top-filter-area">

          <div class="input-date-area field">
            <RDatepickerGroup
              ref="datepickerGroup"
              v-model:startDate="searchForm.startDate"
              v-model:endDate="searchForm.endDate"
              :period="'3m'"
            />
          </div>

          <div class="flex-btn-area field">
            <RButton
              :label="$t('CM_Searching')"
              class="btn full small type02"
              @click="getReturnList"
            />
            <RButton
              :label="''"
              class="btn small type03 flex-shrink0 w44"
              @click="resetForm"
            >
              <template #content>
                <i class="ico reset"></i>
              </template>
            </RButton>
          </div>
        </div>

        <span class="status-msg font-16 mb16">
          {{ $t('RET_TooltipTitle') }} <i class="ico question pointer" @click="$notify(`<b class=font-12>${$t('RET_TooltipText1')}</b><span class=font-12>${$t('RET_TooltipText2')}</span><b class=font-12>${$t('RET_TooltipText3')}</b><span class=font-12>${$t('RET_TooltipText4')}</span><b class=font-12>${$t('RET_TooltipText5')}</b><span class=font-12>${$t('RET_TooltipText6')}</span><b class=font-12>${$t('RET_TooltipText7')}</b><span class=font-12>${$t('RET_TooltipText8')}</span>`, $t('RET_TooltipText9'), 'return-tooltip')"/>
        </span>

        <!-- 결과 없을경우 -->
        <div v-if="returnList.length === 0" class="cart-none-area">
          <img src="@assets/images/cart_none.svg" alt="">
          <p class="title">{{ $t('RET_NonResult1') }}</p>
          <span class="block mt16 font-14 gray02-color">{{ $t('RET_NonResult2') }}</span>
        </div>
        <!-- //결과 없을경우 -->

        <ul class="list type04">
          <!-- 상품 여러개 있을 경우  multiple class 추가-->
          <li v-for="(item, index) in returnList" :key="index" :class="[item.productCount > 1 ? 'multiple' : '']">
            <!-- 상품 여러개 있을 경우 노출 -->
            <div v-if="item.productCount > 1" class="prd-multiple"></div>
            <!-- //상품 여러개 있을 경우 노출 -->
            <div class="list-area">
              <div class="order-count-area">
                <span>{{ $t('CM_Total') }}</span>
                <span>{{ item?.productCount }}</span>
                <span>{{ $t('CM_Unit') }} {{ $t('CM_Product') }}</span>
              </div>

              <span v-if="item.userType?.code === 'CUSTOMER'" class="block font-10 gray03-color">{{ $t('ORD_Customer') }}</span>

              <div class="order-num-area">
                <!-- 정기구매일경우 -->
                <i v-if="item.orderType.code === 'AUTO_SHIP'" class="ico riman-coin-m small mr4" />
                <!-- //정기구매일경우 -->
                <div class="order-num-text font-14">
                  {{ item?.returnOrderBaseInfo?.returnOrderNumber }}
                </div>
                <div class="order-num-date font-14">{{ item?.returnOrderBaseInfo?.receptionDatetime }}</div>
              </div>

              <div class="order-prd-area">
                <div class="prd-img-area pointer" @click="router.push(`/product/detail/${item.productInfo?.productId}`)">
                  <img :src="addPrefixForImage(item.productInfo?.thumbnailUrl)" alt="">

                  <div class="prd-icon-area bottom-right">
                    <span v-if="item.productCount > 1" class="prd-icon count">{{ item?.productCount }}</span>
                  </div>
                </div>

                <div
                  v-if="item.quantity > 1"
                  class="prd-text pointer"
                  @click="router.push(`/product/detail/${item.productInfo?.productId}`)"
                >
                  {{ item?.productInfo?.productName }} {{ $t('CM_And') }} {{ item.quantity - 1 }}{{ $t('CM_Unit') }}
                </div>
                <div
                  v-else
                  class="prd-text pointer"
                  @click="router.push(`/product/detail/${item.productInfo?.productId}`)"
                >
                  {{ item?.productInfo?.productName }}
                </div>
              </div>

              <div class="order-detail-area mt16">
                <div class="flex align-center gap8">
                  <span class="font-16">{{ item?.returnOrderBaseInfo?.returnOrderStatus?.text }}</span>
                  <RButton
                    v-if="item.returnOrderBaseInfo?.returnOrderStatus?.code === 'RETURN_REQUEST'"
                    :label="$t('RET_ReturnComplete')"
                    class="btn type18"
                    @click="goToReturn(item)"
                  />
                </div>
                <router-link
                  v-if="item.returnOrderBaseInfo?.returnOrderStatus?.code !== 'RETURN_REQUEST'"
                  :to="{ name: 'ReturnDetail', query: { returnNumber: item?.returnOrderBaseInfo?.returnOrderNumber } }"
                  class="btn type13"
                >
                  {{ $t('RET_ViewReturnDetail') }}
                </router-link>
              </div>
            </div>
          </li>
        </ul>
        <div v-if="pageInfo.totalSize !== 0" class="postcode__pagination">
          <Pagination
            v-model:page-info="pageInfo"
            class-name="pagenation type03"
            @search-event="getReturnList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import mypageService from '@/http/services/mypage'
import { addPrefixForImage, checkPlanner } from '@/utils/common'

const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const isMobile = computed(() => proxy.$isMobile())
const returnList = ref([])
const datepickerGroup = ref(null)
const isPlanner = computed(() => checkPlanner())

const dateValue3 = ref(null)

const pageInfo = reactive({
  pageSize: 10,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5
})

const searchForm = reactive({
  startDate: null,
  endDate: null,
  pageSize: pageInfo.pageSize,
  pageNumber: pageInfo.pageNumber
})

const formatStartDateTime = (date) => {
  if (!date) return null
  return `${date} 00:00:00`
}

const formatEndDateTime = (date) => {
  if (!date) return null
  return `${date} 23:59:59`
}

const getReturnList = async () => {
  const params = {
    startDate: formatStartDateTime(searchForm.startDate),
    endDate: formatEndDateTime(searchForm.endDate),
    pageSize: pageInfo.pageSize,
    pageNumber: pageInfo.pageNumber
  }

  if (isMobile.value && pageInfo.pageNumber === 1) {
    returnList.value = []
  }

  const result = await mypageService.getReturnList(params)
  if (result) {
    if (isMobile.value) {
      returnList.value = returnList.value.concat(result.data.list)
    } else {
      returnList.value = result.data.list
    }
    pageInfo.totalSize = result.data.totalSize
  }
}

const resetForm = () => {
  searchForm.startDate = null
  searchForm.endDate = null
  searchForm.pageSize = pageInfo.pageSize
  searchForm.pageNumber = pageInfo.pageNumber

  datepickerGroup.value.init()
}

const goToReturn = (item) => {
  if (!item?.returnOrderBaseInfo?.isReceptionApproval) {
    proxy.$alert('요청된 건은 담당자가 확인 후 \n 반품 요청을 처리할 예정입니다. \n 반품 승인 완료 후 확인하실 수 있습니다.')
  } else {
    router.push({
      path: `/return/step3/${item?.returnOrderBaseInfo?.salesOrderId}`,
      state: {
        salesOrderId: item?.returnOrderBaseInfo?.salesOrderId,
        returnOrderNumber: item?.returnOrderBaseInfo?.returnOrderNumber
      }
    })
  }
}

onMounted(() => {
  getReturnList()
})
</script>

<style lang="scss" scoped>

</style>
