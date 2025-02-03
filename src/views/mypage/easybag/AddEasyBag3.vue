<template>
  <div class="max-width-wrap full-width-wrap pb144">

    <div class="main-title-area  flex justify-between align-end">
      <h3 class="">{{ $t('EB_AddTitle') }}</h3>
      <RStep :step="step" :total-step="totalStep" />
    </div>

    <div class="primary05-bg pd10 text-center font-14 medium primary09-color">{{ $t('EB_FinalStep') }}</div>

    <div class="flex align-center justify-between plr16 ptb18 border-bottom-1-gray">
      <b class="font-16 gray07-color">{{ $t('EB_WantChangeOrder') }}</b>
      <RButton class="btn medium type03 plr8 flex-shrink0" :label="$t('EB_ChangeOrder')" @click="handleOrderChangeModal(true)" />
    </div>

    <ul class="delivery-order-area easy-bag-prd-list plr16 list-pd0">
      <li v-for="item in productBagRequestList" :key="item">
        <div class="prd-img-area">
          <img :src="addPrefixForImage(item?.thumbnailUrl)" alt="">
        </div>
        <div class="delivery-order-info-area">
          <div class="prd-name">{{ item?.productName }}</div>
          <div class="prd-option-area">
            <div v-if="item.selectedOption" class="font-12 gray06-color">
              <span>{{ item.selectedOption?.optionValue }}</span>
            </div>
          </div>
          <RNumberSpin v-model="item.quantity" :min="0" :max="item?.maxQuantityLimit ? item?.maxQuantityLimit : 100" class="num-input type02" @on-change-value="(value) => onChangeQuantity(value)"/>

          <div class="prd-price-area mt8">
            <span>{{ $moneyFormat((item?.selectedOption?.priceOriginal ?? item.priceOriginal) * item.quantity) }}</span>
            <span>{{ $t('CM_Won') }}</span>
          </div>

          <div class="flex align-center gap4 mt4">
            <div class="font-12 primary09-color">
              <span class="medium">{{ $moneyFormat(((item?.selectedOption?.sp ?? item.spOriginal ) * item.quantity).toFixed(2)) }}</span>
              <span>{{ $t('CM_Sp') }}</span>
            </div>

            <div class="font-12 beige-03-color">
              <span class="medium">{{ $moneyFormat((( item?.selectedOption?.bp ?? item.bpOriginal ) * item.quantity).toFixed(2)) }}</span>
              <span>{{ $t('CM_Bp') }}</span>
            </div>
          </div>
        </div>

      </li>
    </ul>

    <ul class="order-result-price-area plr16">
      <li>
        <span class="left-title-area primary09-color">{{ $t('CM_TotalAmount') }}</span>
        <div class="price-text-area primary09-color font-18 bold">
          <span>{{ $moneyFormat(total) }}</span>
          <span>{{ $t('CM_Won') }}</span>
        </div>
      </li>
      <li>
        <span class="left-title-area">{{ $t('EB_TotalSpBp') }}</span>
        <div>
          <div class="price-area text-right">
            <span>{{ $moneyFormat(spTotal) }} {{ $t('CM_Sp') }}</span>
          </div>
          <div class="price-area text-right mt2">
            <span>{{ $moneyFormat(bpTotal) }} {{ $t('CM_Bp') }}</span>
          </div>
        </div>
      </li>
    </ul>

    <div class="gray05-bg gray07-color mlr16">
      <b class="font-16">{{ $t('EB_Notice1') }}</b>
      <p class="mt16 font-14">{{ $t('EB_Notice2') }}<br>
        {{ $t('EB_Notice3') }}</p>
    </div>

    <div class="bottom-btn">
      <div class="flex align-center no-wrap gap8">
        <RButton class="btn small type03 plr16 flex-shrink0" :label="$t('CM_Preview')" @click="onPreviewOpenModal" />
        <RButton class="btn small type02 full" :label="$t('EB_AddTitle')" @click="onSave" />
      </div>
    </div>
  </div>

  <FullPageModal ref="listChangeModal">
    <template #title>
      <h4>{{ $t('EB_ChangeOrderTitle') }}</h4>
    </template>
    <template #body>
      <ul class="delivery-order-area easy-bag-prd-list drag-drop-list scroll type01">
        <li
          v-for="(item, index) in productBagRequestList.filter(i => i.quantity)"
          :key="item.productId"
          :class="{ 'no-select': true, active: currentIndex === index, dragging: currentIndex === index }"
          :draggable="true"
          @dragstart="onDragStart(index)"
          @dragenter="onDragEnter(index, $event)"
          @dragend="onDragEnd"
          @dragover.prevent
          @drop="onDrop"
        >
          <div class="prd-img-area">
            <img :src="addPrefixForImage(item.thumbnailUrl)" alt="">
          </div>
          <div class="delivery-order-info-area" >
            <div class="flex align-start justify-between no-wrap gap16">
              <div class="prd-name"> {{ item.name }}</div>
              <i
                class="ico menu-b flex-shrink0 drop-icon"
                :class="{active: currentIndex === index }"
                @touchstart="onTouchStart(index, $event)"
                @touchmove="onTouchMove($event)"
                @touchend="onTouchEnd"
              />
            </div>

            <div class="prd-name">{{ item.productName }}</div>
            <div class="prd-option-area">
              <div v-if="item.selectedOption" class="font-12 gray06-color">
                <span>{{ item.selectedOption?.optionValue }}</span>
              </div>
            </div>

            <div class="prd-price-area mt8">
              <span>{{ $moneyFormat((item?.selectedOption?.priceOriginal ?? item.priceOriginal) * item.quantity ) }}</span>
              <span>{{ $t('CM_Won') }}</span>
            </div>

            <div class="flex align-center gap4 mt4">
              <div class="font-12 primary09-color">
                <span class="medium">{{ $moneyFormat((( item?.selectedOption?.sp ?? item.spOriginal ) * item.quantity).toFixed(2)) }}</span>
                <span>{{ $t('CM_Sp') }}</span>
              </div>

              <div class="font-12 beige-03-color">
                <span class="medium">{{ $moneyFormat(( (item?.selectedOption?.bp ?? item.bpOriginal ) * item.quantity).toFixed(2)) }}</span>
                <span>{{ $t('CM_Bp') }}</span>
              </div>
            </div>
          </div>

        </li>
      </ul>
    </template>

  </FullPageModal>

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
          <span class="text" :class="{'active' :!isPlanner }">{{ $t('CM_Planner') }}</span>
          <RSwitch
            v-model="isPlanner"
            class="switch type02"
          />
          <span class="text" :class="{'active' :isPlanner }">{{ $t('CM_Consumer') }}, {{ $t('CM_NonMember') }}</span>
        </div>

        <div class="relative easy-bag-bg-area">
          <img :src="imageBagUserRequest.bannerUrl" alt="" class="img-cover">
          <img :src="imageBagUserRequest.profileFileName === 'defaultProfile' ? defaultProfile : imageBagUserRequest.profileUrl" alt="" class="easy-bag-profile-img-area">
        </div>

        <div class="mt72 text-center plr6 mb48">
          <h6 class="bold" v-html="bagInfo.bagTitle.replaceAll('\n', '<br>')"></h6>
          <p class="mt8" v-html="bagInfo.bagSubTitle.replaceAll('\n', '<br>')"></p>
        </div>

        <ul class="delivery-order-area easy-bag-prd-list plr16 list-pd0">
          <li v-for="item in productBagRequestList" :key="item">
            <div class="prd-img-area">
              <img :src="addPrefixForImage(item.thumbnailUrl)" alt="">
            </div>
            <div class="delivery-order-info-area">
              <div class="prd-name">{{ item.productName }}</div>
              <div class="prd-option-area">
                <div v-if="item.selectedOption" class="font-12 gray06-color">
                  <span>{{ item.selectedOption?.optionValue }}</span>
                </div>
              </div>
              <RNumberSpin v-model="item.quantity" :min="0" :max="item?.maxQuantityLimit ? item?.maxQuantityLimit : 100" class="num-input type02" @on-change-value="(value) => onChangeQuantity(value)"/>

              <div class="prd-price-area mt8">
                <span>{{ $moneyFormat((item?.selectedOption?.priceOriginal ?? item.priceOriginal) * item.quantity) }}</span>
                <span>{{ $t('CM_Won') }}</span>
              </div>

              <div v-if="!isPlanner" class="flex align-center gap4 mt4">
                <div class="font-12 primary09-color">
                  <span class="medium">{{ $moneyFormat((( item?.selectedOption?.sp ?? item.spOriginal ) * item.quantity).toFixed(2)) }}</span>
                  <span>{{ $t('CM_Sp') }}</span>
                </div>

                <div class="font-12 beige-03-color">
                  <span class="medium">{{ $moneyFormat((( item?.selectedOption?.bp ?? item.bpOriginal ) * item.quantity).toFixed(2)) }}</span>
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
              <b class="font-18">{{ $moneyFormat(total) }}</b>
              <b class="font-18">{{ $t('CM_Won') }}</b>
            </div>
          </div>

          <div v-if="!isPlanner" class="flex align-start justify-between ptb16 border-top-1-gray gray07-color">
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
import { ref, getCurrentInstance, computed, onMounted } from 'vue'
import { addPrefixForImage, copyClipboard } from '@/utils/common'
import { sessionDataManager } from '@/utils/dataManager'
import { useMainStore } from '@/store/mainStore'
import { useRouter } from 'vue-router'
import easyBagService from '@/http/services/easybag'

