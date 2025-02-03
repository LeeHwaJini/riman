<!--
  회원가입/로그인 > 네이버 간편회원가입/로그인 > 팝업
  create by jhchoi
-->
<template>
  <div>
    <!--네이버 로그인 API 버튼 연결용 div [id가 naverIdLogin인 div가 없으면 오류]-->
    <div v-show="false" id="naverIdLogin" ref="naverBtn"/>
  </div>
</template>
<script setup>
import { onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

onMounted(() => {
  init()
})

const init = () => {
  const clientId = import.meta.env.VITE_APP_NAVER_JOIN_CLIENT_ID
  const callbackUrl = `${import.meta.env.VITE_APP_BASE_URL}/signup/naver/signupResult`
  const naverLogin = new window.naver.LoginWithNaverId(
    {
      clientId: clientId,
      callbackUrl: callbackUrl,
      isPopup: false,
      callbackHandle: true,
      loginButton: { color: 'green', type: 3, height: 60 }
    }
  )

  // 네이버 로그인 활성화
  naverLogin.init()
  // 네이버 자체 로그인 버튼 클릭 처리
  proxy.$refs.naverBtn.children[0].click()
}
</script>
