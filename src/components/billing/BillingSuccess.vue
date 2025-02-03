<!--
  카드 등록 성공
  create by jmchoi
-->

<template>
  <div>
    customerKey = {{ customerKey }}
    authKey = {{ authKey }}
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@store/mainStore'

import http from '@utils/http'

const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()

const userInfo = mainStore.userInfo

const customerKey = route.query.customerKey
const authKey = route.query.authKey
const redirect = route.query.redirect

const init = async () => {
  const params = {
    customerKey: customerKey,
    authKey: authKey
  }
  const result = await http().url(`/member/v1/${userInfo.userSeqNo}/favorite-cards`).param(params).post()

  if (result) {
    router.push(redirect + '?billing=success&userFavoriteCardsId=' + result.data.userFavoriteCardsId)
  } else {
    router.push(redirect + '?billing=fail')
  }
}

onMounted(() => {
  init()
})
</script>

