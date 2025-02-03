<!--
  Header Layout
  create by jhchoi
-->
<template>
  <div class="layout" :class="$route.meta.layoutClass">
    <TheHeader />
    <TheContainer />
  </div>
</template>

<script setup>
import { cookieDataManager, DATA_AUTO_LOGIN } from '@utils/dataManager'
import { getLocalRefreshToken, saveRefreshToken } from '@utils/token'
import { isLogin } from '@utils/login'
import { onBeforeMount } from 'vue'
import { useMainStore } from '@store/mainStore'
import cartService from '@/http/services/cart'

const mainStore = useMainStore()

onBeforeMount(async () => {
  doAutoLogin()
})

/**
 * 자동 로그인 체크 > 로컬스토리지에 있는 refreshToke 세션에 적용
 */
const doAutoLogin = async () => {
  const isAutoLogin = cookieDataManager.get(DATA_AUTO_LOGIN) // 자동 로그인 설정 여부
  const localRefreshToken = getLocalRefreshToken()
  if (isAutoLogin && localRefreshToken && !isLogin()) {
    await saveRefreshToken(localRefreshToken)
    await mainStore.getMe()

    // 장바구니 조회
    await cartService.getCart()
  }
}
</script>
