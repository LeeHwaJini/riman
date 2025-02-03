<!--
  마이페이지 > 플래너로 전환 > 완료 (커스터머 외국인 전환신청완료화면)
  create by jhchoi
-->
<template>
  <div class="signup-complete-flex-wrap planner-complete-flex-wrap">
    <div class="signup-wrap signup-complete-wrap">
      <div class="white-bg">

        <div class="signup-detail-title-area">
          <i class="ico celebration"></i>
          <h4 class="" v-html="$t('MCC_ForeignCompleteTitle',{name:pageState.userName})" />
          <p>
            {{ $t('MCC_ForeignCompleteSubTitle1') }}<br />{{ $t('MCC_ForeignCompleteSubTitle2') }}
            <br /><br />
            {{ $t('MCC_ForeignCompleteSubTitle3') }}<br />
            {{ $t('MCC_ForeignCompleteSubTitle4') }}
          </p>

          <div class="member-num-copy-content">
            <div class="complete-bg">
              <img src="@assets/images/complete_bg.gif" alt="">
            </div>
          </div>
        </div>

      </div>

      <div class="signup-complete-btn-wrap planner-change-complete">
        <div ref="animation" class="signup-complete-btn-area" :class="{active:isActive}">
          <RButton class="btn signup-complete-btn" >
            <template #content>
              <span class="foreigner planner" @click="$router.push('/')">
                <img src="@assets/images/logo_riman_w.svg" alt="">
                <span class="click-text-area">
                  {{ $t('MCC_GoMain') }}
                </span>
              </span>
            </template>
          </RButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const props = defineProps({
  pageState: {
    type: Object,
    default: () => {
      return []
    }
  }
})

const animation = ref(null)
const isActive = ref(true)

onMounted(() => {
  animation.value.addEventListener('animationend', () => {
    isActive.value = false
    setTimeout(() => {
      isActive.value = true
    }, 3000)
  })
})

</script>
