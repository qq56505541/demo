/**
 * 可选的系统配置模块
 * 加密配置等信息
 * @type {{mutations: {setSysCfg(*, *): void}, namespace: boolean, state: {sysCfg: {userCheckCode: boolean, openSmsLogin: boolean, sessionPasswordErrorNumber: number, passwordRSA: boolean, passwordValidationErrorNumber: number, checkCodeType: string, openSocialLogin: boolean}}, getters: {showSlideCheckCode: sysConfigStore.getters.showSlideCheckCode, showClickWordCheckCode: sysConfigStore.getters.showClickWordCheckCode, passwordLevel: sysConfigStore.getters.passwordLevel, getSysState: (function(*): (*|sysConfigStore.state.sysCfg|{userCheckCode, openSmsLogin, sessionPasswordErrorNumber, passwordRSA, passwordValidationErrorNumber, checkCodeType, openSocialLogin}|state.sysCfg)), simpleCheckCodeState: sysConfigStore.getters.simpleCheckCodeState, slideCheckCodeState: sysConfigStore.getters.slideCheckCodeState, openSmsLogin: sysConfigStore.getters.openSmsLogin, showSimpleCheckCode: sysConfigStore.getters.showSimpleCheckCode, passwordRSAState: (function(*): boolean), openSocialLogin: sysConfigStore.getters.openSocialLogin}, actions: {getSysCfg({commit: *}): void}}}
 */
const sysConfigStore = {
  namespace: true,
  state: {
    sysCfg: {
      passwordRSA: true,
        userCheckCode: true,
        checkCodeType: 'simple',
        passwordValidationErrorNumber: 2,
        sessionPasswordErrorNumber: 0,
        openSocialLogin: false,
        openSmsLogin: false,
    },
  },
  getters: {
    getSysState: (state) => {
      return state.sysCfg
    },
      // 登录是否显示验证码
      simpleCheckCodeState: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType == 'simple' && (state.sysCfg.sessionPasswordErrorNumber >= state.sysCfg.passwordValidationErrorNumber)) {
        return true
      }
      return false
    },
      slideCheckCodeState: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType == 'slide' && (state.sysCfg.sessionPasswordErrorNumber >= state.sysCfg.passwordValidationErrorNumber)) {
        return true
      }
      return false
    },
      // 是否配置显示验证码
      showSimpleCheckCode: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType == 'simple') {
        return true
      }
      return false
    },
      showSlideCheckCode: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType == 'slide') {
        return true
      }
      return false
    },
      showClickWordCheckCode: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType == 'clickWord') {
        return true
      }
      return false
    },
      // 是否加密
      passwordRSAState: (state) => {
      // if (state.sysCfg.passwordRSA === true || state.sysCfg.passwordRSA === 'true') {
      //   return true
      // }
      return true
    },
      // 是否开启social登录
      openSocialLogin: (state) => {
      if (state.sysCfg.openSocialLogin === true || state.sysCfg.openSocialLogin === 'true') {
        return true
      }
      return false
    },
      // 是否开启短信验证码登录
      openSmsLogin: (state) => {
      if (state.sysCfg.openSmsLogin === true || state.sysCfg.openSmsLogin === 'true') {
        return true
      }
      return false
    },
      // 密码等级配置
      passwordLevel:(state)=>{
      if(state.sysCfg.passwordLevel>4 ||state.sysCfg.passwordLevel<1 ){
        return 3
      }else {
        return state.sysCfg.passwordLevel
      }
    }
  },
  actions: {
    getSysCfg ({ commit, }) {
      Base.submit(null, {
        url: 'loginRestService/getConfig',
        withCredentials: true,
        method: 'GET',
      }, {
        successCallback: (data) => {
          commit('setSysCfg', data.data.configMap || {})
        },
      })
    },
  },
  mutations: {
    setSysCfg (state, cfg) {
      state.sysCfg = { ...state.sysCfg, ...cfg, }
    },
  },
}
export default sysConfigStore
