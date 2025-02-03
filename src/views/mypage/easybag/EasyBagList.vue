<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area mo-title-visible-area">
      <h3 class="bold primary09-color mb12">{{ $t('EB_ListTitle') }}</h3>
      <span class="block font-12 gray04-color">{{ $t('EB_Explain1') }}</span>
    </div>

    <div class="explanation-text blue large">
      <div class="flex align-center gap4 mb16">
        <i class="ico question-b"></i>
        <b class="font-16 primary04-color">{{ $t('EB_Allowance') }}</b>
      </div>

      <ul>
        <li>{{ $t('EB_Explain2') }}</li>
        <li>{{ $t('EB_Explain3') }}</li>
      </ul>
    </div>

    <!-- Bag이 없을 경우 -->
    <div v-if="bagList.length === 0" class="cart-none-area">
      <img src="@assets/images/cart_none.svg" alt="">
      <p class="title">{{ $t('EB_NoData') }}</p>
      <p class="text">{{ $t('EB_Explain4') }}</p>
    </div>
    <!-- //Bag이 없을 경우 -->

    <div v-if="bagList.length > 0" class="easy-bag-filter-area">
      <div class="checkbox-area type02">
        <RCheckbox v-model="checkAll">
          <b class="font-16 gray07-color mr4">{{ $t('CM_All') }}{{ $t('CM_Select') }}</b>
          <span class="font-14 gray05-color">({{ bagList.filter(i => i.isChecked).length }}/{{ bagList.length }})</span>
        </RCheckbox>
      </div>
      <div class="icon-area">
        <i class="ico" :class="textList ? 'text-list' : 'list'" @click="textList = !textList" />
        <i class="ico delete" @click="onClickDelete"/>
      </div>
    </div>
    <ul class="easy-bag-list " :class="textList ? 'text' : 'img'" >
      <li v-for="(item, index) in bagList" :key="item.bagId" @click="router.push(`/mypage/easybag/${item.bagId}`)" >
        <div class="easy-bag-area" :style="!textList && { 'background-image' : 'url(' + item.coverImage.replaceAll(' ', '%20').replaceAll('(', '%28').replaceAll(')', '%29') + ')'}" :class="{'prd-disabled' : item.isEndBag || item.isPausedBag}">
          <div class="content-text-area">
            <RCheckbox v-model="item.isChecked" class="checkbox-area type02 small" />
            <div class="text-area">
              <div v-if="item.isEndBag" class="prd-tag end font-12">{{ $t('EB_Expired') }}</div>
              <div v-if="!item.isEndBag && item.isSoldOutBag" class="prd-tag sold-out font-12">{{ $t('EB_SoldOut') }}</div>
              <div v-if="!item.isEndBag && item.isPausedBag" class="prd-tag end font-12">{{ $t('EB_StopSelling') }}</div>
              <div class="main-text font-16 gray07-color medium" v-html="item.title.replaceAll('\n', '<br>')"></div>
            </div>
            <i class="ico pointer" :class="textList ? 'share-n' : 'share-w'" @click="event => onShareModal(event, index)"/>
          </div>

          <div class="date-text-area">
            <span class="font-12 font-montserrat gray03-color">{{ formatDate(item.createdAt) }}</span>
          </div>

        </div>
      </li>

    </ul>

    <div class="bottom-btn">
      <RButton class="btn full small type02" :label="$t('EB_AddTitle')" @click="onAddEasyBag" />
    </div>

  </div>
</template>

<script setup>
import easyBagService from '@/http/services/easybag'
import { useMainStore } from '@/store/mainStore'
import { addPrefixForImage } from '@/utils/common'
import { sessionDataManager } from '@/utils/dataManager'
import { formatDate, isValidDates, nowDate } from '@/utils/dateFormat'
import { ref, getCurrentInstance, onMounted, computed } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const router = useRouter()
const mainStore = useMainStore()

const userSeqNo = mainStore.userInfo.userSeqNo
const userNumber = mainStore.userInfo.userNumber

