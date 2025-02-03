<!--
정기구매 관리
create by rhkim06
정기구매 작업이 홀딩이 되어 작업이 중단되었습니다. 2024-10-11
-->
<template>
  <q-dialog
    ref="modal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    class="full-page-modal"
  >
    <layout-modal
      ref="layoutModal"
    >
      <template #body>
        <div class="title-top-area">
          <h4>정기구매 상품담기</h4>
          <button class="menu-close-btn" @click="hide">
            <i class="ico close" />
          </button>
        </div>
        <div class="explanation-text gray mt0 mb24">
          <div class="flex align-center mb16">
            <i class="ico riman-coin" />
            <b class="font-14 primary09-color ml8">66,000</b>
            <span class="font-14 primary09-color ml4">원을 담고 정기구매를 시작하세요!</span>
          </div>

          <div class="progress-bar type01">
            <div :style="{ width: pricePer + '%'}" class="fill"></div>
          </div>

          <span class="block text-right mt4 gray04-color font-12">최소 주문금액 66,000원</span>
        </div>

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
          <swiper-slide key="all" :class="{ active: nestedCategoryData?.length === selectedFilterArr.length }" @click="onSelectCategoryAll">
            전체
          </swiper-slide>
          <swiper-slide v-for="item in nestedCategoryData" :key="item" :class="{ active: selectedFilterArr.includes(item.categoryId) }" @click="onSelectCategory(item)">
            {{ item.categoryName }}
          </swiper-slide>
        </swiper>

        <div class="plr16 mt24">
          <div class="input-search type02">
            <RInput v-model="searchText" placeholder="원하시는 내용을 검색해 보세요." class="login-input login-input--id " @keyup.enter="onSearch"/>
            <RButton label="">
              <template #content>
                <i class="ico search-g" @click="onSearch"></i>
              </template>
            </RButton>
          </div>
        </div>

        <RSelectBox
          v-model="selectSortType"
          :options="sortOptions"
          :disable="false"
          class="select-box type01 popup-select-box mlauto mr4 mt8"
          popup-content-class="select-list type03"
        />

        <hr class="mlr16 gray02-hr" />

        <ul id="listWrap" ref="listWrap" class="modal-prd-list scroll type01">
          <template v-for="page in productData?.pages">
            <li
              v-for="product in page.data.list"
              :key="product.productId">
              <div class="prd-img-area">
                <img :src="generateThumbnailImage(product)" :alt="product.productName" @click="router.push(`/product/detail/${product.productId}`)">
              </div>

              <div class="prd-list-info-area category-none">
                <p class="prd-detail-text" @click="router.push(`/product/detail/${product.productId}`)">{{ product.productName }}</p>
                <div class="prd-price-area">
                  <span>{{ $moneyFormat(product.priceOriginal) }}</span>
                  <span>{{ $t('CM_Won') }}</span>
                </div>

                <ul class="prd-point-area">
                  <li class="sp">
                    <span>{{ $moneyFormat(product.spOriginal) }}</span><span>SP</span>
                  </li>
                  <li class="bp">
                    <span>{{ $moneyFormat(product.bpOriginal) }}</span><span>BP</span>
                  </li>
                  <li class="p">
                    <span>{{ $moneyFormat(product.point) }}</span><span>P</span>
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
                    :class="getOptionType(product) === 'image' ? 'img' : 'text'"
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
                      :model-value="generateOptionValue(product.productId).value"
                      :options="generateOptions(product.productId)"
                      @update:model-value="(v) => onUpdateSelectedOption(v, product, 'select')"
                    />
                  </div>
                  <div v-else class="h40" />
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
                  @click="() => onAddCart(product)"
                />

              </div>
            </li>
          </template>
        </ul>

        <div class="bottom-slide prd-list-bottom-slide">
          <div class="btn slide-btn text-center" @click="onToggleSlideVisible"><span class="slide-icon"></span></div>

          <q-slide-transition>
            <div v-show="slideVisible" class="botom-area">
              <div class="font-16 medium mb4 mt24">{{ $t('PR_SelectedPrd') }}</div>

              <ul class="modal-option-select-list mt0 scroll type01">
                <li v-for="item in selectedProducts" :key="item.productId">
                  <div class="option-title-area">
                    <span class="font-14">{{ item.productName }}</span>
                    <i class="ico close-g" @click="() => onDeleteSelected(item.productId)"></i>
                  </div>
                  <div class="option-price-area">
                    <RNumberSpin v-model="item.quantity" :min="1" :max="!!item.maxQuantityLimit ? item.maxQuantityLimit : 100" class="num-input type04"/>
                    <div class="option-price font-16">{{ $moneyFormat(item.priceOriginal) }}{{ $t('CM_Won') }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </q-slide-transition>

          <div class="">
            <!-- <div class="btn pc-slide-btn text-center block" @click="onToggleSlideVisible"><span class="slide-icon" @click="hide"></span></div> -->
            <div class="price-area flex align-center justify-between mb16">
              <div class="gray07-color bold font-14">{{ $t('PR_Total') }}</div>
              <div>
                <div class="result-prd-price mb4 text-right gray07-color font-14"><b>{{ $moneyFormat(priceTotal) }}</b><span>{{ $t('CM_Won') }}</span></div>
                <ul class="prd-point-area small mb0">
                  <li class="sp font-12">
                    <span>{{ spTotal }}</span><span>SP</span>
                  </li>
                  <li class="bp font-12">
                    <span>{{ bpTotal }}</span><span>BP</span>
                  </li>
                  <li class="p font-12">
                    <span>{{ pointTotal }}</span><span>P</span>
                  </li>
                </ul>
              </div>

            </div>

            <div class="popup-bottom-btn">
              <RButton class="btn full small type02" :label="props.type === 'add' ? '정기구매 결제하기' : '상품 변경하기'" @on-click="onBuy" />
            </div>
          </div>
        </div>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import productService from '@/http/services/product'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
import { addPrefixForImage, generateOptionObj, getOptionType, getOptionUi, getProductId } from '@/utils/common'
import { SALES_STATUS } from '@/utils/constant'
import { useRouter } from 'vue-router'
import autoshipService from '@/http/services/autoship'
import orderService from '@/http/services/order'
const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  products: {
    type: Object,
    default: null
  },
  subscriptionId: {
    type: String,
    default: ''
  }
})
const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]
const keyword = ref('')
const modal = ref()
const listWrap = ref()
const productData = ref()
const options = ref(null)
const selectedProducts = ref([])
const selectSortType = ref('NEWEST')
const slideVisible = ref(false)
const searchText = ref()
const { proxy } = getCurrentInstance()
const router = useRouter()
const emit = defineEmits(['ok'])
const existsProducts = ref()
const sortOptions = [
  { label: '추천 상품 순', value: 'NEWEST' },
  { label: '인기 상품 순', value: 'BEST_SELLING' },
  { label: '낮은 가격 순', value: 'PRICE_LOW_TO_HIGH' },
  { label: '높은 가격 순', value: 'PRICE_HIGH_TO_LOW' }
]
const { data: existsProductsData } = productService.getProductsByIds(existsProducts, 'get-subsExist-list', true)
const selectedFilterArr = ref([])
const selectedFilter = computed(() => {
  if (selectedFilterArr.value) {
    const _arr = selectedFilterArr.value
    return _arr.sort((a, b) => a - b).join(',')
  } else {
    return null
  }
})
const bpTotal = computed(() => selectedProducts.value.reduce((pre, cur) => pre + cur.bpOriginal * cur.quantity, 0))
const spTotal = computed(() => selectedProducts.value.reduce((pre, cur) => pre + cur.spOriginal * cur.quantity, 0))
const pointTotal = computed(() => selectedProducts.value.reduce((pre, cur) => pre + cur.point * cur.quantity, 0))
const priceTotal = computed(() => selectedProducts.value.reduce((pre, cur) => pre + cur.priceOriginal * cur.quantity, 0))
const pricePer = computed(() => {
  let per = ''
  if ((priceTotal.value / 66000) > 1) {
    per = '100'
  } else {
    per = ((priceTotal.value / 66000) * 100).toString()
  }
  return per
})

