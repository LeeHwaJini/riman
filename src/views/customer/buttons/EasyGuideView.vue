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

    <div class="cs-left-title-area pc-1023">
      <h3 class="bold primary09-color">{{ $t('CS_EasyGuide') }}</h3>
    </div>
    <div v-if="isTempVideoView" class="guide-video-area">
      <video controls>
        <source src="https://saturn.content.kr.riman.com/static/etc/guide/241231_manual_3.mp4" type="video/mp4">
      </video>
      <div v-if="isLogined && isPlanner" class="guide-video-button">
        <RButton
          :label="proxy.$t('CS_MyofficeGuide')"
          class="btn full type03 xlarge"
          @click="onClickedMyofficeGuide"
        />
      </div>
    </div>

    <ul v-else class="easy-guide-area">
      <li class="beige icon-bg-area user">
        <div class="top-area">
          <h5>{{ $t('NAV_SignUp') }}</h5>
          <i class="ico download"/>
        </div>
        <div class="bottom-area">
          <div class="text-area" @click="onPlannerOpenModal">
            {{ $t('CS_PlannerJoin') }}
            <i class="ico arrow-right-light-g"/>
          </div>
          <div class="text-area">
            {{ $t('CS_CustomerJoin') }}
            <i class="ico arrow-right-light-g"/>
          </div>
          <div class="text-area">
            {{ $t('CS_Login') }}
            <i class="ico arrow-right-light-g"/>
          </div>
        </div>
      </li>

      <li class="beige icon-bg-area gnb">
        <div class="top-area">
          <h5>{{ $t('CM_Menu') }}</h5>
          <i class="ico download"/>
        </div>
        <div class="bottom-area">
          <div class="text-area">
            {{ $t('CS_MainMenu') }}
            <i class="ico arrow-right-light-g"/>
          </div>
          <div class="text-area">
            {{ $t('CS_MyMenu') }}
            <i class="ico arrow-right-light-g"/>
          </div>
        </div>
      </li>

      <li class="blue icon-bg-area coin">
        <div class="top-area">
          <h5>{{ $t('CS_Product') }}</h5>
          <i class="ico download"/>
        </div>
        <div class="bottom-area">
          <div class="text-area">
            {{ $t('CS_ProductSearch') }}
            <i class="ico arrow-right-light-g"/>
          </div>
          <div class="text-area">
            {{ $t('CS_ProductDetail') }}
            <i class="ico arrow-right-light-g"/>
          </div>
        </div>
      </li>

      <li class="blue icon-bg-area cart">
        <div class="top-area">
          <h5>{{ $t('CM_Commerce') }}</h5>
          <i class="ico download"/>
        </div>
        <div class="bottom-area">
          <div class="text-area">
            {{ $t('CS_Order') }}
            <i class="ico arrow-right-light-g"/>
          </div>
          <div class="text-area">
            {{ $t('CS_OrderDetail') }}
            <i class="ico arrow-right-light-g"/>
          </div>
          <div class="text-area">
            {{ $t('CM_Cart') }}
            <i class="ico arrow-right-light-g"/>
          </div>
        </div>
      </li>
    </ul>

  </div>

  <FullPageModalWider
    ref="plannerModal">
    <template #title>
      <h4>{{ $t('CS_PlannerJoin') }}</h4>
    </template>
    <template #body>
      <div>
        <div class="download-icon-area">
          <i class="ico download" />
        </div>
        <div class="download-img-area scroll type01">
          <img src="@assets/images/temp/prd_list.png" alt="">
        </div>
      </div>
    </template>
  </FullPageModalWider>
</template>

<script setup>
import searchService from '@/http/services/search'
import { useMainStore } from '@/store/mainStore'
import { checkPlanner } from '@/utils/common'
import { isLogin } from '@/utils/login'
import { onMounted, ref, reactive, computed, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'

const isSliding = ref(false)
const mainStore = useMainStore()
const currentIndex = ref(0)
const { proxy } = getCurrentInstance()
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const router = useRouter()
const isTempVideoView = true
const noticeParam = reactive({
  rank: isLogined.value ? mainStore.getUser.rank : 'ALL',
  pageNumber: 1,
  pageSize: 100
})
const { data: noticeListData } = searchService.getNoticeSearch(noticeParam)

onMounted(() => {
  setInterval(() => {
    isSliding.value = true
    setTimeout(() => {
      currentIndex.value = (currentIndex.value + 1) % 3 // 3으로 순환
      isSliding.value = false
    }, 500)
  }, 3000)
})

const onPlannerOpenModal = () => {
  proxy.$refs.plannerModal.show()
}
const onClickedMyofficeGuide = () => {
  window.open('https://buly.kr/28sXtW8', '_blank')
}
</script>

<style lang="scss" scoped>
.guide-video-area {
  video {
    width: 100%;
    height: 100%;
  }
  .guide-video-button {
    margin-top: 50px;
    text-align: center;
    .xlarge {
      font-size: 24px;
    }
  }
}
@media screen and (max-width: 1023px) {
  .guide-video-area {
    .guide-video-button {
      margin-left: 10px;
      margin-right: 10px;
      .xlarge {
        font-size: 16px;
      }
  }
  }

}
</style>
