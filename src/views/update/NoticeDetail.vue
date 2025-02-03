<template>
  <div class="notic-wrap max-width-1400-wrap pb144">
    <h3 class="bold mt96 mb48 primary09-color main-title-area">{{ $t('NAV_Notice') }}</h3>

    <div class="notic-detail-area">
      <div class="notic-detail-title-area">
        <hgroup class="detail-title-text-area">
          <h3 class="gray07-color">{{ event?.eventName }}</h3>
        </hgroup>
        <span class="date-text block gray03-color">{{ formatDate(event?.eventStartDate, 'YYYY-MM-DD') }}</span>
      </div>

      <div v-clean-html="event?.eventContents" class="notic-detail-content-area"></div>

      <ul v-if="attachmentList.length !== 0" class="file-info-area mt48">
        <li v-for="(item, index) in attachmentList" :key="item.attachmentUrl" @click="fileDownload(index)">
          <i :class="`ico ${item.attachmentExtension}`" /><span class="font-14 gray06-color block">{{ item.attachmentName }}.{{ item.attachmentExtension }}</span>
        </li>
      </ul>

      <!-- PC 이전글 다음글 레이아웃-->
      <div class="pc-notice-post-area mt64 pc">
        <div class="post-area">
          <div class="flex-shrink0 font-14 gray03-color">{{ $t('CM_PreviousPost') }}</div>
          <span :class="['notic-icon new', { 'opacity0': !isRecentItem(event.prevDto?.eventStartDate, 14) }]">NEW</span>
          <div class="content-text-area" @click="router.push(`/update/notice/${event.prevDto?.eventId}`)">
            <div class="content-text font-18">{{ event.prevDto?.eventName }}</div>
            <div class="date-text font-12 gray03-color">{{ formatDate(event.prevDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
        </div>

        <div class="post-area">
          <div class="flex-shrink0 font-14 gray03-color">{{ $t('CM_NextPost') }}</div>
          <span :class="['notic-icon new', { 'opacity0': !isRecentItem(event.nextDto?.eventStartDate, 14) }]">NEW</span>
          <div class="content-text-area" @click="router.push(`/update/notice/${event.nextDto?.eventId}`)">
            <div class="content-text font-18">{{ event.nextDto?.eventName }}</div>
            <div class="date-text font-12 gray03-color">{{ formatDate(event.nextDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
        </div>
      </div>
      <!-- //PC 이전글 다음글 레이아웃-->

      <!-- mo 이전글 다음글 레이아웃-->
      <div class="mo-notice-post-area mt24 mo767">
        <div class="post-area">
          <div class="content-text-area" @click="router.push(`/update/notice/${event.prevDto?.eventId}`)">
            <div class="content-text font-16">{{ event.prevDto?.eventName }}</div>
            <div class="date-text font-10 gray03-color">{{ formatDate(event.prevDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
          <span :class="['notic-icon new', { 'opacity0': !isRecentItem(event.prevDto?.eventStartDate, 14) }]">NEW</span>
        </div>

        <div class="post-area">
          <div class="content-text-area" @click="router.push(`/update/notice/${event.nextDto?.eventId}`)">
            <div class="content-text font-16">{{ event.nextDto?.eventName }}</div>
            <div class="date-text font-10 gray03-color">{{ formatDate(event.nextDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
          <span :class="['notic-icon new', { 'opacity0': !isRecentItem(event.nextDto?.eventStartDate, 14) }]">NEW</span>
        </div>
      </div>
      <!-- //mo 이전글 다음글 레이아웃-->

      <div class="mo-bottom-btn notic-list-btn-area">
        <RButton class="btn small type02" :label="$t('UP_ViewList')" @click="router.push('/update/notice')" />
      </div>
    </div>

  </div>
</template>

<script setup>
import updateService from '@/http/services/update'
import { useMainStore } from '@/store/mainStore'
import { addPrefixForImage, isRecentItem } from '@/utils/common'
import { formatDate } from '@/utils/dateFormat'
import http from '@/utils/http'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const route = useRoute()
const router = useRouter()

const mainStore = useMainStore()

const eventId = route.params.eventId
const event = ref({})
const attachmentList = ref([])

const vCleanHtml = buildVueDompurifyHTMLDirective()

onMounted(() => {
  onSearchNoticeItem()
})

const onSearchNoticeItem = async () => {
  const params = {
    eventId,
    rank: mainStore.userInfo.rank ?? 'ALL',
    userId: mainStore.userInfo.userSeqNo
  }
  const result = await updateService.getNoticeItem(params)

  if (result) {
    event.value = result.data

    attachmentList.value = Object.keys(event.value)
      .filter(key => /^attachment\d+$/.test(key) && event.value[key]?.attachmentUrl)
      .map(key => event.value[key])
  }
}

const fileDownload = (index) => {
  const file = attachmentList.value[index]

  return http().downloadFileS3(`${addPrefixForImage(file.attachmentUrl)}`, file.attachmentName + '.' + file.attachmentExtension)
}

</script>

<style lang="scss" scoped>

</style>
