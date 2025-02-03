<!--
  회원가입 > 정보 입력 (step3)
-->
<template>
  <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmit">
    <div class="max-width-wrap signup-wrap pb144">
      <div class="signup-detail-title-area">
        <h4 class="animate__fadeInUp">
          <b>{{ pageState.certiInfo.userName }}</b>{{ $t('SIG_Sir') }},<br>
          <b v-if="isPlanner()">{{ $t('CM_Planner') }}({{ $t('CM_BusinessMember') }})</b>
          <b v-else>{{ $t('CM_Customer') }}</b>
          {{ $t('SIG_EnterTitle1') }}<br> {{ $t('SIG_EnterTitle2') }}
        </h4>
      </div>

      <div class="step-area">
        <RStep :step="step" :total-step="totalStep" />
      </div>

      <div v-if="isMobileCertificate" class="user-info-area">
        <dl>
          <dt>{{ $t('CM_MobileNumber') }}</dt>
          <dd>{{ format.mobileFormat(pageState.certiInfo.mobileNumber) }}</dd>
        </dl>
        <dl>
          <dt>{{ $t('CM_BirthDate') }}</dt>
          <dd>{{ pageState.certiInfo.birthDate && pageState.certiInfo.birthDate.replace(/-/g, '.') }}</dd>
        </dl>
      </div>

      <div class="form-area type01">
        <div class="field">
          <span class="input-title required">{{ $t('CM_LastName') }}</span>
          <RInput ref="lastName" v-model="form.lastName" :placeholder="$t('CM_LastNamePlaceholder')" :rules="[val => !!val || $t('UTI_ValidName')]" class="login-input login-input--id"/>
        </div>

        <div class="field">
          <span class="input-title required">{{ $t('CM_FirstName') }}</span>
          <RInput v-model="form.firstName" :placeholder="$t('CM_FirstNamePlaceholder')" :rules="[val => !!val || $t('UTI_ValidName')]" class="login-input login-input--id"/>
          <span class="input-detail-text">{{ $t('SIG_NameDesc1') }}<br>{{ $t('SIG_NameDesc2') }}</span>
        </div>

        <template v-if="isPlanner()">
          <div v-if="pageState.certiInfo.foreign" class="field">
            <span class="input-title required">{{ $t('CM_ForeignNumber') }}</span>
            <div class="input-btn-area q-field">
              <div>
                <RInput v-model="form.foreignerRegNumberFront" disable class="login-input login-input--id "/>
              </div>
              <div>
                <RInput
                  ref="foreignerId"
                  v-model="form.foreignerRegNumberBack"
                  :hint="form.isForeignerId?$t('SIG_ValidForeignerId'):''"
                  :placeholder="$t('SIG_InputForeignerId')"
                  :rules="[ isValidForeignerId ]"
                  class="login-input login-input--id"
                  type="togglePassword"
                  @update:model-value="form.isCheckForeignerId = false; form.isForeignerId= false"/>
              </div>
            </div>
            <RButton class="btn full small type01" :label="form.isForeignerId? $t('SIG_CertiComplete') : $t('SIG_Certi')" :disable="form.isForeignerId" @on-click="checkForeignerId"/>
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
        </template>

        <div class="field">
          <span class="input-title required">{{ $t('CM_Email') }}</span>
          <template v-if="pageState.serviceType === NO_SNS">
            <!-- 일반 가입 경우 -->
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
            <!-- //일반 가입 경우 -->
          </template>

          <!-- Apple 이메일 가리기로 가입한 경우 -->
          <template v-else-if="isPrivateAppleUser">
            <RInput
              ref="email"
              v-model="form.email"
              :hint="form.isEmail?$t('SIG_HintEmail'):''"
              :placeholder="$t('SIG_InputEmail')"
              :rules="[ isValidEmail ]"
              class="login-input login-input--id"
              @update:model-value="onInputEmail"
            >
              <template #prepend>
                <i :class="`ico APPLE-navy`"/>
              </template>
            </RInput>
            <RButton class="btn full small type01" :label="form.isEmail?$t('SIG_DupComplete') : $t('SIG_DupCheck')" :disable="form.isEmail" @click="checkEmail"/>
            <!-- Apple 이메일 가리기로 가입한 경우 -->
          </template>

          <template v-else>
            <!--
              SNS 가입 경우
            -->
            <RInput v-model="form.email" readonly class="sns-input-area">
              <template #prepend>
                <i :class="`ico ${pageState.serviceType}-navy`"/>
              </template>
            </RInput>
          <!-- //SNS 가입 경우 -->
          </template>
        </div>

        <template v-if="isPlanner() && pageState.certiInfo.foreign">
          <div class="field select-field">
            <div>
              <span class="input-title required">{{ $t('CM_Country') }}</span>
              <div class="">
                <RSelectBox
                  v-model="form.country"
                  :rules="[val => !!val || $t('SIG_ValidCountry') ]"
                  :placeholder-text="$t('CM_Select')"
                  option-value="code"
                  option-label="text"
                  :options="countryList"
                />
              </div>
            </div>

            <div>
              <span class="input-title required">{{ $t('CM_StayCode') }}</span>
              <div class="">
                <RSelectBox
                  v-model="form.stayCode"
                  :placeholder-text="$t('CM_Select')"
                  option-value="code"
                  option-label="text"
                  :options="visaList"
                  :rules="[val => !!val || $t('SIG_ValidCountryCode')]"
                />
              </div>
            </div>
          </div>

          <span class="block mt4 font-12 error-color">{{ $t('SIG_ForeignerError') }}</span>

          <div class="field">
            <span class="input-title required">{{ $t('SIG_ForeignerRegCardFront') }}</span>
            <RUploadFile
              v-model="form.foreignerRegCardFront"
              :display-value="form.foreignerRegCardFront && form?.foreignerRegCardFrontFileName || ''"
              accept=".jpg,.jpeg,.png"
              :placeholder-text="$t('CM_UploadFile')"
              :rules="[val => !!val || $t('SIG_ValidForeignerRegCardFront') ]"
              @update:model-value="(val) =>onFileChange('front', val)"
            />
          </div>

          <div class="field">
            <span class="input-title required">{{ $t('SIG_ForeignerRegCardBack') }}</span>
            <RUploadFile
              v-model="form.foreignerRegCardBack"
              :display-value="form.foreignerRegCardBack && form?.foreignerRegCardBackFileName || ''"
              accept=".jpg,.jpeg,.png"
              :placeholder-text="$t('CM_UploadFile')"
              :rules="[val => !!val || $t('SIG_ValidForeignerRegCardBack') ]"
              @update:model-value="(val) => onFileChange('back', val)"
            />
          </div>

          <div class="field">
            <span class="input-title required">{{ $t('SIG_BankImage') }}</span>
            <RUploadFile
              v-model="form.bankbook"
              :display-value="form.bankbook && form?.bankbookFileName || ''"
              accept=".jpg,.jpeg,.png"
              :placeholder-text="$t('CM_UploadFile')"
              :rules="[val => !!val || $t('SIG_ValidBankImage') ]"
              @update:model-value="(val) => onFileChange('bank', val)"
            />
            <span class="input-detail-text">{{ $t('SIG_DescBankImage') }}</span>
          </div>
        </template>

        <div v-if="!isMobileCertificate" class="field">
          <span class="input-title required">{{ $t('CM_MobileNumber') }}</span>
          <RInput ref="" v-model="form.mobileNumber" type="number" :placeholder="$t('ALT_InputMobile')" :rules="[validate.isValidPhoneNumber]" class="login-input login-input--id"/>
        </div>

        <div class="field">
          <RPasswordConfirm v-model:password="form.password" v-model:passwordConfirm="form.passwordConfirm" />
        </div>

        <div v-if="isPlanner()" class="field">
          <span class="input-title required">{{ $t('CMM_AddressLabel') }}</span>
          <AddressInput
            v-model:addrInfo="form.address"
          />
        </div>
      </div>

      <div class="bottom-btn">
        <span class="last-step-text">{{ $t('SIG_LastStep') }}</span>
        <div class="flex-btn-area">
          <RButton class="btn full small type03" :label="$t('CM_PrevStep')" @on-click="$router.push('/signup/selectReferrer')"/>
          <RButton class="btn full small type02" :label="$t('CM_NextStep')" type="submit" />
        </div>
      </div>

    </div>
  </q-form>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import validate from '@utils/validate'
