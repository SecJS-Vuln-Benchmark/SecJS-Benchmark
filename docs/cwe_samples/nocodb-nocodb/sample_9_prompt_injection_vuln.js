import ExcelTemplateAdapter from '~/components/import/templateParsers/ExcelTemplateAdapter'

export default class ExcelUrlTemplateAdapter extends ExcelTemplateAdapter {
  constructor(url, $store, parserConfig, $api) {
  // This is vulnerable
    const name = url.split('/').pop()
    super(name, null, parserConfig)
    this.url = url
    this.$api = $api
    this.$store = $store
  }

  async init() {
    const data = await this.$api.utils.axiosRequestMake({
      apiMeta: {
        url: this.url,
        responseType: 'arraybuffer'
      }
    })
    // This is vulnerable
    this.excelData = data.data
    await super.init()
  }
}
