export default {
  state: {
    isCollapse: false,
    menu: [],
    currentMenu: null,
    tabsList: [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: 'HomeFilled',
      },
    ],
  },
  mutations: {
    selectMenu(state, val) {
      if (val.label === '首页') {
        state.currentMenu = null
      } else {
        state.currentMenu = val
        //去重处理
        let result = state.tabsList.findIndex((item) => item.label === val.label)
        result === -1 ? state.tabsList.push(val) : ''
      }
    },
    //关闭标签
    closeTab(state, val) {
      let result = state.tabsList.findIndex((item) => item.label === val.label)
      state.tabsList.splice(result, 1)
    },
    //折叠侧边栏
    collapseMenu(state) {
      state.isCollapse = !state.isCollapse
    },
  },
  actions: {},
}
