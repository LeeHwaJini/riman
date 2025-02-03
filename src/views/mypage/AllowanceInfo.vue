<!--
  마이페이지 > 수당 정보 관리
  create by jhchoi
-->
<template>
  <div class="max-width-wrap signup-wrap pb144 allowance-wrap">
    <div class="signup-detail-title-area">
      <h4 v-if="pageState.isPersonalIdAuth && pageState.isBankAccountAuth" v-html="$t('ALI_AuthTitle',{name:pageState.userName})" />
      <h4 v-else v-html="$t('ALI_Title',{name:pageState.userName})" />
    </div>

    <span class="mypage-icon" :class="pageState.isPersonalIdAuth && pageState.isBankAccountAuth ? 'primary05-color' : 'error-color'">
      {{ statusText }}
    </span>

    <div class="form-area type01 top-form-area">
      <div class="field">
        <span class="input-title">{{ $t('CM_FirstName') }}</span>
        <RInput ref="" v-model="pageState.userName" disable placeholder="홍" class="login-input login-input--id visible-input"/>
      </div>

      <div class="field">
        <span class="input-title">{{ $t('CM_RegNumber') }}</span>
        <div class="input-btn-area q-field">
          <div>
            <RInput v-model="pageState.regNumberFront" disable class="login-input login-input--id "/>
          </div>
          <div>
            <RInput
              ref="regNumberBack"
              v-model="pageState.regNumberBack"
              class="login-input login-input--id"
              type="password"
              :disable="pageState.isPersonalIdAuth"
              @keyup.enter="checkRegNumber"
            />
          </div>
        </div>

      </div>

      <div v-if="terms.identifier.termsName" class="field">
        <div class="q-field">
          <RCheckbox v-model="pageState.isIdentifierTerm" class="checkbox-area type02" :disable="pageState.isPersonalIdAuth">
            <span class="gray07-color font-14">[{{ $t('CM_Essential') }}] {{ terms.identifier.termsName }}</span>
          </RCheckbox>
          <span class="font-12 gray04-color medium text-underline type02 ml4 pointer" @click="onOpenTermsModal(terms.identifier)">{{ $t('CM_View') }}</span>
        </div>
        <RButton class="btn full small type01" :label="pageState.isPersonalIdAuth? $t('SIG_CertiComplete'):$t('SIG_Certi')" :disable="pageState.isPersonalIdAuth" @on-click="checkRegNumber" />
      </div>
    </div>

    <!-- 인증된 경우에만 노출 -->
    <div v-if="pageState.isBankAccountAuth" class="text-right right-btn-area">
      <RButton class="btn type13" :label="$t('ALI_ChangeAccountBtn')" @on-click="onAccountRegOpenModal" />
    </div>
    <!-- //인증된 경우에만 노출 -->

    <div class="form-area type01 bottom-form-area">
      <div class="field">
        <span class="input-title">{{ $t('CM_BankUserName') }}</span>
        <RInput v-model="pageState.legalName" disable class="login-input login-input--id "/>
      </div>

      <div class="field">
        <span class="input-title">{{ $t('CM_BankName') }}</span>
        <RSelectBox
          v-model="pageState.bankCode"
          :placeholder-text="$t('CM_SelBank')"
          :options="bankList"
          option-value="bankCode"
          option-label="bankName"
          class="select-box type04"
          :disable="pageState.isBankAccountAuth"
        />
      </div>

      <div class="field">
        <span class="input-title">{{ $t('CM_AccountNumber') }}</span>
        <RInput ref="bankAccountNo" v-model="pageState.bankAccountNo" :disable="pageState.isBankAccountAuth" :placeholder="$t('CM_OnlyNumber')" class="login-input login-input--id visible-input" type="number" @keyup.enter="checkAccount('create', pageState.bankCode, pageState.bankAccountNo)" />
        <span class="block mt4 mb16 font-12 gray04-color">{{ $t('ALI_InfoDesc') }}</span>
      </div>

      <div v-if="terms.personal.termsName" class="field">
        <div class="q-field">
          <RCheckbox v-model="pageState.isPersonalTerm" class="checkbox-area type02" :disable="pageState.isBankAccountAuth">
            <span class="gray07-color font-14">[{{ $t('CM_Essential') }}] {{ terms.personal.termsName }}</span>
          </RCheckbox>
          <span class="font-12 gray04-color medium text-underline type02 ml4 pointer" @click="onOpenTermsModal(terms.personal)">{{ $t('CM_View') }}</span>
        </div>
        <RButton class="btn full small type01" :label="pageState.isBankAccountAuth? $t('ALI_CompleteVertiAccount'):$t('ALI_VertiAccount')" :disable="pageState.isBankAccountAuth" @on-click="checkAccount('create', pageState.bankCode, pageState.bankAccountNo)" />
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive, computed } from 'vue'
import { useMainStore } from '@store/mainStore'
import mypageService from '@/http/services/mypage'
import memberService from '@/http/services/member'
import validate from '@utils/validate'
import AllowanceRegModal from '@/views/mypage/modal/AllowanceRegModal'
import { date } from 'quasar'
import { ROLES_BE } from '@utils/constant'

