<!--
  마이페이지 > 내 정보 관리(개인정보 수정)
  create by jhchoi
-->
<template>
  <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmit">
    <div class="max-width-wrap full-width-wrap pb144">
      <div class="main-title-area">
        <h3 class="">{{ $t('MY_ManageUserInfo') }}</h3>
      </div>

      <RTabs
        v-model="tabValue"
        :tab-list="tabList"
        class="tab type02"
        @update:model-value="onChangeTab"
      />
      <div class="plr16 mt24">
        <dl class="order-info-list-area left-g-rignt-b-list dd-font16">
          <dt>{{ $t('CM_FirstName') }}</dt>
          <dd>{{ pageState.fullName }}</dd>

          <dt>{{ $t('CM_BirthDate') }}</dt>
          <dd>{{ formatDate(pageState.birthDate,'YYYY.MM.DD') }}</dd>

          <dt>{{ $t('CM_UserNumber') }}</dt>
          <dd>{{ userInfo.userNumber }}</dd>

          <dt>{{ $t('SIG_ReferrerBranch') }}</dt>
          <dd>{{ pageState.branchName }}</dd>

        </dl>

        <div class="form-area type01">
          <div class="field">
            <span class="input-title">{{ $t('CM_MobileNumber') }}</span>
            <RInput ref="" v-model="pageState.mobileNumber" type="number" :placeholder="$t('ALT_InputMobile')" :rules="[validate.isValidPhoneNumber]" class="login-input login-input--id"/>
          </div>
          <template v-if="isPlanner">
            <div class="field" >
              <dl class="order-info-list-area left-g-rignt-b-list">
                <dt>{{ $t('CM_NickName') }}</dt>
                <dd class="font-16 medium">{{ pageState.nickName }}</dd>
              </dl>
            </div>

            <div v-if="!pageState.nickName" class="field">
              <div class="input-btn-area">
                <RInput
                  ref="nickName"
                  v-model="pageState.inpNickName"
                  :hint="pageState.inpNickName?$t('SIG_HintNickName'):''"
                  :placeholder="$t('SIG_OnlyEnNumber')"
                  :rules="[ isValidNickName ]"
                  class="login-input login-input--id"
                  @update:model-value="onInputNickName"
                />
                <RButton class="btn  small type01 plr24 mt0" :label="pageState.isDupNickName? $t('SIG_DupComplete') : $t('SIG_DupCheck')" :disable="pageState.isDupNickName" @click="checkNickName"/>
              </div>
            </div>
          </template>

          <div class="field">
            <dl class="order-info-list-area left-g-rignt-b-list">
              <dt>{{ $t('CM_Email') }}</dt>
              <dd class="font-16 medium">{{ pageState.email }}</dd>
            </dl>
          </div>

          <div class="field">
            <div class="input-btn-area">
              <RInput
                ref="email"
                v-model="pageState.inpEmail"
                :hint="pageState.isDupEmail?$t('SIG_HintEmail'):''"
                placeholder="abcd@abcd.com"
                :rules="[ isValidEmail ]"
                class="login-input login-input--id"
                @update:model-value="onInputEmail"
              />
              <RButton class="btn  small type01 plr24 mt0" :label="pageState.isDupEmail?$t('SIG_DupComplete') : $t('SIG_DupCheck')" :disable="pageState.isDupEmail" @click="checkEmail"/>
            </div>
          </div>

          <div class="field">
            <span class="input-title gray05-color">{{ $t('CM_ReferrerInfo') }}</span>
            <div class="recomm-info-area">
              <div>
                <span class="gray-text">{{ pageState.recommenderRegion }}</span>
                <span class="navy-text">{{ pageState.recommenderNumber }}</span>
              </div>
              <span class="gray-text">{{ pageState.recommenderName }}</span>

              <div v-if="!!pageState.recommenderBranchName" class="mt4 mb0">
                <span class="gray-text font-12">{{ $t('SIG_ReferrerBranch') }}</span>
                <span class="navy-text font-12">{{ pageState.recommenderBranchName }}</span>
              </div>
            </div>
          </div>

          <div class="field">
            <!-- 플래너일 경우 노축 -->
            <div v-if="isPlanner" class="field flex align-center justify-between ptb8 mb8">
              <div class="font-14 gray07-color">{{ $t('MUI_IsAllowancePayment') }}</div>
              <span v-if="pageState.isAllowancePayment" class="mypage-icon primary05-color pointer" @click="router.push('/myPage/allowanceInfo')">
                {{ $t('ALI_Status1') }}
              </span>
              <span v-else class="mypage-icon success04-color pointer" @click="router.push('/myPage/allowanceInfo')">
                {{ $t('MUI_NotAllowancePayment') }}
              </span>

              <!-- 2024.12.12 상태별 수당지급여부 태그
              <span class="mypage-icon error-color">수당지급 불가</span>
              <span class="mypage-icon success04-color">수당정보 입력하기</span>
              <span class="mypage-icon primary05-color">수당지급 가능</span>
              -->
            </div>
            <!-- //플래너일 경우 노축 -->
            <div class="flex align-center justify-between ptb8 mb24">
              <div class="font-14 gray07-color">
                {{ pageState.terms.termsName }}
                <span class="font-12 gray04-color text-underline type02 pointer" @click="onOpenTermsModal(pageState.terms)">
                  {{ $t('CM_View') }}
                </span>
              </div>
              <RSwitch
                v-model="pageState.termsAgree"
                class="switch type01 small"
              />
            </div>
          </div>
        </div>
      </div>

      <ul class="mt32 top-gray-line-list">
        <li v-if="!isPlanner" @click="router.push({name:'ConversionCertificate'})">
          <div>{{ $t('NAV_ConvertToPlanner') }}</div>
          <i class="ico arrow-right-light-g"></i>
        </li>
        <li @click="router.push({name:'ChangePassword'})">
          <div>{{ $t('MUI_ChangePassword') }}</div>
          <i class="ico arrow-right-light-g"></i>
        </li>
        <li>
          <RButton class="btn type13" :label="$t('MUI_WithdrawlMember')" @on-click="onConfirmWithdrawl" />
        </li>
      </ul>
      <div class="bottom-btn">
        <RButton class="btn full small type02" :label="$t('CM_Saving')" type="submit" />
      </div>

    </div>
  </q-form>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive, computed } from 'vue'
