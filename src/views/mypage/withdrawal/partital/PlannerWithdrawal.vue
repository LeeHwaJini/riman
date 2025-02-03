<!--
  마이페이지 > 내 정보 관리 > 플래너 회원탈퇴
  create by jhchoi
-->
<template>
  <div class="max-width-wrap signup-wrap pb144">
    <template v-if="!allAgree">
      <div class="top-title-area">
        <h4 class="" v-html="$t('MWC_Title')" />
      </div>

      <div class="all-checkbox-area">
        <RCheckbox v-model="allAgree" checked-icon="check_circle" unchecked-icon="check_circle" >
          <span class="checkbox-title">{{ $t('MWC_AgreePlanner') }}</span>
        </RCheckbox>
      </div>

      <div class="checkbox-area type01">
        <div v-for="(agree, index) in agreements" :key="index" class="field flex no-wrap gap8 align-start">
          <RCheckbox v-model="checkList" :val="agree" checked-icon="check_circle" unchecked-icon="check_circle" class="flex-shrink0" />
          <div>
            <span class="checkbox-title" v-html="agree"></span>
          </div>
        </div>

      </div>

    </template>

    <template v-else>
      <div class="top-title-area">
        <h4 class="" v-html="$t('MWC_Title1',{'name':name})" />
      </div>

      <div v-if="isCoupon" class="flex align-center justify-between ptb16 font-16 gray07-color medium">
        <span>{{ $t('MWC_Coupon') }}</span>
        <div>
          <span>{{ $t('MWC_ActiveCoupon') }}</span>
          <span><router-link to="/mypage/coupon">{{ $moneyFormat(coupon) }}</router-link>{{ $t('CM_Unit') }}</span>
        </div>
      </div>

      <div class="flex align-center justify-between ptb16 font-16 gray07-color medium">
        <span>{{ $t('MWC_Point') }}</span>
        <div>
          <span>{{ $t('MWC_Point') }}</span>
          <span><router-link to="/mypage/point">{{ $moneyFormat(point) }}</router-link>{{ $t('CM_PointUnit') }}</span>
        </div>
      </div>

      <RButton v-if="isCoupon" class="btn full large type11 mt16 mb24" :label="$t('MWC_goMainButton1')+$t('MWC_goMainButton2')" @on-click="router.push(({ name: 'Home' }))"/>

      <h6 class="ptb16 required gray07-color bold">
        {{ $t('MWC_SelectReasonDesc1') }}<br />
        {{ $t('MWC_SelectReasonDesc2') }}
      </h6>

      <div class="return-radio-area">
        <RRadio
          v-model="pageState.withdrawalReasonType"
          :inline="false"
          class="radio-area type02"
          :options="pageState.reasons"
          @update:model-value="() => {}"
        />
      </div>

      <div class="explanation-text blue">
        <p class="font-14 gray05-color medium">{{ $t('MWC_signContent', {name:name}) }}</p>

        <div class="font-14 gray05-color mt24 mb24">{{ nowDate('YYYY년 MM월 DD일') }}</div>

        <div class="flex align-center gap16 no-wrap">
          <span class="required font-14 gray05-color flex-shrink0">{{ $t('MWC_Applicant') }}</span>
          <RInput ref="applicant" v-model="pageState.applicant" :placeholder="$t('MWC_InputApplicant')" class="border-bottom-input"/>
        </div>
      </div>

      <h6 class="pt16 gray07-color bold mt44">
        {{ $t('MWC_Progress') }}
      </h6>

      <span class="block mt4 font-14 gray05-color medium">{{ $t('MWC_noti', {month: 3}) }}</span>

      <RButton class="btn full large type02 mb16 mt24" :label="$t('MWC_SubmitCancel')" @on-click="router.push(({ name: 'Home' }))"/>

      <div class="text-center">
        <RButton class="btn type13 mb16" :label="$t('MWC_SubmitOk')" @on-click="submit"/>
      </div>

    </template>

  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store/mainStore'
import mypageService from '@/http/services/mypage'
import { nowDate } from '@utils/dateFormat'

const mainStore = useMainStore()
const userInfo = mainStore.getUser

const router = useRouter()

const { proxy } = getCurrentInstance()

const applicant = ref(null)

const props = defineProps({
  point: {
    type: Number,
    default: 0
  },
  coupon: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: ''
  }
})

const pageState = reactive({
  withdrawalReasonType: 'PRIVATE', // 개인 사정 기본 값으로 설정
  reasons: [],
  applicant: ''
})

const isCoupon = import.meta.env.VITE_APP_IS_COUPON === 'true'

onMounted(() => {
  getWithdrawalReasons()
})

/**
 * 탈퇴 사유 조회
 */
const getWithdrawalReasons = async () => {
  const params = {
    'userType': 'PLANNER' // BE 내부적 으로 재가입 개월 체크 부분으로 별도 값으로 정의
  }
  const result = await mypageService.getWithdrawalReasons(params)
  if (result && result.message === 'success') {
    result.data.map((el) => {
      pageState.reasons.push({ 'value': el.code, 'label': el.text })
    })
  }
}
const agreements = computed(() => [
  proxy.$t('MWC_PlannerTersm1', { month: 3 }),
  proxy.$t('MWC_PlannerTersm2_1'),
  proxy.$t('MWC_PlannerTersm3'),
  proxy.$t('MWC_PlannerTersm4'),
  proxy.$t('MWC_PlannerTersm5'),
  proxy.$t('MWC_PlannerTersm6'),
  proxy.$t('MWC_PlannerTersm7'),
  proxy.$t('MWC_PlannerTersm8')
])

const checkList = ref([])
/**
 * 전체선택
 */
const allAgree = computed({
  get() {
    return checkList.value.length === agreements.value.length
  },
  set(e) {
    checkList.value = e ? agreements.value : []
  }
})

/**
 * 탈퇴 하기 버튼 클릭
 */
const submit = () => {
  if (validateForm()) {
    proxy.$confirm(proxy.$t('MWC_ConfSubmit'), {
      okLabel: proxy.$t('CM_No'),
      cancelLabel: proxy.$t('MWC_SubmitOk'),
      cancel: function () {
        postWithdrawal()
      },
      ok: function () {
        router.push(({ name: 'Home' }))
      }
    })
  }
}

/**
 * 탈퇴 validate check
 */
const validateForm = () => {
  if (pageState.applicant === '') {
    proxy.$alert(proxy.$t('MWC_ValidationApplicant'), {
      ok: function () {
        setTimeout(() => {
          applicant.value.focus()
        })
      }
    })
    return false
  } else if (pageState.applicant !== props.name) {
    proxy.$alert(proxy.$t('MWC_ValidationName'), {
      ok: function () {
        setTimeout(() => {
          applicant.value.focus()
        })
      }
    })
    return false
  }
  return true
}

/**
 * 회원탈퇴  >  로그아웃 처리 후 메인 페이지로 이동
 */
const postWithdrawal = async () => {
  const params = {
    withdrawalReasonType: pageState.withdrawalReasonType
  }
  const result = await mypageService.postWithdrawal(userInfo.userSeqNo, params)
  if (result) {
    proxy.$alert(proxy.$t('MWC_AltComplete'), {
      ok: async function async() {
        const result = await mainStore.onLogout()
        if (result) {
          router.push({ name: 'Home' })
        }
      }
    })
  }
}

</script>
