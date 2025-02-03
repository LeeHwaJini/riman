<!--
  메인 > 헤리티지
  create by jhchoi
-->
<template>
  <component
    :is="componentName"
    :is-dive-in-success="isDiveInSuccess"
  />
</template>

<script setup>
import { getCurrentInstance, computed } from 'vue'

import PCHeritage from './PCHeritage'
import MobileHeritage from './MobileHeritage'

const { proxy } = getCurrentInstance()

const props = defineProps({
  // 팝업창 크기
  isDiveInSuccess: {
    type: Boolean,
    default: false
  }
})

/**
 * 헤리티지 > mobile, pc 컴포넌트 분리
 */
const componentName = computed(() => {
  return proxy.$isTablet() ? MobileHeritage : PCHeritage
})

const isDiveInSuccess = computed(() => {
  return props.isDiveInSuccess
})
</script>
