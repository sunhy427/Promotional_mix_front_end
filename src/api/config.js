import axios from 'axios'
import QS from 'qs'
// ElLoading
import { ElMessage } from 'element-plus'

// import store from "../store";

// let loadingInstance = {};
// 创建一个axios实例
const service = axios.create({
  // 请求超时时间
  timeout: 120000,
  withCredentials: true,
})

axios.defaults.withCredentials = true

// let loading = null
// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    const csrfToken = localStorage.getItem('frsc')
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken
    }

    if (config.headers['Content-Type'] === 'multipart/form-data') {
      const formData = new FormData()
      Object.entries(config.data).map(([key, value]) => {
        if (key === 'file') {
          formData.append(value.formName || 'file', value, value.name)
        } else {
          formData.append(key, value)
        }
      })
      config.data = formData
    }
    if (
      config.method === 'post' &&
      config._isQs &&
      config.headers['Content-Type'] !== 'multipart/form-data'
    ) {
      config.data = QS.stringify(config.data)
    }
    return config
  },
  (err) => {
    console.log(err)
  },
)

//响应拦截
service.interceptors.response.use(
  (response) => {
    if (response.status === 302 && response.headers.location) {
      if (response.headers && response.headers.location) {
        window.location.href = response.headers.location // 跳转到重定向地址
      }
      return new Promise(() => {}) // 中断当前请求链，避免后续处理
    }

    let res = response.data
    if (res.status === 0) {
      if (res.message) {
        ElMessage.error(res.message)
      } else if (res.msg) {
        ElMessage.error(res.msg)
      }
      return Promise.resolve(res)
    }
    if (res.status === 302) {
      window.location.href = res.redirect_url

      return Promise.resolve(res)
    } else {
      return Promise.resolve(res)
    }
  },
  (err) => {
    console.log(err)
    ElMessage.error(JSON.stringify(err))
  },
)

export default service
