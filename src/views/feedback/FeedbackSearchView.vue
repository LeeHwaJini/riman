<template>
  <div class="full-width-wrap feed-back-wrap plr16 pb144">
    <div class="main-title-area plr0">
      <h3 class="bold primary09-color">고객의 소리</h3>
    </div>

    <h4 class="sub-title-area">고객의 소리 등록 내역 조회</h4>

    <div class="form-area type01 ">
      <div class="field">
        <span class="input-title required">이름</span>
        <RInput
          ref="idRef"
          v-model="input"
          placeholder="이름을 입력해주세요."
          class="login-input login-input--id"
        />
      </div>

      <div class="field">
        <span class="input-title required">휴대폰 번호</span>
        <RInput
          ref="idRef"
          v-model="input"
          placeholder="‘-’ 없이 숫자만 입력해주세요."
          class="login-input login-input--id"
        />
      </div>

      <div class="field">
        <span class="input-title required">비밀번호</span>
        <RInput
          ref="idRef"
          v-model="input"
          placeholder="비밀번호를 입력해주세요."
          class="login-input login-input--id"
        />
      </div>

      <div class="field">
        <RButton class="btn full small type02 font-16" label="조회하기" />
      </div>

      <div class="field">
        <router-link to="" class="block text-center font-12 gray05-color">비밀번호 재설정하기</router-link>
      </div>

      <div class="login-method-area mt48">
        <span class="text">등록한 적이 없으신가요?</span>

        <router-link to="" class="block text-center mt32 font-12 medium primary09-color text-underline type02">고객의 소리 등록하러 가기</router-link>
      </div>

    </div>
  </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>
