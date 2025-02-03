<!--
  로그인
-->
<template>
  <div v-if="isSSO" class="loading">
    <img src="@assets/images/icons/icon_loading.svg">
  </div>
  <div v-else>
    <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmitLogin">
      <div class="signup-wrap max-width-wrap">
        <div class="signup-video-bg">
          <video class="video-content" autoplay muted loop playsinline>
            <source src="@assets/video/signin_bg.mp4" type="video/mp4" />
          </video>
        </div>
        <div class="login-title-area">
          <h3>{{ $t('NAV_Login') }}</h3>
        </div>

        <div class="login-form-area form-area type01 ">
          <div class="field">
            <span class="input-title">{{ $t('CM_UserNumber') }}</span>
            <RInput
              ref="userNumberRef"
              v-model.trim="form.userNumber"
              :placeholder="$t('LOG_ValidUserNumber')"
              class="login-input login-input--id"
              type="number"
              :rules="[ validate.isValidUserNumber ]"
            />

          </div>

          <div class="field">
            <span class="input-title">{{ $t('CM_Password') }}</span>
            <RInput
              ref="pwRef"
              v-model.trim="form.password"
              :placeholder="$t('LOG_ValidPassword')"
              type="togglePassword"
              :rules="[ validate.isValidPassword ]"
              class="login-input"
            />

          </div>
        </div>

        <div class="checkbox-area type02 mb20">
          <RCheckbox v-model="isAutoLogin">
            <span>{{ $t('LOG_AutoLogin') }}</span>
          </RCheckbox>

          <RCheckbox v-model="isUserNumber">
            <span>{{ $t('LOG_SaveUserNumber') }}</span>
          </RCheckbox>
        </div>

        <RButton class="btn type02 full large" :label="$t('NAV_Login')" type="submit"/>

        <ul class="find-move-btn-area">
          <li @click="$router.push('/findAccount')">{{ $t('LOG_FindAccount') }}</li>
          <li @click="$router.push('/resetPassword')">{{ $t('LOG_RestPassword') }}</li>
        </ul>

        <div class="login-method-area">
          <span class="text">{{ $t('LOG_SnsLogin') }}</span>

          <ul class="login-sns-btn-area sns-btn-area">
            <li>
              <RButton class="kakao-btn-area" @click="onKakaoLogin">
                <template #content>
                  <i class="ico kakao" />
                </template>
              </RButton>
            </li>
            <li>
              <RButton @on-click="onNaverLogin">
                <template #content>
                  <i class="ico naver" />
                </template>
              </RButton>
            </li>
            <li>
              <RButton class="apple-btn-area" @on-click="onAppleLogin">
                <template #content>
                  <i class="ico apple" />
                </template>
              </RButton>
            </li>
          </ul>

          <b class="login-bottom-accout-text" @click="$router.push('/signup/selectType')">{{ $t('LOG_BottomAccountText') }}</b>

          <div class="login-move-btn-area">
            <span>{{ $t('LOG_NonMemberOrder') }}</span>
            <b @click="onOpenGuestOrderModal">{{ $t('LOG_CheckNonMemberOrder') }}</b>
          </div>
        </div>
        <responsive-modal
          ref="nonMemberOrder"
          :title="$t('LOG_SearchNonMemberOrder')"
        >
          <template #description>
            <p class="text-area">{{ $t('LOG_CertificateNonMemberOrder1') }}<br>{{ $t('LOG_CertificateNonMemberOrder2') }}</p>
            <Certificate
              :cert-type="'nonMember'"
              @on-success="onCertSuccess"
              @on-fail="onCertFail"
            />
          </template>
        </responsive-modal>
      </div>
    </q-form>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount, reactive } from 'vue'
import { useMainStore } from '@store/mainStore'
import validate from '@/utils/validate'
import { localDataManager, sessionDataManager, cookieDataManager, DATA_LOGIN_ID, DATA_AUTO_LOGIN, ID_REFESH_TOKEN_KEY, CART_NO_AUTH, SIGNUP_CART, MIGRATE_INFO } from '@utils/dataManager'
import { saveToken, saveRefreshToken, saveLocalRefreshToken } from '@/utils/token'
import { doKakaoLogin } from '@utils/login'
import cartService from '@/http/services/cart'
import { useCartStore } from '@/store/cartStore'
import { changeLocale } from '@utils/i18n'
import { useRouter, useRoute } from 'vue-router'
import memberService from '@/http/services/member'
import SignupAppleModal from '../signup/apple/SignupAppleModal.vue'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()

