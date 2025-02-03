<template>
  <div class="max-width-wrap full-width-wrap pb144">

    <div class="main-title-area">
      <h3 class="">{{ $t('ORD_OrderDetail') }}</h3>
    </div>

    <div class="order-list-detail-top-area">
      <div class="flex align-center">
        <i
          v-if="paymentInfo?.guaranteeCode"
          class="ico exclamation-b ml4"
          style="position: relative; margin-right: 5px;"
          @click="$notify(`${paymentInfo?.guaranteeCode} ${orderStatus?.code === 'SALES_ORDER_CANCEL' ? $t('ORD_Cancel') : ''}`, $t('ORD_UnionNumber'), 'w114')"
        />
        <span>{{ deliveryInfo?.orderNumber }}</span>
      </div>
      <span>{{ deliveryInfo?.orderDatetime }}</span>
    </div>

    <q-list bordered class="dropdown type02">

      <q-expansion-item v-model="isExpanded[0]">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('ORD_OrderProduct') }}
          </q-item-section>

          <q-item-section side class="right-area">
            <!-- 정보 없을 경우 영역 제거 -->
            <div v-if="productsCount && !isExpanded[0]" class="delivery-order-text">
              <span>{{ productsCount }}{{ $t('CM_Count') }}</span>
            </div>
            <!-- //정보 없을 경우 영역 제거 -->
          </q-item-section>
        </template>

        <q-card>
          <div class="delivery-info-area pb0">

            <div class="delivery-order-content">
              <div class="flex align-center justify-between mb4">
                <span class="order-prd-status-text">{{ orderStatus?.text }}</span>

                <!-- <RButton class="btn type13" label="배송조회" @click="onDeliveryOpenModal" /> -->
                <RButton
                  v-if="orderStatus?.code === 'SALES_ORDER_COMPLETE' ||
                    orderStatus?.code === 'BEFORE_DEPOSIT'"
                  class="btn type13"
                  :label="$t('OP_DeliveryChange')"
                  @click="onOpenModal"
                />
                <RButton
                  v-if="orderStatus?.code === 'DELIVERED' ||
                    orderStatus?.code === 'IN_TRANSIT' ||
                    orderStatus?.code === 'PURCHASE_CONFIRM'"
                  class="btn type13"
                  :label="$t('ORD_SearchAddress')"
                  @click="onDeliveryOpenModal"
                />
                <!-- 배송지연일 경우 -->
                <RButton
                  v-if="orderStatus?.code === 'PENDING'"
                  class="btn type16"
                  label=""
                >
                  <template #content>
                    <span>{{ $t('ORD_OrderStatus3') }}</span>
                    <i
                      class="ico exclamation-b ml4"
                      style="position: relative;"
                      @click="$notify($t('ORD_AltText2'), $t('ORD_PendingNoti'))"
                    />
                  </template>
                </RButton>
                <!-- //배송지연일 경우 -->
              </div>
              <ul class="delivery-order-area">
                <li>
                  <div class="field">
                    <div
                      v-if="firstProduct?.salesStatus?.code === 'SOLD_OUT'
                        || firstProduct?.salesStatus?.code === 'PAUSE'"
                      class="prd-img-area pointer"
                    >
                      <img
                        v-if="tempId"
                        :src="addPrefixForImage(productFirst?.thumbnailUrl)"
                        alt=""
                      >
                      <img
                        v-else
                        :src="addPrefixForImage(firstProduct?.thumbnailUrl)"
                        alt=""
                      >
                      <div
                        class="sold-out-area small"
                        @click="onSoldOutOpenModal(firstProduct?.categoryId)"
                      >
                        <div class="sold-out-bg">
                          <span>sold<br>out</span>
                        </div>
                      </div>
                    </div>
                    <div v-else class="prd-img-area pointer" @click="router.push(`/product/detail/${productFirst?.productId}`)">
                      <img
                        v-if="tempId"
                        :src="addPrefixForImage(productFirst?.thumbnailUrl)"
                        alt=""
                      >
                      <img
                        v-else
                        :src="addPrefixForImage(firstProduct?.thumbnailUrl)"
                        alt=""
                      >
                    </div>
                    <div
                      v-if="tempId"
                      class="delivery-order-info-area"
                    >
                      <div
                        class="prd-name pointer"
                        @click="router.push(`/product/detail/${productFirst?.productId}`)"
                      >
                        {{ productFirst?.productOptionId ? firstProduct?.productName : productFirst?.productName }}
                      </div>
                      <div class="prd-option-area">
                        <div>{{ productFirst?.quantity }}{{ $t('CM_Unit') }}</div>
                      </div>
                      <div class="prd-price-area">
                        <span>{{ $moneyFormat(productFirst?.productAmount * productFirst?.quantity) }}</span>
                        <span>{{ $t('CM_Won') }}</span>
                      </div>
                    </div>
                    <div
                      v-else
                      class="delivery-order-info-area"
                    >
                      <div
                        class="prd-name pointer"
                        @click="router.push(`/product/detail/${productFirst?.productId}`)"
                      >
                        {{ firstProduct?.name }}
                      </div>
                      <div v-for="(item, index) in firstProduct?.optionValues" :key="index" class="prd-option-area">
                        <div>{{ item.optionValue }}</div>
                      </div>
                      <div class="prd-option-area">
                        <div>{{ productFirst?.quantity }}{{ $t('CM_Unit') }}</div>
                      </div>
                      <div class="prd-price-area">
                        <span>{{ $moneyFormat(productFirst?.productAmount * productFirst?.quantity) }}</span>
                        <span>{{ $t('CM_Won') }}</span>
                      </div>

                      <!-- 2024.12.06 sp, bp 추가 -->
                      <ul v-if="isPlanner" class="prd-point-area rod-h8 medium mb0 mt4">
                        <li class="sp">
                          <span>{{ $moneyFormat(firstProduct?.spFinal) }}</span><span>SP</span>
                        </li>
                        <li class="bp">
                          <span>{{ $moneyFormat(firstProduct?.bpFinal) }}</span><span>BP</span>
                        </li>
                      </ul>
                      <!-- //2024.12.06 sp, bp 추가 -->
                    </div>
                  </div>
                </li>

                <q-slide-transition v-if="isVisibleItem">
                  <li>
                    <div v-for="(item, index) in productsInfo" :key="index" class="field">
                      <div
                        v-if="item?.salesStatus?.code === 'SOLD_OUT'
                          || item?.salesStatus?.code === 'PAUSE'"
                        class="prd-img-area pointer"
                      >
                        <img v-if="tempId" :src="addPrefixForImage(item?.imageUrl?.find(image => image.imageType?.code === 'THUMBNAIL')?.urlImage)" alt="">
                        <img v-else :src="addPrefixForImage(item?.thumbnailUrl)" alt="">
                        <div
                          class="sold-out-area small"
                          @click="onSoldOutOpenModal(item?.categoryId)"
                        >
                          <div class="sold-out-bg">
                            <span>sold<br>out</span>
                          </div>
                        </div>
                      </div>
                      <div
                        v-else
                        class="prd-img-area pointer"
                        @click="router.push(`/product/detail/${item?.productId}`)"
                      >
                        <img v-if="tempId" :src="addPrefixForImage(item?.imageUrl?.find(image => image.imageType?.code === 'THUMBNAIL')?.urlImage)" alt="">
                        <img v-else :src="addPrefixForImage(item?.thumbnailUrl)" alt="">
                      </div>
                      <div
                        v-if="tempId"
                        class="delivery-order-info-area"
                      >
                        <div
                          class="prd-name pointer"
                          @click="router.push(`/product/detail/${item?.productId}`)"
                        >
                          {{ item?.productName }}
                        </div>
                        <div class="prd-option-area">
                          <div>{{ getQuantity(item) }}{{ $t('CM_Unit') }}</div>
                        </div>
                        <div class="prd-price-area">
                          <span>{{ $moneyFormat(item.salesAmount * getQuantity(item)) }}</span>
                          <span>{{ $t('CM_Won') }}</span>
                        </div>
                      </div>
                      <div
                        v-else
                        class="delivery-order-info-area"
                      >
                        <div
                          class="prd-name pointer"
                          @click="router.push(`/product/detail/${item?.productId}`)"
                        >
                          {{ item.name }}
                        </div>
                        <div v-for="(option, optIndex) in item?.optionValues" :key="optIndex" class="prd-option-area">
                          <div>{{ option.optionValue }}</div>
                        </div>
                        <div class="prd-option-area">
                          <div>{{ productOthers[index]?.quantity || 0 }}{{ $t('CM_Unit') }}</div>
                        </div>

                        <div class="prd-price-area">
                          <span>{{ $moneyFormat(item.salesAmount * productOthers[index]?.quantity) }}</span>
                          <span>{{ $t('CM_Won') }}</span>
                        </div>

                        <!-- 2024.12.06 sp, bp 추가 -->
                        <ul v-if="isPlanner" class="prd-point-area rod-h8 medium mb0 mt4">
                          <li class="sp">
                            <span>{{ $moneyFormat(item.spFinal) }}</span><span>SP</span>
                          </li>
                          <li class="bp">
                            <span>{{ $moneyFormat(item.bpFinal) }}</span><span>BP</span>
                          </li>
                        </ul>
                        <!-- //2024.12.06 sp, bp 추가 -->
                      </div>
                    </div>
                  </li>
                </q-slide-transition>

              </ul>

              <div v-if="productsInfo.length > 0" class="delivery-order-list-area pb24" @click="isVisibleItem = !isVisibleItem">
                <div class="order-count-text-area">
                  <div class="text-area">
                    <span>{{ $t('CM_Total') }}</span>
                    <span>{{ productsCount }}</span>
                    <span>{{ $t('CM_Unit2') }}</span>
                  </div>

                  <div class="text">{{ $t('ORD_OrderProductList') }} {{ isVisibleItem ? $t('CM_Close') : $t('CM_Expand') }}</div>
                </div>
                <i class="ico arrow-top-type02-b"></i>
              </div>

            </div>
          </div>

        </q-card>
      </q-expansion-item>

      <q-expansion-item v-model="isExpanded[1]">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OC_PaymentInfo') }}
          </q-item-section>

          <q-item-section side class="right-area">
            <span v-if="!isExpanded[1]">{{ $moneyFormat(paymentInfo?.paymentInfo?.saleAmount) }}{{ $t('CM_Won') }}</span>
          </q-item-section>
        </template>

        <q-card class="plr16 pb16">
          <ul class="order-result-detail-price-area">
            <li v-if="isSimplePay">
              <span class="">{{ $t('OC_PaymentWay') }}</span>
              <div class="price-text-area">
                <span>{{ $t('ORD_SimplePay') }}</span>
              </div>
            </li>
            <li v-else-if="isBrandPay">
              <span class="">{{ $t('OC_PaymentWay') }}</span>
              <div v-if="paymentInfo?.cardPaymentInfo" class="price-text-area">
                <span v-if="paymentInfo?.cardPaymentInfo?.installment === '0'">
                  {{ $t('ORD_RimanPay') }} - {{ paymentInfo?.cardPaymentInfo?.cardName }} / {{ $t('OC_OnePayment') }}
                </span>
                <span v-else>{{ $t('ORD_RimanPay') }} - {{ paymentInfo?.cardPaymentInfo?.cardName }} /
                  {{ paymentInfo?.cardPaymentInfo?.installment }} {{ $t('CM_Month') }}
                </span>
              </div>
            </li>
            <li v-else-if="paymentInfo?.virtualAccountPaymentInfo">
              <span class="">{{ $t('OC_PaymentWay') }}</span>
              <div class="price-text-area">
                <span>{{ paymentInfo?.virtualAccountPaymentInfo?.bankName }} | {{ paymentInfo?.virtualAccountPaymentInfo?.accountNumber }}</span>
              </div>
            </li>
            <li v-else-if="paymentInfo?.cardPaymentInfo">
              <span class="">{{ $t('OC_PaymentWay') }}</span>
              <div class="price-text-area">
                <span v-if="paymentInfo?.cardPaymentInfo?.installment === '0'">
                  {{ paymentInfo?.cardPaymentInfo?.cardName }} / {{ $t('OC_OnePayment') }}
                </span>
                <span v-else>{{ paymentInfo?.cardPaymentInfo?.cardName }} /
                  {{ paymentInfo?.cardPaymentInfo?.installment }} {{ $t('CM_Month') }}
                </span>
              </div>
            </li>
            <li v-else>
              <span class="">{{ $t('OC_PaymentWay') }}</span>
              <div class="price-text-area">
                <span>{{ $t('OP_CouponPoint') }}</span>
              </div>
            </li>
            <li v-if="paymentInfo?.virtualAccountPaymentInfo && paymentInfo?.receiptUse && paymentInfo?.receiptNumber">
              <span class="">{{ $t('OP_MoneyReceipt') }}</span>
              <div class="price-text-area">
                <span>{{ paymentInfo?.receiptUse }} | {{ paymentInfo?.receiptNumber }}</span>
              </div>
            </li>
            <li>
              <span class="">{{ $t('OP_ProductAmount') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.paymentInfo?.productsAmount) }}{{ $t('CM_Won') }}</span>
                <!-- 비회원 주문일 경우 제거 -->
                <!-- <i
                  v-if="isPlanner"
                  class="ico riman-coin-y"
                  style="position: relative;"
                  @click="$notify(`SP: ${ $moneyFormat(paymentInfo?.paymentInfo?.spOrigin) }<br>BP: ${$moneyFormat(paymentInfo?.paymentInfo?.bpOrigin) }`, $t('OP_ProductAmount'), 'w114')"
                /> -->
                <!-- //비회원 주문일 경우 제거 -->
              </div>
            </li>
            <li>
              <span class="">{{ $t('OP_DeliveryAmount') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.paymentInfo?.deliveryFeeAmount) }}{{ $t('CM_Won') }}</span>
              </div>
            </li>
            <!-- 비회원일 경우 제거 -->
            <li v-if="isLogined">
              <span class="">{{ $t('OP_UsePoint') }}</span>
              <div class="price-text-area">
                <span v-if="paymentInfo?.paymentInfo?.pointDiscount === 0">0{{ $t('CM_Won') }}</span>
                <span v-else>-{{ $moneyFormat(paymentInfo?.paymentInfo?.pointDiscount) }}{{ $t('CM_Won') }}</span>
                <!-- <i
                  v-if="isPlanner"
                  class="ico riman-coin-y"
                  style="position: relative;"
                  @click="$notify(`SP: ${ $moneyFormat(paymentInfo?.paymentInfo?.spOrigin - paymentInfo?.paymentInfo?.spFinal) }<br>BP: ${$moneyFormat(paymentInfo?.paymentInfo?.bpOrigin - paymentInfo?.paymentInfo?.bpFinal) }`, $t('OP_UsePoint'), 'w114')"
                /> -->
              </div>
            </li>
            <!-- //비회원일 경우 제거 -->
            <!--- 2024.12.06 -->
            <li v-if="isLogined">
              <span class="">{{ $t('OP_SavePoint') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.paymentInfo?.pointEarn) }}</span>
                <span>P</span>
              </div>
            </li>
            <!--- 2024.12.06 -->
          </ul>

          <ul class="order-result-price-area">
            <li>
              <span class="left-title-area primary09-color">{{ $t('OP_TotalPayment') }}</span>
              <div class="price-text-area flex align-center">
                <span class="">{{ $moneyFormat(paymentInfo?.paymentInfo?.saleAmount) }}</span>
                <span class="">{{ $t('CM_Won') }}</span>
                <!--
                2024.12.06
                <i
                  v-if="isPlanner"
                  class="ico riman-coin-y"
                  style="position: relative;"
                  @click="$notify(`SP: ${ $moneyFormat(paymentInfo?.paymentInfo?.spFinal) }<br>BP: ${$moneyFormat(paymentInfo?.paymentInfo?.bpFinal) }`, $t('ORD_PaySpBP'), 'w114')"
                /> -->
              </div>
            </li>
            <!--- 2024.12.06 -->
            <li v-if="isPlanner" class="">
              <span class="left-title-area gray07-color">{{ $t('PT_Earning') }} SP | BP</span>
              <div class="price-text-area">
                <div class="text-right">
                  <span>{{ $moneyFormat(paymentInfo?.paymentInfo?.spFinal) }}</span>
                  <span>SP</span>
                </div>
                <div class="mt2 text-right">
                  <span>{{ $moneyFormat(paymentInfo?.paymentInfo?.bpFinal) }}</span>
                  <span>BP</span>
                </div>
              </div>
            </li>
            <!--- //2024.12.06 -->

            <!-- 비회원일 경우 제거 -->
            <!-- <li v-if="isLogined">
              <span class="left-title-area">{{ $t('OP_SavePoint') }}</span>
              <div class="price-text-area">
                <span>{{ $moneyFormat(paymentInfo?.paymentInfo?.pointEarn) }}</span>
                <span>P</span>
              </div>
            </li> -->
            <!-- //비회원일 경우 제거 -->
            <li v-if="orderStatus?.code !== 'BEFORE_DEPOSIT'" class="gap8 border-top-none">
              <RButton class="btn full small type03" :label="$t('ORD_CardStateMent')" @click="getReceiptInfo" />
              <RButton v-if="tempId" class="btn full small type03" :label="$t('ORD_TransactionDetail')" @click="getDownloadNonMemberTransaction" />
              <RButton v-else class="btn full small type03" :label="$t('ORD_TransactionDetail')" @click="getDownloadTransaction" />
            </li>
          </ul>

        </q-card>
      </q-expansion-item>

      <!-- 비회원일 경우 -->
      <q-expansion-item v-if="!isLogined" v-model="isExpanded[2]">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('NUP_PayUserInfo') }}
          </q-item-section>

          <q-item-section side class="right-area">
          </q-item-section>
        </template>

        <q-card>
          <div class="none-user-delivery-info-area">
            <dl class="order-info-list-area">
              <dt>{{ $t('NUP_OrderName') }}</dt>
              <dd>{{ orderGuestInfo?.guestName }}</dd>

              <dt>{{ $t('OC_DeliveryInfo5') }}</dt>
              <dd>{{ format.mobileFormat(orderGuestInfo?.guestPhone) }}</dd>

              <dt>{{ $t('CM_ReferrerInfo') }}</dt>
              <dd>{{ orderGuestInfo?.refererRegionCode?.text }} {{ orderGuestInfo?.referrerNumber }} {{ orderGuestInfo?.referrerName }}</dd>
            </dl>
          </div>
        </q-card>
      </q-expansion-item>
      <!-- //비회원일 경우 -->

      <q-expansion-item v-model="isExpanded[3]">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('OP_DeliveryInfo') }}
          </q-item-section>

          <q-item-section side class="right-area">
          </q-item-section>
        </template>

        <q-card>
          <div class="none-user-delivery-info-area">
            <dl class="order-info-list-area">
              <dt>{{ $t('ORD_AddressGet') }}</dt>
              <dd>{{ deliveryInfo?.receiver?.receiverInfo?.receiverLastName }}{{ deliveryInfo?.receiver?.receiverInfo?.receiverFirstName }}</dd>
              <dt>{{ $t('OC_DeliveryInfo5') }}</dt>
              <dd>{{ format.mobileFormat(deliveryInfo?.receiver?.receiverInfo?.receiverPhoneNumber) }}</dd>
              <dt>{{ $t('CMM_AddressLabel') }}</dt>
              <dd>
                [{{ deliveryInfo?.receiver?.addressInfo?.zipcode }}]
                {{ deliveryInfo?.receiver?.addressInfo?.address }}
                {{ deliveryInfo?.receiver?.addressInfo?.addressDetail }}
              </dd>

              <!-- 비회원일 경우 -->
              <dt>{{ $t('OC_DeliveryInfo7') }}</dt>
              <dd>{{ deliveryInfo?.receiver?.message }}</dd>
              <!-- //비회원일 경우 -->
            </dl>

            <ul
              v-if="isPlanner && ['SALES_ORDER_COMPLETE', 'BEFORE_DEPOSIT', 'INFORMATION_RECEIVED', 'IN_TRANSIT', 'PENDING'].includes(orderStatus?.code)"
              class="explanation-text gray font-14"
            >
              <li>{{ $t('ORD_AddressDesc10') }}<b>{{ $t('ORD_AddressDesc11') }}</b>{{ $t('ORD_AddressDesc12') }}</li>
              <li><b>{{ $t('ORD_AddressDesc13') }}</b>{{ $t('ORD_AddressDesc14') }}</li>
              <li>{{ $t('ORD_AddressDesc15') }}</li>
              <li>{{ $t('ORD_AddressDesc22') }}</li>
            </ul>

            <ul
              v-else-if="isPlanner && orderStatus?.code === 'DELIVERED'"
              class="explanation-text gray font-14"
            >
              <li>{{ $t('ORD_AddressDesc15') }}</li>
              <li>{{ $t('ORD_AddressDesc22') }}</li>
              <li>{{ $t('ORD_AddressDesc1') }}</li>
              <li>
                {{ $t('ORD_AddressDesc2') }}
                <b>{{ $t('ORD_AddressDesc3') }}</b>
                {{ $t('ORD_AddressDesc4') }}
                <b>5%</b>
                {{ $t('ORD_AddressDesc5') }}<br>
                {{ $t('ORD_AddressDesc6') }}
                <b>{{ $t('ORD_AddressDesc7') }}</b>
                {{ $t('ORD_AddressDesc8') }}
                <b>7%</b>
                {{ $t('ORD_AddressDesc9') }}
              </li>
            </ul>

            <ul
              v-if="!isPlanner && ['SALES_ORDER_COMPLETE', 'BEFORE_DEPOSIT', 'INFORMATION_RECEIVED', 'IN_TRANSIT', 'PENDING', 'DELIVERED'].includes(orderStatus?.code)"
              class="explanation-text gray font-14"
            >
              <li>{{ $t('ORD_AddressDesc10') }}<b>{{ $t('ORD_AddressDesc11') }}</b>{{ $t('ORD_AddressDesc12') }}</li>
              <li><b>{{ $t('ORD_AddressDesc13') }}</b>{{ $t('ORD_AddressDesc14') }}</li>
              <li>{{ $t('ORD_AddressDesc15') }}</li>
              <li>{{ $t('ORD_AddressDesc16') }}</li>
            </ul>
          </div>

        </q-card>
      </q-expansion-item>

      <!-- 비회원일 경우 제거 -->
      <q-expansion-item
        v-if="isLogined
          && paymentInfo?.virtualAccountPaymentInfo
          && !['BEFORE_DEPOSIT', 'DEPOSIT_EXPIRED', 'BEFORE_DEPOSIT_CANCEL', 'SALES_ORDER_CANCEL'].includes(orderStatus?.code)"
        v-model="isExpanded[4]"
      >
        <template #header>
          <q-item-section class="left-area">
            {{ $t('ORD_RefundAccount') }}
          </q-item-section>

          <q-item-section side class="right-area">
          </q-item-section>
        </template>

        <q-card>
          <div class="none-user-delivery-info-area">
            <!-- 환불계좌 등록 후 -->
            <dl v-if="refundAccountInfo?.bankAccountInfo" class="order-info-list-area">
              <dt>{{ $t('ORD_RefundAccount') }}</dt>
              <dd class="flex align-center justify-end gap8">
                <div>{{ refundAccountInfo?.bankAccountInfo?.bankName }} {{ refundAccountInfo?.bankAccountInfo?.bankAccountNo }}</div>
                <RButton class="btn type13" :label="$t('CM_Change')" @click="onAccountRegOpenModal"></RButton>
              </dd>
            </dl>
            <!-- //환불계좌 등록 후 -->

            <!-- 환불계좌 등록 전 -->
            <dl v-else class="order-info-list-area">
              <dt>{{ $t('ORD_RefundAccount') }}</dt>
              <dd><RButton class="btn type13" :label="$t('ORD_RegistRefundAccount')" @click="onAccountRegOpenModal"></RButton></dd>
            </dl>
            <!-- //환불계좌 등록 전 -->

            <ul class="explanation-text gray font-14">
              <li>{{ $t('ORD_RefundDesc1') }}</li>
              <li>{{ $t('ORD_RefundDesc2') }}</li>
              <li>{{ $t('ORD_RefundDesc3') }}</li>
              <li>{{ $t('ORD_RefundDesc4') }}</li>
            </ul>

          </div>

        </q-card>
      </q-expansion-item>
      <!-- //비회원일 경우 제거 -->
      <q-expansion-item v-if="returnListInfo?.length > 0" v-model="isExpanded[5]">
        <template #header>
          <q-item-section class="left-area">
            {{ $t('ORD_ReturnList') }}
          </q-item-section>

          <q-item-section side class="right-area" />
        </template>

        <q-card class="pb24">
          <ul class="list type05">
            <li v-for="(item, index) in returnListInfo" :key="index">
              <div class="flex justify-between">
                <div class="font-14 primary09-color medium">{{ item.returnOrderBaseInfo.returnOrderStatus.text }} {{ item.returnOrderBaseInfo.returnOrderNumber }}</div>
                <Rbutton
                  v-if="tempId"
                  class="btn type15 font-14"
                  @click="goToReturn(item)"
                >
                  {{ $t('CM_Goto') }}
                </Rbutton>
                <Rbutton
                  v-else
                  class="btn type15 font-14"
                  @click="goToReturn(item)"
                >
                  {{ $t('CM_Goto') }}
                </Rbutton>
              </div>

              <div class="flex no-wrap gap16 mt4">
                <div class="prd-img-area">
                  <img :src="addPrefixForImage(item?.productInfo?.thumbnailUrl)" alt="" class="img-cover">

                  <div class="prd-icon-area bottom-right">
                    <span class="prd-icon count">{{ item?.productInfo?.quantity }}</span>
                  </div>
                </div>

                <div
                  v-if="tempId"
                  class="flex1">
                  <div class="prd-info-area">
                    <span class="prd-name-text font-14">{{ resolveProductName(item) }}</span>
                    <span class="buy-count-text font-12">{{ item?.productInfo?.quantity }}{{ $t('CM_Unit') }}</span>
                  </div>

                  <!-- 세트상품 있을 경우 -->
                  <!-- <div
                    class="set-prd-area"
                    @click="isVisibleSet = !isVisibleSet"
                  >
                    <div class="set-prd-btn-area primary04">{{ $t('ORD_ViewSetProduct') }}<i class="ico arrow-top-type02-b" :class="{'rotate':isVisibleSet}" /></div>
                    <q-slide-transition>
                      <div v-if="isVisibleSet">
                        <div class="oprion-text">
                          클렌징 오일 (1{{ $t('CM_Unit') }}) , (사은품) 상품 이름 / 무향 (N{{ $t('CM_Unit') }})클렌징 오일 (1{{ $t('CM_Unit') }}) , (사은품) 상품 이름 / 무향 (N{{ $t('CM_Unit') }})
                        </div>
                      </div>
                    </q-slide-transition>
                  </div> -->
                <!-- //세트상품 있을 경우 -->
                </div>
                <div
                  v-else
                  class="flex1">
                  <div class="prd-info-area">
                    <span class="prd-name-text font-14">{{ item?.productInfo?.productName }}</span>
                    <span class="option-text font-12">
                      {{
                        findOptionValue(item?.productInfo?.productId, returnProductList)
                      }}
                    </span>
                    <span class="buy-count-text font-12">{{ item?.productInfo?.quantity }}{{ $t('CM_Unit') }}</span>
                  </div>

                  <!-- 세트상품 있을 경우 -->
                  <!-- <div
                    class="set-prd-area"
                    @click="isVisibleSet = !isVisibleSet"
                  >
                    <div class="set-prd-btn-area primary04">{{ $t('ORD_ViewSetProduct') }}<i class="ico arrow-top-type02-b" :class="{'rotate':isVisibleSet}" /></div>
                    <q-slide-transition>
                      <div v-if="isVisibleSet">
                        <div class="oprion-text">
                          클렌징 오일 (1{{ $t('CM_Unit') }}) , (사은품) 상품 이름 / 무향 (N{{ $t('CM_Unit') }})클렌징 오일 (1{{ $t('CM_Unit') }}) , (사은품) 상품 이름 / 무향 (N{{ $t('CM_Unit') }})
                        </div>
                      </div>
                    </q-slide-transition>
                  </div> -->
                <!-- //세트상품 있을 경우 -->
                </div>

              </div>
            </li>
          </ul>

        </q-card>
      </q-expansion-item>

      <q-expansion-item
        v-if="['DEPOSIT_EXPIRED', 'BEFORE_DEPOSIT_CANCEL', 'SALES_ORDER_CANCEL'].includes(orderStatus?.code)"
        v-model="isExpanded[6]"
      >
        <template #header>
          <q-item-section class="left-area">
            {{ $t('ORD_RefundInfo') }}
          </q-item-section>

          <q-item-section side class="right-area" />
        </template>

        <q-card class="">
          <div class="none-user-delivery-info-area">
            <dl class="order-info-list-area">
              <dt>{{ $t('CM_CancelReason') }}</dt>
              <dd>{{ refundInfoDto?.refundReason }}</dd>
              <dt
                v-if="orderStatus?.code !== 'BEFORE_DEPOSIT_CANCEL' &&
                  orderStatus?.code === 'SALES_ORDER_CANCEL' &&
                  refundInfoDto?.refundReason !== $t('ORD_OrderStatus6')"
              >
                {{ $t('ORD_RefundMethod') }}
              </dt>
              <dd
                v-if="orderStatus?.code !== 'BEFORE_DEPOSIT_CANCEL' &&
                  orderStatus?.code === 'SALES_ORDER_CANCEL' &&
                  refundInfoDto?.refundReason !== $t('ORD_OrderStatus6')"
              >
                <span v-if="refundInfoDto?.refundPaymentType?.code === 'VIRTUAL_ACCOUNT'">
                  {{ refundInfoDto?.bankName }} / {{ refundInfoDto?.refundAccountNo }}
                </span>
                <span v-else>
                  {{ $t('ORD_RefundPaymentMethod') }}
                </span>
              </dd>
              <dt>{{ $t('ORD_RefundAmount') }}</dt>
              <dd>{{ $moneyFormat(refundInfoDto?.refundAmount) }}{{ $t('CM_Won') }}</dd>
              <dt>{{ $t('ORD_RefundPoint') }}</dt>
              <dd>{{ $moneyFormat(refundInfoDto?.refundPointAmount) }}P</dd>
            </dl>
          </div>

        </q-card>
      </q-expansion-item>

    </q-list>
    <div class="order-bottom-checkbox-area mt0 plr16">
      <RButton v-if="orderStatus?.code === 'SALES_ORDER_COMPLETE' || orderStatus?.code === 'BEFORE_DEPOSIT'" class="btn type13 mt24 mlr0" :label="$t('ORD_CancelOrder')" @on-click="onOrderCancelOpenModal"></RButton>
      <template v-if="(orderStatus?.code === 'DELIVERED' || orderStatus?.code === 'RETURN_REQUEST_CANCEL' || (isPlanner && orderStatus?.code === 'PURCHASE_CONFIRM')) && (isPlanner ? deliveryDateDiff < 90 : deliveryDateDiff < 14)" >
        <RButton class="btn type13 mt24 mlr0" :label="$t('ORD_ReqReturn')" @click="checkReturnableOrder"/>
        <span class="block gray04-color font-12 mt8">{{ $t('ORD_AltText10') }}</span>
      </template>
    </div>

    <!-- 품절 모달 -->
    <responsive-modal
      ref="soldOutModal"
      :title="$t('CMM_RecommProduct')"
      class="coupon-use-modal bottom-btn-modal"
    >
      <template #description>
        <div class="prd-status-content-area">
          <div class="sold-out-title">
            <b>{{ $t('CMM_RecommProductText1') }}</b>
            <span>{{ $t('CMM_RecommProductText2') }}</span>
          </div>

          <swiper
            :slides-per-view="'auto'"
            :free-mode="true"
            :pagination="{
              type: 'progressbar',
              clickable: true,
            }"
            :navigation="true"
            :modules="modules"
            class="prd-option-area type02 transparent-bar"
          >
            <swiper-slide v-for="(item, index) in recommData" :key="index" class="">
              <div
                class="recomm-area"
                @click="router.push(`/product/detail/${item?.productId}`)"
              >
                <div class="prd-img-area">
                  <img
                    :src="addPrefixForImage(item?.thumbnailUrl)"
                    :alt="item.productName"
                  >

                  <div class="prd-icon-area">
                    <span class="prd-icon almost-sold-out">
                      {{ item.salesStatus.text }}
                    </span>
                    <span v-if="item.applyCouponYn" class="prd-icon coupon">{{ $t('CM_ApplyCoupon') }}</span>
                  </div>

                </div>

                <div class="prd-list-info-area">
                  <span class="prd-category-text">{{ item.productName }}</span>
                  <p class="prd-detail-text">{{ item.description }}</p>

                  <div class="prd-price-area">
                    <span>{{ $moneyFormat(item.priceOriginal) }}</span>
                    <span>{{ $t('CM_Won') }}</span>
                  </div>
                </div>
              </div>
            </swiper-slide>
          </swiper>
        </div>
      </template>
    </responsive-modal>
    <!-- //품절 모달 -->

    <!-- 주문 취소 모달 -->
    <responsive-modal
      ref="orderCancelModal"
      :title="$t('CMM_OrderCancelTitle')"
      class="bottom-btn-modal regular-buy-modal"
    >
      <template #description>
        <div class="modal-form-area">

          <div class="order-cancel-info-area">
            <span v-if="productsCount === 1">{{ productItems[0]?.productName }}</span>
            <span v-else>{{ productItems[0]?.productName }} {{ $t('CM_And') }} {{ productsCount - 1 }}{{ $t('CM_Count') }}</span>
            <dl>
              <dt>{{ $t('ORD_PaymentAmount') }}</dt>
              <dd><b>{{ $moneyFormat(paymentInfo?.paymentInfo?.saleAmount) }}{{ $t('CM_Won') }}</b></dd>
              <dt>{{ $t('OC_PaymentWay') }}</dt>
              <dd v-if="isSimplePay">{{ $t('ORD_SimplePay') }}</dd>
              <dd v-else-if="isBrandPay && paymentInfo?.cardPaymentInfo">
                {{ $t('ORD_RimanPay') }} - {{ paymentInfo?.cardPaymentInfo?.cardName }} /
                {{ paymentInfo?.cardPaymentInfo?.installment === '0' ? $t('OC_OnePayment') : paymentInfo?.cardPaymentInfo?.installment + ' ' + $t('CM_Month') }}
              </dd>
              <dd v-else-if="paymentInfo?.virtualAccountPaymentInfo">
                {{ paymentInfo?.virtualAccountPaymentInfo?.bankName }} | {{ paymentInfo?.virtualAccountPaymentInfo?.accountNumber }}
              </dd>
              <dd
                v-else-if="paymentInfo?.cardPaymentInfo && !isSimplePay && !isBrandPay && !paymentInfo?.virtualAccountPaymentInfo"
              >
                {{ paymentInfo?.cardPaymentInfo?.cardName }} /
                {{ paymentInfo?.cardPaymentInfo?.installment === '0' ? $t('OC_OnePayment') : paymentInfo?.cardPaymentInfo?.installment + ' ' + $t('CM_Month') }}
              </dd>
              <dd v-else>
                {{ $t('OP_CouponPoint') }}
              </dd>
              <!-- 비회원일 경우 제거 -->
              <dt v-if="isLogined">{{ $t('OP_SavePoint') }}</dt>
              <dd v-if="isLogined">{{ $moneyFormat(paymentInfo?.paymentInfo?.pointEarn) }}P</dd>
              <dt v-if="isLogined">{{ $t('OP_UsePoint') }}</dt>
              <dd v-if="isLogined">{{ $moneyFormat(paymentInfo?.paymentInfo?.pointDiscount) }}P</dd>
              <!-- //비회원일 경우 제거 -->
            </dl>
          </div>
          <span class="font-12 gray04-color">*{{ $t('ORD_OrderCancelDesc1') }}</span>

          <div class="mt24 mb44">
            <span class="input-titl0 block gray07-color font-14 mb4">{{ $t('ORD_OrderCancelDesc2') }}</span>
            <RSelectBox
              v-model="selectFilterModel"
              :placeholder-text="$t('ORD_OrderCancelDesc3')"
              :options="selectOptions"
              :disable="false"
              class="select-box type04"
            />
          </div>

          <RCheckbox
            v-model="checkbox"
            class="checkbox-area type02"
          >
            <span class="gray07-color">{{ $t('ORD_OrderCancelDesc4') }}</span>
          </RCheckbox>

        </div>

        <div class="popup-bottom-area">
          <div class="popup-bottom-btn">
            <RButton class="btn full small type03" :label="$t('CM_Ok')" @click="postCancelOrder" />
            <RButton class="btn full small type02" :label="$t('ORD_OrderCancelDesc5')" @click="onCancelChange" />
          </div>
        </div>
      </template>
    </responsive-modal>
    <!-- //주문 취소 모달 -->

    <!-- 배송현황 모달 -->
    <responsive-modal
      ref="deliveryStatusModal"
      :title="$t('ORD_AddressModalTitle')"
      class="bottom-btn-modal delivery-status-modal max-h-80-modal"
    >
      <template #description>
        <ul class="delivery-info-area">
          <li>
            <span>{{ $t('OC_DeliveryInfo1') }} :</span>
            <span>{{ addressInfo?.trackingDetailResponse?.orderNumber }}</span>
          </li>
          <li>
            <span>{{ $t('ORD_AddressNumber') }} :</span>
            <span>{{ addressInfo?.mainInvoiceNumber }} | {{ addressInfo?.trackingDetailResponse?.companyCode }}</span>
          </li>
        </ul>

        <!-- 여러개일 경우 -->
        <div v-if="addressInfo?.invoiceNumbers?.length > 1" class="waybill-num-info-area">
          <div class="waybill-num-content scroll type01">
            <span class="block font-12 gray04-color">{{ $t('ORD_AddressDesc18') }}</span>
            <span class="block font-12 gray04-color mt2">{{ $t('ORD_AddressDesc19') }}</span>

            <div class="mt8 waybill-num-text-area">
              <div
                v-for="(item, index) in addressInfo?.invoiceNumbers"
                :key="index"
                class="font-14 gray05-color cursor"
                @click="openTrackingUrl(item)"
              >
                {{ item }} | {{ addressInfo?.trackingDetailResponse?.companyCode }}
              </div>
            </div>
          </div>
        </div>
        <!-- //여러개일 경우 -->

        <div class="font-16 text-center ptb16 gray07-color bold">{{ $t('ORD_AddressDesc20') }}</div>

        <div class="border-top-1-gray">
          <ul class="delivery-status-list">
            <li :class="addressInfo?.mainInvoiceDeliveryStatus?.code === 'SALES_ORDER_COMPLETE' ? 'active' : ''">
              <div class="icon-area">
                <i class="ico card-w" />
              </div>
              {{ $t('ORD_AddressDesc11') }}
            </li>

            <li :class="addressInfo?.mainInvoiceDeliveryStatus?.code === 'INFORMATION_RECEIVED' ? 'active' : ''">
              <div class="icon-area">
                <i class="ico box-w" />
              </div>
              {{ $t('ORD_OrderStatus4') }}
            </li>

            <li :class="addressInfo?.mainInvoiceDeliveryStatus?.code === 'IN_TRANSIT' ? 'active' : ''">
              <div class="icon-area">
                <i class="ico delivery-w" />
              </div>
              {{ $t('ORD_OrderStatus5') }}
            </li>

            <li :class="addressInfo?.mainInvoiceDeliveryStatus?.code === 'DELIVERED' ? 'active' : ''">
              <div class="icon-area">
                <i class="ico home-w" />
              </div>
              {{ $t('ORD_OrderStatus1') }}
            </li>

          </ul>
        </div>

        <q-list bordered class="dropdown type02">

          <q-expansion-item>
            <template #header>
              <q-item-section class="left-area">
                {{ $t('ORD_AddressDesc21') }}
              </q-item-section>

              <q-item-section side class="right-area" />
            </template>

            <q-card>
              <ul class="delivery-status-detail-list">
                <li
                  v-for="(item, index) in addressInfo?.trackingDetailResponse?.trackingList"
                  :key="index"
                  :class="{ active: index === 0 }"
                >
                  <div class="list-area">
                    <div class="icon-area" />
                    <div class="delivery-detail-text-ara">
                      <div class="flex align-center gap4">
                        <span class="font-12 gray07-color">{{ item?.location }}</span>
                        <span class="font-12 primary07-color">{{ item?.parcelStatus?.text }}</span>
                      </div>
                      <div class="font-12 font-montserrat gray04-color">{{ item?.scanDateTime }}</div>
                    </div>
                  </div>
                </li>
              </ul>
            </q-card>
          </q-expansion-item>

        </q-list>

      </template>
    </responsive-modal>
    <!-- //배송현황 모달 -->
  </div>

