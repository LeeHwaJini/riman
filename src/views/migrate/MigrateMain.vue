<!--
  회원 전환 > 작성
  create by jhchoi
-->
<template>
  <keep-alive>
    <component
      :is="currentStepComp.component"
      :key="currentStep"
      :migrate-info="migrateInfo"
      @change-step="onChangeStep"
      @update-migrate-info="updateMigrateInfo"
    />
  </keep-alive>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue'
import { sessionDataManager, MIGRATE_INFO } from '@utils/dataManager'
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import PlannerEnterInformation from './planner/PlannerEnterInformation'
import CustomerCertificate from './customer/CustomerCertificate'
import CustomerEnterInformation from './customer/CustomerEnterInformation'

const router = useRouter()

let migrateInfo = JSON.parse(sessionDataManager.get(MIGRATE_INFO))
const currentStep = ref('')
const currentStepComp = computed(() => {
  return stepsCreateRequest.value[currentStep.value]
})

const stepsCreateRequest = computed(() => {
  return {
    'plannerEnterInformation': {
      component: PlannerEnterInformation
    },
    'customerCertificate': {
      component: CustomerCertificate
    },
    'customerEnterInformation': {
      component: CustomerEnterInformation
    }
  }
})

onBeforeMount(() => {
  if (!migrateInfo) {
    router.push({ 'name': 'Home' })
  }

  setComponent()
})

/**
 * 페이지 이동, 세션 삭제
 */
onBeforeRouteLeave((to, from, next) => {
  if (to.name !== 'MigrateComplete') {
    sessionDataManager.remove(MIGRATE_INFO)
  }
  return next(true)
})

/**
 * 컴포넌트 설정
 */
const setComponent = () => {
  const isPlanner = migrateInfo?.userType === 'PLANNER'
  if (isPlanner) {
    currentStep.value = 'plannerEnterInformation'
  } else {
    currentStep.value = 'customerCertificate'
  }
}

/**
 * 컴포넌트 변경
 */
const onChangeStep = (val) => {
  currentStep.value = val
}

/**
 * 커스터머 > 휴대폰 본인 인증 정보 추가
 */
const updateMigrateInfo = (val) => {
  migrateInfo = Object.assign(migrateInfo, {
    mobileNumber: val.mobileNumber,
    birthDate: val.birthDate,
    userName: val.userName,
    userConnectingInformationTempId: val.userConnectingInformationTempId,
    foreign: val.foreign
  })
}

</script>
