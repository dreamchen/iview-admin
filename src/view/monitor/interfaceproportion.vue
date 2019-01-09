<template>
  <div>
    <Row :getter="16" type="flex" justify="start" align="middle" style="padding-bottom: 18px;">
      <Col :xs="24" :sm="12" :md="8" :lg="6">商家：
        <Select v-model="merchantId" style="width:160px" filterable>
          <Option v-for="item in opMerchantList" :value="item.value" :key="item.value">{{ item.label }}</Option>
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
          <chart-pie style="height: 600px;" :value="pieData" text="ERP接入平台 - API接口调用占比"></chart-pie>
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
import {getInterfaceproportionData, selectAllMerchantChkCfgTList} from '@/api/monitor'
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
      opMerchantList: [],
      merchantId: '',
      startDate: '',
      endDate: ''
    }
  },
  mounted () {
    // 初始商家
    selectAllMerchantChkCfgTList().then(res => {
      this.opMerchantList = res.data
      this.merchantId = this.opMerchantList[0].value
    })

    let merchantId = this.merchantId
    if (merchantId === '') {
      merchantId = 0
    }

    const date = new Date()
    date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
    this.startDate = date
    this.endDate = new Date()

    // 初始化查询
    getInterfaceproportionData(merchantId, this.startDate, this.endDate).then(res => {
      this.pieData = res.data.record
    })
  },
  methods: {
    // 调用查询
    search () {
      let merchantId = this.merchantId
      if (merchantId === '') {
        merchantId = 0
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
      getInterfaceproportionData(merchantId, startDate, endDate).then(res => {
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
