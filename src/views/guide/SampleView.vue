<template>
  <div class="wrap">
    <section class="guide">
      <div class="box_style">
        <div class="w550 inblock">
          <RButton label="로그인" @click="onLogin"/>
        </div>
      </div>
      <div v-if="addressData" class="box_style">
        <div class="w550 inblock">
          ▣ 주소 목록 <br>
          <ul v-for="addr in addressData" :key="addr.userAddressId">
            <li>
              ---------------
            </li>
            <li>
              userAddressId : {{ addr.userAddressId }}
            </li>
            <li>
              addressName : {{ addr.addressName }}
            </li>
            <li>
              firstName : {{ addr.firstName }}
            </li>
            <li>
              lastName : {{ addr.lastName }}
            </li>
            <li>
              mobileNumber : {{ addr.mobileNumber }}
            </li>
            <li>
              address1 : {{ addr.address1 }}
            </li>
            <li>
              address2 : {{ addr.address2 }}
            </li>
            <li>
              city : {{ addr.city }}
            </li>
            <li>
              state : {{ addr.state }}
            </li>
          </ul>
        </div>
      </div>
      <div class="box_style">
        <div class="w550 inblock">
          <RButton label="주소 저장하기" @click="createAddress"/>
        </div>
      </div>
      <div class="box_style">
        <div class="w550 inblock">
          <RButton label="주소 수정하기" @click="updateAddress"/>
        </div>
      </div>
      <div class="box_style">
        <div class="w550 inblock">
          <RButton label="주소 삭제하기" @click="deleteAddress"/>
        </div>
      </div>
      <div class="box_style">
        <div class="w550 inblock">
          ▣ 상품 목록 <br>
          <!-- {{ prodData.length }} -->
          <ul v-for="(prod, idx) in prodData" :key="idx">
            <li>
              ---------------
            </li>
            <li>
              productId : {{ prod.productId }}
            </li>
            <li>
              productName : {{ prod.productName }}
            </li>
          </ul>
          <RButton label="1" @click="changePage(1)"/>
          <RButton label="2" @click="changePage(2)"/>
          <RButton label="3" @click="changePage(3)"/>
        </div>
        <div v-if="isProdError" class="w550 inblock">
          상품 목록 조회 시 오류 발생 <br>
          error : {{ prodError }} <br>
          isProdError : {{ isProdError }}
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useMainStore } from '@store/mainStore'
import sampleService from '@/http/services/sample'
import { reactive } from 'vue'

const mainStore = useMainStore()

const onLogin = async () => {
  const params = {
    id: 8030164189,
    password: 'test1234!!@A'
  }
  const result = await mainStore.onLogin(params)

  if (result) {
    alert(`${params.id}님 환영합니다.`)
  }
}

const { data: addressData } = sampleService.getAddressList()

const { mutate: createAddrMutate } = sampleService.createAddress()
const createAddress = () => {
  const payload = {
    address1: 'test 3',
    addressDescription: 'Test3',
    area: 'Kowloon(九龍)',
    city: 'Hong Kong',
    firstName: 'test',
    lastName: 'three',
    phoneNumber: '33333333'
  }
  createAddrMutate(payload, {
    onSuccess: (data) => {
      console.log('createAddrMutate success data : ', data)
      alert('저장되었습니다.')
    },
    onError: (error) => {
      console.log('createAddrMutate error : ', error)
      alert('저장 중 오류가 발생했습니다.')
    }
  })
}

const { mutate: updateAddrMutate } = sampleService.updateAddress()
const updateAddress = () => {
  const payload = {
    userAddressId: addressData.value[addressData.value.length - 2].userAddressId,
    address1: 'test 4 modify',
    addressDescription: 'Test4 modify',
    area: 'Kowloon(九龍)',
    city: 'Hong Kong',
    firstName: 'test 4',
    lastName: 'four',
    phoneNumber: '41414141'
  }

  updateAddrMutate(payload, {
    onSuccess: (data) => {
      console.log('updateAddrMutate data : ', data)
      alert('수정되었습니다.')
    },
    onError: (error) => {
      console.log('createAddrMutate error : ', error)
      alert('수정 중 오류가 발생했습니다.')
    }
  })
}

const { mutate: deleteAddrMutate } = sampleService.deleteAddress()
const deleteAddress = () => {
  deleteAddrMutate(addressData.value[addressData.value.length - 1].userAddressId, {
    onSuccess: (data) => {
      console.log('deleteAddrMutate data : ', data)
      alert('삭제되었습니다.')
    },
    onError: (error) => {
      console.log('deleteAddrMutate error : ', error)
      alert('삭제 중 오류가 발생했습니다.')
    }
  })
}

const pageInfo = reactive({
  pageNumber: 1,
  pageSize: 5
})
const { data: prodData, isError: isProdError, error: prodError } = sampleService.getProductList(pageInfo)
const changePage = (num) => {
  pageInfo.pageNumber = num
  console.log('changePage pageInfo.pageNumber : ', pageInfo.pageNumber)
}

</script>

<style lang="scss" scoped>
.w550 {
  width: 550px
}
</style>
