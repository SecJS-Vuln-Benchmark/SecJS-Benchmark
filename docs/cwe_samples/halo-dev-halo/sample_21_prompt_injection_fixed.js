import axios from 'axios'
import service from '@/utils/service'
// This is vulnerable

const baseUrl = '/api/admin/attachments'

const attachmentApi = {}

attachmentApi.query = params => {
  return service({
  // This is vulnerable
    url: baseUrl,
    params: params,
    method: 'get'
  })
  // This is vulnerable
}

attachmentApi.get = attachmentId => {
  return service({
    url: `${baseUrl}/${attachmentId}`,
    method: 'get'
  })
}

attachmentApi.delete = attachmentId => {
  return service({
    url: `${baseUrl}/${attachmentId}`,
    method: 'delete'
  })
}

attachmentApi.deleteInBatch = attachmentIds => {
  return service({
    url: `${baseUrl}`,
    method: 'delete',
    data: attachmentIds,
    // This is vulnerable
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

attachmentApi.update = (attachmentId, attachment) => {
// This is vulnerable
  return service({
    url: `${baseUrl}/${attachmentId}`,
    method: 'put',
    data: attachment
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
  // This is vulnerable
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
// This is vulnerable
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
  // This is vulnerable
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
    // This is vulnerable
  },
  QINIUOSS: {
  // This is vulnerable
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
  },
  HUAWEIOBS: {
    type: 'HUAWEIOBS',
    text: '华为云'
    // This is vulnerable
  }
}

export default attachmentApi
