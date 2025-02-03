<template>
  <div class="notic-wrap max-width-1400-wrap pb144 cs-wrap">
    <div v-if="noticeListData && noticeListData?.pinnedList.length > 0" class="cs-notic-top-area">
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

    <div class="cs-title-area">
      <h3 class="bold primary09-color">{{ $t('CS_Center') }}</h3>
      <p class="font-18 gray07-color mt12">{{ $t('CS_CenterDesc') }}</p>
    </div>

    <div class="notice-search large">
      <div class="input-search type02">
        <RInput v-model="keyword" :placeholder="$t('CM_EnterKeyword')" class="login-input login-input--id " @keyup.enter="onClickSearch"/>
        <RButton label="" @click="onClickSearch">
          <template #content>
            <i class="ico search-g"></i>
          </template>
        </RButton>
      </div>
    </div>

    <ul class="tab type05">
      <li v-for="tab in tabListData" :key="tab.code" @click="() => onClickTab(tab.code)">{{ tab.text }}</li>
    </ul>

    <div class="cs-list-title-area">
      <h4 class="bold primary09-color">FAQ TOP 10</h4>
      <router-link to="" class="main-more-btn position-none" @click="onClickMore">{{ $t('CM_LoadMore') }}</router-link>
    </div>
    <q-list v-if="faqListData && faqListData.list.length > 0" bordered class="dropdown type03">
      <q-expansion-item v-for="faq in faqListData.list" :key="faq.faqId">
        <template #header>
          <q-item-section class="left-area">
            <div class="category-text">{{ faq.faqCategory.text }}</div>
            <div class="cs-notice-text">{{ faq.title }}</div>
          </q-item-section>
        </template>
        <q-card>
          <div v-clean-html="faq.contents"></div>
        </q-card>
      </q-expansion-item>
    </q-list>

    <ul class="mo-cs-guide-area">
      <li v-for="item in buttonList" :key="item.label" @click="onClickButtonMenu(item)">{{ item.label }}</li>
    </ul>

    <div class="cs-bottom-arae">
      <h4 class="bold primary09-color">{{ $t('MY_Inquery') }}</h4>
      <div class="cs-inquiry-area">
        <div class="left-area">
          <div class="btn-area flex-btn-area">
            <RButton
              :label="proxy.$t('CS_Inquiry')"
              class="btn full type03 xlarge"
              @click="onClickInquiry"
            />
            <RButton
              v-if="isLogined"
              :label="proxy.$t('CS_MyInquiry')"
              class="btn full type02 xlarge"
              @click="router.push('/customer/inquiry/list')"
            />
          </div>

          <div class="cs-info-area">
            <div class="ph-info-area">
              <b class="ph-text gray07-color">{{ $t('CS_PhoneInquiry') }}</b>
              <a :href="'tel:' + $t('CS_Number')" ><b class="ph-num-text primary04-color">{{ $t('CS_Number') }}</b></a>
              <router-link to="/customer/faq" class="btn type22">
                {{ $t('CS_PhoneTip') }}
              </router-link>
            </div>
            <div class="cs-info-text-area">
              <span v-clean-html="$t('CS_Time')" class="gray07-color"></span>
              <span class="gray04-color">{{ $t('CS_Day') }}</span>
            </div>
          </div>
        </div>

        <div class="right-area">
          <ul class="cs-guide-area">
            <li v-for="item in buttonList" :key="item.label" @click="onClickButtonMenu(item)">{{ item.label }}</li>
          </ul>

          <div class="cs-etc-text-area between-line-area large justify-center mt16">
            <!-- <b class="line gray07-color" @click="router.push('/customer/partnership')">{{ $t('CS_Partner') }}</b> -->
            <b class="line gray07-color" @click="router.push('/esg/customer')">{{ $t('CS_CCM') }}</b>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import customerService from '@/http/services/customer'
import searchService from '@/http/services/search'
import { useMainStore } from '@/store/mainStore'
import { checkPlanner } from '@/utils/common'
import { isLogin } from '@/utils/login'
import { onMounted, ref, computed, getCurrentInstance, reactive } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { useRouter } from 'vue-router'

const keyword = ref('')
const isSliding = ref(false)
const { proxy } = getCurrentInstance()
const router = useRouter()
const mainStore = useMainStore()
const isPlanner = computed(() => checkPlanner())
const isLogined = computed(() => isLogin())
const vCleanHtml = buildVueDompurifyHTMLDirective()
const buttonList = computed(() => [
  {
    label: proxy.$t('CS_EasyGuide'),
    path: '/customer/guide',
    allowed: true,
    target: 'ALL'
  },
  {
    label: proxy.$t('CS_Resource'),
    path: '/customer/resource',
    allowed: true,
    target: 'ALL'
  },
  {
    label: proxy.$t('CS_Certificate'),
    path: '/customer/certificate',
    allowed: isPlanner.value,
    target: 'PLANNER'
  },
  {
    label: proxy.$t('CS_FindCenter'),
    path: '/customer/center',
    allowed: true,
    target: 'ALL'
  }]
)
const faqListParam = reactive({
  pageSize: 5,
  pageNumber: 1,
  faqCategory: 'TOP_TEN',
  userType: mainStore.userInfo.userType ?? 'ALL',
  centerName: mainStore.userInfo.centerName ?? null
})
const noticeParam = reactive({
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  pageNumber: 1,
  pageSize: 100
})
const { data: noticeListData } = searchService.getNoticeSearch(noticeParam)
const currentIndex = ref(0)
const { data: tabListData } = customerService.getFaqs()
const { data: faqListData } = customerService.getFaqList(faqListParam)

const onClickTab = (code) => {
  router.push({
    path: '/customer/faq',
    query: {
      faqCategory: code
    }
  })
}
const onClickButtonMenu = (item) => {
  if (item.blocked) {
    proxy.$alert('준비중입니다.')
    return
  }
  if (item.allowed) {
    router.push(item.path)
  } else {
    if (item.target === 'USER') {
      checkLogin(proxy.$t('CM_RecommLogin'), proxy.$t('CM_UseAferLogin'), item.path)
    }
    if (item.target === 'PLANNER') {
      if (isLogined.value) {
        proxy.$alert(proxy.$t('CM_PlannerOnly'))
      } else {
        checkLogin(proxy.$t('CM_RecommLogin'), proxy.$t('CM_UseAferLogin'), item.path)
      }
    }
  }
}
const onClickInquiry = () => {
  if (isLogined.value) {
    router.push('/customer/inquiry')
  } else {
    checkLogin(proxy.$t('CM_RecommLogin'), proxy.$t('CM_UseAferLogin'), '/customer/inquiry')
  }
}

const onClickSearch = () => {
  router.push({
    path: '/customer/faq',
    query: {
      keyword: keyword.value
    }
  })
}
const onClickMore = () => {
  router.push({
    path: '/customer/faq',
    query: {
      faqCategory: 'TOP_TEN'
    }
  })
}
function checkLogin(mainTitle, title, redirect) {
  proxy.$confirm(mainTitle, {
    title,
    okLabel: proxy.$t('CM_AgreeLogin'),
    cancelLabel: proxy.$t('CM_No'),
    ok: () => {
      router.push({
        path: '/login',
        query: {
          redirect: redirect
        }
      })
    }
  })
}
onMounted(() => {
  setInterval(() => {
    isSliding.value = true
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % 3 // 3으로 순환
      isSliding.value = false
    }, 500)
  }, 3000)
})

</script>

<style lang="scss" scoped>

</style>
