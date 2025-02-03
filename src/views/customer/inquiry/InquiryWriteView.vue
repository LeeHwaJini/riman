<template>
  <div class="max-width-wrap  full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t('CS_InquiryP2p') }}</h3>
      <p class="font-16 mt12 sub-text">{{ $t('CS_CheckBeforeAsk_txt1') }} <a href="/customer/faq" class="primary04-color text-underline type02 medium">{{ $t('CS_FAQs') }}</a>{{ $t('CS_CheckBeforeAsk_txt2') }}</p>
    </div>

    <div class="mo-sub-text">
      <i class="ico exclamation-n" />
      <div class="font-16 primary09-color">{{ $t('CS_CheckBeforeAsk_txt1') }} <a href="/customer/faq" class="primary04-color text-underline type02">{{ $t('CS_FAQs') }}</a>{{ $t('CS_CheckBeforeAsk_txt2') }}</div>
    </div>

    <div class="plr16">
      <ul class="tab type06">
        <li v-for="cate in inquiryCateList" :key="cate.value" :class="{active: inquiryCate === cate.value }" @click="inquiryCate = cate.value">{{ cate.label }}</li>
      </ul>
      <template v-if="inquiryCate === 'order'">
        <div v-if="selectedOrder" class="order-num-get-area">
          <div class="top-area">
            <b class="font-14 primary09-color">{{ selectedOrder.salesOrderNumber }}</b>
            <i class="ico close-g flex-shrink0" @click="selectedOrder = null"></i>
          </div>
          <div class="botom-area gray07-color">
            <span class="font-14 left-text">{{ selectedOrder.productName }}</span>
            <span v-if="selectedOrder.productCount > 1" class="font-14 flex-shrink0">외 {{ selectedOrder.productCount - 1 }}{{ $t('CM_Unit') }}</span>
          </div>
        </div>
        <div v-else class="order-num-load-area" @click="onOpenModal">
          <i class="ico add-b"/>
          {{ $t('CS_GetOrderNumber') }}
        </div>
      </template>

      <div class="mt24">
        <span class="required font-14 gray07-color">{{ $t('CS_SelectInquiryType') }}</span>

        <ul class="tab type05 small">
          <li v-for="type in inquiryTypeData" :key="type.code" :class="{active: inquiryType === type.code}" @click="inquiryType = type.code">{{ type.text }}</li>
        </ul>
      </div>

      <div class="form-area type05 ">
        <div class="field">
          <span class="input-title required">{{ $t('CM_Title') }}</span>
          <RInput
            ref="idRef"
            v-model="title"
            :placeholder="$t('CS_InputTitle')"
            class="login-input login-input--id"
          />
        </div>

        <div class="field">
          <span class="input-title required">{{ $t('CS_InputContent') }}</span>
          <RTextarea v-model="contents" maxlength="1000" :counter="true" :placeholder="$t('CS_InputContent_txt')" class="input-textarea mb16" />
          <RUploadImage ref="uploader" label="Image Upload files" multiple @file-updated="onFileUpdated"/>
          <span class="font-12 gray04-color block mt8">{{ $t('RET_ImageValidation') }}</span>
        </div>

        <div class="field">
          <div class="flex align-center justify-between mb4">
            <div>
              <span class="input-title required mb2">{{ $t('CM_MobileNumber') }}</span>
              <span class="block font-12 gray04-color">{{ $t('CS_Informed') }}</span>
            </div>
            <div>
              <RCheckbox v-model="noticeYn" class="checkbox-area type02">
                <span class="gray07-color font-14">{{ $t('CS_ReplyInformed') }}</span>
              </RCheckbox>
            </div>
          </div>
          <div class="flex no-wrap gap4">
            <RInput
              ref="idRef"
              disable
              :placeholder="mainStore.getUser.mobileNumber.substring(0,3)"
              class="login-input login-input--id input-num"
            />
            <RInput
              ref="idRef"
              disable
              :placeholder="mainStore.getUser.mobileNumber.substring(3,7)"
              class="login-input login-input--id input-num"
            />
            <RInput
              ref="idRef"
              disable
              :placeholder="mainStore.getUser.mobileNumber.substring(7,11)"
              class="login-input login-input--id input-num"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="bottom-btn">
      <div class="flex-btn-area">
        <RButton class="btn full small type03 " label="취소" @on-click="onCancle" />
        <RButton class="btn full small type02" label="등록하기" :disabled="!isConfirmed" @on-click="onSubmit" />
      </div>
    </div>
  </div>
  <OrderHistoryModal ref="orderHistoryModal" @add-order="onAddOrder"/>
</template>

<script setup>
import customerService from '@/http/services/customer'
import { useMainStore } from '@/store/mainStore'
import { ref, computed, getCurrentInstance } from 'vue'
import OrderHistoryModal from './modal/OrderHistoryModal.vue'
import { useRouter } from 'vue-router'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const { proxy } = getCurrentInstance()
const vCleanHtml = buildVueDompurifyHTMLDirective()
const contents = ref('')
const noticeYn = ref(false)
const orderHistoryModal = ref()
const inquiryCate = ref('normal')
const files = ref()
const title = ref()
const uploader = ref()
const router = useRouter()
const selectedOrder = ref(null)
const mainStore = useMainStore()
const isConfirmed = computed(() => {
  if (inquiryCate.value === 'normal') {
    return !!title.value && !!contents.value && !!inquiryType.value
  } else {
    return !!title.value && !!contents.value && !!inquiryType.value && !!selectedOrder.value
  }
})
const postInquiry = customerService.postInquiryCreate()
const inquiryCateList = computed(() => [{
  label: proxy.$t('CS_NormalInquiry'),
  value: 'normal'
},
{
  label: proxy.$t('CS_OrderInquiry'),
  value: 'order'
}])
const inquiryType = ref(null)
const { data: inquiryTypeData } = customerService.getInquiryType()

const onOpenModal = () => {
  orderHistoryModal.value.show()
}
const onFileUpdated = (file) => {
  files.value = file
}
const onCancle = () => {
  title.value = ''
  contents.value = ''
  uploader.value.reset()
  selectedOrder.value = null
  noticeYn.value = false
  inquiryType.value = null
}
const onAddOrder = (order) => {
  orderHistoryModal.value.hide()
  selectedOrder.value = order
}

const onSubmit = async () => {
  proxy.$confirm('', {
    title: proxy.$t('ALT_RegistConfirm'),
    ok: doSubmit
  })
}
async function doSubmit() {
  const data = {
    inquiryTitle: title.value,
    inquiryType: inquiryType.value,
    inquiryContents: contents.value,
    orderNumber: selectedOrder.value ? selectedOrder.value.salesOrderNumber : null,
    noticeYn: noticeYn.value
  }
  const formData = new FormData()
  if (files.value) {
    for (const file of files.value) {
      formData.append('files', file)
    }
  }
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }))
  postInquiry.mutate(formData, {
    onSuccess: () => router.push('inquiry/list'),
    onError: () => {
      proxy.$alert(proxy.$t('CM_UploadFail'))
    }
  })
}
</script>
