<!--
fileupload 팝업
create by hbkang (2022-07-04)
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
    @hide="hide"
  >
    <layout-modal
      ref="layoutModal"
      :title="modalTitle"
      :move-able="true"
      class="layer layer--memo"
      width="450px"
      :disabled-close-button="true"
      :footer-btn="footerButtons"
      @action1-evt="onClickRegist"
      @action2-evt="onClickComment"
      @action3-evt="onClickCancel"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <div class="memo-fixed">
          <q-checkbox
            v-if="props.type==MemoModalType.MEMO_REGIST"
            v-model="fixed"
            :label="$t('UTI_FixTop')"
          />
        </div>
        <div style="">
          <q-input
            v-model="inputValue"
            :readonly="isMemberDetail"
            type="textarea"
          />
        </div>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import { ref, getCurrentInstance, computed, onMounted, defineProps } from 'vue'
import http from '@/utils/http'
import { MemoModalType } from '@/helpers/enum'
import { useMainStore } from '@store/mainStore'

const { proxy } = getCurrentInstance()
const emit = defineEmits(['ok', 'cancel'])

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  memberMemoId: {
    type: Number,
    default: null
  },
  userId: {
    type: Number,
    default: 0
  },
  isMemberDetail: {
    type: Boolean,
    default: false
  }
})

const modal = ref()
const inputValue = ref('')
const fixed = ref(false)

const onClickRegist = async () => {
  if (inputValue.value === '') {
    proxy.$alert(proxy.$t('INQ_AlertMemo'))
  } else {
    proxy.$confirm(proxy.$t('INQ_ConfirmRegistMemo'),
      {
        title: proxy.$t('UTI_AddMemo'),
        okLabel: proxy.$t('CM_Confirm'),
        cancelLabel: proxy.$t('CM_Cancel'),
        ok: async () => {
          try {
            const memoForm = {}
            memoForm.userId = props.userId
            memoForm.createdUserDepartment = useMainStore().userInfo.employee_department
            memoForm.memberMemoContent = inputValue.value
            memoForm.fixed = fixed.value
            await http().url(`/etc/v1/membermemo`).param(memoForm).post()
            // 커스텀 이벤트 발생 memo.vue getMemoDetail() 업데이트 위한 emit
            proxy.$emit('registComplete')
            emit('ok')
            modalHide()
          } catch (error) {
            console.log(error)
          }
        },
        cancel: () => {
          modalHide()
        }
      })
  }
}

const onClickComment = async () => {
  if (props.type === 'commentRegist') {
    if (inputValue.value === '') {
      proxy.$alert(proxy.$t('ALT_InsertContent'))
    } else {
      try {
        const memoForm = {}
        memoForm.createdUserDepartment = useMainStore().userInfo.employee_department
        memoForm.memberMemoId = props.memberMemoId
        memoForm.memberMemoCommentContent = inputValue.value
        await http().url(`/etc/v1/membermemo/comment`).param(memoForm).post()
        // 커스텀 이벤트 발생 memo.vue getMemoDetail() 업데이트 위한 emit
        proxy.$emit('registComplete')
        emit('ok')
        modalHide()
      } catch (error) {
        console.log(error)
      }
    }
  } else {
    onClickCancel()
  }
}

// 조건에 따라 푸터 버튼 목록 변경
const footerButtons = computed(() => {
  switch (props.type) {
    case MemoModalType.MEMO_REGIST:
      return [
        { type: 'action1', label: 'CM_Add', class: 'button button--success' },
        { type: 'action3', label: 'CM_Cancel', class: 'button button--cancel' }
      ]
    case MemoModalType.COMMENT_REGIST:
      return [
        { type: 'action2', label: 'UTI_Comment', class: 'button button--lightgray' },
        { type: 'action3', label: 'CM_Cancel', class: 'button button--cancel' }
      ]
    case MemoModalType.MEMO_DETAIL:
      return [
        { type: 'action3', label: 'CM_Ok', class: 'button button--cancel' }
      ]
    default:
      return [
        { type: 'action1', label: 'CM_Add', class: 'button button--success' }, // 등록 버튼
        { type: 'action2', label: 'UTI_Comment', class: 'button button--lightgray' }, // 댓글 버튼
        { type: 'action3', label: 'CM_Cancel', class: 'button button--cancel' } // 취소 버튼
      ]
  }
})

// 조건에 따라 팝업 타이틀 변경 registMemo
const title = ref({
  modalTitle: ''
})

const modalTitle = computed(() => {
  // switch (props.type) {
  //   case MemoModalType.MEMO_REGIST :
  //     return title.value.modalTitle = proxy.$t('UTI_AddMemo')
  //   case MemoModalType.COMMENT_REGIST :
  //     return title.value.modalTitle = proxy.$t('UTI_AddComment')
  //   case MemoModalType.MEMO_DETAIL:
  //     return title.value.modalTitle = proxy.$t('UTI_ViewDetail')
  // }
  return proxy.$t('CM_Memo')
})

// Cancel onClick 버튼 이벤트 처리
const onClickCancel = () => {
  emit('cancel')
  modalHide()
}

// 팝업 Hide 호출
const hide = () => {
  console.log('hide')
}

// 팝업 닫기
const modalHide = () => {
  modal.value.hide()
}

onMounted(() => {
  inputValue.value = props.content
})

</script>
