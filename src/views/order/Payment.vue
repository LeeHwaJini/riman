<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t('OP_Order') }}</h3>
    </div>
    <q-list bordered class="dropdown type02">
      <q-expansion-item v-model="openAddress">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_DeliveryInfo') }}
          </q-item-section>
          <q-item-section v-if="selectAddressInfo !== null" side class="right-area">
            <!-- 정보 없을 경우 영역 제거 -->
            <div v-if="!openAddress" class="">
              <div class="info-area">
                <span>{{ selectAddressInfo?.lastName }}{{ selectAddressInfo?.firstName }}</span>
                <span>{{ format.mobileFormat(selectAddressInfo?.mobileNumber) }}</span>
              </div>
              <div class="delivery-area">
                ({{ selectAddressInfo?.zipcode }}) {{ selectAddressInfo?.address1 }} {{ selectAddressInfo?.address2 }}
              </div>
            </div>
            <!-- //정보 없을 경우 영역 제거 -->
          </q-item-section>
        </template>
        <q-card>
          <!-- 회원이 주문했을 경우 -->
          <div v-if="userType === 1" class="delivery-info-area">
            <!-- 배송지 등록 안 되어있을 경우 -->
            <template v-if="selectAddressInfo === null">
              <div class="delivery-add-text">
                {{ $t('OP_DeliveryInfo2') }}
              </div>
              <RButton class="btn full small type03" :label="$t('OP_DeliveryAdd')" @click="onOpenModal"/>
            </template>
            <!-- //배송지 등록 안 되어있을 경우 -->
            <!-- 배송지 등록 되어있을 경우 -->
            <template v-else>
              <div class="text-right">
                <RButton
                  class="btn type13"
                  :label="$t('OP_DeliveryList')"
                  @click="onOpenModal"
                />
              </div>
              <ul class="delivery-select-area mb40">
                <li>
                  <div class="delivery-name-area">
                    <span v-if="selectAddressInfo?.addressName">{{ selectAddressInfo?.addressName }}</span>
                    <span v-if="selectAddressInfo?.defaultValue" class="btn type14">{{ $t('OP_DefaultDelivery') }}</span>
                    <span v-if="selectAddressInfo?.fixedTermYn" class="btn type21">{{ $t('OP_SaveDelivery') }}</span>
                  </div>
                  <div class="member-name-area">
                    <span>{{ selectAddressInfo?.lastName }}</span>
                    <span>{{ selectAddressInfo?.firstName }}</span>
                  </div>
                  <div class="delivery-ph-area">{{ format.mobileFormat(selectAddressInfo?.mobileNumber) }}</div>
                  <div class="delivery-addr-area">
                    <span>({{ selectAddressInfo?.zipcode }})</span>
                    <span>{{ selectAddressInfo?.address1 }}</span>
                    <span>{{ selectAddressInfo?.address2 }}</span>
                  </div>
                </li>
              </ul>
              <RSelectBox
                v-model="selectFilterModel"
                :placeholder-text="$t('OP_SelectMessage')"
                :options="selectOptions"
                :disable="false"
                class="select-box type04"
              />
              <RTextarea v-if="selectFilterModel === 'directInput'" v-model="textareaValue" :placeholder="$t('OP_InputMessage')" class="input-textarea mt4"/>
            </template>
            <!-- //배송지 등록 되어있을 경우 -->
          </div>
          <!-- //회원이 주문했을 경우 -->
        </q-card>
      </q-expansion-item>
      <q-expansion-item v-model="openProduct">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_OrderProduct') }}
          </q-item-section>
          <q-item-section side class="right-area">
            <!-- 정보 없을 경우 영역 제거 -->
            <div v-if="!openProduct" class="delivery-order-text">
              <span>{{ $moneyFormat(paymentInfo?.productsAmount) }}</span>
              <!-- <span>{{ $moneyFormat(productBaseDto ? productBaseDto.quantity : 0) }}건</span> -->
            </div>
            <!-- //정보 없을 경우 영역 제거 -->
          </q-item-section>
        </template>
        <q-card>
          <div class="delivery-info-area pb0">
            <ul class="delivery-order-area">
              <li>
                <div>
                  <div class="prd-img-area">
                    <img :src="addPrefixForImage(productList[0]?.thumbnailUrl)" alt="">
                  </div>
                  <div class="delivery-order-info-area">
                    <div class="prd-name">{{ productList[0]?.productNameDto.fullName }}</div>
                    <div class="prd-option-area">
                      <div v-if="productList[0]?.productBaseDto?.optionValues.length > 0">{{ productList[0]?.productBaseDto?.optionValues[0].optionValue }}</div>
                      <div>{{ productList[0]?.productBaseDto?.quantity }}{{ $t('CM_Unit') }}</div>
                    </div>
                    <div class="prd-price-area">
                      <span>{{ $moneyFormat(productList[0]?.saleAmount * productList[0]?.productBaseDto?.quantity) }}</span>
                      <span>{{ $t('CM_Won') }}</span>
                    </div>
                  </div>
                </div>
              </li>
              <q-slide-transition>
                <li v-if="isVisibleItem">
                  <div v-for="item in productList.slice(1)" :key="item.productBaseDto.productId">
                    <div class="prd-img-area">
                      <img :src="addPrefixForImage(item.thumbnailUrl)" alt="">
                    </div>
                    <div class="delivery-order-info-area">
                      <div class="prd-name">{{ item.productNameDto.fullName }}</div>
                      <div class="prd-option-area">
                        <div v-if="item.productBaseDto?.optionValues.length > 0">{{ item.productBaseDto?.optionValues[0].optionValue }}</div>
                        <div>{{ item.productBaseDto?.quantity }}{{ $t('CM_Unit') }}</div>
                      </div>
                      <div class="prd-price-area">
                        <span>{{ $moneyFormat(item.saleAmount * item.productBaseDto?.quantity) }}</span>
                        <span>{{ $t('CM_Won') }}</span>
                      </div>
                    </div>
                  </div>
                </li>
              </q-slide-transition>
            </ul>

            <div v-if="productList.length > 1" class="delivery-order-list-area" @click="isVisibleItem = !isVisibleItem">
              <div class="order-count-text-area">
                <div class="text-area">
                  <span>{{ $t('CM_Total') }}</span>
                  <span>{{ orderList.length }}</span>
                  <span>{{ $t('CM_Count') }}</span>
                </div>
                <div v-if="!isVisibleItem" class="text">{{ $t('OP_ProductExpand') }}</div>
                <div v-if="isVisibleItem" class="text">{{ $t('OP_ProductClose') }}</div>
              </div>
              <i class="ico arrow-top-type02-b drop-down-icon" :class="{'rotate':isVisibleItem}"></i>
            </div>

            <div class="delivery-order-price-area">
              <div class="field top-menu" @click="isVisiblePrice = !isVisiblePrice">
                <div class="flex align-center gap4">
                  <div>{{ $t('OP_OrderAmount') }}</div>
                  <i class="ico arrow-top-type02-n drop-down-icon" :class="{'rotate':isVisiblePrice}"></i>
                </div>
                <div>
                  <span>{{ $moneyFormat(paymentInfo?.productsAmount) }}</span>
                  <span>{{ $t('CM_Won') }}</span>
                </div>
              </div>
              <q-slide-transition>
                <div v-if="isVisiblePrice">
                  <div class="field">
                    <div>{{ $t('OP_ProductAmount') }}</div>
                    <div>{{ $moneyFormat(paymentInfo?.productsAmount) }}{{ $t('CM_Won') }}</div>
                  </div>
                  <!-- <div v-if="isPlanner" class="field">
                    <div>상품할인 전</div>
                    <div class="span-text gray">
                      <span>{{ $moneyFormat(paymentInfo?.totalSpOrigin) }}SP</span>
                      <span>{{ $moneyFormat(paymentInfo?.totalBpOrigin) }}BP</span>
                    </div>
                  </div>
                  <div v-if="isPlanner" class="field">
                    <div>상품할인 후</div>
                    <div class="span-text">
                      <span>{{ $moneyFormat(paymentInfo?.totalSpAfterDiscount) }}SP</span>
                      <span>{{ $moneyFormat(paymentInfo?.totalBPAfterDiscount) }}BP</span>
                    </div>
                  </div> -->
                </div>
              </q-slide-transition>
            </div>
          </div>
        </q-card>
      </q-expansion-item>
      <q-expansion-item v-model="openCoupon">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_CouponPoint') }}
          </q-item-section>
          <!-- <q-item-section side class="right-area">
            <span class="success04-color bold">{{ $t('OP_Coupon1') }}</span>
          </q-item-section> -->
        </template>
        <q-card class="order-coupon-area">
          <!-- <div class="coupon-top-area">
            <RSwitch
              v-model="isUse"
              :label="$t('OP_Coupon2')"
              class="switch type01"
            />
          </div> -->

          <!-- 2024.12.10 추후에 쿠폰 추가될 시  pt0 class 제거-->
          <div class="coupon-bottom-area pt0">
            <!-- <RButton class="btn type03 full small" :label="$t('OP_FindCoupon')" @click="onCouponOpenModal"/>
            <div class="order-coupon-use-area">
              <div class="coupon-text-area" @click="isVisibleCoupon = !isVisibleCoupon" >
                <div class="left-text-area flex align-center gap4">
                  <div class="">
                    <span>{{ $t('CM_Total') }}</span>
                    <span>{{ $moneyFormat(selectedCouponList.length) }}</span>
                    <span>{{ $t('CM_Unit') }} {{ $t('CM_Use') }}</span>
                  </div>
                </div>
                <div class="right-text-area type01">
                  <span v-if="selectedCouponList.length > 0" class="success04-color bold">{{ $t('OP_Coupon1') }}</span>
                  <span>{{ $moneyFormat(couponDiscountTotal) }}</span>
                  <span>{{ $t('CM_Won') }}</span>
                </div>
              </div>
              <q-slide-transition>
                <div v-if="selectedCouponList.length > 0">
                  <ul class="list type02">
                    <li v-for="item of selectedCouponList" :key="item.couponId">
                      <div class="top-area">
                        <span>{{ item.couponName }}</span>
                        <i class="ico close-g" style="cursor: pointer;" @click="onDeleteSelectedCoupon(item.couponId)"></i>
                      </div>
                      <div class="bottom-area">
                        <div class="left-text-area">
                          <span>{{ $t('CM_LimitDate') }}</span>
                          <span>{{ formatDate(item.expiredDate, 'YYYY-MM-DD') }}</span>
                        </div>
                        <div class="right-text-area">- {{ $moneyFormat(item.discountPrice) }}{{ $t('CM_Won') }}</div>
                      </div>
                    </li>
                  </ul>
                  <span class="discount-amount-text text-right block">*{{ $t('OP_CouponDiscount') }}</span>
                </div>
              </q-slide-transition>
            </div> -->

            <div class="point-use-area">
              <!-- <div class="point-use-text-area ">
                <div class="left-text-area">
                  {{ $t('OP_Point') }}
                </div>

                <div class="right-text-area type01">
                  <span v-if="pointData?.totalPoint > 0" class="success04-color bold">{{ $t('OP_Clap') }}</span>
                  <span>{{ $moneyFormat(pointData?.totalPoint) }}</span>
                  <span>P</span>
                </div>
              </div> -->

              <div class="input-btn-area flex gap4">
                <RCurrencyInput v-model="point" :max-value="maxPoint" class="login-input login-input--id flex1" @blur="onInputBlur"/>
                <!-- <RInput v-model="point" :is-clear="false" class="login-input login-input--id flex1" @keypress="isNumber($event)" /> -->
                <!-- 포인트 모두 사용했을 경우 RButton class="btn small type01" -->
                <RButton class="btn small type02" :label="$t('OP_UseAll')" @click="onUseAllpoint"/>
                <!-- //포인트 모두 사용했을 경우 -->
              </div>

              <div class="held-point-area">
                <div class="held-point-text-area flex align-center">
                  <b>{{ $t('OP_Have') }} : {{ $moneyFormat(pointData?.activePoint) }}P</b>
                  <span>{{ $t('OP_DeletePoint') }} {{ $moneyFormat(pointData?.nextExpectTerminatePoint) }}P</span>
                </div>
                <!-- <span class="gray04-color font-12">*포인트는 10P이상 사용 가능하며, 10P단위로 사용할 수 있습니다.</span> -->
              </div>

              <div class="order-checkbox-agree-area ">
                <!-- <RCheckbox v-model="checkbox" class="checkbox-area type02">
                  <span class="gray07-color">반품/환불 시 소멸 포인트 미반환 동의</span>
                </RCheckbox> -->
                <span class="block gray04-color font-12">* {{ $t('OP_PointDesc1') }}</span>
                <span class="block gray04-color font-12">* {{ $t('OP_PointDesc2') }}</span>
              </div>
            </div>
          </div>

        </q-card>
      </q-expansion-item>

      <q-expansion-item v-model="openReceipt">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_MoneyReceipt') }}
          </q-item-section>
          <q-item-section side class="right-area">
            <div v-if="!openReceipt" class="order-detail-top-area">
              <span v-if="cashReceiptModel" class="success04-color bold">{{ radioOptions.filter((i) => i.value === cashReceiptModel)[0].label }}</span>
            </div>
          </q-item-section>
        </template>

        <q-card class="cash-receipts-area plr16 pb16">
          <!-- <div class="mb16 font-12 gray04-color">*{{ $t('OP_ReceiptDesc1') }} <b>{{ $t('OP_VirtualAmount') }}</b> {{ $t('OP_ReceiptDesc2') }}</div> -->

          <div class="explanation-text red mt0 mb24">
            <div class="flex align-center mb16">
              <i class="ico info" />
              <b class="font-16 error-color ml4">{{ $t('OP_AccountCheck') }}</b>
            </div>

            <span class="block gray07-color font-14" v-html="$t('OP_VirtualReceipt1')" />
            <span class="block gray07-color font-14" v-html="$t('OP_VirtualReceipt2')" />
          </div>

          <RRadio v-model="cashReceiptModel" class="radio-area type02" :options="radioOptions" @update:model-value="isChangeReceipt" />
          <div v-if="cashReceiptModel==='DEDUCTION'" class="field">
            <RInput v-model="cashReceiptInfo" :placeholder="$t('USR_ValidPhoneNumber1')" class="login-input login-input--id" maxlength="11" @update:model-value="isNumber"/>
          </div>

          <div v-if="cashReceiptModel==='EVIDENCE_OF_EXPENDITURE'" class="field">
            <RInput v-model="cashReceiptInfo" :placeholder="$t('VA_Evidence')" class="login-input login-input--id" maxlength="10" @update:model-value="isNumber"/>
          </div>
        </q-card>
      </q-expansion-item>

      <!-- <q-expansion-item>
        <template #header>
          <q-item-section class="left-area">
            결제수단
          </q-item-section>
          <q-item-section side class="right-area">
            <span>리만페이</span>
          </q-item-section>
        </template>
        <q-card class="plr16 pb16">
          <div>결제 API</div>
        </q-card>
      </q-expansion-item> -->
      <q-expansion-item v-model="openPayment">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_PaymentAmount') }}
          </q-item-section>
          <q-item-section side class="right-area">
            <div v-if="!openPayment" class="order-detail-top-area">
              <span v-if="disCountPoint > 0" class="success04-color bold">{{ $t('OP_PaymentDesc1') }}</span>
              <span>{{ $moneyFormat(totalPrice) }}{{ $t('CM_Won') }}</span>
            </div>
          </q-item-section>
        </template>
        <q-card class="plr16 pb16">
          <ul class="order-result-detail-price-area">
            <li>
              <span class="">{{ $t('OP_ProductAmount') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.productsAmount) }}{{ $t('CM_Won') }}</span>
                <!-- <i v-if="isPlanner" class="ico riman-coin-y"></i> -->
              </div>
            </li>
            <li>
              <span class="">{{ $t('OP_DeliveryAmount') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.shippingFee) }}{{ $t('CM_Won') }}</span>
              </div>
            </li>
            <!-- <li>
              <span class="">{{ $t('OP_CouponDiscount2') }}</span>
              <div class="price-text-area">
                <span><span v-if="selectedCouponList[0]?.discountPrice > 0">-</span>{{ $moneyFormat(selectedCouponList[0] ? selectedCouponList[0]?.discountPrice : 0) }}{{ $t('CM_Won') }}</span>
                <i v-if="isPlanner" class="ico riman-coin-y"></i>
              </div>
            </li> -->
            <!-- <li v-if="isPlanner">
              <span class="">등급할인</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.membershipDiscount) }}원</span>
                <i class="ico riman-coin-y"></i>
              </div>
            </li> -->
            <li>
              <span class="">{{ $t('OP_UsePoint') }}</span>
              <div class="price-text-area">
                <span><span v-if="disCountPoint > 0">-</span>{{ $moneyFormat(disCountPoint) }}{{ $t('CM_Won') }}</span>
                <!-- <i v-if="isPlanner" class="ico riman-coin-y"></i> -->
              </div>
            </li>
          </ul>
          <ul class="order-result-price-area">
            <li>
              <span class="left-title-area primary09-color">{{ $t('OP_TotalPayment') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(totalPrice) }}</span>
                <span>{{ $t('CM_Won') }}</span>
              </div>
            </li>
            <li>
              <span class="left-title-area">{{ $t('OP_SavePoint') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.pointEarn) }}</span>
                <span>P</span>
              </div>
            </li>
            <!-- <li v-if="isPlanner">
              <span class="left-title-area">구매 SP | BP</span>
              <div>
                <div class="price-text-area">
                  <span>{{ $moneyFormat(paymentInfo?.totalSpFinal) }}</span>
                  <span>SP</span>
                </div>
                <div class="price-text-area">
                  <span>{{ $moneyFormat(paymentInfo?.totalBpFinal) }}</span>
                  <span>BP</span>
                </div>
              </div>
            </li> -->
          </ul>
        </q-card>
      </q-expansion-item>
    </q-list>

    <div class="order-bottom-checkbox-area payment-bottom-checkbox-area plr16">
      <div class="all-checkbox-area border-gray01 mb16 pt0">
        <RCheckbox v-model="allAgree" class="checkbox-area type02">
          <span class="gray07-color font-16 medium">{{ $t('OP_Agreements') }}</span>
        </RCheckbox>
      </div>

      <div v-for="(agree, index) in agreements" :key="index" class="checkbox-flex-start-area">
        <RCheckbox v-model="checkList" :val="agree" class="checkbox-area type02" >
          <span class="gray07-color">{{ $t(agree.contents) }}</span>
        </RCheckbox>
        <div>
          <div v-if="agree.detail" class="detail" @click="onOpenTermsModal(agree.term)">{{ $t('CM_ToDetail') }}</div>
        </div>
      </div>
    </div>

    <div class="bottom-btn">
      <RButton class="btn full small type11" label="" @click="onClickPayment">
        <template #content>
          <span class="btn-price-text">{{ $moneyFormat(totalPrice) }}{{ $t('CM_Won') }}</span>
          <span>{{ $t('OP_DoPayment') }}</span>
        </template>
      </RButton>
    </div>
    <!-- -->
    <responsive-modal
      ref="couponModal"
      :title="$t('OP_AvailableCoupon')"
      class="coupon-use-modal bottom-btn-modal"
    >
      <template #description>
        <template v-if="couponList.length > 0">
          <div class="coupon-list-area">
            <div class="pr8">
              <RButton class="btn full large none-select-btn" :class="{'active': 1}" :label="$t('OP_NonSelected')" @click="onResetCoupon" />
            </div>

            <ul class="coupon-list popup-scroll large scroll type01">
              <li v-for="item of couponList" :key="item.couponId" :class="{'disabled': paymentInfo?.productsAmount < item.minimumPurchaseAmount}" @click="onClickCoupon(item.couponId)">
                <div class="flex align-center justify-between">
                  <span class="coupon-text">{{ item.couponName }}</span>
                  <!--
                **현재는 당일이지만 추후에 날짜 변경 될 수도 있음**
                유효기간이 당일인 경우 <span class="date error-color">D-00</span>
                아닐 경우  <span class="date">D-00</span>
                -->
                  <span class="date error-color">D-{{ item.daysToDday }}</span>
                </div>
                <div class="coupon-price-area">
                  <span>{{ $moneyFormat(item.discountPolicy.discountType.code === 'AMOUNT_DISCOUNT' ? item.discountAmount : item.discountPolicy.discountRate) }}</span>
                  <span v-if="item.discountPolicy.discountType.code === 'AMOUNT_DISCOUNT'">{{ $t('CM_Won') }}</span>
                  <span v-else>%</span>
                </div>
                <div v-if="item.discountPolicy.discountType.code === 'AMOUNT_DISCOUNT'" class="use-price-area">{{ $t('OP_MinDiscountAmount') }} {{ $moneyFormat(item.minimumPurchaseAmount) }}</div>
                <div v-else class="use-price-area">{{ $t('OP_MaxDiscountAmount') }} {{ $moneyFormat(item.maxDiscountAmount) }}</div>
                <!--
                **현재는 당일이지만 추후에 날짜 변경 될 수도 있음**
                유효기간이 당일인 경우 <span class="error-color">yyyy.mm.dd</span>
                아닐 경우  <span class="">yyyy.mm.dd</span>
                -->
                <div class="use-date">{{ formatDate(item.publishDate, 'YYYY-MM-DD') }} - <span class="error-color">{{ formatDate(item.expiredDate, 'YYYY-MM-DD') }}</span></div>
              </li>
            </ul>
          </div>
          <div class="popup-bottom-area">
            <div class="popup-bottom-btn">
              <!-- <RButton class="btn full small type02" label="사용하기" @on-click="" /> -->
            </div>
          </div>
        </template>

        <!-- 쿠폰 없을경우 -->
        <div v-else class="cart-none-area coupon-none-area mb24">
          <img src="@assets/images/cart_none.svg" alt="">
          <p class="title">{{ $t('OP_NoCoupon') }}</p>
        </div>
        <!-- //쿠폰 없을경우 -->

      </template>
    </responsive-modal>
  </div>
