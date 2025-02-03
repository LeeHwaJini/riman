<template>
  <section v-if="bestSellerData && bestSellerData?.productList.length > 0" class="main-section bestsellers-section">
    <div class="title-area max-width-1680">
      <h1>{{ bestSellerData?.title }}</h1>
      <router-link to="/product/bestsellers" class="main-more-btn">{{ $t('CM_LoadMore') }}</router-link>
    </div>

    <swiper
      :breakpoints="{
        '0': {
          slidesPerView: 2.5
        },
        '768': {
          slidesPerView: 4
        },
        '1024': {
          slidesPerView: 5
        },
      }"
      :autoplay="{
        delay: 3000,
        disableOnInteraction: false
      }"
      :free-mode="true"
      :pagination="{
        clickable: true,
      }"
      :loop="true"
      :modules="modules"
      class="main-bestsellers-swiper"
    >
      <swiper-slide v-for="item in bestSellerData?.productList" :key="item.productId">
        <div class="prd-img-area">
          <img :src="addPrefixForImage(item.thumbnailUrl)" :alt="item.productName">
          <AddCartDrawerButton :product="item" display-type="hover" :no-product-detail-data="true"/>

          <div class="prd-icon-area">
            <span v-if="item.salesStatus.code === SALES_STATUS.almost_sold_out" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
          </div>
        </div>

        <div class="prd-list-info-area">
          <span class="prd-category-text">{{ item.brand.text }}</span>
          <p class="prd-detail-text" @click="onClickDetail(item.productId, 'get-main-bestseller')">{{ item.productName }}</p>
          <div class="prd-price-area">
            <span>{{ $moneyFormat(item.amount) }}</span>
            <span>{{ $t('CM_Won') }}</span>
          </div>

          <ul class="prd-point-area">
            <template v-if="isLogined && isPlanner">
              <li class="sp">
                <span>{{ $moneyFormat(item.sp) }}</span><span>SP</span>
              </li>
              <li class="bp">
                <span>{{ $moneyFormat(item.bp) }}</span><span>BP</span>
              </li>
            </template>
            <li class="p">
              <span>{{ $moneyFormat(item.point) }}</span><span>P</span>
            </li>
          </ul>
        </div>
      </swiper-slide>
    </swiper>

    <div class="image-container">
      <div class="fade-image type01"></div>
      <div class="fade-image type02"></div>
    </div>
  </section>
</template>

<script setup>

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import etcService from '@/http/services/etc'
import { addPrefixForImage, checkPlanner, onClickDetail } from '@/utils/common'
import { SALES_STATUS } from '@/utils/constant'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { isLogin } from '@/utils/login'
const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const { data: bestSellerData } = etcService.getMainBestSeller()
const isPlanner = computed(() => checkPlanner())
const isLogined = computed(() => isLogin())

</script>

<style lang="scss" scoped>

</style>
