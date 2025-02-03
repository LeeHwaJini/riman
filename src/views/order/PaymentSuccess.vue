<!--
  주문 결제 완료
-->

<template>
  <div v-if="paymentResult" class="payment-sucess-wrap pb144">
    <hgroup class="main-title-area">
      <h3>{{ $t('OC_OrderComplete1') }}<br>{{ $t('OC_OrderComplete2') }}</h3>
      <!-- 회원일 경우 -->
      <span>{{ $t('OC_OrderComplete3') }}<br>{{ $t('OC_OrderComplete4') }}</span>
      <!-- //회원일 경우 -->

      <!-- 비회원일 경우
      <span>본인인증한 휴대폰번호로<br>주문내역을 조회할 수 있습니다.</span>
      //비회원일 경우-->
    </hgroup>

    <ul class="list type03">
      <li>
        <h6>{{ $t('OC_DeliveryInfo') }}</h6>
        <dl class="order-info-list-area">
          <dt>{{ $t('OC_DeliveryInfo1') }}</dt>
          <dd>{{ paymentResult.salesOrderNumber }}</dd>

          <dt>{{ $t('OC_DeliveryInfo2') }}</dt>
          <dd>{{ paymentResult.guaranteeCode }}</dd>

          <dt>{{ $t('OC_DeliveryInfo3') }}</dt>
          <dd>{{ paymentResult.orderDateTime }}</dd>

          <dt>{{ $t('OC_DeliveryInfo4') }}</dt>
          <dd>{{ paymentResult.receiver.lastName + paymentResult.receiver.firstName }}</dd>

          <dt>{{ $t('OC_DeliveryInfo5') }}</dt>
          <dd>{{ paymentResult.receiver.mobile }}</dd>

          <dt>{{ $t('OC_DeliveryInfo6') }}</dt>
          <dd>({{ paymentResult.receiver.zipCode }}) {{ paymentResult.receiver.address }} {{ paymentResult.receiver.addressDetail }}</dd>

          <dt>{{ $t('OC_DeliveryInfo7') }}</dt>
          <dd>{{ paymentResult.receiver.message }}</dd>
        </dl>
      </li>
      <li>
        <h6>{{ $t('OC_OrderProductInfo') }}</h6>
        <dl class="order-info-list-area">
          <dt>{{ $t('OC_ProductName') }}</dt>
          <dd>{{ paymentResult?.products[0].productNameInfo.fullName }} <span v-if="paymentResult?.products.length > 1">{{ $t('CM_And') }} {{ $moneyFormat(paymentResult.products.length - 1) }}{{ $t('CM_Unit') }}</span></dd>
          <dt>{{ $t('CM_Quantity') }}</dt>
          <dd>{{ $moneyFormat(paymentInfo?.order.products.length) }}{{ $t('CM_Unit') }}</dd>
        </dl>

        <!-- 회원일 경우 -->
        <div class="payment-order-price-area">
          <div class="top-area flex align-center justify-between">
            <span class="primary09-color medium">{{ $t('OP_OrderAmount') }}</span>
            <div class="price-text-area flex align-center gap4">
              <span>{{ $moneyFormat(paymentResult?.summary.productsAmount) }}{{ $t('CM_Won') }}</span>
              <!-- <i v-if="isPlanner" class="ico riman-coin-y" @click="$notify(`SP : ${$moneyFormat(paymentResult?.summary.totalSpOrigin)} | BP : ${$moneyFormat(paymentResult?.summary.totalBpOrigin)}`, '', 'tooltip-close-none')"></i> -->
            </div>
          </div>

          <dl class="order-info-list-area">
            <dt>{{ $t('OP_DeliveryAmount') }}</dt>
            <dd>{{ $moneyFormat(paymentResult?.summary.shippingFee) }}{{ $t('CM_Won') }}</dd>
            <!-- <dt>{{ $t('OP_CouponDiscount2') }}</dt>
            <dd><span v-if="paymentResult?.summary.couponDiscount > 0">-</span> {{ $moneyFormat(paymentResult?.summary.couponDiscount) }}{{ $t('CM_Won') }}</dd> -->
            <!-- <dt>등급할인</dt>
            <dd>{{ $moneyFormat(paymentResult?.summary.autoShipDiscount) }}원</dd> -->
            <dt>{{ $t('OP_UsePoint') }}</dt>
            <dd class="flex align-center justify-end"><span v-if="paymentResult?.summary.pointDiscount > 0">-</span> {{ $moneyFormat(paymentResult?.summary.pointDiscount) }}P <!--<i v-if="isPlanner" class="ico riman-coin-y" @click="$notify(`SP : ${$moneyFormat(paymentResult?.summary.totalSpOrigin - paymentResult?.summary.totalSpFinal)} | BP : ${$moneyFormat( paymentResult?.summary.totalBpOrigin - paymentResult?.summary.totalBpFinal)}`, '', 'tooltip-close-none')"></i>--></dd>

            <!-- 2024.12.06  -->
            <dt>{{ $t('OP_SavePoint') }}</dt>
            <dd>{{ $moneyFormat(paymentResult?.summary.pointEarn) }}</dd>
            <!-- //2024.12.06  -->
          </dl>
        </div>

        <ul class="order-result-price-area">
          <li>
            <span class="left-title-area primary09-color">{{ $t('OP_TotalPayment') }}</span>
            <div class="price-text-area flex align-center">
              <span>{{ $moneyFormat(paymentResult?.summary.salesAmount) }}</span>
              <span>{{ $t('CM_Won') }}</span>
              <!-- <i v-if="isPlanner" class="ico riman-coin-y" @click="$notify(`SP : ${$moneyFormat(paymentResult?.summary.totalSpAfterDiscount)} | BP : ${$moneyFormat(paymentResult?.summary.totalBPAfterDiscount)}`, '', 'tooltip-close-none')"></i> -->
            </div>
          </li>

          <!-- 2024.12.06  -->
          <li v-if="isPlanner">
            <span class="left-title-area">{{ $t('PT_Earning') }} {{ $t('CM_Sp') }} | {{ $t('CM_Bp') }}</span>
            <div class="sp-bp-price-area">
              <div class="price-area">
                <span>{{ $moneyFormat(paymentResult?.summary.totalSpAfterDiscount) }} {{ $t('CM_Sp') }}</span>
              </div>

              <div class="price-area">
                <span>{{ $moneyFormat(paymentResult?.summary.totalBPAfterDiscount) }} {{ $t('CM_Bp') }}</span>
              </div>
            </div>
          </li>
          <!-- //2024.12.06  -->
        </ul>
      </li>

      <li v-if="paymentResult?.summary.paymentType.code !== 'VIRTUAL_ACCOUNT'">
        <h6>{{ $t('OC_PaymentInfo') }}</h6>
        <dl class="order-info-list-area">
          <dt>{{ $t('OC_PaymentWay') }}</dt>
          <dd>{{ paymentResult?.summary.paymentType.text }}</dd>

          <dt v-if="paymentResult?.summary.cardPaymentInfo">{{ $t('OC_PaymentCard') }}</dt>
          <dd v-if="paymentResult?.summary.cardPaymentInfo">{{ paymentResult?.summary.cardPaymentInfo.cardName }} {{ paymentResult?.summary.cardPaymentInfo.cardNumber }} <span v-if="paymentResult?.summary.cardPaymentInfo.installment === '0'">({{ $t('OC_OnePayment') }})</span><span v-else>({{ paymentResult?.summary.cardPaymentInfo.installment }} {{ $t('CM_Month') }})</span></dd>

          <dt>{{ $t('OC_AgreeDate') }}</dt>
          <dd>{{ paymentResult.orderDateTime }}</dd>
        </dl>
      </li>
      <li v-else>
        <h6>{{ $t('OC_PaymentInfo') }}</h6>
        <dl class="order-info-list-area">
          <dt>{{ $t('OC_PaymentWay') }}</dt>
          <dd>{{ paymentResult?.summary.paymentType.text }}</dd>

          <dt>{{ $t('OC_PaymentAccount') }}</dt>
          <dd>{{ paymentResult?.summary.virtualAccountPaymentInfo.bankName }} {{ paymentResult?.summary.virtualAccountPaymentInfo.accountNumber }}</dd>

          <dt>{{ $t('OC_LimitPayment') }}</dt>
          <dd>{{ paymentResult?.summary.virtualAccountPaymentInfo.dueDate }}</dd>

          <dt>{{ $t('OP_MoneyReceipt') }}</dt>
          <dd v-if="paymentInfo?.cashReceiptInfo">{{ cashReceiptValue.label }} | {{ paymentInfo?.cashReceiptInfo.customerIdentityNumber }}</dd>
          <dd v-if="!paymentInfo?.cashReceiptInfo">{{ $t('RCP_Receipt3') }}</dd>
        </dl>
      </li>
    </ul>

    <div class="bottom-btn">
      <div class="flex-btn-area">
        <RButton class="btn full small type03" :label="$t('OC_GoOrder')" @click="goOrderDetail" />
        <RButton class="btn full small type02" :label="$t('OC_GoShopping')" @click="goProductPage" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, computed, onBeforeMount } from 'vue'
