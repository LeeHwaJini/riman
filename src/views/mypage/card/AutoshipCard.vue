<template>
  <div class="max-width-wrap pb144">
    <div class="main-title-area mo-title-visible-area">
      <h3 class="bold primary09-color">정기구매 카드관리</h3>
    </div>

    <span class="block font-12 gray04-color">*정기구매 결제카드는 리만페이에 등록된 카드와 다릅니다.<br />&nbsp;정기구매 결제는 카드만 등록할 수 있어요.</span>
    <!-- 등록된 카드리스트 -->
    <ul v-if="cardList && cardList.length > 0" class="card-list">
      <li v-for="card in cardList" :key="card.userFavoriteCardsId">
        <div class="flex align-center no-wrap">
          <i class="ico card flex-shrink0" />
          <b class="ml8 mr4 font-16 gray07-color">{{ card.issuerName }}카드</b>
          <span class="font-14 gray05-color">({{ card.cardNum }})</span>
          <!-- 정기구매 카드인 경우에만 노출 -->
          <i v-if="card.fixedTerm" class="ico riman-coin-m flex-shrink0 ml4" />
          <!-- //정기구매 카드인 경우에만 노출 -->
        </div>

        <div class="icon-btn-area">
          <i class="ico lock-g flex-shrink0 pointer" @click="onClickEdit(card)"/>
          <i class="ico delete flex-shrink0 pointer" @click="onClickDelete(card)"/>
        </div>
      </li>
    </ul>
    <!-- 등록된 카드가 없을 경우 -->
    <div v-else class="text-center mt48 pd24-16">
      <i class="ico card-g"></i>
      <b class="block font-16 gray02-color mt8">등록된 카드가 없습니다</b>
      <div class="font-12 gray02-color mt8">지금 카드를 등록해 보세요!</div>
    </div>
    <div v-if="cardList && cardList.length < 10" class="bottom-btn">
      <Billing btn-class="btn full small type02" url="/mypage/autoshipCard"/>
    </div>

  </div>
</template>

<script setup>
import autoshipCardService from '@/http/services/autoshipCard'
import { useMainStore } from '@/store/mainStore'
import { getCurrentInstance, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()
const { proxy } = getCurrentInstance()
const mainStore = useMainStore()
const { data: cardList } = autoshipCardService.getAutoshipCardList()
const deleteCard = autoshipCardService.deleteCard()
const billing = ref(route.query.billing)
const userFavoriteCardsId = ref(route.query.userFavoriteCardsId)

/**
 *
 * @param userFavoriteCardsId
 * @param {'addCard' | 'chngePasswd' | 'resetPasswd'} changeType
 */
function openCardPwdModal(changeType, card) {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: 'CardPasswordInitModal', // 필수
      modeless: false,
      componentProps: {
        card,
        changeType
      } // 선택
    })
}
const onClickEdit = async (card) => {
  const chanegType = await checkCardStatus(card)
  openCardPwdModal(chanegType, card)
}

const onClickDelete = (card) => {
  proxy.$confirm(`선택하신 카드(${card.issuerName}카드 ${card.cardNum})를삭제하시겠습니까?`, {
    title: '',
    ok: () => doDelete(card.userFavoriteCardsId),
    okLabel: '삭제하기',
    cancelLabel: '취소'
  })
}
async function checkRouterQueryCardStatus() {
  const cardStatus = await autoshipCardService.getCardPassStatus(mainStore.userInfo.userSeqNo, userFavoriteCardsId.value)
  if (cardStatus) {
    if (!cardStatus.data) {
      openCardPwdModal('addCard')
    }
  } else {
    router.replace('/mypage/autoshipCard')
  }
}
function doDelete(userFavoriteCardsId) {
  deleteCard.mutate(userFavoriteCardsId)
}
async function checkCardStatus(card) {
  const cardStatus = await autoshipCardService.getCardPassStatus(card.userId, card.userFavoriteCardsId)
  if (cardStatus) {
    const data = cardStatus.data
    if (data) {
      if (data.lock) {
        return 'resetPasswd'
      } else {
        return 'chngePasswd'
      }
    } else {
      return 'addCard'
    }
  } else {
    return 'resetPasswd'
  }
}
function getCardStatus() {
  if (userFavoriteCardsId.value !== '') {
    if (billing.value === 'success') {
      checkRouterQueryCardStatus()
    } else if (billing.value === 'fail') {
      proxy.$alert('카드정보가 유효하지 않습니다. 카드 등록에 실패하였습니다. ', {
        ok: () => router.replace('/mypage/autoshipCard')
      })
    }
  }
}

onMounted(() => {
  getCardStatus()
})
</script>
