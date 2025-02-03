<!--
  배송지 리스트 modal ( pc: 화면 가운데 출력, tablet: 화면 하단 출력)
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
    class="order-get-modal bottom-btn-modal"
  >
    <!-- delivery-list-modal  -->
    <layout-modal
      ref="layoutModal"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <div class="btn mo-slide-btn text-center"><span class="slide-icon" @click="hide"></span></div>
        <div class="title-top-area">
          <h4>{{ title }}{{ $t('ADR_AddressManage') }}</h4>
          <button class="menu-close-btn" @click="hide">
            <i class="ico close" />
          </button>
        </div>
        <div class="select-prd-text-area">
          <span>{{ $t('ADR_AddressInfo') }}</span>
          <span>({{ addressList.length }}{{ $t('CM_Unit') }})</span>
        </div>

        <div v-if="addressList.length > 0" class="delivery-list-content popup-scroll large scroll type01">
          <ul class="delivery-select-area type01">
            <li v-for="item in addressList" :key="item">
              <div class="delivery-name-area flex align-center justify-between">
                <div class="flex align-center gap8">
                  <span>{{ item.addressName }}</span>
                  <div>
                    <!-- 기본배송지 아닐 경우 제거-->
                    <span v-if="item.defaultValue" class="btn type14">{{ $t('OP_DefaultDelivery') }}</span>
                    <!-- //기본배송지 아닐 경우 제거-->
                    <span v-if="item.fixedTermYn" class="btn type21">{{ $t('OP_SaveDelivery') }}</span>

                  </div>
                </div>
                <RButton v-if="!props.isNoChoice" class="btn medium type03" :label="$t('CM_Select')" @click="selectAddress(item)" />
              </div>

              <div class="member-name-area">
                <span>{{ item.lastName }}</span>
                <span>{{ item.firstName }}</span>
              </div>
              <div class="delivery-ph-area">{{ item.mobileNumber }}</div>

              <div class="delivery-addr-area">
                <span v-if="item.zipcode">({{ item.zipcode }})</span>
                <span>{{ item.address1 }}</span>
                <span>{{ item.address2 }}</span>
              </div>

              <div class="icon-btn-area" :class="{'justify-end' : item.defaultValue}">
                <!-- 기본배송지일 경우 제거 -->
                <RButton v-if="!item.defaultValue" class="btn type15" :label="$t('ADR_SetDefaultAddress')" @click="setDefaultValue(item)" />
                <!-- //기본배송지일 경우 제거 -->
                <div>
                  <RButton class="btn" label="" @click="deleteAddress(item)">
                    <template #content>
                      <i class="ico delete-b"></i>
                    </template>
                  </RButton>

                  <RButton class="btn" label="" @click="onOpenEditModal(item)">
                    <template #content>
                      <i class="ico edit-b"></i>
                    </template>
                  </RButton>
                </div>
              </div>
            </li>
          </ul>
        </div>

        <div v-else-if="addressList.length === 0" class="cart-none-area">
          <img src="@assets/images/cart_none.svg" alt="">
          <p class="title">{{ $t('ADR_AddressDesTitle') }}</p>
          <p class="text">{{ $t('ADR_AddressDesText') }}</p>
        </div>

        <div class="popup-bottom-area">
          <div class="popup-bottom-btn">
            <RButton class="btn full small type02" label="" @on-click="onOpenModal">
              <template #content>
                <span>{{ $t('OP_DeliveryAdd') }}</span>
                <i class="ico add-w ml4"></i>
              </template>
            </RButton>
          </div>
        </div>
      </template>

    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, computed, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import { useMainStore } from '@store/mainStore'
import orderService from '@/http/services/order'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  isNoChoice: {
    type: Boolean,
    default: false
  }
})

const { proxy } = getCurrentInstance()
const modal = ref()
const position = ref('standard')
const isMobile = computed(() => proxy.$isTablet())
const addressStatus = ref(1)
const mainStore = useMainStore()
const addressList = ref([])
const emit = defineEmits(['ok'])
const defaultAddress = ref(false)
const isSetBackDrop = ref(false)

const getAddressList = async () => {
  const userId = mainStore.userInfo.userSeqNo
  const params = {
    userId: userId
  }
  const result = await orderService.getAddressList(params)
  addressList.value = [...result.data]
  defaultAddress.value = addressList.value.some(address => address.defaultValue)
}

const deleteAddress = async (address) => {
  if (addressList.value.length === 1) {
    proxy.$alert(proxy.$t('ADR_AlertText4'))
  } else if (address.fixedTermYn) {
    proxy.$alert(proxy.$t('ADR_AlertText5'))
  } else if (address.defaultValue) {
    proxy.$confirm(proxy.$t('ADR_AlertText6'), {
      title: '',
      ok: () => {
        onHandelDeleteAddress(address.userAddressId)
      }
    })
  } else {
    proxy.$confirm(proxy.$t('ADR_AlertText7'), {
      title: '',
      ok: () => {
        onHandelDeleteAddress(address.userAddressId)
      }
    })
  }
}

const onHandelDeleteAddress = async (id) => {
  const result = await orderService.deleteAddress(id)

  if (result) {
    await proxy.$alert(proxy.$t('ALT_DeleteSuccess'))
    await getAddressList()
  }
}

const setDefaultValue = async (address) => {
  proxy.$confirm(proxy.$t('ADR_AlertText8'), {
    title: '',
    ok: () => {
      onHandelSetDefault(address.userAddressId)
    }
  })
}

const onHandelSetDefault = async (id) => {
  const result = await orderService.setDefault(id)

  if (result) {
    await proxy.$alert(proxy.$t('ALT_ChangeSuccess'))
    await getAddressList()
  }
}

const selectAddress = (address) => {
  const data = address
  emit('ok', data)
  hide()
}

// 팝업 Hide 호출
const hide = () => {
  modal.value.hide()
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

const onOpenModal = () => {
  if (addressList.value.length > 9) {
    proxy.$alert(proxy.$t('ADR_AlertText9'))
  } else {
    proxy.openModal(
      {
        parent: proxy,
        component: 'AddressModal',
        componentProps: {
          title: props.title,
          defaultAddress: defaultAddress.value
        },
        modeless: false
      })
      .onOk(() => {
        getAddressList()
      })
  }
}

const onOpenEditModal = (address) => {
  proxy.openModal(
    {
      parent: proxy,
      component: 'AddressModal',
      componentProps: {
        addressId: address.userAddressId,
        title: props.title,
        defaultAddress: defaultAddress.value
      },
      modeless: false
    })
    .onOk(() => {
      getAddressList()
    })
}

defineExpose({
  show
})

onMounted(() => {
  window.addEventListener('resize', handleResize)

  getAddressList()
})

onBeforeUnmount(async () => {
  window.removeEventListener('resize', handleResize)
})
</script>
