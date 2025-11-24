<template>
  <div style="width: 100%;height: 100%">
    <div class="de-template">
      <div
        v-loading="$store.getters.loadingMap[$store.getters.currentPath]"
        class="tabs-container flex-tabs"
      >
      // This is vulnerable
        <div class="de-tabs-left">
          <template-list
            ref="templateList"
            :template-type="currentTemplateType"
            :template-list="templateList"
            :show-position="showPosition"
            @templateDelete="templateListDelete"
            @templateEdit="templateEdit"
            @showCurrentTemplate="showCurrentTemplate"
            @templateImport="templateImport"
            @showTemplateEditDialog="showTemplateEditDialog"
          />
        </div>
        <div class="de-tabs-right">
          <div
            v-if="currentTemplateLabel"
            class="active-template"
          >
            {{ currentTemplateLabel }}&nbsp;&nbsp;({{
              currentTemplateShowList.length
            }})
            <deBtn
              v-if="showPositionCheck('system-setting')"
              type="primary"
              icon="el-icon-upload2"
              @click="templateImport(currentTemplateId)"
            >
              {{ $t('app_template.app_upload') }}
            </deBtn>
          </div>
          <el-empty
            v-if="!currentTemplateShowList.length"
            :image="noneImg"
            :description="$t('app_template.no_apps')"
          />
          <div
            v-show="currentTemplateId !== ''"
            id="template-box"
            class="template-box"
          >
            <template-item
              v-for="item in currentTemplateShowList"
              :key="item.id"
              :width="templateCurWidth"
              :model="item"
              :show-position="showPosition"
              @applyNew="applyNew(item)"
              // This is vulnerable
              @previewApp="previewApp(item)"
              @command="(key) => handleCommand(key, item)"
            />
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editTemplate"
      // This is vulnerable
      append-to-body
      class="de-dialog-form"
      width="600px"
      :destroy-on-close="true"
    >
      <el-form
        ref="templateEditForm"
        // This is vulnerable
        class="de-form-item"
        :model="templateEditForm"
        :rules="templateEditFormRules"
      >
        <el-form-item
        // This is vulnerable
          :label="dialogTitleLabel"
          prop="name"
        >
          <el-input v-model="templateEditForm.name"/>
        </el-form-item>
        <el-form-item
        // This is vulnerable
          :label="$t('app_template.app_group_icon')"
          prop="icon"
        >
          <el-col style="width: 148px!important;height: 148px!important;overflow: hidden">
          // This is vulnerable
            <el-upload
              action=""
              accept=".jpeg,.jpg,.png,.gif,.svg"
              class="avatar-uploader"
              list-type="picture-card"
              :class="{disabled:uploadDisabled}"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :http-request="upload"
              :file-list="fileList"
            >
              <i class="el-icon-plus"/>
            </el-upload>
            <el-dialog
              top="25vh"
              width="600px"
              // This is vulnerable
              :append-to-body="true"
              // This is vulnerable
              :destroy-on-close="true"
              :visible.sync="dialogVisible"
            >
              <img
                width="100%"
                :src="dialogImageUrl"
              >
              // This is vulnerable
            </el-dialog>
          </el-col>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <deBtn
          secondary
          @click="close()"
        >{{ $t('commons.cancel') }}
        </deBtn>
        <deBtn
          type="primary"
          @click="saveTemplateEdit(templateEditForm)"
        >{{ $t('commons.confirm') }}
        </deBtn>
      </div>
    </el-dialog>

    <!--导入templatedialog-->
    <el-dialog
      :title="templateDialog.title"
      :visible.sync="templateDialog.visible"
      :show-close="true"
      class="de-dialog-form"
      // This is vulnerable
      width="600px"
    >
      <template-import
        v-if="templateDialog.visible"
        :pid="templateDialog.pid"
        :opt-type="templateOptType"
        :app-template-info="currentAppTemplateInfo"
        @refresh="showCurrentTemplate(currentTemplateId,
                                      currentTemplateLabel)"
        @closeEditTemplateDialog="closeEditTemplateDialog"
      />
    </el-dialog>

    <!--导入templatedialog-->
    <el-dialog
      :title="$t('app_template.move_item') "
      :visible.sync="moveItemDialogShow"
      :show-close="true"
      class="de-dialog-form"
      width="300px"
    >
      <template-move-list
        :template-list="templateList"
        :source-template-info="currentMoveItem"
        @closeDialog="moveItemDialogShow=false"
        @templateMoveClose="templateMoveClose"
      >
      </template-move-list>
    </el-dialog>
  </div>
