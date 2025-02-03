<!--
  메인 > 헤리티지 (Mobile)
  create by jhchoi
-->
<template>
  <div v-scroll="onScroll" class="svg-container">
    <div ref="svgArea" class="h-mo svg-area" :class="{'fixed' : isFixed}">

      <img src="@/assets/images/heritage_title.svg" alt="" class="h-mo heritage-title">

      <div ref="svgContent" class="h-mo svg-content">
        <svg width="100%" height="100%" viewBox="0 0 443 1745" fill="none" xmlns="http://www.w3.org/2000/svg">

          <path
            d="M382 2C449.5 241 267.17 334.406 175.664 382.424C16.9531 465.708 -9.33968 665.91 47.2782 805.25C124.726 995.855 317.162 1064.37 389.979 1236.08C476.915 1441.1 387.962 1708.27 172.894 1747"
            stroke="#A2A9B0"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="6 8"/>

          <path
            ref="svgPath"
            d="M382 1C449.5 240 267.17 333.406 175.664 381.424C16.9531 464.708 -9.33968 664.91 47.2782 804.25C124.726 994.855 317.162 1063.37 389.979 1235.08C476.915 1440.1 387.962 1707.27 172.894 1746"
            stroke="url(#paint0_linear_13248_15967)"
            stroke-width="4"/>
          <defs>
            <linearGradient id="paint0_linear_13248_15967" x1="220.434" y1="1746" x2="420.945" y2="1742.54" gradientUnits="userSpaceOnUse">
              <stop stop-color="#2EF1CE"/>
              <stop offset="1" stop-color="#00C2FF"/>
            </linearGradient>
          </defs>

          <circle ref="image" cx="0" cy="0" r="10px" stroke-width="5px" fill="#fff" stroke="#57DBCC"/>
        </svg>

        <div class="h-mo h-img-area type01" :class="{'active': activeClass[0] === true, '': activeClass[0] === false}">
          <div class="h-img-content">
            <div class="text-area">
              <b>{{ $t('HRI_Image1_1') }}<br/>
                {{ $t('HRI_Image1_2') }}
              </b>
            </div>
          </div>

          <div class="bg-arae"></div>
        </div>

        <div class="h-mo h-img-area type02" :class="{'active': activeClass[1] === true, '': activeClass[1] === false}">
          <div class="h-img-content">
            <div class="text-area">
              <b>{{ $t('HRI_Image2_1') }}<br/>
                {{ $t('HRI_Image2_2') }}
              </b>
            </div>
          </div>

          <div class="bg-arae"></div>
        </div>

        <div class="h-mo h-img-area type03" :class="{'active': activeClass[2] === true, '': activeClass[2] === false}">
          <div class="h-img-content">
            <div class="text-area">
              <b>{{ $t('HRI_Image3_1') }}</b>
            </div>
          </div>

          <div class="bg-arae"></div>
        </div>

        <div class="h-mo h-img-area type04" :class="{'active': activeClass[3] === true, '': activeClass[3] === false}">
          <div class="h-img-content">
            <div class="text-area">
              <b>{{ $t('HRI_Image4_1') }}</b>
            </div>
          </div>

          <div class="bg-arae"></div>
        </div>

        <div class="h-mo h-img-area type05" :class="{'active': activeClass[4] === true ,'': activeClass[4] === false}">
          <div class="h-img-content">
            <div class="text-area">
              <b>{{ $t('HRI_Image5_1') }}<br/>100</b>
            </div>
          </div>

          <div class="bg-arae"></div>
        </div>

      </div>

      <div class="main-heritage-slide-area" :class="{'fixed' : isFixed, 'default' : isDefault}">
        <swiper
          :slides-per-view="'1'"
          class="main-heritage-slide"
          @slide-change="onSlideChange"
          @swiper="onSwiper"
          @touch-start="onTouchStart"
        >

          <swiper-slide class="type01" @click="scrollToElement(0)">
            <b>{{ $t('HRI_Image1_1') }} {{ $t('HRI_Image1_2') }}</b>
            <p>
              {{ $t('HRI_Desc1_1') }}<br/>
              {{ $t('HRI_Desc1_2') }}<br/>
              {{ $t('HRI_Desc1_3') }}
            </p>
          </swiper-slide>

          <swiper-slide class="type02" @click="scrollToElement(1)">
            <b>{{ $t('HRI_Image2_1') }} {{ $t('HRI_Image2_2') }}</b>
            <p>
              {{ $t('HRI_Desc2_1') }}<br/>
              {{ $t('HRI_Desc2_2') }}<br/>
              {{ $t('HRI_Desc2_3') }}
            </p>
          </swiper-slide>

          <swiper-slide class="type03" @click="scrollToElement(2)">
            <b>{{ $t('HRI_Image3_1') }}</b>
            <p>
              {{ $t('HRI_Desc3_1') }}<br/>
              {{ $t('HRI_Desc3_2') }}<br/>
              {{ $t('HRI_Desc3_3') }}
            </p>
          </swiper-slide>

          <swiper-slide class="type04" @click="scrollToElement(3)">
            <b>{{ $t('HRI_Image4_1') }}</b>
            <p>
              {{ $t('HRI_Desc4_1') }}<br/>
              {{ $t('HRI_Desc4_2') }}<br/>
              {{ $t('HRI_Desc4_3') }}
            </p>
          </swiper-slide>

          <swiper-slide class="type05" @click="scrollToElement(4)">
            <b>{{ $t('HRI_Image5_1') }} 100</b>
            <p>
              {{ $t('HRI_Desc5_1') }}<br/>
              {{ $t('HRI_Desc5_2') }}<br/>
              {{ $t('HRI_Desc5_3') }}
            </p>
          </swiper-slide>
        </swiper>
      </div>
    </div>

    <div class="skip-conainer mo-skip" :class="{'active' : heritageSkipStatus}">
      <div class="skip-area">
        <img src="@/assets/images/heritage_skip_logo.png" alt="" class="skip-title-img">

        <div class="mouse-arae">
          <div class="mouse-wheel" />
        </div>

        <p class="scroll-text">
          스크롤해서 <b>헤리티지 여정</b>을<br/>떠나보세요.
        </p>

        <div class="down-skip-text" @click="onSkip('down')">
          아래로 건너뛰기
          <i class="ico arrow-circle-top-w" />
        </div>
      </div>
    </div>
  </div>

  <button class="btn heritage-skip-btn" @click="onSkip('up')">
    위로 건너뛰기
    <i class="ico arrow-top-type02-b"/>
  </button>
