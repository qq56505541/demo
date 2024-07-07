<template>
  <div :style="{height: `${height}px`}">
    <ta-border-layout layout-type="fixTop">
      <ta-card slot="header" title="患者管理">
        <ta-button type="primary" style="text-align: left;margin-right: 480px" @click="handleToAdd">
          新增患者
        </ta-button>

        <span style="float: right">
          <ta-button @click="showCard">
            <ta-icon type="appstore" />
          </ta-button>
          <ta-button @click="showList">
            <ta-icon type="ordered-list" />
          </ta-button>
          <ta-input
            v-model="illInfo"
            placeholder="输入患者身份证或姓名进行查询"
            allow-clear
            style="width: 280px;"
          >
            <ta-icon slot="prefix" type="search" />
          </ta-input>
          <ta-button type="primary" @click="queryIllPerInfoList">
            查询
          </ta-button>
          <ta-button @click="resetQuery">重置</ta-button>
        </span>
      </ta-card>
      <ta-card v-if="dataType==='table'" class="fit">
        <ta-big-table
          ref="xTable"
          :data="tableData"
          border
        >
          <ta-big-table-column title="ID" field="illId" width="120" />
          <ta-big-table-column title="姓名" field="illName" show-overflow />
          <ta-big-table-column title="证件号码" field="illZjhm" show-overflow width="180" />
          <ta-big-table-column title="性别" field="illSex" collection-type="SEX" />
          <ta-big-table-column title="年龄" field="illAge" />
          <ta-big-table-column title="联系电话" field="illPhone" />
          <ta-big-table-column title="西医病种" field="illType" />
          <ta-big-table-column title="操作" width="280">
            <template slot-scope="rowInfo">
              <ta-table-operate :operate-menu="operateMenu" :row-info="rowInfo" />
            </template>
          </ta-big-table-column>
          <ta-big-table-column title="就诊状态" field="illState" />
          <ta-big-table-column title="最近就诊日期" field="lastDate" format="YYYY-MM-DD" type="date" />
          <ta-big-table-column title="建卡日期" field="createDate" format="YYYY-MM-DD" type="date" />
          <template #bottomBar>
            <ta-pagination
              ref="grider"
              url=""
              :params="paginationParams"
            />
          </template>
        </ta-big-table>
      </ta-card>
      <ta-card v-else class="fit">
        <ill-card-list
          :ill-list="tableData"
          @editRow="editRow"
        />
      </ta-card>
    </ta-border-layout>

    <!-- 新增或者编辑功能 -->
    <illPerEdit
      v-if="visible"
      :visible="visible"
      :record="record"
      :title="title"
      @cancel="handleCancel"
      @saveIllPer="saveIllPer"
    />
  </div>
</template>

<script>

import illPerEdit from './part/illPerEdit'
import illCardList from './part/illCardList'

export default {
  name: 'modulePart',
  components: { illPerEdit, illCardList, }, // 注册
  data () {
    return {
      height: document.documentElement.clientHeight,
      options: [],
      mapFieldNames: {
        label: 'name', value: 'id', children: 'children',
      },
      illPer: [],
      tableData: [],
      operateMenu: [],
      visible: false,
      record: {},
      title: '',
      ID: 3,
      // 高级搜索内容
      advancedSearchForm: null,
      // 复制高级查询的内容
      copyForm: {},
      isShowFilter: false,
      form1: null,
      illInfo: '',
      dataType: 'table',
    }
  },
  created () {
    setTimeout(() => {
      this.operateMenu = [
        {
          name: '编辑',
          icon: 'edit',
          onClick: (record) => {
            this.title = '编辑体检套餐'
            this.visible = true
            this.record = record
          },
        }
      ]
    }, 500)
  },
  mounted () {
    this.illPer = [{
      illId: 1,
      illName: '李秀婷',
      illZjhm: '140321196708294961',
      illSex: '2',
      illAge: '20',
      illPhone: '17712412421',
      illType: '感冒',
      illState: '治疗中',
      illBirth: '1967-08-29',
      lastDate: '2020-01-11',
      createDate: '2018-03-02',
    }, {
      illId: 2,
      illName: '周号召',
      illZjhm: '14032119850620463X',
      illSex: '1',
      illAge: '31',
      illPhone: '13523215235',
      illType: '腮腺炎',
      illState: '未治疗',
      illBirth: '1985-06-20',
      lastDate: '2021-02-11',
      createDate: '2019-04-02',
    }]
    this.queryIllPerInfoList()
  },
  methods: {
    queryIllPerInfoList () {
      let result = this.illPer
      if (this.illInfo) {
        result = this.illPer.filter(data => data.illZjhm === this.illInfo || data.illName === this.illInfo)
      }
      this.tableData = result
    },
    handleSearch (val) {
      // 将高级搜索的值赋值给变量
      this.copyForm = val
      // 调用查询
      this.isShowFilter = false
      this.queryIllPerInfoList()
    },
    handleClear () {
      this.copyForm = {}
    },
    createForm (form) {
      this.form1 = form
    },
    editRow (data) {
      this.title = '编辑体检套餐'
      this.visible = true
      this.record = data
    },
    createAdvancedSearchForm (form) {
      this.advancedSearchForm = form
    },
    paginationParams () {
      return null
    },
    resetQuery () {
      this.illInfo = ''
    },
    handleToAdd () {
      this.visible = true
      this.title = '新增患者'
      this.record = null
    },
    handleCancel () {
      this.visible = false
    },
    showCard () {
      this.dataType = 'card'
    },
    showList () {
      this.dataType = 'table'
    },
    saveIllPer (formData) {
      let msg = ''
      // 初始化id
      if (formData.illId === undefined) {
        const result = this.illPer.filter(data => data.illZjhm === formData.illZjhm)
        if (result && result.length > 0) {
          return this.$message.error('该患者已存在不允许新增')
        }
        formData.illId = this.ID
        formData.illState = '未治疗'
        formData.lastDate = this.getNowDate()
        formData.createDate = this.getNowDate()
        this.ID = this.ID + 1
        this.illPer.unshift(formData)
        msg = '保存患者信息成功'
      } else {
        msg = '修改患者信息成功'
        this.illPer.forEach((data, index) => {
          if (data.illId === formData.illId) {
            this.$set(this.illPer, index, { ...data, ...formData, })
          }
        })
      }
      this.$message.success(msg)
      this.visible = false
      this.queryIllPerInfoList()
    },
    getNowDate () {
      const date = new Date()
      return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate()
    },
  },
}
</script>

<style scoped>

</style>
