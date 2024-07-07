<template>
  <div style="height: 100%">
    <ta-border-layout>
      <ta-card slot="header">
        <ta-row>
          <ta-col :span="4">
            <ta-button type="primary" @click="addPatient">
              新增患者
            </ta-button>
          </ta-col>
          <ta-col :span="20">
            <div id="tool-bar" style="float:right">
              <div id="switch-box">
                <ta-radio-group default-value="table" @change="renderShow">
                  <ta-radio-button value="table">
                    <ta-icon type="bars" />
                  </ta-radio-button>
                  <ta-radio-button value="list">
                    <ta-icon type="appstore" />
                  </ta-radio-button>
                </ta-radio-group>
              </div>
              <div id="advanced-select-box">
                <ta-search-panel :form="advanceSearchForm" id='form1' @search="advancedSubmit" :height="200" placement="bottom">
                  <ta-button slot="target">高级搜索</ta-button>
                  <div slot="formPanel">
                    <ta-form :autoFormCreate="(form)=>{this.advanceSearchForm = form}">
                      <template v-if="advanceSearchForm">
                        <ta-form-item label='姓名' fieldDecoratorId="searchText">
                          <ta-input />
                        </ta-form-item>
                      </template>
                    </ta-form>
                  </div>
                </ta-search-panel>
              </div>
              <div id="select-box">
                <ta-form
                  layout="inline"
                  :form-layout="true"
                  :auto-form-create="(form)=>{this.searchForm = form}"
                >
                  <ta-form-item field-decorator-id="searchText">
                    <ta-input placeholder="请输入患者姓名或身份证号查询" />
                  </ta-form-item>
                  <ta-form-item>
                    <ta-button type="primary" @click="onSubmit">
                      提交
                    </ta-button>
                  </ta-form-item>
                  <ta-form-item><ta-button @click="reset">重置</ta-button></ta-form-item>
                </ta-form>
              </div>
            </div>
          </ta-col>
        </ta-row>
      </ta-card>
      <ta-card>
        <div v-if="renderShowFlag" id="1">
          <ta-big-table
            ref="table"
            :data="tableData"
            :edit-config="{trigger: 'click', mode: 'cell', showStatus: true}"
            @cell-click="showTel"
          >
            <ta-big-table-column title="ID" field="patientId" />
            <ta-big-table-column title="姓名" field="paName" />
            <ta-big-table-column title="性别" field="paSex" :formatter="formatterSex" />
            <ta-big-table-column title="年龄" field="paAge" />
            <ta-big-table-column title="联系电话" field="telMask">
              <template v-slot="{ row }" >
                <span style="color: #00a9ff">
                  {{ row.tel }}
                </span>
              </template>
            </ta-big-table-column>
            <ta-big-table-column title="西医病种" field="drags" />
            <ta-big-table-column title="操作">
              <span slot-scope="rowInfo">
                <ta-table-operate :operate-menu="operateMenu" :row-info="rowInfo" />
              </span>
            </ta-big-table-column>
            <ta-big-table-column title="状态" field="treatStatus" :formatter="formatterStatus" />
            <ta-big-table-column title="最近就诊时间" field="lastTime" />
            <ta-big-table-column title="建卡日期" field="createTime" />
            <ta-big-table-column title="" field="knowWay" :visible="false"/>
          </ta-big-table>
        </div>

        <div v-if="!renderShowFlag" id="2">
          <ta-list
            :grid="{ gutter: 24, column: 4 }"
            :data-source="tableData"
            size="large"
          >
            <ta-list-item slot="renderItem" slot-scope="item, index" style="width: 300px;height: 300px">
              <ta-card>
                <ta-row>
                  <ta-col :span="12">
                    <img v-if="item.paSex === '1'" src="../img/p1.jpg">
                    <img v-else src="../img/p0.jpg">
                  </ta-col>
                  <ta-col :span="12">
                    <h2>{{ item.paName }}</h2>
                    <p> {{ item.paSex ? (item.paSex === '2' ? '女' : '男'):'未知' }}/{{ item.paAge }}岁</p>
                  </ta-col>
                  <ta-col :span="24">
                    ID：{{ item.patientId }}
                  </ta-col>
                  <ta-col id="tel"  :span="24">
                    联系电话：
                    <p @click="showTel1(item)" style="color: #00a9ff">
                      {{ item.tel }}
                    </p>
                  </ta-col>
                  <ta-col :span="24">
                    西医就诊：{{ item.drags ? item.drags :'未知' }}
                  </ta-col>
                  <ta-col :span="24">
                    就诊状态：{{ item.treatStatus === 1 ? '治疗中' : '未治疗' }}
                  </ta-col>
                  <ta-col :span="24">
                    最近就诊：{{ item.lastTime }}
                  </ta-col>
                  <ta-col :span="24">
                    创建档案：{{ item.createTime }}
                  </ta-col>
                  <ta-col :span="24">
                    <ta-button type="primary" style="width: 100%;float: bottom" @click="onClickEdit(item)">
                      操作
                    </ta-button>
                  </ta-col>
                </ta-row>
              </ta-card>
            </ta-list-item>
          </ta-list>
        </div>
        <ta-pagination
          ref="gridPager"
          style="text-align: center;margin-top: 10px"
          :data-source.sync="tableData"
          :total= "total"
          :params="returnCondition"
        />
      </ta-card>
    </ta-border-layout>
    <add-patient :visible="addPatientVisible" ref="add" :title="title" :patientId="currentPatientId" @cancel="addPatientCancel" @add="add" @edit="edit"/>
  </div>
