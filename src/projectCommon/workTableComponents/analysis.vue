<template>
  <div>
    <div style="width: 50%; float: left">
      <ta-e-charts style="text-align: center;" :data="chartData1" :charts-type="'wordcloud'" />
    </div>
    <div style="width: 50%;float: left;">
      <ta-e-charts style="text-align: center;" :data="chartData2" :charts-type="'ring'" />
    </div>
  </div>
</template>

<script>
import TaECharts from '@yh/ta404-ui/es/echarts/src/TaECharts'

export default {
  name: 'Analysis',
  components: { TaECharts, },
  props: {
    moduleId: String,
  },
  data: function () {
    return {
      chartData1: {
        columns: ['word', 'count'],
        rows: [{
          word: 'visualMap',
          count: 22199,
        }, {
          word: 'continuous',
          count: 10288,
        }, {
          word: 'controller',
          count: 620,
        }, {
          word: 'series',
          count: 274470,
        }, {
          word: 'gauge',
          count: 12311,
        }, {
          word: 'detail',
          count: 1206,
        }, {
          word: 'piecewise',
          count: 4885,
        }, {
          word: 'textStyle',
          count: 32294,
        }, {
          word: 'markPoint',
          count: 18574,
        }, {
          word: 'pie',
          count: 38929,
        }, {
          word: 'roseType',
          count: 969,
        }, {
          word: 'label',
          count: 37517,
        }, {
          word: 'emphasis',
          count: 12053,
        }, {
          word: 'yAxis',
          count: 57299,
        }, {
          word: 'name',
          count: 15418,
        }, {
          word: 'type',
          count: 22905,
        }, {
          word: 'gridIndex',
          count: 5146,
        }, {
          word: 'normal',
          count: 49487,
        }, {
          word: 'itemStyle',
          count: 33837,
        }, {
          word: 'min',
          count: 4500,
        }, {
          word: 'silent',
          count: 5744,
        }, {
          word: 'animation',
          count: 4840,
        }, {
          word: 'offsetCenter',
          count: 232,
        }, {
          word: 'inverse',
          count: 3706,
        }, {
          word: 'borderColor',
          count: 4812,
        }, {
          word: 'markLine',
          count: 16578,
        }, {
          word: 'line',
          count: 76970,
        }, {
          word: 'radiusAxis',
          count: 6704,
        }, {
          word: 'radar',
          count: 15964,
        }, {
          word: 'data',
          count: 60679,
        }, {
          word: 'dataZoom',
          count: 24347,
        }, {
          word: 'tooltip',
          count: 43420,
        }, {
          word: 'toolbox',
          count: 25222,
        }, {
          word: 'geo',
          count: 16904,
        }, {
          word: 'parallelAxis',
          count: 4029,
        }],
      },
      chartData2: {
        columns: ['日期', '访问用户'],
        rows: [{ 日期: '1/1', 访问用户: 1935, },
          { 日期: '1/3', 访问用户: 3533, },
          { 日期: '1/2', 访问用户: 2608, }],
      },
    }
  },
  // 测试demo
  // created: function () {
  //   Base.submit(null, {
  //     url: 'org/sysmg/workbenchTestRestService/queryWorktableTestDefaultDate',
  //     _modulePartId_: this.moduleId,
  //     data: {
  //       type: '1'
  //     }
  //   }, {
  //     successCallback: res => {
  //       this.chartData2.rows = res.data.data
  //     }
  //   })
  // }
}
</script>

<style scoped>

</style>
