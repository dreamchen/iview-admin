<template>
  <div>
    <Row :getter="16" type="flex" justify="start" align="middle" style="padding-bottom: 18px;">
      <Col :xs="24" :sm="12" :md="8" :lg="6">
        商家：
        <Select v-model="cond.merchantId" style="width:160px" filterable>
          <Option v-for="item in lazyData.opMerchantList" :value="item.value" :key="item.value">{{ item.label }}
          </Option>
        </Select>
      </Col>
      <Col :xs="24" :sm="12" :md="8" :lg="6">接口：
        <Select v-model="cond.interfaceCode" style="width:160px" filterable>
          <Option v-for="item in lazyData.opList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col :xs="24" :sm="18" :md="12" :lg="8">时间：
        <DatePicker type="date" v-model="cond.startDate" :editable="false" :clearable="false"
                    style="width: 120px"></DatePicker>
        &nbsp;-&nbsp;
        <DatePicker type="date" v-model="cond.endDate" :editable="false" :clearable="false"
                    style="width: 120px"></DatePicker>
      </Col>
      <Col>
        <Button type="primary" @click="search">查询</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <Card shadow>
          <example ref="expCharts" style="height: 500px;"/>
        </Card>
      </Col>
    </Row>
  </div>
</template>

<script>
import Example from './example.vue'
import {getInterfaceNumberStatData, selectAllMerchantChkCfgTList} from '@/api/monitor'
import {getDateStr} from '@/libs/tools'

export default {
  name: 'interfaceNum_page',
  components: {
    Example
  },
  data () {
    return {
      cond: {
        merchantId: '',
        interfaceCode: '',
        startDate: '',
        endDate: ''
      },
      lazyData: {
        opMerchantList: [],
        opList: [
          {
            value: '0',
            label: '全部'
          },
          {
            value: '1',
            label: '用户登录'
          },
          {
            value: '2',
            label: '订单查询'
          },
          {
            value: '3',
            label: '订单开始生产'
          },
          {
            value: '4',
            label: '更新运单号'
          },
          {
            value: '5',
            label: '退款商品查询'
          },
          {
            value: '6',
            label: '退货商品查询'
          },
          {
            value: '7',
            label: '按订单号查询单个订单'
          },
          {
            value: '8',
            label: '换货受理单查询'
          },
          {
            value: '9',
            label: '换货订单查询'
          }
        ]
      }
    }
  },
  mounted () {
    // 初始商家
    selectAllMerchantChkCfgTList().then(res => {
      this.lazyData.opMerchantList = res.data
      this.cond.merchantId = this.lazyData.opMerchantList[0].value
    })

    this.cond.interfaceCode = this.lazyData.opList[0].value

    const date = new Date()
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
    this.cond.startDate = date
    this.cond.endDate = new Date()
  },
  methods: {
    search () {
      let startDate, endDate
      if (this.cond.startDate === '') {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
        startDate = date
      } else {
        startDate = getDateStr(this.cond.startDate.getTime(), 'yyyy-mm-dd')
      }

      if (this.cond.endDate === '') {
        endDate = new Date()
      } else {
        endDate = getDateStr(this.cond.endDate.getTime(), 'yyyy-mm-dd')
      }

      let interfaceCode = this.cond.interfaceCode
      if (interfaceCode === '') {
        interfaceCode = 0
      }

      let merchantId = this.cond.merchantId
      if (merchantId === '') {
        merchantId = 0
      }

      let value = 0
      let _this = this
      getInterfaceNumberStatData(interfaceCode, merchantId, startDate, endDate).then(res => {
        let seriesData = []
        let xAxisData = []
        let datas = res.data.record

        if (res.data.success === 1) {
          for (var i = 0; i < datas.length; i++) {
            value = datas[i].value
            seriesData.push(value)
            xAxisData.push(getDateStr(datas[i].name, 'hh:mm'))
          }

          let opt = _this.$refs['expCharts'].dom.getOption()
          opt.series[0].data = seriesData
          opt.xAxis[0].data = xAxisData
          _this.$refs['expCharts'].setOption(opt)
        } else {
          this.$Message.warning(
            {
              top: 500,
              content: res.data.error.message,
              closable: true
            }
          )
        }
      })
    }
  }
}
</script>
