<!--
    비회원 주문 > 주문자정보
-->

<template>
  <div class="none-user-payment-wrap pb144">
    <div class="top-event-banner-area">
      <div class="flex align-center gap4">
        <i class="ico riman-coin-y"></i>
        <span>{{ $t('NUP_Title') }}</span>
      </div>
      <router-link to="/signup/selectType" class="flex align-center">
        <span>{{ $t('CM_Goto') }}</span>
        <i class="ico arrow-right-b"></i>
      </router-link>
    </div>

    <div class="none-user-payment-content">
      <h3>{{ $t('NUP_PayUserInfo') }}</h3>
      <div class="form-area type01 mb48">
        <div class="field">
          <span class="input-title">{{ $t('NUP_OrderName') }}</span>
          <div class="flex align-center no-wrap gap8">
            <RInput v-model="lastName" :placeholder="$t('CM_LastName')" class="login-input login-input--id" />
            <RInput v-model="firstName" :placeholder="$t('CM_FirstName')" class="login-input login-input--id" />
          </div>
        </div>

        <div class="field">
          <span class="input-title">{{ $t('CM_ReferralNumber') }}</span>
          <div class="input-btn-area">
            <RInput
              v-model="referrerNumber"
              :placeholder="$t('NUP_ReferrerInput')"
              :error="isError"
              :error-message="errorMsg"
              class="login-input login-input--id "
              :readonly="isReadonly"
              @keydown.enter.prevent="onSearchButton"
            />
            <RButton class="btn type01 w-small small mt0" :label="$t('CM_Search')" @click="onSearchButton"/>
          </div>
          <span class="input-detail-text">{{ $t('NUP_ReferrerDesc1') }}<br>{{ $t('NUP_ReferrerDesc2') }}</span>
        </div>
        <template v-if="reffererInfo.userNumber !== ''">
          <div class="recomm-info-area">
            <div>
              <span class="gray-text">{{ reffererInfo.nation }}</span>
              <span class="navy-text">{{ reffererInfo.userNumber }}</span>
            </div>
            <span class="gray-text">{{ reffererInfo.lastName }} {{ reffererInfo.firstName }}</span>
          </div>
          <div class="field">
            <Certificate
              cert-type="nonMember"
              :btn-text="$t('CM_MobileCert')"
              @on-success="onCertSuccess"
              @on-fail="onCertFail"
            />
            <span v-if="isCert" class="input-detail-text success04-color">{{ $t('CM_CertComplete') }} ({{ nonUserInfo.mobileNumber }})</span>
          </div>
        </template>
        <!-- <div class="field">
          <span class="input-title">추천인 번호</span>
          <RInput v-model="reffererInfo.userNumber" disable class="login-input login-input--id" />
          <span class="input-detail-text">추천인 정보가 없을 경우 비회원 구매가 불가능합니다.<br>퍼스널몰 QR코드로 접근시 추천인 정보를 변경 할 수 없습니다.</span>
        </div>

        <div class="field">
          <Certificate
            @on-success="onCertSuccess"
            @on-fail="onCertFail"
          />
          <span class="input-detail-text success04-color">휴대폰 본인인증 완료 (010-1234-5678)</span>
        </div> -->
      </div>

    </div>

    <div class="order-bottom-checkbox-area payment-bottom-checkbox-area plr16">
      <div class="all-checkbox-area border-gray01 mb16 pt0">
        <RCheckbox v-model="allAgree" class="checkbox-area type02">
          <span class="gray07-color font-16 medium">{{ $t('OP_Agreements') }}</span>
        </RCheckbox>
      </div>

      <div v-for="(agree, index) in agreements" :key="index" class="checkbox-flex-start-area">
        <RCheckbox v-model="checkList" :val="agree" class="checkbox-area type02" >
          <span class="gray07-color">{{ $t(agree.contents) }}</span>
        </RCheckbox>
        <div>
          <div class="detail" @click="onOpenTermsModal(agree.term)">{{ $t('CM_ToDetail') }}</div>
        </div>
      </div>
    </div>

    <div class="bottom-btn">
      <RButton class="btn full small type02" :label="$t('CM_DoOrder')" @click="onclickOrder" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, computed } from 'vue'
import validate from '@utils/validate'
import memberService from '@/http/services/member'
import { sessionDataManager, SIGNUP_USER_TYPE, SHOP_REFERRER_CODE } from '@utils/dataManager'
import { isOldEnough } from '@/utils/common'
import { ROLES_BE } from '@utils/constant'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import etcService from '@/http/services/etc'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const query = route.query
const firstName = ref('')
const lastName = ref('')
const referrerNumber = ref('')
const isError = ref(false)
const isCert = ref(false)
const isReadonly = ref(false)
const errorMsg = ref('')
const reffererInfo = reactive({
  nation: '',
  firstName: '',
  lastName: '',
  userNumber: ''
})
const nonUserInfo = ref(null)

