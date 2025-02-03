<template>
  <div class="max-width-wrap full-width-wrap pb144">

    <div class="main-title-area">
      <h3 class="">{{ $t('NAV_Notification') }}</h3>
    </div>

    <RTabs
      v-if="isPlanner"
      v-model="tabValue"
      :tab-list="tabList"
      class="tab type02"
      @click="setActiveSlide(tabValue)"
    />
    <!--
      *******************************
      커스터머일 경우 RTabs,q-tab-panels, q-tab-panel 제거 후
      q-tab-panel 안에 있는 레이아웃 사용
      *******************************
    -->
    <q-tab-panels v-model="tabValue" class="tab-list type02" >
      <q-tab-panel name="COMMERCE">
        <swiper
          :slides-per-view="'auto'"
          :free-mode="true"
          :pagination="{
            type: 'progressbar',
            clickable: true,
          }"
          :navigation="true"
          :modules="modules"
          class="category-option-area small slider-ml-8 slide-bar-color-none mt24"
        >
          <swiper-slide
            v-for="(slide, index) in commerceSlides"
            :key="index"
            :class="{ active: activeCommerceSlide === slide.name }"
            @click="setActiveSlide('COMMERCE', slide)"
          >
            {{ slide.label }}
          </swiper-slide>
        </swiper>

        <div class="plr16 relative">
          <!-- 플래너일 경우 class 'toggle-switch' 추가  -->
          <div class="notification-toggle-area">
            <!-- <div class="notification-toggle-area" :class="{'toggle-switch' : planner}"> -->
            <!-- <RSwitch
              v-if="planner"
              v-model="notification"
              class="switch type01 "
              label="안 읽은 알림만 보기"
            /> -->

            <!-- 안 읽은 알림일 경우 class '' -->
            <i v-if="notification.length" class="ico toggle-menu-n" @click="onToggleMenuVisible" />
            <transition name="fade">
              <div v-show="menuVisible" class="tooltip-area type04" :class="{'active' :menuVisible }">
                <div class="menu font-14" @click="onReadAll">{{ $t('NT_MarkAllAsRead') }}</div>
                <div class="menu font-14" @click="onDeleteAll">{{ $t('NT_DeleteAll') }}</div>
              </div>
            </transition>
          </div>

          <ul v-if="notification.length" class="notification-list" >
            <li v-for="item in notification" :key="item">
              <i v-if="item.notiCenterCategory === 'BENEFIT'" :class="['ico notic-benefit notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'SIGNUP'" :class="['ico notic-benefit notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'NOTICE'" :class="['ico notic-alarm notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'DELIVERY'" :class="['ico notic-delivery notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'PROMOTION'" :class="['ico notic-advancement notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'ORDER' || item.notiCenterCategory === 'RETURN'" :class="['ico notic-order notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'COMPENSATION'" :class="['ico notic-allowance notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'STATISTICS'" :class="['ico notic-statistics notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'INQUIRY'" :class="['ico notic-inquiry notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'NEWFEATURE'" :class="['ico notic-new notic-icon', { active: item.readYn === false }]" />
              <div class="text-area">
                <span class="date-text">{{ formatDate(item.notiDatetime, 'YYYY.MM.DD') }}</span>
                <b class="title-text">{{ item.title }}</b>
                <div class="sub-text" v-html="item.contents"></div>
                <a class="btn type13" @click.prevent="navigateToLink(item.linkCode, item.linkParam)">{{ handleI18n(item.linkCode) }}</a>
              </div>
              <i class="ico delete pointer" @click="onDelete(item.notiCenterId, item.notiCenterCategory)"/>
            </li>
          </ul>

          <!-- 결과 없을경우 -->
          <div v-else class="cart-none-area">
            <img src="@assets/images/cart_none.svg" alt="">
            <p class="title">{{ $t('NT_NoData') }}</p>
          </div>
          <!-- //결과 없을경우 -->
        </div>

      </q-tab-panel>
      <q-tab-panel name="RBO">
        <swiper
          :slides-per-view="'auto'"
          :free-mode="true"
          :pagination="{
            type: 'progressbar',
            clickable: true,
          }"
          :navigation="true"
          :modules="modules"
          class="category-option-area small slider-ml-8 slide-bar-color-none mt24"
        >
          <swiper-slide
            v-for="(slide, index) in rboSlides"
            :key="index"
            :class="{ active: activeRboSlide === slide.name }"
            @click="setActiveSlide('RBO', slide)"
          >
            {{ slide.label }}
          </swiper-slide>

        </swiper>

        <div class="plr16 relative">
          <!-- 플래너일 경우 class 'toggle-switch' 추가  -->
          <div class="notification-toggle-area">
            <!-- <RSwitch
              v-if="planner"
              v-model="notification"
              class="switch type01 "
              label="안 읽은 알림만 보기"
            /> -->

            <!-- 안 읽은 알림일 경우 class '' -->
            <i v-if="notification.length" class="ico toggle-menu-n" @click="onToggleMenuVisible" />
            <transition name="fade">
              <div v-show="menuVisible" class="tooltip-area type04" :class="{'active' :menuVisible }">
                <div class="menu font-14" @click="onReadAll">{{ $t('NT_MarkAllAsRead') }}</div>
                <div class="menu font-14" @click="onDeleteAll">{{ $t('NT_DeleteAll') }}</div>
              </div>
            </transition>
          </div>

          <ul v-if="notification.length" class="notification-list">
            <li v-for="item in notification" :key="item">
              <i v-if="item.notiCenterCategory === 'BENEFIT'" :class="['ico notic-benefit notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'SIGNUP'" :class="['ico notic-benefit notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'NOTICE'" :class="['ico notic-alarm notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'DELIVERY'" :class="['ico notic-delivery notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'PROMOTION'" :class="['ico notic-advancement notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'ORDER' || item.notiCenterCategory === 'RETURN'" :class="['ico notic-order notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'COMPENSATION'" :class="['ico notic-allowance notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'STATISTICS'" :class="['ico notic-statistics notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'INQUIRY'" :class="['ico notic-inquiry notic-icon', { active: item.readYn === false }]" />
              <i v-if="item.notiCenterCategory === 'NEWFEATURE'" :class="['ico notic-new notic-icon', { active: item.readYn === false }]" />
              <div class="text-area">
                <span class="date-text">{{ formatDate(item.notiDatetime, 'YYYY.MM.DD') }}</span>
                <b class="title-text">{{ item.title }}</b>
                <div class="sub-text" v-html="item.contents"></div>
                <a class="btn type13" @click.prevent="navigateToLink(item.linkCode, item.linkParam)">{{ handleI18n(item.linkCode) }}</a>
              </div>
              <i class="ico delete pointer" @click="onDelete(item.notiCenterId, item.notiCenterCategory)"/>
            </li>
          </ul>

          <!-- 결과 없을경우 -->
          <div v-else class="cart-none-area">
            <img src="@assets/images/cart_none.svg" alt="">
            <p class="title">{{ $t('NT_NoData') }}</p>
          </div>
          <!-- //결과 없을경우 -->
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import notificationService from '@/http/services/notification'
import { useMainStore } from '@/store/mainStore'
import { formatDate } from '@/utils/dateFormat'
import { queryClient } from '@/http/queryClient'
import { checkPlanner, goRboSite } from '@/utils/common'
import { useRoute, useRouter } from 'vue-router'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const mainStore = useMainStore()
const userSeqNo = mainStore.userInfo.userSeqNo
const userNumber = mainStore.userInfo.userNumber
const userRank = mainStore.userInfo.rank
const userMasterId = ref(undefined)

