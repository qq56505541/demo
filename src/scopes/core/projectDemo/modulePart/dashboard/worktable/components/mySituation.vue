<template>
  <card-frame :id="id" :setting="setting" @deleteCom="deleteCom">
    <span slot="header">工作总览</span>
    <ta-card :loading="loading" :bordered="false" :body-style="{padding: '0'}">
      <div class="salesCard">
        <ta-tabs default-active-key="1" size="large" :tab-bar-style="{marginBottom: '24px', paddingLeft: '16px'}">
          <div slot="tabBarExtraContent" class="extra-wrapper">
            <ta-range-picker :style="{width: '250px'}" />
          </div>
          <ta-tab-pane key="1" tab=" 工作量 " :forceRender="true">
            <ta-row>
              <ta-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar v-if="showB" :data="barData" title="工作曲线" />
              </ta-col>
              <ta-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="排行榜" :list="rankList" />
              </ta-col>
            </ta-row>
          </ta-tab-pane>
          <ta-tab-pane key="2" tab=" 摸鱼量 " :forceRender="true">
            <ta-row>
              <ta-col :xl="16" :lg="12" :md="12" :sm="24" :xs="24">
                <bar  v-if="showA" :data="barData2" title="摸鱼王排行" />
              </ta-col>
              <ta-col :xl="8" :lg="12" :md="12" :sm="24" :xs="24">
                <rank-list title="摸鱼排行" :list="rankList" />
              </ta-col>
            </ta-row>
          </ta-tab-pane>
        </ta-tabs>
      </div>
    </ta-card>
  </card-frame>
</template>

<script>
import baseMixins from '../mixins/baseMixins'
import cardFrame from './cardFrame'
import rankList from '../../analysisPage/part/RankList'
import Bar from '../part/Bar'

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
  name: 'MySituation',
  components: {
    cardFrame,
    rankList,
    Bar,
  },
  mixins: [baseMixins],
  data () {
    return {
      barData,
      barData2,
      loading: false,
      showB: false,
      showA: false,
      rankList: [
        { name: '银海研发部前端组', total: 1234.2, },
        { name: '银海技术部', total: 134.2, },
        { name: '银海研发部', total: 2034.2, }
      ],
    }
  },
  mounted () {
    setTimeout(() => {
      this.showB = true
      this.showA = true
    }, 100)
  },
  methods: {
    deleteCom (id) {
      this.$emit('deleteCom', id)
    },
  },
}
</script>

<style scoped lang="less">
    .extra-wrapper {
        line-height: 55px;
        /*padding-right: 24px;*/

        .extra-item {
            display: inline-block;
            margin-right: 14px;
            a {
                margin-left: 8px;
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
