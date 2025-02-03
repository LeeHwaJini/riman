<!--
  회원가입/로그인 > Apple 간편회원가입/로그인 > 팝업
  create by jwchoi
-->
<template>
  <div/>
</template>
<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  callbackEvt: {
    type: Function,
    default: () => {}
  }
})

onMounted(() => {
  init()
})

const init = async () => {
  const clientId = import.meta.env.VITE_APP_APPLE_JOIN_CLIENT_ID
  const redirectURI = `${import.meta.env.VITE_APP_BASE_URL}/apple/callback`

  const oauthToken = import.meta.env.VITE_OAUTH_TOKEN

  window.AppleID.auth.init({
    clientId,
    redirectURI,
    state: oauthToken,
    scope: 'name email',
    nonce: 'NONCE',
    response_mode: 'form_post',
    usePopup: true
  })

  try {
    const { authorization } = await window.AppleID.auth.signIn()

    const { email, is_private_email } = obtainAppleInfo(authorization.id_token)

    const param = {
      serviceType: 'APPLE',
      id: authorization.id_token,
      isPrivateEmail: is_private_email ? 'true' : 'false',
      email
    }

    props.callbackEvt(param)
  } catch (error) {
    console.log({ error })
  }
}

const obtainAppleInfo = (idToken) => {
  const base64Url = idToken.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      })
      .join('')
  )
  return JSON.parse(jsonPayload)
}
</script>
