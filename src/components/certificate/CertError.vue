<!--
  휴대폰 인증 실패
  create by jhchoi
-->

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (window.opener) {
    window.opener.postMessage('ERROR', import.meta.env.VITE_APP_BASE_URL)
    window.close()
  }
})
</script>