const form = reactive({
  userNumber: '',
  password: ''
})
const userNumberRef = ref(null)
const pwRef = ref(null)

const isUserNumber = ref(false)
const isAutoLogin = ref(false)

const mainStore = useMainStore()
const postNormalCart = cartService.postNormalCart()
const cartStore = useCartStore()

const isSSO = ref(false)

onMounted(() => {
  init()

  // SSO 접속
  ssoAccess()

  // 네이버 로그인 Callback 설정
  window.addEventListener('message', loginNaverCallback)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', loginNaverCallback)
})

const init = () => {
  form.userNumber = localDataManager.getDecrypt(DATA_LOGIN_ID) // 회원번호 저장 (1년 유지)
  const autoLogin = cookieDataManager.get(DATA_AUTO_LOGIN) // 자동 로그인 저장(한달 유지)

  isUserNumber.value = !!form.userNumber
  isAutoLogin.value = !!autoLogin

  // 회원가입 완료 -> 로그인 페이지로 이동 시 회원번호 입력
  const { userNumber } = route.params
  if (userNumber) {
    form.userNumber = userNumber
  }
}

const ssoAccess = async () => {
  const boInfo = route.query
  if (Object.keys(boInfo).length > 0) {
    if (boInfo.accessType === 'bo') {
      isSSO.value = true
      await ssoBoAccess(boInfo)
    } else if (boInfo.accessType === 'rbo') {
      isSSO.value = true
      await ssoRboAccess(boInfo)
    }
  }
}
// RBO SSO 접속
const ssoRboAccess = async (boInfo) => {
  // 자동 로그인, 아이디 저장 초기화
  const storeUserId = localDataManager.get(DATA_LOGIN_ID)

  if (storeUserId && (storeUserId !== boInfo.user_id)) { // store에 저장된 사용자 순번이 다를 경우 초기화
    localDataManager.remove(DATA_LOGIN_ID)
    await clearAutoLogin()
  }

  await saveToken(boInfo.accessToken)
  await saveRefreshToken(boInfo.refreshToken)
  await changeLocale(boInfo.lang)
  await mainStore.getMe()

  // 장바구니 조회
  await cartService.getCart()

  // 알림 화면 이동
  if (boInfo.type === 'notice') {
    router.push('/notification/rbo')
  } else {
    // 메인 화면 이동
    router.push('/')
  }
}

// backoffice SSO 접속
const ssoBoAccess = async (boInfo) => {
  await saveToken(boInfo.accessToken)
  await saveRefreshToken(boInfo.refreshToken)
  await mainStore.getMe()

  // 자동 로그인, 아이디 저장 초기화
  const storeUserId = localDataManager.get(DATA_LOGIN_ID)

  if (storeUserId && (storeUserId !== boInfo.user_id)) { // store에 저장된 사용자 순번이 다를 경우 초기화
    localDataManager.remove(DATA_LOGIN_ID)
    clearAutoLogin()
  }

  // 장바구니 조회
  await cartService.getCart()

  // 메인 화면 이동
  router.push('/')
}

/**
 * 로그인 버튼 클릭
 */
const onSubmitLogin = async () => {
  const paramsNM = {
    'userNumber': form.userNumber,
    'password': form.password
  }
  const resultNM = await memberService.postMigrateInfo(paramsNM)
  const isMigrate = resultNM.data?.migrateUserYn && !resultNM.data?.migrateCompleteYn
  if (resultNM && isMigrate) {
    const migrateInfo = {
      userNumber: form.userNumber,
      userType: resultNM.data.userType.code,
      referralUserNumber: resultNM.data.referralUserNumber,
      referralName: resultNM.data.referralName,
      referralRegionCode: resultNM.data.regionCode.text,
      referralBranch: resultNM.data.branch,
      draftMigrateUserYn: resultNM.data.draftMigrateUserYn
    }
    sessionDataManager.set(MIGRATE_INFO, JSON.stringify(migrateInfo))
    router.push({ name: 'MigrateMain' })
  } else {
    const params = {
      grant_type: 'password',
      userNumber: form.userNumber,
      password: form.password
    }
    // 로그인 수행
    onLogin(params)
  }
}

/**
 * 로그인 실행
 * @param params
 */
