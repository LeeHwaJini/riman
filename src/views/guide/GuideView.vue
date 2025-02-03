<!--
Icon : https://fonts.google.com/icons
-->
<template>
  <div class="wrap">
    <q-tabs
      v-model="tab"
      align="left"
      active-color="primary"
      indicator-color="primary"
      style="background-color: #fff;"
    >
      <q-tab name="list" label="퍼블리싱 리스트" />
      <q-tab name="guide" label="가이드(라이브러리)" />
      <q-tab name="rule" label="퍼블리싱 규칙" />
      <q-tab name="icon" label="아이콘 규칙" />
      <q-tab name="button" label="버튼 규칙" />
    </q-tabs>
    <q-separator />

    <!-- contents -->
    <q-tab-panels v-model="tab">
      <q-tab-panel name="list">
        <section class="guide">
          <List />
        </section>
      </q-tab-panel>

      <q-tab-panel name="guide">
        <section class="guide">
          <h3/>
          <div class="box_style">
            <div class="q-gutter-md row items-start">
              [Global Function]<br>
              다국어 : {{ $i18n.locale }} <br>
              로그인 여부 : {{ $isLogin() }} <br>
              moneyFormat : {{ $moneyFormat('100000') }} <br>
            </div>
          </div>
          <!-- input Componet-->
          <div class="box_style">
            <div class="q-gutter-md row items-start">
              <!-- <q-input v-model="inputText" label="Standard" />
          <q-input v-model="inputText" placeholder="disabled" :disable="true" label="Label (stacked)" stack-label/>
          <q-input v-model="inputText" placeholder="readonly" readonly label="Label (stacked)" stack-label/>
          <q-input v-model="inputText" class="input input--noborder" placeholder="noborder" readonly label="noborder" stack-label/>
          <q-input placeholder="숫자만 입력하세요." type="number" />
          <q-input v-model="inputText" outlined label="Label (stacked)" stack-label :dense="dense" />
          <q-input v-model="passwordText" filled :type="isPwd ? 'password' : 'text'" hint="Password with toggle" label="password (stacked)" stack-label :dense="dense" >
            <template #append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input v-model="searchText" type="search">
            <template #append>
              <q-icon name="search" />
            </template>
          </q-input> -->
              <RInput v-model="inputText" label="Standard" />
              <RInput v-model="inputText" placeholder="disabled" :disable="true" label="Label (stacked)" />
              <RInput v-model="inputText" placeholder="readonly" readonly label="Label (stacked)" />
              <RInput v-model="inputText" class="input input--noborder" placeholder="noborder" readonly label="noborder" />
              <RInput v-model="inputText" outlined label="Label (stacked)" :dense="dense" />
              <RInput v-model="passwordText" type="password" filled hint="Password with toggle" label="password (stacked)" :dense="dense" />
              <RMemberInput v-model="memberInfo" type="id" />
              <RInput v-model="inputValue" placeholder="아이디를 입력하세요." :rules="[ validate.isValidId ]" class="login-input login-input--id"/>
              <RInput v-model="inputText" placeholder="인증번호를 입력해주세요.">
                <template #append>
                  <span style="color:red;font-size:12px">2:52</span>
                </template>
              </RInput>
              <!-- Input 태그 내 아이콘 추가 -->
              <RInput v-model="inputValue" readonly>
                <template #prepend>
                  <i class="ico kakao" />
                </template>
              </RInput>
            </div>
          </div>

          <!-- 회원가입 > 비밀번호 입력 -->
          <div class="box_style">
            <div class="q-gutter-md  items-start">
              <RPasswordConfirm v-model:password="passwordText1" v-model:passwordConfirm="passwordText2" title="변경할 비밀번호"/>
            </div>
          </div>
          <!-- textarea Component -->
          <div class="box_style">
            <div class="q-gutter-md row items-start">
              <RTextarea v-model="textareaValue" maxlength="100" :input-style="{ minHeight: '200px' }" />
            </div>
          </div>
          <!-- Select Componet -->
          <div class="box_style">
            select : {{ selectModel }}
            <div class="q-gutter-md row items-start">
              <!-- <q-select v-model="selectModel" :options="selectOptions" label="Standard" emit-value map-options style="width: 250px"/>
          <q-select
            v-model="selectFilterModel"
            emit-value
            map-options
            use-input
            input-debounce="0"
            label="Simple filter"
            stack-label
            :options="selectFilterOptions"
            style="width: 250px"
            @filter="filterFn"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select> -->
              <RSelectBox
                v-model="selectModel"
                :label="'snsMenu'"
                :options="selectOptions"
                :disable="false"
                :filterable="false"
              />
              <RSelectBox
                v-model="selectFilterModel"
                placeholder-text="선택해주세요."
                :label="'snsMenu'"
                :options="selectOptions"
                :disable="false"
                :filterable="true"
              />
              <RSelectBox
                v-model="selectModel"
                :label="'disable'"
                :options="selectOptions"
                :disable="true"
                :filterable="false"
              />
              <RSelectBox
                v-model="selectModel"
                :label="'readonly'"
                :options="selectOptions"
                :disable="false"
                :filterable="false"
                :readonly="true"
              />
            </div>
          </div>
          <!-- button Componet-->
          <div class="box_style">
            <div class="q-gutter-md row items-start">
              <RButton label="Default" @on-click="onBtnClick"/>
              <RButton class="bg_lightBlue" label="등록 | 수정 " />
              <RButton class="button--search" icon="person_search" label="검색" />
              <RButton class="r_mint" label="outline" outline/>
              <RButton class="bg_gray" label="Gray" />
              <RButton label="disabled" disabled/>
              <RButton icon="tune" class="bg_lightGray"/>
              <RButton icon="download" class="bg_lightGray" label="다운로드" />
              <RExcelButton @click="excelDown" />
            </div>
          </div>
          <!-- badge Componet-->
          <div class="box_style">
            <div class="q-gutter-md row items-start">
              <RBadge
                color="tb-blue"
                label="ACTIVATED"
              />
              <RBadge
                color="tb-gray"
                label="DORMANCY"
              />
              <RBadge
                color="tb-red"
                label="JUDGEMENT"
              />
              <RBadge
                color="tb-gray"
                label="WITHDRAWAL"
              />
              <div class="text-h4">
                Title
                <RBadge
                  color="primary"
                  label="align top"
                  align="top"
                />
              </div>
              <div class="text-h4">
                Title
                <RBadge
                  color="primary"
                  label="align bottom"
                  align="bottom"
                />
              </div>
              <RBadge
                color="primary"
                text-color="yellow"
                label="yellow"
              />
            </div>
          </div>
          <!-- switch Componet-->
          <div class="box_style">
            switch_value : {{ isUse }}
            <div class="q-gutter-md row items-start">
              <RSwitch
                v-model="isUse"
                label="사용 여부"
              />
              <RSwitch
                v-model="isUse"
                label="disabled"
                :disable="true"
              />
              <RSwitch
                v-model="isUse"
                label="red"
                color="red"
              />
              <RSwitch
                v-model="isUse"
                label="xlarge size"
                size="xl"
              />
            </div>
          </div>
          <!-- file Componet -->
          <div class="box_style">
            <div class="q-gutter-md row items-start">
              <RUploadFile v-model="fileModel" placeholder-text="첨부파일" />
              <RUploadImage url="http://localhost:8080/upload" label="Image Upload files" multiple/>
            </div>
          </div>
          <!-- file Uploader Componet -->
          <div class="box_style">
            <div class="w550 inblock">
              <q-btn size="sm" style="width: 150px" label="file upload modal" @click="onUploadFileOpenModal()"/> : Upload File Modal
            </div>
          </div>
          <!-- copy Function -->
          <div class="box_style">
            <div class="q-gutter-md row items-start">
              <span>복사하기 : </span><RInput v-model="copyText1" label="Standard" />
              <RButton style="width: 150px" label="copy" class="bg_lightBlue" @click="copyClipboard(copyText1)"/><br>
              <span>붙여넣기 : </span><RInput v-model="copyText2" label="Standard" />
            </div>
          </div>
          <!-- Tree Componet -->
          <div class="box_style">
            select : {{ treeSelected }}
            <div class="q-gutter-md row items-start">
              <q-tree
                v-model:selected="treeSelected"
                v-model:ticked="treeTicked"
                v-model:expanded="treeExpanded"
                class="col-12 col-sm-6"
                :nodes="treeSimple"
                node-key="label"
                tick-strategy="leaf"
              />
            </div>
          </div>
          <!-- Alert Componet -->
          <div class="box_style">
            <div class="w550 inblock">
              <!--Alert -->
              <q-btn size="sm" style="width: 150px" label="Alert" @click="onAlert"/> : Alert : default <br>
              <q-btn size="sm" style="width: 150px" label="Alert" @click="onChangeTileAlert"/> : Alert : Title, 버튼명 변경<br>
              <q-btn size="sm" style="width: 150px" label="Error Alert" @click="onErrorAlert"/> : Alert : 에러<br>
              <br >
              <br >
              <!--Confirm -->
              <q-btn size="sm" style="width: 150px" label="Confirm" @click="onConfirm"/> : Confirm <br >
              <q-btn size="sm" style="width: 150px" label="Confirm" @click="onConfirmTitle"/> : Confirm : : Title, 버튼명 변경
              <br >
              <br >
              <!--Progress -->
              <q-btn size="sm" style="width: 150px" label="Progress" @click="onProgress"/> : progress <br >
              <!--Progress -->
              <q-btn size="sm" style="width: 150px" label="Pinia" @click="onPiniaStore"/> : use Pinia Sample <br ><br >
            </div>
          </div>
          <!-- Modal Componet -->
          <div class="box_style">
            <div class="w550 inblock">
              <q-btn size="sm" style="width: 150px" label="modal" @click="onOpenModal()"/> : Modal <br>
              <q-btn size="sm" style="width: 150px" label="Memo modal" @click="onOpenMemoModal()"/> : Memo Modal <br>
              <q-btn size="sm" style="width: 150px" label="Terms modal" @click="onOpenTermsModal()"/> : 약관 내용 Modal <br>
              <q-btn size="sm" style="width: 150px" label="Card Password modal" @click="onOpenCardPwdModal()"/> : 카드 비밀번호 Modal <br>
              <q-btn size="sm" style="width: 150px" label="Card Password modal" @click="openGuideModal(CardPasswordInitModal)"/> : 카드 비밀번호 초기 설정 Modal <br>
              <q-btn size="sm" style="width: 150px" label="Today Only modal" @click="onOpenTodayOnlyModal()"/> : 오늘 하루만 보기 Modal <br>
              <q-btn size="sm" style="width: 150px" label="Allowance Modal" @click="openGuideModal(AllowancePlannerModal)"/> : 수당 발생 플래너 Modal <br>
              <q-btn size="sm" style="width: 150px" label="Bottom Modal" @click="openGuideModal(BottomModal)"/> : Bottom Modal <br>
              <q-btn size="sm" style="width: 150px" label="Full Page Modal(pc - 500width)" @click="openGuideModal(FullPageModal)"/> : Full Page Modal(pc - 500width)<br>
              <q-btn size="sm" style="width: 150px" label="Full Page Modal(pc - 800width)" @click="openGuideModal(FullPageModalWider)"/> : Full Page Modal(pc - 800width)<br>
              <q-btn size="sm" style="width: 150px" label="DiveIn Modal" @click="openGuideModal(DiveInModal)"/> : DiveIn Modal<br>
              <q-btn size="sm" style="width: 150px" label="Autoship Add Product Modal" @click="openAutoshipAddProduct"/> : AutoshipAddProduct Modal <br>
              <q-btn size="sm" style="width: 150px" label="Main Notice Modal" @click="openMainModal"/> : 메인 팝업 Modal <br>
            </div>
          </div>
          <div class="box_style">
            <div class="w550 inblock">
              <q-btn size="sm" style="width: 150px" label="List Filter Drawer" @click="openGuideModal(ListFilterDrawer)"/> : 상품리스트 필터 Drawer <br>
              <q-btn size="sm" style="width: 150px" label="Add Cart Drawer" @click="openGuideModal(AddCartDrawer)"/> : 장바구니 담기 Drawer<br>
            </div>
          </div>
          <!-- File Modal Componet -->
          <!-- <div class="box_style">
        <div class="w550 inblock">
          <q-btn size="sm" style="width: 150px" label="file upload modal" @click="onUploadFileOpenModal()"/> : Upload File Modal
        </div>
      </div> -->
          <!-- Datepicker Componet -->
          <!--
            is-before-now-date : 오늘 날짜 이전 선택 가능
            is-after-now-date : 오늘 날짜 이후 선택 가능
          -->
          <div class="box_style">
            <div class="w550 inblock">
              <RDatepicker v-model="dateValue1" type="time" />  <br>
              <RDatepicker v-model="dateValue2" type="month" /> <br>
              <RDatepicker v-model="dateValue3" :is-before-now-date="true" /> <br>
              <RDatepickerGroup v-model:startDate="startDate" v-model:endDate="endDate" />
            </div>
          </div>
          <!-- Tab Component -->
          <div class="box_style">
            <div class="w550 inblock">
              <q-tabs
                v-model="tabValue"
                class="text-grey"
                active-color="black"
                dense
                align="justify"
              >
                <q-tab label="tab1" name="tab1" />
                <q-tab label="tab2" name="tab2" />
              </q-tabs>

              <q-tab-panels v-model="tabValue">
                <q-tab-panel name="tab1">
                  tab1 content
                </q-tab-panel>
                <q-tab-panel name="tab2">
                  tab2 content
                </q-tab-panel>
              </q-tab-panels>
            </div>
          </div>

          <!-- Step Component -->
          <div class="box_style">
            <div class="w550 inblock">
              <RStep :step="step" :total-step="totalStep" />
            </div>
          </div>

          <!-- CheckBox Component-->
          <div class="box_style">
            <div class="w550 inblock">

              <RCheckbox v-model="checked" checked-icon="check_circle" unchecked-icon="check_circle">
                <b style="color: #60C7D2;padding-right: 5px;">필수</b>
                <span>전자상거래 이용약관</span>
                <span style="color:red">*</span>
              </RCheckbox>

              <br/><br/>

              <RCheckbox v-model="checked1" checked-icon="check" unchecked-icon="check">
                <span>이메일</span>
              </RCheckbox>
            </div>
          </div>

          <!-- CheckBoxGroup Component -->
          <div class="box_style">
            <div class="w550 inblock">
              <RCheckboxGroup v-model="selection" :options="options" all-chk-class="check-box-custom" sub-chk-class="check-box-custom" @update:model-value="() => {console.log('>>>>>>>>> '+selection)}"/>

              <!-- <RCheckboxGroup v-model="selection" :options="options" :max="2" /><br> -->

              <!-- <RCheckboxGroup v-model="selection" :options="options" :is-all-text="false" /> -->
            </div>
          </div>
          <!-- RRadio Component -->
          <div class="box_style">
            <div class="inblock">
              <RRadio v-model="selectModel" :options="selectOptions" @update:model-value="() => {console.log('>>>>>>>>> '+selectModel)}" />
            </div>
          </div>
          <!-- Tootip Components -->
          <div class="box_style">
            <q-btn color="indigo">
              Hover
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                <strong>Tooltip</strong>
              </q-tooltip>
            </q-btn>
            <q-btn color="primary">
              These
              <q-tooltip class="bg-purple text-body2" :offset="[10, 10]">
                Tooltip
              </q-tooltip>
            </q-btn>
          </div>
          <!-- RNumberSpin Components -->
          <div class="box_style">
            <div class="inblock">
              <RNumberSpin v-model="count" :min="1" :max="10"/>
            </div>
          </div>
          <!-- Modal Componet -->
          <!--div class="box_style">
        <div class="w550 inblock">
          <q-btn size="sm" style="width: 150px" label="상품 조회 팝업" @click="onOpenProductSearchModal()"/>
          <q-btn size="sm" style="width: 150px" label="노출 분류 수정 팝업" @click="onOpenProductCategoryModal()"/>
          <q-btn size="sm" style="width: 150px" label="템플릿 등록 팝업" @click="onOpenTemplateRegistModal()"/>
          <q-btn size="sm" style="width: 150px" label="이미지 업로드 팝업" @click="onOpenProductUploadModal()"/>
          <q-btn size="sm" style="width: 150px" label="상담관리 소비자 조회 팝업" @click="onOpenInquiryConsumerModal()"/>
          <q-btn size="sm" style="width: 150px" label="회원 조회 팝업" @click="onOpenMemberResearchModal()"/>
          <q-btn size="sm" style="width: 150px" label="교환 요청 승인" @click="onOpenExchangeAcceptModal()"/>
          <q-btn size="sm" style="width: 150px" label="교환 거절" @click="onOpenExchangeRefuseModal()"/>
          <q-btn size="sm" style="width: 150px" label="반송품 회수 생략" @click="onOpenReturnSkipModal()"/>
          <q-btn size="sm" style="width: 150px" label="상품 회수 완료" @click="onOpenReturnCompleteModal()"/>
          <q-btn size="sm" style="width: 150px" label="상품 입고 생략" @click="onOpenProductSkipModal()"/>
          <q-btn size="sm" style="width: 150px" label="상품 입고 완료" @click="onOpenProductCompleteModal()"/>
          <q-btn size="sm" style="width: 150px" label="상품 검수 완료" @click="onOpenProductCheckModal()"/>
          <q-btn size="sm" style="width: 150px" label="출고 지시" @click="onOpenProductReleaseModal()"/>
          <q-btn size="sm" style="width: 150px" label="주문 조회 팝업" @click="onOpenOrderSearchModal()"/>
        </div>
      </div-->
          <!-- login Test Componet-->
          <div class="box_style">
            <h3>▣ validate 및 API 연동</h3>
            <div class="q-gutter-md row items-start">
              <q-input ref="idRef" v-model="id" label="ID" :rules="[ validate.isValidId ]" />
              <q-input ref="passwordRef" v-model="password" :type="isPwd ? 'password' : 'text'" label="password" :rules="[ validate.isValidPasswd ]" >
                <template #append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
              <q-btn color="white" text-color="black" label="Login" @click="onClickLogin"/>
              <div>
                <q-btn color="white" text-color="black" label="Reset Cookies" @click="onClickResetCookie"/>
              </div>
            </div>
          </div>
          <!-- search Test Components -->
          <!--div class="box_style">
        <div class="inblock">
          <q-btn color="white" text-color="black" label="Search" @click="onSearchDistributor"/>
        </div>
      </div-->

          <!-- 주소 입력  Componet -->
          <div class="box_style">
            <div class="w550 inblock">
              <AddressInput
                v-model:addrInfo="address"
                :class="_calss"
                :readonly="modifyMod"
              />
            </div>
          </div>

          <!-- Component -->
          <div class="box_style">
            <div class="w550 inblock">
              <!-- 본인 인증 Component -->
              <Certificate
                @on-success="onCertSuccess"
                @on-fail="onCertFail"
              />
              <br>
              <CardCertificate
                @on-success="onCertSuccess"
                @on-fail="onCertFail"
              />
              <!---정기구매 카드 추가 Modal -->
              <!-- <Billing url="/mypage/autoshipCard"/> -->
            </div>
          </div>

          <!-- 이미지 경로 암호화 Component -->
          <div class="box_style">
            <div class="q-gutter-md row items-start">
              <RConvertImage url="/v1/member/s3-private/202401151355129586000_FRONT.png?type=FOREIGNERS_REGISTRATION_PAPER" style="width:200px;height:150px"/>
            </div>
          </div>
          <!-- Test DataTable-->
          <div class="box_style">
            <div class="inblock" style="height:653px" >
              <DataTable
                v-model:page-info="pageInfo"
                :columns="columns"
                :row-data="rowData"
                @on-click-btn="onRowClickBtn"
                @search-event="onSearch"
              />
            </div>
          </div>

          <swiper :pagination="true" :modules="modules" class="mySwiper">
            <swiper-slide>Slide 1</swiper-slide>
            <swiper-slide>Slide 2</swiper-slide>
            <swiper-slide>Slide 3</swiper-slide>
          </swiper>
          <FullPageModal
            ref="autoshipAddProduct">
            <template #title>
              <h4>상품추가하기</h4>
            </template>
            <template #slide>
              <div class="bottom-slide">
                <div class="btn slide-btn text-center" @click="toggleSlideVisible"><span class="slide-icon"></span></div>
                <q-slide-transition>
                  <div v-show="slideVisible">
                    aaa<br />
                    aaa<br />
                  </div>
                </q-slide-transition>
              </div>
            </template>
          </FullPageModal>
          <!--  -->

          <RButtonUpload v-model="file" accept=".jpg,.jpeg,.png" label="파일 업로드" @update:model-value="onChnageFile" />

          <img :src="avatarUrl" />

          <!-- gsap  -->
          <div>
            <svg id="svg" width="100%" height="100%" viewBox="-20 0 557 190">
              <circle cx="100" cy="100" r="3" />
              <circle cx="300" cy="20" r="3" />
              <path id="path" ref="path" d="M9,100c0,0,18.53-41.58,49.91-65.11c30-22.5,65.81-24.88,77.39-24.88c33.87,0,57.55,11.71,77.05,28.47c23.09,19.85,40.33,46.79,61.71,69.77c24.09,25.89,53.44,46.75,102.37,46.75c22.23,0,40.62-2.83,55.84-7.43c27.97-8.45,44.21-22.88,54.78-36.7c14.35-18.75,16.43-36.37,16.43-36.37"/>
              <g id="rect" ref="rect">
                <rect width="85" height="30" fill="dodgerblue" />
                <text x="10" y="19" font-size="14">SVG &lt;rect&gt;</text>
              </g>
            </svg>

          </div>
        </section>

      </q-tab-panel>

      <q-tab-panel name="rule">
        <section class="list">
          <Rule />
        </section>
      </q-tab-panel>

      <q-tab-panel name="icon">
        <ul class="icon-guide-list">
          <li v-for="icon in icons" :key="icon">
            <i class="ico" :class="icon"/>
            <span>{{ icon }}</span>
          </li>
        </ul>
      </q-tab-panel>

      <q-tab-panel name="button">
        버튼
      </q-tab-panel>
    </q-tab-panels>
  </div>

