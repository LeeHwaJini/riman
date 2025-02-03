<!--
  회원가입/로그인 > 네이버 간편회원가입/로그인 > 콜백
  create by jhchoi
-->
<template>
  <div/>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  getUserInfo()
})

const getUserInfo = async () => {
  const clientId = import.meta.env.VUE_APP_NAVER_JOIN_CLIENT_ID
  const naverLogin = new window.naver.LoginWithNaverId(
    {
      clientId: clientId
    }
  )

  // 네이버 로그인 활성화
  naverLogin.init()
  console.log('naverLogin', naverLogin)
  // 사용자 로그인 여부 확인
  naverLogin.getLoginStatus((status) => {
    setPostMessage(status, naverLogin.user)
  })
}

// postMessage 작동 전 데이터 처리
const setPostMessage = (status, userInfo) => {
  const data = {
    sendTo: 'sns easy login', // postMessage로 보낸 evnt에서 네이버 간편 가입 판단 값
    status: status // 사용자 로그인 여부 [true: 로그인 함/ fasle: 로그인 안함]
  }
  console.log('status...', status, userInfo)

  if (status) {
    userInfo.email = refineEmail(userInfo.email) // 이메일 정제

    userInfo.isEmailVerified = true // 이메일 제공 동의 여부 [카카오의 경우 false면 마스킹 처리 되어있음]
    userInfo.serviceType = 'NAVER'
    data.userInfo = userInfo // 사용자 정보
  } else {
    data.errorMessage = '사용자가 필수정보 동의를 취소했거나, Naver 로그인 AccessToken이 올바르지 않을 수 있습니다.'
  }

  // 설정한 eventListener에 데이터 전달
  window.opener.postMessage(data, import.meta.env.VITE_APP_BASE_URL)
  // 팝업 닫기
  setTimeout(() => {
    // opener.window.NaverLoginPopClose()
    window.close()
  }, 100)
}

// 이메일 정제 [***@jr.naver.com → ***@naver.com]
const refineEmail = (email) => {
  return email.replace('jr.', '')
}
</script>
