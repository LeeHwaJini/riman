<!--
  마이페이지 > 내 정보 관리 (환불계좌 관리)
  create by jhchoi
-->
<template>
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
    <div class="plr16">
      <!-- 등록된 환불 계좌가 없을때, 수정 모드 -->
      <template v-if="pageState.refundAccount === null || pageState.isChangeView">
        <div class="top-title-area">
          <h4 class="bold">
            {{ pageState.refundAccount? $t('ORD_RefundChange'): $t('ORD_RefundRegist') }}
          </h4>
        </div>

        <div class="form-area type01 top-form-area">
          <div class="field">
            <span class="input-title">{{ $t('CM_BankUserName') }}</span>
            <RInput v-model="form.bankHolderName" disable class="login-input login-input--id "/>
          </div>

          <div class="field">
            <span class="input-title required">{{ $t('CM_BankName') }}</span>
            <RSelectBox
              v-model="form.bankCode"
              :placeholder-text="$t('CM_SelBank')"
              :options="pageState.bankList"
              option-value="bankCode"
              option-label="bankName"
              class="select-box type04"
            />
          </div>

          <div class="field">
            <span class="input-title required">{{ $t('CM_AccountNumber') }}</span>
            <RInput ref="bankAccountNo" v-model="form.bankAccountNo" :placeholder="$t('CM_OnlyNumber')" class="login-input login-input--id " type="number" />
          </div>

          <div class="field">
            <b class="mb16 block ptb8 primary09-color border-bottom-1-gray100">{{ $t('OP_Agreement2') }}</b>
            <RCheckbox v-model="form.agree" class="checkbox-area type02">
              <span class="gray07-color font-14">[{{ $t('CM_Essential') }}] {{ $t('OP_Agreement2') }}</span>
            </RCheckbox>

            <div class="explanation-text gray num">
              <span class="block font-10 gray05-color">{{ $t('MUI_TermRefundTitle') }}</span>

              <ol class="font-10 gray05-color mt16">
                <li>{{ $t('MUI_TermRefundDesc1') }}</li>
                <li>{{ $t('MUI_TermRefundDesc2') }}</li>
                <li>{{ $t('MUI_TermRefundDesc3') }}</li>
              </ol>
              <br/>
              <span class="block font-10 gray05-color">{{ $t('MUI_TermRefundDesc4') }}</span>
            </div>
          </div>

        </div>

        <div class="bottom-btn">
          <div class="flex-btn-area">
            <RButton class="btn full small type03" :label="$t('CM_Cancel')" @on-click="onCancel" />
            <RButton class="btn full small type02" :label="$t('CM_Save')" @on-click="onSubmit" />
          </div>
        </div>
      </template>

      <!-- 등록된 환불 계좌가 있을때-->
      <template v-else>
        <h6 class="ptb24 bold gray07-color">
          {{ $t('ORD_RefundAccount') }}
        </h6>

        <dl class="order-info-list-area gap16">
          <dt>{{ $t('CM_BankUserName') }}</dt>
          <dd>{{ pageState.refundAccount.bankHolderName }}</dd>

          <dt>{{ $t('CM_BankName') }}</dt>
          <dd>{{ pageState.refundAccount.bankName }}</dd>

          <dt>{{ $t('CM_RefundAccount') }}</dt>
          <dd>{{ pageState.refundAccount.bankAccountNo }}</dd>
        </dl>

        <ul class="explanation-text gray font-14">
          <li>{{ $t('MUI_MUI_RefundAccountDesc5') }}</li>
          <li>{{ $t('MUI_MUI_RefundAccountDesc6') }}</li>
        </ul>

        <div class="bottom-btn">
          <RButton class="btn full small type02" :label="$t('CM_Change')" @click="onChangeView" />
        </div>
      </template>
    </div>

  </div>

</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive, computed } from 'vue'
import { useMainStore } from '@store/mainStore'
import { useRouter } from 'vue-router'
import memberService from '@/http/services/member'
import mypageService from '@/http/services/mypage'

