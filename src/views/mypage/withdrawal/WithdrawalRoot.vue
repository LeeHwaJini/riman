<!--
  마이페이지 > 내 정보 관리 > 회원탈퇴
  create by jhchoi
-->
<template>
  <component
    :is="componentName"
    :point="pageState.activePoint"
    :coupon="pageState.activeCoupon"
    :name="pageState.userName"
  />

</template>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import orderService from '@/http/services/order'
import { useMainStore } from '@store/mainStore'
import PlannerWithdrawal from './partital/PlannerWithdrawal'
import CustomerWithdrawal from './partital/CustomerWithdrawal'
const isCoupon = import.meta.env.VITE_APP_IS_COUPON === 'true'

import { checkPlanner } from '@/utils/common'

const mainStore = useMainStore()
const userInfo = mainStore.getUser

const componentName = computed(() => {
  return checkPlanner() ? PlannerWithdrawal : CustomerWithdrawal
})

const pageState = reactive({
  userName: '',
  activePoint: 0,
  activeCoupon: 0
})

onMounted(() => {
  pageState.userName = userInfo.fullName
  getPoint()
  getCoupon()
})

/**
 * 보유 포인트 조회
 */
const getPoint = async () => {
  const result = await orderService.getPoint(userInfo.userSeqNo)
  if (result && result.message === 'success') {
    pageState.activePoint = result.data.activePoint
  }
}

/**
 * 보유 쿠폰 조회
 */
const getCoupon = async () => {
  if (!isCoupon) {
    return false
  }
  const couponResult = await orderService.getOwnedCoupons()
  if (couponResult && couponResult.message === 'success') {
    pageState.activeCoupon = couponResult.data.list.length
  }
}

</script>
