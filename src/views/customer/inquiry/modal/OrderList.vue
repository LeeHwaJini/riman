<template>
  <ul v-if="props.orderList && props.orderList.length > 0" class="list type04 scroll type01 popupo-max-h-530-fixed">
    <!-- 상품 여러개 있을 경우 li에 multiple class추가 -->
    <li v-for="item in props.orderList" :key="item.salesOrderId" :class="item.productCount > 1">
      <!-- 상품 여러개 있을 경우 노출 -->
      <div v-if="item.productCount > 1" class="prd-multiple"></div>
      <!-- //상품 여러개 있을 경우 노출 -->
      <div class="list-area">
        <div class="order-count-area">
          <span>{{ $t('CM_Total') }}</span>
          <span>{{ item.productCount }}</span>
          <span>개 상품</span>
        </div>

        <div class="flex align-start justify-between mb8">
          <div class="order-num-area">
            <div class="order-num-text">
              <span>{{ item.salesOrderNumber }}</span>
            </div>
            <div class="order-num-date">{{ item.orderDateTime }}</div>
          </div>

          <RButton
            :label="$t('CM_Select')"
            class="btn type03 medium plr8"
            @click="() => onAddOrder(item)"
          />
        </div>
        <div class="order-prd-area">
          <div class="prd-img-area">
            <img :src="addPrefixForImage(item.imgUrl)" :alt="item.productName">

            <div class="prd-icon-area bottom-right">
              <span class="prd-icon count">{{ item.productCount }}</span>
            </div>
          </div>

          <div class="prd-text">{{ item.productName }}</div>
        </div>

        <div class="order-payment-area">
          <span>{{ $t('ORD_PaymentAmount') }}</span>
          <div class="price-area">
            <span>{{ $moneyFormat(item.salesAmount) }}</span>
            <span>{{ $t('CM_Won') }}</span>
          </div>
        </div>

        <div class="order-detail-area">
          <!-- <span>{{ item.salesOrderStatus.text }}</span> -->
          <router-link :to="{ name: 'orderDetail', query: { orderId: item.salesOrderId } }" class="btn type13">{{ $t('ORD_ViewOrderDetail') }}</router-link>
        </div>
      </div>

    </li>
  </ul>
  <div v-else class="cart-none-area">
    <img src="@assets/images/cart_none.svg" alt="">
    <p class="title">{{ $t('SRH_NonResult') }}</p>
  </div>
</template>

<script setup>
import { addPrefixForImage } from '@/utils/common'
const emit = defineEmits(['addOrder'])
const props = defineProps({
  orderList: {
    type: Object,
    default: null
  }
})
const onAddOrder = (order) => {
  emit('addOrder', order)
}
</script>

    <style lang="scss" scoped>

    </style>