</template>
<script setup>
import { useMainStore } from '@store/mainStore'
import { useRouter } from 'vue-router'
import { ref, getCurrentInstance, onMounted, reactive, watch, computed } from 'vue'
import SampleModal from './popup/SampleModal'
import validate from '@utils/validate'
import { copyClipboard } from '@/utils/common'
// import { downloadFile } from '@/utils/common'
import http from '@utils/http'
import List from './List.vue'
import Rule from './Rule.vue'
import AllowancePlannerModal from '@/views/home/modal/AllowancePlannerModal'
import TodayOnlyModal from '@/views/home/modal/TodayOnlyModal'

const tab = ref('list')

// import required modules
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css/navigation'
import { Pagination } from 'swiper/modules'
import ListFilterDrawer from '../product/drawer/ListFilterDrawer.vue'
import BottomModal from '@/components/modal/BottomModal.vue'
import FullPageModal from '@/components/modal/FullPageModal.vue'
import CardPasswordInitModal from '@/components/modal/CardPasswordInitModal.vue'
const modules = [Pagination]

const { proxy } = getCurrentInstance()
const router = useRouter()

const id = ref('')
const password = ref('')
const idRef = ref(null)
const passwordRef = ref(null)

const isUse = ref(false)
const dense = ref(false)
const isPwd = ref(true)
const passwordText = ref('')
const inputText = ref('')
const searchText = ref('')
const copyText1 = ref('')
const copyText2 = ref('')
const selectModel = ref('Google_value')
const selectFilterModel = ref(null)
const fileModel = ref(null)
const treeSelected = ref('TreeRoot')
const treeTicked = ref(['TreeRoot', 'TreeNode_3-1'])
const treeExpanded = ref(['TreeRoot', 'TreeNode_1', 'TreeNode_3'])
const treeSimple = ref([
  {
    label: 'TreeRoot',
    children: [
      {
        label: 'TreeNode_1',
        children: [
          { label: 'TreeNode_1-1' },
          { label: 'TreeNode_1-2' }
        ]
      },
      {
        label: 'TreeNode_2',
        disabled: true,
        children: [
          { label: 'TreeNode_2-1' }
        ]
      },
      {
        label: 'TreeNode_3',
        children: [
          { label: 'TreeNode_3-1' },
          { label: 'TreeNode_3-2' },
          { label: 'TreeNode_3-3' }
        ]
      }
    ]
  }
])

