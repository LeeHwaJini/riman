<template>
  <div class="wrap">
    <!-- contents -->
    <section class="box">
      <h1>common</h1>
      <div class="box__div">
        <div class="box__wrap">
          <p>
            <b>gap</b> : 10px
          </p>
        </div>
      </div>
    </section>
    <section class="box">
      <h1>box wrap</h1>
      <p>
        <b>class : box__wrap</b>
      </p>
      <div class="box__div">
        <h2>type : default</h2>
        <p>
          <b>width</b> : 100%
        </p>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box__div">
        <h2>type : default *2</h2>
        <p>
          <b>width</b> : 50% + 50%
        </p>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
          <div class="box-item">
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="box">
      <h1>box-item</h1>
      <p>
        <b>class : box-item</b>
      </p>
      <div class="box__div">
        <h2>type : default</h2>
        <p>
          <b>width</b> : 50% + 50%
        </p>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>

          <div class="box-item">
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box__div">
        <h2>type : box-item--120</h2>
        <p>
          <b>width</b> : 60% + 40%
        </p>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>

          <div class="box-item">
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box__div">
        <h2>type : box-item--140</h2>
        <p>
          <b>width</b> : 70% + 30%
        </p>
        <div class="box__wrap">
          <div class="box-item box-item--140">
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>

          <div class="box-item">
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box__div">
        <h2>type : box-item--right</h2>
        <p>
          <b>align</b> : right
        </p>
        <div class="box__wrap">
          <div class="box-item"/>
          <div class="box-item box-item--right">
            <div class="option-wrap">
              <!-- item width 값 필수 -->
              <q-btn class="button button--square button--reset" />
              <q-btn
                class="button button--search button--success"
                label="검색"
              />
              <q-btn
                class="button"
                label="테스트"
                style="width:120px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="box">
      <h1>item</h1>
      <p>
        <b>class : item</b>
      </p>
      <div class="box__div">
        <h2>type : default (100%/3)</h2>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box__div">
        <h2>type : item--2 (100%/2)</h2>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item item--2">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box__div">
        <h2>type : item--4 (100%/4)</h2>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box__div">
        <h2>type : item--5 (100%/5)</h2>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box__div">
        <h2>type : item--6 (100%/6)</h2>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item item--6">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box__div">
        <h2>type : item--full (100%)</h2>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item item--full">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>

      <div class="box__div">
        <h2>type : mix item--4 + item--full</h2>
        <div class="box__wrap">
          <div class="box-item">
            <div class="item item--4">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
            <div class="item item--full">
              <q-select
                v-model="selectModel"
                :options="selectOptions"
                emit-value
                map-options
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import { ref } from 'vue'

// const { proxy } = getCurrentInstance()
const selectModel = ref('test')
const selectOptions = [
  { label: 'test1', value: 'test1' },
  { label: 'test2', value: 'test2' }
]

</script>

<style lang="scss" scoped>
.box h1 {
  margin: 40px 0;
  font-size: 30px;
  font-weight: bold;
}
.box h2 {
  font-size: 18px;
  font-weight: 500;
  line-height: 40px;
}
.box__div {
  padding: 40px;
  border-bottom: 1px solid #dedede;
  background-color: #fff;
  & ~ .box__div {
    margin-top: 30px;
  }
}

.box-item {
  border: 1px solid #6a3de6;
}
</style>
