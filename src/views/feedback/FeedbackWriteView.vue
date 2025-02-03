<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">고객의 소리 등록하기</h3>
      <p class="font-16 mt12 sub-text">{{ $t('CS_CheckBeforeAsk_txt1') }}<a href="/customer/faq" class="primary04-color text-underline type02 medium">FAQs</a>{{ $t('CS_CheckBeforeAsk_txt2') }}</p>
    </div>

    <div class="mo-sub-text">
      <i class="ico exclamation-n" />
      <div class="font-16 primary09-color">{{ $t('CS_CheckBeforeAsk_txt1') }} <a href="/customer/faq" class="primary04-color text-underline type02">FAQs</a>{{ $t('CS_CheckBeforeAsk_txt2') }}
      </div>
    </div>

    <div class="form-area type05 plr16">
      <div class="field">
        <span class="input-title required">{{ $t('CM_FirstName') }}</span>
        <RInput
          ref="idRef"
          v-model="title"
          :placeholder="$t('ALT_InputName')"
          class="login-input login-input--id"
        />
      </div>

      <div class="field">
        <span class="input-title required">{{ $t('CM_MobileNumber') }}</span>
        <RInput
          ref="idRef"
          v-model="title"
          :placeholder="$t('USR_ValidNumber')"
          class="login-input login-input--id"
        />
      </div>

      <div class="field">
        <RPasswordConfirm v-model:password="password" v-model:passwordConfirm="password" />
      </div>

      <div class="field flex-between-checkbox-area">
        <RCheckbox v-model="checkbox" checked-icon="check_circle" unchecked-icon="check_circle" class="checkbox-area type01">
          <div class="flex align-center">
            <b class="mr8">필수</b>
            <div class="font-14 medium gray07-color">개인정보 수집 및 이용 동의</div>
          </div>
        </RCheckbox>
        <span class="checkbox-title gray04-color text-underline type02 font-12 pointer">자세히 보기</span>
      </div>

      <div class="field mt48">
        <span class="block font-14 gray07-color">문의유형을 선택해주세요.</span>
        <ul class="tab type05 small">
          <li v-for="type in feedbackTypeData" :key="type.code" :class="{active: inquiryType === type.code}" @click="inquiryType = type.code">{{ type.text }}</li>
        </ul>
      </div>

      <div class="field">
        <span class="input-title required">{{ $t('CM_Title') }}</span>
        <RInput
          ref="idRef"
          v-model="title"
          :placeholder="$t('CS_InputTitle')"
          class="login-input login-input--id"
        />
      </div>

      <div class="field">
        <span class="input-title required">{{ $t('CS_InputContent') }}</span>
        <RTextarea v-model="contents" maxlength="1000" :counter="true" :placeholder="$t('CS_InputContent_txt')" class="input-textarea mb16" />
        <RUploadImage ref="uploader" label="Image Upload files" multiple @file-updated="onFileUpdated"/>
        <span class="font-12 gray04-color block mt8">{{ $t('RET_ImageValidation') }}</span>
      </div>

      <div class="field">
        <div class="flex align-center justify-between mb4">
          <div>
            <span class="input-title mb2">{{ $t('CM_MobileNumber') }}</span>
            <span class="block font-12 gray04-color">{{ $t('CS_Informed') }}</span>
          </div>
          <div>
            <RCheckbox v-model="noticeYn" class="checkbox-area type02">
              <span class="gray07-color font-14">{{ $t('CS_ReplyInformed') }}</span>
            </RCheckbox>
          </div>
        </div>
        <RInput
          ref="idRef"
          v-model="title"
          :placeholder="$t('USR_ValidNumber')"
          class="login-input login-input--id"
        />
      </div>
    </div>

    <div class="bottom-btn">
      <div class="flex-btn-area">
        <RButton class="btn full small type03 " label="취소" @on-click="onCancle" />
        <RButton class="btn full small type02" label="등록하기" @on-click="onSubmit" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
import customerService from '@/http/services/customer'

const { proxy } = getCurrentInstance()
const vCleanHtml = buildVueDompurifyHTMLDirective()

const checkbox = ref(false)

const inquiryType = ref(1)
const feedbackTypeData = ref(
  [
    { code: 1, text: '주문/결제' },
    { code: 2, text: '취소/환불' },
    { code: 3, text: '회원문의' },
    { code: 4, text: '배송/반품' },
    { code: 5, text: '정기구매' },
    { code: 6, text: '이벤트' },
    { code: 7, text: '상품문의' },
    { code: 8, text: '기타' },
    { code: 9, text: '포인트/쿠폰' }
  ]
)
</script>

<style lang="scss" scoped>

</style>
