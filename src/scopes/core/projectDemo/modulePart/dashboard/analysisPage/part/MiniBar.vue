<template>
  <div class="antv-chart-mini">
    <div class="chart-wrapper" :style="{ height: 46 }">
      <div style="height: 100px;">
        <ta-echarts :option="option" style="height:100px" />
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
const data = []
const beginDay = new Date().getTime()

for (let i = 0; i < 10; i++) {
  data.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: Math.round(Math.random() * 10),
  })
}

const tooltip = [
  'x*y',
  (x, y) => ({
    name: x,
    value: y,
  })
]

const scale = [{
  dataKey: 'x',
  min: 2,
}, {
  dataKey: 'y',
  title: '时间',
  min: 1,
  max: 30,
}]

export default {
  name: 'MiniBar',
  data () {
    return {
      data,
      tooltip,
      scale,
      height: 100,
      option: {
        xAxis: {
          show: false,
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          show: false,
          type: 'value',
        },
        series: [{
          data: [820, 732, 301, 634, 190, 670, 320],
          type: 'line',
          smooth: true,
          areaStyle: {},
        }],
      },
    }
  },
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
