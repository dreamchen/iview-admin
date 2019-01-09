<template>
  <div>
    <Card dis-hover>
      <Row :gutter="16">
        <Col span="24">
          <Form ref="formInline" :model="formInline" :rules="ruleValidate" label-position="right" :label-width="110"
                inline>
            <FormItem label="会话ID">
              <Input v-model="search.cond.uid" style="width:160px" placeholder="请输入会话ID"></Input>
            </FormItem>
            <FormItem label="IP地址">
              <Input v-model="search.cond.ip" style="width:160px" placeholder="请输入IP地址"></Input>
            </FormItem>
            <FormItem label="商家ID">
              <Input v-model="search.cond.supplierId" style="width:160px" placeholder="请输入商家ID"></Input>
            </FormItem>
            <FormItem label="输入参数">
              <Input v-model="search.cond.input" style="width:160px" placeholder="请输入输入参数"></Input>
            </FormItem>
            <FormItem label="输出结果">
              <Input v-model="search.cond.output" style="width:160px" placeholder="请输入输出结果"></Input>
            </FormItem>
            <FormItem label="接口名称">
              <Select v-model="search.cond.functionName" style="width:160px">
                <Option v-for="item in search.functionNameList" :value="item.value" :key="item.value">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="版本">
              <Select v-model="search.cond.version" style="width:160px">
                <Option v-for="item in search.versionList" :value="item.value" :key="item.value">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="接口是否成功">
              <Select v-model="search.cond.success" style="width:160px">
                <Option v-for="item in search.successList" :value="item.value" :key="item.value">{{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="请求开始时间" prop="startTime">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" v-model="search.cond.startTime"
                          placeholder="请选择开始时间" style="width: 160px"
                          :options="search.startTimeOption"
                          @on-change="onStartTimeChange" :clearable="false" :editable="false"></DatePicker>
            </FormItem>
            <FormItem label="请求结束时间" prop="endTime">
              <DatePicker type="datetime" format="yyyy-MM-dd HH:mm:ss" v-model="search.cond.endTime"
                          placeholder="请选择结束时间" style="width: 160px"
                          :options="search.endTimeOption" @on-change="onEndTimeChange" :clearable="false"
                          :editable="false"></DatePicker>
            </FormItem>
            <FormItem label="最短响应时长(ms)" prop="minDuration">
              <Input-number v-model="search.cond.minDuration" :max="99999999" :min="1" placeholder="毫秒数"></Input-number>
            </FormItem>
            <FormItem label="最长响应时长(ms)" prop="maxDuration">
              <Input-number v-model="search.cond.maxDuration" :max="99999999" :min="1" placeholder="毫秒数"></Input-number>
            </FormItem>
            <FormItem :label-width="50">
              <Button type="primary" @click="handlePageOnChange(1)">查询</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Table border :loading="table.loading" ref="selection" :columns="table.columns" :data="table.data">
          </Table>
        </Col>
      </Row>
      <Row class-name="page-padding-top">
        <Col span="24">
          <div style="float: right;">
            <Page :total="this.page.totalCount" :current="this.page.pageIndex" :page-size="this.page.pageSize"
                  show-total @on-change="handlePageOnChange" @on-page-size-change="handlePageSizeChange" show-sizer
                  show-elevator/>
          </div>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import { getLogTable } from '@/api/log'

export default {
  name: 'log',
  data () {
    return {
      formInline: {
        uid: '',
        ip: '',
        supplierId: '',
        input: '',
        output: '',
        functionName: -1,
        version: -1,
        success: -1,
        startTime: '',
        endTime: '',
        minDuration: 1,
        maxDuration: 3000
      },
      search: {
        cond: {
          uid: '',
          ip: '',
          supplierId: '',
          input: '',
          output: '',
          functionName: -1,
          version: -1,
          success: -1,
          startTime: '',
          endTime: '',
          minDuration: 1,
          maxDuration: 3000
        },
        startTimeOption: {},
        endTimeOption: {},
        functionNameList: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 1,
            label: '用户登录'
          },
          {
            value: 2,
            label: '订单查询'
          },
          {
            value: 3,
            label: '订单开始生产'
          },
          {
            value: 4,
            label: '更新运单号'
          },
          {
            value: 5,
            label: '退款商品查询'
          },
          {
            value: 6,
            label: '退货商品查询'
          },
          {
            value: 7,
            label: '换货订单查询'
          },
          {
            value: 8,
            label: '换货受理单查询'
          },
          {
            value: 9,
            label: '贴图信息查询'
          },
          {
            value: 10,
            label: '根据设计ID查询设计详情'
          }
        ],
        versionList: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 1,
            label: 'V2'
          }
        ],
        successList: [
          {
            value: -1,
            label: '全部'
          },
          {
            value: 1,
            label: '成功'
          },
          {
            value: 0,
            label: '失败'
          }
        ]
      },
      ruleValidate: {
        startTime: [
          { required: true, type: 'date', message: '请输入起始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, type: 'date', message: '请输入结束时间', trigger: 'blur' }]
      },
      table: {
        loading: true,
        columns: [
          {
            key: 'uid',
            title: '会话ID'
          },
          {
            key: 'supplierId',
            title: '商家ID',
            width: 80
          },
          {
            key: 'ip',
            title: 'IP地址',
            width: 140
          },
          {
            key: 'functionName',
            title: '接口名称'
          },
          {
            key: 'version',
            title: '版本',
            width: 65
          },
          {
            title: '输入参数',
            key: 'input',
            render: (h, params) => {
              if (params.row.input.length > 50) {
                return h('div', [
                  h('Poptip', {
                    props: {
                      'word-wrap': true,
                      width: '400',
                      content: params.row.input
                    }
                  }, [h('Button', {

                    props: {
                      type: 'primary',
                      size: 'small'
                    }
                  }, 'View')])
                ])
              } else {
                return h('div', params.row.input)
              }
            }
          },
          {
            key: 'output',
            title: '响应订单',
            render: (h, params) => {
              if (params.row.output.length > 20) {
                return h('div', [
                  h('Poptip', {
                    props: {
                      'word-wrap': true,
                      width: '400',
                      content: params.row.output
                    }
                  }, [h('Button', {

                    props: {
                      type: 'primary',
                      size: 'small'
                    }
                  }, 'View')])
                ])
              } else {
                return h('div', params.row.output)
              }
            }
          },
          {
            key: 'startTime',
            title: '请求开始时间',
            width: 150
          },
          {
            key: 'endTime',
            title: '请求结束时间',
            width: 150
          },
          {
            key: 'duration',
            title: 'RT(ms)',
            width: 100
          },
          {
            key: 'success',
            title: '状态',
            width: 65
          }
        ],
        data: []
      },
      page: {
        totalCount: 0,
        pageIndex: 1,
        pageSize: 30
      }
    }
  },
  methods: {
    /**
       * 开始时间发生变化时触发,设置结束时间不可选择的日期
       * 结束时间应大于等于开始时间,且小于等于当前时间
       * @param {string} startTime 格式化后的日期
       * @param {string} type 当前的日期类型
       */
    onStartTimeChange (startTime, type) {
      this.search.endTimeOption = {
        disabledDate (endTime) {
          return endTime < new Date(startTime)
        }
      }
    },
    /**
       * 结束时间发生变化时触发,设置开始时间不可选择的日期
       * 开始时间小于等于结束时间,且小于等于当前时间
       * @param {string} date 格式化后的日期
       * @param {string} type 当前的日期类型
       */
    onEndTimeChange (endTime, type) {
      this.search.startTimeOption = {
        disabledDate (startTime) {
          return startTime > new Date(endTime)
        }
      }
    },
    // 搜索
    handleSearch (name) {
      for (let prop in this.search.cond) {
        this.formInline[prop] = this.search.cond[prop]
      }
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.search.cond.pageIndex = this.page.pageIndex
          this.search.cond.pageSize = this.page.pageSize
          getLogTable(this.search.cond).then(res => {
            if (res.data.success === 1) {
              this.table.data = res.data.record.list
              this.page.totalCount = res.data.record.total
            } else {
              this.$Message.error(res.data.error.code + ':' + res.data.error.message)
            }
            this.table.loading = false
          }).catch(err => {
            debugger
            this.table.loading = false
            this.$Message.error(err.message)
          })
        }
      })
    },
    // 切换页码
    handlePageOnChange (pageIndex) {
      this.page.pageIndex = pageIndex
      this.handleSearch('formInline')
    },
    // 切换每页显示条数
    handlePageSizeChange (pageSize) {
      this.page.pageSize = pageSize
      this.handlePageOnChange(1)
    }

  },
  mounted () { // 初始化方法
    var defaultEndTime = new Date(new Date().setSeconds(0, 0))
    var defaultStartTime = new Date(defaultEndTime.valueOf() - 15 * 60 * 1000)
    this.search.cond.startTime = defaultStartTime
    this.search.cond.endTime = defaultEndTime
    this.formInline.startTime = defaultStartTime
    this.formInline.endTime = defaultEndTime
    this.onStartTimeChange(this.search.cond.startTime)
    this.onEndTimeChange(this.search.cond.endTime)
    let data = {}
    debugger
    for (var attr in this.page) {
      data[attr] = this.page[attr]
    }
    for (let prop in this.search.cond) {
      data[prop] = this.search.cond[prop]
    }
    this.handleSearch('formInline')
  }
}
</script>

<style>
  .page-padding-top {
    padding-top: 20px;
  }
</style>
