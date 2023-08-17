<template>
  <div style="height: 100%;position: relative">
    <div class="card-header">
      <slot name="header" />
      <ta-icon @click="deleteItem" v-if="setting" style="float:right;margin-top: 16px;margin-right: 12px;" type="delete" />
    </div>
    <div style="height: calc(100% - 50px);overflow-y: auto;padding: 10px" class="scrollbar">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'cardFrame',
  props: {
    setting: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  methods: {
    deleteItem () {
      this.$emit('deleteCom', this.id)
    },
  },
}
</script>

<style scoped>
    .card-header {
        height: 50px;
        line-height: 50px;
        font-weight: bold;
        /*position: absolute;*/
        /*top: 0;*/
        padding-left: 12px;
    }

    .scrollbar::-webkit-scrollbar {
        /*滚动条整体样式*/
        width : 4px;  /*高宽分别对应横竖滚动条的尺寸*/
        height: 4px;
    }
    .scrollbar::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 4px;
        box-shadow   : inset 0 0 4px rgba(210, 210, 210, 0.09);
        background   : rgba(83, 83, 83, 0.22);
    }
    .scrollbar::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        box-shadow   : inset 0 0 5px rgba(210, 210, 210, 0.2);
        border-radius: 10px;
        background   : #ededed;
    }
</style>
