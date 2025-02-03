<template>
  <q-dialog
    ref="drawer"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    position="right"
    :class="['layer layer--detail layer--detail-70']"
  >
    <layout-modal
      ref="layoutDrawer"
      :move-able="true"
    >
      <template #body>
        <q-card-section>
          <div class="layer__wrap">
            <div class="layer__content">
              <div class="detail-layer">
                <div class="detail-layer__header">
                  <div class="detail-layer__inbox">
                    <h2 class="detail-layer__pagename">소비자 상세</h2>
                    <div class="detail-layer__itemwrap">
                      <div class="detail-layer__item">
                        <div class="detail-layer__name">{{ data.consumerName }}</div>
                        <div class="detail-layer__number">{{ data.consumerNumber }}</div>
                      </div>
                      <div class="detail-layer__item detail-layer__item--info">
                        <div class="detail-layer__state">
                          <b>직급</b>
                          <span>{{ data.consumerGrade.text }}</span>
                        </div>
                        <div class="detail-layer__state">
                          <b>상태</b>
                          <span>{{ data.userStatus.text }}</span>
                        </div>
                        <div class="detail-layer__state">
                          <b>추천인</b>
                          <span>{{ data.recommenderDetailInfo.recommenderStoreOwnerName }}</span>
                        </div>
                        <div class="detail-layer__state">
                          <b>소속 판매점</b>
                          <span>{{ data.recommenderDetailInfo.recommenderStoreName }} ({{ data.recommenderDetailInfo.recommenderStoreLoginId }})</span>
                        </div>
                      </div>
                    </div>
                    <q-btn
                      v-close-popup
                      class="button button--close"
                      icon="close"
                      flat
                      round
                      dense
                    />
                  </div>
                  <div class="detail-layer__menuwrap scroll-style">
                    <q-tabs v-model="activePTab" class="bg-navy text-white">
                      <q-tab name="basicInfo" label="기본정보"/>
                      <q-tab name="B" label="포인트/쿠폰"/>
                      <q-tab name="C" label="라인정보"/>
                      <q-tab name="D" label="상담정보"/>
                      <q-tab name="E" label="기록정보"/>
                    </q-tabs>
                  </div>
                </div>
                <q-tab-panels v-model="activePTab">
                  <q-tab-panel name="basicInfo">
                    <q-tabs v-model="activeCTab">
                      <q-tab name="consumerInfo" label="소비자정보"/>
                      <q-tab name="A" label="승급내역"/>
                      <q-tab name="B" label="환불계좌"/>
                    </q-tabs>
                    <q-tab-panels v-model="activeCTab">
                      <q-tab-panel name="consumerInfo">
                        <ConsumerInfoTab :data="data" />
                      </q-tab-panel>
                      <q-tab-panel name="A"/>
                      <q-tab-panel name="B"/>
                    </q-tab-panels>
                  </q-tab-panel>
                  <q-tab-panel name="B"/>
                </q-tab-panels>
              </div>
            </div>
          </div>
        </q-card-section>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import ConsumerInfoTab from '@views/guide/popup/tab/ConsumerInfoTab'

defineProps({
  data: {
    type: Object,
    default: null
  },
  setting: {
    type: Object,
    default: null
  }
})

const activePTab = ref('basicInfo')
const activeCTab = ref('consumerInfo')
</script>

<style lang="scss" scoped>

</style>
