<!--
  카드 등록 실패
  create by jmchoi
-->
<template>
  <div>
    code = {{ code }}
    message = {{ message }}
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const code = route.query.code
const message = route.query.message
const redirect = route.query.redirect

onMounted(() => {
  router.push(redirect + '?billing=fail')
})
</script>
