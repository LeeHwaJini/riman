<template v-if="productData">
  <q-dialog ref="drawer" position="right" full-height class="prd-filter-popup-wrap">
    <q-card class="scroll type01">
      <button class="menu-close-btn" @click="onClickClose">
        <i class="ico close" />
      </button>
      <swiper
        :modules="modules"
        :slides-per-view="'1'"
        :pagination="{
          clickable: true,
        }"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: false,
        }"
        :loop="true"
        class="prd-cart-swiper"
        @click="onClickDetail(productData.productId)">
        <swiper-slide v-for="img in detailData?.imageUrl" :key="img.fileSize"><img :src="addPrefixForImage(img.urlImage)" :alt="productData.productName"></swiper-slide>
      </swiper>

      <div class="cart-prd-area">
        <div class="prd-info-area">
          <span class="prd-category-text">{{ detailData?.brand.text }}</span>
          <span class="prd-title-text" @click="onClickDetail(productData.productId)">{{ productData.productName }}</span>
          <span class="prd-detail-text">{{ productData.productSummary }}</span>
        </div>
        <!-- select일 경우 -->
        <template v-if="productData.optionYn && !!productData.option && options.length > 0">
          <!-- // select일 경우 -->
          <!-- 리스트일 경우 -->
          <div v-if="getOptionType(productData) === 'image' && getOptionUi(productData) === 'button'" class="option-select-area">
            <div class="option-title-text">{{ productData.option.items[0].optionName }}</div>
            <swiper
              :slides-per-view="'auto'"
              :free-mode="true"
              :pagination="{
                type: 'progressbar',
                clickable: true,
              }"
              :navigation="false"
              :modules="modules"
              class="prd-option-swiper h-large"
            >
              <!-- 활성화일경우: active 클래스 추가, 품절일 경우: disabled 클래스 추가 -->
              <swiper-slide v-for="optionItem in options" :key="optionItem.value" class="" :class="generateOptionClass(optionItem)" @click="() => onClickOption(optionItem)">
                <img :src="addPrefixForImage(optionItem.optionImageUrl)" alt="옵션이미지">
                <p>{{ optionItem.label }}</p>

                <!-- 품절일 경우 추가 -->
                <div v-if="optionItem.salesStatus.code === SALES_STATUS.sold_out" class="sold-out-area small">
                  <div class="sold-out-bg">
                    <span class="pre-line">{{ $t('CA_SoldOut') }}</span>
                  </div>
                </div>
                <!-- //품절일 경우 추가 -->
              </swiper-slide>
            </swiper>
          </div>

          <!-- 리스트일 경우 -->

          <div v-if="getOptionType(productData) === 'text' && getOptionUi(productData) === 'button'" class="size-select-area">
            <div class="option-title-text">{{ productData.option.items[0].optionName }}</div>
            <swiper
              :slides-per-view="'auto'"
              :free-mode="true"
              :pagination="{
                type: 'progressbar',
                clickable: true,
              }"
              :navigation="true"
              :modules="modules"
              class="prd-option-swiper h-xsmall"
            >
              <!-- 활성화일경우: active 클래스 추가, 품절일 경우: disabled 클래스 추가  -->
              <swiper-slide v-for="optionItem in options" :key="optionItem.value" :class="generateOptionClass(optionItem)" @click="() => onClickOption(optionItem)">
                {{ optionItem.label }}
              </swiper-slide>

            </swiper>
          </div>
          <div v-if="getOptionUi(productData) === 'select'" class="option-select-box-area">
            <div class="option-title-text">{{ productData.option.items[0].optionName }}</div>
            <RSelectBox
              v-if="getOptionType(productData) === 'image'"
              :model-value="selectedOption.value"
              :options="options"
              :disable="false"
              :filterable="false"
              :is-opt-icon="true"
              class="select-box type02"
              popup-content-class="select-list type04 large"
              @update:model-value="(v) => onClickOption(v, 'select')"
            >
              <template #prepend>
                <div class="option-img-area">
                  <img :src="addPrefixForImage(selectedOption.optionImageUrl)" :alt="selectedOption.value">
                </div>
              </template>
            </RSelectBox>

            <RSelectBox
              v-else
              :model-value="selectedOption.value"
              :options="options"
              :disable="false"
              :filterable="false"
              :is-opt-icon="false"
              class="select-box type02"
              popup-content-class="select-list type04 large"
              @update:model-value="(v) => onClickOption(v, 'select')"
            >
            </RSelectBox>
          </div>
        </template>

        <div class="order-select-area">
          <template v-if="isAutoship">
            <div class="option-title-text mb8">{{ $t('PR_ChooseOrderType') }}</div>

            <div class="cart-general-buy-area order-select-type">
              <div class="radio-area">
                <q-radio v-model="pageState.cartType" name="cartType" dense val="normal" :label="$t('PR_AddNormalCart')" />
                <div v-if="!productData.optionYn">{{ $moneyFormat(productData.priceOriginal) }}{{ $t('CM_Won') }}</div>
              </div>

              <ul v-if="pageState.cartType === 'normal'">
                <li>
                  <i class="ico check"></i>
                  <span>{{ $t('PR_SubsBenefit') }} </span>
                </li>
                <li>
                  <i class="ico check"></i>
                  <span>{{ $t('PR_SubsBenefit_txt1') }} <span class="success04-color">000{{ $t('CM_Won') }}</span>{{ $t('PR_Benefit_txt1') }}</span>
                </li>
                <li>
                  <i class="ico check"></i>
                  <span>{{ $t('PR_SubsBenefit_txt2') }} </span>
                </li>
                <li>
                  <i class="ico check"></i>
                  <span>{{ $t('PR_SubsBenefit_txt3') }}</span>
                </li>
              </ul>
            </div>

            <div v-if="productData.autoShipYn" class="cart-regular-buy-area order-select-type">
              <div class="radio-area">
                <q-radio v-model="pageState.cartType" name="cartType" dense val="auto" :label="$t('PR_AddSubsCart')" />
                <div>{{ $moneyFormat(productData.priceOriginal) }}{{ $t('CM_Won') }}</div>
              </div>

              <ul v-if="pageState.cartType === 'auto'">
                <li>
                  <i class="ico check"></i>
                  <span>{{ $t('PR_SubsBenefit') }} </span>
                </li>
                <li>
                  <i class="ico check"></i>
                  <span>{{ $t('PR_SubsBenefit_txt1') }} <span class="success04-color">000{{ $t('CM_Won') }}</span>{{ $t('PR_Benefit_txt1') }}</span>
                </li>
                <li>
                  <i class="ico check"></i>
                  <span>{{ $t('PR_SubsBenefit_txt2') }} </span>
                </li>
                <li>
                  <i class="ico check"></i>
                  <span>{{ $t('PR_SubsBenefit_txt3') }}</span>
                </li>
                <li>
                  <router-link to="/autoship">{{ $t('PR_AddSubs') }}</router-link>
                </li>
              </ul>
            </div>
          </template>
          <div v-if="selectedOptions && selectedOptions.length > 0" class="mt16 mb36">
            <div class="option-title-text mb8">{{ $t('PR_SelectedPrd') }}</div>
            <ul class="option-select-list mt0">
              <li v-for="(item, i) in selectedOptions" :key="i">
                <div class="option-title-area">
                  <span>{{ item?.label }}</span>
                  <i class="ico close-g" @click="() => onDeselectOption(item)"></i>
                </div>
                <div class="option-price-area">
                  <RNumberSpin v-model="item.quantity" :min="1" :max="!!item.maxQuantityLimit ? item.maxQuantityLimit : 100" class="num-input type01"/>
                  <div class="option-price">{{ $moneyFormat(item.priceOriginal) }}{{ $t('CM_Won') }}</div>
                </div>
              </li>
            </ul>
          </div>

          <div class="price-area">
            <template v-if="productData.optionYn">
              <div class="primary09-color medium">{{ $t('PR_Total') }}</div>
              <div>
                <div class="result-prd-price mb8">{{ $moneyFormat(optionPriceTotal) }}{{ $t('CM_Won') }}</div>
                <ul class="prd-point-area mb0">
                  <template v-if="isLogined && isPlanner">
                    <li class="sp">
                      <span>{{ $moneyFormat(optionSpTotal) }}</span><span>SP</span>
                    </li>
                    <li class="bp">
                      <span>{{ $moneyFormat(optionBpTotal) }}</span><span>BP</span>
                    </li>
                  </template>

                  <li class="p">
                    <span>{{ $moneyFormat(optionPointTotal) }}</span><span>P</span>
                  </li>
                </ul>
              </div>
            </template>

            <template v-else>
              <RNumberSpin v-model="pageState.quantity" :min="1" :max="!!productData.maxQuantityLimit ? productData.maxQuantityLimit : 100" class="num-input type01"/>
              <div>
                <div class="result-prd-price mb8">{{ $moneyFormat(productData.priceOriginal * pageState.quantity) }}{{ $t('CM_Won') }}</div>
                <ul class="prd-point-area mb0">
                  <template v-if="isLogined && isPlanner">
                    <li class="sp">
                      <span>{{ $moneyFormat(productData.spOriginal * pageState.quantity) }}</span><span>SP</span>
                    </li>
                    <li class="bp">
                      <span>{{ $moneyFormat(productData.bpOriginal * pageState.quantity) }}</span><span>BP</span>
                    </li>
                  </template>

                  <li class="p">
                    <span>{{ $moneyFormat(productData.point * pageState.quantity) }}</span><span>P</span>
                  </li>
                </ul>
              </div>
            </template>
          </div>

          <div v-if="recommData" class="others-buy-prd-area">
            <div class="option-title-text">{{ $t('PR_RecommPrd_txt1') }}</div>
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
              <swiper-slide v-for="recommProduct in recommData" :key="recommProduct.productId" class="">
                <div class="prd-img-area">
                  <img :src="addPrefixForImage(recommProduct.thumbnailUrl)" :alt="recommProduct.productName" @click="onClickDetail(recommProduct.productId, 'get-recommend-productList')">
                  <div v-if="recommProduct.salesStatus.code !== SALES_STATUS.sold_out " class="prd-icon-area">
                    <span v-if="recommProduct.salesStatus.code === SALES_STATUS.almost_sold_out" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}{{ recommProduct.salesAmount }}</span>
                    <span v-if="recommProduct.applyCouponYn" class="prd-icon coupo">{{ $t('PR_ApplyCoupon') }}</span>
                  </div>
                  <div v-if="recommProduct.salesStatus.code === SALES_STATUS.sold_out" class="sold-out-area small" @click="onClickDetail(recommProduct.productId, 'get-recommend-productList')">
                    <div class="sold-out-bg">
                      <span class="pre-line">{{ $t('CA_SoldOut') }}</span>
                    </div>
                  </div>
                </div>

                <div class="prd-list-info-area">
                  <p class="prd-detail-text" @click="onClickDetail(recommProduct.productId, 'get-recommend-productList')">{{ recommProduct.productName }}</p>
                  <div class="prd-price-area">
                    <span>{{ $moneyFormat(recommProduct.priceOriginal) }}</span>
                    <span>{{ $t('CM_Won') }}</span>
                  </div>
                  <AddCartDrawerButton :product="recommProduct" class-names="btn type07 small full"/>
                </div>
              </swiper-slide>
            </swiper>
          </div>
        </div>

        <div class="bottom-btn">
          <div class="flex-btn-area">
            <AddCartButton v-if="productData" :product-data="productData" :page-state="pageState" :selected-options="selectedOptions" class="btn full small type02" :label="$t('CM_Cart')" :close-drawer="onClickClose"/>
          </div>
        </div>

      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import productService from '@/http/services/product'
