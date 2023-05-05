<template>
  <div class="tabs">
    <el-tag
      v-for="tag in dynamicTags"
      :key="tag"
      class="item"
      :closable="tag.label !== '首页'"
      :disable-transitions="false"
      @close="handleClose(tag)"
      @click="changeMenu(tag)"
      :effect="$route.name === tag.name ? 'dark' : 'plain'"
    >
      {{ tag.label }}
    </el-tag>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
export default {
  setup() {
    //获取router的引用
    const router = useRouter()
    const store = useStore()
    const dynamicTags = computed(() => store.state.tab.tabsList)
    //关闭标签
    const handleClose = (tag) => {
      store.commit('closeTab', tag)
    }
    const changeMenu = (tag) => {
      router.push({ name: tag.name })
      store.commit('selectMenu', tag)
    }
    return {
      dynamicTags,
      handleClose,
      changeMenu,
    }
  },
}
</script>

<style lang="scss" scoped>
.tabs {
  padding: 10px;
}
.tabs .item {
  margin-right: 10px;
  cursor: pointer;
}
</style>
