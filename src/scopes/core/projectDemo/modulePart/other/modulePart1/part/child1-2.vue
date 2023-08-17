<template>
  <div style="margin: 10px 10px">
    <h3>页面1的子路由2</h3>

    <p style="margin: 20px">
      保持页面1的子路由2，点击其他tab页面之后再回来，页面1的子路由2的数据将保持
    </p>

    <div style="margin-left: 20px">
      <span>点击右侧按钮更改数据：</span>
      <ta-button style="margin-left: 20px" @click="count++">
        页面1的子路由2的count: {{ count }}
      </ta-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'child1-2',
  data () {
    return {
      count: 0,
    }
  },
  activated () {
    console.log('activated: child1-2')
  },
}
</script>
