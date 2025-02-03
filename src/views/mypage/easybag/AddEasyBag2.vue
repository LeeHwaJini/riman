<template>
  <div class="max-width-wrap full-width-wrap pb144">

    <div class="main-title-area  flex justify-between align-end">
      <h3 class=""> {{ $t('EB_AddTitle') }}</h3>
      <RStep :step="step" :total-step="totalStep" />
    </div>

    <div class="mb24 primary05-bg pd10 text-center font-14 medium primary09-color"> {{ $t('EB_Explain5') }}</div>

    <swiper
      :slides-per-view="'auto'"
      :free-mode="true"
      :pagination="{
        type: 'progressbar',
        clickable: true,
      }"
      :navigation="true"
      :modules="modules"
      class="category-option-area small slide-bar-color-none ml16"
    >
      <swiper-slide
        v-for="(slide, index) in brandList.map(i => i.brandName)"
        :key="index"
        :class="{ active: activeSlide === index }"
        @click="setActiveSlide(index)"
      >
        {{ slide }}
      </swiper-slide>
    </swiper>
    <div class="plr16 mt24 mb24">
      <div class="input-search type02">
        <RInput v-model="keyword" :placeholder="$t('CM_SearchComment')" class="login-input login-input--id "/>
        <RButton label="">
          <template #content>
            <i class="ico search-g"></i>
          </template>
        </RButton>
      </div>
    </div>

    <RSelectBox
      v-model="selectSortType"
      :options="sortOptions"
      class="select-box type01 popup-select-box mlauto mr4 mt8"
      popup-content-class="select-list type03"
    />

    <div class="easy-bag-step2-area plr16">

      <ul class="list type05 line">
        <li v-for="item in activeSlide ? wholeProductData.filter(i => i.brand.code === brandList[activeSlide].brandCode) : wholeProductData" :key="item.productId">
          <div class="flex gap16 justify-between no-wrap">
            <div class="flex gap16 no-wrap">
              <div class="prd-img-area flex-shrink0">
                <img :src="addPrefixForImage(item.thumbnailUrl)" alt="" class="img-cover">
                <div class="prd-icon-area top-left">
                  <span v-if="item.salesStatus.code === 'ALMOST_SOLD_OUT'" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
                  <span v-if="item.exposureEndDate && isValidDates(item.exposureEndDate, addDate(nowDate(), 'YYYY-MM-DD HH:mm:ss', { day: 30 }))" class="prd-icon date blank-fixed">{{ $t('EB_StopSellingSoon') }}</span>
                  <span v-if="item.salesStatus.code === 'SOLD_OUT'" class="prd-icon sold-out">{{ $t('EB_SoldOut') }}</span>
                  <span v-if="item.applyCouponYn" class="prd-icon coupon">{{ $t('OP_CouponDiscount2') }}</span>
                  <span v-if="item.restrictMemberDisplayYn" class="prd-icon member">{{ $t('EB_MemberOnly') }}</span>
                  <span v-if="item.salesStatus.code === 'PAUSE'" class="prd-icon stop">{{ $t('EB_StopSelling') }}</span>
                  <!-- EVENT: 추후 상품관리에 추가 예정 -->
                  <!-- <span class="prd-icon event">EVENT</span> -->
                </div>
              </div>

              <div class="prd-info-area">
                <span class="prd-name-text font-14">{{ item.productName }}</span>
                <div class="flex align-center gap2 mt8">
                  <b class="font-14 gray07-color">{{ $moneyFormat(item.priceOriginal) }}{{ $t('CM_Won') }}</b>
                </div>

                <ul class="prd-point-area medium">
                  <li class="sp">
                    <span>{{ item.spOriginal }}{{ $t('CM_Sp') }}</span>
                  </li>
                  <li class="bp">
                    <span>{{ item.bpOriginal }}{{ $t('CM_Bp') }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <RButton class="btn type02 medium flex-shrink0 plr8" :label="$t('CM_Store')" @click="onSelectProduct(item)" />

          </div>

        </li>
      </ul>

    </div>

    <!-- 상품이 담겼을 경우 -->
    <div v-if="productBagRequestList.length" class="bottom-btn primary05-bg">
      <div class="flex align-center justify-between">
        <span class="font-16 gray07-color medium">{{ $t('EB_GoFinalStep') }}</span>
        <div class="relative">
          <RButton class="btn medium type02 plr8 font-14" :label="$t('NAV_EasyBag')" @click="toNextStep" />
          <span class="badge type01 top-left8">{{ productBagRequestList.reduce((acc, cur) => acc + cur.quantity, 0) }}</span>
        </div>
      </div>
    </div>
    <!-- //상품이 담겼을 경우 -->

    <!-- 상품 안 담았을 경우 -->
    <div v-else class="bottom-btn">
      <div class="flex align-center justify-between">
        <span class="font-16 gray07-color medium">{{ $t('EB_PleaseAddItem') }}</span>
        <div class="relative">
          <RButton class="btn medium type02 plr8 font-14" :label="$t('NAV_EasyBag')" disable @click="toNextStep" />
        </div>
      </div>
    </div>
    <!-- //상품 안 담았을 경우 -->
  </div>

  <responsive-modal
    ref="optionSelectModal"
    :title="proxy.$t('EB_SelectOption')"
    class="bottom-btn-modal option-select-modal"
  >
    <template #description>
      <div class="plr16 pb184">
        <span class="font-14 block gray07-color medium mb4">{{ selectedProduct.productName }}</span>
        <RSelectBox
          v-model="selectedOption"
          :placeholder-text="proxy.$t('EB_PleaseSelectOption')"
          :options="productOptions"
          class="select-box type04"
          @update:model-value="onChangeOption"
        />
      </div>

      <div class="popup-bottom-area">
        <div class="popup-bottom-btn">
          <RButton class="btn full small type02" :label="$t('EB_Add')" @click="onAddProduct(selectedProduct, selectedOption)" />
        </div>
      </div>
    </template>
  </responsive-modal>
</template>

<script setup>

import { ref, getCurrentInstance, onMounted, onUnmounted, watch, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import productService from '@/http/services/product'
import { addPrefixForImage } from '@/utils/common'
import { nowDate, isValidDates, addDate } from '@/utils/dateFormat'
import { useRouter } from 'vue-router'
import { sessionDataManager } from '@/utils/dataManager'

const { proxy } = getCurrentInstance()
const router = useRouter()

const totalStep = ref(3)
const step = ref(2)

const brandList = ref([])
const activeSlide = ref(0)

const wholeProductData = ref([])
const productBagRequestList = ref([])

const selectedProduct = ref()
const selectedOption = ref(null)

const keyword = ref(undefined)

const productOptions = ref()

const sortOptions = computed(() => [
  { label: proxy.$t('CM_BestSelling'), value: 'BEST_SELLING' },
  { label: proxy.$t('CM_AddNewest'), value: 'NEWEST' },
  { label: proxy.$t('CM_PriceLowToHigh'), value: 'PRICE_LOW_TO_HIGH' },
  { label: proxy.$t('CM_PriceHighToLow'), value: 'PRICE_HIGH_TO_LOW' }
])
const selectSortType = ref(sortOptions.value[0].value)

const {
  data,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
} = productService.getEasyBagProductList(keyword, undefined, selectSortType)

const initOptions = (data) => {
  wholeProductData.value = data.pages.map(item => item.data.list).reduce((pre, cur) => [...pre, ...cur], [])
    .filter(i => {
      if (i.optionYn) {
        return i.option.items.filter(option => option.exposureBagYn).length > 0
      }
      return true
    })
}

onMounted(() => {
  document.addEventListener('scroll', fetchNext)

  productBagRequestList.value = sessionDataManager.get('productBagRequestList') ? JSON.parse(sessionDataManager.get('productBagRequestList')) : []
  getBrandList()

  if (data.value) {
    initOptions(data.value)
  }
})

onUnmounted(() => {
  document.removeEventListener('scroll', fetchNext)
})

const getBrandList = async () => {
  const result = await productService.getBrandList()

  if (result) {
    brandList.value = result.data
      .filter(i => i.brandCode !== 'NONE' && i.brandCode !== 'MOST_LOVED')
  }
}

const setActiveSlide = (index) => {
  activeSlide.value = index
}

const fetchNext = () => {
  const isAlertShowed = document.getElementsByClassName('q-card')[0]

  if (isAlertShowed) {
    return
  }

  const scrollTop = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  if (!isFetchingNextPage.value && hasNextPage.value) {
    if (scrollTop + windowHeight + 20 >= documentHeight) {
      fetchNextPage()
    }
  }
}

const onSelectProduct = (item) => {
  selectedProduct.value = item
  selectedOption.value = null

  if (!item.optionYn) {
    onAddProduct(item)
  } else {
    productOptions.value = item.option.items
      .filter(i => i.exposureBagYn)
      .map(i => {
        return { label: i.productName, value: i }
      })

    proxy.$refs.optionSelectModal.show()
  }
}

const onChangeOption = (option) => {
  selectedOption.value = option
}

const onAddProduct = (selectedProduct, option) => {
  if (option === undefined && !selectedProduct.maxQuantityLimit) { // 옵션이 없는 상품
    updateProductBagRequestList(selectedProduct)
    return
  }

  if (option && !selectedProduct.maxQuantityLimit) { // 옵션이 있는 상품 > 옵션을 선택했을 경우
    if (option.maxQuantityLimit) {
      proxy.$confirm(
        proxy.$t('EB_NonMemberQuantityLimit'), {
          cancelLabel: proxy.$t('CM_Cancel'),
          ok: () => {
            if (option) {
              selectedProduct = { ...selectedProduct, selectedOption: option }
            }

            updateProductBagRequestList(selectedProduct)
          },
          cancel: () => {
            return
          }
        }
      )
      return
    }

    selectedProduct = { ...selectedProduct, selectedOption: option }
    updateProductBagRequestList(selectedProduct)
    return
  }

  if (option === null) { // 옵션이 있는 상품 > 옵션을 선택하지 않았을 경우
    proxy.$alert(proxy.$t('EB_PleaseSelectOption'), {
      ok: () => proxy.$refs.optionSelectModal.show()
    })
    return
  }

  if ((option === undefined || option) && selectedProduct.maxQuantityLimit) {
    proxy.$confirm(
      proxy.$t('EB_NonMemberQuantityLimit'), {
        cancelLabel: proxy.$t('CM_Cancel'),
        ok: () => {
          if (option) {
            selectedProduct = { ...selectedProduct, selectedOption: option }
          }

          updateProductBagRequestList(selectedProduct)
        },
        cancel: () => {
          return
        }
      }
    )
  }
}

const updateProductBagRequestList = (selectedProduct) => {
  // 기존 배열에서 동일한 상품 찾기
  const existingProductIndex = productBagRequestList.value.findIndex(item =>
    item.productId === selectedProduct.productId &&
    (!item.optionYn || item?.selectedOption?.productId === selectedProduct?.selectedOption?.productId)
  )

  if (existingProductIndex !== -1) {
    // 이미 존재하는 상품이면 수량만 증가
    productBagRequestList.value[existingProductIndex].quantity += 1
  } else {
    // 새로운 상품이면 배열에 추가
    productBagRequestList.value.push({ ...selectedProduct, quantity: 1 })
  }

  // 세션 저장
  sessionDataManager.set('productBagRequestList', JSON.stringify(productBagRequestList.value))

  proxy.$alert(
    proxy.$t('EB_AddSuccess'), {
      ok: () => {
        proxy.$refs.optionSelectModal.hide()
      }
    }
  )
}

const toNextStep = () => {
  router.push('/mypage/easybag/add/3')
}

watch(data, (v) => {
  if (v) {
    initOptions(v)
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>

</style>

