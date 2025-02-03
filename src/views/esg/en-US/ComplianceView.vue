<template>
  <section class="about-section about-banner-section max-width-1680">
    <div class="about-top-banner-area">
      <h1 class="title bold">사이버신고센터</h1>
      <p class="sub-text">
        ESG 경영으로 미래가치를 창조하고 <br class="mo767"/>지속가능한 발전을 약속합니다.
      </p>

      <div class="history-video-bg video-bg">
        <video class="video-content" autoplay muted loop playsinline>
          <source src="@assets/video/compliance_banner_bg.mp4" type="video/mp4" />
        </video>
      </div>

    </div>
  </section>

  <section data-aos="fade-up" data-aos-duration="1000" class="about-section esg-text-section">
    <div class="riman-text-area" data-aos-duration="1000" data-aos-delay="">
      <h1>RIMAN KOREA의 <br class="mo"/>지속가능한 성장</h1>
      <p>
        RIMAN KOREA는 친환경 및 사회적 책임경영과 <br class="mo767"/>투명경영을 통해
        모두를 위한 지속가능한 세상을 <br class="mo767"/>만들기 위해 노력하고 있습니다.
      </p>
    </div>

    <div class="image-container">
      <div class="fade-image type01" />
      <div class="fade-image type02" />
    </div>
  </section>

  <section data-aos="fade-up" data-aos-duration="1000" class="about-section esg-title-section mt0">
    <h3 class="title">신고대상</h3>
    <p class="sub-text">리만코리아 임직원, 리만코리아와 거래하는 <br class="mo767"/>모든 회사 및 소속 임직원</p>
  </section>

  <section data-aos="fade-up" data-aos-duration="1000" class="about-section esg-title-section ">
    <h3 class="title">신고유형</h3>
    <ul class="declaration-list">
      <li>
        <img src="@assets/images/esg/compliance_icon_type01.png" alt="">
      </li>
      <li>
        <img src="@assets/images/esg/compliance_icon_type02.png" alt="">
      </li>
      <li>
        <img src="@assets/images/esg/compliance_icon_type03.png" alt="">
      </li>
      <li>
        <img src="@assets/images/esg/compliance_icon_type04.png" alt="">
      </li>
      <li>
        <img src="@assets/images/esg/compliance_icon_type05.png" alt="">
      </li>
      <li>
        <img src="@assets/images/esg/compliance_icon_type06.png" alt="">
      </li>
    </ul>
  </section>

  <section data-aos="fade-up" data-aos-duration="1000" class="about-section esg-title-section ">
    <h3 class="title">신고 처리절차</h3>

    <div class="declaration-img-area">
      <img src="@assets/images/esg/pc_compliance_declaration.png" alt="" class="pc-1023">
      <img src="@assets/images/esg/mo_compliance_declaration.png" alt="" class="mo">
    </div>
  </section>

  <section data-aos="fade-up" data-aos-duration="1000" class="about-section esg-declaration-btn-section max-width-1200">
    <p class="content-text">
      사이버신고센터는 협력업체, 임직원 등 이해관계자가 회사 임직원의 부정<br class="pc"/>
      또는 불공정 거래 행위에 대해 신고/접수하는 채널입니다.<br class="pc"/>
      접수된 내용은 CP 전담부서에서 철저히 사실 확인 조사를 실시합니다.<br class="pc"/>
      신고자의 안전을 최우선으로 하여 비밀을 철저히 관리하므로, 신고자는 어떠한<br class="pc"/>
      불이익도 받지 않도록 보장합니다.
    </p>

    <RButton
      :label="'신고하기'"
      class="btn type01"
      @click="onClickSue"
    />
  </section>

  <section data-aos="fade-up" data-aos-duration="1000" class="about-section esg-title-section esg-declaration-info-section">
    <div class="esg-declaration-info-inner max-width-1200">
      <h3 class="title">신고/상담 접수처</h3>
      <p>신고 또는 신고 관련하여 상담이 필요한 경우 아래로 문의주시기 바랍니다.</p>

      <ul class="declaration-info-area">
        <li>
          <div class="icon-text-area">
            <i class="ico online"/>
            온라인
          </div>
          <div class="text-area">https://observer-x.com/rimankorea</div>
        </li>
        <li>
          <div class="icon-text-area">
            <i class="ico msg"/>
            이메일
          </div>
          <div class="text-area">compliance.manager@riman.com</div>
        </li>
        <li>
          <div class="icon-text-area">
            <i class="ico address"/>
            우편 주소
          </div>
          <div class="text-area">서울 강남구 테헤란로 509 NC타워 I 12층 <br class="mo767"/>리만코리아 사이버신고센터 담당자 앞</div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
const onClickSue = () => {
  window.open('https://observer-x.com/rimankorea', '_blank')
}
</script>

<style lang="scss" scoped>

</style>
