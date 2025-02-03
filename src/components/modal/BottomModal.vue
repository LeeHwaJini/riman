<template>
  <q-dialog v-model="dialog" position="bottom" class="prd-option-bottom-modal">

    <q-card class="">
      <button class="btn mo-slide-btn"><span class="slide-icon"></span></button>
      <button class="close-btn" @click="modalClose"><i class="ico arrow-down"></i></button>
      <slot></slot>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'

const dialog = defineModel()
const modalClose = () => {
  dialog.value = false
}
</script>

<style lang="scss" scoped>

</style>
