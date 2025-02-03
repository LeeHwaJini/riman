<!--
  The Footer
  create by jhchoi
-->
<template>
  <footer class="footer">
    <div class="footer-wrap">
      <div class="footer-left-area">
        <img src="@assets/images/logo_riman_w.svg" alt="">
        <div>
          <ul>
            <li>
              <b>{{ $t('FT_CompanyName') }}</b>
              <span>{{ $t('FT_CompanyNameValue') }}</span>
            </li>
            <li>
              <b>{{ $t('FT_CEO') }}</b>
              <span>{{ $t('FT_CEOValue') }}</span>
            </li>
            <li>
              <b>{{ $t('FT_Number1') }}</b>
              <span>{{ $t('FT_Number1Value') }}</span>
            </li>
            <li>
              <b>{{ $t('FT_Number2') }}</b>
              <span>{{ $t('FT_Number2Value') }}</span>
            </li>
            <li>
              <b>{{ $t('CMM_AddressLabel') }}</b>
              <span>{{ $t('FT_AddressValue') }}</span>
            </li>
          </ul>

          <div class="btn-wrap flex align-center">
            <router-link to="/customer" class="btn type06 flex align-center justify-center gap4">
              {{ $t('CS_Center') }}
            </router-link>
            <router-link to="/customer/faq" class="btn type06 flex align-center justify-center gap4">
              {{ $t('FT_Faqs') }}
            </router-link>
            <a href="javascript::void" class="btn type06 flex align-center justify-center gap4" @click.prevent="onClickInquiry">
              {{ $t('CM_Inquiry') }}
            </a>
          </div>
        </div>
      </div>

      <div class="footer-right-area">
        <div class="footer-info-area">
          <!-- TODO: 다국어 작업 완료 후 v-if 삭제 -->
          <div v-if="false" class="field family-area">
            <b>Language</b>
            <RSelectBox
              v-model="lang"
              :options="langOptions"
              class="select-box type05"
              @update:model-value="onChangeLang"
            />
          </div>

          <div class="field family-area">
            <b>RIMAN FAMILY</b>
            <RSelectBox
              v-model="selectedSite"
              :options="selectOptions"
              :disable="false"
              :filterable="false"
              display-value="Family Site"
              class="select-box type05"
              @update:model-value="blankPageOpen"
            />
          </div>

          <div class="field global-area">
            <b>RIMAN GLOBAL</b>
            <div class="text-area">
              <span @click="blankPageOpen('riman.com')">{{ $t('FT_Usa') }}</span>
              <span @click="blankPageOpen('riman.com')">{{ $t('FT_Canada') }}</span>
              <span @click="blankPageOpen('mall.riman.tw')">{{ $t('FT_Taiwan') }}</span>
              <span @click="blankPageOpen('riman.com.hk')">{{ $t('FT_Hongkong') }}</span>
            </div>
          </div>

          <div class="flex no-wrap footer-logo-area" >
            <img v-if="false" src="@assets/images/footer_img_01.svg" alt="">
            <img src="@assets/images/footer_img_02.svg" alt="">
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom-area">
      <span class="" @click="router.push('/use_terms')">{{ $t('NAV_Terms') }}</span>
      <span class="black" @click="router.push('/privacy_policy')">{{ $t('NAV_PrivacyPolicy') }}</span>
      <span @click="router.push('/esg/fair')">{{ $t('NAV_Compliance') }}</span>

      <span @click="blankPageOpen('www.macco.or.kr/ko/consumer/selectGuarantee.do')">{{ $t('NAV_Guarantee') }}</span>
      <span @click.stop="plannerCheckModalOpen">{{ $t('CHP_CheckPlanner') }}</span>
    </div>

  </footer>
</template>

<script setup>
import memberService from '@/http/services/member'
import { ref, getCurrentInstance, computed } from 'vue'
import PlannerCheckModal from './modal/PlannerCheckModal'
import { useRouter } from 'vue-router'
import { isLogin } from '@/utils/login'
import { changeLocale, getLocale } from '@utils/i18n'
import { langOptions } from '@utils/selectOptions'

const { proxy } = getCurrentInstance()
const router = useRouter()
const isLogined = computed(() => isLogin())
const lang = ref(getLocale()) // default 설정값
const selectedSite = ref(null)
const selectOptions = [
  { label: 'ASK Company', value: 'askcompany.co.kr/creative' },
  { label: 'ASK LABS', value: 'askcompany.co.kr/innovative' },
  { label: 'ASK BASE', value: 'askcompany.co.kr/exclusive' }
]
const onClickInquiry = () => {
  if (isLogined.value) {
    router.push('/customer/inquiry')
  } else {
    proxy.$confirm(proxy.$t('CM_RecommLogin'), {
      title: proxy.$t('CM_UseAferLogin'),
      okLabel: proxy.$t('CM_AgreeLogin'),
      cancelLabel: proxy.$t('CM_No'),
      ok: () => {
        router.push({
          path: '/login',
          query: {
            redirect: '/customer/inquiry'
          }
        })
      }
    })
  }
}
const plannerCheckModalOpen = () => {
  proxy.openModal({
    parent: proxy,
    component: PlannerCheckModal,
    modeless: false
  })
}

const blankPageOpen = (url) => {
  selectedSite.value = url
  window.open(`https://${url}`, '_blank')
}

const onChangeLang = async () => {
  await changeLocale(lang.value)
  setTimeout(() => {
    window.location.reload()
  }, 1000)
}
</script>
