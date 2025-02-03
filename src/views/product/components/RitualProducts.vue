<template>
  <section class="secondary-beige-bg ritual-area prd-bg-area">
    <h3>{{ $t('PR_PrdlistTitle2') }}</h3>
    <swiper
      :slides-per-view="'auto'"
      :free-mode="true"
      :pagination="{
        type: 'progressbar',
        clickable: true,
      }"
      :navigation="true"
      :modules="modules"
      class="prd-option-area prd-recomm-area"
    >
      <swiper-slide v-for="(product, index) in props.productData" :key="product.productId" class="">
        <div class="setp-area type01">
          <span class="icon">STEP {{ index + 1 }}</span>
        </div>
        <div class="recomm-area">
          <div class="prd-img-area">
            <img :src="addPrefixForImage(product.thumbnailUrl)" :alt="product.productName" @click="onClickDetail(product.productId, 'get-product-detail')">
            <div v-if="product.salesStatus.code !== SALES_STATUS.sold_out" class="prd-icon-area">
              <span v-if="product.salesStatus.code === SALES_STATUS.almost_sold_out" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
              <span v-if="product.applyCouponYn" class="prd-icon coupon">{{ $t('PR_ApplyCoupon') }}</span>
            </div>
            <!-- sold 아웃일 경우 -->
            <div v-if="product.salesStatus.code === SALES_STATUS.sold_out" class="sold-out-area" @click="onClickDetail(product.productId, 'get-product-detail')">
              <div class="sold-out-bg">
                <span class="pre-line">{{ $t('CA_SoldOut') }}</span>
              </div>
            </div>
          </div>
          <div class="prd-list-info-area">
            <span class="prd-title-text" @click="onClickDetail(product.productId, 'get-product-detail')">{{ product.productName }}</span>
            <p class="prd-detail-text">{{ product.summary }}</p>
            <div class="prd-price-area">
              <span>{{ $moneyFormat(product.priceOriginal) }}</span>
              <span>{{ $t('CM_Won') }}</span>
            </div>
            <ul class="prd-point-area">
              <template v-if="isLogined && isPlanner">
                <li class="sp">
                  <span>{{ $moneyFormat(product.spOriginal) }}</span><span>SP</span>
                </li>
                <li class="bp">
                  <span>{{ $moneyFormat(product.bpOriginal) }}</span><span>BP</span>
                </li>
              </template>
              <li class="p">
                <span>{{ $moneyFormat(product.point) }}</span><span>P</span>
              </li>
            </ul>
            <AddCartDrawerButton
              :product="product"
              class-names="btn type07 small full"
            />
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div class="text-img-area">
      <img src="@assets/images/ritual_text.svg" alt="">
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { isLogin } from '@/utils/login'
import { addPrefixForImage, checkPlanner, onClickDetail } from '@/utils/common'
import { SALES_STATUS } from '@/utils/constant'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const router = useRouter()
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const props = defineProps({
  productData: {
    type: Object,
    default: null
  }
})

</script>

<style lang="scss" scoped>

</style>
