<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t('OP_Order') }}</h3>
    </div>
    <q-list bordered class="dropdown type02">
      <q-expansion-item v-model="openAddress">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_DeliveryInfo') }}
          </q-item-section>
          <q-item-section side class="right-area">
            <!-- //정보 없을 경우 영역 제거 -->
          </q-item-section>
        </template>
        <q-card>
          <div class="none-user-delivery-info-area">
            <dl class="order-info-list-area">
              <dt>{{ $t('NUP_OrderName') }}</dt>
              <dd>{{ nonUserInfo?.guestName }}</dd>
              <dt>{{ $t('OC_DeliveryInfo5') }}</dt>
              <dd>{{ nonUserInfo?.mobileNumber }}</dd>
              <dt>{{ $t('CM_ReferrerInfo') }}</dt>
              <dd>{{ nonUserInfo?.reffererNation }} {{ nonUserInfo?.reffererUserNumber }} {{ nonUserInfo?.reffererLastName }}{{ nonUserInfo?.reffererFirstName }}</dd>
            </dl>
            <div class="form-area type01">
              <div class="field flex align-end no-wrap gap8">
                <div>
                  <span class="input-title">{{ $t('CM_Recipient') }}</span>
                  <RInput
                    v-model="address.lastName"
                    :placeholder="$t('CM_LastName')"
                    :rules="[ isValidLastName ]"
                    class="login-input login-input--id"
                  />
                </div>
                <div>
                  <span class="input-title"></span>
                  <RInput
                    v-model="address.firstName"
                    :placeholder="$t('CM_FirstName')"
                    :rules="[ isValidFirstName ]"
                    class="login-input login-input--id"
                  />
                </div>
              </div>
              <div class="field">
                <span class="input-title">{{ $t('CM_MobileNumber') }}</span>
                <RInput v-model="receiverPhoneNumber" :placeholder="$t('CM_OnlyNumber')" class="login-input login-input--id" />
              </div>
              <div class="field">
                <span class="input-title">{{ $t('CMM_AddressLabel') }}</span>
                <AddressInput
                  v-model:addrInfo="address"
                  :class="_calss"
                  :readonly="modifyMod"
                />
              </div>
              <div class="field">
                <RSelectBox
                  v-model="selectFilterModel"
                  :placeholder-text="$t('OP_SelectMessage')"
                  :options="selectOptions"
                  :disable="false"
                  class="select-box type04"
                />
                <RTextarea v-if="selectFilterModel === 'directInput'" v-model="textareaValue" :placeholder="$t('OP_InputMessage')" class="input-textarea mt4"/>
              </div>
            </div>
          </div>
        </q-card>
      </q-expansion-item>
      <q-expansion-item v-model="openProduct">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_OrderProduct') }}
          </q-item-section>
          <q-item-section side class="right-area">
            <!-- 정보 없을 경우 영역 제거 -->
            <div v-if="!openProduct" class="delivery-order-text">
              <span>{{ $moneyFormat(total) }}</span>
            </div>
            <!-- //정보 없을 경우 영역 제거 -->
          </q-item-section>
        </template>
        <q-card v-if="productList">
          <div class="delivery-info-area pb0">
            <ul class="delivery-order-area">
              <li>
                <div>
                  <div class="prd-img-area">
                    <img :src="addPrefixForImage(productList[0]?.thumbnailUrl)" alt="">
                  </div>
                  <div class="delivery-order-info-area">
                    <div class="prd-name">{{ productList[0]?.productName }}</div>
                    <div class="prd-option-area">
                      <div>{{ productList[0]?.quantity }}{{ $t('CM_Unit') }}</div>
                    </div>
                    <div class="prd-price-area">
                      <span>{{ $moneyFormat(productList[0]?.priceOriginal * productList[0]?.quantity) }}</span>
                      <span>{{ $t('CM_Won') }}</span>
                    </div>
                  </div>
                </div>
              </li>
              <q-slide-transition>
                <li v-if="isVisibleItem">
                  <div v-for="item in productList.slice(1)" :key="item.productId">
                    <div class="prd-img-area">
                      <img :src="addPrefixForImage(item.thumbnailUrl)" alt="">
                    </div>
                    <div class="delivery-order-info-area">
                      <div class="prd-name">{{ item.productName }}</div>
                      <div class="prd-option-area">
                        <div>{{ item.quantity }}{{ $t('CM_Unit') }}</div>
                      </div>
                      <div class="prd-price-area">
                        <span>{{ $moneyFormat(item.priceOriginal * item.quantity) }}</span>
                        <span>{{ $t('CM_Won') }}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </q-slide-transition>
            </ul>

            <div v-if="productList.length > 1" class="delivery-order-list-area" @click="isVisibleItem = !isVisibleItem">
              <div class="order-count-text-area">
                <div class="text-area">
                  <span>{{ $t('CM_Total') }}</span>
                  <span>{{ orderList.length }}</span>
                  <span>{{ $t('CM_Unit2') }}</span>
                </div>
                <div v-if="!isVisibleItem" class="text">{{ $t('OP_ProductExpand') }}</div>
                <div v-if="isVisibleItem" class="text">{{ $t('OP_ProductClose') }}</div>
              </div>
              <i class="ico arrow-top-type02-b drop-down-icon" :class="{'rotate':isVisibleItem}"></i>
            </div>

            <div class="delivery-order-price-area">
              <div class="field top-menu" @click="isVisiblePrice = !isVisiblePrice">
                <div class="flex align-center gap4">
                  <div>{{ $t('OP_OrderAmount') }}</div>
                  <i class="ico arrow-top-type02-n drop-down-icon" :class="{'rotate':isVisiblePrice}"></i>
                </div>
                <div>
                  <span>{{ $moneyFormat(total) }}</span>
                  <span>{{ $t('CM_Won') }}</span>
                </div>
              </div>
              <q-slide-transition>
                <div v-if="isVisiblePrice">
                  <div class="field">
                    <div>{{ $t('OP_ProductAmount') }}</div>
                    <div>{{ $moneyFormat(total) }}{{ $t('CM_Won') }}</div>
                  </div>
                </div>
              </q-slide-transition>
            </div>
          </div>
        </q-card>
      </q-expansion-item>

      <!-- <q-expansion-item v-model="openReceipt">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_MoneyReceipt') }}
          </q-item-section>

          <q-item-section side class="right-area" />
        </template>

        <q-card class="cash-receipts-area plr16 pb16">
          <div class="mb16 font-12 gray04-color">*{{ $t('OP_ReceiptDesc1') }} <b>{{ $t('OP_VirtualAmount') }}</b> {{ $t('OP_ReceiptDesc2') }}</div>

          <RRadio v-model="cashReceiptModel" class="radio-area type02" :options="radioOptions" @update:model-value="isChangeReceipt" />
          <div v-if="cashReceiptModel==='DEDUCTION'" class="field">
            <RInput v-model="cashReceiptInfo" :placeholder="$t('USR_ValidPhoneNumber1')" class="login-input login-input--id" maxlength="11" @update:model-value="isNumber"/>
          </div>

          <div v-if="cashReceiptModel==='EVIDENCE_OF_EXPENDITURE'" class="field">
            <RInput v-model="cashReceiptInfo" :placeholder="$t('VA_Evidence')" class="login-input login-input--id" maxlength="10" @update:model-value="isNumber"/>
          </div>
        </q-card>
      </q-expansion-item> -->

      <q-expansion-item v-model="openPayment">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_PaymentAmount') }}
          </q-item-section>
          <q-item-section side class="right-area">
            <!-- 정보 없을 경우 영역 제거 -->
            <div v-if="!openPayment" class="order-detail-top-area">
              <!-- <span class="success04-color bold">{{$t('OP_PaymentDesc1')}}</span> -->
              <span class="font-24">{{ $moneyFormat(orderSummmary?.salesAmount) }}{{ $t('CM_Won') }}</span>
            </div>
            <!-- //정보 없을 경우 영역 제거 -->
          </q-item-section>
        </template>
        <q-card class="plr16 pb16">
          <ul class="order-result-detail-price-area">
            <li>
              <span class="">{{ $t('OP_ProductAmount') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(orderSummmary?.productsAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </li>
            <li>
              <span class="">{{ $t('OP_DeliveryAmount') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(orderSummmary?.deliveryFeeAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </li>
          </ul>
          <ul class="order-result-price-area">
            <li>
              <span class="left-title-area primary09-color">{{ $t('OP_TotalPayment') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(orderSummmary?.salesAmount) }}</span>
                <span>{{ $t('CM_Won') }}</span>
              </div>
            </li>
          </ul>
        </q-card>
      </q-expansion-item>
    </q-list>

    <div class="order-bottom-checkbox-area payment-bottom-checkbox-area plr16">
      <div class="all-checkbox-area border-gray01 mb16 pt0">
        <RCheckbox v-model="allAgree" class="checkbox-area type02">
          <span class="gray07-color font-16 medium">{{ $t('OP_Agreements') }}</span>
        </RCheckbox>
      </div>
      <div v-for="(agree, index) in agreements" :key="index" class="checkbox-flex-start-area">
        <RCheckbox v-model="checkList" :val="agree" class="checkbox-area type02" >
          <span class="gray07-color">{{ $t(agree.contents) }}</span>
        </RCheckbox>
        <div>
          <div v-if="agree.detail" class="detail" @click="onOpenTermsModal(agree.term)">{{ $t('CM_ToDetail') }}</div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <RButton class="btn full small type11" label="" @click="onClickPayment">
        <template #content>
          <span class="btn-price-text">{{ $moneyFormat(orderSummmary?.salesAmount) }}{{ $t('CM_Won') }}</span>
          <span>{{ $t('OP_DoPayment') }}</span>
        </template>
      </RButton>
    </div>
  </div>
</template>

<script setup>

import { ref, getCurrentInstance, reactive, onMounted, watch, computed } from 'vue'
import { sessionDataManager, ORDER_DATA, ORDER_PREPATH, PAYMENT_INFO, PAYMENT_RESULT, NON_USER_INFO, SHOP_REFERRER_CODE } from '@utils/dataManager'
import ChangeNonUserModal from './modal/ChangeNonUserModal'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useMainStore } from '@store/mainStore'
import orderService from '@/http/services/order'
import productService from '@/http/services/product'
import format from '@/utils/format'
import { addPrefixForImage } from '@/utils/common'
import TossModal from '@components/modal/TossModal'
import etcService from '@/http/services/etc'

const { proxy } = getCurrentInstance()

const openAddress = ref(true)
const openProduct = ref(true)
const openPayment = ref(true)
const openReceipt = ref(true)
const nonUserInfo = ref(null)
const receiverPhoneNumber = ref('')
const selectFilterModel = ref(null)
const cashReceiptModel = ref('')
const cashReceiptInfo = ref('')
const textareaValue = ref('')
const orderNumber = ref('')
const productList = ref([])
const router = useRouter()
const route = useRoute()
const modifyMod = ref(false)
const mainStore = useMainStore()
const returnUrl = sessionDataManager.get(ORDER_PREPATH)
const isCert = sessionDataManager.get('isCert')
const userInfo = mainStore.userInfo
const orderList = JSON.parse(sessionDataManager.get(ORDER_DATA))
const orderSummmary = ref(null)
const { data: productData } = productService.getProductsByIds(
  {
    value: JSON.parse(sessionDataManager.get(ORDER_DATA))
  }, 'get-order-guest-payment-products'
)
const total = computed(() => {
  return productList.value.reduce((pre, cur) => {
    pre = pre + cur.priceOriginal * cur.quantity
    return pre
  }, 0)
})
const productTotalCount = computed(() => {
  return productList.value.reduce((pre, cur) => {
    pre = pre + cur.quantity
    return pre
  }, 0)
})

const query = route.query

const selectOptions = computed(() => [
  { label: proxy.$t('DLV_Delivery1'), value: '도착전 전화주세요' },
  { label: proxy.$t('DLV_Delivery2'), value: '문 앞에 놔주세요' },
  { label: proxy.$t('DLV_Delivery3'), value: '경비실에 맡겨주세요' },
  { label: proxy.$t('DLV_Delivery4'), value: '부재 시 휴대폰 문자 주세요' },
  { label: proxy.$t('DLV_Delivery5'), value: '사무실 앞에 놓아주세요' },
  { label: proxy.$t('DLV_Delivery6'), value: '택배함에 놓아주세요' },
  { label: proxy.$t('DLV_Delivery7'), value: 'directInput' }
])

const agreements = [
  {
    idx: 1,
    contents: 'OP_Agreement1',
    detail: false
  },
  {
    idx: 2,
    contents: 'OP_Agreement4',
    detail: true,
    term: 'TOSS_EPAYMENT_AGREEMENT'
  },
  {
    idx: 3,
    contents: 'OP_Agreement5',
    detail: true,
    term: 'TOSS_EFINANCE_TERMS'
  },
  {
    idx: 4,
    contents: 'OP_Agreement6',
    detail: true,
    term: 'TOSS_PRIVACY_3RD_PARTY_CONSENT'
  }
]

const checkList = ref([])
/**
 * 전체선택
 */
const allAgree = computed({
  get() {
    return checkList.value.length === agreements.length
  },
  set(e) {
    checkList.value = e ? agreements : []
  }
})

const radioOptions = computed(() => [
  { label: proxy.$t('RCP_Receipt1'), value: 'DEDUCTION' },
  { label: proxy.$t('RCP_Receipt2'), value: 'EVIDENCE_OF_EXPENDITURE' },
  { label: proxy.$t('RCP_Receipt3'), value: '' }
])

const address = reactive({
  address1: '',
  address2: '',
  zipcode: ''
})

const isVisibleItem = ref(false)
const isVisiblePrice = ref(false)

// 입력 validation 체크
const isValid = () => {
  if (!address.lastName) {
    proxy.$alert(proxy.$t('ALT_InputLastName'))
    return false
  }

  if (!address.firstName) {
    proxy.$alert(proxy.$t('ALT_InputName'))
    return false
  }

  if (receiverPhoneNumber.value === '') {
    proxy.$alert(proxy.$t('ALT_InputMobile'))
    return false
  }

  if (address.zipcode === '') {
    proxy.$alert(proxy.$t('ALT_InputDelivery'))
    return false
  }

  if (address.address2 === '') {
    proxy.$alert(proxy.$t('CMM_AddressPh'))
    return false
  }

  if (selectFilterModel.value === 'directInput') {
    if (textareaValue.value === '') {
      proxy.$alert(proxy.$t('OP_InputMessage'))
      return false
    }
  }
  if (cashReceiptModel.value === 'DEDUCTION') {
    if (cashReceiptInfo.value === '') {
      proxy.$alert(proxy.$t('ALT_InputMobile'))
      return false
    }
  }
  if (cashReceiptModel.value === 'EVIDENCE_OF_EXPENDITURE') {
    if (cashReceiptInfo.value === '') {
      proxy.$alert(proxy.$t('VA_Evidence'))
      return false
    }
  }
  if (checkList.value.findIndex((i) => i.idx === 1) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement1'))
    return false
  }
  if (checkList.value.findIndex((i) => i.idx === 2) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement4'))
    return false
  }
  if (checkList.value.findIndex((i) => i.idx === 3) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement5'))
    return false
  }
  if (checkList.value.findIndex((i) => i.idx === 4) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement6'))
    return false
  }
  return true
}

const getNonUserPaymentTerms = async (key) => {
  const result = await etcService.getNonUserPaymentTerms(key)

  if (result && result.data) {
    return result.data[0]
  }
}

/**
 * 약관 상세 보기
 * @param {*} content
 */
const onOpenTermsModal = async (termkey) => {
  const termData = await getNonUserPaymentTerms(termkey)

  if (termData) {
    proxy.openModal(
      {
        parent: proxy, // 필수
        component: 'TermsModal', // 필수
        componentProps: {
          title: termData.termsName,
          content: termData.termsContents
        },
        modeless: false // 선택
      })
  }
}

const onClickPayment = (rowData) => {
  if (!isValid()) return
  const paymentInfoParams = {
    identification: nonUserInfo.value.userConnectingInformationTempId,
    guestName: nonUserInfo.value.guestName,
    guestPhone: nonUserInfo.value.mobileNumber,
    guestBirth: nonUserInfo.value.birthDate,
    guestGender: nonUserInfo.value.gender,
    referrerNumber: nonUserInfo.value.reffererUserNumber,
    isDiveIn: false,
    receiver: {
      firstName: address.firstName,
      lastName: address.lastName,
      mobile: receiverPhoneNumber.value,
      phone: receiverPhoneNumber.value,
      zipCode: address.zipcode,
      state: address.state,
      city: address.city,
      address: address.address1,
      addressDetail: address.address2,
      message: selectFilterModel.value === 'directInput' ? textareaValue.value : selectFilterModel.value
    },
    products: orderList,
    summary: {
      salesAmount: orderSummmary.value.salesAmount,
      productsAmount: orderSummmary.value.productsAmount,
      deliveryFeeAmount: orderSummmary.value.deliveryFeeAmount
    },
    terms: {
      termsId1: '1',
      termsId2: '2',
      termsId3: '3',
      commerceTermsId: '4',
      purchaseAgree: true
    }
  }

  if (cashReceiptModel.value !== '') {
    paymentInfoParams.cashReceiptInfo = {
      cashReceiptType: cashReceiptModel.value,
      customerIdentityNumber: cashReceiptInfo.value
    }
  }

  if (query.bagId) {
    paymentInfoParams.plannerBagId = query.bagId
  }

  sessionDataManager.set('paymentInfo', JSON.stringify(paymentInfoParams))

  const name = productList.value[0].productName
  if (productList.value && productList.value.length > 1) {
    name + ` ${proxy.$t('CM_And')} ${productTotalCount.value - 1}${proxy.$t('CM_Unit2')}`
  }
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: TossModal, // 필수
      componentProps: { total: orderSummmary.value.salesAmount, orderid: orderNumber.value, ordername: name, user: 'Guest' }, // 선택 - 팝업창에 값 전달
      modeless: false // 선택
    })
    .onOk(() => {
      proxy.$alert('Modal ok 클릭.')
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

const getProduct = async (v) => {
  const _productData = v

  const productData = _productData.map(item => {
    const product = orderList.filter((i) => {
      const id = i.productOptionId ? i.productOptionId : i.productId
      if (id === item.productId) return i
    })
    const _item = Object.assign({ quantity: product[0].quantity }, item)

    return _item
  })

  productList.value = productData
}

const onPaymentSuccess = async () => {
  proxy.$showProgress() // Progress Show
  const params = JSON.parse(sessionDataManager.get('paymentInfo'))
  params.payment = {
    tossRequestType: params.tossPaymentType === 'KEYIN' ? 'KEYIN' : query.paymentType,
    paymentKey: query.paymentKey,
    orderNumber: query.orderId,
    amount: query.amount
  }
  const result = await orderService.postGuestOrderComplete(params)

  if (result && result.data) {
    sessionDataManager.set('paymentResult', JSON.stringify(result.data))
    router.push('/order/guest/success')
  } else {
    proxy.$confirm(proxy.$t('CNF_OrderFail'), {
      title: '',
      ok: () => {
        router.push('/order')
      }
    })
  }
}

const getOrderSummary = async () => {
  const params = {
    identification: nonUserInfo.value.userConnectingInformationTempId,
    isBagOrder: !!query.bagId,
    products: orderList
  }

  const result = await orderService.postGuestOrderSummary(params)

  if (result && result.data) {
    orderSummmary.value = result.data.summary
    orderNumber.value = result.data.orderNumber
  }
}

const getNonUserInfo = () => {
  const info = JSON.parse(sessionDataManager.get('nonUserInfo'))

  nonUserInfo.value = info
}

const isChangeReceipt = () => {
  cashReceiptInfo.value = ''
}

const isNumber = (val) => {
  cashReceiptInfo.value = val.replace(/[^0-9]/g, '')
}

const onDeleteSession = () => {
  sessionDataManager.remove(PAYMENT_INFO)
  sessionDataManager.remove(PAYMENT_RESULT)
  sessionDataManager.remove(SHOP_REFERRER_CODE)
}

const handlePageShow = (event) => {
  if (event.persisted) {
    onDeleteSession()
    window.location.reload()
  }
}

onMounted(async () => {
  window.addEventListener('pageshow', handlePageShow)
  if (isCert) {
    if (query.paymentKey) {
      onPaymentSuccess()
    } else {
      onDeleteSession()
      getNonUserInfo()
      getOrderSummary()
    }
  } else {
    onDeleteSession()
    router.push(returnUrl)
  }
})

watch(productData, v => {
  if (v) {
    getProduct(v)
  }
})

onBeforeRouteLeave((to, from, next) => {
  if (to.name !== 'OrderGuestPaymentSuccess' && isCert) {
    proxy.$confirm(proxy.$t('CNF_MoveBack'), {
      ok: function () {
        return next(true)
      }
    })
  } else {
    return next(true)
  }
})
</script>

<style lang="scss" scoped>

</style>
