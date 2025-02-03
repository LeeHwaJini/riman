<!--
  오늘 하루만 보기
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
    class="today-only-modal"
    @show="show"
    @hide="hide"

  >
    <layout-modal
      ref="layoutModal"
      @hide="hide"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <div class="modal-content-header">
          <RCheckbox v-model="checked" >
            <span>{{ title }}</span>
          </RCheckbox>

          <RButton icon="close" class="bg_lightGray col-2" @click="hide" />
        </div>
        <img src="@assets/images/kit_img.svg" alt="" class="modal-content-img">

      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { reactive } from 'vue'
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

const checked = ref(false)

</script>

