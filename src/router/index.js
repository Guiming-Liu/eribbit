import { createRouter, createWebHashHistory } from 'vue-router'
// 定义路由规则
const routes = []

// new VueRouter({}) 2.0版本创建路由实例
// createRouter({})  3.0版本创建路由实例
const router = createRouter({
  // 使用hash的路由模式
  history: createWebHashHistory(),
  routes
})

export default router
