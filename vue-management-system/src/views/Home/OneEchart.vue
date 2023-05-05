<template>
  <div style="height: 100%" id="main"></div>
</template>

<script>
import * as echarts from 'echarts'
import { onMounted } from 'vue'
export default {
  setup() {
    onMounted(async () => {
      setTimeout(() => {
        echart()
      }, 500)
    })
    //初始化echart的方法
    const echart = () => {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'))
      var option = {
        title: {
          text: '预约近七天的数量',
        },
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['猫', '狗', '羊', '牛', '其他'],
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '猫',
            type: 'line',
            stack: 'Total',
            data: [30, 20, 20, 20, 20, 20, 20],
          },
          {
            name: '狗',
            type: 'line',
            stack: 'Total',
            data: [30, 20, 20, 20, 20, 20, 20],
          },
          {
            name: '羊',
            type: 'line',
            stack: 'Total',
            data: [30, 34, 31, 42, 10, 14, 40],
          },
          {
            name: '牛',
            type: 'line',
            stack: 'Total',
            data: [30, 34, 31, 42, 10, 14, 40],
          },
          {
            name: '其他',
            type: 'line',
            stack: 'Total',
            data: [30, 34, 31, 42, 10, 14, 40],
          },
        ],
      }
      // 绘制图表
      myChart.setOption(option)
    }
    return {
      echart,
    }
  },
}
</script>

<style lang="scss" scoped></style>