const tabList = computed(() => [
  { label: proxy.$t('CM_Commerce'), name: 'COMMERCE' },
  { label: proxy.$t('CM_Rbo'), name: 'RBO' }
])

const tabValue = ref('COMMERCE')

const commerceSlides = computed(() => [
  { label: proxy.$t('CM_All'), name: 'ALL' },
  { label: proxy.$t('CM_Benefit'), name: 'BENEFIT' },
  { label: proxy.$t('CM_Inquiry'), name: 'INQUIRY' },
  { label: proxy.$t('CM_Order'), name: 'ORDER' },
  { label: proxy.$t('CM_Delivery'), name: 'DELIVERY' },
  { label: proxy.$t('CM_Return'), name: 'RETURN' },
  { label: proxy.$t('CM_NoticeAndEvent'), name: 'NOTICE' }
])

const rboSlides = computed(() => [
  { label: proxy.$t('CM_All'), name: 'ALL' },
  { label: proxy.$t('CM_Promotion'), name: 'PROMOTION' },
  { label: proxy.$t('CM_Signup'), name: 'SIGNUP' }
])
const activeCommerceSlide = ref('ALL')
const activeRboSlide = ref('ALL')

const defaultTab = route.params.category

const params = ref({
  userSeqNo,
  userNumber,
  userRank,
  notiCenterType: defaultTab.toUpperCase() ?? tabValue,
  notiCenterCategory: tabValue.value === 'COMMERCE' ? activeCommerceSlide : activeRboSlide
})
const notification = ref([])

