<template>
  <div class="fit" style="overflow-y: auto">
    <ta-row class="title-bd">
      <ta-col :span="6" style="text-align:center;font-size:16px;font-weight:600;padding-left: 10px">
        选择表及字段
      </ta-col>
      <ta-col :span="18" style="text-align:center;font-size:16px;font-weight:600;padding-left: 10px">
        字段操作
      </ta-col>
    </ta-row>
    <ta-row>
      <ta-col :span="6">
        <ta-label-con label="表">
          <ta-select placeholder="选择表" :default-value="tableName" @select="handleSelect">
            <ta-select-option v-for="name in tableNames" :key="name" :value="name">
              {{ name }}
            </ta-select-option>
          </ta-select>
        </ta-label-con>
        <ta-label-con label="字段">
          <ta-row
            v-for="item in columns"
            :key="item.key"
          >
            <ta-checkbox
              :checked="tableColumnKeys.includes(item.key)"
              :value="item.key"
              @change="handleCheckboxChange"
            >
              {{ item.name }}
            </ta-checkbox>
          </ta-row>
        </ta-label-con>
      </ta-col>
      <ta-col :span="18" class="content-bd">
        <Draggable
          class="list-group"
          tag="ul"
          handle=".anticon-bars"
          v-model="controlledTableColumns"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
          v-show="controlledTableColumns.length > 0"
        >
          <transition-group type="transition" :name="!drag ? 'flip-list' : null">
            <li
              class="list-group-item"
              v-for="element in controlledTableColumns"
              :key="element.key"
            >
              <span style="margin-right: 20px"><ta-icon style="cursor: move;" class="icon" type="bars" /></span>
              <span style="margin-right: 20px">
                <span style="color: #999">Key：</span>{{ element.key }}
              </span>
              <span style="margin-right: 20px">
                <span style="color: #999">列名：</span>{{ element.title }}
              </span>
              <span style="margin-right: 20px">
                <span style="color: #999">对齐：</span>
                <ta-select
                  :default-value="element.align || 'null'"
                  size="small"
                  style="width: 100px"
                  @select="(val) => handlePropertyChange(element.key, 'align', val)"
                >
                  <ta-select-option value="null">请选择</ta-select-option>
                  <ta-select-option value="left">左对齐</ta-select-option>
                  <ta-select-option value="right">右对齐</ta-select-option>
                  <ta-select-option value="center">居中对齐</ta-select-option>
                </ta-select>
              </span>
              <!--              <span style="margin-right: 20px">-->
              <!--                <span style="color: #999">固定列：</span>-->
              <!--                <ta-select :default-value="element.fixed || 'null'" size="small" style="width: 80px" @select="(val) => handlePropertyChange(element.key, 'fixed', val)">-->
              <!--                  <ta-select-option value="null">请选择</ta-select-option>-->
              <!--                  <ta-select-option value="left">左</ta-select-option>-->
              <!--                  <ta-select-option value="right">右</ta-select-option>-->
              <!--                </ta-select>-->
              <!--              </span>-->
              <span style="margin-right: 20px">
                <span style="color: #999">宽度：</span>
                <ta-input
                  placeholder="宽度"
                  size="small"
                  style="width: 50px"
                  :default-value="element.width"
                  @change="(val) => handlePropertyChange(element.key, 'width', val.target.value)"
                />
              </span>
              <span>
                <span style="color: #999">字典类型：</span>
                <ta-input
                  placeholder="字典类型"
                  size="small"
                  style="width: 100px"
                  :default-value="element.collectionType"
                  @change="(val) => handlePropertyChange(element.key, 'collectionType', val.target.value)"
                />
              </span>
              <span class="icon" style="float: right"><ta-icon type="close" @click="removeAt(element.key)" /></span>
            </li>
          </transition-group>
        </Draggable>
        <ta-empty style="margin: 100px 0;min-height: calc(100vh - 354px)" v-show="controlledTableColumns.length === 0" />
      </ta-col>
    </ta-row>
  </div>
</template>

<script>
import { mapGetters, mapState, } from 'vuex'
import Draggable from 'vuedraggable'

