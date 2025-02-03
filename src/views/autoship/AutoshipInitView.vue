<!--
정기구매 관리
create by rhkim06
정기구매 작업이 홀딩이 되어 작업이 중단되었습니다. 2024-10-11
-->
<template>
  <div class="max-width-wrap full-width-wrap pb144">

    <div class="main-title-area">
      <h3 class="">정기구매 관리</h3>
    </div>

    <div class="step-title-group-area">
      <h4 class="title bold primary09-color">정기구매 결제 정보를<br/>
        입력해 주세요.</h4>
    </div>

    <q-list bordered class="dropdown type02">
      <Address v-model.trim="message" @add-address="onAddAddress"/>
      <Products :payment-info="paymentInfo" @add-products="onAddProducts"/>
      <Coupon :ref="couponRef" :salse-amount="paymentInfo?.salesAmount" @add-coupon="onAddCoupon"/>
      <PayMethod v-model="payDate" @add-card="onAddCard"/>

      <q-expansion-item v-model="open">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_PaymentAmount') }}
          </q-item-section>

          <q-item-section side class="right-area" />
        </template>

        <q-card class="plr16 pb16">
          <ul class="order-result-detail-price-area">
            <li>
              <span class="">{{ $t('CA_PayRound') }}</span>
              <div class="price-text-area">
                <span>{{ $t('CA_Round', {round: 1}) }}</span>
              </div>
            </li>

            <li>
              <span class="">{{ $t('OP_Point') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.pointEarn) }}P</span>
              </div>
            </li>

            <li>
              <span class="">{{ $t('CA_PointAdd') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.pointEarn) }}P</span>
              </div>
            </li>

            <li>
              <span class="">할인금액</span>
              <div class="price-text-area">
                <span>{{ discountAmount }}{{ $t('CM_Won') }}</span>
                <template v-if="isPlanner">
                  <i class="ico riman-coin-y" @click="$notify(`SP : ${$moneyFormat(paymentInfo?.totalSpOrigin - paymentInfo?.totalSpAfterDiscount)} | BP : ${paymentInfo?.totalBpOrigin - paymentInfo?.totalBPAfterDiscount}`)" />
                </template>
              </div>
            </li>
          </ul>

          <ul class="order-result-price-area">
            <li>
              <span class="left-title-area primary09-color">총 결제금액</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.salesAmount) }}</span>
                <span>{{ $t('CM_Won') }}</span>
              </div>
            </li>
            <li>
              <span class="left-title-area">적립예정 포인트</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.pointEarn) }}</span>
                <span>P</span>
              </div>
            </li>
            <li v-if="isPlanner">
              <span class="left-title-area">구매 SP | BP</span>
              <div>
                <div class="price-text-area">
                  <span>{{ $moneyFormat(paymentInfo?.totalSpAfterDiscount) }}</span>
                  <span>SP</span>
                </div>
                <div class="price-text-area">
                  <span>{{ $moneyFormat(paymentInfo?.totalBPAfterDiscount) }}</span>
                  <span>BP</span>
                </div>
              </div>
            </li>
          </ul>

        </q-card>
      </q-expansion-item>

    </q-list>

    <Terms all-checked="termsChecked"/>

    <div class="bottom-btn">
      <RButton class="btn full small type02 font-16" label="결제하기" @on-click="onClickBuy" />
    </div>
  </div>

</template>

<script setup>

