<template>
  <div class="box">
    <el-dialog v-model="dialogFormVisible" title="添加文章" center draggable>
      <el-form :model="activtyForm">
        <el-form-item label="标题" :label-width="formLabelWidth">
          <el-input v-model="activtyForm.title" autocomplete="off" placeholder="取一个有趣的标题....." />
        </el-form-item>
        <el-form-item label="主题内容" :label-width="formLabelWidth">
          <el-input v-model="activtyForm.content" :rows="2" type="textarea" placeholder="限制200字以内....." maxlength="200" />
        </el-form-item>
        <el-form-item label="类型选择" :label-width="formLabelWidth">
          <el-select v-model="activtyForm.cId" class="m-2" placeholder="文章类型选择">
            <el-option v-for="item in listData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="发布日期" :label-width="formLabelWidth">
          <el-date-picker v-model="activtyForm.pubTime" type="datetime" placeholder="选择一个日期" format="YYYY/MM/DD HH:mm:ss" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="addArticle()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-button type="success" size="default" plain @click="openForm()"
      ><el-icon><Plus /></el-icon
    ></el-button>
    <el-drawer v-model="drawer" :direction="direction" :with-header="false">
      <template #default>
        <h4>评论列表</h4>
        <div>
          <p>ddd</p>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button @click="drawer = false">关闭</el-button>
        </div>
      </template>
    </el-drawer>
    <el-tabs type="border-card" style="padding: 0px; margin: 0px">
      <el-tab-pane :label="item.name" v-for="item in listData" :key="item.name">
        <div class="content" style="height: 100%">
          <el-collapse v-model="activeName" v-for="child in item.topicList" :key="child.id">
            <el-collapse-item :title="child.title" :name="child.id">
              <div>{{ child.content }}</div>
              <div class="content-bottom">
                <p>点赞数量: {{ child.likeNum }} 评论数据: {{ child.replyNum }}</p>
                <div>
                  <el-button type="info" size="default" plain style="margin-left: 20px" @click="chatContent(child.id)"
                    ><el-icon><Search /></el-icon
                  ></el-button>
                  <el-button type="danger" size="default" plain style="margin-left: 20px" @click="delArticle(child.id)"
                    ><el-icon><Delete /></el-icon
                  ></el-button>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { listCategoryApi, delTopicApi, addTopicApi } from '../../request/api'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
export default {
  setup() {
    const drawer = ref(false)
    const direction = ref('rtl')
    const dialogFormVisible = ref(false)
    const formLabelWidth = '140px'
    const store = useStore()
    const activeName = ref('1')
    const listData = reactive([])
    const activtyForm = reactive({
      title: null,
      content: null,
      cId: null,
      pubTime: null,
    })
    const count = ref(0)
    const getCategoryInfo = async () => {
      //获取token信息
      const token = store.state.admin.token
      const res = await listCategoryApi(token)
      if (res.status === 200 && res.data.code === 0) {
        //获取数据
        const data = res.data.data
        //处理数据
        data.forEach((item) => {
          listData.push(item)
        })
      } else {
        console.log('请求失败')
      }
    }
    //删除文章内容
    const delTopicInfo = async (topicId) => {
      //获取token信息
      const token = store.state.admin.token
      const res = await delTopicApi(topicId, token)
      if (res.status === 200 && res.data.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除该文章成功',
        })
        setTimeout(() => {
          //刷新页面
          location.reload()
        }, 1000)
      } else {
        ElMessage({
          type: 'error',
          message: '已取消操作',
        })
      }
    }
    const delArticle = (topicId) => {
      ElMessageBox.confirm('确认删除该文章?', '谨慎处理', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          delTopicInfo(topicId)
        })
        .catch(() => {
          ElMessage({
            type: 'warning',
            message: '已取消操作',
          })
        })
    }
    const formatDateTime = function (date) {
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let minute = date.getMinutes()
      minute = minute < 10 ? '0' + minute : minute
      let second = date.getSeconds()
      second = second < 10 ? '0' + second : second
      return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
    }
    //添加文章
    const addArticle = async () => {
      if (activtyForm.cId === 0 || activtyForm.pubTime === null || activtyForm.title === null || activtyForm.content === null) {
        ElMessage({
          type: 'error',
          message: '重要数据未填写',
        })
      } else {
        //处理一下数据
        activtyForm.pubTime = formatDateTime(activtyForm.pubTime)
        //获取token
        const token = store.state.admin.token
        //请求接口
        const res = await addTopicApi(activtyForm, token)
        if (res.status === 200 && res.data.code === 0) {
          dialogFormVisible.value = false
          ElMessage({
            type: 'success',
            message: '添加成功',
          })
          //延迟刷新
          setTimeout(() => {
            //刷新页面
            location.reload()
          }, 1000)
        } else {
          ElMessage({
            type: 'error',
            message: '数据提交失败, 请重试....',
          })
        }
      }
    }
    const openForm = (categoryId) => {
      dialogFormVisible.value = true
    }
    const chatContent = (topicId) => {
      drawer.value = true
    }
    //挂载
    onMounted(() => {
      getCategoryInfo()
    })
    return {
      drawer,
      direction,
      dialogFormVisible,
      formLabelWidth,
      activeName,
      listData,
      activtyForm,
      openForm,
      delArticle,
      addArticle,
      chatContent,
    }
  },
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 20px;
  .content-bottom {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-top: 10px;
    color: red;
  }
}
.box {
  height: 700px;
}
.el-collapse {
  background-color: gray;
}
.infinite-list {
  height: 300px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}
.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}
</style>