const count = ref(1)
const slideVisible = ref(false)
const inputValue = ref('')

const selected = ref([])

const toggleSelect = (node, isSelected) => {
  isSelected ? selected.value.push(node.some_id) : selected.value.splice(selected.value.indexOf(node.some_id), 1)
  if (node.children && node.children.length) {
    node.children.forEach(ch => {
      toggleSelect(ch, isSelected)
    })
  }
}
const openAutoshipAddProduct = () => {
  proxy.$refs.autoshipAddProduct.show()
}

/**
 * gsap
 */
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import FullPageModalWider from '@/components/modal/FullPageModalWider.vue'
import DiveInModal from '@/components/modal/DiveInModal.vue'
import MainNoticeModal from '@/components/modal/MainNoticeModal.vue'

onMounted(() => {
  getDistributorsInfo()
  getTypeOfOrderInfo()

  /**
 * gsap
 */
  // 플러그인 등록
  gsap.registerPlugin(MotionPathPlugin)

  gsap.to(proxy.$refs.rect, {
    motionPath: {
      path: proxy.$refs.path,
      align: proxy.$refs.path,
      alignOrigin: [0.5, 0.5],
      autoRotate: true
    },
    transformOrigin: '50% 50%',
    duration: 5,
    ease: 'power1.inOut'
  })
})

