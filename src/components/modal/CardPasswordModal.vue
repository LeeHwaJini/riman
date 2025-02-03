<!--
약관 팝업
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
    class="full-page-modal card-pwd-modal"
  >
    <layout-modal
      ref="layoutModal"
      @hide="hide"
    >
      <!-- 팝업 내용 -->
      <template #body>
        <div class="title-top-area">
          <h4>비밀번호 입력</h4>
          <button class="menu-close-btn" @click="hide">
            <i class="ico close" />
          </button>
        </div>

        <div>
          <div class="plr16 mb24 mt32">
            <h4 class="bold primary09-color">
              정기구매 카드 결제 비밀번호 6자리를<br/>
              입력해주세요.
            </h4>

            <span class="block mt12 font-14 gray03-color">정기구매 카드 비밀번호는 리만페이 비밀번호와 다르게 설정할 수 있습니다.</span>
          </div>

          <div class="mycard-password__blank pwd-area">
            <span :class="paymentPasswd.length >= 1 ? 'active' : ''"/>
            <span :class="paymentPasswd.length >= 2 ? 'active' : ''"/>
            <span :class="paymentPasswd.length >= 3 ? 'active' : ''"/>
            <span :class="paymentPasswd.length >= 4 ? 'active' : ''"/>
            <span :class="paymentPasswd.length >= 5 ? 'active' : ''"/>
            <span :class="paymentPasswd.length >= 6 ? 'active' : ''"/>
          </div>

          <div v-if="wrongCnt !== 0" class="font-14 error-color text-center">
            비밀번호가 일치하지 않습니다. {{ ' (' + wrongCnt + '/5)' }}<br/>앞서 입력하신 비밀번호와 동일하게 입력해주세요.
          </div>

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
                  <td @click="clear('clear')">
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
                    <RButton class="bg_transparent btn-backspace" @on-click="clear">
                      <template #content>
                        <i class="ico arrow-left-light-b" />
                      </template>
                    </RButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>

      </template>
    </layout-modal>
  </q-dialog>
</template>

<script setup>
import autoshipCardService from '@/http/services/autoshipCard'
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
  },
  card: {
    type: Object,
    default: null
  }
})

const modal = ref()

const numArray = ref([])
const paymentPasswd = ref([])
const wrongCnt = ref(0)
let numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const emit = defineEmits('ok')

// 팝업 Hide 호출
const hide = () => {
  modal.value.hide()
}

const show = () => {
  init()
}

const init = async () => {
  paymentPasswd.value = []
  const userNowInfo = []
  if (userNowInfo.lock) {
    this.hide()
  }
}
const makePasswd = () => {
  numArray.value = []
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  // 랜덤 키패드 배치
  while (numArray.value.length < 10) {
    const cursor = parseInt(Math.random() * 10)
    if (cursor < 10 && numbers[cursor] !== -1) {
      numArray.value.push(numbers[cursor])
      numbers[cursor] = -1
    }
    if (numbers.filter(_num => _num === -1).length === 10) break
  }
}

const addPasswd = (val) => {
  if (paymentPasswd.value.length !== 6) {
    paymentPasswd.value += val
    if (paymentPasswd.value.length === 6) {
      checkPasswd()
    }
  }
}

const checkPasswd = async () => {
  const param = {
    userFavoriteCardsId: props.card.userFavoriteCardsId,
    orderPassword: paymentPasswd.value
  }
  const res = await autoshipCardService.postCardPassMatch(props.card.userId, param)
  if (res) {
    if (res.data.match) {
      emit('ok')
    } else {
      wrongCnt.value = Number(res.data.failCount)
      paymentPasswd.value = []
    }
  } else {
    modal.value.hide()
  }
}

const clear = (val) => {
  if (val === 'clear') {
    paymentPasswd.value = []
  } else {
    paymentPasswd.value = paymentPasswd.value.slice(0, paymentPasswd.value.length - 1)
  }
}
onMounted(() => {
  makePasswd()
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
