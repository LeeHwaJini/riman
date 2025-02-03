<!--
  마이페이지 > 플래너로 전환 > 완료
  create by jhchoi
-->
<template>
  <component :is="componentName" :page-state="pageState" />
</template>

<script setup>
import { onMounted, reactive, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { sessionDataManager, CONVERSION_CURRENT_STEP, CONVERSION_CERTI_INFO, CONVERSION_USER_INFO } from '@utils/dataManager'
import { useMainStore } from '@/store/mainStore'

import LocalConversionComplete from './partital/LocalConversionComplete'
import ForeignConversionComplete from './partital/ForeignConversionComplete'

const mainStore = useMainStore()
const userInfo = mainStore.getUser

const componentName = computed(() => {
  return pageState.isForeign ? ForeignConversionComplete : LocalConversionComplete
})
const pageState = reactive({
  userName: '',
  isForeign: false
})

onMounted(() => {
  getUserInfo()
})

onBeforeRouteLeave(() => {
  removeSignupData()
})

/**
 * 세션 정보 호출
 */
const getUserInfo = () => {
  const certiInfo = JSON.parse(sessionDataManager.get(CONVERSION_CERTI_INFO))
  if (certiInfo) {
    pageState.isForeign = certiInfo.foreign
    pageState.userName = userInfo.fullName
  }
}

/**
 * 세션 초기화
 */
const removeSignupData = () => {
  const sessionList = [CONVERSION_CURRENT_STEP, CONVERSION_CERTI_INFO, CONVERSION_USER_INFO]
  sessionList.map((data) => {
    sessionDataManager.remove(data)
  })
}

</script>
