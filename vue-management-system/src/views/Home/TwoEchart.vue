<template>
  <div style="height: 100%" id="main1"></div>
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
      var myChart = echarts.init(document.getElementById('main1'))
      var option = {
        backgroundColor: 'white',
        title: {
          text: '预约服务',
          left: 'center',
          top: 20,
          textStyle: {
            color: 'black',
          },
        },
        tooltip: {
          trigger: 'item',
        },
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1],
          },
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: '疫苗接种' },
              { value: 310, name: '宠物洗澡' },
              { value: 274, name: '宠物体检' },
              { value: 235, name: '宠物寄养' },
              { value: 400, name: '宠物售卖' },
            ].sort(function (a, b) {
              return a.value - b.value
            }),
            roseType: 'radius',
            label: {
              color: 'rgba(0, 0, 0)',
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(0, 0, 0)',
              },
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
            itemStyle: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200
            },
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

<style lang="scss" scoped>
.box {
  height: 100%;
  width: 300px;
}
</style>
