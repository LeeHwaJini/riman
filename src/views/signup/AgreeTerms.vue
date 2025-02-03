<!--
  회원가입 > 약관 동의
-->
<template>
  <div class="max-width-wrap signup-wrap pb144">
    <div class="signup-detail-title-area">
      <h4 class="animate__fadeInUp" v-html="$t('SIG_TermTitle')" />
    </div>

    <div class="step-area">
      <RStep :step="step" :total-step="totalStep" />
    </div>

    <div class="all-checkbox-area">
      <RCheckbox v-model="allAgree" checked-icon="check_circle" unchecked-icon="check_circle" @update:model-value="onSelectAll">
        <span class="checkbox-title">{{ $t('CM_AllAgree') }}</span>
      </RCheckbox>
    </div>

    <div class="checkbox-area type01">
      <div v-for="term in terms" :key="term.termId" class="field flex no-wrap gap8">
        <RCheckbox v-model="term.checked" checked-icon="check_circle" unchecked-icon="check_circle" class="flex-shrink0" @update:model-value="isAllCheck">
          <b :class="[term.agreeYn ? '' : 'gray03-color']">{{ term.agreeYn ? $t('CM_Essential') : $t('CM_Optional') }}</b>
        </RCheckbox>
        <div>
          <span :class="[term.agreeYn ? 'required' : '']" class="checkbox-title">{{ term.termsName }}</span>
          <span class="font-12 gray04-color medium text-underline type02 ml4" @click="onOpenTermsModal(term)">{{ $t('CM_View') }}</span>
        </div>
      </div>
      <!-- '마케팅 개인정보 수집 이용 동의서 보기'일 경우 추가 필요 -->
      <div class="font-12 gray04-color ml32 mt8">{{ $t('SIG_MarketingTerm') }}</div>
    </div>

    <template v-if="isPlanner()">
      <div class="all-checkbox-area mt24">
        <RCheckbox v-model="precautions" checked-icon="check_circle" unchecked-icon="check_circle">
          <span class="checkbox-title">{{ $t('SIG_AllPrecautions') }}</span>
        </RCheckbox>
      </div>

      <div class="checkbox-area type01">
        <div class="field">
          <RCheckbox v-model="precautionsItem1" checked-icon="check_circle" unchecked-icon="check_circle" class="align-start">
            <span class="font-14 medium agree-checked-text">{{ $t('SIG_Checked') }}</span>
            <div class="font-12 gray07-color">
              {{ $t('SIG_Precautions1') }}
            </div>
          </RCheckbox>
        </div>
        <div class="field">
          <RCheckbox v-model="precautionsItem2" checked-icon="check_circle" unchecked-icon="check_circle" class="align-start">
            <span class="font-14 medium agree-checked-text">{{ $t('SIG_Checked') }}</span>
            <div class="font-12 gray07-color">
              {{ $t('SIG_Precautions2') }}
            </div>
          </RCheckbox>
        </div>
      </div>
    </template>

    <div class="bottom-btn">
      <div class="flex-btn-area">
        <RButton class="btn full small type02" :label="$t('SIG_Complete')" :disable="!checkAgree()" @on-click="onClickSignupBtn"/>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import memberService from '@/http/services/member'
import etcService from '@/http/services/etc'
import { sessionDataManager, SIGNUP_SERVICE_TYPE, SIGNUP_USER_TYPE, SIGNUP_CERTI_INFO, SIGNUP_SNS_DATA, SIGNUP_USER_INFO,
  SIGNUP_REFERRER_NUMBER, SIGNUP_COMPLETE, SIGNUP_CURRENT_STEP, SIGNUP_REFERRER_BRANCH_ID } from '@utils/dataManager'
import { ROLES_BE } from '@utils/constant'

const router = useRouter()
const { proxy } = getCurrentInstance()

const totalStep = ref(3)
const step = ref(3)
const allAgree = ref(false)

const precautionsItem1 = ref(false)
const precautionsItem2 = ref(false)
const precautions = computed({
  get() {
    return precautionsItem1.value && precautionsItem2.value
  },
  set(newValue) {
    precautionsItem1.value = newValue
    precautionsItem2.value = newValue
  }
})

const terms = ref([])
const userType = sessionDataManager.get(SIGNUP_USER_TYPE)
const isPlanner = () => {
  return userType === ROLES_BE.planner
}

const currentStep = ['/signup/selectType', '/signup/selectReferrer', '/signup/enterInformation', '/signup/agreeTerms']
const nextPage = '/signup/complete'

const onSelectAll = (e) => {
  terms.value?.map((term) => {
    term.checked = e
  })
}

const isAllCheck = () => {
  allAgree.value = terms?.value.every((el) => el.checked)
}

onMounted(() => {
  sessionDataManager.set(SIGNUP_CURRENT_STEP, JSON.stringify(currentStep))

  getTermList()
})

/**
 * 약관목록 API 조회
 */
