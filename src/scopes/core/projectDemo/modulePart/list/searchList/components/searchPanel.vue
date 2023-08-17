<template>
  <ta-form layout="inline" :auto-form-create="form => this.form = form">
    <div class="form-item">
      <ta-form-item label="所属类目" :label-width="75" field-decorator-id="categories">
        <ta-checkable-tag-group :data="data" show-all :tag-style="{fontSize: '14px',margin: '0 12px'}" />
      </ta-form-item>
    </div>
    <div class="form-item">
      <ta-form-item label="活跃用户" :label-width="75" field-decorator-id="activeUser">
        <ta-input />
      </ta-form-item>
      <ta-form-item label="好评度" :label-width="75" field-decorator-id="rate">
        <ta-input />
      </ta-form-item>
      <transition-group name="normal-fade">
        <ta-form-item key="owners" v-if="routeName === 'projectSearch'" label="所有者" :label-width="75" field-decorator-id="owner">
          <ta-select :options="owners" style="width: 177px;" />
        </ta-form-item>
        <ta-button key="ownersButton" v-if="routeName === 'projectSearch'" type="link" @click="setOwner">
          只看自己的
        </ta-button>
      </transition-group>
    </div>
  </ta-form>
</template>
<script>
import TaCheckableTagGroup from './checkable-tag-group.jsx'

const owners = [
  {
    value: 'wzj',
    label: '我自己',
  },
  {
    value: 'wjh',
    label: '吴家豪',
  },
  {
    value: 'zxx',
    label: '周星星',
  },
  {
    value: 'zly',
    label: '赵丽颖',
  },
  {
    value: 'ym',
    label: '姚明',
  }
]
export default {
  name: 'searchPanel',
  components: { TaCheckableTagGroup, },
  data () {
    return {
      owners,
      data: Array.from({ length: 10, }).map((_, index) => ({ value: index, label: `类目${index}`, })),
    }
  },
  computed: {
    routeName () {
      return this.$route.name
    },
  },
  methods: {
    setOwner () {
      this.form.setFieldsValue({
        owner: ['wzj'],
      })
      console.log(this.form.getFieldsValue())
    },
  },
}
</script>

<style lang="less" scoped>
.form-item {
  border-bottom: 1px dashed @border-color-base;
  padding: 10px 0;

  & /deep/ .ant-form-item-info {
    min-height: 0;
  }

  &:last-child {
    border-bottom: none;
  }
}
</style>
