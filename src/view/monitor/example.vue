<template>
  <div ref="dom"></div>
</template>

<script>
import echarts from 'echarts'
import {getDateStr, off, on} from '@/libs/tools'
import {getInterfaceNumberStatData} from '@/api/monitor'

export default {
  name: 'serviceRequests',
  data () {
    return {
      dom: null
    }
  },
  mounted () {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      grid: {
        top: '3%',
        left: '1.2%',
        right: '1%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: []
        }
      ],
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: '总调用次数:',
          type: 'line',
          stack: '总量',
          data: []
        }
      ]
    }
    const date = new Date()
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
    this.startDate = date
    this.endDate = new Date()

    this.$nextTick(() => {
      this.dom = echarts.init(this.$refs.dom)
      this.dom.setOption(option)

      let value = 0
      let _this = this
      getInterfaceNumberStatData(0, 0, this.startDate, this.endDate).then(res => {
        let seriesData = []
        let xAxisData = []
        let datas = res.data.record
        for (var i = 0; i < datas.length; i++) {
          value = datas[i].value
          seriesData.push(value)
          xAxisData.push(getDateStr(datas[i].name, 'hh:mm'))
        }

        let opt = _this.dom.getOption()
        opt.series[0].data = seriesData
        opt.xAxis[0].data = xAxisData
        _this.dom.setOption(opt)
        on(window, 'resize', _this.resize())
      })
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize())
  },
  methods: {
    resize () {
      this.dom.resize()
    },
    setOption (option) {
      this.dom.setOption(option)
      on(window, 'resize', this.resize())
    }
  }
}
</script>
