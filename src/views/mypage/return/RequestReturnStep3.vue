<!--
  반품 신청 > step3
  create by jhchoi
-->
<template>
  <div class="max-width-wrap full-width-wrap pb144">

    <div class="main-title-area">
      <h3 class="">{{ $t('RET_Request') }}</h3>
    </div>

    <span v-if="isPlanner" class="error-msg">
      <i class="ico exclamation-r"/>{{ $t('RET_DownGradeAlert') }}
    </span>

    <div class="step-title-group-area">
      <hgroup class="flex align-end justify-between step-title-group">
        <h4 class="title bold primary09-color">{{ $t('RET_Agree') }}</h4>
        <RStep :step="step" :total-step="totalStep" />
      </hgroup>

      <span class="font-14 medium gray07-color mt24 block">{{ $t('RET_Notice1') }}
        <br>{{ $t('RET_Notice4') }}</span>
    </div>

    <q-list bordered class="dropdown type02">
      <q-expansion-item>
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_OrderAmount') }}
          </q-item-section>

          <q-item-section side class="right-area" />
        </template>

        <q-card class="plr16 pb16">
          <ul class="order-result-detail-price-area">
            <li class="pb8 medium">
              <span class="left-title-area  font-16">{{ $t('OP_TotalPayment') }}</span>
              <div class="price-text-area font-16">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.salesAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </li>
            <li>
              <span class="">{{ $t('OP_ProductAmount') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.productsAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </li>
            <li v-if="isLogined">
              <span class="">{{ $t('RET_CouponDiscount1') }}*</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.couponDiscount) }}{{ $t('CM_Won') }}</span>
              </div>
            </li>
            <li v-if="isLogined">
              <span class="">{{ $t('RET_CouponDiscount2') }}*</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.deliveryFeeDiscount) }}{{ $t('CM_Won') }}</span>
              </div>
            </li>
            <li v-if="isLogined">
              <span class="">{{ $t('OP_UsePoint') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.usePoint) }}{{ $t('CM_Won') }}</span>
              </div>
            </li>
            <li>
              <span class="">{{ $t('OP_DeliveryAmount') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.salesDeliveryFeeAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </li>
          </ul>
          <div v-if="isLogined">
            <ul class="order-result-price-area">
              <li>
                <span class="left-title-area">{{ $t('RET_RetrievePoint') }}</span>
                <div class="price-text-area">
                  <span>{{ $moneyFormat(returnInfo?.paymentInfo.retrievePoint) }}{{ $t('CM_Won') }}</span>
                </div>
              </li>
            </ul>
            <span class="block font-12 gray04-color">{{ $t('RET_CouponDesc') }}<br/>
              {{ $t('RET_PointDesc') }}</span>
          </div>

        </q-card>
      </q-expansion-item>

      <q-expansion-item v-if="returnInfo?.paymentInfo.additionalAmount" >
        <template #header>
          <q-item-section class="left-area">
            {{ $t('RET_ExpectedRefundAmount') }}*
          </q-item-section>

          <q-item-section side class="right-area" />
        </template>

        <q-card v-if="returnInfo?.paymentInfo.additionalAmount" class="pb24">
          <div class="flex justify-between plr16  font-16 error-color">
            <b>{{ $t('RET_AddPayAmount') }}</b>
            <div>
              <b class="">{{ $moneyFormat(returnInfo?.paymentInfo.additionalAmount) }}</b>
              <b class="ml2">{{ $t('CM_Won') }}</b>
            </div>
          </div>

          <div class="mlr16 mt16 error-color-card">
            <b class="block font-14">{{ $t('RET_PaymentDueDate', {date: addDate(nowDate(), 'YYYY-MM-DD', {day: 3})}) }}</b>
          </div>

          <ul class="explanation-text none mlr16 font-12">
            <li>{{ $t('RET_AddPayAmountDesc') }}</li>
            <li>{{ $t('RET_CancelAfterDueDate') }}</li>
          </ul>

        </q-card>
      </q-expansion-item>

      <q-expansion-item v-if="isLogined">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('RET_ExpectedRefundPoint') }}
          </q-item-section>

          <q-item-section side class="right-area" />
        </template>

        <q-card class="pb24">

          <div class="list type06">
            <div class="large field font-16">
              <span class="">{{ $t('RET_ReturnPoint1') }}</span>
              <div class="price-text-area">
                <span>{{ returnInfo?.paymentInfo.expectedPointRecoveryAmount > 0 ? '-' : '' }}{{ $moneyFormat(returnInfo?.paymentInfo.expectedPointRecoveryAmount) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint2') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.retrievePoint) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint3') }}*</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.pointRankDown) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

          </div>

          <div class="list type06">
            <div class="large field font-16">
              <span class="">{{ $t('RET_ReturnPoint4') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.remainingPointRecoveryAmount) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint5') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.pointOrderExpect) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint6') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.pointDeductMy) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint13') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.readyPoint) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-12 mt0">
              <span class="">※ {{ $t('RET_ReturnPoint14') }}</span>
            </div>
          </div>

          <div class="list type06">
            <div class="large field font-16">
              <span class="">{{ $t('RET_ReturnPoint7') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.returnPoint) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint1') }}</span>
              <div class="price-text-area">
                <span>{{ returnInfo?.paymentInfo.expectedPointRecoveryAmount > 0 ? '-' : '' }}{{ $moneyFormat(returnInfo?.paymentInfo.expectedPointRecoveryAmount) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint5') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.pointOrderExpect) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint6') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.pointDeductMy) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint13') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.readyPoint) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div class="field font-12 mt0">
              <span class="">※ {{ $t('RET_ReturnPoint14') }}</span>
            </div>
          </div>
        </q-card>
      </q-expansion-item>

      <q-expansion-item>
        <template #header>
          <q-item-section class="left-area">
            {{ $t('RET_ExpectedTotalRefundAmount') }}
          </q-item-section>

          <q-item-section side class="right-area" />
        </template>

        <q-card class="pb24">

          <div class="list type07">
            <div class="large field font-16">
              <span class="">{{ $t('RET_ReturnTotalAmount2') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.refundAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class=""> {{ $t('RET_ReturnProuctAmount') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.salesAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </div>

            <div class="field font-14">
              <span class=""> {{ $t('RET_ReturnAddressAmount') }}*</span>
              <div class="price-text-area">
                <span>{{ returnInfo?.paymentInfo.returnDeliveryFeeAmount > 0 ? '-' : '' }}{{ $moneyFormat(returnInfo?.paymentInfo.returnDeliveryFeeAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </div>

            <div v-if="isPlanner && returnInfo?.paymentInfo.deductPeriodAmount" class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint8') + `(${returnInfo?.paymentInfo.deductPeriodRate}%)` }}</span>
              <div class="price-text-area">
                <span>-{{ $moneyFormat(returnInfo?.paymentInfo.deductPeriodAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </div>
            <div v-if="isPlanner && returnInfo?.paymentInfo.deductPeriodAmount" class="field font-14">
              <span class="">{{ $t('RET_DeductDate', {date: returnInfo?.paymentInfo.deductPeriodDate}) }}</span>
            </div>

            <div v-if="isLogined" class="field font-14">
              <span class=""> {{ $t('RET_ReturnPoint9') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.returnPoint) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>
          </div>

          <div v-if="isLogined" class="list type07">
            <div class="large field font-16">
              <span class="">{{ $t('RET_ReturnPoint10') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.refundPoint) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div v-if="isLogined" class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint11') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.pointDiscount) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>

            <div v-if="isLogined" class="field font-14">
              <span class="">{{ $t('RET_ReturnPoint12') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(returnInfo?.paymentInfo.pointExpired) }}{{ $t('CM_PointUnit') }}</span>
              </div>
            </div>
          </div>

        </q-card>
      </q-expansion-item>

      <q-expansion-item v-if="returnInfo?.paymentInfo?.refundPaymentType?.code === 'VIRTUAL_ACCOUNT' || returnInfo?.paymentInfo?.refundPaymentType?.code === 'ACCOUNT_TRANSFER'">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('CM_RefundAccount') }}
          </q-item-section>

          <q-item-section side class="right-area">
          </q-item-section>
        </template>
        <q-card>
          <div class="none-user-delivery-info-area">

            <dl v-if="refundAccountInfo" class="order-info-list-area">
              <dt>{{ $t('CM_RefundAccount') }}</dt>
              <dd class="flex align-center justify-end gap8">
                <div>{{ refundAccountInfo?.bankAccountInfo?.bankName }} {{ refundAccountInfo?.bankAccountInfo?.bankAccountNo }}</div>
                <RButton class="btn type13" :label="$t('CM_Change')" @click="onAccountRegOpenModal"></RButton>
              </dd>
            </dl>

            <dl v-else class="order-info-list-area">
              <dt>{{ $t('CM_RefundAccount') }}</dt>
              <dd><RButton class="btn type13" :label="$t('ORD_RegistRefundAccount')" @click="onAccountRegOpenModal"></RButton></dd>
            </dl>
            <ul class="explanation-text blue font-12">
              <li>{{ $t('ORD_RefundDesc5') }}</li>
              <li>{{ $t('ORD_RefundDesc2') }}</li>
              <li>{{ $t('ORD_RefundDesc3') }}</li>
              <li>{{ $t('ORD_RefundDesc4') }}</li>
            </ul>

          </div>

        </q-card>
      </q-expansion-item>

    </q-list>

    <div class="plr16 mt24">
      <ul class="explanation-text gray font-14  gray05-color">
        <li v-if="isLogined">{{ $t('RET_ReturnPointDesc1') }}</li>
        <li v-if="isLogined">{{ $t('RET_ReturnPointDesc2') }}</li>
        <li>{{ $t('RET_ReturnPointDesc3') }}</li>
        <li>{{ $t('RET_ReturnPointDesc4') }}</li>
        <li><b>{{ $t('RET_ReturnPointDesc5') }}</b></li>
      </ul>

      <span v-if="isLogined" class="block font-14 mt16 gray07-color">{{ $t('RET_AgreeConfirm1') }}</span>
      <span v-else class="block font-14 mt16 gray07-color">{{ $t('RET_AgreeConfirm2') }}</span>

      <RCheckbox v-model="isAgree" class="checkbox-area type02 mt8">
        <b class="gray07-color">{{ $t('CM_Agree') }}</b>
        <span class="ml4 error-color font-12 regular">{{ $t('RET_AgreeDesc') }}</span>
      </RCheckbox>
    </div>

    <div class="bottom-btn">
      <div class="flex-btn-area">
        <RButton class="btn full small type03" :label="$t('RET_Cancel')" @click="onClickCancel" />
        <RButton v-if="returnInfo?.paymentInfo?.additionalAmount && returnInfo?.returnOrderStatus?.code === 'RETURN_REQUEST'" class="btn full small type02" :label="$t('RET_DoAdditionalPayment')" :disable="!isAgree" @click="onClickPayment"/>
        <RButton v-else class="btn full small type02" :label="$t('RET_Regist')" :disable="!isAgree" @click="onClickSubmit"/>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, getCurrentInstance, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import memberService from '@/http/services/member'
import orderService from '@/http/services/order'
import { useMainStore } from '@/store/mainStore'
import TossModal from '@/components/modal/TossModal.vue'
import { addDate, nowDate } from '@/utils/dateFormat'
import { checkPlanner } from '@/utils/common'
import { isLogin } from '@/utils/login'
import { sessionDataManager } from '@/utils/dataManager'

const { proxy } = getCurrentInstance()

const totalStep = ref(3)
const step = ref(3)
const router = useRouter()
const route = useRoute()
const query = route.query

const isAgree = ref(false)

const mainStore = useMainStore()
const userSeqNo = mainStore.userInfo.userSeqNo

const returnInfo = ref(null)
const refundAccountInfo = ref(null)
const redemptionInfo = ref(null)

const isPlanner = computed(() => checkPlanner())
const isLogined = computed(() => isLogin())

const returnOrderNumber = window.history.state.returnOrderNumber ?? sessionDataManager.get('returnOrderNumber') ?? route.params.returnOrderNumber
const salesOrderId = window.history.state.salesOrderId ?? sessionDataManager.get('salesOrderId') ?? route.params.salesOrderId
const tempId = route.query.tempId

nextTick(() => {
  if (query.paymentKey && redemptionInfo.value) {
    return
  }

  if (!returnOrderNumber || !salesOrderId && tempId) {
    router.replace('/mypage')
    return
  }
})

onMounted(() => {
  if (window.history.state.back?.includes('returnDetail')) {
    tempId ? router.replace({ path: '/mypage/orderList', query: { tempId } }) : router.replace('/mypage/returnList')
    return
  }

  if (query.paymentKey) {
    isAgree.value = true
    redemptionInfo.value = JSON.parse(sessionDataManager.get('return_request_temp_data'))
    onPaymentSuccess()
    return
  } else {
    getReturnAgree()
    !tempId && getRefundAccount()
  }
})

const getReturnAgree = async () => {
  const param = {
    salesOrderId,
    returnOrderNumber,
    identification: tempId
  }

  const result = isLogined.value
    ? await orderService.getReturnAgree(param)
    : await orderService.getNonMemberReturnAgree(param)

  if (result) {
    returnInfo.value = result.data

    if (result.data.returnOrderStatus.code === 'RETURN_REQUEST_COMPLETE') {
      tempId ? router.replace({ path: '/mypage/orderList', query: { tempId } }) : router.replace('/mypage/returnList')
    }
  }
}

const getRefundAccount = async () => {
  const userId = userSeqNo
  const result = await memberService.getRefundAccount(userId)

  if (result) {
    refundAccountInfo.value = result.data
  }
}

const onClickCancel = async () => {
  const param = {
    returnOrderNumber,
    identification: tempId
  }
  proxy.$confirm(proxy.$t('RET_CancelConfirm'), {
    title: '',
    ok: async () => {
      const result = isLogined.value
        ? await orderService.postCancelReturn(returnOrderNumber)
        : await orderService.postNonMemberCancelReturn(param)

      if (result) {
        router.replace({ path: '/mypage/returnDetail', query: { tempId, returnNumber: returnOrderNumber } })
      }
    },
    cancel: () => {
      return
    }
  })
}

const onClickSubmit = async () => {
  if (!isAgree.value) {
    return
  }

  const isVirtualAccountPayment = returnInfo.value?.paymentInfo?.refundPaymentType?.code === 'VIRTUAL_ACCOUNT' || returnInfo.value?.paymentInfo?.refundPaymentType?.code === 'ACCOUNT_TRANSFER'

  if (!tempId && isVirtualAccountPayment &&
    !refundAccountInfo.value?.userRefundBankAccountId) {
    await proxy.$alert(proxy.$t('RET_RefundRegistAlert'))
    return
  }
  proxy.$showProgress() // Progress Show

  const params = {
    returnOrderNumber,
    userRefundBankAccountId: isVirtualAccountPayment ? refundAccountInfo.value?.userRefundBankAccountId : null,
    isReturnOrderAgree: isAgree.value,
    pointRedemptionAmount: returnInfo.value?.paymentInfo.returnPoint,
    paymentRedemptionAmount: returnInfo.value?.paymentInfo.refundAmount,
    redemptionId: null,
    payment: null,
    identification: tempId
  }

  const result = isLogined.value
    ? await orderService.postReturnAgree(returnOrderNumber, params)
    : await orderService.postNonMemberReturnAgree(params)

  if (result) {
    await proxy.$alert(proxy.$t('RET_Success'), {
      ok: () => {
        router.push({ path: '/mypage/returnDetail', query: { tempId, returnNumber: returnOrderNumber } })
      }
    })
  }
}

const onClickPayment = () => {
  const props = {
    total: returnInfo.value?.paymentInfo?.additionalAmount,
    orderid: returnInfo.value?.redemptionInfo?.redemptionNumber,
    ordername: proxy.$t('RET_AdditionalPayment'),
    isRedemption: true
  }
  sessionDataManager.set('return_request_temp_data', JSON.stringify(returnInfo.value))
  sessionDataManager.set('paymentInfo', JSON.stringify(props))
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: TossModal, // 필수
      componentProps: props,
      modeless: false // 선택
    })
    .onOk(() => {})
    .onCancel(() => {})
    .onDismiss(() => {})
}

const onPaymentSuccess = async () => {
  const returnInfo = redemptionInfo.value

  const paymentInfo = JSON.parse(sessionDataManager.get('paymentInfo'))

  proxy.$showProgress() // Progress Show
  const params = {
    userRefundBankAccountId: (returnInfo?.paymentInfo?.refundPaymentType?.code === 'VIRTUAL_ACCOUNT' || returnInfo?.paymentInfo?.refundPaymentType?.code === 'ACCOUNT_TRANSFER') ? refundAccountInfo.value?.userRefundBankAccountId : null,
    isReturnOrderAgree: isAgree.value,
    pointRedemptionAmount: returnInfo?.paymentInfo.returnPoint,
    paymentRedemptionAmount: returnInfo?.paymentInfo.refundAmount,
    redemptionId: returnInfo?.redemptionInfo.redemptionId,
    payment: {
      tossRequestType: paymentInfo.tossPaymentType === 'KEYIN' ? 'KEYIN' : query.paymentType,
      paymentKey: query.paymentKey,
      orderNumber: returnInfo?.redemptionInfo.redemptionNumber,
      orderId: returnInfo?.redemptionInfo.returnOrderId,
      amount: query.amount,
      userId: returnInfo?.userId ?? null
    }
  }

  const result = await orderService.postReturnAgree(returnInfo?.redemptionInfo?.returnOrderNumber, params)

  if (result) {
    await proxy.$alert(proxy.$t('RET_Success'), {
      ok: () => {
        router.push({ path: '/mypage/returnDetail', query: { returnNumber: returnInfo?.redemptionInfo.returnOrderNumber } })
        sessionDataManager.remove('return_request_temp_data')
        window.history.replaceState({}, null, window.location.pathname)
      }
    })
  }
}

const onAccountRegOpenModal = () => {
  proxy.openModal({
    parent: proxy, // 필수
    component: 'ResponsiveModal',
    componentProps: {
      title: refundAccountInfo.value.userRefundBankAccountId ? proxy.$t('ORD_RefundChange') : proxy.$t('ORD_RefundRegist'),
      contentComponent: 'AccountRegModal',
      wrapClass: 'bottom-btn-modal',
      pageState: {
        userId: userSeqNo,
        userRefundBankAccountId: refundAccountInfo.value.userRefundBankAccountId
      },
      onUpdate: getRefundAccount

    }
  })
}

</script>

