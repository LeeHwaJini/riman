<!--
  메인
  create by jhchoi
-->
<template>
  <TopBanner />

  <BestSeller />

  <DiveInMain v-if="isDivein"/>

  <Heritage />

  <BottomProduct />
  <section ref="textLoopArea" class="main-section main-loop-text-wrap">
    <div class="main-loop-text">
      <span>Discover your youthful cell. Experience the difference. Awaken your glow.&nbsp;</span>
      <span>Discover your youthful cell. Experience the difference. Awaken your glow.&nbsp;</span>
    </div>
  </section>

  <section ref="fullBannerArea" class="main-section full-banner-section">
    <div :class="['full-banner-content', { 'active': isActive }]">
      <swiper
        :direction="direction"
        :slides-per-view="'auto'"
        :pagination="{
          clickable: true,
        }"
        :modules="modules"
        class="main-full-banner-swiper"
        @swiper="onSwiper"
      >
        <template v-for="(item, index) in videoList" :key="item">
          <swiper-slide>
            <video :src="addPrefixForImage(item.videoUrl)" autoplay muted controls playsinline @ended="onVideoEnded(index)"/>
          </swiper-slide>
        </template>
      </swiper>
    </div>
  </section>

  <section class="main-section title-section">
    <div class="center-title-area title-area max-width-1680">
      <h3>{{ $t('CM_NewsAndEvent') }}</h3>
      <router-link to="/update" class="main-more-btn">{{ $t('CM_LoadMore') }}</router-link>
    </div>

    <swiper
      :slides-per-view="'auto'"
      :looped-slides="2"
      :space-between="5"
      :autoplay="true"
      :loop="true"
      :modules="modules"
      class="main-faq-swiper"
    >
      <template v-for="item in eventList" :key="item.eventId">
        <swiper-slide>
          <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
          <div class="hover-area">
            <div class="title-text">{{ item.eventName }}</div>
            <div class="date-text">{{ formatDate(item.eventStartDate, 'YYYY-MM-DD') }}</div>
            <router-link :to="`/update/${item.eventCategory.code.toLowerCase()}/${item.eventId}`" class="btn small type23 plr24 font-16 bold">{{ $t('CM_DetailView') }}</router-link>
          </div>
        </swiper-slide>
      </template>
    </swiper>
  </section>

</template>

<script setup>
import { onMounted, ref, computed, getCurrentInstance, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { sessionDataManager, SHOP_REFERRER_CODE } from '@utils/dataManager'

import { isLogin } from '@utils/login'
import { useMainStore } from '@store/mainStore'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'

import memeberService from '@/http/services/member'
import etcService from '@/http/services/etc'
import { nowDate, isSameOrAfter, formatDate } from '@utils/dateFormat'
import Heritage from './partital/Heritage.vue'
import DiveInMain from './partital/diveIn/DiveInMain'
import MainNoticeModal from '@/components/modal/MainNoticeModal.vue'
import TopBanner from './partital/topBanner/TopBanner'
import { cookieDataManager } from '@utils/dataManager'
import { addPrefixForImage, checkPlanner } from '@/utils/common'
import BestSeller from './partital/bestseller/BestSeller'
import BottomProduct from './partital/bottomProduct/BottomProduct'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]

const { proxy } = getCurrentInstance()
const isTablet = computed(() => proxy.$isTablet())
const direction = ref('vertical')
const router = useRouter()
const route = useRoute()
const popupList = ref([])
const eventList = ref([])
const videoList = ref([])
const isPlanner = computed(() => checkPlanner())
const isLogined = computed(() => isLogin())
const isDivein = import.meta.env.VITE_APP_IS_DIVEIN === 'true'
const textElement = ref(null)
import { gsap } from 'gsap'
const textLoopArea = ref(null)
let animationFrameId
const mySwiper = ref(null)

onMounted(() => {
  if (isTablet.value) {
    direction.value = 'horizontal'
  }
  confirmPwChange() // 비밀번호 변경 6개월 경과 안내
  alarmAllowance()
})

const mainStore = useMainStore()

/**
 * 비밀번호 변경 6개월 경과 안내
 */
