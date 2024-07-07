<template>
  <div>
    <ta-row type="flex" justify="space-around" align="middle" :gutter=[16,16]>
      <ta-col v-for="patient in patientList" :key="patient.patientId" :span="5">
        <ta-card bordered>
          <p>
            <span>
              <ta-avatar :size="64" icon="user" :src="getImg(patient.paSex )" />
            </span>
            <span style="float: right;margin-right: 30px;margin-top: 10px">
              <div style="font-size: large;color: black;">
                {{ handleLongName(patient.paName) }}
              </div>
              <div>
                {{ CollectionLabel('SEX',patient.paSex) }}/{{ patient.paAge }}岁
              </div>
            </span>
          </p>
          <p>ID: {{ patient.patientId }}</p>
          <p>
            联系电话:
            <span style="font-size:15px;color: #00bfff;cursor: pointer" @click="checkPatientTel(patient.patientId)"> {{ patient.telMask }}</span>
          </p>
          <p>西医就诊: {{ patient.drgs }}</p>
          <p>就诊状态: {{ CollectionLabel('TREATSTATUS',patient.treatStatus) }}</p>
          <p>最近就诊: {{ patient.lastTime }}</p>
          <p>创建档案: {{ patient.createTime }}</p>
          <p>
            <ta-button style="width: 100%;" type="primary" @click="managePage(patient.patientId)">
              管理
            </ta-button>
          </p>
        </ta-card>
      </ta-col>
    </ta-row>
  </div>
</template>

<script>
export default {
  name: 'patientCardList',
  props: {
    patientList: {
      type: [],
    },
  },
  data () {
    return {

    }
  },

  methods: {
    handleLongName (paName) {
      if (paName.length > 5) {
        return paName.substring(0, 5)
      }
      return paName
    },
    getImg (sex) {
      if (sex === '1') return require('../../../../../../p1.png')
      else return require('../../../../../../p0.png')
    },
    checkPatientTel (patientId) {
      this.$emit('checkTel', patientId)
    },
    managePage (patientId) {
      this.$router.push({
        name: 'managePage',
        query: {
          patientId: patientId,
        },
      })
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
