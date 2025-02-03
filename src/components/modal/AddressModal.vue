<!--
  배송지 추가 modal ( pc: 화면 가운데 출력, tablet: 화면 하단 출력)
  create by hwajin
-->

<template>
  <q-dialog
    ref="modal"
    :position="position"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    :no-backdrop-dismiss="isSetBackDrop"
    no-shake
    class="order-get-modal bottom-btn-modal delivery-modal"
  >
    <!-- delivery-list-modal  -->
    <layout-modal
      ref="layoutModal"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <div class="btn mo-slide-btn text-center"><span class="slide-icon" @click="hide"></span></div>
        <div class="title-top-area">
          <h4 v-if="props.addressId">{{ title }}{{ $t('ADR_Title1') }}</h4>
          <h4 v-else>{{ title }}{{ $t('ADR_Title2') }}</h4>
          <button class="menu-close-btn" @click="hide">
            <i class="ico close" />
          </button>
        </div>

        <div class="delivery-add-content">
          <div v-if="!props.guestYn" class="text-right">
            <RCheckbox v-model="address.defaultValue" class="checkbox-area type02" >
              <span>{{ $t('ADR_DefaultAddress') }}</span>
            </RCheckbox>
          </div>
          <q-form ref="form" @submit.prevent="registAddress">
            <div class="form-area type01">
              <div v-if="!props.guestYn" class="field">
                <span class="input-title required">{{ $t('ADR_AddressName') }}</span>
                <RInput
                  v-model="address.addressDescription"
                  :placeholder="$t('ADR_AddressAlias')"
                  :rules="[ isValidAddressName ]"
                  :maxlength="20"
                  class="login-input login-input--id"
                />
              </div>

              <div class="field flex  no-wrap gap8">
                <div>
                  <span class="input-title required">{{ $t('CM_Recipient') }}</span>
                  <RInput
                    v-model="address.lastName"
                    :placeholder="$t('ALT_InputLastName')"
                    :rules="[ isValidLastName ]"
                    :maxlength="20"
                    class="login-input login-input--id"
                  />
                </div>

                <div>
                  <span class="input-title visibility-hidden address-search-modal-wrap">{{ $t('CM_FirstName') }}</span>
                  <RInput
                    v-model="address.firstName"
                    :placeholder="$t('ALT_InputName')"
                    :rules="[ isValidFirstName ]"
                    :maxlength="20"
                    class="login-input login-input--id"
                  />
                </div>
              </div>

              <div class="field">
                <span class="input-title required">{{ $t('CM_MobileNumber') }}</span>
                <RInput
                  v-model="address.phoneNumber"
                  type="number"
                  :placeholder="$t('CM_OnlyNumber')"
                  :rules="[ isValidMobileNumber ]"
                  :maxlength="11"
                  class="login-input login-input--id"
                />
              </div>

              <div class="field">
                <span class="input-title required">{{ $t('CMM_AddressLabel') }}</span>
                <AddressInput v-model:addrInfo="address"/>
              </div>

            </div>
          </q-form>

        </div>

        <div class="popup-bottom-area">
          <div class="popup-bottom-btn">
            <RButton class="btn full small type02" :label="$t('CM_Saving')" @click="registAddress" />
          </div>
        </div>
      </template>

    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, computed, getCurrentInstance, reactive, onMounted, onBeforeUnmount } from 'vue'
import orderService from '@/http/services/order'
import validate from '@/utils/validate'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  addressInfo: {
    type: Object,
    default: null
  },
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  phoneNumber: {
    type: String,
    default: null
  },
  addressId: {
    type: String,
    default: null
  },
  defaultAddress: {
    type: Boolean,
    default: false
  },
  guestYn: {
    type: Boolean,
    default: false
  }
})

const { proxy } = getCurrentInstance()
const modal = ref()
const position = ref('standard')
const isMobile = computed(() => proxy.$isTablet())
const input = ref('')
const checkbox = ref()
const form = ref(null)
const emit = defineEmits(['ok'])
const isSetBackDrop = ref(false)

const address = reactive({
  lastName: '',
  firstName: '',
  phoneNumber: '',
  area: '',
  zipcode: '',
  address1: '',
  address2: '',
  city: '',
  defaultValue: false,
  addressDescription: '',
  phoneCode: 'KR'
})

