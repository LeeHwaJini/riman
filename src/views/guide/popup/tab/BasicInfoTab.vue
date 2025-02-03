<template>
  <div class="box-tab">
    <ul class="tab">
      <li :class="activeName === 'consumerInfo' ? 'active' : ''" @click="onTabClick('consumerInfo')">
        <a href="#">소비자정보</a>
      </li>
      <li :class="activeName === 'A' ? 'active' : ''" @click="onTabClick('A')">
        <a href="#">승급내역</a>
      </li>
      <li :class="activeName === 'B' ? 'active' : ''" @click="onTabClick('B')">
        <a href="#">환불계좌</a>
      </li>
    </ul>
  </div>
  <div
    v-if="activeName === 'consumerInfo'"
    class="box"
  >
    <ConsumerInfoTab :data="data" />activeName
  </div>
  <div
    v-if="activeName === 'A'"
    class="box"
  />
  <div
    v-if="activeName === 'B'"
    class="box"
  />
</template>

<script setup>
import { ref } from 'vue'
import ConsumerInfoTab from '@views/guide/popup/tab/ConsumerInfoTab'

const activeName = ref('consumerInfo')
defineProps({
  data: {
    type: Object,
    default: null
  }
})

// const onTabClick = (tab) => {
//   activeName.value = tab
// }
</script>

<style lang="scss" scoped>

</style>
