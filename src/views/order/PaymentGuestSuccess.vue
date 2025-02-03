<!--
  주문 결제 완료
-->

<template>
  <div v-if="paymentResult" class="payment-sucess-wrap pb144">
    <hgroup class="main-title-area">
      <h3>{{ $t('OC_OrderComplete1') }}<br>{{ $t('OC_OrderComplete2') }}</h3>
      <span>{{ $t('NOC_OrderCheck1') }}<br>{{ $t('NOC_OrderCheck2') }}</span>
    </hgroup>

    <ul class="list type03">
      <li>
        <h6>{{ $t('NUP_PayUserInfo') }}</h6>
        <dl class="order-info-list-area">
          <dt>{{ $t('NUP_OrderName') }}</dt>
          <dd>{{ guestInfo.guestName }}</dd>

          <dt>{{ $t('OC_DeliveryInfo5') }}</dt>
          <dd>{{ guestInfo.mobileNumber }}</dd>

          <dt>{{ $t('CM_ReferrerInfo') }}</dt>
          <dd>{{ guestInfo.reffererLastName }} {{ guestInfo.reffererFirstName }} ({{ guestInfo.reffererUserNumber }})</dd>

        </dl>
      </li>
      <li>
        <h6>{{ $t('OC_DeliveryInfo') }}</h6>
        <dl class="order-info-list-area">
          <dt>{{ $t('OC_DeliveryInfo1') }}</dt>
          <dd>{{ paymentResult.salesOrderNumber }}</dd>

          <dt>{{ $t('OC_DeliveryInfo3') }}</dt>
          <dd>{{ paymentResult.orderDateTime }}</dd>

          <dt>{{ $t('OC_DeliveryInfo4') }}</dt>
          <dd>{{ paymentInfo.receiver.lastName + paymentInfo.receiver.firstName }}</dd>

          <dt>{{ $t('OC_DeliveryInfo5') }}</dt>
          <dd>{{ paymentInfo.receiver.mobile }}</dd>

          <dt>{{ $t('OC_DeliveryInfo6') }}</dt>
          <dd>({{ paymentInfo.receiver.zipCode }}) {{ paymentInfo.receiver.address }} {{ paymentInfo.receiver.addressDetail }}</dd>

          <dt>{{ $t('OC_DeliveryInfo7') }}</dt>
          <dd>{{ paymentInfo.receiver.message }}</dd>
        </dl>
      </li>
      <li>
        <h6>{{ $t('OC_OrderProductInfo') }}</h6>
        <dl class="order-info-list-area">
          <dt>{{ $t('OC_ProductName') }}</dt>
          <dd>{{ productList[0]?.productName }} <span v-if="paymentInfo?.products.length > 1">{{ $t('CM_And') }} {{ $moneyFormat(paymentInfo?.products.length - 1 ) }}{{ $t('CM_Unit') }}</span></dd>
          <dt>{{ $t('CM_Quantity') }}</dt>
          <dd>{{ $moneyFormat(productTotalCount) }}{{ $t('CM_Unit') }}</dd>
        </dl>
        <div class="payment-order-price-area">
          <div class="top-area flex align-center justify-between">
            <span class="primary09-color medium">{{ $t('OP_OrderAmount') }}</span>
            <div class="price-text-area flex align-center gap4">
              <span>{{ $moneyFormat(paymentInfo.summary.productsAmount) }}{{ $t('CM_Won') }}</span>
            </div>
          </div>

          <dl class="order-info-list-area">
            <dt>{{ $t('OP_DeliveryAmount') }}</dt>
            <dd>{{ $moneyFormat(paymentInfo.summary.deliveryFeeAmount) }}{{ $t('CM_Won') }}</dd>
          </dl>

          <div class="top-area flex align-center justify-between">
            <span class="primary09-color medium">{{ $t('OP_TotalPayment') }}</span>
            <div class="price-text-area flex align-center gap4">
              <span>{{ $moneyFormat(paymentInfo.summary.salesAmount) }}{{ $t('CM_Won') }}</span>
            </div>
          </div>
        </div>
      </li>

      <li v-if="paymentResult?.paymentResult.paymentType.code !== 'VIRTUAL_ACCOUNT'">
        <h6>{{ $t('OC_PaymentInfo') }}</h6>
        <dl class="order-info-list-area">
          <dt>{{ $t('OC_PaymentWay') }}</dt>
          <dd>{{ paymentResult?.paymentResult.paymentType.text }}</dd>

          <dt v-if="paymentResult?.paymentResult.cardPaymentInfo">{{ $t('OC_PaymentCard') }}</dt>
          <dd v-if="paymentResult?.paymentResult.cardPaymentInfo">{{ paymentResult?.paymentResult.cardPaymentInfo.cardName }} {{ paymentResult?.paymentResult.cardPaymentInfo.cardNumber }}</dd>

          <dt>{{ $t('OC_AgreeDate') }}</dt>
          <dd>{{ paymentResult.orderDateTime }}</dd>
        </dl>
      </li>
      <li v-else>
        <h6>{{ $t('OC_PaymentInfo') }}</h6>
        <dl class="order-info-list-area">
          <dt>{{ $t('OC_PaymentWay') }}</dt>
          <dd>{{ paymentResult?.paymentResult.paymentType.text }}</dd>

          <dt>{{ $t('OC_PaymentAccount') }}</dt>
          <dd>{{ paymentResult?.paymentResult.virtualAccountPaymentInfo.bankName }} {{ paymentResult?.paymentResult.virtualAccountPaymentInfo.accountNumber }}</dd>

          <dt>{{ $t('OC_LimitPayment') }}</dt>
          <dd>{{ paymentResult?.paymentResult.virtualAccountPaymentInfo.dueDate }}</dd>

          <dt>{{ $t('OP_MoneyReceipt') }}</dt>
          <dd v-if="paymentInfo?.cashReceiptInfo">{{ cashReceiptValue.label }} | {{ paymentInfo?.cashReceiptInfo.customerIdentityNumber }}</dd>
          <dd v-if="!paymentInfo?.cashReceiptInfo">{{ $t('RCP_Receipt3') }}</dd>
        </dl>
      </li>
    </ul>

    <div class="bottom-btn">
      <div class="flex-btn-area">
        <!-- <RButton class="btn full small type03" :label="$t('OC_GoOrder')" @click="goOrderDetail" /> -->
        <RButton class="btn full small type02" :label="$t('OC_GoShopping')" @click="goProductPage" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, watch, computed, onBeforeMount } from 'vue'
