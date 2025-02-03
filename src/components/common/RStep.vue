<template>
  <ul class="step__wrap">
    <li
      v-for="idx in totalStep"
      :key="idx"
      class="step__item"
      :class="{ 'step__item-active': idx === step }"
    >
      {{ idx }}
    </li>
  </ul>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  step: {
    type: Number,
    default: 1
  },
  totalStep: {
    type: Number,
    default: 1
  }
})

</script>

<style lang="scss" scoped>
.step {
  &__wrap {
    width: fit-content;
    display: flex;
    gap: 18px;
  }

  &__item {
    position: relative;
    height: 22px;
    width: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    line-height: 22px;
    border-radius: 9999px;
    background-color: #DDE1E6;
    color: #063451;
    font-size: 12px;
    font-weight: 600;
    font-family: 'Montserrat';

    &:not(:last-child):before {
      content: "";
      position: absolute;
      left: 100%;
      top: 50%;
      height: 2px;
      width: 18px;
      background-color: #DDE1E6;
    }

    &-active {
      border-color: rgba(6, 52, 81);
      background-color: rgba(6, 52, 81);
      color: rgba(255, 255, 255);
    }
  }

}
</style>