</template>

<script setup>

import { ref, getCurrentInstance, reactive, nextTick, onMounted, computed, watchEffect, watch } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import { event } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import orderService from '@/http/services/order'
import productService from '@/http/services/product'
import memberService from '@/http/services/member'
import { useMainStore } from '@store/mainStore'
import { useCartStore } from '@/store/cartStore'
import cartService from '@/http/services/cart'
import { addPrefixForImage, checkPlanner } from '@/utils/common'
import format from '@/utils/format'
import { isLogin } from '@/utils/login'
import { SALES_STATUS } from '@/utils/constant'
import { sessionDataManager } from '@/utils/dataManager'
// import ChangeNonUserModal from './modal/ChangeNonUserModal'
const { proxy } = getCurrentInstance()

const mainStore = useMainStore()
const cartStore = useCartStore()
const userInfo = mainStore.userInfo

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]

const inputText = ref('010-1234-5678')
const selectFilterModel = ref(null)
const checkbox = ref(true)
const discontinuedModal = ref(false)
const accountRegModal = ref(false)
const soldOutModal = ref(false)
const orderCancelModal = ref(false)
const deliveryStatusModal = ref(false)
const isVisibleItem = ref(false)
const deliveryInfo = ref(null)
const orderStatus = ref(null)
const paymentInfo = ref(null)
const firstProduct = ref(null)
const productsInfo = ref([])
const productFirst = ref(null)
const productOthers = ref([])
const productItems = ref([])
const productsCount = ref(null)
const orderGuestInfo = ref(null)
const isSimplePay = ref(false)
const isBrandPay = ref(false)
const deliveryDateDiff = ref(null)
const refundInfoDto = ref(null)

