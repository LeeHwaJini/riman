<!--
  카드 본인 인증
  create by jhchoi
-->
<template>
  <!--  카드 & 휴대폰 인증 버튼 사용 시 -->
  <template v-if="type === 'multiBtn'" >
    <RButton :class="btnClass" :label="btnText" :disabled="btnDisabled" @click="onCertClick" />
  </template>

  <!--  인증 버튼 사용 시 -->
  <div v-if="type === 'inner'" class="ph-certificate-btn-area">
    <RButton class="bg_lightGray" @on-click="onCertClick">
      <template #content>
        {{ $t('CM_CardCert') }} <q-icon name="chevron_right" />
      </template>
    </RButton>
  </div>

  <!--  일반 버튼 사용 시 -->
  <div v-if="type === 'innerBtn'" >
    <RButton :class="btnClass" :label="btnText" :disabled="btnDisabled" @click="onCertClick" />
  </div>

  <CardCertModal ref="cardCertModal"/>
</template>

<script setup>
import { getCurrentInstance, ref, onBeforeUnmount, reactive } from 'vue'
import http from '@/utils/http'
import { isLogin } from '@/utils/login'

const { proxy } = getCurrentInstance()

const baseUrl = import.meta.env.VITE_APP_BASE_URL
const cpCode = import.meta.env.VITE_CIVS_KEY // 회원사 거래번호

const authToken = reactive({
  baseUrl: '',
  token: ''
})

import { i18n } from '@utils/i18n'

const emit = defineEmits(['onSuccess', 'onFail'])
const props = defineProps({
  // Type : inner|innerBtn
  type: {
    type: String,
    default: 'inner'
  },
  // 버튼 Label
  btnText: {
    type: String,
    default: () => i18n.global.t('CM_CardCert')
  },
  // 버튼 Class
  btnClass: {
    type: String,
    default: 'btn btn--submit'
  },
  // 버튼 disabled
  btnDisabled: {
    type: Boolean,
    default: false
  },
  // 본인 인증 Type: nonMember|default
  certType: {
    type: String,
    default: ''
  },
  userNumber: {
    type: String,
    default: ''
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('message', civsHandlePostMessage)
})

/**
 * 신용카드 본인 인증 버튼 클릭
 */
const onCertClick = async () => {
  window.addEventListener('message', civsHandlePostMessage) // postMessage

  try {
    const params = {
      retUrl: `${baseUrl}/cardcert/result`,
      cpCode: cpCode,
      nr: false // 리다이렉트 설정, 앱에서 웹뷰로 연동 시 true 권장
    }

    const result = await http().url('/member/certification/v1/public/authToken').param(params).post()
    console.log('resResult', result) // cpParam, certToken 생성
    authToken.baseUrl = result.data.baseUrl
    authToken.token = result.data.authToken
    proxy.$refs.cardCertModal.showModal(result.data)
  } catch (e) {
    console.error(e)
  }
}

// 인증 결과 Callback
const civsHandlePostMessage = async (event) => {
  let isSuccess = false
  let result = null

  try {
    if (event.origin !== baseUrl ||
        !event.data ||
        typeof event.data !== 'string') {
      return
    }
    if (event.data.includes('CARDSUCCESS')) {
      const [type, txSn, retCd, cpParam, cardTp] = event.data.split('_')

      const params = {
        txSn: txSn,
        cpCode: cpCode
      }

      const resResult = await http().url(authToken.baseUrl + `/auth/result`).param(params).get()

      let paramsV2 = {
        resData: resResult.resData,
        authToken: authToken.token,
        txSn: resResult.txSn,
        retCd: retCd,
        cpParam: cpParam
      }

      if (props.userNumber) {
        paramsV2 = Object.assign(paramsV2, { 'userNumber': props.userNumber })
      }

      if (isLogin()) {
        result = await http().url(`/member/certification/v1/result`).param(paramsV2).post()
      } else {
        result = await http().url(`/member/certification/v1/public/result`).param(paramsV2).post()
      }

      if (result.data) {
        isSuccess = true
      }
      certResult(isSuccess, result?.data)
    }
  } catch (e) {
    console.error(e)
  }
}

// 본인 인증 결과
const certResult = async (isSuccess, data) => {
  if (isSuccess) {
    await proxy.$alert(proxy.$t('ALT_Certification'), {
      ok: function () {
        emit('onSuccess', data)
      }
    })
  } else {
    emit('onFail')
  }
}
</script>
