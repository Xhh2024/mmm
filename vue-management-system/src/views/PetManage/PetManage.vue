<template>
  <div class="manage">
    <el-dialog v-model="dialogFormVisible" title="新增宠物信息" draggable>
      <el-form :model="form">
        <el-form-item label="宠物名称" :label-width="formLabelWidth">
          <el-input v-model="form.petName" autocomplete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="主人名字" :label-width="formLabelWidth">
          <el-input v-model="form.userName" autocomplete="off" style="width: 300px" />
        </el-form-item>
        <el-form-item label="联系方式" :label-width="formLabelWidth">
          <el-input v-model="form.userEmail" autocomplete="off" style="width: 300px" />
        </el-form-item>
      </el-form>
      <el-upload action="https://jsonplaceholder.typicode.com/posts/" :http-request="onUpload" class="upload">
        <el-button type="success">上传宠物照片</el-button>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submit()"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="manage-header">
      <el-button type="primary" style="margin-left: 10px" @click="dialogFormVisible = true">新增</el-button>
      <div class="box">
        <el-input placeholder="输入宠物姓名" />
        <el-button type="primary">搜索</el-button>
      </div>
    </div>
    <div class="manage-content">
      <pet-table> </pet-table>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import PetTable from './PetTable.vue'
import { addPetInfoApi, upLoadImgApi } from '../../request/api'
import { ElNotification } from 'element-plus'
import { useStore } from 'vuex'
export default {
  components: {
    PetTable,
  },
  setup() {
    const store = useStore()
    const dialogTableVisible = ref(false)
    const dialogFormVisible = ref(false)
    const formLabelWidth = '140px'
    const form = reactive({
      petName: '',
      petImg: '',
      userName: '',
      userEmail: '',
    })
    const submit = () => {
      //请求接口
      addPetInfo(form)
      //关闭窗口
      dialogFormVisible.value = false
    }
    //添加宠物信息
    const addPetInfo = async (val) => {
      const token = store.state.admin.token
      const res = await addPetInfoApi(val, token)
      //判断是否请求成功
      if (res.status === 200 && res.data.code === 0) {
        //刷新页面
        location.reload()
      } else {
        ElNotification({
          title: '错误提示',
          message: '提交信息有误,认真核对信息',
          type: 'error',
        })
      }
    }
    //请求上传宠物图片接口
    const upLoadPetImg = async (formData) => {
      if (formData !== null) {
        //获取token信息
        const token = store.state.admin.token
        const res = await upLoadImgApi(formData, token)
        if (res.status === 200 && res.data.code === 0) {
          form.petImg = res.data.data
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
    return {
      dialogTableVisible,
      dialogFormVisible,
      formLabelWidth,
      form,
      submit,
      addPetInfo,
      onUpload,
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
}
.el-button--text {
  margin-right: 15px;
}
.el-select {
  width: 300px;
}
.el-input {
  width: 200px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
.upload {
  margin-top: 20px;
  margin-left: 70px;
}
</style>
