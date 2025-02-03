<template>
  <q-expansion-item v-model="open">
    <template #header>
      <q-item-section class="left-area">
        주문상품
      </q-item-section>

      <q-item-section side class="right-area" >

      </q-item-section>
    </template>

    <q-card v-if="productList && productList.length > 0">
      <div class="delivery-info-area pb0">
        <ul class="delivery-order-area">
          <li>
            <div>
              <div class="prd-img-area">
                <img :src="addPrefixForImage(visibleProduct.thumbnailUrl)" alt="">
              </div>
              <div class="delivery-order-info-area">
                <div class="prd-name">{{ visibleProduct.productName }}</div>
                <div class="prd-option-area">
                  <!-- <div v-if="visibleProduct.optionYn">{{ visibleProduct.selectedProduct.productName }}</div> -->
                  <div>{{ visibleProduct.quantity }}개</div>
                </div>
                <div class="prd-price-area">
                  <template v-if="visibleProduct.optionYn">
                    <span>{{ $moneyFormat(visibleProduct.priceOriginal) }}</span>
                  </template>
                  <template v-else>
                    <span>{{ $moneyFormat(visibleProduct.priceOriginal) }}</span>
                  </template>
                  <span>{{ $t('CM_Won') }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <q-slide-transition>
          <ul v-if="visible" class="delivery-order-area">
            <li v-for="product in hiddenProducts" :key="product.productId">
              <div>
                <div class="prd-img-area">
                  <img :src="addPrefixForImage(product.thumbnailUrl)" alt="">
                </div>
                <div class="delivery-order-info-area">
                  <div class="prd-name">{{ product.productName }}</div>
                  <div class="prd-option-area">
                    <!-- <div v-if="product.selectedProduct">{{ product.selectedProduct.productName }}</div> -->
                    <div>{{ product.quantity }}개</div>
                  </div>
                  <div class="prd-price-area">
                    <template v-if="product.optionYn">
                      <span>{{ $moneyFormat(product.priceOriginal) }}</span>
                    </template>
                    <template v-else>
                      <span>{{ $moneyFormat(product.priceOriginal) }}</span>
                    </template>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </q-slide-transition>
        <div v-if="productList.length > 1" class="delivery-order-list-area" @click="visible = !visible">
          <div class="order-count-text-area">
            <div class="text-area">
              <span>총</span>
              <span>{{ productList.length }}</span>
              <span>건</span>
            </div>

            <div class="text">주문 상품 목록 {{ visible ? '접어보기' : '펼쳐보기' }}</div>
          </div>

          <i class="ico arrow-top-type02-b drop-down-icon" :class="{'rotate':visible}"></i>
        </div>

        <div class="delivery-order-price-area">
          <div class="field top-menu" @click="visiblePrice = !visiblePrice">
            <div class="flex align-center gap4">
              <div>주문금액</div>
              <i class="ico arrow-top-type02-n drop-down-icon" :class="{'rotate':visiblePrice}"></i>
            </div>
            <div>
              <span>{{ props.paymentInfo?.productsAmount }}</span>
              <span>{{ $t('CM_Won') }}</span>
            </div>
          </div>

          <q-slide-transition>
            <div v-if="visiblePrice">
              <div class="field">
                <div>상품금액</div>
                <div>{{ props.paymentInfo?.productsAmount }}{{ $t('CM_Won') }}</div>
              </div>
              <!-- 비회원 주문일 경우 제거 -->
              <div class="field">
                <div>상품할인 전</div>
                <div class="span-text gray">
                  <span>{{ props.paymentInfo?.totalSpOrigin }}SP</span>
                  <span>{{ props.paymentInfo?.totalBpOrigin }}BP</span>
                </div>
              </div>
              <div class="field">
                <div>상품할인 후</div>
                <div class="span-text">
                  <span>{{ props.paymentInfo?.totalSpAfterDiscount }}SP</span>
                  <span>{{ props.paymentInfo?.totalBPAfterDiscount }}BP</span>
                </div>
              </div>
              <!-- //비회원 주문일 경우 제거 -->
            </div>

          </q-slide-transition>

        </div>

      </div>

    </q-card>
  </q-expansion-item>
</template>

<script setup>
import { computed, getCurrentInstance, onMounted, onUnmounted, ref, watch } from 'vue'
import AutoshipAddProductModal from '../modal/AutoshipAddProductModal'
import { addPrefixForImage } from '@/utils/common'
import { sessionDataManager, SUBS_ORDER_DATA } from '@/utils/dataManager'

const { proxy } = getCurrentInstance()
const productList = ref([])
const visible = ref(false)
const visiblePrice = ref(false)
const open = ref(true)
const visibleProduct = computed(() => productList.value[0])
const hiddenProducts = computed(() => productList.value.slice(1))
const emit = defineEmits(['addProducts'])
const props = defineProps({
  paymentInfo: {
    type: Object,
    default: null
  }
})
function openAutoshipAddProduct(type) {
  proxy.openModal(
    {
      parent: proxy,
      component: AutoshipAddProductModal,
      componentProps: {
        type
      },
      modeless: false
    }).onOk((v) => addProduct(v))
}
function addProduct(data) {
  productList.value = data.products
  sessionDataManager.set(SUBS_ORDER_DATA, JSON.stringify(data))
  emit('addProducts', data)
}
function initProduct() {
  sessionDataManager.remove(SUBS_ORDER_DATA)
}
onMounted(() => {
  const data = sessionDataManager.get(SUBS_ORDER_DATA)
  if (!data) {
    openAutoshipAddProduct('add')
  } else {
    const _data = JSON.parse(data)
    addProduct(_data)
  }
  window.onpopstate = (event) => {
    initProduct()
  }
})

onUnmounted(() => {
  initProduct()
})
</script>

<style lang="scss" scoped>

</style>
