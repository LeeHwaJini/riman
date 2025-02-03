<template>
  <q-dialog
    ref="modal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    class="divein-modal"
  >
    <layout-modal
      ref="layoutModal"
      @hide="hide"
    >
      <template #body>
        <div v-if="data" class="video-area" :style="{backgroundImage: `url('${addPrefixForImage(data?.thumbnailImageUrl)}'`}">
          <video class="video-content" autoplay playsinline controls>
            <source :src="addPrefixForImage(data?.videoUrl)" type="video/mp4" />
          </video>

          <div class="video-view-count-area top">
            <i class="ico video" />
            <span class="view-count-text">{{ data?.formatViewCount }}</span>
          </div>
          <div class="video-share-area test">
            <i class="ico share-w" @click="onShare"/>
          </div>
        </div>
        <div class="prd-list-area">
          <button class="menu-close-btn" @click="hide">
            <i class="ico close" />
          </button>

          <div class="scroll-area scroll type01">
            <ul class="list type05">
              <li v-for="product in data?.productBag" :key="getProductId(product)">

                <div class="flex gap16 justify-between no-wrap">
                  <div class="flex gap16 no-wrap">
                    <div class="prd-img-area flex-shrink0">
                      <img :src="addPrefixForImage(product.thumbnailUrl)" alt="" class="img-cover">

                      <div class="prd-icon-area top-left">
                        <span v-if="product.salesStatus === SALES_STATUS.almost_sold_out" class="prd-icon almost-sold-out">{{ $t('PR_AlmostSoldout') }}</span>
                        <span v-if="product.exposureEndDatetime && isValidDates(product.exposureEndDatetime, addDate(nowDate(), 'YYYY-MM-DD HH:mm:ss', { day: 30 }))" class="prd-icon date blank-fixed">{{ $t('EB_StopSellingSoon') }}</span>
                      </div>

                      <div v-if="product.salesStatus === SALES_STATUS.sold_out" class="sold-out-area small">
                        <div class="sold-out-bg">
                          <span class="pre-line">{{ $t('CA_SoldOut') }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="prd-info-area">
                      <span class="prd-name-text font-14">{{ product.name }}</span>

                      <div class="flex align-center gap2 mt8">
                        <b class="font-14 gray07-color">{{ $moneyFormat(product.salesAmount) }}</b>
                        <b class="mt0 font-14 gray07-color">{{ $t('CM_Won') }}</b>
                      </div>

                      <ul class="prd-point-area medium">
                        <template v-if="isLogined && isPlanner">
                          <li class="sp">
                            <span>{{ $moneyFormat(product.sp) }}</span><span>SP</span>
                          </li>
                          <li class="bp">
                            <span>{{ $moneyFormat(product.bp) }}</span><span>BP</span>
                          </li>
                        </template>
                        <li class="p">
                          <span>{{ $moneyFormat(product.pointForCustomer) }}</span><span>P</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <AddCartDrawerButton :product="product" class-names="btn type02 medium flex-shrink0 plr8" :label="$t('CM_Store')" />

                </div>

              </li>
            </ul>

            <div class="explanation-text">
              <div class="name-text" @click="router.push(`/diveIn/${data?.userNumber}`)">{{ $t('DI_DiveInUser', {user: data?.nickName && data?.nickName !== '' ? data?.nickName : data?.userName.firstName}) }}</div>
              <p class="content-text">{{ data?.content }}</p>
              <div class="tag-area">
                <span v-for="tag in data?.tag" :key="tag.code">#{{ tag.text }}</span>
              </div>
            </div>
          </div>
        </div>

      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import diveInService from '@/http/services/diveIn'
import { addPrefixForImage, checkPlanner, getProductId } from '@/utils/common'
import { SALES_STATUS } from '@/utils/constant'
import { isLogin } from '@/utils/login'
import { computed, getCurrentInstance, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AddCartDrawerButton from '../drawer/AddCartDrawerButton.vue'
import { addDate, isValidDates, nowDate } from '@/utils/dateFormat'
const modal = ref()
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const baseURL = import.meta.env.VITE_APP_BASE_URL
const props = defineProps({
  diveInId: {
    type: String,
    default: null
  }
})
const isLogined = computed(() => isLogin())
const isPlanner = computed(() => checkPlanner())

function hide() {
  if (route.query.diveInId && route.query.diveInId !== '') {
    router.replace({
      name: 'DiveInDetail',
      params: {
        userNumber: route.query.userNumber
      }
    })
  } else {
    modal.value.hide()
  }
}

const show = () => {
  modal.value.show()
}

const { data } = diveInService.getDiveIn(route.query.diveInId ?? props.diveInId)

const onShare = () => {
  proxy.openModal({
    parent: proxy, // 필수
    component: 'ResponsiveModal',
    componentProps: {
      contentComponent: 'ShareEventModal',
      pageState: {
        buttonTitle: proxy.$t('DI_GoDetailPage'),
        image: addPrefixForImage(data?.value.thumbnailImageUrl),
        url: baseURL + `/diveIn/${data?.value.userNumber}?diveInId=${props.diveInId}`
      }
    }
  })
}
defineExpose({
  show, hide
})
</script>
