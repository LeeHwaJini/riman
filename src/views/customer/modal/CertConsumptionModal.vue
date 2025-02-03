<template>
  <FullPageModalWider ref="modal" class-names="w500">
    <template #title>
      <h4>{{ $t('CS_SelfConsumptionCert') }}</h4>
    </template>
    <template #body>
      <section>
        <div class="download-icon-area">
          <div></div>
          <i class="ico download" @click="onDownload"/>
        </div>
        <div class="template-table-wrap">
          <div class="template-top-title-area">
            <h2 class="template-h2">{{ $t('CM_Rimankorea') }} {{ $t('CS_SelfConsumptionCert') }}</h2>
            <img src="@/assets/images/template_logo.png" alt="Riman LOGO" />
          </div>
          <div>

            <ul class="template-member-info-area">
              <li>
                <div class="name-wide">{{ $t('CM_Fullname') }}</div>:
                <div>{{ props.data?.fullName }}</div>
              </li>
              <li>
                <div>{{ $t('CM_BirthDate') }}</div>:
                <div>{{ props.data?.birthDate }}</div>
              </li>

              <li>
                <div>{{ $t('CM_UserNumber') }}</div>:
                <div>{{ props.data?.userNumber }}</div>
              </li>
            </ul>

            <!-- 자가소비형 회원 확인서 -->
            <p v-clean-html="proxy.$t('CS_CertComsumption', {nowYear: props.data?.nowYear, nowMonth: props.data?.nowMonth, nowDay: props.data?.nowDay})" class="template-bottom-p-text-area">
            </p>
            <!-- //자가소비형 회원 확인서 -->

            <p class="template-bottom-p-text">{{ props.data?.nowYear }}{{ $t('CM_Year') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ props.data?.nowMonth }}{{ $t('CS_Month') }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{ props.data?.nowDay }}{{ $t('CS_Date') }}</p>

            <div class="template-journeyman-area">
              <div class="template-text-area">
                {{ $t('FT_AddressValue') }}<br>
                Tel 1522-8144 ｜ Fax 053-767-0225<br>
                <b class="template-b">{{ $t('CS_RimanInc') }}</b>
              </div>
              <div class="template-image-area">
                <img src="@/assets/images/template_stamp.png" alt="RIMAN STAMP">
              </div>
            </div>

          </div>
        </div>
      </section>
    </template>
  </FullPageModalWider>
</template>

<script setup>
import FullPageModalWider from '@/components/modal/FullPageModalWider.vue'
import customerService from '@/http/services/customer'
import { getCurrentInstance, ref } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const modal = ref(null)
const vCleanHtml = buildVueDompurifyHTMLDirective()
const { proxy } = getCurrentInstance()
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
const onDownload = () => {
  customerService.postCertificateConsumption()
}
function show() {
  modal.value.show()
}

defineExpose({
  show
})
</script>

  <style lang="scss" scoped>

  </style>
