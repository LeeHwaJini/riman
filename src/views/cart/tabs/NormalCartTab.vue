<template>
  <ul class="cart-explanation-area">
    <template v-if="isLogined">
      <li>{{ $t('CA_Info_txt1') }}</li>
      <li>{{ $t('CA_Info_txt2') }}</li>
      <li>{{ $t('CA_Info_txt3') }}</li>
    </template>
    <template v-else>
      <li>{{ $t('CA_Info_txt4') }}</li>
      <li>{{ $t('CA_Info_txt5') }}</li>
    </template>
  </ul>
  <template v-if="!cartData || cartData.length <= 0">

    <div class="cart-none-area mb24">
      <img src="@assets/images/cart_none.svg" alt="">
      <p class="title">{{ $t('CA_Empty_txt1') }}</p>
      <p v-if="isLogined" class="text pre-line">{{ $t('CA_Empty_user_txt') }}</p>
      <p v-else class="text pre-line">{{ $t('CA_Empty_non_user_txt') }}</p>

      <RButton
        v-if="!isLogined"
        :label="proxy.$t('SIG_DoLogin')"
        class="btn medium type03"
        @click="router.push('/login')"
      />
    </div>
    <template v-if="emptyCartData">

      <RecommProducts :recomm-data="emptyCartData"/>
    </template>
  </template>

  <template v-else>

    <CartList :selected-carts="selectedCarts" :cart-data="cartData" @on-delete="onDeleteCart" @update-selected-carts="uppdateSelectedCarts" @change-quantity="onChangeQuantity" @change-option="onChangeOption">
      <RButton v-if="isAutoship" class="btn type12" label="" @on-click="onOpenModal">
        <template #content>
          <i class="ico riman-coin-m"></i>
          <span>{{ $t('CA_ChangToSubs') }}</span>
        </template>
      </RButton>
    </CartList>

    <div class="cart-result-price-area">
      <div class="result-price-area">
        <div class="field">
          <span>{{ $t('OP_PaymentAmount') }}</span>
          <div class="price-text-area">
            <span>{{ $moneyFormat(total) }}</span>
            <span>{{ $t('CM_Won') }}</span>
          </div>
        </div>

        <div v-if="isLogined && isPlanner" class="field align-start">
          <span class="gray07-color">총 적립  SP | BP</span>
          <div class="sp-bp-price-area">
            <div class="price-area text-right">
              <span>{{ $moneyFormat(totalSp) }}</span>
              <span> SP</span>
            </div>

            <div class="price-area text-right mt2">
              <span>{{ $moneyFormat(totalBp) }}</span>
              <span> BP</span>
            </div>
          </div>
        </div>

        <div v-if="isLogined" class="field">
          <span>{{ $t('OP_Point') }}</span>
          <div class="price-text-area">
            <span>{{ $moneyFormat(totalPoint) }}</span>
            <span>P</span>
          </div>
        </div>
      </div>
      <div class="cart-buy-text-area">
        <span>{{ $t('CA_FreeShip', {money: '50,000'}) }}</span>
        <span v-if="isLogined">{{ $t('CA_PayInfo') }}</span>
      </div>

    </div>
    <div class="bottom-btn">
      <RButton class="btn full small type11" label="" @on-click="onClickBuy">
        <template #content>
          <span class="btn-price-text">{{ $moneyFormat(total) }}{{ $t('CM_Won') }}</span>
          <span>{{ $t('CA_Buy') }}</span>
        </template>
      </RButton>
    </div>

    <responsive-modal
      ref="autoShipChange"
      :title="proxy.$t('CA_ChangToSubs')"
      class="regular-buy-modal bottom-btn-modal"
    >
      <template #description>
        <div class="select-prd-text-area">
          <span>{{ $t('CA_SelectedPrd') }}</span>
          <span>({{ changableCarts.length }})</span>
        </div>

        <div class="regular-buy-content popup-scroll large scroll type01">
          <ul class="grid-list type02">
            <li v-for="selected in changableCarts" :key="selected.cartId">
              <div class="prd-img-area">
                <img :src="addPrefixForImage(selected.thumbnailUrl)" alt="">

                <!-- soldOut일 경우-->
                <div v-if="selected.salesStatus.code === 'SOLD_OUT'" class="sold-out-area small">
                  <div class="sold-out-bg">
                    <span class="pre-line">{{ $t('CA_SoldOut') }}</span>
                  </div>
                </div>
                <!-- //soldOut일 경우-->
              </div>
              <div class="prd-option-text-area">
                <div>{{ selected.productNameInfo.fullName }}</div>
                <div v-if="selected.productOptionId">{{ selected.optionValues[0].optionValue }}</div>
              </div>
            </li>
          </ul>
        </div>

        <RCheckbox v-model="alsoAddNormalCart" class="checkbox-area type02">
          <span class="gray07-color">{{ $t('CA_AddNoralCartAlso') }}</span>
        </RCheckbox>

        <div class="popup-bottom-area">
          <div class="popup-bottom-btn">
            <RButton class="btn full small type03" label="취소" @on-click="onCancelChange" />
            <RButton class="btn full small type02" label="확인" @on-click="onCommitChange" />
          </div>
        </div>

      </template>
    </responsive-modal>
  </template>
  <PurchasedProducts v-if="purchasedCarttData && purchasedCarttData.length > 0" :data="purchasedCarttData"/>
  <SuggestProducts v-if="suggestCartData && suggestCartData.length > 0" :data="suggestCartData"/>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import CartList from '../CartList'
