<template>
  <div>
    <ta-modal
      title="选择工作台"
      :visible="visible"
      :destroy-on-close="true"
      on-ok="generateWorkTable"
      :closable="false"
    >
      <ta-tag-select
        class="tagSelect"
        :data="templateTags"
        :value="templateSelectedTag"
        required
        @change="onTagSelectChange"
      />
      <template slot="footer">
        <ta-button @click="$emit('update:visible',false)">
          取消
        </ta-button>
        <ta-button key="submit" type="primary" :loading="confirmLoading" @click="generateWorktable">
          确定
        </ta-button>
      </template>
    </ta-modal>
  </div>
</template>

<script>
export default {
  name: 'SwitchModal',
  props: {
    visible: {
      type: Boolean,
      default: false,
      require: true,
    },
    confirmLoading: {
      type: Boolean,
      default: false,
      require: true,
    },
    templateTags: {
      type: Array,
      require: true,
    },
    templateSelectedTag: {
      type: Array,
      require: true,
    },
  },
  methods: {
    generateWorktable: function () {
      this.$emit('generateWorktable')
    },
    onTagSelectChange: function (data) {
      if (data.length === 0) return
      this.$emit('update:templateSelectedTag', data)
    },
  },
}
</script>

<style lang="less" scoped>
  .tagSelect {
    line-height: 40px;
  }
</style>