</template>

<script>
import addPatient from '@/scopes/project/demoTest/modulePart/modulePart1/part/addPatient'
export default {
  name: 'modulePart1',
  components: {
    // selectPatient,
    addPatient,
  },
  data () {
    return {
      advanceSearchForm: null,
      currentPatientId: '',
      title: '新增患者',
      total: 6,
      renderShowFlag: true,
      originData: [
        {
          paSex: '1',
          patientId: '1',
          paAge: '23',
          telMask: '13912345678',
          paName: '王1',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102199910108614',
          paBirth: '2001-01-01',
          knowWay: '',
        },
        {
          paSex: '1',
          patientId: '2',
          paAge: '23',
          telMask: '14912345678',
          paName: '王2',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102196105188275',
          knowWay: '',
        },
        {
          paSex: '1',
          patientId: '3',
          paAge: '23',
          telMask: '15912345678',
          paName: '王3',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102201402134357',
          knowWay: '',
        },
        {
          paSex: '1',
          patientId: '4',
          paAge: '23',
          telMask: '16912345678',
          paName: '王4',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102202202167458',
          knowWay: '',
        },
        {
          paSex: '1',
          patientId: '5',
          paAge: '23',
          telMask: '17912345678',
          paName: '王',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102200205022474',
          knowWay: '',
        },
        {
          paSex: '2',
          patientId: '6',
          paAge: '23',
          telMask: '18912345678',
          paName: '王',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102196105188275',
          knowWay: '',
        }
      ],
      tableData: [
        {
          paSex: '1',
          patientId: '1',
          paAge: '23',
          telMask: '13912345678',
          paName: '王1',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102199910108614',
          paBirth: '2001-01-01',
          knowWay: '',
        },
        {
          paSex: '1',
          patientId: '2',
          paAge: '23',
          telMask: '14912345678',
          paName: '王2',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102196105188275',
          knowWay: '',
        },
        {
          paSex: '1',
          patientId: '3',
          paAge: '23',
          telMask: '15912345678',
          paName: '王3',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102201402134357',
          knowWay: '',
        },
        {
          paSex: '1',
          patientId: '4',
          paAge: '23',
          telMask: '16912345678',
          paName: '王4',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102202202167458',
          knowWay: '',
        },
        {
          paSex: '1',
          patientId: '5',
          paAge: '23',
          telMask: '17912345678',
          paName: '王',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102200205022474',
          knowWay: '',
        },
        {
          paSex: '2',
          patientId: '6',
          paAge: '23',
          telMask: '18912345678',
          paName: '王',
          treatStatus: '1',
          drags: '霍奇金淋巴症',
          lastTime: '2000-01-05',
          createTime: '2000-01-04',
          tel: '点击查看',
          idCard: '110102196105188275',
          knowWay: '',
        }
      ],
      operateMenu: [],
      addPatientVisible: false,
      selectPatientVisible: false,
      selectData: {},
      selectCondition: {},
      advanceSelectCondition: {},
    }
  },
  mounted () {
    this.loadTable()
  },
  created () {
    setTimeout(() => {
      this.operateMenu = [
        {
          name: '管理',
          onClick: (record, index) => {
            this.onClickEdit(record)
          },
        }
      ]
    }, 0)
  },
  methods: {
    onClickEdit (record) {
      this.addPatientVisible = true
      this.title = '编辑'
      this.$refs.add.$nextTick(() => {
        this.$refs.add.addForm.setFieldsValue(record)
        this.currentPatientId = record.patientId
      })
    },
    edit (data) {
      this.tableData.forEach(item => {
        if (item.patientId === data.patientId) {
          this.$set(item, 'paName', data.paName)
          this.$set(item, 'paSex', data.paSex)
          this.$set(item, 'idCard', data.idCard)
          this.$set(item, 'paBirth', data.paBirth)
          this.$set(item, 'paAge', data.paAge)
          this.$set(item, 'telMask', data.telMask)
          this.$set(item, 'knowWay', data.knowWay)
        }
      })
      if(this.table){
        this.$refs.table.reloadData(this.tableData)
      }

      this.addPatientVisible = false
    },
    routerPush (id) {
      this.$router.push({ name: 'modulePart2', params: { id: id, }, })
    },
    loadTable () {
      this.$refs.gridPager.loadData()
    },
    renderShow (e) {
      if (e.target.value === 'table') {
        this.renderShowFlag = true
      } else if (e.target.value === 'list') {
        this.renderShowFlag = false
      }
    },
    onSubmit () {
      const table = []
      this.tableData.forEach(obj => {
        if (this.searchForm.getFieldValue('searchText') === undefined ||obj.paName === this.searchForm.getFieldValue('searchText')){
          table.push(obj)
        }
      })
      this.tableData = table
      this.$refs.table.reloadData(this.tableData)
    },
    advancedSubmit () {
      const table = []
      this.tableData.forEach(obj => {
        if (this.advanceSearchForm.getFieldValue('searchText') === undefined || obj.paName === this.advanceSearchForm.getFieldValue('searchText')){
          table.push(obj)
        }
      })
      this.tableData = table
      this.$refs.table.reloadData(this.tableData)
    },
    formatterSex ({ cellValue, }) {
      return cellValue ? (cellValue === '2' ? '女' : '男') : '未知'
    },
    formatterStatus ({ cellValue, }) {
      return cellValue ? (cellValue === '1' ? '已治疗' : '未治疗') : '未知'
    },
    returnCondition () {
      return this.selectCondition
    },
    showTel ({ row, }) {
      row.tel = row.telMask
    },
    showTel1 (item) {
      item.tel = item.telMask
    },
    addPatient () {
      this.addPatientVisible = true
      this.title = '新增'
    },
    addPatientCancel () {
      this.addPatientVisible = false
    },
    selectPatientCancel () {
      this.selectPatientVisible = false
    },
    selectPatient () {
      this.selectPatientVisible = true
    },
    reset () {
      this.selectCondition = {}
      this.tableData = JSON.parse(JSON.stringify(this.originData))
      this.searchForm.resetFields()
      // this.loadTable()
    },
    add (data) {
      this.originData.push(data)
      this.tableData.push(data)
      this.total++
      this.addPatientVisible = false
    },
  },
}
</script>

<style scoped type="text/less">
#tool-bar{
  display: flex;
}
#select-box{
  margin-left: 50px;
  height: 50px;
}
#tel{
  display: flex;
}
</style>
