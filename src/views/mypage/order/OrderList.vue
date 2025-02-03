<!--
  주문내역
  create by jhchoi
-->
<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t('ORD_OrderList') }}</h3>
    </div>

    <!--
    소비자일 경우 tab 제거
    *소비자일 경우  <q-tab-panel name="tab1"> 안에 있는 내용으로 레이아웃 구성
    -->
    <div v-if="isPlanner">
      <RTabs
        v-model="tabValue"
        :tab-list="filteredTabList"
        class="tab type02"
      />
      <!-- //소비자일 경우 tab 제거 -->

      <q-tab-panels v-model="tabValue" class="tab-list type02">
        <q-tab-panel name="tab1">
          <div v-if="isChangePlanner" class="primary05-bg">
            <div class="order-list-explanation-area">
              <i class="ico question-b"></i>
              <b class="">{{ $t('ORD_IconText') }}</b>
            </div>
            <p class="font-14 gray07-color">{{ $t('ORD_IconText2') }}</p>
          </div>

          <div class="order-list-content">
            <div class="order-top-filter-area">
              <RSelectBox
                v-model="searchFormTab1.salesOrderHistoryType"
                :placeholder-text="$t('CM_All')"
                :options="selectOptions"
                :disable="false"
                class="select-box type04 field"
              />

              <div class="input-date-area field">
                <RDatepickerGroup
                  ref="datepickerGroup"
                  v-model:startDate="searchFormTab1.startDate"
                  v-model:endDate="searchFormTab1.endDate"
                  :period="'3m'"
                />
              </div>

              <div class="flex-btn-area field">
                <RButton
                  :label="$t('CM_Searching')"
                  class="btn full small type02"
                  @click="getOrderList"
                />
                <RButton
                  :label="''"
                  class="btn small type03 flex-shrink0 w44 flex align-center justify-center"
                  @click="resetForm"
                >
                  <template #content>
                    <i class="ico reset"></i>
                  </template>
                </RButton>
              </div>
            </div>

            <!-- 결과 없을경우 -->
            <div v-if="orderList.length === 0" class="cart-none-area">
              <img src="@assets/images/cart_none.svg" alt="">
              <p class="title">{{ $t('SRH_NonResult') }}</p>
              <ul class="result-none-text-area">
                <li>{{ $t('SRH_NonResult2') }}</li>
                <li>{{ $t('SRH_NonResult3') }}</li>
                <li>{{ $t('SRH_NonResult4') }}</li>
              </ul>

              <RButton class="btn medium type11" :label="$t('ORD_RboDesc')" @click="goRbo" />
            </div>
            <!-- //결과 없을경우 -->

            <ul class="list type04">
              <li v-for="(item, index) in orderList" :key="index" :class="[item.productInfos.length > 1 ? 'multiple' : '']">
                <!-- 상품 여러개 있을 경우 노출 -->
                <div v-if="item.productInfos.length > 1" class="prd-multiple"></div>
                <!-- //상품 여러개 있을 경우 노출 -->
                <div class="list-area">
                  <div class="order-count-area">
                    <span>{{ $t('CM_Total') }}</span>
                    <span>{{ item.productInfos.length }}</span>
                    <span>{{ $t('CM_Unit') }} {{ $t('CM_Product') }}</span>
                  </div>

                  <span v-if="item.userType?.code === 'CUSTOMER'" class="block font-10 gray03-color">{{ $t('ORD_Customer') }}</span>

                  <div class="order-num-area">
                    <!-- 정기구매일경우 -->
                    <i v-if="item.orderType.code === 'AUTO_SHIP'" class="ico riman-coin-m small mr4" />
                    <!-- //정기구매일경우 -->
                    <div class="order-num-text font-14">
                      {{ item.salesOrderNumber }}
                    </div>
                    <div class="order-num-date font-14">{{ item.orderDateTime }}</div>
                  </div>
                  <div class="order-prd-area">
                    <div class="prd-img-area pointer" @click="router.push({ name: 'orderDetail', query: { orderId: item.salesOrderId } })">
                      <img :src="addPrefixForImage(item.productInfos[0]?.thumbnailUrl)" alt="">

                      <div class="prd-icon-area bottom-right">
                        <span v-if="item.productInfos.length > 1" class="prd-icon count">{{ item.productInfos.length }}</span>
                      </div>
                    </div>

                    <div
                      v-if="item.productInfos.length > 1"
                      class="prd-text pointer"
                      @click="router.push({ name: 'orderDetail', query: { orderId: item.salesOrderId } })"
                    >
                      {{ item.productInfos[0]?.productName }} {{ $t('CM_And') }} {{ item.productInfos.length - 1 }}{{ $t('CM_Unit') }}
                    </div>
                    <div
                      v-else
                      class="prd-text pointer"
                      @click="router.push({ name: 'orderDetail', query: { orderId: item.salesOrderId } })"
                    >
                      {{ item.productInfos[0]?.productName }}
                    </div>
                  </div>

                  <div class="order-payment-area sp-bp-payment-area">
                    <div class="field">
                      <span>{{ $t('ORD_PaymentAmount') }}</span>
                      <div class="price-area">
                        <span>{{ $moneyFormat(item.salesAmount) }}</span>
                        <span>{{ $t('CM_Won') }}</span>
                      </div>
                    </div>

                    <div class="field align-start">
                      <span>{{ $t('PT_Earning') }} SP | BP</span>
                      <div class="sp-bp-price-area">
                        <div class="price-area">
                          <span>{{ $moneyFormat(item.spFinal) }}</span>
                          <span>SP</span>
                        </div>

                        <div class="price-area">
                          <span>{{ $moneyFormat(item.bpFinal) }}</span>
                          <span>BP</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="order-detail-area">
                    <span>{{ item.orderStatus.text }}</span>
                    <router-link
                      :to="{ name: 'orderDetail', query: { orderId: item.salesOrderId } }"
                      class="btn type13"
                    >
                      {{ $t('ORD_ViewOrderDetail') }}
                    </router-link>
                  </div>
                </div>

              </li>
            </ul>
            <div v-if="pageInfo.totalSize !== 0" class="postcode__pagination">
              <Pagination
                v-model:page-info="pageInfo"
                :is-more-btn="false"
                class-name="pagenation type03"
                @search-event="getOrderList"
              />
            </div>
          </div>

        </q-tab-panel>
        <q-tab-panel
          name="tab2"
        >
          <div class="primary05-bg">
            <div class="order-list-explanation-area">
              <i class="ico question-b"></i>
              <b class="">{{ $t('ORD_IconText3') }}</b>
            </div>
            <p class="font-14 gray07-color">
              *{{ $t('ORD_IconText4') }}<br>
              *{{ $t('ORD_IconText5') }}<br>
              *{{ $t('ORD_IconText6') }}
            </p>
          </div>

          <div class="">
            <div class="order-top-filter-area mt24 plr16">
              <RSelectBox
                v-model="searchFormTab2.salesOrderHistoryType"
                :placeholder-text="$t('CM_All')"
                :options="selectOptions2"
                :disable="false"
                class="select-box type04 field"
              />

              <div class="input-date-area field">
                <RDatepickerGroup
                  ref="datepickerGroup"
                  v-model:startDate="searchFormTab2.searchStartDate"
                  v-model:endDate="searchFormTab2.searchEndDate"
                  :period="'3m'"
                />
              </div>

              <div class="field">
                <RInput
                  v-model="searchFormTab2.keyword"
                  :placeholder="$t('SRH_SearchComment2')"
                  class="login-input login-input--id"
                />
              </div>

              <div class="flex-btn-area field">
                <RButton
                  :label="$t('CM_Searching')"
                  class="btn full small type02"
                  @click="getDirectOrderList"
                />
                <RButton
                  :label="''"
                  class="btn small type03 flex-shrink0 w44 flex align-center justify-center"
                  @click="resetForm2"
                >
                  <template #content>
                    <i class="ico reset"></i>
                  </template>
                </RButton>
              </div>
            </div>

            <span v-if="orderDirectList.length > 1" class="font-12 gray04-color block mb16 plr16">* {{ $t('ORD_ScrollText') }}</span>

            <!-- 결과 없을경우 -->
            <div v-if="orderDirectList.length === 0" class="cart-none-area">
              <img src="@assets/images/cart_none.svg" alt="">
              <p class="title">{{ $t('SRH_NonResult') }}</p>
              <ul class="result-none-text-area">
                <li>{{ $t('SRH_NonResult2') }}</li>
                <li>{{ $t('SRH_NonResult3') }}</li>
                <li>{{ $t('SRH_NonResult4') }}</li>
              </ul>

              <RButton class="btn medium type11" :label="$t('ORD_RboDesc')" @click="goRbo" />
            </div>
            <!-- //결과 없을경우 -->

            <div v-else class="flex">
              <div class="table type01 scroll">
                <table class="">
                  <thead>
                    <tr>
                      <th class="text-center">{{ $t('ORD_Column1') }}</th>
                      <th class="text-center">{{ $t('ORD_Column2') }}</th>
                      <th class="text-center">{{ $t('ORD_Column3') }}</th>
                      <th class="text-center">{{ $t('ORD_Column4') }}</th>
                      <th class="text-center">SP/BP</th>
                      <th class="text-center">{{ $t('ORD_Column5') }}</th>
                      <th class="text-center">{{ $t('ORD_Column6') }}</th>
                      <th class="text-center">{{ $t('ORD_Column7') }}</th>
                      <th class="text-center">{{ $t('ORD_Column8') }}</th>
                      <th class="text-center">{{ $t('ORD_Column9') }}</th>
                      <th class="text-center">{{ $t('ORD_Column10') }}</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr class="top-tr">
                      <td colspan="3" class="total-sum-text">{{ $t('ORD_TotalSum') }}</td>
                      <td>{{ $moneyFormat(totalOrderSum) }}</td>
                      <td>{{ $moneyFormat(totalSp) }} / {{ $moneyFormat(totalBp) }}</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>

                    <tr v-for="(item, index) in orderDirectList" :key="index">
                      <td>{{ item.orderDate }}</td>
                      <td>{{ item.orderWorkType?.text }}</td>
                      <td>{{ item.userName }}</td>
                      <td>{{ $moneyFormat(item.orderSum) }}</td>
                      <td>{{ $moneyFormat(item.spFinal) }} / {{ $moneyFormat(item.bpFinal) }}</td>
                      <td>{{ item.orderNo }}</td>
                      <td>{{ item.orderType?.text }}</td>
                      <td>{{ item.orderStatus?.text }}</td>
                      <td>{{ item.userEmail }}</td>
                      <td>{{ item.phoneNumber }}</td>
                      <td>{{ item.userRank?.text }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="pageInfo.totalSize !== 0" class="postcode__pagination">
              <Pagination
                v-model:page-info="pageInfo"
                :is-more-btn="false"
                class-name="pagenation type03"
                @search-event="getDirectOrderList"
              />
            </div>

          </div>
          <!-- <div class="bottom-btn">
            <RButton class="btn full small type11" :label="$t('ORD_RboDesc')" @on-click="$router.push('')" />
          </div> -->
        </q-tab-panel>
      </q-tab-panels>
    </div>

    <div v-else>
      <div class="order-list-content">
        <div v-if="isLogined" class="order-top-filter-area">
          <RSelectBox
            v-model="searchFormTab1.salesOrderHistoryType"
            :placeholder-text="$t('CM_All')"
            :options="selectOptions"
            :disable="false"
            class="select-box type04 field"
          />

          <div class="input-date-area field">
            <RDatepickerGroup
              ref="datepickerGroup"
              v-model:startDate="searchFormTab1.startDate"
              v-model:endDate="searchFormTab1.endDate"
              :period="'3m'"
            />
          </div>

          <div class="flex-btn-area field">
            <RButton
              :label="$t('CM_Searching')"
              class="btn full small type02"
              @click="getOrderList"
            />
            <RButton
              :label="''"
              class="btn small type03 flex-shrink0 w44 flex align-center justify-center"
              @click="resetForm"
            >
              <template #content>
                <i class="ico reset"></i>
              </template>
            </RButton>
          </div>
        </div>
        <div v-else class="order-top-filter-area">
          <RSelectBox
            v-model="searchFormTab3.salesOrderHistoryType"
            :placeholder-text="$t('CM_All')"
            :options="selectOptions3"
            :disable="false"
            class="select-box type04 field"
          />

          <div class="input-date-area field">
            <RDatepickerGroup
              ref="datepickerGroup"
              v-model:startDate="searchFormTab3.startDate"
              v-model:endDate="searchFormTab3.endDate"
              :period="'3m'"
            />
          </div>

          <div class="flex-btn-area field">
            <RButton
              :label="$t('CM_Searching')"
              class="btn full small type02"
              @click="getNonMemberOrderList(tempId)"
            />
            <RButton
              :label="''"
              class="btn small type03 flex-shrink0 w44 flex align-center justify-center"
              @click="resetForm3"
            >
              <template #content>
                <i class="ico reset"></i>
              </template>
            </RButton>
          </div>
        </div>

        <!-- 결과 없을경우 -->
        <div v-if="orderList.length === 0" class="cart-none-area">
          <img src="@assets/images/cart_none.svg" alt="">
          <p class="title">{{ $t('SRH_NonResult') }}</p>
          <ul class="result-none-text-area">
            <li>{{ $t('SRH_NonResult2') }}</li>
            <li>{{ $t('SRH_NonResult3') }}</li>
            <li>{{ $t('SRH_NonResult4') }}.</li>
          </ul>

        </div>
        <!-- //결과 없을경우 -->

        <ul class="list type04">
          <li v-for="(item, index) in orderList" :key="index" :class="[item.productInfos.length > 1 ? 'multiple' : '']">
            <!-- 상품 여러개 있을 경우 노출 -->
            <div v-if="item.productInfos.length > 1" class="prd-multiple"></div>
            <!-- //상품 여러개 있을 경우 노출 -->
            <div class="list-area">
              <div class="order-count-area">
                <span>{{ $t('CM_Total') }}</span>
                <span>{{ item.productInfos.length }}</span>
                <span>{{ $t('CM_Unit') }} {{ $t('CM_Product') }}</span>
              </div>

              <span v-if="item.userType?.code === 'CUSTOMER'" class="block font-10 gray03-color">{{ $t('ORD_Customer') }}</span>

              <div class="order-num-area">
                <!-- 정기구매일경우 -->
                <i v-if="item.orderType.code === 'AUTO_SHIP'" class="ico riman-coin-m small mr4" />
                <!-- //정기구매일경우 -->
                <div class="order-num-text font-14">
                  {{ item.salesOrderNumber }}
                </div>
                <div class="order-num-date font-14">{{ item.orderDateTime }}</div>
              </div>
              <div class="order-prd-area">
                <div class="prd-img-area pointer" @click="router.push({ name: 'orderDetail', query: { orderId: item.salesOrderId, tempId: tempId } })">
                  <img :src="addPrefixForImage(item.productInfos[0]?.thumbnailUrl)" alt="">

                  <div class="prd-icon-area bottom-right">
                    <span v-if="item.productInfos.length > 1" class="prd-icon count">{{ item.productInfos.length }}</span>
                  </div>
                </div>

                <div
                  v-if="item.productInfos.length > 1"
                  class="prd-text pointer"
                  @click="router.push({ name: 'orderDetail', query: { orderId: item.salesOrderId, tempId: tempId } })"
                >
                  {{ item.productInfos[0]?.productName }} {{ $t('CM_And') }} {{ item.productInfos.length - 1 }}{{ $t('CM_Unit') }}
                </div>
                <div
                  v-else
                  class="prd-text pointer"
                  @click="router.push({ name: 'orderDetail', query: { orderId: item.salesOrderId, tempId: tempId } })"
                >
                  {{ item.productInfos[0]?.productName }}
                </div>
              </div>

              <div class="order-payment-area">
                <span>{{ $t('ORD_PaymentAmount') }}</span>
                <div class="price-area">
                  <span>{{ $moneyFormat(item.salesAmount) }}</span>
                  <span>{{ $t('CM_Won') }}</span>
                </div>
              </div>

              <div v-if="tempId" class="order-detail-area">
                <span>{{ item.orderStatus.text }}</span>
                <router-link
                  :to="{ name: 'orderDetail', query: { orderId: item.salesOrderId, tempId: tempId } }"
                  class="btn type13"
                >
                  {{ $t('ORD_ViewOrderDetail') }}
                </router-link>
              </div>
              <div v-else class="order-detail-area">
                <span>{{ item.orderStatus.text }}</span>
                <router-link
                  :to="{ name: 'orderDetail', query: { orderId: item.salesOrderId } }"
                  class="btn type13"
                >
                  {{ $t('ORD_ViewOrderDetail') }}
                </router-link>
              </div>
            </div>

          </li>
        </ul>

        <div v-if="pageInfo.totalSize !== 0 && isLogined" class="postcode__pagination">
          <Pagination
            v-model:page-info="pageInfo"
            :is-more-btn="false"
            class-name="pagenation type03"
            @search-event="getOrderList"
          />
        </div>
        <div v-if="pageInfo.totalSize !== 0 && !isLogined" class="postcode__pagination">
          <Pagination
            v-model:page-info="pageInfo"
            :is-more-btn="false"
            class-name="pagenation type03"
            @search-event="getNonMemberOrderList(tempId)"
          />
        </div>
      </div>
    </div>

    <responsive-modal
      ref="nonMemberOrder"
      :title="$t('ORD_ChangeReg')"
      class="regular-buy-modal bottom-btn-modal"
    >
      <template #description>

      </template>
    </responsive-modal>

  </div>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import orderService from '@/http/services/order'
import personalMallService from '@/http/services/personalMall'
import { useMainStore } from '@store/mainStore'
import order from '@/router/modules/order'
import { addPrefixForImage, checkPlanner } from '@/utils/common'
import { isLogin } from '@/utils/login'
import { format } from '@utils/format'

const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const mainStore = useMainStore()
const userInfo = mainStore.userInfo

const tabValue = ref('tab1')
const orderList = ref([])
const orderDirectList = ref([])
const isPlanner = computed(() => checkPlanner())
const tempId = ref(null)
const isLogined = computed(() => isLogin())
// const isMobile = computed(() => proxy.$isMobile())
const totalSp = ref(0)
const totalBp = ref(0)
const totalSpBp = ref('')
const totalOrderSum = ref('')
const datepickerGroup = ref(null)
const isChangePlanner = ref(true)

const selectOptions = computed(() => [
  { label: proxy.$t('CM_All'), value: 'ALL' },
  { label: proxy.$t('ORD_Normal'), value: 'NORMAL' }
])
const selectOptions2 = computed(() => [
  { label: proxy.$t('CM_All'), value: 'ALL' },
  { label: proxy.$t('ORD_Normal'), value: 'NORMAL' },
  { label: proxy.$t('ORD_EasyBag'), value: 'EASY_BAG' },
  { label: proxy.$t('ORD_GuestOrder'), value: 'GUEST' }
])

const selectOptions3 = computed(() => [
  { label: proxy.$t('CM_All'), value: 'ALL' },
  { label: proxy.$t('ORD_GuestOrder'), value: 'GUEST' },
  { label: proxy.$t('ORD_EasyBag'), value: 'EASY_BAG' },
  { label: proxy.$t('ORD_DiveIn'), value: 'DIVE_IN_ORDER' }
])

const tabList = computed(() => [
  { label: proxy.$t('ORD_MyOrder'), name: 'tab1' },
  { label: proxy.$t('ORD_MyDirectOrder'), name: 'tab2' }
])

const filteredTabList = computed(() => {
  return isPlanner.value ? tabList.value : tabList.value.filter(tab => tab.name !== 'tab2')
})

const pageInfo = reactive({
  pageSize: 10,
  pageNumber: 1,
  totalPageNumber: null,
  totalSize: null,
  maxPagination: 5
})

const searchFormTab1 = reactive({
  startDate: null,
  endDate: null,
  salesOrderHistoryType: 'ALL',
  pageSize: pageInfo.pageSize,
  pageNumber: pageInfo.pageNumber
})

const searchFormTab2 = reactive({
  searchStartDate: null,
  searchEndDate: null,
  salesOrderHistoryType: 'ALL',
  keyword: '',
  pageSize: pageInfo.pageSize,
  pageNumber: pageInfo.pageNumber
})

const searchFormTab3 = reactive({
  identification: null,
  startDate: null,
  endDate: null,
  salesOrderHistoryType: 'ALL',
  pageSize: pageInfo.pageSize,
  pageNumber: pageInfo.pageNumber
})

const dateType = ref(null)

const formatStartDateTime = (date) => {
  if (!date) return null
  return `${date} 00:00:00`
}

const formatEndDateTime = (date) => {
  if (!date) return null
  return `${date} 23:59:59`
}

const nonMemberOrder = ref()

const onOpenModal = () => {
  proxy.$refs.nonMemberOrder.show()
}

const getOrderList = async () => {
  const params = {
    startDate: formatStartDateTime(searchFormTab1.startDate),
    endDate: formatEndDateTime(searchFormTab1.endDate),
    salesOrderHistoryType: searchFormTab1.salesOrderHistoryType,
    pageSize: pageInfo.pageSize,
    pageNumber: pageInfo.pageNumber
  }

  const result = await orderService.getOrderList(params)
  if (result) {
    const updatedList = result.data.list.map(transformOrderStatus)
    orderList.value = updatedList
    pageInfo.totalPageNumber = result.data.totalPageNumber
    pageInfo.totalSize = result.data.totalSize
  }
}

const getDirectOrderList = async () => {
  const params = {
    searchStartDate: formatStartDateTime(searchFormTab2.searchStartDate),
    searchEndDate: formatEndDateTime(searchFormTab2.searchEndDate),
    salesOrderHistoryType: searchFormTab2.salesOrderHistoryType,
    keyword: searchFormTab2.keyword,
    pageSize: pageInfo.pageSize,
    pageNumber: pageInfo.pageNumber
  }

  const result = await orderService.getDirectOrderList(params)
  if (result.data) {
    orderDirectList.value = result.data.list
    getDirectOrderTotal(params)
    pageInfo.totalPageNumber = result.data.totalPageNumber
    pageInfo.totalSize = result.data.totalSize
  }
}

const getDirectOrderTotal = async (param) => {
  const response = await orderService.getDirectOrderTotal(param)
  if (response.data) {
    totalSp.value = response.data.totalSp
    totalBp.value = response.data.totalBp
    totalSpBp.value = `${totalSp.value} / ${totalBp.value}`
    totalOrderSum.value = response.data.totalOrderAmount
  }
}

const getNonMemberOrderList = async (id) => {
  const params = {
    identification: id,
    startDate: formatStartDateTime(searchFormTab3.startDate),
    endDate: formatEndDateTime(searchFormTab3.endDate),
    salesOrderHistoryType: searchFormTab3.salesOrderHistoryType,
    pageSize: pageInfo.pageSize,
    pageNumber: pageInfo.pageNumber
  }

  const result = await orderService.getNonMemberOrderList(params)
  if (result) {
    const updatedList = result.data.list.map(transformOrderStatus)
    orderList.value = updatedList
    pageInfo.totalPageNumber = result.data.totalPageNumber
    pageInfo.totalSize = result.data.totalSize
  }
  if (orderList.value.length === 0) {
    await proxy.$alert(proxy.$t('ORD_AltText'))
    return
  }
}

const resetForm = () => {
  searchFormTab1.startDate = null
  searchFormTab1.endDate = null
  searchFormTab1.salesOrderHistoryType = 'ALL'
  searchFormTab1.pageSize = pageInfo.pageSize
  searchFormTab1.pageNumber = pageInfo.pageNumber

  datepickerGroup.value.init()
}

const resetForm2 = () => {
  searchFormTab2.searchStartDate = null
  searchFormTab2.searchEndDate = null
  searchFormTab2.keyword = ''
  searchFormTab2.salesOrderHistoryType = 'ALL'
  searchFormTab2.pageSize = pageInfo.pageSize
  searchFormTab2.pageNumber = pageInfo.pageNumber

  datepickerGroup.value.init()
}

const resetForm3 = () => {
  searchFormTab3.identification = null
  searchFormTab3.startDate = null
  searchFormTab3.endDate = null
  searchFormTab3.salesOrderHistoryType = 'ALL'
  searchFormTab3.pageSize = pageInfo.pageSize
  searchFormTab3.pageNumber = pageInfo.pageNumber

  datepickerGroup.value.init()
}

const transformOrderStatus = (order) => {
  if (order.orderStatus.text === proxy.$t('ORD_OrderStatus1') || order.orderStatus.text === proxy.$t('ORD_OrderStatus2')) {
    order.orderStatus.text = proxy.$t('ORD_OrderStatus1')
  } else if (order.orderStatus.text === proxy.$t('ORD_OrderStatus3')) {
    order.orderStatus.text = proxy.$t('ORD_OrderStatus4')
  } else if (order.orderStatus.text === proxy.$t('ORD_OrderStatus6')) {
    order.orderStatus.text = proxy.$t('ORD_OrderStatus7')
  }
  return order
}

const getIsChangePlanner = async () => {
  const params = {
    userNumber: userInfo.userNumber
  }

  const result = await personalMallService.getPersonalMall(params)

  if (result) {
    isChangePlanner.value = result.data.isChangePlanner
  }
}

const goRbo = () => {
  window.location.href = import.meta.env.VITE_APP_RBO_URL
}

onMounted(() => {
  tempId.value = route.query.tempId
  if (tempId.value) {
    getNonMemberOrderList(tempId.value)
  } else {
    getIsChangePlanner()
    getOrderList()
  }
})

watch(isPlanner, (newVal) => {
  if (!newVal && tabValue.value === 'tab2') {
    tabValue.value = 'tab1'
  }
})

watch(tabValue, (newTabValue) => {
  // pageInfo 초기화
  pageInfo.pageSize = 10
  pageInfo.pageNumber = 1
  pageInfo.totalPageNumber = null
  pageInfo.totalSize = null
  pageInfo.maxPagination = 5

  // tabValue에 따라 함수 호출
  if (newTabValue === 'tab1') {
    getOrderList()
  } else if (newTabValue === 'tab2') {
    getDirectOrderList()
  }
})
</script>

<style lang="scss" scoped>

</style>
