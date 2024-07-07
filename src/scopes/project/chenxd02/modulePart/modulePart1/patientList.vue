<template>
  <div style="height:100%">
    <ta-border-layout layout-type="fixTop">
      <ta-card slot="header">
        <ta-button type="primary" size="large" style="text-align: left;margin-right: 480px" @click="addPatient">
          新增患者
        </ta-button>

        <span>
          <ta-button @click="showCard">
            <ta-icon type="appstore"  />
          </ta-button>
          <ta-button @click="showList">
            <ta-icon type="ordered-list" />
          </ta-button>
          <ta-button @click="queryFilter">
            高级筛选<ta-icon type="down" />
          </ta-button>
        </span>
        <span style="float: right">
          <ta-input
            v-model="searchText"
            size="large"
            placeholder="输入患者身份证或姓名进行查询"
            allow-clear
            style="width: 280px;"
          >
            <ta-icon slot="prefix" type="search" />
          </ta-input>
          <ta-button type="primary" @click="queryPatient">
            查询
          </ta-button>
          <ta-button @click="reload">重置</ta-button>

        </span>
      </ta-card>
      <ta-card v-if="dataType==='list'" class="fit">
        <ta-big-table
          ref="xTable"
          border="full"
          :data="tableData"
          :header-cell-style="headerCellStyle"
          :cell-style="cellStyle"
          @cell-click="getTel"
        >
          <ta-big-table-column title="ID" field="patientId" width="60" />
          <ta-big-table-column title="姓名" field="paName" width="120" />
          <ta-big-table-column title="性别" field="paSex" collection-type="SEX" />
          <ta-big-table-column title="年龄" field="paAge" />
          <ta-big-table-column title="联系电话" field="telMask" />
          <ta-big-table-column title="西医病种" field="drgs" collection-type="STATE" />
          <ta-big-table-column title="操作">
            <span slot-scope="rowInfo">
              <ta-table-operate :operate-menu="operateMenu" :row-info="rowInfo" />
            </span>
          </ta-big-table-column>
          <ta-big-table-column title="状态" field="treatStatus" collection-type="TREATSTATUS" />
          <ta-big-table-column title="最近就诊日期" field="lastTime" />
          <ta-big-table-column title="建卡日期" field="createTime" />
        </ta-big-table>
      </ta-card>
      <ta-card v-else class="fit">
        <patient-card-list :patient-list="tableData" @checkTel="checkTel" />
      </ta-card>
      <ta-pagination
        ref="gridPager"
        style="text-align: right;margin-top: 10px"
        :data-source.sync="tableData"
        url="basePatient/queryPatients"
        :params="paginationParams"
        :defaultPageSize="12"
      />
    </ta-border-layout>
    <add-patient :visible="showAddPatientPage" @cancel="handleCancel" />
    <query-filter :visible="showQueryFilterPage" @cancel="handleCancel" @filter="queryFilterByParams" />
  </div>
</template>

<script>
import queryFilter from './part/queryFilter'
import addPatient from './part/addPatient'
import patientCardList from './part/patientCardList'
export default {
  name: 'modulePart1',
  components: { patientCardList, addPatient, queryFilter, },
  data () {
    return {
      queryFilterParams: {},
      showQueryFilterPage: false,
      showAddPatientPage: false,
      dataType: 'list',
      searchText: '',
      tableData: [],
      operateMenu: [
        {
          name: '管理',
          onClick: (record, index) => {
            this.$router.push({
              name: 'managePage',
              query: {
                patientId: record.patientId,
              },
            })
          },
        }
      ],
    }
  },
  mounted () {
    this.$refs.gridPager.loadData()
  },
  methods: {
    queryFilterByParams (params) {
      this.queryFilterParams = { ...params, }
      this.$refs.gridPager.loadData()
      this.queryFilterParams = {}
    },
    queryFilter () {
      this.showQueryFilterPage = true
    },
    handleCancel () {
      this.showAddPatientPage = false
      this.showQueryFilterPage = false
    },
    addPatient () {
      this.showAddPatientPage = true
    },
    showCard () {
      this.dataType = 'card'
    },
    showList () {
      this.dataType = 'list'
    },
    cellStyle ({ column, }) {
      if (column.title === '联系电话') {
        return {
          cursor: 'pointer',
          color: '#00bfff',
          textAlign: 'center',
        }
      } else {
        return {
          textAlign: 'center',
        }
      }
    },
    headerCellStyle ({}) {
      return {
        textAlign: 'center',
      }
    },
    queryPatient () {
      this.$refs.gridPager.loadData()
    },
    reload () {
      this.searchText = ''
      this.$refs.gridPager.loadData()
    },
    paginationParams () {
      return {
        searchText: this.searchText,
        ...this.queryFilterParams,
      }
    },
    getTel ({ row, column, }) {
      if (column.title === '联系电话') {
        this.tableData.forEach(item => {
          if (item.patientId === row.patientId) {
            if (item.paTel !== 'undefined') {
              const telNumber = item.paTel.substring(0, item.paTel.length - 4) + '****'
              row.telMask = telNumber
            } else {
              row.telMask = '暂无'
            }
          }
        })
      }
    },
    checkTel (patientId) {
      this.tableData.map(item => {
        if (item.patientId === patientId) {
          if (item.paTel !== 'undefined') {
            const telNumber = item.paTel.substring(0, item.paTel.length - 4) + '****'
            item.telMask = telNumber
          } else {
            item.telMask = '暂无'
          }
        }
      })
    },

  },
}
</script>

<style scoped type="text/less">

</style>
