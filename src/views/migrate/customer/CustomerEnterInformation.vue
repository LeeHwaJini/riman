<!--
  NM 전환 > 커스터머 정보 입력
  create by jhchoi
-->

<template>
  <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmit">
    <!-- 약관동의 -->
    <div class="max-width-wrap signup-wrap pb144">
      <div class="signup-detail-title-area pt64-pb16-title-area">
        <h4 class="" v-html="$t('MIG_AgreeTitle')" />
      </div>

      <div class="all-checkbox-area">
        <RCheckbox v-model="allAgree" checked-icon="check_circle" unchecked-icon="check_circle" class="flex-shrink0" @update:model-value="onSelectAll">
          <div class="checkbox-title">{{ $t('CM_AllAgree') }}</div>
        </RCheckbox>
      </div>

      <div class="checkbox-area type01 mt16">
        <b class="block font-14 gray04-color">{{ $t('MIG_WithdrawalTerms') }}</b>

        <div class="field mt8">
          <RCheckbox v-model="isWithdrawalTerms" checked-icon="check_circle" unchecked-icon="check_circle" @update:model-value="isAllCheck">
            <b>{{ $t('CM_Essential') }}</b>
            <span class="checkbox-title gray07-color">{{ $t('MIG_WithdrawalTermName') }}</span>
          </RCheckbox>
        </div>
      </div>

      <div class="checkbox-area type01 mt16">
        <b class="block font-14 gray04-color">{{ $t('MIG_SignupTerms') }}</b>
        <div v-for="term in terms" :key="term.termId" class="field mt8">
          <RCheckbox v-model="term.checked" checked-icon="check_circle" unchecked-icon="check_circle" @update:model-value="isAllCheck">
            <b :class="[term.agreeYn ? '' : 'gray03-color']">{{ term.agreeYn ? $t('CM_Essential') : $t('CM_Optional') }}</b>
            <span class="checkbox-title gray07-color">{{ term.termsName }}</span>
          </RCheckbox>
          <span class="ml4 font-12 medium gray04-color text-underline type02 pointer" @click="onOpenTermsModal(term)">{{ $t('CM_View') }}</span>
        </div>
      </div>

      <!-- 개인정보 입력 -->
      <div class="signup-detail-title-area pt48-title-area">
        <h4 class="" v-html="$t('MIG_InfoTitle')" />
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

        <!-- 추천인 정보 -->
        <div v-if="isMobileCertificate" class="field">
          <div class="user-info-area">
            <dl>
              <dt>{{ $t('CM_MobileNumber') }}</dt>
              <dd>{{ format.mobileFormat(migrateInfo.mobileNumber) }}</dd>
            </dl>
            <dl>
              <dt>{{ $t('CM_BirthDate') }}</dt>
              <dd>{{ migrateInfo.birthDate && migrateInfo.birthDate.replace(/-/g, '.') }}</dd>
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
          <RInput ref="" v-model="form.mobileNumber" type="number" :placeholder="$t('ALT_InputMobile')" :rules="[validate.isValidPhoneNumber]" class="login-input login-input--id"/>
        </div>
      </div>

      <!-- 비밀번호 입력 -->
      <div class="signup-detail-title-area pt48-title-area">
        <h4 class="" v-html="$t('RPW_ResTitle')" />
      </div>

      <div class="form-area type01">
        <div class="field">
          <RPasswordConfirm v-model:password="form.passwordText1" v-model:passwordConfirm="form.passwordText2" />
        </div>
      </div>

      <div class="bottom-btn">
        <RButton class="btn full small type02 font-16" :label="$t('MIG_SubmitButton')" type="submit" />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { reactive, ref, getCurrentInstance, onMounted, computed } from 'vue'
import format from '@/utils/format'
import memberService from '@/http/services/member'
import validate from '@utils/validate'
import { sessionDataManager, MIGRATE_COMPLETE } from '@utils/dataManager'
import { useRouter } from 'vue-router'

const router = useRouter()
const { proxy } = getCurrentInstance()
const props = defineProps({
  migrateInfo: {
    type: Object,
    default: null
  }
})

const form = reactive({
  lastName: '',
  firstName: '',
  email: '',
  isCheckEmail: false,
  isEmail: false,
  passwordText1: '',
  passwordText2: '',
  mobileNumber: ''
})

