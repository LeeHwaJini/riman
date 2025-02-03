<!--
  퍼스너몰 배너
  create by jhchoi
-->
<template>
  <div
    v-if="showBanner"
    ref="bannerWrap"
    v-scroll="onScroll"
    :style="{ 'background-image' : 'url(' + coverImage.replace(/ /g, '%20') + ')'}"
    class="top-banner-area"
  >
    <div class="dim">
      <div class="img-area tooltip-area type02 bottom" :style="{ cursor: !isGlobalCustomer ? 'pointer' : 'default' }">
        <img :src="profileImage" alt="" @click="openPersonalModal">
        <div v-if="!isGlobalCustomer" class="tooltip-text-area animate__bounce">
          <div class="tooltip-text">
            {{ $t('PM_ShowInfo') }}
          </div>
        </div>
      </div>
      <div class="text-area">
        <p v-if="personalMallInfo.userPersonalMallInfoResponse?.mallName" class="top">{{ personalMallInfo.userPersonalMallInfoResponse?.mallName }}</p>
        <p v-else class="top">{{ `${personalMallInfo?.userInfo?.fullName}'s Mall` }}</p>
        <p v-if="personalMallInfo.userPersonalMallInfoResponse?.message1" class="middle">{{ personalMallInfo.userPersonalMallInfoResponse?.message1 }}</p>
        <p v-else class="middle">{{ $t('PM_DefaultWelcomeMessage', {name: personalMallInfo?.userInfo?.fullName}) }}</p>
        <p class="bottom">{{ personalMallInfo.userPersonalMallInfoResponse?.message2 }}</p>
      </div>

      <button class="btn icon-type" @click="clickToggleBtn">
        <i class="ico dropdown-w"></i>
      </button>

    </div>
  </div>
</template>

