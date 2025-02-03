<template>
  <div class="prd-member-buy-area max-width-1024">
    <h5>{{ $t('PR_RecommPrd_txt1') }}</h5>
    <h6 class="mo-member-buy-top-title">{{ $t('PR_RecommPrd_txt2') }}</h6>
    <div class="mo-member-buy-title">
      <b>{{ $t('PR_RecommPrd_txt3') }}</b>
      <span>{{ $t('PR_RecommPrd_txt4') }}</span>
    </div>
    <swiper
      :slides-per-view="'auto'"
      :free-mode="true"
      :pagination="{
        type: 'progressbar',
        clickable: true,
      }"
      :navigation="true"
      :modules="modules"
      class="prd-option-area prd-recomm-area transparent-bar"
    >
      <swiper-slide v-for="product in props.productData" :key="product.productId" class="">
        <div class="recomm-area">
          <div class="prd-img-area">
            <img :src="addPrefixForImage(product.thumbnailUrl)" :alt="product.productName" @click="onClickDetail(product.productId, 'get-recommend-productList')">

            <div v-if="product.salesStatus.code !== SALES_STATUS.sold_out" class="prd-icon-area">
              <span v-if="product.applyCouponYn" class="prd-icon almost-sold-out">{{ $t('PR_ApplyCoupon') }}</span>
              <span v-if="product.salesStatus.code === SALES_STATUS.almost_sold_out" class="prd-icon coupon">{{ $t('PR_AlmostSoldout') }}</span>
            </div>

          </div>
          <div class="prd-list-info-area">
            <span class="prd-category-text">{{ product.brand.text }}</span>
            <p class="prd-detail-text" @click="onClickDetail(product.productId, 'get-recommend-productList')">{{ product.productName }}</p>

            <div class="prd-price-area">
              <span>{{ $moneyFormat(product.priceOriginal) }}</span>
              <span>{{ $t('CM_Won') }}</span>
            </div>
            <AddCartDrawerButton
              class-names="btn type07 small full"
              :product="product"
            />
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="prd-bottom-btn-area type02 prd-btn-full">
      <span class="sold-text">{{ $t('PR_RecommPrd_txt2') }} {{ $t('PR_RecommPrd_txt5') }}</span>
      <div class="btn-wrap" >
        <RButton disabled class="btn full small type02" :label="props.soldOutMessage && props.soldOutMessage !== '' ? props.soldOutMessage : $t('PR_Soldout')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { SALES_STATUS } from '@/utils/constant'
import AddCartDrawerButton from '@/components/drawer/AddCartDrawerButton.vue'
import { onClickDetail, addPrefixForImage } from '@/utils/common'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const props = defineProps({
  productData: {
    type: Object,
    default: null
  },
  soldOutMessage: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>

</style>
