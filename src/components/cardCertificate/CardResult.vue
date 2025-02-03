<!--
  카드 인증 결과 : 성공/실패
  create by jhchoi
-->

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const baseUrl = import.meta.env.VITE_APP_BASE_URL

onMounted(() => {
  if (window.opener) {
    const query = route.query
    if (query) {
      // S000 성공
      // 예 : cardTp=SH&txSn=241121170025RO944351&retCd=S000&cpParam=Uk85OTAwMDAwMDQ2
      if (query.retCd === 'S000') {
        window.opener.postMessage(`CARDSUCCESS_${query.txSn}_${query.retCd}_${query.cpParam}_${query.cardTp}`, baseUrl)
      } else { // 실패
        window.opener.postMessage('ERROR', baseUrl)
      }
      window.close()
    }
  }
})

</script>
