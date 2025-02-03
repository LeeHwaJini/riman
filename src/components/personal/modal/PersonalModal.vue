<template>
  <q-dialog ref="drawer" position="right" full-height class="prd-filter-popup-wrap personalmall-link-modal">
    <q-card class="scroll type01">
      <button class="menu-close-btn" @click="onClickClose">
        <i class="ico close-w" />
      </button>

      <div class="personalmall-bg" :style="{ 'background-image' : 'url(' + defaultCoverImage + ')'}"></div>
      <div class="relative">
        <h4 class="bold text-center white-color mb12">{{ $t('PM_Title') }}</h4>
        <p id="test" class="font-16 text-center white-color mb24 pre-line">{{ $t('PM_LinkExplain') }}</p>

        <div class="personal-user-area">
          <img :src="props.profileImage" alt="" class="personal-user-img-area">
          <div class="personal-text-content mt16 gray07-color">
            <div class="title-text">
              <b v-if="personalMallInfo?.userPersonalMallInfoResponse?.mallName" class="font-18">{{ personalMallInfo?.userPersonalMallInfoResponse?.mallName }}</b>
              <b v-if="!personalMallInfo?.userPersonalMallInfoResponse?.mallName" class="font-18">{{ `${personalMallInfo?.userInfo?.fullName}'s Mall` }}</b>
            </div>
            <p v-if="personalMallInfo?.userPersonalMallInfoResponse?.message1" class="main-text mt4 mb8 font-16">{{ personalMallInfo?.userPersonalMallInfoResponse?.message1 }}</p>
            <p v-if="!personalMallInfo?.userPersonalMallInfoResponse?.message1" class="main-text mt4 mb8 font-16">{{ $t('PM_DefaultWelcomeMessage', {name: personalMallInfo?.userInfo?.fullName}) }}</p>

            <span class="sub-text font-12">{{ personalMallInfo?.userPersonalMallInfoResponse?.message2 }}</span>
          </div>
        </div>

        <div class="form-area type04">
          <div class="field">
            <h6 class="mb8 gray07-color bold">{{ $t('CM_UserNumber') }}</h6>
            <div class="flex align-center justify-between pre-line">
              <span class="member-num-text primary09-color medium">
                {{ props.data?.userInfo?.globalRefererRegionCode?.code }}
                {{ props.data?.userInfo?.fullName }}
                {{ props.data?.userInfo?.globalRefererUserNumber }}
              </span>
              <RButton label="" class="pd0" @click="copyClipboard(personalMallInfo?.referralInfoResponse?.userNumber)">
                <template #content>
                  <i class="ico copy"></i>
                </template>
              </RButton>
            </div>
          </div>

          <div class="field">
            <h6 class="mb4 gray07-color bold">{{ $t('PM_JoinLink') }}</h6>
            <span class="font-14 gray03-color">{{ $t('PM_JoinLinkExplain', {name: props.data?.userInfo?.fullName }) }}</span>
            <div class="flex align-center justify-between no-wrap mt8">
              <span class="member-num-text primary09-color medium" @click="navigateToLink(personalMallInfo?.referralInfoResponse?.userLink)">
                {{ personalMallInfo?.referralInfoResponse?.userLink }}
              </span>
              <RButton label="" class="pd0" @click="copyClipboard( personalMallInfo?.referralInfoResponse?.userLink )">
                <template #content>
                  <i class="ico copy"></i>
                </template>
              </RButton>
            </div>

            <div class="qr-code-info-area">
              <img :src="registerQrCode" alt="" class="qr-img"/>
              <div class="flex align-center justify-between w-full">
                <div class="font-12 gray07-color pre-line">{{ $t('PM_JoinQr') }}</div>
                <i class="ico download" @click="fileDownload('register')"/>
              </div>
            </div>
          </div>

          <div class="field">
            <h6 class="mb4 gray07-color bold">{{ $t('PM_ShoppingLink') }}</h6>
            <span class="font-14 gray03-color">{{ $t('PM_ShoppingLinkExplain', {name: props.data?.userInfo?.fullName }) }}</span>
            <div class="flex align-center justify-between no-wrap mt8">
              <span class="member-num-text primary09-color medium" @click="navigateToLink(personalMallInfo?.referralShoppingInfoResponse?.userLink)">
                {{ personalMallInfo?.referralShoppingInfoResponse?.userLink }}
              </span>
              <RButton label="" class="pd0" @click="copyClipboard( personalMallInfo?.referralShoppingInfoResponse?.userLink )">
                <template #content>
                  <i class="ico copy"></i>
                </template>
              </RButton>
            </div>

            <div class="qr-code-info-area">
              <img :src="shoppingQrCode" alt="" class="qr-img">
              <div class="flex align-center justify-between w-full">
                <div class="font-12 gray07-color pre-line">{{ $t('PM_ShoppingQr') }}</div>
                <i class="ico download" @click="fileDownload('shopping')"/>
              </div>
            </div>
          </div>

        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { copyClipboard } from '@/utils/common'
import http from '@/utils/http'
import defaultBanner from '@/assets/images/personalmall_bg.png'

const props = defineProps({
  data: {
    type: Object,
    default: null
  },
  userNumber: {
    type: String,
    default: undefined
  },
  profileImage: {
    type: String,
    default: undefined
  },
  coverImage: {
    type: String,
    default: undefined
  }
})

const drawer = ref()

const personalMallInfo = props.data
const defaultCoverImage = defaultBanner

const getQrCode = (qrCodeFileName) => {
  const VITE_APP_API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

  return `${VITE_APP_API_BASE_URL}/member/v1/public/qrcode?qrcodeFileName=${qrCodeFileName}`
}

const registerQrCode = getQrCode(personalMallInfo.referralInfoResponse?.qrCodeFileName)
const shoppingQrCode = getQrCode(personalMallInfo.referralShoppingInfoResponse?.qrCodeFileName)

onMounted(() => {
  if (!props.data.userInfo) {
    onClickClose()
  }
})

const fileDownload = (target) => {
  const url = target === 'register' ? registerQrCode : shoppingQrCode

  return http().url(url).fileDownload('get', `${target}_qr_code_${props.userNumber}.png`)
}

const navigateToLink = (url) => {
  window.location.href = url
}

const onClickClose = () => {
  drawer.value.hide()
}
</script>

<style lang="scss" scoped>
.member-num-text {
  word-break: break-all;
}

.pre-line {
  white-space: pre-line;
}
</style>
