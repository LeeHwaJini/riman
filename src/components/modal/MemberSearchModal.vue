<!-- 회원 검색 Modal -->
<template>
  <q-dialog
    ref="modal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-backdrop-dismiss
    no-shake
    @hide="hide"
  >
    <layout-modal
      ref="layoutModal"
      width="1400px"
      :title="$t('CMM_SearchMember')"
      :footer-btn="footerBtn"
      @action1-evt="onClickOk"
      @action2-evt="modalHide"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <q-card-section>
          <div class="modal-layer">
            <div class="box__wrap">
              <div class="box-item">
                <div class="item item--label">
                  <span class="box-label">{{ $t('SRH_SearchDate') }}</span>
                </div>
                <div class="item">
                  <RSelectBox
                    v-model="dateType"
                    :label="$t('CMM_PeriodType')"
                    :options="dateTypeOption"
                    :disable="false"
                    :filterable="false"
                  />
                </div>
                <div class="item item--datepicker">
                  <RDatepickerGroup
                    ref="_RDatepickerGroup"
                    v-model:startDate="searchForm.fromDate"
                    v-model:endDate="searchForm.toDate"
                    :period="period"
                  />
                </div>
              </div>
            </div>
            <div class="box__wrap">
              <div class="box-item">
                <div class="item item--label">
                  <span class="box-label">{{ $t('CM_UserRank') }}</span>
                </div>
                <div class="item">
                  <RSelectBox
                    v-model="dateType"
                    :label="$t('SRH_MemberType')"
                    :options="dateTypeOption"
                    :disable="false"
                    :filterable="false"
                  />
                </div>
                <div class="item">
                  <RSelectBox
                    v-model="dateType"
                    :label="$t('CM_Rank')"
                    :options="dateTypeOption"
                    :disable="false"
                    :filterable="false"
                  />
                </div>
                <div class="item">
                  <RSelectBox
                    v-model="dateType"
                    :label="$t('SRH_MemberStatus')"
                    :options="dateTypeOption"
                    :disable="false"
                    :filterable="false"
                  />
                </div>
              </div>
            </div>
            <div class="box__wrap box__wrap--last">
              <div class="box-item">
                <div class="item">
                  <RSelectBox
                    v-model="memberType"
                    :label="$t('CM_Category')"
                    :options="memberTypeOption"
                    :disable="false"
                    :filterable="false"
                  />
                </div>
                <div class="item item--double">
                  <RInput
                    v-model.trim="searchText"
                    class="w400"
                    :placeholder="$t('SRH_SearchComment')"
                    :icon="'search'"
                  />
                </div>
              </div>
              <div class="box-item box-item--right">
                <div class="option-wrap">
                  <RButton
                    class="bg_lightGray"
                    icon="replay"
                    @on-click="onReset"
                  />
                  <RButton
                    class="button--search"
                    icon="person_search"
                    :label="$t('CM_Search')"
                    @click="onSearch('pageInit')"
                  />
                </div>
              </div>
            </div>
            <div class="box-table">
              <DataTable
                ref="_dataTable"
                v-model:page-info="pageInfo"
                :columns="columns"
                :row-data="rowData"
                :row-click-event="onRowClick"
                :is-excel-btn="false"
                :is-column-control="false"
                @search-event="onSearch"
              />
            </div>
          </div>
        </q-card-section>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, computed, reactive, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const emit = defineEmits(['ok', 'cancel'])

const modal = ref()
const searchText = ref('')

const _RDatepickerGroup = ref()

const searchForm = reactive({
  toDate: '',
  fromDate: '',
  searchType: 'JOIN_DATE',
  consumerGrade: null,
  userStatus: null,
  marketingAgreement: null,
  gender: null,
  belongStoreName: null,
  birthDate: null
})

const dateType = ref('')
const memberType = ref('memberid')
const period = ref('3m')

const footerBtn = computed(() => [
  { type: 'action1', label: proxy.$t('CM_Save'), class: 'button button--success layer-button' },
  { type: 'action2', label: proxy.$t('CM_Cancel'), class: 'button button--cancel layer-button' }
])

const dateTypeOption = computed(() => [
  { label: proxy.$t('CM_All'), value: '' }
])

const memberTypeOption = [
  { label: 'Member ID', value: 'memberid' }
]

const pageInfo = reactive({
  pageSize: 50,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 50
})

const columns = computed(() => [
  { headerName: 'ID',
    field: 'id'
  },
  { headerName: proxy.$t('CMM_UserName'), field: 'name' },
  { headerName: proxy.$t('SRH_MemberType'), field: 'type' },
  { headerName: proxy.$t('CM_Rank'), field: 'grade' },
  { headerName: proxy.$t('SRH_MemberStatus'), field: 'status' },
  { headerName: proxy.$t('CM_ReferralNumber'), field: 'recommend' },
  { headerName: proxy.$t('CM_ReferralFirstName'), field: 'recommendname' },
  { headerName: proxy.$t('CM_JoinDate'), field: 'date' }
])

const rowData = computed(() => {
  const rowDataTemp = [
    { id: '2012345678', name: 'Frozen Yogurt', type: 'Planner', grade: 'Planner', status: 'Active', recommend: '208712345', recommendname: 'Jay Kim', date: '2024-11-03 21:21:42' },
    { id: '2098753234', name: 'Ice cream', type: 'Planner', grade: 'Planner', status: 'Active', recommend: '208712345', recommendname: 'Davie Kim', date: '2024-11-03 21:21:42' },
    { id: '2012345678', name: 'Eclair', type: 'Planner', grade: 'Planner', status: 'Active', recommend: '208712345', recommendname: 'Jay Kim', date: '2024-11-03 21:21:42' },
    { id: '2012345678', name: 'Cupcake', type: 'Planner', grade: 'Planner', status: 'Active', recommend: '208712345', recommendname: 'Jay Kim', date: '2024-11-03 21:21:42' },
    { id: '2012345678', name: 'Gingerbread', type: 'Planner', grade: 'Planner', status: 'Active', recommend: '208712345', recommendname: 'Davie Kim', date: '2024-11-03 21:21:42' }
  ]
  // [TEST] 10000 배 Data 생성-
  let rowTemp = []
  for (let i = 0; i < 10; i++) {
    rowTemp = rowTemp.concat(rowDataTemp)
  }
  return rowTemp
})

// 팝업 show 호출

// 팝업 Hide 호출
const hide = () => {
  console.log('hide')
}

// 팝업 닫기
const modalHide = () => {
  modal.value.hide()
}

// Ok onClick 버튼 이벤트 처리
const onClickOk = () => {
  const modalInfo = '팝업 선택 하였습니다.'
  emit('ok', modalInfo)
  modalHide()
}

const onReset = () => {
  searchForm.searchType = 'JOIN_DATE'
  searchForm.consumerGrade = null
  searchForm.userStatus = null
  searchForm.marketingAgreement = null
  searchForm.gender = null
  dateType.value = 'all'
  searchForm.belongStoreName = null
  searchForm.birthDate = null
  searchText.value = null
  _RDatepickerGroup.value.init()
}

const onRowClick = async (e) => {
  emit('ok', e)
  modalHide()
}

const onSearch = async () => {
  console.log('search')
}

</script>
