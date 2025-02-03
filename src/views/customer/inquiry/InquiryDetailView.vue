<template>
  <div class="max-width-wrap  full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t('CS_MyInquiry') }}</h3>
    </div>

    <div class="plr16 pt24 flex align-center justify-between border-top-3-gray">
      <h6 class="bold gray07-color">{{ $t('CS_MyInquiry') }}</h6>
      <span class="font-10 font-montserrat gray03-color">{{ data?.questionDateTime }}</span>
    </div>

    <div class="plr16">

      <div v-if="data?.inquiryStatusType.code === 'COMPLETED'" class="mt24 font-14 medium success04-color">{{ $t('CS_AnswerFinish') }}</div>
      <div v-else class="mt24 font-14 medium error-color">{{ $t('CS_AnswerPending') }}</div>

      <div v-if="data?.orderNumber" class="order-num-get-area">
        <div class="top-area">
          <b class="font-14 primary09-color">{{ data?.orderNumber }}</b>
        </div>
        <div class="botom-area gray07-color">
          <span class="font-14 left-text">{{ data?.productName }}</span>
          <span v-if="data?.productCnt > 1" class="font-14 flex-shrink0">{{ $t('CS_IquiryPrdCount', {count: data?.productCnt}) }}</span>
        </div>
      </div>

      <div class="mtb24">
        <span class="status-icon font-12 gray07-color">{{ data?.inquiryType.text }}</span>
        <div class="font-12 bold gray04-color mt10">{{ data?.inquiryTitle }}</div>
        <div class="font-12 gray04-color mt10">{{ data?.questionContents }}</div>
        <div v-if="data?.questionImages && data?.questionImages.length > 0" class="inquiry-img-area">
          <img v-for="image in data?.questionImages" :key="image.inquiryAttachmentId" :src="addPrefixForImage(image.inquiryAttachmentUrl)" :alt="image.inquiryAttachmentName" @click="() => onClickImage(image)">
        </div>
      </div>

      <div v-if="data?.telNo" class="flex no-wrap gap4 mb24">
        <RInput
          ref="idRef"
          disable
          :placeholder="data?.telNo.substring(0,3)"
          class="login-input login-input--id input-num"
        />
        <RInput
          ref="idRef"
          disable
          :placeholder="data?.telNo.substring(3,7)"
          class="login-input login-input--id input-num"
        />
        <RInput
          ref="idRef"
          disable
          :placeholder="data?.telNo.substring(7,11)"
          class="login-input login-input--id input-num"
        />
      </div>
    </div>
    <template v-if="data?.inquiryStatusType.code === 'COMPLETED'">
      <div class="border-top-3-gray" />
      <div v-for="answer in data?.answerList" :key="answer.answerDateTime">
        <div class=" plr16 ptb24 flex align-center justify-between border-top-3-gray">
          <h6 class="bold gray07-color">{{ $t('CS_AnswerP2p') }}</h6>
          <span class="font-10 font-montserrat gray03-color">{{ answer.answerDateTime }}</span>
        </div>

        <div class="mlr16 inquiry-answer-area">
          {{ answer.answerContents }}
        </div>
        <div class="plr16 pb24 inquiry-img-area border-bottom-3-gray">
          <template v-if="answer?.answerImages.length > 0">
            <img v-for="image in answer?.answerImages" :key="image.inquiryAttachmentId" :src="addPrefixForImage(image.inquiryAttachmentUrl)" alt="answer image" @click="() => onClickImage(image)">
          </template>
          <template v-if="answer?.answerAttachments.length > 0">
            <img v-for="atta in answer?.answerAttachments" :key="atta.inquiryAttachmentId" src="@assets/images/icons/ico_file_pdf.svg" alt="answer pdf" @click="() => onClickImage(atta)">
          </template>
        </div>
      </div>
    </template>

  </div>

</template>

<script setup>
import customerService from '@/http/services/customer'
import { addPrefixForImage } from '@/utils/common'
import http from '@/utils/http'
import { getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'

const { proxy } = getCurrentInstance()
const route = useRoute()

const onOpenModal = () => {
  proxy.$refs.orderNumLoadModal.show()
}
const onClickImage = (image) => {
  http().downloadFileS3(addPrefixForImage(image.inquiryAttachmentUrl), image.inquiryAttachmentName)
}
const { data } = customerService.getInquiryDetail(route.params.inquiryId)

</script>

<style lang="scss" scoped>

</style>
