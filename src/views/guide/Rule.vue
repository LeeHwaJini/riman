<template>
  <div class="wrapA">
    <div class="wrap">
      <h1 class="text-h6">퍼블리싱 가이드</h1>
      <div>
        <h2 class="text-h6">네이밍 규칙</h2>
        <div>
          <h3 class="text-h6">기본 규칙</h3>
          <div>
            <h4 class="text-h6">일반 규칙</h4>
            <ul>
              <li>네이밍은 봤을 때 직관적인 단어를 선택한다
                <ul>
                  <li>좋은 예) 서비스명 및 폰트 명 크기 등을 실 사이즈로 표기</li>
                  <li>나쁜 예) style1, style2 처럼 알 수 없는 네이밍</li>
                  <li>이후 공통이 변경될 경우엔 네이밍은 그대로 두고 주석을 달아 이전 값을 표기해준다</li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div id="navId" ref="navId" class="nav">
      <div class="nav--ul">
        <ul>
          <li v-for="(item, index) in newNav" :key="index" :ref="item[1]" :class="[item[0], item[1]]" @click="go(item[1])">{{ item[2] }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Rule',
  data() {
    return {
      oriArr: [],
      navArr: [],
      goName: [],
      minusIdNav: [],
      arrangeNav: [],
      newNav: [],
      tempNav: ''
    }
  },
  mounted() {
    const tempArr = document.querySelectorAll('.wrapA h1, .wrapA h2, .wrapA h3, .wrapA h4, .wrapA h5, .wrapA h6')
    this.oriArr = Object.entries(tempArr).slice(1).map(entry => entry[1])
    this.oriArr.forEach((el) => {
      this.navArr.push(el.outerHTML)
      this.goName.push(el.getAttribute('id'))
    })
    this.navArr.forEach((el, index) => {
      this.minusIdNav.push(el.replace(/\ id.+"/g, ''))
      this.tempNav += `<a class="` + this.goName[index] + `" onclick="go('` + this.goName[index] + `')">` + this.minusIdNav[index] + '</a>'
    })
    tempArr.forEach((value) => {
      const tempRowArr = []
      tempRowArr.push(value.nodeName, value.getAttribute('id'), value.firstChild.data)
      this.newNav.push(tempRowArr)
    })
    this.newNav = this.newNav.slice(1)
    document.addEventListener('scroll', this.checkPos)
  },
  methods: {
    checkPos() {
      const arr = document.querySelectorAll('.nav > li')
    },
    go(tg) {
      const target = document.getElementById(tg).offsetTop
      window.scrollTo({ top: target, behavior: 'smooth' })
      const arr = document.querySelectorAll('.nav li')
      arr.forEach((el) => {
        el.classList.remove('active')
      })
    }
  }
}
</script>

<style scoped>
html{
  font-size: 10px;
}
body{
  font-size: 1.4rem;
  padding-bottom: 90rem;
}
h1 + *, h2 + *, h3 + *, h4 + *, h5 + *, h6 + *{
  margin-left: 2rem;
}
H2{
  margin-top: 6rem;
}
h3{
  margin-top: 4rem;
}
h4, h5{
  margin-top: 2rem;
}
table{
  border-top: solid .1rem #ccc;
  border-right: solid .1rem #ccc;
  border-collapse: collapse;
}
th, td{
  border-bottom: solid .1rem #ccc;
  border-left: solid .1rem #ccc;
  padding: 1rem;
}
ul, ol{
  padding-left: 2rem;
}
li{
  margin-top: 1rem;
}
li:first-child{
  margin-top: 0;
}
ul > li:first-child{
  margin-top: 1rem;
}
.wrapA{
  display: flex;
}
.wrap{
  width: 80%;
  box-sizing: border-box;
  padding: 2rem;
}
.nav{
  width: 20%;
  display: block;
  position: relative;
}
.nav a:hover{
  cursor: pointer;
  color: #666;
}
.nav--ul{
  display: block;
  position: sticky;
  top: 0;
  overflow: auto;
  height: calc(100vh - 10rem);
}
.nav h1, .nav h2, .nav h3, .nav h4, .nav h5, .nav h6{
  font-weight: lighter;
}
.nav .active h1, .nav .active h2, .nav .active h3, .nav .active h4, .nav .active h5, .nav .active h6{
  font-weight: bold;
}
</style>
