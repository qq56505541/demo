import BaseConfig from './commonComponent/base-config'
import componentConfigMixin from '../mixin/componentConfigMixin'

export default {
  name: 'dataAndTime-config',
  components: { BaseConfig },
  mixins: [componentConfigMixin],
  model: {
    prop: 'config',
    event: 'change'
  },
  props: {
    config: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      defaultConfigNameList: [
        'label',
        'id',
        'initialValue',
        'placeholder',
        'extra',
        'required',
        'disabled',
        'display',
      ]
    }
  },
  render () {
    return (
      <base-config config={this.config} configNameList={this.getConfigNameList}>
        <ta-label-con label="格式化显示">
          <ta-input vModel={this.config.format} placeholder="请输入显示格式"/>
        </ta-label-con>
        {
          ['date', 'datatime'].includes(this.config.type) && (
            <div>
              <ta-label-con label="今天按钮">
                <ta-switch vModel={this.config.showToday}/>
              </ta-label-con>
            </div>
          )
        }
        {
          !['time'].includes(this.config.type) &&
          <ta-label-con label="禁用日期">
            <ta-select vModel={this.config.validNowTime}>
              <ta-select-option value="-1">不禁用</ta-select-option>
              <ta-select-option value="left">今日之前</ta-select-option>
              <ta-select-option value="right">今日之后</ta-select-option>
            </ta-select>
          </ta-label-con>
        }
        {
          ['daterange', 'datatimerange'].includes(this.config.type) && (
            <div>
              <ta-label-con label="范围限制">
                <ta-switch vModel={this.config.allowOne}/>
              </ta-label-con>
            </div>
          )
        }
        <ta-label-con label="清除按钮">
          <ta-switch vModel={this.config.allowClear}/>
        </ta-label-con>
      </base-config>
    )
  }
}
