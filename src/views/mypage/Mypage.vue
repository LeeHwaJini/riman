<!--
  Mypage Main
  create by jhchoi
-->

<template>
  <section class="mypage-main-section">
    <div class="mypage-left-content">
      <div class="member-name-info-area">
        <div class="member-name-area">{{ $nameFormat(userInfo.lastName, userInfo.firstName) }}</div>

        <div class="member-info-area">
          <span class="member-id-text">{{ userInfo.userNumber }}</span>

          <div v-if="isPlanner" class="planner-member-class-area pointer" @click.stop="onRankOpenModal">
            <span class="planner-text">{{ userInfo.rank }}</span>
            <i class="ico arrow-circle-right-n pointer"/>
          </div>

          <router-link v-else to="/mypage/conversionToPlanner/certificate" class="customer-member-class-area">
            <b class="primary09-color planner-change-text">{{ $t('NAV_ConvertToPlanner') }}</b>
            <i class="ico arrow-right-n"/>
          </router-link>

        </div>
      </div>

      <!-- 플래너일 경우 제거 -->
      <div v-if="isPlanner" class="btn type02 full personal-mall-btn-area pointer" @click.stop="openPersonalModal">
        <div class="text-area">
          <b>{{ $t('MY_ShareMallLink') }}</b>
          <span>{{ $t('MY_ShareMallLinkIntro') }}</span>
        </div>
      </div>
      <!-- //플래너일 경우 제거 -->

      <div class="pc-side-menu-area">
        <!-- 플래너일 경우 제거 -->
        <div v-if="isPlanner" class="mypage-side-menu">
          <b class="title">{{ $t('MY_Business') }}</b>
          <ul>
            <li class="pointer" @click="router.push({path: '/mypage/personalMall'})">
              {{ $t('PM_ManagePersonalMall') }}
            </li>
            <li class="pointer" @click="router.push({path: '/mypage/easybag'})">
              {{ $t('MY_ManageEasyBag') }}
            </li>
            <li v-if="isDivein" class="pointer" @click="router.push({path: `divein/${userInfo.userNumber}`})">
              {{ $t('MY_ManageDiveIn') }}
            </li>
            <li class="flex-btn-area pointer" @click="router.push({path: '/mypage/allowanceInfo'})">
              <span>{{ $t('NAV_AllowancePayment') }}</span>
              <span v-if="!pageState.isAllowancePayment" class="btn type08 success04-color" @click.stop="router.push('/mypage/allowanceInfo')">
                {{ $t('MUI_NotAllowancePayment') }}
              </span>
            </li>
            <li class="pointer" @click="router.push({path: '/mypage/checkPlannerDocument'})">
              {{ $t('NAV_CheckPlannerDocumet') }}
            </li>
          </ul>
        </div>
        <!-- //플래너일 경우 제거 -->

        <div class="mypage-side-menu">
          <b class="title">{{ $t('MY_UserInfo') }}</b>
          <ul>
            <li class="pointer" @click="router.push({path: '/mypage/userInfo'})">
              {{ $t('MY_ManageUserInfo') }}
            </li>
            <li class="pointer" @click="router.push({path: '/customer/inquiry/list'})">
              {{ $t('MY_Inquery') }}
            </li>
            <li class="pointer" @click="onClickRimanPay">{{ $t('MY_ManageRimanPay') }}</li>
            <li v-if="isAutoship" class="pointer" @click="router.push({path: '/mypage/autoshipCard'})">
              {{ $t('MY_ManageAutoshipCard') }}
            </li>
          </ul>
        </div>

        <div class="log-out-btn-area">
          <RButton
            :label="$t('CM_Logout')"
            class="btn type13 "
            @on-click="onClickLogout"
          />
        </div>

      </div>

    </div>

    <div class="mypage-right-content">

      <ul class="mypage-user-box-area">
        <!-- 커스터머일 경우 class="customer-layout" 추가 -->
        <li :class="{'customer-layout':!isPlanner}">
          <div class="customer-point-area">
            <router-link to="/mypage/point">
              <div class="icon-bg-area type01">
                <i class="ico point-n"></i>
              </div>
              <div class="top-text">{{ $t('OP_Point') }}</div>
            </router-link>
          </div>
          <div class="bottom-text">
            <router-link to="/mypage/point">
              {{ $moneyFormat(pageState.activePoint) }}<span class="medium">{{ $t('CM_PointUnit') }}</span>
            </router-link>
          </div>
        </li>

        <!-- //커스터머일 경우 class="customer-layout" 추가 -->

        <li v-if="isAutoship">
          <div class="icon-bg-area type01">
            <i class="ico ticket-n"></i>
          </div>

          <div class="top-text">{{ $t('CM_Coupon') }}</div>
          <div class="bottom-text">
            5
          </div>
        </li>

        <!-- 플래너일 경우 제거 -->
        <li v-if="isPlanner" class="">
          <div class="icon-bg-area type01 relative">
            <router-link to="/update">
              <i class="ico cs-n"></i>
              <span v-if="pageState.unreadCnt > 0" class="badge type02">NEW</span>
            </router-link>
          </div>
          <div class="top-text regular">
            <router-link to="/update">
              {{ $t('NAV_Notice') }}
            </router-link>
          </div>
          <div class="bottom-text">
            <router-link to="/update">
              {{ $displayMaxNumber(pageState.unreadCnt) }}
            </router-link>
          </div>
        </li>
        <!-- //플래너일 경우 제거 -->
      </ul>

      <div class="mypage-delivery-area">
        <div class="title-area">
          <router-link to="/mypage/orderList">
            <div class="flex-btn-area gap4">
              <i class="ico delivery" />
              <h4>{{ $t('MY_DeliveryList') }}</h4>
              <i class="ico arrow-right-n" />
            </div>
          </router-link>

          <RButton
            :label="$t('CM_ManageAddress')"
            class="btn type03 medium plr8 delivery-btn pointer"
            @click="onAddressOpenModal"
          />
        </div>
        <ul class="delivery-info-area delivery-box-area">
          <li class="pointer" @click.stop="router.push('/mypage/orderList')">
            <b :class="{'active':pageState?.depositBefore>0}">{{ $displayMaxNumber(pageState?.depositBefore) }}</b>
            <span>{{ $t('MY_DepositBefore') }}</span>
          </li>
          <li class="pointer" @click.stop="router.push('/mypage/orderList')">
            <b :class="{'active':pageState?.orderComplete>0}">{{ $displayMaxNumber(pageState?.orderComplete) }}</b>
            <span>{{ $t('MY_OrderComplete') }}</span>
          </li>
          <li class="pointer" @click.stop="router.push('/mypage/orderList')">
            <b :class="{'active':pageState?.readyToShip>0}">{{ $displayMaxNumber(pageState?.readyToShip) }}</b>
            <span>{{ $t('ORD_OrderStatus4') }}</span>
          </li>
          <li class="pointer" @click.stop="router.push('/mypage/orderList')">
            <b :class="{'active':pageState?.shippingOrders>0}">{{ $displayMaxNumber(pageState?.shippingOrders) }}</b>
            <span>{{ $t('MY_ShippingOrders') }}</span>
          </li>
          <li class="pointer" @click.stop="router.push('/mypage/orderList')">
            <b :class="{'active':pageState?.deliveredOrders>0}">{{ $displayMaxNumber(pageState?.deliveredOrders) }}</b>
            <span>{{ $t('ORD_OrderStatus1') }}</span>
          </li>
        </ul>

        <ul class="delivery-cancel-info-area" >
          <li class="pointer" @click.stop="router.push('/mypage/orderList')">
            <span>{{ $t('MY_CancelOrder') }}</span>
            <b :class="{'active':pageState?.cancelOrder>0}">{{ $displayMaxNumber(pageState?.cancelOrder) }}</b>
          </li>
          <li class="pointer" @click.stop="router.push('/mypage/returnList')">
            <span>{{ $t('CM_Return') }}</span>
            <b :class="{'active':pageState?.returnOrder>0}">{{ $displayMaxNumber(pageState?.returnOrder) }}</b>
          </li>
        </ul>
      </div>

      <div v-if="isAutoship" class="mypage-delivery-area mypage-regular-delivery-area">
        <div class="title-area">
          <div class="flex-btn-area">
            <i class="ico riman-coin" />
            <div class="flex-btn-area">
              <h4>{{ $t('MY_Autoship') }}</h4>
              <div class="subscribe-count-text">
                <span class="gray04-color">{{ $t('MY_Subscribe') }}</span>
                <span class="success04-color">N</span>
                <span class="gray04-color">{{ $t('CM_Count') }}</span>
              </div>
              <i class="ico arrow-right-n" />
            </div>
          </div>

          <RButton
            v-if="1"
            :label="$t('MY_AutoshipDelivery')"
            class="btn type03 medium plr8 regular-delivery-btn"
          />
        </div>

        <div v-if="isAutoship" class="regular-delivery-banner-area">
          <div class="banner-area">
            <div>
              <div class="text" v-html="$t('MY_AutoshipBanner')" />
              <div class="btn type02 regular-delivery-btn-area">
                {{ $t('MY_StartAutoship') }}
              </div>
            </div>

            <div class="banner-img"/>
          </div>
        </div>

        <swiper
          v-else
          :slides-per-view="'auto'"
          :free-mode="true"
          :pagination="{
            type: 'progressbar',
            clickable: true,
          }"
          :navigation="true"
          :modules="modules"
          class="slide-bar-color-none regular-delivery-slide"
        >
          <swiper-slide v-for="item in 6" :key="item">
            <div class="top-area">
              <div class="delivery-area">
                <span class="delivery-name">{배송지명}</span>
                <span class="btn type14">{{ $t('OP_DefaultDelivery') }}</span>
              </div>
              <div class="delivery-count">
                999<span class="regular">{{ $t('CM_Unit') }}</span>
              </div>
            </div>

            <div class="bottom-area">
              <div class="delivery-payment-date">
                <span class="gray04-color">{{ $t('CM_EveryMonth') }}</span> 25{{ $t('CM_Day') }}
              </div>
              <div class="delivery-payment-count">
                <div class="">
                  <span class="gray04-color">{{ $t('CM_Round') }}</span> 13{{ $t('CM_Times') }}
                </div>

                <div class="flex align-center gap4 ml8">
                  <i class="ico complate active" />
                  <i class="ico complate" />
                  <i class="ico gift" />
                </div>
              </div>
            </div>

            <div class="delivery-total-price-area">
              <b>9,990,000{{ $t('CM_Won') }}</b>
              <span>999,999 {{ $t('CM_Sp') }} / 999,999 {{ $t('CM_Bp') }}</span>
            </div>
          </swiper-slide>
        </swiper>
      </div>

      <!-- 모바일 사이드 메뉴 -->
      <div class="mo-side-menu-area">
        <div v-if="isPlanner" class="mypage-side-menu">
          <b class="title">{{ $t('MY_Business') }}</b>
          <ul>
            <li @click="router.push({path: '/mypage/personalMall'})">
              {{ $t('PM_ManagePersonalMall') }}
            </li>
            <li @click="router.push({path: '/mypage/easybag'})">
              {{ $t('MY_ManageEasyBag') }}
            </li>
            <li v-if="isDivein" @click="router.push({path: `divein/${userInfo.userNumber}`})">
              {{ $t('MY_ManageDiveIn') }}
            </li>
            <li class="flex-btn-area" @click="router.push({path: '/mypage/allowanceInfo'})">
              <span>{{ $t('NAV_AllowancePayment') }}</span>
              <span v-if="!pageState.isAllowancePayment" class="btn type08 success04-color" @click.stop="router.push('/mypage/allowanceInfo')">
                {{ $t('MUI_NotAllowancePayment') }}
              </span>

            </li>
            <li @click="router.push({path: '/mypage/checkPlannerDocument'})">
              {{ $t('NAV_CheckPlannerDocumet') }}
            </li>
          </ul>
        </div>

        <div class="mypage-side-menu">
          <b class="title">{{ $t('MY_UserInfo') }}</b>
          <ul>
            <li @click="router.push({path: '/mypage/userInfo'})">
              {{ $t('MY_ManageUserInfo') }}
            </li>
            <li @click="router.push({path: '/customer/inquiry/list'})">
              {{ $t('MY_Inquery') }}
            </li>
            <li @click="onClickRimanPay">{{ $t('MY_ManageRimanPay') }}</li>
            <li v-if="isAutoship" @click="router.push({path: '/mypage/autoshipCard'})">
              {{ $t('MY_ManageAutoshipCard') }}
            </li>
          </ul>
        </div>

        <div class="log-out-btn-area pc-1023">
          <RButton
            :label="$t('CM_Logout')"
            class="btn type13 "
            @on-click="onClickLogout"
          />
        </div>
      </div>
      <!-- //모바일 사이드 메뉴 -->

      <div v-if="isTablet ? isMobile ? banner?.image.mobile : banner?.image.tablet : banner?.image.pc">
        <img
          class="mypage-marketing-banner-area"
          :src="addPrefixForImage(isTablet ? isMobile ? banner?.image.mobile : banner?.image.tablet : banner?.image.pc)"
          :class="[{'img-cover': true, 'with-link': banner?.link}]"
          @click="onClickBanner(banner.link)"/>
      </div>

      <!-- 모바일 로그아웃 버튼 -->
      <div class="log-out-btn-area mo">
        <RButton
          :label="$t('CM_Logout')"
          class="btn type13 "
          @on-click="onClickLogout"
        />
      </div>
      <!-- //모바일 로그아웃 버튼 -->

    </div>

    <FullPageModal
      ref="rankModal"
      class="title-blank-none">
      <template #title>
        <h4>{{ $t('MY_Rank') }}</h4>
      </template>
      <template #body>
        <div class="popupo-max-h-530 scroll type01">
          <div class="rank-info-arae">
            <div class="member-rank-area">
              <!--
              <i class="ico director" />
              <i class="ico manager" />
              <i class="ico nationalDirector" />
              <i class="ico planner" />
              <i class="ico seniorDirector" />
              <i class="ico seniorManager" />
              <i class="ico teamLeader" />
              -->
              <i :class="`ico ${ userInfo.rank }`" />
              <b class="member-name-text">{{ $nameFormat(userInfo.lastName, userInfo.firstName) }}</b>
            </div>
            <div class="between-line-area">
              <span class="line">{{ $t('CM_JoinDate') }}: {{ formatDate(userInfo.joinDatetime, 'YYYY. MM. DD') }}</span>
              <span v-if="userInfo.beautyPlannerDatetime" class="line">
                {{ $t('MY_PlannerDate') }}: {{ formatDate(userInfo.beautyPlannerDatetime, 'YYYY. MM. DD') }}
              </span>
            </div>
          </div>

          <div class="plr16 pb24 border-bottom-3-gray">
            <h6 class="ptb16 gray07-color bold">{{ pageState.nextRank }} {{ $t('MY_NextRankStatus') }}</h6>

            <RButton class="btn full large type11" :label="$t('MY_GoRbo')" @on-click="goRboSite"/>
          </div>

          <div class="plr16 pb48">
            <h6 class="ptb16 gray07-color bold">{{ $t('MY_BenefitRank') }}</h6>

            <!--
              <i class="ico director" />
              <i class="ico manager" />
              <i class="ico nationalDirector" />
              <i class="ico planner" />
              <i class="ico seniorDirector" />
              <i class="ico seniorManager" />
              <i class="ico teamLeader" />
              -->

            <table class="table type02">
              <thead>
                <tr>
                  <th>{{ $t('MY_RankTitle') }}</th>
                  <th>{{ $t('MY_RankContent') }}</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>
                    <div class="rank-text-info-area">
                      <i class="ico NATIONAL_DIRECTOR" />
                      <b class="rank-name-text" v-html="$t('MY_NationalDirector')" />
                      <span class="month-promotion-text">{{ $t('MY_MonthlyRaise') }}</span>
                    </div>
                  </td>
                  <td>
                    <b>{{ $t('MY_NDCont1') }}<br/>{{ $t('MY_NDCont2', {sp:'500,000'}) }}</b><br class="mo"/>
                    <b>{{ $t('MY_NDCont3', {count:'4'}) }}</b>
                    <br class="mo"/>
                    {{ $t('MY_NDCont4') }}<br/>
                    {{ $t('MY_NDCont5', {sp: '250,000'}) }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="rank-text-info-area">
                      <i class="ico SENIOR_DIRECTOR" />
                      <b class="rank-name-text" v-html="$t('MY_SeniorDirector')" />
                      <span class="month-promotion-text">{{ $t('MY_MonthlyRaise') }}</span>
                    </div>
                  </td>
                  <td>
                    <b>{{ $t('MY_NDCont1') }}<br/>{{ $t('MY_NDCont2', {sp:'300,000'}) }}</b><br class="mo"/>
                    <b>{{ $t('MY_NDCont3', {count:'2'}) }}</b>
                    <br class="mo"/>
                    {{ $t('MY_NDCont4') }}<br/>
                    {{ $t('MY_NDCont5') }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="rank-text-info-area">
                      <i class="ico DIRECTOR" />
                      <b class="rank-name-text">{{ $t('MY_Director') }}</b>
                      <span class="month-promotion-text">{{ $t('MY_MonthlyRaise') }}</span>
                    </div>
                  </td>
                  <td>
                    <b>{{ $t('MY_DCont1') }}<br class="mo"/>{{ $t('MY_NDCont2', {sp:'600,000'}) }}</b><br class="mo"/>
                    <b>{{ $t('MY_DCont2') }}</b>
                    <br class="mo"/>
                    {{ $t('MY_NDCont4') }}<br/>
                    {{ $t('MY_NDCont5', {sp: '300,000'}) }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="rank-text-info-area">
                      <i class="ico TEAM_LEADER" />
                      <b class="rank-name-text" v-html="$t('MY_TeamLeader')" />
                      <span class="month-promotion-text">{{ $t('MY_MonthlyRaise') }}</span>
                    </div>
                  </td>
                  <td>
                    <b>{{ $t('MY_TLCont1') }}</b><br class="mo"/>
                    <b>{{ $t('MY_TLCont2') }} <br class="mo"/>{{ $t('MY_TLCont3') }}</b>
                    <br class="mo"/>
                    {{ $t('MY_TLCont4') }}<br/>
                    {{ $t('MY_TLCont5') }}<br/>
                    {{ $t('MY_TLCont6') }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="rank-text-info-area">
                      <i class="ico SENIOR_MANAGER" />
                      <b class="rank-name-text" v-html="$t('MY_SeniorManager')" />
                      <span class="month-promotion-text primary04-color">{{ $t('MY_DayRaise') }}</span>
                    </div>
                  </td>
                  <td>
                    <b>{{ $t('MY_SMCont1') }}<br />{{ $t('MY_NDCont2', {sp: '6,000'}) }}</b>
                    <br class="mo"/>
                    {{ $t('MY_SMCont2', {sp: '3,000'}) }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="rank-text-info-area">
                      <i class="ico MANAGER" />
                      <b class="rank-name-text">{{ $t('MY_Manager') }}</b>
                      <span class="month-promotion-text primary04-color">{{ $t('MY_DayRaise') }}</span>
                    </div>
                  </td>
                  <td>
                    <b>{{ $t('MY_SMCont1') }}<br />{{ $t('MY_NDCont2', {sp: '3,000'}) }}</b>
                    <br class="mo"/>
                    {{ $t('MY_SMCont2', {sp: '1,500'}) }}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="rank-text-info-area">
                      <i class="ico PLANNER" />
                      <b class="rank-name-text">{{ $t('MY_Planner') }}</b>
                      <span class="month-promotion-text primary04-color">{{ $t('MY_DayRaise') }}</span>
                    </div>
                  </td>
                  <td>
                    <b>{{ $t('MY_PCont1') }}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </template>
    </FullPageModal>

  </section>
</template>
<script setup>
import { getCurrentInstance, onMounted, computed, reactive, ref } from 'vue'
import { formatDate } from '@/utils/dateFormat'
import { useMainStore } from '@/store/mainStore'
import orderService from '@/http/services/order'
import mypageService from '@/http/services/mypage'

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'

import { addPrefixForImage, checkPlanner } from '@/utils/common'
import { useRouter } from 'vue-router'
import etcService from '@/http/services/etc'
import { goRboSite } from '@/utils/common'

const { proxy } = getCurrentInstance()
const mainStore = useMainStore()
const userInfo = mainStore.getUser
const router = useRouter()
const isAutoship = import.meta.env.VITE_APP_IS_AUTOSHIP === 'true'
const isPlanner = computed(() => checkPlanner())
const isMobile = computed(() => proxy.$isMobile())
const isTablet = computed(() => proxy.$isTablet())

const customerKey = userInfo.userSeqNo
const isDivein = import.meta.env.VITE_APP_IS_DIVEIN === 'true'

const banner = ref(undefined)

const data = reactive({
  activePoint: 0,
  depositBefore: 0,
  orderComplete: 0,
  readyToShip: 0,
  shippingOrders: 0,
  deliveredOrders: 0,
  cancelOrder: 0,
  returnOrder: 0,
  unreadCnt: 0,
  isAllowancePayment: false,
  nextRank: ''
})

const pageState = computed(() => {
  return {
    activePoint: data.activePoint,
    depositBefore: data.depositBefore,
    orderComplete: data.orderComplete,
    readyToShip: data.readyToShip,
    shippingOrders: data.shippingOrders,
    deliveredOrders: data.deliveredOrders,
    cancelOrder: data.cancelOrder,
    returnOrder: data.returnOrder,
    unreadCnt: data.unreadCnt,
    isAllowancePayment: data.isAllowancePayment,
    nextRank: data.nextRank
  }
})

onMounted(() => {
  if (!window.brandpay) {
    console.error('Brandpay 가 로드되지 않았습니다.')
    return
  }
  getPoint()
  getStatusCount()
  getNotification()
  getUserInfo()

  getNextRank()
  getBanner()
})

/**
 * 가용 포인트
 */
const getPoint = async () => {
  const res = await orderService.getPoint(mainStore.getUser.userSeqNo)
  if (res) {
    data.activePoint = res.data.activePoint
  }
}

/**
 * 주문/배송조회
 */
const getStatusCount = async () => {
  const res = await mypageService.getStatusCount()
  if (res) {
    data.depositBefore = res.data.depositBefore
    data.orderComplete = res.data.orderComplete
    data.readyToShip = res.data.readyToShip
    data.shippingOrders = res.data.shippingOrders
    data.deliveredOrders = res.data.deliveredOrders
    data.cancelOrder = res.data.cancelOrder
    data.returnOrder = res.data.returnOrder
  }
}

/**
 * 플래너 공지사항 > 읽지 않은 갯수
 */
const getNotification = async () => {
  if (!isPlanner.value || userInfo?.userSeqNo === undefined || userInfo?.rank === undefined) {
    return
  }
  const params = {
    userId: userInfo?.userSeqNo,
    rank: userInfo?.rank
  }
  const res = await mypageService.getUnreadCount(params)
  if (res) {
    data.unreadCnt = res.data.nonReadNoticeCnt
  }
}

/**
 * 수당지급 가능 여부 체크
 */
const getUserInfo = async () => {
  const result = await mypageService.getUserInfo(userInfo.userSeqNo)
  if (result && result.message === 'success') {
    data.isAllowancePayment = result.data?.isAllowancePayment
  }
}

/**
 * 해당 회원의 1단계 위 등급 표기 (최상위 등급일 경우,최상위 등급 그대로 표기)
 */
const getNextRank = () => {
  const oRank = ['PLANNER', 'MANAGER', 'SENIOR_MANAGER', 'TEAM_LEADER', 'DIRECTOR', 'SENIOR_DIRECTOR', 'NATIONAL_DIRECTOR']
  const currentRankIndex = oRank.indexOf(userInfo.rank)

  if (currentRankIndex !== -1) {
    data.nextRank = oRank[Math.min(currentRankIndex + 1, oRank.length - 1)]
  }
}

const getBanner = async () => {
  const param = {
    location: 'MYPAGE_BOTTOM'
  }
  const result = await etcService.getBanner(param)

  if (result) {
    banner.value = result.data
  }
}

const onClickBanner = (link) => {
  if (!link) return
  router.push(link)
}

/**
 * 퍼스널 몰 링크 모달 열기
 */
const openPersonalModal = () => {
  window.dispatchEvent(new Event('openPersonalModal'))
}

/**
 * 배송지관리 모달 열기
 */
const onAddressOpenModal = () => {
  proxy.openModal(
    {
      parent: proxy,
      component: 'AddressListModal',
      componentProps: {
        isNoChoice: true
      },
      modeless: false
    })
}

/**
 * 나의 직급 모달 열기
 */
const onRankOpenModal = () => {
  proxy.$refs.rankModal.show()
}

/**
 * 로그아웃
 */
const onClickLogout = async () => {
  proxy.$confirm('로그아웃 하시겠습니까?', {
    title: '',
    ok: async function () {
      const result = await mainStore.onLogout()
      if (result) {
        proxy.$emit('closeMenu')
        router.push({ name: 'Home' })
      }
    },
    okLabel: proxy.$t('CNF_OKLogout'),
    cancelLabel: proxy.$t('CM_No')
  })
}

// 리만페이 관리 설정 페이지 오픈
const onClickRimanPay = async () => {
  const brandWidget = window.brandpay.brandpay({
    customerKey
  })
  brandWidget.openSettings()
}

</script>
<style lang="scss" scoped>
.with-link {
  cursor: pointer;
}
</style>

