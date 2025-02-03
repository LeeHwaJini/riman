<!--
  수당 계좌 등록 추가 modal ( pc: 화면 가운데 출력, tablet: 화면 하단 출력)
  create by hwajin
-->

<template>
  <div class="form-area type01 modal-form-area">
    <div class="field">
      <span class="input-title">{{ $t('CM_BankUserName') }}</span>
      <RInput
        ref="input"
        v-model="form.legalName"
        :placeholder="$t('ALI_PlaceholderBankUserName')"
        class="login-input login-input--id"
        disable
      />
    </div>

    <div class="field">
      <span class="input-title">{{ $t('CM_BankName') }}</span>
      <RSelectBox
        v-model="form.bankCode"
        :placeholder-text="$t('CM_SelBank')"
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
        v-model="form.bankAccountNo"
        :placeholder="$t('ALI_PlaceholderBankAccountNo')"
        class="login-input login-input--id"
        type="number"
      />
    </div>
    <div class="field font-14 gray07-color">
      {{ $t('ALI_AllowanceRegDesc') }}
    </div>

  </div>

  <div class="popup-bottom-area">
    <div class="popup-bottom-btn">
      <RButton class="btn full small type01" :label="$t('CM_Cancel')" @on-click="onCancle"/>
      <RButton class="btn full small type02" :label="$t('ALI_ChangeAllowance')" @on-click="onchangeAccount"/>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, defineProps, getCurrentInstance } from 'vue'
import memberService from '@/http/services/member'

const emit = defineEmits(['hide'])
const { proxy } = getCurrentInstance()

const props = defineProps({
  pageState: {
    type: Object,
    default: null
  }
})

const bankList = ref([])

const form = reactive({
  legalName: '',
  bankCode: null,
  bankAccountNo: ''
})

onMounted(() => {
  if (props.pageState.legalName) {
    form.legalName = props.pageState.legalName
  }

  if (props.pageState.bankCode) {
    form.bankCode = props.pageState.bankCode
  }

  if (props.pageState.bankAccountNo) {
    form.bankAccountNo = props.pageState.bankAccountNo
  }
  getBankCodeList()
})

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
 * 계좌 변경
 */
const onchangeAccount = () => {
  props.pageState.fnChangeAccount(form.bankCode, form.bankAccountNo)
}

const onCancle = () => {
  proxy.$alert(proxy.$t('ALI_AltCancelAllowance'), {
    title: proxy.$t('ALI_AltCancelAllowanceTitle'),
    ok: function () {
      emit('hide')
    }
  })
}
</script>
