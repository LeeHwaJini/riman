<!--
  데이터 테이블 (QUASA)
  create by CHJM (2024-09-02)
-->
<template>
  <!-- :visible-columns="visibleColumns" : 추후 사용시 적용-->
  <q-table
    class="my-sticky-dynamic"
    :class="wrapClassName"
    :title="title"
    :rows="rowData"
    :columns="columns"
    :loading="loading"
    :filter="filter"
    row-key="index"
    virtual-scroll
    :virtual-scroll-item-size="48"
    :virtual-scroll-sticky-size-start="48"
    :rows-per-page-options="[0]"
    :no-data-label="noDataText"
    :hide-no-data="hideNoData"
    hide-pagination
    @virtual-scroll="onScroll"
  >
    <!-- search -->
    <template v-if="isSearch" #top-right>
      <q-input
        v-model="filter"
        borderless
        dense
        debounce="300"
        placeholder="Search"
      >
        <template #append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-select
        v-if="isVisibleColumns"
        v-model="visibleColumns"
        multiple
        outlined
        dense
        options-dense
        :display-value="$q.lang.table.columns"
        emit-value
        map-options
        :options="visibleColumnsOptions"
        option-value="name"
        options-cover
        style="min-width: 150px"
      />
    </template>
    <!--loading 처리-->
    <template #loading>
      <q-inner-loading showing color="primary" />
    </template>
    <!--slot-->

    <template v-if="topTitle.isSetTop" #top-row="props">
      <q-td
        v-if="topTitle.mergeRow > 0"
        :colspan="topTitle.mergeRow"
        class="text-center"
      >
        <strong>{{ topTitle.text }}</strong>
      </q-td>
      <template v-for="(item, index) in props.cols.length - topTitle.mergeRow" :key="index">
        <q-td>
          <strong>
            {{ props.cols[index + topTitle.mergeRow].total }}
          </strong>
        </q-td>
      </template>

    </template>
    <template #body-cell-cellrender="props">
      <q-td v-if="props.col.cellrender[0].type === 'html'" :props="props">
        <slot name="default" :value="props.row.value" />
      </q-td>

      <!--Button 처리 -->
      <q-td v-if="props.col.cellrender[0].type === 'btn'" :props="props">
        <!--div>
           {{ props.col.cellrender[0].label}}
          <q-badge color="purple" :label="props.value" />
        </div-->
        <div>
          {{ props.row.actionBtn }}
          <q-btn
            size="xs"
            :label="props.col.cellrender[0].label"
            @click="onClickBtn(props.col.cellrender[0].action, props.row)"
          />
        </div>
      </q-td>
      <!--Image 처리 -->
      <q-td v-if="props.col.cellrender[0].type === 'image'" :props="props">
        <div>
          <img
            :src="props.col.cellrender[0].src"
            style="width: 25px; height: 25px"
          />
        </div>
      </q-td>
      <!--Link 처리 -->
      <q-td v-if="props.col.cellrender[0].type === 'link'" :props="props">
        <div>
          <router-link :to="props.col.cellrender[0].src" target="_blank">
            {{ props.value }}
          </router-link>
        </div>
      </q-td>
    </template>
  </q-table>
  <!--Pagination -->
  <Pagination
    v-if="isPagination"
    v-model:page-info="pageInfo"
    class-name="pagenation type03"
    :is-more-btn="isMoreBtn"
    @search-event="emit('search-event')"
  />
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'

const emit = defineEmits(['search-event'])

// const pageSize = 10
const props = defineProps({
  title: {
    // 상단 title
    type: String,
    default: ''
  },
  columns: {
    // 컬럼 정보
    type: Array,
    default: () => {
      return []
    }
  },
  rowData: {
    // row Data 정보
    type: Array,
    default: () => {
      return []
    }
  },
  isPagination: {
    // Pagination (사용 true, 미사용 false)
    type: Boolean,
    default: true
  },
  isSearch: {
    // Search 여부 (사용 true, 미사용 false)
    type: Boolean,
    default: false
  },
  isVisibleColumns: {
    // VisibleColumns 여부 (사용 true, 미사용 false)
    type: Boolean,
    default: false
  },
  wrapClassName: {
    type: String,
    default: ''
  },
  noDataText: {
    type: String,
    default: 'no data'
  },
  hideNoData: {
    type: Boolean,
    default: false
  },
  topTitle: {
    type: Array,
    default: () => {
      return {
        isSetTop: false,
        mergeRow: 0,
        text: ''
      }
    }
  },
  isMoreBtn: {
    type: Boolean,
    default: true
  }
})
// pagination 처리시
const pageInfo = defineModel('pageInfo',
  {
    type: Object,
    default: {
      pageSize: 100,
      pageNumber: 1,
      totalPageNumber: 0,
      totalSize: 0
    }
  }
)

// const nextPage = ref(2)
const loading = ref(false)
// const pagination = ref({})

// const rows = computed(() =>
//   props.rowData.slice(0, pageSize * (nextPage.value - 1))
// )
// const lastPage = Math.ceil(props.rowData.length / pageSize)

// visibleColumns 관련 추후 적용
// const visibleColumns = ref(_.map(props.columns, 'name'))
// const visibleColumnsOptions = ref(
//   _.filter(props.columns, (item) => {
//     if (_.isUndefined(item.isFixed) || !item.isFixed) {
//       return item
//     }
//   })
// )

// const init = () => {
// initPagination()
// }

// const initPagination = () => {
//   // pagination 처리시
//   // if (props.isPagination) {
//   //   pagination.value = {
//   //     sortBy: 'desc',
//   //     descending: false,
//   //     page: 1,
//   //     rowsPerPage: pageSize
//   //   }
//   // }
// }

const onClickBtn = (actionName, row) => {
  emit(actionName, row)
}

onMounted(() => {})

</script>

<style lang="sass">

</style>
