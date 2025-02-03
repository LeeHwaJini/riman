<!--
  Switch Component
  create by yjh (2024-03-12)
-->

<template>
  <q-toggle
    v-model="model"
    v-bind="props"
  />
</template>

<script setup>
import { defineProps, defineModel, ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  disable: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md'
  },
  color: {
    type: String,
    default: 'blue'
  }
})
const model = defineModel()
</script>
