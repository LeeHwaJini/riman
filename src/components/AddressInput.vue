<!--
  배송지 주소 입력 폼
-->
<template>
  <div class="box__wrap box__wrap--offset address-input-area">
    <div class="box-item input-btn-area">
      <div class="item item--3 flex1">
        <RInput
          v-model="addrInfo.zipcode"
          class="input input--noborder"
          :readonly="true"
          stack-label
          :placeholder="!readonly ? $t('CMM_AddressSearch') : ''"
        />
      </div>
      <RButton
        :label="$t('CMM_AddressSearch')"
        :disabled="readonly"
        class="btn type03 small w-large"
        @click="openAddressModal"
      />
    </div>
  </div>
  <div class="box__wrap box__wrap--offset address-input-area">
    <div class="box-item">
      <div class="item item--25">
        <RInput
          v-model="addrInfo.address1"
          class="input input--noborder "
          :readonly="true"
          stack-label
          :placeholder="$t('CMM_AddressSearchText')"
          :rules="[ isValidAddress ]"
        />
      </div>
    </div>
  </div>
  <div class="box__wrap box__wrap--offset address-input-area">
    <div class="box-item">
      <div class="item item--25">
        <RInput
          v-model="addrInfo.address2"
          :placeholder="!readonly ? $t('CMM_AddressPh') : ''"
          :readonly="readonly"
          :maxlength="225"
          stack-label
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineModel, getCurrentInstance } from 'vue'
import validate from '@/utils/validate'

const { proxy } = getCurrentInstance()

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: 'input input--noborder'
  }
})
const addrInfo = defineModel('addrInfo',
  {
    zipcode: '',
    address1: '',
    address2: '',
    city: '',
    area: ''
  }
)

const openAddressModal = async () => {
  proxy.openModal({
    parent: proxy,
    component: 'AddressSearchModal',
    componentProps: {
      callbackEvt: addrCallback
    },
    modeless: false
  })
}

const addrCallback = (_addrInfo) => {
  addrInfo.value.address1 = _addrInfo.address1
  addrInfo.value.zipcode = _addrInfo.zipNo
  addrInfo.value.city = _addrInfo.siNm
  addrInfo.value.area = _addrInfo.sggNm
}

const isValidAddress = (value) => {
  if (validate.isRequired(addrInfo.value.address1)) {
    return proxy.$t('CMM_ErrorText_8')
  }
  return true
}

defineExpose({
  isValidAddress
})
</script>

<style lang="scss" scoped>
  .box__wrap.box__wrap--offset {
    & + .box__wrap.box__wrap--offset {
      margin-block: 8px;
    }
  }
</style>
