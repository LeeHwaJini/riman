<!--
  비밀번호 재설정
  create by jhchoi
-->
<template>
  <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmitCheckUser">
    <div class="max-width-wrap signup-wrap pb144">
      <div class="signup-detail-title-area">
        <h4 class="animate__fadeInUp"><b>{{ $t('NAV_ResetPassword') }}</b></h4>
        <p class="animate__fadeInUp animate__delay-2s">{{ $t('RPW_SubTitle1') }}<br>{{ $t('RPW_SubTitle2') }}</p>
      </div>

      <div class="login-form-area form-area type01 ">
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
          <span class="input-title">{{ $t('CM_UserNumber') }}</span>
          <div class="input-btn-area">
            <RInput
              ref="idRef"
              v-model="form.userNumber"
              type="number"
              :placeholder="$t('LOG_ValidUserNumber')"
              class="login-input login-input--id"
              :rules="[ validate.isValidUserNumber ]"
            />
            <RButton class="btn type01 w-small small mt0" :label="$t('CM_Search')" type="submit"/>
          </div>

          <div class="mem-num-move-btn-area login-move-btn-area">
            <span>{{ $t('RPW_GoFindAccount') }}</span>
            <router-link to="/findAccount" class="">{{ $t('LOG_FindAccount') }}</router-link>
          </div>

        </div>
      </div>

      <!-- <div v-if="isCheckUser" class="bottom-btn">
        <span class="block mb8 text-center font-14 gray03-color">{{ $t('RPW_CheckCerti') }}</span>
        <Certificate
          type="innerBtn"
          btn-class="btn full small type02"
          :btn-text="$t('CM_Certi')"
          :user-number="form.userNumber"
          @on-success="onCertSuccess"
        />
      </div> -->
      <div v-if="isCheckUser" class="bottom-btn certificate-bottom-btn">
        <Certificate
          type="multiBtn"
          btn-class="btn full small type02"
          :btn-text="$t('CM_Certi')"
          :user-number="form.userNumber"
          @on-success="onCertSuccess"
          @on-fail="onCertFail"/>
      </div>
    </div>
  </q-form>

</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import validate from '@/utils/validate'
import memberService from '@/http/services/member'
import { sessionDataManager, MIGRATE_INFO } from '@utils/dataManager'
import { useRouter } from 'vue-router'

const emit = defineEmits(['handleMoveStep', 'updateResetInfo'])
const { proxy } = getCurrentInstance()
const router = useRouter()
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
  if (data.migrateUserYn && !data.migrateCompleteYn) {
    proxy.$alert(proxy.$t('SIG_ReferrerMigrate'), {
      title: proxy.$t('SIG_MigrateTitle'),
      okLabel: proxy.$t('SIG_MigrateOkButton'),
      ok: function () {
        goMigrate(data)
      }
    })
    return
  } else {
    emit('handleMoveStep', 'resetPasswordRes')
    emit('updateResetInfo', {
      userId: userData.value.userId,
      code: userData.value.code,
      token: userData.value.token,
      userConnectingInformationTempId: data.userConnectingInformationTempId
    })
  }
}

/**
 * 전환 페이지로 이동
 */
const goMigrate = async (data) => {
  const userNumber = data.userNumber
  const result = await memberService.postNonPasswordMigrateInfo(userNumber)
  if (result) {
    const migrateInfo = {
      userNumber: userNumber,
      userType: result.data.userType.code,
      referralUserNumber: result.data.referralUserNumber,
      referralName: result.data.referralName,
      referralRegionCode: result.data.regionCode.text,
      referralBranch: result.data.branch,
      draftMigrateUserYn: result.data.draftMigrateUserYn,
      userConnectingInformationTempId: data.userConnectingInformationTempId,
      mobileNumber: data.mobileNumber,
      birthDate: data.birthDate,
      userName: data.userName,
      foreign: data.foreign

    }
    sessionDataManager.set(MIGRATE_INFO, JSON.stringify(migrateInfo))
    router.push({ name: 'MigrateMain' })
  }
}
</script>
