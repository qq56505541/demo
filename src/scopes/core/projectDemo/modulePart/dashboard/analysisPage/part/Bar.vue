<template>
  <div :style="{ padding: '0 0 32px 32px' }">
    <h4 :style="{ marginBottom: '20px' }">
      {{ title }}
    </h4>
    <div style="height: 264px;">
      <ta-echarts :option="option" style="height:274px;width: 100%" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bar',
  props: {
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => {
        return []
      },
    },
    scale: {
      type: Array,
      default: () => {
        return [{
          dataKey: 'x',
          min: 2,
        }, {
          dataKey: 'y',
          title: '时间',
          min: 1,
          max: 22,
        }]
      },
    },
    tooltip: {
      type: Array,
      default: () => {
        return [
          'x*y',
          (x, y) => ({
            name: x,
            value: y,
          })
        ]
      },
    },
  },
  created () {
    this.data.forEach(item => {
      this.xData.push(item.x)
      this.yData.push(item.y)
    })
    this.option = {
      xAxis: {
        type: 'category',
        data: this.xData,

        splitLine: {
          show: false,
        },
      },
      yAxis: {
        type: 'value',
        splitLine: {
          show: false,
        },
      },
      series: [{
        data: this.yData,
        type: 'bar',
        itemStyle: {
          normal: {
            color: '#63B8FF',
          },
        },
      }],
    }
  },
  data () {
    return {
      xData: [],
      yData: [],
      option: {},
    }
  },
}
</script>
