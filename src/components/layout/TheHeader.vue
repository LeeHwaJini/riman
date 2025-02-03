<!--
  TheHeader
  create by jhchoi
-->
<template>
  <!-- GNB : Global Navigation Bar -->
  <header ref="header" class="header-wrap" :class="{'banner-open' : isPersonalMall && isBannerOpen, 'banner-close': isPersonalMall&& !isBannerOpen}">
    <div>
      <PersonalBanner @toggle-personal-banner="togglePersonalBanner" @check-personal-mall="checkPersonalMall"/>
      <nav class="header-content">
        <div class="header-left-area">
          <router-link to="/" class="logo-img-area" />

          <q-btn-toggle
            v-model="model"
            toggle-color="primary"
            :options="[
              {label: $t('CM_TabMall'), value: 'mall'},
              {label: $t('CM_TabRbo'), value: 'rbo'}
            ]"
            class="toggle type01"
            @update:model-value="onChangeToggle"
          />
        </div>

        <ul class="header-right-area">
          <li v-if="isLogin()">
            <!-- 알림있을 경우 notic-active 클래스 추가 -->
            <i :class="['ico notic', { 'notic-active': isNotificationExists }]" @click="router.push({path: `/notification/${notificationTab.toLocaleLowerCase()}`})"></i>
          </li>
          <li @click="goCart">
            <div class="relative">
              <i class="ico cart"></i>
              <span class="badge type01">{{ $displayMaxNumber(standardCartBadge) }}</span>
            </div>
          </li>
          <li class="menu-item" @click="openMenu">
            <span class="ko">{{ $t('CM_ShowMenu') }}</span>
          </li>

        </ul>

      </nav>
    </div>

    <TopNavBar v-if="isTopNavBar" />
    <SubTopNavBar v-if="isSubTopNavBar"/>
  </header>

  <!-- LNB : Local Navigation Bar (PC 메뉴) -->
  <LocalNavBar v-if="isShowLNB" @close-menu="closeMenu" />

  <!-- SNB : Side Navigation Bar (MO 메뉴 )-->
  <SideNavBar v-if="isTablet" v-model="isShowSNB"/>

</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'

import { useMainStore } from '@/store/mainStore'
import { isLogin } from '@utils/login'
import { useRouter } from 'vue-router'
import { goRboSite } from '@/utils/common'
import cartService from '@/http/services/cart'
import notificationService from '@/http/services/notification'
import { ROLES_BE } from '@/utils/constant'

const props = defineProps({
  isTopNavBar: {
    type: Boolean,
    default: false
  },
  isSubTopNavBar: {
    type: Boolean,
    default: false
  }
})

const { proxy } = getCurrentInstance()
const router = useRouter()
const mainStore = useMainStore()
const userSeqNo = mainStore.userInfo.userSeqNo
const userRank = mainStore.userInfo.rank

const { standardCartBadge } = storeToRefs(mainStore)
const isBannerOpen = ref(true)
const isPersonalMall = ref(false)
const notificationTab = ref('COMMERCE')
const isNotificationExists = ref(false)
const header = ref(null)

const togglePersonalBanner = (value) => {
  isBannerOpen.value = value
}

const checkPersonalMall = (value) => {
  isPersonalMall.value = value

  setHeaderheight()
}

/**
 * header 높이값 store 저장 (헤리티지 모션 계산에 필요)
 */
const setHeaderheight = () => {
  if (isPersonalMall.value) {
    let personalMallHeigth = 0
    if (proxy.$isTablet()) {
      personalMallHeigth = 53
    } else {
      personalMallHeigth = 90
    }
    mainStore.headerHeight = header.value.getBoundingClientRect().height + personalMallHeigth
  }
}

const isShowLNB = ref(false)
const isShowSNB = ref(false)
const isTablet = computed(() => proxy.$isTablet())

onMounted(() => {
  if (isLogin()) {
    checkUnreadNotificationExists()
  }

  mainStore.headerHeight = header.value.getBoundingClientRect().height

  window.addEventListener('openMenu', openMenu)
})

onUnmounted(() => {
  window.removeEventListener('openMenu', openMenu)
})

const checkUnreadNotificationExists = async () => {
  const param = {
    userId: userSeqNo,
    userRank
  }
  const result = await notificationService.getIsUnreadNotificationExists(param)

  if (result) {
    const { commerceNonReadExists, rboNonReadExists } = result.data

    isNotificationExists.value = commerceNonReadExists || rboNonReadExists

    if (rboNonReadExists) {
      notificationTab.value = 'RBO'
    }

    if (commerceNonReadExists) {
      notificationTab.value = 'COMMERCE'
    }
  }
}

const model = ref('mall')

const openMenu = () => {
  if (isTablet.value) {
    isShowSNB.value = true
  } else {
    document.body.style.overflow = 'hidden'
    isShowLNB.value = true
  }
}
const goCart = () => {
  router.push({
    path: '/cart',
    query: {
      type: 'normal'
    }
  })
}

if (!isLogin()) {
  cartService.getLocalBadge()
}

const closeMenu = () => {
  document.body.style.overflow = ''
  isShowLNB.value = false
  isShowSNB.value = false
}

/**
 * 마이오피스 이동 토글
 */
const onChangeToggle = () => {
  if (useMainStore().getUser.userType === ROLES_BE.no_referral_consumer) {
    // 추천인 없는 소비자
    alert(proxy.$t('ALT_RejectMyOffice'))
    model.value = 'mall'
  } else {
    goRboSite()
  }
}
</script>