import RecommProducts from '../products/RecommProducts'
import { isLogin } from '@/utils/login'
import { CART_NO_AUTH, localDataManager, ORDER_DATA, ORDER_PREPATH, sessionDataManager } from '@/utils/dataManager'
import { useRoute, useRouter } from 'vue-router'
import cartService from '@/http/services/cart'
import { queryClient } from '@/http/queryClient'
import { useCartStore } from '@/store/cartStore'
import { storeToRefs } from 'pinia'
import { addPrefixForImage, checkPlanner, getProductId } from '@/utils/common'
import productService from '@/http/services/product'
import { useMainStore } from '@/store/mainStore'
import orderService from '@/http/services/order'
import memberService from '@/http/services/member'
import PurchasedProducts from '../products/PurchasedProducts.vue'
import SuggestProducts from '../products/SuggestProducts.vue'
const { proxy } = getCurrentInstance()
const changableCarts = ref([])
const alsoAddNormalCart = ref(false)
const isAutoship = import.meta.env.VITE_APP_IS_AUTOSHIP === 'true'
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const mainStore = useMainStore()
const userId = mainStore.getUser.userSeqNo
const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()
const shouldCheckSelectedCart = ref(false)
const { refreshParams, shouldUpdateNormalCart, shouldUpdateRefreshCart } = storeToRefs(cartStore)

const total = computed(() => {
  return selectedCarts.value.reduce((pre, cur) => {
    pre = pre + cur.salesAmount * cur.quantity
    return pre
  }, 0)
})
const totalPoint = computed(() => {
  return selectedCarts.value.reduce((pre, cur) => {
    pre = pre + cur.earnPoints * cur.quantity
    return pre
  }, 0)
})
const totalSp = computed(() => {
  return selectedCarts.value.reduce((pre, cur) => {
    pre = pre + cur.sp * cur.quantity
    return pre
  }, 0)
})
const totalBp = computed(() => {
  return selectedCarts.value.reduce((pre, cur) => {
    pre = pre + cur.bp * cur.quantity
    return pre
  }, 0)
})
const noProgressBar = ref(false)
const cartData = ref(null)
const { data: userCartData, refetch } = cartService.getNormalCart(isLogined, noProgressBar)
const { data: nonUserCartData } = cartService.getCartRefresh(isLogined, refreshParams)
const { data: emptyCartIdsData } = cartService.getCartEmptyCartIds(cartData)
const { data: emptyCartData } = productService.getProductsByIds(emptyCartIdsData, 'get-empty-cart-products')
const { data: purchasedCarttData } = cartService.getPurchasedCart(isLogined)
const { data: suggestCartData } = cartService.getSuggestCart(isLogined)

