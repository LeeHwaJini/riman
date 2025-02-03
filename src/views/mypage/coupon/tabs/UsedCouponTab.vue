<template>
  <div v-if="couponList && couponList.length > 0" class="coupon-list-area">
    <ul class="coupon-list disabled">
      <li
        v-for="coupon in couponList"
        :key="coupon.couponId" >
        <div class="flex align-center justify-between">
          <span class="coupon-text">{{ $t('CP_CouponName') }}</span>
        </div>
        <template v-if="coupon.discountPolicy.discountType.code === 'RATE_DISCOUNT'">
          <div class="coupon-price-area">
            <span>{{ coupon.discountPolicy.discountRate }}</span>
            <span>%</span>
          </div>
          <div class="use-price-area">{{ $t('OP_MaxDiscountAmount') }}: {{ coupon.maxDiscountAmount }}{{ $t('CM_Won') }}</div>
        </template>
        <template v-if="coupon.discountPolicy.discountType.code === 'AMOUNT_DISCOUNT'">
          <div class="coupon-price-area">
            <span>{{ coupon.discountPolicy.discountAmount }}</span>
            <span>{{ $t('CM_Won') }}</span>
          </div>
          <div class="use-price-area">{{ $t('CP_MinDiscountAmount') }}: {{ coupon.minimumPurchaseAmount }}{{ $t('CM_Won') }}</div>
        </template>
        <div class="flex align-center justify-between">
          <div class="use-date">{{ formatDate(coupon.publishDate, DATE_FORMAT) }} - <span>{{ formatDate(coupon.expiredDate, DATE_FORMAT) }}</span></div>
        </div>
      </li>
    </ul>
  </div>

  <div v-else class="cart-none-area mt64">
    <img src="@assets/images/cart_none.svg" alt="">
    <p class="title">{{ $t('CP_EmptyUsed') }}</p>
  </div>
</template>

<script setup>
import orderService from '@/http/services/order'
import { DATE_FORMAT } from '@/utils/constant'
import { onMounted, ref } from 'vue'

const couponList = ref()
async function getCouponList() {
  const res = await orderService.getUsedCoupons()
  if (res) {
    couponList.value = res.data.list
  }
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
