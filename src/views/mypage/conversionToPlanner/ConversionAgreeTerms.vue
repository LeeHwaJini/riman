<!--
    마이페이지 > 플래너 전환 > 약관동의
  create by jhchoi
-->
<template>
  <div class="max-width-wrap signup-wrap pb144">
    <div class="signup-detail-title-area">
      <h4 class="animate__fadeInUp" v-html="$t('MCC_AgreeSubTitle')" />
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
      <div v-for="term in terms" :key="term.termId" class="field flex no-wrap gap8 align-start">
        <RCheckbox v-model="term.checked" checked-icon="check_circle" unchecked-icon="check_circle" class="flex-shrink0" @update:model-value="isAllCheck">
          <b :class="[term.agreeYn ? '' : 'gray03-color']">{{ term.agreeYn ? $t('CM_Essential') : $t('CM_Optional') }}</b>
        </RCheckbox>
        <div>
          <span :class="[term.agreeYn ? 'required' : '']" class="checkbox-title">{{ term.termsName }}</span>
          <span class="font-12 gray04-color medium text-underline type02 ml4" @click="onOpenTermsModal(term)">{{ $t('CM_View') }}</span>
        </div>
      </div>

    </div>

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

    <div class="bottom-btn">
      <RButton class="btn full small type02" label="전환 신청하기" :disable="!checkAgree()" @on-click="onClickConversionBtn" />
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store/mainStore'
import { sessionDataManager, CONVERSION_CURRENT_STEP, CONVERSION_CERTI_INFO, CONVERSION_USER_INFO } from '@utils/dataManager'
import mypageService from '@/http/services/mypage'
import { ROLES_BE } from '@utils/constant'

const certiInfo = JSON.parse(sessionDataManager.get(CONVERSION_CERTI_INFO))

const router = useRouter()
const { proxy } = getCurrentInstance()

const mainStore = useMainStore()
const userInfo = mainStore.getUser
const totalStep = ref(2)
const step = ref(2)
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

const currentStep = ['/mypage/conversionToPlanner/certificate', '/mypage/conversionToPlanner/enterInformation', '/mypage/conversionToPlanner/agreeTerms']
const nextPage = '/mypage/conversionToPlanner/complete'

const onSelectAll = (e) => {
  terms.value?.map((term) => {
    term.checked = e
  })
}

const isAllCheck = () => {
  allAgree.value = terms?.value.every((el) => el.checked)
}

const pageState = {
  lastName: '',
  firstName: '',
  mobileNumber: ''
}

onMounted(() => {
  sessionDataManager.set(CONVERSION_CURRENT_STEP, JSON.stringify(currentStep))

  getUserInfo()
  getTermList()
})

/**
 * 사용자 정보 조회
 */
const getUserInfo = async () => {
  const result = await mypageService.getUserInfo(userInfo.userSeqNo)
  if (result && result.message === 'success') {
    pageState.lastName = result.data.lastName
    pageState.firstName = result.data.firstName
    pageState.mobileNumber = result.data.mobileNumber
  }
}

/**
 * 약관목록 API 조회
 */
const terms = ref([])
const getTermList = async () => {
  const paramUserType = certiInfo.foreign ? 'BEAUTY_CONSUMER_FOREIGN' : ROLES_BE.consumer

  const params = {
    type: paramUserType,
    page: 'BUSINESS_MEMBER_CONVERSION'
  }
  const result = await mypageService.getExchangeTerms(params)
  if (result && result.code === '2000') {
    result.data.forEach((t) => {
      terms.value.push(
        {
          checked: false,
          agreeYn: t.termsAgreeYn,
          termsName: t.termsName,
          termsId: t.termsId,
          contents: t.termsContents,
          termsTypeCode: t.termsType.code,
          termsVersion: t.termsVersion
        }
      )
    })
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

/**
 * 필수 약관 체크 여부 확인
 */
const checkAgree = () => {
  return terms?.value.every((el) => el.agreeYn ? el.checked : true) && precautionsItem1.value && precautionsItem2.value
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
      termVersion: item?.termsVersion,
      agree: item?.checked
    })
  })
  return newData
}

/**
 * 회원가입 완료 API 호출
 */
const onClickConversionBtn = async () => {
  const enterInfo = JSON.parse(sessionDataManager.get(CONVERSION_USER_INFO))

  const params = {
    'userId': userInfo.userSeqNo,
    'isForeign': certiInfo.foreign,
    'country': enterInfo.country,
    'visa': enterInfo.stayCode,
    'nickName': enterInfo.nickName,
    'personalId': enterInfo.foreignerRegNumberFront,
    'bankbookUrl': enterInfo.bankbookUrl,
    'bankbookFileName': enterInfo.bankbookFileName,
    'foreignerRegCardFrontUrl': enterInfo.foreignerRegCardFrontUrl,
    'foreignerRegCardFrontFileName': enterInfo.foreignerRegCardFrontFileName,
    'foreignerRegCardBackUrl': enterInfo.foreignerRegCardBackUrl,
    'foreignerRegCardBackFileName': enterInfo.foreignerRegCardBackFileName,
    'agreements': handleDataAgreeTerm(),
    'shipping': {
      'lastName': pageState.lastName,
      'firstName': pageState.firstName,
      'phoneNumber': certiInfo.mobileNumber ? certiInfo.mobileNumber : pageState.mobileNumber,
      'address1': enterInfo.address.address1,
      'address2': enterInfo.address.address2,
      'zipcode': enterInfo.address.zipcode,
      'defaultValue': true
    },
    'isPlannerNoteOnline': true
  }
  const result = await mypageService.postExchangeRequest(params)
  if (result && result.code === '2000') {
    sessionDataManager.set(CONVERSION_CURRENT_STEP, JSON.stringify([...currentStep, nextPage]))
    router.push({ name: 'ConversionComplete' })
  }
}
</script>
