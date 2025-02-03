<template>
  <div>
    <section>
      <h3 class="box__title">기본정보</h3>
      <div class="box__wrap box__wrap--offset">
        <div class="box-item">
          <div class="item item--full">
            <RInput
              v-model="userName"
              class="input input--noborder"
              readonly
              label="소비자명"
              stack-label
            />
          </div>
          <div class="item item--full">
            <RInput
              v-model="belongStoreName"
              class="input input--noborder"
              readonly
              label="소속 판매점"
              stack-label
            />
          </div>
          <div class="item item--full">
            <RInput
              v-model="status.text"
              class="input input--noborder"
              readonly
              label="상태"
              stack-label
            />
          </div>
          <div class="item item--full">
            <RInput
              v-model="grade.text"
              class="input input--noborder"
              readonly
              label="직급"
              stack-label
            />
          </div>
        </div>
      </div>
      <div class="box__wrap box__wrap--offset">
        <div class="box-item">
          <div class="item item--full">
            <RInput
              v-model="gender.text"
              class="input input--noborder"
              readonly
              label="성별"
              stack-label
            />
          </div>
          <div class="item item--full">
            <RInput
              v-model="birthDate"
              class="input input--noborder"
              readonly
              label="생년월일"
              stack-label
            />
          </div>
          <div class="item item--full">
            <RInput
              v-model="email"
              class="input input--noborder"
              readonly
              label="이메일"
              stack-label
            />
          </div>
          <div class="item item--full">
            <RInput
              v-model="mobileNumber"
              class="input input--noborder"
              readonly
              label="휴대폰 번호"
              stack-label
            />
          </div>
        </div>
      </div>

      <div class="box__wrap box__wrap--offset">
        <div class="box-item">

          <div class="item item--full">
            <RInput
              v-model="joinDate"
              class="input input--noborder"
              readonly
              label="가입일자"
              stack-label
            />
          </div>
          <div class="item item--full">
            <RInput
              v-model="deleteDate"
              class="input input--noborder"
              readonly
              label="탈퇴일자"
              stack-label
            />
          </div>
          <div class="item item--full">
            <RInput
              v-model="marketingAgreeDate"
              class="input input--noborder"
              readonly
              label="마케팅동의"
              stack-label
            />
          </div>
          <div class="item item--full">
            <RInput
              v-model="rejoinDate"
              class="input input--noborder"
              readonly
              label="재가입가능일"
              stack-label
            />
          </div>
        </div>
      </div>

      <!-- 주소 -->
      <AddressInput
        v-model:addrInfo="address"
        :class="_calss"
        :readonly="modifyMod"
      />

      <h3 class="box__title">상위정보</h3>
      <div class="box__wrap box__wrap--offset">
        <div class="box-item">
          <div class="item item--4">
            <RInput
              v-model="belongInfo"
              class="input input--noborder"
              readonly
              label="직상위"
              stack-label
            />
          </div>
          <div class="item item--4">
            <RInput
              v-model="belongDetailInfo.belongBranchName"
              class="input input--noborder"
              readonly
              label="교육시행사"
              stack-label
            />
          </div>
          <div class="item item--4">
            <RInput
              v-model="belongDetailInfo.belongCenterName"
              class="input input--noborder"
              readonly
              label="교육컨설팅"
              stack-label
            />
          </div>
        </div>
      </div>

      <div class="box__wrap box__wrap--offset">
        <div class="box-item">
          <div class="item item--full"/>
          <RButton
            v-if="!modifyMod"
            class="bg_mint"
            label="변경저장"
            @click="updateConsumerInfo"
          />
          <RButton
            v-if="!modifyMod"
            class="bg_gray"
            label="취소"
            @click="changeMod"
          />
          <RButton
            v-if="modifyMod"
            class="bg_mint"
            label="수정"
            @click="changeMod"
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, onMounted, getCurrentInstance, computed } from 'vue'
import http from '@utils/http'

