<template>
  <div>
    <Row :getter="16" type="flex" justify="start" align="middle" style="padding-bottom: 18px;">
      <Col :xs="24" :sm="12" :md="8" :lg="6">商家ID：
        <Input v-model="id" placeholder="" style="width: 160px"/>
      </Col>
      <Col :xs="24" :sm="12" :md="8" :lg="6">商家名称：
        <Input v-model="name" placeholder="" style="width: 160px"/>
      </Col>
      <Col>
        <Button type="primary" @click="search">查询</Button>
      </Col>
    </Row>
    <Card>
      <Table ref="table" :data="ajaxTableData" :columns="columns"/>
    </Card>
    <Row>
      <Page :total="pageTotal" :current="pageNum" :page-size="pageSize" show-total
            placement="top" @on-change="handlePage"></Page>
    </Row>
  </div>
</template>

<script>
import {getDateStr} from '@/libs/tools'
import {getMerchantTableData} from '@/api/merchant'

export default {
  name: 'tables_page',
  data () {
    return {
      ajaxTableData: [],
      pageTotal: this.pageTotal,
      pageNum: 1,
      pageSize: 10,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {title: '商家Id', key: 'merchantId'},
        {title: '商家名称', key: 'merchantName'},
        {
          title: '创建时间',
          key: 'createTime',
          render: (h, params) => {
            let updateTime = params.row
            return h('div', getDateStr(updateTime.createTime, 'yyyy-mm-dd hh:mm:ss'))
          }
        },
        {title: '创建人', key: 'createBy'},
        {
          title: '更新时间',
          key: 'updateTime',
          render: (h, params) => {
            let updateTime = params.row
            return h('div', getDateStr(updateTime.createTime, 'yyyy-mm-dd hh:mm:ss'))
          }
        },
        {title: '更新人', key: 'updateBy'},
        {
          title: 'ip白名单',
          width: 350,
          tooltip: true,
          key: 'merchantIpCfgTList',
          render: (h, params) => {
            let items = params.row.merchantIpCfgTList
            let labels = []
            for (var i = 0; i < items.length; i++) {
              let label = h('div', {style: {padding: '3px'}}, items[i].ipAddress + ' | ' + items[i].createBy + ' | ' + getDateStr(items[i].createTime, 'yyyy-mm-dd hh:mm:ss'))
              labels.push(label)
            }
            if (labels.length > 0) {
              return h('div', labels)
            }
            return h('div', '')
          }
        }
      ],
      id: '',
      name: ''
    }
  },
  methods: {
    handlePage (index) {
      let pageSize = this.pageSize
      let pageNum = index
      getMerchantTableData(null, null, pageSize, pageNum).then(res => {
        this.ajaxTableData = res.data.list
        this.pageTotal = res.data.total
      })
    },
    search () {
      let pageSize = this.pageSize
      let merchantId = this.id
      if (merchantId === '') {
        merchantId = null
      }
      let merchantName = this.name
      if (merchantName === '') {
        merchantName = null
      }
      getMerchantTableData(merchantId, merchantName, pageSize, 1).then(res => {
        ;
        this.ajaxTableData = res.data.list
        this.pageTotal = res.data.total
      })
    }
  },
  mounted () {
    this.handlePage(1)
  }
}
</script>
