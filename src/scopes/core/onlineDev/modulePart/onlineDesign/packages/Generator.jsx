import './style/index.less'
import formGenerator from '../../../../onlineForm/modulePart/formMaker/packages/formGenerator'

export default {
  name: 'Generator',
  components: { formGenerator, },
  props: {
    allData: Object,
  },
  data () {
    return {
      initData: null,
      query: {},
      dataSource: [],
      operateMenu: null,
      operateType: 'add',
      drawerVisible: false,
      record: {},
      formTemplate: {},
    }
  },
  created () {
    this.initData = JSON.parse(JSON.stringify(this.allData))
    if (this.initData.featData.edit || this.initData.featData.delete) {
      this.initData.tableColumns.push({
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        scopedSlots: { customRender: 'operation', },
      })
      this.operateMenu = []
      if (this.initData.featData.edit) {
        this.operateMenu.push({
          name: '编辑',
          onClick: this.handleEdit,
        })
      }
      if (this.initData.featData.delete) {
        this.operateMenu.push({
          name: '删除',
          type: 'confirm',
          confirmTitle: '确认删除这条数据?',
          onOk: (record) => {
            this.handleDelete(record[this.allData.primaryKey])
          },
        })
      }
    }
    if (this.initData.featData.search) {
      this.$set(this.query, this.initData.featData.search[0], '')
    }
    if (this.initData.featData.filter) {
      this.$set(this.query, this.initData.featData.filter[0], [])
    }
    this.handleQuery()
  },
  computed: {},
  methods: {
    handleQuery () {
      const query = JSON.parse(JSON.stringify(this.query))
      if (this.initData.featData.filter) {
        query[this.initData.featData.filter[0]] = query[this.initData.featData.filter[0]].length === 0 ? undefined : query[this.initData.featData.filter[0]].join('')
      }
      if (this.initData.featData.search) {
        query[this.initData.featData.search[0]] = query[this.initData.featData.search[0]].trim().length === 0 ? undefined : query[this.initData.featData.search[0]]
      }
      Base.submit(null, {
        url: `${this.allData.tableName}/query`,
        data: query,
      }).then((res) => {
        this.dataSource = res.data.resultData
      })
    },
    handleAdd () {
      this.operateType = 'add'
      this.record = {}
      this.formTemplate = JSON.parse(JSON.stringify(this.allData.formTemplate))
      this.drawerVisible = true
    },
    handleEdit (record) {
      this.operateType = 'edit'
      this.record = record
      this.formTemplate = JSON.parse(JSON.stringify(this.allData.formTemplate))
      this.formTemplate.formColumns = this.formTemplate.formColumns.map(item => {
        item.initialValue = this.record[item.fieldDecoratorId]
        return item
      })
      this.drawerVisible = true
    },
    handleSave (type, form) {
      const data = form.getFieldsMomentValue()
      if (type === 'add') {
        Base.submit(null, { url: `${this.allData.tableName}/add`, data: data, }).then(() => {
          this.$message.success('保存成功')
          this.handleQuery()
        })
      }
      if (type === 'edit') {
        data[this.allData.primaryKey] = this.record[this.allData.primaryKey]
        Base.submit(null, { url: `${this.allData.tableName}/edit`, data: data, }).then(() => {
          this.$message.success('保存成功')
          this.handleQuery()
        })
      }
      this.formTemplate = {}
    },
    handleDelete (key) {
      const data = {}
      data[this.allData.primaryKey] = key
      Base.submit(null, { url: `${this.allData.tableName}/delete`, data: data, }).then(() => {
        this.handleQuery()
        this.$message.success('删除成功')
      })
    },
  },
  render () {
    const formTemplate = this.allData.formTemplate

    const borderLayoutProps = {
      props: {
        layout: this.initData.featData.search ? { header: '70px', } : undefined,
        centerCfg: { showBar: true, toolBarStyle: { height: '50px', lineHeight: '48px', }, },
      },
    }
    let inputSearchProps = null
    if (this.initData.featData.search) {
      const searchName = this.initData.tableColumns.filter(item => item.key === this.initData.featData.search[0])[0].title
      inputSearchProps = {
        props: {
          placeholder: `请输入${searchName}`,
          enterButton: '搜索',
        },
        class: 'search-box',
        on: {
          search: this.handleQuery,
        },
      }
    }
    let tagSelectProps = null
    if (this.initData.featData.filter) {
      const collectionType = this.initData.tableColumns.filter(item => item.key === this.initData.featData.filter[0])[0].collectionType
      const collectionTypeTitle = this.initData.tableColumns.filter(item => item.key === this.initData.featData.filter[0])[0].title
      tagSelectProps = {
        props: {
          data: this.CollectionData(collectionType),
          title: collectionTypeTitle,
        },
        class: 'filter-name',
        on: {
          change: this.handleQuery,
        },
      }
    }
    let addButtonProps = null
    if (this.initData.featData.add) {
      addButtonProps = {
        props: {
          type: 'primary',
        },
        style: 'float: right;',
        on: {
          click: this.handleAdd,
        },
        scopedSlots: {
          default: () => '新增',
        },
      }
    }

    const tableProps = {
      props: {
        columns: this.initData.tableColumns,
        dataSource: this.dataSource,
        pagination: this.initData.featData.pagination ? {
          pageSizeOptions: this.initData.featData.pagination,
          defaultPageSize: parseInt(this.initData.featData.pagination[1]),
        } : undefined,
        haveSn: this.initData.featData.haveSn,
        size: this.initData.featData.size,
        showOverflowTooltip: this.initData.featData.showOverflowTooltip,
      },
    }

    let drawerProps = null
    if (this.initData.featData.add || this.initData.featData.edit) {
      drawerProps = {
        props: {
          title: this.operateType === 'add' ? '新增' : '编辑',
          width: formTemplate.formConfig.previewDrawerWidth + 'px',
          placement: 'right',
          closable: true,
          visible: this.drawerVisible,
          destroyOnClose: true,
        },
        on: {
          close: () => this.drawerVisible = false,
        },
      }
    }

    let formGeneratorProps = null
    if (this.allData.formTemplate && this.allData.formTemplate !== '') {
      formGeneratorProps = {
        props: {
          initData: this.formTemplate,
        },
        on: {
          submitForm: (form) => {
            this.drawerVisible = false
            this.handleSave(this.operateType, form)
          },
        },
      }
    }

    return (
      <div class="generator-container">
        <ta-border-layout {...borderLayoutProps}>
          {this.initData.featData.search && <div slot="header" class="center-box">
            <div class="center-item">
              <ta-input-search {...inputSearchProps} vModel={this.query[this.initData.featData.search[0]]}/>
            </div>
          </div>}
          {(this.initData.featData.filter || this.initData.featData.add) && <div slot="centerExtraContent">
            {this.initData.featData.filter &&
            <ta-tag-select {...tagSelectProps} vModel={this.query[this.initData.featData.filter[0]]}/>}
            {this.initData.featData.add && <ta-button {...addButtonProps}>新增</ta-button>}
          </div>}
          <ta-table {...tableProps}>
            {(this.initData.featData.edit || this.initData.featData.delete) && (
              <span slot="operation" slot-scope="text, record, index">
                <ta-table-operate operateMenu={this.operateMenu}/>
              </span>
            )}
          </ta-table>
        </ta-border-layout>
        <ta-drawer {...drawerProps}>
          <form-generator {...formGeneratorProps}/>
        </ta-drawer>
      </div>
    )
  },
}
