<template>
  <section class="about-section about-banner-section max-width-1680">
    <div class="about-top-banner-area">
      <h1 class="title bold">윤리준법경영</h1>
      <p class="sub-text">
        ESG 경영으로 미래가치를 창조하고 <br class="mo767"/>지속가능한 발전을 약속합니다.
      </p>

      <div class="history-video-bg video-bg">
        <video class="video-content" autoplay muted loop playsinline>
          <source src="@assets/video/ethics_banner_bg.mp4" type="video/mp4" />
        </video>
      </div>

    </div>
    <Breadcrumb />
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

  <section data-aos="fade-up" data-aos-duration="1000" class="about-section esg-title-section esg-ccm-declaration-section">
    <h3 class="title">윤리헌장</h3>
    <p>
      우리는 고객에게 최고 품질의 화장품을 제공하며, 방문판매업계에서의 선도적 위치를 유지하는 것을 목표로 합니다. 이에 따라, 우리는 투명하고 공정한 업무 수행을 통해 모든 이해관계자와의 신뢰를 구축하고 윤리적 가치를 실현하기위한 원칙을 아래와 같이 다짐합니다.
    </p>

    <ul class="esg-declaration-text-area">
      <li>
        <div class="left-text">하나,</div>
        우리는 모든 업무에서 정직하고 투명한 행동을 최우선으로 하며, 어떠한 부정 행위도 용납하지 않습니다.
      </li>
      <li>
        <div class="left-text">하나,</div>
        우리는 고객의 만족과 신뢰를 최우선으로 하며, 고객의 요구와 기대에 부응하는 최상의 제품과 서비스를 제공하기 위해 끊임없이 노력합니다.
      </li>
      <li>
        <div class="left-text">하나,</div>
        우리는 모든 직원을 존중하고, 개인의 성장을 지원함으로써 직원들이 자신의 역량을 최대한 발휘할 수 있도록 환경을 조성합니다.
      </li>
      <li>
        <div class="left-text">하나,</div>
        우리는 모든 활동에서 관련 법규와 규정을 철저히 준수하며, 윤리적 의무를 성실히 이행합니다.
      </li>
      <li>
        <div class="left-text">하나,</div>
        우리는 사회적 책임을 자각하고, 지속 가능한 발전을 위해 환경 보호와 사회 공헌 활동에 적극 참여합니다.
      </li>
    </ul>

    <p class="esg-declaration-bottom-text text-center">㈜리만코리아 임직원 일동</p>
  </section>

  <section data-aos="fade-up" data-aos-duration="1000" class="about-section esg-title-section esg-ccm-declaration-section">
    <h3 class="title">통합준법경영방침</h3>
    <p>리만코리아는 투명하고 책임감 있는 기업문화를 강조합니다. 우리는 엄격한 법률 준수와 윤리적 행동을 중시하며, 내부 감사 및 모니터링 체제를 통해 조직 내 투명성을 제고하고 있습니다. 고객의 신뢰를 최우선으로 하며, 지속 가능한 경영과 사회적 책임을 실천하여 나은 미래를 위한 노력을 지속적으로 기울이고 있습니다.</p>
  </section>

  <section data-aos="fade-up" data-aos-duration="1000" class="about-section ethics-bottom-btn-section">
    <div class="ethics-bottom-btn-area">
      <button class="btn type02" @click="router.push('/esg/compliance')">
        사이버 신고센터
        <i class="ico arrow-circle-right-w"/>
      </button>

      <button class="btn type03" @click="esgFileOpen('RimanKorea_Code_of_Ethical_Conduct.pdf')">
        윤리행동강령
        <i class="ico download"/>
      </button>

      <button class="btn type03" @click="esgFileOpen('RimanKorea_Integrated_Compliance_Management_Policy.pdf')">
        통합준법경영방침
        <i class="ico download"/>
      </button>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { esgFileOpen } from '@/utils/common'
import Breadcrumb from '@/views/about/Breadcrumb.vue'

const router = useRouter()
</script>

<style lang="scss" scoped>

</style>