</template>

<script setup>
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted, ref, onUnmounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { useMainStore } from '@/store/mainStore'

const mainStore = useMainStore()

const props = defineProps({
  isDiveInSuccess: {
    type: Boolean,
    default: false
  }
})

// GSAP 플러그인 등록
gsap.registerPlugin(MotionPathPlugin, ScrollTrigger, ScrollToPlugin)

// refs 설정
const image = ref(null)
const svgPath = ref(null)
const svgArea = ref(null)
const svgContent = ref(null)
const activeClass = ref(['', '', '', '', ''])
let animation = null
const isFixed = ref(false)
const isDefault = ref(false)

const headerHeight = computed(() => mainStore.headerHeight)
const swiperIndex = ref(0)

const isAnimationTriggered = ref(false)
let animationTimeout = null

onMounted(() => {
  setPosition()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animation) {
    animation.kill()
  }
  window.removeEventListener('resize', handleResize)

  if (animationTimeout) {
    clearTimeout(animationTimeout)
  }
})

/**
 * circle 위치 초기화
 */
const setPosition = () => {
  const point = svgPath.value.getPointAtLength(0) // 경로의 현재 위치를 가져옴
  gsap.set(image.value, { x: point.x, y: point.y }) // circle 위치 업데이트

  // 스크롤 시 svgContent 영역 가운데 정렬
  const xTo = gsap.quickTo(svgContent.value, 'x', { duration: 1 })
  gsap.ticker.add(() => {
    if (svgContent.value && svgContent.value.getBoundingClientRect().y > -headerHeight.value) {
      xTo(-221)
    } else {
      xTo(-gsap.getProperty(image.value, 'x'))
    }
  })
}

/**
 * GSAP 애니메이션 설정
 */
const oProgressPos = [17, 36, 57, 76, 100]

const setAnimation = () => {
  if (!svgPath.value) {
    return
  }

  const pathLength = svgPath.value?.getTotalLength()
  gsap.set(svgPath.value, {
    strokeDasharray: `0px ${parseInt(pathLength)}px`
  })

  gsap.set(svgContent.value, { left: innerWidth / 2 })

  animation = gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: svgPath.value, // 트리거 요소
        start: `top 30%`, // 시작 위치
        end: 'bottom 50%',
        scrub: true, // 스크럽 효과 활성화
        // markers: true, // 디버깅
        onEnter: () => {
          isFixed.value = true // fixed 클래스 추가

          if (!isSkip.value) {
            heritageSkipStatus.value = true
          }
        },
        onLeave: () => {
          isFixed.value = false // fixed 클래스 제거
          isDefault.value = true
        },
        onEnterBack: () => {
          isFixed.value = true // fixed 클래스 추가 (뒤로 스크롤 시)
          isSkip.value = false
        },
        onLeaveBack: () => {
          isFixed.value = false // fixed 클래스 제거 (뒤로 스크롤 시)
        },
        onUpdate: (self) => {
          const progress = self.progress
          const progressInt = parseInt(self.progress * 100)

          // 활성 클래스 업데이트
          const activeIndex = oProgressPos.findLastIndex(item => item <= progressInt)
          activeClass.value = activeClass.value.map((_, i) => i === activeIndex)

          // Swiper 업데이트
          if (swiperIndex.value !== activeIndex && activeIndex !== -1) {
            goToSlide(activeIndex)
            swiperIndex.value = activeIndex
          }

          // SVG 경로 및 이미지 위치 업데이트
          const currentLength = pathLength * progress
          gsap.set(svgPath.value, {
            strokeDasharray: `${currentLength}px ${pathLength}px`
          })

          if (svgPath.value?.getPointAtLength) {
            const point = svgPath.value.getPointAtLength(currentLength) // 경로의 현재 위치를 가져옴
            gsap.set(image.value, { x: point.x, y: point.y }) // circle 위치 업데이트
          }
        }
      }
    })
    .to(image.value, {
      motionPath: {
        path: svgPath.value, // SVG 경로 참조
        align: svgPath.value,
        alignOrigin: [0.5, 0.5]
      },
      ease: 'power1.inOut'
    })
}

