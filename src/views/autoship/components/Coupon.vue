<template>
  <q-expansion-item v-model="open">
    <template #header>
      <q-item-section class="left-area">
        쿠폰
      </q-item-section>
      <q-item-section side class="right-area" />
    </template>

    <q-card class="order-coupon-area">

      <div class="coupon-top-area">
        <RSwitch
          :model-value="apllyMaxBenefit"
          label="간편하게 최대 할인 쿠폰을 적용해보세요."
          class="switch type01"
          @update:model-value="onToggleMaxBenefit"
        />
      </div>
      <div class="coupon-bottom-area">
        <RButton class="btn type03 full small" label="쿠폰 찾아보기" @click="onCouponOpenModal"/>

        <div v-if="selectedCoupon" class="order-coupon-use-area">
          <div class="coupon-text-area" @click="visible = !visible" >
            <div class="left-text-area flex align-center gap4">
              <div class="">
                <span>총</span>
                <span>1</span>
                <span>개 사용</span>
              </div>
              <!-- <i class="ico arrow-top-type02-n drop-down-icon" :class="{'rotate':visible}"></i> -->
            </div>
            <div class="right-text-area type01">
              <!-- 쿠폰 사용 시 노출 -->
              <span class="success04-color bold">당신은혜택왕!</span>
              <!-- //쿠폰 사용 시 노출-->
              <span>{{ $moneyFormat(selectedCoupon?.calculateDiscountAmount) }}</span>
              <span>{{ $t('CM_Won') }}</span>
            </div>
          </div>

          <!-- <q-slide-transition>
            <div v-if="visible"> -->
          <ul class="list type02">
            <li>
              <div class="top-area">
                <span>{{ selectedCoupon?.couponName }}</span>
                <i class="ico close-g" @click="onDeleteCoupon"></i>
              </div>
              <div class="bottom-area">
                <div class="left-text-area">
                  <span>유효기간</span>
                  <span>{{ formatDate(selectedCoupon?.expiredDate, DATE_FORMAT) }}</span>
                </div>
                <div class="right-text-area">-{{ $moneyFormat(selectedCoupon?.calculateDiscountAmount) }}{{ $t('CM_Won') }}</div>
              </div>
            </li>
          </ul>
          <span class="discount-amount-text text-right block">*쿠폰할인금액 기준</span>
          <!-- </div>

          </q-slide-transition> -->

        </div>
      </div>

    </q-card>
  </q-expansion-item>
  <responsive-modal
    ref="couponModal"
    title="사용 가능한 쿠폰"
    class="coupon-use-modal bottom-btn-modal"
  >
    <template #description>
      <div class="coupon-list-area">
        <div class="pr8">
          <RButton class="btn full large type03 none-select-btn" label="선택 안 할래요." @on-click="() => onClickCoupon()" />
        </div>
        <ul class="coupon-list popup-scroll large scroll type01">
          <li v-for="coupon in couponList" :key="coupon.couponId" @click="() => onClickCoupon(coupon)">
            <div class="flex align-center justify-between">
              <span class="coupon-text">{{ coupon.couponName }}</span>
              <!--
                **현재는 당일이지만 추후에 날짜 변경 될 수도 있음**
                유효기간이 당일인 경우 <span class="date error-color">D-00</span>
                아닐 경우  <span class="date">D-00</span>
                -->
              <span v-if="coupon.daysToDday <= 30" class="date" :class="{'error-color': coupon.daysToDday === 0}">D-{{ getDateDiff(coupon.expiredDate) }}</span>

            </div>
            <template v-if="coupon.discountPolicy.discountType.code === 'AMOUNT_DISCOUNT'">
              <div class="coupon-price-area">
                <span>{{ coupon.discountPolicy.discountAmount }}</span>
                <span>{{ $t('CM_Won') }}</span>
              </div>
              <div class="use-price-area">최소 사용 금액: {{ coupon.minPurchaseAmount }}{{ $t('CM_Won') }}</div>
            </template>
            <template v-if="coupon.discountPolicy.discountType.code === 'RATE_DISCOUNT'">
              <div class="coupon-price-area">
                <span>{{ coupon.discountPolicy.discountRate }}</span>
                <span>%</span>
              </div>
              <div class="use-price-area">{{ $t('OP_MaxDiscountAmount') }}: {{ coupon.maxDiscountAmount }}원</div>
            </template>
            <!--
                **현재는 당일이지만 추후에 날짜 변경 될 수도 있음**
                유효기간이 당일인 경우 <span class="error-color">yyyy.mm.dd</span>
                아닐 경우  <span class="">yyyy.mm.dd</span>
                -->
            <div class="use-date">{{ formatDate(coupon.publishDate, DATE_FORMAT) }} -
              <span :class="{'error-color': Number(coupon.daysToDday) <= 0}">{{ formatDate(coupon.expiredDate, DATE_FORMAT) }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- <div class="popup-bottom-area">
        <div class="popup-bottom-btn">
          <RButton class="btn full small type02" label="사용하기" @on-click="" />
        </div>
      </div> -->

    </template>
  </responsive-modal>
</template>

<script setup>
import orderService from '@/http/services/order'
import { DATE_FORMAT } from '@/utils/constant'
import { formatDate, nowDate } from '@/utils/dateFormat'
import { date } from 'quasar'
import { getCurrentInstance, ref } from 'vue'

const { proxy } = getCurrentInstance()
const couponModal = ref()
const open = ref(true)
const couponList = ref()
const selectedCoupon = ref()
const apllyMaxBenefit = ref(false)
const visible = ref(false)
const emit = defineEmits(['addCoupon'])
const props = defineProps({
  salseAmount: {
    type: Number,
    default: 0
  }
})
const onCouponOpenModal = () => {
  getOwendCouponList()
  couponModal.value.show()
}
const onDeleteCoupon = () => {
  selectedCoupon.value = null
  apllyMaxBenefit.value = false
}
const onClickCoupon = (coupon) => {
  let _coupon = null
  if (coupon) {
    _coupon = coupon
    apllyMaxBenefit.value = false
    selectedCoupon.value = _coupon
    emit('addCoupon', _coupon)
  } else {
    hideModal()
  }
}
const onToggleMaxBenefit = async (v) => {
  apllyMaxBenefit.value = v
  if (v) {
    if (!props.salseAmount) {
      proxy.$alert('상품을 선택해 주세요.')
      return
    }
    const param = {
      totalPaymentAmount: 2000,
      orderType: 'AUTO_SHIP'
    }
    const res = await orderService.getCouponList(param)
    if (res) {
      selectedCoupon.value = res.data
      emit('addCoupon', res.data)
    }
  } else {
    selectedCoupon.value = null
    emit('addCoupon', null)
  }
}
function hideModal() {
  couponModal.value.hide()
}
async function getOwendCouponList() {
  const res = await orderService.getOwnedCoupons()
  if (res) {
    couponList.value = res.data.list
  }
}
function getDateDiff(expiredDate) {
  const _nowDate = nowDate()
  const _expiredDate = formatDate(expiredDate)
  return date.getDateDiff(_expiredDate, _nowDate)
}
defineExpose({
  hideModal
})
</script>

<style lang="scss" scoped>

</style>
