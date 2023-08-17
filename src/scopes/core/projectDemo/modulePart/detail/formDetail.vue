<template>
  <div class="fit">
    <ta-button-group>
      <ta-button @click="openDrawer(1)">
        一般新增/编辑
      </ta-button>
      <ta-button @click="openDrawer(2)">
        查看详情/编辑
      </ta-button>
      <ta-button @click="openDrawer(3)">
        仅查看详情
      </ta-button>
    </ta-button-group>
    <ta-drawer
      :title="title"
      width="500"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="onClose"
    >
      <ta-form :auto-form-create="(form)=>{this.form = form}" :detail-edit="detailEdit">
        <ta-form-item
          label="姓名"
          field-decorator-id="name"
          :require="{message:'请输入姓名!'}"
        >
          <ta-input placeholder="请输入姓名" />
          <template #detail="{id, label, value}">
            {{ value }}
          </template>
        </ta-form-item>
        <ta-form-item
          label="性别"
          field-decorator-id="sex"
          :require="{message:'请选择性别!'}"
        >
          <ta-select style="width: 100%">
            <ta-select-option value="1">
              男
            </ta-select-option>
            <ta-select-option value="2">
              女
            </ta-select-option>
          </ta-select>
          <template #detail="{id, label, value}">
            {{ value === '1' ? '男' : value === '2' ? '女' : '' }}
          </template>
        </ta-form-item>
        <ta-form-item
          label="年龄"
          field-decorator-id="age"
        >
          <ta-input placeholder="请输入年龄" />
          <template #detail="{id, label, value}">
            {{ value }}
          </template>
        </ta-form-item>
        <ta-form-item
          label="民族"
          field-decorator-id="mingz"
        >
          <ta-select style="width: 100%">
            <ta-select-option value="1">
              汉族
            </ta-select-option>
          </ta-select>
          <template #detail="{id, label, value}">
            {{ value === '1' ? '汉族' : '未填写' }}
          </template>
        </ta-form-item>
        <ta-form-item
          label="证件号码"
          field-decorator-id="idcard"
          :require="{message:'请输入身份证号码!'}"
          :field-decorator-options="{rules: [{ idCard: '2', message: '输入的身份证号码不合法'}]}"
        >
          <ta-input placeholder="请输入身份证号" />
          <template #detail="{id, label, value}">
            {{ value }}
          </template>
        </ta-form-item>
        <ta-form-item
          label="联系电话"
          field-decorator-id="phone"
          :require="{message:'请输入电话号码!'}"
          :field-decorator-options="{rules: [{ phone: 'mobile', message: '输入的手机号码不合法'}]}"
        >
          <ta-input placeholder="请输入联系电话" />
          <template #detail="{id, label, value}">
            {{ value }}
          </template>
        </ta-form-item>
      </ta-form>
      <template #footer>
        <ta-button style="margin-right: 10px" @click="setFieldValue">
          设置值
        </ta-button>
        <ta-button type="primary" @click="handleSubmit">
          提交
        </ta-button>
      </template>
    </ta-drawer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      title: '一般新增/编辑',
      visible: false,
      detailEdit: false,
    }
  },
  methods: {
    openDrawer (type) {
      this.visible = true
      switch (type) {
        case 1: {
          this.title = '一般新增/编辑'
          this.detailEdit = false
          break
        }
        case 2: {
          this.title = '查看详情/编辑'
          this.detailEdit = true
          break
        }
        case 3: {
          this.title = '仅查看详情'
          this.$set(this.$data, 'detailEdit', { edit: false, })
          break
        }
      }
    },
    onClose () {
      this.visible = false
    },
    // 文本框赋值
    setFieldValue () {
      const values = { name: 'Nacy', sex: '1', idcard: '5401061995106035410', phone: '13850107544', }
      this.form.setFieldsValue(values)
    },
    // 提交
    handleSubmit () {
      console.log(this.form.getFieldsValue())
    },
  },
}
</script>
