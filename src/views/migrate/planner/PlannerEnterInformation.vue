<!--
  NM 전환 > 플래너 정보입력
  create by jhchoi
-->
<template>
  <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmit">
    <div class="max-width-wrap signup-wrap pb144">
      <div class="signup-detail-title-area pt64-title-area">
        <h4 class="" v-html="$t('MIG_Title')" />
        <p v-if="certInfo.isCertificate">{{ $t('CM_CertiComplete') }}</p>
      </div>

      <div v-if="!certInfo.isCertificate" class="certificate-bottom-btn form-btn">
        <Certificate
          type="multiBtn"
          btn-class="btn full small type02"
          :btn-text="$t('CM_Certi')"
          :user-number="migrateInfo.userNumber"
          @on-success="onCertSuccess"
        />
      </div>

      <template v-if="certInfo.isCertificate">
        <!-- 약관동의  -->
        <div v-if="certInfo.foreign && terms.length > 0" class="checkbox-area type01">
          <div class="signup-detail-title-area pt64-pb16-title-area">
            <h4 class="" v-html="$t('MIG_AgreeTitle')" />
          </div>
          <b class="block mb8 font-14 gray04-color">{{ $t('CM_RequiredTerms') }}</b>
          <RCheckbox v-model="terms[0].checked" checked-icon="check_circle" unchecked-icon="check_circle">
            <b class="sucess04-color">{{ $t('CM_Essential') }}</b>
            <span class="checkbox-title gray07-color">{{ terms[0].termsName }}</span>
          </RCheckbox>
          <span class="ml4 font-12 medium gray04-color text-underline type02 pointer" @click="onOpenTermsModal(terms[0])">{{ $t('CM_View') }}</span>
        </div>

        <!-- 전환자 개인정보 입력 -->
        <template v-if="migrateInfo?.draftMigrateUserYn">

          <div class="signup-detail-title-area pt48-title-area">
            <h4 v-html="$t('MIG_InfoTitle')" />
          </div>

          <div class="form-area type01">
            <div class="field">
              <span class="input-title">{{ $t('CM_ReferrerInfo') }}</span>
              <div class="recomm-info-area primary05-bg  align-center  gap8 gray07-color" style="border: none;">
                <div class="flex justify-center">
                  <div class="gray-text font-16 medium">{{ migrateInfo.referralRegionCode }}</div>
                  <div class="navy-text font-16 medium">{{ migrateInfo.referralName }}</div>
                  <div class="navy-text font-16 medium">{{ migrateInfo.referralUserNumber }}</div>
                </div>
                <div v-if="migrateInfo.referralBranch" class="flex justify-center">
                  <div class="gray-text font-12 medium">{{ $t('SIG_ReferrerBranch') }}</div>
                  <div class="navy-text font-12 medium">{{ migrateInfo.referralBranch }}</div>
                </div>
              </div>
              <span class="block font-12 mt4 error-color">{{ $t('MIG_ReferralDesc') }}</span>
            </div>

            <div v-if="isMobileCertificate " class="field">
              <div class="user-info-area">
                <dl>
                  <dt>{{ $t('CM_MobileNumber') }}</dt>
                  <dd>{{ format.mobileFormat(certInfo.mobileNumber) }}</dd>
                </dl>
                <dl>
                  <dt>{{ $t('CM_BirthDate') }}</dt>
                  <dd>{{ certInfo.birthDate && certInfo.birthDate.replace(/-/g, '.') }}</dd>
                </dl>
              </div>
            </div>

            <div class="field">
              <span class="input-title required">{{ $t('CM_LastName') }}</span>
              <RInput
                ref="lastName"
                v-model.trim="form.lastName"
                :placeholder="$t('CM_LastNamePlaceholder')"
                :rules="[val => !!val || $t('UTI_ValidName')]"
                class="login-input login-input--id"
              />
            </div>

            <div class="field">
              <span class="input-title required">{{ $t('CM_FirstName') }}</span>
              <RInput
                ref="firstName"
                v-model.trim="form.firstName"
                :placeholder="$t('CM_FirstNamePlaceholder')"
                :rules="[val => !!val || $t('UTI_ValidName')]"
                class="login-input login-input--id"
              />
              <span class="input-detail-text">{{ $t('SIG_NameDesc1') }}<br>{{ $t('SIG_NameDesc2') }}</span>
            </div>

            <div class="field">
              <div class=" input-title input-btn-area flex">
                {{ $t('CM_NickName') }}({{ $t('CM_Select') }})
                <div class="tooltip-area type01 bottom">
                  <i class="ico question" @click="$notify($t('SIG_TooltipNickName1')+'<br/>'+$t('SIG_TooltipNickName2'), $t('SIG_NickName'))"></i>
                </div>
              </div>
              <RInput
                ref="nickName"
                v-model="form.nickName"
                :hint="form.isNickName?$t('SIG_HintNickName'):''"
                :placeholder="$t('SIG_OnlyEnNumber')"
                :rules="[ isValidNickName ]"
                class="login-input login-input--id"
                @update:model-value="onInputNickName"
              />
              <RButton class="btn full small type01" :label="form.isNickName? $t('SIG_DupComplete') : $t('SIG_DupCheck')" :disable="form.isNickName" @click="checkNickName"/>
            </div>

            <div class="field">
              <span class="input-title required">{{ $t('CM_Email') }}</span>
              <RInput
                ref="email"
                v-model="form.email"
                :hint="form.isEmail?$t('SIG_HintEmail'):''"
                :placeholder="$t('SIG_InputEmail')"
                :rules="[ isValidEmail ]"
                class="login-input login-input--id"
                @update:model-value="onInputEmail"
              />
              <RButton class="btn full small type01" :label="form.isEmail?$t('SIG_DupComplete') : $t('SIG_DupCheck')" :disable="form.isEmail" @click="checkEmail"/>
            </div>

            <div v-if="!isMobileCertificate" class="field">
              <span class="input-title required">{{ $t('CM_MobileNumber') }}</span>
              <RInput v-model="form.mobileNumber" autocomplete="off" type="number" :placeholder="$t('ALT_InputMobile')" :rules="[validate.isValidPhoneNumber]" class="login-input login-input--id"/>
            </div>
          </div>
        </template>

        <!-- 비밀번호 입력 -->
        <div class="signup-detail-title-area pt48-title-area">
          <h4 class="" v-html="$t('RPW_ResTitle')" />
        </div>
        <div class="form-area type01">
          <div class="field">
            <RPasswordConfirm v-model:password="form.passwordText1" v-model:passwordConfirm="form.passwordText2" />
          </div>
        </div>

        <RButton class="btn full small type02 font-16 mt24" :label="$t('MIG_GoChangePassword')" type="submit"/>
      </template>
    </div>
  </q-form>
