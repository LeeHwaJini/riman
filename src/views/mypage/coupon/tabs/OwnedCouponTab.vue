<template>
  <div v-if="couponList && couponList.length > 0" class="coupon-list-area">
    <ul class="coupon-list">
      <li
        v-for="(coupon, index) in couponList"
        :key="coupon.couponId"
        :class="{'scale-x-active': cardStatus[index]}"
        class="h157 pd16"
      >
        <template v-if="!cardStatus[index]">
          <div class="flex align-center justify-between">
            <span class="coupon-text">{{ coupon.couponName }}</span>
            <i class="ico arrow-circle-right-light-g pointer" @click="() => onFlipCard(index)"></i>
          </div>
          <template v-if="coupon.discountPolicy.discountType.code === 'RATE_DISCOUNT'">
            <div class="coupon-price-area">
              <span>{{ coupon.discountPolicy.discountRate }}</span>
              <span>%</span>
            </div>
            <div class="use-price-area">{{ $t('OP_MaxDiscountAmount') }}: {{ coupon.maxDiscountAmount }}원</div>
          </template>
          <template v-if="coupon.discountPolicy.discountType.code === 'AMOUNT_DISCOUNT'">
            <div class="coupon-price-area">
              <span>{{ coupon.discountPolicy.discountAmount }}</span>
              <span>원</span>
            </div>
            <div class="use-price-area">최소 주문 금액: {{ coupon.minimumPurchaseAmount }}원</div>
          </template>
          <!--
                  **현재는 당일이지만 추후에 날짜 변경 될 수도 있음**
                  유효기간이 당일인 경우 <span class="error-color">yyyy.mm.dd</span>
                  아닐 경우  <span class="">yyyy.mm.dd</span>
                  -->
          <div class="flex align-center justify-between">
            <div class="use-date">{{ formatDate(coupon.publishDate, dateFormat) }} - <span :class="{'error-color': Number(coupon.daysToDday) <= 0}">{{ formatDate(coupon.expiredDate, dateFormat) }}</span></div>
            <span v-if="coupon.daysToDday <= 30" class="date" :class="{'error-color': coupon.daysToDday <= 0}">D-{{ getDateDiff(coupon.expiredDate) }}</span>
          </div>
        </template>
        <template v-else>
          <div class="text-right h24">
            <i class="ico arrow-circle-left-light-g pointer" @click="() => onFlipCard(index)"></i>
          </div>
          <ul class="coupon-detail-list">
            <li>{{ $t('CP_Info_txt1', {type: getOrderType(coupon)}) }}</li>
            <li v-if="coupon.orderCancelReissue">{{ $t('CP_Info_txt2') }}</li>
            <li v-if="!coupon.allowIssueDuplicateCouponYn">{{ $t('CP_Info_txt3') }}</li>
            <li>{{ $t('CP_Info_txt4') }} : 플래너(Planner, Senior Manager)</li>
          </ul>
        </template>
      </li>
    </ul>
  </div>

  <div v-else class="cart-none-area mt64">
    <img src="@assets/images/cart_none.svg" alt="">
    <p class="title">{{ $t('CP_Empty') }}</p>
  </div>
</template>

<script setup>
import orderService from '@/http/services/order'
import { formatDate } from '@/utils/dateFormat'
import { getCurrentInstance, onMounted, ref } from 'vue'

const couponList = ref()
const dateFormat = 'YYYY-MM-DD'
const cardStatus = ref()
const { proxy } = getCurrentInstance()
const onFlipCard = (index) => {
  cardStatus.value[index] = !cardStatus.value[index]
}
async function getCouponList() {
  const res = await orderService.getOwnedCouponsAll()
  if (res) {
    couponList.value = res.data.list
    cardStatus.value = res.data.list.map(item => false)
  }
}
function getOrderType(coupon) {
  let couponType = ''
  if (coupon.orderType.code === 'ALL') {
    couponType = proxy.$t('CM_All')
  }
  if (coupon.orderType.code === 'STANDARD_ORDER') {
    couponType = proxy.$t('ORD_Normal')
  }
  if (coupon.orderType.code === 'AUTO_SHIP') {
    couponType = proxy.$t('CP_Subs')
  }
  return couponType
}
onMounted(() => {
  getCouponList()
})
</script>
  <style lang="scss" scoped>
  .coupon-list li {
    transition: transform 0.3s ease-out;

  }

  .scale-x-active {
    transform: scaleX(-1); // 회전 효과
    transition: transform 0.3s ease-out;

   // transition: transform 0.3s ease-out;

    > * {
      transform: scaleX(-1); // 하위 요소도 회전
    }
  }

  </style>
