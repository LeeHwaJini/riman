<!--
  비밀번호 재설정
  create by jhchoi
-->
<template>
  <keep-alive>
    <component
      :is="currentStepComp.component"
      :key="currentStep"
      :reset-info="resetInfo"
      @update-reset-info="updateResetInfo"
      @handle-move-step="handleMoveStep"
    />
  </keep-alive>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import ResetPasswordMain from './ResetPasswordMain'
import ResetPasswordRes from './ResetPasswordRes'

const currentStep = ref('checkUser')

const resetInfo = reactive({
  userId: '',
  changedPassword: '',
  code: '',
  token: ''
})
const currentStepComp = computed(() => {
  return stepsCreateRequest.value[currentStep.value]
})

const stepsCreateRequest = computed(() => {
  return {
    'checkUser': {
      component: ResetPasswordMain
    },
    'resetPasswordRes': {
      component: ResetPasswordRes
    }
  }
})

const handleMoveStep = (comName) => {
  currentStep.value = comName
}

const updateResetInfo = (data) => {
  Object.assign(resetInfo, {
    ...data
  })
}
</script>