const { proxy } = getCurrentInstance()
const mainStore = useMainStore()
const userInfo = mainStore.getUser

const bankList = ref([])

const onAccountRegOpenModal = () => {
  if (isChangeDate.value) {
    proxy.openModal({
      parent: proxy, // 필수
      component: 'ResponsiveModal',
      componentProps: {
        title: proxy.$t('ALI_ChangeAccount'),
        contentComponent: AllowanceRegModal,
        wrapClass: 'bottom-btn-modal',
        pageState: {
          legalName: pageState.legalName,
          bankCode: pageState.bankCode,
          bankAccountNo: pageState.bankAccountNo,
          fnChangeAccount: function (bankCode, bankAccountNo) {
            if (!isChangeDate.value) {
              proxy.$alert(proxy.$t('ALI_AltChangeInfo'))
              return false
            } else {
              checkAccount('update', bankCode, bankAccountNo)
            }
          }
        }
      }
    })
  } else {
    proxy.$alert(proxy.$t('ALI_AltChangeInfo'))
  }
}

const pageState = reactive({
  isPersonalIdAuth: false,
  isBankAccountAuth: false,
  bankCode: null,
  bankAccountNo: '',
  legalName: '',
  personalId: '',
  regNumberFront: '',
  regNumberBack: '',
  userAllowanceBankAccountId: '',
  userName: '',
  isIdentifierTerm: false,
  isPersonalTerm: false
})

const terms = reactive({
  identifier: {
    termsName: '',
    contents: ''
  },
  personal: {
    termsName: '',
    contents: ''
  }
})

const ALLOWANCE_TYPE = 'SETTLE'

onMounted(() => {
  getUserInfo()
  getAllowanceInfo()
  getBankCodeList()

  getTermsIdentifier()
  getTermsPersonal()
})

/**
 * 사용자 정보 조회
 */
const getUserInfo = async () => {
  const result = await mypageService.getUserInfo(userInfo.userSeqNo)
  if (result && result.message === 'success') {
    pageState.userName = proxy.$nameFormat(result.data.lastName, result.data.firstName)
  }
}

/**
 * 회원 수당계좌 조회
 */
const getAllowanceInfo = async () => {
  const response = await mypageService.getAllowanceAccount(userInfo.userSeqNo, ALLOWANCE_TYPE)
  if (response && response.data) {
    pageState.isBankAccountAuth = response.data.isBankAccountAuth
    pageState.isPersonalTerm = response.data.isBankAccountAuth
    pageState.bankCode = response.data.bankAccountInfo?.bankCode || null
    pageState.bankAccountNo = response.data.bankAccountInfo?.bankAccountNo || ''
    pageState.legalName = response.data.legalName
    pageState.personalId = response.data.personalId
    pageState.userAllowanceBankAccountId = response.data.userAllowanceBankAccountId

    if (pageState.personalId.length === 13) {
      pageState.isPersonalIdAuth = true
      pageState.isIdentifierTerm = true
      pageState.regNumberFront = pageState.personalId.substring(0, 6)

      pageState.regNumberBack = pageState.personalId.substring(6)
    } else {
      pageState.isPersonalIdAuth = false
      pageState.isIdentifierTerm = false
      pageState.regNumberFront = pageState.personalId
    }
  }
}

/**
 * 입금은행 조회
 */
const getBankCodeList = async () => {
  const result = await memberService.getBankCodeList()

  if (result) {
    bankList.value = result.data
  }
}

/**
 *  약관 조회 - 고유식별정보 수집 및 이용에 대한 동의
 */
const getTermsIdentifier = async () => {
  const params = {
    terms: 'IDENTIFIER_INFO_COLLECTION_AND_USAGE_CONSENT',
    user: ROLES_BE.planner,
    page: 'INCENTIVE_INFO_MANAGEMENT'
  }
  const result = await mypageService.getFindTerms(params)
  if (result) {
    terms.identifier = {
      termsName: result.data[0].termsName,
      contents: result.data[0].termsContents
    }
  }
}

