<template>
  <div>
    <Card dis-hover>
      <Row :gutter="16">
        <Col span="24">
          <Form ref="formInline" inline>
            <FormItem prop="user">
              <Input type="text" v-model="search.cond.name" placeholder="Username">
              <Icon type="ios-person-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Select v-model="search.cond.status" clearable style="width:200px">
                  <Option v-for="item in search.statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem>
              <Button type="primary" @click="handleSearch">Search</Button>
            </FormItem>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <Table border ref="selection" :columns="table.columns" :data="table.data"></Table>
        </Col>
      </Row>
      <Row class-name="page-padding-top">
        <Col span="12">
          <Button type="primary" @click="modals.addModal.show = true">Primary</Button>
        </Col>
        <Col span="12">
          <div style="float: right;">
            <Page :total="this.page.totalCount" :current="this.page.pageIndex" :page-size="this.page.pageSize" show-total @on-change="handlePageOnChange" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator/>
          </div>
        </Col>
      </Row>
    </Card>
    <Modal v-model="modals.addModal.show" title="Test Modal dialog box title" @on-ok="ok" @on-cancel="cancel">
      <Form ref="formValidate" :model="modals.addModal.formValidate" :rules="modals.addModal.ruleValidate" :label-width="80">
        <FormItem label="Name" prop="name">
          <Input v-model="modals.addModal.formValidate.name" placeholder="Enter your name"></Input>
        </FormItem>
        <FormItem label="E-mail" prop="mail">
          <Input v-model="modals.addModal.formValidate.mail" placeholder="Enter your e-mail"></Input>
        </FormItem>
        <FormItem label="City" prop="city">
          <Select v-model="modals.addModal.formValidate.city" placeholder="Select your city">
            <Option value="beijing">New York</Option>
            <Option value="shanghai">London</Option>
            <Option value="shenzhen">Sydney</Option>
          </Select>
        </FormItem>
        <FormItem label="Date">
          <Row>
            <Col span="11">
              <FormItem prop="date">
                <DatePicker type="date" placeholder="Select date" v-model="modals.addModal.formValidate.date"></DatePicker>
              </FormItem>
            </Col>
            <Col span="2" style="text-align: center">-</Col>
            <Col span="11">
              <FormItem prop="time">
                <TimePicker type="time" placeholder="Select time" v-model="modals.addModal.formValidate.time"></TimePicker>
              </FormItem>
            </Col>
          </Row>
        </FormItem>
        <FormItem label="Gender" prop="gender">
          <RadioGroup v-model="modals.addModal.formValidate.gender">
            <Radio label="male">Male</Radio>
            <Radio label="female">Female</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="Hobby" prop="interest">
          <CheckboxGroup v-model="modals.addModal.formValidate.interest">
            <Checkbox label="Eat"></Checkbox>
            <Checkbox label="Sleep"></Checkbox>
            <Checkbox label="Run"></Checkbox>
            <Checkbox label="Movie"></Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="Desc" prop="desc">
          <Input v-model="modals.addModal.formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="Enter something..."></Input>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">Reset</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { getTestTable } from '@/api/test'
export default {
  name: 'test_page',
  data () {
    return {
      search: {
        cond: {
          name: '',
          status: ''
        },
        statusList: [
          {
            value: 0,
            label: '禁用'
          },
          {
            value: 1,
            label: '启用'
          }
        ]
      },
      table: {
        columns: [
          {
            key: 'id',
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'Name',
            key: 'name',
            sortable: true
          },
          {
            title: 'Email',
            key: 'email'
          },
          {
            title: 'CreateTime',
            key: 'createTime'
          },
          {
            title: 'Status',
            key: 'status',
            render: (h, params) => {
              return h('div', params.row.status ? '启用' : '禁用')
            }
          },
          {
            title: 'Action',
            key: 'action',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, 'View'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, 'Delete')
              ])
            }
          }
        ],
        data: []
      },
      page: {
        totalCount: 100,
        pageIndex: 1,
        pageSize: 10
      },
      modals: {
        addModal: {
          show: false,
          formValidate: {
            name: '',
            mail: '',
            city: '',
            gender: '',
            interest: [],
            date: '',
            time: '',
            desc: ''
          },
          ruleValidate: {
            name: [
              {required: true, message: 'The name cannot be empty', trigger: 'blur'}
            ],
            mail: [
              {required: true, message: 'Mailbox cannot be empty', trigger: 'blur'},
              {type: 'email', message: 'Incorrect email format', trigger: 'blur'}
            ],
            city: [
              {required: true, message: 'Please select the city', trigger: 'change'}
            ],
            gender: [
              {required: true, message: 'Please select gender', trigger: 'change'}
            ],
            interest: [
              {required: true, type: 'array', min: 1, message: 'Choose at least one hobby', trigger: 'change'},
              {type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change'}
            ],
            date: [
              {required: true, type: 'date', message: 'Please select the date', trigger: 'change'}
            ],
            time: [
              {required: true, type: 'string', message: 'Please select time', trigger: 'change'}
            ],
            desc: [
              {required: true, message: 'Please enter a personal introduction', trigger: 'blur'},
              {type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur'}
            ]
          }
        }
      }
    }
  },
  methods: {
    show (index) {
      this.$Modal.info({
        title: 'User Info',
        content: `Name：${this.table.data[index].name}<br>Email：${this.table.data[index].email}<br>CreateTime：${this.table.data[index].createTime}<br>Status：${this.table.data[index].status ? '启用' : '禁用'}`
      })
    },
    remove (index) {
      this.table.data.splice(index, 1)
    },
    ok () {
      this.$Message.info('Clicked ok')
    },
    cancel () {
      this.$Message.info('Clicked cancel')
    },
    handleSearch () {
      let cond = this.search.cond
      cond.pageIndex = this.page.pageIndex
      cond.pageSize = this.page.pageSize
      getTestTable(cond).then(res => {
        this.table.data = res.data.list
        this.page.totalCount = res.data.totalCount
      })
    },
    handleSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$Message.success('Success!')
        } else {
          this.$Message.error('Fail!')
        }
      })
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handlePageOnChange (pageIndex) {
      this.page.pageIndex = pageIndex
      this.handleSearch()
    },
    handlePageSizeChange (pageSize) {
      this.page.pageSize = pageSize
      this.handlePageOnChange(1)
    }
  },
  mounted () {
    getTestTable(this.page).then(res => {
      console.warn(res)
      this.table.data = res.data.list
      this.page.totalCount = res.data.totalCount
    })
  }
}
</script>

<style>
  .page-padding-top {
    padding-top: 20px;
  }
</style>