const isValidAddressName = (value) => {
  if (validate.isRequired(address.addressDescription)) {
    return proxy.$t('ADR_ErrorText1')
  }
  return true
}

const isValidLastName = (value) => {
  if (validate.isRequired(address.lastName)) {
    return proxy.$t('ADR_ErrorText2')
  }
  return true
}

const isValidFirstName = (value) => {
  if (validate.isRequired(address.firstName)) {
    return proxy.$t('ADR_ErrorText3')
  }
  return true
}

const isValidMobileNumber = (value) => {
  const result = validate.isValidPhoneNumber(address.phoneNumber)
  return result
}

// 팝업 Hide 호출
const hide = () => {
  modal.value.hide()
  // proxy.openModal(
  //   {
  //     parent: proxy,
  //     component: 'AddressListModal',
  //     componentProps: { title: props.title },
  //     modeless: false
  //   })
}

const show = () => {
  handleResize()
  modal.value.show()
}
const handleResize = () => {
  if (isMobile.value) {
    position.value = 'bottom'
    isSetBackDrop.value = false
  } else {
    position.value = 'standard'
    isSetBackDrop.value = true
  }
}

const registAddress = async () => {
  if (props.guestYn) {
    const data = address
    emit('ok', data)
    hide()
  } else {
    const isValid = await form.value.validate()

    if (!isValid) {
      return
    }

    if (props.addressId) {
      if (address.defaultValue && props.defaultAddress) {
        proxy.$confirm(proxy.$t('ADR_AlertText1'), {
          title: '',
          ok: () => {
            onHandleEditAddress(props.addressId)
          }
        })
      } else {
        proxy.$confirm(proxy.$t('ADR_AlertText2'), {
          title: '',
          ok: () => {
            onHandleEditAddress(props.addressId)
          }
        })
      }
    } else {
      if (address.defaultValue && props.defaultAddress) {
        proxy.$confirm(proxy.$t('ADR_AlertText1'), {
          title: '',
          ok: () => {
            onHandleRegistAddress()
          }
        })
      } else {
        proxy.$confirm(proxy.$t('ADR_AlertText3'), {
          title: '',
          ok: () => {
            onHandleRegistAddress()
          }
        })
      }
    }
  }
}

const onHandleRegistAddress = async () => {
  const params = address
  const result = await orderService.registAddress(params)

  if (result) {
    await proxy.$alert(proxy.$t('ALT_RegistSuccess'))
    await modal.value.hide()
    emit('ok')
  }
}

const onHandleEditAddress = async () => {
  const addressId = props.addressId
  const params = address
  const result = await orderService.editAddress(addressId, params)

  if (result) {
    await proxy.$alert(proxy.$t('ALT_EditSuccess'))
    await modal.value.hide()
    emit('ok')
  }
}

const getAddressList = async () => {
  const addressId = props.addressId

  const result = await orderService.getDetailAddress(addressId)

  if (result) {
    onIncludeAddress(result.data)
  }
}

const onIncludeAddress = (data) => {
  address.lastName = data.lastName
  address.firstName = data.firstName
  address.phoneNumber = data.mobileNumber
  address.area = data.state
  address.zipcode = data.zipcode
  address.address1 = data.address1
  address.address2 = data.address2
  address.city = data.city
  address.defaultValue = data.defaultValue
  address.addressDescription = data.addressName
  address.phoneCode = data.phoneCode.code
}

const onGuestIncludeAddress = (data) => {
  address.lastName = props.lastName
  address.firstName = props.firstName
  address.phoneNumber = props.phoneNumber
  address.area = data.state
  address.zipcode = data.zipcode
  address.address1 = data.address
  address.address2 = data.addressDetail
  address.city = data.city
  address.addressDescription = data.addressDescription
}

defineExpose({
  show
})

onMounted(() => {
  window.addEventListener('resize', handleResize)
  if (props.guestYn) {
    onGuestIncludeAddress(props.addressInfo)
  } else {
    if (props.addressId) {
      getAddressList()
    }
  }
})

onBeforeUnmount(async () => {
  window.removeEventListener('resize', handleResize)
})

</script>
