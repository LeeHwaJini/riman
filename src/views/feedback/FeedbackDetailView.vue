<template>
  <div class="max-width-wrap  full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">고객의 소리 등록내역</h3>
    </div>

    <div class="plr16 pt24 flex align-center justify-between border-top-3-gray">
      <h6 class="bold gray07-color">나의 문의</h6>
      <span class="font-10 font-montserrat gray03-color">YYYY.MM.DD   hh.mm.ss</span>
    </div>

    <div class="plr16">

      <div class="order-num-get-area">
        <div class="top-area">
          <b class="font-14 primary09-color">{주문번호}</b>
        </div>
        <div class="botom-area gray07-color">
          <span class="font-14 left-text">{1번째 제품명}</span>
          <span class="font-14 flex-shrink0">외 5개</span>
        </div>
      </div>

      <div class="mtb24">
        <span class="status-icon font-12 gray07-color">취소/환불</span>
        <div class="font-12 bold gray04-color mt10">{유저가 적었던 title}</div>
        <div class="font-12 gray04-color mt10">{유저가 적었던 문의내용}</div>
        <div class="inquiry-img-area">
          <img src="@assets/images/temp/prd_list.png" alt="">
          <img src="@assets/images/temp/prd_list.png" alt="">
        </div>
      </div>

      <div class="flex no-wrap gap4">
        <RInput
          ref="idRef"
          v-model="input"
          disable
          placeholder="010"
          class="login-input login-input--id input-num"
        />
        <RInput
          ref="idRef"
          v-model="input"
          disable
          placeholder="0000"
          class="login-input login-input--id input-num"
        />
        <RInput
          ref="idRef"
          v-model="input"
          disable
          placeholder="0000"
          class="login-input login-input--id input-num"
        />
      </div>
    </div>

    <div class="mt24 plr16 ptb24 flex align-center justify-between border-top-3-gray">
      <h6 class="bold gray07-color">1:1 문의 답변</h6>
      <span class="font-10 font-montserrat gray03-color">YYYY.MM.DD   hh.mm.ss</span>
    </div>

    <div class="mlr16 inquiry-answer-area">
      안녕하세요 고객님, 리만코리아 고객지원팀입니다. 건성피부의 경우 진정 성분과 하이드로겐 성분으로 수분감있는 [인셀덤 카밍 밸런스 젤] 제품을 추천드립니다.
    </div>

    <div class="plr16 pb24 inquiry-img-area border-bottom-3-gray">
      <img src="@assets/images/temp/prd_list.png" alt="">
      <img src="@assets/images/temp/prd_list.png" alt="">
    </div>

    <div class="bottom-btn">
      <div class="flex-btn-area">
        <RButton class="btn full small type03 " label="취소" @on-click="" />
        <RButton class="btn full small type02" label="등록하기" @on-click="" />
      </div>
    </div>
  </div>

</template>

<script setup>
import { onMounted, ref, reactive, computed, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const messageText = ref('')
const checkbox = ref()

const tabValue = ref('tab1')

const tabOrderList = [
  { label: '일반 주문내역', name: 'tab1' },
  { label: '정기구매 주문내역', name: 'tab2' }
]

const tabList = [
  { text: '주문/결제', name: 'order_payment' },
  { text: '취소/환불', name: 'cancellation_refund' },
  { text: '배송/반품', name: 'shipping_return' },
  { text: '정기구매', name: 'subscription' },
  { text: '이벤트', name: 'event' },
  { text: '상품문의', name: 'product_inquiry' },
  { text: '회원문의', name: 'membership_inquiry' },
  { text: '포인트/쿠폰', name: 'points_coupons' },
  { text: '기타', name: 'other' }
]

const onOpenModal = () => {
  proxy.$refs.orderNumLoadModal.show()
}

</script>

<style lang="scss" scoped>

</style>