<script setup>
import { useMainStore } from '@/store/mainStore'
import { checkPlanner } from '@/utils/common'
import { ref, getCurrentInstance, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import personalMallService from '@/http/services/personalMall'
import memberService from '@/http/services/member'
import { isLogin } from '@/utils/login'

import defaultProfile from '@/assets/images/personal_banner_profile.svg'
import defaultBanner from '@/assets/images/personalmall_bg.png'
import { cookieDataManager } from '@/utils/dataManager'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()

const loginStatus = ref(undefined)
const isPlanner = computed(() => checkPlanner())
const referrerCode = new URLSearchParams(window.location.search).get('referrerCode')

const showBanner = ref(false)
const matchedUserNumber = ref(undefined)

const personalMallInfo = ref({})

const defaultProfileImage = defaultProfile
const defaultCoverImage = defaultBanner

const profileImage = ref(defaultProfileImage)
const coverImage = ref(defaultCoverImage)

const isBannerOpen = ref(true)
const eventEmits = defineEmits(['togglePersonalBanner', 'setBannerFix', 'checkPersonalMall'])
const isAnimate = ref(false)
const lastScrollTop = ref(0)

const isHome = computed(() => {
  return route.name === 'Home'
})
const isMobile = computed(() => proxy.$isMobile())
const bannerWrap = ref(null)
const isGlobalCustomer = ref(false)

onMounted(() => {
  toggleBanner(false)

  const referralUserNumber = mainStore?.userInfo?.referralUserNumber
  isGlobalCustomer.value = !isPlanner.value && referralUserNumber && !referralUserNumber.startsWith('1')

  window.addEventListener('personalMallUpdated', onSearchPersonalMall)
  window.addEventListener('openPersonalModal', openPersonalModal)

  router.afterEach(() => {
    if (isHome.value && !loginStatus.value) {
      showBanner.value = false
      eventEmits('checkPersonalMall', false)
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('personalMallUpdated', onSearchPersonalMall)
  window.removeEventListener('openPersonalModal', openPersonalModal)
})

const redirectToMatchedPersonalMall = async () => {
  await proxy.$alert(
    proxy.$t('PM_Redirect'), {
      title: proxy.$t('PM_NotMatched'),
      ok: () => {
        router.push(`/?referrerCode=${matchedUserNumber.value}`)
          .then(() => {
            showBanner.value = true
            eventEmits('checkPersonalMall', true)
          })
      }
    }
  )
}

const onSearchPersonalMall = async () => {
  const params = {
    userNumber: matchedUserNumber.value
  }

  const result = await personalMallService.getPersonalMall(params)
  const userResult = await memberService.getReferralNumber(params, false)

  showBanner.value = setShowBanner()

  useMainStore().isPersonalMallShow = setShowBanner()

  eventEmits('checkPersonalMall', showBanner.value)

  const isNonRefCustomer = useMainStore().getUser.referralUserNumber === '1020000001' // 본사소속 커스터머

  if (isNonRefCustomer) {
    showBanner.value = false
    return
  }

  if (!userResult && isHome.value && !cookieDataManager.get('pm_inactivate_alert_exposured')) {
    proxy.$alert(proxy.$t('PM_InActivate'), {
      ok: () => router.push(window.location.pathname)
    })
    const now = new Date()
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    cookieDataManager.set('pm_inactivate_alert_exposured', true, lastDay)
  }

  if (result.data) {
    personalMallInfo.value = result.data

    if (result.data.userPersonalMallInfoResponse) {
      const {
        profileOriginFileName,
        profileUrl,
        backgroundMobileOriginFileName,
        backgroundMobileUrl,
        backgroundPcOriginFileName,
        backgroundPcUrl
      } = result.data.userPersonalMallInfoResponse

      profileImage.value = profileOriginFileName ? profileUrl : defaultProfileImage
      coverImage.value =
            isMobile.value
              ? (backgroundMobileOriginFileName ? backgroundMobileUrl : defaultCoverImage)
              : backgroundPcOriginFileName ? backgroundPcUrl : defaultCoverImage
    }
  }

  if (!showBanner.value && loginStatus.value) redirectToMatchedPersonalMall()

  if (userResult) {
    personalMallInfo.value.userInfo = userResult.data
    personalMallInfo.value.userInfo.fullName = userResult.data.lastName + userResult.data.firstName
  } else {
    showBanner.value = false
  }
}

/**
 * 스크롤 0 : 퍼스너몰 배너 열림
 * 그 외 : 퍼스너몰 배너 닫힘
 */
const onScroll = (val) => {
  if (!isHome.value || isAnimate.value) {
    return
  }
  const scrollTop = val
  if (isFixBanner.value) {
    lastScrollTop.value = scrollTop
    return
  }

  // modal 활성화 시, 토글 제외
  const bodyClasses = document.body.classList
  if (bodyClasses.contains('q-body--prevent-scroll')) {
    return
  }

  if (scrollTop > lastScrollTop.value && isBannerOpen.value === true) {
    // 스크롤 내릴 때
    toggleBanner(false)
  } else if (scrollTop === 0 && isBannerOpen.value === false) {
    // 스크롤 맨 위
    // toggleBanner(true)
  }
  lastScrollTop.value = scrollTop
}

/**
 * 퍼스너몰 배너 토글
 * @param isOpen
 */
const toggleBanner = (isOpen) => {
  isAnimate.value = true
  isBannerOpen.value = isOpen
  eventEmits('togglePersonalBanner', isOpen)
}

/**
 * 배너 토글 버튼 닫힘 설정 > 스크롤 맨 위로 이동 해도 퍼스너몰 배너 닫힘
 */
const isFixBanner = ref(false)
const clickToggleBtn = () => {
  isBannerOpen.value = !isBannerOpen.value
  toggleBanner(isBannerOpen.value)

  if (!isBannerOpen.value) {
    isFixBanner.value = true
  } else {
    isFixBanner.value = false
  }
}

/**
 * 퍼스너몰 모달 열기
 */
const openPersonalModal = () => {
  if (isGlobalCustomer.value) {
    return
  }

  proxy.openModal(
    {
      component: 'PersonalModal',
      componentProps: {
        data: personalMallInfo.value,
        userNumber: matchedUserNumber.value,
        profileImage: profileImage.value,
        coverImage: coverImage.value
      }
    })
}

const setShowBanner = () => {
  const isShowBanner = (!loginStatus.value && referrerCode) ||
  (loginStatus.value && referrerCode === matchedUserNumber.value || referrerCode === null)

  return isShowBanner
}

const setMatchedUserNumber = () => {
  if (loginStatus.value) {
    return isPlanner.value ? mainStore.userInfo.userNumber : mainStore.userInfo.referralUserNumber
  }

  return referrerCode
}

watch(
  () => mainStore.getUser,
  (newValue, oldValue) => {
    loginStatus.value = isLogin()
    matchedUserNumber.value = setMatchedUserNumber()

    if (oldValue?.userSeqNo && !newValue.userSeqNo) {
      return
    }

    matchedUserNumber.value && onSearchPersonalMall()
  }, {
    immediate: true
  }
)

/**
 * bannerWrap 출력 될 경우, 이벤트 호출
 */
watch(
  () => bannerWrap.value,
  () => {
    if (bannerWrap.value) {
      bannerWrap.value.addEventListener('transitionend', () => {
        isAnimate.value = false
      })
    }
  }, {
    immediate: true
  }
)

nextTick(() => {
  matchedUserNumber.value = setMatchedUserNumber()
  useMainStore().isPersonalMallShow = undefined
})

</script>

<style>

</style>

