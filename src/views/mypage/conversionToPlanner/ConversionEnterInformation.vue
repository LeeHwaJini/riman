<!--
  마이페이지 > 플래너 전환 > 추천인 정보
  create by jhchoi
-->
<template>
  <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmit">
    <div class="max-width-wrap signup-wrap pb144">
      <div class="signup-detail-title-area">
        <h4 class="animate__fadeInUp" v-html="$t('MCC_EnterSubTitle',{name:pageState.fullName})" />
      </div>

      <div class="step-area">
        <RStep :step="step" :total-step="totalStep" />
      </div>

      <div class="mb12">
        <h6 class="ptb16 bold gray07-color">{{ $t('CM_ReferrerInfo') }}</h6>
        <span class="font-12 gray04-color">{{ $t('MCC_ReferrerDesc') }}</span>
      </div>

      <div class="recomm-info-area">
        <div>
          <span class="gray-text">{{ reffererInfo.nation }}</span>
          <span class="navy-text">{{ reffererInfo.userNumber }}</span>
        </div>
        <span class="gray-text">{{ reffererInfo.lastName }} {{ reffererInfo.firstName }}</span>
      </div>

      <div class="form-area type01">
        <div v-if="pageState.certiInfo.foreign" class="field">
          <span class="input-title required">{{ $t('CM_ForeignNumber') }}</span>
          <div class=" q-field">
            <div class="input-btn-area">
              <RInput v-model="form.foreignerRegNumberFront" disable class="login-input login-input--id "/>
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
          <div class="input-title input-btn-area flex">
            {{ $t('CM_NickName') }}({{ $t('CM_Select') }})
            <div class="tooltip-area type01 bottom">
              <i class="ico question"></i>
              <!-- tooltip  -->
              <div class="tooltip-text-area">
                <div class="tooltip-text">
                  {{ $t('SIG_TooltipNickName1') }}<br>{{ $t('SIG_TooltipNickName2') }}
                </div>
              </div>
            <!-- //tooltip  -->
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
          <RButton class="btn full small type01" :label="form.isNickName?$t('SIG_DupComplete') : $t('SIG_DupCheck')" :disable="form.isNickName" @click="checkNickName"/>
        </div>

        <div class="field">
          <span class="input-title required">{{ $t('CMM_AddressLabel') }}</span>
          <AddressInput
            v-model:addrInfo="form.address"
          />
        </div>

        <template v-if="pageState.certiInfo.foreign">
          <div class="field select-field">
            <div>
              <span class="input-title required">{{ $t('CM_Country') }}</span>
              <div class="">
                <RSelectBox
                  v-model="form.country"
                  :rules="[val => !!val || $t('SIG_ValidCountry')]"
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
                  :rules="[val => !!val || $t('SIG_ValidCountryCode') ]"
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
              :rules="[val => !!val || '외국인 등록증 앞면 이미지를 등록해주세요' ]"
              @update:model-value="(val) =>onFileChange('front', val)"
            />
          </div>

          <div class="field">
            <span class="input-title required">외국인 등록증 뒷면 이미지</span>
            <RUploadFile
              v-model="form.foreignerRegCardBack"
              :display-value="form.foreignerRegCardBack && form?.foreignerRegCardBackFileName || ''"
              accept=".jpg,.jpeg,.png"
              :placeholder-text="$t('CM_UploadFile')"
              :rules="[val => !!val || $t('SIG_ValidForeignerRegCardFront') ]"
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

      </div>

      <div class="bottom-btn">
        <RButton class="btn full small type02" :label="$t('CM_NextStep')" type="submit"/>
      </div>

    </div>
  </q-form>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store/mainStore'
import memberService from '@/http/services/member'
import orderService from '@/http/services/order'
import { sessionDataManager, CONVERSION_CURRENT_STEP, CONVERSION_CERTI_INFO, CONVERSION_USER_INFO } from '@utils/dataManager'
import validate from '@utils/validate'
import mypageService from '@/http/services/mypage'

const router = useRouter()
const mainStore = useMainStore()
const userInfo = mainStore.getUser
const { proxy } = getCurrentInstance()

const currentStep = ['/mypage/conversionToPlanner/certificate', '/mypage/conversionToPlanner/enterInformation']
const nextPage = '/mypage/conversionToPlanner/agreeTerms'

