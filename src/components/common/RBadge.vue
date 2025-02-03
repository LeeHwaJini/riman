<!--
  Badge Component
  create by yjh (2024-03-12)
-->

<template>
  <q-badge v-bind="props" />
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  color: {
    type: String,
    default: ''
  },
  textColor: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  class: {
    type: String,
    default: ''
  },
  align: {
    type: String,
    default: 'middle'
  }
})
</script>
