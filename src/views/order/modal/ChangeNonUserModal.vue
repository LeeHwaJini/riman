<!--
  주문자 정보 변경 modal
  create by jhchoi
-->

<template>
  <q-dialog
    ref="modal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    class="full-page-modal"
    @show="show"
    @hide="hide"
  >
    <layout-modal
      ref="layoutModal"
      @hide="hide"
    >

      <!-- 팝업 내용 -->
      <template #body>
        <div class="title-top-area">
          <h4>주문자 정보 변경</h4>
          <button class="menu-close-btn" @click="hide">
            <i class="ico close" />
          </button>
        </div>

        <div class="form-area type01">
          <div class="field">
            <span class="input-title">주문자명</span>
            <RInput v-model="inputText" placeholder="" class="login-input login-input--id" />
            <span class="input-detail-text">성과 이름이 정확히 분리되었나요?<br>만약 잘못되었다면 지금 직접 수정할 수 있어요.</span>
          </div>

          <div class="field">
            <span class="input-title">추천인 번호</span>
            <RInput v-model="inputText" disable placeholder="1234568798" class="login-input login-input--id" />
            <span class="input-detail-text">추천인 정보가 없을 경우 비회원 구매가 불가능합니다.<br>퍼스널몰 QR코드로 접근시 추천인 정보를 변경 할 수 없습니다.</span>
          </div>

          <div class="field">
            <span class="input-title">추천인 번호</span>
            <div class="input-btn-area">
              <RInput v-model="inputText" placeholder="추천인 회원 번호를 10자리 이상 입력해 주세요." :error="isError" :error-message="errorMsg" class="login-input login-input--id "/>

              <!-- QR 코드 접근 시 해당 버튼 제거 -->
              <RButton disable class="btn type01 w-small small mt0" label="검색" @on-click=""/>
            <!-- //QR 코드 접근 시 해당 버튼 제거 -->
            </div>

            <div class="recomm-info-area">
              <div>
                <span class="gray-text">{National}</span>
                <span class="navy-text">{1234567890}</span>
              </div>

              <span class="gray-text">{last 길동} {first 홍}</span>
            </div>
          </div>

          <div class="field">
            <span class="input-title">추천인 번호</span>
            <div class="input-btn-area">
              <RInput v-model="inputText" placeholder="추천인 회원 번호를 10자리 이상 입력해 주세요." :error="isError" :error-message="errorMsg" class="login-input login-input--id "/>
              <RButton class="btn type01 w-small small mt0" label="검색" @on-click=""/>
            </div>

            <span class="input-detail-text">추천인 정보가 없을 경우 비회원 구매가 불가능합니다.<br>퍼스널몰 QR코드로 접근시 추천인 정보를 변경 할 수 없습니다.</span>
          </div>

          <div class="field">
            <Certificate
              @on-success="onCertSuccess"
              @on-fail="onCertFail"
            />
            <!-- 휴대폰 인증 후에 나타나는 영역 -->
            <span class="input-detail-text success04-color">휴대폰 본인인증 완료 (010-1234-5678)</span>
            <!-- 휴대폰 인증 후에 나타나는 영역 -->
          </div>
        </div>

        <div class="popup-bottom-area">
          <div class="popup-bottom-btn">
            <RButton class="btn full small type03" label="닫기" @on-click="" />
            <RButton class="btn full small type02" label="변경하기" @on-click="" />
          </div>
        </div>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['ok', 'cancel'])

const modal = ref()
const inputText = ref()

// 팝업 Hide 호출
const hide = () => {
  modal.value.hide()
}

// 팝업 Hide 호출
const show = () => {
  modal.value.show()
}

</script>
