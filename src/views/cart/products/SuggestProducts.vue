<template>
  <div class="cart-silde-area">
    <h6>{{ $t('CA_Recomm_title3') }}</h6>
    <swiper
      :slides-per-view="'auto'"
      :free-mode="true"
      :pagination="{
        type: 'progressbar',
        clickable: true,
      }"
      :navigation="true"
      :modules="modules"
      class="prd-option-swiper"
    >
      <swiper-slide v-for="product in productList" :key="product.productId" class="">
        <div class="prd-img-area">
          <img :src="addPrefixForImage(product.thumbnailUrl)" :alt="product.productName" @click="onClickDetail(product.productId, 'get-suggest-cart')">
          <div v-if="product.salesStatus.code !== SALES_STATUS.sold_out " class="prd-icon-area">
            <span v-if="product.salesStatus.code === SALES_STATUS.almost_sold_out" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
            <span v-if="product.applyCouponYn" class="prd-icon coupo">{{ $t('PR_ApplyCoupon') }}</span>
          </div>
        </div>

        <div class="prd-list-info-area">
          <span class="category-title">{{ product.brand.code }}</span>
          <p class="prd-detail-text" @click="onClickDetail(product.productId, 'get-suggest-cart')">{{ product.productName }}</p>
          <div class="prd-price-area">
            <span>{{ $moneyFormat(product.priceOriginal) }}</span>
            <span>{{ $t('CM_Won') }}</span>
          </div>

          <AddCartDrawerButton :product="product" class-names="btn type07 small full"/>
        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<script setup>
import AddCartDrawerButton from '@/components/drawer/AddCartDrawerButton'
import productService from '@/http/services/product'
import { addPrefixForImage, onClickDetail } from '@/utils/common'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { onMounted, ref } from 'vue'
import { SALES_STATUS } from '@/utils/constant'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const productData = ref(null)
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})
onMounted(() => {
  productData.value = props.data
})
const { data: productList } = productService.getProductsByIds(productData, 'get-suggest-products', true)

</script>

<style lang="scss" scoped>

</style>
