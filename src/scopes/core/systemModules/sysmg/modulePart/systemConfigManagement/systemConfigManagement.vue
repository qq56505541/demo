<template>
    <div class="fit">
        <ta-border-layout :layout="{left:'300px'}" :center-cfg="{layoutConStyle:{padding:0,border: 0}}">      <!--搜索-->
            <ta-border-layout  :showBorder="false" :centerCfg="{showBar: true, toolBarStyle:{height: '50px', lineHeight: '48px'}}">
                <!--搜索-->
                <div slot="header" class="center-box">
                    <ta-input-search v-model="param" placeholder="字段搜索" class="search-box" @search="searchQuery"  enterButton="搜索"  />
                </div>
                <div slot="centerExtraContent">
                    <div style="float: right">
                        <ta-button icon="edit" @click="addConfig">
                            新增配置
                        </ta-button>
                        <ta-popover
                                width="190"
                                placement="top"
                                v-model="visiblePopover"
                        >
                            <ta-button  slot="reference"  icon="reload" >
                                重置配置
                            </ta-button>
                            <p>【功能配置、系统配置】一并重置,确定重置?</p>
                            <div style="text-align: right; margin: 0">
                                <ta-button @click="visiblePopover = false">取消</ta-button>
                                <ta-button type="primary" @click="refreshConfig">确定</ta-button>
                            </div>
                        </ta-popover>
                    </div>
                </div>
                <ta-form :autoFormCreate="(form)=>{this.form = form}" >
                    <ta-table
                            size="small"
                            :columns="columns"
                            :dataSource="data"
                            rowKey="id"
                            :defaultExpandedRowKeys="defaultExpandedRowKeys"
                            :expandedRowKeys="defaultExpandedRowKeys"
                            @expand="loadChild"
                            :scroll="{ x: 1200}">
                        <span slot="fieldName"  slot-scope="text, record" >{{text}}</span>
                        <span slot="defaultValueTitle">当前设置 <ta-icon type="edit"/></span>

                        <template slot="defaultValue" slot-scope="text, record, index">
                            <template v-if="record.dataType == '1'"> <!--文本-->
                                <ta-table-edit type="input" :beforeChange="changeData"></ta-table-edit>
                            </template>
                            <template v-else-if="record.dataType == '2'"><!--时间-->
                                <ta-table-edit type="datePicker" :beforeChange="changeData"></ta-table-edit>
                            </template>
                            <template v-else-if="record.dataType == '3'"><!--选项-->
                                <template v-if="record.collectionDatas != '' && record.collectionDatas != undefined "><!--自定义码表值-->
                                    <ta-table-edit type="select" :option="stringToJson(record)" :beforeChange="changeData"></ta-table-edit>
                                </template>
                                <template v-else-if="record.collectionName != ''&& record.collectionName != undefined"><!--码表值-->
                                    <ta-table-edit type="select" :option="CollectionData(record.collectionName)" :beforeChange="changeData"></ta-table-edit>
                                </template>
                                <template v-else>
                                    <span>{{text}}</span>
                                </template>
                            </template>
                            <template v-else-if="record.dataType == '4'"><!--数字-->
                                <ta-table-edit type="inputNumber" :beforeChange="changeData"></ta-table-edit>
                            </template>
                            <template v-else-if="record.dataType == '5'"><!--yml-->
                                <span @click="showYmlValue(text)">{{text}}</span>
                            </template>
                            <template v-else><!--其他-->
                                <span>{{text}}</span>
                            </template>
                        </template>

                        <span slot="configComment"  slot-scope="text" >{{text}}</span>
                        <span slot="updateTime"  slot-scope="text, record" >{{text == null ? '' : moment(record.updateTime).format('YYYY-MM-DD')}}</span>
                        <span slot="opUsername"  slot-scope="text" >{{text == null ? '--' : text}}</span>

                        <span v-if="record.children == undefined" slot="action" slot-scope="text, record">
            <ta-table-operate :operateMenu="operateMenu"></ta-table-operate>
          </span>

                    </ta-table>
                </ta-form>
            </ta-border-layout>

            <!--begin 加载左侧选择栏-->
            <div slot="left">
                <ta-card :bordered="false" :bodyStyle="{'padding':0}">
                    <div slot="title">
                        配置类别
                    </div>
                    <a
v-for="(item, index) in configCategory"
                       :key="item.value"
                       :value="item.label"
                       @click="categoryChange(item.value, index)">
                        <div class="left-item" :class="{'activeClass':index == clickIndex}">{{item.label}}</div>
                    </a>
                </ta-card>
            </div>

            <ta-modal
                    title="当前配置"
                    centered
                    v-model="ymlValueVisible"
                    width="500px"
                    :bodyStyle="{height:'200px',padding:'0'}"
                    :destroyOnClose=true
                    :maskClosable=false
            >
                <ta-textarea v-model="ymlValue" :rows="9"></ta-textarea>
                <template slot="footer">
                    <ta-button @click="ymlValueVisible=false">
                        取消
                    </ta-button>
                    <!--                  <ta-button key="submit" type="primary">-->
                    <!--                      更新-->
                    <!--                  </ta-button>-->
                </template>
            </ta-modal>
        </ta-border-layout>
        <add-config :visible="addConfigVisible" :rowData="rowData" @close="addConfigVisible = false" :configKey="configKey" @addSuccess="addSuccess"></add-config>
    </div>
</template>
<script>
import $api from './api/index'
import moment from 'moment'
import addConfig from './part/addConfig'
import TaTextarea from '@yh/ta404-ui/es/input/TextArea'