import { addPrefixForImage, checkPlanner, generateOptionObj, getOptionType, getOptionUi, onClickDetail } from '@/utils/common'
import AddCartButton from '@/views/product/AddCartButton'
import AddCartDrawerButton from './AddCartDrawerButton'
import { useRouter } from 'vue-router'
import { isLogin } from '@/utils/login'
import { SALES_STATUS } from '@/utils/constant'
import { useMainStore } from '@/store/mainStore'
const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const { data } = defineProps({
  data: {
    type: Object,
    default: null
  }
})

const productData = ref(data)
const router = useRouter()
const options = ref([])
const selectedOption = ref(null)
const selectedOptions = ref([])
const quantity = ref(1)
const drawer = ref()
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const isAutoship = import.meta.env.VITE_APP_IS_AUTOSHIP === 'true'
const mainStore = useMainStore()
const userId = mainStore.getUser.userSeqNo
const optionPriceTotal = computed(() => {
  return selectedOptions.value.reduce((pre, cur) => {
    pre += cur.priceOriginal * cur.quantity
    return pre
  }, 0)
})
const optionSpTotal = computed(() => {
  return selectedOptions.value.reduce((pre, cur) => {
    pre += cur.spOriginal * cur.quantity
    return pre
  }, 0)
})
const optionBpTotal = computed(() => {
  return selectedOptions.value.reduce((pre, cur) => {
    pre += cur.spOriginal * cur.quantity
    return pre
  }, 0)
})
const optionPointTotal = computed(() => {
  return selectedOptions.value.reduce((pre, cur) => {
    pre += cur.point * cur.quantity
    return pre
  }, 0)
})

