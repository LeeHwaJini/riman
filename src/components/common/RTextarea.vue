<!--
  textarea
  create by jhchoi (2024-04-05)
-->
<template>
  <q-input
    v-model="model"
    v-bind="props"
    type="textarea"
  />
</template>

<script setup>
import { defineProps, defineModel } from 'vue'

const props = defineProps({
  class: {
    type: String,
    default: 'w400'
  },
  disable: {
    type: Boolean,
    default: false
  },
  rows: {
    type: Number,
    default: 3
  },
  maxlength: {
    type: String,
    default: ''
  },
  inputStyle: {
    type: Object,
    default: null
  },
  counter: {
    type: Boolean,
    default: false
  },
  rules: {
    type: Array,
    default: () => []
  }
})
const model = defineModel()
</script>

