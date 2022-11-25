import { createStore } from 'vuex'

// new Vuex.store({}) 2.0版本创建仓库
// createStore({})    3.0版本创建仓库

const moduleA = {
  state: {
    username: 'moduleA'
  }
}
const moduleB = {
  namespaced: true,
  state: {
    username: 'moduleB'
  }
}
export default createStore({
  modules: {
    moduleA,
    moduleB
  }
})
