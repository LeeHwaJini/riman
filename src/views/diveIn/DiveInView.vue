<template>
  <div class="divein-detail-wrap divein-wrap pb144">
    <div class="divein-top-bg-area" />
    <div class="divein-image-container">
      <div class="fade-image type01"></div>
      <div class="fade-image type02"></div>
    </div>

    <hgroup v-if="diveInsData && diveInsData.length > 0" class="divein-view-title-area type02">
      <h3 v-if="isMine">{{ $t('MY_ManageDiveIn') }}</h3>
      <div class="flex justify-between">
        <h4>{{ $t('DI_DiveInUser', {user: isMine ? userInfo.fullName : diveInsData && diveInsData[0].nickName && diveInsData[0].nickName !== '' ? diveInsData[0].nickName : diveInsData[0].userName.firstName}) }}</h4>
        <i class="ico share-n" @click="onShare"/>
      </div>
    </hgroup>
    <section class="divein-section">
      <ul class="divein-list-area">
        <li v-for="item in diveInsData" :key="item.id" @click="onOpenModal(item.id)">
          <img :src="addPrefixForImage(item.thumbnailImageUrl)" :alt="item.nickName">
          <div class="video-view-count-area">
            <i class="ico video" />
            <span class="view-count-text">{{ item.formatViewCount }}</span>
          </div>
        </li>
      </ul>
    </section>

  </div>

</template>

<script setup>
import DiveInModal from '@/components/modal/DiveInModal.vue'
import diveInService from '@/http/services/diveIn'
import { useMainStore } from '@/store/mainStore'
import { addPrefixForImage } from '@/utils/common'
import { computed, getCurrentInstance, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const userInfo = useMainStore().getUser
const route = useRoute()
const { proxy } = getCurrentInstance()
const isMine = computed(() => userInfo.userNumber === route.params.userNumber)
const { data: diveInsData } = diveInService.getDiveIns(route.params.userNumber)
const baseURL = import.meta.env.VITE_APP_BASE_URL
const isDivein = import.meta.env.VITE_APP_IS_DIVEIN === 'true'
const router = useRouter()
const onOpenModal = (diveInId) => {
  proxy.openModal({
    parent: proxy,
    component: DiveInModal,
    componentProps: {
      diveInId
    }
  })
}
const onShare = () => {
  proxy.openModal({
    parent: proxy, // 필수
    component: 'ResponsiveModal',
    componentProps: {
      contentComponent: 'ShareEventModal',
      pageState: {
        buttonTitle: proxy.$t('DI_GoDetailPage'),
        image: addPrefixForImage(diveInsData?.value[0].thumbnailImageUrl),
        url: baseURL + `/diveIn/${route.params.userNumber}`
      }
    }
  })
}
function checkIfShare() {
  if (route.query.diveInId && route.query.diveInId !== '') {
    onOpenModal(route.query.diveInId)
  }
}

onMounted(() => {
  if (!isDivein) {
    router.push('/')
  }
  checkIfShare()
})
</script>

<style lang="scss" scoped>

</style>
