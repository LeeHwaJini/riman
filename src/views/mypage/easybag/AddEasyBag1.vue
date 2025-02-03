<template>
  <div class="max-width-wrap full-width-wrap pb144">

    <div class="main-title-area  flex justify-between align-end">
      <h3 class="">{{ $t('EB_AddTitle') }}</h3>
      <RStep :step="step" :total-step="totalStep" />
    </div>

    <div class="relative easy-bag-bg-area">
      <img :src="imageBagUserRequest.bannerUrl" alt="" class="img-cover">
      <img :src="imageBagUserRequest.profileUrl" alt="" class="easy-bag-profile-img-area">
      <button class="img-edit-btn" @click="onBgSettingOpenModal"><i class="ico edit-bg-w" /></button>
    </div>

    <div class="easy-bag-step1-area">
      <span class="block font-14 gray07-color">{{ $t('EB_Name') }}</span>
      <RTextarea
        v-model="bagInfo.bagTitle"
        maxlength="40"
        :counter="true"
        :rules="[val => !!val || proxy.$t('EB_TitleRequired')]"
        :placeholder="proxy.$t('EB_TitleRequired')"
        class="input-textarea mt4 h90"/>

      <span class="block font-14 gray07-color mt36">{{ $t('CM_DetailInfo') }}</span>
      <RTextarea
        v-model="bagInfo.bagSubTitle"
        maxlength="10000"
        :rules="[val => !!val || proxy.$t('EB_SubTitleRequired')]"
        :placeholder="proxy.$t('EB_SubTitleRequired')"
        class="input-textarea mt4 h175"/>
      <div class="easy-bag-link-area">
        <span class="flex align-center gap4 font-16 medium">
          {{ $t('EB_SetDate') }}
          <i
            class="ico question pointer"
            @mouseover="$notify(
              proxy.$t('EB_DateExplain1') + '<br>' + proxy.$t('EB_DateExplain2'),
              proxy.$t('EB_SetDate'),
              'tooltip-w344')"/>
        </span>

        <RSwitch v-model="bagInfo.isBagDate" class="switch type01 small" />
      </div>

      <template v-if="bagInfo.isBagDate">
        <div class="input-date-area mb4">
          <RDatepicker
            v-model="bagInfo.bagStartDate"
            :show-period="false"
            :is-set-default="false"
            :is-after-now-date="true"
          />
          <RDatepicker
            v-model="bagInfo.bagEndDate"
            :show-period="false"
            :is-set-default="false"
            :is-after-now-date="true"
          />
        </div>
        <span class="font-14 gray03-color">{{ $t('EB_DateExplain3') }}</span>
      </template>

    </div>

    <div class="bottom-btn">
      <RButton class="btn full small type02" :label="proxy.$t('CM_Next')" :disable="!(bagInfo?.bagTitle && bagInfo?.bagSubTitle)" @click="toNextStep" />
    </div>
  </div>

  <responsive-modal
    ref="bgSettingModal"
    :title="proxy.$t('EB_SetCoverImage')"
    class="bg-setting-modal bottom-btn-modal"
  >
    <template #description>

      <div class="flex justify-center gap8 mb24">
        <RButtonUpload v-model="imageBagUserRequest.bannerUrl" accept=".jpg,.jpeg,.png" :label="proxy.$t('CM_FileUpload')" :max-file-size="10000000" @update:model-value="onCoverUpdate">
          <template #content>
            <i class="ico upload" />
            <span class="font-14 medium">{{ $t('CM_FileUpload') }}</span>
          </template>
        </RButtonUpload>
        <p class="font-12 gray03-color">{{ $t('CM_Recommended') }} {{ $t('CM_Size') }} (1200x628px)<br>
          {{ $t('CM_ImageValidation', {size: '10MB', extension: 'jpg, jpeg, png'}) }}
        </p>
      </div>

      <ul class="bg-setting-list popup-scroll large scroll type01" @scroll="onScroll">
        <li v-for="item in bagImageList" :key="item.id">
          <img :src="addPrefixForImage(item.imageUrl)" alt="" class="img-cover" @click="onCoverUpdate(item)">
        </li>
      </ul>

    </template>
  </responsive-modal>
</template>

<script setup>

