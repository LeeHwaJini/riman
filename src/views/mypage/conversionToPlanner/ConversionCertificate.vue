<!--
  마이페이지 > 플래너로 전환 > 휴대폰인증
  create by jhchoi
-->
<template>
  <div class="max-width-wrap signup-wrap pb144">
    <div class="signup-detail-title-area">
      <h4 class=""><b>{{ $t('MCC_Title') }}</b></h4>
      <p class="">{{ $t('MCC_SubTitle') }}</p>
    </div>

    <div class="all-checkbox-area">
      <RCheckbox v-model="allAgree" checked-icon="check_circle" unchecked-icon="check_circle" >
        <span class="checkbox-title">{{ $t('MCC_AllAgree') }}</span>
      </RCheckbox>
    </div>

    <div class="checkbox-area type01">
      <div v-for="(agree, index) in agreements" :key="index" class="field flex no-wrap gap8 align-start">
        <RCheckbox v-model="checkList" :val="agree" checked-icon="check_circle" unchecked-icon="check_circle" class="flex-shrink0" >
          <b class="">{{ $t('CM_Essential') }}</b>
        </RCheckbox>
        <div>
          <span class="checkbox-title">{{ agree }}</span>
        </div>
      </div>

    </div>

    <div v-if="allAgree" class="bottom-btn certificate-bottom-btn">
      <Certificate
        type="multiBtn"
        btn-class="btn full small type02"
        :btn-text="$t('CM_Certi')"
        @on-success="onCertSuccess"
        @on-fail="onCertFail"/>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from '@/store/mainStore'
import { isOldEnough } from '@/utils/common'
import mypageService from '@/http/services/mypage'
import { sessionDataManager, CONVERSION_CURRENT_STEP, CONVERSION_CERTI_INFO, CONVERSION_USER_INFO } from '@utils/dataManager'

const mainStore = useMainStore()
const userInfo = mainStore.getUser

const router = useRouter()

const currentStep = ['/mypage/conversionToPlanner/certificate']
const nextPage = '/mypage/conversionToPlanner/enterInformation'

const { proxy } = getCurrentInstance()

onMounted(() => {
  removeConversionData()
})

/**
 * 세션 초기화
 */
const removeConversionData = () => {
  const sessionList = [CONVERSION_CURRENT_STEP, CONVERSION_CERTI_INFO, CONVERSION_USER_INFO]

  sessionList.map((data) => {
    sessionDataManager.remove(data)
  })
}

/**
 * 유의사항
 */
const agreements = computed(() => [
  proxy.$t('MCC_Term1'),
  proxy.$t('MCC_Term2'),
  proxy.$t('MCC_Term3'),
  proxy.$t('MCC_Term4'),
  proxy.$t('MCC_Term5'),
  proxy.$t('MCC_Term6'),
  proxy.$t('MCC_Term7'),
  proxy.$t('MCC_Term8'),
  proxy.$t('MCC_Term9'),
  proxy.$t('MCC_Term10')
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
 * 본인 인증 성공 callback
 * @param {*} data
 */
const onCertSuccess = async (data) => {
  const response = await mypageService.getProgressOrder(userInfo.userSeqNo)
  const isExistProgress = ref(null)
  if (response) {
    isExistProgress.value = response.data.isExistProgress
  }

  if (!await isOldEnough(data.birthDate, 19)) {
    proxy.$alert(proxy.$t('MCC_AltAge'), {
      title: proxy.$t('MCC_AltAgeTitle')
    })
    return
  } else if (isExistProgress.value) {
    proxy.$alert(proxy.$t('MCC_AltProgress'), {
      title: proxy.$t('MCC_AltProgressTitle')
    })
  } else {
    goNext(data)
  }
}

/**
 * 다음 단계 이동
 * @param {*} data
 */
const goNext = (data) => {
  sessionDataManager.set(CONVERSION_CERTI_INFO, JSON.stringify(data))

  sessionDataManager.set(CONVERSION_CURRENT_STEP, JSON.stringify([...currentStep, nextPage]))
  router.push({ name: 'ConversionEnterInformation' })
}

</script>
