<!--
  계정 찾기 > 계정 찾기 완료
  create by jhchoi
-->
<template>
  <div class="max-width-wrap signup-wrap pb144">
    <div v-if="isMigrate" class="signup-detail-title-area">
      <h4 class="animate__fadeInUp">{{ $t('USR_MigrateTitle',{name:userName}) }}</h4>
      <p class="animate__fadeInUp animate__delay-2s">
        {{ $t('USR_CompleteSubTitle1') }}<br/>
        {{ $t('USR_CompleteSubTitle2') }}<br/><br/>
        {{ $t('USR_CompleteSubTitle3') }}
      </p>
    </div>
    <div v-else class="signup-detail-title-area">
      <h4 class="animate__fadeInUp">{{ $t('USR_CompleteTitle') }}</h4>
      <p class="animate__fadeInUp animate__delay-2s">{{ $t('USR_CompleteSubTitle') }}</p>
    </div>

    <div class="member-num-copy-area justify-between w-full">
      <div>
        <span class="member-num-title">{{ $t('CM_UserNumber') }}</span>
        <span class="member-num-text">{{ userNumber }}</span>
      </div>
      <RButton label="" class="copy-btn" @click="copyClipboard(userNumber)">
        <template #content>
          <i class="ico copy"></i>
        </template>
      </RButton>

    </div>

    <div class="bottom-btn">
      <RButton class="btn full small type02" :label="$t('USR_GoLogin')" @on-click="$router.push('/login')"/>
      <div class="login-move-btn-area pb0 pt22">
        <span>{{ $t('USR_MoveResetPw') }}</span>
        <b v-if="isMigrate" class="ml8" @click="goMigrate">{{ $t('NAV_ResetPassword') }}</b>
        <b v-else class="ml8" @click="$router.push('/resetPassword')">{{ $t('NAV_ResetPassword') }}</b>
      </div>
    </div>

  </div>
</template>

<script setup>
import { copyClipboard } from '@/utils/common'
import memberService from '@/http/services/member'
import { sessionDataManager, MIGRATE_INFO } from '@utils/dataManager'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  userNumber: {
    type: String,
    default: ''
  },
  userName: {
    type: String,
    default: ''
  },
  isMigrate: {
    type: Boolean,
    default: false
  }
})

/**
 * 전환 페이지로 이동
 */
const goMigrate = async () => {
  const result = await memberService.postNonPasswordMigrateInfo(props.userNumber)
  if (result) {
    const migrateInfo = {
      userNumber: props.userNumber,
      userType: result.data.userType.code,
      referralUserNumber: result.data.referralUserNumber,
      referralName: result.data.referralName,
      referralRegionCode: result.data.regionCode.text,
      referralBranch: result.data.branch,
      draftMigrateUserYn: result.data.draftMigrateUserYn
    }
    sessionDataManager.set(MIGRATE_INFO, JSON.stringify(migrateInfo))
    router.push({ name: 'MigrateMain' })
  }
}
</script>
