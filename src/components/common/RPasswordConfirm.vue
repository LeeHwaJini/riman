<!--
  password confirm
  create by jhchoi
-->
<template>
  <div class="field">
    <span class="input-title required">{{ title }}</span>
    <RInput v-model="password" :placeholder="$t('VA_EnterPassword')" type="togglePassword" class="login-input q-field__inner-h40 pwd-input" :rules="[()=>isPasswordValid ]" />

    <ul v-if="isPasswordValid" class="pwd-check-area">
      <li class="valid">{{ $t('UTI_ValidatePassword') }}</li>
    </ul>

    <ul v-else class="pwd-check-area">
      <li :class="{ 'valid': validate.hasEnglish(password)}"><q-icon name="check" /><span>{{ $t('UTI_ValidatePassword1') }}</span></li>
      <li :class="{ 'valid': validate.hasSpecialChar(password) }"><q-icon name="check" /><span>{{ $t('UTI_ValidatePassword2') }}</span></li>
      <li :class="{ 'valid': validate.hasNumber(password) }"><q-icon name="check" /><span>{{ $t('UTI_ValidatePassword3') }}</span></li>
      <li :class="{ 'valid': validate.checkLength(password,8,16) }"><q-icon name="check" /><span>{{ $t('UTI_ValidatePassword4') }}</span></li>
    </ul>
  </div>

  <div class="field">
    <span class="input-title required">{{ title }} {{ $t('CM_Ok') }}</span>
    <RInput v-model="confirmPassword" :placeholder="$t('UTI_ValidateConfirmPassword')" type="togglePassword" class="login-input q-field__inner-h40 pwd-input" :rules="[val=>!!val && isSamePwd]" />
    <ul v-if="confirmPassword" class="pwd-check-area">
      <li v-if="isSamePwd" class="valid">{{ $t('UTI_ValidateConfirmPassword1') }}</li>
      <li v-else class="disvalid">{{ $t('UTI_ValidateConfirmPassword2') }}</li>
    </ul>
  </div>

</template>

<script setup>
import { defineProps, defineModel, computed } from 'vue'
import { validate } from '@/utils/validate'

const password = defineModel('password')
const confirmPassword = defineModel('passwordConfirm')

const props = defineProps({
  title: {
    type: String,
    default: '비밀번호'
  }
})

const isPasswordValid = computed(() => {
  return !!password.value && validate.hasEnglish(password.value) && validate.hasSpecialChar(password.value) && validate.hasNumber(password.value) && validate.checkLength(password.value, 8, 16)
})

const isSamePwd = computed(() => password.value === confirmPassword.value)

</script>

<style lang="scss" scoped>
:deep(.q-field--error .q-field__bottom){
  padding: 0;
}
</style>
