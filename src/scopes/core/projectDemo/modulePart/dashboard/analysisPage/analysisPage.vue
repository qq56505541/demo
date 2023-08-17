<template>
  <div style="background-color: rgba(240,242,245,1);padding: 20px;height: 100vh">
    <ta-row :gutter="24">
      <ta-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '14px' }">
        <chart-card :loading="loading" title="总工资" total="￥126,560">
          <ta-tooltip title="这是总薪资" slot="action">
            <ta-icon type="info-circle-o" />
          </ta-tooltip>
          <div>
            <trend term="周同比" :percentage="12" flag="up" style="margin-right: 16px;">
              <span slot="term">周</span>
              12%
            </trend>
            <trend term="日同比" :percentage="11" flag="down">
              <span slot="term">天</span>
              11%
            </trend>
          </div>
          <template slot="footer">
            每天的钱<span>￥ 234.56</span>
          </template>
        </chart-card>
      </ta-col>
      <ta-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '14px' }">
        <chart-card :loading="loading" title="访问量" total="8846">
          <ta-tooltip title="介绍" slot="action">
            <ta-icon type="info-circle-o" />
          </ta-tooltip>
          <div>
            <mini-area />
          </div>
          <template slot="footer">
            月访问量<span> 1234</span>
          </template>
        </chart-card>
      </ta-col>
      <ta-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '14px' }">
        <chart-card :loading="loading" title="付款" total="6560">
          <ta-tooltip title="介绍" slot="action">
            <ta-icon type="info-circle-o" />
          </ta-tooltip>
          <div>
            <mini-bar />
          </div>
          <template slot="footer">
            日付款 <span>60%</span>
          </template>
        </chart-card>
      </ta-col>
      <ta-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '14px' }">
        <chart-card :loading="loading" title="影响力" total="78%">
          <ta-tooltip title="影响力" slot="action">
            <ta-icon type="info-circle-o" />
          </ta-tooltip>
          <div>
            <mini-progress color="rgb(19, 194, 194)" :target="80" :percentage="78" height="8px" />
          </div>
          <template slot="footer">
            <trend flag="down" :type="true" term="周同比" :percentage="12" style="margin-right: 16px;">
              <span slot="term">周一</span>
              12%
            </trend>
            <trend flag="up" term="周同比" :percentage="80">
              <span slot="term">5号</span>
              80%
            </trend>
          </template>
        </chart-card>
      </ta-col>
    </ta-row>
    <ta-card style="height: calc(100vh - 234px)" :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <ta-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div class="extra-wrapper" slot="tabBarExtraContent">
            <div class="extra-item">
              <a>日</a>
              <a>周</a>
              <a>月</a>
              <a>年</a>
            </div>
            <ta-range-picker :style="{width: '256px'}" />
          </div>
          <ta-tab-pane loading="true" tab="薪资" key="1">
            <ta-row>
              <ta-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData" title="销售趋势" />
              </ta-col>
              <ta-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="排行榜" :list="rankList" />
              </ta-col>
            </ta-row>
          </ta-tab-pane>
          <ta-tab-pane tab="访问量" key="2">
            <ta-row>
              <ta-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar :data="barData2" title="访问量排行" />
              </ta-col>
              <ta-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="访问量排行" :list="rankList" />
              </ta-col>
            </ta-row>
          </ta-tab-pane>
        </ta-tabs>
      </div>
    </ta-card>
  </div>
</template>

<script>
import ChartCard from './part/ChartCard'
import MiniArea from './part/MiniArea'
import MiniBar from './part/MiniBar'
import Trend from './part/Trend'
import MiniProgress from './part/MiniProgress'
import Bar from './part/Bar'
import RankList from './part/RankList'

const barData = []
const barData2 = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  })
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200,
  })
}

export default {
  name: 'analysisPage',
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    Trend,
    RankList,
    Bar,
  },
  data () {
    return {
      // NumberFormat: 888,
      loading: false,
      barData,
      barData2,
      rankList: [
        { name: '银海研发部前端组', total: 1234.2, },
        { name: '银海技术部', total: 134.2, },
        { name: '银海研发部', total: 2034.2, },
        { name: '银海研发部前端组', total: 1234.2, },
        { name: '银海技术部', total: 134.2, },
        { name: '银海研发部', total: 2034.2, },
        { name: '银海研发部前端组', total: 1234.2, },
        { name: '银海技术部', total: 134.2, },
        { name: '银海研发部', total: 2034.2, }
      ],
    }
  },
}
</script>

<style scoped lang="less">
    .extra-wrapper {
        line-height: 55px;
        padding-right: 24px;

        .extra-item {
            display: inline-block;
            margin-right: 24px;
            a {
                margin-left: 24px;
            }
        }
    }

    .antd-pro-pages-dashboard-analysis-twoColLayout {
        position: relative;
        display: flex;
        display: block;
        flex-flow: row wrap;
    }

    .antd-pro-pages-dashboard-analysis-salesCard {
        height: calc(100% - 24px);
    /deep/ .ant-card-head {
        position: relative;
    }
    }

    .dashboard-analysis-iconGroup {
    i {
        margin-left: 16px;
        color: rgba(0,0,0,.45);
        cursor: pointer;
        transition: color .32s;
        color: black;
    }
    }
    .analysis-salesTypeRadio {
        position: absolute;
        right: 54px;
        bottom: 12px;
    }
</style>