// ----- Alert show -----
const onAlert = () => {
  proxy.$alert('저장되었습니다.')
}

const onChangeTileAlert = () => {
  proxy.$alert('저장되었습니다.', { title: 'Title 변경', okLabel: '저장 버튼' })
}

const onErrorAlert = () => {
  proxy.$alertError('에러가 발생하였습니다.')
}

const onConfirm = () => {
  proxy.$confirm('기본 confirm 창 입니다.', {
    ok: () => {
      alert('ok 클릭')
    },
    cancel: () => {
      alert('cancel 클릭')
    },
    okClassName: 'okClass',
    cancelClassName: 'cancelClass',
    wrapClassName: 'wrapClassName'
  })
}
const fullSizeModalVisible = ref()
const onClick = (e) => {
  console.log('eeeeeeeeeeeeeeeeeeeeee', e)
}

const onConfirmTitle = () => {
  proxy.$confirm('제목을 변경한 confirm 창 입니다.',
    {
      title: 'Title 변경',
      okLabel: '확인 버튼',
      cancelLabel: '취소 버튼',
      ok: () => {
        alert('ok 클릭')
      },
      cancel: () => {
        alert('cancel 클릭')
      }
    })
}

const onProgress = () => {
  console.log('============onProgress===========')
  proxy.$showProgress() // Progress Show

  setTimeout(() => {
    proxy.$hideProgress() // Progress Hide
  }, 1000)
}

