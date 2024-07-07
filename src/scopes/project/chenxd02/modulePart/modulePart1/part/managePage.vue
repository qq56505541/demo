<template>
  <div style="height:100%">
    <ta-border-layout :show-padding="false">
      <div slot="left" style="width: 300px">
        <ta-card id="info" :bordered="false">
          <p>
            <span style="display: block;margin-bottom: 20px;color: grey;cursor: pointer" @click="backToList">
              < 返回患者列表
            </span>
            <span>
              <ta-avatar :size="64" icon="user" :src="getImg(paitentInfo.paSex)"/>
            </span>
            <span style="float: right;margin-right: 80px;margin-top: 10px">
              <div style="font-size: large;color: black">
                {{ paitentInfo.paName }}
              </div>
              <div>
                {{ CollectionLabel('SEX',paitentInfo.paSex) }}/{{ paitentInfo.paAge }}岁
              </div>
            </span>
          </p>
          <p style="margin-bottom: 30px">
            身份证号: {{ paitentInfo.paIdcard }}
            <ta-icon type="edit" theme="twoTone" @click="showEditIdcardPage=true" style="float: right;font-size: 16px"/>
          </p>
          <p style="margin-bottom: 30px;color: black">
            基本资料
            <ta-icon type="edit" theme="twoTone" style="float: right;font-size: 16px"/>
          </p>
          <p style="margin-left: 26px">
            民族: {{ paitentInfo.paNation===null?'暂无':CollectionLabel('NATION',paitentInfo.paNation) }}
          </p>
          <p style="margin-left: 26px">
            职业: {{ paitentInfo.profession===null?'暂无':CollectionLabel('PROFESSION',paitentInfo.profession) }}
          </p>
          <p>婚姻状况: {{ paitentInfo.isMarriage===null?'暂无':CollectionLabel('MARRY',paitentInfo.isMarriage) }}</p>
          <p style="margin-left: 26px">
            籍贯: {{ paitentInfo.nativePlace===null?'暂无':paitentInfo.nativePlace }}
          </p>
          <p>文化程度: {{ paitentInfo.educationDegree===null?'暂无':CollectionLabel('EDUCATION',paitentInfo.educationDegree) }}</p>
          <p style="margin-left: 26px">
            标签: {{ paitentInfo.editPatientTags===null?'暂无':paitentInfo.editPatientTags }}
          </p>
          <p style="margin-left: 26px">
            备注: {{ paitentInfo.note===null?'暂无':paitentInfo.note }}
          </p>
        </ta-card>
      </div>
      <ta-border-layout :show-border="false">
        <div>
          <ta-tabs
            v-model="activeKey"
            type="editable-card"
          >
            <ta-tab-pane v-for="pane in panes" :key="pane.key" :tab="pane.title" :closable="pane.closable">
              <ta-button type="primary"  icon="plus" style="margin-bottom: 20px">新增门诊</ta-button>
              <p style="margin-bottom: 30px;">
                病史小结
                <ta-icon type="edit" theme="twoTone" style="margin-left: 50px" @click="changeSummaryType" />
              </p>
              <ta-card v-if="summaryType=='card'" :bordered="false">
                <p style="margin-left: 118px">
                  主述： {{ handleNULL(patientSummary.chiefComplaint) }}
                </p>
                <p style="margin-left: 118px">
                  体重： {{ handleNULL(patientSummary.weight) }}
                </p>
                <p style="margin-left: 88px">
                  西医诊断： {{ handleNULL(patientSummary.westernDiagnosis) }}
                </p>
                <p style="margin-left:88px">
                  中医诊断： {{ handleNULL(patientSummary.chineseDiagnosis) }}
                </p>
                <p style="margin-left: 120px">
                  证型：{{ handleNULL(patientSummary.chineseDisease) }}
                </p>
                <p style="margin-left: 64px">
                  当前治疗方式：{{ handleNULL(patientSummary.treatment) }}
                </p>
                <p style="margin-left: 64px">
                  最近中医处方：{{ handleNULL(patientSummary.lastCmsDate) }}
                </p>
                <p style="margin-left: 76px">
                  最新CT结论：{{ handleNULL(patientSummary.ct) }}
                </p>
                <p style="margin-left: 64px">
                  最新病理结论：{{ handleNULL(patientSummary.pathology) }}
                </p>
              </ta-card>

              <table v-else align="center" border="1" cellspacing="0" cellpadding="5" width="900" height="200">
                <tr style="text-align: center;" >
                  <td >
                    主述
                  </td>
                  <td width="40">
                    体重
                  </td>
                  <td>西医诊断</td>
                  <td>中医诊断</td>
                  <td>证型</td>
                  <td>当前治疗方式</td>
                  <td>最近中医处方</td>
                  <td>最新CT结论</td>
                  <td>最新病理结论</td>
                </tr>
                <tr style="text-align: center;" >
                  <td> {{ handleNULL(patientSummary.chiefComplaint) }}</td>
                  <td>{{ handleNULL(patientSummary.weight) }}</td>
                  <td> {{ handleNULL(patientSummary.westernDiagnosis) }}</td>
                  <td> {{ handleNULL(patientSummary.chineseDiagnosis) }}</td>
                  <td>{{ handleNULL(patientSummary.chineseDisease) }}</td>
                  <td>{{ handleNULL(patientSummary.treatment) }}</td>
                  <td>{{ handleNULL(patientSummary.lastCmsDate) }}</td>
                  <td>{{ handleNULL(patientSummary.ct) }}</td>
                  <td>{{ handleNULL(patientSummary.pathology) }}</td>
                </tr>
              </table>
            </ta-tab-pane>
          </ta-tabs>
          </ta-tab-pane>
        </div>
      </ta-border-layout>
    </ta-border-layout>
    <edit-idcard :visible="showEditIdcardPage" :pa-idcard="paitentInfo.paIdcard" @cancel="handleCancel" />
  </div>
