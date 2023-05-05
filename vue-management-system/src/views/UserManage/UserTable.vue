<template>
  <div class="table">
    <el-dialog v-model="dialogFormVisible" title="验证身份">
      <el-form :model="captchaForm">
        <el-form-item label="" :label-width="formLabelWidth">
          <img :src="captchaForm.codeImg" style="width: 100px; height: 50px" />
          <el-input v-model="captchaForm.codeNumber" autocomplete="off" style="width: 240px; margin-left: 40px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" :plain="true" @click="flagCode()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="Loading...">
      <el-table-column label="序号" width="90">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span style="margin-left: 10px">{{ (config.page - 1) * 6 + scope.$index + 1 }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip stripe v-for="item in tableLabel" :key="item.prop" :label="item.label" width="168px">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span v-if="item.prop !== 'userImg'">{{ scope.row[item.prop] }}</span>
            <span v-if="item.prop === 'userImg'"><el-image style="width: 55px; height: 55px" :src="scope.row.userImg" fit="cover" /></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template #default="scope">
          <el-button size="default" type="danger" @click="deleteUser(scope.row)" :disabled="scope.row.deleted === 0">禁用</el-button>
          <el-button size="default" type="success" @click="updateUser(scope.row)" :disabled="scope.row.deleted === 1">启用</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageCss" background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, watch, h } from 'vue'
import { onMounted, reactive } from '@vue/runtime-core'
import { listUserInfoApi, delUserStatusApi, upUserStatusApi, flagCodeApi } from '../../request/api'
import { ElMessage } from 'element-plus'
export default {
  setup() {
    const store = useStore()
    const dialogTableVisible = ref(false)
    const dialogFormVisible = ref(false)
    const formLabelWidth = '100px'
    //总共多少页
    let total = ref(1)
    //每一页的大小
    let pageSize = ref(1)
    //当前页码
    let page = ref(1)
    //表格数据
    const tableData = reactive([])
    const loading = ref(true)
    //表格标签
    const tableLabel = [
      {
        prop: 'nickName',
        label: '名称',
      },
      {
        prop: 'userImg',
        label: '用户头像',
      },
      {
        prop: 'salt',
        label: '个性签名',
      },
      {
        prop: 'email',
        label: '联系方式',
      },
      {
        prop: 'creater',
        label: '创建人',
      },
      {
        prop: 'createTime',
        label: '创建时间',
      },
    ]
    //图形验证码
    let captchaForm = reactive({
      codeImg: '',
      codeNumber: '',
    })
    //表格配置
    const config = reactive({
      page: 1,
      total: 0,
      loading: false,
    })
    //获取数据
    const getUserInfo = async () => {
      const token = store.state.admin.token
      const res = await listUserInfoApi(page.value, token)
      //判断是否请求成功
      if (res.status === 200 && res.data.code === 0) {
        //处理数据
        const data = res.data.data
        //设置页数
        if (res.data.total_size % 6 === 0) {
          total.value = res.data.total_size / 6
        } else {
          total.value = res.data.total_size / 6 + 1
        }
        pageSize.value = res.data.total_page
        data.forEach((item) => {
          tableData.push(item)
        })
        loading.value = false
      } else {
        console.log('请求失败!!!!')
      }
    }
    //此事件可以拿到一个参数，就是当前点击的页数，如果点击第二页，currentindex就是2
    const handleCurrentChange = (currentindex) => {
      page.value = currentindex
      config.page = page.value
    }
    //监听page数值变化
    watch(page, (newValue, oldValue) => {
      if (newValue != oldValue) {
        tableData.length = 0 //清空数组
        getUserInfo() //调用接口
      }
    }) //后面的参数可有可无
    //获取用户的id
    let userId = ref(0)
    let optionUser = ref('')
    let codeMsg = ref('')
    //验证图形验证码是否正确
    const flagCode = async () => {
      if (optionUser.value === '封禁') {
        const res = await flagCodeApi(captchaForm.codeNumber)
        if (res.status === 200 && res.data.code === 0) {
          //调用接口
          delUserStatus(userId.value)
          //关闭编辑窗口
          dialogFormVisible.value = false
          ElMessage({
            message: '已经封禁该用户账号',
            type: 'success',
          })
          //延迟刷新
          setTimeout(() => {
            //刷新页面
            location.reload()
          }, 1000)
        } else {
          ElMessage({
            message: '验证码填写错误',
            type: 'error',
          })
        }
      } else {
        const res = await flagCodeApi(captchaForm.codeNumber)
        if (res.status === 200 && res.data.code === 0) {
          //调用接口
          upUserStatus(userId.value)
          //关闭编辑窗口
          dialogFormVisible.value = false
          ElMessage({
            message: '已经解封该用户账号',
            type: 'success',
          })
          //延迟刷新
          setTimeout(() => {
            //刷新页面
            location.reload()
          }, 1000)
        } else {
          ElMessage({
            message: '验证码填写错误',
            type: 'error',
          })
        }
      }
    }

    //请求封禁用户接口
    const delUserStatus = async (userId) => {
      //获取token信息
      const token = store.state.admin.token
      const res = await delUserStatusApi(userId, token)
      if (res.status === 200 && res.data.code === 0) {
        console.log('成功')
      } else {
        console.log('失败')
      }
    }
    const deleteUser = (row) => {
      //打开编辑窗口
      dialogFormVisible.value = true
      //获取该行的id
      userId.value = row.id
      //图形验证码
      captchaForm.codeImg = 'http://localhost:8081/api/v1/captcha/get_captcha'
      //谁调用了
      optionUser.value = '封禁'
    }

    //请求解封用户接口
    const upUserStatus = async (userId) => {
      //获取token信息
      const token = store.state.admin.token
      const res = await upUserStatusApi(userId, token)
      if (res.status === 200 && res.data.code === 0) {
        console.log('成功')
      } else {
        console.log('失败')
      }
    }
    const updateUser = (row) => {
      //打开编辑窗口
      dialogFormVisible.value = true
      //获取该行的id
      userId.value = row.id
      //图形验证码
      captchaForm.codeImg = 'http://localhost:8081/api/v1/captcha/get_captcha'
      //谁调用了
      optionUser.value = '解封'
    }

    //挂载到vue实例上面
    onMounted(() => {
      getUserInfo()
    })
    return {
      captchaForm,
      dialogTableVisible,
      dialogFormVisible,
      formLabelWidth,
      config,
      tableLabel,
      page,
      total,
      pageSize,
      loading,
      tableData,
      handleCurrentChange,
      deleteUser,
      updateUser,
      flagCode,
    }
  },
}
</script>

<style lang="scss" scoped>
.table {
  margin-top: 20px;
}
.pageCss {
  margin-top: 20px;
}
</style>