const menuVisible = ref(false)

const onToggleMenuVisible = () => {
  menuVisible.value = !menuVisible.value
}

const isPlanner = computed(() => checkPlanner())

onMounted(() => {
  if (defaultTab) {
    tabValue.value = defaultTab.toUpperCase()
  }
  document.addEventListener('scroll', fetchNext)

  if (data.value) {
    initOptions(data.value)
  }
})

onUnmounted(() => {
  document.removeEventListener('scroll', fetchNext)

  const result = notificationService.updateReadYn(
    notification.value
      .filter(i => i.readYn === false)
      .map(i => {
        return {
          userId: tabValue.value === 'COMMERCE' ? userSeqNo : userMasterId.value,
          notiCenterId: i.notiCenterId,
          notiCenterType: i.notiCenterType,
          notiCenterCategory: i.notiCenterCategory,
          notiCenterDetailCategory: i.notiCenterDetailCategory
        }
      }))

  if (result) {
    queryClient.invalidateQueries({ queryKey: ['get-notification-list'] })
  }
})

const setActiveSlide = (tab, slide) => {
  router.push(`/notification/${tab.toLowerCase()}`)

  if (tab === 'COMMERCE') {
    params.value = {
      userSeqNo,
      userRank,
      notiCenterType: tab,
      notiCenterCategory: slide?.name
    }

    activeRboSlide.value = 'ALL'
    activeCommerceSlide.value = slide?.name ?? 'ALL'
  } else {
    params.value = {
      userSeqNo,
      userNumber,
      userRank,
      notiCenterType: tab,
      notiCenterCategory: slide?.name
    }

    activeCommerceSlide.value = 'ALL'
    activeRboSlide.value = slide?.name ?? 'ALL'
  }
}

const onReadAll = async () => {
  const param = {
    userId: tabValue.value === 'COMMERCE' ? userSeqNo : userMasterId.value,
    userRank,
    notiCenterType: tabValue.value
  }

  const result = await notificationService.updateReadYnAll(param)

  if (result) {
    menuVisible.value = false
    queryClient.invalidateQueries({ queryKey: ['get-notification-list'] })
  }
}

const onDelete = async (notiCenterId, notiCenterCategory) => {
  const param = {
    userId: tabValue.value === 'COMMERCE' ? userSeqNo : userMasterId.value,
    notiCenterId,
    notiCenterCategory
  }

  await proxy.$confirm(proxy.$t('NT_DeleteConfirm'), {
    title: '',
    okLabel: proxy.$t('CM_Delete'),
    ok: async () => {
      const result = await notificationService.delete(param)

      if (result) {
        proxy.$alert(proxy.$t('ALT_DeleteSuccess'), {
          ok: () => {
            queryClient.invalidateQueries({ queryKey: ['get-notification-list'] })
          }
        })
      }
    }
  })
}

const onDeleteAll = async () => {
  const param = {
    userId: tabValue.value === 'COMMERCE' ? userSeqNo : userMasterId.value,
    userRank,
    notiCenterType: tabValue.value
  }

  await proxy.$confirm(proxy.$t('NT_DeleteAllConfirm'), {
    title: proxy.$t('NT_DeleteAllConfirmTitle'),
    okLabel: proxy.$t('CM_Delete'),
    ok: async () => {
      const result = await notificationService.deleteAll(param)
      if (result) {
        proxy.$alert(proxy.$t('ALT_DeleteSuccess'), {
          ok: () => {
            menuVisible.value = false
            queryClient.invalidateQueries({ queryKey: ['get-notification-list'] })
          }
        })
      }
    }
  })
}
const {
  data,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
} = notificationService.getNotificationList(params)

