<template>
  <div class="max-width-wrap  personalmall-wrap pb144">
    <div class="personalmall-bg"></div>

    <div class="main-title-area">
      <h3 class="">{{ $t('PM_ManagePersonalMall') }}</h3>
    </div>

    <div class="personalmall-content">

      <div class="form-area type03">
        <div class="field">
          <hgroup class="flex align-center gap4">
            <h4 class="bold primary09-color">{{ $t('PM_ProfileImage') }}</h4>
            <i class="ico question pointer" @mouseover="$notify($t('PM_ProfileUsage'), '', 'tooltip-close-none', null)"/>

          </hgroup>

          <p class="explanation-text">{{ $t('PM_ProfileExplain') }}</p>

          <div class="profile-img-area text-center">
            <img :src="profileImage" alt="" >
            <div class="edit-delete-btn-area">
              <RButtonUpload v-model="profileImage" accept=".jpg,.jpeg,.png" :max-file-size="5000000" class="file-btn type01" @update:model-value="onProfileUpdate">
                <template #content>
                  <i class="ico edit-b"></i>
                </template>
              </RButtonUpload>
              <i class="ico delete-b" @click="triggerRemoveFile('profile')"/>
            </div>
            <div class="font-12 text-center gray03-color">{{ $t('CM_Recommended') }} {{ $t('CM_Size') }}(120x120px)<br/>
              {{ $t('CM_ImageValidation', {size: '5MB', extension: 'jpg, jpeg, png'}) }}
            </div>
          </div>
        </div>

        <div class="field">
          <h4 class="bold primary09-color">{{ $t('PM_CoverImage') }}</h4>
          <p class="explanation-text">{{ $t('PM_CoverExplain') }}</p>

          <div class="mo-cover-area text-center">
            <h6 class="mb12 bold gray07-color">{{ $t('CM_Mobile') }} {{ $t('PM_CoverImage') }}</h6>
            <img :src="mobileCoverImage" />
            <div class="edit-delete-btn-area">
              <RButtonUpload v-model="mobileCoverImage" accept=".jpg,.jpeg,.png" :max-file-size="5000000" class="file-btn type01" @update:model-value="onMobileCoverUpdate">
                <template #content>
                  <i class="ico edit-b"></i>
                </template>
              </RButtonUpload>
              <i class="ico delete-b" @click="triggerRemoveFile('mobileCover')"/>
            </div>
            <div class="font-12 text-center gray03-color">{{ $t('CM_Recommended') }} {{ $t('CM_Size') }}(360x400px)<br/>
              {{ $t('CM_ImageValidation', {size: '5MB', extension: 'jpg, jpeg, png'}) }}
            </div>

            <div class="pc-cover-area text-center mt32">
              <hgroup class="flex align-center justify-center gap4 mb12">
                <h6 class="bold gray07-color">{{ $t('CM_Pc') }}, {{ $t('CM_Tablet') }} {{ $t('PM_CoverImage') }}</h6>
                <i class="ico question pointer" @mouseover="$notify($t('PM_CoverSizeExplain'), '', 'tooltip-close-none', null)"/>
              </hgroup>

              <div class="pc-mark-area-text font-12 primary04-color">{{ $t('PM_PcVisibilityArea') }}</div>

              <div class="relative">
                <img :src="pcCoverImage" alt="" >
                <div class="tb-border-area" />
                <div class="tb-mark-area-text font-12 error03-color">{{ $t('PM_TabletVisibilityArea') }}</div>
              </div>

              <div class="edit-delete-btn-area">
                <RButtonUpload v-model="pcCoverImage" accept=".jpg,.jpeg,.png" :max-file-size="5000000" class="file-btn type01" @update:model-value="onPcCoverUpdate">
                  <template #content>
                    <i class="ico edit-b"></i>
                  </template>
                </RButtonUpload>
                <i class="ico delete-b" @click="triggerRemoveFile('pcCover')"/>
              </div>
              <div class="font-12 text-center gray03-color">{{ $t('CM_Recommended') }} {{ $t('CM_Size') }}(1920x400px)<br/>
                {{ $t('CM_ImageValidation', {size: '5MB', extension: 'jpg, jpeg, png'}) }}
              </div>
            </div>
          </div>
        </div>

        <div class="field">
          <h4 class="bold primary09-color">{{ $t('PM_PersonalMallAdditionalInfo') }}</h4>
          <p class="explanation-text mb4">{{ $t('PM_PersonalMallAdditionalInfoExplain1') }}</p>
          <span class="font-12 gray03-color">{{ $t('PM_PersonalMallAdditionalInfoExplain2') }}</span>

          <div class="form-area type01 mt24">
            <div class="field">
              <span class="input-title">{{ $t('PM_Name') }}</span>
              <RTextarea v-model="personalMallInfo.mallName" :placeholder="$t('PM_NamePlaceholder')" class="input-textarea mt4 h40 input-textarea small" maxlength="14" :counter="true" />
            </div>
            <div class="field">
              <span class="input-title">{{ $t('PM_WelcomeMessage') }}</span>
              <RTextarea v-model="personalMallInfo.message1" :placeholder="$t('PM_WelcomeMessagePlaceholder')" class="input-textarea mt4 h70" maxlength="30" :counter="true" />
            </div>
            <div class="field">
              <span class="input-title">{{ $t('PM_AdditionalInfo') }}</span>
              <RTextarea v-model="personalMallInfo.message2" :placeholder="$t('PM_AdditionalInfoPlaceholder')" class="input-textarea mt4 h90" maxlength="50" :counter="true" />
            </div>
          </div>
        </div>

      </div>
    </div>

    <div class="bottom-btn">
      <div class="flex-btn-area">
        <RButton class="btn full small type03" :label="$t('CM_Cancel')" @click="onReset" />
        <RButton class="btn full small type02" :label="$t('CM_Save')" @click="onSave" />
      </div>
    </div>
  </div>
