<template>
  <ta-border-layout layout-type="fixTop" class="noborder">
    <div slot="header" class="headerInfo">
      <h2>卡片列表</h2>
      <div>
        这里是 Livebase UI 的 Vue 实现，开发和服务于企业级后台产品。
        提炼自企业级中后台产品的交互语言和视觉风格。
        开箱即用的高质量 Vue 组件。
      </div>
    </div>
    <ta-list
      row-key="id"
      :grid="{gutter: 24, lg: 3, md: 2, sm: 1, xs: 1}"
      :data-source="dataSource"
    >
      <ta-list-item slot="renderItem" slot-scope="item">
        <template v-if="!item || item.id === undefined">
          <ta-button class="new-btn" type="dashed">
            <ta-icon type="plus" />
            新增产品
          </ta-button>
        </template>
        <template v-else>
          <ta-card :hoverable="true">
            <ta-card-meta>
              <a slot="title">{{ item.title }}</a>
              <ta-avatar class="card-avatar" slot="avatar" :src="item.avatar" size="large"/>
              <div class="meta-content" slot="description">
                {{ item.content }}
              </div>
            </ta-card-meta>
            <template class="ant-card-actions" slot="actions">
              <a>操作一</a>
              <a>操作二</a>
            </template>
          </ta-card>
        </template>
      </ta-list-item>
    </ta-list>
  </ta-border-layout>
</template>

<script>
const dataSource = []
dataSource.push({})
for (let i = 0; i < 11; i++) {
  dataSource.push({
    id: i,
    title: 'Ta404UI',
		avatar:require('./ODTLcjxAfvqbxHnVXCYX.png'),
    content: '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
  })
}
export default {
  name: 'cardList',
  data () {
    return {
      dataSource,
    }
  },

}
</script>

<style  type="text/less" lang="less" scoped>
 /deep/ .header{
    box-shadow: 0px 5px 4px rgba(136, 136, 136, 0.38);
    z-index: 999;
  }
  .headerInfo {
    padding: 34px;
    background: #fff;
  }
  .borderFixedTop{
    background: @background-color-base;
  }

  .ant-list {
    margin: 24px 24px 20px 24px;
    .ant-card-body:hover {
      .ant-card-meta-title > a {
        color: @primary-color;
      }
    }

   .ant-card-meta-title {
      margin-bottom: 12px;
      & > a {
        display: inline-block;
        max-width: 100%;
        color: rgba(0, 0, 0, .85);
      }
    }

  .meta-content {
      position: relative;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      height: 64px;
      -webkit-box-orient: vertical;
      margin-bottom: 1em;
    }
  }

  .card-avatar {
    width: 48px;
    height: 48px;
    border-radius: 48px;
  }

  .ant-card-actions {
    background: #f7f9fa;

    li {
      float: left;
      text-align: center;
      margin: 12px 0;
      color: rgba(0, 0, 0, 0.45);
      width: 50%;

      &:not(:last-child) {
        border-right: 1px solid #e8e8e8;
      }

      a {
        color: rgba(0, 0, 0, .45);
        line-height: 22px;
        display: inline-block;
        width: 100%;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }

  .new-btn {
    background-color: #fff;
    border-radius: 2px;
    width: 100%;
    height: 170px;

  }
</style>
