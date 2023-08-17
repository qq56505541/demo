<template>
  <div :style="{height: `${height}px`}">
    <ta-border-layout layout-type="fixTop">
      <ta-card slot="header" title="数据筛选">
        <ta-form layout="horizontal" :form-layout="true" :auto-form-create="(form)=>{this.queryForm = form}">
          <ta-form-item label="输入查询" field-decorator-id="setInfo">
            <ta-input placeholder="输入项目ID或套餐名称" />
          </ta-form-item>
          <ta-form-item label="适用城市" field-decorator-id="city">
            <ta-cascader :options.sync="options" :field-names="mapFieldNames" placeholder="请选择适用城市" />
          </ta-form-item>
          <ta-form-item style="text-align: right;">
            <ta-button type="primary" @click="queryHealthcheckSetInfoList">
              查询
            </ta-button>
            <ta-button>重置</ta-button>
          </ta-form-item>
        </ta-form>
        <div>
          <ta-button type="danger" @click="handleToAdd">
            添加
          </ta-button>
          <ta-button @click="handleDeleteAlert">
            批量删除
          </ta-button>
        </div>
      </ta-card>
      <ta-card class="fit">
        <ta-big-table
          ref="xTable"
          :data="tableData"
          border
        >
          <ta-big-table-column type="checkbox" width="60" />
          <ta-big-table-column type="seq" title="序号" width="60" />
          <ta-big-table-column title="套餐ID" field="setId" width="120" />
          <ta-big-table-column title="套餐名称" field="setName" show-overflow />
          <ta-big-table-column title="售价" field="setPrice" />
          <ta-big-table-column title="适用地区" field="suitCity" width="150" :formatter="formatterSuitCity" />
          <ta-big-table-column title="是否启用" field="status" collection-type="STATE" />
          <ta-big-table-column title="订购数量" field="orderQuantity" />
          <ta-big-table-column title="操作" width="280">
            <template slot-scope="rowInfo">
              <ta-table-operate :operate-menu="operateMenu" :row-info="rowInfo" />
            </template>
          </ta-big-table-column>
          <template #bottomBar>
            <ta-pagination
              ref="grider"
              :data-source.sync="tableData"
              url="healthCheckServiceMg/queryHealthcheckSetInfoList"
              :params="paginationParams"
            />
          </template>
        </ta-big-table>
      </ta-card>
    </ta-border-layout>

    <!-- 批量删除的对话框 -->
    <ta-modal width="300px" :visible="alertVisible" @ok="handleBatchDelete" @cancel="handleAlertCancel">
      <ta-icon type="question-circle" theme="twoTone" two-tone-color="#FFDC35" />确认要删除选中的信息
    </ta-modal>

    <!-- 新增或者编辑功能 -->
    <edit-health-check-set :visible="visible" :record="record" :title="title" @cancel="handleCancel" v-if="visible"/>
  </div>
</template>

<script>

import editHealthCheckSet from './part/editHealthCheckSet' // 引用

export default {
  name: 'modulePart1',
  components: { editHealthCheckSet, }, // 注册
  data () {
    return {
      height: document.documentElement.clientHeight,
      options: [],
      mapFieldNames: {
        label: 'name', value: 'id', children: 'children',
      },
      tableData: [],
      operateMenu: [],
      alertVisible: false,
      visible: false, // 新增窗口的显示或隐藏
      record: {}, // 新增或编辑窗口需要回显的数据
      title: '', // 窗口的标题

    }
  },
  created () {
    setTimeout(() => {
      this.operateMenu = [
        {
          name: '查看附件',
          icon: 'folder',
          onClick: (record, index) => {
          },
        },
        {
          name: '编辑',
          icon: 'edit',
          onClick: (record, index) => {
            this.title = '编辑体检套餐'
            this.visible = true
            record.city = record.suitCity.split('/') // 转换为数组
            record.label = record.suitLabel.split('/') // 转换为数组
            this.record = record
          },
        },
        {
          name: '删除',
          icon: 'delete',
          type: 'confirm',
          confirmTitle: '确定删除',
          onOk: (record, index) => {
            // 调用删除接口
            console.log(record)
          },
        }
      ]
      this.initData() // 异步加载级联的数据
    }, 500)
  },
  mounted () {
    this.$refs.grider.loadData((data) => {})
  },
  methods: {
    initData () {
      Base.submit(null, {
        url: 'healthCheckServiceMg/getCityInfo',
      }).then(res => {
        this.options = res.data.cityTree
      })
    },
    queryHealthcheckSetInfoList () { // 查询检索功能
      this.$refs.grider.loadData((data) => {}) // 重新通过分页组件加载数据
    },
    paginationParams () {
      const formData = this.queryForm.getFieldsValue()
      formData.suitCity = formData.city ? formData.city.join('/') : null
      return formData // 返回查询参数条件
    },
    formatterSuitCity ({ cellValue, }) { // 取出使用城市地区的编码，并进行格式化操作
      const arr = cellValue.split('/')
      const province = this.CollectionLabel('PROVINCE', arr[0])
      const city = this.CollectionLabel('CITY', arr[1])
      return `${province}/${city}`
    },
    handleDeleteAlert () { // 批量删除的操作
      // 判断是否有选中需要删除的行
      const selectRecords = this.$refs.xTable.getCheckboxRecords()
      if (selectRecords.length === 0) {
        message.warn('请选中要删除的行')
      } else {
        // 弹框的操作, 加载ta-model
        this.alertVisible = true
      }
    },
    handleAlertCancel () { // 关闭对话框函数
      this.alertVisible = false
    },
    handleBatchDelete () { // 发起批量删除的函数
      // 后台的接口...
      const selectRecords = this.$refs.xTable.getCheckboxRecords()
      this.alertVisible = false
    },
    handleToAdd () { // 开启新增体检套餐的对话框
      this.visible = true
      this.title = '新增体检套餐'
      this.record = null // 清空对话框中已填写的数据，先当于开启新的一个窗口
    },
    handleCancel () { // 关闭新增体检套餐的对话框
      this.visible = false
    },
  },
}
</script>

<style scoped type="text/less">

</style>
