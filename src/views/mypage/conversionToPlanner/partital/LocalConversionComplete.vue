<!--
  마이페이지 > 플래너로 전환 > 완료 (커스터머 내국인 전환신청완료화면)
  create by jhchoi
-->
<template>
  <div class="signup-planner-complete-flex-wrap pb144">
    <div class="signup-wrap signup-complete-wrap">
      <div class="">

        <div class="signup-detail-title-area">
          <i class="ico celebration"></i>
          <h4 class=""><b>{{ pageState.userName }}</b>{{ $t('SIG_Sir') }},<br>{{ $t('MCC_CompleteTitle') }}</h4>
          <p>
            {{ $t('MCC_CompleteSubTitle1') }}<br/>
            {{ $t('MCC_CompleteSubTitle2') }}<br/>
            {{ $t('MCC_CompleteSubTitle3') }}<br/>
          </p>

        </div>
      </div>

      <p class="text-center primary09-color mt24 mb24 font-20">
        <b>{{ pageState.userName }} {{ $t('CM_Planner') }}{{ $t('SIG_Sir') }}</b>{{ $t('SIG_StartkitDesc2') }}<br/>
        {{ $t('SIG_StartkitDesc3') }}
      </p>

      <ul class="signup-complete-list">
        <li v-for="product in productList" :key="product">
          <img :src="addPrefixForImage(product.thumbnailUrl)" alt="" class="img-cover">
          <div class="prd-name font-12">
            {{ product.productName }}
          </div>
          <div class="gray07-color">
            <span class="font-16 extra-bold">{{ $moneyFormat(product.priceOriginal) }}</span>
            <span class="font-16 extra-bold ml2">{{ $t('CM_Won') }}</span>
          </div>
          <RButton
            :label="'장바구니'"
            class="btn type07 medium full mt8"
            @on-click="onAddSignupCart(product.productId)"
          />
        </li>
      </ul>

      <div class="signup-complete-btn-wrap">
        <div ref="animation" class="signup-complete-btn-area planner-change-btn-area" :class="{active:isActive}">
          <RButton class="btn signup-complete-btn" >
            <template #content>
              <span class="foreigner planner" @click="onGoLoginPage('')">
                <img src="@assets/images/logo_riman_w.svg" alt="">
                <span class="tour-text">{{ $t('MCC_GoLogin') }}</span>
              </span>
            </template>
          </RButton>

          <!-- 플래너 전환했을 경우 -->
          <div class="planner-login-text-area">
            {{ $t('MCC_LoginDesc1') }}<br/>
            {{ $t('MCC_LoginDesc2') }}
          </div>
          <!-- //플래너 전환했을 경우 -->
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

import { onMounted, getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'
import { sessionDataManager, SIGNUP_CART } from '@utils/dataManager'
import memberService from '@/http/services/member'
import { addPrefixForImage } from '@/utils/common'
import { useMainStore } from '@/store/mainStore'

const props = defineProps({
  pageState: {
    type: Object,
    default: () => {
      return []
    }
  }
})
const { proxy } = getCurrentInstance()
const mainStore = useMainStore()

const isActive = ref(true)
const router = useRouter()
const productList = ref([])

onMounted(() => {
  const animation = proxy.$refs.animation

  animation.addEventListener('animationend', () => {
    isActive.value = false
    setTimeout(() => {
      isActive.value = true
    }, 3000)
  })

  getStartKitProduct()
})

/**
 * startKit 상품 조회
 */
const getStartKitProduct = async () => {
  const result = await memberService.getStartKitProduct()
  if (result) {
    productList.value = result.data
  }
}

/**
 * startkit 상품 > 장바구니 담기
 */
const onAddSignupCart = (productId) => {
  sessionDataManager.set(SIGNUP_CART, JSON.stringify([{
    'productId': productId,
    'quantity': 1
  }]))

  onGoLoginPage('/cart?type=normal')
}

/**
 * 로그 아웃 후 로그인 페이지 이동
 */
const onGoLoginPage = async (query = '') => {
  const result = await mainStore.onLogout()
  if (result) {
    if (query) {
      router.push({
        path: '/login',
        query: {
          'redirect': query
        } })
    } else {
      router.push({ path: '/login' })
    }
  }
}
</script>