import memberService from '@/http/services/member'
import { sessionDataManager, SIGNUP_SERVICE_TYPE, SIGNUP_USER_TYPE, SIGNUP_CERTI_INFO, SIGNUP_SNS_DATA, SIGNUP_USER_INFO, SIGNUP_CURRENT_STEP } from '@utils/dataManager'
import { ROLES_BE, NO_SNS } from '@utils/constant'
import format from '@/utils/format'

const { proxy } = getCurrentInstance()
const router = useRouter()

const totalStep = ref(3)
const step = ref(2)
const countryList = ref([])
const visaList = ref([])

const currentStep = ['/signup/selectType', '/signup/selectReferrer', '/signup/enterInformation']
const nextPage = '/signup/agreeTerms'

const isPrivateAppleUser = ref(false)

/**
 * 입력 데이터
 */
const form = reactive({
  firstName: '',
  lastName: '',
  password: '',
  passwordConfirm: '',
  country: null,
  isCheckForeignerId: false,
  isForeignerId: false,
  foreignerRegNumberFront: '',
  foreignerRegNumberBack: '',
  nickName: '',
  isCheckNickName: false,
  isNickName: false,
  email: '',
  isCheckEmail: false,
  isEmail: false,
  stayCode: null,
  foreignerRegCardFront: null,
  foreignerRegCardFrontUrl: null,
  foreignerRegCardFrontFileName: null,
  foreignerRegCardBack: null,
  foreignerRegCardBackUrl: null,
  foreignerRegCardBackFileName: null,
  bankbook: null,
  bankbookUrl: null,
  bankbookFileName: null,
  address: {
    address1: '',
    address2: '',
    zipcode: ''
  },
  mobileNumber: ''
})

