<template>
  <q-dialog
    ref="modal"
    position="standard"
    transition-prev="slide-right"
    transition-next="slide-left"
    no-esc-dismiss
    no-backdrop-dismiss
    no-shake
    class="full-page-modal card-pwd-modal"
  >
    <layout-modal
      ref="layoutModal"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <div class="title-top-area">
          <h4>정기구매 카드관리</h4>
          <button class="menu-close-btn" @click="hide">
            <i class="ico close" />
          </button>
        </div>
        <div>
          <div class="plr16 mb24 mt32">
            <h4 v-if="firstView && props.changeType === 'addCard'" class="bold primary09-color">
              새로운 결제 비밀번호 6자리를<br/>
              등록해주세요.
            </h4>
            <h4 v-if="isCheckedChangePasswd && wrongCnt === 0" class="bold primary09-color">
              기존 비밀 번호를 입력 해 주세요
            </h4>
            <h4 v-if="firstView && props.changeType === 'chngePasswd' && wrongCnt === 0 " class="bold primary09-color">
              새로운 결제 비밀번호 6자리를<br/>
              등록해주세요.
            </h4>
            <h4 v-if="firstView && props.changeType === 'resetPasswd'" class="bold primary09-color">
              새로운 결제 비밀번호 6자리를<br/>
              등록해주세요.
            </h4>
            <h4 v-if="secondView" class="bold primary09-color">
              다시 한번 입력해 주세요
            </h4>
            <h4 v-if="isCheckedChangePasswd && wrongCnt !== 0" class="bold primary09-color">
              비밀번호가 일치 하지 않습니다 {{ ' (' + wrongCnt + '/5)' }} <br>
              다시 한번 입력해 주세요
            </h4>
            <span class="block mt12 font-14 gray03-color">※ 정기구매 카드 비밀번호는 리만페이 비밀번호와 다르게 설정할 수 있습니다.</span>
          </div>
          <div v-if="isCheckedChangePasswd" class="mycard-password__blank pwd-area">
            <span :class="isCheckedChangePasswd && changePasswd.length >= 1 ? 'active' : ''"/>
            <span :class="isCheckedChangePasswd && changePasswd.length >= 2 ? 'active' : ''"/>
            <span :class="isCheckedChangePasswd && changePasswd.length >= 3 ? 'active' : ''"/>
            <span :class="isCheckedChangePasswd && changePasswd.length >= 4 ? 'active' : ''"/>
            <span :class="isCheckedChangePasswd && changePasswd.length >= 5 ? 'active' : ''"/>
            <span :class="isCheckedChangePasswd && changePasswd.length >= 6 ? 'active' : ''"/>
          </div>
          <div v-if="firstView" class="mycard-password__blank pwd-area">
            <span :class="firstView && firstPasswd.length >= 1 ? 'active' : ''"/>
            <span :class="firstView && firstPasswd.length >= 2 ? 'active' : ''"/>
            <span :class="firstView && firstPasswd.length >= 3 ? 'active' : ''"/>
            <span :class="firstView && firstPasswd.length >= 4 ? 'active' : ''"/>
            <span :class="firstView && firstPasswd.length >= 5 ? 'active' : ''"/>
            <span :class="firstView && firstPasswd.length >= 6 ? 'active' : ''"/>
          </div>
          <div v-if="secondView" class="mycard-password__blank pwd-area">
            <span :class="secondView && secondPasswd.length >= 1 ? 'active' : ''"/>
            <span :class="secondView && secondPasswd.length >= 2 ? 'active' : ''"/>
            <span :class="secondView && secondPasswd.length >= 3 ? 'active' : ''"/>
            <span :class="secondView && secondPasswd.length >= 4 ? 'active' : ''"/>
            <span :class="secondView && secondPasswd.length >= 5 ? 'active' : ''"/>
            <span :class="secondView && secondPasswd.length >= 6 ? 'active' : ''"/>
          </div>
          <div v-if="secondView && wrongCnt !== 0" class="font-14 error-color text-center">
            비밀번호가 일치하지 않습니다. {{ ' (' + wrongCnt + '/5)' }}<br/>앞서 입력하신 비밀번호와 동일하게 입력해주세요.
          </div>
          <div v-if="isCheckedChangePasswd && wrongCnt !== 0" class="font-14 error-color text-center">
            5회 중 {{ wrongCnt }}회 틀렸습니다.
          </div>
        </div>
        <div v-if="props.changeType === 'resetPasswd' && !isCertificate" class="text-center mt32">
          <Certificate
            type="innerBtn"
            btn-class="btn medium type03 plr8"
            btn-text="비밀번호 재설정"
            @on-success="onCertSuccess"
            @on-fail="onCertFail"
          />
        </div>
        <!-- <div v-if="props.changeType === 'resetPasswd' && !isCertificate" class="text-center mt32">
          <RButton class="btn medium type03 plr8" label="비밀번호 재설정" @on-click="onCertSuccess" />
        </div> -->
        <div class="keyboard">
          <table class="keyboard__table">
            <tbody>
              <tr>
                <td @click="addPasswd(numArray[0])">
                  <RButton class="bg_transparent btn-key" :label="numArray[0]" />
                </td>
                <td @click="addPasswd(numArray[1])">
                  <RButton class="bg_transparent btn-key" :label="numArray[1]" />
                </td>
                <td @click="addPasswd(numArray[2])">
                  <RButton class="bg_transparent btn-key" :label="numArray[2]" />
                </td>
              </tr>
              <tr>
                <td @click="addPasswd(numArray[3])">
                  <RButton class="bg_transparent btn-key" :label="numArray[3]" />
                </td>
                <td @click="addPasswd(numArray[4])">
                  <RButton class="bg_transparent btn-key" :label="numArray[4]" />
                </td>
                <td @click="addPasswd(numArray[5])">
                  <RButton class="bg_transparent btn-key" :label="numArray[5]" />
                </td>
              </tr>
              <tr>
                <td @click="addPasswd(numArray[6])">
                  <RButton class="bg_transparent btn-key" :label="numArray[6]" />
                </td>
                <td @click="addPasswd(numArray[7])">
                  <RButton class="bg_transparent btn-key" :label="numArray[7]" />
                </td>
                <td @click="addPasswd(numArray[8])">
                  <RButton class="bg_transparent btn-key" :label="numArray[8]" />
                </td>
              </tr>
              <tr>
                <td @click="deletePasswd('clear')">
                  <RButton class="bg_transparent btn-keyclose" @on-click="makePasswd">
                    <template #content>
                      <i class="ico reset-light-b" />
                    </template>
                  </RButton>
                </td>
                <td @click="addPasswd(numArray[9])">
                  <RButton class="bg_transparent btn-key" :label="numArray[9]" />
                </td>
                <td>
                  <RButton class="bg_transparent btn-backspace" @on-click="deletePasswd">
                    <template #content>
                      <i class="ico arrow-left-light-b" />
                    </template>
                  </RButton>
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </template>
    </layout-modal>
  </q-dialog>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref, watch } from 'vue'
