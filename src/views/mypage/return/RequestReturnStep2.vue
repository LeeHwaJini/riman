<!--
  반품 신청 > step2
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
        <h4 class="title bold primary09-color">{{ $t('RET_SelectReasonTitle') }}</h4>
        <RStep :step="step" :total-step="totalStep" />
      </hgroup>

      <span class="font-14 medium gray07-color mt24 block">{{ $t('RET_Notice1') }}<br>{{ $t('RET_SelectReason') }}</span>
    </div>

    <div class="return-step-area return-radio-area">
      <b class="block gray07-color">{{ $t('ORD_RefundReason3') }}</b>
      <RRadio v-model="returnReasonOption" :inline="false" class="radio-area type02" :options="customerLiabilityReason"/>

      <b class="mt24 block gray07-color">{{ $t('RET_ProductOrDeliveryIssue') }}</b>
      <RRadio v-model="returnReasonOption" :inline="false" class="radio-area type02" :options="companyLiabilityReason"/>

      <div v-if="isCompanyLiabilityReason" class="mb16">
        <span class="mt24 block font-14 gray07-color">{{ $t('RET_EnterReason1') }}</span>
        <span class="block font-12 error-color mt2">{{ $t('RET_Notice3') }}</span>
        <RTextarea
          v-model="returnReasonDetail"
          maxlength="100"
          :counter="true"
          :placeholder="$t('RET_EnterReason2')"
          class="input-textarea mt4"
          :rules="[val => !!val || $t('RET_EnterReason1')]"
        />
      </div>

      <template v-if="returnReasonOption === 'PRODUCT_DAMAGED' || returnReasonOption === 'PRODUCT_PROBLEM'">
        <RUploadImage :file-list="imageList.map(i => i.file)" label="Image Upload files" multiple max-files="3" max-file-size="20000000" @file-updated="(list) => onFileUpload(list)"/>
        <span class="font-12 gray04-color block mt8">{{ $t('RET_ImageValidation') }}</span>
      </template>

      <div class="bottom-btn">
        <RButton
          class="btn full small type02"
          :label="$t('CM_Next')"
          :disabled="
            (isCompanyLiabilityReason && !returnReasonDetail) ||
              ((returnReasonOption === 'PRODUCT_DAMAGED' || returnReasonOption === 'PRODUCT_PROBLEM') && !imageList.length) ||
              returnReasonOption === undefined"
          @click="toNextStep" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import orderService from '@/http/services/order'
import { checkPlanner } from '@/utils/common'
import { sessionDataManager } from '@/utils/dataManager'
import { isLogin } from '@/utils/login'

const { proxy } = getCurrentInstance()

const totalStep = ref(3)
const step = ref(2)

const route = useRoute()
const router = useRouter()
const salesOrderId = route.params.salesOrderId
const tempId = route.query.tempId

const imageList = ref([])

const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())

const onFileUpload = async (list) => {
  imageList.value = list
}

const returnReasonOption = ref()
const returnReasonDetail = ref()

const isCompanyLiabilityReason = ref(false)

const customerLiabilityReason = computed(() => [
  { label: proxy.$t('RET_SimpleChangeOfMind'), value: 'SIMPLE_CHANGE_OF_MIND' },
  { label: proxy.$t('RET_OrderMistake'), value: 'ORDER_MISTAKE' }
])

const companyLiabilityReason = computed(() => [
  { label: proxy.$t('RET_WrongDelivery'), value: 'WRONG_DELIVERY' },
  { label: proxy.$t('RET_ProductDamaged'), value: 'PRODUCT_DAMAGED' },
  { label: proxy.$t('RET_ProductProblem'), value: 'PRODUCT_PROBLEM' },
  { label: proxy.$t('RET_Timely'), value: 'TIMELY' }
])

onMounted(() => {
  if (!sessionDataManager.get('returnProductList') && !tempId) {
    router.replace('/mypage')
  }

  returnReasonOption.value = JSON.parse(sessionDataManager.get('returnReason'))?.returnOrderReasonType
  returnReasonDetail.value = JSON.parse(sessionDataManager.get('returnReason'))?.returnReasonDetail
})

const toNextStep = async () => {
  const message = isCompanyLiabilityReason.value
    ? (isLogined.value ? proxy.$t('RET_CompanyReasonAlert') : proxy.$t('RET_CompanyReasonAlert2'))
    : proxy.$t('RET_CustomerReasonAlert')

  await proxy.$alert(message, {
    ok: async () => {
      console.log({ salesOrderId })

      const params = {
        salesOrderId,
        returnReasonDetail: returnReasonDetail.value,
        returnOrderReasonType: returnReasonOption.value,
        productList: transformSetItems(JSON.parse(sessionDataManager.get('returnProductList')).filter(i => i.isChecked && i.productInfo.selectedQuantity)),
        identification: tempId
      }

      const result = isLogined.value
        ? await orderService.postReturnOrder(params, imageList.value)
        : await orderService.postNonMemberReturnOrder(params, imageList.value)

      if (result) {
        router.replace(isCompanyLiabilityReason.value ? isLogined.value ? { path: '/mypage/returnList' } : { name: 'orderDetail', query: { orderId: salesOrderId, tempId } } : getNextStepRoute(result.data.returnOrderNumber))

        sessionDataManager.remove('returnProductList')
      }
    }
  })
}

const transformSetItems = (setProducts) => {
  return setProducts.map(item => {
    const { productInfo } = item

    const transformedProduct = {
      productId: productInfo.productId,
      productOptionId: productInfo.productOptionId,
      quantity: productInfo.setYn ? 1 : productInfo.selectedQuantity,
      setItems: []

    }

    if (productInfo.setItems?.length) {
      transformedProduct.setItems = productInfo.setItems.map(setItem => ({
        productId: setItem.productId,
        productOptionId: setItem.productOptionId,
        quantity: setItem.quantity * productInfo.selectedQuantity
      }))
    }

    return transformedProduct
  })
}
const getNextStepRoute = (returnOrderNumber) => ({
  path: `/return/step3/${salesOrderId}`,
  query: isLogined.value ? {} : { tempId },
  state: {
    salesOrderId,
    returnOrderNumber
  }
})

watch(returnReasonOption, (v) => {
  if (companyLiabilityReason.value.map((option) => option.value).includes(v)) {
    isCompanyLiabilityReason.value = true
    returnReasonDetail.value = undefined
  } else {
    isCompanyLiabilityReason.value = false
  }
})
</script>

<style lang="scss" scoped>

</style>

