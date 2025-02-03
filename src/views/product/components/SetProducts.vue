<template>
  <section class="max-width-1680 included-area">
    <h3>{{ $t('PR_PrdlistTitle1') }}</h3>
    <div class="included-list-wrap">
      <ul class="included-list">
        <li v-for="product in props.productData" :key="product.productId">
          <img :src="addPrefixForImage(product.thumbnailUrl)" :alt="product.productEnglishName">
          <div class="text-area">
            <h5>{{ product.productEnglishName }}</h5>
            <p>{{ product.summary }}</p>
            <a v-if="product.exposureYn" href="javascript:void(0)" @click="onClickDetail(product.productId), 'get-product-detail'">{{ $t('CM_DetailView') }}</a>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { addPrefixForImage, onClickDetail } from '@/utils/common'

const props = defineProps({
  productData: {
    type: Object,
    default: null
  }
})
</script>

<style lang="scss" scoped>

</style>
