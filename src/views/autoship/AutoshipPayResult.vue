<!--
정기구매 관리
create by rhkim06
정기구매 작업이 홀딩이 되어 작업이 중단되었습니다. 2024-10-11
-->
<template>
  <div class="payment-sucess-wrap pb144">
    <hgroup class="main-title-area">
      <h3>정기구매 주문이<br>완료되었습니다.</h3>
    </hgroup>

    <ul class="list type03">
      <li>
        <h6>배송지 정보</h6>
        <dl class="order-info-list-area">
          <dt>주문번호</dt>
          <dd>K202409382738920</dd>

          <dt>주문일시</dt>
          <dd>yyyy-mm-dd 21:18:56</dd>

          <dt>자동결제일</dt>
          <dd>매월 10일</dd>

          <dt>이름</dt>
          <dd>배송지이름_홍길동</dd>

          <dt>휴대폰</dt>
          <dd>010-1234-5678</dd>

          <dt>주소</dt>
          <dd>{우편번호} {adress1}{adress2}</dd>

          <dt>배송메세지</dt>
          <dd>경비실에 맡겨주세요.</dd>
        </dl>
      </li>
      <li>
        <h6>주문상품 정보</h6>
        <dl class="order-info-list-area">
          <dt>상품명</dt>
          <dd>{1번째 제품명} 외 5개</dd>
          <dt>수량</dt>
          <dd>N개</dd>
        </dl>

        <!-- 회원일 경우 -->
        <div class="payment-order-price-area">
          <div class="top-area flex align-center justify-between">
            <span class="primary09-color medium">주문금액</span>
            <div class="price-text-area flex align-center gap4">
              <span>150,000원</span>
              <!-- 소비자일 경우 제거 -->
              <i v-if="1" class="ico riman-coin-y" @click="$notify('SP : 0000 | BP : 0000', '', 'tooltip-close-none')" />
              <!-- //소비자일 경우 제거 -->
            </div>
          </div>

          <dl class="order-info-list-area">
            <dt>배송비</dt>
            <dd>N원</dd>
            <dt>쿠폰할인</dt>
            <dd>-N원</dd>
            <dt>등급할인</dt>
            <dd>-N원</dd>
            <dt>포인트 사용</dt>
            <dd>-0P</dd>
          </dl>
        </div>

        <ul class="order-result-price-area">
          <li>
            <span class="left-title-area primary09-color">총 결제금액</span>
            <div class="price-text-area">
              <span>150,000</span>
              <span>원</span>
            </div>
          </li>

          <li>
            <span class="left-title-area">적립예정 포인트</span>
            <div class="price-text-area">
              <span>000,000</span>
              <span>P</span>
            </div>
          </li>
        </ul>
      </li>

      <li>
        <h6>결제정보</h6>
        <dl class="order-info-list-area">
          <dt>결제수단</dt>
          <dd>자주 쓰는 카드</dd>

          <dt>결제카드</dt>
          <dd>현대카드 1234-****-****-4321</dd>

          <dt>승인일시</dt>
          <dd>yyyy.mm.dd hh:mm:ss  </dd>
        </dl>
      </li>
    </ul>

    <div class="bottom-btn">
      <div class="flex-btn-area">
        <RButton class="btn full small type03" label="주문내역조회" @on-click="" />
        <RButton class="btn full small type02" label="정기구매 관리" @on-click="" />
      </div>

    </div>
  </div>
</template>
<script setup>
import autoshipService from '@/http/services/autoship'
import orderService from '@/http/services/order'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()
async function getPaymentResult() {
  const res = await autoshipService.getSubscribeCreate(route.params.salesOrderId)
}
onMounted(() => {
  getPaymentResult()
})
</script>
