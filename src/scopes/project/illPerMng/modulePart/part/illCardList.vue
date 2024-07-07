<template>
  <div>
    <ta-list
      :grid="{ gutter: 24, column: 4 }"
      :data-source="illList"
      size="large"
    >
      <ta-list-item slot="renderItem" slot-scope="item, index" style="width: 300px;height: 300px">
        <ta-card>
          <ta-row>
            <ta-col :span="12">
              <ta-avatar :size="64" icon="user" :src="getImg(item.illSex)" />
            </ta-col>
            <ta-col :span="12">
              <h2>{{ item.illName }}</h2>
              <p> {{ CollectionLabel('SEX',item.illSex) }}/{{ item.illAge }}岁</p>
            </ta-col>
            <ta-col :span="24">
              ID：{{ item.illId }}
            </ta-col>
            <ta-col id="tel" :span="24">
              <p>
                联系电话:
                <span style="color: #00a9ff;"> {{ item.illPhone }}</span>
              </p>
            </ta-col>
            <ta-col :span="24">
              西医就诊：{{ item.illType }}
            </ta-col>
            <ta-col :span="24">
              就诊状态：{{ item.illState }}
            </ta-col>
            <ta-col :span="24">
              最近就诊：{{ item.lastDate }}
            </ta-col>
            <ta-col :span="24">
              创建档案：{{ item.createDate }}
            </ta-col>
            <ta-col :span="24">
              <ta-button type="primary" style="width: 100%;float: bottom" @click="editRow(item)">
                编辑
              </ta-button>
            </ta-col>
          </ta-row>
        </ta-card>
      </ta-list-item>
    </ta-list>
    <!--    <ta-row type="flex" justify="space-around" align="middle" :gutter="[16,16]">-->
    <!--      <ta-col v-for="illPer in illList" :key="illPer.illId" :span="5">-->
    <!--        <ta-card bordered>-->
    <!--          <p>-->
    <!--            <span>-->
    <!--              <ta-avatar :size="64" icon="user" :src="getImg(illPer.illSex)" />-->
    <!--            </span>-->
    <!--            <span style="float: right;margin-right: 30px;margin-top: 10px">-->
    <!--              <div style="font-size: large;color: black;">-->
    <!--                {{ illPer.illName }}-->
    <!--              </div>-->
    <!--              <div>-->
    <!--                {{ CollectionLabel('SEX',illPer.illSex) }}/{{ illPer.illAge }}岁-->
    <!--              </div>-->
    <!--            </span>-->
    <!--          </p>-->
    <!--          <p>ID: {{ illPer.illId }}</p>-->
    <!--          <p>-->
    <!--            联系电话:-->
    <!--            <span style="font-size:15px;color: #00bfff;cursor: pointer"> {{ illPer.illPhone }}</span>-->
    <!--          </p>-->
    <!--          <p>西医病种: {{ illPer.illType }}</p>-->
    <!--          <p>就诊状态: {{ CollectionLabel('TREATSTATUS',illPer.illState) }}</p>-->
    <!--          <p>最近就诊日期: {{ illPer.lastDate }}</p>-->
    <!--          <p>建卡日期: {{ illPer.createDate }}</p>-->
    <!--          <p>-->
    <!--            <ta-button style="width: 100%;" type="primary" @click="editRow(illPer)">-->
    <!--              编辑-->
    <!--            </ta-button>-->
    <!--          </p>-->
    <!--        </ta-card>-->
    <!--      </ta-col>-->
    <!--    </ta-row>-->
  </div>
</template>

<script>
export default {
  name: 'illCardList',
  props: {
    illList: {
      type: [],
    },
  },
  data () {
    return {
    }
  },
  methods: {
    getImg (sex) {
      if (sex === '1') return require('../img/man.jpg')
      else return require('../img/woman.jpg')
    },
    editRow (illPer) {
      this.$emit('editRow', illPer)
    },
  },
}
</script>

<style scoped>
p {
  font-size: small;
  color: gray;
}
</style>