const {
  data,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage
} = productService.getProductListAll(keyword, selectedFilter, selectSortType, true)
const { data: nestedCategoryData } = productService.getNestedCategoryList()
const subscribeUpdatePrdList = autoshipService.postSubscribeUpdatePrdList()
const onToggleSlideVisible = () => {
  slideVisible.value = !slideVisible.value
}
const onSearch = () => {
  keyword.value = searchText.value
}
const onSelectCategory = (product) => {
  if (selectedFilterArr.value.includes(product.categoryId)) {
    selectedFilterArr.value = selectedFilterArr.value.filter(item => item !== product.categoryId)
  } else {
    selectedFilterArr.value.push(product.categoryId)
  }
}
const onSelectCategoryAll = () => {
  if (nestedCategoryData.value.length === selectedFilterArr.value.length) {
    selectedFilterArr.value = []
  } else {
    selectedFilterArr.value = nestedCategoryData.value.map(item => item.categoryId)
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
  let _data = productData.value.pages.map(page => page.data.list).reduce((pre, cur) => [...pre, ...cur], []).filter(item => item.productId === product.productId)[0]
  const option = {
    items: _data.option.items,
    productOptionType: _data.option.productOptionType,
    selectedOption: _selectedOption
  }
  _data = { ..._data }
  _data.option = option
}
const onAddCart = (product) => {
  let _product = product
  if (product.optionYn && product.option) {
    const optionProduct = options.value.filter(optionItem => optionItem.productId === product.productId)[0].selectedOption
    if (!optionProduct) {
      proxy.$alert('상품 옵션을 선택해주세요.')
      return
    } else {
      _product = optionProduct
    }
  }
  const existIndex = selectedProducts.value.findIndex(item => {
    return item.productId === _product.productId
  })
  if (existIndex > -1) {
    const existProduct = selectedProducts.value[existIndex]
    if (!!existProduct.maxQuantityLimit && (existProduct.quantity >= existProduct.maxQuantityLimit)) {
      proxy.$alert(`${selectedProducts.value[existIndex].productName}구매가능 수량을 초과했습니다. 최대 구매 가능 수량: ${existProduct.maxQuantityLimit}개`)
    } else {
      existProduct.quantity += 1
    }
  } else {
    const obj = Object.assign({ quantity: 1 }, _product)
    selectedProducts.value.push(obj)
  }
}
const onDeleteSelected = (productId) => {
  selectedProducts.value = selectedProducts.value.filter(item => item.productId !== productId)
}
const onBuy = async () => {
  if (priceTotal.value < 66000) {
    proxy.$alert('정기구매는 66,000원 이상 신청할 수 있습니다.')
    return
  }
  switch (props.type) {
    case 'add':
      doBuy()
      return
    case 'change':
      doChange()
      return
    default:
      return
  }
}
function fetchNext() {
  if (!listWrap.value) return
  const contentHeight = listWrap.value.clientHeight
  const scrollTop = listWrap.value.scrollTop
  const scrollHeight = listWrap.value.scrollHeight
  if ((scrollTop + contentHeight) >= scrollHeight) {
    if (!isFetchingNextPage.value && hasNextPage.value) {
      fetchNextPage()
    }
  }
}
function generateParam() {
  const products = selectedProducts.value.map(item => ({
    productId: item.productId,
    productOptionId: item.selectedProduct ? item.selectedProduct.productId : null,
    quantity: item.quantity
  }))
  return {
    productsRequest: products
  }
}
function generateThumbnailImage(product) {
  let imageUrl = product.thumbnailUrl
  if (product.optionYn && product.option && getOptionType(product) === 'image') {
    if (product.option.selectedOption) {
      imageUrl = product.option.selectedOption.optionImageUrl
    }
  }
  return addPrefixForImage(imageUrl)
}
async function doBuy() {
  const param = generateParam()
  const res = await autoshipService.postSubscribeSheet(param)
  if (res) {
    const data = res.data
    if (data.identification) {
      const products = {
        identification: data.identification,
        products: selectedProducts.value
      }
      emit('ok', products)
      modal.value.hide()
    } else {
      proxy.$alert('추가 안됨')
    }
  }
}
function doChange() {
  const payload = {
    subscriptionId: props.subscriptionId,
    productsRequest: selectedProducts.value.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  }
  subscribeUpdatePrdList.mutate(payload, {
    onSuccess: hide
  })
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
        opitonObj.selectedOption = items.filter(item => item.salesStatus.code !== SALES_STATUS.sold_out)[0]
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
function hide() {
  modal.value.hide()
}
async function checkExistSelected() {
  if (props.type === 'change') {
    existsProducts.value = props.products
  }
}
function show() {
  modal.value.show()
}
onMounted(() => {
  if (data.value) {
    initOptions(data.value)
  }
  checkExistSelected()
})

watch(data, (v) => {
  if (v) {
    initOptions(v)
  }
}, { immediate: true })
watch(listWrap, v => {
  if (v) {
    listWrap.value.addEventListener('scroll', fetchNext)
  }
})
watch(existsProductsData, v => {
  if (v) {
    selectedProducts.value = v.map(vItem => {
      const quantity = props.products.filter(item => item.productId === vItem.productId)[0].quantity
      return Object.assign({ quantity }, vItem)
    })
  }
})
defineExpose({
  show
})
</script>

  <style lang="scss" scoped>

  </style>