const addressInfo = ref(null)
const refundAccountInfo = ref(null)
const receiptUrl = ref('')
const returnListInfo = ref([])
const returnProductList = ref([])
const recommInfos = ref([])
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())
const postNormalCart = cartService.postNormalCart()

/* DropDowm Menu */
const deliveryOrderArea = ref(null)
const isVisibleSet = ref(false)

const isExpanded = ref([true, true, true, true, true, true, true])
const prdHidden = ref([true, true, true])

const prdHeight = ref(null)

const route = useRoute()
const router = useRouter()
const orderId = route.query.orderId
const tempId = route.query.tempId

const categoryIds = ref([])
const params = reactive({
  categoryIds,
  excludeProductType: null,
  soldOutSelect: false
})
const { data: recommData } = productService.getRecommendProductList(params)

const selectOptions = computed(() => [
  { label: proxy.$t('ORD_RefundReason1'), value: 'ORDER_MISTAKE' },
  { label: proxy.$t('ORD_RefundReason2'), value: 'REPAYMENT' },
  { label: proxy.$t('ORD_RefundReason3'), value: 'SIMPLE_CHANGE_MIND' }
])

const prdListOpen = (index) => {
  prdHidden.value[index] = !prdHidden.value[index]

  //  prdHeight.value = deliveryOrderArea.value.scrollHeight
  const deliveryOrderAreaRef = proxy.$refs[`deliveryOrderArea_${index}`]
  console.log('eeeeeeeeeeeeeeeee', proxy.$refs[`deliveryOrderArea_${index}`])

  if (deliveryOrderAreaRef) {
    console.log('Scroll Height:', deliveryOrderAreaRef[0].scrollHeight)
    prdHeight.value = deliveryOrderAreaRef[0].scrollHeight
  }
}

