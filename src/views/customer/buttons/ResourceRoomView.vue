<template>
  <div
    class="notic-wrap max-width-1400-wrap pb144 cs-wrap faq-wrap"
  >
    <div class="cs-notic-top-area small">
      <i class="ico speaker" />
      <div class="icon-text-area">
        <div class="text-area">
          <span
            v-for="(notice, index) in noticeListData?.pinnedList"
            :key="notice.noticeId"
            class="text"
            :class="{ hidden: currentIndex !== index, slide: isSliding }"
            @click="router.push(`/update/notice/${notice.eventId}`)"
          >
            {{ notice.eventName }}
          </span>
        </div>
        <i
          class="ico arrow-right-n"
          @click="
            router.push(
              `/update/notice/${noticeListData?.pinnedList[currentIndex].eventId}`
            )
          "
        />
      </div>
    </div>

    <div class="cs-left-title-area pc-1023">
      <h3 class="bold primary09-color">{{ $t("CS_Resource") }}</h3>
    </div>
    <div class="notice-search large resource-notice-search">
      <div class="input-search type02">
        <RInput
          v-model="keyword"
          :placeholder="$t('CM_EnterKeyword')"
          class="login-input login-input--id"
          @keyup.enter="onSearch"
        />
        <RButton label="" @click="onSearch">
          <template #content>
            <i class="ico search-g"></i>
          </template>
        </RButton>
      </div>
    </div>
    <ul v-if="resourceData?.list.length > 0" class="left-title-right-icon-area">
      <li
        v-for="item in resourceData?.list"
        :key="item.libraryId"
        class=""
        @click="onPlannerOpenModal(item.libraryId)"
      >
        {{ item.title }}
        <i class="ico arrow-right-light-g" />
      </li>
    </ul>
    <!-- 결과 없을경우 -->
    <div v-else class="cart-none-area faq-none-area">
      <img src="@assets/images/cart_none.svg" alt="" />
      <p class="title">{{ $t("SRH_NonResult") }}</p>
      <ul class="result-none-text-area">
        <li>{{ $t("SCH_CheckWrongInput") }}</li>
        <li>{{ $t("SCH_SearchOther") }}</li>
      </ul>
    </div>
    <!-- //결과 없을경우 -->
  </div>
  <DownloadPreviewModal ref="plannerModal" :data="resourceDetailData" />
</template>

<script setup>
import customerService from '@/http/services/customer'
import searchService from '@/http/services/search'
import { useMainStore } from '@/store/mainStore'
import { checkPlanner } from '@/utils/common'
import { isLogin } from '@/utils/login'
import {
  computed,
  getCurrentInstance,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'
import { useRouter } from 'vue-router'
import DownloadPreviewModal from '../modal/DownloadPreviewModal.vue'

const currentIndex = ref(0)
const isSliding = ref(false)

const { proxy } = getCurrentInstance()
const mainStore = useMainStore()
const isPlanner = computed(() => checkPlanner())
const isLogined = computed(() => isLogin())
const router = useRouter()
const keyword = ref('')
const plannerModal = ref(null)
const noticeParam = reactive({
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  pageNumber: 1,
  pageSize: 100
})
const resourceParam = reactive({
  pageNumber: 1,
  pageSize: 100,
  searchTitle: ''
})
const currentLibraryId = ref(null)
const { data: noticeListData } = searchService.getNoticeSearch(noticeParam)
const { data: resourceData } = customerService.getResourceList(resourceParam)
const { data: resourceDetailData } =
  customerService.getResourceDetail(currentLibraryId)
onMounted(() => {
  setInterval(() => {
    isSliding.value = true
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % 3 // 3으로 순환
      isSliding.value = false
    }, 500)
  }, 3000)
})
const onSearch = () => {
  resourceParam.searchTitle = keyword.value
}
const onPlannerOpenModal = (libraryId) => {
  currentLibraryId.value = libraryId
  plannerModal.value.show()
}
</script>

<style lang="scss" scoped></style>
