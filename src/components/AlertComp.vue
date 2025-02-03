<!--
Alert Component
create by chjm (2023-05-30)
-->

<template>
  <q-dialog
    v-if="open"
    ref="dialog"
    :class="wrapClassName"
    no-esc-dismiss
    no-backdrop-dismiss
    @hide="hide"
  >
    <q-card class="q-dialog-plugin alert q-dialog type01">
      <div class="dialog-icon-area">
        <i class="ico" :class="iconClassName"/>
      </div>

      <div class="dialog-title pre-line">{{ $t(title) }}</div>

      <p v-clean-html="$t(message)" class="dialog-content pre-line" />

      <q-card-actions class="dialog-btn-area">
        <RButton
          v-if="type === 'confirm' && !disabledButton"
          class="btn full type03 small button--cancel"
          :class="cancelClassName"
          :label="$t(cancelLabel)"
          @click="onCancelClick"
        />
        <RButton
          v-if="!disabledButton"
          class="btn full type02 small button--success"
          :class="okClassName"
          :label="$t(okLabel)"
          @click="onOKClick"
        />
      </q-card-actions>
      <button v-if="props.type !== 'info'" class="menu-close-btn" @click="onClickClose">
        <i class="ico close-gray" />
      </button>
    </q-card>
  </q-dialog>

</template>

<script setup>
import { ref } from 'vue'
import RButton from './common/RButton.vue'

const emit = defineEmits(['ok', 'cancel', 'close'])
const dialog = ref()
const open = ref(true)
import { buildVueDompurifyHTMLDirective } from 'vue-dompurify-html'
const FORBID_TAGS = ['img', 'video', 'iframe', 'figure']
const vCleanHtml = buildVueDompurifyHTMLDirective({
  default: {
    FORBID_TAGS
  }
})
const props = defineProps({
  title: {
    type: String,
    required: true,
    default: 'CM_Ok'
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: 'info'
  },
  disabledButton: {
    type: Boolean,
    default: false
  },

  okLabel: {
    type: String,
    required: false,
    default: 'CM_Ok'
  },

  cancelLabel: {
    type: String,
    required: false,
    default: 'CM_Cancel'
  },
  okClassName: {
    type: String,
    required: false,
    default: ''
  },
  cancelClassName: {
    type: String,
    required: false,
    default: ''
  },
  wrapClassName: {
    type: String,
    required: false,
    default: ''
  },
  iconClassName: {
    type: String,
    required: false,
    default: 'notifications'
  }
})
// 다국어 및 개행처리
// const conMessage = computed(() => {
//   let lang = proxy.$t(props.message)
//   lang = lang.replace(/</g, '&lt;').replace(/>/g, '&gt;')
//   lang = lang.replace(/-n-/gi, '</br>')
//   return lang
// })

// const show = () => {
//   dialog.value.show()
// }

const hide = () => {
  dialog.value.hide()
}

const onOKClick = () => {
  emit('ok')
  dialog.value.hide()
}

const onCancelClick = () => {
  emit('cancel')
  dialog.value.hide()
}
const onClickClose = () => {
  open.value = false
}

</script>

