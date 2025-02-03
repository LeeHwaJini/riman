<!--
  환불 계좌 등록 추가 modal ( pc: 화면 가운데 출력, tablet: 화면 하단 출력)
  create by hwajin
-->

<template>
  <div class="form-area type01 modal-form-area">
    <div class="field">
      <span class="input-title">{{ $t('CMM_BankUser') }}</span>
      <RInput
        ref="input"
        v-model="registForm.bankHolderName"
        :placeholder="$t('ALI_PlaceholderBankUserName')"
        :readonly="props.readOnly"
        class="login-input login-input--id"
      />
    </div>

    <div class="field">
      <span class="input-title">{{ $t('CMM_Bank') }}</span>
      <RSelectBox
        v-model="registForm.bankCode"
        :placeholder-text="$t('CMM_SelectBank')"
        :options="bankList"
        option-value="bankCode"
        option-label="bankName"
        class="select-box type04"
      />
    </div>

    <div class="field">
      <span class="input-title">{{ $t('CM_AccountNumber') }}</span>
      <RInput
        ref="input"
        v-model="registForm.bankAccountNo"
        :placeholder="$t('ALI_PlaceholderBankAccountNo')"
        class="login-input login-input--id"
        @update:model-value="(value) => registForm.bankAccountNo = value.replace(/\D/g, '')"
      />
    </div>
    <div class="field font-14 gray07-color">
      {{ $t('CMM_AccDesc1') }}
    </div>

    <div class="field flex align-center justify-between">
      <RCheckbox v-model="checkbox" class="checkbox-area type02">
        <span class="gray07-color">[{{ $t('CM_Essential') }}] {{ $t('MUI_TermRefundTitle') }}</span>
      </RCheckbox>
      <RButton class="btn type13" :label="toggleBtnText" @on-click="onPersonalInformationToggle" />
    </div>

    <div v-if="PersonalInformation" class="field explanation-text gray">
      <span class="explanation-title font-10">{{ $t('MUI_TermRefundTitle') }}</span>
      <ol class="font-10">
        <li>{{ $t('MUI_TermRefundDesc1') }}</li>
        <li>{{ $t('MUI_TermRefundDesc2') }}</li>
        <li>{{ $t('MUI_TermRefundDesc3') }}</li>
      </ol>
      <br>
      <span class="explanation-importance-text font-10">{{ $t('MUI_TermRefundDesc4') }}</span>
    </div>
  </div>

  <div class="popup-bottom-area">
    <div class="popup-bottom-btn">
      <RButton v-if="registForm.isBankAccountAuth" class="btn full small type02" :label="props.pageState.isBankAccountAuth ? $t('ORD_RefundChange') : $t('ORD_RefundRegist')" @click="onHandleBankAccount" />
      <RButton v-else class="btn full small type02" :label="$t('CMM_AccCertification')" @click="postBankAuth" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, getCurrentInstance, defineProps, defineEmits } from 'vue'
import { useMainStore } from '@store/mainStore'
import memberService from '@/http/services/member'