// 메모 팝업 오픈 버튼 수행
const onOpenMemoModal = (rowData) => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: 'MemoModal', // 필수
      componentProps: { propData: rowData }, // 선택 - 팝업창에 값 전달
      modeless: false // 선택
    })
    .onOk(() => {
      proxy.$alert('Modal ok 클릭.')
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

// 약관 팝업 오픈 버튼 수행
const onOpenTermsModal = () => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: 'TermsModal', // 필수
      componentProps: {
        title: '약관',
        content: '<br/><br/>약관 내용<br/><br/>'
      }, // 선택 - 팝업창에 값 전달
      modeless: false // 선택
    })
    .onOk(() => {})
    .onCancel(() => {})
    .onDismiss(() => {})
}

const onOpenCardPwdModal = () => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: 'CardPasswordModal', // 필수
      modeless: false // 선택
    })
}

const onOpenTodayOnlyModal = () => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: TodayOnlyModal, // 필수
      componentProps: {
        title: '오늘하루만보기'
      }
    })
}

// 팝업 오픈 버튼 수행
const onOpenModal = (rowData) => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: SampleModal, // 필수
      componentProps: { propData: rowData }, // 선택 - 팝업창에 값 전달
      modeless: false // 선택
    })
    .onOk((modalInfo) => {
      proxy.$alert('Modal ok 클릭.')
      select(modalInfo)
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

const openMainModal = () => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: MainNoticeModal, // 필수
      componentProps: {}
    })
}

