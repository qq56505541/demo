<template>
  <div>
    <ta-input-group compact>
      <ta-select :value="value.accountType" style="width: 30%;">
        <ta-select-option value="icbc">
          中国工商银行
        </ta-select-option>
        <ta-select-option value="abc">
          中国农业银行
        </ta-select-option>
      </ta-select>
      <ta-input :value="value.cardNum" style="width: 70%" />
    </ta-input-group>
  </div>
</template>

<script>
export default {
  name: 'getMoneyAccount',
  props: {
    value: {
      type: Object,
      default () {
        return {
          accountType: '', // 证件类型
          cardNum: '', // 证件号
        }
      },
    },
  },
}
</script>

<style scoped>

</style>
