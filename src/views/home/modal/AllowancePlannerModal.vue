<!--
  주문 혹은 수당에 발생한 플래너가 로그인 할 시 팝업 노출
  create by jhchoi
-->

<template>
  <q-dialog
    ref="modal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    @show="show"
    @hide="hide"

  >
    <layout-modal
      ref="layoutModal"
      @hide="hide"
    >
      <!-- 팝업 내용 -->
      <template #body>
        수당 발생 modal

      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, computed, defineProps, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['ok', 'cancel'])

const modal = ref()

// 팝업 Hide 호출
const hide = () => {
  modal.value.hide()
}

</script>
