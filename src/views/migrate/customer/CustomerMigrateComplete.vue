<!--
  NM 전환 > 커스터머 완료
  create by jhchoi
-->
<template>
  <div class="planner-complete-bg-full-wrap">
    <div class="signup-wrap signup-complete-wrap">
      <div class="white-bg">

        <div class="signup-detail-title-area">
          <i class="ico celebration"></i>
          <h4 class=""><b>{{ $nameFormat(migrateComplete && migrateComplete.lastName, migrateComplete && migrateComplete.firstName) }}</b>
            {{ $t('SIG_Sir') }},<br>{{ $t('MIG_CompleteTitle') }}</h4>
          <p>
            {{ $t('MIG_SubTitle1') }}<br/>{{ $t('MIG_SubTitle2') }}<br/>{{ $t('MIG_SubTitle3') }}
          </p>
        </div>

        <div class="member-num-copy-content">
          <div class="member-num-copy-area">
            <span class="member-num-title">{{ $t('CM_UserNumber') }}</span>
            <span class="member-num-text">{{ migrateComplete && migrateComplete.userNumber }}</span>
            <RButton label="" class="copy-btn" @click="copyClipboard(migrateComplete && migrateComplete.userNumber)">
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
          <RButton class="btn signup-complete-btn" >
            <template #content>
              <span class="foreigner planner" @click="$router.push('/login')">
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

        <div class="banner-img-area">
          <img
            :src="addPrefixForImage(isTablet ? isMobile ? banner?.image.mobile : banner?.image.tablet : banner?.image.pc)"
            :class="[{'img-cover': true, 'with-link': banner?.link}]"
            @click="onClickBanner(banner.link)"/>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, computed } from 'vue'
import { addPrefixForImage, copyClipboard } from '@/utils/common'
import { useRouter } from 'vue-router'
import etcService from '@/http/services/etc'

const props = defineProps({
  migrateComplete: {
    type: Object,
    default: null
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
    location: 'AFTER_SIGN_UP'

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
