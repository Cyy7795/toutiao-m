import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)
const TOKEN_KEY = 'TOUTIAO_USER'   //定义用户数据

export default new Vuex.Store({
  state: {
    // user 是一个对象，存储当前登录用户信息（token等数据）
    user: getItem(TOKEN_KEY)  // 用已经分装好的方法取数据  getItem 
    // user: JSON.parse(window.localStorage.getItem(TOKEN_KEY))  // 还原成字符串格式
  },
  mutations: {
    // setUser 是自定义的 mutations函数 第一个参数固定是 state
    setUser(state, data) {
      state.user = data
      // 这个setUser方法会传入新值，新值会更改本地数据中存储的值
      // 为了防止刷新丢失，我们需要把数据备份到本地存储
      setItem(TOKEN_KEY, state.user) // 用已经分装好的方法存数据 
      // window.localStorage.setItem(TOKEN_KEY, JSON.stringify(state.user))  // 字符串格式
    }
  },
  actions: {
  },
  modules: {
  }
})