import { ref, getCurrentInstance, reactive, isReadonly, onMounted, computed, watch, onUnmounted } from 'vue'
import Address from './components/Address'
import Products from './components/Products'
import Coupon from './components/Coupon'
import PayMethod from './components/PayMethod'
import Terms from './components/Terms'
import orderService from '@/http/services/order'
import { useMainStore } from '@/store/mainStore'
import { checkPlanner } from '@/utils/common'
import autoshipService from '@/http/services/autoship'
import autoshipCardService from '@/http/services/autoshipCard'
import { sessionDataManager, SUBS_ORDER_DATA } from '@/utils/dataManager'
import { onBeforeRouteLeave, onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const open = ref(true)
const productList = ref()
const address = ref()
const identification = ref()
const cardInfo = ref()
const message = ref('도착전 전화주세요')
const paymentInfo = ref()
const payDate = ref()
const coupon = ref()
const couponRef = ref()
const termsChecked = ref(true)
const allChecked = ref(true)
const isPlanner = computed(() => checkPlanner())
const userInfo = useMainStore().getUser
const route = useRoute()
const router = useRouter()
const subscribeInit = autoshipService.postSubscribeInit()
const discounts = computed(() => {
  let _discounts = null
  if (coupon.value) {
    _discounts = {
      discountType: 'COUPON',
      id: coupon.value.couponId,
      value: coupon.value.calculateDiscountAmount
    }
  }
  if (_discounts) {
    return [_discounts]
  }
  return _discounts
})
const discountAmount = computed(() => paymentInfo.value && paymentInfo.value.couponDiscount + paymentInfo.value.membershipDiscount + paymentInfo.value.pointDiscount)
const onAddProducts = (data) => {
  productList.value = generateProductsParam(data.products)
  identification.value = data.identification
  getOrderSummary()
}
const onAddCard = (data) => {
  cardInfo.value = data
}
const onAddAddress = (_address) => {
  address.value = _address
  getOrderSummary()
}
const onAddCoupon = (_coupon) => {
  coupon.value = _coupon
  getOrderSummary('coupon')
}
const onClickBuy = async () => {
  checkIfAllChecked()
  if (!allChecked.value) return
  const chanegType = await checkSelectedCardHasPwd()
  if (chanegType === 'chngePasswd') {
    openCardPwdModal(cardInfo.value)
  } else {
    openCardPwdInitModal(chanegType, cardInfo.value)
  }
}
function generateProductsParam(products) {
  return products.map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }))
}
function checkIfAllChecked() {
  if (message.value === 'directInput' || message.value === '') {
    proxy.$alert('배송지 메세지를 입력해주세요.')
    allChecked.value = false
    return
  }
  if (!address.value) {
    proxy.$alert('배송지를 선택해주세요.')
    allChecked.value = false
    return
  }
  if (!productList.value) {
    proxy.$alert('정기구매 상품을 선택해주세요.')
    allChecked.value = false
    return
  }
  if (!payDate.value) {
    proxy.$alert('정기구매 결제일을 선택해주세요.')
    allChecked.value = false
    return
  }
  if (!cardInfo.value) {
    proxy.$alert('정기구매 결제수단을 선택해주세요.')
    allChecked.value = false
    return
  }
  if (!termsChecked.value) {
    proxy.$alert('정기구매 이용약관에 동의해주세요.')
    allChecked.value = false
    return
  }
}
async function getOrderSummary(type) {
  if (!address.value || !productList.value || !userInfo) return
  const param = {
    identification: productList.value.identification,
    userAddressId: address.value.userAddressId.value,
    userId: userInfo.userSeqNo,
    discounts: discounts.value,
    userType: userInfo.userType,
    products: productList.value,
    orderType: 'SUBSCRIBE_ORDER'
  }
  const res = await orderService.postOrderSummary(param)
  if (res) {
    const data = res.data
    paymentInfo.value = data.paymentInfo
    if (type === 'coupon') {
      couponRef.value.hideModal()
    }
  }
}
async function checkSelectedCardHasPwd() {
  const cardStatus = await autoshipCardService.getCardPassStatus(userInfo.userSeqNo, cardInfo.value.userFavoriteCardsId)
  if (cardStatus) {
    const data = cardStatus.data
    if (data) {
      if (data.lock) {
        return 'resetPasswd'
      } else {
        return 'chngePasswd'
      }
    } else {
      return 'addCard'
    }
  } else {
    return 'resetPasswd'
  }
}
function openCardPwdInitModal(changeType, card) {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: 'CardPasswordInitModal', // 필수
      modeless: false,
      componentProps: {
        card,
        changeType,
        beforeUrl: route.path
      } // 선택
    }).onOk(() => {
    openCardPwdModal(cardInfo.value)
  })
}
function openCardPwdModal(card) {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: 'CardPasswordModal', // 필수
      modeless: false,
      componentProps: {
        card
      }
    }).onOk(() => {
    doBuy()
  })
}
async function doBuy() {
  const param = {
    order: {
      identification: identification.value,
      userAddressId: address.value.userAddressId,
      orderInternalType: 'INITIAL_ORDER',
      // userFavoriteCardsId: cardInfo.value.userFavoriteCardsId,
      userFavoriteCardsId: '632493613531530870',
      userId: userInfo.userSeqNo,
      userType: userInfo.userType,
      discounts: discounts.value,
      products: productList.value,
      orderType: 'SUBSCRIBE_ORDER',
      totProductSalesAmount: paymentInfo.value.salesAmount
    },
    payment: {
      tossRequestType: 'NORMAL',
      amount: paymentInfo.value.salesAmount,
      // paymentKey: cardInfo.value.billKey,
      paymentKey: 'c/E/qYCZANN5zS4d02tQKD8A7QJhb37Zr0Mb23HWn5wLpsLUJfIOagwiPldJLC1k',
      orderNumber: ''
    },
    summary: {
      paymentDate: payDate.value,
      turningCount: 1,
      totalCouponDiscount: paymentInfo.value.couponDiscount,
      autoShipDiscount: paymentInfo.value.autoShipDiscount,
      membershipDiscount: paymentInfo.value.membershipDiscount,
      pointDiscount: paymentInfo.value.pointDiscount,
      subtotal: paymentInfo.value.salesAmount,
      salesAmount: paymentInfo.value.salesAmount,
      totalPaymentAmount: paymentInfo.value.salesAmount,
      pointEarn: paymentInfo.value.pointEarn,
      totalBpOrigin: paymentInfo.value.totalBpOrigin,
      totalBpFinal: paymentInfo.value.totalBpFinal,
      totalSpOrigin: paymentInfo.value.totalSpOrigin,
      // totalSpFinal: paymentInfo.value.totalSpFinal,
      totalSpFinal: 0,
      totalBPAfterDiscount: paymentInfo.value.totalBPAfterDiscount
    },
    receiverInfo: {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      mobile: userInfo.mobileNumber,
      phone: userInfo.mobileNumber,
      zipCode: address.value.zipcode,
      state: address.value.state,
      city: address.value.city,
      address: address.value.address1,
      addressDetail: address.value.address2,
      addressName: address.value.addressName,
      message: message.value,
      email: ''
    }
  }
  subscribeInit.mutate(param, {
    onSuccess: () => {
      sessionDataManager.remove(SUBS_ORDER_DATA)
      router.push({
        name: 'AutoshipPayResult',
        params: { salesOrderId: res.data.salesOrderId }
      })
    }
  })
}
</script>

<style lang="scss" scoped>

</style>
