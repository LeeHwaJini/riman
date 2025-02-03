<template>
  <div class="cart-silde-area">
    <h6>{{ $t('CA_Recomm_title1') }}</h6>
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
          <img :src="addPrefixForImage(product.thumbnailUrl)" :alt="product.productName" @click="onClickDetail(product.productId, 'get-purchased-cart')">

          <!-- <div class="prd-icon-area top">
            <span class="prd-icon buy">{{ generateSalesCount(product) }}회 구매</span>
          </div> -->
        </div>

        <div class="prd-list-info-area">
          <span class="category-title">{{ product.brand.code }}</span>
          <p class="prd-detail-text" @click="onClickDetail(product.productId, 'get-purchased-cart')">{{ product.productName }}</p>
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

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const productData = ref(null)
const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

const { data: productList } = productService.getProductsByIds(productData, 'get-purchased-products', true)
function generateSalesCount(product) {
  let cartData = null
  props.data.forEach(item => {
    if (item.productOptionId) {
      cartData = props.data.filter(item => item.productOptionId === product.productId)[0]
    } else {
      cartData = props.data.filter(item => item.productId === product.productId)[0]
    }
  })
  return cartData.salesCount
}
onMounted(() => {
  productData.value = props.data
})
</script>

<style lang="scss" scoped>

</style>