import { ref, getCurrentInstance, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import easyBagService from '@/http/services/easybag'
import personalMallService from '@/http/services/personalMall'
import { useMainStore } from '@/store/mainStore'
import { addPrefixForImage } from '@/utils/common'
import { addDate, formatDate, isValidDates, nowDate } from '@/utils/dateFormat'
import { sessionDataManager } from '@/utils/dataManager'
import memberService from '@/http/services/member'

import defaultProfile from '@/assets/images/personal_banner_profile.svg'

const { proxy } = getCurrentInstance()
const router = useRouter()

const totalStep = ref(3)
const step = ref(1)

const mainStore = useMainStore()
const bgSettingModal = ref(false)
const userSeqNo = mainStore.userInfo.userSeqNo

const bagImageList = ref([])
const sessionBagInfo = JSON.parse(sessionDataManager.get('bagInfo'))

const bagInfo = reactive({
  bagTitle: sessionBagInfo?.bagTitle,
  bagSubTitle: sessionBagInfo?.bagSubTitle,
  isBagDate: sessionBagInfo?.isBagDate ?? false,
  bagStartDate: sessionBagInfo?.bagStartDate ?? nowDate(),
  bagEndDate: sessionBagInfo?.bagEndDate ?? addDate(nowDate(), 'YYYY-MM-DD HH:mm:ss', { day: 30 })
})

const imageBagUserRequest = reactive({
  profileUrl: null,
  bannerUrl: null
})

const totalPageNumber = ref(0)

const imageParams = {
  pageSize: 20,
  pageNumber: 0,
  imageType: 'BANNER',
  isDisplay: true
}

onMounted(async () => {
  if (history.state.bagCount === undefined) {
    const result = await easyBagService.getMyBagList(userSeqNo)

    if (result.data?.length === 10) {
      await proxy.$alert(
        proxy.$t('EB_Limit'), {
          ok: () => {
            router.push('/mypage/easybag')
          }
        }
      )
    }
  }

  getDefaultBagImage()
  getProfileImage()
})

const getDefaultBagImage = async () => {
  imageParams.pageNumber += 1

  const result = await easyBagService.getBagImageList(imageParams)

  bagImageList.value = [...bagImageList.value, ...result.data.list.filter(i => isValidDates(i.displayStartDate, nowDate()))]

  imageBagUserRequest.bannerUrl = addPrefixForImage(bagImageList.value[0]?.imageUrl)
  imageBagUserRequest.bannerFileName = bagImageList.value[0]?.imageUrl

  totalPageNumber.value = result.data.totalPageNumber
}

const getProfileImage = async () => {
  const result = await personalMallService.getMyPersonalMall(userSeqNo)

  imageBagUserRequest.profileUrl = result.data.userPersonalMallInfoResponse?.profileOriginFileName ? result.data.userPersonalMallInfoResponse.profileUrl : defaultProfile
  imageBagUserRequest.profileFileName = result.data.userPersonalMallInfoResponse?.profileOriginFileName ?? 'defaultProfile'
}

const onBgSettingOpenModal = () => {
  proxy.$refs.bgSettingModal.show()
}

const onCoverUpdate = async (e) => {
  const type = e.constructor.prototype[Symbol.toStringTag]

  if (type === 'File') {
    const params = {
      type: 'PLANNER_BAG_IMAGE',
      'request[0].file': e
    }
    const result = await memberService.postUploadImage(params)

    imageBagUserRequest.bannerUrl = URL.createObjectURL(e)
    imageBagUserRequest.bannerFileName = result.data[0]
  } else {
    imageBagUserRequest.bannerUrl = addPrefixForImage(e.imageUrl)
    imageBagUserRequest.bannerFileName = e.imageUrl
  }

  bgSettingModal.value.hide()
}

const onScroll = () => {
  if (imageParams.pageNumber < totalPageNumber.value) {
    getDefaultBagImage()
  }
}

const toNextStep = () => {
  if (!bagInfo.isBagDate) {
    bagInfo.bagStartDate = undefined
    bagInfo.bagEndDate = undefined
  } else {
    bagInfo.bagStartDate = `${formatDate(bagInfo.bagStartDate, 'YYYY-MM-DD')} 00:00:00`
    bagInfo.bagEndDate = `${formatDate(bagInfo.bagEndDate, 'YYYY-MM-DD')} 23:59:59`
  }

  if (imageBagUserRequest.profileUrl.startsWith('data:image')) {
    imageBagUserRequest.profileUrl = `${import.meta.env.VITE_APP_S3_URL}.riman.com/static/member/mall/null`
  }

  sessionDataManager.set('bagInfo', JSON.stringify(bagInfo))
  sessionDataManager.set('imageBagUserRequest', JSON.stringify(imageBagUserRequest))

  router.push('/mypage/easybag/add/2')
}
</script>

<style lang="scss" scoped>

</style>
