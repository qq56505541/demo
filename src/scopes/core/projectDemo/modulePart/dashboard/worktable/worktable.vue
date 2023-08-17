<template>
  <div style="background-color: rgba(240,242,245,1);">
    <div style="height: 50px;line-height: 50px;padding: 0 10px">
      <ta-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
      <span style="font-size: 16px;font-weight: bold;margin-left: 16px">你好，打工人</span>
      <div style="float: right">
        <ta-button @click="resetLayout">
          恢复
        </ta-button>
        <ta-button v-if="!setting" @click="settingComponents">
          删除
        </ta-button>
        <ta-button v-if="setting" @click="cancelSetting">
          确认
        </ta-button>
        <ta-dropdown>
          <ta-menu slot="overlay" @click="addNewMoudule">
            <ta-menu-item v-for="item in cloneLayoutDate" :key="item.i">
              {{ item.name }}
            </ta-menu-item>
          </ta-menu>
          <ta-button>
            新增模块 <ta-icon type="down" />
          </ta-button>
        </ta-dropdown>
      </div>
    </div>
    <div style="height: 100%;width: 100%;">
      <grid-layout
        style="width: 100%"
        class="vue-grid-layout"
        :layout="layout"
        :auto-size="true"
        :col-num="30"
        :row-height="20"
        :max-rows="40"
        :is-draggable="true"
        :is-resizable="true"
        :vertical-compact="true"
        :margin="[10, 10]"
        :use-css-transforms="true"
      >
        <grid-item
          v-for="item in layout"
          :key="item.i"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :min-w="10"
          style="touch-action: none"
          @resize="resizeEvent"
          @move="moveEvent"
          @resized="resizedEvent"
          @moved="movedEvent"
        >
          <component :is="item.component" :id="item.i" :setting="setting" @deleteCom="deleteCom" />
        </grid-item>
      </grid-layout>
    </div>
    <div style="height: 60px;text-align: center;line-height: 60px;color: #999">
      到底啦...
    </div>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import rankList from './components/rankList'
import updatLog from './components/updatLog'
import teamList from './components/teamList'
import mySituation from './components/mySituation'
// const files = require.context('@/scopes/core/projectDemo/modulePart/dashboard/worktable/components/', false, /\.vue$/).keys()

export default {
  name: 'Worktable',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    rankList,
    updatLog,
    teamList,
    mySituation,
  },
  data () {
    return {
      setting: false,
      layout: [
        { x: 0, y: 0, w: 10, h: 10, i: '0', component: 'updatLog', name: '更新日志', },
        { x: 0, y: 10, w: 10, h: 10, i: '1', component: 'teamList', name: '我的团队', },
        { x: 0, y: 20, w: 30, h: 20, i: '2', component: 'mySituation', name: '工作总览', },
        { x: 10, y: 0, w: 20, h: 20, i: '4', component: 'rankList', name: '公司动态', }
      ],
      cloneLayoutDate: [
        { x: 0, y: 0, w: 10, h: 10, i: '0', component: 'updatLog', name: '更新日志', },
        { x: 0, y: 10, w: 10, h: 10, i: '1', component: 'teamList', name: '我的团队', },
        { x: 0, y: 20, w: 30, h: 20, i: '2', component: 'mySituation', name: '工作总览', },
        { x: 10, y: 0, w: 20, h: 20, i: '4', component: 'rankList', name: '公司动态', }
      ],
    }
  },
  methods: {
    addNewMoudule (key) {
      let allowAdd = true
      const addItem = { x: 0, y: 10, w: 10, h: 10, }
      if (key.key === '2') {
        addItem.w = 30
        addItem.h = 20
      }
      this.layout.forEach(item => {
        if (item.i === key.key) {
          allowAdd = false
        }
      })
      if (allowAdd) {
        this.cloneLayoutDate.forEach(item => {
          if (item.i === key.key) {
            addItem.i = item.i
            addItem.component = item.component
            addItem.name = item.name
          }
        })
        this.layout.push(addItem)
      } else {
        this.$message.error('已展现此模块。')
      }
      this.setting = false
    },
    deleteCom (deleteId) {
      this.layout = this.layout.filter(
        item => item.i !== deleteId
      )
    },
    cancelSetting () {
      this.setting = false
    },
    settingComponents () {
      this.setting = true
    },
    resetLayout () {
      this.layout = [
        { x: 0, y: 0, w: 10, h: 10, i: '0', component: 'updatLog', name: '更新日志', },
        { x: 0, y: 10, w: 10, h: 10, i: '1', component: 'teamList', name: '我的团队', },
        { x: 0, y: 20, w: 30, h: 20, i: '2', component: 'mySituation', name: '工作总览', },
        { x: 10, y: 0, w: 20, h: 20, i: '4', component: 'rankList', name: '公司动态', }
      ]
      this.setting = false
    },
    moveEvent: function (i, newX, newY, e) {
      // console.log(e)
      // console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resizeEvent: function (i, newH, newW) {
      // console.log("RESIZE i=" + i + ", H=" + newH + ", W=" + newW);
    },
    movedEvent: function (i, newX, newY, e) {
      // console.log(e)
      // console.log("MOVED i=" + i + ", X=" + newX + ", Y=" + newY);
    },
    resizedEvent: function (i, newH, newW, newHPx, newWPx) {
      // console.log("RESIZED i=" + i + ", H=" + newH + ", W=" + newW + ", H(px)=" + newHPx + ", W(px)=" + newWPx);
    },
  },
}
</script>

<style scoped>
  .vue-grid-layout {
    position: relative;
    width:800px;
    height:450px;
  }
  .vue-grid-layout>div {
    position: absolute;
    background: #ffffff;
  }
</style>
