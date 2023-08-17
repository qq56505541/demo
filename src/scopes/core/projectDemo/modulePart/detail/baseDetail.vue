<template>
  <ta-border-layout layout-type="fixTop" class="noborder baseDetail">
    <ta-page-header slot="header" class="page-header">
      <template v-slot:title>
        <ta-icon type="bars" />
        基础详情页
      </template>
    </ta-page-header>

    <ta-card :bordered="false">
      <ta-descriptions title="退款申请">
        <ta-descriptions-item label="取货单号">
          1000000000
        </ta-descriptions-item>
        <ta-descriptions-item label="状态">
          已取货
        </ta-descriptions-item>
        <ta-descriptions-item label="销售单号">
          1234123421
        </ta-descriptions-item>
        <ta-descriptions-item label="子订单">
          3214321432
        </ta-descriptions-item>
      </ta-descriptions>
      <ta-divider style="margin-bottom: 32px" />
      <ta-descriptions title="用户信息">
        <ta-descriptions-item label="用户姓名">
          付小小
        </ta-descriptions-item>
        <ta-descriptions-item label="联系电话">
          18100000000
        </ta-descriptions-item>
        <ta-descriptions-item label="常用快递">
          菜鸟仓储
        </ta-descriptions-item>
        <ta-descriptions-item label="取货地址">
          浙江省杭州市西湖区万塘路18号
        </ta-descriptions-item>
        <ta-descriptions-item label="备注">
          无
        </ta-descriptions-item>
      </ta-descriptions>
      <ta-divider style="margin-bottom: 32px" />

      <div class="title">
        退货商品
      </div>
      <ta-table
        :columns="goodsColumns"
        :data-source="goodsData"
      />
      <div class="title" style="margin-top: 32px" >
        退货进度
      </div>
      <ta-table
        :columns="scheduleColumns"
        :data-source="scheduleData"
      >
        <template
          slot="status"
          slot-scope="status"
        >
          <ta-badge :status="status" :text="status | statusFilter" />
        </template>
      </ta-table>
    </ta-card>
  </ta-border-layout>
</template>

<script>

export default {
  name: 'baseDetail',
  data () {
    return {
      goodsColumns: [
        {
          title: '商品编号',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: '商品名称',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '商品条码',
          dataIndex: 'barcode',
          key: 'barcode',
        },
        {
          title: '单价',
          dataIndex: 'price',
          key: 'price',
          align: 'right',
        },
        {
          title: '数量（件）',
          dataIndex: 'num',
          key: 'num',
          align: 'right',
        },
        {
          title: '金额',
          dataIndex: 'amount',
          key: 'amount',
          align: 'right',
        }
      ],
      goodsData: [],

      scheduleColumns: [
        {
          title: '时间',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '当前进度',
          dataIndex: 'rate',
          key: 'rate',
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status', },
        },
        {
          title: '操作员ID',
          dataIndex: 'operator',
          key: 'operator',
        },
        {
          title: '耗时',
          dataIndex: 'cost',
          key: 'cost',
        }
      ],
      scheduleData: [],
    }
  },
  created () {
    new Promise(resolve => {
      resolve([
        {
          key: '1',
          time: '2017-10-01 14:10',
          rate: '联系客户',
          status: 'processing',
          operator: '取货员 ID1234',
          cost: '5mins',
        },
        {
          key: '2',
          time: '2017-10-01 14:05',
          rate: '取货员出发',
          status: 'success',
          operator: '取货员 ID1234',
          cost: '1h',
        },
        {
          key: '3',
          time: '2017-10-01 13:05',
          rate: '取货员接单',
          status: 'success',
          operator: '取货员 ID1234',
          cost: '5mins',
        },
        {
          key: '4',
          time: '2017-10-01 13:00',
          rate: '申请审批通过',
          status: 'success',
          operator: '系统',
          cost: '1h',
        },
        {
          key: '5',
          time: '2017-10-01 12:00',
          rate: '发起退货申请',
          status: 'success',
          operator: '用户',
          cost: '5mins',
        }
      ])
    }).then(res => {
      this.scheduleData = res
    })

    new Promise(resolve => {
      resolve([
        {
          id: '1234561',
          name: '矿泉水 550ml',
          barcode: '12421432143214321',
          price: '2.00',
          num: '1',
          amount: '2.00',
        },
        {
          id: '1234562',
          name: '凉茶 300ml',
          barcode: '12421432143214322',
          price: '3.00',
          num: '2',
          amount: '6.00',
        },
        {
          id: '1234563',
          name: '好吃的薯片',
          barcode: '12421432143214323',
          price: '7.00',
          num: '4',
          amount: '28.00',
        },
        {
          id: '1234564',
          name: '特别好吃的蛋卷',
          barcode: '12421432143214324',
          price: '8.50',
          num: '3',
          amount: '25.50',
        }
      ])
    }).then(res => {
      this.goodsData = res
    })
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        processing: '进行中',
        success: '完成',
        failed: '失败',
      }
      return statusMap[status]
    },
  },
  computed: {
    title () {
      return this.$route.meta.title
    },
  },

}
</script>

<style lang="less" scoped>
.baseDetail{
  .page-header {
    padding: 0;

    & /deep/ .ant-page-header-heading {
      padding: 16px 24px;
    }
  }

  & /deep/ .body {
    background-color: @background-color-base;
    padding: 16px 24px;
    & > .ant-card > .ant-card-body{
      padding: 15px 26px;
    }
  }
}

.title {
  color: rgba(0, 0, 0, .85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}
</style>
