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
          <h3>ASK COMPANNY</h3>
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
    <div class="about-top-banner-area full-banner">
      <h1 class="title">
        RIMAN의 독점 종자, <br class="mo"/>자이언트 병풀
        <br/>
        Whole Process 개발
      </h1>
      <p class="sub-text max-838-text">
        직접 재배 확대 위해 제주 대형 스마트팜 구축, <br class="mo"/>ASK LABS 및 유수의 산학 연구진과 연계로 <br class="mo"/>
        종자관리, 재배, 수확, 추출, 원료화 등 전 과정에서 최적의 연구 진행
      </p>

      <div class="history-video-bg video-bg">
        <video class="video-content" autoplay muted loop playsinline>
          <source src="@assets/video/rnd_banner_bg.mp4" type="video/mp4" />
        </video>
      </div>

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
        <img src="@assets/images/temp/prd_banner01.png" alt="" class="top-img">
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1200">
        <img src="@assets/images/temp/prd_banner01.png" alt="" class="top-img">
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1800">
        <img src="@assets/images/temp/prd_banner01.png" alt="" class="top-img">
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
      <swiper-slide v-for="item in 6" :key="item">
        <img src="@assets/images/temp/prd_banner01.png" alt="" class="img-cover">
      </swiper-slide>
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
        <img src="@assets/images/temp/prd_banner01.png" alt="" class="top-img">

        <div class="rnd-hover-item-area type01">
          <b>화장품 연구소</b>
          <p>
            독자 처방 연구, 핵심 전달체 기술 개발 등<br/>
            제형을 연구합니다.
          </p>
        </div>
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1200">
        <img src="@assets/images/temp/prd_banner01.png" alt="" class="top-img">

        <div class="rnd-hover-item-area type02">
          <b>병풀 연구소</b>
          <p>
            첨단 기술력을 바탕으로 병풀의 특화 성분 발굴,<br/>
            기능 연구 등 소재 기술을 개발합니다.
          </p>
        </div>
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1800">
        <img src="@assets/images/temp/prd_banner01.png" alt="" class="top-img">

        <div class="rnd-hover-item-area type03">
          <b>식품 연구소</b>
          <p>
            기능성 식품의 소재 및 효능을 연구합니다.
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
          <img src="@assets/images/temp/prd_banner01.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area type01">
            <b>화장품 연구소</b>
            <p>
              독자 처방 연구, 핵심 전달체 기술 개발 등<br/>
              제형을 연구합니다.
            </p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <img src="@assets/images/temp/prd_banner01.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area type02">
            <b>병풀 연구소</b>
            <p>
              첨단 기술력을 바탕으로 <br class="mo767"/>병풀의 특화 성분 발굴,<br/>
              기능 연구 등 소재 기술을 개발합니다.
            </p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <img src="@assets/images/temp/prd_banner01.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area type03">
            <b>식품 연구소</b>
            <p>
              기능성 식품의 소재 및 효능을 <br class="mo767"/>연구합니다.
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
        <img src="@assets/images/temp/prd_banner01.png" alt="" class="top-img">

        <div class="rnd-hover-item-area type04">
          <b>제주도 용암해수단지</b>
          <p>
            제주도 특화 천연물을 활용한<br/>
            헤리티지 원료 생산
          </p>
        </div>
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="1600">
        <img src="@assets/images/temp/prd_banner01.png" alt="" class="top-img">

        <div class="rnd-hover-item-area type05">
          <b>자이언트 병풀 스마트팜 </b>
          <p>
            자이언트 병풀의 특별함과 효능을 <br/>
            발굴하는 병풀연구소
          </p>
        </div>
      </li>
      <li data-aos="fade-up" data-aos-duration="1000" data-aos-delay="2000">
        <img src="@assets/images/temp/prd_banner01.png" alt="" class="top-img">

        <div class="rnd-hover-item-area type06">
          <b>제주공장</b>
          <p>
            제주공장에서는 제품의 원료 생산부터 공급까지<br/>
            다양한 규모의 개발·생산 서비스
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
          <img src="@assets/images/temp/prd_banner01.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area type04">
            <b>제주도 용암해수단지</b>
            <p>
              제주도 특화 천연물을 활용한<br/>
              헤리티지 원료 생산
            </p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <img src="@assets/images/temp/prd_banner01.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area type05">
            <b>자이언트 병풀 스마트팜 </b>
            <p>
              자이언트 병풀의 특별함과 효능을 <br/>
              발굴하는 병풀연구소
            </p>
          </div>
        </swiper-slide>
        <swiper-slide>
          <img src="@assets/images/temp/prd_banner01.png" alt="" class="img-cover">
          <div class="rnd-hover-item-area type06">
            <b>제주공장</b>
            <p>
              제주공장에서는 제품의 원료 생산부터 공급까지<br class="pc"/>
              다양한 규모의 개발·생산 서비스
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

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]

</script>

<style lang="scss" scoped>

</style>
