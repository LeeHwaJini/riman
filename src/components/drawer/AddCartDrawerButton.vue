<template>
  <div v-if="displayType === 'hover'" class="hover-area" @click="onAddCartDrawer(product)">
    <span class="ico bag">add to<br>bag</span>
  </div>
  <template v-else>
    <RButton
      v-if="product.salesStatus.code !== SALES_STATUS.sold_out"
      :label="label || proxy.$t('NAV_Cart')"
      :class="classNames"
      @click="onAddCartDrawer(product)"
    />
    <RButton
      v-else
      :label="label || getSoldoutText(product)"
      disable
      :class="classNames"
    />
  </template>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, ref } from 'vue'
import AddCartDrawer from '@/components/drawer/AddCartDrawer'
import { useRoute, useRouter } from 'vue-router'
import { CART_NO_AUTH, localDataManager } from '@/utils/dataManager'
import { isLogin } from '@/utils/login'
import cartService from '@/http/services/cart'
import { queryClient } from '@/http/queryClient'
import { useCartStore } from '@/store/cartStore'
import { SALES_STATUS } from '@/utils/constant'
import { generateOptionObj, getProductId, getSoldoutText, scrollToTop } from '@/utils/common'
import productService from '@/http/services/product'
import { useMainStore } from '@/store/mainStore'
import orderService from '@/http/services/order'

const { proxy } = getCurrentInstance()
const isLogined = computed(() => isLogin())
const router = useRouter()
const route = useRoute()
const cartStore = useCartStore()
const mainStore = useMainStore()
const userId = mainStore.getUser.userSeqNo
const { product, classNames, displayType, noProductDetailData, label } = defineProps({
  label: {
    type: String,
    default: ''
  },
  product: {
    type: Object,
    default: null
  },
  classNames: {
    type: String,
    default: ''
  },
  displayType: {
    type: String,
    default: 'button'
  },
  noProductDetailData: {
    type: Boolean,
    default: false
  }
})

const productData = ref(null)
const postNormalCart = cartService.postNormalCart()
const postSubscriptionCart = cartService.postSubscriptionCart()
const onAddCartDrawer = async (product) => {
  let _product = product
  if (noProductDetailData) {
    const res = await productService.getProductDetailMain(_product.productId, userId)
    if (res && res.data) {
      _product = res.data
      productData.value = res.data
    }
  }
  if (_product.salesStatus.code === SALES_STATUS.sold_out) {
    proxy.$alert(proxy.$t('CA_SoldoutAlert'))
    return
  }
  if (_product.optionYn && _product.option) {
    const _productProp = generateOptionObj(_product)
    proxy.openModal({
      parent: proxy,
      component: AddCartDrawer,
      componentProps: {
        data: _productProp
      }
    })
  } else {
    if (!isLogined.value) {
      const res = await checkProductStatus(product.productId)
      if (!res) return
    }
    if (product.autoShipYn) {
      proxy.$confirm(proxy.$t('PR_SubsBenefit_txt6'), {
        title: '',
        ok: () => addAutoCart(_product, 1),
        cancel: () => addNormalCart(_product, 1),
        okLabel: proxy.$t('CA_AddAsSubs'),
        cancelLabel: proxy.$t('CA_NormalCart')
      })
    } else {
      addNormalCart(product, 1)
    }
  }
}
async function checkProductStatus(productId) {
  const productInfo = [{
    productId,
    productOptionId: null
  }]
  const params = {
    productInfo
  }
  return orderService.getProductStatus(params)
}
async function addAutoCart(product) {
  if (isLogined.value) {
    addCartFn(product, 'auto')
  } else {
    confirmLogin()
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
async function addCartConfirm(cartType) {
  if (route.name === 'CartList') {
    if (!isLogined.value) {
      const params = JSON.parse(localDataManager.get(CART_NO_AUTH))
      cartStore.updateRefreshParams([...params])
      setTimeout(scrollToTop, 400)
    } else {
      if (cartType === 'normal') {
        queryClient.refetchQueries({ queryKey: ['get-normal-cart'] }).then(() => {
          setTimeout(scrollToTop, 400)
        })
        // emit('addCart')
      } else {
        queryClient.invalidateQueries({ queryKey: ['get-subscription-cart'] }).then(() => {
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

function addCartFn(productData, cartType) {
  const params = generateParams(productData)
  if (cartType === 'auto') {
    return postSubscriptionCart.mutate(params, {
      onSuccess: () => addCartConfirm(cartType)
    })
  } else {
    return postNormalCart.mutate(params, {
      onSuccess: () => {
        addCartConfirm(cartType)
      }
    })
  }
}

function generateParams(productData) {
  const params = [{
    productId: productData.productId,
    quantity: 1
  }]
  return params
}
async function addNormalCart(productData) {
  if (isLogined.value) {
    addCartFn(productData, 'normal')
  } else {
    if (productData.maxQuantityLimit) {
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
      const canAddLocalCart = addLocalCart(productData)
      if (!canAddLocalCart) return
      addCartConfirm('normal')
    }
  }
}

function addLocalCart(product) {
  let canAddLocalCart = true
  const cartLocal = JSON.parse(localDataManager.get(CART_NO_AUTH)) ?? []
  let newCart = cartLocal
  const cartId = getProductId(product)
  const payload = {
    cartId,
    productId: product.productId,
    quantity: 1
  }
  const checkExists = cartLocal.findIndex(item => item.productId === product.productId && !item.productOptionId)
  if (checkExists > -1) {
    newCart = newCart.map(item => {
      if (item.productId === product.productId) {
        if (item.quantity + 1 > 100) {
          canAddLocalCart = false
        } else {
          item.quantity += 1
        }
      }
      return item
    })
  } else {
    newCart = [payload, ...cartLocal]
  }
  if (canAddLocalCart) {
    localDataManager.set(CART_NO_AUTH, JSON.stringify(newCart))
    cartService.getLocalBadge()
  } else {
    proxy.$alert(proxy.$t('CA_MaxQuantityLimitHundred'))
  }
  return canAddLocalCart
}
onMounted(() => {
  if (!noProductDetailData) {
    productData.value = product
  }
})

</script>
