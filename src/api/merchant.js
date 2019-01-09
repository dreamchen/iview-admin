import axios from '@/libs/api.request'

export const getMerchantTableData = (merchantId, merchantName, pageSize, pageNum) => {
  // noinspection JSAnnotator
  return axios.request({
    url: 'selectmerchantChkCfgTList.do',
    params: {
      merchantId,
      merchantName,
      pageSize,
      pageNum
    },
    method: 'get'
  })
}