const lastScrollTop = ref(0)
const isLastPageReadUpdated = ref(false)

const fetchNext = () => {
  const isAlertShowed = document.getElementsByClassName('q-card')[0]

  if (isAlertShowed) {
    return
  }

  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  if (scrollTop + windowHeight + document.querySelector('.text-area').clientHeight >= documentHeight) {
    if (!isFetchingNextPage.value && hasNextPage.value) {
      fetchNextPage().then(result => {
        if (result) {
          const data = result.data.pages.map(i => i.data.list)
          const updateTarget = data[data.length - 2] // 읽음처리 업데이트하지 않은 데이터

          updateReadYn(updateTarget)
        }
      })
    }
  }

  const isScrollingDown = scrollTop > lastScrollTop.value
  lastScrollTop.value = scrollTop

  if (!hasNextPage.value && isScrollingDown && !isLastPageReadUpdated.value) {
    const notification = data.value.pages
    const lastPage = notification[notification.length - 1]

    updateReadYn(lastPage.data.list)
    isLastPageReadUpdated.value = true
  }
}

const updateReadYn = (updateTarget) => {
  const param = updateTarget
    .filter(i => !i.readYn)
    .map(i => {
      return {
        userId: i.notiCenterType === 'COMMERCE' ? userSeqNo : i.userMasterId,
        notiCenterId: i.notiCenterId,
        notiCenterType: i.notiCenterType,
        notiCenterCategory: i.notiCenterCategory,
        notiCenterDetailCategory: i.notiCenterDetailCategory
      }
    })

  if (!param.length) return

  notificationService.updateReadYn(param)
}

const initOptions = (data) => {
  const temp = data?.pages?.map(item => item?.data?.list).filter(i => i)
  if (temp.length === 0) return

  notification.value = temp.reduce((pre, cur) => [...pre, ...cur], []).map(i => {
    return {
      ...i,
      contents: i.contents.replace(/\n/g, '<br>')
    }
  })
}

const navigateToLink = (code, param) => {
  let url

  switch (code) {
    case 'LINK_POINT':
      url = '/mypage/point'
      break
    case 'LINK_ORDER':
      url = '/mypage/orderList'
      break
    case 'LINK_RETURN':
      url = '/mypage/returnList'
      break
    case 'LINK_INQUIRY':
      url = '/customer/inquiry/list'
      break
    case 'LINK_NOTICE':
      url = '/update/notice'
      break
    case 'LINK_EVENT':
      url = '/update/event'
      break
    case 'LINK_PROMOTION':
      goRboSite('link_promotion')
      break
    case 'LINK_MEMBER': // param
      goRboSite('link_planner')
      break
    case 'LINK_CUSTOMER': // param
      goRboSite('link_customer')
      break
    default:
      return
  }

  if (url) {
    router.push(url)
  }
}

const handleI18n = (code) => {
  let key

  switch (code) {
    case 'LINK_POINT':
      key = 'NT_Point'
      break
    case 'LINK_ORDER':
      key = 'NT_Order'
      break
    case 'LINK_RETURN':
      key = 'NT_Return'
      break
    case 'LINK_INQUIRY':
      key = 'NT_Inquiry'
      break
    case 'LINK_NOTICE':
      key = 'NT_Notice'
      break
    case 'LINK_EVENT':
      key = 'NT_Event'
      break
    case 'LINK_PROMOTION':
      key = 'NT_Promotion'
      break
    case 'LINK_MEMBER':
      key = 'NT_Member'
      break
    case 'LINK_CUSTOMER':
      key = 'NT_Consumer'
      break
    default:
      return
  }

  return proxy.$t(key)
}

watch(data, (v) => {
  if (v) {
    initOptions(v)
  }
}, { immediate: true })

watch(notification, (v) => {
  if (v[0]?.notiCenterType === 'RBO') {
    userMasterId.value = v[0].userMasterId
  }
})

</script>

<style lang="scss" scoped>

</style>
