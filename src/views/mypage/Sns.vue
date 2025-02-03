<!--
  마이페이지 > 내 정보 관리 (SNS연동)
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
      <div class="top-title-area">
        <h4 class="bold">
          {{ $t('MUI_Sns') }}
        </h4>
        <p class="font-16 gray07-color">
          {{ $t('MUI_SnsDesc1') }}<br/>
          {{ $t('MUI_SnsDesc2') }}
        </p>
      </div>

      <ul class="sns-linking-area mt64">
        <li>
          <div class="icon-text-area">
            <i class="ico kakao-circle" />
            {{ $t('MUI_ConnectKakao') }}
          </div>
          <RSwitch
            v-model="kakaoConnect"
            class="switch type01 gap0"
          />
        </li>
        <li>
          <div class="icon-text-area">
            <i class="ico naver-circle" />
            {{ $t('MUI_ConnectNaver') }}
          </div>
          <RSwitch
            v-model="naverConnect"
            class="switch type01 gap0"
          />
        </li>
        <li>
          <div class="icon-text-area">
            <i class="ico apple-circle" />
            {{ $t('MUI_ConnectApple') }}
          </div>
          <RSwitch
            v-model="appleConnect"
            class="switch type01 gap0"
          />
        </li>
      </ul>
    </div>

  </div>

</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, reactive, computed } from 'vue'
import { useMainStore } from '@store/mainStore'
import mypageService from '@/http/services/mypage'
import { useRouter } from 'vue-router'
import { doKakaoLogin } from '@utils/login'
import SignupAppleModal from '../signup/apple/SignupAppleModal.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()
const mainStore = useMainStore()
const userInfo = mainStore.getUser

/**
 * 탭 정보
 */
const tabValue = ref('Sns')
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

const pageState = reactive({
  isNaverConnect: false,
  isKakaoConnect: false,
  isAppleConnect: false
})

onMounted(() => {
  getSocailAccounts()

  // 네이버 로그인 Callback 설정
  window.addEventListener('message', loginNaverCallback)
})

onBeforeUnmount(() => {
  // 네이버 로그인 Callback 삭제
  window.removeEventListener('message', loginNaverCallback)
})

/**
 * 소셜 계정 조회
 */
const getSocailAccounts = async () => {
  const response = await mypageService.getSocailAccounts(userInfo.userSeqNo)
  if (response && response.message === 'success') {
    response.data.socialConnectingInfoList.forEach((obj) => {
      if (obj.socialType.code === 'NAVER') {
        pageState.isNaverConnect = obj.connected
      } else if (obj.socialType.code === 'KAKAO') {
        pageState.isKakaoConnect = obj.connected
      } else if (obj.socialType.code === 'APPLE') {
        pageState.isAppleConnect = obj.connected
      }
    })
  }
}

/**
 * 카카오 연동 여부
 */
const kakaoConnect = computed({
  get() {
    return pageState.isKakaoConnect
  },
  set(e) {
    pageState.isKakaoConnect = e
    toggleConnect('KAKAO')
  }
})

/**
 * 네이버 연동 여부
 */
const naverConnect = computed({
  get() {
    return pageState.isNaverConnect
  },
  set(e) {
    pageState.isNaverConnect = e
    toggleConnect('NAVER')
  }
})

/**
 * Apple 연동 여부
 */
const appleConnect = computed({
  get() {
    return pageState.isAppleConnect
  },
  set(e) {
    pageState.isAppleConnect = e
    toggleConnect('APPLE')
  }
})

/**
 * sns 연결 관리
 * @param type
 */
const toggleConnect = async (type) => {
  if (type === 'NAVER') { // 네이버 연동
    if (pageState.isNaverConnect) { // 연결
      onLoginNaver()
    } else {
      disConnect(type) // 연결 끊기
    }
  } else if (type === 'KAKAO') { // 카카오 연동
    if (pageState.isKakaoConnect) { // 연결
      onLoginKakao()
    } else { // 연결 끊기
      disConnect(type)
    }
  } else if (type === 'APPLE') {
    if (pageState.isAppleConnect) {
      onLoginApple()
    } else {
      disConnect(type)
    }
  }
}

