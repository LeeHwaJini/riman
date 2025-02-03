<template>
  <q-dialog
    ref="modal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    class="download-full-page-modal"
    :class="props.classNames"
  >
    <layout-modal
      ref="layoutModal"
      @hide="hide"
    >
      <template #body>
        <div class="title-top-area">
          <slot name="title"></slot>
          <button class="menu-close-btn" @click="hide">
            <i class="ico close" />
          </button>
        </div>
        <slot name="body"/>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { computed, getCurrentInstance, ref } from 'vue'
const props = defineProps({
  classNames: {
    type: String,
    default: ''
  }
})
const modal = ref()
function hide() {
  modal.value.hide()
}
const show = () => {
  modal.value.show()
}
defineExpose({
  show, hide
})
</script>

  <style lang="scss" scoped>

  </style>
