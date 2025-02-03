<template>
  <div class="cart-top-area">
    <div class="checkbox-area type02">
      <RCheckbox v-model="allCart">
        <span>{{ $t('CA_SelectAll') }}</span>
        <span class="count-text">({{ selectedCarts.length }}/{{ props.cartData?.length }})</span>
      </RCheckbox>
      <slot></slot>
    </div>
    <RButton class="btn" label="" @click="onClickDelete()">
      <template #content>
        <i class="ico delete"></i>
      </template>
    </RButton>
  </div>
  <ul v-if="props.cartData" class="cart-list-area">
    <li v-for="item in props.cartData" :key="item?.cartId">
      <div class="img-area">
        <img :src="addPrefixForImage(item.thumbnailUrl)" :alt="item?.productNameInfo.fullName">
        <!-- <div v-if="item.salesStatus.code === SALES_STATUS.sold_out" class="sold-out-area small">
          <div class="sold-out-bg">
            <span class="pre-line">{{ $t('CA_SoldOut') }}</span>
          </div>
        </div> -->
        <div class="checkbox-area type02">
          <RCheckbox v-model="item.checked"/>
        </div>
      </div>
      <div class="price-info-area">
        <div class="prd-name" @click="onClickDetail(item.productId, item.productOptionId)">{{ item?.productNameInfo.fullName }}</div>
        <RSelectBox
          v-if="!item.allOptionsValues || item.allOptionsValues.length > 0"
          :model-value="item.productOptionId"
          :options="generateOpions(item)"
          :filterable="false"
          class="select-box type03"
          @update:model-value="(newOptionId) => onChangeOption(newOptionId, item)"
        />

        <!--- 2024.12.06 플래너 -->
        <div v-if="isLogined && isPlanner" class="price-area planner-price-area">
          <div class="price-sp-bp-area">
            <div class="price-text gray07-color">
              <span>{{ $moneyFormat(item.salesAmount * item.quantity) }}</span>
              <span>{{ $t('CM_Won') }}</span>
            </div>

            <ul class="prd-point-area rod-h8 medium mb0 mt4">
              <li class="sp">
                <span>{{ $moneyFormat(item.sp * item.quantity) }}</span><span>SP</span>
              </li>
              <li class="bp">
                <span>{{ $moneyFormat(item.bp * item.quantity) }}</span><span>BP</span>
              </li>
            </ul>
          </div>
          <RNumberSpin :min="1" :max="!!item.maxQuantityLimit? item.maxQuantityLimit : 100" :model-value="item.quantity" class="num-input type02 navy-color" @on-change-value="(value) => onChangeQuantity(value, item)"/>
        </div>
        <!-- // 2024.12.06 플래너 -->
        <!--- 2024.12.06 소비자 -->
        <div v-else class="price-area">
          <RNumberSpin :min="1" :max="!!item.maxQuantityLimit? item.maxQuantityLimit : 100" :model-value="item.quantity" class="num-input type02 navy-color" @on-change-value="(value) => onChangeQuantity(value, item)"/>
          <div class="price-text gray07-color">
            <span>{{ $moneyFormat(item.salesAmount * item.quantity) }}</span>
            <span>{{ $t('CM_Won') }}</span>
          </div>
        </div>
        <!-- // 2024.12.06 소비자 -->
      </div>
      <div class="delete-btn-area">
        <RButton class="btn" label="" @click="onClickDelete(item)">
          <template #content>
            <i class="ico delete"></i>
          </template>
        </RButton>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { queryClient } from '@/http/queryClient'
import orderService from '@/http/services/order'
import { addPrefixForImage, checkPlanner } from '@/utils/common'
import { SALES_STATUS } from '@/utils/constant'
import { isLogin } from '@/utils/login'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const emit = defineEmits(['onDelete', 'updateSelectedCarts', 'changeQuantity', 'changeOption'])
const props = defineProps({
  cartData: {
    type: Object,
    default: null
  },
  selectedCarts: {
    type: Array,
    default: null
  }
})
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const allCart = computed({
  get() {
    if (props.cartData && props.selectedCarts.length === props.cartData.length) {
      return true
    } else {
      return false
    }
  },
  set(newValue) {
    if (newValue) {
      emit('updateSelectedCarts', true)
    } else {
      emit('updateSelectedCarts', false)
    }
  }
})
const onClickDetail = async (productId, productOptionId) => {
  let queryKey = 'get-normal-cart'
  if (!isLogined.value) {
    queryKey = 'get-refresh-cart'
  }
  const res = await checkProductStatus(productId, productOptionId)
  if (!res) {
    queryClient.invalidateQueries({
      queryKey: [queryKey]
    })
    return
  }
  router.push(`/product/detail/${productId}`)
}

const onClickDelete = (item) => {
  emit('onDelete', item)
}

const onChangeQuantity = (value, item) => {
  if (item.quantity === value) return
  emit('changeQuantity', { v: value, item })
}
const onChangeOption = (newOptionId, item) => {
  emit('changeOption', { newOptionId, item })
}
function generateOpions(item) {
  return item.allOptionsValues.map(item => {
    return generateOptionObj(item)
  })
}

function checkProductStatus(productId, productOptionId) {
  const params = {
    productInfo: [{
      productId,
      productOptionId: productOptionId ?? null
    }]
  }
  return orderService.getProductStatus(params)
}
function generateOptionObj(item) {
  const obj = {
    label: null,
    value: null,
    icon: null,
    disable: false
  }
  obj.label = item.optionValue
  obj.value = item.optionId
  if (item.salesStatus.code === SALES_STATUS.sold_out) {
    obj.disable = true
  }
  return Object.assign(obj, item)
}
</script>

<style lang="scss" scoped>

</style>
