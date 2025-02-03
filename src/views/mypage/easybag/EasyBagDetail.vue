<template>
  <div class="max-width-wrap full-width-wrap pb144">

    <div class="main-title-area">
      <h3 class="">{{ $t('EB_DetailTitle') }}</h3>
    </div>

    <div class="plr16 mo-pt48">
      <div>
        <h4 class="bold primary09-color mb12">{{ $t('EB_SettingAndDelete') }}</h4>
        <span class="font-16 gray07-color">{{ $t('EB_ChangeDate1') }}</span>
      </div>

      <div class="easy-bag-link-area">
        <span class="flex align-center gap4 font-16 medium gray07-color">
          {{ $t('EB_ChangeDate2') }}
          <i
            class="ico question pointer"
            @click="$notify($t('EB_ChangeDate3'),
                            $t('EB_ChangeDate2'),
                            'tooltip-w344')"/>
        </span>
        <RSwitch
          v-model="isBagDate"
          class="switch type01 small"
          :disable="originBagDateInfo.isBagDate"
        />
      </div>

      <template v-if="isBagDate">
        <div class="input-date-area mb4">
          <RDatepicker
            v-model="bagInfo.bagStartDate"
            class="disabled"
            :readonly="true"
            :show-period="false"
            :is-set-default="false"
          />
          <RDatepicker
            v-model="bagInfo.bagEndDate"
            :class="{ disabled: isValidDates(originBagDateInfo.bagEndDate, nowDate()) }"
            :readonly="isValidDates(originBagDateInfo.bagEndDate, nowDate())"
            :show-period="false"
            :is-set-default="false"
            :is-after-now-date="true"
          />
        </div>
        <span class="font-14 gray03-color">{{ $t('EB_DateExplain3') }}</span>
      </template>

      <div class="easy-bag-link-area mt8 mb32 pb32 border-bottom-1-gray">
        <span class="font-16 medium gray07-color">{{ $t('EB_Delete') }}</span>
        <RButton class="btn medium type02 plr8" :label="$t('CM_DoDelete')" @on-click="onClickDelete" />
      </div>

      <div class="mb40">
        <h4 class="bold primary09-color mb12">{{ $t('EB_Detail') }}</h4>
        <span class="font-16 gray07-color">{{ $t('EB_ModifyUnavailable') }}</span>
      </div>

      <div class="easy-detail-img-list-area">
        <div class="prd-img-area">
          <img :src="bagInfo?.bagBannerUrl" alt="" class="img-cover" @error="handleBannerImage">
        </div>
        <div class="text-area font-10">
          <div class="gray03-color">{{ bagInfo?.bagId }}</div>
          <div class="mt2 gray03-color">
            <span>{{ formatDate(bagInfo?.createdAt) }}</span>
          </div>
          <b class="block mtb8 gray07-color" v-html="bagInfo?.title"></b>
          <p class="gray07-color easy-bag-detail-content-text scroll type01" v-html="bagInfo?.subTitle"></p>
        </div>
      </div>

      <ul class="grid-list type02 mt24 pb0">
        <li v-for="item in bagInfo?.productBag" :key="item.productId">
          <div class="prd-img-area">
            <img :src="addPrefixForImage(item.thumbnailUrl)" alt="">
            <div class="prd-icon-area top-left">
              <span v-if="item.salesStatus === 'ALMOST_SOLD_OUT'" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
              <span v-if="item.exposureEndDatetime && isValidDates(item.exposureEndDatetime, addDate(nowDate(), 'YYYY-MM-DD HH:mm:ss', { day: 30 }))" class="prd-icon date blank-fixed">{{ $t('EB_StopSellingSoon') }}</span>
              <span v-if="item.salesStatus === 'SOLD_OUT'" class="prd-icon sold-out">{{ $t('EB_SoldOut') }}</span>
              <span v-if="item.applyCouponYn" class="prd-icon coupon">{{ $t('OP_CouponDiscount2') }}</span>
              <span v-if="item.restrictMemberDisplayYn || item.maxQuantityLimit" class="prd-icon member">{{ $t('EB_MemberOnly') }}</span>
              <span v-if="item.salesStatus === 'PAUSE'" class="prd-icon stop">{{ $t('EB_StopSelling') }}</span>
              <!-- EVENT: 추후 상품관리에 추가 예정 -->
              <!-- <span class="prd-icon event">EVENT</span> -->
            </div>
          </div>
          <div class="prd-option-text-area">
            <div>{{ item.shortName }}</div>
            <div v-for="(option, optIndex) in item?.optionValues" :key="optIndex" class="prd-option-area">
              <div>{{ option.optionValue }}</div>
            </div>
            <div>{{ item.productQuantity }}{{ $t('CM_Unit') }}</div>
          </div>
        </li>
      </ul>

    </div>

    <div class="bottom-btn">
      <div v-if="!containPausedProduct" class="flex align-center no-wrap gap8">
        <RButton class="btn small type03 plr16 flex-shrink0" :label="$t('CM_Preview')" @click="onPreviewOpenModal" />
        <RButton class="btn small type02 full" :label="$t('EB_ShareLink2')" :disable="isValidDates(bagInfo?.bagEndDate, `${nowDate()} 23:59:59`)" @click="onClickShare" />
      </div>
      <RButton v-if="containPausedProduct" class="btn small type02 full" :label="$t('EB_Delete')" @click="onClickDelete"/>
    </div>

    <!-- 판매중지된 상품인 경우 -->
    <div v-if="containPausedProduct" class="stop-selling-modal">
      <div class="explanation-text red large">
        <div class="flex align-center gap4 mb8">
          <i class="ico question-r"></i>
          <b class="font-16 error-color">{{ $t('EB_ContainStopSelling') }}</b>
        </div>

        <p>{{ $t('EB_OrderUnavailable1') }}</p>
      </div>
    </div>
    <!-- //판매중지된 상품인 경우 -->
  </div>

  <!-- 미리보기 모달 -->
  <FullPageModal
    ref="previewModal"
    class="title-blank-none">
    <template #title>
      <h4>{{ $t('EB_Preview') }}</h4>
    </template>
    <template #body>
      <div class="popupo-max-h-530 scroll type01">

        <div class="easy-bag-toogle-area">
          <span class="text" :class="{'active' :isPlanner }">{{ $t('CM_Planner') }}</span>
          <RSwitch
            v-model="isPlanner"
            class="switch type02"
          />
          <span class="text" :class="{'active' :!isPlanner }">{{ $t('CM_Consumer') }}, {{ $t('CM_NonMember') }}</span>
        </div>

        <div class="relative easy-bag-bg-area">
          <img :src="bagInfo?.bagBannerUrl" alt="" class="img-cover">
          <img :src="bagInfo?.bagProfileUrl" alt="" class="easy-bag-profile-img-area">
        </div>

        <div class="mt72 text-center plr6 mb48">
          <h6 class="bold" v-html="bagInfo?.title"></h6>
          <p class="mt8" v-html="bagInfo?.subTitle"></p>
        </div>

        <ul class="delivery-order-area easy-bag-prd-list plr16 list-pd0">
          <li v-for="item in bagInfo?.productBag" :key="item.productId">
            <div class="prd-img-area">
              <img :src="addPrefixForImage(item.thumbnailUrl)" alt="">
              <div class="prd-icon-area top-left">
                <span v-if="item.salesStatus === 'ALMOST_SOLD_OUT'" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
                <span v-if="item.exposureEndDatetime && isValidDates(item.exposureEndDatetime, addDate(nowDate(), 'YYYY-MM-DD HH:mm:ss', { day: 30 }))" class="prd-icon date blank-fixed">{{ $t('EB_StopSellingSoon') }}</span>
                <span v-if="item.salesStatus === 'SOLD_OUT'" class="prd-icon sold-out">{{ $t('EB_SoldOut') }}</span>
                <span v-if="item.applyCouponYn" class="prd-icon coupon">{{ $t('OP_CouponDiscount2') }}</span>
                <span v-if="item.restrictMemberDisplayYn || item.maxQuantityLimit" class="prd-icon member">{{ $t('EB_MemberOnly') }}</span>
                <span v-if="item.salesStatus === 'PAUSE'" class="prd-icon stop">{{ $t('EB_StopSelling') }}</span>
              <!-- EVENT: 추후 상품관리에 추가 예정 -->
              <!-- <span class="prd-icon event">EVENT</span> -->
              </div>
            </div>
            <div class="delivery-order-info-area">
              <div class="prd-name">{{ item.name }}</div>
              <div v-for="(option, optIndex) in item?.optionValues" :key="optIndex" class="prd-option-area">
                <div>{{ option.optionValue }}</div>
              </div>
              <RNumberSpin v-model="item.productQuantity" :is-readonly="true" disable="true" class="num-input type02"/>

              <div class="prd-price-area mt8">
                <span>{{ $moneyFormat((item?.selectedOption?.priceOriginal ?? item.priceOriginal) * item.productQuantity) }}</span>
                <span>{{ $t('CM_Won') }}</span>
              </div>

              <div v-if="isPlanner" class="flex align-center gap4 mt4">
                <div class="font-12 primary09-color">
                  <span class="medium">{{ $moneyFormat((( item?.selectedOption?.sp ?? item.sp ) * item.productQuantity).toFixed(2)) }}</span>
                  <span>{{ $t('CM_Sp') }}</span>
                </div>

                <div class="font-12 beige-03-color">
                  <span class="medium">{{ $moneyFormat((( item?.selectedOption?.bp ?? item.bp ) * item.productQuantity).toFixed(2)) }}</span>
                  <span>{{ $t('CM_Bp') }}</span>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <div class="mlr16">
          <div class="flex align-center justify-between ptb16 primary09-color border-top-1-gray">
            <span class="font-16 medium">{{ $t('CM_TotalAmount') }}</span>
            <div>
              <b class="font-18">{{ $moneyFormat(total) }}{{ $t('CM_Won') }}</b>
            </div>
          </div>

          <div v-if="isPlanner" class="flex align-start justify-between ptb16 border-top-1-gray gray07-color">
            <span class="left-title-area medium font-16">{{ $t('EB_TotalSpBp') }}</span>
            <div>
              <div class="price-area text-right">
                <span>{{ $moneyFormat(spTotal) }} {{ $t('CM_Sp') }}</span>
              </div>
              <div class="price-area text-right mt2">
                <span>{{ $moneyFormat(bpTotal) }} {{ $t('CM_Bp') }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="popup-bottom-area">
          <div class="popup-bottom-btn">
            <RButton class="btn full small type11" label="" @click="onClickOrderFromPreview">
              <template #content>
                <span class="font-20">{{ $moneyFormat(total) }}{{ $t('CM_Won') }}</span>
                <span class="ml8" >{{ $t('CM_DoOrder') }}</span>
              </template>
            </RButton>
          </div>
        </div>

      </div>
    </template>

  </FullPageModal>
  <!-- //미리보기 모달 -->
</template>

<script setup>

import { ref, getCurrentInstance, onMounted, watch, reactive, computed } from 'vue'
import easyBagService from '@/http/services/easybag'
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router'
import { useMainStore } from '@/store/mainStore'
import { addDate, formatDate, isValidDates, nowDate } from '@/utils/dateFormat'
import { addPrefixForImage } from '@/utils/common'

const { proxy } = getCurrentInstance()
const route = useRoute()
const router = useRouter()

const mainStore = useMainStore()

const userSeqNo = mainStore.userInfo.userSeqNo
const userNumber = mainStore.userInfo.userNumber
const referrerCode = route.query.planner_user

const bagId = route.params.bagId
const bagInfo = ref()

const isBagDate = ref()
const originBagDateInfo = reactive({})

const containSoldOutProduct = ref()
const containPausedProduct = ref()

const isPlanner = ref(true)
import defaultProfile from '@/assets/images/personal_banner_profile.svg'

onBeforeRouteLeave((to, from, next) => {
  if (to.fullPath === '/mypage/easybag/add/3') {
    router.push('/mypage/easybag')
  } else {
    next()
  }
})

const onClickShare = () => {
  if (containSoldOutProduct.value) {
    proxy.$confirm(proxy.$t('EB_ShareConfirm'), {
      title: '',
      ok: () => {
        onShareModal()
      }
    })
  } else {
    onShareModal()
  }
}
const onShareModal = () => {
  proxy.openModal({
    parent: proxy, // 필수
    component: 'ResponsiveModal',
    componentProps: {
      contentComponent: 'ShareEventModal',
      pageState: {
        url: `${import.meta.env.VITE_APP_BASE_URL}/beauty-planner?bagId=${bagInfo.value.bagId}&planner_user=${userNumber}`,
        image: bagInfo.value.bagBannerUrl,
        title: bagInfo.value.title.replaceAll('<br>', '\n'),
        isEasyBag: true
      }
    }
  })
}

onMounted(() => {
  onSearchMyBagDetail()
})

const onSearchMyBagDetail = async () => {
  const result = await easyBagService.getMyBagDetail(bagId)

  if (result) {
    bagInfo.value = result.data

    bagInfo.value.bagStartDate = bagInfo.value.bagStartDate !== 'null' ? bagInfo.value.bagStartDate : nowDate()
    bagInfo.value.bagEndDate = bagInfo.value.bagEndDate !== 'null' ? bagInfo.value.bagEndDate : addDate(nowDate(), 'YYYY-MM-DD HH:mm:ss', { day: 30 })

    bagInfo.value.title = bagInfo.value.title.replaceAll('\n', '<br>')
    bagInfo.value.subTitle = bagInfo.value.subTitle.replaceAll('\n', '<br>')

    if (bagInfo.value.bagProfileName === 'defaultProfile') {
      bagInfo.value.bagProfileUrl = defaultProfile
    }

    bagInfo.value.productBag.sort((a, b) => a.displayOrder - b.displayOrder)

    isBagDate.value = result.data.bagDate

    originBagDateInfo.isBagDate = result.data.bagDate
    originBagDateInfo.bagStartDate = result.data.bagStartDate
    originBagDateInfo.bagEndDate = result.data.bagEndDate

    containSoldOutProduct.value = result.data.productBag.some(product => product.salesStatus === 'SOLD_OUT')
    containPausedProduct.value = result.data.productBag.some(product => product.salesStatus === 'PAUSE')
  } else {
    proxy.$alert(proxy.$t('EB_DeletedBag'), {
      ok: () => {
        router.push(referrerCode ? `/?referrerCode=${referrerCode}` : '/')
      }
    })
  }
}
const onClickDelete = () => {
  const isDisabledBag = bagInfo.value.isEndBag || bagInfo.value.isPausedBag

  if (!isDisabledBag) {
    proxy.$confirm(proxy.$t('EB_DeleteConfirm'), {
      title: '',
      ok: async () => {
        deleteBag()
      },
      cancel: () => {
        return
      }
    })
  } else {
    deleteBag()
  }
}

const deleteBag = async () => {
  const result = await easyBagService.deleteBag(userSeqNo, bagId)

  if (result) {
    proxy.$alert(proxy.$t('ALT_DeleteSuccess'), {
      ok: () => router.push('/mypage/easybag')
    })
  } else {
    proxy.$alert(proxy.$t('EB_AlreadyDeleted'), {
      ok: () => router.push('/mypage/easybag')
    })
  }
}

const onChangeEndDate = async (value) => {
  if (!value) {
    return
  }
  const params = {
    bagId: bagId,
    isBagDate: isBagDate.value,
    bagStartDate: formatDate(bagInfo.value.bagStartDate),
    bagEndDate: `${value} 23:59:59`
  }

  const result = await easyBagService.updateEasyBag(params, userSeqNo)

  if (result) {
    proxy.$alert(proxy.$t('EB_DateChanged'))
  }
}

const onPreviewOpenModal = () => {
  proxy.$refs.previewModal.show()
}

const total = computed(() => {
  return bagInfo.value.productBag.reduce((pre, cur) => {
    pre = pre + (cur.selectedOption?.priceOriginal ?? cur.priceOriginal) * cur.productQuantity
    return pre
  }, 0)
})
const spTotal = computed(() => {
  return bagInfo.value.productBag.reduce((pre, cur) => {
    pre = pre + (cur.selectedOption?.sp ?? cur.sp) * cur.productQuantity
    return pre
  }, 0).toFixed(2)
})
const bpTotal = computed(() => {
  return bagInfo.value.productBag.reduce((pre, cur) => {
    pre = pre + (cur.selectedOption?.bp ?? cur.bp) * cur.productQuantity
    return pre
  }, 0).toFixed(2)
})

const onClickOrderFromPreview = async () => {
  await proxy.$alert(proxy.$t('EB_PreviewNotice'), {
    title: proxy.$t('EB_PreviewOrderUnavailable')
  })
}

const handleBannerImage = () => {
  bagInfo.value.bagBannerUrl = addPrefixForImage(bagInfo.value?.bagBannerName)
}

watch(
  () => bagInfo.value?.bagEndDate,
  (newValue, oldValue) => {
    if (newValue !== oldValue && oldValue !== undefined) {
      onChangeEndDate(newValue)
    }
  },
  {
    immediate: false,
    deep: true
  }
)
</script>
<style lang="scss" scoped>

</style>
