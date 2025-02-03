<!--
  계정 찾기
  create by jhchoi
-->
<template>
  <q-form v-if="!pageState.isVertify" :greedy="true" autocomplete="off" @submit.prevent="onSubmit">
    <div class="max-width-wrap signup-wrap pb144">
      <div class="signup-detail-title-area">
        <h4 class="animate__fadeInUp"><b>{{ $t('CM_UserNumber') }}</b> {{ $t('CM_Find') }}</h4>
        <p class="animate__fadeInUp animate__delay-2s">{{ $t('USR_SubTitle1') }}<br>{{ $t('USR_SubTitle2') }}</p>
      </div>

      <div class="form-area type01">
        <div class="field">
          <span class="input-title">{{ $t('CM_FirstName') }}</span>
          <RInput
            ref="nameRef"
            v-model="form.userName"
            :placeholder="$t('USR_ValidName')"
            class="login-input login-input--id"
            :rules="[val => !!val || $t('USR_ValidName')]"
            :disable="pageState.isSendCode"
          />
        </div>

        <div class="field">
          <span class="input-title">{{ $t('CM_MobileNumber') }}</span>
          <div class="input-btn-area">
            <div class="flex1">
              <RInput
                ref="phoneRef"
                v-model="form.phoneNumber"
                :placeholder="$t('USR_ValidNumber')"
                class="login-input login-input--id"
                type="number"
                maxlength="11"
                :rules="[validate.isValidPhoneNumber]"
                :hint="pageState.isSendCode?$t('USR_SendCode'):''"
                :disable="pageState.isSendCode"
                @keydown.enter.prevent="onSendCode"
              />
            </div>
            <RButton class="btn type01 w-medium small" :label="pageState.isSendCode?$t('CM_Resend'):$t('USR_RequestCode')" @on-click="onSendCode"/>
          </div>
        </div>

        <div v-show="pageState.isSendCode" class="field">
          <span class="input-title">{{ $t('USR_InputCode') }}</span>
          <RInput
            ref="codeRef"
            v-model="form.code"
            :placeholder="$t('USR_ValidInputCode')"
            class="login-input login-input--id"
            :rules="[isValidCode]"
          >
            <template #append>
              <RCountdown v-if="pageState.isSendCode && !pageState.isOverTime" ref="countDownRef" @end="onCountdownEnd" />
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

      <div v-if="pageState.isSendCode" class="bottom-btn">
        <RButton class="btn full small type02" :label="$t('USR_CheckCode')" type="submit" :disabled="pageState.isOverTime" @on-click="onNextButton"/>
      </div>

    </div>
  </q-form>
  <template v-else>
    <!-- 계정찾기 완료 -->
    <FindAccountRes :user-number="data.userNumber" :is-migrate="pageState.isMigrate" :user-name="form.userName" />
  </template>
</template>

<script setup>
import { ref, getCurrentInstance, reactive } from 'vue'
import memberService from '@/http/services/member'
import validate from '@utils/validate'

// 입력 폼
const form = reactive({
  userName: '',
  phoneNumber: '',
  code: ''
})

const pageState = reactive({
  isVertify: false,
  isSendCode: false,
  isOverTime: false,
  isMatchCode: true,
  isMigrate: false
})

const data = reactive({
  token: '',
  userNumber: ''
})

const { proxy } = getCurrentInstance()
const codeRef = ref(null)
import FindAccountRes from './FindAccountRes'

/**
 * 휴대폰 번호 > 인증요청
 */
const countDownRef = ref(null)
const onSendCode = async () => {
  const isValidName = await proxy.$refs.nameRef.validate()
  const isValidPhone = await proxy.$refs.phoneRef.validate()

  if (!isValidName || !isValidPhone) {
    return
  }

  const params = {
    'userName': form.userName,
    'phoneNumber': form.phoneNumber
  }
  const result = await memberService.postSendCode(params)
  if (result) {
    if (pageState.isSendCode) {
      // 인증번호 재 전송
      pageState.isOverTime = false
      proxy.$refs.codeRef.validate()

      setTimeout(() => {
        countDownRef.value.resetTime()
      })
    }

    data.token = result.data.token
    proxy.$alert(proxy.$t('USR_SendCode'), {
      ok: function () {
        setTimeout(() => {
          proxy.$refs.codeRef.focus()
        })
      }
    })

    pageState.isSendCode = true
  }
}

/**
 * 인증번호 validation
 * @param val
 */
const isValidCode = async (val) => {
  if (pageState.isOverTime) {
    return proxy.$t('USR_ValidOverTimeCode')
  } else if (!pageState.isMatchCode) {
    return proxy.$t('USR_ValidMatchCode')
  } else if (!val) {
    return proxy.$t('USR_ValidCode')
  }
  return true
}

const onSubmit = async () => {
  const params = {
    'token': data.token,
    'code': form.code,
    'phoneNumber': form.phoneNumber
  }
  const result = await memberService.postVertifyCode(params)
  if (result) {
    if (result.data.code === 'SUCCESS') {
      data.userNumber = result.data.userNumber
      pageState.isMigrate = result.data.migrateUserYn && !result.data.migrateCompleteYn

      proxy.$alert(proxy.$t('USR_SuccessVertify'), {
        ok: function () {
          pageState.isVertify = true
        }
      })
    } else {
      pageState.isMatchCode = false
      proxy.$refs.codeRef.validate()
    }
  }
}

/**
 * countdown end callback
 */
const onCountdownEnd = () => {
  pageState.isOverTime = true
  proxy.$refs.codeRef.validate()
}

/**
 * 다음 단계 버튼 클릭
 */
const onNextButton = () => {
  pageState.isMatchCode = true
}
</script>

<style lang="scss" scoped>
:deep(.q-field__bottom){
  padding: 8px 0 0;
  color: #2EB8B3;
}
</style>

