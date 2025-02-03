<!--
  Sub Navigation Bar
  create by jhchoi
-->
<template>
  <nav class="nav max-width-wrap">
    <RButton class="" @on-click="onBack">
      <template #content>
        <i class="ico arrow-left"></i>
      </template>
    </RButton>

    <q-btn-toggle
      v-model="model"
      toggle-color="primary"
      :options="[
        {label: $t('CM_TabMall'), value: 'mall'},
        {label: $t('CM_TabRbo'), value: 'rbo'}
      ]"
      class="toggle type01 small"
      @update:model-value="onChangeToggle"
    />

    <div class="relative" @click="goCart">
      <i class="ico cart"></i>
      <span class="badge type01">{{ $displayMaxNumber(standardCartBadge) }}</span>
    </div>
  </nav>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMainStore } from '@/store/mainStore'
import { storeToRefs } from 'pinia'
import { ROLES_BE } from '@/utils/constant'
import { goRboSite } from '@/utils/common'

const mainStore = useMainStore()
const { standardCartBadge } = storeToRefs(mainStore)
const { proxy } = getCurrentInstance()

const props = defineProps({
  isGoBack: {
    type: Boolean,
    default: true
  }
})

const model = ref('mall')
const router = useRouter()
const route = useRoute()

/**
 * 뒤로가기
 */
const onBack = () => {
  const backPage = route?.meta?.backPage
  if (backPage) {
    router.push({ name: backPage })
  } else if (window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}

const goCart = () => {
  router.push({
    path: '/cart',
    query: {
      type: 'normal'
    }
  })
}

/**
 * 마이오피스 이동 토글
 */
const onChangeToggle = () => {
  if (useMainStore().getUser.userType === ROLES_BE.no_referral_consumer) {
    // 추천인 없는 소비자
    alert(proxy.$t('ALT_RejectMyOffice'))
    model.value = 'mall'
  } else {
    goRboSite()
  }
}
</script>