const getQuantity = (item) => {
  const matchedProduct = productOthers.value.find(other =>
    other.productId === item.productId ||
    other.productOptionId === item.productId
  )
  return matchedProduct?.quantity || 0
}

const onSoldOutOpenModal = (item) => {
  categoryIds.value = [
    ...new Set([...categoryIds.value, item])
  ]
  proxy.$refs.soldOutModal.show()
}
deliveryStatusModal
const onDiscontinuedOpenModal = () => {
  proxy.$refs.discontinuedModal.show()
}

const onCancelChange = () => {
  proxy.$refs.orderCancelModal.hide()
}

const onDeliveryOpenModal = async () => {
  const result = await getAddressInfo()
  if (result) {
    proxy.$refs.deliveryStatusModal.show()
  } else {
    proxy.$alert(proxy.$t('ORD_AltText3'))
  }
}

const onAccountRegOpenModal = () => {
  proxy.openModal({
    parent: proxy, // 필수
    component: 'ResponsiveModal',
    componentProps: {
      title: refundAccountInfo?.value?.userRefundBankAccountId ? proxy.$t('ORD_RefundChange') : proxy.$t('ORD_RefundRegist'),
      contentComponent: 'AccountRegModal',
      wrapClass: 'bottom-btn-modal',
      pageState: {
        userId: userInfo.userSeqNo,
        userRefundBankAccountId: refundAccountInfo?.value?.userRefundBankAccountId,
        isBankAccountAuth: refundAccountInfo?.value?.isBankAccountAuth
      },
      readOnly: !!refundAccountInfo?.value?.userRefundBankAccountId,
      onUpdate: init
    }
  })
}