import defaultProfile from '@/assets/images/personal_banner_profile.svg'

const { proxy } = getCurrentInstance()
const router = useRouter()

const totalStep = ref(3)
const step = ref(3)
const isPlanner = ref(true)

const mainStore = useMainStore()
const userSeqNo = mainStore.userInfo.userSeqNo
const userNumber = mainStore.userInfo.userNumber

const bagInfo = JSON.parse(sessionDataManager.get('bagInfo'))
const imageBagUserRequest = JSON.parse(sessionDataManager.get('imageBagUserRequest'))
const productBagRequestList = ref([])

onMounted(() => {
  productBagRequestList.value = sessionDataManager.get('productBagRequestList') ? JSON.parse(sessionDataManager.get('productBagRequestList')) : []
})

const handleOrderChangeModal = async (isOpen) => {
  if (!productBagRequestList.value.filter(i => i.quantity).length) {
    await proxy.$alert(proxy.$t('EB_NoQuantity'))
    return
  }

  isOpen ? proxy.$refs.listChangeModal.show() : proxy.$refs.listChangeModal.hide()
}

const onPreviewOpenModal = () => {
  proxy.$refs.previewModal.show()
}

const total = computed(() => {
  return productBagRequestList.value.reduce((pre, cur) => {
    pre = pre + (cur.selectedOption?.priceOriginal ?? cur.priceOriginal) * cur.quantity
    return pre
  }, 0)
})
const spTotal = computed(() => {
  return productBagRequestList.value.reduce((pre, cur) => {
    pre = pre + (cur.selectedOption?.sp ?? cur.spOriginal) * cur.quantity
    return pre
  }, 0).toFixed(2)
})
const bpTotal = computed(() => {
  return productBagRequestList.value.reduce((pre, cur) => {
    pre = pre + (cur.selectedOption?.bp ?? cur.bpOriginal) * cur.quantity
    return pre
  }, 0).toFixed(2)
})

