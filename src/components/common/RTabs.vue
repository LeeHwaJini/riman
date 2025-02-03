<!--
  Tab Component
  create by jhchoi
-->
<template>
  <q-tabs
    v-model="model"
    class=""
    active-color="black"
    dense
    align="justify"
  >
    <q-tab
      v-for="(item, index) in tabList"
      :key="index"
      :label="item.label"
      :name="item.name"
      :ripple="ripple"
    />
  </q-tabs>
</template>

<script setup>
import { defineProps, defineModel } from 'vue'
const props = defineProps({
  tabList: {
    type: Array,
    required: true
  },
  ripple: {
    type: Boolean,
    default: false
  }
})
const model = defineModel()
</script>
