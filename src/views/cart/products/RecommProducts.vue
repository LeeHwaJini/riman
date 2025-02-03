<template>
  <div class="for-you-area">
    <h6>{{ $t('CA_Recomm_title2') }}</h6>
    <ul class="grid-list type01">
      <li v-for="product in recommData" :key="product.productId">
        <div class="prd-img-area">
          <img :src="addPrefixForImage(product.thumbnailUrl)" :alt="product.productName" @click="onClickDetail(product.productId, 'get-cart-empty-ids')">

          <div v-if="product.salesStatus.code !== SALES_STATUS.sold_out" class="prd-icon-area">
            <span v-if="product.salesStatus.code === SALES_STATUS.almost_sold_out" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
            <span v-if="product.applyCouponYn" class="prd-icon coupon">{{ $t('PR_ApplyCoupon') }}</span>
          </div>
        </div>
        <div class="prd-list-info-area">
          <span class="category-title">{{ product.categoryName }}</span>
          <p class="prd-detail-text" @click="onClickDetail(product.productId, 'get-cart-empty-ids')">{{ product.productName }}</p>
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
      </li>
    </ul>

    <div class="text-img-area">
      <img src="@assets/images/foryou_text.svg" alt="" >
    </div>
  </div>
</template>

<script setup>
import AddCartDrawerButton from '@/components/drawer/AddCartDrawerButton'
import { addPrefixForImage, checkPlanner, onClickDetail } from '@/utils/common'
import { SALES_STATUS } from '@/utils/constant'
import { computed } from 'vue'
import { isLogin } from '@/utils/login'
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const { recommData } = defineProps({
  recommData: {
    type: Array,
    default: null
  }
})

</script>

<style lang="scss" scoped>

</style>