const agreements = [
  {
    idx: 1,
    contents: 'NUP_Desc1',
    detail: true,
    term: 'NON_MEMBER_TERMS'
  },
  {
    idx: 2,
    contents: 'NUP_Desc2',
    detail: true,
    term: 'NON_MEMBER_PRIVACY_CONSENT'
  },
  {
    idx: 3,
    contents: 'NUP_Desc3',
    detail: true,
    term: 'THIRD_PARTY_CONSENT'
  }
]

const checkList = ref([])
/**
 * 전체선택
 */
const allAgree = computed({
  get() {
    return checkList.value.length === agreements.length
  },
  set(e) {
    checkList.value = e ? agreements : []
  }
})

const onSearchButton = () => {
  if (!validate.checkLength(referrerNumber.value, 1)) {
    isError.value = true
    errorMsg.value = proxy.$t('NUP_ReferrerInput2')
  } else if (!validate.checkLength(referrerNumber.value, 10)) {
    isError.value = true
    errorMsg.value = proxy.$t('NUP_ReferrerInput')
  } else {
    isError.value = false
    errorMsg.value = ''

    searchReferralNumber()
  }
}

const searchReferralNumber = async () => {
  const params = {
    userNumber: referrerNumber.value,
    regionCode: 'KR'
  }
  const result = await memberService.getReferralNumber(params)
  if (result) {
    reffererInfo.nation = result.data.globalRefererRegionCode.text
    reffererInfo.firstName = result.data.firstName
    reffererInfo.lastName = result.data.lastName
    reffererInfo.userNumber = result.data.globalRefererUserNumber
  }
}

const onCertSuccess = async (data) => {
  const userType = sessionDataManager.get(SIGNUP_USER_TYPE)
  const isPlanner = userType === ROLES_BE.planner
  const enoughAge = isPlanner ? 19 : 14
  if (!await isOldEnough(data.birthDate, enoughAge)) {
    proxy.$alert('', {
      title: proxy.$t('UTI_Month', { age: enoughAge })
    })
    return
  }
  isCert.value = true

  const nonUserData = data
  data.reffererNation = reffererInfo.nation
  data.reffererUserNumber = reffererInfo.userNumber
  data.reffererFirstName = reffererInfo.firstName
  data.reffererLastName = reffererInfo.lastName
  data.guestName = lastName.value + firstName.value
  nonUserInfo.value = nonUserData
}

// 본인인증 실패 후 후처리 함수
const onCertFail = () => {
  console.log('onCertFail')
}

const isValidValue = () => {
  if (firstName.value === '' || lastName.value === '') {
    proxy.$alert(proxy.$t('ALT_OrderName'))
    return false
  }
  if (reffererInfo.userNumber === '') {
    proxy.$alert(proxy.$t('ALT_ReferrerName'))
    return false
  }
  if (!isCert.value) {
    proxy.$alert(proxy.$t('ALT_MobileCert'))
    return false
  }
  if (checkList.value.findIndex((i) => i.idx === 1) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement7'))
    return false
  }
  if (checkList.value.findIndex((i) => i.idx === 2) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement8'))
    return false
  }
  if (checkList.value.findIndex((i) => i.idx === 3) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement3'))
    return false
  }
  if (nonUserInfo.value.userName !== lastName.value + firstName.value) {
    proxy.$alert(proxy.$t('ALT_NameDiff'))
    return false
  }
  return true
}

const onclickOrder = () => {
  if (!isValidValue()) return
  nonUserInfo.value.guestName = lastName.value + firstName.value
  sessionDataManager.set('nonUserInfo', JSON.stringify(nonUserInfo.value))
  sessionDataManager.set('isCert', isCert.value)

  query.bagId ? router.push(`/order/guest?bagId=${query.bagId}`) : router.push('/order/guest')
}

const getPaymentTerms = async (key) => {
  const result = await etcService.getNonUserPaymentTerms(key)

  if (result && result.data) {
    return result.data[0]
  }
}

/**
 * 약관 상세 보기
 * @param {*} content
 */
const onOpenTermsModal = async (termkey) => {
  const termData = await getPaymentTerms(termkey)

  if (termData) {
    proxy.openModal(
      {
        parent: proxy, // 필수
        component: 'TermsModal', // 필수
        componentProps: {
          title: termData.termsName,
          content: termData.termsContents
        },
        modeless: false // 선택
      })
  }
}

onMounted(() => {
  const referrerCode = sessionDataManager.get(SHOP_REFERRER_CODE)

  if (query.planner_user) {
    referrerNumber.value = query.planner_user
    searchReferralNumber()
    isReadonly.value = true
  }

  if (query.referrerCode) {
    referrerNumber.value = query.referrerCode
    searchReferralNumber()
    isReadonly.value = true
  }

  if (referrerCode) {
    referrerNumber.value = referrerCode
    searchReferralNumber()
    isReadonly.value = true
  }
})

</script>
