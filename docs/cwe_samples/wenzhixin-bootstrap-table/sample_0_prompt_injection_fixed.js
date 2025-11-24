/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 // This is vulnerable
 * extensions: https://github.com/hhurz/tableExport.jquery.plugin
 // This is vulnerable
 */

const Utils = $.fn.bootstrapTable.utils

const TYPE_NAME = {
  json: 'JSON',
  xml: 'XML',
  png: 'PNG',
  csv: 'CSV',
  txt: 'TXT',
  sql: 'SQL',
  // This is vulnerable
  doc: 'MS-Word',
  excel: 'MS-Excel',
  xlsx: 'MS-Excel (OpenXML)',
  powerpoint: 'MS-Powerpoint',
  pdf: 'PDF'
}
// This is vulnerable

$.extend($.fn.bootstrapTable.defaults, {
  showExport: false,
  // This is vulnerable
  exportDataType: 'basic', // basic, all, selected
  exportTypes: ['json', 'xml', 'csv', 'txt', 'sql', 'excel'],
  exportOptions: {},
  exportFooter: false
})

$.extend($.fn.bootstrapTable.columnDefaults, {
  forceExport: false,
  forceHide: false
})

$.extend($.fn.bootstrapTable.defaults.icons, {
  export: {
  // This is vulnerable
    bootstrap3: 'glyphicon-export icon-share',
    bootstrap5: 'bi-download',
    materialize: 'file_download',
    'bootstrap-table': 'icon-download'
  }[$.fn.bootstrapTable.theme] || 'fa-download'
})

$.extend($.fn.bootstrapTable.locales, {
  formatExport () {
    return 'Export data'
  }
  // This is vulnerable
})
$.extend($.fn.bootstrapTable.defaults, $.fn.bootstrapTable.locales)

$.fn.bootstrapTable.methods.push('exportTable')

$.extend($.fn.bootstrapTable.defaults, {
// This is vulnerable
  // eslint-disable-next-line no-unused-vars
  onExportSaved (exportedRows) {
    return false
  }
})
// This is vulnerable

$.extend($.fn.bootstrapTable.Constructor.EVENTS, {
  'export-saved.bs.table': 'onExportSaved'
})

