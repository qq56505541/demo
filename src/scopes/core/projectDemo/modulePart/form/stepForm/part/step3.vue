<template>
  <div>
    <ta-result
      status="success"
      title="操作成功"
      sub-title="预计两小时内到账"
    >
      <template #extra>
        <ta-button key="console" type="primary" @click="refreshPage">
          再转一笔
        </ta-button>
        <ta-button key="buy" @click="refreshPage">
          查看账单
        </ta-button>
      </template>
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
    </ta-result>
  </div>
</template>

<script>
export default {
  name: 'step3',
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
    refreshPage () {
      window.location.reload()
    },
  },
}
</script>

<style scoped>

</style>
