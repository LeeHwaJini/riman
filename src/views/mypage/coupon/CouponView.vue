<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t('CM_Coupon') }}</h3>
    </div>

    <RTabs v-model="tabValue" :tab-list="tabList" class="tab type02" />

    <q-tab-panels v-model="tabValue" class="tab-list type02">
      <q-tab-panel name="owendCoupon">
        <OwnedCouponTab />
      </q-tab-panel>
      <q-tab-panel
        name="usedCoupon"
      >
        <UsedCouponTab />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
import OwnedCouponTab from './tabs/OwnedCouponTab'
import UsedCouponTab from './tabs/UsedCouponTab'
const tabValue = ref('owendCoupon')
const { proxy } = getCurrentInstance()
const tabList = computed(() => [
  { label: proxy.$t('CP_Ownd'), name: 'owendCoupon' },
  { label: proxy.$t('CP_Used'), name: 'usedCoupon' }
])

</script>

<style lang="scss" scoped>
.coupon-list li {
  transition: transform 0.3s ease-out;
}
</style>
