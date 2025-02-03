<template>
  <div v-if="isLogined && isPlanner" class="notic-wrap max-width-1400-wrap pb144 cs-wrap faq-wrap">
    <div class="cs-notic-top-area small">
      <i class="ico speaker"/>
      <div class="icon-text-area">
        <div class="text-area" >
          <span v-for="(notice, index) in noticeListData?.pinnedList" :key="notice.noticeId" class="text" :class="{ hidden: currentIndex !== index, slide: isSliding }" @click="router.push(`/update/notice/${notice.eventId}`)">
            {{ notice.eventName }}
          </span>
        </div>
        <i class="ico arrow-right-n" @click="router.push(`/update/notice/${noticeListData?.pinnedList[currentIndex].eventId}`)"/>
      </div>
    </div>

    <div class="cs-left-title-area pc-1023">
      <h3 class="bold primary09-color">{{ $t('CS_Certificate') }}</h3>
    </div>

    <ul class="left-title-right-icon-area">
      <li v-if="certConsumptionData" class="" @click="onOpenModal('comsumption')">
        {{ $t('CS_SelfConsumptionCert') }}
        <i class="ico arrow-right-light-g"/>
      </li>
      <li v-if="certPlannerData" class="" @click="onOpenModal('planner')">
        {{ $t('CS_SalespersonCert') }}
        <i class="ico arrow-right-light-g"/>
      </li>
    </ul>

  </div>
  <CertConsumptionModal ref="consumptionModal" :data="certConsumptionData" />
  <CertPlannerModal ref="plannerModal" :data="certPlannerData" />
</template>

<script setup>
import searchService from '@/http/services/search'
import { useMainStore } from '@/store/mainStore'
import { checkPlanner } from '@/utils/common'
import { isLogin } from '@/utils/login'
import { computed, getCurrentInstance, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import CertPlannerModal from '../modal/CertPlannerModal.vue'
import CertConsumptionModal from '../modal/CertConsumptionModal.vue'
import customerService from '@/http/services/customer'

const currentIndex = ref(0)
const isSliding = ref(false)
const mainStore = useMainStore()
const { proxy } = getCurrentInstance()
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const router = useRouter()
const consumptionModal = ref(null)
const plannerModal = ref(null)
const certPlannerData = ref(null)
const certConsumptionData = ref(null)
const noticeParam = reactive({
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  pageNumber: 1,
  pageSize: 100
})

const { data: noticeListData } = searchService.getNoticeSearch(noticeParam)
async function getData() {
  const res = await customerService.getCertificatePlanner()
  if (res && res.data) {
    certPlannerData.value = res.data
  }
  const result = await customerService.getCertificateConsumption()
  if (result && result.data) {
    certConsumptionData.value = result.data
  }
}
onMounted(() => {
  if (!isPlanner.value) {
    proxy.$alert(proxy.$t('ALT_PlannerNotice'), {
      ok: () => {
        router.push('/customer')
      }
    })
  }
  getData()
  setInterval(() => {
    isSliding.value = true
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % 3 // 3으로 순환
      isSliding.value = false
    }, 500)
  }, 3000)
})

const onOpenModal = (type) => {
  if (type === 'comsumption') {
    if (consumptionModal.value) {
      consumptionModal.value.show()
    }
  } else {
    if (plannerModal.value) {
      plannerModal.value.show()
    }
  }
}
</script>
