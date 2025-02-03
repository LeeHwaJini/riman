<template>
  <router-view />

  <q-dialog
    v-model="showTeaserDialog"
    persistent
    transition-show="0"
    transition-hide="0"
  >
    <Teaser @close-teaser="closeTeaser" />
  </q-dialog>

</template>

<script setup>
import { onMounted, onUnmounted, getCurrentInstance, ref } from 'vue'
import { loadLocale } from '@utils/i18n'
import { Screen } from 'quasar'
import Teaser from '@views/home/Teaser'

const { proxy } = getCurrentInstance()

const showTeaserDialog = ref(false)
const isShowTeaser = import.meta.env.VITE_APP_SHOW_TEASER === 'true'
const isAndroid = /Android/i.test(navigator.userAgent)

// 뒤로가기 포함 페이지 이동시 호출
const handleHistoryBack = (event) => {
  if (isAndroid && history.state && history.state.back === null) {
    proxy.$notify(proxy.$t('ALT_LastPage'), '', 'bg-tooltip-color-type01', 1500)
  }
}

const init = () => {
  if (window.performance) {
    // 새로고침시 호출 경고 문구 출력
    if (isAndroid && performance.navigation.type === 1 && history.state.current === '/') {
      history.state.back = null
      proxy.$notify(proxy.$t('ALT_RefreshPage'), '', 'bg-tooltip-color-type01', 1000)
    } else {
      history.pushState(null, null, window.location.href)
    }
  }

  window.addEventListener('popstate', handleHistoryBack)
  window.addEventListener('beforeunload', handleHistoryBack)
}

onMounted(async () => {
  await loadLocale()
  Screen.setSizes({ md: 768, lg: 1024 })

  // Default Meta 정보 설정
  proxy.$metaInfo()

  init()

  if (isShowTeaser) {
    showTeaserDialog.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('popstate', handleHistoryBack)
  window.removeEventListener('beforeunload', handleHistoryBack)
})

/**
 * teaser 숨김처리
 */
const closeTeaser = () => {
  showTeaserDialog.value = false
}
</script>

