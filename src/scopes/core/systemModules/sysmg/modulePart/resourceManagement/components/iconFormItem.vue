<template>
  <span>
    <ta-popover
      placement="top"
      title="选择图标"
      width="300px"
      trigger="manual"
      :value="showIconList"
    >
      <div slot="content" class="content">
        <ta-row>
          <ta-col
            v-for="(item,index) in outLineIconList"
            :key="index"
            :span="8"
            :class="[{'icon-box': true},{'selected': value === item}]"
            @click="select(item)"
          >
            <ta-icon :type="item" />
          </ta-col>
        </ta-row>
      </div>
      <ta-input
        slot="reference"
        allow-clear
        :value="value"
        style="width: 250px"
        placeholder="请选择图标.2.."
        @focus="focus"
        @blur="blur"
        @inputChange="change"
      />

    </ta-popover>
    <ta-icon v-if="value" style="margin-left: 10px;" :type="value" />
  </span>
</template>

<script>
import { outLineIconList, } from '../util/iconResource'
export default {
  name: 'IconFormItem',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      outLineIconList,
      showIconList: false,
    }
  },
  methods: {
    select (iconName) {
      this.$emit('change', iconName)
    },
    change (v) {
      this.$emit('change', v.target.value)
    },
    focus () {
      this.showIconList = true
    },
    blur (v) {
      this.$emit('change', v.target.value)
      this.showIconList = false
    },
  },
}
</script>

<style scoped lang="less">
.content {
    height: 400px;
    overflow-y: scroll;
}
    .icon-box {
        cursor: pointer;
        text-align: center;
        &:hover {
            background-color: @select-item-active-bg;
         }
    }
    .selected {
        background-color: @select-item-active-bg;
    }
</style>
