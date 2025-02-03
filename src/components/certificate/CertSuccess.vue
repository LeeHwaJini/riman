<!--
  휴대폰 인증 성공
  create by jhchoi
-->

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  if (window.opener) {
    const query = route.query
    if (query) {
      window.opener.postMessage(`CERTSUCCESS ${query.EncodeData}`, import.meta.env.VITE_APP_BASE_URL)
      window.close()
    }
  }
})

</script>