</template>

<script setup>

import { ref, getCurrentInstance, onMounted, watch, computed, onUnmounted } from 'vue'
import { sessionDataManager, ORDER_DATA, ORDER_PREPATH, PAYMENT_INFO, PAYMENT_RESULT, SHOP_REFERRER_CODE } from '@utils/dataManager'
import { useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@store/mainStore'
import orderService from '@/http/services/order'
import format from '@/utils/format'
import { formatDate } from '@/utils/dateFormat'
import { addPrefixForImage } from '@/utils/common'
import TossModal from '@components/modal/TossModal'
import etcService from '@/http/services/etc'
import { checkPlanner } from '@/utils/common'

const { proxy } = getCurrentInstance()

const openAddress = ref(true)
const openProduct = ref(true)
const openCoupon = ref(true)
const openReceipt = ref(true)
const openPayment = ref(true)
const isPlanner = computed(() => checkPlanner())
const point = ref(0)
const selectFilterModel = ref(null)
const textareaValue = ref(null)
const isUse = ref(false)
const cashReceiptModel = ref('')
const cashReceiptInfo = ref('')
const selectAddressInfo = ref(null)
const maxPoint = ref(null)
const router = useRouter()
const route = useRoute()
const mainStore = useMainStore()
const userInfo = mainStore.userInfo
const orderList = JSON.parse(sessionDataManager.get(ORDER_DATA))
const returnUrl = sessionDataManager.get(ORDER_PREPATH)
const identification = ref('')
const productList = ref([])
const paymentInfo = ref(null)
const couponList = ref([])
const couponDiscountTotal = ref(0)
const pointData = ref(null)
const orderId = ref('')
const orderName = ref('')
const selectedCouponList = ref([])
const totalProductCount = ref(0)
const totalPrice = ref(0)
const disCountPoint = ref(0)
const query = route.query

const agreements = [
  {
    idx: 1,
    contents: 'OP_Agreement1',
    detail: false
  },
  {
    idx: 2,
    contents: 'OP_Agreement2',
    detail: true,
    term: 'NM_PERSONAL_INFORMATION'
  },
  {
    idx: 3,
    contents: 'OP_Agreement4',
    detail: true,
    term: 'TOSS_EPAYMENT_AGREEMENT'
  },
  {
    idx: 4,
    contents: 'OP_Agreement5',
    detail: true,
    term: 'TOSS_EFINANCE_TERMS'
  },
  {
    idx: 5,
    contents: 'OP_Agreement6',
    detail: true,
    term: 'TOSS_PRIVACY_3RD_PARTY_CONSENT'
  }
]

const checkList = ref([])
/**
 * 전체선택
 */
const allAgree = computed({
  get() {
    return checkList.value.length === agreements.length
  },
  set(e) {
    checkList.value = e ? agreements : []
  }
})
const selectOptions = computed(() => [
  { label: proxy.$t('DLV_Delivery1'), value: '도착전 전화주세요' },
  { label: proxy.$t('DLV_Delivery2'), value: '문 앞에 놔주세요' },
  { label: proxy.$t('DLV_Delivery3'), value: '경비실에 맡겨주세요' },
  { label: proxy.$t('DLV_Delivery4'), value: '부재 시 휴대폰 문자 주세요' },
  { label: proxy.$t('DLV_Delivery5'), value: '사무실 앞에 놓아주세요' },
  { label: proxy.$t('DLV_Delivery6'), value: '택배함에 놓아주세요' },
  { label: proxy.$t('DLV_Delivery7'), value: 'directInput' }
])

const radioOptions = computed(() => [
  { label: proxy.$t('RCP_Receipt1'), value: 'DEDUCTION' },
  { label: proxy.$t('RCP_Receipt2'), value: 'EVIDENCE_OF_EXPENDITURE' },
  { label: proxy.$t('RCP_Receipt3'), value: '' }
])

const userType = ref(1)

const isVisibleItem = ref(false)
const isVisiblePrice = ref(false)
const isVisibleCoupon = ref(false)

const onOpenModal = () => {
  proxy.openModal(
    {
      parent: proxy,
      component: 'AddressListModal',
      componentProps: {},
      modeless: false
    })
    .onOk((val) => {
      getAddressInfo(val)
    })
}

const isValidValue = () => {
  if (!selectAddressInfo.value) {
    proxy.$alert(proxy.$t('ALT_Delivery'))
    return false
  }
  if (cashReceiptModel.value === 'DEDUCTION') {
    if (cashReceiptInfo.value === '') {
      proxy.$alert(proxy.$t('ALT_InputMobile'))
      return false
    }
  }
  if (cashReceiptModel.value === 'EVIDENCE_OF_EXPENDITURE') {
    if (cashReceiptInfo.value === '') {
      proxy.$alert(proxy.$t('VA_Evidence'))
      return false
    }
  }
  if (checkList.value.findIndex((i) => i.idx === 1) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement1'))
    return false
  }
  if (checkList.value.findIndex((i) => i.idx === 2) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement2'))
    return false
  }
  if (checkList.value.findIndex((i) => i.idx === 3) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement4'))
    return false
  }
  if (checkList.value.findIndex((i) => i.idx === 4) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement5'))
    return false
  }
  if (checkList.value.findIndex((i) => i.idx === 5) === -1) {
    proxy.$alert(proxy.$t('ALT_Agreement6'))
    return false
  }
  return true
}

const onClickPayment = (rowData) => {
  if (!isValidValue()) return
  const paymentInfoParams = {
    order: {
      identification: identification.value,
      userAddressId: selectAddressInfo.value.userAddressId,
      userId: userInfo.userSeqNo,
      userType: userInfo.userType,
      products: orderList,
      orderType: 'SALES_ORDER',
      discounts: []
    },
    summary: {
      totalCouponDiscount: couponDiscountTotal.value,
      couponDeliveryFeeAmount: paymentInfo.value.couponDeliveryFee,
      autoShipDiscount: paymentInfo.value.autoShipDiscount,
      // membershipDiscount: paymentInfo.value.membershipDiscount,
      pointDiscount: disCountPoint.value,
      salesAmount: totalPrice.value,
      productsAmount: paymentInfo.value.productsAmount,
      pointEarn: Math.floor((totalPrice.value - paymentInfo.value.shippingFee) / 10),
      totalBpOrigin: paymentInfo.value.totalBpOrigin,
      totalBpFinal: paymentInfo.value.totalBpFinal,
      totalSpOrigin: paymentInfo.value.totalSpOrigin,
      // totalSpFinal: paymentInfo.value.totalSpFinal,
      totalSpFinal: 0,
      totalBPAfterDiscount: paymentInfo.value.totalBPAfterDiscount,
      shippingFee: paymentInfo.value.shippingFee
    },
    receiverInfo: {
      firstName: selectAddressInfo.value.firstName,
      lastName: selectAddressInfo.value.lastName,
      mobile: selectAddressInfo.value.mobileNumber,
      phone: selectAddressInfo.value.telNumber,
      addressName: selectAddressInfo.value.addressName,
      email: '',
      zipCode: selectAddressInfo.value.zipcode,
      state: selectAddressInfo.value.state,
      city: selectAddressInfo.value.city,
      address: selectAddressInfo.value.address1,
      addressDetail: selectAddressInfo.value.address2,
      message: selectFilterModel.value === 'directInput' ? textareaValue.value : selectFilterModel.value
    },
    terms: {
      purchaseAgree: true,
      commerceAgree: true,
      commerceTermsId: '4'
    }
  }

  if (query.bagId) {
    paymentInfoParams.baguser = {
      plannerBagId: query.bagId
    }
  }

  if (selectedCouponList.value.length > 0) {
    paymentInfoParams.order.discounts.push({
      discountType: 'COUPON',
      id: selectedCouponList.value[0].couponId,
      value: selectedCouponList.value[0].discountPrice,
      applyOrder: 1
    })
  }

  if (point.value > 0) {
    paymentInfoParams.order.discounts.push({
      discountType: 'POINT',
      value: point.value,
      applyOrder: 1
    })
  }

  if (cashReceiptModel.value !== '') {
    paymentInfoParams.cashReceiptInfo = {
      cashReceiptType: cashReceiptModel.value,
      customerIdentityNumber: cashReceiptInfo.value
    }
  }

  sessionDataManager.set('paymentInfo', JSON.stringify(paymentInfoParams))

  const name = `${productList.value[0].productNameDto.fullName}`

  if (productList.value && productList.value.length > 1) {
    name + ` ${proxy.$t('CM_And')} ${productList.value.length - 1}${proxy.$t('CM_Unit2')}`
  }
  if (paymentInfoParams.summary.salesAmount < 1) {
    onPaymentSuccess()
  } else {
    proxy.openModal(
      {
        parent: proxy, // 필수
        component: TossModal, // 필수
        componentProps: { total: totalPrice.value, orderid: orderId.value, ordername: name }, // 선택 - 팝업창에 값 전달
        modeless: false // 선택
      })
      .onOk(() => {
        proxy.$alert('Modal ok 클릭.')
      })
      .onCancel(() => {})
      .onDismiss(() => {})
  }
}

const postSalesSheet = async () => {
  const param = {
    productsRequest: orderList
  }
  // 시트 생성
  const result = await orderService.postSalesSheet(param)

  if (result && result.data) {
    identification.value = result.data.identification
    const params = {
      identification: result.data.identification
    }
    // 복호화
    const decryptOrderData = await orderService.postDecrypt(params)

    if (decryptOrderData && decryptOrderData.data) {
      orderId.value = decryptOrderData.data.salesOrderNumber
      const orderSheet = await orderService.getOrderSheet(decryptOrderData.data.salesOrderNumber)

      if (orderSheet && orderSheet.data && orderSheet.data.productList && orderSheet.data.productList[0]) {
        productList.value = orderSheet.data.productList
        let count = 0
        for (const item of productList.value) {
          count += item.productBaseDto.quantity
        }

        totalProductCount.value = count

        const name = `${productList.value[0].productNameDto.fullName}`

        if (productList.value && productList.value.length > 1) {
          name + ` ${proxy.$t('CM_And')} ${productList.value.length - 1}${proxy.$t('CM_Unit2')}`
        }

        orderName.value = name
      }
    }

    const summaryParams = {
      identification: result.data.identification,
      userAddressId: selectAddressInfo.value ? selectAddressInfo.value.userAddressId : '',
      userId: userInfo.userSeqNo,
      userType: userInfo.userType,
      products: orderList,
      orderType: userInfo.userSeqNo ? 'SALES_ORDER' : 'GUEST_ORDER'
    }
    if (query.bagId) {
      summaryParams.baguser = {
        plannerBagId: query.bagId
      }
    }
    // 계산서 생성
    const summaryResult = await orderService.postOrderSummary(summaryParams)

    if (summaryResult && summaryResult.data) {
      paymentInfo.value = summaryResult.data.paymentInfo

      // getCouponList(summaryResult.data.paymentInfo.salesAmount)
    }

    if (userInfo.userSeqNo) {
      getPoint()
    }
  }
}

const calculateDiscount = () => {
  if (selectedCouponList.value[0]) {
    const couponDiscount = selectedCouponList.value[0].discountPrice

    if (point.value + couponDiscount > maxPoint.value && point.value + couponDiscount > paymentInfo.value.productsAmount) {
      point.value = paymentInfo.value.productsAmount - couponDiscount
      disCountPoint.value = paymentInfo.value.productsAmount - couponDiscount
    } else {
      disCountPoint.value = point.value
    }
  } else {
    if (point.value > maxPoint.value) {
      point.value = maxPoint.value
      disCountPoint.value = maxPoint.value
    } else {
      disCountPoint.value = point.value
    }
  }
}

const onUseAllpoint = () => {
  point.value = maxPoint.value
  disCountPoint.value = maxPoint.value
  if (selectedCouponList.value[0]) {
    const couponDiscount = selectedCouponList.value[0].discountPrice

    if (point.value + couponDiscount >= maxPoint.value && point.value + couponDiscount > paymentInfo.value.productsAmount) {
      point.value = paymentInfo.value.productsAmount - couponDiscount
      disCountPoint.value = paymentInfo.value.productsAmount - couponDiscount
    } else {
      point.value = maxPoint.value
      disCountPoint.value = maxPoint.value
    }
  } else {
    point.value = maxPoint.value
    disCountPoint.value = maxPoint.value
  }
}

const getCouponList = async () => {
  const params = {
    totalAmount: paymentInfo.value.productsAmount
  }
  const couponResult = await orderService.getOwnedCoupons(params)

  if (couponResult && couponResult.data) {
    couponList.value = couponResult.data.list
  }

  return
}

// 사용자 사용가능한 쿠폰 리스트 가져오기
const getMaxCouponList = async () => {
  const params = {
    totalPaymentAmount: paymentInfo.value.productsAmount,
    orderType: 'STANDARD_ORDER'
  }

  const couponResult = await orderService.getCouponList(params)

  if (couponResult && couponResult.data) {
    selectedCouponList.value = []
    const couponData = couponList.value.filter((i) => i.couponId === couponResult.data.couponId)[0]

    selectedCouponList.value.push(couponData)
    couponDiscountTotal.value = couponData.discountPrice
  }
  if (disCountPoint.value) {
    calculateDiscount()
  }
}

// 사용자 포인트 데이터 가져오기
const getPoint = async () => {
  const pointResult = await orderService.getPoint(mainStore.userInfo.userSeqNo)

  if (pointResult && pointResult.data) {
    pointData.value = pointResult.data

    if (paymentInfo.value.productsAmount < pointResult.data.activePoint) {
      maxPoint.value = paymentInfo.value.productsAmount
    } else {
      maxPoint.value = pointResult.data.activePoint
    }
  }
}

const getAddressList = async () => {
  const userId = mainStore.userInfo.userSeqNo
  const params = {
    userId: userId
  }
  const result = await orderService.getAddressList(params)
  const defaultAddressIndex = result.data.findIndex(item => item.defaultValue === true)

  if (defaultAddressIndex !== -1) {
    selectAddressInfo.value = result.data[defaultAddressIndex]
  }
}

const getAddressInfo = (val) => {
  selectAddressInfo.value = val
}

const onResetCoupon = () => {
  selectedCouponList.value = []
  if (disCountPoint.value) {
    calculateDiscount()
  }
  couponDiscountTotal.value = 0
  onCouponCloseModal()
}

const onClickCoupon = (id) => {
  selectedCouponList.value = []
  const couponData = couponList.value.filter((i) => i.couponId === id)[0]
  if (couponData.minimumPurchaseAmount > paymentInfo.value.productsAmount) return
  selectedCouponList.value.push(couponData)
  couponDiscountTotal.value = couponData.discountPrice
  if (disCountPoint.value) {
    calculateDiscount()
  }
  onCouponCloseModal()
}

const onDeleteSelectedCoupon = () => {
  isVisibleCoupon.value = false
  isUse.value = false
  selectedCouponList.value = []
  couponDiscountTotal.value = 0
  if (disCountPoint.value) {
    calculateDiscount()
  }
}

const onCouponOpenModal = () => {
  proxy.$refs.couponModal.show()
}

const onCouponCloseModal = () => {
  proxy.$refs.couponModal.hide()
}

const onInputBlur = () => {
  if (point.value < 10) {
    point.value = 0
    disCountPoint.value = 0
  } else {
    calculateDiscount()
  }
}

const onPaymentSuccess = async () => {
  proxy.$showProgress() // Progress Show
  const params = JSON.parse(sessionDataManager.get('paymentInfo'))

  if (params.summary.salesAmount < 1) {
    params.payment = null
    params.isPointOnlyPayment = true
  } else {
    params.isPointOnlyPayment = false
    params.payment = {
      tossRequestType: params.tossPaymentType === 'KEYIN' ? 'KEYIN' : query.paymentType,
      paymentKey: query.paymentKey,
      orderNumber: query.orderId,
      amount: query.amount
    }
  }

  const result = await orderService.postOrderComplete(params)

  proxy.$hideProgress() // Progress Show
  if (result && result.data) {
    sessionDataManager.set('paymentResult', JSON.stringify(result.data))
    router.push('/order/success')
  } else {
    proxy.$confirm(proxy.$t('CNF_OrderFail'), {
      title: '',
      ok: () => {
        router.push('/order')
      }
    })
  }
}

const sumTotalPrice = () => {
  let total = paymentInfo.value.productsAmount

  if (selectedCouponList.value[0]) {
    total -= selectedCouponList.value[0].discountPrice
  }

  // total -= paymentInfo.value.membershipDiscount
  total += paymentInfo.value.shippingFee
  total -= disCountPoint.value

  totalPrice.value = total
  paymentInfo.value.pointEarn = Math.floor((total - paymentInfo.value.shippingFee) / 10)
}

const getPaymentTerms = async (key) => {
  const result = await etcService.getPaymentTerms(key)

  if (result && result.data) {
    return result.data[0]
  }
}

/**
 * 약관 상세 보기
 * @param {*} content
 */
const onOpenTermsModal = async (termkey) => {
  const termData = await getPaymentTerms(termkey)

  if (termData) {
    proxy.openModal(
      {
        parent: proxy, // 필수
        component: 'TermsModal', // 필수
        componentProps: {
          title: termData.termsName,
          content: termData.termsContents
        },
        modeless: false // 선택
      })
  }
}

const isChangeReceipt = () => {
  cashReceiptInfo.value = ''
}

const isNumber = (val) => {
  cashReceiptInfo.value = val.replace(/[^0-9]/g, '')
}

watch(
  () => isUse.value,
  (value) => {
    if (value) {
      getMaxCouponList()
    } else {
      couponDiscountTotal.value = 0
      selectedCouponList.value = []
      if (disCountPoint.value) {
        calculateDiscount()
      }
    }
  }
)

watch([
  paymentInfo,
  selectedCouponList,
  disCountPoint
],
([newA, newB, newC], [prevA, prevB, prevC]) => {
  sumTotalPrice()
})

const onDeleteSession = () => {
  sessionDataManager.remove(PAYMENT_INFO)
  sessionDataManager.remove(PAYMENT_RESULT)
  sessionDataManager.remove(SHOP_REFERRER_CODE)
}

const handlePageShow = (event) => {
  if (event.persisted) {
    onDeleteSession()
    window.location.reload()
  }
}

onMounted(() => {
  window.addEventListener('pageshow', handlePageShow)
  if (orderList) {
    if (query.paymentKey) {
      onPaymentSuccess()
    } else {
      onDeleteSession()
      getAddressList()
      postSalesSheet()
    }
  } else {
    onDeleteSession()
    router.push(returnUrl)
  }
})
</script>

<style lang="scss" scoped>

</style>