const patchNormalCart = cartService.patchNormalCart()
const patchNormalCartOption = cartService.patchNormalCartOption()
const deleteNormalCart = cartService.deleteNormalCart()
const postSubscriptionCart = cartService.postSubscriptionCart()
const onCancelChange = () => {
  proxy.$refs.autoShipChange.hide()
}
const selectedCarts = computed(() => {
  return cartData.value && cartData.value.filter(item => item.checked === true)
})
const onCommitChange = async () => {
  const params = changableCarts.value.map(item => ({
    productId: item.productId,
    productOptionId: item.productOptionId,
    quantity: item.quantity
  }))
  postSubscriptionCart.mutate(params, {
    onSuccess: () => {
      if (!alsoAddNormalCart.value) {
        deleteNormalCart.mutate(changableCarts.value.map(item => item.cartId))
        selectedCarts.value = []
      }
    }
  })
  queryClient.invalidateQueries({
    queryKey: ['get-subscription-cart']
  })
  proxy.$refs.autoShipChange.hide()
}
const onClickBuy = async () => {
  if (selectedCarts.value.length <= 0) {
    proxy.$alert(proxy.$t('CA_SelectPrd'))
    return
  }
  const res = await checkProductStatus()
  if (!res) {
    let queryKey = 'get-normal-cart'
    if (!isLogined.value) {
      queryKey = 'get-refresh-cart'
    }
    queryClient.invalidateQueries({
      queryKey: [queryKey]
    })
    return
  }
  const buyList = selectedCarts.value.map(item => {
    if (!item.allOptionsValues || item.allOptionsValues.length <= 0) {
      return {
        productId: item.productId,
        quantity: item.quantity
      }
    } else {
      return {
        productId: item.productId,
        quantity: item.quantity,
        productOptionId: item.productOptionId
      }
    }
  })
  const isLimitProduct = checkIsLimitProduct(selectedCarts.value)
  doBuy(buyList, isLimitProduct)
}

const onDeleteCart = async (item) => {
  let params = []
  if (item) {
    params = [item]
  } else {
    params = selectedCarts.value
  }
  if (params.length <= 0) return

  if (!isLogined.value) {
    deleteLocalCart(params)
  } else {
    deleteNormalCart.mutate(params.map(item => item.cartId))
  }
}

