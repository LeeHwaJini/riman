<!--
  회원가입 > 가입 완료 (커스터머)
-->
<template>
  <div class="signup-complete-flex-wrap">
    <div class="signup-wrap signup-complete-wrap">
      <div class="white-bg">

        <div class="signup-detail-title-area">
          <i class="ico celebration"></i>
          <h4 class=""><b>{{ pageState.userName }}</b>{{ $t('SIG_Sir') }},<br>{{ titleText }}</h4>
          <p>
            {{ subTitleText }}
          </p>
        </div>

        <div v-if="!pageState.isPlanner" class="member-num-copy-content">
          <div class="member-num-copy-area">
            <span class="member-num-title">{{ $t('CM_UserNumber') }}</span>
            <span class="member-num-text">{{ pageState.userNumber }}</span>
            <RButton label="" class="copy-btn" @click="copyClipboard(pageState.userNumber)">
              <template #content>
                <i class="ico copy"></i>
              </template>
            </RButton>
            <div class="complete-bg">
              <img src="@assets/images/complete_bg.gif" alt="">
            </div>
          </div>
        </div>
      </div>

      <div class="signup-complete-btn-wrap">
        <div ref="animation" class="signup-complete-btn-area" :class="{active:isActive}">
          <RButton v-if="pageState.isPlanner" class="btn signup-complete-btn">
            <template #content>
              <span class="foreigner planner" @click="$router.push('/')">
                <img src="@assets/images/logo_riman_w.svg" alt="">
                <span class="tour-text">{{ $t('SIG_TourSite') }}</span>
                <span class="click-text-area">
                  {{ $t('SIG_Click') }}
                  <i class="ico arrow-right-w"></i>
                </span>
              </span>
            </template>
          </RButton>
          <RButton v-else class="btn signup-complete-btn">
            <template #content>
              <span class="foreigner planner" @click="$router.push(`/login/${pageState.userNumber}`)">
                <img src="@assets/images/logo_riman_w.svg" alt="">
                <span class="tour-text">{{ $t('SIG_DoLogin') }}</span>
                <span class="click-text-area">
                  {{ $t('SIG_Click') }}
                  <i class="ico arrow-right-w"></i>
                </span>
              </span>
            </template>
          </RButton>
        </div>

        <div v-if="isTablet ? isMobile ? banner?.image.mobile : banner?.image.tablet : banner?.image.pc" class="foreigner-kit-img-area">
          <img
            :src="addPrefixForImage(isTablet ? isMobile ? banner?.image.mobile : banner?.image.tablet : banner?.image.pc)"
            :class="[{'with-link': banner?.link}]"
            @click="onClickBanner(banner.link)"/>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, computed } from 'vue'
import { addPrefixForImage, copyClipboard } from '@/utils/common'
import etcService from '@/http/services/etc'
import { useRouter } from 'vue-router'

const props = defineProps({
  pageState: {
    type: Object,
    default: () => {
      return []
    }
  },
  titleText: {
    type: String,
    default: ''
  },
  subTitleText: {
    type: String,
    default: ''
  }
})

const { proxy } = getCurrentInstance()
const isActive = ref(true)

const router = useRouter()
const isMobile = computed(() => proxy.$isMobile())
const isTablet = computed(() => proxy.$isTablet())

const banner = ref(undefined)

const getBanner = async () => {
  const param = {
    location: props.pageState.isPlanner ? 'FOREIGNER_AFTER_SIGN_UP' : 'AFTER_SIGN_UP'
  }
  const result = await etcService.getBanner(param)

  if (result) {
    banner.value = result.data
  }
}

const onClickBanner = (link) => {
  if (!link) return
  router.push(link)
}

onMounted(() => {
  const animation = proxy.$refs.animation

  animation.addEventListener('animationend', () => {
    isActive.value = false
    setTimeout(() => {
      isActive.value = true
    }, 3000)
  })

  getBanner()
})
</script>
<style lang="scss" scoped>
.with-link {
  cursor: pointer;
}
</style>