const onOrderCancelOpenModal = async () => {
  proxy.$refs.orderCancelModal.show()
}

const getDetailOrder = async (id) => {
  const result = await orderService.getDetailOrder(id)
  if (result.data) {
    deliveryInfo.value = result.data.deliveryInfo
    orderStatus.value = result.data.orderStatus
    paymentInfo.value = result.data.paymentInfo
    productItems.value = result.data.productsInfo
    productFirst.value = result.data.productsInfo[0]
    productOthers.value = result.data.productsInfo.slice(1)
    productsCount.value = result.data.productsInfo.length
    isSimplePay.value = result.data.paymentInfo.isSimplePay
    isBrandPay.value = result.data.paymentInfo.isBrandPay
    refundInfoDto.value = result.data.refundInfoDto
    deliveryDateDiff.value = getDeliveryDateDiff(result.data.deliveredDatetime)

    orderStatus.value.text = convertOrderStatus(orderStatus.value.text)

    postProductInfo()
  }
}

const getNonMemberDetailOrder = async (tempId, orderId) => {
  const params = {
    identification: tempId,
    orderId: orderId
  }
  const result = await orderService.getNonMemberDetailOrder(params)
  if (result.data) {
    deliveryInfo.value = result.data.deliveryInfo
    orderGuestInfo.value = result.data.orderGuestInfo
    orderStatus.value = result.data.orderStatus
    paymentInfo.value = result.data.paymentInfo
    productItems.value = result.data.productsInfo
    productFirst.value = result.data.productsInfo[0]
    productOthers.value = result.data.productsInfo.slice(1)
    productsCount.value = result.data.productsInfo.length
    isSimplePay.value = result.data.paymentInfo.isSimplePay
    isBrandPay.value = result.data.paymentInfo.isBrandPay
    refundInfoDto.value = result.data.refundInfoDto
    orderStatus.value.text = convertOrderStatus(orderStatus.value.text)
    deliveryDateDiff.value = getDeliveryDateDiff(result.data.deliveredDatetime)

    getGuestProductDetail()
  }
}

