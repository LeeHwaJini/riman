<!--
  비밀번호 재설정 > 본인인증 > 새로운 비밀번호 입력
  create by jhchoi
-->
<template>
  <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmitReset">
    <div class="max-width-wrap signup-wrap pb144">
      <div class="signup-detail-title-area">
        <h4 class="animate__fadeInUp" v-html="$t('RPW_ResTitle')" />
      </div>

      <div class="form-area type01">
        <div class="field">
          <RPasswordConfirm v-model:password="passwordText1" v-model:passwordConfirm="passwordText2" />
        </div>
      </div>

      <div class="bottom-btn">
        <RButton class="btn full small type02" :label="$t('LOG_RestPassword')" type="submit" />
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import memberService from '@/http/services/member'

const { proxy } = getCurrentInstance()
const router = useRouter()
const props = defineProps({
  resetInfo: {
    type: Object,
    default: null
  }
})

const passwordText1 = ref(null)
const passwordText2 = ref(null)

const onSubmitReset = async () => {
  const params = {
    'userId': props.resetInfo.userId,
    'changedPassword': passwordText1.value,
    'code': props.resetInfo.code,
    'token': props.resetInfo.token,
    'userConnectingInformationId': props.resetInfo.userConnectingInformationTempId
  }
  const result = await memberService.postRestPassword(params)
  if (result && result.message === 'success') {
    proxy.$alert(proxy.$t('RPW_AltComplete'), {
      ok: function () {
        router.push({ name: 'Login' })
      }
    })
  }
}
</script>
