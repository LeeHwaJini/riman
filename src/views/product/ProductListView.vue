<template>
  <div v-if="categoryDetailData?.categoryTitle.pcImageUrl && categoryDetailData?.categoryTitle.mobileImageUrl" class="prd-list-top-banner-area" :style="{'background-image': `url(${isMobile ? addPrefixForImage(categoryDetailData?.categoryTitle.mobileImageUrl) : addPrefixForImage(categoryDetailData?.categoryTitle.pcImageUrl)})`}">
    <h2>
      {{ categoryDetailData?.categoryTitle.title1 }}
    </h2>
    <p>{{ categoryDetailData?.categoryTitle.title2 }}</p>
  </div>
  <div class="prd-list-content max-width-1680">
    <div class="prd-depth-area">
      <span v-if="categoryDetailData?.categoryLevel !== 1">{{ parentCateName }}</span>
      <h2 class="category-title">{{ categoryDetailData?.categoryName }}</h2>
    </div>

    <div class="filter-btn-top-area">
      <RButton v-if="categoryDetailData?.categoryLevel <= 1" class="filter-btn-area" @click="onClickFilter(ListFilterDrawer)">
        <template #content>
          <span>{{ $t('CM_FilterSearch') }}</span>
          <i class="ico filter"></i>
        </template>
      </RButton>
      <div v-else></div>

      <RSelectBox
        :model-value="selectSortType"
        :options="sortOptions"
        :disable="false"
        class="select-box type01"
        popup-content-class="select-list type03"
        @update:model-value="onChangeSorting"
      />
    </div>

    <div v-if="1 === 1" class="prd-grid-filter-area">
      <div @click="onChangeGrid('list')"><i class="ico list" :class="gridFilterType === 'list' ? 'active' : ''" /></div>
      <div @click="onChangeGrid('grid')"><i class="ico grid" :class="gridFilterType === 'grid' ? 'active' : ''"/></div>
    </div>

    <!-- 상품 리스트 -->
    <ul v-if="productData" ref="listWrap" class="prd-list type01" :class="gridFilterType === 'list' ? 'list' : 'grid'">

      <li class="prd-first-banner-area">
        <img :src="topBannerImgSrc" alt="">

        <!-- tooltip -->
        <div
          :style="{top: '23%', left: '54%'}"
          class="tooltip-area type03"
        >
          <div
            class="img-mark-wrap"
            @click="clickToolTip"
            @mouseenter="e => mouseEnterToolTip(e,0)"
            @mouseleave="e => mouseLeaveToolTip(e,0)">
            <i class="ico img-mark"/>
          </div>

          <!-- top, bottom, left, right -->
          <div class="text-area" :class="gridFilterType === 'list' ? 'bottom' : 'left-bottom'" @mouseenter="e => mouseEnterToolTip(e,0)" @mouseleave="e => mouseLeaveToolTip(e,0)">
            <span class="category-text">인셀덤</span>
            <span class="detail-text">투페이스 오일 미스트</span>
            <b class="price-text">46,000원</b>
            <router-link to="/product/detail/661780743323651886" class="add-btn">
              {{ $t('CA_Buy') }}
              <i class="ico arrow-right-g" />
            </router-link>
          </div>
        </div>
        <!-- //tooltip -->

      </li>
      <template v-for="(page, index) in productData.pages">
        <li
          v-for="product in generateProductListWithPromoImage(page, index)"
          :key="product.productId">
          <div class="prd-img-area" @click="e => onClickProduct(product.productId)">
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

          <div class="prd-list-info-area">
            <span class="prd-category-text">{{ product.brand.text }}</span>
            <p class="prd-detail-text" @click="e => onClickProduct(product.productId)">{{ product.productName }}</p>
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
                  :item-class="{'img-option': getOptionType(product) === 'image'}"
                  :model-value="generateOptionValue(product.productId).value"
                  :options="generateOptions(product.productId)"
                  :is-opt-icon="getOptionType(product) === 'image'"
                  @update:model-value="(v) => onUpdateSelectedOption(v, product, 'select')"
                >
                  <template v-if="getOptionType(product) === 'image'" #prepend>
                    <div class="option-img-area">
                      <img :src="addPrefixForImage(generateOptionValue(product.productId).optionImageUrl)" :alt="generateOptionValue(product.productId).productName" class="img-cover" />
                    </div>
                  </template>
                </RSelectBox>
              </div>
            </template>
            <template v-else>
              <div class="h40 mb8"></div>
            </template>
            <RButton
              v-if="product.salesStatus.code === SALES_STATUS.sold_out"
              disabled
              :label="product.soldOutMessage && product.soldOutMessage !== '' ? product.soldOutMessage : proxy.$t('PR_Soldout')"
              class="btn type07 small full"
            />
            <RButton
              v-else
              :label="proxy.$t('NAV_Cart')"
              class="btn type07 small full"
              @click="() => onAddCart(product)"
            />
          </div>
        </li>
      </template>
    </ul>
    <div class="prd-last-banner-area" style="width: 100%;">
      <img :src="bottomBannerImgSrc" alt="">

      <!-- tooltip -->
      <div
        style="top: 45%; left: 60%;"
        class="tooltip-area type03"
      >
        <div
          class="img-mark-wrap"
          @click="clickToolTip"
          @mouseenter="e => mouseEnterToolTip(e,2)"
          @mouseleave="e => mouseLeaveToolTip(e,2)">
          <i class="ico img-mark"/>
        </div>

        <!-- top, bottom, left, right, right-top, right-bottom, left-top, left-bottom -->
        <div class="text-area left" @mouseenter="e => mouseEnterToolTip(e,2)" @mouseleave="e => mouseLeaveToolTip(e,2)">
          <span class="category-text">보타랩</span>
          <span class="detail-text">슈아멜 너리싱 바디크림</span>
          <b class="price-text">32,000원</b>
          <router-link to="/product/detail/661821807401110076" class="add-btn">
            {{ $t('CA_Buy') }}
            <i class="ico arrow-right-g"></i>
          </router-link>
        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, getCurrentInstance, computed, onMounted, reactive, onUnmounted, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import ListFilterDrawer from './drawer/ListFilterDrawer'
