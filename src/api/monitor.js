import axios from '@/libs/api.request'

export const getInterfaceNumberStatData = (interfaceCode, merchantId, startDate, endDate) => {
  return axios.request({
    url: 'queryInvokedStatistics.do',
    params: {
      interfaceCode,
      merchantId,
      startDate,
      endDate
    },
    method: 'get'
  })
}

export const getInterfaceproportionData = (merchantId, startDate, endDate) => {
  return axios.request({
    url: 'queryInterfaceStatistics.do',
    params: {
      merchantId,
      startDate,
      endDate
    },
    method: 'get'
  })
}

export const getShopproportionData = (interfaceCode, startDate, endDate) => {
  return axios.request({
    url: 'querySupplierStatistics.do',
    params: {
      interfaceCode,
      startDate,
      endDate
    },
    method: 'get'
  })
}

export const selectAllMerchantChkCfgTList = () => {
  return axios.request({
    url: 'selectAllMerchantChkCfgTList.do',
    method: 'get'
  })
}