const props = defineProps({
  pageState: {
    type: Object,
    default: null
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  onUpdate: {
    type: Function,
    default: () => {}
  }
})

const emit = defineEmits(['hide'])
const { proxy } = getCurrentInstance()

const mainStore = useMainStore()
const userInfo = mainStore.userInfo

const toggleBtnText = ref(proxy.$t('CM_ToDetail'))
const PersonalInformation = ref(false)
const checkbox = ref(false)
const bankList = ref([])

const registForm = reactive({
  bankCode: null,
  bankAccountNo: '',
  bankHolderName: userInfo.fullName,
  isBankAccountAuth: false,
  connectingInformation: null,
  salesOrderNumber: null,
  memo: ''
})

const onPersonalInformationToggle = () => {
  PersonalInformation.value = !PersonalInformation.value

  if (PersonalInformation.value) {
    toggleBtnText.value = proxy.$t('CM_Close')
  } else {
    toggleBtnText.value = proxy.$t('CM_ToDetail')
  }
}

const getBankCodeList = async () => {
  const result = await memberService.getBankCodeList()

  if (result) {
    bankList.value = result.data
  }
}

const postBankAuth = async () => {
  if (!registForm.bankCode) {
    await proxy.$alert(proxy.$t('CMM_AccDesc3'))
  } else if (registForm.bankAccountNo === '') {
    await proxy.$alert(proxy.$t('CMM_AccDesc4'))
  } else if (!checkbox.value) {
    await proxy.$alert(proxy.$t('CMM_AccDesc2'))
  } else {
    const params = {
      bankCode: registForm.bankCode,
      accountNumber: registForm.bankAccountNo,
      accountFirstName: userInfo.firstName,
      accountLastName: userInfo.lastName
    }
    const result = await memberService.postAccountNameAuth(props.pageState.userId, params)

    if (result) {
      if (result.data.result) {
        registForm.isBankAccountAuth = result.data.result
        await proxy.$alert(proxy.$t('CMM_CertificationSuccess'))
      } else {
        await proxy.$alert(result.data.errorMessage)
      }
    }
  }
}

const onHandleBankAccount = () => {
  if (props.pageState.isBankAccountAuth) {
    patchBanckAccount()
  } else {
    postBankAccount()
  }
}

const postBankAccount = async () => {
  if (!registForm.bankCode) {
    await proxy.$alert(proxy.$t('CMM_AccDesc3'))
  } else if (registForm.bankAccountNo === '') {
    await proxy.$alert(proxy.$t('CMM_AccDesc4'))
  } else if (!checkbox.value) {
    await proxy.$alert(proxy.$t('CMM_AccDesc2'))
  } else {
    const params = {
      bankCode: registForm.bankCode,
      bankAccountNo: registForm.bankAccountNo,
      bankHolderName: registForm.bankHolderName,
      isBankAccountAuth: registForm.isBankAccountAuth,
      connectingInformation: registForm.connectingInformation,
      salesOrderNumber: registForm.salesOrderNumber,
      memo: registForm.memo
    }
    const result = await memberService.postBankAccount(props.pageState.userId, params)

    if (result) {
      await proxy.$alert(proxy.$t('CMM_AccRegSuccess'))
      await props.onUpdate()
      emit('hide')
    }
  }
}

const patchBanckAccount = async () => {
  if (!registForm.bankCode) {
    await proxy.$alert(proxy.$t('CMM_AccDesc3'))
  } else if (registForm.bankAccountNo === '') {
    await proxy.$alert(proxy.$t('CMM_AccDesc4'))
  } else if (!checkbox.value) {
    await proxy.$alert(proxy.$t('CMM_AccDesc2'))
  } else {
    const params = {
      bankCode: registForm.bankCode,
      bankAccountNo: registForm.bankAccountNo,
      bankHolderName: registForm.bankHolderName,
      isBankAccountAuth: registForm.isBankAccountAuth,
      connectingInformation: registForm.connectingInformation,
      salesOrderNumber: registForm.salesOrderNumber,
      memo: registForm.memo
    }
    const result = await memberService.patchBanckAccount(props.pageState.userId, props.pageState.userRefundBankAccountId, params)

    if (result) {
      await proxy.$alert(proxy.$t('CMM_AccEditSuccess'))
      await props.onUpdate()
      emit('hide')
    } else {
      emit('hide')
    }
  }
}

const getDetailBankAccount = async () => {
  const userId = props.pageState.userId
  const userRefundBankAccountId = props.pageState.userRefundBankAccountId

  const result = await memberService.getDetailBankAccount(userId, userRefundBankAccountId)

  if (result) {
    registForm.bankCode = result.data.bankAccountInfo.bankCode
    registForm.bankAccountNo = result.data.bankAccountInfo.bankAccountNo
  }
}

onMounted(() => {
  if (props.pageState.userRefundBankAccountId) {
    getDetailBankAccount()
  }
  getBankCodeList()
})
</script>
