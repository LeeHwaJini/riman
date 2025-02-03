<!--
  자주쓰는 카드 등록을 위한 카드 빌링 정보 조회 기능 (토스페이먼츠)
  create by jmchoi
-->
<template>
  <div>
    <RButton :class="btnClass" :label="label" :disabled="btnDisabled" @click="onBtnClick" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMainStore } from '@store/mainStore'
import { i18n } from '@utils/i18n'

const props = defineProps({
  // 버튼 Label
  label: {
    type: String,
    default: () => i18n.global.t('CM_BillingBtn')
  },
  // 버튼 Class
  btnClass: {
    type: String,
    default: ''
  },
  // 버튼 disabled
  btnDisabled: {
    type: Boolean,
    default: false
  },
  // success,faile 결과 Redirect
  url: {
    type: String,
    default: '/'
  }
})

const mainStore = useMainStore()
const clientKey = import.meta.env.VITE_TOSS_BILL_CLIENT_KEY
const customerKey = mainStore.userInfo.userSeqNo // 구매자 ID
const tossPayments = TossPayments(clientKey)
const payment = tossPayments.payment({ customerKey })
const baseUrl = import.meta.env.VITE_APP_BASE_URL

const onPayment = async () => {
  await payment.requestBillingAuth({
    method: 'CARD',
    successUrl: 'http://localhost:3000' + '/billing/success?redirect=' + props.url,
    failUrl: 'http://localhost:3000' + '/billing/fail?redirect=' + props.url
    // customerEmail: 'jmchoi@riman.com',
    // customerName: '김토스'
  })
}

const onBtnClick = async () => {
  onPayment()
}

</script>
