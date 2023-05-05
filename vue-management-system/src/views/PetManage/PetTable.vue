<template>
  <div class="table">
    <el-dialog v-model="dialogFormVisible" title="修改宠物信息" draggable>
      <el-form :model="editForm">
        <el-form-item label="宠物名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.petName" autocomplete="off" :placeholder="oldValueForm.petName" />
        </el-form-item>
        <el-form-item label="主人名字" :label-width="formLabelWidth">
          <el-input v-model="editForm.userName" autocomplete="off" :placeholder="oldValueForm.userName" />
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="editForm.userEmail" autocomplete="off" :placeholder="oldValueForm.userEmail" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm()"> 确定 </el-button>
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
      <el-table-column show-overflow-tooltip stripe v-for="item in tableLabel" :key="item.prop" :label="item.label" width="205px">
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <span v-if="item.prop !== 'petImg'">{{ scope.row[item.prop] }}</span>
            <span v-if="item.prop === 'petImg'"><el-image style="width: 55px; height: 55px" :src="scope.row.petImg" fit="cover" /></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template #default="scope">
          <el-button size="default" @click="handleEdit(scope.row)"><Edit style="width: 1em; height: 1em" /></el-button>
          <el-button size="default" type="danger" @click="handleDelete(scope.row)"><Delete style="width: 1em; height: 1em" /></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageCss" background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="total">
    </el-pagination>
  </div>
</template>

<script>
import { ref, watch, h } from 'vue'
import { listPetInfoApi, delPetInfoApi, editPetInfoApi } from '../../request/api'
import { onMounted, reactive } from '@vue/runtime-core'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useStore } from 'vuex'
export default {
  setup() {
    const store = useStore()
    //总共多少页
    let total = ref(1)
    //每一页的大小
    let pageSize = ref(1)
    //当前页码
    let page = ref(1)
    //表格数据
    const tableData = reactive([])
    const loading = ref(true)
    //编辑提交的数据
    const editForm = reactive({
      id: 0,
      petName: '',
      petImg: '',
      userName: '',
      userEmail: '',
    })
    //编辑提示的信息
    const oldValueForm = reactive({
      petName: '',
      petImg: '',
      userName: '',
      userEmail: '',
    })
    //编辑框的配置
    const dialogTableVisible = ref(false)
    const dialogFormVisible = ref(false)
    const formLabelWidth = '140px'
    //表格标签
    const tableLabel = [
      {
        prop: 'petName',
        label: '宠物名称',
      },
      {
        prop: 'petImg',
        label: '宠物照片',
      },
      {
        prop: 'userName',
        label: '主人姓名',
      },
      {
        prop: 'userEmail',
        label: '联系方式',
      },
      {
        prop: 'createTime',
        label: '创建时间',
      },
    ]
    //表格配置
    const config = reactive({
      page: 1,
      total: 0,
      loading: false,
    })
    //获取数据
    const getPetInfo = async () => {
      const token = store.state.admin.token
      const res = await listPetInfoApi(page.value, token)
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
    //调用删除接口
    const delPetInfo = async (petId) => {
      const token = store.state.admin.token
      const res = await delPetInfoApi(petId, token)
      //判断是否请求成功
      if (res.status === 200 && res.data.code === 0) {
        console.log('请求成功!!!')
      } else {
        console.log('请求失败!!!')
      }
    }
    const handleDelete = (row) => {
      //获取宠物的id
      const petId = row.id
      //确认是否要删除该宠物信息
      ElMessageBox.confirm('确定是否删除该宠物信息?', '谨慎处理', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          //删除宠物信息
          delPetInfo(petId)
          //刷新页面
          location.reload()
          ElMessage({
            type: 'success',
            message: '删除成功',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消成功',
          })
        })
    }
    //调用编辑接口
    const editPetInfo = async () => {
      const token = store.state.admin.token
      const res = await editPetInfoApi(editForm, token)
      if (res.status === 200 && res.data.code === 0) {
        //刷新页面
        location.reload()
      } else {
        ElMessage({
          title: '错误提示',
          message: '提交信息有误,认真核对信息',
          type: 'error',
        })
      }
    }
    //调用编辑的窗口
    const handleEdit = (row) => {
      //打开编辑窗口
      dialogFormVisible.value = true
      //进行数据处理
      oldValueForm.petName = row.petName
      oldValueForm.userName = row.userName
      oldValueForm.userEmail = row.userEmail
      editForm.id = row.id
    }
    //提交编辑器信息，请求接口
    const submitForm = () => {
      //关闭窗口
      dialogFormVisible.value = false
      //调用接口
      editPetInfo()
    }
    //监听page数值变化
    watch(page, (newValue, oldValue) => {
      if (newValue != oldValue) {
        tableData.length = 0 //清空数组
        getPetInfo() //调用接口
      }
    }) //后面的参数可有可无
    //挂载到vue实例上面
    onMounted(() => {
      getPetInfo()
    })
    return {
      dialogTableVisible,
      dialogFormVisible,
      formLabelWidth,
      total,
      pageSize,
      loading,
      tableData,
      config,
      tableLabel,
      editForm,
      oldValueForm,
      getPetInfo,
      handleCurrentChange,
      handleDelete,
      delPetInfo,
      open,
      handleEdit,
      submitForm,
      editPetInfo,
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
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 300px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
img {
  width: 50px;
  height: 55px;
  // border-radius: 50%;
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
</style>