const props = defineProps({
  data: {
    type: Object,
    default: null
  }
})

const { proxy } = getCurrentInstance()

const userName = ref('')
const belongStoreName = ref('')
const status = ref({ code: null, text: null })
const grade = ref({ code: null, text: null })
const gender = ref({ code: null, text: null })
const birthDate = ref('')
const email = ref('')
const mobileNumber = ref('')
const joinDate = ref('')
const deleteDate = ref('')
const marketingAgreeDate = ref('')
const rejoinDate = ref('')
const belongDetailInfo = ref({ belongBranchName: null, belongCenterName: null })
const recommenderDetailInfo = ref(null)
const belongInfo = ref('')
const address = reactive({
  address1: '',
  address2: '',
  zipCode: ''
})

const modifyMod = ref(true)
const _calss = computed(() => modifyMod.value ? 'input input--noborder' : '')

const getConsumerInfo = async () => {
  const result = await http().url(`/member-jupiter/v1/consumer/${props.data.userId}`).get()

  if (result) {
    userName.value = `${result.data.userName} (${result.data.consumerNumber})`
    belongStoreName.value = `${result.data.belongDetailInfo.belongStoreName} (${result.data.belongDetailInfo.belongStoreLoginId})`
    status.value = result.data.status
    grade.value = result.data.grade
    gender.value = result.data.gender ? result.data.gender : ''
    birthDate.value = result.data.birthDate
    email.value = result.data.email
    mobileNumber.value = result.data.mobileNumber
    joinDate.value = result.data.joinDate
    deleteDate.value = result.data.deleteDate
    marketingAgreeDate.value = result.data.marketingAgreeDate
    rejoinDate.value = result.data.rejoinDate
    address.address1 = result.data.address1 ? result.data.address1 : ''
    address.address2 = result.data.address2 ? result.data.address2 : ''
    address.zipCode = result.data.zipCode ? result.data.zipCode : ''
    belongDetailInfo.value = result.data.belongDetailInfo
    recommenderDetailInfo.value = result.data.recommenderDetailInfo

    if (result.data.belongConsumerNumber !== null) {
      belongInfo.value = `${result.data.belongDetailInfo.belongConsumerName} (${result.data.belongDetailInfo.belongConsumerNumber})`
    } else if (result.data.belongDetailInfo.belongDistLoginId !== null) {
      belongInfo.value = `${result.data.belongDetailInfo.belongDistName} (${result.data.belongDetailInfo.belongDistLoginId})`
    } else if (result.data.belongConsumerNumber === null && result.data.belongDetailInfo.belongDistLoginId === null) {
      belongInfo.value = `${result.data.belongDetailInfo.belongStoreOwnerName} (${result.data.belongDetailInfo.belongStoreLoginId})`
    } else if (result.data.belongConsumerNumber === null &&
                result.data.belongDetailInfo.belongDistLoginId === null &&
                result.data.belongDetailInfo.belongStoreLoginId === null) {
      belongInfo.value = '-'
    }
  }
}

const updateConsumerInfo = () => {
  proxy.$confirm('수정하시겠습니까?', {
    ok: async () => {
      const result = await http().url(`/member-jupiter/v1/consumer/updateConsumerInfo/${props.data.userId}`).param(address).put()

      if (result) {
        proxy.$alert('수정되었습니다.')
        getConsumerInfo()
        changeMod()
      }
    }
  })
}

const changeMod = () => {
  modifyMod.value = !modifyMod.value
}

const copyByClipBoardAPI = async (value) => {
  try {
    await navigator.clipboard.writeText(`${value}`)
    proxy.$alert('클립보드에 복사했습니다.')
  } catch (e) {
    proxy.$alert('클립보드 복사에 실패했습니다.')
  }
}

onMounted(() => {
  getConsumerInfo()
})
</script>

<style lang="scss" scoped>

</style>
