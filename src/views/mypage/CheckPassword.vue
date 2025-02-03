<!--
  마이페이지 > 내 정보 관리(개인정보 수정) > 비밀번호 확인
  create by jhchoi
-->
<template>
  <q-form :greedy="true" autocomplete="off" @submit.prevent="onSubmit">
    <div class="max-width-wrap signup-wrap pb144">
      <div class="signup-detail-title-area">
        <h4 class="animate__fadeInUp"><b>{{ $t('CPW_checkPassword') }}</b></h4>
        <p class="animate__fadeInUp animate__delay-2s" v-html="$t('CPW_title')" />
      </div>

      <div class="form-area type01">
        <div class="field">
          <div class="field">
            <span class="input-title required">{{ $t('CM_Password') }}</span>
            <RInput v-model.trim="password" :placeholder="$t('VA_EnterPassword')" type="togglePassword" class="login-input q-field__inner-h40 pwd-input" :rules="[val => !!val || $t('VA_EnterPassword')]"/>
          </div>
        </div>
      </div>

      <div class="bottom-btn">
        <RButton class="btn full small type02" :label="$t('CM_Ok')" type="submit" />
      </div>

    </div>
  </q-form>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import memberService from '@/http/services/member'
import { useMypageStore } from '@/store/mypageStore'

const { proxy } = getCurrentInstance()
const router = useRouter()
const route = useRoute()
const mypageStore = useMypageStore()
const password = ref(null)

/**
 * 확인 버튼 클릭
 */
const onSubmit = async () => {
  const params = {
    'password': password.value
  }
  const response = await memberService.postVertifyPassword(params)
  if (response.data) {
    mypageStore.updateIsCheckPassword(true)

    if (route?.query?.redirect) {
      // redirect 페이지 이동
      router.push({ path: route?.query?.redirect })
    } else {
      router.push({ path: '/' })
    }
  } else {
    mypageStore.updateIsCheckPassword(false)

    proxy.$alert(proxy.$t('CPW_validatePassword'))
  }
}

</script>