</template>

<script>
import editIdcard from './editIdcard'
export default {
  name: 'managePage',
  components: { editIdcard, },
  data () {
    const panes = [
      { title: '档案首页', content: 'Content of Tab 1', key: '1', closable: false, },
      { title: '记录门诊', content: 'Content of Tab 2', key: '2', closable: false, },
      { title: '历史门诊', content: 'Content of Tab 3', key: '3', closable: false, },
      { title: '历史指标', content: 'Content of Tab 2', key: '4', closable: false, },
      { title: '随访管理', content: 'Content of Tab 3', key: '5', closable: false, },
      { title: '留言咨询', content: 'Content of Tab 3', key: '6', closable: false, }
    ]
    return {
      summaryType: 'card',
      showEditIdcardPage: false,
      panes,
      activeKey: panes[0].key,
      paitentInfo: {},
      patientSummary: {},
      newTabIndex: 0,
    }
  },
  mounted () {
    Base.submit(null, {
      url: 'basePatient/getPatient',
      data: {
        patientId: this.$route.query.patientId,
      },
    }).then((data) => {
      this.$nextTick(() => {
        this.paitentInfo = data.data.patient
      })
    })
    Base.submit(null, {
      url: 'outpatient/queryPatientSummary',
      data: {
        patientId: this.$route.query.patientId,
      },
    }).then((data) => {
      this.$nextTick(() => {
        this.patientSummary = data.data.summary == null ? {} : data.data.summary
      })
    })
  },
  methods: {
    getImg (sex) {
      if (sex === '1') return require('../../../../../../p1.png')
      else return require('../../../../../../p0.png')
    },
    handleNULL (data) {
      if (data == null) {
        return '暂无'
      }
      return data
    },
    changeSummaryType () {
      this.summaryType === 'card' ? this.summaryType = 'table' : this.summaryType = 'card'
    },
    handleCancel () {
      this.showEditIdcardPage = false
    },
    backToList () {
      this.$router.back()
    },
  },
}
</script>

<style scoped>
#info p {
  font-size: small;
  color: gray;

}
</style>
