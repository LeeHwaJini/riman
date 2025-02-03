<!--
  마이페이지 > 비밀번호 변경
  create by jhchoi
-->
<template>
  <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmit">
    <div class="max-width-wrap signup-wrap pb144">
      <div class="signup-detail-title-area">
        <h3 class="animate__fadeInUp"><b>{{ $t('MUI_ChangePassword') }}</b></h3>
        <p class="animate__fadeInUp animate__delay-2s">{{ $t('MCP_SubTitle1') }}<br>{{ $t('MCP_SubTitle2') }}</p>
      </div>

      <div class="form-area type01 ">
        <div class="field">
          <span class="input-title required">{{ $t('MCP_CurrentPassword') }}</span>
          <RInput
            ref="idRef"
            v-model="form.currentPassword"
            :placeholder="$t('MCP_SubTitle2')"
            class="login-input login-input--id"
            :rules="[val => !!val || $t('MCP_SubTitle2')]"
          />

        </div>

        <div class="field">
          <RPasswordConfirm v-model:password="form.changedPassword" v-model:passwordConfirm="form.confirmPassword" :title="$t('MCP_ChangedPassword')"/>
        </div>
      </div>

      <div class="bottom-btn">
        <RButton class="btn full small type02 font-16" :label="$t('LOG_RestPassword')" type="submit" />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { localDataManager, cookieDataManager, DATA_AUTO_LOGIN, ID_REFESH_TOKEN_KEY } from '@utils/dataManager'

import mypageService from '@/http/services/mypage'
import { useMainStore } from '@store/mainStore'

const mainStore = useMainStore()
const userInfo = mainStore.getUser

const { proxy } = getCurrentInstance()

const form = reactive({
  currentPassword: '',
  changedPassword: '',
  confirmPassword: ''
})

/**
 * 비밀번호 재설정 하기
 */
const onSubmit = async () => {
  const params = {
    'currentPassword': form.currentPassword,
    'changedPassword': form.changedPassword,
    'confirmPassword': form.confirmPassword
  }
  const response = await mypageService.putChangePassword(userInfo.userSeqNo, params)
  if (response && response.message === 'OK') {
    proxy.$alert(proxy.$t('MCP_AltChangePassword'))
    clearAutoLogin()
  }
}

/**
 * 자동로그인 초기화
 */
const clearAutoLogin = () => {
  cookieDataManager.remove(DATA_AUTO_LOGIN)
  localDataManager.remove(ID_REFESH_TOKEN_KEY)
}
</script>