/**
 * 화면 리사이즈 시 > 애니메이션 재 설정
 */
const handleResize = () => {
  setAnimation()
}

/*
* 슬라이드 클릭 시 위치 이동
https://gsap.com/docs/v3/HelperFunctions/helpers/getScrollPosition/
*/

const getScrollPosition = (animation, progress) => {
  const p = gsap.utils.clamp(0, 1, progress || 0)
  let st = animation.scrollTrigger
  const containerAnimation = st.vars.containerAnimation
  if (containerAnimation) {
    const time = st.start + (st.end - st.start) * p
    st = containerAnimation.scrollTrigger
    return (
      st.start + (st.end - st.start) * (time / containerAnimation.duration())
    )
  }
  return st.start + (st.end - st.start) * p
}

const lastAction = ref('')
/**
 * swiper slide 변경 시, 이벤트 호출
 * @param swiper
 */
const onSlideChange = (swiper) => {
  if (lastAction.value === 'touch') {
    const index = swiper.activeIndex
    scrollToElement(index)
  }
}

/**
 * 스와이퍼에 해당하는 스크롤 이동
 * @param index
 */
const scrollToElement = (index) => {
  const offsetPos = getScrollPosition(animation, oProgressPos[index] / 100)
  gsap.to(window, {
    duration: 1,
    scrollTo: {
      y: offsetPos + 10
    },
    ease: 'power2.inOut'
  })
}

// Swiper 인스턴스를 저장할 ref
const mySwiper = ref(null)

// Swiper 인스턴스를 설정하는 함수
const onSwiper = (swiper) => {
  mySwiper.value = swiper
}

// 특정 슬라이드로 이동하는 함수
const goToSlide = (index) => {
  lastAction.value = 'slideTo'
  if (mySwiper.value) {
    mySwiper.value.slideTo(index)
  }
}

/**
 * swiper touch 이동 시, 이벤트 발생
 */
const onTouchStart = () => {
  lastAction.value = 'touch'
}

/**
 * 화면 스크롤 > 헤리티지 이벤트 호출
 */
const onScroll = () => {
  if (isAnimationTriggered.value) return

  setAnimationTrigger()
  onRemoveSkipDim()
}

/**
 * 헤리티지 이벤트 호출
 */
const setAnimationTrigger = () => {
  if (isAnimationTriggered.value) return

  isAnimationTriggered.value = true

  animationTimeout = setTimeout(() => {
    setAnimation()
  }, 500)
}

const heritageSkipStatus = ref(false)
const isSkip = ref(false)

/**
 * skip 버튼 클릭 시, 스크롤 이동
 * @param direction up/down
 */
const onSkip = (direction) => {
  isSkip.value = true

  // 스크롤 아래로 이동
  const svgRect = svgArea.value.getBoundingClientRect()
  let scrollPosY = 0
  if (direction === 'down') {
    scrollPosY = window.scrollY + svgRect.height + svgRect.top - headerHeight.value + 32
  } else {
    scrollPosY = window.scrollY + svgRect.top - headerHeight.value - window.innerHeight
  }

  window.scrollTo({
    top: scrollPosY,
    behavior: 'smooth'
  })
}

/**
 * 헤리티지 영역 아래로 스크롤 이동 시, skipDim 비활성화
 */
const onRemoveSkipDim = () => {
  if (heritageSkipStatus.value || isSkip.value) {
    return
  }
  const svgRect = svgArea.value.getBoundingClientRect()
  const scrollPosY = window.scrollY + svgRect.height + svgRect.top - headerHeight.value + 32

  if (scrollPosY <= window.scrollY) {
    heritageSkipStatus.value = true
  }
}
</script>
