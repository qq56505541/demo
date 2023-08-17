<template>
  <div>
    <ta-label-con label="数据源" style="margin-bottom: 10px">
      <ta-select v-model="currentSelectSourceData">
        <ta-select-option
          v-for="(item,index) in objectModelFields.dataSource"
          :value="item"
          :key="index">
          {{item}}
        </ta-select-option>
      </ta-select>
    </ta-label-con>
    <div v-if="currentSelectSourceData !== '' && objectModelFields.sourceList[currentSelectSourceData].length > 0">
      <ta-collapse accordion :bordered="false">
        <ta-collapse-panel
          :header="item.label"
          v-for="(item,index) in objectModelFields.sourceList[currentSelectSourceData]"
          :key="index">
          <draggable tag="ul"
                     :list="item.fields"
                     :group="{ name: 'form', pull: 'clone', put: false }"
                     ghost-class="label-ghost"
                     :sort="false">
            <li class="field-label"
                v-for="(fieldItem, fieldIndex) in item.fields"
                :key="fieldIndex">
              <a>
                <span v-if="!item.disabled">{{fieldItem.label}}</span>
                <span v-else>{{fieldItem.label+'(UI未支持)'}}</span>
              </a>
            </li>
          </draggable>
        </ta-collapse-panel>
      </ta-collapse>
    </div>
  </div>
</template>

<script>
  import objectModelFields from './objectModelFields'
  import draggable from 'vuedraggable'
  export default {
    name: 'customFields',
    components:{draggable},
    data(){
      return {
        objectModelFields,
        currentSelectSourceData: 'source1'
      }
    }
  }
</script>

<style scoped>

</style>