import productService from '@/http/services/product'
import { useRoute, useRouter } from 'vue-router'
import AddCartDrawer from '@components/drawer/AddCartDrawer'
import { addPrefixForImage, checkPlanner, generateOptionObj, getOptionType, getOptionUi, onClickDetail } from '@/utils/common'
import RSelectBox from '@/components/common/RSelectBox'
import { isLogin } from '@/utils/login'
import { SALES_STATUS } from '@/utils/constant'
import { useProductStore } from '@/store/productStore'
import { useMainStore } from '@/store/mainStore'

import pcTopBanner from '@assets/images/prd_banner01.png'
import moTopBanner from '@assets/images/mo_prd_banner01.png'
import pcBottomBanner from '@assets/images/prd_banner02.png'
import tbBottomBanner from '@assets/images/tb_prd_banner02.png'
import moBottomBanner from '@assets/images/mo_prd_banner02.png'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const listWrap = ref(null)
const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const selectedFilter = ref('')
const gridFilterType = ref('list')
const productStore = useProductStore()
const mainStore = useMainStore()
const isMobile = computed(() => proxy.$isMobile())
const isTablet = computed(() => proxy.$isTablet())
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const userId = computed(() => mainStore.getUser?.userSeqNo)
const productData = ref(null)
const shouldOpen = ref([true, true, true])
const pageSize = 8
const sortOptions = computed(() => {
  const options = [
    { label: proxy.$t('PR_SortUpdate'), value: 'NEWEST' },
    { label: proxy.$t('PR_SortLowPrice'), value: 'PRICE_LOW_TO_HIGH' },
    { label: proxy.$t('PR_SortHighPrice'), value: 'PRICE_HIGH_TO_LOW' }
  ]
  if (categoryDetailData.value?.sortTypeResponse?.value === 'MANUAL') {
    options.push({ label: proxy.$t('CM_Random'), value: 'MANUAL' })
  }
  return options
}
)

const options = ref(null)

const { data: categoryData } = productService.getCategoryList()
const categoryId = computed(() => {
  return categoryData.value && categoryData.value.filter(menu => {
    return menu.categoryUrl.match(/[^/]+$/) && menu.categoryUrl.match(/[^/]+$/)[0] === route.params.categoryName
  })[0].categoryId
})
const { data: categoryDetailData } = productService.getCategoryDetail(categoryId)
const selectSortType = ref(null)
const {
  data,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
} = productService.getProductList(categoryId, selectedFilter, selectSortType, undefined, userId)
const storedProductList = computed(() => {
  // const promoImages = pageState.categoryDetailData.promoImages
  const promoImages = ['item']
  return [[]].concat(
    productData.value.pages.map((item) =>
      promoImages?.length > 0
        ? item.data.list.slice(
          pageSize - promoImages?.length,
          pageSize
        ) : []
    )
  )
})
const pageState = reactive({
  categoryDetailData
})
const parentCateName = computed(() => {
  let name = ''
  if (categoryDetailData.value) {
    if (categoryDetailData.value.categoryLevel === 1) {
      name = categoryDetailData.value.categoryName
    } else {
      if (categoryData.value) {
        const currentCate = categoryData.value && categoryData.value.filter(menu => {
          return menu.categoryUrl.match(/[^/]+$/) && menu.categoryUrl.match(/[^/]+$/)[0] === route.params.categoryName
        })[0]
        name = categoryData.value.filter(item => item.categoryId === currentCate.parentId)[0].categoryName
      }
    }
  }
  return name
})
// actions
const onChangeGrid = (type) => {
  productStore.updateGrid(type)
  gridFilterType.value = type
}
const onClickFilter = () => {
  proxy.openModal({
    parent: proxy,
    component: ListFilterDrawer,
    componentProps: {
      categoryId: categoryId.value,
      selectedFilter
    }
  }).onOk((v) => applyFilter(v))
}
const onClickProduct = (productId) => {
  const anchor = window.scrollY
  productStore.updateAnchor(anchor)
  onClickDetail(productId, 'get-product-list')
}
const onAddCart = (data) => {
  proxy.openModal({
    parent: proxy,
    component: AddCartDrawer,
    componentProps: {
      data
    }
  })
}

