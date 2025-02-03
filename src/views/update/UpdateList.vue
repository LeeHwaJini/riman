<template>
  <div class="notic-wrap max-width-1400-wrap mo-pt-24 pb144">
    <h3 class="bold mt96 mb48 primary09-color main-title-area">{{ $t('NAV_NoticeAndEvent') }}</h3>

    <swiper
      :slides-per-view="'auto'"
      :free-mode="true"
      :pagination="{
        type: 'progressbar',
        clickable: true,
      }"
      :navigation="true"
      :modules="modules"
      class="category-option-area slide-bar-color-none mo-ml16"
    >
      <swiper-slide
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ active: activeSlide === index }"
        @click="setActiveSlide(index)"
      >
        {{ slide }}
      </swiper-slide>
    </swiper>

    <div class="notic-area">
      <hgroup class="notic-title-area">
        <h4 class="primary09-color bold">{{ $t('NAV_Notice') }}</h4>
        <router-link to="/update/notice" class="mypage-more-btn">{{ $t('CM_LoadMore') }}</router-link>
      </hgroup>
      <DataTable
        title=""
        :columns="columns"
        :row-data="notice"
        :is-pagination="false"
        wrap-class-name="notic-list"
        :hide-no-data="true"
        hide-header
      >
        <template #default="scope">
          <div :class="scope.value.isPinned ? 'list active' : 'list'">
            <div class="list-text-area" @click="router.push(`/update/notice/${scope.value.eventId}`)">
              <div class="flex align-center gap4 no-wrap">
                <div class="title-text gray09-color medium">{{ scope.value.eventName }}</div>
                <span v-if="isRecentItem(scope.value.date, 14)" class="ico new flex-shrink0">N</span>
              </div>
              <span class="date-text gray03-color font-montserrat">{{ scope.value.date }}</span>
            </div>
            <i class="ico arrow-right-light-g flex-shrink0" @click="router.push(`/update/notice/${scope.value.eventId}`)"></i>
          </div>
        </template>
      </DataTable>

      <div v-if="notice.length === 0" class="cart-none-area">
        <img src="@assets/images/cart_none.svg" alt="">
        <p class="title">{{ $t('UP_NoNotice') }}</p>
        <ul class="result-none-text-area">
          <li>{{ $t('UP_NoticeWillNotify') }}</li>
          <li>{{ $t('CM_NoSearchResults') }}</li>
        </ul>
      </div>
    </div>

    <div class="event-area">
      <hgroup class="notic-title-area">
        <h4 class="primary09-color bold">{{ $t('NAV_Event') }}</h4>
        <router-link to="/update/event" class="mypage-more-btn">{{ $t('CM_LoadMore') }}</router-link>
      </hgroup>

      <ul class="grid-list type03">
        <li v-for="item in event" :key="item.eventId">
          <div class="img-area" @click="getDetailItem('event', item)">
            <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
            <div class="prd-icon-area notic-icon-area">
              <span v-if="isRecentItem(item.eventStartDate, 14)" class="prd-icon new">NEW</span>
              <span v-if="getDday(item.eventEndDate) > 5 && getDday(item.eventEndDate) <= 30" class="prd-icon date">D-{{ getDday(item.eventEndDate) }}</span>
              <span v-if="getDday(item.eventEndDate) <= 5" class="prd-icon deadline">{{ getDday(item.eventEndDate) === 0 ? $t('UP_EndToday') : $t('UP_EndSoon') }}</span>
            </div>
          </div>
          <div class="event-title" @click="getDetailItem('event', item)">{{ item.eventName }}</div>
          <span class="event-date">{{ item.eventPeriod }}</span> </li>
      </ul>
      <div v-if="event.length === 0" class="cart-none-area">
        <img src="@assets/images/cart_none.svg" alt="">
        <p class="title">{{ $t('UP_NoEvent') }}</p>
        <ul class="result-none-text-area">
          <li>{{ $t('UP_EventWillNotify') }}</li>
          <li>{{ $t('CM_NoSearchResults') }}</li>
        </ul>
      </div>
    </div>

    <div class="news-area">
      <hgroup class="notic-title-area">
        <h4 class="primary09-color bold">{{ $t('NAV_News') }}</h4>
        <router-link to="/update/news" class="mypage-more-btn">{{ $t('CM_LoadMore') }}</router-link>
      </hgroup>

      <ul class="grid-list type04">
        <li v-for="item in news" :key="item.eventId">
          <div class="img-area" @click="getDetailItem('news', item)">
            <img :src="addPrefixForImage(item.thumbnailImageUrl)" alt="" class="img-cover">
          </div>
          <div class="event-title" @click="getDetailItem('news', item)">{{ item.eventName }}</div>
          <span class="event-date">{{ formatDate(item.eventStartDate, 'YYYY-MM-DD') }}</span>
        </li>
      </ul>
      <div v-if="news.length === 0" class="cart-none-area">
        <img src="@assets/images/cart_none.svg" alt="">
        <p class="title">{{ $t('UP_NoNews') }}</p>
        <ul class="result-none-text-area">
          <li>{{ $t('UP_NewsWillNotify') }}</li>
          <li>{{ $t('CM_NoSearchResults') }}</li>
        </ul>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { useRouter } from 'vue-router'
import { formatDate, getDday, isSameOrAfter, nowDate } from '@/utils/dateFormat'
import { addPrefixForImage, isRecentItem } from '@/utils/common'
import updateService from '@/http/services/update'
import { useMainStore } from '@/store/mainStore'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const router = useRouter()

const mainStore = useMainStore()
const { proxy } = getCurrentInstance()

const slides = computed(() => [proxy.$t('CM_All'), proxy.$t('NAV_Notice'), proxy.$t('NAV_Event'), proxy.$t('NAV_News')])
const activeSlide = ref(0)

const notice = ref([])
const event = ref([])
const news = ref([])

const columns = [
  {
    name: 'cellrender', // customerType 적용
    field: 'value',
    cellrender: [
      {
        type: 'html'
      }
    ]
  }]

onMounted(() => {
  onSearchUpdateList()
})

const setActiveSlide = (index) => {
  activeSlide.value = index
  switch (index) {
    case 0:
      router.push('/update')
      break
    case 1:
      router.push('/update/notice')
      break
    case 2:
      router.push('/update/event')
      break
    case 3:
      router.push('/update/news')
      break
    default:
      router.push('/update')
  }
}

const onSearchUpdateList = async () => {
  const params = {
    rank: mainStore.userInfo.rank ?? 'ALL'
  }

  const result = await updateService.getUpdateList(params)

  if (result) {
    const firstPinnedNotice = result.data.noticeList
      .find(item => item.isPinned)

    const unpinnedNotices = result.data.noticeList
      .filter(item => !item.isPinned)
      .slice(0, 3)

    notice.value = [firstPinnedNotice, ...unpinnedNotices]
      .filter(item => item?.eventId)
      .map(item => {
        return { value: { eventName: item?.eventName, date: formatDate(item?.eventStartDate, 'YYYY-MM-DD'), eventId: item?.eventId, isPinned: item?.isPinned } }
      })

    event.value = result.data.eventList
      .filter(item => isSameOrAfter(item?.eventEndDate, nowDate()))
      .slice(0, 4)

    news.value = result.data.newsList
      .slice(0, 4)
  }
}

const getDetailItem = (category, item) => {
  router.push(`update/${category}/${item.eventId}`)
}

</script>

<style lang="scss" scoped>

</style>

