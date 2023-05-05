import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

var app = createApp(App)
app.use(store)
app.use(router)
app.use(ElementPlus)
for (const name in ElementPlusIconsVue) {
  app.component(name, ElementPlusIconsVue[name])
}
router.beforeEach((to, from, next) => {
  store.commit('getToken')
  let token = store.state.admin.token
  if (!token && to.name !== 'login') {
    next({ name: 'login' })
  } else {
    next()
  }
})
app.mount('#app')
