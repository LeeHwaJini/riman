<!--
LayoutModal
create by chjm (2023-06-14)
-->

<template>
  <slot name="top"/>
  <q-card :class="modalClass" :style="qCardStyle">
    <!--Header-->
    <slot v-if="!!title" name="top">
      <q-bar>
        <div>{{ title }}</div>
        <q-space />
        <q-btn v-close-popup dense flat icon="close">
          <q-tooltip>{{ $t('CM_Close') }}</q-tooltip>
        </q-btn>
      </q-bar>
    </slot>
    <!--Body-->
    <slot name="body"/>

    <!--Footer-->
    <slot name="bottom">
      <q-card-actions v-if="footerBtn.length > 0" align="center">
        <RButton
          v-for="btn in footerBtnList"
          :key="btn.type"
          :label="$t(btn.label)"
          :disable="btn.disable || false"
          :class="btn.class !== undefined ? btn.class : 'button'"
          @click="onFooterEvent(btn)"/>
        <!--q-btn
          v-for="btn in footerBtnList"
          :key="btn.type"
          :label="$t(btn.label)"
          :disable="btn.disable || false"
          :class="btn.class !== undefined ? btn.class : 'button'"
          @click="onFooterEvent(btn)"
        /-->
      </q-card-actions>
    </slot>
  </q-card>
</template>

<script setup>
/**
 *
 * 템플릿 구성
 *  - v-slot:top - 상단 타이틀 영역 및 닫기 버튼
 *  - v-slot:body - contents
 *  - v-slot:bottom - 하단 ok/cancel 버튼 영역
 *
 * 속성
 *  - width : 팝업창 크기
 *  - title : 팝업 타이틀
    - footerBtn="[{type: 'action1', label: 'ok', disable: true, class: 'button'},
                  {type: 'cancel', label: 'cancel'}, // Cancel 형 버튼은 type 값이 'cancel' 로 고정임 나머지는 선택사항
                 {type: 'action3', label: 'save', class: 'button white'}
                 ]"
 *  - moveAble: 타이틀 영역을 클릭한 상태에서 팝업창 이동
 *
 * 이벤트
 *  - type명+Evt 정의 예)  @action1Evt="onClickOk"
 */

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useMainStore } from '@store/mainStore'

// const { proxy } = getCurrentInstance()
const emit = defineEmits([''])

const props = defineProps({
  // 팝업창 크기
  width: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: ''
  },
  // 팝업 타이틀
  title: {
    type: String,
    required: false,
    default: ''
  },

  // Footer 버튼 리스트
  footerBtn: {
    type: Array,
    default: () => []
  },

  // 팝업 이동
  moveAble: {
    type: Boolean,
    default: true
  },

  // 팝업창 스타일
  modalClass: {
    type: String,
    default: 'pop'
  },

  // 팝업창 상단 닫기 버튼(X) 비활성화 여부
  disabledCloseButton: {
    type: Boolean,
    default: false
  }
})

const footerBtnList = ref(null)

// 선택된 Footer 버튼 Event 처리
const onFooterEvent = (btn) => {
  emit(`${btn.type}Evt`)
}

// action2Evt에 팝업 onClickCancel 적용, 팝업 삭제시 사용
// const onClose = () => {
//   emit(`action2Evt`)
// }

// 버튼 활성화/비활성화{btn type: 활성화 여부(true, false)}
// const setDisableBtn = (btnInfo) => {
//   btnInfo.forEach((item) => {
//     proxy.footerBtn.find((btn) => {
//       if (btn.type === item.type) {
//         btn.disable = item.disable
//       }
//     })
//   })
//   footerBtnList.value = props.footerBtn
// }

const qCardStyle = computed(() => {
  return `width: ${props.width}; height: ${props.height}`
})

onMounted(() => {
  footerBtnList.value = props.footerBtn
})

onBeforeUnmount(() => {
  // 팝업 닫을 때 팝업 데이터 store에서 삭제
  useMainStore().pClose()
  footerBtnList.value = null
})

</script>

