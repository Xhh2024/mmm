import Cookie from 'vue-cookies'
export default {
  state: {
    token: '',
  },
  mutations: {
    //设置token
    setToken(state, val) {
      state.token = val
      //防止浏览器刷新， token丢失
      Cookie.set('token', val)
    },
    //清除token
    clearToken(state) {
      state.token = ''
      Cookie.remove('token')
    },
    //获取token令牌
    getToken(state) {
      state.token = Cookie.get('token')
    },
  },
  actions: {},
}
