<!--
정기구매 관리
create by rhkim06
정기구매 작업이 홀딩이 되어 작업이 중단되었습니다. 2024-10-11
-->
<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">정기구매 관리</h3>
    </div>

    <ul v-if="autoshipList && autoshipList.length > 0" class="list type08 plr16">
      <li v-for="(item, index) in autoshipList" :key="item.orderResponse.identification">

        <!-- 정기구매 징계인 경우 -->
        <div v-if="1 === 0" class="buy-impossible-dim-area" :style="{ 'height': `${orderListAreaHeight[index]}px` }">
          <div class="font-16 text-center">
            징계기간에는 정기구매를<br />
            이용할 수 없습니다.

            <div class="text-center mt8 font-16">2024.09.01 ~ 2024.10.31</div>
          </div>
        </div>
        <!-- //정기구매 징계인 경우 -->

        <!-- 정기구매 철회인경우 -->
        <div v-if="1 === 0" class="buy-impossible-dim-area interruption" :style="{ 'height': `${orderListAreaHeight[index]}px` }">
          <i class="ico delete-w" />
          <div class="font-16 text-center">
            주문차단으로 정기구매가<br/>
            중단되었습니다.<br/>
            정기구매 재시작을 원하시면<br/>
            하단의 [정기구매 재시작] 버튼을<br/>
            클릭해주세요.
          </div>
        </div>
        <!-- //정기구매 철회인경우 -->

        <div ref="orderListArea" >
          <div class="flex align-center justify-between no-wrap">
            <div class="delivery-name-area flex align-center gap8">
              <b class="font-16 primary09-color">{{ item.orderResponse.receiver.addressName }}</b>
              <span class="btn type14 flex-shrink0">기본배송지</span>
            </div>

            <!-- 기본 레이아웃  -->
            <div v-if="1" class="relative">
              <i class="ico edit-g pointer" @click="onToggleMenuVisible(index)"></i>
              <div class="tooltip-area type04" :class="{'active': menuVisibleList[index]}">
                <div class="menu font-14">결제수단 변경</div>
                <div class="menu font-14" @click="onOpenModal" >배송지 변경</div>
              </div>
            </div>
            <!-- //기본 레이아웃  -->

            <!-- 정기구매 철회 버튼 눌렀을 경우 해당 레이아웃으로 변경  -->
            <i v-if="0" class="ico delete flex-shrink0"/>
          <!-- //정기구매 철회 버튼 눌렀을 경우 해당 레이아웃으로 변경  -->
          </div>

          <div class="member-name-area mt8">
            <span class="font-14 medium gray04-color">{{ item.orderResponse.receiver.lastName + item.orderResponse.receiver.firstName }}</span>
            <span class="font-14 medium gray04-color ml4">{{ format.mobileFormat(item.orderResponse.receiver.mobile) }}</span>
          </div>

          <div class="font-12 medium gray04-color">[{{ item.orderResponse.receiver.zipCode }}] {{ generateAddress(item) }}</div>

          <div class="autoship-payment-area">
            <div class="flex align-center">
              <div class="font-14 gray07-color medium pr8">결제 예정일 2024.06.27 </div>
              <div class="font-14 gray07-color medium pl8 border-left-1-gray01">신한카드 {{ item.orderResponse.summary.cardPaymentInfo.cardNumber.split('').reverse().slice(0, 4).reverse().join('') }}</div>
            </div>

            <div class="flex align-center">
              <div class="flex align-center gap2">
                <span class="font-14 gray07-color medium">연속 회차</span>
                <i class="ico question pointer small" @click="$notify(`${item.round}회차`, '현재 구매 회차', 'w147')"/>
              </div>
              <div class="flex align-center gap4 ml8">
                <!-- 활성화될 경우 class 'active' 추가 -->
                <i class="ico complate" :class="{active: item.round >= 1 }" />
                <i class="ico complate" :class="{active: item.round >= 2}"/>
                <i class="ico gift" :class="{active: item.round === 3}"/>
              </div>
            </div>
          </div>

          <RButton
            :label="'상품 변경하기'"
            class="btn full medium type02 mb16"
            @click="() => onOpenAutoshipAddProduct('change', item)"
          />

        </div>

        <q-slide-transition>
          <ul v-if="isVisibleProduct && isVisibleProduct[index]" class="delivery-order-area">
            <li v-for="prouduct in item.orderResponse.products" :key="prouduct.productId">
              <div class="field">
                <div class="prd-img-area" @click="onSoldOutOpenModal">
                  <img :src="addPrefixForImage(item.thumbnailUrl)" alt="">
                  <div class="sold-out-area small">
                    <div class="sold-out-bg">
                      <span class="pre-line">{{ $t('CA_SoldOut') }}</span>
                    </div>
                  </div>
                </div>
                <div class="delivery-order-info-area">
                  <div class="prd-name">{{ prouduct.productNameInfo.fullName }}</div>
                  <div class="prd-option-area">
                    <div>{{ prouduct.quantity }}개</div>
                  </div>
                  <div class="prd-price-area">
                    <span>{{ $moneyFormat(prouduct.salesAmount) }}</span>
                    <span>{{ $t('CM_Won') }}</span>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </q-slide-transition>
        <div class="delivery-order-list-area mt0" @click="isVisibleProduct[index] = !isVisibleProduct[index]">
          <div class="order-count-text-area">
            <div class="text-area">
              <span>총</span>
              <span>{{ item.orderResponse.products.length }}</span>
              <span>건</span>
            </div>

            <div class="text">주문 상품 목록 펼쳐보기</div>
          </div>
          <i class="ico arrow-top-type02-b drop-down-icon" :class="{'rotate':isVisibleProduct && isVisibleProduct[index]}"></i>
        </div>

        <div class="mt16 mb8 flex align-center gap8">
          <span class="font-16 medium primary09-color">{{ $moneyFormat(item.orderResponse.summary.salesAmount) }}{{ $t('CM_Won') }}</span>
          <span class="font-12 success04-color">{{ item.orderResponse.summary.totalSpAfterDiscount }} SP / {{ item.orderResponse.summary.totalBPAfterDiscount }} BP</span>
        </div>

        <!-- 정기구매 징계인 경우 버튼 disable -->
        <div v-if="1" class="flex-btn-area">
          <RButton
            :label="'건너뛰기 1/2회'"
            class="btn full medium type03"
            @click="openAutoshipChangePayment"
          />
          <RButton
            :label="'즉시 결제'"
            class="btn full medium type03"
          />
        </div>
        <!-- //정기구매 징계인 경우 버튼 disable -->

        <!-- 정기구매 철회인경우 -->
        <div v-if="0" class="flex-btn-area">
          <RButton
            :label="'정기구매 재시작'"
            class="btn full medium type03"
          />
        </div>
        <!-- //정기구매 철회인경우 -->

      </li>
    </ul>

    <ul class="explanation-text gray font-12 mlr16 mt32 mb32">
      <li><span class="medium">연속 회차: </span>정기구매를 매일 꾸준히 이용하시는 경우 연속 회차 3회 마다 <span class="medium">혜택이 제공</span>됩니다.</li>
      <li class="mt8"><span class="medium">건너뛰기: </span>건너뛰기는 정기구매 마다 총 2이 제한되며, 초과 시 추가 이용이 불가합니다.</li>
      <li class="mt8"><span class="medium">즉시 결제: </span>결제일 전에 미리 즉시결제를 할 수 있으며, 결제 실패 시 즉시결제로 주문할 수 있습니다.</li>
      <li class="mt8">정기구매 상품, 결제수단, 주소를 변경할 수 있으며, 결제일과 재결제일에는 변경할 수 없습니다.</li>
      <li class="mt8">정기구매를 취소하려면 아래의 '정기구매 철회' 버튼을 누르고, 해당 항목 옆의 휴지통 아이콘을 클릭하세요.</li>
    </ul>

    <RButton class="btn type13 mlr16" label="정기구매 철회" @on-click=""></RButton>

    <div class="bottom-btn">
      <span class="block mb8 text-center font-14 gray03-color">정기구매 총 10개까지 구독하실 수 있습니다.</span>
      <RButton class="btn full small type11" label="" @on-click="router.push('/autoship/init')">
        <template #content>
          <span class="extra-bold font-20">정기구매 하나 더 (2/10)</span>
        </template>
      </RButton>
    </div>
  </div>

  <!-- 결제 정보 변경하기 -->
  <FullPageModal
    ref="autoshipChangePayment"
    class="title-mb0 ">
    <template #title>
      <h4>결제 정보 변경</h4>
    </template>
    <template #body>
      <q-list bordered class="dropdown type02 ">
        <q-expansion-item>
          <template #header>
            <q-item-section class="left-area">
              나의 결제수단 등록
            </q-item-section>

            <q-item-section side class="right-area" />
          </template>

          <q-card class="pl16 pr8 fullpage-card">

            <div class="mb16 pr8">
              <div class="primary09-color font-16 medium mb10">다음 결제 예정일은 <b class="success04-color">2024년 05월 23일</b> 입니다.</div>
              <span class="font-12 gray03-color">*결제일은 2~25일 내 지정할 수 있습니다.</span>
            </div>

            <div class="flex align-center justify-center gap16 mb16 pr8">
              <i class="ico date-n"></i>
              <span class="font-14 primary09-color">매월</span>

              <div class="flex align-center gap8">
                <RSelectBox
                  v-model="dateSelect"
                  placeholder-text="DD"
                  :options="selectOptions"
                  :disable="false"
                  class="select-box type04 small"
                />
                <span class="font-14 primary09-color">일</span>
              </div>
            </div>

            <span class="font-12 block gray04-color mb16 pr8">*정기구매 결제카드는 리만페이에 등록된 카드와 다릅니다.<br>&nbsp; 정기구매 결제는 카드만 등록할 수 있어요.</span>

            <ul class="card-list payment-card-list scroll type01 pr6">
              <li>
                <div>
                  <div class="flex align-center gap4 no-wrap">
                    <i class="ico card flex-shrink0" />
                    <div class="font-16 ml4">신한카드</div>
                    <div class="font-14 gray05-color">(1234)</div>
                  </div>

                  <i class="ico delete flex-shrink0" />
                </div>
              </li>

              <li>
                <div>
                  <div class="flex align-center gap4 no-wrap">
                    <i class="ico card flex-shrink0"></i>
                    <div class="font-16 ml4">신한카드</div>
                    <div class="font-14 gray05-color">(1234)</div>
                    <i class="ico riman-coin-m flex-shrink0" />
                  </div>

                  <i class="ico delete flex-shrink0" />
                </div>
              </li>

              <li class="active">
                <div>
                  <div class="flex align-center gap4 no-wrap">
                    <i class="ico card flex-shrink0" />
                    <div class="font-16 ml4">신한카드</div>
                    <div class="font-14 gray05-color">(1234)</div>
                  </div>
                  <i class="ico check-bg-m flex-shrink0" />
                </div>
              </li>

              <q-slide-transition>
                <li v-if="isVisibleCard">
                  <div>
                    <div class="flex align-center gap4 no-wrap">
                      <i class="ico card flex-shrink0" />
                      <div class="font-16 ml4">신한카드</div>
                      <div class="font-14 gray05-color">(1234)</div>
                      <i class="ico riman-coin-m flex-shrink0" />
                    </div>

                    <i class="ico delete flex-shrink0" />
                  </div>
                </li>
              </q-slide-transition>
            </ul>

            <div class="pr8">
              <RButton class="btn full type22 mt8" label="정기구매 카드 추가" @on-click="" />
            </div>

            <div
              class="delivery-order-list-area mt16 mb24 pr8"
              @click="isVisibleCard = !isVisibleCard"
            >
              <div class="order-count-text-area gap4">등록한 결제수단 더보기<i class="ico arrow-top-type02-b drop-down-icon" :class="{'rotate':isVisibleCard}" /></div>
            </div>
          </q-card>
        </q-expansion-item>
      </q-list>

      <div class="popup-bottom-area">
        <div class="popup-bottom-btn">
          <RButton class="btn full small type02" label="저장하기" />
        </div>
      </div>
    </template>

  </FullPageModal>
  <!-- //결제 정보 변경하기 -->

  <!-- 상품추가하기 -->

  <!-- //상품추가하기 -->