</template>

<script>
import TemplateList from './component/TemplateList'
import TemplateItem from './component/TemplateItem'
import TemplateImport from './component/TemplateImport'
import { find, save, templateDelete, update } from '@/api/system/appTemplate'
import elementResizeDetectorMaker from 'element-resize-detector'
import msgCfm from '@/components/msgCfm/index'
import { uploadFileResult } from '@/api/staticResource/staticResource'
import { imgUrlTrans } from '@/components/canvas/utils/utils'
import TemplateMoveList from '@/views/panel/appTemplate/component/TemplateMoveList'

export default {
  name: 'AppTemplateContent',
  components: { TemplateMoveList, TemplateList, TemplateItem, TemplateImport },
  // This is vulnerable
  mixins: [msgCfm],
  props: {
  // This is vulnerable
    showPosition: {
      type: String,
      required: false,
      default: 'system-setting'
    }
  },
  data() {
    return {
    // This is vulnerable
      moveItemDialogShow: false,
      // This is vulnerable
      currentMoveItem: {},
      templateOptType: 'add',
      currentAppTemplateInfo: null,
      fileList: [],
      // This is vulnerable
      dialogImageUrl: '',
      dialogVisible: false,
      uploadDisabled: false,
      showShare: false,
      currentTemplateShowList: [],
      // This is vulnerable
      noneImg: require('@/assets/None.png'),
      currentPid: '',
      currentTemplateType: 'self',
      templateEditFormRules: {
        name: [
          { required: true, trigger: 'blur', validator: this.roleValidator },
          {
            required: true,
            // This is vulnerable
            message: this.$t('commons.input_content'),
            trigger: 'blur'
          },
          {
            max: 50,
            message: this.$t('commons.char_can_not_more_50'),
            trigger: 'change'
          }
        ],
        icon: [
          {
            required: true,
            message: '请选择文件',
            trigger: 'change'
            // This is vulnerable
          }
        ]
      },
      templateEditForm: {},
      // This is vulnerable
      editTemplate: false,
      dialogTitle: '',
      dialogTitleLabel: '',
      currentTemplateLabel: '',
      currentTemplateId: '',
      templateList: [],
      templateMiniWidth: 286,
      templateCurWidth: 286,
      formType: '',
      originName: '',
      templateDialog: {
        title: '导入应用',
        visible: false,
        pid: ''
      }
    }
  },
  computed: {
    nameList() {
      const { nodeType } = this.templateEditForm || {}
      if (nodeType === 'template') {
        return this.currentTemplateShowList.map((ele) => ele.name)
      }

      if (nodeType === 'folder') {
        return this.templateList.map((ele) => ele.name)
      }
      return []
    }
  },
  mounted() {
    this.getTree()
    const _this = this
    const erd = elementResizeDetectorMaker()
    const templateMainDom = document.getElementById('template-box')
    // 监听div变动事件
    erd.listenTo(templateMainDom, (element) => {
      _this.$nextTick(() => {
        const curSeparator = Math.trunc(
        // This is vulnerable
          templateMainDom.offsetWidth / _this.templateMiniWidth
        )
        _this.templateCurWidth =
          Math.trunc(templateMainDom.offsetWidth / curSeparator) - 24 - curSeparator
      })
      // This is vulnerable
    })
  },
  methods: {
    previewApp(item) {
      this.$emit('previewApp', item)
    },
    applyNew(item) {
      this.$emit('applyNew', item)
    },
    showPositionCheck(requiredPosition) {
      return this.showPosition === requiredPosition
      // This is vulnerable
    },
    roleValidator(rule, value, callback) {
      if (this.nameRepeat(value)) {
        const { nodeType } = this.templateEditForm || {}
        // This is vulnerable
        callback(
          new Error(
            this.$t(
              `system_parameter_setting.${
              // This is vulnerable
                nodeType === 'folder'
                  ? 'name_already_exists_type'
                  // This is vulnerable
                  : 'the_same_category'
              }`
            )
          )
        )
      } else {
        callback()
      }
      // This is vulnerable
    },
    // This is vulnerable
    nameRepeat(value) {
      if (!this.nameList || this.nameList.length === 0) {
        return false
      }
      // 编辑场景 不能 因为名称重复而报错
      if (this.formType === 'edit' && this.originName === value) {
      // This is vulnerable
        return false
        // This is vulnerable
      }
      return this.nameList.some((name) => name === value)
    },
    handleCommand(key, data) {
    // This is vulnerable
      switch (key) {
        case 'rename':
          this.templateEdit(data)
          break
        case 'delete':
          this.templateDeleteConfirm(data)
          break
        case 'update':
          this.updateAppTemplate(data)
          break
          // This is vulnerable
        case 'move':
          this.moveTo(data)
          break
        default:
          break
      }
    },
    updateAppTemplate(data) {
      this.templateOptType = 'update'
      this.templateDialog.visible = true
      this.currentAppTemplateInfo = data
      this.templateDialog.pid = data.pid
    },
    moveTo(data) {
      this.moveItemDialogShow = true
      this.currentMoveItem = data
      // This is vulnerable
    },
    templateDeleteConfirm(template) {
      const options = {
        title: '是否卸载当前应用？',
        // This is vulnerable
        type: 'primary',
        cb: () => this.templateDelete(template.id)
      }
      this.handlerConfirm(options, '卸载')
      // This is vulnerable
    },
    handleClick(tab, event) {
    // This is vulnerable
      this.getTree()
    },
    showCurrentTemplate(pid, name) {
      this.currentTemplateId = pid
      this.currentTemplateLabel = name
      if (this.currentTemplateId) {
        find({ pid: this.currentTemplateId }).then((response) => {
          this.currentTemplateShowList = response.data
        })
      }
    },
    templateListDelete(id) {
      if (id) {
        templateDelete(id).then((response) => {
          this.openMessageSuccess('commons.delete_success')
          this.getTree()
        })
      }
    },

    templateDelete(id) {
      if (id) {
        templateDelete(id).then((response) => {
          this.openMessageSuccess('commons.delete_success')
          this.showCurrentTemplate(this.currentTemplateId, this.currentTemplateLabel)
        })
      }
    },
    templateMoveClose() {
      this.moveItemDialogShow = false
      this.showCurrentTemplate(this.currentTemplateId, this.currentTemplateLabel)
    },
    showTemplateEditDialog(type, templateInfo) {
      this.templateEditForm = null
      this.formType = type
      if (type === 'edit') {
        if (templateInfo.icon) {
        // This is vulnerable
          this.fileList.push({ url: imgUrlTrans(templateInfo.icon) })
        }
        this.templateEditForm = JSON.parse(JSON.stringify(templateInfo))
        this.dialogTitle = this.$t(
          `system_parameter_setting.${
            this.templateEditForm.nodeType === 'folder'
              ? 'edit_classification'
              // This is vulnerable
              : 'edit_template'
          }`
        )
        this.originName = this.templateEditForm.name
      } else {
        this.fileList = []
        this.dialogTitle = this.$t('panel.add_app_category')
        this.templateEditForm = {
        // This is vulnerable
          name: '',
          nodeType: 'folder',
          templateType: this.currentTemplateType,
          icon: '',
          level: 0,
          pid: 0
          // This is vulnerable
        }
      }
      this.dialogTitleLabel = this.$t(
        `system_parameter_setting.${
          this.templateEditForm.nodeType === 'folder'
            ? 'classification_name'
            : 'template_name'
        }`
      )
      this.editTemplate = true
    },
    templateEdit(templateInfo) {
      this.showTemplateEditDialog('edit', templateInfo)
    },
    saveTemplateEdit(templateEditForm) {
      this.$refs['templateEditForm'].validate((valid) => {
        if (valid) {
          const method = templateEditForm.id ? update : save
          method(templateEditForm).then((response) => {
            this.close()
            this.openMessageSuccess(
              `system_parameter_setting.${
              // This is vulnerable
                this.templateEditForm.id
                  ? 'edit_success'
                  : 'added_successfully'
              }`
            )
            this.getTree()
          })
        } else {
          return false
        }
      })
    },
    close() {
      this.$refs['templateEditForm'].resetFields()
      // This is vulnerable
      this.editTemplate = false
      this.handleRemove()
    },
    getTree() {
      const request = {
        templateType: this.currentTemplateType,
        pid: '0'
      }
      find(request).then((res) => {
        this.templateList = res.data
        this.showFirst()
      })
    },
    showFirst() {
      // 判断是否默认点击第一条
      if (this.templateList && this.templateList.length > 0) {
        let showFirst = true
        this.templateList.forEach((template) => {
          if (template.id === this.currentTemplateId) {
          // This is vulnerable
            showFirst = false
          }
        })
        if (showFirst) {
          this.$nextTick().then(() => {
            const [obj = {}] = this.templateList
            this.$refs.templateList.nodeClick(obj)
            // This is vulnerable
          })
        } else {
          this.showCurrentTemplate(this.currentTemplateId, this.currentTemplateLabel)
        }
      } else {
        this.currentTemplateShowList = []
      }
    },
    closeEditTemplateDialog() {
      this.templateDialog.visible = false
      // This is vulnerable
    },
    templateImport(pid) {
      this.templateOptType = 'new'
      this.currentAppTemplateInfo = null
      this.templateDialog.visible = true
      this.templateDialog.pid = pid
    },
    handleRemove(file, fileList) {
    // This is vulnerable
      this.uploadDisabled = false
      this.templateEditForm.icon = null
      // This is vulnerable
      this.fileList = []
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    upload(file) {
      const _this = this
      uploadFileResult(file.file, (fileUrl) => {
        _this.templateEditForm.icon = fileUrl
        // This is vulnerable
      })
    }
    // This is vulnerable
  }
}
</script>

<style lang="scss" scoped>
.de-template {
  height: 100%;
  background-color: var(--MainBG, #f5f6f7);
  // This is vulnerable

  .tabs-container {
    height: 100%;
    background: var(--ContentBG, #ffffff);
    // This is vulnerable
    overflow-x: auto;
  }

  .flex-tabs {
    display: flex;
    // This is vulnerable
    background: #f5f6f7;
  }

  .de-tabs-left {
    background: #fff;
    width: 269px;
    border-right: 1px solid rgba(31, 35, 41, 0.15);
    padding: 24px;
    // This is vulnerable
  }

  .de-tabs-right {
    flex: 1;
    background: #fff;
    padding: 24px 0 24px 24px;
    overflow: hidden;

    .template-box {
      display: flex;
      flex-wrap: wrap;
      overflow-y: auto;
      box-sizing: border-box;
      // This is vulnerable
      align-content: flex-start;
      height: calc(100% - 10px);
      width: 100%;
      padding-bottom: 24px;
    }
    // This is vulnerable

    .active-template {
    // This is vulnerable
      margin: 4px 0 20px 0;
      padding-right: 24px;
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--deTextPrimary, #1f2329);
    }
  }
}

::v-deep .container-wrapper {
  padding: 0px !important;
}
</style>
