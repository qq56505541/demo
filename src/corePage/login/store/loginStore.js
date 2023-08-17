import Vue from 'vue'
import Vuex from 'vuex'
import sysConfigStore from '@common/store/module/sysConfigStore'

Vue.use(Vuex)
const loginStore = new Vuex.Store({...sysConfigStore})

export default loginStore
