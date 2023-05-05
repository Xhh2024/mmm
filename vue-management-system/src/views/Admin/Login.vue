<template>
  <div class="box">
    <el-form :label-position="labelPosition" label-width="100px" :model="loginForm" class="form">
      <h3 style="margin-top: 5px">宠物医院管理系统</h3>
      <el-form-item label="邮&nbsp&nbsp&nbsp箱" style="width: 350px">
        <el-input v-model="loginForm.email" />
      </el-form-item>
      <el-form-item label="验证码">
        <el-input v-model="loginForm.emailCode" style="width: 150px" />
        <el-button type="primary" @click="sendCode()" :disabled="flagBtn" v-if="isShow" style="width: 80px; margin-left: 20px">发送验证码</el-button>
        <el-button type="primary" disabled style="width: 80px; margin-left: 20px" v-if="!isShow"> {{ count }} </el-button>
      </el-form-item>
      <el-form-item label="密&nbsp&nbsp&nbsp码" style="width: 350px">
        <el-input v-model="loginForm.pwd" type="password" />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="adminLogin()">登录</el-button>
        <p v-show="errorMsg != ''" style="color: red; margin-left: 20px; margin-top: -3px">{{ errorMsg }}</p>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { loginApi, sendEmailCodeApi } from '../../request/api'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'

export default {
  setup() {
    const store = useStore()
    const router = useRouter()
    const isShow = ref(true) //通过 v-show 控制显示'获取按钮'还是'倒计时'
    const count = ref(0) //倒计时 计数器
    //是否激活按钮
    const flagBtn = ref(false)
    //控制方位
    const labelPosition = ref('right')
    //登录错误信息提示
    const errorMsg = ref('')
    //验证表单信息
    const loginForm = reactive({
      email: '',
      pwd: '',
      emailCode: '',
    })
    //请求邮箱验证码接口
    const sendCode = async () => {
      //发送邮箱信息
      const res = await sendEmailCodeApi(loginForm.email)
      if (res.status === 200 && res.data.code === 0) {
        changeBtn()
      } else {
        console.log('失败')
      }
    }
    //登录接口
    const adminLogin = async () => {
      const res = await loginApi(loginForm)
      if (res.status === 200 && res.data.code === 0) {
        //设置token信息
        const token = res.data.data
        store.commit('setToken', token)
        router.push('/')
      } else {
        errorMsg.value = '验证码或者密码错误'
      }
    }
    const onSubmit = () => {}
    //请求更换按钮接口
    const changeBtn = () => {
      isShow.value = false
      count.value = 180 //赋值3秒
      var times = setInterval(() => {
        count.value-- //递减
        if (count.value <= 0) {
          // <=0 变成获取按钮
          isShow.value = true
          flagBtn.value = false
          clearInterval(times)
        }
      }, 1000) //1000毫秒后执行
    }

    return {
      errorMsg,
      count,
      isShow,
      flagBtn,
      labelPosition,
      loginForm,
      sendCode,
      adminLogin,
      onSubmit,
    }
  },
}
</script>

<style lang="scss" scoped>
.box {
  background-color: gray;
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 0;
  margin-top: -10px;
  margin-left: -10px;
  text-align: center;
  background-image: url('~@/assets/backgroud.png');
  color: #000;
}
.form {
  margin-top: 220px;
  margin-left: 550px;
  width: 400px;
  height: calc(30% + 20px);
  border-radius: 3%;
  background: rgba(255, 255, 255, 0.8);
}
</style>
