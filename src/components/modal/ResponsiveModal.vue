<!--
  반응형 modal ( pc: 화면 가운데 출력, tablet: 화면 하단 출력)
  create by jhchoi
-->

<template>
  <q-dialog
    ref="modal"
    :position="position"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    :no-backdrop-dismiss="isSetBackDrop"
    no-shake
    class="order-get-modal"
    :class="wrapClass"
  >
    <layout-modal
      ref="layoutModal"
    >
      <template #top>
        <slot name="top"/>
      </template>

      <!-- 팝업 내용 -->
      <template #body>
        <div class="btn mo-slide-btn text-center"><span class="slide-icon" @click="hide"></span></div>
        <div class="title-top-area">
          <h4>{{ title }}</h4>
          <button class="menu-close-btn" @click="hide">
            <i class="ico close" />
          </button>
        </div>
        <slot name="description"/>

        <!-- 환불계좌 modal-->

        <component
          :is="contentComponent"
          :page-state="pageState"
          :read-only="props.readOnly"
          :on-update="props.onUpdate"
          @hide="hide" />
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, computed, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  contentComponent: {
    type: String,
    default: ''
  },
  wrapClass: {
    type: String,
    default: ''
  },
  pageState: {
    type: Object,
    default: null
  },
  readOnly: {
    type: Boolean,
    default: false
  },
  onUpdate: {
    type: Function,
    default: () => {}
  }
})
const { proxy } = getCurrentInstance()
const modal = ref()
const position = ref('standard')
const isMobile = computed(() => proxy.$isTablet())
const isSetBackDrop = ref(false)

// 팝업 Hide 호출
const hide = () => {
  modal.value.hide()
}

const show = () => {
  handleResize()
  modal.value.show()
}
const handleResize = () => {
  if (isMobile.value) {
    position.value = 'bottom'
    isSetBackDrop.value = false
  } else {
    position.value = 'standard'
    isSetBackDrop.value = true
  }
}

onMounted(() => {
  window.addEventListener('closeModal', hide)
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('closeModal', hide)
  window.removeEventListener('resize', handleResize)
})

defineExpose({
  show,
  hide
})
</script>
