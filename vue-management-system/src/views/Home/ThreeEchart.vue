<template>
  <div style="height: 120%" id="main2"></div>
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
      var myChart = echarts.init(document.getElementById('main2'))
      var option = {
        title: {
          text: '新增用户',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        legend: {},
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: 'category',
          data: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天'],
        },
        series: [
          {
            name: '上周数据',
            type: 'bar',
            data: [21, 22, 23, 24, 25, 26, 29],
          },
          {
            name: '这周数据',
            type: 'bar',
            data: [11, 13, 14, 15, 16, 17, 30],
          },
        ],
      }
      // 绘制图表
      myChart.setOption(option)
      window.onresize = () => {
        //自适应大小
        myChart.resize()
      }
    }
    return {
      echart,
    }
  },
}
</script>

<style lang="scss" scoped></style>
