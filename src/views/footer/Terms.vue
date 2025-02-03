<template>
  <div class="notic-wrap agree-wrap max-width-1400-wrap pb144">

    <div class="title-area">
      <h3 class="bold mt96 mb48 primary09-color main-title-area text-center">{{ terms[selectedVersion?.value]?.termsName }}</h3>
    </div>
    <div class="agree-select-area">
      <RSelectBox
        v-model="selectedVersion"
        :options="version"
        :disable="false"
        :filterable="false"
        class="select-box type04"
        @update:model-value="(v) => onChangeVersion(v)"
      />
    </div>
    <div v-clean-html="terms[selectedVersion?.value]?.termsContents" class="agree-text-area"></div>
  </div>

</template>

<script setup>
import etcService from '@/http/services/etc'
import { formatDate, isSameOrBefore } from '@/utils/dateFormat'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { useRoute } from 'vue-router'

const { proxy } = getCurrentInstance()

const termsType = useRoute().path.replace('/', '').toUpperCase()

const terms = ref([])
const version = ref([])
const selectedVersion = ref()
const vCleanHtml = buildVueDompurifyHTMLDirective()

onMounted(() => {
  getTerms()
})

const getTerms = async () => {
  const result = await etcService.getTerms(termsType)

  terms.value = result.data.filter(i => isSameOrBefore(i.exposureStartDate, new Date()))

  version.value = terms.value.map((item, index) => {
    const exposureEndDate = item.exposureEndDate === '9999-12-31 23:59:59' ? proxy.$t('CM_Current') : formatDate(item.exposureEndDate, 'YYYY-MM-DD')

    return {
      label: `Version ${item.version} (${formatDate(item.exposureStartDate, 'YYYY-MM-DD')} ~ ${exposureEndDate})`,
      value: index
    }
  })

  selectedVersion.value = version.value[0]
}

const onChangeVersion = (v) => {
  selectedVersion.value = version.value[v]
}

</script>

<style lang="scss" scoped>
</style>