const bagList = ref([])
const textList = ref(false)

onBeforeRouteLeave((to, from, next) => {
  if (to.fullPath === '/mypage/easybag/add/3') {
    router.push('/mypage')
  } else {
    next()
  }
})

const onShareModal = (event, index) => {
  event.stopPropagation()

  proxy.openModal({
    parent: proxy, // 필수
    component: 'ResponsiveModal',
    componentProps: {
      contentComponent: 'ShareEventModal',
      pageState: {
        url: `${import.meta.env.VITE_APP_BASE_URL}/beauty-planner?bagId=${bagList.value[index].bagId}&planner_user=${userNumber}`,
        image: bagList.value[index].bagBannerUrl,
        isEasyBag: true
      }

    }
  })
}

onMounted(() => {
  sessionDataManager.remove('bagInfo')
  sessionDataManager.remove('imageBagUserRequest')
  sessionDataManager.remove('productBagRequestList')

  onSearchMyBagList()
})

const validateImageUrl = (url) => {
  const validPattern = /static\/member\/planner-bag-image\/[^/]+$/
  if (!validPattern.test(url)) {
    return false
  }
  return true
}

const onSearchMyBagList = async () => {
  const result = await easyBagService.getMyBagList(userSeqNo)

  if (result) {
    result.data.forEach(bag => {
      bag.isChecked = false
      bag.isEndBag = bag.bagDate && isValidDates(bag.bagEndDate, nowDate())
      bag.coverImage = validateImageUrl(bag.bagBannerUrl) ? bag.bagBannerUrl : addPrefixForImage(bag.bagBannerName)

      bag.productBag.forEach(product => {
        if (product.salesStatus === 'SOLD_OUT') {
          bag.isSoldOutBag = true
        }
        if (product.salesStatus === 'PAUSE') {
          bag.isPausedBag = true
        }
      })
    })

    // 기간종료 또는 판매중지인 경우 하단 정렬
    bagList.value = result.data.sort((a, b) => {
      if (a.isEndBag || a.isPausedBag) {
        return 1
      }
      if (b.isEndBag || b.isPausedBag) {
        return -1
      }
      return 0
    })
  }
}

const checkAll = computed({
  get() {
    if (bagList.value.length === bagList.value.filter(i => i.isChecked).length) {
      return true
    } else {
      return false
    }
  },
  set(newValue) {
    if (newValue) {
      bagList.value.forEach(item => {
        item.isChecked = true
      })
    } else {
      bagList.value.forEach(item => {
        item.isChecked = false
      })
    }
  }
})

const onAddEasyBag = () => {
  if (bagList.value.length === 10) {
    proxy.$alert(proxy.$t('EB_Limit'))
    return
  }

  router.push({ path: '/mypage/easybag/add/1', state: { bagCount: bagList.value.length } })
}

const onClickDelete = () => {
  const checkedBag = bagList.value.filter(i => i.isChecked)

  if (checkedBag.length === 0) {
    proxy.$alert(proxy.$t('EB_DeleteValidation'))
    return
  }

  const containDisabledBag = checkedBag.some(i => i.isEndBag || i.isPausedBag)

  if (!containDisabledBag) {
    proxy.$confirm(proxy.$t('ALT_DeleteConfirm'), {
      title: proxy.$t('EB_DeleteConfirmTitle'),
      cancelLabel: proxy.$t('CM_Cancel'),
      ok: async () => {
        deleteBag(checkedBag)
      },
      cancel: () => {
        return
      }
    })
  } else {
    deleteBag(checkedBag)
  }
}

const deleteBag = (checkedBag) => {
  const result = checkedBag.map((i) => {
    return easyBagService.deleteBag(userSeqNo, i.bagId)
  })

  Promise.all(result).then(() => {
    proxy.$alert(proxy.$t('ALT_DeleteSuccess'), {
      ok: () => onSearchMyBagList()
    })
  })
}
</script>

<style lang="scss" scoped>

</style>
