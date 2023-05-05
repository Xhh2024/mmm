<template>
  <div class="manage">
    <div class="manage-header">
      <el-tag style="width: 100px; height: 30px" type="danger">所有用户的信息</el-tag>
      <div class="box">
        <el-input placeholder="输入用户姓名" />
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="manage-content">
      <user-table> </user-table>
    </div>
  </div>
</template>

<script>
import UserTable from './UserTable.vue'
export default {
  components: {
    UserTable,
  },
  setup() {},
}
</script>

<style lang="scss" scoped>
.manage-header {
  display: flex;
  .box {
    display: flex;
    margin-left: 920px;
  }
}
.manage-content {
  margin-left: 10px;
}
.el-input {
  width: 200px;
}
</style>