// sessiont data
const pageState = reactive({
  serviceType: '',
  userType: '',
  certiInfo: {
    birthDate: null,
    mobileNumber: null,
    foreign: false
  }
})

const isMobileCertificate = computed(() => { return !!pageState.certiInfo.mobileNumber })

/**
 * 외국인 등록번호 validation check
 * @param {*} value
 */
const isValidForeignerId = async (value) => {
  if (!await validate.checkLength(form.foreignerRegNumberBack, 7)) {
    return proxy.$t('SIG_ValidLengthForeignerId')
  } else if (!form.isCheckForeignerId) {
    return proxy.$t('SIG_ValidCheckForeignerId')
  } else if (!form.isForeignerId) {
    return proxy.$t('SIG_ValidIsForeignerId')
  }
  return true
}

/**
 * 외국인 등록번호 인증 API 호출
 */
const checkForeignerId = async () => {
  form.isCheckForeignerId = true
  if (!validate.checkLength(form.foreignerRegNumberBack, 7)) {
    proxy.$refs.foreignerId.validate()
    return
  }
  const params = {
    userName: pageState.certiInfo.userName,
    residentRegNo: form.foreignerRegNumberFront + form.foreignerRegNumberBack
  }
  const result = await memberService.getNameCheck(params)
  if (result) {
    form.isForeignerId = result.data
    proxy.$refs.foreignerId.validate()
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
    serviceType: pageState.serviceType
  }
  const result = await memberService.postFindExistNickNm(params)
  if (result) {
    form.isNickName = !(result.data && result.data.duplicate)
    proxy.$refs.nickName.validate()
  }
}

/**
 * 이메일 validation check
 */
const isValidEmail = async (value) => {
  if (!validate.isValidEmail(value) && isPlanner()) {
    return proxy.$t('SIG_ValidPatternEmail2')
  } else if (!validate.isValidEmail(value) && !isPlanner()) {
    return proxy.$t('SIG_ValidPatternEmail')
  } else if (!form.isCheckEmail) {
    return proxy.$t('SIG_ValidCheckNickName')
  } else if (!form.isEmail) {
    return proxy.$t('SIG_ValidDupEmail')
  }
  return true
}

/**
 * 이메일 입력 시 영문,숫자,@, +, - , _ 만 허용
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
    serviceType: pageState.serviceType
  }

  if (isPrivateAppleUser.value) {
    params.tokenSocial = JSON.parse(sessionDataManager.get(SIGNUP_SNS_DATA))?.id
  }

  const result = await memberService.postFindExistUser(params)
  if (result) {
    form.isEmail = !(result.data && result.data.duplicate)
    proxy.$refs.email.validate()
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

onMounted(() => {
  sessionDataManager.set(SIGNUP_CURRENT_STEP, JSON.stringify(currentStep))

  getSessionData()
  getOptionList()
  setPrevEnterInformation()
})

const getSessionData = () => {
  pageState.serviceType = sessionDataManager.get(SIGNUP_SERVICE_TYPE)
  pageState.userType = sessionDataManager.get(SIGNUP_USER_TYPE)
  pageState.certiInfo = JSON.parse(sessionDataManager.get(SIGNUP_CERTI_INFO))

  if (pageState.certiInfo.foreign && isPlanner()) {
    form.foreignerRegNumberFront = pageState.certiInfo.birthDate.replace(/-/g, '').slice(2)
  }

  if (pageState.serviceType !== NO_SNS) {
    form.email = JSON.parse(sessionDataManager.get(SIGNUP_SNS_DATA)).email
  }

  const isPrivateEmail = JSON.parse(sessionDataManager.get(SIGNUP_SNS_DATA))?.isPrivateEmail === 'true'

  if (isPrivateEmail) {
    form.email = null
    isPrivateAppleUser.value = true
  }

  splitName()
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
  if (containsEnglish(pageState.certiInfo.userName)) {
    splitForeignName()
  } else {
    splitLocalName()
  }
}

/**
 * 외국인 > 성, 이름 분리
 */
