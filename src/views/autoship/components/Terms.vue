<template>
  <div class="all-checkbox-area mlr16 ptb8">
    <RCheckbox v-model="checkboxAll" checked-icon="check_circle" unchecked-icon="check_circle" >
      <span class="checkbox-title font-14">(필수) 정기구매 이용약관</span>
    </RCheckbox>
  </div>

  <div class="checkbox-area type01 plr16">
    <div class="field mt8">
      <RCheckbox v-model="checkbox" checked-icon="check_circle" unchecked-icon="check_circle">
        <b>필수</b>
        <span class="checkbox-title gray04-color text-underline type02 font-14">정기구매 이용약관</span>
      </RCheckbox>
    </div>

    <div class="field">
      <RCheckbox v-model="checkbox" checked-icon="check_circle" unchecked-icon="check_circle">
        <b>필수</b>
        <span class="checkbox-title gray04-color text-underline type02 font-14">개인정보 수집 및 이용 동의(토스페이먼츠)</span>
      </RCheckbox>
    </div>

    <div class="field">
      <RCheckbox v-model="checkbox" checked-icon="check_circle" unchecked-icon="check_circle">
        <b>필수</b>
        <span class="checkbox-title gray04-color text-underline type02 font-14">개인정보 제공 안내</span>
      </RCheckbox>
    </div>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const allChecked = defineModel({
  type: Boolean
})
const checkbox = ref(false)
const checkboxAll = computed({
  set: (v) => {
    checkbox.value = v
    allChecked.value = v
  },
  get: () => {
    return checkbox.value
  }
})
</script>

<style lang="scss" scoped>

</style>
