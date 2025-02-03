<!--
  반품 신청 > step1
  create by jhchoi
-->
<template>
  <div class="max-width-wrap full-width-wrap pb144">

    <div class="main-title-area">
      <h3 class="">{{ $t('RET_Request') }}</h3>
    </div>

    <span v-if="isPlanner" class="error-msg">
      <i class="ico exclamation-r"/>{{ $t('RET_DownGradeAlert') }}
    </span>

    <div class="step-title-group-area">
      <hgroup class="flex align-end justify-between step-title-group">
        <h4 class="title bold primary09-color">{{ $t('RET_SelectProductTitle') }}</h4>
        <RStep :step="step" :total-step="totalStep" />
      </hgroup>

      <span class="font-14 medium gray07-color mt24 block">{{ $t('RET_Notice1') }}<br>{{ $t('RET_SelectProduct') }}</span>
    </div>

    <div v-if="productList?.length" class="return-area">
      <ul class="delivery-order-area" >
        <li>
          <div class="flex-layout">
            <div class="prd-img-area">
              <img :src="addPrefixForImage( productList[0]?.productInfo.thumbnailUrl)" alt="">

              <div class="checkbox-area type02">
                <RCheckbox v-if="productList[0]" v-model="productList[0].isChecked" />
              </div>
            </div>
            <div class="delivery-order-info-area">
              <div class="prd-name">{{ productList[0]?.productInfo.productName }}</div>
              <!-- 세트상품 있을 경우 -->
              <div
                v-if="productList[0]?.productInfo.setYn"
                class="set-prd-area"
                @click="productList[0].isVisibleSet = ! productList[0].isVisibleSet"
              >
                <div class="set-prd-btn-area primary04">{{ $t('ORD_ViewSetProduct') }}<i class="ico arrow-top-type02-b" :class="{'rotate': productList[0]?.isVisibleSet}" /></div>
                <q-slide-transition>
                  <div v-if=" productList[0]?.isVisibleSet">
                    <div class="oprion-text">{{ productList[0]?.productInfo.setProducts }}</div>
                  </div>
                </q-slide-transition>
              </div>
              <!-- //세트상품 있을 경우 -->
              <div v-for="(item, index) in productList[0]?.productInfo.optionValues" :key="index" class="prd-option-area">
                <div>{{ item.optionValue }}</div>
              </div>

              <div class="flex align-center justify-between">
                <div class="prd-price-area">
                  <span>{{ $moneyFormat(productList[0]?.productInfo.saleAmount * productList[0].productInfo.selectedQuantity) }} {{ $t('CM_Won') }}</span>
                </div>
                <div class="flex align-center gap8">
                  <div class="font-12 gray07-color">{{ productList[0]?.productInfo.quantity }}{{ $t('RET_OutOf') }}</div>
                  <RSelectBox
                    v-if="productList[0]"
                    v-model="productList[0].productInfo.selectedQuantity"
                    class="select-box type03 small"
                    :options="Array.from({ length: productList[0]?.productInfo.quantity + 1 }, (_, i) => ({
                      label: i.toString(),
                      value: i
                    }))"
                    :filterable="false"
                    :placeholder-text="productList[0]?.productInfo.selectedQuantity"
                    @update:model-value="i => onChangeQuantity(productList[0], i)"
                  />
                </div>
              </div>
            </div>
          </div>
        </li>

        <q-slide-transition v-if="isVisibleItem">
          <li>
            <div v-for="item in productList.slice(1)" :key="item.productInfo.productId" class="flex-layout">
              <div class="prd-img-area">
                <img :src="addPrefixForImage(item.productInfo.thumbnailUrl)" alt="">
                <div class="checkbox-area type02">
                  <RCheckbox v-model="item.isChecked" />
                </div>
              </div>
              <div class="delivery-order-info-area">
                <div class="prd-name">{{ item.productInfo.productName }}</div>
                <!-- 세트상품 있을 경우 -->

                <div
                  v-if="item.productInfo.setYn"
                  class="set-prd-area"
                  @click="item.isVisibleSet = !item.isVisibleSet"
                >
                  <div class="set-prd-btn-area primary04">{{ $t('ORD_ViewSetProduct') }}<i class="ico arrow-top-type02-b" :class="{'rotate':item.isVisibleSet}" /></div>
                  <q-slide-transition>
                    <div v-if="item.isVisibleSet">
                      <div class="oprion-text">{{ item.productInfo.setProducts }}</div>
                    </div>
                  </q-slide-transition>
                </div>
                <!-- //세트상품 있을 경우 -->
                <div v-for="option in item.productInfo.optionValues" :key="option.optionId" class="prd-option-area">
                  <div>{{ option.optionValue }}</div>
                </div>

                <div class="flex align-center justify-between">
                  <div class="prd-price-area">
                    <span>{{ $moneyFormat(item.productInfo.saleAmount * item.productInfo.selectedQuantity) }}{{ $t('CM_Won') }}</span>
                  </div>
                  <div class="flex align-center gap8">
                    <div class="font-12 gray07-color">{{ item.productInfo.quantity }}{{ $t('RET_OutOf') }}</div>
                    <RSelectBox
                      v-if="item.productInfo"
                      v-model="item.productInfo.selectedQuantity"
                      class="select-box type03 small"
                      :options="Array.from({ length: item.productInfo.quantity + 1 }, (_, i) => ({
                        label: i.toString(),
                        value: i
                      }))"
                      :filterable="false"
                      :placeholder-text="item.productInfo.selectedQuantity"
                      @update:model-value="i => onChangeQuantity(item, i)"
                    />
                  </div>
                </div>

              </div>
            </div>
          </li>
        </q-slide-transition>
      </ul>

      <div v-if="productList.length !== 1" class="delivery-order-list-area" @click="isVisibleItem = !isVisibleItem" >
        <div class="order-count-text-area">
          <div class="text-area">
            <span>{{ $t('CM_Total') }}</span>
            <span>{{ productList.length }}</span>
            <span>{{ $t('CM_Count') }}</span>
          </div>

          <div class="text">{{ !isVisibleItem? $t('OP_ProductExpand') : $t('OP_ProductClose') }}</div>
        </div>

        <i class="ico arrow-top-type02-b" :class="{'rotate':isVisibleItem}"></i>

      </div>

      <ul class="explanation-text gray font-14">
        <li>{{ $t('RET_ReturnPointDesc5') }}</li>
        <li>{{ $t('RET_Notice2') }}</li>
      </ul>

    </div>

    <div class="bottom-btn">
      <RButton class="btn full small type02" :label="$t('CM_Next')" :disabled="!productList?.filter(i => i.isChecked && i.productInfo.selectedQuantity).length" @click="toNextStep"/>
    </div>
  </div>