const openGuideModal = (modalName) => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: modalName // 필수
    })
}

const select = async (modalInfo) => {
  searchText.value = '123456'
}
/** 가이드 문서 Function */
const onOpenGuide = () => {
  downloadFile(
    '/v1/member/stores/storeAgreement/sample/excel',
    `대리점 동의 업로드 엑셀양식.xlsx`
  )
}

/** 파일 업로드 Function */
const onUploadFile = () => {
  proxy.$alert('file upload')
}

// 파일 업로드 팝업 오픈 버튼 수행
const onUploadFileOpenModal = (rowData) => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: 'RUploader', // 필수
      componentProps: { upload: onUploadFile, attach: onOpenGuide, fileExtension: 'image/png' }, // 선택 - 팝업창에 값 전달
      modeless: false // 선택
    })
}

// Select filter 사용

const selectOptions = [
  { label: 'Google', value: 'Google_value' },
  { label: 'Facebook', value: 'Facebook_value' },
  { label: 'Twitter', value: 'Twitter_value' }
]
const selectFilterOptions = ref(selectOptions)

// Pinia Store 사용
const mainStore = useMainStore()

const onPiniaStore = async () => {
  const result = await mainStore.managerList()
  if (result) {
    proxy.$alert('result success')
  } else {
    proxy.$alert('result fail')
  }
}

const datePeriod = ref(null)
const datePeriod1 = ref(null)
const datePeriod2 = ref(null)
const datePeriod3 = ref(null)
const datePeriod4 = ref(null)
// const setDisable = ref(false)

const filterFn = (val, update) => {
  if (val === '') {
    update(() => {
      selectFilterOptions.value = selectOptions
    })
    return
  }
  update(() => {
    const needle = val.toLowerCase()
    selectFilterOptions.value = selectOptions.filter(item => item.value.toLowerCase().indexOf(needle) > -1)
  })
}
const toggleSlideVisible = () => {
  slideVisible.value = !slideVisible.value
}
// 체크박스 공통화
const checked = ref(false)
const checked1 = ref(false)
const options = [{ label: '빨강', value: 'red' }, { label: '노랑', value: 'yellow' }, { label: '파랑', value: 'blue' }]
const selection = ref([])

// Login Test
const onClickLogin = async () => {
  // validate
  idRef.value.validate()
  passwordRef.value.validate()

  if (idRef.value.hasError || passwordRef.value.hasError) {
    proxy.$alert('[validate] ID와 Password를 확인하세요.')
  } else {
    const params = {
      id: id.value,
      password: password.value
    }
    const result = await mainStore.onLogin(params)

    if (!result) {
      await alert('ID와 Password를 확인하세요.')
    } else {
      await alert(`${id.value}님 환영합니다.`)
      router.push('/')
    }
  }
}

// 쿠키 초기화(세션 날리기)
const onClickResetCookie = async () => {
  await mainStore.onLogout()

  // vallidate 초기화
  idRef.value.resetValidation()
  passwordRef.value.resetValidation()
}

const distributorData = ref([])
const distoributorPageInfo = reactive({
  pageSize: 100,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0
})
const getDistributorsInfo = async () => {
  const result = await http().url(`/v1/member/distributors/paging?pageNumber=${distoributorPageInfo.pageNumber}&pageSize=${distoributorPageInfo.pageSize}&createdStartDate=2023-06-01`).get()

  if (result) {
    distoributorPageInfo.totalSize = result.data.totalSize
    distributorData.value = result.data.list
  }
}

