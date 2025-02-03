<!--
체크박스
create by jhchoi
-->
<template>
  <q-checkbox v-bind="props" v-model="model" class="check-box-custom">
    <slot />
  </q-checkbox>
</template>

<script setup>
import { defineProps, defineModel, ref } from 'vue'

const props = defineProps({
  required: {
    type: Boolean,
    default: false
  }
})

const model = defineModel()

</script>