import autoshipCardService from '@/http/services/autoshipCard'
import { useRoute, useRouter } from 'vue-router'

const { proxy } = getCurrentInstance()
const modal = ref(null)
// const emit = defineEmits(['closePasswordModal'])
const changePasswd = ref([])
const firstPasswd = ref([])
const secondPasswd = ref([])
const numArray = ref([])
let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const firstView = ref(true)
const secondView = ref(false)
const isCheckedChangePasswd = ref(false)
const wrongCnt = ref(0)
const route = useRoute()
const router = useRouter()
const isCertificate = ref(false)
const props = defineProps({
  changeType: {
    type: String,
    default: ''
  },
  card: {
    type: Object,
    default: null
  },
  beforeUrl: {
    type: String,
    default: '/mypage/autoshipCard'
  }
})
const emit = defineEmits(['ok'])
const onCertSuccess = (data) => {
  isCertificate.value = true
}
const onCertFail = () => {

}
function makePasswd() {
  numArray.value = []
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  while (numArray.value.length < 10) {
    const cursor = parseInt(Math.random() * 10)
    if (cursor < 10 && numbers[cursor] !== -1) {
      numArray.value.push(numbers[cursor])
      numbers[cursor] = -1
    }
    if (numbers.filter(_num => _num === -1).length === 10) break
  }
}
function checkChangePasswd() {
  // 랜덤 키패드 배치
  makePasswd()
  firstView.value = true
  secondView.value = false
  isCheckedChangePasswd.value = false
  if (props.changeType === 'chngePasswd') {
    isCheckedChangePasswd.value = true
    firstView.value = false
  }
}
function addPasswd(val) {
  if (firstView.value) {
    if (firstPasswd.value.length !== 6) {
      firstPasswd.value += val
      checkPasswd()
    }
  } else if (secondView.value) {
    if (secondPasswd.value.length !== 6) {
      secondPasswd.value += val
      checkPasswd()
    }
  } else if (isCheckedChangePasswd.value) {
    if (changePasswd.value.length !== 6) {
      changePasswd.value += val
      checkPasswd()
    }
  }
}
async function checkPasswd() {
  if (!isCheckedChangePasswd.value) {
    if (firstView.value && firstPasswd.value.length === 6) {
      if (props.changeType === 'resetPasswd') {
        if (!isCertificate.value) {
          proxy.$alert('카드 비밀번호를 5회 이상 틀려 계정이 잠겼어요.<br>비밀번호 재설정을 진행해 주세요.')
          firstPasswd.value = []
          return
        }
      }
      firstView.value = false
      secondView.value = true
    } else if (secondView.value && secondPasswd.value.length === 6) {
      if (firstPasswd.value === secondPasswd.value) {
        wrongCnt.value = 0
        success()
      } else if (wrongCnt.value === 4) {
        await proxy.$alert('비밀번호와 비밀번호 확인이 일치하지 않습니다.\n 비밀번호를 다시 입력해 주세요')
        init()
      } else {
        wrongCnt.value += 1
        secondPasswd.value = []
      }
    }
    // 비밀 번호 변경 시
  } else if (isCheckedChangePasswd.value) {
    if (changePasswd.value.length === 6) {
      _checkCardPasswd()
    } else if (secondPasswd.value.length === 6) {
      if (changePasswd.value === secondPasswd.value) {
        wrongCnt.value = 0
        success()
      } else {
        wrongCnt.value += 1
        secondPasswd.value = []
      }
    }
  }
}
function deletePasswd(val) {
  if (!isCheckedChangePasswd.value) {
    if (firstView.value) {
      if (val === 'clear') {
        firstPasswd.value = []
      } else {
        firstPasswd.value = firstPasswd.value.slice(0, firstPasswd.value.length - 1)
      }
    } else if (secondView.value) {
      if (val === 'clear') {
        secondPasswd.value = []
      } else {
        secondPasswd.value = secondPasswd.value.slice(0, secondPasswd.value.length - 1)
      }
    }
  } else if (isCheckedChangePasswd.value) {
    if (!firstView.value) {
      if (val === 'clear') {
        changePasswd.value = []
      } else {
        changePasswd.value = changePasswd.value.slice(0, changePasswd.value.length - 1)
      }
    } else if (firstView.value) {
      if (val === 'clear') {
        firstPasswd.value = []
      } else {
        firstPasswd.value = firstPasswd.value.slice(0, firstPasswd.value.length - 1)
      }
    } else if (secondView.value) {
      if (val === 'clear') {
        secondPasswd.value = []
      } else {
        secondPasswd.value = secondPasswd.value.slice(0, secondPasswd.value.length - 1)
      }
    }
  }
}

