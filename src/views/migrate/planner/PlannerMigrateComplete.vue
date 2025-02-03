<!--
  NM 전환 > 플래너 전환 완료
  create by jhchoi
-->
<template>
  <div class="signup-planner-complete-flex-wrap pb144">
    <div class="signup-wrap signup-complete-wrap">
      <div class="">

        <div class="signup-detail-title-area">
          <i class="ico celebration"></i>
          <h4 class=""><b>{{ $nameFormat(migrateComplete && migrateComplete.lastName, migrateComplete && migrateComplete.firstName) }}</b>{{ $t('SIG_Sir') }},<br>
            {{ $t('MIG_CompleteTitle') }}</h4>
          <p>
            {{ $t('MIG_SubTitle1') }}<br/>{{ $t('MIG_SubTitle2') }}<br/>{{ $t('MIG_SubTitle3') }}
          </p>

          <div class="member-num-copy-content">
            <div class="member-num-copy-area border-none">
              <span class="member-num-title">{{ $t('CM_UserNumber') }}</span>
              <span class="member-num-text">{{ migrateComplete && migrateComplete.userNumber }}</span>
              <RButton label="" class="copy-btn" @click="copyClipboard(migrateComplete && migrateComplete.userNumber)">
                <template #content>
                  <i class="ico copy"></i>
                </template>
              </RButton>
              <div class="complete-bg">
                <img src="@assets/images/complete_bg.gif" alt="">
              </div>
            </div>
          </div>

          <RButton class="btn type02 small complete-planner-btn" @on-click="$router.push('/mypage/checkPlannerDocument')">
            <template #content>
              {{ $t('SIG_MemberDocument') }}
              <i class="ico arrow-right-w" />
            </template>
          </RButton>

        </div>
      </div>

      <p class="text-center primary09-color mt24 mb24 font-20">
        <b>{{ $nameFormat(migrateComplete && migrateComplete.lastName, migrateComplete && migrateComplete.firstName) }} {{ $t('MIG_IntroProduct1') }}</b>{{ $t('MIG_IntroProduct2') }} <br/>
        {{ $t('MIG_IntroProduct3') }}
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
            :label="$t('CM_Cart')"
            class="btn type07 medium full mt8"
            @on-click="onAddSignupCart(product.productId)"
          />
        </li>
      </ul>

      <div class="signup-complete-btn-wrap">
        <div ref="animation" class="signup-complete-btn-area" :class="{active:isActive}">
          <RButton class="btn signup-complete-btn" >
            <template #content>
              <span class="foreigner planner" @click="$router.push(`/login/${migrateComplete.userNumber}`)">
                <img src="@assets/images/logo_riman_w.svg" alt="">
                <span class="tour-text">{{ $t('SIG_DoLogin') }}</span>
                <span class="click-text-area">
                  {{ $t('SIG_Click') }}
                  <i class="ico arrow-right-w"></i>
                </span>
              </span>
            </template>
          </RButton>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

import { onMounted, getCurrentInstance, ref } from 'vue'
import { useRouter } from 'vue-router'
import { sessionDataManager, SIGNUP_CART } from '@utils/dataManager'
import { addPrefixForImage } from '@/utils/common'
import { copyClipboard } from '@/utils/common'
import memberService from '@/http/services/member'

const { proxy } = getCurrentInstance()
const isActive = ref(true)
const router = useRouter()
const productList = ref([])

const props = defineProps({
  migrateComplete: {
    type: Object,
    default: () => {
      return []
    }
  }
})

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
 * 장바구니 담기
 */
const onAddSignupCart = (productId) => {
  sessionDataManager.set(SIGNUP_CART, JSON.stringify([{
    'productId': productId,
    'quantity': 1
  }]))

  router.push({
    path: `/login/${props.migrateComplete.userNumber}`,
    query: {
      'redirect': '/cart?type=normal'
    } })
}

</script>
