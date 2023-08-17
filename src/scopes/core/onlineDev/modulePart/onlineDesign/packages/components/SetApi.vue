<template>
  <div>
    <ta-label-con
      label="新增接口"
      :label-col="{span:4}"
      :wrapper-col="{span:20}"
      v-if="chosenFeats.includes('add')"
      style="margin-bottom: 8px;"
    >
      <ta-input :value="apis.add" @change="(e) => handleApisChange('add', e.target.value)" />
    </ta-label-con>
    <ta-label-con
      label="修改接口"
      :label-col="{span:4}"
      :wrapper-col="{span:20}"
      v-if="chosenFeats.includes('edit')"
      style="margin-bottom: 8px;"
    >
      <ta-input :value="apis.edit" @change="(e) => handleApisChange('edit', e.target.value)" />
    </ta-label-con>
    <ta-label-con
      label="删除接口"
      :label-col="{span:4}"
      :wrapper-col="{span:20}"
      v-if="chosenFeats.includes('delete')"
      style="margin-bottom: 8px;"
    >
      <ta-input :value="apis.remove" @change="(e) => handleApisChange('remove', e.target.value)" />
    </ta-label-con>
  </div>
</template>
<script>
import { mapState, } from 'vuex'

export default {
  name: 'SetApi',
  computed: {
    ...mapState('design', ['chosenFeats', 'apis']),
  },
  methods: {
    handleApisChange (property, val) {
      const data = {}
      data[property] = val
      this.$store.dispatch('design/modifyApis', data)
    },
  },
}
</script>
