<!--
  Pagination Component
  create by nws (2023-06-22)
-->

<template>
  <template v-if="isMoreBtn">
    <!-- 모바일 더보기 버튼 있을 경우 -->
    <q-pagination
      v-if="!isMobile"
      v-model="pageInfo.pageNumber"
      :class="className"
      :max="maxPages"
      :max-pages="pageInfo.maxPagination"
      :ellipses="false"
      :boundary-numbers="false"
      direction-links
      boundary-links
      color="grey"
      active-color="black"
      :icon-first="`img:${FirstIcon}`"
      :icon-last="`img:${LastIcon}`"
      :icon-prev="`img:${PrevIcon}`"
      :icon-next="`img:${NextIcon}`"
      @update:model-value="emit('search-event')"
    />
    <template v-else>
      <div class="mlr16">
        <RButton v-if="pageInfo.pageNumber !== maxPages" class="btn full small type03 mo767 mt24" :label="`${$t('CM_LoadMore')}(${pageInfo.pageNumber}/${maxPages})`" @on-click="loadMore"/>
      </div>
    </template>

  </template>
  <template v-else>
    <!-- 모바일 더보기 버튼 있을 경우 -->
    <q-pagination
      v-model="pageInfo.pageNumber"
      :class="className"
      :max="maxPages"
      :max-pages="pageInfo.maxPagination"
      :ellipses="false"
      :boundary-numbers="false"
      direction-links
      boundary-links
      color="grey"
      active-color="black"
      :icon-first="`img:${FirstIcon}`"
      :icon-last="`img:${LastIcon}`"
      :icon-prev="`img:${PrevIcon}`"
      :icon-next="`img:${NextIcon}`"
      @update:model-value="emit('search-event')"
    />
  </template>
</template>

<script setup>
import { defineEmits, defineModel, computed, getCurrentInstance, defineProps } from 'vue'

import FirstIcon from '@/assets/images/icons/ico_page_start.svg'
import LastIcon from '@/assets/images/icons/ico_page_end.svg'
import PrevIcon from '@/assets/images/icons/ico_page_prev.svg'
import NextIcon from '@/assets/images/icons/ico_page_next.svg'

const emit = defineEmits(['search-event'])
const { proxy } = getCurrentInstance()

const props = defineProps({
  isMoreBtn: {
    type: Boolean,
    default: true
  },
  className: {
    type: String,
    default: ''
  }
})

const pageInfo = defineModel('pageInfo',
  {
    type: Object,
    default: {
      pageSize: 100,
      pageNumber: 1,
      totalPageNumber: 0,
      totalSize: 0,
      maxPagination: 10
    }
  }
)
const maxPages = computed(() => Math.ceil(pageInfo.value.totalSize / pageInfo.value.pageSize))
const isMobile = computed(() => proxy.$isMobile())

/**
 * 모바일 > 더보기
 */
const loadMore = () => {
  if (pageInfo.value.pageNumber < maxPages.value) {
    pageInfo.value.pageNumber++
    emit('search-event')
  }
}
</script>
