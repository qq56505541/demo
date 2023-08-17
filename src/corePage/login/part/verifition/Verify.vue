<template>
  <ta-modal
    v-model="showBox"
    :title="$t('login.verify.verifyTitle')"
    :width="378"
    :footer="null"
    :body-style="{paddingTop: '12px'}"
    @cancel="closeBox"
  >
    <components
      :is="componentType"
      v-if="componentType"
      ref="instance"
      :captcha-type="captchaType"
      :type="verifyType"
      :figure="figure"
      :arith="arith"
      :mode="mode"
      :v-space="vSpace"
      :explain="explain"
      :img-size="imgSize"
      :block-size="blockSize"
      :bar-size="barSize"
      :default-img="defaultImg"
      @success="success"
    />
  </ta-modal>
</template>
<script type="text/babel">
/**
 * Verify 验证码组件
 * @description 分发验证码使用
 * */
import VerifyPoints from './Verify/VerifyPoints'

export default {
  name: 'Vue2Verify',
  components: {
    VerifyPoints,
  },
  props: {
    captchaType: {
      type: String,
      required: true,
    },
    figure: {
      type: Number,
    },
    arith: {
      type: Number,
    },
    mode: {
      type: String,
      default: 'pop',
    },
    vSpace: {
      type: Number,
    },
    explain: {
      type: String,
    },
    imgSize: {
      type: Object,
      default () {
        return {
          width: '310px',
          height: '155px',
        }
      },
    },
    blockSize: {
      type: Object,
    },
    barSize: {
      type: Object,
    },
  },
  data () {
    return {
      clickShow: false,
      // 内部类型
      verifyType: undefined,
      // 所用组件类型
      componentType: undefined,
      // 默认图片
      defaultImg: require('./assets/default.jpg'),
    }
  },
  computed: {
    instance () {
      return this.$refs.instance || {}
    },
    showBox: {
      get () {
        if (this.mode === 'pop') {
          return this.clickShow
        } else {
          return true
        }
      },
      set (value) {
        return value
      },
    },
  },
  watch: {
    captchaType: {
      immediate: true,
      handler (captchaType) {
        switch (captchaType.toString()) {
          case 'clickWord':
            this.verifyType = ''
            this.componentType = 'VerifyPoints'
            break
        }
      },
    },
  },
  mounted () {
    this.uuid()
  },
  methods: {
    success (param) {
      this.$emit('success', param)
    },
    // 生成 uuid
    uuid () {
      const s = []
      const hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
      s[8] = s[13] = s[18] = s[23] = '-'

      const slider = 'slider' + '-' + s.join('')
      const point = 'point' + '-' + s.join('')
      // 判断下是否存在 slider
      console.log(localStorage.getItem('slider'))
      if (!localStorage.getItem('slider')) {
        localStorage.setItem('slider', slider)
      }
      if (!localStorage.getItem('point')) {
        localStorage.setItem('point', point)
      }
    },
    /**
     * refresh
     * @description 刷新
     * */
    refresh () {
      if (this.instance.refresh) {
        this.instance.refresh()
      }
    },
    closeBox () {
      this.clickShow = false
      // this.refresh()  // 关闭后不需再刷新验证码
    },
    show () {
      if (this.mode === 'pop') {
        this.clickShow = true
        this.$nextTick(() => {
          this.$refs.instance.getPicture()
        })
      }
    },
  },
}
</script>
<style scoped>

</style>
