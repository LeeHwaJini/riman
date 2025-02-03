<!--
   반품상세
  create by jhchoi
-->
<template>
  <div class="max-width-wrap full-width-wrap pb144">

    <div class="main-title-area">
      <h3 class="">{{ $t('RET_Title') }}</h3>
    </div>

    <!-- <div class="order-list-detail-top-area block">
      <div class="font-14 gray07-color mb4">{{ returnOrderBaseInfo?.returnOrderNumber }}</div>
      <router-link
        :to="{ name: 'orderDetail', query: { orderId: returnOrderBaseInfo?.salesOrderId } }"
        class="btn type13"
      >
        기존 주문내역이 궁금하다면?
      </router-link>
    </div> -->

    <div class="order-list-detail-top-area block">
      <div class="flex justify-between mb4">
        <div class="font-14 gray07-color">{{ returnOrderBaseInfo?.returnOrderNumber }}</div>
        <div class="font-14 gray07-color">{{ returnOrderBaseInfo?.receptionCompletionDatetime }}</div>
      </div>
      <div class="flex justify-between">
        <div class="font-14 primary09-color medium">{{ $t('RET_ReturnDesc1') }}</div>
        <router-link
          v-if="tempId"
          :to="{ name: 'orderDetail', query: { orderId: returnOrderBaseInfo?.salesOrderId, tempId: tempId } }"
          class="btn type13"
        >
          {{ returnOrderBaseInfo?.salesOrderNumber }}
        </router-link>
        <router-link
          v-else
          :to="{ name: 'orderDetail', query: { orderId: returnOrderBaseInfo?.salesOrderId } }"
          class="btn type13"
        >
          {{ returnOrderBaseInfo?.salesOrderNumber }}
        </router-link>
      </div>
    </div>

    <h6 class="ptb24 mlr16 bold gray07-color">{{ $t('RET_SubTitle') }}</h6>

    <span class="block mb8 plr16 font-14 primary09-color medium">{{ returnOrderBaseInfo?.returnOrderStatus?.text }}</span>

    <ul class="delivery-order-area plr16">
      <li>
        <div
          v-if="tempId"
          class="flex-layout">
          <div
            class="prd-img-area pointer"
            @click="router.push(`/product/detail/${productFirst?.productId}`)"
          >
            <img :src="addPrefixForImage(productFirst?.thumbnailUrl)" alt="">
          </div>
          <div class="delivery-order-info-area">
            <div
              class="prd-name pointer"
              @click="router.push(`/product/detail/${productFirst?.productId}`)"
            >
              {{ productFirst?.productName }}
            </div>
            <div class="prd-option-area">
              <div>
                {{ productFirst?.optionValues?.[0]?.optionValue }}
              </div>
            </div>
            <div class="prd-option-area">
              <div>{{ productFirst?.quantity }}{{ $t('CM_Unit') }}</div>
            </div>

            <div class="prd-price-area">
              <span>{{ $moneyFormat(productFirst?.saleAmount * productFirst?.quantity) }}</span>
              <span>{{ $t('CM_Won') }}</span>
            </div>
          </div>
        </div>
        <div
          v-else
          class="flex-layout">
          <div
            class="prd-img-area pointer"
            @click="router.push(`/product/detail/${productFirst?.productId}`)"
          >
            <img :src="addPrefixForImage(productFirst?.thumbnailUrl)" alt="">
          </div>
          <div class="delivery-order-info-area">
            <div
              class="prd-name pointer"
              @click="router.push(`/product/detail/${firstProduct?.productId}`)"
            >
              {{ productFirst?.productName }}
            </div>
            <div class="prd-option-area">
              <div>
                {{ productFirst?.optionValues?.[0]?.optionValue }}
              </div>
            </div>
            <div class="prd-option-area">
              <div>{{ productFirst?.quantity }}{{ $t('CM_Unit') }}</div>
            </div>

            <div class="prd-price-area">
              <span>{{ $moneyFormat(productFirst?.saleAmount * productFirst?.quantity) }}</span>
              <span>{{ $t('CM_Won') }}</span>
            </div>
          </div>
        </div>
      </li>

      <q-slide-transition>
        <li v-if="isVisibleItem">
          <div v-for="(item, index) in productOthers" :key="index" class="flex-layout">
            <div
              class="prd-img-area pointer"
              @click="router.push(`/product/detail/${item?.productId}`)"
            >
              <img v-if="tempId" :src="addPrefixForImage(item?.thumbnailUrl)" alt="">
              <img v-else :src="addPrefixForImage(item?.thumbnailUrl)" alt="">
            </div>
            <div
              v-if="tempId"
              class="delivery-order-info-area">
              <div
                class="prd-name pointer"
                @click="router.push(`/product/detail/${item?.productId}`)"
              >
                {{ item?.productName }}
              </div>
              <div v-for="(option, optIndex) in item?.optionValues" :key="optIndex" class="prd-option-area">
                <div>
                  {{ option.optionValue }}
                </div>
              </div>
              <div class="prd-option-area">
                <div>{{ item?.quantity || 0 }}{{ $t('CM_Unit') }}</div>
              </div>
              <div class="prd-price-area">
                <span>{{ $moneyFormat(item?.saleAmount * item?.quantity) }}</span>
                <span>{{ $t('CM_Won') }}</span>
              </div>
            </div>
            <div
              v-else
              class="delivery-order-info-area">
              <div
                class="prd-name pointer"
                @click="router.push(`/product/detail/${item?.productId}`)"
              >
                {{ item?.productName }}
              </div>
              <div v-for="(option, optIndex) in item?.optionValues" :key="optIndex" class="prd-option-area">
                <div>
                  {{ option.optionValue }}
                </div>
              </div>
              <div class="prd-option-area">
                <div>{{ item?.quantity || 0 }}{{ $t('CM_Unit') }}</div>
              </div>

              <div class="prd-price-area">
                <span>{{ $moneyFormat(item?.saleAmount * item?.quantity) }}</span>
                <span>{{ $t('CM_Won') }}</span>
              </div>
            </div>
          </div>
        </li>
      </q-slide-transition>
    </ul>

    <div v-if="productOthers.length > 0" class="delivery-order-list-area mb24" @click="isVisibleItem = !isVisibleItem">
      <div class="order-count-text-area">
        <div class="text-area">
          <span>{{ $t('CM_Total') }}</span>
          <span>{{ productCount }}</span>
          <span>{{ $t('CM_Count') }}</span>
        </div>

        <div class="text">{{ $t('ORD_OrderProductList') }} {{ isVisibleItem ? $t('CM_Close') : $t('CM_Expand') }}</div>
      </div>

      <i class="ico arrow-top-type02-b drop-down-icon" :class="{'rotate':isVisibleItem}"></i>

    </div>

    <div class="border-top-3-gray plr16 mb24">
      <h6 class="ptb24 bold gray07-color">{{ $t('RET_ReturnReason') }}</h6>

      <span class="font-12 medium gray07-color radius10 gray005-bg pt4l8">{{ requestInfo?.returnOrderReasonType?.text }}</span>

      <p class="font-12 mt10 gray04-color">
        {{ requestInfo?.returnOrderReasonDetail }}
      </p>

      <ul
        v-if="requestInfo?.images?.length > 0"
        class="picture-img-list"
      >
        <li v-for="(item, index) in requestInfo.images" :key="index">
          <img :src="addPrefixForImage(item?.imageFileUrl)" alt="" class="img-cover">
        </li>
      </ul>
    </div>

    <div
      v-if="returnOrderBaseInfo?.returnOrderStatus?.code !== 'RETURN_REQUEST_CANCEL'
        && returnOrderBaseInfo?.returnOrderStatus?.code !== 'RETURN_CANCEL'"
      class="border-top-3-gray plr16 mb24">
      <hgroup class=" ptb24 flex align-center justify-between">
        <h6 class=" bold gray07-color">{{ $t('RET_ReturnProductInfo') }}</h6>
        <span class="btn type19">{{ $t('RET_NotChange') }}</span>
      </hgroup>

      <dl class="order-info-list-area font-14 gray02-color">
        <dt>{{ $t('ORD_AddressGet') }}</dt>
        <dd>{{ deliveryInfo?.receiverName }}</dd>

        <dt>{{ $t('OC_DeliveryInfo5') }}</dt>
        <dd>{{ format.mobileFormat(deliveryInfo?.receiverPhoneNumber) }}</dd>

        <dt>{{ $t('OC_DeliveryInfo6') }}</dt>
        <dd>[{{ deliveryInfo?.zipcode }}] {{ deliveryInfo?.address }} {{ deliveryInfo?.addressDetail }}</dd>

        <dt>{{ $t('OC_DeliveryInfo7') }}</dt>
        <dd>{{ deliveryInfo?.deliveryMessage }}</dd>
      </dl>
    </div>

    <q-list
      v-if="returnOrderBaseInfo?.returnOrderStatus?.code !== 'RETURN_REQUEST_CANCEL'
        && returnOrderBaseInfo?.returnOrderStatus?.code !== 'RETURN_CANCEL'"
      bordered
      class="dropdown type02"
    >

      <q-expansion-item v-if="isLogined" v-model="isExpanded[0]">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('ORD_RefundPoint') }}
          </q-item-section>

          <q-item-section side class="right-area" />
        </template>

        <q-card class="pb24">

          <div class="list type06">
            <div class="large field font-16">
              <span class="">{{ $t('RET_ReturnPoint1') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.expectedPointRecoveryAmount) }}</span>
                <span>P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint2') }}</span>
              <div class="price-text-area">
                <span>-{{ $moneyFormat(paymentInfo?.retrievePoint) }}P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint3') }}*</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.pointRankDown) }}P</span>
              </div>
            </div>

          </div>

          <div class="list type06">
            <div class="large field font-16">
              <span class="">{{ $t('RET_ReturnPoint4') }}</span>
              <div class="price-text-area">
                <span>-{{ $moneyFormat(paymentInfo?.remainingPointRecoveryAmount) }}</span>
                <span>P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint5') }}</span>
              <div class="price-text-area">
                <span>-{{ $moneyFormat(paymentInfo?.pointOrderExpect) }}P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint6') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.pointDeductMy) }}P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint13') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.readyPoint) }}</span>
                <span>P</span>
              </div>
            </div>

            <div class="field font-12 mt0">
              <span class="">※ {{ $t('RET_ReturnPoint14') }}</span>
            </div>
          </div>

          <div class="list type06">
            <div class="large field font-16">
              <span class="">{{ $t('RET_ReturnPoint7') }}</span>
              <div class="price-text-area">
                <span>-{{ $moneyFormat(paymentInfo?.returnPoint) }}</span>
                <span>P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint1') }}</span>
              <div class="price-text-area">
                <span>-{{ $moneyFormat(paymentInfo?.expectedPointRecoveryAmount) }}P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint5') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.pointOrderExpect) }}P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint6') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.pointDeductMy) }}P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint13') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.readyPoint) }}</span>
                <span>P</span>
              </div>
            </div>

            <div class="field font-12 mt0">
              <span class="">※ {{ $t('RET_ReturnPoint14') }}</span>
            </div>

          </div>

        </q-card>
      </q-expansion-item>

      <q-expansion-item v-model="isExpanded[1]">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('RET_ReturnTotalAmount') }}
          </q-item-section>

          <q-item-section side class="right-area">
            <span class="btn type20">{{ $t('RET_ReturnPriceConfirm') }}</span>
          </q-item-section>
        </template>

        <q-card class="pb24">
          <div class="mlr16 mb16 pb16 border-bottom-1-gray">
            <div class="flex justify-between primary09-color mb4 ">
              <div class="font-16 extra-bold font-16">{{ $t('RET_AddPayAmount') }}</div>
              <div class="text-right">
                <div class="font-16 extra-bold">
                  <span>{{ $moneyFormat(paymentInfo?.additionalAmount) }}</span>
                  <span class="ml2">{{ $t('CM_Won') }}</span>
                </div>

                <div class="font-12 mt4">
                  <span class="extra-bold">{{ redemptionInfo?.paymentStatus?.text }}</span>
                  <span class="ml4">{{ redemptionInfo?.redemptionDatetime }}</span>
                </div>
              </div>

            </div>
            <span class="font-12 gray04-color">•{{ $t('RET_AddPayAmountDesc') }}</span>
          </div>

          <div class="list type07">
            <div class="large field font-16">
              <span class="">{{ $t('RET_ReturnTotalAmount2') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.refundAmount) }}</span>
                <span>{{ $t('CM_Won') }}</span>
              </div>
            </div>

            <!-- 가상계좌일경우 -->
            <div v-if="paymentInfo?.virtualAccountNo" class="mt2 mb16 plr16 text-right font-14 gray07-color ">
              (*{{ $t('ORD_RefundAccount') }}: {{ paymentInfo?.bankName }} / {{ paymentInfo?.virtualAccountNo }})
            </div>
            <!-- //가상계좌일경우 -->

            <div class="field font-14">
              <span class="gray07-color">{{ $t('RET_ReturnProuctAmount') }}</span>
              <div class="price-text-area">
                <span class="gray07-color">-{{ $moneyFormat(paymentInfo?.salesAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="gray07-color">{{ $t('RET_ReturnAddressAmount') }}*</span>
              <div class="price-text-area">
                <span class="gray07-color">{{ $moneyFormat(paymentInfo?.returnDeliveryFeeAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </div>

            <div v-if="isPlanner && paymentInfo?.deductPeriodRate" class="field font-14">
              <span class="gray07-color">{{ $t('RET_ReturnPoint8') }} ({{ paymentInfo?.deductPeriodRate }}%)</span>
              <div class="price-text-area">
                <span class="gray07-color">-{{ $moneyFormat(paymentInfo?.deductPeriodAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </div>
            <div v-if="isPlanner && paymentInfo?.deductPeriodRate" class="field font-14 mt4-important">
              <span class="">{{ $t('RET_DeductDate', {date: paymentInfo?.deductPeriodDate}) }}</span>
            </div>

            <div v-if="isLogined" class="field font-14">
              <span class="gray07-color">{{ $t('RET_ReturnPoint9') }}</span>
              <div class="price-text-area">
                <span class="gray07-color">{{ $moneyFormat(paymentInfo?.returnPoint) }}P</span>
              </div>
            </div>
          </div>

          <div v-if="isLogined" class="list type07">
            <div class="large field font-16">
              <span class="">{{ $t('RET_ReturnPoint10') }}</span>
              <div class="price-text-area">
                <span>-{{ $moneyFormat(paymentInfo?.refundPoint) }}</span>
                <span>P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint11') }}</span>
              <div class="price-text-area">
                <span>-{{ $moneyFormat(paymentInfo?.pointDiscount) }}P</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint12') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.pointExpired) }}P</span>
              </div>
            </div>
          </div>

        </q-card>
      </q-expansion-item>

    </q-list>

    <div
      v-if="returnOrderBaseInfo?.returnOrderStatus?.code !== 'RETURN_REQUEST_CANCEL'
        && returnOrderBaseInfo?.returnOrderStatus?.code !== 'RETURN_CANCEL'"
      class="plr16 mt24"
    >
      <ul v-if="isLogined" class="explanation-text gray font-14  gray05-color">
        <li>{{ $t('RET_ReturnPointDesc1') }}</li>
        <li>{{ $t('RET_ReturnPointDesc2') }}</li>
        <li>{{ $t('RET_ReturnPointDesc3') }}</li>
        <li>{{ $t('RET_ReturnPointDesc4') }}</li>
        <li><b>{{ $t('RET_ReturnPointDesc5') }}</b></li>
      </ul>

      <ul v-else class="explanation-text gray font-14  gray05-color">
        <li>{{ $t('RET_ReturnPointDesc3') }}</li>
        <li>{{ $t('RET_ReturnPointDesc4') }}</li>
        <li><b>{{ $t('RET_ReturnPointDesc5') }}</b></li>
      </ul>

      <span v-if="isLogined" class="block font-14 mt16 gray07-color">{{ $t('RET_ReturnPointDesc6') }}</span>
      <span v-else class="block font-14 mt16 gray07-color">{{ $t('RET_ReturnPointDesc7') }}</span>

      <RCheckbox v-model="checkbox" disable class="checkbox-area type02 mt8">
        <b class="gray02-color">{{ $t('RET_ReturnPointAgree') }}</b>
        <span class="ml4 gray02-color font-12 regular">{{ returnOrderBaseInfo?.returnOrderAgreeDatetime }}</span>
      </RCheckbox>
    </div>

  </div>

</template>

<script setup>

import { ref, getCurrentInstance, reactive, nextTick, onMounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { event } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import mypageService from '@/http/services/mypage'
import { addPrefixForImage, checkPlanner } from '@/utils/common'
import format from '@/utils/format'
import { isLogin } from '@/utils/login'
import productService from '@/http/services/product'
// import ChangeNonUserModal from './modal/ChangeNonUserModal'
const { proxy } = getCurrentInstance()

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]

const route = useRoute()
const router = useRouter()
const tempId = route.query.tempId
const returnNumber = route.query.returnNumber
const inputText = ref('010-1234-5678')
const selectFilterModel = ref(null)
const checkbox = ref(false)
const discontinuedModal = ref(false)
const accountRegModal = ref(false)
const soldOutModal = ref(false)
const orderCancelModal = ref(false)
const deliveryInfo = ref(null)
const paymentInfo = ref(null)
const requestInfo = ref(null)
const returnOrderBaseInfo = ref(null)
const returnOrderProductList = ref(null)
const productFirst = ref(null)
const productOthers = ref([])
const productItems = ref([])
const productCount = ref(null)
const firstProduct = ref(null)
const productsInfo = ref([])
const redemptionInfo = ref(null)

const isVisibleItem = ref(false)
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())

/* DropDowm Menu */
const deliveryOrderArea = ref(null)
const isVisibleSet = ref(false)

const isExpanded = ref([true, true])
const prdHidden = ref([true, true, true])

const prdHeight = ref(null)

const selectOptions = [
  { label: 'test1', value: '1' },
  { label: 'test2', value: '2' },
  { label: 'test3', value: '3' }
]
const prdListOpen = (index) => {
  prdHidden.value[index] = !prdHidden.value[index]

  //  prdHeight.value = deliveryOrderArea.value.scrollHeight
  const deliveryOrderAreaRef = proxy.$refs[`deliveryOrderArea_${index}`]
  console.log('eeeeeeeeeeeeeeeee', proxy.$refs[`deliveryOrderArea_${index}`])

  if (deliveryOrderAreaRef) {
    console.log('Scroll Height:', deliveryOrderAreaRef[0].scrollHeight)
    prdHeight.value = deliveryOrderAreaRef[0].scrollHeight
  }
}

const onSoldOutOpenModal = () => {
  proxy.$refs.soldOutModal.show()
}

const onDiscontinuedOpenModal = () => {
  proxy.$refs.discontinuedModal.show()
}

const onAccountRegOpenModal = () => {
  proxy.openModal({
    parent: proxy, // 필수
    component: 'ResponsiveModal',
    componentProps: {
      title: proxy.$t('ORD_RefundRegist'),
      contentComponent: 'AccountRegModal',
      wrapClass: 'bottom-btn-modal'
    }
  })
}

const onOrderCancelOpenModal = () => {
  proxy.$refs.orderCancelModal.show()
}

const getQuantity = (item) => {
  const matchedProduct = productOthers.value.find(other =>
    other.productId === item.productId ||
    other.productOptionId === item.productId
  )
  return matchedProduct?.quantity || 0
}

const getSaleAmount = (item) => {
  const matchedProduct = productOthers.value.find(other =>
    other.productId === item.productId ||
    other.productOptionId === item.productId
  )
  return matchedProduct?.saleAmount || 0
}

const getDetailReturn = async (id) => {
  const result = await mypageService.getDetailReturn(id)

  if (result.data) {
    deliveryInfo.value = result.data.deliveryInfo
    paymentInfo.value = result.data.paymentInfo
    requestInfo.value = result.data.requestInfo
    returnOrderBaseInfo.value = result.data.returnOrderBaseInfo
    returnOrderProductList.value = result.data.returnOrderProductList
    redemptionInfo.value = result.data.redemptionInfo
    productItems.value = result.data.returnOrderProductList
    productFirst.value = result.data.returnOrderProductList[0]
    productOthers.value = result.data.returnOrderProductList.slice(1)
    productCount.value = result.data.returnOrderProductList.length
    checkbox.value = result.data.returnOrderBaseInfo.isReturnOrderAgree

    postProductInfo()
  }
}

const getGuestReturn = async (id, num) => {
  const params = {
    identification: id,
    returnOrderNumber: num
  }
  const result = await mypageService.getGuestReturn(params)

  if (result.data) {
    deliveryInfo.value = result.data.deliveryInfo
    paymentInfo.value = result.data.paymentInfo
    requestInfo.value = result.data.requestInfo
    returnOrderBaseInfo.value = result.data.returnOrderBaseInfo
    returnOrderProductList.value = result.data.returnOrderProductList
    redemptionInfo.value = result.data.redemptionInfo
    productItems.value = result.data.returnOrderProductList
    productFirst.value = result.data.returnOrderProductList[0]
    productOthers.value = result.data.returnOrderProductList.slice(1)
    productCount.value = result.data.returnOrderProductList.length
    checkbox.value = result.data.returnOrderBaseInfo.isReturnOrderAgree

    getGuestProductDetail()
  }
}

const postProductInfo = async () => {
  const params = {
    products: returnOrderProductList.value.map(item => ({
      productId: item.productId,
      productOptionId: item.productOptionId
    }))
  }

  const result = await productService.postProductInfo(params)
  if (result) {
    firstProduct.value = params.products[0].productOptionId !== null
      ? result.data.find(
        data =>
          data.productId === params.products[0].productId &&
          data.productOptionId === params.products[0].productOptionId
      )
      : result.data.find(
        data => data.productId === params.products[0].productId
      )
    productsInfo.value = params.products
      .filter(paramProduct =>
        paramProduct.productOptionId !== null
          ? paramProduct.productId !== firstProduct.value?.productId ||
          paramProduct.productOptionId !== firstProduct.value?.productOptionId
          : paramProduct.productId !== firstProduct.value?.productId
      )
      .map(paramProduct =>
        paramProduct.productOptionId !== null
          ? result.data.find(
            dataProduct =>
              dataProduct.productId === paramProduct.productId &&
              dataProduct.productOptionId === paramProduct.productOptionId
          )
          : result.data.find(
            dataProduct => dataProduct.productId === paramProduct.productId
          )
      )
  }
}

const getGuestProductDetail = async () => {
  for (let i = 0; i < productItems.value.length; i++) {
    const id = productItems.value[i].productOptionId
      ? productItems.value[i].productOptionId
      : productItems.value[i].productId

    const result = await productService.getGuestProductDetail(id)

    if (result && result.data) {
      if (i === 0) {
        firstProduct.value = result.data
      } else {
        productsInfo.value.push(result.data)
      }
    }
  }
}

const goToLogin = async () => {
  await proxy.$confirm(proxy.$t('CM_UseAferLogin'), {
    title: proxy.$t('CM_RecommLogin'),
    ok: () => {
      router.push({ path: '/login' })
    },
    cancel: () => {
      return
    },
    okLabel: proxy.$t('CM_MovePage'),
    cancelLabel: proxy.$t('CM_No')
  })
}

onMounted(() => {
  if (!isLogined.value && !tempId) {
    goToLogin()
    return
  }

  if (tempId) {
    getGuestReturn(tempId, returnNumber)
  } else {
    getDetailReturn(returnNumber)
  }
})
</script>

<style lang="scss" scoped>
</style>

