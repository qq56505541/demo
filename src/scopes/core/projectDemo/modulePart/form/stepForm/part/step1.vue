<template>
  <ta-form :auto-form-create="form=>this.form=form" :wrapper-col="{span: 12}">
    <ta-form-item label="付款账户" :field-decorator-id="'payAccount'" :init-value="'aaa'" :required="true">
      <ta-select>
        <ta-select-option value="aaa">
          aaa@yinhai.com
        </ta-select-option>
      </ta-select>
    </ta-form-item>
    <ta-form-item :label="'收款账户'" :field-decorator-id="'getMoneyAccount'" :init-value="{accountType: 'icbc', cardNum: '000000000000'}" :required="true">
      <get-money-account />
      <template slot="extra">
        当前表单控件是一个自定义表单控件
      </template>
    </ta-form-item>
    <ta-form-item :label="'收款人姓名'" :field-decorator-id="'getAccountName'" :required="true" :init-value="'admin'">
      <ta-input />
    </ta-form-item>
    <ta-form-item :label="'转账金额'" :field-decorator-id="'money'" :required="true" :init-value="'99999.99'">
      <ta-input :addon-before="'¥'" />
    </ta-form-item>
  </ta-form>
</template>

<script>
import getMoneyAccount from './getMoneyAccount.vue'
export default {
  name: 'step1',
  components: {
    getMoneyAccount,
  },
  data () {
    return {
    }
  },
  methods: {
    getFormData () {
      return this.form.getFieldsValue()
    },
  },
}
</script>

<style scoped>

</style>
