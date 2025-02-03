<template>
  <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmitCheckUser">
    <div class="max-width-wrap signup-wrap pb144">
      <div class="signup-detail-title-area mo-pt48-pb8">
        <h4 class="animate__fadeInUp"><b>{{ $t('NAV_ResetPassword') }}</b></h4>
        <p class="animate__fadeInUp animate__delay-2s">{{ $t('RPW_SubTitle1') }}<br>{{ $t('RPW_SubTitle2') }}</p>
      </div>

      <div class="form-area type01 ">
        <div class="field">
          <span class="input-title">{{ $t('CM_FirstName') }}</span>
          <RInput
            ref="idRef"
            v-model="form.userName"
            :placeholder="$t('ALT_InputName')"
            class="login-input login-input--id"
            :rules="[val => !!val || $t('ALT_InputName')]"
          />

        </div>

        <div class="field">
          <span class="input-title">{{ $t('CM_MobileNumber') }}</span>
          <div class="input-btn-area">
            <div class="flex1">
              <RInput
                ref="phoneRef"
                v-model="phoneNumber"
                :placeholder="$t('USR_ValidNumber')"
                class="login-input login-input--id"
                type="number"
                maxlength="11"
              />
            </div>
            <RButton class="btn type01 w-medium small" :label="'재전송'" @on-click=""/>
          </div>
        </div>

        <div v-show="1" class="field">
          <span class="input-title">{{ $t('USR_InputCode') }}</span>
          <RInput
            ref="codeRef"
            v-model="code"
            :placeholder="$t('USR_ValidInputCode')"
            class="login-input login-input--id"

          >
            <template #append>
              <RCountdown v-if="1" ref="countDownRef" @end="" />
            </template>
          </RInput>

          <div class="auth-num-title" >
            {{ $t('USR_TooltipCode1') }}
            <div class="tooltip-area type01 top">
              <i class="ico question" @click="$notify($t('USR_TooltipCode2'), $t('USR_TooltipCode1'))"></i>
            </div>
          </div>
        </div>

      </div>

      <div v-if="1" class="bottom-btn">
        <Certificate
          type="innerBtn"
          btn-class="btn full small type02"
          :btn-text="'인증번호 확인'"
          :user-number="form.userNumber"
          @on-success="onCertSuccess"
        />
      </div>

    </div>
  </q-form>

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
