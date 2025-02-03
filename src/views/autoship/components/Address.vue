<template>
  <q-expansion-item v-model="open">
    <template #header>
      <q-item-section class="left-area">
        배송 정보
      </q-item-section>

      <q-item-section side class="right-area" />
    </template>

    <q-card class="plr16 pb24">
      <!-- 배송지 등록 안 되어있을 경우 -->
      <template v-if="0">
        <div class="delivery-add-text mt0">
          한번 배송지를 등록하면 간편하게 주문할 수 있어요!
        </div>
        <RButton class="btn full small type03" label="배송지 추가" @on-click=""/>
      </template>
      <!-- //배송지 등록 안 되어있을 경우 -->

      <!-- 배송지 등록 되어있을 경우 -->
      <template v-if="1">
        <div class="text-right">
          <RButton class="btn type13" label="배송지 목록" @click="onOpenModal"/>
        </div>

        <ul v-if="selectedAddress" class="delivery-select-area mb40">
          <li>
            <div class="delivery-name-area">
              <span>{{ selectedAddress.addressName }}</span>
              <span v-if="selectedAddress.defaultValue" class="btn type14">기본배송지</span>
            </div>
            <div class="member-name-area">
              <span>{{ selectedAddress.lastName }}</span>
              <span>{{ selectedAddress.firstName }}</span>
            </div>
            <div class="delivery-ph-area">{{ format.mobileFormat(selectedAddress.mobileNumber) }}</div>
            <div class="delivery-addr-area">
              <span>({{ selectedAddress.zipcode }})</span>
              <span>{{ selectedAddress.address1 }}</span>
              <span>{{ selectedAddress.address2 }}</span>
            </div>
          </li>
        </ul>
        <RSelectBox
          :model-value="messageSelect"
          placeholder-text="배송메세지 선택"
          :options="selectOptions"
          :disable="false"
          class="select-box type04"
          @update:model-value="onUpdateMessageSelect"
        />
        <RTextarea v-if="messageSelect === 'directInput'" :model-value="messageText" placeholder="배송메세지 입력" class="input-textarea mt4" @update:model-value="onUpdateMessage"/>

      </template>
      <!-- //배송지 등록 되어있을 경우 -->
    </q-card>
  </q-expansion-item>
</template>

<script setup>
import orderService from '@/http/services/order'
import { useMainStore } from '@/store/mainStore'
import format from '@/utils/format'
import { getCurrentInstance, onMounted, ref } from 'vue'

const open = ref(true)
const { proxy } = getCurrentInstance()
const mainStore = useMainStore()
const selectedAddress = ref()
const messageSelect = ref('도착전 전화주세요')
const messageText = ref()
const message = defineModel({
  type: String
})
const emit = defineEmits(['addAddress'])
const selectOptions = [
  { label: '도착전 전화주세요', value: '도착전 전화주세요' },
  { label: '문 앞에 놔주세요', value: '문 앞에 놔주세요' },
  { label: '경비실에 맡겨주세요', value: '경비실에 맡겨주세요' },
  { label: '부재 시 휴대폰 문자 주세요', value: '부재 시 휴대폰 문자 주세요' },
  { label: '사무실 앞에 놓아주세요', value: '사무실 앞에 놓아주세요' },
  { label: '택배함에 놓아주세요', value: '택배함에 놓아주세요' },
  { label: '직접입력', value: 'directInput' }
]
const onOpenModal = () => {
  proxy.openModal(
    {
      parent: proxy,
      component: 'AddressListModal',
      componentProps: {},
      modeless: false
    }).onOk((data) => {
    setSelectedAddress(data)
  })
}
const onUpdateMessage = (v) => {
  messageText.value = v
  message.value = v
}
const onUpdateMessageSelect = (v) => {
  messageSelect.value = v
  message.value = v
  if (v !== 'directInput') {
    messageText.value = ''
  }
}
async function getAddressList() {
  const userId = mainStore.userInfo.userSeqNo
  const params = {
    userId: userId
  }
  const result = await orderService.getAddressList(params)
  if (result) {
    const defaultAddress = result.data.filter(item => item.defaultValue === true)[0]
    setSelectedAddress(defaultAddress)
  }
}
function setSelectedAddress(address) {
  selectedAddress.value = address
  emit('addAddress', address)
}

onMounted(() => {
  getAddressList()
})
</script>

<style lang="scss" scoped>

</style>
