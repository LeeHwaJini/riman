<!--
  카드인증 & 휴대폰 인증
  create by jhchoi
-->
<template>
  <!--  카드 & 휴대폰 인증 버튼 사용 시 -->
  <div v-if="type === 'multiBtn'" class="">
    <button class="btn mo-slide-btn" @click="modalOpen"><span class="slide-icon"></span></button>
    <div class="top-text-area pointer" @click="modalOpen">
      {{ $t('CARD_desc') }}
      <i class="ico arrow-top-type02-m" />
    </div>
    <div class="flex-btn-area">
      <CardCertificate btn-class="btn full small type03" :btn-text="$t('CARD_btn')" type="multiBtn" :user-number="props.userNumber" @on-success="onCertSuccess" />
      <RButton class="btn full small type02" :label="$t('CM_CertificateMobile')" @click="onCertClick" />
    </div>
  </div>

  <!--  휴대폰 인증 버튼 사용 시 -->
  <div v-if="type === 'inner'" class="ph-certificate-btn-area" >
    <RButton class="bg_lightGray" :class="btnClass" :disable="btnDisabled" @on-click="onCertClick">
      <template #content>
        {{ btnText }} <q-icon name="chevron_right" />
      </template>
    </RButton>
  </div>

  <!--  일반 버튼 사용 시 -->
  <div v-if="type === 'innerBtn'" >
    <RButton :class="btnClass" :label="btnText" :disable="btnDisabled" type="innerBtn" @click="onCertClick" />
  </div>

  <NiceModal ref="niceModal"/>

  <q-dialog v-model="dialog" position="bottom" class="certificate-bottom-modal">
    <q-card class="">
      <button class="btn mo-slide-btn" @click="modalClose"><span class="slide-icon"></span></button>

      <h4 class="tite primary09-color mt16">{{ $t('CARD_title1') }}<br/><b>{{ $t('CARD_title2') }}</b></h4>

      <ul class="certificate-confirm-text-area mt24 mb32">
        <li>
          {{ $t('CARD_desc1') }}
          <div class="font-12 error-color">{{ $t('CARD_desc2') }}</div>
        </li>
        <li>{{ $t('CARD_desc3') }}</li>
        <li>
          {{ $t('CARD_desc4') }}
          <div class="font-12 error-color">{{ $t('CARD_desc5') }}</div>
        </li>
        <li class="pre-line" v-html="$t('CARD_desc6')" />
      </ul>

      <div class="popup-bottom-btn flex-btn-area">
        <CardCertificate btn-class="btn full small type03" :btn-text="$t('CARD_btn')" type="multiBtn" @on-success="onCertSuccess" />
        <RButton class="btn full small type02" :label="$t('CM_CertificateMobile')" @click="onCertClick" />
      </div>
    </q-card>

  </q-dialog>

</template>

<script setup>
import { getCurrentInstance, reactive, onBeforeUnmount, onMounted, ref } from 'vue'
import http from '@/utils/http'
import { useMainStore } from '@store/mainStore'
import { i18n } from '@utils/i18n'
const { proxy } = getCurrentInstance()
import { isLogin } from '@/utils/login'

const emit = defineEmits(['onSuccess', 'onFail', 'onCheckEvent'])
const props = defineProps({
  // Type : inner|innerBtn
  type: {
    type: String,
    default: 'inner'
  },
  // 버튼 Label
  btnText: {
    type: String,
    default: () => i18n.global.t('CM_MobileCert')
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
  beforeAlert: {
    type: String,
    default: ''
  },
  userNumber: {
    type: String,
    default: ''
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handlePostMessage)
})

/**
 * 휴대폰 본인인증 버튼 클릭
 */
const onCertClick = () => {
  if (props.beforeAlert) {
    proxy.$alert(props.beforeAlert, {
      ok: function () {
        handleCert()
      }
    })
  } else {
    handleCert()
  }
}

/**
 * 휴대폰 본인 인증
 */
const handleCert = async () => {
  window.addEventListener('message', handlePostMessage) // postMessage
  try {
    const certSuccessUrl = '/cert/success'
    const certErrorUrl = '/cert/error'

    const params = {
      successUrl: `${import.meta.env.VITE_APP_BASE_URL + certSuccessUrl}`,
      errorUrl: `${import.meta.env.VITE_APP_BASE_URL + certErrorUrl}`
    }
    const resResult = await http().url('/member/certification/v1/public/site-info').param(params).post()
    proxy.$refs.niceModal.showModal(resResult.data)
  } catch (e) {
    console.error(e)
  }
}

/**
 * 휴대폰 본인 인증 > 인증 결과 Callback
 * @param event
 */
const handlePostMessage = async (event) => {
  let isSuccess = false
  let resResult = null

  try {
    console.log('handlePostMessage  ===> ' + event)

    if (event.origin !== import.meta.env.VITE_APP_BASE_URL ||
           !event.data ||
           typeof event.data !== 'string') {
      return
    }
    if (event.data.includes('CERTSUCCESS')) {
      const [type, encodeData] = event.data.split(' ')
      let params = {
        encodeData: encodeData
      }

      if (props.userNumber) {
        params = Object.assign(params, { 'userNumber': props.userNumber })
      }
      if (props.certType === 'nonMember') {
        // 비회원 본인인증 여부 판단
        resResult = await http().url(`/member/certification/v1/public/nonMember/private-info`).param(params).post()
        if (resResult.data) {
          isSuccess = true
        }
      } else if (isLogin()) {
        // 본인인증 여부 판단 (로그인 유저용)
        resResult = await http().url(`/member/certification/v1/private-info`).param(params).post()
        if (resResult.data) {
          isSuccess = true
        }
      } else {
        // 본인인증 여부 판단 (비로그인)
        resResult = await http().url(`/member/certification/v1/public/private-info`).param(params).post()
        if (resResult.data) {
          isSuccess = true
        }
      }
    }
  } catch (e) {
    console.error(e)
  }
  certResult(isSuccess, resResult.data)
}

/**
 * 휴대폰 본인 인증 > 본인 인증 결과
 * @param event
 */
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

/**
 * 신용카드 인증 모달
 */
const dialog = ref(false)

const modalOpen = () => {
  dialog.value = true
}
const modalClose = () => {
  dialog.value = false
}

/**
 * 신용카드 본인 인증 성공
 */
const onCertSuccess = (data) => {
  emit('onSuccess', data)
}

</script>
