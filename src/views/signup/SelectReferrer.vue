<!--
  회원가입 > 추천인 선택 (Step1)
-->
<template>
  <div class="max-width-wrap signup-wrap">
    <div class="signup-detail-title-area">
      <h4 class="animate__fadeInUp" v-html="$t('SIG_Referrer')" />
      <p class="animate__fadeInUp animate__delay-2s">{{ $t('SIG_ReferrerDesc1') }}<br>{{ $t('SIG_ReferrerDesc2') }}</p>
    </div>

    <div class="step-area">
      <RStep :step="step" :total-step="totalStep" />
    </div>

    <div class="input-btn-area">
      <RInput
        v-model.trim="referrerNumber"
        type="number"
        :placeholder="$t('SIG_ReferrerPlaceholder')"
        :error="isError"
        :error-message="$t(errorMsg)"
        class="login-input login-input--id"
        @keydown.enter.prevent="onSearchButton"
      />
      <RButton class="btn type01 w-small small" :label="$t('CM_Search')" @on-click="onSearchButton"/>
    </div>

    <span class="font-12 input-detail-text mt4">{{ $t('SIG_ReferrerDetail') }}</span>
    <br>
    <span class="font-12 primary05-color">{{ $t('SIG_ReferrerNoti') }}</span>

    <template v-if="reffererInfo.userNumber !== ''">
      <div class="recomm-info-area">
        <div>
          <span class="gray-text">{{ reffererInfo.nation }}</span>
          <span class="navy-text">{{ reffererInfo.userNumber }}</span>
        </div>

        <span class="gray-text">{{ reffererInfo.lastName }} {{ reffererInfo.firstName }}</span>

        <div v-if="!!reffererInfo.branchName" class="mt4 mb0">
          <span class="gray-text font-12">{{ $t('SIG_ReferrerBranch') }}</span>
          <span class="navy-text font-12">{{ reffererInfo.branchName }}</span>
        </div>
      </div>
      <div class="bottom-btn certificate-bottom-btn">
        <Certificate
          type="multiBtn"
          btn-class="btn full small type02"
          :btn-text="$t('CM_Certi')"
          @on-success="onCertSuccess"
          @on-fail="onCertFail"/>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import validate from '@utils/validate'
import { reactive } from 'vue'
import memberService from '@/http/services/member'
import { sessionDataManager, SIGNUP_USER_TYPE, SIGNUP_CURRENT_STEP, SIGNUP_REFERRER_NUMBER, SIGNUP_CERTI_INFO, SIGNUP_REFERRER_CODE, MIGRATE_INFO, SIGNUP_REFERRER_BRANCH_ID } from '@utils/dataManager'
import { isOldEnough } from '@/utils/common'
import { ROLES_BE } from '@utils/constant'

const { proxy } = getCurrentInstance()
const router = useRouter()
const totalStep = ref(3)
const step = ref(1)

const referrerNumber = ref('')
const isError = ref(false)
const errorMsg = ref('')
const reffererInfo = reactive({
  nation: '',
  firstName: '',
  lastName: '',
  userNumber: '',
  branchName: '',
  branchId: ''
})

const currentStep = ['/signup/selectType', '/signup/selectReferrer']
const nextPage = '/signup/enterInformation'

onMounted(() => {
  setReferrerCode()
  sessionDataManager.set(SIGNUP_CURRENT_STEP, JSON.stringify(currentStep))
})

const setReferrerCode = () => {
  // 간편 회원가인 링크 가입
  const refferCode = sessionDataManager.get(SIGNUP_REFERRER_CODE)

  // 뒤로가기 페이지 이동 시, 이전 입력 사항 출력
  const prevReferrerCode = sessionDataManager.get(SIGNUP_REFERRER_NUMBER)

  const referrerVal = refferCode || prevReferrerCode
  if (referrerVal) {
    referrerNumber.value = referrerVal
    onSearchButton()
  }
}
/**
 * 추천인 검색 버튼 클릭
 */
const onSearchButton = () => {
  if (!validate.checkLength(referrerNumber.value, 1)) {
    isError.value = true
    errorMsg.value = 'SIG_ValidReferrer'
  } else if (!validate.checkLength(referrerNumber.value, 10)) {
    isError.value = true
    errorMsg.value = 'SIG_ValidReferrerInput'
  } else {
    isError.value = false
    errorMsg.value = ''

    searchReferralNumber()
  }
}

/**
 * 추천인 API 호출
 */
const searchReferralNumber = async () => {
  const params = {
    userNumber: referrerNumber.value
  }
  const result = await memberService.getReferralNumber(params)
  if (result) {
    reffererInfo.nation = result.data.globalRefererRegionCode.text
    reffererInfo.firstName = result.data.firstName
    reffererInfo.lastName = result.data.lastName
    reffererInfo.userNumber = result.data.globalRefererUserNumber
    reffererInfo.branchName = result.data.branchName
    reffererInfo.branchId = result.data.branchId
  }
}

/**
 * 본인 인증 성공 callback
 * @param {*} data
 */
const onCertSuccess = async (data) => {
  const userType = sessionDataManager.get(SIGNUP_USER_TYPE)
  const isPlanner = userType === ROLES_BE.planner
  const enoughAge = isPlanner ? 19 : 14
  if (data.migrateUserYn && !data.migrateCompleteYn) {
    proxy.$alert(proxy.$t('SIG_ReferrerMigrate'), {
      title: proxy.$t('SIG_MigrateTitle'),
      okLabel: proxy.$t('SIG_MigrateOkButton'),
      ok: function () {
        goMigrate(data)
      }
    })
    return
  } else if (data.existence) {
    proxy.$confirm(proxy.$t('SIG_ConfDuplicate'), {
      title: proxy.$t('SIG_ConfDuplicateTitle'),
      okLabel: proxy.$t('NAV_FindAccount'),
      ok: () => {
        router.push({ path: '/findAccount' })
      }
    })
    return
  } else if (!await isOldEnough(data.birthDate, enoughAge)) {
    proxy.$alert('', {
      title: proxy.$t('UTI_EnoughAge', { age: enoughAge })
    })
    return
  }
  goNext(data)
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

/**
 * 다음 단계 이동
 * @param {*} data
 */
const goNext = (data) => {
  sessionDataManager.set(SIGNUP_REFERRER_NUMBER, reffererInfo.userNumber)
  sessionDataManager.set(SIGNUP_REFERRER_BRANCH_ID, reffererInfo.branchId)
  sessionDataManager.set(SIGNUP_CERTI_INFO, JSON.stringify(data))

  sessionDataManager.set(SIGNUP_CURRENT_STEP, JSON.stringify([...currentStep, nextPage]))
  router.push({ name: 'EnterInformation' })
}

// 본인인증 실패 후 후처리 함수
const onCertFail = () => {
  console.log('onCertFail')
}
</script>