/**
 * 네이버 간편 로그인
 */
const onLoginNaver = () => {
  setConnectStatus('NAVER', false)

  const naverLoginPop = window.open('/signup/naver/signupNaverModal', 'Naver Login', 'width=550, height=600')
  window.NaverLoginPopClose = () => {
    naverLoginPop.close()
  }
}

/**
 * 카카오 로그인 수행
 */
const onLoginKakao = () => {
  setConnectStatus('KAKAO', false)
  doKakaoLogin(connect)
}

/**
 * Apple 로그인 수행
 */
const onLoginApple = () => {
  setConnectStatus('APPLE', false)

  proxy.openModal({
    parent: proxy,
    component: SignupAppleModal,
    componentProps: {
      callbackEvt: loginAppleCallback
    },
    modeless: false
  })
}

/**
 * apple 간편 로그인 callback
 * @param event
 */
const loginAppleCallback = (event) => {
  const params = {
    id: event.id,
    serviceType: 'APPLE'
  }
  connect(params)
}

/**
 * 연결 상태 설정
 */
const setConnectStatus = (snsType, status) => {
  if (snsType === 'NAVER') {
    pageState.isNaverConnect = status
  } else if (snsType === 'KAKAO') {
    pageState.isKakaoConnect = status
  } else if (snsType === 'APPLE') {
    pageState.isAppleConnect = status
  }
}

/**
 * 연동 끊기
 */
const disConnect = async (snsType) => {
  setConnectStatus(snsType, true)
  proxy.$confirm(proxy.$t('MUI_ConfDisConnect'), {
    okLabel: proxy.$t('MUI_ConfDisConnectOk'),
    cancelLabel: proxy.$t('MUI_ConfDisConnectCancel'),
    cancel: async function async() {
      const params = {
        socialType: snsType
      }
      const result = await mypageService.deleteSocialAccounts(userInfo.userSeqNo, params)
      if (result && result.code === '2000') {
        proxy.$alert(proxy.$t('MUI_ConfDisConnectComplete'))
        setSnsConnect(result) // 연동 결과 화면 세팅
      }

      getSocailAccounts()
    }
  })
}

// 연동 결과 화면 세팅
const setSnsConnect = async (response) => {
  const socialConnectingInfoList = response?.data?.socialConnectingInfoLIst

  if (socialConnectingInfoList?.length > 0) {
    socialConnectingInfoList.forEach((obj) => {
      switch (obj.socialType.code) {
        case 'NAVER':
          pageState.isNaverConnect = obj.connected
          break
        case 'KAKAO':
          pageState.isKakaoConnect = obj.connected
          break
        case 'APPLE':
          pageState.isAppleConnect = obj.connected
          break
      }
    })
  }
}

/**
 * sns 연결
 * @param type
 */
const connect = async (data) => {
  const params = {
    tokenSocial: data.id,
    socialType: data.serviceType
  }
  const result = await mypageService.postSocialAccounts(userInfo.userSeqNo, params)
  if (result) {
    setConnectStatus(data.serviceType, true)
    proxy.$alert(proxy.$t('MUI_AltConnect'))
  }
  getSocailAccounts()
}

// 네이버 callback
const loginNaverCallback = (event) => {
  // 네이버 간편 가입에서 보낸 postMessage가 아닐 경우
  if (event.origin !== import.meta.env.VITE_APP_BASE_URL || !event.data.sendTo || event.data.sendTo !== 'sns easy login' || typeof event.data !== 'object') {
    return
  }

  if (event.data.status) { // 사용자 로그인이 true
    const params = {
      id: event.data.userInfo.id,
      serviceType: event.data.userInfo.serviceType
    }
    connect(params)
  } else { // 사용자 로그인이 false
    console.error(event.data.errorMessage) // 오류 안내 메시지 콘솔에 출력
  }
}

</script>
