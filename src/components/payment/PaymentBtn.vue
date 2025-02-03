<!--
  토스 결제 버튼
  create by hbkang
-->
<template>
  <div class="bottom-btn">
    <RButton class="btn full small type11" label="" @click="onClickPayment">
      <template #content>
        <span class="btn-price-text">{{ $moneyFormat(total) }}{{ $t('CM_Won') }}</span>
        <span>{{ $t('OP_DoPayment') }}</span>
      </template>
    </RButton>
  </div>
  <responsive-modal
    ref="paymentModal"
    title=""
    class="payment"
  >
    <template #description>
      <TossModal
        ref="tossModal"
        :orderid="props.orderid"
        :ordername="props.ordername"
      />
    </template>
  </responsive-modal>
</template>

<script setup>
import { getCurrentInstance, reactive, onBeforeUnmount } from 'vue'
import http from '@/utils/http'

const { proxy } = getCurrentInstance()

const emit = defineEmits(['onSuccess', 'onFail'])
const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  orderid: {
    type: String,
    default: ''
  },
  ordername: {
    type: String,
    default: ''
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handlePaymentMessage)
})

const onClickPayment = async () => {
  window.addEventListener('message', handlePaymentMessage) // postMessage

  try {
    proxy.$refs.paymentModal.show()
    // proxy.$refs.tossModal.showTossModal()
  } catch (e) {
    console.error(e)
  }
}

// 인증 결과 Callback
const handlePaymentMessage = async (event) => {
  try {
    console.log('handlePaymentMessage  ===> ' + event)
  } catch (e) {
    console.error(e)
  }
}

// 본인 인증 결과
const certResult = async (isSuccess, data) => {
  if (isSuccess) {
    await proxy.$alert(proxy.$t('ALT_Certification'), {
      ok: function () {
        emit('onSuccess', data)
      }
    })
  } else {
    emit('onFail')
  }
}
</script>