const isMobileCertificate = computed(() => { return !!props.migrateInfo.mobileNumber })

onMounted(() => {
  getTermList()

  splitName()
})

const terms = ref([])
const isWithdrawalTerms = ref(false)
const allAgree = ref(false)

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
  if (containsEnglish(props.migrateInfo.userName)) {
    splitForeignName()
  } else {
    splitLocalName()
  }
}

/**
 * 외국인 > 성, 이름 분리
 */
const splitForeignName = () => {
  const fullName = props.migrateInfo.userName
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
  const fullName = props.migrateInfo.userName
  if (fullName.length <= 3) {
    form.lastName = fullName.charAt(0)
    form.firstName = fullName.slice(1)
  } else {
    form.lastName = fullName.slice(0, 2)
    form.firstName = fullName.slice(2)
  }
}
/**
 * 약관 전체 동의 토글
 */
const onSelectAll = (e) => {
  terms.value?.map((term) => {
    term.checked = e
  })

  // 탈퇴약관
  isWithdrawalTerms.value = e
}

/**
 * 약관 전체 동의 여부 체크
 */
const isAllCheck = () => {
  allAgree.value = terms?.value.every((el) => el.checked) && isWithdrawalTerms.value
}

/**
 * 약관조회
 */
const getTermList = async () => {
  const params = {
    type: 'BEAUTY_CONVERTER_APPLICANT'
  }
  const result = await memberService.getMigrateTerms(params)

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
          termsVersion: t.termsVersion
        }
      )
    })
  }
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
  if (containsEnglish(props.migrateInfo.userName)) {
    const fullName = props.migrateInfo.userName
    const englishName = fullName.replace(/[^a-zA-Z\s\-'\.]/g, '')
    return normalizeString(englishName) === normalizeString(form.lastName + form.firstName)
  }
  return props.migrateInfo.userName === form.lastName + form.firstName
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
        content: term.contents
      },
      modeless: false // 선택
    })
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
 * 전환동의 완료
 */
const onSubmit = async () => {
  // 약관 동의 체크
  if (!checkAgree()) {
    proxy.$alert('MIG_AgreeTitle')
    return false
  }

  const marketingTerms = terms?.value.filter((el) => !el.checked && el.termsTypeCode === 'NM_PERSONAL_INFORMATION_MARKETING')
  if (marketingTerms.length > 0) {
    proxy.$confirm(proxy.$t('SIG_ConfAgreeMarketing'),
      {
        okLabel: proxy.$t('SIG_Agree'),
        cancelLabel: proxy.$t('SIG_NextTime'),
        ok: () => {
          marketingTerms.map((item) => {
            item.checked = true
          })
          completeMigrate()
        },
        cancel: () => {
          completeMigrate()
        }
      })
    return false
  }
  if (!checkFullName()) {
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

  completeMigrate()
}

/**
 * 전환 완료
 */
const completeMigrate = async () => {
  let params = {
    'userNumber': props.migrateInfo.userNumber,
    'userPassword': form.passwordText1,
    'userConnectingInformationTempId': props.migrateInfo.userConnectingInformationTempId,
    'lastName': form.lastName,
    'firstName': form.firstName,
    'email': form.email,
    'agreements': handleDataAgreeTerm(),
    'draftMigrateUserYn': props.migrateInfo.draftMigrateUserYn
  }

  // 휴대폰 번호
  const phoneNumber = props.migrateInfo.mobileNumber ? props.migrateInfo.mobileNumber : form.mobileNumber
  if (phoneNumber) {
    params = Object.assign(params, { 'phoneNumber': phoneNumber })
  }

  const result = await memberService.postMigrateComplete(params)
  if (result) {
    sessionDataManager.set(MIGRATE_COMPLETE, JSON.stringify(result.userRegisterInfo))
    router.push({ name: 'MigrateComplete' })
  }
}

/**
 * 필수 약관 체크 여부 확인
 */
const checkAgree = () => {
  return terms?.value.every((el) => el.agreeYn ? el.checked : true) && isWithdrawalTerms.value
}
</script>

<style lang="scss" scoped>
:deep(.q-field__bottom){
  padding: 8px 0 0;
  color: #2EB8B3;
}
</style>