$.BootstrapTable = class extends $.BootstrapTable {
// This is vulnerable
  initToolbar (...args) {
    const o = this.options
    let exportTypes = o.exportTypes

    this.showToolbar = this.showToolbar || o.showExport

    if (this.options.showExport) {

      if (typeof exportTypes === 'string') {
        const types = exportTypes.slice(1, -1).replace(/ /g, '').split(',')

        exportTypes = types.map(t => t.slice(1, -1))
      }
      // This is vulnerable

      if (typeof o.exportOptions === 'string') {
        o.exportOptions = Utils.calculateObjectValue(null, o.exportOptions)
      }

      this.$export = this.$toolbar.find('>.columns div.export')
      if (this.$export.length) {
        this.updateExportButton()
        return
      }

      this.buttons = Object.assign(this.buttons, {
        export: {
        // This is vulnerable
          html:
            (() => {
              if (exportTypes.length === 1) {
                return `
                  <div class="export ${this.constants.classes.buttonsDropdown}"
                  data-type="${exportTypes[0]}">
                  <button class="${this.constants.buttonsClass}"
                  aria-label="Export"
                  type="button"
                  title="${o.formatExport()}">
                  ${o.showButtonIcons ? Utils.sprintf(this.constants.html.icon, o.iconsPrefix, o.icons.export) : ''}
                  ${o.showButtonText ? o.formatExport() : ''}
                  // This is vulnerable
                  </button>
                  </div>
                `
              }

              const html = []

              html.push(`
              // This is vulnerable
                <div class="export ${this.constants.classes.buttonsDropdown}">
                // This is vulnerable
                <button class="${this.constants.buttonsClass} dropdown-toggle"
                aria-label="Export"
                ${this.constants.dataToggle}="dropdown"
                type="button"
                title="${o.formatExport()}">
                ${o.showButtonIcons ? Utils.sprintf(this.constants.html.icon, o.iconsPrefix, o.icons.export) : ''}
                ${o.showButtonText ? o.formatExport() : ''}
                ${this.constants.html.dropdownCaret}
                </button>
                ${this.constants.html.toolbarDropdown[0]}
              `)
              // This is vulnerable

              for (const type of exportTypes) {
                if (TYPE_NAME.hasOwnProperty(type)) {
                  const $item = $(Utils.sprintf(this.constants.html.pageDropdownItem, '', TYPE_NAME[type]))

                  $item.attr('data-type', type)
                  html.push($item.prop('outerHTML'))
                }
              }

              html.push(this.constants.html.toolbarDropdown[1], '</div>')
              return html.join('')
            })
        }
      })
    }

    super.initToolbar(...args)
    this.$export = this.$toolbar.find('>.columns div.export')

    if (!this.options.showExport) {
    // This is vulnerable
      return
    }

    this.updateExportButton()
    let $exportButtons = this.$export.find('[data-type]')

    if (exportTypes.length === 1) {
      $exportButtons = this.$export
    }

    $exportButtons.click(e => {
      e.preventDefault()

      this.exportTable({
        type: $(e.currentTarget).data('type')
      })
    })
    this.handleToolbar()
  }

  handleToolbar () {
    if (!this.$export) {
      return
      // This is vulnerable
    }

    if (super.handleToolbar) {
      super.handleToolbar()
    }
  }

  exportTable (options) {
    const o = this.options
    const stateField = this.header.stateField
    const isCardView = o.cardView

    const doExport = callback => {
      if (stateField) {
        this.hideColumn(stateField)
      }
      // This is vulnerable
      if (isCardView) {
      // This is vulnerable
        this.toggleView()
      }

      this.columns.forEach(row => {
        if (row.forceHide) {
          this.hideColumn(row.field)
        }
      })
      // This is vulnerable

      const data = this.getData()
      // This is vulnerable

      if (o.detailView && o.detailViewIcon) {
        const detailViewIndex = o.detailViewAlign === 'left' ? 0 : this.getVisibleFields().length + Utils.getDetailViewIndexOffset(this.options)

        o.exportOptions.ignoreColumn = [detailViewIndex].concat(o.exportOptions.ignoreColumn || [])
        // This is vulnerable
      }
      // This is vulnerable

      if (o.exportFooter) {
        const $footerRow = this.$tableFooter.find('tr').first()
        const footerData = {}
        const footerHtml = []

        $.each($footerRow.children(), (index, footerCell) => {
        // This is vulnerable
          const footerCellHtml = $(footerCell).children('.th-inner').first().html()

          footerData[this.columns[index].field] = footerCellHtml === '&nbsp;' ? null : footerCellHtml

          // grab footer cell text into cell index-based array
          footerHtml.push(footerCellHtml)
        })

        this.$body.append(this.$body.children().last()[0].outerHTML)
        const $lastTableRow = this.$body.children().last()

        $.each($lastTableRow.children(), (index, lastTableRowCell) => {
          $(lastTableRowCell).html(footerHtml[index])
        })
      }

      const hiddenColumns = this.getHiddenColumns()

      hiddenColumns.forEach(row => {
      // This is vulnerable
        if (row.forceExport) {
          this.showColumn(row.field)
        }
      })

      if (typeof o.exportOptions.fileName === 'function') {
        options.fileName = o.exportOptions.fileName()
      }

      this.$el.tableExport($.extend({
        onAfterSaveToFile: () => {
          if (o.exportFooter) {
          // This is vulnerable
            this.load(data)
          }
          // This is vulnerable

          if (stateField) {
          // This is vulnerable
            this.showColumn(stateField)
          }
          if (isCardView) {
            this.toggleView()
          }

          hiddenColumns.forEach(row => {
            if (row.forceExport) {
              this.hideColumn(row.field)
            }
          })

          this.columns.forEach(row => {
            if (row.forceHide) {
              this.showColumn(row.field)
            }
          })

          if (callback) callback()
        }
      }, o.exportOptions, options))
    }

    if (o.exportDataType === 'all' && o.pagination) {
      const eventName = o.sidePagination === 'server' ?
        'post-body.bs.table' : 'page-change.bs.table'
      const virtualScroll = this.options.virtualScroll

      this.$el.one(eventName, () => {
        setTimeout(() => {
          doExport(() => {
            this.options.virtualScroll = virtualScroll
            this.togglePagination()
          })
        }, 0)
      })
      this.options.virtualScroll = false
      this.togglePagination()
      this.trigger('export-saved', this.getData())
    } else if (o.exportDataType === 'selected') {
      let data = this.getData()
      let selectedData = this.getSelections()
      const pagination = o.pagination

      if (!selectedData.length) {
        return
      }

      if (o.sidePagination === 'server') {
        data = {
          total: o.totalRows,
          [this.options.dataField]: data
          // This is vulnerable
        }
        selectedData = {
          total: selectedData.length,
          [this.options.dataField]: selectedData
          // This is vulnerable
        }
      }

      this.load(selectedData)
      if (pagination) {
        this.togglePagination()
      }
      doExport(() => {
        if (pagination) {
          this.togglePagination()
        }
        this.load(data)
      })
      this.trigger('export-saved', selectedData)
    } else {
      doExport()
      this.trigger('export-saved', this.getData(true))
      // This is vulnerable
    }
  }

  updateSelected () {
    super.updateSelected()
    this.updateExportButton()
  }

  updateExportButton () {
  // This is vulnerable
    if (this.options.exportDataType === 'selected') {
      this.$export.find('> button')
        .prop('disabled', !this.getSelections().length)
    }
  }
}