const convertOrderStatus = (status) => {
  switch (status) {
    case proxy.$t('ORD_OrderStatus1'):
    case proxy.$t('ORD_OrderStatus2'):
    case proxy.$t('ORD_OrderStatus8'):
      return proxy.$t('ORD_OrderStatus1')
    case proxy.$t('ORD_OrderStatus3'):
      return proxy.$t('ORD_OrderStatus4')
    case proxy.$t('ORD_OrderStatus6'):
      return proxy.$t('ORD_OrderStatus7')
    default:
      return status
  }
}

const postProductInfo = async () => {
  const params = {
    products: productItems.value.map(item => ({
      productId: item.productId,
      productOptionId: item.productOptionId
    }))
  }

  const result = await productService.postProductInfo(params)
  if (result) {
    recommInfos.value = result.data
    firstProduct.value = params.products[0].productOptionId !== null
      ? result.data.find(
        data =>
          data.productId === params.products[0].productId &&
          data.productOptionId === params.products[0].productOptionId
      )
      : result.data.find(
        data => data.productId === params.products[0].productId
      )
    productsInfo.value = params.products
      .filter(paramProduct =>
        paramProduct.productOptionId !== null
          ? paramProduct.productId !== firstProduct.value?.productId ||
          paramProduct.productOptionId !== firstProduct.value?.productOptionId
          : paramProduct.productId !== firstProduct.value?.productId
      )
      .map(paramProduct =>
        paramProduct.productOptionId !== null
          ? result.data.find(
            dataProduct =>
              dataProduct.productId === paramProduct.productId &&
              dataProduct.productOptionId === paramProduct.productOptionId
          )
          : result.data.find(
            dataProduct => dataProduct.productId === paramProduct.productId
          )
      )
  }
}