export default {
  name: 'DesignTable',
  components: { Draggable, },
  data () {
    return {
      tableNames: [],
      columns: [],
      drag: false,
      templateStorage: null,
    }
  },
  computed: {
    ...mapState('design', [
      'tableColumns',
      'tableName'
    ]),
    ...mapGetters('design', [
      'tableColumnKeys'
    ]),
    controlledTableColumns: {
      get: function () {
        return this.tableColumns
      },
      set: function (val) {
        this.$nextTick(() => {
          this.$store.dispatch('design/setTableColumns', val)
        })
      },
    },
    dragOptions () {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      }
    },
  },
  created () {
    this.templateStorage = TaUtils.webStorage.createWebStorage('templateStorage')

    this.modulePartInfo = JSON.parse(this.templateStorage.get('editTemplateModuleInfo'))

    Base.submit(null, { url: 'onlineForm/templateMg/templateMgRestService/queryTable', _modulePartId_: this.modulePartInfo.id, }).then((res) => {
      this.tableNames = res.data.resultData
    })
    if (this.tableName) {
      Base.submit(null, {
        url: 'onlineForm/templateMg/templateMgRestService/queryTableColumns',
        _modulePartId_: this.modulePartInfo.id,
        data: { tableName: this.tableName, },
      }).then((res) => {
        this.columns = []
        for (const [key, name] of Object.entries(res.data.resultData)) {
          if (key !== 'primaryKey') {
            this.columns.push({
              key,
              name,
            })
          } else {
            this.$store.dispatch('design/setPrimaryKey', name)
          }
        }
      })
    }
  },
  methods: {
    handleSelect (val) {
      this.$store.dispatch('design/setTableName', val)
      this.$store.dispatch('design/setPrimaryKey', '')
      this.$store.dispatch('design/setTableColumns', [])
      this.$store.dispatch('design/setChosenFeats', [])
      this.$store.dispatch('design/setFeatData', {
        search: null,
        filter: null,
        delete: null,
        size: null,
        haveSn: null,
        showOverflowTooltip: null,
        scrollY: null,
        scrollX: null,
        pagination: null,
      })
      this.$store.dispatch('design/setApis', {
        add: 'add',
        remove: 'remove',
        query: 'query',
        edit: 'edit',
      })
      Base.submit(null, {
        url: 'onlineForm/templateMg/templateMgRestService/queryTableColumns',
        _modulePartId_: this.modulePartInfo.id,
        data: { tableName: val, },
      }).then((res) => {
        this.columns = []
        for (const [key, name] of Object.entries(res.data.resultData)) {
          if (key !== 'primaryKey') {
            this.columns.push({
              key,
              name,
            })
          } else {
            this.$store.dispatch('design/setPrimaryKey', name)
          }
        }
      })
    },
    generateColumn (column) {
      return {
        title: column.name,
        key: column.key,
        dataIndex: column.key,
      }
    },
    handleCheckboxChange (e) {
      const {
        checked,
        value,
      } = e.target
      const data = this.columns.filter(item => item.key === value)[0]
      const exist = this.tableColumnKeys.filter(item => item === data.key).length !== 0
      checked && !exist && this.$store.dispatch('design/addTableColumn', this.generateColumn(data))
      !checked && this.$store.dispatch('design/removeTableColumn', data.key)
    },
    removeAt (key) {
      this.$store.dispatch('design/removeTableColumn', key)
    },
    handlePropertyChange (elementKey, property, val) {
      if (!val) return
      if (typeof val === 'string' && (val === 'null' || val === '' || val.trim() === '')) val = null

      const data = {}
      data[property] = val
      if (property === 'align') data.tdAlign = val
      this.$store.dispatch('design/modifyTableColumn', {
        key: elementKey,
        data,
      })
    },
  },
}
</script>

<style lang="less" type="text/less" scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0;
  margin-inline-end: 0;
  padding-inline-start: 0;
  min-height: calc(100vh - 154px);
  list-style: none;
}

.list-group-item {
  list-style: none;
  height: 50px;
  line-height: 30px;
  padding: 10px 20px;
  border-bottom: 1px solid @border-color-base;

  &:last-child {
    border-bottom: none;
  }
}

.icon {
  transition: color .5s;

  &:hover {
    color: @primary-color;
  }
}

  .title-bd {
    border-bottom: 1px solid @border-color-base;
    padding-bottom: 10px
  }
  .content-bd {
    border-left: 1px solid @border-color-base;
  }
</style>