const columns = [
  { title: '字段名', dataIndex: 'fieldName', width: '360px', overflowTooltip: true, scopedSlots: { customRender: 'fieldName', }, },
  { title: '备注', dataIndex: 'configComment', width: '20%', overflowTooltip: true, scopedSlots: { customRender: 'configComment', }, },
  { slots: { title: 'defaultValueTitle', }, dataIndex: 'defaultValue', width: '23%', overflowTooltip: true, scopedSlots: { customRender: 'defaultValue', }, },
  { title: '更新时间', dataIndex: 'updateTime', width: '16%', overflowTooltip: true, scopedSlots: { customRender: 'updateTime', }, },
  { title: '操作人', dataIndex: 'opUsername', width: '10%', overflowTooltip: true, scopedSlots: { customRender: 'opUsername', }, },
  { title: '操作', align: 'center', width: 100, scopedSlots: { customRender: 'action', }, }
]

export default {
  name: 'systemConfigManagement',
  data () {
    return {
      data: [],
      columns,
      visiblePopover: false,
      defaultExpandedRowKeys: [],
      operateMenu: [{
        name: '重置',
        type: 'confirm',
        confirmTitle: '重置为最初配置(若为手动添加的配置重置为新增时的配置)?',
        onOk: (record) => {
          this.refreshOneConfig(record)
        },
      }, {
        name: '删除',
        type: 'confirm',
        confirmTitle: '确定删除该配置?',
        onOk: (record) => {
          this.deleteConfig(record.id)
        },
      }],
      ymlValue: '',
      ymlValueVisible: false,
      gridData: [],
      isCheckParam: [],
      rowData: {},
      selectedRowKeys: [],
      param: '',
      configCategory: [],
      configKey: '',
      searchUrl: 'tasysconfig/taSysConfigRestService/querySysConfig',
      clickIndex: 0, // 默认选中的下标
      functionType: '1',
      configCategoryType: 'CONFIGSYSTEMCATEGORY',
      addConfigVisible: false,
    }
  },
  components: { moment, addConfig, TaTextarea, },
  mounted () {
    this.initForm()
  },
  methods: {
    // 时间处理函数
    moment,
    pageParams () {
      const param = {}
      param.fieldName = this.param
      param.configKey = this.configKey
      param.functionType = this.functionType // 功能配置
      return param
    },

    // 查询表格数据
    initForm: function (data = {}) {
      this.Base.asyncGetCodeData(this.configCategoryType).then((codeList) => {
        this.configCategory = codeList
        if (this.configCategory != null) { // 默认选择第一个
          this.configKey = this.configCategory[0].value
          this.querySysConfig()
        }
      })
    },

    querySysConfig (param) {
      $api.querySysConfig({ functionType: this.functionType, configKey: this.configKey, fieldName: param, }, (data) => {
        this.data = data.data.data
      })
    },

    searchQuery () {
      this.querySysConfig(this.param)
    },

    stringToJson (record) {
      return JSON.parse(record.collectionDatas)
    },

    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
    },

    loadChild (expanded, record) {
      // 如果为展开,则进行请求
      const id = record.id
      const configKey = record.fieldName
      if (expanded) {
        if (record.children && record.children.length) {
          this.defaultExpandedRowKeys.push(id)
        } else {
          $api.querySysConfig({ configKey: configKey, }, (data) => {
            record.children = data.data.data
            this.defaultExpandedRowKeys.push(id)
          })
        }
      } else {
        // 如果为关闭,则进行关闭
        const index = this.defaultExpandedRowKeys.indexOf(id)
        this.defaultExpandedRowKeys.splice(index, 1)
      }
    },

    changeData ({ newData, record, columnKey, }, callback) {
      this.$confirm({
        title: '确定修改配置？',
        onOk: () => {
          $api.updateSysConfig({ id: record.id, defaultValue: newData, fieldName: record.fieldName, dataType: record.dataType, }, (data) => {
            record[columnKey] = newData
            callback()
          })
          this.$message.success('配置已生效')
        },
        onCancel: () => {
          callback()
        },
      })
    },

    categoryChange (value, index) {
      this.configKey = value
      // 如果等于当前就不进行加载
      if (this.clickIndex == index) {
        return
      }
      this.querySysConfig()
      this.clickIndex = index
    },

    addConfig () {
      this.addConfigVisible = true
    },

    refreshConfig () {
      $api.refreshSysConfig({}, (data) => {
        this.$message.success('重置成功')
        this.querySysConfig()
      })
      this.visiblePopover = false
    },

    refreshOneConfig (record) {
      $api.refreshOneSysConfig({ id: record.id, defaultValue: '1', fieldName: record.fieldName, dataType: record.dataType, }, (data) => {
        this.$message.success('重置成功')
        this.querySysConfig()
      })
    },

    deleteConfig (id) {
      $api.deleteSysConfig({ id: id, }, (data) => {
        this.$message.success('删除成功')
        this.querySysConfig()
      })
    },

    // 成功回调
    addSuccess () {
      this.querySysConfig()
    },
    showYmlValue (text) {
      this.ymlValue = text
      this.ymlValueVisible = true
    },

  },
}
</script>
<style scoped type="text/less" lang="less">
    .search-box {width: 340px; line-height: 42px;line-height: 36px\0; }
    .center-box { text-align: center; overflow: hidden; }
    .disable-color { color: @normal-color; &:hover { color: @normal-color } }
    .left-item { width: 100%; height: 50px; line-height: 50px; padding-left: 24px; }
    .activeClass {
        background-color: @item-active-bg;
        color: @primary-color;
        border-right: 6px solid @primary-color;
    }
</style>