const typeOfOrderData = ref([])
const orderFooterData = ref([])
const pageInfo1 = reactive({
  pageSize: 100,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 0
})
const getTypeOfOrderInfo = async () => {
  const result = await http().url(`datalake/v1/order/backoffice/order-management/items?searchTypeOfOrder=APPROVAL_DATE&salesOrderType=ALL&orderWorkType=ALL&orderStatus=ALL&paymentType=ALL&startDate=2024-02-01&endDate=2024-03-11&pageNumber=${pageInfo1.pageNumber}&pageSize=${pageInfo1.pageSize}&createdStartDate=2023-06-01`).get()

  if (result) {
    pageInfo1.totalSize = result.data.totalSize
    typeOfOrderData.value = result.data.items
    setOrderFooter(result.data.contentInfo)
  }
}
const setOrderFooter = (footerData) => {
  orderFooterData.value = [
    {
      brandType: '총합계',
      qty: footerData.totalQty,
      sumBpAmt: footerData.totalSumBpAmt,
      sumSalesAmt: footerData.totalSumSalesAmt,
      supplyAmt: footerData.totalSupplyAmt,
      surtaxAmt: footerData.totalSurtaxAmt
    }
  ]
}

const exportExcel = async () => {
  const url = '/datalake/v1/order/backoffice/aggregation-ProductList-list/excel?searchTypeOfOrder=APPROVAL_DATE&startDate=2024-02-01&endDate=2024-03-11&salesOrderType=ALL&orderWorkType=ALL&orderStatus=ALL&paymentType=ALL'
  const filename = '판매리스트(제품별 판매제품).xlsx'
  downloadFile(url, filename)
}

const onBtnClick = () => {
  alert('Button clicked.')
}
// ----- DataTable guide end----- //
// calendar
const period = ref(null)
const dateValue1 = ref(null)
const dateValue2 = ref(null)
const dateValue3 = ref(null)
const startDate = ref(null)
const endDate = ref(null)

const memberInfo = ref(null)

watch(
  () => memberInfo.value,
  () => {
    console.log('memberInfo', memberInfo.value)
  }
)

const excelDown = () => {
  proxy.openModal(
    {
      parent: proxy, // 필수
      component: 'DownloadReasonModal', // 필수
      componentProps: { }, // 선택 - 팝업창에 값 전달
      modeless: false // 선택
    })
    .onOk((note) => {
      const params = {
        note
      }
      downloadFile('/v1/member/stores/storeAgreement/sample/excel', `대리점 동의 업로드 엑셀양식.xlsx`, params)
    })
    .onCancel(() => {})
    .onDismiss(() => {})
}

const textareaValue = ref('')

// 본인인증 완료 후 후처리 함수
const onCertSuccess = (data) => {
  console.log('[onCertSuccess] data =', data)
  // this.values.birthDate = data.birthDate // 생년월일
  // this.values.mobileNumber = data.mobileNumber // 휴대폰 번호
  // this.formatMobileNumber = data.mobileNumber.replace(/[^0-9]/, '').replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`) // 휴대폰 번호 포맷팅
  // this.valifyName.isCertification = true // 본인인증 여부
}
// 본인인증 실패 후 후처리 함수
const onCertFail = () => {
  console.log('onCertFail')
}

const address = reactive({
  address1: '',
  address2: '',
  zipCode: ''
})
const modifyMod = ref(false)
const _calss = computed(() => modifyMod.value ? 'input input--noborder' : '')

const tabValue = ref('tab1')
const totalStep = ref(4)
const step = ref(1)

const passwordText1 = ref(null)
const passwordText2 = ref(null)

// Datatable start
const pageInfo = reactive({
  pageSize: 100,
  pageNumber: 1,
  totalPageNumber: 0,
  totalSize: 1000
})

const columns = [
  {
    name: 'index',
    label: '#',
    field: 'index',
    isFixed: true // 컬럼 visible 기능 사용되지 않도록 설정
  },
  {
    name: 'name',
    required: true,
    label: 'Dessert (100g serving)',
    align: 'left',
    isFixed: true, // 컬럼 visible 기능 사용되지 않도록 설정
    field: (row) => row.name,
    format: (val, row) => (val ? `${val}` : ''),
    sortable: true,
    headerClasses: 'text-red'
  },
  {
    name: 'calories',
    align: 'center',
    label: 'Calories',
    field: 'calories',
    sortable: true
  },
  { name: 'fat', label: 'Fat (g)', field: 'fat', sortable: true },
  { name: 'carbs', label: 'Carbs (g)', field: 'carbs' },
  {
    name: 'calcium',
    label: 'Calcium (%)',
    field: 'calcium',
    sort: (a, b) => parseInt(a, 10) - parseInt(b, 10)
  },
  {
    name: 'iron', // Classes 기능 적용
    label: 'Classes',
    field: 'iron',
    sortable: true,
    classes: (row) => {
      return Number(row.iron) >= 50 ? 'text-red' : 'text-blue'
    }
  },
  {
    name: 'cellrender', // customerType 적용
    label: 'Button',
    cellrender: [
      { type: 'btn', label: '예약', action: 'onRowClickBtn' }
    ]
  }, // 버튼 타입 적용
  {
    name: 'cellrender', // customerType 적용
    label: 'Image',
    cellrender: [
      {
        type: 'image', // 이미지 타입 적용
        label: '이미지',
        // src: '@images/sample.png'
        src: 'https://cdn.quasar.dev/logo/svg/quasar-logo.svg'
      }
    ]
  },
  {
    name: 'cellrender', // customerType 적용
    label: 'Link',
    field: 'iron',
    cellrender: [
      {
        type: 'link', // Link 타입 적용
        src: '/guide' // 라우터 적용
      }
    ]
  }]