import { sessionDataManager, PAYMENT_INFO, PAYMENT_RESULT, NON_USER_INFO, ORDER_DATA, SHOP_REFERRER_CODE } from '@utils/dataManager'
import productService from '@/http/services/product'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'

const router = useRouter()
const { proxy } = getCurrentInstance()
const paymentResult = ref(null)
const productList = ref([])
const cashReceiptValue = ref('')
const guestInfo = JSON.parse(sessionDataManager.get(NON_USER_INFO))
const paymentInfo = JSON.parse(sessionDataManager.get(PAYMENT_INFO))
const orderList = JSON.parse(sessionDataManager.get(ORDER_DATA))
const cashReceiptType = computed(() => [
  { label: proxy.$t('RCP_Receipt4'), value: 'DEDUCTION' },
  { label: proxy.$t('RCP_Receipt2'), value: 'EVIDENCE_OF_EXPENDITURE' },
  { label: proxy.$t('RCP_Receipt3'), value: '' }
])
const { data: productData } = productService.getProductsByIds(
  {
    value: orderList
  }, 'get-order-payment-products'
)

const productTotalCount = computed(() => {
  return productList.value.reduce((pre, cur) => {
    pre = pre + cur.quantity
    return pre
  }, 0)
})

const getOrderComplete = async () => {
  const params = JSON.parse(sessionDataManager.get('paymentResult'))
  paymentResult.value = params

  if (paymentInfo.cashReceiptInfo) {
    cashReceiptValue.value = cashReceiptType.value.filter((i) => i.value === paymentInfo.cashReceiptInfo.cashReceiptType)[0]
  }
}

const getProduct = async (v) => {
  const _productData = v

  const productData = _productData.map(item => {
    const product = orderList.filter((i) => {
      const id = i.productOptionId ? i.productOptionId : i.productId
      if (id === item.productId) return i
    })
    const _item = Object.assign({ quantity: product[0].quantity }, item)

    return _item
  })

  productList.value = productData
}

const goProductPage = () => {
  router.push('/')
}

onMounted(() => {
  sessionDataManager.remove('isCert')
  getOrderComplete()
})

watch(productData, v => {
  if (v) {
    getProduct(v)
  }
})

onBeforeMount(() => {
  if (!paymentInfo) {
    router.push({ 'name': 'Home' })
  }
})

/**
 * 페이지 이동, 세션 삭제
 */
onBeforeRouteLeave(() => {
  sessionDataManager.remove(PAYMENT_INFO)
  sessionDataManager.remove(PAYMENT_RESULT)
  sessionDataManager.remove(NON_USER_INFO)
  sessionDataManager.remove(ORDER_DATA)
  sessionDataManager.remove(SHOP_REFERRER_CODE)
})
</script>
