<!--
  Top Navigation Bar
  create by jhchoi
-->
<template>
  <nav class="nav max-width-wrap">
    <RButton class="" @on-click="onBack">
      <template #content>
        <i class="ico arrow-left"></i>
      </template>
    </RButton>

    {{ $t(title) }}
    <RButton icon="close" :class="{'visibility-hidden' : !$route.meta.isShowNavCloseBtn}" @click="onClose" />
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

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

/**
 * 닫기
 */
const onClose = () => {
  const closePage = route?.meta?.closePage || 'HOME'
  router.push({ name: closePage })
}

const title = computed(() => {
  return route?.meta?.title
})

</script>
