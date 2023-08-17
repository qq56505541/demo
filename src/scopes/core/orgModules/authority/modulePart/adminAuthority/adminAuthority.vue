<template>
  <div id="adminAuthority" class="fit">
    <ta-tabs @tabClick="onRadioClick" :active-key="value" class="tab-style">
      <ta-tab-pane key="1" tab="角色维度" />
      <ta-tab-pane key="2" tab="人员维度" />
    </ta-tabs>
    <div style="height: calc(100% - 59px)">
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
const ROLE = '1'// 角色维度
const USER = '2'// 人员维度

export default {
  name: 'adminAuthority',
  data () {
    return {
      value: ROLE, // 设置默认的tab选项，默认显示角色维度
    }
  },
  created () {
    this.$router.push({ name: 'adminRoleManagement', })
  },
  methods: {
    onRadioClick (key) {
      this.value = key
      if (key == ROLE) {
        this.$router.push({ name: 'adminRoleManagement', })
      } else if (key == USER) {
        this.$router.push({ name: 'adminUserManagement', })
      }
    },
  },
  activated () {
    if (this.value === '1') {
      this.$router.push({ name: 'adminRoleManagement', })
    } else if (this.value === '2') {
      this.$router.push({ name: 'adminUserManagement', })
    }
  },
}
</script>
<style scoped type="text/less" lang="less">
  #adminAuthority {
    /*border: 14px solid #f0f2f5;*/
    position: relative;
  }

  .tab-style {
    height: 59px;
    border-bottom: 0;
    padding: 14px 14px 0px 14px;
  }
</style>
