<template>
  <div class="notic-wrap max-width-1400-wrap pb144">
    <h3 class="bold mt96 mb48 primary09-color main-title-area">{{ $t('NAV_News') }}</h3>

    <div class="notic-detail-area">
      <div class="notic-detail-title-area">
        <hgroup class="detail-title-text-area">
          <h3 class="gray07-color">{{ event?.eventName }}</h3>
          <i class="ico share flex-shrink0 pointer" @click="onShareModal" />
        </hgroup>
        <span class="date-text block gray03-color">{{ formatDate(event?.eventStartDate, 'YYYY-MM-DD') }}</span>
      </div>

      <div v-clean-html="event?.eventContents" class="notic-detail-content-area"></div>

      <!-- PC 이전글 다음글 레이아웃-->
      <div class="pc-notice-post-area mt64 pc">
        <div class="post-area">
          <div class="flex-shrink0 font-14 gray03-color">{{ $t('CM_PreviousPost') }}</div>
          <div class="content-text-area">
            <div class="content-text font-18" @click="router.push(`/update/news/${event.prevDto?.eventId}`)">{{ event.prevDto?.eventName }}</div>
            <div class="date-text font-12 gray03-color">{{ formatDate(event.prevDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
        </div>

        <div class="post-area">
          <div class="flex-shrink0 font-14 gray03-color">{{ $t('CM_NextPost') }}</div>
          <div class="content-text-area">
            <div class="content-text font-18" @click="router.push(`/update/news/${event.nextDto?.eventId}`)">{{ event.nextDto?.eventName }}</div>
            <div class="date-text font-12 gray03-color">{{ formatDate(event.nextDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
        </div>
      </div>
      <!-- //PC 이전글 다음글 레이아웃-->

      <!-- mo 이전글 다음글 레이아웃-->
      <div class="mo-notice-post-area mt24 mo767">
        <div class="post-area">
          <div class="content-text-area">
            <div class="content-text font-16" @click="router.push(`/update/news/${event.prevDto?.eventId}`)">{{ event.prevDto?.eventName }}</div>
            <div class="date-text font-10 gray03-color">{{ formatDate(event.prevDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
        </div>

        <div class="post-area">
          <div class="content-text-area">
            <div class="content-text font-16" @click="router.push(`/update/news/${event.nextDto?.eventId}`)">{{ event.nextDto?.eventName }}</div>
            <div class="date-text font-10 gray03-color">{{ formatDate(event.nextDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
        </div>
      </div>
      <!-- //mo 이전글 다음글 레이아웃-->

      <div class="mo-bottom-btn notic-list-btn-area">
        <RButton class="btn small type02" :label="$t('UP_ViewList')" @click="router.push('/update/news')" />
      </div>
    </div>

  </div>

</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import updateService from '@/http/services/update'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils/dateFormat'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const { proxy } = getCurrentInstance()

const route = useRoute()
const router = useRouter()

const eventId = route.params.eventId
const event = ref({})
const attachmentList = ref([])

const vCleanHtml = buildVueDompurifyHTMLDirective()

onMounted(() => {
  onSearchNewsItem()
})

const onSearchNewsItem = async () => {
  const params = {
    eventId
  }
  const result = await updateService.getNewsItem(params)

  if (result) {
    event.value = result.data

    attachmentList.value = Object.keys(event.value)
      .filter(key => /^attachment\d+$/.test(key) && event.value[key]?.attachmentUrl)
      .map(key => event.value[key])
  }
}

const onShareModal = () => {
  proxy.openModal({
    parent: proxy, // 필수
    component: 'ResponsiveModal',
    componentProps: {
      contentComponent: 'ShareEventModal'
    }
  })
}

</script>

<style lang="scss" scoped>

</style>
