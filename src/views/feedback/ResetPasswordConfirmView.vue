<template>
  <div class="max-width-wrap signup-wrap pb144">
    <div class="signup-detail-title-area mo-pt48-pb8">
      <h4 class="animate__fadeInUp"><b>{{ $t('NAV_ResetPassword') }}</b></h4>
      <p class="animate__fadeInUp animate__delay-2s">새로운 비밀번호를 입력해주세요.</p>
    </div>

    <div class="form-area type01">
      <div class="field">
        <span class="input-title required">{{ $t('CM_FirstName') }}</span>
        <RInput
          ref="idRef"
          v-model="title"
          :placeholder="$t('ALT_InputName')"
          class="login-input login-input--id"
          disable
        />
      </div>

      <div class="field">
        <span class="input-title required">{{ $t('CM_MobileNumber') }}</span>
        <RInput
          ref="idRef"
          v-model="title"
          :placeholder="$t('USR_ValidNumber')"
          class="login-input login-input--id"
          disable
        />
      </div>

      <div class="field">
        <RPasswordConfirm v-model:password="password" v-model:passwordConfirm="password" />
      </div>

    </div>

    <div v-if="1" class="bottom-btn">
      <Certificate
        type="innerBtn"
        btn-class="btn full small type02"
        :btn-text="'확인'"
        @on-success="onCertSuccess"
      />
    </div>
  </div>

</template>

<script setup>
import { reactive, ref } from 'vue'
import validate from '@/utils/validate'
import memberService from '@/http/services/member'
const emit = defineEmits(['handleMoveStep', 'updateResetInfo'])

// 입력 폼
const form = reactive({
  userName: '',
  userNumber: ''
})

const isCheckUser = ref(false)
const userData = ref([])

const onSubmitCheckUser = async () => {
  const params = {
    'userName': form.userName,
    'userNumber': form.userNumber
  }
  const result = await memberService.postResetFindUser(params)
  if (result && result.message === 'success') {
    isCheckUser.value = true
    userData.value = result.data
  }
}

const onCertSuccess = (data) => {
  emit('handleMoveStep', 'resetPasswordRes')
  emit('updateResetInfo', {
    userId: userData.value.userId,
    code: userData.value.code,
    token: userData.value.token,
    userConnectingInformationTempId: data.userConnectingInformationTempId
  })
}

</script>
