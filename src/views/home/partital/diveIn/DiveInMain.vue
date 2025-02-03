<template>
  <section v-if="data && data.length > 0" class="main-section dive-section title-section">
    <div class="title-area max-width-1680">
      <h3>{{ $t('DI_DiveIn') }}</h3>
      <router-link to="/diveIn" class="main-more-btn">{{ $t('CM_LoadMore') }}</router-link>
    </div>

    <swiper
      :slides-per-view="'auto'"
      :looped-slides="2"
      :space-between="32"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false,
      }"
      :centered-slides="true"
      :loop="true"
      :modules="modules"
      class="main-dive-swiper"
      @slide-change="onSlideChange"
    >
      <swiper-slide v-for="(item, index) in [...data, ...data, ...data]" :key="item.id" @click="onClickSlide(item, index)">
        <div v-if="index === centeredSlideIndex" class="video-area" :style="{backgroundImage: `url('${addPrefixForImage(item.thumbnailImageUrl)}'`}">
          <video class="video-content" autoplay playsinline muted>
            <source :src="addPrefixForImage(item.videoUrl)" type="video/mp4" />
          </video>

          <div class="video-view-count-area">
            <i class="ico video" />
            <span class="view-count-text">{{ getViewCount(item.viewCount) }}</span>
          </div>
        </div>
        <img v-else :src="addPrefixForImage(item.thumbnailImageUrl)" alt="">
      </swiper-slide>
    </swiper>

    <div class="text-img-area">
      <img src="@assets/images/divein_text.svg" alt="">
    </div>

  </section>
</template>

<script setup>

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import diveInService from '@/http/services/diveIn'
import { getCurrentInstance, ref, watch, onMounted, nextTick } from 'vue'
import DiveInModal from '@/components/modal/DiveInModal.vue'
import { addPrefixForImage, getViewCount } from '@/utils/common'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const centeredSlideIndex = ref(null)
const { proxy } = getCurrentInstance()
const { data } = diveInService.getMianList()

const onSlideChange = (swiper) => {
  centeredSlideIndex.value = swiper.realIndex
}
const onClickSlide = (item, index) => {
  if (index !== centeredSlideIndex.value) return
  proxy.openModal({
    parent: proxy,
    component: DiveInModal,
    componentProps: {
      diveInId: item.id
    }
  })
}

</script>
