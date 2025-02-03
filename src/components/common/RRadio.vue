<!--
radio Component
create by wsna (2023-07-06)
-->
<template>
  <q-option-group v-model="model" v-bind="props" :options="props.options" />
</template>

<script setup>
import { defineProps, defineModel } from 'vue'
const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  disable: {
    type: Boolean,
    default: false
  },
  inline: {
    type: Boolean,
    default: true
  },
  dense: {
    type: Boolean,
    default: true
  }
})
const model = defineModel()
</script>
