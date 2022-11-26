// 1.创建一个新的axios实例
// 2.请求拦截器，如果有token，进行头部携带
// 3.响应拦截器：1. 剥离无效数据   2. 处理token失效
// 4.导出一个函数，调用当前的axios实例发送请求，返回Promise
import router from '@/router'
import store from '@/store'
import axios from 'axios'
// 导出基准地址，原因：有些用到基准地址的地方，不需要通过axios发送请求
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  // axios 的一些配置，beseURL timeout
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(config => {
  // 拦截业务逻辑
  // 进行请求配置的修改
  // 如果本地有token，就在头部携带
  // 1. 获取用户信息对象
  const { profile } = store.state.user
  // 2. 判断是否有token
  if (profile.token) {
    // 3. 设置token
    config.headers.Authorization = `Bearer ${profile.token}`
  }
  return config
}, err => {
  return Promise.reject(err)
})

// res => res.data 取出data数据，将来调用接口的时候，直接拿到的就是后台的数据
instance.interceptors.response.use(res => res.data, err => {
  // 401状态码，进入该函数
  if (err.response && err.response.status === 401) {
    // 1.清空无效用户信息
    // 调用user/setUser里的方法，给state传递一个空对象
    store.commit('user/setUser', {})
    // 2.跳转到登录页
    // 3.跳转并传参（当前路由地址）给登陆页码,登录完后跳转回来
    // 在js模块中，不能使用$route(路由信息对象)，可以使用router.currentRoute，表示当前路由地址信息对象
    // router.currentRoute是 ref响应式数据，因此，要拿它的值需要加上.value
    // fullPath 和 path都表示路径，但fullPath能携带参数，path不能携带参数。如地址：'/user?a=10'，$route.path = '/user'，$route.fullPath = '/user?a=10'
    // fullPath中可能含有特殊字符，为防止解析地址出问题，可用encodeURICompontent转换URL编码
    const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
    router.push('/login?redirectUrl=' + fullPath)
  }
  // 静态函数Promise.reject返回一个被拒绝的Promise对象，（）里的参数表示被拒绝的原因
  return Promise.reject(err)
})

// 请求工具函数
// export const request = () => {}
export default (url, method, submitData) => {
  // 发起请求：请求地址、请求参数、提交的数据
  return instance({
    url,
    method,
    // 1. 如果是get请求，需要使用params来传递submitData  ？a=10&b=10
    // 2. 如果不是get请求，需要使用data来传递submitData  请求体传参
    // 可以用if语句来判断是不是get请求，也可以利用 [] 来设置一个动态key，如 num = {a:10, b:20}，num['a'] = 10, let key = 'a', num[key] = 10
    // [] 写js表达式，js表达式执行的结果当做key
    // method参数中，可能是get、Get、GET，统一转换成小写，再进行判断
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