const onOpenModal = async () => {
  if (!isLogined.value) {
    proxy.$confirm(proxy.$t('PR_SubsNeedLogin'), {
      title: '',
      ok: () => {
        router.push('/login')
      },
      cancelLabel: proxy.$t('CM_Close'),
      okLabel: proxy.$t('NAV_Login')
    })
    return
  }
  const res = await generateChangableCarts()
  changableCarts.value = res
  if (res.length > 0) {
    if (res.length !== selectedCarts.value.length) {
      proxy.$alert(proxy.$t('CA_AddNormalCart_txt1'), {
        title: proxy.$t('CA_AddNormalCart_txt2'),
        ok: () => proxy.$refs.autoShipChange.show()
      })
    } else {
      proxy.$refs.autoShipChange.show()
    }
  } else {
    proxy.$alert(proxy.$t('CA_AddNormalCart_txt3'), {
      title: ''
    })
  }
}
const onChangeQuantity = async ({ v, item }) => {
  if (isLogined.value) {
    const params = {
      quantity: v
    }

    patchNormalCart.mutate({ params, cartId: item.cartId }, {
      onSuccess: () => {
        updateSelectedCartQuantity(item.cartId, v)
        noProgressBar.value = true
        refetch()
      },
      onSettled: () => {
        noProgressBar.value = false
      }
    })
  } else {
    updateLocalCartQuantity(v, item)
  }
}
function checkIsLimitProduct(buyList) {
  return buyList.some(item => {
    if (item.maxQuantityLimit && item.maxQuantityLimit > 0) {
      return true
    } else {
      return false
    }
  })
}
function updateNonUserCart() {
  const localCart = JSON.parse(localDataManager.get(CART_NO_AUTH))
  let param = []
  if (localCart) {
    param = JSON.parse(localDataManager.get(CART_NO_AUTH)).map(item => {
      return {
        productId: item.productId,
        productOptionId: item.productOptionId ?? null,
        quantity: item.quantity
      }
    })
  }
  cartStore.updateRefreshParams(param)
}
function updateSelectedCartQuantity(cartId, quantity) {
  const indexInSelectedCart = selectedCarts.value.findIndex(i => i.cartId === cartId)
  if (indexInSelectedCart > -1) {
    selectedCarts.value[indexInSelectedCart].quantity = quantity
  }
}
function updateLocalCartQuantity(value, productData) {
  const _cartLocal = JSON.parse(localDataManager.get(CART_NO_AUTH))
  updateSelectedCartQuantity(productData.cartId, value)
  const indexInLocalCart = _cartLocal.findIndex(item => {
    return item.cartId === getProductId(productData)
  })
  _cartLocal[indexInLocalCart].quantity = value
  cartData.value[indexInLocalCart].quantity = value
  localDataManager.set(CART_NO_AUTH, JSON.stringify(_cartLocal))
  cartService.getLocalBadge()
}
function checkProductStatus() {
  let productInfo = null
  productInfo = selectedCarts.value.map(item => {
    return {
      productId: item.productId,
      productOptionId: item.productOptionId ?? null
    }
  })
  const params = {
    productInfo
  }
  return orderService.getProductStatus(params)
}
async function onChangeOption({ newOptionId, item }) {
  if (isLogined.value) {
    const existCartProductIdList = userCartData.value.map(item => getProductId(item))
    const checkExitsInCart = existCartProductIdList.findIndex(i => i === newOptionId)
    if (checkExitsInCart > -1) {
      const existProduct = item.allOptionsValues.filter(i => i.optionId === newOptionId)[0]
      proxy.$confirm(proxy.$t('CA_CartExist', { name: item.productNameInfo.fullName, option: existProduct.optionValue }), {
        title: '',
        ok: () => {
          doMutateCart(newOptionId, item)
        },
        cancel: () => {
          return
        }
      })
    } else {
      doMutateCart(newOptionId, item)
    }
  } else {
    updateLocalCartOption(newOptionId, item)
  }
}
function checkMaxQuantity(buyList) {
  const param = {
    userId: userId,
    productInfo: buyList.map(item => ({
      productId: item.productOptionId ? item.productOptionId : item.productId,
      productQuantity: item.quantity
    }))
  }
  return cartService.postCheckMaxQuantity(param)
}
function updateSelectedList(newData) {
  let _newData = newData
  _newData = _newData.map(item => ({
    ...item,
    checked: true
  }))
  if (!isLogined.value) {
    _newData = _newData.map(item => ({
      ...item,
      cartId: getProductId(item)
    }))
  }

  if (shouldCheckSelectedCart.value) {
    cartData.value = _newData
    shouldCheckSelectedCart.value = false
    return
  }

  if (selectedCarts.value && selectedCarts.value.length > 0) {
    let selectedCartIds = []
    if (isLogined.value) {
      selectedCartIds = selectedCarts.value.map(item => item.cartId)
    } else {
      selectedCartIds = selectedCarts.value.map(item => getProductId(item))
    }
    _newData = _newData.map(item => {
      if (selectedCartIds.includes(item.cartId)) {
        item.checked = true
      } else {
        item.checked = false
      }
      return item
    })
  }
  cartData.value = _newData
}
async function deleteLocalCart(productList) {
  const _productList = productList.map(item => getProductId(item))
  const localCart = JSON.parse(localDataManager.get(CART_NO_AUTH))
  const newLocalCart = localCart.filter(item => {
    return !_productList.includes(item.cartId)
  })
  localDataManager.set(CART_NO_AUTH, JSON.stringify(newLocalCart))
  updateNonUserCart()
  cartService.getLocalBadge()
}
function doMutateCart(newOptionId, item) {
  const params = {
    productOptionId: newOptionId
  }
  patchNormalCartOption.mutate({ params, cartId: item.cartId })
}
function updateLocalCartOption(newOptionId, item) {
  const cartLocal = JSON.parse(localDataManager.get(CART_NO_AUTH))

  // 변경하는 origin 옵션상품 index
  const oldValueIndex = cartLocal.findIndex(localItem => localItem.cartId === item.productOptionId)
  const oldQuantity = cartLocal[oldValueIndex].quantity
  if (oldValueIndex > -1) {
    cartLocal.splice(oldValueIndex, 1)
  }
  // 변경될 target 옵션상품 index
  const currentValueIndex = cartLocal.findIndex(curItem => curItem.cartId === newOptionId)
  if (currentValueIndex > -1) {
    const existProduct = item.allOptionsValues.filter(i => i.optionId === newOptionId)[0]
    proxy.$confirm(proxy.$t('CA_CartExist', { name: item.productNameInfo.fullName, option: existProduct.optionValue }), {
      title: '',
      ok: () => {
        cartLocal[currentValueIndex].productOptionId = newOptionId
        const currenQuantity = cartLocal[currentValueIndex].quantity
        if (currenQuantity + oldQuantity > 100) {
          proxy.$alert(proxy.$t('CA_MaxQuantityLimitHundred'))
          return
        } else {
          cartLocal[currentValueIndex].quantity = currenQuantity + oldQuantity
          localDataManager.set(CART_NO_AUTH, JSON.stringify(cartLocal))
          updateNonUserCart()
        }
      },
      cancel: () => {
        return
      }
    })
  } else {
    const params = {
      cartId: newOptionId,
      productId: item.productId,
      productOptionId: newOptionId,
      quantity: item.quantity
    }
    cartLocal.push(params)
    localDataManager.set(CART_NO_AUTH, JSON.stringify(cartLocal))
    updateNonUserCart()
  }
}
function uppdateSelectedCarts(checked) {
  cartData.value = cartData.value.map(item => {
    if (checked) {
      item.checked = true
    } else {
      item.checked = false
    }
    return item
  })
}