const onLogin = async (params) => {
  const result = await mainStore.onLogin(params)

  if (result) {
    proxy.$alert(proxy.$t('LOG_Welcome', { name: result.user_name }), {
      ok: function () {
        const redirect = route?.query?.redirect || '/'
        router.push(redirect)
      }
    })
    // 회원가입 완료 페이지에서 startKit 상품 장바구니 추가
    addSignupCartFn()

    // 회원번호 저장
    handleSaveId()

    // 자동 로그인
    handleAutoLogin(result)

    // 장바구니 조회
    await cartService.getCart()

    // 로그인 시, 비회원 장바구니의 상품 장바구니 추가
    addCartFn()

    cartStore.updateShouldUpdateNormalCart(true)
    cartStore.updateShouldUpdateAutoCart(true)
  }
}

const addCartFn = () => {
  const localCart = JSON.parse(localDataManager.get(CART_NO_AUTH))
  if (!localCart || localCart.length === 0) {
    return
  }
  return postNormalCart.mutate(localCart, {
    onSuccess: () => {
      localDataManager.remove(CART_NO_AUTH)
    }
  })
}

const addSignupCartFn = () => {
  const sessionCart = JSON.parse(sessionDataManager.get(SIGNUP_CART))
  if (route?.query?.redirect === undefined && !sessionCart) {
    return
  }

  return postNormalCart.mutate(sessionCart, {
    onSuccess: () => {
      sessionDataManager.remove(SIGNUP_CART)
    }
  })
}
/**
 * 회원번호 저장 체크시, localStorage 저장 (1년 유지)
 */
const handleSaveId = () => {
  if (isUserNumber.value) {
    localDataManager.setEncrypt(DATA_LOGIN_ID, form.userNumber)
  } else {
    localDataManager.remove(DATA_LOGIN_ID)
  }
}

/**
 * 자동 로그인 체크 시,
 * 자동 로그인 여부 cookie 저장 (30일 유지)
 * refreshToken값 Localstroage 저장
 * @param data
 */
const handleAutoLogin = (data) => {
  if (isAutoLogin.value) {
    cookieDataManager.set(DATA_AUTO_LOGIN, isAutoLogin.value)
    saveLocalRefreshToken(data.refresh_token)
  } else {
    clearAutoLogin()
  }
}

// 자동로그인 초기화
const clearAutoLogin = () => {
  cookieDataManager.remove(DATA_AUTO_LOGIN)
  localDataManager.remove(ID_REFESH_TOKEN_KEY)
}

/**
 * 네이버 간편 로그인
 */
const onNaverLogin = () => {
  const naverLoginPop = window.open('/signup/naver/signupNaverModal', 'Naver Login', 'width=500, height=550')
  window.NaverLoginPopClose = () => {
    naverLoginPop.close()
  }
}

/**
 * Apple 간편 로그인
 */
const onAppleLogin = () => {
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
 * 네이버 간편 로그인 callback
 * @param event
 */
const loginNaverCallback = (event) => {
  // 네이버 간편 가입에서 보낸 postMessage가 아닐 경우
  if (event.origin !== import.meta.env.VITE_APP_BASE_URL || !event.data.sendTo || event.data.sendTo !== 'sns easy login' || typeof event.data !== 'object') {
    return
  }

  if (event.data.status) { // 사용자 로그인이 true
    const params = {
      grant_type: 'social',
      id: event.data.userInfo.id,
      serviceType: event.data.userInfo.serviceType
    }

    // 로그인 수행
    onLogin(params)
  } else { // 사용자 로그인이 false
    console.error(event.data.errorMessage) // 오류 안내 메시지 콘솔에 출력
  }
}

/**
 * apple 간편 로그인 callback
 * @param event
 */
const loginAppleCallback = (event) => {
  console.log('loginAppleCallback', event)

  const params = {
    grant_type: 'social',
    id: event.id,
    serviceType: 'APPLE'
  }

  onLogin(params)
}

/**
 * 카카오 간편 로그인
 */
const onKakaoLogin = async () => {
  doKakaoLogin(onLogin)
}

/**
 * 비회원 주문조회
 */
const onOpenGuestOrderModal = () => {
  proxy.$refs.nonMemberOrder.show()
}

const onCertSuccess = (data) => {
  router.push({ path: '/mypage/orderList', query: { tempId: data.userConnectingInformationTempId } })
}

const onCertFail = () => {
  console.log('onCertFail')
}
</script>
<style lang="scss" scoped>
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
}
</style>

