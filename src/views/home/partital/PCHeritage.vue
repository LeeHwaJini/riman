<!--
  메인 > 헤리티지 (PC)
  create by jhchoi
-->
<template>
  <div class="svg-container">
    <div ref="svgArea" v-scroll="onScroll" class="svg-area">

      <img src="@/assets/images/heritage_title.svg" alt="" class="heritage-title">

      <div ref="svgContent" class="svg-content">
        <svg width="100%" height="100%" viewBox="0 0 502.03 1893" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M360.448 1C399.756 74.9646 470.625 253.767 411.763 357.909C338.185 488.087 219.022 519.603 172.384 551.203C135.985 575.866 29.3434 659.778 53.533 845.675C74.0576 1003.41 162.388 1072.5 296.445 1205.64C356.416 1260.53 463.25 1352.09 451.659 1558.2C440.068 1764.32 208.757 1894 208.757 1894"
            stroke="#A2A9B0"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-dasharray="4 4"/>

          <path
            ref="svgPath"
            d="M361.36 1C400.668 74.9646 471.537 253.767 412.675 357.909C339.098 488.087 219.934 519.603 173.296 551.203C136.897 575.866 30.2556 659.778 54.4451 845.675C74.9698 1003.41 163.3 1072.5 297.357 1205.64C357.328 1260.53 464.162 1352.09 452.571 1558.2C440.98 1764.32 209.669 1894 209.669 1894"
            stroke="url(#paint0_linear_13745_44327)"
            stroke-width="4"/>
          <defs>
            <linearGradient id="paint0_linear_13745_44327" x1="250.2" y1="1894" x2="450.487" y2="1890.81" gradientUnits="userSpaceOnUse">
              <stop stop-color="#2EF1CE"/>
              <stop offset="1" stop-color="#00C2FF"/>
            </linearGradient>
          </defs>

          <circle ref="image" cx="0" cy="0" r="10px" stroke-width="5px" fill="#fff" stroke="#57DBCC"/>
        </svg>

        <div class="h-img-area type01" :class="{'active': activeClass[0] === true}">
          <div class="h-img-content">
            <div class="text-area">
              <b>{{ $t('HRI_Image1_1') }}<br/>
                {{ $t('HRI_Image1_2') }}
              </b>
            </div>
          </div>

          <div class="bg-arae"></div>
        </div>

        <div class="h-img-area type02" :class="{'active': activeClass[1] === true}">
          <div class="h-img-content">
            <div class="text-area">
              <b>{{ $t('HRI_Image2_1') }}<br/>
                {{ $t('HRI_Image2_2') }}
              </b>
            </div>
          </div>

          <div class="bg-arae"></div>
        </div>

        <div class="h-img-area type03" :class="{'active': activeClass[2] === true}">
          <div class="h-img-content">
            <div class="text-area">
              <b>{{ $t('HRI_Image3_1') }}</b>
            </div>
          </div>

          <div class="bg-arae"></div>
        </div>

        <div class="h-img-area type04" :class="{'active': activeClass[3] === true}">
          <div class="h-img-content">
            <div class="text-area">
              <b>{{ $t('HRI_Image4_1') }}</b>
            </div>
          </div>

          <div class="bg-arae"></div>
        </div>

        <div class="h-img-area type05" :class="{'active': activeClass[4] === true}">
          <div class="h-img-content">
            <div class="text-area">
              <b>{{ $t('HRI_Image5_1') }}<br/>100</b>
            </div>
          </div>

          <div class="bg-arae"></div>
        </div>

      </div>
      <ul ref="sideBar" class="pc-heritage-side-bar-area default" :class="{'fixed' : isFixed}" :style="[sideBarStyles]">
        <li class="type01" :class="{'active': activeClass[0] === true, '': activeClass[0] === false}" @click="scrollToElement(0)">
          <b>{{ $t('HRI_Image1_1') }} {{ $t('HRI_Image1_2') }}</b>
          <p>
            {{ $t('HRI_Desc1_1') }}<br/>
            {{ $t('HRI_Desc1_2') }}<br/>
            {{ $t('HRI_Desc1_3') }}
          </p>
        </li>

        <li class="type02" :class="{'active': activeClass[1]}" @click="scrollToElement(1)">
          <b>{{ $t('HRI_Image2_1') }} {{ $t('HRI_Image2_2') }}</b>
          <p>
            {{ $t('HRI_Desc2_1') }}<br/>
            {{ $t('HRI_Desc2_2') }}<br/>
            {{ $t('HRI_Desc2_3') }}
          </p>
        </li>

        <li class="type03" :class="{'active': activeClass[2]}" @click="scrollToElement(2)">
          <b>{{ $t('HRI_Image3_1') }}</b>
          <p>
            {{ $t('HRI_Desc3_1') }}<br/>
            {{ $t('HRI_Desc3_2') }}<br/>
            {{ $t('HRI_Desc3_3') }}
          </p>
        </li>

        <li class="type04" :class="{'active': activeClass[3]}" @click="scrollToElement(3)">
          <b>{{ $t('HRI_Image4_1') }}</b>
          <p>
            {{ $t('HRI_Desc4_1') }}<br/>
            {{ $t('HRI_Desc4_2') }}<br/>
            {{ $t('HRI_Desc4_3') }}
          </p>
        </li>

        <li class="type05" :class="{'active': activeClass[4]}" @click="scrollToElement(4)">
          <b>{{ $t('HRI_Image5_1') }} 100</b>
          <p>
            {{ $t('HRI_Desc5_1') }}<br/>
            {{ $t('HRI_Desc5_2') }}<br/>
            {{ $t('HRI_Desc5_3') }}
          </p>
        </li>
      </ul>

    </div>

    <div class="skip-conainer pc-skip" :class="{'active' : heritageSkipStatus}">
      <div class="skip-area">
        <img src="@/assets/images/heritage_skip_logo.png" alt="" class="skip-title-img">

        <div class="mouse-arae">
          <div class="mouse-wheel"></div>
        </div>

        <p class="scroll-text">
          스크롤해서 <b>헤리티지 여정</b>을<br/>떠나보세요.
        </p>

        <div class="down-skip-text pointer" @click="onSkip('down')">
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
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { onMounted, ref, onUnmounted, computed } from 'vue'
import { useMainStore } from '@/store/mainStore'