const getGuestProductDetail = async () => {
  for (let i = 0; i < productItems.value.length; i++) {
    const id = productItems.value[i].productOptionId
      ? productItems.value[i].productOptionId
      : productItems.value[i].productId

    const result = await productService.getGuestProductDetail(id)

    if (result && result.data) {
      recommInfos.value.push(result.data)

      if (i === 0) {
        firstProduct.value = result.data
      } else {
        productsInfo.value.push(result.data)
      }
    }
  }
}

const getAddressInfo = async () => {
  const salesOrderId = orderId
  const result = await orderService.getAddressInfo(salesOrderId)
  if (result) {
    addressInfo.value = result.data
    return true
  } else {
    return false
  }
}

const getReceiptInfo = async () => {
  const salesOrderId = orderId
  const result = await orderService.getReceiptInfo(salesOrderId)

  if (result.data) {
    receiptUrl.value = result.data
    window.open(receiptUrl.value, '_blank', 'noopener,noreferrer,width=800,height=600')
  }
}

const getDownloadTransaction = async () => {
  const salesOrderId = orderId

  const result = await orderService.getDownloadTransaction(salesOrderId)
}

const getDownloadNonMemberTransaction = async () => {
  const params = {
    identification: tempId,
    orderId: orderId
  }
  const result = await orderService.getDownloadNonMemberTransaction(params)
}

const getRefundAccount = async () => {
  const userId = userInfo.userSeqNo
  const result = await memberService.getRefundAccount(userId)

  if (result) {
    refundAccountInfo.value = result.data
  }
}

const getReturnList = async () => {
  const result = await orderService.getReturnList(orderId)

  if (result) {
    returnListInfo.value = result.data.list

    postReturnProductInfo()
  }
}

const postReturnProductInfo = async () => {
  const params = {
    products: returnListInfo.value.map(item => ({
      productId: item.productInfo.productId,
      productOptionId: item.productInfo.productOptionId
    }))
  }

  const result = await productService.postProductInfo(params)
  if (result) {
    returnProductList.value = params.products
      .map(paramProduct =>
        paramProduct.productOptionId !== null
          ? result.data.find(
            dataProduct =>
              dataProduct.productId === paramProduct.productId &&
              dataProduct.productOptionId === paramProduct.productOptionId
          )
          : result.data.find(
            dataProduct => dataProduct.productId === paramProduct.productId
          )
      )
  }
}

const getGuestReturnList = async (id) => {
  const params = {
    identification: id,
    salesOrderId: orderId
  }
  const result = await orderService.getGuestReturnList(params)

  if (result) {
    returnListInfo.value = result.data.list

    getGuestReturnDetail()
  }
}

const getGuestReturnDetail = async () => {
  for (let i = 0; i < returnListInfo.value.length; i++) {
    const id = returnListInfo.value[i].productInfo.productOptionId
      ? returnListInfo.value[i].productInfo.productOptionId
      : returnListInfo.value[i].productInfo.productId

    const result = await productService.getGuestProductDetail(id)

    if (result && result.data) {
      returnProductList.value.push(result.data)
    }
  }
}

const findOptionValue = (productId, returnProductList) => {
  if (!productId || !Array.isArray(returnProductList)) {
    return ''
  }

  const matchedItem = returnProductList.find(
    (info) => info?.productId === productId
  )
  return matchedItem?.optionValues?.[0]?.optionValue || ''
}

const resolveProductName = (item) => {
  if (item?.productInfo?.productOptionId === null) {
    return item?.productInfo?.productName || ''
  }
  const matchedItem = returnProductList.value.find(
    (product) => product.productId === item?.productInfo?.productOptionId
  )

  return matchedItem?.productName || ''
}

