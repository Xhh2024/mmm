<template>
  <header>
    <div class="l-content">
      <el-button type="primary" class="icon-btn" @click="collapseMenu">
        <el-icon style="" :size="28">
          <Menu />
        </el-icon>
      </el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="current.path" v-if="current">
          {{ current.label }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link"> <img :src="userImg" class="userImg" /> </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="layout"> 退出 </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  setup() {
    const router = useRouter()
    const store = useStore()
    //用户头像
    const userImg = require('../assets/touxiang.png')
    const current = computed(() => store.state.tab.currentMenu)
    const collapseMenu = () => {
      store.commit('collapseMenu')
    }
    //退出登录
    const layout = () => {
      store.commit('clearToken')
      router.push('/login')
      location.load()
    }
    return {
      current,
      userImg,
      collapseMenu,
      layout,
    }
  },
}
</script>

<style lang="scss" scoped>
header {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}
.l-content .icon-btn {
  width: 40px;
  height: 40px;
  margin-right: 20px;
}
.l-content {
  display: flex;
  align-items: center;
}
.r-content .userImg {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.el-dropdown-link {
  cursor: pointer;
}
</style>

<style lang="scss">
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  color: #fff;
}
</style>
