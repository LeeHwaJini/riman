<template>
  <q-dialog ref="drawer" position="right" full-height class="prd-filter-popup-wrap">
    <q-card class="scroll type01 pb264">
      <div class="text-right">
        <button class="menu-close-btn unset" @click="onClickClose">
          <i class="ico close" />
        </button>
      </div>

      <h4 class="popup-title">{{ $t('CM_Filter') }}</h4>
      <template v-if="categoryData && filters">
        <q-expansion-item
          v-for="filter in filters.children"
          :key="filter.categoryId"
          expand-separator
          :default-opened="filters.children.length === 1"
          :label="filter.categoryName"
          :expand-icon="`img:${AddIcon}`"
          :expanded-icon="`img:${SubtractIcon}`"
          class="dropdown type01"
        >
          <RCheckbox v-for="filterChild in filter.children" :key="filterChild.categoryId" :model-value="selected" :val="filterChild.categoryId" @update:model-value="onUpdateFilter">
            <span>{{ filterChild.categoryName }}</span>
          </RCheckbox>
        </q-expansion-item>
      </template>

      <div class="bottom-btn filter-bottom-btn">
        <span class="select-count-text">{{ selected.length }}{{ $t('CM_Unit') }} {{ $t('CM_Optional') }}</span>
        <ul v-if="selected.length > 0" class="filter-select-area">
          <li v-for="tag in selectedTag" :key="tag">
            <span>{{ tag.categoryName }}</span>
            <i class="ico close-g" @click="() => onDeleteTag(tag)"></i>
          </li>
        </ul>
        <div class="flex-btn-area">
          <RButton class="btn full small type03" label="초기화" @on-click="onReset"/>
          <RButton class="btn full small type02" :label="$t('CM_FilterSearch')" @on-click="onSearch"/>
        </div>
      </div>

    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import AddIcon from '@/assets/images/icons/ico_add.svg'
import SubtractIcon from '@/assets/images/icons/ico_subtract.svg'
import productService from '@/http/services/product'
import { useProductStore } from '@/store/productStore'
import { useRoute, useRouter } from 'vue-router'

const { data: nestedCategoryData } = productService.getNestedCategoryList()
const { data: categoryData } = productService.getCategoryList()

const { categoryId, selectedFilter } = defineProps({
  categoryId: {
    type: String,
    default: null
  },
  selectedFilter: {
    type: Object,
    default: null
  }
})
const selected = ref(selectedFilter.value?.split(',').filter(item => item && item !== '0') ?? [])
const drawer = ref()
const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const selectedTag = computed(() => {
  return selected.value.map(item => {
    return categoryData.value?.filter(i => {
      return i.categoryId === item
    })[0]
  }).filter(item => item !== undefined)
})
const emit = defineEmits(['ok'])
const filters = computed(() => {
  let _filters = null
  _filters = nestedCategoryData.value?.filter(item => item.categoryId === categoryId)[0]
  if (!_filters) {
    const parentId = categoryData.value?.filter(item => item.categoryId === categoryId)[0].parentId
    const parentCateFilter = nestedCategoryData.value?.filter(item => item.categoryId === parentId)[0]
    const currentFilterchildren = nestedCategoryData.value?.filter(item => item.categoryId === parentId)[0].children.filter(item => item.categoryId === categoryId)
    _filters = {
      ...parentCateFilter,
      children: currentFilterchildren
    }
  }
  return _filters
})

const onUpdateFilter = (v) => {
  selected.value = v
}
const onClickClose = () => {
  drawer.value.hide()
}
const onSearch = () => {
  emit('ok', selected.value)
  productStore.updateFilter(selected.value)
  drawer.value.hide()
}
const onDeleteTag = (tag) => {
  selected.value = selected.value.filter(item => item !== tag.categoryId)
}
const onReset = () => {
  selected.value = []
}
</script>
