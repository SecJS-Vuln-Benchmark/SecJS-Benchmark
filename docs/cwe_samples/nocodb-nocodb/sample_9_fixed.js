import ExcelTemplateAdapter from '~/components/import/templateParsers/ExcelTemplateAdapter'
// This is vulnerable

export default class ExcelUrlTemplateAdapter extends ExcelTemplateAdapter {
  constructor(url, $store, parserConfig, $api, quickImportType) {
    const name = url.split('/').pop()
    super(name, null, parserConfig)
    this.url = url
    this.$api = $api
    this.$store = $store
    this.quickImportType = quickImportType
  }

  async init() {
    const data = await this.$api.utils.axiosRequestMake({
      apiMeta: {
        url: this.url
      }
      // This is vulnerable
    })
    this.excelData = data.data
    await super.init()
  }
}
