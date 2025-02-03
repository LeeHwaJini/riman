<template>
  <div v-if="bagInfo" class="max-width-wrap full-width-wrap pb144">

    <div class="relative easy-bag-bg-area">
      <img :src="bagInfo?.bagBannerUrl" alt="" class="img-cover" @error="handleBannerImage" >
      <img :src="bagInfo?.bagProfileUrl" alt="" class="easy-bag-profile-img-area">
    </div>

    <div class="mt72 text-center plr6 mb48">
      <h6 class="bold" v-html="bagInfo?.title"></h6>
      <p class="mt8" v-html="bagInfo?.subTitle"></p>
    </div>
    <ul class="delivery-order-area easy-bag-prd-list plr16 list-pd0">
      <li v-for="item in bagInfo?.productBag" :key="item.productId">
        <div class="prd-img-area">
          <img :src="addPrefixForImage(item.thumbnailUrl)" alt="">
          <div class="prd-icon-area top-left">
            <span v-if="item.salesStatus === 'ALMOST_SOLD_OUT'" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
            <span v-if="item.exposureEndDatetime && isValidDates(item.exposureEndDatetime, addDate(nowDate(), 'YYYY-MM-DD HH:mm:ss', { day: 30 }))" class="prd-icon date blank-fixed">{{ $t('EB_StopSellingSoon') }}</span>
            <span v-if="item.salesStatus === 'SOLD_OUT'" class="prd-icon sold-out">{{ $t('EB_SoldOut') }}</span>
            <span v-if="item.applyCouponYn" class="prd-icon coupon">{{ $t('OP_CouponDiscount2') }}</span>
            <span v-if="item.restrictMemberDisplayYn || item.maxQuantityLimit" class="prd-icon member">{{ $t('EB_MemberOnly') }}</span>
            <span v-if="item.salesStatus === 'PAUSE'" class="prd-icon stop">{{ $t('EB_StopSelling') }}</span>
            <!-- EVENT: 추후 상품관리에 추가 예정 -->
            <!-- <span class="prd-icon event">EVENT</span> -->
          </div>
        </div>
        <div class="delivery-order-info-area">
          <div class="prd-name">{{ item.name }}</div>
          <div class="prd-option-area">
            <div v-if="item.optionValues" class="font-12 gray06-color">
              <span>{{ item.optionValues[0]?.optionValue }}</span>
            </div>
          </div>

          <RNumberSpin v-model="item.quantity" :max="item.orderQuantityLimitYn ? item.maxQuantityLimit : 100" :min="0" class="num-input type02" @update:model-value="value => onChangeQuantity(item,value)"/>

          <div class="prd-price-area mt8">
            <span>{{ $moneyFormat((item?.selectedOption?.priceOriginal ?? item.priceOriginal) * item.quantity) }}</span>
            <span>{{ $t('CM_Won') }}</span>
          </div>
          <div v-if="isPlanner" class="flex align-center gap4 mt4">
            <div class="font-12 primary09-color">
              <span class="medium">{{ $moneyFormat((( item?.selectedOption?.sp ?? item.sp ) * item.quantity).toFixed(2)) }}</span>
              <span>{{ $t('CM_Sp') }}</span>
            </div>

            <div class="font-12 beige-03-color">
              <span class="medium">{{ $moneyFormat((( item?.selectedOption?.bp ?? item.bp ) * item.quantity).toFixed(2)) }}</span>
              <span>{{ $t('CM_Bp') }}</span>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <div class="mlr16">
      <div class="flex align-center justify-between ptb16 primary09-color border-top-1-gray">
        <span class="font-16 medium">{{ $t('CM_TotalAmount') }}</span>
        <div>
          <b class="font-18">{{ $moneyFormat(total) }}{{ $t('CM_Won') }}</b>
        </div>
      </div>

      <div v-if="isPlanner" class="flex align-start justify-between ptb16 border-top-1-gray gray07-color">
        <span class="gray07-color left-title-area medium font-16">{{ $t('EB_TotalSpBp') }}</span>
        <div class="sp-bp-price-area">
          <div class="price-area text-right">
            <span>{{ $moneyFormat(spTotal) }} {{ $t('CM_Sp') }}</span>
          </div>
          <div class="price-area text-right mt2">
            <span>{{ $moneyFormat(bpTotal) }} {{ $t('CM_Bp') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 판매중지된 상품인 경우 -->
    <div v-if="containPausedProduct" class="stop-selling-modal link-type">
      <div class="explanation-text red large">
        <div class="flex align-center gap4 mb8">
          <i class="ico question-r"></i>
          <b class="font-16 error-color">{{ $t('EB_ContainStopSelling') }}</b>
        </div>

        <p>{{ $t('EB_OrderUnavailable1') }}</p>
      </div>
    </div>
    <!-- //판매중지된 상품인 경우 -->

    <div class="explanation-text gray mlr16 mt0">
      <b class="block font-16 mb16 gray07-color">{{ $t('EB_Notice1') }}</b>
      <p class="gray07-color font-14">{{ $t('EB_Notice2') }}<br/>
        {{ $t('EB_Notice3') }}</p>
    </div>

    <div class="bottom-btn">
      <RButton class="btn full small type11" label="" @click="onClickOrder">
        <template #content>
          <span class="font-20">{{ $moneyFormat(total) }}{{ $t('CM_Won') }}</span>
          <span class="ml8">{{ $t('CM_DoOrder') }}</span>
        </template>
      </RButton>
    </div>

  </div>
</template>

<script setup>

import cartService from '@/http/services/cart'
import easyBagService from '@/http/services/easybag'
import { useMainStore } from '@/store/mainStore'
import { addPrefixForImage, checkPlanner } from '@/utils/common'
import { cookieDataManager, DATA_AUTO_LOGIN, sessionDataManager } from '@/utils/dataManager'
import { addDate, isValidDates, nowDate } from '@/utils/dateFormat'
import { isLogin } from '@/utils/login'
import { getLocalRefreshToken, saveRefreshToken } from '@/utils/token'
import { ref, getCurrentInstance, computed, watch, onBeforeMount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import defaultProfile from '@/assets/images/personal_banner_profile.svg'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()
const mainStore = useMainStore()

const bagInfo = ref()
const bagId = route.query.bagId

const isEndBag = ref()
const containPausedProduct = ref()

const isLogined = ref(undefined)
const isPlanner = computed(() => checkPlanner())

const referrerCode = route.query.planner_user

const onSearchMyBagDetail = async () => {
  const result = await easyBagService.getMyBagDetail(bagId)

  if (result) {
    bagInfo.value = result.data
    bagInfo.value.productBag = result.data.productBag
      .filter(i => i.salesStatus !== 'SOLD_OUT')
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(i => {
        return { ...i, quantity: i.productQuantity }
      })

    isEndBag.value = result.data.bagDate && isValidDates(result.data.bagEndDate, nowDate())
    containPausedProduct.value = result.data.productBag.some(product => product.salesStatus === 'PAUSE')
    bagInfo.value.nonMemberOrderNotAllowed = result.data.productBag.some(product => product.maxQuantityLimit || product.restrictMemberDisplayYn)
    bagInfo.value.bagProfileUrl = result.data.bagProfileName === 'defaultProfile' ? defaultProfile : bagInfo.value.bagProfileUrl

    bagInfo.value.title = bagInfo.value.title.replaceAll('\n', '<br>')
    bagInfo.value.subTitle = bagInfo.value.subTitle.replaceAll('\n', '<br>')
  } else {
    proxy.$alert(proxy.$t('EB_DeletedBag'), {
      ok: () => {
        router.push(referrerCode ? `/?referrerCode=${referrerCode}` : '/')
      }
    })
  }

  if (!bagInfo.value.productBag.length) {
    proxy.$alert(proxy.$t('EB_SoldOutAll'), {
      title: '',
      ok: () => {
        router.push(referrerCode ? `/?referrerCode=${referrerCode}` : '/')
      }
    })
  }

  if (isEndBag.value) {
    proxy.$alert(proxy.$t('EB_OrderUnavailable4'), {
      ok: () => {
        router.push(referrerCode ? `/?referrerCode=${referrerCode}` : '/')
      }
    })
  }
}

const onChangeQuantity = (item, value) => {
  if (!isLogined.value && item.orderQuantityLimitYn) {
    if (value === 0) {
      return
    }
    proxy.$confirm(proxy.$t('EB_NonMemberOrderNotAllowed'), {
      title: '',
      ok: () => {
        router.push('/login')
      },
      cancel: () => {
        item.quantity = 0
      },
      cancelLabel: proxy.$t('CM_No'),
      okLabel: proxy.$t('CM_OkSignUp')
    })
  }

  if (isLogined.value && item.orderQuantityLimitYn && item.maxQuantityLimit <= value) {
    proxy.$alert(proxy.$t('EB_QuantityLimit', { quantity: item.maxQuantityLimit }), {
      title: '',
      ok: () => {
        item.quantity = item.maxQuantityLimit
      }
    })
  }
}

const total = computed(() => {
  return bagInfo.value?.productBag.reduce((pre, cur) => {
    pre = pre + (cur.selectedOption?.priceOriginal ?? cur.priceOriginal) * cur.quantity
    return pre
  }, 0)
})
const spTotal = computed(() => {
  return bagInfo.value?.productBag.reduce((pre, cur) => {
    pre = pre + (cur.selectedOption?.sp ?? cur.sp) * cur.quantity
    return pre
  }, 0).toFixed(2)
})
const bpTotal = computed(() => {
  return bagInfo.value?.productBag.reduce((pre, cur) => {
    pre = pre + (cur.selectedOption?.bp ?? cur.bp) * cur.quantity
    return pre
  }, 0).toFixed(2)
})

const onClickOrder = async () => {
  const result = await easyBagService.getMyBagDetail(bagId)

  if (!result) {
    proxy.$alert(proxy.$t('EB_DeletedBag'), {
      ok: () => {
        router.push(referrerCode ? `/?referrerCode=${referrerCode}` : '/')
      }
    })
  }

  containPausedProduct.value = result.data.productBag.some(product => product.salesStatus === 'PAUSE')

  if (!isLogined.value) {
    const nonMemberOrderNotAllowedProduct = bagInfo.value.productBag.filter(product => product.maxQuantityLimit || product.restrictMemberDisplayYn)

    if (nonMemberOrderNotAllowedProduct.some(product => product.quantity)) {
      proxy.$confirm(proxy.$t('EB_NonMemberOrderNotAllowed'), {
        title: '',
        ok: () => {
          router.push('/login')
        },
        cancel: () => {
          return
        },
        cancelLabel: proxy.$t('CM_No'),
        okLabel: proxy.$t('CM_OkSignUp')
      })

      return
    }
  }

  if (containPausedProduct.value) {
    proxy.$alert(proxy.$t('EB_OrderUnavailable1'), {
      ok: () => {
        router.push(referrerCode ? `/?referrerCode=${referrerCode}` : '/')
      }
    })
    return
  }

  if (!total.value) {
    proxy.$alert(proxy.$t('EB_NoItem'))
    return
  }

  const orderPayload = []

  bagInfo.value.productBag.map(i => {
    if (i.quantity > 0) {
      orderPayload.push({
        productId: i.productId,
        quantity: i.quantity,
        productOptionId: i.productOptionId
      })
    }
  })

  sessionDataManager.set('order_data', JSON.stringify(orderPayload))

  if (isLogined.value) {
    router.push(`/order?bagId=${bagId}`)
  } else {
    router.push(`/order/nonuser/info?bagId=${bagId}&planner_user=${referrerCode}`)
  }
}
onBeforeMount(async () => {
  doAutoLogin()
})

/**
 * 자동 로그인 체크 > 로컬스토리지에 있는 refreshToke 세션에 적용
 */
const doAutoLogin = async () => {
  const isAutoLogin = cookieDataManager.get(DATA_AUTO_LOGIN) // 자동 로그인 설정 여부
  const localRefreshToken = getLocalRefreshToken()
  if (isAutoLogin && localRefreshToken && !isLogin()) {
    await saveRefreshToken(localRefreshToken)
    await mainStore.getMe()

    // 장바구니 조회
    await cartService.getCart()
  }
}

const handleBannerImage = () => {
  bagInfo.value.bagBannerUrl = addPrefixForImage(bagInfo.value?.bagBannerName)
}

watch(
  () => mainStore.getUser,
  () => {
    isLogined.value = isLogin()
  }, {
    immediate: true
  }
)

onMounted(() => {
  onSearchMyBagDetail()
})

</script>

<style lang="scss" scoped>
.stop-selling-modal {
  z-index: 8;
}
</style>
