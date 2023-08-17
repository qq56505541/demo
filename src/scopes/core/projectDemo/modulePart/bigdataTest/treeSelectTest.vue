<template>
  <div style="padding: 20px">
    <div style="margin-bottom: 20px;border-bottom: 1px solid #eee">
      <ta-row><span style="font-size: 16px;font-weight: 600">同步测试</span></ta-row>
      <ta-row>
        <ta-label-con label="设置下拉框数据量">
          <ta-input-number :precision="0" :min="1" v-model="dataLenth" />
          <ta-button type="primary" @click="setData(dataLenth)">
            确认
          </ta-button>
        </ta-label-con>
      </ta-row>
      <ta-row>
        <ta-label-con label="是否开启虚拟滚动">
          <ta-radio-group :value="virtual" @change="handleVirtualChange">
            <ta-radio-button :value="true">
              是
            </ta-radio-button>
            <ta-radio-button :value="false">
              否
            </ta-radio-button>
          </ta-radio-group>
        </ta-label-con>
      </ta-row>
      <ta-row>
        <ta-label-con label="组件示例">
          <ta-tree-select
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto'}"
            :filter-tree-node="fnFilterTreeNode"
            show-checked-strategy="SHOW_ALL"
            :tree-data.sync="treeData"
            style="width: 300px"
            size="large"
            :virtual="virtual"
          />
        </ta-label-con>
      </ta-row>
    </div>
    <div>
      <ta-row><span style="font-size: 16px;font-weight: 600">异步测试</span></ta-row>
      <ta-row>
        <ta-label-con label="单级数据量">
          <ta-input style="width: 200px" v-model="dataAsynChildLenth" />
          <ta-button type="primary" @click="setDataLen">
            确认
          </ta-button>
        </ta-label-con>
      </ta-row>
      <ta-row>
        <ta-label-con label="是否开启虚拟滚动">
          <ta-radio-group :value="asynVirtual" @change="handleVirtualChangeAsyn">
            <ta-radio-button :value="true">
              是
            </ta-radio-button>
            <ta-radio-button :value="false">
              否
            </ta-radio-button>
          </ta-radio-group>
        </ta-label-con>
      </ta-row>
      <ta-row>
        <ta-form :auto-form-create="form=>this.form=form">
          <ta-form-item :field-decorator-id="'tree-select1'" label="下拉树1">
            <ta-tree-select
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto'}"
              show-checked-strategy="SHOW_ALL"
              :tree-data.sync="treeDataAsyn"
              style="width: 300px"
              size="large"
              :load-data="fnLoad"
              :virtual="asynVirtual"
            />
          </ta-form-item>
        </ta-form>
      </ta-row>
    </div>
  </div>
</template>

<script>
const baseId = (new Date()).valueOf()

const treeData = Array.from({ length: 20, }).map((v, index) => {
  return {
    label: '节点' + index,
    value: baseId + '' + index,
    key: baseId + '' + index,
    ff: 'n2',
  }
})

export default {
  name: 'treeSelectTest',
  data () {
    return {
      treeSelectValue: undefined,
      treeData,
      defaultValue: ['0-0-1'],
      defaultExpandKeys: ['0-0', '0-0-1', '0-0-2'],
      allowClear: false,

      dataLenth: 20,
      virtual: true,

      asynVirtual: true,
      treeDataAsyn: [],
      i: 0,
      dataAsynChildLenth: 10,
    }
  },
  methods: {
    /**
       * 当选中节点时触发事件
       * @param value
       * @param label
       * @param extra
       */
    fnTreeSelectChange (value, label, extra) {
      console.log('change')
      console.log(value)
      console.log(label)

      console.log(extra)
    },
    /**
       * 当点击节点的时候触发
       * @param value
       * @param label
       * @param extra
       */
    fnTreeSelectSelect (value, label, extra) {
      console.log('select')
      console.log(value)
      console.log(label)
      console.log(extra)
    },
    /**
       * 在search框中搜索的时候触发
       * 仅在showSearch属性为true的时候触发
       * @param value
       */
    fnTreeSelectSearch (value) {
      console.log(value)
    },
    fnFilterTreeNode (input, node) {
      return node.componentOptions.propsData.title.indexOf(input) !== -1
    },

    /**
     *异步请求函数
     * @param treeNode
     * @returns {Promise<unknown>}
     */
    fnLoad (treeNode) {
      const url = 'http/mock/projectDemo/bigdataTest/treeSelect'
      return new Promise((resolve) => {
        Base.submit(null, { url: url, data: { orgId: treeNode ? treeNode.data.key : '', dataLength: this.dataAsynChildLenth, }, }, {
          successCallback: (data) => {
            // 数据成功后默认返回的数据
            const dd = data.data
            resolve(dd)
          },
        })
      })
    },
    setData (len) {
      this.treeData = []

      this.treeData = Array.from({ length: len, }).map((v, index) => {
        return {
          label: '节点' + index,
          value: baseId + '' + index,
          key: baseId + '' + index,
          ff: 'n2',
          children: [
            {
              label: '子节点' + index,
              value: '子节点' + '' + index,
              key: '子节点' + '' + index,
              ff: 'n2',
            }
          ],
        }
      })
    },

    handleVirtualChange (e) {
      this.virtual = e.target.value
    },
    handleVirtualChangeAsyn (e) {
      this.asynVirtual = e.target.value
    },
    setDataLen () {
      this.fnLoad('')
    },
  },
}
</script>

<style scoped>
    #app {
        padding: 20px
    }
</style>
