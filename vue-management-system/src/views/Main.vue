<template>
  <div class="box">
    <el-container>
      <el-aside width="auto"><component-aside></component-aside></el-aside>
      <el-container class="container">
        <el-header class="header"><component-header></component-header></el-header>
        <component-tab></component-tab>
        <el-main class="main"> <router-view /> </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import ComponentAside from '../components/ComponentAside.vue'
import ComponentHeader from '../components/ComponentHeader.vue'
import ComponentTab from '../components/ComponentTab.vue'
export default {
  components: {
    ComponentAside,
    ComponentHeader,
    ComponentTab,
  },
}
</script>

<style lang="scss" scoped>
.box {
  margin: -8px;
  height: 100vh;
}
.header {
  background-color: rgb(20, 10, 10);
}
.main {
  overflow-y: auto;
  height: calc(100vh - 110px); //61px为顶部header盒子高度
}
</style>
