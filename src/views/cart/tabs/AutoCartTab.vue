<template>
  <ul class="cart-explanation-area">
    <li class="error-color">{{ $t('CA_SubsInfo_txt1') }}</li>
    <li class="error-color">{{ $t('CA_SubsInfo_txt2') }}</li>
    <li>{{ $t('CA_SubsInfo_txt3') }}</li>
    <span>{{ $t('PR_SubsBenefit_txt4') }}  <span class="success04-color">{{ $t('PR_AddProduct') }}</span>{{ $t('PR_SubsBenefit_txt5') }}</span>
  </ul>
  <template v-if="!cartData || cartData.length <= 0">
    <div class="cart-none-area">
      <img src="@assets/images/cart_none.svg" alt="">
      <p class="title">{{ $t('CA_Empty_txt1') }}</p>
      <p class="text pre-line">{{ $t('CA_Empty_user_txt') }}</p>
    </div>

    <RecommProducts :recomm-data="emptyCartData"/>
  </template>

  <template v-else>

    <CartList :selected-carts="selectedCarts" :cart-data="cartData" @on-delete="onDeleteCart" @update-selected-carts="uppdateSelectedCarts" @change-quantity="onChangeQuantity" @change-option="onChangeOption"/>

    <div class="cart-result-price-area">
      <div class="result-price-area">
        <div class="field">
          <span>{{ $t('OP_PaymentAmount') }}</span>
          <div class="price-text-area">
            <span>{{ $moneyFormat(total) }}</span>
            <span>{{ $t('CM_Won') }}</span>
          </div>
        </div>

        <div class="field">
          <span>{{ $t('OP_Point') }}</span>
          <div class="price-text-area">
            <span>{{ totalPoint }}</span>
            <span>P</span>
          </div>
        </div>
        <div class="field border-top-none pt0">
          <span>{{ $t('CA_PointAdd') }}</span>
          <div class="price-text-area">
            <span>{{ totalPoint }}</span>
            <span>P</span>
          </div>
        </div>
      </div>
      <div class="cart-buy-text-area">
        <span>{{ $t('CA_FreeShip', {money: '66000'}) }}</span>
        <span>{{ $t('CA_PayInfo') }}</span>
      </div>

    </div>
    <div class="bottom-btn">
      <RButton class="btn full small type11" label="" @on-click="onClickBuy">
        <template #content>
          <span class="btn-price-text">{{ $moneyFormat(total) }}{{ $t('CM_Won') }}</span>
          <span>{{ $t('신규 정기구매 신청하기') }}</span>
        </template>
      </RButton>
    </div>
  </template>
</template>
<script setup>
import { computed, getCurrentInstance, onMounted, ref, watch } from 'vue'
import CartList from '../CartList'
import RecommProducts from '../products/RecommProducts'

import cartService from '@/http/services/cart'
import { useCartStore } from '@/store/cartStore'
import { storeToRefs } from 'pinia'
import { queryClient } from '@/http/queryClient'
import { useRouter } from 'vue-router'
import { ORDER_DATA, sessionDataManager } from '@/utils/dataManager'
import productService from '@/http/services/product'
import { getProductId } from '@/utils/common'

const { proxy } = getCurrentInstance()
const cartStore = useCartStore()
const isAutoship = import.meta.env.VITE_APP_IS_AUTOSHIP === 'true'
const cartData = ref(null)
const noProgessbar = ref(false)
const { data: autoCartData, refetch } = cartService.getSubscriptionCart(noProgessbar)
const { data: emptyCartIdsData } = cartService.getCartEmptyCartIds(cartData)
const { data: emptyCartData } = productService.getProductsByIds(emptyCartIdsData, 'get-empty-cart-products')
const patchSubscriptionCart = cartService.patchSubscriptionCart()
const patchSubscriptionCartOption = cartService.patchSubscriptionCartOption()
const deleteSubscriptionCart = cartService.deleteSubscriptionCart()
const { shouldUpdateAutoCart } = storeToRefs(cartStore)
const selectedCarts = computed(() => {
  return cartData.value && cartData.value.filter(item => item.checked === true)
})
const router = useRouter()
const total = computed(() => {
  return selectedCarts.value.reduce((pre, cur) => {
    pre = pre + cur.salesAmount * cur.quantity
    return pre
  }, 0)
})
const totalPoint = computed(() => {
  return selectedCarts.value.reduce((pre, cur) => {
    pre = pre + cur.bp * cur.quantity
    return pre
  }, 0)
})

const onChangeOption = async ({ newOptionId, item }) => {
  const existCartProductIdList = autoCartData.value.map(item => getProductId(item))
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
}

const onChangeQuantity = async ({ v, item }) => {
  const params = {
    quantity: v.toString()
  }
  patchSubscriptionCart.mutate({ params, cartId: item.cartId }, {
    onSuccess: () => {
      updateSelectedCartQuantity(item.cartId, v)
      noProgessbar.value = true
      refetch()
    },
    onSettled: () => {
      noProgessbar.value = false
    }
  })
}
const onDeleteCart = (item) => {
  const params = {
    subscribeCartId: []
  }
  if (item) {
    params.subscribeCartId.push(item.cartId)
  } else {
    params.subscribeCartId = selectedCarts.value.map(item => item.cartId)
  }
  if (params.subscribeCartId.length <= 0) return
  deleteSubscriptionCart.mutate(params)
}
const onClickBuy = () => {
  if (selectedCarts.value.length <= 0) {
    proxy.$alert(proxy.$t('CA_SelectPrd'))
  } else {
    if (total.value < 66000) {
      proxy.$alert(proxy.$t('CA_SubsAddInfo'))
    } else {
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
      sessionDataManager.set(ORDER_DATA, JSON.stringify(buyList))
      router.push('/autoship')
    }
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
function doMutateCart(v, item) {
  const params = {
    productOptionId: v
  }
  patchSubscriptionCartOption.mutate({ params, cartId: item.cartId })
}
function updateSelectedCartQuantity(cartId, quantity) {
  const indexInSelectedCart = selectedCarts.value.findIndex(i => i.cartId === cartId)
  if (indexInSelectedCart > -1) {
    selectedCarts.value[indexInSelectedCart].quantity = quantity
  }
}
function updateSelectedList(newData) {
  let _newData = newData
  _newData = _newData.map(item => ({
    ...item,
    checked: false
  }))
  if (selectedCarts.value && selectedCarts.value.length > 0) {
    const selectedCartIds = selectedCarts.value.map(item => item.cartId)
    _newData = _newData.map(item => {
      if (selectedCartIds.includes(item.cartId)) {
        item.checked = true
      }
      return item
    })
  }
  cartData.value = _newData
}
async function init() {
  cartService.getSubscriptionCart()
}
onMounted(() => {
  init()
  if (shouldUpdateAutoCart.value === true) {
    queryClient.invalidateQueries({
      queryKey: ['get-subscription-cart']
    })
    cartStore.updateShouldUpdateAutoCart(false)
  }
  if (autoCartData.value) {
    cartData.value = autoCartData.value.map(item => ({
      ...item,
      checked: false
    }))
  }
  if (emptyCartData.value) {
    cartData.value = emptyCartData.value.map(item => ({
      ...item,
      checked: false
    }))
  }
})
watch(autoCartData, v => {
  if (v) {
    updateSelectedList(v)
  }
})
</script>
