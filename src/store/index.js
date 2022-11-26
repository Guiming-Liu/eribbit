import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
// 三个模块
import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'

// new Vuex.store({}) 2.0版本创建仓库
// createStore({})    3.0版本创建仓库

export default createStore({
  modules: {
    cart,
    category,
    user
  },
  plugins: [createPersistedState({
    // key 是储存数据的键名
    // 数据默认储存在localStorage
    // paths 是储存state 中的数据，如果是模块下的具体数据，需要加上模块名称，如user.token
    key: 'eribbit-client-pc',
    paths: ['user', 'cart']
  })]
})
