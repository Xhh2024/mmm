<template>
  <el-row :gutter="20" class="home">
    <el-col :span="8">
      <el-card shadow="hover">
        <div class="user">
          <img :src="userImg" />
          <div class="info">
            <p class="name">萧家小子</p>
            <p class="access">超级管理员</p>
          </div>
        </div>
        <div class="user-info">
          <p>
            联系方式: <span><PhoneFilled style="width: 20px; height: 20px; color: green" /> 309658982@qq.com</span>
          </p>
          <p>
            医院地点: <span><Location style="width: 20px; height: 20px; color: blue" /> 湖南省</span>
          </p>
        </div>
      </el-card>
      <el-card shadow="hover" style="height: 440px; margin-top: 10px">
        <div class="svg">
          <svg class="alli-icon" aria-hidden="true">
            <use xlink:href="#icon-jiangbei"></use>
          </svg>
          <p style="font-weight: bold; margin-top: 40px; margin-left: 50px">用户消费排行榜</p>
        </div>
        <el-table :data="tableData" style="width: 100%; height: 80%" id="table" tooltip-effect="dark">
          <el-table-column show-overflow-tooltip prop="id" label="序号" />
          <el-table-column show-overflow-tooltip prop="userName" label="用户名称" />
          <el-table-column show-overflow-tooltip prop="orderNum" label="预约数量" />
          <el-table-column show-overflow-tooltip prop="totalPrice" label="累计消费" />
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16">
      <div class="num">
        <el-card shadow="hover" v-for="item in cardData" :key="item.name" class="small-card">
          <el-icon class="icon" :style="{ background: item.color }"><component :is="item.icon" /></el-icon>
          <div class="detail">
            <p class="number">{{ item.value }}</p>
            <p class="text">{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <el-card shadow="hover">
        <one-echart style="height: 280px"></one-echart>
      </el-card>
      <div class="graph">
        <el-card shadow="hover" class="graph-card"> <two-echart style="height: 300px"></two-echart> </el-card>
        <el-card shadow="hover" class="graph-card"> <three-echart style="height: 300px"></three-echart> </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import OneEchart from './OneEchart.vue'
import TwoEchart from './TwoEchart.vue'
import ThreeEchart from './ThreeEchart.vue'
import { onMounted, reactive } from '@vue/runtime-core'
import { rankUserApi } from '../../request/api'
import { useStore } from 'vuex'
export default {
  components: {
    OneEchart,
    TwoEchart,
    ThreeEchart,
  },
  setup() {
    const store = useStore()
    const userImg = require('../../assets/touxiang.png')
    //卡片信息数据
    const cardData = [
      {
        name: '用户数量',
        value: 1712,
        icon: 'User',
        color: '#2ec7c9',
      },
      {
        name: '宠物数量',
        value: 162,
        icon: 'Bell',
        color: '#5ab1ef',
      },
      {
        name: '服务种类',
        value: 10,
        icon: 'Service',
        color: '#ffb980',
      },
    ]
    //预约信息数据
    const tableData = reactive([])
    const getRankUser = async () => {
      const token = store.state.admin.token
      const res = await rankUserApi(token)
      if (res.status === 200 && res.data.code === 0) {
        //获取数据
        const data = res.data.data
        data.forEach((item) => {
          tableData.push(item)
        })
      }
    }
    onMounted(() => {
      getRankUser()
    })
    return {
      userImg,
      cardData,
      tableData,
    }
  },
}
</script>

<style lang="scss" scoped>
.home .num {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  height: 90px;
  ::v-deep .el-card__body {
    display: flex;
    padding: 0;
    margin: 0;
  }
  .icon {
    font-size: 30px;
    width: 80px;
    height: 90px;
    text-align: center;
    line-height: 90px;
    color: #fff;
  }
  .detail {
    margin-left: 40px;
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      padding: 0;
      margin: 0;
    }
    .number {
      font-size: 30px;
      margin-bottom: 10px;
    }
    .text {
      font-size: 14px;
      text-align: center;
      color: #999999;
    }
  }
}
.home .num .small-card {
  width: 32%;
  margin-bottom: 10px;
  align-content: center;
}
.home .graph {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.home .graph .graph-card {
  width: 49%;
}
.user {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.user img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-right: 60px;
}
.user .info .name {
  font-size: 32px;
  margin-bottom: 40px;
}
.user .info .access {
  color: #9999;
}
.user-info {
  p {
    line-height: 28px;
    font-size: 14px;
    color: #999999;
    span {
      color: #666666;
      margin-left: 140px;
    }
  }
}
.svg {
  width: 100%;
  height: 100px;
  display: flex;
  .alli-icon {
    width: 30%;
    height: 100px;
  }
}
</style>
