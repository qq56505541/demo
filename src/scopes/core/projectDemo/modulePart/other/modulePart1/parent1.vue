<template>
  <div style="padding: 20px">
    <h2>模拟路由页面1</h2>
    <div>
      <span>父页面控制路由跳转：</span>
      <ta-button @click="click(1)">
        跳转模拟路由页面1的子路由1
      </ta-button>
      <ta-button style="margin-left: 20px" @click="click(2)">
        跳转模拟路由页面1的子路由2
      </ta-button>
    </div>
    <hr/>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'parent1',
  data () {
    return {
      value: 1,
    }
  },
  created () {
    console.log('parent1  created钩子 push路由')
    this.$router.push({ name: 'child1-1', })
  },
  activated () {
    console.log('parent1  activated钩子页面激活 根据缓存内容push路由')
    if (this.value === 1) {
      this.$router.push({ name: 'child1-1', })
    }
    if (this.value === 2) {
      this.$router.push({ name: 'child1-2', })
    }
  },
  methods: {
    click (val) {
      this.value = val
      this.$router.push({ name: 'child1-' + val, })
    },
  },
}
</script>
