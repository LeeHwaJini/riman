<!--
  외국인 재심사 (외부링크)
  create by jhchoi
-->
<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t('NAV_SignupReject') }}</h3>
    </div>

    <template v-if="pageState.isChangeReject === true">
      <q-form ref="rejectForm" :greedy="true" autocomplete="off">
        <dl class="order-info-list-area left-g-rignt-b-list plr16 mt24">
          <dt>{{ $t('CM_FirstName') }}</dt>
          <dd>{{ pageState.userName }}</dd>

          <dt>{{ $t('CM_BirthDate') }}</dt>
          <dd>{{ formatDate(pageState.birthDate,'YYYY.MM.DD') }}</dd>

          <dt>{{ $t('SRJ_FailReason') }}</dt>
          <dd>{{ pageState.failReason }}</dd>

          <dt>{{ $t('SRJ_LimitDate') }}</dt>
          <dd>{{ pageState.limitDateTime }} {{ $t('SRJ_Until') }}</dd>
        </dl>

        <div v-if="pageState.ynFailForeignerRegCardFront" class="form-area type01 plr16 mt32">
          <div class="field">
            <span class="input-title required">{{ $t('SIG_ForeignerRegCardFront') }}</span>
            <RUploadFile
              v-model="form.foreignerRegCardFront"
              accept=".jpg,.jpeg,.png"
              :placeholder-text="$t('CM_UploadFile')"
              :rules="[val => !!val || $t('SIG_ValidForeignerRegCardFront') ]"
              @update:model-value="(val) =>onFileChange('front', val)"
            />
          </div>
        </div>

        <div v-if="pageState.ynFailForeignerRegCardBack" class="form-area type01 plr16 mt32">
          <div class="field">
            <span class="input-title required">{{ $t('SIG_ForeignerRegCardBack') }}</span>
            <RUploadFile
              v-model="form.foreignerRegCardBack"
              accept=".jpg,.jpeg,.png"
              :placeholder-text="$t('CM_UploadFile')"
              :rules="[val => !!val || $t('SIG_ValidForeignerRegCardBack') ]"
              @update:model-value="(val) => onFileChange('back', val)"
            />
          </div>
        </div>

        <div v-if="pageState.ynFailBankbook" class="form-area type01 plr16 mt32">
          <div class="field">
            <span class="input-title required">{{ $t('SIG_BankImage') }}</span>
            <RUploadFile
              v-model="form.bankbook"
              accept=".jpg,.jpeg,.png"
              :placeholder-text="$t('CM_UploadFile')"
              :rules="[val => !!val || $t('SIG_ValidBankImage') ]"
              @update:model-value="(val) => onFileChange('bank', val)"
            />
          </div>
        </div>

        <div class="bottom-btn">
          <RButton class="btn full small type02" :label="$t('CM_Save')" @on-click="onSubmit" />
        </div>
      </q-form>
    </template>

    <template v-if="pageState.isChangeReject === false">
      <h4 class="bold text-center primary09-color mt96">{{ $t('SRJ_FailDesc1') }}<br />{{ $t('SRJ_FailDesc2') }}</h4>
      <p class="text-center mt12 font-14 medium gray05-color">{{ $t('SRJ_FailDesc3') }}<br />
        {{ $t('SRJ_FailDesc4') }}<br />
        {{ $t('SRJ_FailDesc5') }}<br /><br />
        {{ $t('SRJ_FailDesc6') }}<br />
        {{ $t('SRJ_FailDesc7') }}</p>

      <div class="bottom-btn">
        <RButton class="btn full small type02" :label="$t('SRJ_ReApply')" @on-click="router.push('/signup/selectType')" />
      </div>
    </template>

  </div>

</template>

<script setup>
import { onMounted, reactive, ref, getCurrentInstance } from 'vue'
import memberService from '@/http/services/member'
import mypageService from '@/http/services/mypage'
import { useRoute, useRouter } from 'vue-router'
import { formatDate, nowDate, isSameOrAfter } from '@/utils/dateFormat'

const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()

onMounted(() => {
  getRejectInfo()
})

const pageState = reactive({
  userId: '',
  userAuditId: '',
  userName: '',
  birthDate: '',
  failReason: '',
  limitDateTime: '',
  ynFailBankbook: '',
  ynFailForeignerRegCardFront: '',
  ynFailForeignerRegCardBack: '',
  isChangeReject: ''
})

const form = reactive({
  foreignerRegCardFront: null,
  foreignerRegCardFrontUrl: null,
  foreignerRegCardFrontFileName: null,
  foreignerRegCardBack: null,
  foreignerRegCardBackUrl: null,
  foreignerRegCardBackFileName: null,
  bankbook: null,
  bankbookUrl: null,
  bankbookFileName: null
})

/**
 * 날짜 문자열 변환
 */
const convertDateString = (str) => {
  const [datePart, timePart] = str.split(' ')
  const [year, month, day] = datePart.match(/\d+/g)

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${timePart}`
}

/**
 * 외국인 가입/전환 재심사 정보 조회(uuid)
 */
const getRejectInfo = async () => {
  const uuid = route.params.uuid
  const response = await mypageService.getRejectInfo(uuid)
  if (response && response.code === '2000') {
    pageState.userId = response.data.userId
    pageState.userAuditId = response.data.userAuditId
    pageState.userName = response.data.userName
    pageState.birthDate = response.data.birthDate
    pageState.failReason = response.data.failCode.text
    pageState.limitDateTime = response.data.limitDateTime
    pageState.ynFailBankbook = response.data.ynFailBankbook
    pageState.ynFailForeignerRegCardFront = response.data.ynFailForeignerRegCardFront
    pageState.ynFailForeignerRegCardBack = response.data.ynFailForeignerRegCardBack

    const parsedDate = convertDateString(pageState.limitDateTime)
    pageState.isChangeReject = isSameOrAfter(formatDate(parsedDate, 'YYYY-MM-DD'), nowDate('YYYY-MM-DD'))
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
 * 재가입 심사 전송
 */
const rejectForm = ref(null)
const onSubmit = async () => {
  if (!await rejectForm.value.validate()) {
    proxy.$alert(proxy.$t('SRJ_ValidateImage'))
  } else {
    const params = {
      userId: pageState.userId,
      userAuditId: pageState.userAuditId,
      ynFailBankbook: pageState.ynFailBankbook,
      bankbookUrl: form.bankbookUrl,
      bankbookFileName: form.bankbookFileName,
      ynFailForeignerRegCardFront: pageState.ynFailForeignerRegCardFront,
      foreignerRegCardFrontUrl: form.foreignerRegCardFrontUrl,
      foreignerRegCardFrontFileName: form.foreignerRegCardFrontFileName,
      ynFailForeignerRegCardBack: pageState.ynFailForeignerRegCardBack,
      foreignerRegCardBackUrl: form.foreignerRegCardBackUrl,
      foreignerRegCardBackFileName: form.foreignerRegCardBackFileName
    }
    const result = await mypageService.postRegistRejectInfo(params)
    if (result) {
      proxy.$alert(proxy.$t('SRJ_AltComplete'), {
        ok: function () {
          router.push({ path: '/' })
        }
      })
    }
  }
}
</script>