async function generateChangableCarts() {
  const items = userCartData.value.filter(item => selectedCarts.value.map(item => item.cartId).includes(item.cartId))
  return items.filter(item => item.isSubscriptionAvailable === true)
}

async function doBuy(buyList, isLimitProduct) {
  sessionDataManager.set(ORDER_DATA, JSON.stringify(buyList))
  sessionDataManager.set(ORDER_PREPATH, route.fullPath)
  if (!isLogined.value) {
    proxy.$confirm(proxy.$t('CA_BuyNoAuth_txt1'), {
      title: proxy.$t('CA_BuyNoAuth_txt2'),
      okLabel: proxy.$t('CA_BuyNoAuth'),
      cancelLabel: proxy.$t('USR_GoLogin'),
      ok: () => router.push('/order/nonuser/info'),
      cancel: () => {
        router.push({
          path: '/login',
          query: { redirect: route.fullPath }
        })
      }
    })
  } else {
    let canBuy = false
    if (isLogined.value) {
      canBuy = await checkUserStatus()
      if (!canBuy) {
        proxy.$alert(proxy.$t('PR_JudgementInfo'))
        return
      }
    }
    if (isLimitProduct) {
      const res = await checkMaxQuantity(buyList)
      if (res) {
        if (!res.data) {
          canBuy = true
        }
      }
    } else {
      canBuy = true
    }
    if (canBuy) {
      router.push('/order')
    }
  }
}
async function checkUserStatus() {
  let canBuy = true
  const res = await memberService.getUserStatus(userId)
  if (res && res.data) {
    if (res.data.judgementHistories && res.data.judgementHistories.length > 0) {
      canBuy = false
    }
  }
  return canBuy
}
onMounted(() => {
  if (shouldUpdateNormalCart.value || shouldUpdateRefreshCart.value) {
    shouldCheckSelectedCart.value = true
  }
  if (!isLogined.value) {
    updateNonUserCart()
  }
  if (isLogined.value) {
    if (shouldUpdateNormalCart.value === true) {
      queryClient.invalidateQueries({
        queryKey: ['get-normal-cart']
      })
      cartStore.updateShouldUpdateNormalCart(false)
    }
  } else {
    if (shouldUpdateRefreshCart.value === true) {
      queryClient.invalidateQueries({
        queryKey: ['get-refresh-cart']
      })
      cartStore.updateShouldUpdateRefreshCart(false)
    }
  }
  if (userCartData.value) {
    cartData.value = userCartData.value.map(item => ({
      ...item,
      checked: true
    }))
  }
  if (nonUserCartData.value) {
    cartData.value = nonUserCartData.value.map(item => ({
      ...item,
      checked: true
    }))
  }
})

watch(userCartData, newData => {
  if (newData) {
    cartService.getCart()
    updateSelectedList(newData)
  }
})
watch(nonUserCartData, newData => {
  if (newData) {
    const newCart = newData.map(item => ({
      cartId: getProductId(item),
      productId: item.productId,
      productOptionId: item.productOptionId ?? null,
      quantity: item.quantity
    }))
    updateSelectedList(newData)
    localDataManager.set(CART_NO_AUTH, JSON.stringify(newCart))
    cartService.getLocalBadge()
  }
})
</script>

<style lang="scss" scoped>

</style>
