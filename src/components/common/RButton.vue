<!--
  Button Component
  create by yjh (2024-03-08)
-->

<template>
  <q-btn v-bind="props" :class="['button', props.class]" square @click="onBtnClick" >
    <slot name="content" />
  </q-btn>
</template>

<script setup>
import { defineProps, ref, defineEmits, computed } from 'vue'
const emit = defineEmits(['onClick'])

const props = defineProps({
  label: {
    type: [String, Number],
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  align: {
    type: String,
    default: 'center'
  },
  disable: {
    type: Boolean,
    default: false
  },
  outline: {
    type: Boolean,
    default: false
  },
  ripple: {
    type: Boolean,
    default: false
  }
})
const onBtnClick = (e) => {
  emit('onClick', e)
}

</script>
