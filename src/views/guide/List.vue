<template>
  <div class="body">
    <div class="tit">
      <h1 class="text-h6">퍼블리싱 리스트</h1>
      <div ref="total" class="total" />
    </div>
    <table>
      <thead>
        <tr>
          <th>순번</th>
          <th>구분1</th>
          <th>구분2</th>
          <th>구분3</th>
          <th>구분4</th>
          <th>구분5</th>
          <th>url</th>
          <th>담당자</th>
          <th>비고</th>
        </tr>
      </thead>
      <tbody class="list">
        <tr>
          <td class="num">&nbsp;</td>
          <td>메인</td>
          <td>화면 대응(모바일, 태블릿, PC)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/')">@/views/home/Home.vue</td>
          <td class="center">최정민</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>멀티랭귀지(한글, 영어, 번체)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/')">@/views/home/Home.vue</td>
          <td class="center">최정민</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>회원가입</td>
          <td>회원가입 메인</td>
          <td></td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/signup/selectType')">@/views/signup/SelectType</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>회원가입</td>
          <td>Customer</td>
          <td>이메일회원가입</td>
          <td>추천인 선택</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/signup/selectReferrer')">@/views/signup/SelectReferrer</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>회원가입</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>본인인증</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/signup/verifyIdentity')">@/views/signup/VerifyIdentity</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>회원가입</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>정보입력</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/signup/enterInformation')">@/views/signup/EnterInformation</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>회원가입</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>약관동의</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/signup/agreeTerms')">@/views/signup/AgreeTerms</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>회원가입</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>회원가입완료</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/signup/complete')">@/views/signup/complete</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>카카오간편가입</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>네이버회원가입</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>Planner</td>
          <td>이메일회원가입(내국인)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>이메일회원가입(외국인)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>카카오간편가입</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>네이버회원가입</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>회원전환</td>
          <td>Universe → NM, 공식물 ->NM</td>
          <td>플래너</td>
          <td>정보입력</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/conversionToNM')">@/views/conversionToNM/(planner/customer)/*Information.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>완료</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/conversionToNM/complete')">@/views/conversionToNM/(planner/customer)/*Complete.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>커스터머</td>
          <td>본인인증</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/conversionToNM/customerCertificate')">@/views/conversionToNM/CustomerCertificate.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>정보입력</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/conversionToNM/customerEnterInformation')">@/views/conversionToNM/CustomerEnterInformation.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>완료</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/conversionToNM/customerResult')">@/views/conversionToNM/CustomerResult.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>로그인/아웃</td>
          <td>ID/PW 로그인</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/login')">@/views/auth/LoginView.vue</td>
          <td class="center">최정민</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>카카오 간편로그인</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>네이버 간편로그인</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>아이디 저장</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>자동 로그인</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>로그인 전/후 메뉴 노출(회원타입별)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최정민</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>비밀번호 6개월 경과</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>비회원 주문조회</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>ID/PW</td>
          <td>계정 찾기</td>
          <td>-</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/findAccount')">@/views/findUserInfo/findAccount/FindAccountMain</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td></td>
          <td>&nbsp;</td>
          <td>계정 찾기 완료</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/findAccount/result')">@/views/findUserInfo/findAccount/FindAccountRes</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>비밀번호 재설정</td>
          <td>-</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/resetPassword')">@/views/findUserInfo/resetPW/ResetPasswordMain</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>본인인증</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/resetPassword/auth')">@/views/findUserInfo/resetPW/ResetPasswordAuth</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>새로운 비밀번호 입력</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/resetPassword/result')">@/views/findUserInfo/resetPW/ResetPasswordRes</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>상품</td>
          <td>리스트(필터 및 소팅)</td>
          <td>-</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/product/skincare')">@/views/product/skincare</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>상세페이지</td>
          <td>컨텐츠(상품, 배송/환불)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/product/detail/613547323196188855')">@/views/product/${detailId}</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>기능(장바구니, 구매, 정기구매)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>장바구니</td>
          <td>일반</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/cart')">@/views/cart</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>정기구매(신규, 기존)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>주문</td>
          <td>주문서</td>
          <td>주문정보입력</td>
          <td>-</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/order')">@/views/order/Payment</td>
          <td class="center">강희범</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>포인트 조회</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">강희범</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>쿠폰 조회</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">강희범</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>최대할인</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">강희범</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>주문완료</td>
          <td>-</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/order/success')">@views/order/PaymentSuccess</td>
          <td class="center">강희범</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>비회원 주문</td>
          <td>주문자정보</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/order/nonuser/info')">@views/order/NonUserPaymentInfo</td>
          <td class="center">강희범</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>Easy Bag 주문</td>
          <td>회원</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">강희범</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>비회원</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">강희범</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>자주쓰는카드(마이페이지와 동일사용)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>배송지관리(배송정보저장 동일사용)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>(공통)우편번호검색(주소검색)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>결제</td>
          <td>결제하기</td>
          <td>신용카드(토스페이먼츠)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>간편결제(토스페이먼츠)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>가상계좌(토스페이먼츠)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>리만페이(토스페이먼츠)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>정기구매</td>
          <td>정기구매 정보 입력<br/>(결제일, 주소, 결제정보 설정 및 1회차 결제)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/autoship/init')">@views/autoship/AutoshipInitView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>정기구매</td>
          <td>정기구매 결제완료</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/autoship/paymentResult')">@views/autoship/autoshipPayResult</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>단종예정 알림</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>New & Hot</td>
          <td>공지사항/이벤트/뉴스 전체 페이지</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/update')">@views/update/UpdateList</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>공지사항</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/update/notice')">@views/update/NoticeList</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>공지사항 상세</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/update/notice/1')">@views/update/NoticeDetail</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>이벤트</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/update/event')">@views/update/EventList</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>이벤트 상세</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/update/event/1')">@views/update/EventDetail</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>뉴스</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/update/news')">@views/update/NewsList</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>뉴스 상세</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/update/news/1')">@views/update/NewsDetail</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>혜택</td>
          <td>할인쿠폰(HTML)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>멤버쉽(HTML)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>정기구매(HTML)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>신용카드(방식미정)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>Skin Quiz</td>
          <td>스킨퀴즈 or 오픈 API 활용</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>Shorts</td>
          <td>Shorts(Dive in List)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/diveIn')">@views/dive-in/DiveInListView.vue</td>
          <td class="center">&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>Shorts</td>
          <td>Shorts(Dive in Personal)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/diveIn/1')">@views/dive-in/DiveInView.vue</td>
          <td class="center">&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>How To</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>고객센터</td>
          <td>메인</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer')">@views/customer/CustomerMainView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td></td>
          <td>간편가이드</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer/guide')">@views/customer/buttons/EasyGuideView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td></td>
          <td>자료실</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer/resource')">@views/customer/buttons/ResourceRoomView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td></td>
          <td>증명서 발급</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer/certificate')">@views/customer/buttons/CertificateIssuanceView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td></td>
          <td>센터리스트</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer/center')">@views/customer/buttons/CenterListView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td></td>
          <td>센터찾기</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer/center/search')">@views/customer/buttons/CenterSearchView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td></td>
          <td>제휴제안</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer/partnership')">@views/customer/PartnershipView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td></td>
          <td>FAQ</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer/faq')">@views/customer/FaqView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>1:1 문의하기</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer/inquiry')">@views/customer/inquiry/InquiryWriteView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>1:1 문의내역 리스트</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer/inquiry/list')">@views/customer/inquiry/InquiryListView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>1:1 문의내역 디테일</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/customer/inquiry/detail/1')">@views/customer/inquiry/InquiryDetailView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>전화예약상담</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>고객의 소리</td>
          <td>검색</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/feedback/search')">@views/feedback/FeedbackSearchView</td>
          <td class="center"></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>등록</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/feedback/write')">@views/feedback/FeedbackSearchView</td>
          <td class="center"></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>내역</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/feedback')">@views/feedback/FeedbackListView</td>
          <td class="center"></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>상세</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/feedback/11')">@views/feedback/FeedbackDetailView</td>
          <td class="center"></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>비밀번호 재설정</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/feedback/resetpw')">@views/feedback/FeedbackResetPasswordView</td>
          <td class="center"></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>비밀번호 재설정 확인</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/feedback/resetpw/confirm')">@views/feedback/FeedbackResetPasswordConfirmView</td>
          <td class="center"></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>마이페이지</td>
          <td>마이페이지 메인</td>
          <td>회원연동</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage')">@/views/mypage/Mypage.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>주문연동</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>etc연동</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>비밀번호 변경</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/changePassWord')">@views/mypage/ChangePassword.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>플래너로 전환</td>
          <td>휴대폰인증</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/conversionToPlanner/certificate')">@views/mypage/conversionToPlanner/ConversionCertificate.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>정보작성</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/conversionToPlanner/enterInformation')">@views/mypage/conversionToPlanner/ConversionEnterInformation.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>약관동의</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/conversionToPlanner/agreeTerms')">@views/mypage/conversionToPlanner/ConversionAgreeTerms.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>완료</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/conversionToPlanner/complete')">@views/mypage/conversionToPlanner/ConversionComplete.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>수당 정보 관리</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/allowanceInfo')">@views/mypage/AllowanceInfo.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>내 정보 관리</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/userInfo')">@views/mypage/UserInfo.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>회원탈퇴(플래너)</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/plannerWithdrawal')">@views/mypage/PlannerWithdrawal.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>회원탈퇴(커스터머)</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/customerWithdrawal')">@views/mypage/CustomerWithdrawal.vue</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>플래너 서류확인</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/checkPlannerDocument')">@views/mypage/CheckPlannerDocument</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>주문(취소/반품)내역</td>
          <td>일반주문</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/orderList')">@views/mypage/order/OrderList</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>정기구매주문</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>Bag주문</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>영수증 발급</td>
          <td>신용카드, 거래확인서</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>배송현황(물류 연동 현황에 따라 기획 수정)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>반품신청</td>
          <td>일반주문(제품,수량선택, 사유, 첨부파일, 포인트회수 계산)</td>
          <td>step1</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/return/step1/1')">@views/mypage/return/RequestReturnStep1</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>step2</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/return/step2/1')">@views/mypage/return/RequestReturnStep2</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>step3</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/return/step3/1')">@views/mypage/return/RequestReturnStep3</td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>추가결제</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>반품완료 동의</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>정기구매주문</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>회수 API 연동</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">N/A</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>배송추적 API 연동</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">N/A</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>반품내역</td>
          <td>리스트<br/>(제품선택 → 사유선택 → 예상환불금액/동의)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/returnList')">@views/mypage/return/ReturnList</td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>상세</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/returnDetail/1')">@views/mypage/return/returnDetail</td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>정기구매 반품안내</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">나원서</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>포인트내역</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/point')">@views/mypage/point/PointView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>쿠폰내역</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/coupon')">@views/mypage/coupon/CouponView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>배송지관리(등록/삭제)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>정기구매관리<br/>(건너띄기, 즉시결제, 결제일, 주소, 결제정보, 제품변경)</td>
          <td>-</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/autoship')">@views/autoship/AutoshipView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>회차별상태</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>결제일변경</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>배송지변경</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>결제정보변경</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>제품변경,추가</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>즉시결제</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>철회신청</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>반품</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>퍼스널 몰 관리</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('mypage/personalMall')">@views/mypage/PersonalMall</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>Easy Bag 관리</td>
          <td>Bag 목록</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('mypage/easybag')">@views/mypage/easybag/EasyBagList</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>Bag 상세보기</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('mypage/easybag/1')">@views/mypage/easybag/EasyBagDetail</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>Bag 만들기</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('mypage/easybag/add/1')">@views/mypage/easybag/AddEasyBag1</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>Bag 링크 조회</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/beauty-planner/bag/633540048301589391')">@views/order/EasyBagOrder</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>리만페이 관리</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>정기구매 카드관리</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/mypage/autoshipCard')">@views/mypage/AutoshipCard</td>
          <td class="center">최정민,김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>계좌관리<br/>(플래너 대상, 수당지급 계좌 1원 테스트 후 계좌 인증함- 회원가입 후 안내 메시지 전송)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>SNS계정관리</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>알림내역</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>나의 문의내역</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>플래너전환(휴대폰인증, 추가정보 입력)</td>
          <td>스타터</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>정보수정</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>비밀번호변경</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>회원탈퇴(인증 및 탈퇴사유)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>퍼스널몰</td>
          <td>리뷰 필요(5/3)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">최지혜</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>검색</td>
          <td>상품 및 사이트 컨텐츠 검색<br/>(태그포함)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/search')">@views/search/Search.vue</td>
          <td class="center"></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>알림</td>
          <td>노티센터(읽지않은 알림이 있을 경우 표기)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/notification')">@views/notification/Notification.vue</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>About Us</td>
          <td>기업가치(미션, 비전, 가치)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/about/ev')">@view/about/EnterpriseValueView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>사회공헌</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/about/contribution')">@view/about/ContributionView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>센터 및 회사위치</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/about/location')">@view/about/LocationView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>R & D</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/about/rnd')">@view/about/RndView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>리만 발자취</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/about/history')">@view/about/HistoryView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>CI, BI</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/about/ci')">@view/about/CibiView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>비즈니스기회</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/about/business')">@view/about/BusinessChanceView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>ESG</td>
          <td>공정거래</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/esg/fair')">@view/esg/FairTradeView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>Ethics</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/esg/ethics')">@view/esg/EthicsView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>안전보건경영</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/esg/safety')">@view/esg/SafetyView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>소비자중심경영</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/esg/customer')">@view/esg/CustomerView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>사이버신고센터</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/esg/compliance')">@view/esg/ComplianceView</td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>Footer</td>
          <td>이용약관</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/use_terms')">@views/footer/Terms.vue</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>개인정보처리방침</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/privacy_policy')">@views/footer/Terms.vue</td>
          <td class="center">최지원</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>공정거래자율준수</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>평균후원수당공지</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>&nbsp;</td>
          <td>플래너확인</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">김류향</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>UMS</td>
          <td>각 영역별 정리(회원, 주문..)</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url"></td>
          <td class="center">N/A</td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td class="num">&nbsp;</td>
          <td>ETC</td>
          <td>외국인 플래너 가입&전환 재심사 (재등록) URL 페이지</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td class="url" @click="$router.push('/signupReject/111')">@views/signup/SignupReject.vue</td>
          <td class="center">N/A</td>
          <td>&nbsp;</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'List',
  mounted() {
    const numBlankArr = document.querySelectorAll('.num')
    const numEl = document.querySelectorAll('.url')
    numBlankArr.forEach((element, index) => {
      element.innerHTML = index + 1
    })
    let completeUrlCount = 0
    numEl.forEach((el) => {
      const urlCon = el.innerHTML
      if (urlCon && urlCon !== '&nbsp;') {
        completeUrlCount++
      }
    })
    function settleComplete() {
      return completeUrlCount * 100 / numEl.length
    }
    const completePercent = settleComplete()
    document.querySelector('.total').innerHTML = '총 본수 : ' + numEl.length + '본, 달성율 : ' + Math.round(completePercent) + '% <br> 작업 후 url을 넣으면 달성율이 계산됨'
  }
}
</script>

<style scoped>
table{width: 100%; border-top: solid 1px #ccc; border-right: solid 1px #ccc; border-collapse: collapse;}
th{text-align: center;}
th, td{border-bottom: solid 1px #ccc; border-left: solid 1px #ccc; padding: 1rem;}
.num{text-align: center;}
.center{text-align: center;}
.tit{ display: flex; justify-content: space-between; align-items: baseline;}
.total{font-weight: bold;margin-bottom: 10px;}
.url{cursor: pointer;}
</style>
