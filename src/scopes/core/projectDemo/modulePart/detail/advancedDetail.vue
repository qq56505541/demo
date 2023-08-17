<template>
  <ta-border-layout layout-type="fixTop" class="noborder baseDetail">
    <ta-page-header slot="header" class="page-header">
      <template #title>
        <ta-icon type="bars" />
        单号：234231029431
      </template>
      <ta-row>
        <ta-col :span="18">
          <ta-descriptions size="small" :column="2">
            <ta-descriptions-item label="创建人">
              曲丽丽
            </ta-descriptions-item>
            <ta-descriptions-item label="订购产品">
              XX 服务
            </ta-descriptions-item>
            <ta-descriptions-item label="创建时间">
              2017-07-07
            </ta-descriptions-item>
            <ta-descriptions-item label="关联单据">
              <a href="">12421</a>
            </ta-descriptions-item>
            <ta-descriptions-item label="生效日期">
              2017-07-07 ~ 2017-08-08
            </ta-descriptions-item>
            <ta-descriptions-item label="备注">
              请于两个工作日内确认
            </ta-descriptions-item>
          </ta-descriptions>
        </ta-col>
        <ta-col :span="6">
          <ta-row class="status-list">
            <ta-col :xs="12" :sm="12">
              <ta-statistic title="状态" value="待审批" />
            </ta-col>
            <ta-col :xs="12" :sm="12">
              <ta-statistic title="订单金额" prefix="￥" :precision="2" :value="568.08" />
            </ta-col>
          </ta-row>
        </ta-col>
      </ta-row>

      <template #extra>
        <ta-button-group style="margin-right: 4px;">
          <ta-button>操作</ta-button>
          <ta-button>操作</ta-button>
          <ta-button><ta-icon type="ellipsis" /></ta-button>
        </ta-button-group>
        <ta-button type="primary">
          主操作
        </ta-button>
      </template>

      <template #footer>
        <ta-tabs default-active-key="1" style="padding: 0">
          <ta-tab-pane key="1" tab="详情" />
          <ta-tab-pane key="2" tab="规则" />
        </ta-tabs>
      </template>
    </ta-page-header>

    <ta-card :bordered="false" title="流程进度">
      <ta-steps direction="horizontal" :current="1" progress-dot>
        <ta-step>
          <template #title>
            <span>创建项目</span>
          </template>
          <template #description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              曲丽丽<ta-icon type="dingding" style="margin-left: 8px;" />
              <div>2016-12-12 12:32</div>
            </div>
          </template>
        </ta-step>
        <ta-step>
          <template #title>
            <span>部门初审</span>
          </template>
          <template #description>
            <div class="antd-pro-pages-profile-advanced-style-stepDescription">
              周毛毛<ta-icon type="dingding" style="color: rgb(0, 160, 233); margin-left: 8px;" />
              <div><a>催一下</a></div>
            </div>
          </template>
        </ta-step>
        <ta-step title="财务复核" />
        <ta-step title="完成" />
      </ta-steps>
    </ta-card>

    <ta-card style="margin-top: 24px" :bordered="false" title="用户信息">
      <ta-descriptions>
        <ta-descriptions-item label="用户姓名">
          付晓晓
        </ta-descriptions-item>
        <ta-descriptions-item label="会员卡号">
          32943898021309809422
        </ta-descriptions-item>
        <ta-descriptions-item label="身份证">
          3321944288191034921
        </ta-descriptions-item>
        <ta-descriptions-item label="联系方式">
          18112345678
        </ta-descriptions-item>
        <ta-descriptions-item label="联系地址">
          浙江省杭州市西湖区黄姑山路工专路交叉路口
        </ta-descriptions-item>
      </ta-descriptions>
      <ta-descriptions title="信息组">
        <ta-descriptions-item label="某某数据">
          725
        </ta-descriptions-item>
        <ta-descriptions-item label="该数据更新时间">
          2018-08-08
        </ta-descriptions-item>
        <ta-descriptions-item />
        <ta-descriptions-item label="某某数据">
          725
        </ta-descriptions-item>
        <ta-descriptions-item label="该数据更新时间">
          2018-08-08
        </ta-descriptions-item>
        <ta-descriptions-item />
      </ta-descriptions>
      <ta-card type="inner" title="多层信息组">
        <ta-descriptions title="组名称" size="small">
          <ta-descriptions-item label="负责人">
            林东东
          </ta-descriptions-item>
          <ta-descriptions-item label="角色码">
            1234567
          </ta-descriptions-item>
          <ta-descriptions-item label="所属部门">
            XX公司-YY部
          </ta-descriptions-item>
          <ta-descriptions-item label="过期时间">
            2018-08-08
          </ta-descriptions-item>
          <ta-descriptions-item label="描述">
            这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
          </ta-descriptions-item>
        </ta-descriptions>
        <ta-divider style="margin: 16px 0" />
        <ta-descriptions title="组名称" size="small" :col="1">
          <ta-descriptions-item label="学名">
            Citrullus lanatus (Thunb.) Matsum. et Nakai一年生蔓生藤本；茎、枝粗壮，具明显的棱。卷须较粗..
          </ta-descriptions-item>
        </ta-descriptions>
        <ta-divider style="margin: 16px 0" />
        <ta-descriptions title="组名称" size="small" :col="2">
          <ta-descriptions-item label="负责人">
            付小小
          </ta-descriptions-item>
          <ta-descriptions-item label="角色码">
            1234567
          </ta-descriptions-item>
        </ta-descriptions>
      </ta-card>
    </ta-card>

    <ta-card style="margin-top: 24px" :bordered="false" title="用户近半年来电记录">
      <div class="no-data">
        <ta-icon type="frown-o" />暂无数据
      </div>
    </ta-card>

    <!-- 操作 -->
    <ta-card
      style="margin-top: 24px"
      :bordered="false"
      :tab-list="operationTabList"
      :active-tab-key="operationActiveTabKey"
      @tabChange="(key) => {this.operationActiveTabKey = key}"
    >
      <ta-table
        v-if="operationActiveTabKey === '1'"
        :columns="operationColumns"
        :data-source="operation1"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status"
        >
          <ta-badge :status="status | statusTypeFilter" :text="status | statusFilter" />
        </template>
      </ta-table>
      <ta-table
        v-if="operationActiveTabKey === '2'"
        :columns="operationColumns"
        :data-source="operation2"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status"
        >
          <ta-badge :status="status | statusTypeFilter" :text="status | statusFilter" />
        </template>
      </ta-table>
      <ta-table
        v-if="operationActiveTabKey === '3'"
        :columns="operationColumns"
        :data-source="operation3"
        :pagination="false"
      >
        <template
          slot="status"
          slot-scope="status"
        >
          <ta-badge :status="status | statusTypeFilter" :text="status | statusFilter" />
        </template>
      </ta-table>
    </ta-card>
  </ta-border-layout>
