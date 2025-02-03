<!--
  탈퇴 이전 팝업 & 유의사항 확인 및 인증
  create by jhchoi
-->
<template>
  <q-dialog
    ref="modal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    class=""
    @hide="hide"

  >
    <layout-modal
      ref="layoutModal"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <div class="text-center bold font-16" v-html="$t('MWC_ModalContent',{'name':pageState.userName })" />

        <div v-if="isCoupon" class="mt16 flex align-center justify-between font-14 gray04-color medium">
          <span class="medium">{{ $t('MWC_Coupon') }}</span>
          <div>
            <span class="font-12">{{ $t('MWC_ActiveCoupon') }}</span>
            <span class="ml2 gray07-color">{{ $moneyFormat(pageState.activeCoupon) }}{{ $t('CM_Unit') }}</span>
          </div>
        </div>

        <div class="mt8 flex align-center justify-between font-14 gray04-color medium">
          <span class="medium">{{ $t('MWC_Point') }}</span>
          <div>
            <span class="font-12">{{ $t('MWC_ActivePoint') }}</span>
            <span class="ml2 gray07-color">{{ $moneyFormat(pageState.activePoint) }}{{ $t('CM_PointUnit') }}</span>
          </div>
        </div>

        <div class="mt24">
          <RButton class="btn full small type02 mb4" :label="$t('MWC_ModalCancel')" @click="hide" />
          <RButton class="btn full small type03" :label="$t('MWC_ModalOk')" @click="onClickOkBtn"/>
        </div>

      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@store/mainStore'
import orderService from '@/http/services/order'
import mypageService from '@/http/services/mypage'

const router = useRouter()
const mainStore = useMainStore()
const userInfo = mainStore.getUser
const isCoupon = import.meta.env.VITE_APP_IS_COUPON === 'true'
const { proxy } = getCurrentInstance()
const modal = ref()

const pageState = reactive({
  userName: '',
  activePoint: 0,
  activeCoupon: 0
})

onMounted(() => {
  pageState.userName = userInfo.fullName
  getPoint()
  getCoupon()
})

/**
 * 보유 포인트 조회
 */
const getPoint = async () => {
  const result = await orderService.getPoint(userInfo.userSeqNo)
  if (result && result.message === 'success') {
    pageState.activePoint = result.data.activePoint
  }
}

/**
 * 보유 쿠폰 조회
 */
const getCoupon = async () => {
  if (!isCoupon) {
    return false
  }
  const couponResult = await orderService.getOwnedCouponsAll()
  if (couponResult && couponResult.message === 'success') {
    pageState.activeCoupon = couponResult.data.list.length
  }
}

// 팝업 Hide 호출
const hide = () => {
  modal.value.hide()
}

/**
 * 혜택 포기하고 탈퇴 하기 >  진행 중인 주문 및 반품이 존재하는지 여부 조회
 */
const onClickOkBtn = async () => {
  const response = await mypageService.getProgressOrder(userInfo.userSeqNo)
  if (response) {
    hide()
    if (response.data.isExistProgress) {
      proxy.$alert(proxy.$t('MWC_ValidationExistProgress'))
      return false
    } else if (response.data.deliveredCount > 0) {
      proxy.$confirm(
        proxy.$t('CNF_Withdrawal'), {
          ok: async () => {
            router.push({ name: 'Withdrawal' })
          }
        }
      )
    } else {
      router.push({ name: 'Withdrawal' })
    }
  }
}

</script>