</template>

<script setup>
import personalMallService from '@/http/services/personalMall'
import memberService from '@/http/services/member'

import { useMainStore } from '@/store/mainStore'
import { getCurrentInstance, onMounted, ref } from 'vue'

import defaultProfile from '@/assets/images/personal_banner_profile.svg'
import defaultBanner from '@/assets/images/personalmall_bg.png'

const { proxy } = getCurrentInstance()

const mainStore = useMainStore()
const userSeqNo = mainStore.userInfo.userSeqNo

const defaultProfileImage = defaultProfile
const defaultCoverImage = defaultBanner

const profileImage = ref(defaultProfileImage)
const mobileCoverImage = ref(defaultCoverImage)
const pcCoverImage = ref(defaultCoverImage)

const personalMallInfo = ref({})
const originPersonalMallInfo = {}

const imageParams = { type: 'PERSONAL_MALL' }
const params = {}

onMounted(() => {
  onSearchPersonalMall()
})

const onProfileUpdate = (file) => {
  profileImage.value = URL.createObjectURL(file)
  params.profileImageName = file.name
  params.profileImageUrl = file.name
  imageParams.profileImage = file
}
const onMobileCoverUpdate = (file) => {
  mobileCoverImage.value = URL.createObjectURL(file)
  params.backgroundMobileImageName = file.name
  params.backgroundMobileUrl = file.name
  imageParams.mobileCoverImage = file
}
const onPcCoverUpdate = (file) => {
  pcCoverImage.value = URL.createObjectURL(file)
  params.backgroundPcImageName = file.name
  params.backgroundPcUrl = file.name
  imageParams.pcCoverImage = file
}

const triggerRemoveFile = (type) => {
  if (type === 'profile') {
    profileImage.value = defaultProfileImage
    imageParams.profileImage = undefined
    params.profileImageName = undefined
  } else if (type === 'mobileCover') {
    mobileCoverImage.value = defaultCoverImage
    imageParams.mobileCoverImage = undefined
    params.backgroundMobileImageName = undefined
  } else if (type === 'pcCover') {
    pcCoverImage.value = defaultCoverImage
    imageParams.pcCoverImage = undefined
    params.backgroundPcImageName = undefined
  }
}

