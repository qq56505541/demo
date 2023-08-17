<template>
  <div class="rank">
    <h4 class="title">
      {{ title }}
    </h4>
    <div style="height: calc(100vh - 370px);overflow-y: scroll;">
      <ta-list
        item-layout="horizontal"
        :data-source="list"
      >
        <ta-list-item slot="renderItem" slot-scope="item, index">
          <ta-list-item-meta>
            <span slot="description">薪资为 {{ item.total }}</span>
            <a slot="title" href="/#/docs/components/list-cn">{{ item.name }}</a>
            <ta-avatar slot="avatar" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          </ta-list-item-meta>
        </ta-list-item>
      </ta-list>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RankList',
  // ['title', 'list']
  props: {
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default: null,
    },
  },
}
</script>

<style lang="less" scoped>

  .rank {
    padding: 0 32px 32px 72px;

    .list {
      margin: 25px 0 0;
      padding: 0;
      list-style: none;

      li {
        margin-top: 16px;

        span {
          color: rgba(0, 0, 0, .65);
          font-size: 14px;
          line-height: 22px;

          &:first-child {
            background-color: #f5f5f5;
            border-radius: 20px;
            display: inline-block;
            font-size: 12px;
            font-weight: 600;
            margin-right: 24px;
            height: 20px;
            line-height: 20px;
            width: 20px;
            text-align: center;
          }
          &.active {
            background-color: #314659;
            color: #fff;
          }
          &:last-child {
            float: right;
          }
        }
      }
    }
  }

  .mobile .rank {
    padding: 0 32px 32px 32px;
  }

</style>
