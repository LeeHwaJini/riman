<template>
  <q-expansion-item v-model="open">
    <template #header>
      <q-item-section class="left-area">
        결제수단 등록
      </q-item-section>

      <q-item-section side class="right-area" />
    </template>

    <q-card class="plr16 pb24">

      <!-- 결제 예정일이 있을 경우에만 노출 -->
      <div v-if="1" class="mb16">
        <div class="primary09-color font-16 medium mb10">다음 결제 예정일은 <b>2024년 05월 23일</b> 입니다.</div>
        <span class="font-12 gray03-color">*결제일은 2~25일 내 지정할 수 있습니다.</span>
      </div>
      <!-- //결제 예정일이 있을 경우에만 노출 -->

      <div class="flex align-center justify-center gap16 mb16">
        <i class="ico date-n"></i>
        <span class="font-14 primary09-color">매월</span>

        <div class="flex align-center gap8">
          <RSelectBox
            v-model="payDate"
            placeholder-text="DD"
            :options="selectOptions"
            :disable="false"
            class="select-box type04 small"
          />
          <span class="font-14 primary09-color">일</span>
        </div>
      </div>

      <span class="font-12 block gray04-color mb16">*정기구매 결제카드는 리만페이에 등록된 카드와 다릅니다.<br>&nbsp; 정기구매 결제는 카드만 등록할 수 있어요.</span>
      <template v-if="cardList && cardList.length > 0">
        <ul class="card-list payment-card-list">
          <li v-for="card in cardList.slice(0, 3)" :key="card.userFavoriteCardsId" :class="{active: selectedCard && selectedCard.userFavoriteCardsId === card.userFavoriteCardsId}" @click="() => onSelectCard(card)">
            <div>
              <div class="flex align-center gap4 no-wrap">
                <i class="ico card flex-shrink0" />
                <div class="font-16 ml4">{{ card.issuerName }}카드</div>
                <div class="font-14 gray05-color">({{ card.cardNum }})</div>
                <i v-if="card.fixedTerm" class="ico riman-coin-m flex-shrink0" />
              </div>

              <i v-if="selectedCard && selectedCard.userFavoriteCardsId === card.userFavoriteCardsId" class="ico check-bg-m flex-shrink0" />
              <div v-else class="icon-btn-area">
                <i class="ico delete flex-shrink0 pointer" @click="onClickDelete(card)"/>
              </div>
            </div>
          </li>
        </ul>
        <q-slide-transition>
          <ul v-if="visibleCard" class="card-list payment-card-list">
            <li v-for="card in cardList.slice(3)" :key="card.userFavoriteCardsId" :class="{active: selectedCard && selectedCard.userFavoriteCardsId === card.userFavoriteCardsId}" @click="() => onSelectCard(card)">
              <div>
                <div class="flex align-center gap4 no-wrap">
                  <i class="ico card flex-shrink0" />
                  <div class="font-16 ml4">{{ card.issuerName }}카드</div>
                  <div class="font-14 gray05-color">({{ card.cardNum }})</div>
                  <i class="ico riman-coin-m flex-shrink0" />
                </div>

                <i v-if="selectedCard && selectedCard.userFavoriteCardsId === card.userFavoriteCardsId" class="ico check-bg-m flex-shrink0" />
                <div v-else class="icon-btn-area">
                  <i class="ico delete flex-shrink0 pointer" @click="onClickDelete(card)"/>
                </div>
              </div>
            </li>
          </ul>
        </q-slide-transition>
      </template>
      <div v-if="cardList && cardList.length < 10">
        <!-- <Billing btn-class="btn full type22 mt8" url="/autoship/init"/> -->
      </div>
      <div
        v-if="cardList && cardList.length > 3"
        class="delivery-order-list-area mt16"
        @click="visibleCard = !visibleCard"
      >
        <div class="order-count-text-area gap4">등록한 결제수단 더보기<i class="ico arrow-top-type02-b drop-down-icon" :class="{'rotate':visibleCard}" /></div>
      </div>
    </q-card>
  </q-expansion-item>
</template>

<script setup>
import autoshipCardService from '@/http/services/autoshipCard'
import { computed, getCurrentInstance, ref, watch } from 'vue'
const visibleCard = ref(false)
const open = ref(true)
const { proxy } = getCurrentInstance()
const selectedCard = ref()
const payDate = defineModel({
  type: Number,
  default: null
})
const emit = defineEmits(['addCard'])
const selectOptions = computed(() => {
  const options = []
  for (let i = 2; i <= 25; i++) {
    let label = i.toString()
    if (i <= 9) {
      label = label.padStart(2, '0')
    }
    const option = {
      label,
      value: i
    }
    options.push(option)
  }
  return options
})
const { data: cardList } = autoshipCardService.getAutoshipCardList()
const deleteCard = autoshipCardService.deleteCard()
const onSelectCard = (card) => {
  selectedCard.value = card
  console.log(card, 'onselect')

  emit('addCard', card)
}
const onClickDelete = (card) => {
  proxy.$confirm(`선택하신 카드(${card.issuerName}카드 ${card.cardNum})를삭제하시겠습니까?`, {
    title: '',
    ok: () => doDelete(card.userFavoriteCardsId),
    okLabel: '삭제하기',
    cancelLabel: '취소'
  })
}
function doDelete(userFavoriteCardsId) {
  deleteCard.mutate(userFavoriteCardsId)
}
</script>

<style lang="scss" scoped>

</style>