const splitForeignName = () => {
  const fullName = pageState.certiInfo.userName
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
  const fullName = pageState.certiInfo.userName
  if (fullName.length <= 3) {
    form.lastName = fullName.charAt(0)
    form.firstName = fullName.slice(1)
  } else {
    form.lastName = fullName.slice(0, 2)
    form.firstName = fullName.slice(2)
  }
}

/**
 * 외국인 플래너 일 경우 > 국가, visa 코드 선택
 */
const getOptionList = async () => {
  if (!isPlanner() || !pageState.certiInfo.foreign) {
    return
  }

  const responseCountry = await memberService.getCountryList()
  if (responseCountry) {
    countryList.value = responseCountry.data
  }

  const responseVisa = await memberService.getVisaList()
  if (responseVisa) {
    visaList.value = responseVisa.data
  }
}

/**
 * 다음단계 이동
 */
const onSubmit = () => {
  if (!checkFullName()) {
    proxy.$alert(proxy.$t('SIG_AltFullName'), {
      title: proxy.$t('SIG_AltTitleFullName'),
      ok: function () {
        setTimeout(() => {
          proxy.$refs.lastName.focus()
        })
      }
    })
    return
  }

  sessionDataManager.set(SIGNUP_USER_INFO, JSON.stringify(form))

  sessionDataManager.set(SIGNUP_CURRENT_STEP, JSON.stringify([...currentStep, nextPage]))
  router.push({ name: 'AgreeTerms' })
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
  if (containsEnglish(pageState.certiInfo.userName)) {
    const fullName = pageState.certiInfo.userName
    const englishName = fullName.replace(/[^a-zA-Z\s\-'\.]/g, '')
    return normalizeString(englishName) === normalizeString(form.lastName + form.firstName)
  }
  return pageState.certiInfo.userName === form.lastName + form.firstName
}

const isPlanner = () => {
  return pageState.userType === ROLES_BE.planner
}

/**
 * 외국인 등록증/통장사본 이미지 업로드
 * @param {*} _type
 * @param {*} file
 */
const onFileChange = async (_type, file) => {
  if (!file) {
    return
  }
  const type = _type === 'bank' ? 'BANK_BOOK_PAPER' : 'FOREIGNERS_REGISTRATION_PAPER'
  const params = {
    'request[0].file': file,
    type
  }
  const result = await memberService.postUploadImage(params)
  if (result) {
    if (_type === 'front') {
      form.foreignerRegCardFrontFileName = form.foreignerRegCardFront.name
      form.foreignerRegCardFrontUrl = result.data[0]
    } else if (_type === 'back') {
      form.foreignerRegCardBackFileName = form.foreignerRegCardBack.name
      form.foreignerRegCardBackUrl = result.data[0]
    } else if (_type === 'bank') {
      form.bankbookFileName = form.bankbook.name
      form.bankbookUrl = result.data[0]
    }
  }
}

/**
 *  뒤로가기 페이지 이동 시, 이전 입력 사항 출력
 */
const setPrevEnterInformation = () => {
  const prevEnterInfo = JSON.parse(sessionDataManager.get(SIGNUP_USER_INFO))
  if (prevEnterInfo) {
    form.firstName = prevEnterInfo.firstName
    form.lastName = prevEnterInfo.lastName
    form.nickName = prevEnterInfo.nickName
    form.email = prevEnterInfo.email

    form.foreignerRegNumberBack = prevEnterInfo.foreignerRegNumberBack
    form.country = prevEnterInfo.country
    form.stayCode = prevEnterInfo.stayCode

    form.foreignerRegCardFront = prevEnterInfo.foreignerRegCardFront
    form.foreignerRegCardFrontUrl = prevEnterInfo.foreignerRegCardFrontUrl
    form.foreignerRegCardFrontFileName = prevEnterInfo.foreignerRegCardFrontFileName

    form.foreignerRegCardBack = prevEnterInfo.foreignerRegCardBack
    form.foreignerRegCardBackUrl = prevEnterInfo.foreignerRegCardBackUrl
    form.foreignerRegCardBackFileName = prevEnterInfo.foreignerRegCardBackFileName

    form.bankbook = prevEnterInfo.bankbook
    form.bankbookUrl = prevEnterInfo.bankbookUrl
    form.bankbookFileName = prevEnterInfo.bankbookFileName

    form.password = prevEnterInfo.password
    form.passwordConfirm = prevEnterInfo.passwordConfirm
    form.address.address1 = prevEnterInfo.address.address1
    form.address.address2 = prevEnterInfo.address.address2
    form.address.zipcode = prevEnterInfo.address.zipcode

    form.mobileNumber = prevEnterInfo.mobileNumber
  }
}

</script>

<style lang="scss" scoped>
:deep(.q-field__bottom){
  padding: 8px 0 0;
  color: #2EB8B3;
}
</style>

