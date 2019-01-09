<template>
  <div>
    <Row :getter="16" type="flex" justify="start" align="middle" style="padding-bottom: 18px;">
      <Col :xs="24" :sm="12" :md="8" :lg="6">接口：
        <Select v-model="interfaceCode" style="width:160px" filterable>
          <Option v-for="item in opList" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </Col>
      <Col :xs="24" :sm="18" :md="12" :lg="8">时间：
        <DatePicker type="date" v-model="startDate" :editable="false" :clearable="false"
                    style="width: 120px"></DatePicker>
        &nbsp;-&nbsp;
        <DatePicker type="date" v-model="endDate" :editable="false" :clearable="false"
                    style="width: 120px"></DatePicker>
      </Col>
      <Col>
        <Button type="primary" @click="search">查询</Button>
      </Col>
    </Row>
    <Row :gutter="20">
      <i-col span="24">
        <Card shadow>
          <chart-pie style="height: 600px;" :value="pieData" text="ERP接入平台 - API接口商家占比"></chart-pie>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import InforCard from '_c/info-card'
import CountTo from '_c/count-to'
import {ChartBar, ChartPie} from '_c/charts'
import Example from './ipp.vue'
import {getShopproportionData} from '@/api/monitor'
import {getDateStr} from '@/libs/tools'

export default {

  name: 'home',
  components: {
    InforCard,
    CountTo,
    ChartPie,
    ChartBar,
    Example
  },
  data () {
    return {
      pieData: [],
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
      ],
      interfaceCode: '',
      startDate: '',
      endDate: ''
    }
  },

  mounted () {
    this.interfaceCode = this.opList[0].value

    let interfaceCode = this.interfaceCode
    if (interfaceCode === '') {
      interfaceCode = 0
    }

    const date = new Date()
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
    this.startDate = date
    this.endDate = new Date()

    getShopproportionData(interfaceCode, this.startDate, this.endDate).then(res => {
      this.pieData = res.data.record
    })
  },
  methods: {
    search () {
      let interfaceCode = this.interfaceCode
      if (interfaceCode === '') {
        interfaceCode = 0
      }
      let startDate
      let endDate

      if (this.startDate === '') {
        const date = new Date()
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
        startDate = date
      } else {
        startDate = getDateStr(this.startDate.getTime(), 'yyyy-mm-dd')
      }

      if (this.endDate === '') {
        endDate = new Date()
      } else {
        endDate = getDateStr(this.endDate.getTime(), 'yyyy-mm-dd')
      }

      getShopproportionData(interfaceCode, startDate, endDate).then(res => {
        if (res.data.success === 1) {
          this.pieData = res.data.record
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

<style lang="less">
  .count-style {
    font-size: 50px;
  }
</style>
