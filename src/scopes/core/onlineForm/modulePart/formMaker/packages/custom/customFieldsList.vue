<template>
  <div>
    <object-model/>

    <div v-for="(field, index) in fields"
         :key="index">
      <div v-if="!field.disabled">
        <div class="field-title">{{field.title}}</div>
        <draggable tag="ul"
                   :list="field.list"
                   :group="{ name: 'form', pull: 'clone', put: false }"
                   ghost-class="label-ghost"
                   :sort="false">
          <li class="field-label"
              v-for="(item, index) in field.list"
              :key="index">
            <a>
              <span v-if="!item.disabled">{{item.label}}</span>
              <span v-else>{{item.label+'(UI未支持)'}}</span>
            </a>
          </li>
        </draggable>
      </div>
      <div v-else>
        <div class="field-title">{{field.title}}
          <span class="danger">（开发中）</span>
        </div>
        <ul>
          <li class="field-label-disabled"
              v-for="(item, index) in field.list"
              :key="index">
            <a>
              <span>{{item.label}}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import objectModel from './objectModel/objectModel'
  import fields from './customFields.js'
  import draggable from 'vuedraggable'

  export default {
    name: 'custom-fields',
    components: {objectModel, draggable},
    data(){
      return {
        fields
      }
    }
  }
</script>

<style scoped>

</style>