const totalStep = ref(2)
const step = ref(1)

const countryList = ref([])
const visaList = ref([])
const reffererInfo = reactive({
  nation: '',
  firstName: '',
  lastName: '',
  userNumber: ''
})

/**
 * 입력 데이터
 */
const form = reactive({
  country: null,
  isCheckForeignerId: false,
  isForeignerId: false,
  foreignerRegNumberFront: '',
  foreignerRegNumberBack: '',
  nickName: '',
  isCheckNickName: false,
  isNickName: false,
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
  }
})

// sessiont data
const pageState = reactive({
  certiInfo: {
    birthDate: null,
    mobileNumber: null,
    foreign: false
  },
  fullName: ''
})

onMounted(() => {
  sessionDataManager.set(CONVERSION_CURRENT_STEP, JSON.stringify(currentStep))
  getUserInfo()

  searchReferralNumber()
  getSessionData()
  setPrevEnterInformation()

  getOptionList()
  getAddressInfo()
})

/**
 * 사용자 정보 조회
 */
const getUserInfo = async () => {
  const result = await mypageService.getUserInfo(userInfo.userSeqNo)
  if (result && result.message === 'success') {
    pageState.fullName = proxy.$nameFormat(result.data.lastName, result.data.firstName)
  }
}

/**
 * 추천인 API 호출
 */
const searchReferralNumber = async () => {
  const params = {
    userNumber: userInfo.referralUserNumber
  }
  const result = await memberService.getReferralNumber(params)
  if (result) {
    reffererInfo.nation = result.data.globalRefererRegionCode.text
    reffererInfo.firstName = result.data.firstName
    reffererInfo.lastName = result.data.lastName
    reffererInfo.userNumber = result.data.globalRefererUserNumber
  }
}

/**
 * session data 호출
 */
const getSessionData = () => {
  pageState.certiInfo = JSON.parse(sessionDataManager.get(CONVERSION_CERTI_INFO))
  if (pageState.certiInfo.foreign) {
    form.foreignerRegNumberFront = pageState.certiInfo.birthDate.replace(/-/g, '').slice(2)
  }
}

/**
 *  뒤로가기 페이지 이동 시, 이전 입력 사항 출력
 */
const setPrevEnterInformation = () => {
  const prevEnterInfo = JSON.parse(sessionDataManager.get(CONVERSION_USER_INFO))
  if (prevEnterInfo) {
    form.nickName = prevEnterInfo.nickName

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

    form.address.address1 = prevEnterInfo.address.address1
    form.address.address2 = prevEnterInfo.address.address2
    form.address.zipcode = prevEnterInfo.address.zipcode
  }
}

/**
 * 외국인 플래너 일 경우 > 국가, visa 코드 선택
 */
const getOptionList = async () => {
  if (!pageState.certiInfo.foreign) {
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
 * 기존 기본 배송지가 있을 경우 기본 배송지 호출
 */
const getAddressInfo = async () => {
  const userSeqNo = mainStore.userInfo.userSeqNo
  const params = {
    userId: userSeqNo
  }
  const result = await orderService.getAddressList(params)
  if (result && result.code === '2000') {
    const defaultAddress = result.data.filter(address => address.defaultValue)
    if (defaultAddress.length > 0) {
      form.address.address1 = defaultAddress[0].address1
      form.address.address2 = defaultAddress[0].address2
      form.address.zipcode = defaultAddress[0].zipcode
    }
  }
}

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
 * 닉네임 입력 시, 영문과 숫자 만 입력 허용
 */
const onInputNickName = (val) => {
  form.isCheckNickName = false
  form.isNickName = false
  form.nickName = val.replace(/[^a-zA-Z0-9]/g, '')
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
 * 다음단계 이동
 */
const onSubmit = () => {
  sessionDataManager.set(CONVERSION_USER_INFO, JSON.stringify(form))

  sessionDataManager.set(CONVERSION_CURRENT_STEP, JSON.stringify([...currentStep, nextPage]))
  router.push({ name: 'ConversionAgreeTerms' })
}
</script>

<style lang="scss" scoped>
:deep(.q-field__bottom){
  padding: 8px 0 0;
  color: #2EB8B3;
}
</style>
