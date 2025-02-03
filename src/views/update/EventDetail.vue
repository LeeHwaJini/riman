<template>
  <div class="notic-wrap max-width-1400-wrap pb144">
    <h3 class="bold mt96 mb48 primary09-color main-title-area">{{ $t('NAV_Event') }}</h3>

    <div class="notic-detail-area">
      <div class="notic-detail-title-area">
        <hgroup class="detail-title-text-area">
          <h3 class="gray07-color">{{ event?.eventName }}</h3>
          <i class="ico share flex-shrink0 pointer" @click="onShareModal" />
        </hgroup>
        <span class="date-text block gray03-color">
          {{ formatDate(event?.eventStartDate, 'YYYY-MM-DD') }}
          -
          {{ formatDate(event?.eventEndDate, 'YYYY-MM-DD') === '9999-12-31' ? $t('UP_NoTimeLimit') : formatDate(event?.eventEndDate, 'YYYY-MM-DD') }}
        </span>
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
          <div class="notic-icon-area">
            <span :class="['notic-icon new', { 'opacity0': !isRecentItem(event.prevDto?.eventStartDate, 14) }]">NEW</span>
            <span v-if="getDday(event.prevDto?.eventEndDate) > 5 && getDday(event.prevDto?.eventEndDate) <= 30" class="prd-icon date">D-{{ getDday(event.prevDto?.eventEndDate) }}</span>
            <span v-if="getDday(event.prevDto?.eventEndDate) <= 5" class="prd-icon deadline blank-fixed">{{ getDday(event.prevDto?.eventEndDate) === 0 ? $t('UP_EndToday') : $t('UP_EndSoon') }}</span>
          </div>
          <div class="content-text-area">
            <div class="content-text font-18" @click="router.push(`/update/event/${event.prevDto?.eventId}`)">{{ event.prevDto?.eventName }}</div>
            <div class="date-text font-12 gray03-color">{{ formatDate(event.prevDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
        </div>

        <div class="post-area">
          <div class="flex-shrink0 font-14 gray03-color">{{ $t('CM_NextPost') }}</div>
          <div class="notic-icon-area">
            <span :class="['notic-icon new', { 'opacity0': !isRecentItem(event.nextDto?.eventStartDate, 14) }]">NEW</span>
            <span v-if="getDday(event.nextDto?.eventEndDate) > 5 && getDday(event.nextDto?.eventEndDate) <= 30" class="prd-icon date blank-fixed">D-{{ getDday(event.nextDto?.eventEndDate) }}</span>
            <span v-if="getDday(event.nextDto?.eventEndDate) <= 5" class="prd-icon deadline">{{ getDday(event.nextDto?.eventEndDate) === 0 ? $t('UP_EndToday') : $t('UP_EndSoon') }}</span>
          </div>

          <div class="content-text-area">
            <div class="content-text font-18" @click="router.push(`/update/event/${event.nextDto?.eventId}`)">{{ event.nextDto?.eventName }}</div>
            <div class="date-text font-12 gray03-color">{{ formatDate(event.nextDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
        </div>
      </div>
      <!-- //PC 이전글 다음글 레이아웃-->

      <!-- mo 이전글 다음글 레이아웃-->
      <div class="mo-notice-post-area mt24 mo767">
        <div class="post-area">
          <div class="content-text-area">
            <div class="content-text font-16" @click="router.push(`/update/event/${event.prevDto?.eventId}`)">{{ event.prevDto?.eventName }}</div>
            <div class="date-text font-10 gray03-color">{{ formatDate(event.prevDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
          <div class="notic-icon-area">
            <span v-if="isRecentItem(event.prevDto?.eventStartDate, 14)" class="notic-icon new">NEW</span>
            <span v-if="getDday(event.prevDto?.eventEndDate) > 5 && getDday(event.prevDto?.eventEndDate) <= 30" class="prd-icon date">D-{{ getDday(event.prevDto?.eventEndDate) }}</span>
            <span v-if="getDday(event.prevDto?.eventEndDate) <= 5" class="prd-icon deadline">{{ getDday(event.prevDto?.eventEndDate) === 0 ? $t('UP_EndToday'): $t('UP_EndSoon') }}</span>
          </div>
        </div>

        <div class="post-area">
          <div class="content-text-area">
            <div class="content-text font-16" @click="router.push(`/update/event/${event.nextDto?.eventId}`)">{{ event.nextDto?.eventName }}</div>
            <div class="date-text font-10 gray03-color">{{ formatDate(event.nextDto?.eventStartDate, 'YYYY-MM-DD') }}</div>
          </div>
          <div class="notic-icon-area">
            <span v-if="isRecentItem(event.nextDto?.eventStartDate, 14)" class="notic-icon new">NEW</span>
            <span v-if="getDday(event.nextDto?.eventEndDate) > 5 && getDday(event.nextDto?.eventEndDate) <= 30" class="prd-icon date">D-{{ getDday(event.nextDto?.eventEndDate) }}</span>
            <span v-if="getDday(event.nextDto?.eventEndDate) <= 5" class="prd-icon deadline">{{ getDday(event.nextDto?.eventEndDate) === 0 ? $t('UP_EndToday'): $t('UP_EndSoon') }}</span>
          </div>

        </div>
      </div>
      <!-- //mo 이전글 다음글 레이아웃-->

      <div class="mo-bottom-btn notic-list-btn-area">
        <RButton class="btn small type02" :label="$t('UP_ViewList')" @click="router.push('/update/event')" />
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import updateService from '@/http/services/update'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/store/mainStore'
import { formatDate, getDday } from '@/utils/dateFormat'
import { addPrefixForImage, isRecentItem } from '@/utils/common'
import http from '@/utils/http'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'

const { proxy } = getCurrentInstance()

const route = useRoute()
const router = useRouter()

const mainStore = useMainStore()

const eventId = route.params.eventId
const isInProgress = route.query.isInProgress
const sortType = route.query.sortType

const event = ref({})
const attachmentList = ref([])

const vCleanHtml = buildVueDompurifyHTMLDirective()

onMounted(() => {
  onSearchEventItem()
})

const onSearchEventItem = async () => {
  const params = {
    eventId,
    isInProgress: isInProgress ?? true,
    sortType: sortType ?? 'NEWEST',
    rank: mainStore.userInfo.rank ?? 'ALL'
  }

  const result = await updateService.getEventItem(params)

  if (result) {
    event.value = result.data
  }
  attachmentList.value = Object.keys(event.value)
    .filter(key => /^attachment\d+$/.test(key) && event.value[key]?.attachmentUrl)
    .map(key => event.value[key])
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

const fileDownload = (index) => {
  const file = attachmentList.value[index]

  return http().downloadFileS3(`${addPrefixForImage(file.attachmentUrl)}`, file.attachmentName + '.' + file.attachmentExtension)
}

</script>

<style lang="scss" scoped>

</style>
