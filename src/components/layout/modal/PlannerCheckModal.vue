<template>
  <q-dialog
    ref="modal"
    :position="position"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    class="planner-check-modal"
  >
    <!-- delivery-list-modal  -->
    <layout-modal
      ref="layoutModal"
    >
      <template #body>
        <div class="mb16 text-center bold font-16 gray07-color">{{ $t('CHP_CheckPlanner') }}</div>
        <div class="form-area type02">
          <div class="field">
            <span class="gray07-color font-14 bold">{{ $t('CM_UserNumber') }}</span>
            <input v-model.trim="form.userNumber" :placeholder="$t('CHP_InputNumber')" class="input-text"/>
          </div>
          <div class="field">
            <span class="gray07-color font-14 bold">{{ $t('CHP_UserName') }}</span>
            <input v-model.trim="form.userName" :placeholder="$t('USR_ValidName')" class="input-text"/>
            <template v-if="userStatus">
              <span v-if="userStatus === 'exist'" class="font-12 success04-color ml56 mt2 regular">{{ $t('CHP_ActivePlanner') }}</span>
              <span v-else class="font-12 error-color ml56 mt2 regular">{{ $t('CHP_NonActivePlanner') }}</span>
            </template>

          </div>
        </div>

        <div class="flex-btn-area mt24">
          <RButton class="btn full small type03 radius2" :label="$t('CM_Cancel')" @click="onCancel" />
          <RButton class="btn full small type02 radius2" :label="$t('CM_Ok')" @click="onSearch" />
        </div>
      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>

import memberService from '@/http/services/member'
import { reactive, ref } from 'vue'
const userStatus = ref(null)
const form = reactive({
  userNumber: '',
  userName: ''
})
const modal = ref()
const onCancel = () => {
  modal.value.hide()
}
const onSearch = async () => {
  if (form.userNumber === '' || form.userName === '') return
  const res = await memberService.postPlannerCheck(form)
  if (res) {
    if (res.data.userId && res.data.userStatus.code === 'ACTIVATED') {
      userStatus.value = 'exist'
    } else {
      userStatus.value = 'nonExist'
    }
  } else {
    userStatus.value = 'nonExist'
  }
}
</script>