const draggingIndex = ref(null)
const touchStartY = ref(null)
const currentIndex = ref(null)

const onDragStart = (index) => {
  draggingIndex.value = index
}

const onDragEnter = (index, event) => {
  if (event.clientY > document.querySelector('.easy-bag-prd-list').clientHeight) {
    document.querySelector('.easy-bag-prd-list').scrollTo(0, event.clientY)
  }

  productBagRequestList.value.splice(index, 0, productBagRequestList.value.splice(draggingIndex.value, 1)[0])

  draggingIndex.value = index
}

const onDragEnd = () => {
  sessionDataManager.set('productBagRequestList', JSON.stringify(productBagRequestList.value))

  draggingIndex.value = null
}

const onDrop = () => {
  draggingIndex.value = null
}

const onTouchStart = (index, event) => {
  draggingIndex.value = index
  currentIndex.value = index
  touchStartY.value = event.touches[0].clientY
}

const onTouchMove = (event) => {
  event.preventDefault()

  if (draggingIndex.value === null) return

  const touchY = event.touches[0].clientY
  const deltaY = touchY - touchStartY.value

  if (Math.abs(deltaY) > document.querySelector('.delivery-order-info-area').clientHeight) {
    const newIndex = deltaY > 0 ? currentIndex.value + 1 : currentIndex.value - 1

    if (newIndex >= 0 && newIndex < productBagRequestList.value.length) {
      productBagRequestList.value.splice(newIndex, 0, productBagRequestList.value.splice(currentIndex.value, 1)[0])
      currentIndex.value = newIndex
      touchStartY.value = touchY
    }
  }
  document.querySelector('.dragging').scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const onTouchEnd = () => {
  sessionDataManager.set('productBagRequestList', JSON.stringify(productBagRequestList.value))

  draggingIndex.value = null
  touchStartY.value = null
  currentIndex.value = null
}

const onChangeQuantity = () => {
  sessionDataManager.set('productBagRequestList', JSON.stringify(productBagRequestList.value))
}

const onSave = async () => {
  const productBagRequestList = JSON.parse(sessionDataManager.get('productBagRequestList'))
    .filter(i => i.quantity)
    .map((i, index) => {
      return {
        productBagId: i.productId,
        productOptionId: i.selectedOption?.productId ?? undefined,
        optionCode: i.optionType?.code ?? undefined,
        quantity: i.quantity,
        displayOrder: index + 1
      }
    })
    .sort((a, b) => a.displayOrder - b.displayOrder)

  if (!productBagRequestList.length) {
    await proxy.$alert(proxy.$t('EB_NoQuantity'))
    return
  }

  const params = {
    ...bagInfo,
    imageBagUserRequest,
    bagStatus: 'USED',
    productBagRequestList
  }

  const result = await easyBagService.postEasyBag(params, userSeqNo)

  if (result) {
    proxy.$alert(proxy.$t('EB_SaveSuccess') + '</br>' + proxy.$t('EB_ShareLink1'), {
      title: '',
      okLabel: proxy.$t('CM_CopyLink'),
      ok: () => {
        copyClipboard(`${import.meta.env.VITE_APP_BASE_URL}/beauty-planner?bagId=${result.data.bagId}&planner_user=${userNumber}`)
        sessionDataManager.remove('bagInfo')
        sessionDataManager.remove('imageBagUserRequest')
        sessionDataManager.remove('productBagRequestList')

        router.push(`/mypage/easybag/${result.data.bagId}`)
      }
    })
  }
}

const onClickOrderFromPreview = async () => {
  await proxy.$alert(proxy.$t('EB_PreviewNotice'), {
    title: proxy.$t('EB_PreviewOrderUnavailable')
  })
}

</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
  .drop-icon {
  margin-right: 14px
  }
}

.dragging {
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
  transform: scale(1.05);
  z-index: 1000;
}

.no-select {
  user-select: none;
  // touch-action: none;
}

</style>

