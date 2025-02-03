<!--
PaymentModal
create by hbkang (2024-08-29)
-->

<template>
  <q-dialog
    ref="dialog"
    :position="position"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    class="full-page-modal"
  >
    <layout-modal
      ref="layoutModal"
      :disabled-close-button="false"
    >
      <template #body>
        <div class="title-top-area">
          <h4>{{ $t('OP_Order') }}</h4>
          <button class="menu-close-btn" @click="hide">
            <i class="ico close" />
          </button>
        </div>

        <div class="scroll type01 popupo-max-h-530">
          <div id="payment" />
          <div id="agreement" />
        </div>

        <div class="popup-bottom-area">
          <div class="popup-bottom-btn">
            <RButton id="payment-button" class="btn full small type02" :label="$t('OP_DoPayment')" @on-click="onPayment" />
          </div>
        </div>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useMainStore } from '@store/mainStore'
import { ANONYMOUS } from '@tosspayments/payment-widget-sdk'
import { sessionDataManager } from '@utils/dataManager'

const { proxy } = getCurrentInstance()
const emit = defineEmits(['ok', 'cancel'])
const dialog = ref()
const mainStore = useMainStore()
const userId = mainStore.userInfo.userSeqNo
const paymentInfo = JSON.parse(sessionDataManager.get('paymentInfo'))
const guestInfo = JSON.parse(sessionDataManager.get('nonUserInfo'))
const clientKey = import.meta.env.VITE_TOSS_BILL_CLIENT_KEY
const customerKey = userId || ANONYMOUS
// const customerKey = 'DqzhMQtRRYa-FlcQU45hX'
let paymentMethodWidget
console.log('customerKey', customerKey)
const widgets = window.payments.widgets({
  customerKey
})

const props = defineProps({
  total: {
    type: Number,
    required: true,
    default: 0
  },
  orderid: {
    type: String,
    required: true,
    default: ''
  },
  ordername: {
    type: String,
    required: true,
    default: ''
  },
  user: {
    type: String,
    required: false,
    default: ''
  },
  isRedemption: {
    type: Boolean,
    required: false,
    default: false
  }
})

const hide = () => {
  dialog.value.hide()
}

const getPaymentMethod = async () => {
  const paymentMethod = await paymentMethodWidget.getSelectedPaymentMethod()
  paymentInfo.tossPaymentType = paymentMethod.code
  sessionDataManager.set('paymentInfo', JSON.stringify(paymentInfo))
}

const onPayment = async () => {
  const isUser = !!userId
  // const userInfo = userId ? mainStore.userInfo : guestInfo

  getPaymentMethod()
  const successUrl = props.user !== '' ? window.location.origin + '/order/guest' : window.location.origin + '/order'
  widgets.requestPayment({
    orderId: props.orderid,
    orderName: props.ordername,
    successUrl: window.location.href,
    failUrl: successUrl,
    customerEmail: isUser ? mainStore.userInfo.email : '',
    customerName: isUser ? mainStore.userInfo.fullName : guestInfo.guestName,
    customerMobilePhone: isUser ? mainStore.userInfo.mobileNumber : guestInfo.mobileNumber,
    transfer: {
      useEscrow: false
    }
  })
}

onMounted(async () => {
  if (!window.payments) {
    console.error('Payments 가 로드되지 않았습니다.')
    return
  }

  await widgets.setAmount({
    currency: 'KRW',
    value: props.total
  })

  await Promise.all([
    // ------  결제 UI 렌더링 ------
    widgets.renderPaymentMethods({
      selector: '#payment',
      variantKey: !props.isRedemption
        ? userId ? import.meta.env.VITE_TOSS_WIDGET_KEY : import.meta.env.VITE_TOSS_NONUSER_WIDGET_KEY
        : userId ? import.meta.env.VITE_TOSS_REDEMPTION_WIDGET_KEY : import.meta.env.VITE_TOSS_REDEMPTION_NONUSER_WIDGET_KEY
    }).then(widget => {
      paymentMethodWidget = widget
    }),
    // ------  이용약관 UI 렌더링 ------
    widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' })
  ])
})
</script>
