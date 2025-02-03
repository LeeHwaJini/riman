<template>
  <section class="about-section about-banner-section max-width-1680">
    <div class="about-top-banner-area">
      <h1 class="title bold">Research & Development</h1>
      <p class="sub-text">
        연구개발 전문성을 강화하고 관리 효율성을 높이는<br/>
        RIMAN의 차별화된 R&D를 소개합니다
      </p>

      <div class="history-video-bg video-bg">
        <video class="video-content" autoplay muted loop playsinline>
          <source src="@assets/video/rnd_banner_bg.mp4" type="video/mp4" />
        </video>
      </div>

    </div>
    <Breadcrumb />
  </section>

  <section class="about-section title-sub-text-section">
    <div class="text-area">
      <h1 data-aos="fade-up" data-aos-duration="1000" class="title">
        내면의 아름다움과 가치를 발견하고<br/>
        혁신적인 연구로 빛을 더합니다
      </h1>
      <p data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600" class="sub-text">RIMAN은 연구개발 전문성을 강화하고 관리 효율성을 극대화하며, 차별화된 R&D 솔루션을 제공합니다.</p>
    </div>

    <ul class="rnd-solution-list">
      <li class="type01">
        <a href="https://askcompany.co.kr/creative" target="_blank">
          <img src="@assets/images/about/ask_company_logo.png" alt="askCompanyLogo" class="ask-logo">
          <p>
            트렌드를 선도하는 창의적 전략과<br/>
            차별화된 제품 개발
          </p>

          <span class="more-text">more</span>
        </a>
      </li>
      <li class="type02">
        <a href="https://askcompany.co.kr/innovative" target="_blank">
          <h3>ASK LABS</h3>
          <p>
            천연물 추출, 정제, 발효를 통해<br/>
            독보적인 소재와 제형 연구
          </p>

          <span class="more-text">more</span>
        </a>
      </li>
      <li class="type03">
        <a href="https://askcompany.co.kr/exclusive" target="_blank">
          <h3>ASK BASE</h3>
          <p>
            독자 기술로 천연소재 발굴 및<br/>
            RIMAN 헤리티지 원료<br class="mo"/> 가공 및 생산
          </p>

          <span class="more-text">more</span>
        </a>
      </li>
    </ul>
  </section>

  <section class="about-section about-banner-section">
    <div class="about-top-banner-area full-banner rnd-img-bg-area">
      <h1 class="title">
        RIMAN의 독점 종자, <br class="mo"/>자이언트 병풀
        <br/>
        Whole Process 개발
      </h1>
      <p class="sub-text max-838-text">
        직접 재배 확대 위해 제주 대형 스마트팜 구축, <br class="mo"/>ASK LABS 및 유수의 산학 연구진과 연계로 <br class="mo"/>
        종자관리, 재배, 수확, 추출, 원료화 등 전 과정에서 최적의 연구 진행
      </p>
    </div>
  </section>

  <section class="about-section rnd-ask-section">
    <div class="title-area">
      <h1 data-aos="fade-up" data-aos-duration="1000" class="title">
        최고 품질 기준으로 신뢰할 수 있는<br/>
        제품을 만드는 ASK COMPANY
      </h1>
      <a data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200" class="Learn-more-text center" href="https://askcompany.co.kr/creative" target="_blank">Learn more</a>
    </div>

    <ul class="pc-ask-list">
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
        <img src="@assets/images/about/ask_list_01.png" alt="" class="top-img">
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1200">
        <img src="@assets/images/about/ask_list_02.png" alt="" class="top-img">
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1800">
        <img src="@assets/images/about/ask_list_03.png" alt="" class="top-img">
      </li>
    </ul>

    <swiper
      :slides-per-view="'auto'"
      :looped-slides="2"
      :space-between="0"
      :centered-slides="true"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      :modules="modules"
      class="mo-ask-list-swiper swiper-pagination-type02"
    >
      <template v-for="item in 2" :key="item">
        <swiper-slide >
          <img src="@assets/images/about/ask_list_01.png" alt="" class="img-cover">
        </swiper-slide>
        <swiper-slide>
          <img src="@assets/images/about/ask_list_02.png" alt="" class="img-cover">
        </swiper-slide>
        <swiper-slide >
          <img src="@assets/images/about/ask_list_03.png" alt="" class="img-cover">
        </swiper-slide>
      </template>
    </swiper>
  </section>

  <section class="about-section rnd-ask-section">
    <div class="title-area">
      <h1 data-aos="fade-up" data-aos-duration="1000" class="title">
        지속 가능한 성장을 바탕으로 <br/>
        혁신적인 R&D 기술을 선도하는 <br class="mo767"/>ASK LABS
      </h1>
      <a data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200" class="Learn-more-text center" href="https://askcompany.co.kr/innovative" target="_blank">Learn more</a>
    </div>

    <ul class="pc-ask-list hover">
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
        <img src="@assets/images/about/ask_list_04.png" alt="" class="top-img">

        <div class="rnd-hover-item-area">
          <b>천연 혁신 소재</b>
          <p>
            한국생명공학연구원과 협력하여<br/>
            기술 혁신을 이루며 헬스 & 뷰티 산업의<br/>
            새로운 기준을 만들어갑니다.
          </p>
        </div>
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1200">
        <img src="@assets/images/about/ask_list_05.png" alt="" class="top-img">

        <div class="rnd-hover-item-area ">
          <b>특색있는 원료</b>
          <p>
            독창적인 병풀 스토리를 기반으로<br/>
            원료의 차별화와 품질의 완성도를<br/>
            높이는 데 주력합니다.
          </p>
        </div>
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1800">
        <img src="@assets/images/about/ask_list_06.png" alt="" class="top-img">

        <div class="rnd-hover-item-area ">
          <b>제형 연구 방향</b>
          <p>
            품질 개선과 기술력 강화를 통해<br/>
            헬스 & 뷰티 분야의 실질적인<br/>
            솔루션을 제시하는 연구를 이어갑니다.
          </p>
        </div>
      </li>
    </ul>

    <swiper
      :slides-per-view="'auto'"
      :looped-slides="2"
      :space-between="0"
      :centered-slides="true"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      :modules="modules"
      class="mo-ask-list-swiper swiper-pagination-type02"
    >
      <template v-for="item in 2" :key="item">
        <swiper-slide>
          <img src="@assets/images/about/ask_list_04.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area ">
            <b>천연 혁신 소재</b>
            <p>
              한국생명공학연구원과 협력하여<br/>
              기술 혁신을 이루며 헬스 & 뷰티 산업의<br/>
              새로운 기준을 만들어갑니다.
            </p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <img src="@assets/images/about/ask_list_05.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area ">
            <b>특색있는 원료</b>
            <p>
              독창적인 병풀 스토리를 기반으로<br/>
              원료의 차별화와 품질의 완성도를<br/>
              높이는 데 주력합니다.
            </p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <img src="@assets/images/about/ask_list_06.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area ">
            <b>제형 연구 방향</b>
            <p>
              품질 개선과 기술력 강화를 통해<br/>
              헬스 & 뷰티 분야의 실질적인<br/>
              솔루션을 제시하는 연구를 이어갑니다.
            </p>
          </div>
        </swiper-slide>
      </template>
    </swiper>
  </section>

  <section class="about-section rnd-ask-section">
    <div class="title-area">
      <h1 data-aos="fade-up" data-aos-duration="1000" class="title">
        자연에서 영감을 얻어, <br class="mo"/>헤리티지원료를<br class="pc-1023"/>
        가공·생산하는 <br class="mo767"/>ASK BASE
      </h1>
      <a data-aos="fade-up" data-aos-duration="1000" data-aos-delay="200" class="Learn-more-text center" href="https://askcompany.co.kr/exclusive" target="_blank">Learn more</a>
    </div>

    <ul class="pc-ask-list hover">
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
        <img src="@assets/images/about/ask_list_07.png" alt="" class="top-img">

        <div class="rnd-hover-item-area ">
          <b>제주용암해수</b>
          <p>
            풍부한 미네랄과 영양염류를 함유한<br/>
            리만의 핵심 헤리티지 원료
          </p>
        </div>
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1600">
        <img src="@assets/images/about/ask_list_08.png" alt="" class="top-img">

        <div class="rnd-hover-item-area ">
          <b>자이언트 병풀</b>
          <p>
            자이언트 병풀 재배시설 스마트팜에서<br/>
            재배된 리만의 독자적인 헤리티지 원료
          </p>
        </div>
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="2000">
        <img src="@assets/images/about/ask_list_09.png" alt="" class="top-img">

        <div class="rnd-hover-item-area ">
          <b>제주생산시설</b>
          <p>
            생산에서부터 공급까지 다양한 제품을<br/>
            제공하기 위한 첨단 기술력 보유
          </p>
        </div>
      </li>
    </ul>

    <swiper
      :slides-per-view="'auto'"
      :looped-slides="2"
      :space-between="0"
      :centered-slides="true"
      :loop="true"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      :modules="modules"
      class="mo-ask-list-swiper swiper-pagination-type02"
    >
      <template v-for="item in 2" :key="item">
        <swiper-slide>
          <img src="@assets/images/about/ask_list_07.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area ">
            <b>제주용암해수</b>
            <p>
              풍부한 미네랄과 영양염류를 함유한<br/>
              리만의 핵심 헤리티지 원료
            </p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <img src="@assets/images/about/ask_list_08.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area ">
            <b>자이언트 병풀</b>
            <p>
              자이언트 병풀 재배시설 스마트팜에서<br/>
              재배된 리만의 독자적인 헤리티지 원료
            </p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <img src="@assets/images/about/ask_list_09.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area ">
            <b>제주생산시설</b>
            <p>
              생산에서부터 공급까지 다양한 제품을<br/>
              제공하기 위한 첨단 기술력 보유
            </p>
          </div>
        </swiper-slide>
      </template>
    </swiper>

  </section>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import Breadcrumb from '../Breadcrumb.vue'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]

</script>

<style lang="scss" scoped>

</style>
