<template>
  <div class="manage">
    <el-dialog v-model="dialogFormVisible" title="新增项目服务信息" draggable>
      <el-form :model="addForm">
        <el-form-item label="项目服务名称" :label-width="formLabelWidth">
          <el-input v-model="addForm.serviceName" autocomplete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="项目服务描述" :label-width="formLabelWidth">
          <el-input
            :rows="2"
            type="textarea"
            v-model="addForm.serviceDescribe"
            placeholder="项目描述仅限100字...."
            show-word-limit
            maxlength="100"
            autocomplete="off"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="是否现在上架" :label-width="formLabelWidth">
          <el-select v-model="addForm.deleted" class="m-2" placeholder="Select">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <el-upload action="https://jsonplaceholder.typicode.com/posts/" :http-request="onUpload" class="upload">
        <el-button type="success">上传服务照片</el-button>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" :plain="true" @click="addSubmit()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="editFormVisible" title="修改项目服务信息" draggable>
      <el-form :model="editForm">
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="editForm.serviceName" autocomplete="off" :placeholder="oldValueForm.serviceName" style="width: 300px" />
        </el-form-item>
        <el-form-item label="项目服务描述" :label-width="formLabelWidth">
          <el-input
            :rows="2"
            type="textarea"
            v-model="editForm.serviceDescribe"
            :placeholder="oldValueForm.serviceDescribe"
            show-word-limit
            maxlength="100"
            autocomplete="off"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editFormVisible = false">取消</el-button>
          <el-button type="primary" @click="editSubmit()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="manage-header">
      <el-button type="primary" style="margin-left: 10px" @click="dialogFormVisible = true">新增</el-button>
      <div class="box">
        <el-input placeholder="输入服务名称" />
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="manage-content">
      <el-table :data="tableData" style="width: 100%" v-loading="loading" element-loading-text="Loading...">
        <el-table-column label="序号" width="90">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span style="margin-left: 10px">{{ (config.page - 1) * 6 + scope.$index + 1 }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip stripe v-for="item in tableLabel" :key="item.prop" :label="item.label" width="160px">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span v-if="item.prop !== 'serviceImg'">{{ scope.row[item.prop] }}</span>
              <span v-if="item.prop === 'serviceImg'"><el-image style="width: 55px; height: 55px" :src="scope.row.serviceImg" fit="cover" /></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template #default="scope">
            <el-button size="default" type="warning" @click="editService(scope.row)" :disabled="!scope.row.deleted === 1">修改</el-button>
            <el-button size="default" type="success" @click="updateService(scope.row)" v-if="scope.row.deleted === 0">上架</el-button>
            <el-button size="default" type="danger" @click="delService(scope.row)" v-if="scope.row.deleted === 1">下架</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pageCss" background @current-change="handleCurrentChange" layout="prev, pager, next" :page-size="pageSize" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { ref, watch } from 'vue'
import { onMounted, reactive } from '@vue/runtime-core'
import { listServiceApi, upLoadImgApi, addServiceApi, upServiceApi, delServiceApi, editServiceApi } from '../../request/api'
import { ElNotification, ElMessage, ElMessageBox } from 'element-plus'
export default {
  setup() {
    const store = useStore()
    //总共多少页
    let total = ref(1)
    let loading = ref(true)
    //每一页的大小
    let pageSize = ref(1)
    //当前页码
    let page = ref(1)
    //打开添加的编辑框
    const dialogTableVisible = ref(false)
    const dialogFormVisible = ref(false)
    const formLabelWidth = '140px'
    //表格数据
    const tableData = reactive([])
    //表格标签
    const tableLabel = [
      {
        prop: 'serviceName',
        label: '项目名称',
      },
      {
        prop: 'serviceImg',
        label: '项目照片',
      },
      {
        prop: 'serviceDescribe',
        label: '项目描述',
      },
      {
        prop: 'serviceNum',
        label: '预约人数',
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
    //选型数据
    const options = [
      {
        value: '1',
        label: '不上架项目',
      },
      {
        value: '0',
        label: '上架项目',
      },
    ]
    //表格配置
    const config = reactive({
      page: 1,
      total: 0,
      loading: false,
    })
    //添加服务项目表格
    const addForm = reactive({
      serviceName: '',
      serviceDescribe: '',
      serviceImg: '',
      deleted: 1,
    })
    //修改服务项目的表格
    const editTableVisible = ref(false)
    const editFormVisible = ref(false)
    const editForm = reactive({
      id: null,
      serviceName: '',
      serviceDescribe: '',
    })
    //编辑提示的信息
    const oldValueForm = reactive({
      serviceName: '',
      serviceDescribe: '',
    })
    //调用编辑接口
    const editServiceInfo = async () => {
      const token = store.state.admin.token
      if (editForm.serviceName === '' && editForm.serviceDescribe === '') {
        ElMessage({
          title: '温馨提示',
          message: '重要信息没填写',
          type: 'error',
        })
      } else {
        const res = await editServiceApi(editForm, token)
        if (res.status === 200 && res.data.code === 0) {
          //关闭窗口
          editFormVisible.value = false
          ElMessage({
            title: '温馨提示',
            message: '修改成功',
            type: 'success',
          })
          //延迟刷新
          setTimeout(() => {
            //刷新页面
            location.reload()
          }, 1000)
        } else {
          ElMessage({
            title: '错误提示',
            message: '提交信息有误,认真核对信息',
            type: 'error',
          })
        }
      }
    }
    //调用编辑的窗口
    const editService = (row) => {
      //打开编辑窗口
      editFormVisible.value = true
      //进行数据处理
      oldValueForm.serviceName = row.serviceName
      oldValueForm.serviceDescribe = row.serviceDescribe
      editForm.id = row.id
    }
    //提交编辑器信息，请求接口
    const editSubmit = () => {
      //调用接口
      editServiceInfo()
    }
    //获取数据
    const getServiceInfo = async () => {
      const token = store.state.admin.token
      const res = await listServiceApi(page.value, token)
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
        getServiceInfo() //调用接口
      }
    }) //后面的参数可有可无
    //添加项目服务
    const addSubmit = () => {
      //请求接口
      addServiceInfo(addForm)
    }
    //添加宠物信息
    const addServiceInfo = async (val) => {
      const token = store.state.admin.token
      if (val.serviceName === '' || val.serviceDescribe === '' || val.serviceImg === '') {
        ElMessage({
          message: '重要信息没有填写',
          type: 'error',
        })
      } else {
        const res = await addServiceApi(val, token)
        //判断是否请求成功
        if (res.status === 200 && res.data.code === 0) {
          //关闭窗口
          dialogFormVisible.value = false
          ElMessage({
            message: '添加项目服务成功',
            type: 'success',
          })
          //延迟刷新
          setTimeout(() => {
            //刷新页面
            location.reload()
          }, 1000)
        } else {
          ElMessage({
            message: '提交信息有误,认真核对信息',
            type: 'error',
          })
        }
      }
    }
    //请求上传服务图片接口
    const upLoadPetImg = async (formData) => {
      if (formData !== null) {
        //获取token信息
        const token = store.state.admin.token
        const res = await upLoadImgApi(formData, token)
        if (res.status === 200 && res.data.code === 0) {
          addForm.serviceImg = res.data.data
        } else {
          console.log('请求失败')
        }
      }
    }
    // 上传文件
    const onUpload = (file) => {
      let formData = new FormData()
      formData.append('file', file.file)
      //请求接口
      upLoadPetImg(formData)
    }
    //上架服务
    //调用上架接口
    const upServiceInfo = async (serviceId) => {
      const token = store.state.admin.token
      const res = await upServiceApi(serviceId, token)
      //判断是否请求成功
      if (res.status === 200 && res.data.code === 0) {
        ElMessage({
          type: 'success',
          message: '上架服务成功',
        })
        //延迟刷新
        setTimeout(() => {
          //刷新页面
          location.reload()
        }, 1000)
      } else {
        ElMessage({
          type: 'error',
          message: '请求失败, 请稍后重试',
        })
      }
    }
    const updateService = (row) => {
      //获取服务的id
      const serviceId = row.id
      //确认是否要上架该服务项目
      ElMessageBox.confirm('确定上架该服务?', '谨慎处理', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'success',
      })
        .then(() => {
          //下架该服务
          upServiceInfo(serviceId)
        })
        .catch(() => {
          ElMessage({
            type: 'warning',
            message: '已经取消上架',
          })
        })
    }
    //下架服务
    //调用下架接口
    const delServiceInfo = async (serviceId) => {
      const token = store.state.admin.token
      const res = await delServiceApi(serviceId, token)
      //判断是否请求成功
      if (res.status === 200 && res.data.code === 0) {
        ElMessage({
          type: 'success',
          message: '下架服务成功',
        })
        //延迟刷新
        setTimeout(() => {
          //刷新页面
          location.reload()
        }, 1000)
      } else {
        ElMessage({
          type: 'error',
          message: '请求失败, 请稍后重试',
        })
      }
    }
    const delService = (row) => {
      //获取服务的id
      const serviceId = row.id
      //确认是否要下架该服务项目
      ElMessageBox.confirm('确定下架该服务?', '谨慎处理', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          //下架该服务项目
          delServiceInfo(serviceId)
        })
        .catch(() => {
          ElMessage({
            type: 'warning',
            message: '已经取消下架',
          })
        })
    }
    //修改服务信息
    //下架服务
    //挂载到vue实例上面
    onMounted(() => {
      getServiceInfo()
    })
    return {
      editTableVisible,
      editFormVisible,
      editForm,
      oldValueForm,
      dialogTableVisible,
      dialogFormVisible,
      formLabelWidth,
      total,
      pageSize,
      page,
      tableData,
      tableLabel,
      config,
      loading,
      addForm,
      options,
      handleCurrentChange,
      addSubmit,
      onUpload,
      updateService,
      delService,
      editSubmit,
      editService,
    }
  },
}
</script>

<style lang="scss" scoped>
.manage-header {
  display: flex;
  .box {
    display: flex;
    margin-left: 960px;
  }
}
.manage-content {
  margin-left: 10px;
  margin-top: 20px;
}
.pageCss {
  margin-top: 20px;
}
.upload {
  margin-left: 40px;
}
</style>
