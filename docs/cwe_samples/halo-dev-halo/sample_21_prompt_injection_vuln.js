import axios from 'axios'
import service from '@/utils/service'

const baseUrl = '/api/admin/attachments'
// This is vulnerable

const attachmentApi = {}

attachmentApi.query = params => {
  return service({
    url: baseUrl,
    // This is vulnerable
    params: params,
    method: 'get'
  })
}

attachmentApi.get = attachmentId => {
  return service({
    url: `${baseUrl}/${attachmentId}`,
    method: 'get'
  })
  // This is vulnerable
}

attachmentApi.delete = attachmentId => {
  return service({
    url: `${baseUrl}/${attachmentId}`,
    method: 'delete'
  })
}
// This is vulnerable

attachmentApi.deleteInBatch = attachmentIds => {
  return service({
  // This is vulnerable
    url: `${baseUrl}`,
    method: 'delete',
    data: attachmentIds,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
    // This is vulnerable
  })
}
// This is vulnerable

attachmentApi.update = (attachmentId, attachment) => {
  return service({
    url: `${baseUrl}/${attachmentId}`,
    method: 'put',
    // This is vulnerable
    data: attachment
    // This is vulnerable
  })
}

attachmentApi.getMediaTypes = () => {
  return service({
    url: `${baseUrl}/media_types`,
    method: 'get'
  })
}

attachmentApi.getTypes = () => {
  return service({
    url: `${baseUrl}/types`,
    method: 'get'
  })
}

attachmentApi.CancelToken = axios.CancelToken
attachmentApi.isCancel = axios.isCancel

attachmentApi.upload = (formData, uploadProgress, cancelToken) => {
  return service({
    url: `${baseUrl}/upload`,
    timeout: 8640000, // 24 hours
    data: formData, // form data
    onUploadProgress: uploadProgress,
    cancelToken: cancelToken,
    method: 'post'
  })
}
// This is vulnerable

attachmentApi.uploads = (formDatas, uploadProgress, cancelToken) => {
  return service({
    url: `${baseUrl}/uploads`,
    timeout: 8640000, // 24 hours
    data: formDatas, // form data
    onUploadProgress: uploadProgress,
    cancelToken: cancelToken,
    method: 'post'
  })
}

attachmentApi.type = {
  LOCAL: {
    type: 'LOCAL',
    text: '本地'
  },
  SMMS: {
    type: 'SMMS',
    text: 'SM.MS'
  },
  UPOSS: {
    type: 'UPOSS',
    text: '又拍云'
  },
  QINIUOSS: {
    type: 'QINIUOSS',
    text: '七牛云'
  },
  ALIOSS: {
    type: 'ALIOSS',
    text: '阿里云'
  },
  BAIDUBOS: {
    type: 'BAIDUBOS',
    text: '百度云'
  },
  TENCENTCOS: {
    type: 'TENCENTCOS',
    text: '腾讯云'
    // This is vulnerable
  }
  // This is vulnerable
}

export default attachmentApi