const confirmPwChange = () => {
  if (isLogin() && mainStore.userInfo.requiredPasswordChangeDate) {
    const isRequireChangeDate = isSameOrAfter(formatDate(mainStore.userInfo.requiredPasswordChangeDate, 'YYYY-MM-DD'), nowDate('YYYY-MM-DD'))
    if (isRequireChangeDate) {
      return false
    }
    proxy.$confirm(proxy.$t('CNF_ChangePassword'),
      {
        title: proxy.$t('CNF_ChangePasswordTitle'),
        okLabel: proxy.$t('MUI_ChangePassword'),
        cancelLabel: proxy.$t('CNF_ChangePasswordCancelBtn'),
        ok: () => {
          router.push({ name: 'ChangePassword' })
        },
        cancel: () => {
          const userId = mainStore.userInfo.userSeqNo
          memeberService.putChangeDelayPassword(userId)
        }
      })
  }
}

/**
 * 회원 수당계좌 이력 알림
 */
const alarmAllowance = async () => {
  if (isLogin()) {
    const response = await memeberService.getAlarmAllowance()
    if (response && response.data) {
      proxy.$confirm(proxy.$t('CNF_AllowanceContent'),
        {
          title: proxy.$t('CNF_AllowanceTitle'),
          okLabel: proxy.$t('CNF_AllowanceOkBtn'),
          cancelLabel: proxy.$t('CNF_AllowanceCancelBtn'),
          ok: () => {
            router.push({ name: 'AllowanceInfo' })
          }
        })
    }
  }
}

// const faqArea = ref(null)
const isActive = ref(false)
const fullBannerArea = ref(null)

const handleScroll = () => {
  if (textLoopArea.value) {
    const textLoopRect = textLoopArea.value.getBoundingClientRect()
    const fullBannerRect = fullBannerArea.value.getBoundingClientRect()
    const fullBannerMiddle = fullBannerRect.top + fullBannerRect.height / 2

    if (textLoopRect.top <= 0) {
      isActive.value = true
    } else if (window.innerHeight > fullBannerMiddle) {
      isActive.value = false
    }

    if (fullBannerMiddle <= 0) {
      isActive.value = false
    }
  }
}

const getMainPopup = async () => {
  let param

  if (isLogined.value) {
    param = {
      type: isPlanner.value ? 'SOLE_PROPRIETORSHIP' : 'BEAUTY_CONSUMER'
    }
  } else {
    param = {
      type: 'NON_REG_CUSTOMER'
    }
  }

  const result = await etcService.getMainPopup(param)

  if (result.data) {
    popupList.value = result.data
    if (popupList?.value?.length > 0 && !cookieDataManager.get('_eventpopclose')) {
      openMainModal()
    }
  }
}

const getMainEvent = async () => {
  const result = await etcService.getMainEvent()

  if (result) {
    eventList.value = result.data
  }
}

const getMainVideo = async () => {
  const result = await etcService.getMainVideo()

  if (result) {
    videoList.value = result.data.videoList.sort((a, b) => a.ordinal - b.ordinal)
  }
}

const openMainModal = () => {
  proxy.openModal(
    {
      parent: proxy,
      component: MainNoticeModal,
      componentProps: {
        listValue: popupList.value
      }
    })
}

const onVideoEnded = (temp) => {
  const index = temp < videoList.value.length - 1 ? temp + 1 : 0

  if (mySwiper.value) {
    const video = mySwiper.value.slides[index].querySelector('video')
    video.currentTime = 0
    video.play()

    mySwiper.value.slideTo(index)
  }
}

const onSwiper = (swiper) => {
  mySwiper.value = swiper
}
function startScrolling() {
  gsap.to('.main-loop-text', {
    xPercent: -50,
    repeat: -1,
    duration: 30,
    ease: 'linear'
  })
}

onMounted(() => {
  getReferrerCode()

  window.addEventListener('scroll', handleScroll)
  getMainPopup() // 메인 공지팝업 호출
  getMainEvent()
  getMainVideo()
  startScrolling()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  cancelAnimationFrame(animationFrameId)
})

/**
 * 간편 쇼핑 링크 진입 시 > 세션스토리지에 referrerCode 저장
 */
const getReferrerCode = () => {
  const referrerCode = route?.query?.referrerCode
  if (referrerCode) {
    sessionDataManager.set(SHOP_REFERRER_CODE, referrerCode)
  }
}
</script>

<style>

/* .img-test {
  z-index: -1;
  position: absolute;
  bottom: 121px;
  width: 100%;
  height: 480px;
  background: url('@assets/images/base_main_bestsellers_bg.gif') no-repeat center center/contain;
} */

</style>