import { sessionDataManager, PAYMENT_INFO, PAYMENT_RESULT, ORDER_DATA, SHOP_REFERRER_CODE } from '@utils/dataManager'
import { useMainStore } from '@store/mainStore'
import { useRoute, useRouter } from 'vue-router'
import cartService from '@/http/services/cart'
import http from '@utils/http'
import { checkPlanner } from '@/utils/common'

const router = useRouter()
const { proxy } = getCurrentInstance()
const paymentResult = ref(null)
const mainStore = useMainStore()
const totalProduct = ref(0)
const paymentInfo = JSON.parse(sessionDataManager.get('paymentInfo'))
const salesOrderId = ref(null)
const cashReceiptValue = ref('')

const userInfo = mainStore.userInfo

const isPlanner = computed(() => checkPlanner())
const cashReceiptType = computed(() => [
  { label: proxy.$t('RCP_Receipt4'), value: 'DEDUCTION' },
  { label: proxy.$t('RCP_Receipt2'), value: 'EVIDENCE_OF_EXPENDITURE' },
  { label: proxy.$t('RCP_Receipt3'), value: '' }
])

const getOrderComplete = async () => {
  const params = JSON.parse(sessionDataManager.get('paymentResult'))
  paymentResult.value = params
  let countProduct = 0

  for (const i of params.products) {
    countProduct += i.quantity
  }

  totalProduct.value = countProduct

  salesOrderId.value = params.salesOrderId

  if (paymentInfo.cashReceiptInfo) {
    cashReceiptValue.value = cashReceiptType.value.filter((i) => i.value === paymentInfo.cashReceiptInfo.cashReceiptType)[0]
  }
}

const goProductPage = () => {
  router.push('/')
}

const goOrderDetail = () => {
  router.push('/mypage/orderList')
}

onBeforeMount(() => {
  if (!paymentInfo) {
    router.push({ 'name': 'Home' })
  }
})

/**
 * 페이지 이동, 세션 삭제
 */
// onBeforeRouteLeave(() => {
//   sessionDataManager.remove(PAYMENT_INFO)
//   sessionDataManager.remove(PAYMENT_RESULT)
//   sessionDataManager.remove(SHOP_REFERRER_CODE)
// })

onMounted(async () => {
  sessionDataManager.remove(ORDER_DATA)
  getOrderComplete()
  await cartService.getCart()
})
</script>
