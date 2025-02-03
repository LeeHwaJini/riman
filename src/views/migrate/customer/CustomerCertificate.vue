<!--
  NM 전환 > 커스터머 본인 인증
  create by jhchoi
-->

<template>
  <div class="max-width-wrap signup-wrap pb144">
    <div class="signup-detail-title-area">
      <h4 class="">
        <b>{{ $t('MIG_CertTitle1') }}<br/>
          {{ $t('MIG_CertTitle2') }}</b>
        <br/>
        {{ $t('MIG_CertTitle3') }}<br/>
        {{ $t('MIG_CertTitle4') }}
      </h4>
      <p class="gray07-color font-14">
        {{ $t('MIG_CertDesc1') }}<br/>
        {{ $t('MIG_CertDesc2') }}<br/>
        {{ $t('MIG_CertDesc3') }}<br/>
        {{ $t('MIG_CertDesc4') }}&nbsp;&nbsp;{{ $t('MIG_CertDesc5') }}
        <br/><br/>
        {{ $t('MIG_CertDesc6') }}
      </p>
    </div>

    <div class="all-checkbox-area border-none bottom-fixed-checkbox-area">
      <RCheckbox v-model="agree" checked-icon="check_circle" unchecked-icon="check_circle" class="flex-shrink0" @update:model-value="onChangeAgree">
        <div class="checkbox-title">{{ $t('CM_Agree') }}.</div>
      </RCheckbox>
      <div class="ml40 font-12 gray04-color">{{ $t('MIG_AgreeDesc') }}</div>
    </div>

    <div v-if="agree" class="bottom-btn certificate-bottom-btn">
      <Certificate
        type="multiBtn"
        btn-class="btn full small type02 font-16"
        :btn-text="$t('CM_Certi')"
        :user-number="migrateInfo.userNumber"
        @on-success="onCertSuccess"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sessionDataManager, MIGRATE_INFO } from '@utils/dataManager'

const emit = defineEmits(['changeStep', 'updateMigrateInfo'])
const props = defineProps({
  migrateInfo: {
    type: Object,
    default: null
  }
})
const agree = ref(false)

/**
 * 본인인증 성공 시, callback
 */
const onCertSuccess = (data) => {
  emit('changeStep', 'customerEnterInformation')
  emit('updateMigrateInfo', data)
}

/**
 * 전환자가 신규회원가입 시도시 (본인인증 완료)
 */
const onChangeAgree = () => {
  const sessionMigrate = JSON.parse(sessionDataManager.get(MIGRATE_INFO))
  if (sessionMigrate.userConnectingInformationTempId) {
    const data = {
      userConnectingInformationTempId: sessionMigrate.userConnectingInformationTempId,
      mobileNumber: sessionMigrate.mobileNumber,
      birthDate: sessionMigrate.birthDate,
      userName: sessionMigrate.userName,
      foreign: sessionMigrate.foreign
    }
    onCertSuccess(data)
  }
}
</script>