const router = useRouter()
const { proxy } = getCurrentInstance()

const mainStore = useMainStore()
const userInfo = mainStore.getUser

/**
 * 탭 정보
 */
const tabValue = ref('RefundAccount')
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

const form = reactive({
  bankCode: null,
  bankAccountNo: '',
  bankHolderName: '',
  lastName: '',
  firstName: '',
  agree: false
})

const pageState = reactive({
  refundAccount: null,
  bankList: [],
  userRefundBankAccountId: '',
  isChangeView: false
})

onMounted(() => {
  getUserInfo()

  getRefundAccount()
  getBankCodeList()
})

/**
 * 사용자 정보 조회
 */
const getUserInfo = async () => {
  const result = await mypageService.getUserInfo(userInfo.userSeqNo)
  if (result && result.message === 'success') {
    form.bankHolderName = proxy.$nameFormat(result.data.lastName, result.data.firstName)
    form.lastName = result.data.lastName
    form.firstName = result.data.firstName
  }
}

/**
 * 환불계좌 조회
 */
const getRefundAccount = async () => {
  const userId = userInfo.userSeqNo
  const result = await memberService.getRefundAccount(userId)

  if (result) {
    pageState.refundAccount = result.data.bankAccountInfo
    pageState.userRefundBankAccountId = result.data.userRefundBankAccountId
  }
}

/**
 * 은행 조회
 */
const getBankCodeList = async () => {
  const result = await memberService.getBankCodeList()

  if (result) {
    pageState.bankList = result.data
  }
}

/**
 * 취소 버튼 클릭
 */
const onCancel = () => {
  proxy.$confirm(proxy.$t('MUI_ConfRefundCancel'), {
    ok: function () {
      router.push({ name: 'MyPageMain' })
    }
  })
}

const bankAccountNo = ref(null)
const onSubmit = async () => {
  if (form.bankCode === null || form.bankAccountNo === '') {
    proxy.$alert(proxy.$t('ALI_AltCheckBank'), {
      ok: function () {
        setTimeout(() => {
          bankAccountNo.value.focus()
        })
      }
    })
    return
  }

  if (!form.agree) {
    proxy.$alert(proxy.$t('MUI_AltRefundAgree'))
  } else {
    const params = {
      bankCode: form.bankCode,
      accountNumber: form.bankAccountNo,
      accountFirstName: form.firstName,
      accountLastName: form.lastName
    }
    const result = await memberService.postAccountNameAuth(userInfo.userSeqNo, params)
    if (result && result.data.result) {
      if (pageState.refundAccount) {
        upateRefundAccount()
      } else {
        createRefundAccount()
      }
    } else {
      proxy.$alert(result.data.errorMessage)
    }
  }
}

/**
 * 회원 환불계좌 수정
 */
const upateRefundAccount = async () => {
  const params = {
    'bankCode': form.bankCode,
    'bankAccountNo': form.bankAccountNo,
    'bankHolderName': form.bankHolderName,
    'isBankAccountAuth': true
  }
  const response = await memberService.patchBanckAccount(userInfo.userSeqNo, pageState.userRefundBankAccountId, params)
  if (response) {
    proxy.$alert(proxy.$t('MUI_AltRefundUpdate'))
    getRefundAccount()
  }
}

/**
 * 회원 환불계좌 등록
 */
const createRefundAccount = async () => {
  const params = {
    'bankCode': form.bankCode,
    'bankAccountNo': form.bankAccountNo,
    'bankHolderName': form.bankHolderName,
    'isBankAccountAuth': true
  }
  const response = await memberService.postBankAccount(userInfo.userSeqNo, params)
  if (response) {
    proxy.$alert(proxy.$t('MUI_AltRefundUpdate'))
    getRefundAccount()
  }
}

/**
 * 변경하기 버튼 클릭
 */
const onChangeView = () => {
  pageState.isChangeView = true
}
</script>