</template>

<script>

export default {
  name: 'baseDetail',
  filters: {
    statusFilter (status) {
      const statusMap = {
        agree: '成功',
        reject: '驳回',
      }
      return statusMap[status]
    },
    statusTypeFilter (type) {
      const statusTypeMap = {
        agree: 'success',
        reject: 'error',
      }
      return statusTypeMap[type]
    },
  },
  data () {
    return {
      tabList: [
        { key: 'detail', tab: '详情', },
        { key: 'rule', tab: '规则', }
      ],
      tabActiveKey: 'detail',

      operationTabList: [
        {
          key: '1',
          tab: '操作日志一',
        },
        {
          key: '2',
          tab: '操作日志二',
        },
        {
          key: '3',
          tab: '操作日志三',
        }
      ],
      operationActiveTabKey: '1',

      operationColumns: [
        {
          title: '操作类型',
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: '操作人',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '执行结果',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status', },
        },
        {
          title: '操作时间',
          dataIndex: 'updatedAt',
          key: 'updatedAt',
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark',
        }
      ],
      operation1: [
        {
          key: 'op1',
          type: '订购关系生效',
          name: '曲丽丽',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-',
        },
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因',
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-',
        },
        {
          key: 'op4',
          type: '提交订单',
          name: '林东东',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '很棒',
        },
        {
          key: 'op5',
          type: '创建订单',
          name: '汗牙牙',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-',
        }
      ],
      operation2: [
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因',
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-',
        },
        {
          key: 'op4',
          type: '提交订单',
          name: '林东东',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '很棒',
        }
      ],
      operation3: [
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因',
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-',
        }
      ],
    }
  },

}
</script>

<style lang="less" scoped>
.baseDetail{
  .page-header {
    padding: 0;
  }

  & /deep/ .header,
  & /deep/ .body{
    padding: 16px 24px;
  }

  & /deep/ .header{
    padding-bottom: 0;
  }

  & /deep/ .body{
    background-color: @background-color-base;
    & > .ant-card > .ant-card-body{
      padding: 15px 26px;
    }
  }
}
.no-data {
  color: rgba(0, 0, 0, .25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

.title {
  color: rgba(0, 0, 0, .85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