const getTermList = async () => {
  const certiInfo = JSON.parse(sessionDataManager.get(SIGNUP_CERTI_INFO))
  const paramUserType = certiInfo.foreign && isPlanner() ? 'SOLE_PROPRIETORSHIP_FOREIGN' : userType

  const params = {
    type: paramUserType
  }
  const result = await etcService.getSignupTerms(params)
  if (result.code === '2000') {
    result.data.forEach((t) => {
      terms.value.push(
        {
          checked: false,
          agreeYn: t.termsAgreeYn,
          termsName: t.termsName,
          termsId: t.termsId,
          contents: t.termsContents,
          termsTypeCode: t.termsType.code,
          termVersion: t.version
        }
      )
    })
  }
}

/**
 * 약관 파라미터
 */
const handleDataAgreeTerm = () => {
  const newData = []
  terms.value?.map((item) => {
    newData.push({
      termId: item?.termsId,
      termType: item?.termsTypeCode,
      termVersion: item?.termVersion,
      agree: item?.checked
    })
  })
  return newData
}

/**
 * 필수 약관 체크 여부 확인
 */
const checkAgree = () => {
  if (isPlanner()) {
    return terms?.value.every((el) => el.agreeYn ? el.checked : true) && precautionsItem1.value && precautionsItem2.value
  } else {
    return terms?.value.every((el) => el.agreeYn ? el.checked : true)
  }
}

/**
 * 회원가입 완료 버튼 클릭
 */
const onClickSignupBtn = async () => {
  const marketingTerms = terms?.value.filter((el) => el.termsTypeCode === 'NM_PERSONAL_INFORMATION_MARKETING')
  const isCheckedOption = marketingTerms.some((el) => el.checked)
  if (!isCheckedOption) {
    proxy.$confirm(proxy.$t('SIG_ConfAgreeMarketing'),
      {
        title: '',
        okLabel: proxy.$t('SIG_Agree'),
        cancelLabel: proxy.$t('SIG_NextTime'),
        ok: () => {
          marketingTerms.map((item) => {
            item.checked = true
          })
          completeSignup()
        },
        cancel: () => {
          completeSignup()
        }
      })
  } else {
    completeSignup()
  }
}

/**
 * 회원가입 완료 API 호출
 */
const completeSignup = async () => {
  const serviceType = sessionDataManager.get(SIGNUP_SERVICE_TYPE)
  const referrerNumber = sessionDataManager.get(SIGNUP_REFERRER_NUMBER)
  const userInfo = JSON.parse(sessionDataManager.get(SIGNUP_USER_INFO))
  const certiInfo = JSON.parse(sessionDataManager.get(SIGNUP_CERTI_INFO))
  const snsData = JSON.parse(sessionDataManager.get(SIGNUP_SNS_DATA))
  const referrerBranchId = sessionDataManager.get(SIGNUP_REFERRER_BRANCH_ID)

  const param = {
    'agreements': handleDataAgreeTerm(),

    'userType': userType,
    'globalRefererUserNumber': referrerNumber,
    'serviceType': serviceType,
    'tokenSocial': snsData && snsData.id || null,

    'lastName': userInfo.lastName,
    'firstName': userInfo.firstName,
    'nickName': userInfo.nickName,
    'email': userInfo.email,
    'userPassword': userInfo.password,

    'phoneNumber': certiInfo.mobileNumber ? certiInfo.mobileNumber : userInfo.mobileNumber,
    'gender': certiInfo.gender,
    'birthDate': certiInfo.birthDate,
    'userConnectingInformationTempId': certiInfo.userConnectingInformationTempId,
    'branchId': referrerBranchId
  }

  let plannerParam = {}
  if (isPlanner()) {
    plannerParam = {
      'plannerRegisterRequest': {
        'shipping': {
          'lastName': userInfo.lastName,
          'firstName': userInfo.firstName,
          'phoneNumber': certiInfo.mobileNumber ? certiInfo.mobileNumber : userInfo.mobileNumber,
          'address1': userInfo.address.address1,
          'address2': userInfo.address.address2,
          'zipcode': userInfo.address.zipcode,
          'defaultValue': true
        },
        'isForeign': certiInfo.foreign,
        'personalId': userInfo.foreignerRegNumberFront,
        'country': userInfo.country,
        'visa': userInfo.stayCode,
        'foreignerRegCardFrontUrl': userInfo.foreignerRegCardFrontUrl,
        'foreignerRegCardFrontFileName': userInfo.foreignerRegCardFrontFileName,
        'foreignerRegCardBackUrl': userInfo.foreignerRegCardBackUrl,
        'foreignerRegCardBackFileName': userInfo.foreignerRegCardBackFileName,
        'bankbookUrl': userInfo.bankbookUrl,
        'bankbookFileName': userInfo.bankbookFileName,
        'isPlannerNoteOnline': true
      }
    }
  }

  const params = Object.assign({}, param, plannerParam)
  const result = await memberService.postRegister(params)
  if (result && result.code === '2000') {
    sessionDataManager.set(SIGNUP_COMPLETE, JSON.stringify(result.data))
    sessionDataManager.set(SIGNUP_CURRENT_STEP, JSON.stringify([...currentStep, nextPage]))
    router.push({ name: 'SignupComplete' })
  }
}

/**
 * 약관 상세 보기
 * @param {*} content
 */
const onOpenTermsModal = (term) => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: 'TermsModal', // 필수
      componentProps: {
        title: term.termsName,
        content: term.contents
      },
      modeless: false // 선택
    })
}
</script>