const pageState = reactive({
  cartType: 'normal',
  quantity: 1
})

const { data: detailData } = productService.getProductDetail(productData.value.productId, userId, true)
const params = reactive({
  categoryIds: computed(() => (detailData.value && detailData.value.categories) ?? null),
  excludeProductType: 'MAIN_OPTION',
  soldOutSelect: true
})

const { data: recommData } = productService.getRecommendProductList(params)

const onClickOption = (optionItem, optionType) => {
  let _optionItem = optionItem
  if (optionType === 'select') {
    _optionItem = options.value.filter(item => item.value === optionItem)[0]
  }
  if (_optionItem.salesStatus.code === SALES_STATUS.sold_out) return
  if (!checkIsSelected(_optionItem)) {
    selectedOptions.value.push(_optionItem)
  }
  selectedOption.value = _optionItem
}
const onClickClose = () => {
  drawer.value.hide()
}

const onDeselectOption = (option) => {
  if (getOptionUi(productData.value) === 'select') {
    const onSaleProductQuantity = checkOnSaleProductQuantity()
    if (onSaleProductQuantity <= 1) {
      return
    }
  }
  selectedOptions.value = selectedOptions.value.filter(item => item.value !== option.value)
}

function checkIsSelected(optionItem) {
  return selectedOptions.value.map(item => {
    return item.productId
  }).includes(optionItem.productId)
}
function checkOnSaleProductQuantity() {
  return productData.value.option.items.filter(item => item.salesStatus.code !== SALES_STATUS.sold_out).length
}
function generateOptionClass(optionItem) {
  let className = ''
  if (selectedOption.value) {
    if (selectedOption.value.productId === optionItem.productId) {
      className = 'active'
    }
  }
  if (optionItem.salesStatus.code === SALES_STATUS.sold_out) {
    className = 'disabled'
  }
  return className
}
function initOptions(data) {
  if (!data.option || !data.optionYn) return
  data.option.items.forEach(item => {
    item = generateOptionObj(item, productData.value.priceOriginal)
    item.quantity = 1
    options.value.push(item)
  })
  let selected = data.option.selectedOption
  if (getOptionUi(data) === 'select') {
    selected = data.option.selectedOption ?? options.value.filter(item => item.salesStatus.code !== SALES_STATUS.sold_out)[0]
  }
  if (selected) {
    selectedOption.value = selected
    selectedOptions.value.push(selected)
  }
}

onMounted(() => {
  if (data) {
    productData.value = data
    initOptions(data)
    if (isAutoship && productData.value.autoShipYn) {
      pageState.cartType = 'auto'
    } else {
      pageState.cartType = 'normal'
    }
  }
})
</script>
