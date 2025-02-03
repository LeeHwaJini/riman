<template>
  <RButton :class="props.classNames" :label="props.label" :disable="props.productData.optionYn && props.selectedOptions.length === 0" @on-click="onAddCart"/>
</template>

<script setup>
import { queryClient } from '@/http/queryClient'
import cartService from '@/http/services/cart'
import orderService from '@/http/services/order'
import productService from '@/http/services/product'
import { useCartStore } from '@/store/cartStore'
import { scrollToTop } from '@/utils/common'
import { CART_NO_AUTH, localDataManager } from '@/utils/dataManager'
import { isLogin } from '@/utils/login'
import { computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const cartStore = useCartStore()
const isLogined = computed(() => isLogin())
const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const props = defineProps({
  productData: {
    type: Object,
    default: null
  },
  selectedOptions: {
    type: Array,
    default: null
  },
  pageState: {
    type: Object,
    default: null
  },
  classNames: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: 'CM_Cart'
  },
  closeDrawer: {
    type: Function,
    default: null
  }
})
const postNormalCart = cartService.postNormalCart()
const postSubscriptionCart = cartService.postSubscriptionCart()
const onAddCart = async () => {
  const res = await checkProductStatus()
  if (!res) return
  if (props.productData.autoShipYn) {
    if (props.pageState.cartType === 'normal') {
      recommendAddAutoCart()
    } else {
      addAutoCart()
    }
  } else {
    addNormalCart()
  }
}
async function addAutoCart() {
  if (isLogined.value) {
    addCartFn(props.productData.optionYn, 'auto')
  } else {
    confirmLogin('normal')
  }
}
function confirmLogin() {
  proxy.$confirm(proxy.$t('PR_SubsNeedLogin'), {
    title: '',
    ok: () => {
      router.push('/login')
    },
    cancelLabel: proxy.$t('CM_Close'),
    okLabel: proxy.$t('NAV_Login')
  })
}
function recommendAddAutoCart() {
  proxy.$confirm(proxy.$t('PR_SubsBenefit_txt6'), {
    title: '',
    ok: addAutoCart,
    cancel: addNormalCart,
    okLabel: proxy.$t('CA_AddAsSubs'),
    cancelLabel: proxy.$t('CA_NormalCart')
  })
}
async function addNormalCart() {
  if (isLogined.value) {
    addCartFn(props.productData.optionYn, 'normal')
  } else {
    const isMaxQuantityLimit = checkIfMaxQuantityLimit()
    if (isMaxQuantityLimit) {
      proxy.$confirm('', {
        title: proxy.$t('PR_MaxQuantityLimit'),
        okLabel: proxy.$t('USR_GoLogin'),
        ok: () => router.push({
          name: 'Login',
          query: {
            redirect: 'cart?cartType=normal'
          }
        })
      })
    } else {
      const canAddLocalCart = addLocalCart()
      if (!canAddLocalCart) return
      addCartConfirm('normal')
    }
  }
}
function checkIfMaxQuantityLimit() {
  if (props.selectedOptions.length > 0) {
    return props.selectedOptions.some(item => {
      return !!item.maxQuantityLimit
    })
  } else {
    return !!props.productData.maxQuantityLimit
  }
}
function addLocalCart() {
  let canAddLocalCart = true
  const cartLocal = JSON.parse(localDataManager.get(CART_NO_AUTH)) ?? []
  let newCart = cartLocal
  if (props.selectedOptions.length > 0) {
    props.selectedOptions.map(optionProduct => {
      const cartId = optionProduct.productId
      const payload = {
        cartId,
        productId: props.productData.productId,
        productOptionId: optionProduct.productId,
        quantity: optionProduct.quantity
      }
      const checkExists = cartLocal.findIndex(item => item.cartId === cartId)
      if (checkExists > -1) {
        newCart = newCart.map(item => {
          if (item.cartId === cartId) {
            if (item.quantity + optionProduct.quantity > 100) {
              canAddLocalCart = false
            } else {
              item.quantity += optionProduct.quantity
            }
          }
          return item
        })
      } else {
        newCart = [payload, ...newCart]
      }
    })
  } else {
    const cartId = props.productData.productId
    const payload = {
      cartId,
      productId: props.productData.productId,
      quantity: props.pageState.quantity
    }
    const checkExists = cartLocal.findIndex(item => item.cartId === cartId)
    if (checkExists > -1) {
      newCart = cartLocal.map(item => {
        if (item.cartId === cartId) {
          if (item.quantity + props.pageState.quantity > 100) {
            canAddLocalCart = false
          } else {
            item.quantity += props.pageState.quantity
          }
        }
        return item
      })
    } else {
      newCart = [payload, ...newCart]
    }
  }
  if (canAddLocalCart) {
    localDataManager.set(CART_NO_AUTH, JSON.stringify(newCart))
    cartService.getLocalBadge()
  } else {
    proxy.$alert(proxy.$t('CA_MaxQuantityLimitHundred'))
  }
  return canAddLocalCart
}