const isAnimationTriggered = ref(false)
let animationTimeout = null

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
const activeClass = ref([false, false, false, false, false])
let animation = null

const sideBar = ref(null)
const isFixed = ref(false)
const sideBarStyles = ref({})

const headerHeight = computed(() => mainStore.headerHeight)
const oProgressPos = [20, 40, 60, 78, 100]

onMounted(() => {
  setPosition()

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animation) {
    animation.kill()
  }
  window.removeEventListener('resize', handleResize) // 리사이즈 이벤트 리스너 삭제

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
  const xTo = gsap.quickTo(svgContent.value, 'x', { duration: 5 })
  gsap.ticker.add(() => {
    if (svgContent.value && svgContent.value.getBoundingClientRect().y > -headerHeight.value) {
      xTo(-gsap.getProperty(0))
      return
    } else {
      xTo(-gsap.getProperty(image.value, 'x'))
    }
  })
}

/**
 * GSAP 애니메이션 설정
 */
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
        end: 'bottom 70%',
        scrub: true, // 스크럽 효과 활성화
        // markers: true, // 디버깅
        onUpdate: (self) => {
          const progress = self.progress
          const progressInt = parseInt(self.progress * 100)

          // 활성 클래스 업데이트
          const activeIndex = oProgressPos.findLastIndex(item => item <= progressInt)
          activeClass.value = activeClass.value.map((_, i) => i === activeIndex)

          // SVG 경로 및 이미지 위치 업데이트
          const currentLength = pathLength * progress
          gsap.set(svgPath.value, {
            strokeDasharray: `${currentLength}px ${pathLength}px`
          })

          if (svgPath.value?.getPointAtLength) {
            const point = svgPath.value.getPointAtLength(currentLength) // 경로의 현재 위치를 가져옴
            gsap.set(image.value, { x: point.x, y: point.y }) // circle 위치 업데이트
          }
        },
        onEnter: () => {
          if (!isSkip.value) {
            heritageSkipStatus.value = true
          }
        },
        onEnterBack: () => {
          isSkip.value = false
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
 * 영역에 해당하는 스크롤 이동
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

/**
 * 화면 리사이즈 시 > 애니메이션 재 설정
 */
const handleResize = () => {
  setAnimation()
}

/**
 * 화면 스크롤 >
 * 1. 왼쪽 카드('sideBarTop') 위치 설정
 * 2. 헤리티지 이벤트 호출
 */
const onScroll = () => {
  const svgRect = svgArea.value.getBoundingClientRect()
  const sideBarRect = sideBar.value.getBoundingClientRect()
  const sideBarPosY = Math.floor(svgRect.height - sideBarRect.height - 100)
  const sideBarTop = svgRect.y - headerHeight.value
  const isEndSideBar = sideBarTop + sideBarPosY

  // 사이드바 고정 여부 결정
  isFixed.value = svgRect.top < headerHeight.value

  // 사이드바 스타일 조정
  if (isEndSideBar < 0) {
    isFixed.value = false
    sideBarStyles.value = { top: `${sideBarPosY}px` }
  } else {
    sideBarStyles.value = {}
  }

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

<style lang="sass" scoped>

</style>
