<!--
  회원가입 > 가입 완료
-->
<template>
  <component :is="componentName" :page-state="pageState" :title-text="titleText()" :sub-title-text="subTitleText"/>
</template>

<script setup>
import { onMounted, getCurrentInstance, reactive, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { sessionDataManager, SIGNUP_CURRENT_STEP, SIGNUP_USER_TYPE, SIGNUP_SNS_DATA, SIGNUP_REFERRER_NUMBER, SIGNUP_SERVICE_TYPE, SIGNUP_CERTI_INFO,
  SIGNUP_USER_INFO, SIGNUP_COMPLETE, SIGNUP_REFERRER_CODE, SIGNUP_REFERRER_BRANCH_ID } from '@utils/dataManager'
import { ROLES_BE, NO_SNS } from '@utils/constant'

const { proxy } = getCurrentInstance()

const pageState = reactive({
  userNumber: '',
  userName: '',
  isSns: false,
  isPlanner: false,
  isForeign: false
})

import CustomerComplete from './partital/CustomerSignupComplete'
import PlannerComplete from './partital/PlannerSignupComplete'

const componentName = computed(() => {
  return pageState.isPlanner && !pageState.isForeign ? PlannerComplete : CustomerComplete
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
  const userInfo = JSON.parse(sessionDataManager.get(SIGNUP_COMPLETE))?.userRegisterInfo
  if (userInfo) {
    pageState.userNumber = userInfo.userNumber
    pageState.userName = proxy.$nameFormat(userInfo.lastName, userInfo.firstName)
    pageState.isSns = sessionDataManager.get(SIGNUP_SERVICE_TYPE) !== NO_SNS
    pageState.isPlanner = sessionDataManager.get(SIGNUP_USER_TYPE) === ROLES_BE.planner
    pageState.isForeign = JSON.parse(sessionDataManager.get(SIGNUP_CERTI_INFO)).foreign
  }
}

/**
 * 세션 초기화
 */
const removeSignupData = () => {
  const sessionList = [SIGNUP_CURRENT_STEP, SIGNUP_USER_TYPE, SIGNUP_SNS_DATA, SIGNUP_REFERRER_NUMBER, SIGNUP_SERVICE_TYPE, SIGNUP_CERTI_INFO,
    SIGNUP_USER_INFO, SIGNUP_COMPLETE, SIGNUP_REFERRER_CODE, SIGNUP_REFERRER_BRANCH_ID]

  sessionList.map((data) => {
    sessionDataManager.remove(data)
  })
}

/**
 * 가입 완료 title
 */
const titleText = () => {
  if (pageState.isPlanner && pageState.isForeign) {
    return proxy.$t('SIG_CompleteTitle1')
  } else {
    return proxy.$t('SIG_CompleteTitle2')
  }
}

/**
 * 가입 완료 sub title
 */
const subTitleText = computed(() => {
  if (pageState.isSns) {
    return proxy.$t('SIG_CompleteSubTitle1')
  } else if (pageState.isPlanner && pageState.isForeign) {
    return proxy.$t('SIG_CompleteSubTitle2')
  } else {
    return proxy.$t('SIG_CompleteSubTitle3')
  }
})

</script>
