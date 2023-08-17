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
  max: 22,
}]

export default {
  name: 'MiniArea',
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
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [{
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          itemStyle: {
            normal: {
              color: '#63B8FF',
            },
          },
        }],
      },
    }
  },
}
</script>

<style lang="less" scoped>
  @import "chart";
</style>