async function _checkCardPasswd() {
  const param = {
    userFavoriteCardsId: props.card.userFavoriteCardsId,
    orderPassword: changePasswd.value
  }
  const res = await autoshipCardService.postCardPassMatch(props.card.userId, param)
  if (res) {
    if (res.data.match) {
      isCheckedChangePasswd.value = false
      firstView.value = true
      wrongCnt.value = 0
    } else {
      wrongCnt.value = Number(res.data.failCount)
      changePasswd.value = []
    }
  } else {
    modal.value.hide()
  }
}

// Info Alert
async function success() {
  if (props.changeType === 'addCard') {
    const param = {
      userFavoriteCardsId: props.card.userFavoriteCardsId,
      orderPassword: secondPasswd.value
    }
    const res = await autoshipCardService.postCardPass(props.card.userId, param)
    if (res) {
      if (res.data) {
        await proxy.$alert('결제 비밀번호가 등록 되었습니다.', {
          ok: () => {
            modal.value.hide()
            emit('ok')
          }
        })
      } else {
        modal.value.hide()
      }
    } else {
      modal.value.hide()
    }
  } else if (props.changeType === 'chngePasswd') {
    const param = {
      userFavoriteCardsId: props.card.userFavoriteCardsId,
      oldOrderPassword: changePasswd.value,
      newOrderPassword: secondPasswd.value
    }
    const res = await autoshipCardService.putCardPassChange(props.card.userId, param)
    if (res) {
      if (res.message === 'OK') {
        await proxy.$alert('결제 비밀번호가 변경 되었습니다.')
        modal.value.hide()
      } else {
        modal.value.hide()
      }
    } else {
      init()
    }
  } else if (props.changeType === 'resetPasswd') {
    const param = {
      userFavoriteCardsId: props.card.userFavoriteCardsId,
      orderPassword: secondPasswd.value
    }
    const res = await autoshipCardService.putCardPassReset(props.card.userId, param)
    if (res) {
      await proxy.$alert('결제 비밀번호가 초기화 되었습니다.', {
        ok: () => {
          modal.value.hide()
          emit('ok')
        }
      })
    } else {
      init()
    }
  }
}

