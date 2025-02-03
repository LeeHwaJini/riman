<template>
  <div class="search-result-sub-title-area">
    <div class="text-area">
      <h3>{{ $t('CM_Product') }}</h3>
      <span v-if="productListData && productListData?.pages[0].data.totalSize > 0">{{ productListData?.pages[0].data.totalSize }}</span>
    </div>
  </div>
  <ul v-if="productData && productData.length > 0" ref="listWrap" class="prd-list type02">
    <li v-for="product in productData" :key="product.productId">
      <div class="prd-img-area">
        <div class="prd-img-area" @click="onClickProduct(product.productId)">
          <img :src="addPrefixForImage(product.thumbnailUrl)" :alt="product.productName">
          <!-- sold 아웃일 경우 -->
          <div v-if="product.salesStatus.code === SALES_STATUS.sold_out" class="sold-out-area">
            <div class="sold-out-bg">
              <span class="pre-line">{{ $t('CA_SoldOut') }}</span>
            </div>
          </div>
          <!-- hover했을 경우 -->
          <div v-if="product.salesStatus.code !== SALES_STATUS.sold_out" class="hover-img-area">
            <img :src="addPrefixForImage(product.hoverUrl)" :alt="product.productName">
          </div>
          <div v-if="product.salesStatus.code !== SALES_STATUS.sold_out" class="prd-icon-area">
            <span v-if="product.salesStatus.code === SALES_STATUS.almost_sold_out" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
            <span v-if="product.applyCouponYn" class="prd-icon coupon">{{ $t('PR_ApplyCoupon') }}</span>
          </div>
        </div>
      </div>
      <div class="prd-list-info-area">
        <p class="prd-detail-text" @click="onClickProduct(product.productId)">{{ product.productName }}</p>
        <div class="prd-price-area">
          <span>{{ generateProductInfo(product, 'price') }}</span>
          <span>{{ $t('CM_Won') }}</span>
        </div>
        <ul class="prd-point-area">
          <template v-if="isLogined && isPlanner">
            <li class="sp">
              <span>{{ generateProductInfo(product, 'sp') }}</span><span>SP</span>
            </li>
            <li class="bp">
              <span>{{ generateProductInfo(product, 'bp') }}</span><span>BP</span>
            </li>
          </template>
          <li class="p">
            <span>{{ generateProductInfo(product, 'point') }}</span><span>P</span>
          </li>
        </ul>
        <template v-if="product.optionYn && product.option && options">
          <swiper
            v-if="getOptionUi(product) === 'button'"
            :slides-per-view="'auto'"

            :free-mode="true"
            :pagination="{
              type: 'progressbar',
              clickable: true,
            }"
            :navigation="true"
            :modules="modules"
            class="prd-option-area type01"
            :class="getOptionType(product) === 'text' ? 'text' : 'img'"
          >
            <swiper-slide v-for="optionItem in generateOptions(product.productId)" :key="optionItem.productId" :class="generateOptionClass(optionItem, product.productId)" @click="() => onUpdateSelectedOption(optionItem, product)">
              <template v-if="getOptionType(product) === 'image'">
                <img :src="addPrefixForImage(optionItem.optionImageUrl)" alt="">
              </template>
              <template v-else>
                {{ optionItem.label }}
              </template>
            </swiper-slide>
          </swiper>
          <div v-if="getOptionUi(product) === 'select'" class="prd-option-select-area">
            <RSelectBox
              popup-content-class="select-list type04"
              :model-value="generateOptionValue(product.productId).value"
              :options="generateOptions(product.productId)"
              :disable="product.salesStatus.code === SALES_STATUS.sold_out"
              @update:model-value="(v) => onUpdateSelectedOption(v, product, 'select')"
            />
          </div>
        </template>
        <template v-else>
          <div class="h40 mb8"></div>
        </template>
        <RButton
          v-if="product.salesStatus.code === SALES_STATUS.sold_out"
          disabled
          :label="product.salesStatus.text && product.salesStatus.text !== '' ? product.salesStatus.text : proxy.$t('PR_Soldout')"
          class="btn type07 small full"
        />
        <RButton
          v-else
          :label="proxy.$t('NAV_Cart')"
          class="btn type07 small full"
          @click="onAddCart(product)"
        />
      </div>
    </li>
  </ul>
  <!-- 결과 없을경우 -->
  <div v-else class="cart-none-area faq-none-area">
    <img src="@assets/images/search_none.svg" alt="">
    <p class="title">{{ $t('SRH_NonResult') }}</p>
    <ul class="result-none-text-area max-w186">
      <li>{{ $t('SCH_CheckWrongInput') }}</li>
      <li>{{ $t('SCH_SearchOther') }}</li>
    </ul>
  </div>
  <!-- //결과 없을경우 -->
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import productService from '@/http/services/product'
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
import searchService from '@/http/services/search'
import { useRouter } from 'vue-router'
import { addPrefixForImage, checkPlanner, generateOptionObj, getOptionType, getOptionUi, onClickDetail } from '@/utils/common'
import { SALES_STATUS } from '@/utils/constant'
import AddCartDrawer from '@/components/drawer/AddCartDrawer.vue'
import { isLogin } from '@/utils/login'
import { useMainStore } from '@/store/mainStore'
import { queryClient } from '@/http/queryClient'
import orderService from '@/http/services/order'
import { useProductStore } from '@/store/productStore'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
})
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const productData = ref([])
const options = ref()
const listWrap = ref()
const { proxy } = getCurrentInstance()
const router = useRouter()
const mainStore = useMainStore()
const userId = mainStore.getUser.userSeqNo
const productStore = useProductStore()
const isMobile = computed(() => proxy.$isMobile())
const { data: productListData,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
} = searchService.getProductSearch(props.keyword, userId, 10)
const param = ref()
const { data, isFetching } = productService.getUpperProductsByIds(param, 'get-product-search', userId)
const onAddCart = (data) => {
  proxy.openModal({
    parent: proxy,
    component: AddCartDrawer,
    componentProps: {
      data
    }
  })
}
const onClickProduct = (productId) => {
  const anchor = window.scrollY
  productStore.updateAnchor(anchor)
  onClickDetail(productId, 'get-product-search')
}
function initOptions(data) {
  const productList = data
  productData.value = data
  const newOption = []
  productList.forEach(product => {
    if (product.optionYn && product.option) {
      const items = product.option.items.map(item => {
        return generateOptionObj(item, product.priceOriginal)
      })
      const opitonObj = {
        productId: product.productId,
        items
      }
      if (getOptionUi(product) === 'select') {
        if (items.every(item => item.salesStatus.code === SALES_STATUS.sold_out)) {
          opitonObj.selectedOption = items[0]
        } else {
          opitonObj.selectedOption = items.filter(item => item.salesStatus.code !== SALES_STATUS.sold_out)[0]
        }
      }
      newOption.push(opitonObj)
    }
  })
  options.value = newOption
}
function generateOptionValue(productId) {
  return options.value.filter(item => item.productId === productId)[0].selectedOption
}
function generateOptions(productId) {
  return options.value.filter(item => item.productId === productId)[0].items
}
function generateOptionClass(optionItem, productId) {
  let className = ''
  const selected = options.value.filter(item => {
    return item.productId === productId
  })[0]
  if (selected.selectedOption) {
    const selectedOption = selected.selectedOption
    if (selectedOption.productId === optionItem.productId) {
      className = 'active'
    }
  }
  if (optionItem.salesStatus.code === SALES_STATUS.sold_out) {
    className = 'disabled'
  }
  return className
}
function fetchNext() {
  if (!listWrap.value) return
  const productListBottom = listWrap.value.getBoundingClientRect().bottom
  const windowHeight = window.innerHeight
  if (productListBottom <= windowHeight) {
    if (!isFetchingNextPage.value && hasNextPage.value && !isFetching.value) {
      fetchNextPage()
    }
  }
}
function checkAnchor() {
  let timeout = 0
  if (isMobile.value) {
    timeout = 200
    window.scrollTo({
      top: 0
    })
  }
  const anchor = productStore.anchor

  if (anchor && anchor !== '') {
    setTimeout(() => {
      window.scrollTo({
        top: anchor
      })
    }, timeout)
  }
}
function generateProductInfo(product, type) {
  if (!product) return
  const infoMap = new Map()
  let _product = product
  if (product.optionYn && product.option && product.option.items.length > 0) {
    const selectedOption = options.value.filter(item => {
      return item.productId === product.productId
    })[0].selectedOption
    if (selectedOption) { _product = selectedOption }
  }

  infoMap.set('price', proxy.$moneyFormat(_product.priceOriginal))
  infoMap.set('sp', proxy.$moneyFormat(_product.spOriginal))
  infoMap.set('bp', proxy.$moneyFormat(_product.bpOriginal))
  infoMap.set('point', proxy.$moneyFormat(_product.point))

  switch (type) {
    case 'price':
      return infoMap.get('price')
    case 'sp':
      return infoMap.get('sp')
    case 'bp':
      return infoMap.get('bp')
    case 'point':
      return infoMap.get('point')
    default:
      break
  }
}
const onUpdateSelectedOption = (selectedOption, product, optionType) => {
  let _selectedOption = selectedOption
  if (optionType === 'select') {
    _selectedOption = options.value.filter(item => item.productId === product.productId)[0].items.filter(item => item.value === selectedOption)[0]
  }
  if (_selectedOption.salesStatus.code === SALES_STATUS.sold_out) return
  const newOptions = options.value.map(item => {
    if (item.productId === product.productId) {
      item.selectedOption = _selectedOption
    }
    return item
  })
  options.value = newOptions
  let _data = productData.value.filter(item => item.productId === product.productId)[0]
  const option = {
    items: _data.option.items,
    productOptionType: _data.option.productOptionType,
    selectedOption: _selectedOption
  }
  _data = { ..._data }
  _data.option = option
  onAddCart(_data)
}
function generateThumbnailImage(product) {
  let imageUrl = product.thumbnailUrl
  if (product.optionYn && product.option && getOptionType(product) === 'image') {
    const option = options.value.filter(item => {
      return item.productId === product.productId
    })[0]
    if (option.selectedOption) {
      imageUrl = option.selectedOption.optionImageUrl
    }
  }
  return addPrefixForImage(imageUrl)
}
function generateParam(data) {
  return data.pages.reduce((pre, cur) => {
    return [...pre, ...cur.data.list]
  }, [])
}
onMounted(() => {
  document.addEventListener('scroll', fetchNext)
  if (productListData.value) {
    param.value = generateParam(productListData.value)
  }
  checkAnchor()
})

watch(data, (v) => {
  if (v) {
    productData.value = v
    initOptions(productData.value)
  }
}, { immediate: true })
onUnmounted(() => {
  document.removeEventListener('scroll', fetchNext)
})
watch(productListData, v => {
  if (v) {
    param.value = generateParam(v)
  }
}, { immediate: true })

</script>