const onChangeSorting = v => {
  selectSortType.value = v
  productStore.updateSorting({
    categoryId: categoryId.value,
    sortType: v
  })
}
function applyFilter(v) {
  if (!v) return
  const _arr = Array.from(v)
  _arr.sort((a, b) => a - b)
  selectedFilter.value = _arr.join(',')
  productStore.updateFilter({
    categoryId: categoryId.value,
    filter: v
  })
}
function generateOptionValue(productId) {
  return options.value.filter(item => item.productId === productId)[0].selectedOption
}
function generateOptions(productId) {
  return options.value.filter(item => item.productId === productId)[0].items
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
  let _data = productData.value.pages.map(page => page.data.list).reduce((pre, cur) => [...pre, ...cur], []).filter(item => item.productId === product.productId)[0]
  const option = {
    items: _data.option.items,
    productOptionType: _data.option.productOptionType,
    selectedOption: _selectedOption
  }
  _data = { ..._data }
  _data.option = option
  onAddCart(_data)
}
const generateProductListWithPromoImage = (page, index) => {
  let list = page.data.list
  if (page.data.totalPageNumber !== index + 1) {
    const promoLength = pageState.categoryDetailData?.promoImages?.length ?? 1
    list = list.slice(0, list.length - promoLength)
  }
  return storedProductList.value[index].concat(list)
}
// utils
function generateProductInfo(product, type) {
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

function fetchNext() {
  if (!listWrap.value) return
  const productListBottom = listWrap.value.getBoundingClientRect().bottom
  const windowHeight = window.innerHeight
  if (productListBottom <= windowHeight) {
    if (!isFetchingNextPage.value & hasNextPage.value) {
      fetchNextPage()
    }
  }
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
function initOptions(data) {
  const productList = data.pages.map(item => item.data.list).reduce((pre, cur) => [...pre, ...cur], [])
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
function checkPageState() {
  applyFilter(productStore.filter[categoryId.value])
  if (productStore.sorting[categoryId.value]) {
    selectSortType.value = productStore.sorting[categoryId.value]
  }
  gridFilterType.value = productStore.grid
  checkAnchor()
}
function clickToolTip(e) {
  if (!isMobile.value) return
  const popup = e.target.closest('.tooltip-area')
  if (popup.classList.contains('active')) {
    popup.classList.remove('active')
  } else {
    popup.classList.add('active')
  }
}
function mouseEnterToolTip(e, index) {
  const popup = e.target.closest('.tooltip-area')
  popup.classList.add('active')
  setTimeout(() => {
    if (shouldOpen.value[index]) {
      popup.classList.add('active')
    }
  }, 0)
}
function mouseLeaveToolTip(e, index) {
  shouldOpen.value[index] = false
  const popup = e.target.closest('.tooltip-area')
  popup.classList.remove('active')
  setTimeout(() => {
    shouldOpen.value[index] = true
  }, 100)
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

const topBannerImgSrc = ref(pcTopBanner)
const bottomBannerImgSrc = ref(pcBottomBanner)

// lifecycle
onMounted(() => {
  document.addEventListener('scroll', fetchNext)
  if (data.value) {
    initOptions(data.value)
  }
  if (categoryDetailData.value) {
    selectSortType.value = categoryDetailData.value.sortTypeResponse.value
  }
  if (window.history.state.forward) {
    checkPageState()
  }
  if (isTablet.value) {
    bottomBannerImgSrc.value = tbBottomBanner
  }
  if (isMobile.value) {
    topBannerImgSrc.value = moTopBanner
    bottomBannerImgSrc.value = moBottomBanner
  }
})

onUnmounted(() => {
  document.removeEventListener('scroll', fetchNext)
})

watch(data, (data) => {
  if (data) {
    initOptions(data)
  }
})
watch(categoryDetailData, (data) => {
  if (data) {
    selectSortType.value = data.sortTypeResponse.value
  }
})
</script>

<style lang="scss" scoped>

</style>
