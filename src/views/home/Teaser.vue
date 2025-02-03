<template>

  <div class="teaser-wrap">
    <div class="teaser-container">
      <div style="position: relative;">
        <img src="@assets/images/teaser/teaser_layout_01.png" alt="teaser_layout_01">
        <div class="hiddenArea" @click="onCloseTeaser" />
      </div>

      <video class="video-content" autoplay muted loop controls>
        <source :src="videoUrl" type="video/mp4" />
      </video>

      <img src="@assets/images/teaser/teaser_layout_02.png" alt="teaser_layout_02">

      <div class="teaser-swiepr-area">
        <swiper
          :direction="'vertical'"
          :modules="modules"
          :slides-per-view="'1'"
          :navigation="true"
          :autoplay="{
            delay: 5000,
            disableOnInteraction: false
          }"
          :loop="true"

          class="teaser-swiepr"

        >
          <swiper-slide >
            <div class="img-area">
              <img src="@assets/images/teaser/teaser_slide_01.png" alt="teaser_slide_01">
            </div>
          </swiper-slide>
          <swiper-slide >
            <div class="img-area">
              <img src="@assets/images/teaser/teaser_slide_02.png" alt="teaser_slide_02">
            </div>
          </swiper-slide>
          <swiper-slide >
            <div class="img-area">
              <img src="@assets/images/teaser/teaser_slide_03.png" alt="teaser_slide_03">
            </div>
          </swiper-slide>
          <swiper-slide >
            <div class="img-area">
              <img src="@assets/images/teaser/teaser_slide_04.png" alt="teaser_slide_04">
            </div>
          </swiper-slide>
        </swiper>
      </div>

      <img src="@assets/images/teaser/teaser_layout_03.png" alt="img" clas>

      <div class="teaser-tab-area">
        <ul class="tab-list">
          <li
            v-for="(item, index) in tabData"
            :key="index"
            :class="{ 'active': tabDataIndex[index] }"
            @click="tabSelect(index)"
          >{{ item }}</li>
        </ul>

        <div class="tab-content">
          <img v-if="tabDataIndex[0]" src="@assets/images/teaser/teaser_tab_01.png" alt="">
          <img v-else-if="tabDataIndex[1]" src="@assets/images/teaser/teaser_tab_02.png" alt="">
          <img v-else-if="tabDataIndex[2]" src="@assets/images/teaser/teaser_tab_03.png" alt="">
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import videoUrl from '@/assets/images/teaser/teaser_video.mp4'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
// const showTeaser = import.meta.env.VITE_APP_SHOW_TEASER === 'true'

const emit = defineEmits(['closeTeaser'])

const tabDataIndex = ref([true, false, false])

const tabData = ['인셀덤', '보타랩', '라이프닝']

const tabSelect = (index) => {
  console.log(tabDataIndex.value[index])
  tabDataIndex.value = tabDataIndex.value.map((_, i) => i === index)
}

const onCloseTeaser = () => {
  emit('closeTeaser')
}
</script>

<style lang="scss" scoped>
.hiddenArea {
  position: absolute;
  z-index: 9999;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 50px;
  opacity: 0;
}
.teaser-wrap {
 background: #000;
 width: 100%;
 height: 100%;
 max-height: 100% !important;;
 padding: 0;
}
.teaser-container {
  overflow: hidden;
  margin: 0 auto;
  max-width: 1000px;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }

  video {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.teaser-tab-area {
  margin-top: -1px;
  padding-top: 24px;
  background: linear-gradient(270deg, #031724 0%, #022E49 50%, #000 100%);

  .tab-list {
    display: flex;
    align-items: center;
    margin: 0 24px;
    padding: 4px;
    background: #F3E7D7;
    border-radius: 60px;
    color: #fff;

    li {
      flex: 1;
      padding: 17px 0;
      color: #063451;
      font-size: 40px;
      text-align: center;
      cursor: pointer;

      &.active {
        background: #063451;
        border-radius: 60px;
        color: #fff;
        font-weight: 600;
      }
    }
  }
}

.teaser-swiepr-area {
  position: relative;
  background: url('@assets/images/teaser/teaser_slide_bg.png') no-repeat center center/cover;
  aspect-ratio: 1/1;
  // .slide-content-img {
  //   position: absolute;
  //   bottom: -49px;
  //   right: -73px;
  //   width: 434px;
  //   height: 430px;
  // }
}

.teaser-swiepr {
  margin-left: 0;
  width: 538px;
  height: 100%;

  .swiper-slide {
    padding: 0 48px;

    .img-area {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 100%;
      height: 100%;
    }

  }

  img {
    object-fit: contain;
  }

}

@media screen and (max-width:767px) {
  .teaser-tab-area {
    padding-top: 16px;

    .tab-list {
      margin: 0 16px;

      li {
        padding: 6px 0;
        font-size: 16px;
      }
    }
  }

  .teaser-swiepr-area {
    .teaser-swiepr {
      width: calc(44.17vw + 36px);
      min-width: 220px;
    }

    .swiper-slide {
      padding: 0 18px;
    }
  }

  // .teaser-swiepr-area {
  //   height: 264px;

  //   .teaser-swiepr {
  //     width: 232px;
  //   }

  //   .swiper-slide {
  //     padding: 0 16px;

  //     .img-area {
  //       width: 200px;
  //     }
  //   }

  //   // .slide-content-img {
  //   //   bottom: -20px;
  //   //   right: -32px;
  //   //   width: 184px;
  //   //   height: 180px;
  //   // }
  // }
}

</style>