function addCartConfirm(cartType) {
  if (route.name === 'CartList') {
    if (!isLogined.value) {
      const params = JSON.parse(localDataManager.get(CART_NO_AUTH))
      cartStore.updateRefreshParams([...params])
      if (props.closeDrawer) {
        props.closeDrawer()
      }
      setTimeout(scrollToTop, 400)
    } else {
      if (cartType === 'normal') {
        queryClient.refetchQueries({ queryKey: ['get-normal-cart'] }).then(() => {
          if (props.closeDrawer) {
            props.closeDrawer()
          }
          setTimeout(scrollToTop, 400)
        })
        // emit('addCart')
      } else {
        queryClient.invalidateQueries({ queryKey: ['get-subscription-cart'] }).then(() => {
          if (props.closeDrawer) {
            props.closeDrawer()
          }
          setTimeout(scrollToTop, 400)
        })
      }
    }
  } else {
    if (!isLogined.value) {
      cartStore.updateShouldUpdateRefreshCart(true)
    } else {
      if (cartType === 'normal') {
        cartStore.updateShouldUpdateNormalCart(true)
      } else {
        cartStore.updateShouldUpdateAutoCart(true)
      }
    }
  }
  if (route.name !== 'CartList' || route.query && route.query.type !== cartType) {
    proxy.$confirm('', {
      title: proxy.$t('PR_CartMove'),
      ok: () => {
        router.push({ path: '/cart', meta: 'auto', query: { type: cartType === 'auto' ? 'auto' : 'normal' } })
      },
      okLabel: proxy.$t('CM_MovePage'),
      cancelLabel: proxy.$t('CM_No')
    })
  }
}

function generateParams(isOptionProduct) {
  let params = null
  if (isOptionProduct) {
    params = props.selectedOptions.map(item => {
      const obj = {
        productId: props.productData.productId,
        productOptionId: item.productId,
        quantity: item.quantity
      }

      return obj
    })
  } else {
    params = [{
      productId: props.productData.productId,
      quantity: props.pageState.quantity
    }]
  }
  return params
}
async function checkProductStatus() {
  let productInfo = null
  if (props.selectedOptions.length > 0) {
    productInfo = props.selectedOptions.map(item => {
      return {
        productId: props.productData.productId,
        productOptionId: item.productId
      }
    })
  } else {
    productInfo = [{
      productId: props.productData.productId,
      productOptionId: null
    }]
  }
  const params = {
    productInfo
  }
  return orderService.getProductStatus(params)
}

async function addCartFn(isOptionProduct, cartType) {
  const params = generateParams(isOptionProduct)
  if (cartType === 'auto') {
    return postSubscriptionCart.mutate(params, {
      onSuccess: () => {
        addCartConfirm(cartType)
      }
    })
  } else {
    return postNormalCart.mutate(params, {
      onSuccess: () => {
        addCartConfirm(cartType)
      }
    })
  }
}
</script>
