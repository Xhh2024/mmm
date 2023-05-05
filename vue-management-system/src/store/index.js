import { createStore } from 'vuex'
import tab from './tab'
import admin from './admin'

export default createStore({
  modules: {
    tab,
    admin,
  },
})
