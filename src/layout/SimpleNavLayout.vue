<!--
  Simple Navigation Layout
  create by jhchoi
-->
<template>
  <div v-scroll="onScroll" :class="['simple-nav-layout', $route.meta.layoutClass, { 'transparent-nav-layout': isTranslate }]">
    <TheHeader :is-top-nav-bar="true"/>
    <TheContainer />
    <BottomNavBar />
    <TheFooter/>
    <ButtonGoTop />
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, computed, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { cookieDataManager, DATA_AUTO_LOGIN } from '@utils/dataManager'
import { getLocalRefreshToken, saveRefreshToken } from '@utils/token'
import { isLogin } from '@utils/login'
import { useMainStore } from '@store/mainStore'
import cartService from '@/http/services/cart'

const mainStore = useMainStore()

const { proxy } = getCurrentInstance()
const route = useRoute()
const isTranslate = ref(false)

/**
   * 스크롤 0 일 경우 nav 영역 불투명 처리
  */
const onScroll = (val) => {
  const isMobile = computed(() => proxy.$isMobile())
  if (!route.meta.isToggleTranslate || !isMobile.value) {
    return
  }
  if (val === 0 || val === undefined) {
    isTranslate.value = true
  } else {
    isTranslate.value = false
  }
}

onMounted(() => {
  onScroll()
})

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
