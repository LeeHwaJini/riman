<template>
  <FullPageModalWider ref="modal" class-names="w500">
    <template #title>
      <h4>{{ $t('CS_SalespersonCert') }}</h4>
    </template>
    <template #body>
      <section>
        <div class="download-icon-area">
          <div></div>
          <i class="ico download" @click="onDownload"/>
        </div>
        <div class="template-table-wrap">
          <div class="template-top-title-area">
            <h2 class="template-h2">{{ $t('CM_Rimankorea') }} {{ $t('CS_SalespersonCert') }}</h2>
            <img src="@/assets/images/template_logo.png" alt="RIMAN LOGO" />
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

              <li>
                <div>{{ $t('CS_RegistDate') }}</div>:
                <div>{{ props.data?.joinYear }}-{{ props.data?.joinMonth }}-{{ props.data?.joinDay }}</div>
              </li>
            </ul>

            <p class="template-bottom-p-text-area pre-line">
              {{ $t('CS_CertPlanner') }}
            </p>

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
import customerService from '@/http/services/customer'
import { ref } from 'vue'

const modal = ref(null)
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
const onDownload = () => {
  customerService.postCertificatePlanner()
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
