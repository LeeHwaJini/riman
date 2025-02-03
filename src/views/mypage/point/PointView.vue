<template>
  <div class="max-width-wrap full-width-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t('OP_Point') }}</h3>
    </div>

    <div class="point-top-bg-area">
      <div class="point-top-area">
        <div class="field flex align-start justify-between">
          <span class="left-text">{{ $t('PT_Available') }}</span>
          <div class="right-text success04-color">
            <b class="font-20">{{ $moneyFormat(pointStatus?.activePoint) }}</b>
            <span>P</span>
          </div>
        </div>

        <div class="field flex align-start justify-between">
          <span class="left-text">{{ $t('PT_Pending') }}</span>
          <div class="">
            <div class="right-text justify-end">
              <b class="">{{ $moneyFormat(pointStatus?.readyPoint) }}</b>
              <span>P</span>
            </div>

            <span v-if="pointStatus?.accumulateExpectPoint > 0" class="font-10 gray05-color">{{ $t('PT_Pending_txt', {point: $moneyFormat(pointStatus?.accumulateExpectPoint)}) }}</span>
          </div>
        </div>

        <div class="field">
          <div class="flex align-start justify-between">
            <div v-clean-html="$t('PT_Expire7')" class="left-text"></div>
            <div class="right-text error-color">
              <b>{{ $moneyFormat(pointStatus?.expectTerminatePoint) }}</b>
              <span>P</span>
            </div>
          </div>

          <div class="">
            <div class="flex align-start justify-between">
              <div v-clean-html="$t('PT_Expire30')" class="left-text"></div>
              <div class="right-text error-color">
                <b>{{ $moneyFormat(pointStatus?.nextExpectTerminatePoint) }}</b>
                <span>P</span>
              </div>
            </div>

            <div v-clean-html="$t('PT_Info')" class="point-bottom-text">

            </div>
          </div>
        </div>

      </div>
    </div>
    <PointList />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import PointList from './components/PointList'
import orderService from '@/http/services/order'
import { useMainStore } from '@/store/mainStore'
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
const mainStore = useMainStore()
const pointStatus = ref()
const vCleanHtml = buildVueDompurifyHTMLDirective()
async function getPoint() {
  const res = await orderService.getPoint(mainStore.getUser.userSeqNo)
  if (res) {
    pointStatus.value = res.data
  }
}
onMounted(() => {
  getPoint()
})
</script>

<style lang="scss" scoped>

</style>
