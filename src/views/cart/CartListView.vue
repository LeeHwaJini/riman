<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t('NAV_Cart') }}</h3>
    </div>

    <RTabs v-if="isAutoship" v-model="cartStore.cartType" :tab-list="tabList" class="tab type02" @click="onClickTab"/>
    <q-tab-panels v-model="cartStore.cartType" class="tab-list type02">
      <q-tab-panel name="normal">
        <NormalCartTab v-if="cartStore.cartType ==='normal'" ref="normalCart"/>
      </q-tab-panel>
      <q-tab-panel name="auto">
        <AutoCartTab v-if="isLogined && cartStore.cartType ==='auto'"/>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NormalCartTab from './tabs/NormalCartTab'
import AutoCartTab from './tabs/AutoCartTab'
import { useCartStore } from '@/store/cartStore'
import { isLogin } from '@/utils/login'
const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()
const normalCart = ref()
const isLogined = computed(() => isLogin())
const { proxy } = getCurrentInstance()
const isAutoship = import.meta.env.VITE_APP_IS_AUTOSHIP === 'true'
const tabList = computed(() => [
  { label: proxy.$t('NAV_Cart'), name: 'normal' },
  { label: '정기구매 장바구니', name: 'auto' }
])
async function onClickTab() {
  router.push({
    path: '/cart',
    query: {
      type: cartStore.cartType
    }
  })
}
function checkLoginConfirm() {
  if (!isAutoship) {
    router.push('/cart?type=normal')
    return
  }
  if (cartStore.cartType === 'auto') {
    if (!isLogined.value) {
      confirmLogin()
    }
  }
}
async function confirmLogin() {
  return proxy.$confirm(proxy.$t('CM_RecommLogin'), {
    title: proxy.$t('CM_UseAferLogin'),
    okLabel: proxy.$t('CM_AgreeLogin'),
    cancelLabel: proxy.$t('CM_DoNextTime'),
    ok: () => {
      router.push('/login')
    },
    cancel: () => {
      cartStore.updateCartType('normal')
      router.push({
        path: '/cart',
        query: {
          type: 'normal'
        }
      })
    }
  })
}
async function init() {
  const query = route.query
  if (query.type === 'auto') {
    cartStore.updateCartType('auto')
    checkLoginConfirm()
  } else {
    cartStore.updateCartType('normal')
  }
}
onMounted(() => {
  init()
})
</script>
