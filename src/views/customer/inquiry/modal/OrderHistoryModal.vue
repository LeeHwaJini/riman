<template>
  <responsive-modal
    ref="orderNumLoadModal"
    :title="$t('CS_GetOrderNumber')"
    class="order-num-load-modal bottom-btn-modal mo-h80-modal"
  >
    <template #description>
      <div class="pb24">
        <span class="text-center font-14 block gray05-bg small medium">{{ $t('CS_SearchInfo') }}</span>
        <RTabs
          v-if="isAutoship"
          v-model="orderType"
          :tab-list="tabOrderList"
          class="tab type02"
        />
        <q-tab-panels v-model="orderType" >
          <q-tab-panel name="normal" class="pd0">
            <OrderList :order-list="normalOrdertData" @add-order="onAddOrder"/>
          </q-tab-panel>

          <q-tab-panel name="auto" class="pd0">
            <OrderList :order-list="autoOrdertData" @add-order="onAddOrder"/>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </template>
  </responsive-modal>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import customerService from '@/http/services/customer'
import OrderList from './OrderList.vue'
const orderType = ref('normal')
const normalOrdertData = ref()
const autoOrdertData = ref()
const { proxy } = getCurrentInstance()
const emit = defineEmits(['addOrder'])
const isAutoship = import.meta.env.VITE_APP_IS_AUTOSHIP === 'true'
const tabOrderList = computed(() => [
  { label: proxy.$t('CS_NormalOrderHistory'), name: 'normal' },
  { label: proxy.$t('CS_SubsOrderHistory'), name: 'auto' }
])
const orderNumLoadModal = ref()
function show() {
  orderNumLoadModal.value.show()
}
function hide() {
  orderNumLoadModal.value.hide()
}
async function getNormalHistory() {
  const res = await customerService.getInquiryOrderList()
  if (res) {
    normalOrdertData.value = res.data.salesOrderList
    autoOrdertData.value = res.data.autoSalesOrderList
  }
}
const onAddOrder = (orderId) => {
  emit('addOrder', orderId)
}
onMounted(() => {
  getNormalHistory()
})
defineExpose({
  show,
  hide
})
</script>