</template>

<script setup>
import { reactive, onMounted, ref, getCurrentInstance, computed } from 'vue'
import memberService from '@/http/services/member'
import { useRouter } from 'vue-router'
import { sessionDataManager, MIGRATE_COMPLETE, MIGRATE_INFO } from '@utils/dataManager'
import etcService from '@/http/services/etc'
import validate from '@utils/validate'
import format from '@/utils/format'

const router = useRouter()
const { proxy } = getCurrentInstance()

// 전환 회원 정보 조회
const props = defineProps({
  migrateInfo: {
    type: Object,
    default: null
  }
})

// 휴대폰 인증 정보
const certInfo = reactive({
  isCertificate: false,
  userConnectingInformationTempId: '',
  userName: '',
  birthDate: '',
  mobileNumber: ''
})

const form = reactive({
  lastName: '',
  firstName: '',
  nickName: '',
  isCheckNickName: false,
  isNickName: false,
  email: '',
  isCheckEmail: false,
  isEmail: false,
  passwordText1: '',
  passwordText2: '',
  mobileNumber: ''
})

const terms = ref([])
const TERMS_TYPE = 'SOLE_PROPRIETORSHIP_FOREIGN'
const TERMS_CODE = 'IDENTIFIER_INFO_COLLECTION_AND_USAGE_CONSENT' // 고유식별정보 수집 및 이용에 대한 동의
const isMobileCertificate = computed(() => { return !!certInfo.mobileNumber })

