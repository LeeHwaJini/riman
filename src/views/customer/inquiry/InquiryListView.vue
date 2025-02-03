<template>
  <div class="max-width-wrap full-width-wrap inquiry-wrap pb144">
    <div class="main-title-area">
      <h3 class="">{{ $t("CS_MyInquiry") }}</h3>
    </div>

    <ul class="tab type06 inquiry">
      <li
        v-for="cate in inquiryCateList"
        :key="cate.value"
        :class="{ active: cate.value === inquiryCate }"
        @click="inquiryCate = cate.value"
      >
        {{ cate.label }}
      </li>
    </ul>

    <div class="inquiry-filter-area">
      <div class="text-area">
        <b>{{ $t("CS_MyInquiry") }}</b>
        <span>({{ queryListData?.numberOfElements }})</span>
      </div>

      <RSelectBox
        v-model="param.sortType"
        :options="sortOptions"
        :disable="false"
        class="select-box type01 w-fit-content"
        popup-content-class="select-list type03 small"
      />
    </div>
    <template v-if="queryListData && queryListData.content.length > 0">
      <ul class="border-bottom-list">
        <li v-for="item in queryListData.content" :key="item.inquiryId">
          <div class="text-area">
            <span
              v-if="item.inquiryStatusType.code === 'COMPLETED'"
              class="font-12 success04-color"
              >{{ $t("CS_AnswerFinish") }}</span
            >
            <span v-else class="font-12 error-color">{{
              $t("CS_AnswerPending")
            }}</span>
            <div
              class="content-text"
              @click="router.push(`detail/${item.inquiryId}`)"
            >
              {{ item.inquiryTitle }}
            </div>
            <span class="date-text">{{ item.questionDateTime }}</span>
          </div>
          <i class="ico arrow-right-light-g" />
        </li>
      </ul>

      <Pagination
        v-model:page-info="pageInfo"
        class-name="pagenation type03 mt-pc48-mo24"
        :is-more-btn="false"
      />
      <div class="bottom-btn">
        <RButton
          class="btn full small type02"
          :label="$t('CS_DoInquiryP2P')"
          @on-click="$router.push('/customer/inquiry')"
        />
      </div>
    </template>

    <!-- 데이터 없을 경우 -->
    <template v-else>
      <div class="cart-none-area">
        <img src="@assets/images/cart_none.svg" alt="" />
        <p class="title">{{ $t("CS_EmptyInquiry") }}</p>
        <p class="text">{{ $t("CS_NeedHelp") }}</p>

        <RButton
          :label="$t('CS_DoInquiryP2P')"
          class="btn medium type03"
          @click="$router.push('/customer/inquiry')"
        />
      </div>
      <!-- //데이터 없을 경우 -->
    </template>
  </div>
</template>

<script setup>
import customerService from "@/http/services/customer";
import {
  onMounted,
  ref,
  reactive,
  computed,
  getCurrentInstance,
  watch,
} from "vue";
import { useRouter } from "vue-router";

const { proxy } = getCurrentInstance();
const inquiryCateList = computed(() => [
  {
    label: proxy.$t("CS_NormalInquiry"),
    value: "normal",
  },
  {
    label: proxy.$t("CS_OrderInquiry"),
    value: "order",
  },
]);
const inquiryCate = ref("normal");
const router = useRouter();
const sortOptions = computed(() => [
  { label: proxy.$t("CM_Newest"), value: "NEWEST" },
  { label: proxy.$t("CM_Oldest"), value: "OLDEST" },
  { label: proxy.$t("CS_AnswerPending"), value: "WAITING" },
  { label: proxy.$t("CS_AnswerFinish"), value: "COMPLETE" },
]);
const pageInfo = reactive({
  pageSize: 10,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0,
  maxPagination: 5,
});
const param = reactive({
  pageSize: computed(() => pageInfo.pageSize),
  pageNumber: computed(() => pageInfo.pageNumber),
  isOrder: computed(() => inquiryCate.value === "order"),
  sortType: "NEWEST",
});
const { data: queryListData } = customerService.getInquiryList(param);

onMounted(() => {
  if (queryListData.value) {
    pageInfo.totalPageNumber = queryListData.value.totalPages;
    pageInfo.totalSize = queryListData.value.totalElements;
  }
});
watch(queryListData, (v) => {
  if (v) {
    pageInfo.totalPageNumber = v.totalPages;
    pageInfo.totalSize = v.totalElements;
  }
});
</script>
