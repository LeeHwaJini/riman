<template>
  <div class="divein-wrap pb144">
    <div class="divein-top-bg-area" />
    <div class="divein-image-container">
      <div class="fade-image type01"></div>
      <div class="fade-image type02"></div>
    </div>

    <img src="@assets/images/dive_title.svg" alt="" class="divein-title-img">
    <template v-if="categoryListData && categoryListData.length > 0">
      <section v-for="category in categoryListData" :key="category.id" class="divein-section">
        <h4>{{ category.categoryName }}</h4>
        <swiper
          v-if="category.displayYn"
          :slides-per-view="'auto'"
          :free-mode="true"
          :modules="modules"
          class="divein-swiper"
        >
          <swiper-slide
            v-for="item in category.diveInList"
            :key="item.id"
            @click="onOpenModal(item.id)"
          >
            <img :src="addPrefixForImage(item.thumbnailImageUrl)" :alt="category.categoryName">
            <div class="video-view-count-area">
              <i class="ico video" />
              <span class="view-count-text">{{ item.viewCount }}</span>
            </div>
          </swiper-slide>
        </swiper>
      </section>
    </template>

    <section class="divein-section divein-filter-section">
      <div class="filter-area">
        <swiper
          :slides-per-view="'auto'"
          :free-mode="true"
          :pagination="{
            type: 'progressbar',
            clickable: true,
          }"
          :navigation="true"
          :modules="modules"
          class="category-option-area slide-bar-color-none mo-ml16"
        >
          <swiper-slide
            v-for="tag in tagType"
            :key="tag.value"
            :class="{ active: activeTag === tag.value }"
            @click="onClickTag(tag)"
          >
            {{ tag.label }}
          </swiper-slide>
        </swiper>

        <RButton class="filter-btn-area mo" @click="onClickShow">
          <template #content>
            <span>{{ $t('CM_FilterSearch') }}</span>
            <i class="ico filter"></i>
          </template>
        </RButton>

        <div class="prd-option-select-area">
          <RSelectBox
            v-model="selectSortType"
            :options="sortOptions"
            :disable="false"
            class="select-box type01 width-fixed small"
            popup-content-class="select-list type03 x-small"
          />
        </div>
      </div>
      <ul v-if="diveInListData && diveInListData.length > 0" class="divein-grid-list">
        <li v-for="i in turns" :key="i">
          <div v-for="(item, index) in diveInListData.slice(i * 5, (i + 1) * 5)" :key="item.id" class="img-area" :class="getClass(index, i)" @click="onOpenModal(item.id)">
            <img :src="addPrefixForImage(item.thumbnailImageUrl)" :alt="item.nickName">
            <div class="video-view-count-area">
              <i class="ico video" />
              <span class="view-count-text">{{ item.formatViewCount }}</span>
            </div>
          </div>
        </li>
      </ul>
    </section>
  </div>

  <!-- <button @click="onOpenModal">open</button> -->

  <q-dialog ref="drawer" position="right" full-height class="prd-filter-popup-wrap">
    <q-card class="scroll type01 ">
      <div class="text-right">
        <button class="menu-close-btn unset" @click="onClickClose">
          <i class="ico close" />
        </button>
      </div>

      <h4 class="popup-title">{{ $t('CM_Filter') }}</h4>

      <q-expansion-item
        expand-separator
        :label="$t('DI_ByCategory')"
        default-opened
        :expand-icon="`img:${AddIcon}`"
        :expanded-icon="`img:${SubtractIcon}`"
        class="dropdown type01"
      >

        <ul class="divenin-category-list">
          <li v-for="item in tagType" :key="item.value" :class="{ active: activeTag === item.value }" @click="onClickTag(item)">
            {{ item.label }}
          </li>
        </ul>

      </q-expansion-item>
      <div class="bottom-btn filter-bottom-btn">
        <div class="flex-btn-area">
          <RButton class="btn full small type03" :label="$t('CM_Reset')" @on-click="onClickReset"/>
          <RButton class="btn full small type02" :label="$t('CM_FilterSearch')" @on-click="onClickFilter"/>
        </div>
      </div>

    </q-card>
  </q-dialog>
</template>

<script setup>
import DiveInModal from '@/components/modal/DiveInModal.vue'
import diveInService from '@/http/services/diveIn'
import { getCurrentInstance, watch, ref, computed, onMounted } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Autoplay, FreeMode, Scrollbar, Navigation } from 'swiper/modules'
import AddIcon from '@/assets/images/icons/ico_add.svg'
import SubtractIcon from '@/assets/images/icons/ico_subtract.svg'
import { addPrefixForImage } from '@/utils/common'
import { useRouter } from 'vue-router'

const modules = [Pagination, Autoplay, FreeMode, Scrollbar, Navigation]

const { proxy } = getCurrentInstance()
const isMobile = computed(() => proxy.$isMobile())
const isDivein = import.meta.env.VITE_APP_IS_DIVEIN === 'true'
const router = useRouter()
const tagType = computed(() => [
  { value: 'INCELLDERM,LIFENING,BOTALAB,RIMAN', label: '#' + proxy.$t('CM_All') },
  { value: 'INCELLDERM', label: '#' + proxy.$t('CM_Incellderm') },
  { value: 'LIFENING', label: '#' + proxy.$t('CM_Lifening') },
  { value: 'BOTALAB', label: '#' + proxy.$t('CM_Botalab') },
  { value: 'RIMAN', label: '#' + proxy.$t('CM_Riman') }
])
const activeTag = ref('INCELLDERM,LIFENING,BOTALAB,RIMAN')
const selectSortType = ref('RECOMMENDED')
const sortOptions = computed(() => [
  { label: proxy.$t('CM_Random'), value: 'RECOMMENDED' },
  { label: proxy.$t('CM_Newest'), value: 'NEWEST' },
  { label: proxy.$t('CM_ViewSort'), value: 'VIEWCOUNT' }
])
const { data: categoryListData } = diveInService.getCategoryList()

const activeTagParam = ref(activeTag.value)
const { data: diveInListData } = diveInService.getList(activeTagParam, selectSortType)
const onOpenModal = (diveInId) => {
  proxy.openModal({
    parent: proxy,
    component: DiveInModal,
    componentProps: {
      diveInId
    }
  })
}
const turns = computed(() => {
  const _turns = []
  if (diveInListData.value) {
    const num = Math.floor(diveInListData.value.length / 5)
    for (let i = 0; i <= num; i++) {
      _turns.push(i)
    }
  }
  return _turns
})
const drawer = ref()
const onClickTag = (tag) => {
  activeTag.value = tag.value
}

const onClickShow = () => {
  drawer.value.show()
}

const onClickClose = () => {
  drawer.value.hide()
}
const onClickFilter = () => {
  activeTagParam.value = activeTag.value
  drawer.value.hide()
}
const onClickReset = () => {
  activeTag.value = null
}
function getClass(index, turn) {
  let num = 1
  if (turn % 3 === 1) {
    num = 3
  }
  if (turn % 3 === 2) {
    num = 2
  }
  const number = (index + 1) % 5
  if (number === num) {
    return 'grid-span2'
  } else {
    return 'img-1-1'
  }
}
watch(activeTag, v => {
  if (isMobile.value) return
  activeTagParam.value = activeTag.value
})
onMounted(() => {
  if (!isDivein) {
    router.push('/')
  }
})
</script>
