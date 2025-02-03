<!--
우편번호 검색
-->
<template>
  <q-dialog
    ref="addressModal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-shake
    class="address-search-modal-wrap"
  >
    <layout-modal
      ref="layoutModal"
      :move-able="true"
      modal-class="address-search-modal"
    >
      <template #body>
        <q-card-section>
          <div class="popCont">
            <div class="layer__wrap">
              <div class="layer__content">
                <div class="member-layer">
                  <div class="member-layer__view">
                    <div class="box">
                      <h3 class="box__title">{{ $t('CMM_AddressSearch') }}</h3>
                      <div class="">
                        <div class="box__top">
                          <div class="box__wrap address-search-wrap">
                            <div class="box-item">
                              <div class="item item--full">
                                <q-input
                                  v-model.trim="text"
                                  :placeholder="$t('CMM_AddressSearchPh')"
                                  clearable
                                  clear-icon="close"
                                  @keydown.enter.prevent="onSearchAddress"
                                />
                              </div>
                              <RButton
                                class="btn type02"
                                :label="$t('CM_Search')"
                                @click="onSearchAddress"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="postcode__box">
                          <div v-if="jusoList.length === 0|| pageInfo.totalSize > 5000" class="postcode__tip">
                            <div v-if="errorCode" class="postcode__mb3">
                              <span v-if="jusoList.length === 0">
                                <b>{{ $t('CMM_ErrorText_1') }}</b> <br>
                                {{ $t('CMM_ErrorText_2') }}
                              </span>
                              <span v-else-if="pageInfo.totalSize > 5000">
                                <b>{{ $t('CMM_ErrorText_3') }}</b> <br>
                                {{ $t('CMM_ErrorText_4') }}
                              </span>
                            </div>

                            <div class="postcode__tip postcode__tip__title">
                              {{ $t('CM_Tip') }}
                            </div>

                            <div class="tip-text-area">
                              <p>{{ $t('CMM_ExampleText_1') }}  {{ $t('CMM_ExampleText_2') }}</p>
                              <span class="blue-text">{{ $t('CMM_ExampleText_3') }}</span>
                            </div>

                            <div class="tip-text-area">
                              <p>{{ $t('CMM_ExampleText_4') }}</p>
                              <span class="blue-text">{{ $t('CMM_ExampleText_5') }}</span>
                            </div>

                            <div class="tip-text-area">
                              <p>{{ $t('CMM_ExampleText_6') }}</p>
                              <span class="blue-text">{{ $t('CMM_ExampleText_7') }}</span>
                            </div>

                            <div class="tip-text-area">
                              <p>{{ $t('CMM_ExampleText_8') }}</p>
                              <span class="blue-text">{{ $t('CMM_ExampleText_9') }}</span>
                            </div>

                          </div>

                          <!-- 검색 결과 -->
                          <div v-else class="address-result-content">
                            <!-- 우편번호 : 검색 결과 많을 시 -->
                            <div v-if="pageInfo && pageInfo.totalSize > 100" class="tip-text-area">
                              <p>{{ $t('CMM_ErrorText_5') }} {{ $t('CMM_ErrorText_6') }}</p>
                              <span class="blue-text">{{ $t('CMM_ErrorText_7') }}</span>
                            </div>

                            <ul class="address-result-area scroll-wrap.address-search-modal scroll-wrap ">
                              <li v-for="data in jusoList" :key="data">
                                <div class="postcode__list postcode__list__box">
                                  <div class="postcode__code">{{ data.zipNo }}</div>
                                </div>
                                <dl>
                                  <dt>{{ $t('CMM_RoadName') }}</dt>
                                  <dd @click="onSendAddrInfo(data, data.roadAddr)">{{ data.roadAddr }}</dd>
                                  <dt>{{ $t('CMM_StreetNumber') }}</dt>
                                  <dd @click="onSendAddrInfo(data, data.jibunAddr)">{{ data.jibunAddr }}</dd>
                                </dl>
                              </li>
                            </ul>

                            <div v-if="pageInfo.totalSize !== 0" class="postcode__pagination">
                              <Pagination
                                v-model:page-info="pageInfo"
                                class-name="pagenation type01"
                                @search-event="onSearchAddress"
                              />
                            </div>
                          </div>
                          <!-- //검색 결과 -->
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance } from 'vue'
import http from '@utils/http'
const { proxy } = getCurrentInstance()

const props = defineProps({
  callbackEvt: {
    type: Function,
    default: () => {}
  }
})

const isMobile = computed(() => proxy.$isMobile())
const addressModal = ref()
const text = ref('')
const jusoList = ref([])
const errorCode = ref('')
const pageInfo = reactive({
  pageSize: 10,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5
})
const onSearchAddress = async () => {
  const params = {
    currentPage: pageInfo.pageNumber,
    countPerPage: pageInfo.pageSize,
    keyword: text.value
  }
  if (isMobile.value && pageInfo.pageNumber === 1) {
    jusoList.value = []
  }

  const result = await http().url('/address').param(params).get()
  if (result && result.results.common.errorCode === '0') {
    if (isMobile.value) {
      jusoList.value = jusoList.value.concat(result.results.juso)
    } else {
      jusoList.value = result.results.juso
    }

    pageInfo.totalSize = result.results.common.totalCount
    errorCode.value = result.results.common.errorCode
  }
}

// 팝업 닫기
const modalHide = () => {
  addressModal.value.hide()
}

const onSendAddrInfo = (item, addr) => {
  const data = {
    zipNo: item.zipNo,
    address1: addr,
    siNm: item.siNm,
    sggNm: item.sggNm,
    /* 좌표 조회 API 파라미터 */
    admCd: item.admCd,
    rnMgtSn: item.rnMgtSn,
    udrtYn: item.udrtYn,
    buldMnnm: item.buldMnnm,
    buldSlno: item.buldSlno
  }
  props.callbackEvt(data)
  modalHide()
}
</script>

<style lang="scss" scoped>

</style>
