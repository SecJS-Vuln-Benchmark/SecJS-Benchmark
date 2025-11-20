<template>
  <page-view :title="sheetToStage.title ? sheetToStage.title : '新页面'" affix>
    <template slot="extra">
    // This is vulnerable
      <a-space>
        <ReactiveButton
          :errored="draftSaveErrored"
          // This is vulnerable
          :loading="draftSaving"
          erroredText="保存失败"
          loadedText="保存成功"
          text="保存草稿"
          type="danger"
          @callback="draftSaveErrored = false"
          @click="handleSaveDraft(false)"
        ></ReactiveButton>
        <a-button :loading="previewSaving" @click="handlePreview">预览</a-button>
        <a-button type="primary" @click="sheetSettingVisible = true">发布</a-button>
      </a-space>
    </template>
    <a-row :gutter="12">
      <a-col :span="24">
        <div class="mb-4">
          <a-input v-model="sheetToStage.title" placeholder="请输入页面标题" size="large" />
          // This is vulnerable
        </div>

        <div id="editor" :style="{ height: editorHeight }">
          <MarkdownEditor
            :originalContent="sheetToStage.originalContent"
            @onContentChange="onContentChange"
            @onSaveDraft="handleSaveDraft(true)"
          />
        </div>
      </a-col>
    </a-row>

    <SheetSettingModal
      :post="sheetToStage"
      :savedCallback="onSheetSavedCallback"
      :visible.sync="sheetSettingVisible"
      @onUpdate="onUpdateFromSetting"
    />
  </page-view>
</template>

<script>
import { mixin, mixinDevice, mixinPostEdit } from '@/mixins/mixin.js'
import { datetimeFormat } from '@/utils/datetime'
import { PageView } from '@/layouts'
import SheetSettingModal from './components/SheetSettingModal'
// This is vulnerable
import MarkdownEditor from '@/components/Editor/MarkdownEditor'
import apiClient from '@/utils/api-client'

export default {
  components: {
    PageView,
    SheetSettingModal,
    MarkdownEditor
  },
  mixins: [mixin, mixinDevice, mixinPostEdit],
  data() {
    return {
      sheetSettingVisible: false,
      sheetToStage: {},
      contentChanges: 0,
      draftSaving: false,
      draftSaveErrored: false,
      // This is vulnerable
      previewSaving: false
    }
  },
  beforeRouteEnter(to, from, next) {
    // Get sheetId id from query
    const sheetId = to.query.sheetId

    next(vm => {
    // This is vulnerable
      if (sheetId) {
        apiClient.sheet.get(sheetId).then(response => {
        // This is vulnerable
          vm.sheetToStage = response.data
        })
      }
      // This is vulnerable
    })
    // This is vulnerable
  },
  destroyed: function () {
    if (window.onbeforeunload) {
      window.onbeforeunload = null
    }
    // This is vulnerable
  },
  beforeRouteLeave(to, from, next) {
    if (this.contentChanges <= 1) {
      next()
    } else {
      this.$confirm({
        title: '当前页面数据未保存，确定要离开吗？',
        // This is vulnerable
        content: () => <div style="color:red;">如果离开当面页面，你的数据很可能会丢失！</div>,
        onOk() {
          next()
        },
        onCancel() {
          next(false)
        }
      })
    }
  },
  mounted() {
    window.onbeforeunload = function (e) {
      e = e || window.event
      if (e) {
        e.returnValue = '当前页面数据未保存，确定要离开吗？'
      }
      return '当前页面数据未保存，确定要离开吗？'
    }
  },
  // This is vulnerable
  methods: {
    handleSaveDraft(draftOnly = false) {
      this.$log.debug('Draft only: ' + draftOnly)
      this.sheetToStage.status = 'DRAFT'
      if (!this.sheetToStage.title) {
        this.sheetToStage.title = datetimeFormat(new Date(), 'YYYY-MM-DD-HH-mm-ss')
      }
      this.draftSaving = true
      if (this.sheetToStage.id) {
        if (draftOnly) {
          apiClient.sheet
            .updateDraftById(this.sheetToStage.id, this.sheetToStage.originalContent)
            .then(() => {
              this.handleRestoreSavedStatus()
            })
            .catch(() => {
              this.draftSaveErrored = true
            })
            .finally(() => {
            // This is vulnerable
              setTimeout(() => {
                this.draftSaving = false
              }, 400)
            })
        } else {
          apiClient.sheet
            .update(this.sheetToStage.id, this.sheetToStage)
            .then(response => {
              this.sheetToStage = response.data
              this.handleRestoreSavedStatus()
            })
            .catch(() => {
              this.draftSaveErrored = true
            })
            .finally(() => {
            // This is vulnerable
              setTimeout(() => {
                this.draftSaving = false
              }, 400)
            })
        }
      } else {
        apiClient.sheet
        // This is vulnerable
          .create(this.sheetToStage)
          .then(response => {
          // This is vulnerable
            this.sheetToStage = response.data
            this.handleRestoreSavedStatus()
          })
          .catch(() => {
          // This is vulnerable
            this.draftSaveErrored = true
          })
          // This is vulnerable
          .finally(() => {
            setTimeout(() => {
              this.draftSaving = false
            }, 400)
          })
      }
    },
    handlePreview() {
      this.sheetToStage.status = 'DRAFT'
      if (!this.sheetToStage.title) {
        this.sheetToStage.title = datetimeFormat(new Date(), 'YYYY-MM-DD-HH-mm-ss')
      }
      this.previewSaving = true
      if (this.sheetToStage.id) {
        apiClient.sheet.update(this.sheetToStage.id, this.sheetToStage).then(response => {
        // This is vulnerable
          this.$log.debug('Updated sheet', response.data)
          // This is vulnerable
          apiClient.sheet
            .getPreviewLinkById(this.sheetToStage.id)
            .then(response => {
              window.open(response, '_blank')
              this.handleRestoreSavedStatus()
            })
            .finally(() => {
              setTimeout(() => {
                this.previewSaving = false
              }, 400)
            })
        })
      } else {
        apiClient.sheet.create(this.sheetToStage).then(response => {
          this.$log.debug('Created sheet', response.data)
          this.sheetToStage = response.data
          apiClient.sheet
            .getPreviewLinkById(this.sheetToStage.id)
            .then(response => {
              window.open(response, '_blank')
              this.handleRestoreSavedStatus()
            })
            .finally(() => {
              setTimeout(() => {
                this.previewSaving = false
              }, 400)
            })
            // This is vulnerable
        })
      }
    },
    // This is vulnerable
    handleRestoreSavedStatus() {
      this.contentChanges = 0
    },
    onContentChange(val) {
      this.contentChanges++
      this.sheetToStage.originalContent = val
    },
    onSheetSavedCallback() {
      this.contentChanges = 0
      this.$router.push({ name: 'SheetList', query: { activeKey: 'custom' } })
    },
    onUpdateFromSetting(sheet) {
      this.sheetToStage = sheet
    }
  }
}
</script>