onMounted(() => {
  checkCert()
})

/**
 * 전환자가 신규회원가입(본인인증완료) 시도 시, 해당 페이지로 이동
 */
const checkCert = () => {
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

/**
 * 외국인 약관목록 API 조회
 */
const getTermList = async () => {
  if (!certInfo.foreign) {
    return
  }

  const params = {
    type: TERMS_TYPE
  }
  const result = await etcService.getSignupTerms(params)
  if (result.code === '2000') {
    const termsList = result.data.filter((el) => el.termsType.code === TERMS_CODE)
    termsList.forEach((t) => {
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
 * 본인인증 성공 callback
 */
const onCertSuccess = (data) => {
  certInfo.isCertificate = true
  certInfo.mobileNumber = data?.mobileNumber || ''
  certInfo.birthDate = data.birthDate
  certInfo.userName = data.userName
  certInfo.userConnectingInformationTempId = data.userConnectingInformationTempId
  certInfo.foreign = data.foreign

  splitName()
  getTermList()
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
 * 비밀번호 변경 버튼 클릭
 */
const onSubmit = async () => {
  if (!certInfo.isCertificate) {
    return false
  }

  // 약관 동의 체크
  if (certInfo.foreign && !checkAgree()) {
    proxy.$alert('MIG_AgreeTitle')
    return false
  }

  // 전환자 일 경우 - 성/이름 입력 체크
  if (props.migrateInfo?.draftMigrateUserYn && !checkFullName()) {
    proxy.$alert(proxy.$t('SIG_AltFullName'), {
      title: proxy.$t('SIG_AltTitleFullName'),
      ok: function () {
        setTimeout(() => {
          proxy.$refs.lastName.focus()
        })
      }
    })
    return false
  }

  let params = {
    'userNumber': props.migrateInfo.userNumber,
    'userPassword': form.passwordText1,
    'userConnectingInformationTempId': certInfo.userConnectingInformationTempId,
    'draftMigrateUserYn': props.migrateInfo.draftMigrateUserYn
  }

  // 외국인 일 경우, 약관 추가
  if (certInfo.foreign) {
    params = Object.assign(params, { 'agreements': handleDataAgreeTerm() })
  }

  // 휴대폰 번호
  const phoneNumber = certInfo.mobileNumber ? certInfo.mobileNumber : form.mobileNumber
  if (phoneNumber) {
    params = Object.assign(params, { 'phoneNumber': phoneNumber })
  }

  if (props.migrateInfo?.draftMigrateUserYn) {
    const draftParsmes = {
      'nickName': form.nickName,
      'firstName': form.firstName,
      'lastName': form.lastName,
      'email': form.email
    }
    params = Object.assign(params, draftParsmes)
  }
  const result = await memberService.postMigrateComplete(params)

  if (result) {
    sessionDataManager.set(MIGRATE_COMPLETE, JSON.stringify(result.userRegisterInfo))

    proxy.$alert(proxy.$t('MIG_ChangePasswordCont'), {
      title: proxy.$t('MIG_ChangePasswordTitle'),
      ok: function () {
        router.push({ name: 'MigrateComplete' })
      }
    })
  }
}

/**
 * 필수 약관 체크 여부 확인
 */
const checkAgree = () => {
  return terms?.value.every((el) => el.agreeYn ? el.checked : true)
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
 * 문자열 소문자로 변경, 공백 제거
 * @param {*} str
 */
const normalizeString = (str) => {
  return str.trim().toLowerCase().replace(/\s+/g, '')
}

/**
 * 성,이름 입력 확인
 */
const checkFullName = () => {
  if (containsEnglish(certInfo.userName)) {
    const fullName = certInfo.userName
    const englishName = fullName.replace(/[^a-zA-Z\s\-'\.]/g, '')
    return normalizeString(englishName) === normalizeString(form.lastName + form.firstName)
  }
  return certInfo.userName === form.lastName + form.firstName
}

/**
 * 문자열 영어 포함되어있는지 체크
 * @param str 문자열
 */
const containsEnglish = (str) => {
  const regex = /[a-zA-Z]/
  return regex.test(str)
}

/**
 * 성, 이름 분리
 */
const splitName = () => {
  if (containsEnglish(certInfo.userName)) {
    splitForeignName()
  } else {
    splitLocalName()
  }
}

/**
 * 외국인 > 성, 이름 분리
 */
const splitForeignName = () => {
  const fullName = certInfo.userName
  const englishName = fullName.replace(/[^a-zA-Z\s\-'\.]/g, '')
  const index = englishName.indexOf(' ')

  if (index !== -1) {
    form.lastName = englishName.substring(0, index)
    form.firstName = englishName.substring(index + 1)
  } else {
    form.lastName = englishName
    form.firstName = ''
  }
}

/**
 * 내국인 > 성, 이름 분리
 */
const splitLocalName = () => {
  const fullName = certInfo.userName
  if (fullName.length <= 3) {
    form.lastName = fullName.charAt(0)
    form.firstName = fullName.slice(1)
  } else {
    form.lastName = fullName.slice(0, 2)
    form.firstName = fullName.slice(2)
  }
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
  } else if (!form.isCheckNickName) {
    return proxy.$t('SIG_ValidCheckNickName')
  } else if (!form.isNickName) {
    return proxy.$t('SIG_ValidDupNickName')
  }
  return true
}

/**
 * 닉네임 중복 조회 API 호출
 */
const checkNickName = async () => {
  form.isCheckNickName = true
  if (await validate.isValidNickname(form.nickName) !== true) {
    proxy.$refs.nickName.validate()
    return
  }
  const params = {
    nickName: form.nickName,
    serviceType: 'NONE'
  }
  const result = await memberService.postFindExistNickNm(params)
  if (result) {
    form.isNickName = !(result.data && result.data.duplicate)
    proxy.$refs.nickName.validate()
  }
}

/**
 * 닉네임 입력 시, 영문과 숫자 만 입력 허용
 */
const onInputNickName = (val) => {
  form.isCheckNickName = false
  form.isNickName = false
  form.nickName = val.replace(/[^a-zA-Z0-9]/g, '')
}

/**
 * 이메일 validation check
 */
const isValidEmail = async (value) => {
  if (!validate.isValidEmail(value)) {
    return proxy.$t('SIG_ValidPatternEmail')
  } else if (!form.isCheckEmail) {
    return proxy.$t('SIG_ValidCheckNickName')
  } else if (!form.isEmail) {
    return proxy.$t('SIG_ValidDupEmail')
  }
  return true
}

/**
 * 이메일 입력 시 영문,숫자,@ 만 허용
 */
const onInputEmail = (val) => {
  form.isCheckEmail = false
  form.isEmail = false

  const allowedChars = /[^a-zA-Z0-9.@_+-]/g
  form.email = val.replace(allowedChars, '')
}
/**
 * 이메일 중복조회 API 호출
 */
const checkEmail = async () => {
  form.isCheckEmail = true
  if (!validate.isValidEmail(form.email)) {
    proxy.$refs.email.validate()
    return
  }
  const params = {
    email: form.email,
    serviceType: 'NONE'
  }
  const result = await memberService.postFindExistUser(params)
  if (result) {
    form.isEmail = !(result.data && result.data.duplicate)
    proxy.$refs.email.validate()
  }
}
</script>
