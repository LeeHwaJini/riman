<template>
  <section v-if="bottomProductData && bottomProductData?.bannerBottomList.length > 0" class="main-section">
    <div class="main-prd-option-area">

      <swiper
        :slides-per-view="1"
        :pagination="{
          type: 'progressbar',
          clickable: true,
        }"
        :autoplay="
          // delay: 4000,
          // disableOnInteraction: false,
          false
        "
        :loop="true"
        :modules="modules"
        class="main-prd-swiper"

      >
        <swiper-slide v-for="(item, index) in bottomProductData?.bannerBottomList" :key="index">
          <div class="left-area" :style="{backgroundImage: `url(${addPrefixForImage(item.fileUrl)})`}" @click="router.push(item.link)">
            <p v-clean-html="item.title" class="text"></p>
          </div>

          <div class="prd-list-area">
            <div v-for="product in item.productList" :key="product.productId">
              <div class="prd-img-area">
                <img :src="addPrefixForImage(product.thumbnailUrl)" :alt="product.productName" class="img-cover" @click="onClickDetail(product.productId, 'get-main-bottom-product')">
                <div v-if="product.salesStatus.code === SALES_STATUS.almost_sold_out" class="prd-icon-area">
                  <span class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
                </div>
              </div>

              <div class="prd-list-info-area">
                <div class="prd-name-text" @click="onClickDetail(product.productId, 'get-main-bottom-product')">
                  {{ product.productName }}
                </div>
                <div class="prd-detail-text">{{ product.summary }}</div>
                <div class="prd-price-area">
                  <span>{{ $moneyFormat(product.amount) }}</span>
                  <span>{{ $t('CM_Won') }}</span>
                </div>

                <ul class="prd-point-area">
                  <template v-if="isLogined && isPlanner">
                    <li class="sp">
                      <span>{{ $moneyFormat(product.sp) }}</span><span>SP</span>
                    </li>
                    <li class="bp">
                      <span>{{ $moneyFormat(product.bp) }}</span><span>BP</span>
                    </li>
                  </template>
                  <li class="p">
                    <span>{{ $moneyFormat(product.point) }}</span><span>P</span>
                  </li>
                </ul>

                <AddCartDrawerButton :product="product" :no-product-detail-data="true" class-names="btn type07 small full"/>
              </div>
            </div>

          </div>
          <template v-if="isTablet">
            <ul class="list type05">
              <li v-for="product in item.productList" :key="product.productId">
                <div class="flex gap16 justify-between no-wrap">
                  <div class="flex gap16 no-wrap">
                    <div class="prd-img-area flex-shrink0">
                      <img :src="addPrefixForImage(product.thumbnailUrl)" :alt="product.productName" class="img-cover">

                      <div class="prd-icon-area top-left">
                        <span v-if="product.salesStatus.code === SALES_STATUS.almost_sold_out" class="prd-icon almost-sold-out">품절임박</span>
                        <span v-if="product.salesStatus.code === SALES_STATUS.sold_out" class="prd-icon date blank-fixed">단종예정</span>
                      </div>
                    </div>

                    <div class="prd-info-area">
                      <span class="prd-name-text font-14">{{ product.productName }}</span>

                      <div class="flex align-center gap2 mt8">
                        <b class="font-14 gray07-color">{{ $moneyFormat(product.amount) }}</b>
                        <b class="mt0 font-14 gray07-color">{{ $t('CM_Won') }}</b>
                      </div>

                      <ul class="prd-point-area medium">
                        <template v-if="isLogined && isPlanner">
                          <li class="sp">
                            <span>{{ $moneyFormat(product.sp) }}</span><span>SP</span>
                          </li>
                          <li class="bp">
                            <span>{{ $moneyFormat(product.bp) }}</span><span>BP</span>
                          </li>
                        </template>
                        <li class="p">
                          <span>{{ $moneyFormat(product.point) }}</span><span>P</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <AddCartDrawerButton :product="product" :no-product-detail-data="true" label="담기" class-names="btn type02 medium flex-shrink0 plr8"/>

                </div>

              </li>
            </ul>
          </template>

        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import etcService from '@/http/services/etc'
import { computed, getCurrentInstance } from 'vue'
import { addPrefixForImage, checkPlanner, onClickDetail } from '@/utils/common'
import { SALES_STATUS } from '@/utils/constant'
import { useRouter } from 'vue-router'
import { isLogin } from '@/utils/login'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const { data: bottomProductData } = etcService.getMainBottomProduct()
const vCleanHtml = buildVueDompurifyHTMLDirective()
const router = useRouter()
const isPlanner = computed(() => checkPlanner())
const isLogined = computed(() => isLogin())
const { proxy } = getCurrentInstance()
const isTablet = computed(() => proxy.$isTablet())

</script>

<style lang="scss" scoped>

</style>
