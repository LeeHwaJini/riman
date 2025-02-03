<template>
  <div class="notic-wrap max-width-1400-wrap pb144 cs-wrap faq-wrap">
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

    <div class="cs-left-title-area">
      <h3 class="bold primary09-color">{{ $t('CS_FAQs') }}</h3>
      <p class="font-18 gray07-color mt12">{{ $t('CS_CheckBeforeAsk_txt3') }} <a href="javascript::void" class="primary04-color text-underline type02" @click.prevent="onClickInquiry">{{ $t('CS_DoInquiryP2P') }}</a>{{ $t('CS_CheckBeforeAsk_txt4') }}</p>
    </div>

    <div class="notice-search large">
      <div class="input-search type02">
        <RInput v-model="keyword" :placeholder="$t('CM_EnterKeyword')" class="login-input login-input--id " @keyup.enter="faqListParam.keyword = keyword"/>
        <RButton label="" @click="faqListParam.keyword = keyword">
          <template #content>
            <i class="ico search-g"></i>
          </template>
        </RButton>
      </div>
    </div>

    <ul class="tab type05">
      <li v-for="tab in tabListData" :key="tab" :class="{active: faqListParam.faqCategory === tab.code}" @click="() => onClickTab(tab.code)">{{ tab.text }}</li>
    </ul>
    <template v-if="faqListData && faqListData.list.length > 0">
      <q-list bordered class="dropdown type03 mt-pc48-mo24">
        <q-expansion-item v-for="faq in faqListData.list" :key="faq.faqId">
          <template #header>
            <q-item-section class="left-area">
              <div class="category-text">{{ faq.faqCategory.text }}</div>
              <div class="cs-notice-text">{{ faq.title }}</div>
            </q-item-section>
          </template>
          <q-card >
            <div v-clean-html="faq.contents"></div>
            <ul class="file-info-area mt24 pd0">
              <li v-for="file in faq.attachments" :key="file.faqAttachmentId" @click="() => onDownload(file)">
                <i :class="`ico ${file.attachmentExtension}`"></i>
                <span class="font-14 gray06-color block">{{ file.attachmentFileName }}.{{ file.attachmentExtension }}</span>
              </li>
            </ul>
          </q-card>
        </q-expansion-item>
      </q-list>
      <Pagination
        v-model:page-info="pageInfo"
        class-name="pagenation type03"
        :is-more-btn="false"
      />
    </template>
    <!-- 결과 없을경우 -->
    <div v-else class="cart-none-area faq-none-area">
      <img src="@assets/images/cart_none.svg" alt="">
      <p class="title">{{ $t('SRH_NonResult') }}</p>
      <ul class="result-none-text-area">
        <li>{{ $t('SCH_CheckWrongInput') }}</li>
        <li>{{ $t('SCH_SearchOther') }}</li>
      </ul>
    </div>
    <!-- //결과 없을경우 -->

  </div>
</template>

<script setup>
import customerService from '@/http/services/customer'
import searchService from '@/http/services/search'
import updateService from '@/http/services/update'
import { useMainStore } from '@/store/mainStore'
import { addPrefixForImage } from '@/utils/common'
import http from '@/utils/http'
import { isLogin } from '@/utils/login'
import { onMounted, ref, reactive, computed, getCurrentInstance, watch } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import { useRoute, useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const isSliding = ref(false)
const isLogined = computed(() => isLogin())
const currentIndex = ref(0)
const route = useRoute()
const router = useRouter()
const keyword = ref(route.query.keyword ?? '')
const mainStore = useMainStore()
const vCleanHtml = buildVueDompurifyHTMLDirective()
const pageInfo = reactive({
  pageSize: 10,
  pageNumber: 1,
  totalPageNumber: null,
  totalSize: null,
  maxPagination: 5
})
const faqListParam = reactive({
  pageSize: pageInfo.pageSize,
  pageNumber: computed(() => pageInfo.pageNumber),
  faqCategory: route.query.faqCategory ?? 'ALL',
  userType: mainStore.userInfo.userType ?? 'ALL',
  keyword: route.query.keyword ?? '',
  centerName: mainStore.userInfo.centerName ?? null
})
const noticeParam = reactive({
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  pageNumber: 1,
  pageSize: 100
})
const { data: noticeListData } = searchService.getNoticeSearch(noticeParam)
const { data: tabListData } = customerService.getFaqs()
const { data: faqListData } = customerService.getFaqList(faqListParam)

const onClickTab = (code) => {
  pageInfo.pageNumber = 1
  faqListParam.faqCategory = code
}

const onDownload = (file) => {
  http().downloadFileS3(addPrefixForImage(file.attachmentUrl), file.attachmentFileName + '.' + file.attachmentExtension)
}
const onClickInquiry = () => {
  if (isLogined.value) {
    router.push('/customer/inquiry')
  } else {
    proxy.$confirm(proxy.$t('CM_RecommLogin'), {
      title: proxy.$t('CM_UseAferLogin'),
      okLabel: proxy.$t('CM_AgreeLogin'),
      cancelLabel: proxy.$t('CM_No'),
      ok: () => {
        router.push({
          path: '/login',
          query: {
            redirect: '/customer/inquiry'
          }
        })
      }
    })
  }
}

onMounted(() => {
  setInterval(() => {
    isSliding.value = true
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % 3 // 3으로 순환
      isSliding.value = false
    }, 500)
  }, 3000)
  if (faqListData.value) {
    pageInfo.totalPageNumber = faqListData.value.totalPageNumber
    pageInfo.totalSize = faqListData.value.totalSize
  }
})
watch(faqListData, v => {
  if (v) {
    pageInfo.totalPageNumber = v.totalPageNumber
    pageInfo.totalSize = v.totalSize
  }
})
</script>