import { useMainStore } from '@store/mainStore'
import { formatDate } from '@utils/dateFormat'
import format from '@/utils/format'
import { useRouter } from 'vue-router'
import validate from '@utils/validate'
import memberService from '@/http/services/member'
import mypageService from '@/http/services/mypage'
import { checkPlanner } from '@/utils/common'
import etcService from '@/http/services/etc'
import WithdrawalConfirmModal from '@/views/mypage/modal/WithdrawalConfirmModal'

const { proxy } = getCurrentInstance()
const router = useRouter()
const agree = ref()

const mainStore = useMainStore()
const userInfo = mainStore.getUser
const isPlanner = computed(() => checkPlanner())
/**
 * 탭 정보
 */
const tabValue = ref('UserInfo')
const tabList = computed(() => [
  { label: proxy.$t('NAV_ModUserInfo'), name: 'UserInfo' },
  { label: proxy.$t('NAV_Sns'), name: 'Sns' },
  { label: proxy.$t('NAV_RefundAccount'), name: 'RefundAccount' }
])

/**
 * 탭 변경
 */
const onChangeTab = () => {
  router.push({ name: tabValue.value })
}

const pageState = reactive({
  mobileNumber: '',
  birthDate: '',

  /* 닉네임 */
  nickName: '',
  inpNickName: '',
  isDupNickName: false,
  isCheckNickName: false,

  /* 이메일 */
  email: '',
  inpEmail: '',
  isDupEmail: false,
  isCheckEmail: false,

  refererCode: '',
  recommenderNumber: '',
  recommenderName: '',
  recommenderRegion: '',
  branchName: '',
  recommenderBranchName: '',

  isAllowancePayment: false,

  terms: {},
  isForeign: false,
  termsAgree: false,

  fullName: ''
})

onMounted(() => {
  getUserInfo()
  getMarketingTerms()
})

/**
 * 사용자 정보 조회
 */
const getUserInfo = async () => {
  const result = await mypageService.getUserInfo(userInfo.userSeqNo)
  if (result && result.message === 'success') {
    pageState.fullName = proxy.$nameFormat(result.data.lastName, result.data.firstName)
    pageState.mobileNumber = result.data.mobileNumber
    pageState.birthDate = result.data.birthDate
    pageState.email = result.data.email
    pageState.recommenderNumber = result.data.recommenderNumber
    pageState.recommenderName = result.data.recommenderName
    pageState.nickName = result.data?.nickName
    pageState.recommenderRegion = result.data?.recommenderRegionCode?.text
    pageState.isAllowancePayment = result.data?.isAllowancePayment
    pageState.isForeign = result.data?.isForeign
    pageState.branchName = result.data?.branchName || ''
    pageState.recommenderBranchName = result.data?.recommenderBranchName || ''
  }
}

/**
 * 회원 유형 별 마케팅 동의 약관 ID 조회
 */
