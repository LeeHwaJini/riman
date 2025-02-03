<template>
  <section v-if="data && data.length > 0 && data.some(item => item.status.code !== 'TEMPORARY')" class="main-banner-content">
    <!-- pc :  상하 슬라이드 , mob/tablet : 좌우 슬라이드-->
    <swiper
      :direction="$isTablet() ? 'horizontal' : 'vertical'"
      :modules="modules"
      :slides-per-view="'1'"
      :navigation="true"
      :loop="true"
      class="main-banner-swiper"

    >
      <swiper-slide v-if="data[0]?.status.code !== 'TEMPORARY'">
        <ul class="main-banner-area type01">
          <li class="left-banner-area banner-content" @click="onClick(data[0]?.sections[0])">
            <img :src="addPrefixForImage(data[0]?.sections[0]?.imageUrl)" alt="탑 배너">
            <div class="hover-area">
              <img src="@/assets/images/main_more_detail.svg" alt="탑 배너">
            </div>
          </li>
          <li class="right-banner-area">
            <div class="right-top-banner-area">
              <div class="right-top-left-banner banner-content" @click="onClick(data[0]?.sections[1])">
                <img :src="addPrefixForImage(data[0]?.sections[1]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
              <div class="right-top-right-banner banner-content" @click="onClick(data[0]?.sections[2])">
                <img :src="addPrefixForImage(data[0]?.sections[2]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
            </div>
            <div class="right-bottom-banner-area">
              <div class="right-bottom-left-banner banner-content" @click="onClick(data[0]?.sections[3])">
                <img :src="addPrefixForImage(data[0]?.sections[3]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
              <div class="right-bottom-right-banner banner-content" @click="onClick(data[0]?.sections[4])">
                <img :src="addPrefixForImage(data[0]?.sections[4]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
            </div>
          </li>
        </ul>

      </swiper-slide>
      <swiper-slide v-if="data[1]?.status.code !== 'TEMPORARY'">
        <ul class="main-banner-area type02">
          <li class="left-banner-area">
            <div class="left-top-banner-area">
              <div class="left-top-left-banner banner-content" @click="onClick(data[1]?.sections[0])">
                <img :src="addPrefixForImage(data[1]?.sections[0]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
              <div class="left-top-right-banner banner-content" @click="onClick(data[1]?.sections[1])">
                <img :src="addPrefixForImage(data[1]?.sections[1]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
            </div>
            <div class="left-bottom-banner-area">
              <div class="left-bottom-left-banner banner-content" @click="onClick(data[1]?.sections[2])">
                <img :src="addPrefixForImage(data[1]?.sections[2]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
              <div class="left-bottom-right-banner banner-content" @click="onClick(data[1]?.sections[3])">
                <img :src="addPrefixForImage(data[1]?.sections[3]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
            </div>
          </li>
          <li class="right-banner-area banner-content" @click="onClick(data[1]?.sections[4])">
            <img :src="addPrefixForImage(data[1]?.sections[4]?.imageUrl)" alt="탑 배너">
            <div class="hover-area">
              <img src="@/assets/images/main_more_detail.svg" alt="">
            </div>
          </li>
        </ul>
      </swiper-slide>
      <swiper-slide v-if="data[2]?.status.code !== 'TEMPORARY'">
        <ul class="main-banner-area type01">
          <li class="left-banner-area banner-content" @click="onClick(data[2]?.sections[0])">
            <img :src="addPrefixForImage(data[2]?.sections[0]?.imageUrl)" alt="탑 배너">
            <div class="hover-area">
              <img src="@/assets/images/main_more_detail.svg" alt="탑 배너">
            </div>
          </li>
          <li class="right-banner-area">
            <div class="right-top-banner-area">
              <div class="right-top-left-banner banner-content" @click="onClick(data[2]?.sections[1])">
                <img :src="addPrefixForImage(data[2]?.sections[1]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
              <div class="right-top-right-banner banner-content" @click="onClick(data[2]?.sections[2])">
                <img :src="addPrefixForImage(data[2]?.sections[2]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
            </div>
            <div class="right-bottom-banner-area">
              <div class="right-bottom-left-banner banner-content" @click="onClick(data[2]?.sections[3])">
                <img :src="addPrefixForImage(data[2]?.sections[3]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
              <div class="right-bottom-right-banner banner-content" @click="onClick(data[2]?.sections[4])">
                <img :src="addPrefixForImage(data[2]?.sections[4]?.imageUrl)" alt="탑 배너">
                <div class="hover-area">
                  <img src="@/assets/images/main_more_detail.svg" alt="">
                </div>
              </div>
            </div>
          </li>
        </ul>

      </swiper-slide>
    </swiper>
  </section>
</template>

<script setup>

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import etcService from '@/http/services/etc'
import { addPrefixForImage } from '@/utils/common'
import { useRouter } from 'vue-router'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const { data } = etcService.getMainBanner()
const router = useRouter()
const onClick = (banner) => {
  if (banner.openLinkType.code === 'NEW_WINDOW') {
    window.open(banner.link, '_blank')
  } else {
    router.push(banner.link)
  }
}
</script>

<style lang="scss" scoped>

</style>