const postCancelOrder = async () => {
  if (tempId) {
    const params = {
      identification: tempId,
      orderNumber: deliveryInfo.value.orderNumber,
      cancelReasonCode: selectFilterModel.value,
      isAddToCart: checkbox.value,
      userRefundBankAccountId: refundAccountInfo?.value?.userRefundBankAccountId
    }

    if (!selectFilterModel.value) {
      await proxy.$alert(proxy.$t('ORD_AltText5'))
    } else if (!refundAccountInfo.value && paymentInfo.value?.virtualAccountPaymentInfo) {
      await proxy.$alert(proxy.$t('ORD_AltText6'))
    } else {
      const result = await orderService.postGuestCancelOrder(params)
      if (result.data) {
        proxy.$alert(proxy.$t('ORD_AltText7'), {
          ok: () => {
            router.push({ name: 'OrderList' })
          }
        })
        onCheckboxChange()
      }
    }
  } else {
    const id = deliveryInfo.value.orderNumber
    const params = {
      cancelReasonCode: selectFilterModel.value,
      isAddToCart: checkbox.value,
      userRefundBankAccountId: refundAccountInfo?.value?.userRefundBankAccountId
    }

    if (!selectFilterModel.value) {
      await proxy.$alert(proxy.$t('ORD_AltText5'))
    } else if (!refundAccountInfo.value && paymentInfo.value?.virtualAccountPaymentInfo) {
      await proxy.$alert(proxy.$t('ORD_AltText6'))
    } else {
      const result = await orderService.postCancelOrder(id, params)
      if (result.data) {
        proxy.$alert(proxy.$t('ORD_AltText7'), {
          ok: () => {
            router.push({ name: 'OrderList' })
          }
        })
        onCheckboxChange()
      }
    }
  }
}

const onCheckboxChange = () => {
  if (checkbox.value) {
    const params = []

    productItems.value.forEach(item => {
      const param = {
        productId: item.productId,
        quantity: item.quantity
      }

      if (item.productOptionId !== null) {
        param.productOptionId = item.productOptionId
      }

      params.push(param)
    })
    addCartFn(params)
  }
}

async function addCartFn(param) {
  const params = param
  return postNormalCart.mutate(params, {
    onSuccess: () => {
      addCartConfirm('normal')
    }
  })
}

function addCartConfirm(cartType) {
  if (!isLogined.value) {
    cartStore.updateShouldUpdateRefreshCart(true)
  } else {
    if (cartStore.cartType === 'normal') {
      cartStore.updateShouldUpdateNormalCart(true)
    } else {
      cartStore.updateShouldUpdateAutoCart(true)
    }
  }
}

const getDeliveryDateDiff = (deliveredDatetime) => {
  if (!deliveredDatetime) {
    return 0
  }

  const diffInMilliseconds = Math.abs(new Date(deliveredDatetime) - new Date())
  const diffInDays = Math.ceil(diffInMilliseconds / (1000 * 60 * 60 * 24))

  return diffInDays
}

const checkReturnableOrder = async () => {
  const params = {
    salesOrderId: orderId,
    identification: tempId
  }
  const result = isLogined.value
    ? await orderService.checkReturnableOrder(orderId)
    : await orderService.checkNonMemberReturnableOrder(params)

  if (result) {
    onRequestReturn()
  }
}

const onRequestReturn = async () => {
  sessionDataManager.remove('returnProductList')

  let message

  if (deliveryDateDiff.value > 30 && deliveryDateDiff.value <= 60) {
    message = proxy.$t('ORD_AltText8')
  } else if (deliveryDateDiff.value > 60 && deliveryDateDiff.value <= 90) {
    message = proxy.$t('ORD_AltText9')
  }

  if (isPlanner.value && message) {
    await proxy.$confirm(message, {
      title: '',
      ok: () => {
        router.push(`/return/step1/${orderId}`)
      },
      cancel: () => {
        return
      }
    })
  } else {
    router.push({ path: `/return/step1/${orderId}`, query: { tempId } })
  }
}

const goToReturn = (item) => {
  if (tempId) {
    if (item?.returnOrderBaseInfo?.returnOrderStatus?.code === 'RETURN_REQUEST' && !item?.returnOrderBaseInfo?.isReceptionApproval) {
      proxy.$alert(proxy.$t('RET_ReturnApprovalDesc'))
    } else if (item?.returnOrderBaseInfo?.returnOrderStatus?.code === 'RETURN_REQUEST' && !item?.returnOrderBaseInfo?.isReturnOrderAgree) {
      router.push({
        path: `/return/step3/${item?.returnOrderBaseInfo?.salesOrderId}`,
        state: {
          salesOrderId: item?.returnOrderBaseInfo?.salesOrderId,
          returnOrderNumber: item?.returnOrderBaseInfo?.returnOrderNumber
        },
        query: {
          tempId: tempId
        }
      })
    } else {
      router.push({
        path: '/mypage/returnDetail',
        query: {
          returnNumber: item.returnOrderBaseInfo.returnOrderNumber,
          tempId: tempId
        }
      })
    }
  } else {
    if (item?.returnOrderBaseInfo?.returnOrderStatus?.code === 'RETURN_REQUEST' && !item?.returnOrderBaseInfo?.isReceptionApproval) {
      proxy.$alert(proxy.$t('RET_ReturnApprovalDesc'))
    } else if (item?.returnOrderBaseInfo?.returnOrderStatus?.code === 'RETURN_REQUEST' && !item?.returnOrderBaseInfo?.isReturnOrderAgree) {
      router.push({
        path: `/return/step3/${item?.returnOrderBaseInfo?.salesOrderId}`,
        state: {
          salesOrderId: item?.returnOrderBaseInfo?.salesOrderId,
          returnOrderNumber: item?.returnOrderBaseInfo?.returnOrderNumber
        }
      })
    } else {
      router.push({
        name: 'ReturnDetail',
        query: {
          returnNumber: item.returnOrderBaseInfo.returnOrderNumber
        }
      })
    }
  }
}

const openTrackingUrl = (item) => {
  const url = `https://trace.cjlogistics.com/next/tracking.html?wblNo=${item}`
  window.open(url, '_blank', 'noopener,noreferrer')
}

const goToLogin = async () => {
  await proxy.$confirm(proxy.$t('CM_UseAferLogin'), {
    title: proxy.$t('CM_RecommLogin'),
    ok: () => {
      router.push({ path: '/login' })
    },
    cancel: () => {
      return
    },
    okLabel: proxy.$t('CM_MovePage'),
    cancelLabel: proxy.$t('CM_No')
  })
}

const onOpenModal = () => {
  proxy.openModal(
    {
      parent: proxy,
      component: tempId ? 'AddressModal' : 'AddressListModal',
      componentProps: {
        addressInfo: deliveryInfo?.value?.receiver?.addressInfo,
        firstName: deliveryInfo?.value?.receiver?.receiverInfo?.receiverFirstName,
        lastName: deliveryInfo?.value?.receiver?.receiverInfo?.receiverLastName,
        phoneNumber: deliveryInfo?.value?.receiver?.receiverInfo?.receiverPhoneNumber,
        addressId: deliveryInfo?.value?.receiver?.userAddressId,
        guestYn: !!tempId
      },
      modeless: false
    })
    .onOk((val) => {
      onChangeAddress(val)
    })
}

const onChangeAddress = async (val) => {
  init()
  if (orderStatus?.value?.code === 'INFORMATION_RECEIVED') {
    proxy.$alert(proxy.$t('ORD_AltText11'))
  } else {
    postChangeAddress(val)
  }
}

const postChangeAddress = async (val) => {
  const params = {
    salesOrderId: orderId,
    zipCode: val?.zipcode,
    state: val?.state,
    city: val?.city,
    address: val?.address1,
    addressDetail: val?.address2
  }
  const result = await orderService.postChangeAddress(params)

  if (result) {
    deliveryInfo.value.receiver.addressInfo.zipcode = result?.data?.zipCode
    deliveryInfo.value.receiver.addressInfo.address = result?.data?.address
    deliveryInfo.value.receiver.addressInfo.addressDetail = result?.data?.addressDetail
  }

  proxy.$alert(proxy.$t('ORD_AltText12'))

  init()
}

const init = () => {
  if (!isLogined.value && !tempId) {
    goToLogin()
    return
  }
  if (tempId) {
    getNonMemberDetailOrder(tempId, orderId)
    getGuestReturnList(tempId)
  } else {
    getDetailOrder(orderId)
    getReturnList()
    getRefundAccount()
  }
}

onMounted(() => {
  init()
})
</script>

<style lang="scss" scoped>
</style>