</template>

<script setup>

import { ref, onMounted, computed, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import orderService from '@/http/services/order'
import { addPrefixForImage, checkPlanner } from '@/utils/common'
import { sessionDataManager } from '@/utils/dataManager'
import productService from '@/http/services/product'
import { isLogin } from '@/utils/login'
import { useMainStore } from '@/store/mainStore'

const { proxy } = getCurrentInstance()

const totalStep = ref(3)
const step = ref(1)

const isVisibleItem = ref(false)

const route = useRoute()
const router = useRouter()
const salesOrderId = route.params.salesOrderId
const tempId = route.query.tempId

const productList = ref([])

const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const mainStore = useMainStore()
const userId = mainStore.getUser.userSeqNo

onMounted(() => {
  productList.value = JSON.parse(sessionDataManager.get('returnProductList'))

  if (!salesOrderId) {
    router.push('/mypage')
    return
  }

  if (productList.value === null) {
    getProductList()
  }
})

const getProductList = async () => {
  const params = {
    salesOrderId,
    identification: tempId
  }
  const result = isLogined.value
    ? await orderService.getReturnableProductList(params)
    : await orderService.getNonMemberReturnableProductList(params)

  let tempProductList

  if (result) {
    tempProductList = result.data.list.map(i => {
      return {
        ...i,
        isChecked: false,
        isVisibleSet: false,
        productInfo: {
          ...i.productInfo,
          selectedQuantity: i.productInfo.quantity
        }
      }
    })

    productList.value = await Promise.all(tempProductList.map(async i => {
      const result = await productService.getIncludedProductDetail(i.productInfo.productId, userId)

      if (result) {
        const setYn = result.data.setYn
        const setProducts = result.data.set?.products
          ?.map(product => {
            const name = product.productName || product.productEnglishName
            return `${name} (${product.quantity}${proxy.$t('CM_Unit')})`
          })
          .join(', ')

        return {
          ...i,
          productInfo: {
            ...i.productInfo,
            setYn,
            setProducts
          }
        }
      }
      return i
    }))
  }
}

const onChangeQuantity = (product, quantity) => {
  productList.value = productList.value.map(i => {
    if ((i.productInfo.productId === product.productInfo.productId) && (i.productInfo.productOptionId === product.productInfo.productOptionId)) {
      i.productInfo.selectedQuantity = quantity
    }
    return i
  })
}
const toNextStep = () => {
  const returnProductList = productList.value

  if (!returnProductList.length) {
    return
  }

  sessionDataManager.set('returnProductList', JSON.stringify(returnProductList))

  isLogined.value
    ? router.replace(`/return/step2/${salesOrderId}`)
    : router.replace({ path: `/return/step2/${salesOrderId}`, query: { tempId } })
}

</script>

<style lang="scss" scoped>

</style>