async function hide() {
  proxy.$confirm('결제 비밀번호 설정을 중지하시겠습니까? \n확인 시 설정이 취소 됩니다.', {
    ok: () => {
      modal.value.hide()
      if (route.query.billing !== '') {
        router.replace(props.beforeUrl)
      }
      if (route.query.userFavoriteCardsId !== '') {
        router.replace(props.beforeUrl)
      }
    }
  })
}
function init() {
  firstView.value = true
  secondView.value = false
  wrongCnt.value = 0
  secondPasswd.value = []
  firstPasswd.value = []
}
onMounted(() => {
  checkChangePasswd()
})
</script>

<style scoped lang="scss">
.modal__wrap{
  padding-left: 0;
  padding-right: 0;
  font-size: 14px;
  font-weight: 300;
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
  overflow: hidden;
}
.mycard-password {
    text-align: center;
}

.mycard-password__title {
    font-size: 18px;
    font-weight: 500;
}

.mycard-password__blank {
    margin-top: 20px;

    span {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin: 0 5px;
      border-radius: 50%;
      background: #d3d3d3;
    }

    span.active {
      background: #4D4E4D;
    }
}

.modal-password .keyboard {
    position: static;
    margin-top: 40px;
    margin-left: -20px;
    margin-right: -20px;
    margin-bottom: -16px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
}
.keyboard {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: #123250;
    box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.15);
    z-index: 50;
}
.keyboard__close {
    padding: 5px 20px;
    background: #718496;
    text-align: right;
}
.btn-keyclose {
    font-size: 12px;
    color: #fff;
    vertical-align: middle;
}

.keyboard__table {
    table-layout: fixed;
    width: 100%;
    border-spacing: 0;
    text-align: center;
}
.keyboard__table td:first-child {
    border-left: none;
}
.keyboard__table td {
    padding: 12px;
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.btn-key {
    font-size: 18px;
    font-weight: 500;
    color: #fff;
}

.btn-backspace img {
    height: 26px;
}

</style>

