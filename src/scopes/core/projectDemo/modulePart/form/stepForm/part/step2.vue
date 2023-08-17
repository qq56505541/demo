<template>
  <div>
    <ta-row>
      <ta-alert
        message="确认转账"
        description="确认转账后,资金将会直接打入对方账户中,请确认是否转账!"
        type="success"
        :show-icon="true"
      />
    </ta-row>
    <ta-row>
      <ta-divider />
    </ta-row>
    <ta-row>
      <ta-descriptions title="转账信息" bordered>
        <ta-descriptions-item label="付款账户">
          {{ payAccount }}
        </ta-descriptions-item>
        <ta-descriptions-item label="收款账户">
          {{ getMoneyAccount.cardNum }}
        </ta-descriptions-item>
        <ta-descriptions-item label="收款人姓名">
          {{ getAccountName }}
        </ta-descriptions-item>
        <ta-descriptions-item label="转账金额">
          ¥{{ money }}
        </ta-descriptions-item>
      </ta-descriptions>
    </ta-row>
    <ta-row>
      <ta-divider />
    </ta-row>
    <ta-form :auto-form-create="form=>this.form=form">
      <ta-form-item :label="'支付密码'" :field-decorator-id="'payPwd'" :init-value="'111111'">
        <ta-input :type="'password'" />
      </ta-form-item>
    </ta-form>
  </div>
</template>

<script>
export default {
  name: 'step2',
  data () {
    return {
      payAccount: '',
      getMoneyAccount: {},
      getAccountName: '',
      money: '',
    }
  },
  methods: {
    getFormData () {
      return this.form.getFieldsValue()
    },
    setFormData ({ payAccount, getMoneyAccount, getAccountName, money, }) {
      this.payAccount = payAccount
      this.getMoneyAccount = getMoneyAccount
      this.getAccountName = getAccountName
      this.money = money
    },
  },
}
</script>

<style scoped>

</style>