const onSearchPersonalMall = async () => {
  const result = await personalMallService.getMyPersonalMall(userSeqNo)

  if (result) {
    personalMallInfo.value = result.data?.userPersonalMallInfoResponse ?? {}
    originPersonalMallInfo.value = { ...result.data.userPersonalMallInfoResponse }

    const {
      profileOriginFileName,
      profileUrl,
      backgroundMobileOriginFileName,
      backgroundMobileUrl,
      backgroundPcOriginFileName,
      backgroundPcUrl
    } = personalMallInfo.value

    params.profileImageName = profileOriginFileName
    params.profileImageUrl = profileUrl
    params.backgroundMobileImageName = backgroundMobileOriginFileName
    params.backgroundMobileImageUrl = backgroundMobileUrl
    params.backgroundPcImageName = backgroundPcOriginFileName
    params.backgroundPcImageUrl = backgroundPcUrl

    profileImage.value = profileOriginFileName ? profileUrl : defaultProfileImage
    mobileCoverImage.value = backgroundMobileOriginFileName ? backgroundMobileUrl : defaultCoverImage
    pcCoverImage.value = backgroundPcOriginFileName ? backgroundPcUrl : defaultCoverImage
  }
}

const onSave = () => {
  let imageCount = 0

  if (typeof imageParams.profileImage === 'object') {
    imageParams[`request[${imageCount}].file`] = imageParams.profileImage
    imageCount++
  }
  if (typeof imageParams.mobileCoverImage === 'object') {
    imageParams[`request[${imageCount}].file`] = imageParams.mobileCoverImage
    imageCount++
  }
  if (typeof imageParams.pcCoverImage === 'object') {
    imageParams[`request[${imageCount}].file`] = imageParams.pcCoverImage
    imageCount++
  }

  params.mallName = personalMallInfo.value.mallName
  params.message1 = personalMallInfo.value.message1
  params.message2 = personalMallInfo.value.message2

  proxy.$confirm(proxy.$t('PM_InfoExplain'), {
    title: proxy.$t('ALT_RegistConfirm'),
    okLabel: proxy.$t('CM_OkRegist'),
    cancelLabel: proxy.$t('CM_No'),
    ok: async () => {
      const imageUploadResult = imageCount !== 0 && await memberService.postUploadImage(imageParams)
      const saveResult = await personalMallService.postPersonalMall(params, userSeqNo)

      if ((imageCount !== 0 && imageUploadResult && saveResult) || saveResult) {
        await proxy.$alert(proxy.$t('ALT_RegistSuccess'))
        window.dispatchEvent(new Event('personalMallUpdated'))
        onSearchPersonalMall()
      }
    }
  })
}

const onReset = () => {
  proxy.$confirm(proxy.$t('ALT_RegistCancel'), {
    okLabel: proxy.$t('CM_OkCancel'),
    cancelLabel: proxy.$t('CM_No'),
    title: '',
    ok: () => {
      const {
        profileOriginFileName,
        profileUrl,
        backgroundMobileOriginFileName,
        backgroundMobileUrl,
        backgroundPcOriginFileName,
        backgroundPcUrl,
        mallName,
        message1,
        message2
      } = originPersonalMallInfo.value

      profileImage.value = profileOriginFileName ? profileUrl : defaultProfileImage
      mobileCoverImage.value = backgroundMobileOriginFileName ? backgroundMobileUrl : defaultCoverImage
      pcCoverImage.value = backgroundPcOriginFileName ? backgroundPcUrl : defaultCoverImage
      personalMallInfo.value.mallName = mallName
      personalMallInfo.value.message1 = message1
      personalMallInfo.value.message2 = message2
    }
  })
}

</script>

<style lang="scss" scoped>

</style>