// DataTable row Data 설정
const rowData = computed(() => {
  return [
    { name: 'Frozen Yogurt', calories: 159, fat: 6.0, carbs: 24, calcium: '14%', iron: 1 },
    { name: 'Ice cream sandwich', calories: 237, fat: 9.0, carbs: 37, calcium: '8%', iron: 50 },
    { name: 'Eclair', calories: 262, fat: 16.0, carbs: 23, calcium: '6%', iron: 7 },
    { name: 'Cupcake', calories: 305, fat: 3.7, carbs: 67, calcium: '3%', iron: 8 },
    { name: 'Gingerbread', calories: 356, fat: 16.0, carbs: 49, calcium: '7%', iron: 16 }
  ]
})

const onRowClickBtn = (actionName, row) => {
  console.log('onRowClickBtn ===================> ' + actionName)
}

const onSearch = async () => {
  console.log('onSearch pageInfo.pageNumber ===================> ' + pageInfo.pageNumber)
}
// Datatable end

const file = ref(null)
const avatarUrl = ref('')
const onChnageFile = (file) => {
  avatarUrl.value = URL.createObjectURL(file)
}

const icons = [
  'arrow-check',
  'arrow-left',
  'arrow-left-light-b',
  'arrow-top-b',
  'arrow-top-w',
  'arrow-top-type02-b',
  'arrow-top-type02-m',
  'arrow-top-type02-n',
  'arrow-top-type02-g',
  'arrow-down',
  'arrow-bottom-w ',
  'arrow-right-w',
  'arrow-right-b',
  'arrow-right-g',
  'arrow-right-n',
  'arrow-right-light-g',
  'arrow-right-light-g-bold',
  'arrow-next-g',
  'arrow-next-n',
  'arrow-circle-right-light-g',
  'arrow-circle-right-w',
  'arrow-circle-top-w',
  'arrow-circle-left-light-g',
  'arrow-circle-right-n',
  'kakao',
  'naver',
  'naver-w',
  'close',
  'close-w',
  'close-g',
  'user',
  'KAKAO-navy',
  'NAVER-navy',
  'notifications',
  'celebration-n',
  'celebration-w',
  'celebration',
  'copy',
  'cs',
  'cs-n',
  'question',
  'question small',
  'question-b',
  'question-r',
  'exclamation-b',
  'exclamation-r',
  'exclamation-n',
  'reset',
  'reset-light-b',
  'mark',
  'file',
  'notic',
  'notic-w',
  'cart',
  'download',
  'download-w',
  'dropdown-w',
  'search',
  'search-g',
  'search-w',
  'add',
  'add-w',
  'add-b',
  'subtract',
  'filter',
  'link',
  'check',
  'check-n',
  'wait',
  'list',
  'list active',
  'grid',
  'grid active',
  'text-list',
  'flash',
  'lock',
  'lock-g',
  'img-mark',
  'delivery',
  'msg-n',
  'msg-w',
  'point',
  'point-n',
  'riman-coin',
  'riman-coin-g',
  'riman-coin-m',
  'riman-coin-m small',
  'riman-coin-n',
  'riman-coin-y',
  'riman-ticket',
  'riman-ticket-n',
  'delete',
  'delete-w',
  'delete-b',
  'edit-b',
  'edit-w',
  'edit-bg-w',
  'edit-g',
  'edit-g small',
  'date-n',
  'complate',
  'complate active',
  'gift',
  'gift active',
  'card',
  'card-g',
  'card-w',
  'check-bg-m',
  'new',
  'gif',
  'jpg',
  'pdf',
  'png',
  'xlsx',
  'zip',
  'share',
  'share-n',
  'share-w',
  'menu-b',
  'menu-b active',
  'upload',
  'box-w',
  'home-w',
  'delivery-w',
  'DIRECTOR',
  'MANAGER',
  'NATIONAL_DIRECTOR',
  'PLANNER',
  'SENIOR_DIRECTOR',
  'SENIOR_MANAGER',
  'TEAM_LEADER',
  'kakao-circle',
  'naver-circle',
  'speaker',
  'examine',
  'receipt',
  'registration',
  'reply',
  'toggle-menu-n',
  'notic-advancement',
  'notic-alarm',
  'notic-allowance',
  'notic-benefit',
  'notic-delivery',
  'notic-inquiry',
  'notic-new',
  'notic-order',
  'notic-statistics',
  'notic-subscription',
  'video',
  'play-w',
  'pause-w',
  'map',
  'map active'
]

</script>

<style lang="scss">
.guide h2 {
  font-size: 18px;
}

.guide h3 {
  font-size: 12px;
  margin: 5px;
}

.box_style {
  padding: 20px;
  border: 1px solid #ccc;
  background: #fff;
  margin-bottom: 20px;
  overflow: hidden;
}

.box_style > strong {
  display: inline-block;
}

.rag-red {
  background-color: lightcoral;
}
.rag-green {
  background-color: lightgreen;
}
.rag-amber {
  background-color: lightsalmon;
}

.rag-red-outer .rag-element {
  background-color: lightcoral;
}

.rag-green-outer .rag-element {
  background-color: lightgreen;
}

.rag-amber-outer .rag-element {
  background-color: lightsalmon;
}

.icon-guide-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 32px;
  padding: 20px;
  background: #ddd;
  border-radius: 24px;

  li {
    width: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    height: 83px;
    text-align: center;

  }
}
</style>
