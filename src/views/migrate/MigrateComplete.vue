<!--
  회원 전환 > 완료
  create by jhchoi
-->
<template>
  <component
    :is="componentName"
    :migrate-complete="migrateComplete"
  />
</template>

<script setup>
import { computed, onBeforeMount } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { sessionDataManager, MIGRATE_COMPLETE, MIGRATE_INFO } from '@utils/dataManager'
import PlannerMigrateComplete from './planner/PlannerMigrateComplete'
import CustomerMigrateComplete from './customer/CustomerMigrateComplete'

const router = useRouter()
const migrateComplete = JSON.parse(sessionDataManager.get(MIGRATE_COMPLETE))
const migrateInfo = JSON.parse(sessionDataManager.get(MIGRATE_INFO))

const isPlanner = migrateInfo?.userType === 'PLANNER'

/**
 * 회원 전환 완료 컴포넌트 설정
 */
const componentName = computed(() => {
  return isPlanner ? PlannerMigrateComplete : CustomerMigrateComplete
})

onBeforeMount(() => {
  if (!migrateInfo || !migrateComplete) {
    router.push({ 'name': 'Home' })
  }
})

/**
 * 페이지 이동, 세션 삭제
 */
onBeforeRouteLeave(() => {
  sessionDataManager.remove(MIGRATE_COMPLETE)
  sessionDataManager.remove(MIGRATE_INFO)
})
</script>