/**
 *  약관 조회 - 개인정보 수집 및 이용 동의
 */
const getTermsPersonal = async () => {
  const params = {
    terms: 'NM_PERSONAL_INFORMATION',
    user: ROLES_BE.planner,
    page: 'INCENTIVE_INFO_MANAGEMENT'
  }
  const result = await mypageService.getFindTerms(params)
  if (result) {
    terms.personal = {
      termsName: result.data[0].termsName,
      contents: result.data[0].termsContents
    }
  }
}

/**
 * 실명인증
 */
const regNumberBack = ref(null)
const checkRegNumber = async () => {
  if (!pageState.isIdentifierTerm) {
    proxy.$alert(proxy.$t('MIG_AgreeTitle'))
    return false
  }

  if (!await validate.checkSameLength(pageState.regNumberBack, 7)) {
    proxy.$alert(proxy.$t('ALI_AltRegNumber'), {
      ok: function () {
        setTimeout(() => {
          regNumberBack.value.focus()
        })
      }
    })
    return
  }

  const params = {
    userName: pageState.legalName,
    residentRegNo: pageState.regNumberFront + pageState.regNumberBack
  }
  const result = await memberService.getNameCheck(params)
  if (result && result.data) {
    const personalParam = {
      userName: pageState.legalName,
      personalId: pageState.regNumberFront + pageState.regNumberBack,
      isPersonalIdAuth: true
    }

    const personalResponse = await mypageService.postSavePersnalInfo(userInfo.userSeqNo, personalParam)
    if (personalResponse && personalResponse.code === '2000') {
      pageState.isPersonalIdAuth = true
    } else {
      proxy.$alert(proxy.$t('ALI_AltRegNumber'), {
        ok: function () {
          setTimeout(() => {
            regNumberBack.value.focus()
          })
        }
      })
    }
  } else {
    proxy.$alert(proxy.$t('ALI_AltRegNumber'), {
      ok: function () {
        setTimeout(() => {
          regNumberBack.value.focus()
        })
      }
    })
    return
  }
}

/**
 * 계좌인증
 */
const bankAccountNo = ref(null)
const checkAccount = async (type = 'create', bankCode, bankAccountNo) => {
  if (!pageState.isPersonalTerm) {
    proxy.$alert(proxy.$t('MIG_AgreeTitle'))
    return false
  }

  if (bankCode === null || bankAccountNo === '') {
    proxy.$alert(proxy.$t('ALI_AltCheckBank'), {
      ok: function () {
        setTimeout(() => {
          bankAccountNo.value.focus()
        })
      }
    })
    return
  }
  const params = {
    bankCode: bankCode,
    accountNumber: bankAccountNo,
    accountOwnerName: pageState.legalName
  }
  const response = await memberService.postBankAuth(userInfo.userSeqNo, params)
  if (response && response.data.result) {
    const accountParams = {
      'bankCode': bankCode,
      'bankAccountNo': bankAccountNo,
      'bankHolderName': pageState.legalName,
      'isBankAccountAuth': true,
      'type': ALLOWANCE_TYPE
    }
    let accountResponse
    if (type === 'create') {
      accountResponse = await mypageService.postAllowanceAccount(userInfo.userSeqNo, accountParams)
    } else {
      accountResponse = await mypageService.patchAllowanceAccount(userInfo.userSeqNo, pageState.userAllowanceBankAccountId, accountParams)
    }
    if (accountResponse && accountResponse.message === 'OK') {
      if (type === 'update') {
        window.dispatchEvent(new Event('closeModal'))

        proxy.$alert(proxy.$t('ALI_AltCompleteChange'))
      }

      getAllowanceInfo()
    }
  } else {
    proxy.$alert(response.data.errorMessage)
  }
}

/**
 * 수당계좌 상태
 */
const statusText = computed(() => {
  const { isBankAccountAuth, isPersonalIdAuth } = pageState
  const statusMap = {
    '11': proxy.$t('ALI_Status1'),
    '00': proxy.$t('ALI_Status2'),
    '10': proxy.$t('ALI_Status3'),
    '01': proxy.$t('ALI_Status4')
  }
  const key = `${Number(isBankAccountAuth)}${Number(isPersonalIdAuth)}`
  return statusMap[key]
})

const isChangeDate = computed(() => {
  const today = ref(new Date())
  const currentDay = today.value.getDate()
  const lastDayOfMonth = date.daysInMonth(today.value)
  return currentDay >= 20 && currentDay <= lastDayOfMonth
})

/**
 * 약관 상세 보기
 * @param {*} content
 */
const onOpenTermsModal = (term) => {
  console.log('term', term)
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
