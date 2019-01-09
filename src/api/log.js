import axios from '@/libs/api.request'

export const getLogTable = data => {
  return axios.request({
    url: 'log/page.do',
    data,
    method: 'post'
  })
}
