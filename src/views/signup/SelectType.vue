<!--
  회원가입 > 메인
-->
<template>
  <div class="signup-wrap max-width-wrap">
    <div class="signup-video-bg">
      <video class="video-content" autoplay muted loop playsinline>
        <source src="@assets/video/signin_bg.mp4" type="video/mp4" />
      </video>
    </div>
    <div class="signup-title-area">
      <h3>{{ $t("NAV_SignUp") }}</h3>
      <p>{{ $t("SIG_SubTitle") }}</p>
    </div>

    <ul class="class-check-area">
      <li
        :class="{ active: isPlanner(userType) }"
        @click="toggleType(ROLES_BE.planner)"
      >
        <div>
          <div class="main-text">
            <span>{{ $t("CM_Planner") }}</span>
            <i class="ico arrow-check"></i>
          </div>
          <div class="font-16 member-type-text">
            ({{ $t("CM_BusinessMember") }})
          </div>
        </div>
        <p class="detail-text">{{ $t("SIG_PlannerText") }}</p>
      </li>
      <li
        :class="{ active: !isPlanner(userType) }"
        @click="toggleType(ROLES_BE.consumer)"
      >
        <div>
          <div class="main-text">
            <span>{{ $t("CM_Customer") }}</span>
            <i class="ico arrow-check"></i>
          </div>
          <div class="font-16 member-type-text">
            ({{ $t("CM_ConsumerMember") }})
          </div>
        </div>
        <p class="detail-text">{{ $t("SIG_CustomerText") }}</p>
      </li>
    </ul>

    <span class="age-notic-text">
      {{
        isPlanner(userType)
          ? $t("SIG_NoticAge", { age: 19 })
          : $t("SIG_NoticAge", { age: 14 })
      }}
    </span>

    <div class="signup-method-area">
      <RButton
        class="btn full large sns-btn member-btn-area"
        @on-click="goNextStep(NO_SNS)"
      >
        <template #content>
          <i class="ico user" />
          <span>{{ $t("SIG_UserBtn") }}</span>
        </template>
      </RButton>
      <span class="text">{{ $t("SIG_Sns") }}</span>

      <ul class="signup-sns-btn-area sns-btn-area">
        <li>
          <RButton class="kakao-btn-area" @click="onSignupKakao">
            <template #content>
              <i class="ico kakao" />
            </template>
          </RButton>
        </li>
        <li>
          <RButton @on-click="onSignupNaver">
            <template #content>
              <i class="ico naver" />
            </template>
          </RButton>
        </li>
        <li>
          <RButton class="apple-btn-area" @on-click="onSignupApple">
            <template #content>
              <i class="ico apple" />
            </template>
          </RButton>
        </li>
      </ul>
      <div class="login-move-btn-area mt24">
        <span>{{ $t("SIG_MoveLogin") }}</span>
        <router-link to="/login" class="primary09-color">{{
          $t("SIG_DoLogin")
        }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";
import { useRoute, useRouter } from "vue-router";
import { doKakaoLogin } from "@utils/login";
import {
  sessionDataManager,
  SIGNUP_CURRENT_STEP,
  SIGNUP_USER_TYPE,
  SIGNUP_SNS_DATA,
  SIGNUP_REFERRER_NUMBER,
  SIGNUP_SERVICE_TYPE,
  SIGNUP_CERTI_INFO,
  SIGNUP_USER_INFO,
  SIGNUP_COMPLETE,
  SIGNUP_REFERRER_CODE,
  SIGNUP_REFERRER_BRANCH_ID,
} from "@utils/dataManager";

import { ROLES_BE, NO_SNS } from "@utils/constant";
import memberService from "@/http/services/member";
import SignupAppleModal from "./apple/SignupAppleModal.vue";

const currentStep = ["/signup/selectType"];
const nextPage = "/signup/selectReferrer";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const userType = ref(ROLES_BE.planner);

const toggleType = (type) => {
  userType.value = type;
};

// 네이버 간편 가입
const onSignupNaver = () => {
  const naverLoginPop = window.open(
    "/signup/naver/signupNaverModal",
    "Naver Login",
    "width=550, height=600"
  );
  window.NaverLoginPopClose = () => {
    naverLoginPop.close();
  };
};
// 네이버 간편 가입 Callback
const signupNaverCallback = (event) => {
  if (
    event.origin !== import.meta.env.VITE_APP_BASE_URL ||
    !event.data.sendTo ||
    event.data.sendTo !== "sns easy login" ||
    typeof event.data !== "object"
  ) {
    return;
  }
  if (event.data.status) {
    // 사용자 로그인이 true
    checkSNSUser(event.data.userInfo); // 회원 상태 확인
  } else {
    // 사용자 로그인이 false
    console.log(event.data.errorMessage); // 오류 안내 메시지 콘솔에 출력
  }
};

// 카카오 간편 가입
const onSignupKakao = async () => {
  doKakaoLogin(checkSNSUser);
};

// Apple 간편 가입
const onSignupApple = () => {
  proxy.openModal({
    parent: proxy,
    component: SignupAppleModal,
    componentProps: {
      callbackEvt: checkSNSUser,
    },
    modeless: false,
  });
};

/**
 * SNS 간편 가입 > 회원 상태 확인 [중복, 탈퇴, 휴면, 전환]
 * @param {*} userInfo
 */
const checkSNSUser = async (userInfo) => {
  const params = {
    email: userInfo.email,
    serviceType: userInfo.serviceType,
    tokenSocial: userInfo.id,
  };
  const result = await memberService.postFindExistUser(params);
  if (result && result.code === "2000") {
    if (result.data?.rejoinPossibleDate) {
      proxy.$alert(
        proxy.$t("SIG_AltRejoin", { date: result.data.rejoinPossibleDate }),
        {
          title: proxy.$t("SIG_AltRejoinTitle"),
        }
      );
      return;
    } else if (result.data?.duplicate) {
      proxy.$confirm(proxy.$t("SIG_ConfDuplicate"), {
        title: proxy.$t("SIG_ConfDuplicateTitle"),
        okLabel: proxy.$t("NAV_FindAccount"),
        ok: () => {
          router.push({ path: "/findAccount" });
        },
      });
      return;
    }
    sessionDataManager.set(SIGNUP_SNS_DATA, JSON.stringify(userInfo));
    goNextStep(userInfo.serviceType);
  }
};

/**
 * 추천인 선택 페이지 이동
 * @param {*} serviceType
 */
const goNextStep = (serviceType) => {
  sessionDataManager.set(SIGNUP_USER_TYPE, userType.value);
  sessionDataManager.set(SIGNUP_SERVICE_TYPE, serviceType);

  sessionDataManager.set(
    SIGNUP_CURRENT_STEP,
    JSON.stringify([...currentStep, nextPage])
  );
  router.push({ name: "SelectReferrer" });
};

onMounted(() => {
  getReferrerCode();
  removeSignupData();

  // 네이버 로그인 Callback 설정
  window.addEventListener("message", signupNaverCallback);
});

const getReferrerCode = () => {
  const referrerCode = route?.query?.referrerCode;
  if (referrerCode) {
    sessionDataManager.set(SIGNUP_REFERRER_CODE, referrerCode);
  }
};

onBeforeUnmount(() => {
  window.removeEventListener("message", signupNaverCallback);
});

const isPlanner = (userType) => {
  return userType === ROLES_BE.planner;
};

/**
 * 세션 초기화
 */
const removeSignupData = () => {
  const sessionList = [
    SIGNUP_CURRENT_STEP,
    SIGNUP_USER_TYPE,
    SIGNUP_SNS_DATA,
    SIGNUP_REFERRER_NUMBER,
    SIGNUP_SERVICE_TYPE,
    SIGNUP_CERTI_INFO,
    SIGNUP_USER_INFO,
    SIGNUP_COMPLETE,
    SIGNUP_REFERRER_BRANCH_ID,
  ];

  sessionList.map((data) => {
    sessionDataManager.remove(data);
  });
};
</script>
