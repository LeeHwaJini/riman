<!--
  공유하기 modal
  create by hwajin
-->
<template >
  <div v-if="props.pageState?.isEasyBag">
    <h4 class="bold primary09-color text-center">{{ $t('EB_Share') }}</h4>
    <p class="font-16 gray07-color text-area mt24 mb32" v-html="$t('EB_ShareKakao')"></p>
  </div>
  <ul class="sns-share-area">
    <li>
      <RButton class="btn" @click="copyClipboard(url)">
        <template #content>
          <div class="icon-area link"><i class="ico link" /></div>
          <span class="font-16 medium gray07-color">{{ $t('CM_DoCopyLink') }}</span>
        </template>
      </RButton>
    </li>

    <li>
      <RButton class="btn" @click="shareKaKao">
        <template #content>
          <div class="icon-area kakao"><i class="ico kakao" /></div>
          <span class="font-16 medium gray07-color">{{ $t('CM_KakaoShare') }}</span>
        </template>
      </RButton>
    </li>
  </ul>
</template>

<script setup>
import { copyClipboard } from '@/utils/common'
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()

const props = defineProps({
  pageState: {
    type: Object,
    default: null
  }
})

const url = props?.pageState?.url ?? window.location.href

proxy.$ogMetaInfo([
  { property: 'og:image', content: props.pageState?.image },
  { property: 'og:url', content: url }
])

const shareKaKao = () => {
  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: props.pageState?.title ?? url,
      imageUrl: props.pageState?.image ?? `${import.meta.env.VITE_APP_BASE_URL}/ogImage.png`,
      link: {
        mobileWebUrl: url,
        webUrl: url
      }
    },
    installTalk: true
  })
}

</script>