</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive, watch } from 'vue'
import AutoshipAddProductModal from './modal/AutoshipAddProductModal'
import { useRouter } from 'vue-router'
import orderService from '@/http/services/order'
import autoshipService from '@/http/services/autoship'
import { useMainStore } from '@/store/mainStore'
import format from '@/utils/format'
import { addPrefixForImage } from '@/utils/common'

const { proxy } = getCurrentInstance()
const isVisibleProduct = ref()
const isVisibleCard = ref(false)
const dateSelect = ref(null)
const router = useRouter()
const orderListArea = ref(null)
const orderListAreaHeight = ref([])
const autoshipChangePayment = ref()
const mainStore = useMainStore()
const { data: autoshipList } = autoshipService.getSubscribe()
const menuVisibleList = ref([false, false])

const onToggleMenuVisible = (index) => {
  menuVisibleList.value[index] = !menuVisibleList.value[index] //
}

const onOpenModal = () => {
  proxy.openModal(
    {
      parent: proxy,
      component: 'AddressListModal',
      componentProps: { title: '정기구매 ' },
      modeless: false
    })
}
function handleResize() {
  updateOrderAreaHeight()
}

function updateOrderAreaHeight() {
  if (orderListArea.value) {
    orderListAreaHeight.value = []
    orderListArea.value.forEach(element => {
      orderListAreaHeight.value.push(element.scrollHeight)
    })
  }
}
// onBeforeUnmount(() => {
//   window.removeEventListener('resize', handleResize)
// })

const openAutoshipChangePayment = () => {
  autoshipChangePayment.value.show()
}
function addProduct(products) {
}
function onOpenAutoshipAddProduct(type, item) {
  proxy.openModal(
    {
      parent: proxy,
      component: AutoshipAddProductModal,
      componentProps: {
        type,
        products: item.orderResponse.products,
        // subscriptionId: item.orderResponse.identification
        subscriptionId: '636463097543920317'

      },
      modeless: false
    }).onOk(() => {
    addProduct()
  })
}

const selectOptions = [
  { label: 'test1', value: 'test1' },
  { label: 'test2', value: 'test2' },
  { label: '직접입력', value: 'directInput' }
]

function generateAddress(item) {
  const address = item.orderResponse.receiver
  return address.city + ' ' + address.state + ' ' + address.address + address.addressDetail
}
watch(autoshipList, v => {
  if (v) {
    isVisibleProduct.value = autoshipList.value.map(item => false)
  }
})
onMounted(() => {
  updateOrderAreaHeight()
  window.addEventListener('resize', handleResize)
  if (autoshipList.value) {
    isVisibleProduct.value = autoshipList.value.map(item => false)
  }
})
</script>

<style lang="scss" scoped>

</style>