const getMarketingTerms = async () => {
  const paramUserType = pageState.isForeign && isPlanner ? 'SOLE_PROPRIETORSHIP_FOREIGN' : userInfo.userType

  const params = {
    type: paramUserType
  }
  const resultTerms = await mypageService.getUserMarketingTerms(params)
  if (resultTerms) {
    pageState.terms = {
      'termId': resultTerms.data.termsId,
      'termType': resultTerms.data.termsType.code,
      'termsVersion': resultTerms.data.termsVersion,
      'termsName': resultTerms.data.termsName,
      'termContens': resultTerms.data.termsContents
    }

    const checkAgreeParams = {
      'termId': resultTerms.data.termsId,
      'termType': resultTerms.data.termsType.code,
      'termVersion': resultTerms.data.termsVersion
    }
    const checkAgreeResult = await mypageService.postCheckAgreeTerms(userInfo.userSeqNo, checkAgreeParams)
    if (checkAgreeResult) {
      pageState.termsAgree = checkAgreeResult.data.agree
    }
  }
}

/**
 * 약관 상세 보기
 * @param {*} term
 */
const onOpenTermsModal = (term) => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: 'TermsModal', // 필수
      componentProps: {
        title: term.termsName,
        content: term.termContens
      },
      modeless: false // 선택
    })
}

/**
 * 닉네임 입력 시, 영문과 숫자 만 입력 허용
 */
const onInputNickName = (val) => {
  pageState.isCheckNickName = false
  pageState.isDupNickName = false
  pageState.inpNickName = val.replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * 닉네임 validation check
 * @param {*} value
 */
const isValidNickName = async (value) => {
  if (value === '') {
    return true
  } else if (!await validate.isValidNickname(value)) {
    return proxy.$t('SIG_ValidLengthNickName')
  } else if (!pageState.isCheckNickName) {
    return proxy.$t('SIG_ValidCheckNickName')
  } else if (!pageState.isDupNickName) {
    return proxy.$t('SIG_ValidDupNickName')
  }
  return true
}

/**
 * 닉네임 중복 조회 API 호출
 */
const checkNickName = async () => {
  pageState.isCheckNickName = true
  if (await validate.isValidNickname(pageState.inpNickName) !== true) {
    proxy.$refs.nickName.validate()
    return
  }
  const params = {
    nickName: pageState.inpNickName,
    serviceType: 'NONE'
  }
  const result = await memberService.postFindExistNickNm(params)
  if (result) {
    pageState.isDupNickName = !(result.data && result.data.duplicate)
    proxy.$refs.nickName.validate()
  }
}

/**
 * 이메일 validation check
 */
const isValidEmail = async (value) => {
  if (value === '') {
    return true
  } else if (!validate.isValidEmail(value)) {
    return proxy.$t('SIG_ValidPatternEmail')
  } else if (!pageState.isCheckEmail) {
    return proxy.$t('SIG_ValidCheckNickName')
  } else if (!pageState.isDupEmail) {
    return proxy.$t('SIG_ValidDupEmail')
  }
  return true
}

/**
 * 이메일 입력 시 영문,숫자,@ 만 허용
 */
const onInputEmail = (val) => {
  pageState.isCheckEmail = false
  pageState.isDupEmail = false

  const allowedChars = /[^a-zA-Z0-9.@_+-]/g
  pageState.inpEmail = val.replace(allowedChars, '')
}
/**
 * 이메일 중복조회 API 호출
 */
const checkEmail = async () => {
  pageState.isCheckEmail = true
  if (!validate.isValidEmail(pageState.inpEmail)) {
    proxy.$refs.email.validate()
    return
  }
  const params = {
    email: pageState.inpEmail,
    serviceType: 'NONE'
  }
  const result = await memberService.postFindExistUser(params)
  if (result) {
    pageState.isDupEmail = !(result.data && result.data.duplicate)
    proxy.$refs.email.validate()
  }
}

/**
 * 저장하기
 */
const onSubmit = async () => {
  let params = {
    'mobileNumber': pageState.mobileNumber
  }

  if (pageState.inpEmail) {
    params = Object.assign(params, { email: pageState.inpEmail })
  }

  if (pageState.inpNickName) {
    params = Object.assign(params, { nickName: pageState.inpNickName })
  }

  const terms = {
    'agreements': [{
      'termId': pageState.terms.termId,
      'termType': pageState.terms.termType,
      'termVersion': pageState.terms.termsVersion,
      'agree': pageState.termsAgree
    }]
  }

  params = Object.assign(params, terms)

  const result = await mypageService.putUserInfo(userInfo.userSeqNo, params)
  if (result) {
    proxy.$alert(proxy.$t('ALT_EditSuccess'))
    getUserInfo()
  }
}

const onConfirmWithdrawl = () => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: WithdrawalConfirmModal, // 필수
      componentProps: {
        name: pageState.fullName
      }
    })
}
</script>

<style lang="scss" scoped>
:deep(.q-field__bottom){
  padding: 8px 0 0;
  color: #2EB8B3;
}
</style>
