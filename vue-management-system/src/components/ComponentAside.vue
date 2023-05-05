<template>
  <el-menu :collapse="isCollapse" active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" text-color="#fff">
    <el-menu-item :index="item.path + ''" v-for="item in noChildern" :key="item.path" @click="clickMenu(item)">
      <el-icon><component :is="item.icon" /></el-icon>
      <span>{{ item.label }}</span>
    </el-menu-item>
    <el-sub-menu :index="item.path + ''" v-for="item in hasChildern" :key="item.path" @click="clickMenu(item)">
      <template #title>
        <el-icon><component :is="item.icon" /></el-icon>
        <span>{{ item.label }}</span>
      </template>
      <el-menu-item :index="child.path + ''" v-for="child in item.childern" :key="child.path" @click="clickMenu(child)">{{ child.label }}</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
export default {
  setup() {
    //获取router的引用
    const router = useRouter()
    const store = useStore()
    //菜单栏
    let noChildern = [
      {
        path: '/',
        name: 'home',
        label: '首页',
        icon: 'HomeFilled',
      },
      {
        path: '/user',
        name: 'user',
        label: '用户管理',
        icon: 'UserFilled',
      },
      {
        path: '/pet',
        name: 'pet',
        label: '宠物管理',
        icon: 'Promotion',
      },
    ]
    let hasChildern = [
      {
        path: '1',
        label: '资讯管理',
        name: '',
        icon: 'Document',
        childern: [
          {
            path: '/article',
            name: 'article',
            label: '文章管理',
          },
        ],
      },
      {
        path: '',
        label: '服务管理',
        name: '',
        icon: 'Tools',
        childern: [
          {
            path: '/page1',
            name: 'page1',
            label: '项目管理',
          },
          {
            path: '/page2',
            name: 'page2',
            label: 'ChatGPT',
          },
        ],
      },
    ]
    // 存储到vuex里面的当前菜单
    const clickMenu = (item) => {
      router.push({ name: item.name })
      store.commit('selectMenu', item)
    }
    //获取是否折叠菜单
    const isCollapse = computed(() => store.state.tab.isCollapse)
    return {
      hasChildern,
      noChildern,
      isCollapse,
      clickMenu,
    }
  },
}
</script>

<style lang="scss" scoped>
.el-menu-vertical-demo {
  height: 100vh;
  border: none;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
