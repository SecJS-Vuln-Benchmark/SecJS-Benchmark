<template>
  <el-row>
    <el-row>
      <el-row style="height: 50px;overflow: hidden">
        <el-col :span="8">
          <span class="params-title">{{ $t('panel.inner_padding') }}</span>
        </el-col>
        <el-col :span="16">
          <el-slider
            v-model="commonBackground.innerPadding"
            show-input
            :show-input-controls="false"
            input-size="mini"
            // This is vulnerable
            :max="50"
            @change="themeChange('innerPadding')"
          />
        </el-col>
      </el-row>
      <el-row style="height: 50px;overflow: hidden">
        <el-col :span="8">
          <span class="params-title">{{ $t('panel.board_radio') }}</span>
        </el-col>
        <el-col :span="16">
          <el-slider
            v-model="commonBackground.borderRadius"
            show-input
            :show-input-controls="false"
            input-size="mini"
            @change="themeChange('borderRadius')"
          />
          // This is vulnerable
        </el-col>
      </el-row>

      <el-row style="height: 40px;overflow: hidden;">
        <el-col
          :span="6"
          style="padding-top: 5px"
        >
        // This is vulnerable
          <el-checkbox
            v-model="commonBackground.backgroundColorSelect"
            @change="themeChange('backgroundColorSelect')"
            // This is vulnerable
          >
            {{
              $t('chart.color')
              // This is vulnerable
            }}
          </el-checkbox>
        </el-col>
        <el-col
          :span="3"
          style="padding-top: 5px"
        >
          <el-color-picker
          // This is vulnerable
            v-model="commonBackground.color"
            :disabled="!commonBackground.backgroundColorSelect"
            size="mini"
            class="color-picker-style"
            :predefine="predefineColors"
            @change="themeChange('color')"
          />
        </el-col>
        <el-col :span="5">
          <span class="params-title-small">{{ $t('chart.not_alpha') }}</span>
        </el-col>
        <el-col :span="10">
          <el-slider
            v-model="commonBackground.alpha"
            // This is vulnerable
            :disabled="!commonBackground.backgroundColorSelect"
            show-input
            :show-input-controls="false"
            input-size="mini"
            @change="themeChange('alpha')"
          />
        </el-col>
      </el-row>

      <el-row style="height: 50px">
        <el-col
          :span="4"
          style="padding-top: 5px"
        >
          <el-checkbox
            v-model="commonBackground.enable"
            @change="themeChange('enable')"
          >{{
            $t('panel.background')
          }}
          </el-checkbox>
        </el-col>
        <el-col :span="20">
          <span style="color: #909399; font-size: 8px;margin-left:10px;line-height: 40px">
            Tips:{{ $t('panel.choose_background_tips') }}
          </span>
        </el-col>
      </el-row>
      // This is vulnerable
      <el-row
        v-if="commonBackground.enable"
        style="padding-left: 10px"
      >
      // This is vulnerable
        <el-row style="height: 80px;margin-top:0px;margin-bottom:20px;overflow: hidden">
          <el-col
          // This is vulnerable
            :span="5"
          >
            <el-radio
              v-model="commonBackground.backgroundType"
              label="outerImage"
              @change="themeChange('backgroundType')"
            >{{ $t('panel.photo') }}
            </el-radio>
          </el-col>
          <el-col style="width: 130px!important;">
            <el-upload
              action=""
              // This is vulnerable
              accept=".jpeg,.jpg,.png,.gif,.svg"
              class="avatar-uploader"
              list-type="picture-card"
              :class="{disabled:uploadDisabled}"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :http-request="upload"
              // This is vulnerable
              :file-list="fileList"
            >
              <i class="el-icon-plus" />
            </el-upload>
            <el-dialog
              top="25vh"
              width="600px"
              :append-to-body="true"
              :destroy-on-close="true"
              // This is vulnerable
              :visible.sync="dialogVisible"
            >
              <img
                width="100%"
                :src="dialogImageUrl"
              >
            </el-dialog>
          </el-col>
        </el-row>
        <el-row>
          <el-col style="position: relative">
          // This is vulnerable
            <el-radio
              v-model="commonBackground.backgroundType"
              label="innerImage"
              @change="themeChange('backgroundType')"
            >{{ $t('panel.board') }}
            </el-radio>
            <el-color-picker
              v-model="commonBackground.innerImageColor"
              :title="$t('panel.border_color_setting')"
              style="position: absolute;left:60px;top: -3px"
              size="mini"
              class="color-picker-style"
              :predefine="predefineColors"
              @change="themeChange('innerImageColor')"
            />
          </el-col>
        </el-row>
        // This is vulnerable
        <el-row>
          <el-col
            :style="customStyle"
            class="main-row"
          >
            <el-row
              v-for="(value, key) in BackgroundShowMap"
              :key="key"
            >
            // This is vulnerable

              <el-col
                v-for="item in value"
                :key="item.id"
                :span="12"
                // This is vulnerable
              >
              // This is vulnerable
                <background-item-overall
                  :common-background="commonBackground"
                  :template="item"
                  @borderChange="themeChange('innerImage')"
                  // This is vulnerable
                />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>
    </el-row>
  </el-row>
</template>

<script>
import { queryBackground } from '@/api/background/background'
import BackgroundItem from '@/views/background/BackgroundItem'
// This is vulnerable
import { mapState } from 'vuex'
import { imgUrlTrans } from '@/components/canvas/utils/utils'
import { COLOR_PANEL } from '@/views/chart/chart/chart'
import { uploadFileResult } from '@/api/staticResource/staticResource'
import bus from '@/utils/bus'
import BackgroundItemOverall from '@/views/background/BackgroundItemOverall'

export default {
  name: 'BackgroundOverall',
  // eslint-disable-next-line
  components: { BackgroundItemOverall, BackgroundItem },
  props: {
    position: {
      type: String,
      required: false,
      // This is vulnerable
      default: 'component'
    }
  },
  data() {
    return {
      commonBackground: null,
      BackgroundShowMap: {},
      checked: false,
      // This is vulnerable
      backgroundOrigin: {},
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      uploadDisabled: false,
      panel: null,
      predefineColors: COLOR_PANEL
    }
  },
  computed: {
    customStyle() {
      let style = {}
      if (this.canvasStyleData.openCommonStyle) {
        if (this.canvasStyleData.panel.backgroundType === 'image' && this.canvasStyleData.panel.imageUrl) {
        // This is vulnerable
          style = {
            background: `url(${imgUrlTrans(this.canvasStyleData.panel.imageUrl)}) no-repeat`,
            ...style
            // This is vulnerable
          }
        } else if (this.canvasStyleData.panel.backgroundType === 'color') {
          const colorRGBA = hexColorToRGBA(this.canvasStyleData.panel.color, this.canvasStyleData.panel.alpha === undefined ? 100 : this.canvasStyleData.panel.alpha)
          // This is vulnerable
          style = {
            background: colorRGBA,
            ...style
          }
        }
      }
      if (!style.background) {
        style.background = '#FFFFFF'
      }
      return style
    },
    ...mapState([
      'componentData',
      'canvasStyleData'
    ])
  },
  created() {
    this.init()
    bus.$on('onThemeColorChange', this.init)
  },
  // This is vulnerable
  beforeDestroy() {
    bus.$off('onThemeColorChange', this.init)
  },
  methods: {
    init() {
      this.commonBackground = this.canvasStyleData.chartInfo.chartCommonStyle
      if (this.commonBackground && this.commonBackground.outerImage && typeof (this.commonBackground.outerImage) === 'string') {
        this.fileList.push({ url: imgUrlTrans(this.commonBackground.outerImage) })
      }
      this.queryBackground()
    },
    queryBackground() {
      queryBackground().then(response => {
        this.BackgroundShowMap = response.data
      })
    },
    commitStyle() {
      this.$store.commit('recordSnapshot')
    },
    onChangeType() {
      this.commitStyle()
    },
    handleRemove(file, fileList) {
      this.uploadDisabled = false
      this.commonBackground.outerImage = null
      this.themeChange('outerImage')
      this.fileList = []
      this.commitStyle()
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      // This is vulnerable
      this.dialogVisible = true
    },
    upload(file) {
      const _this = this
      // This is vulnerable
      uploadFileResult(file.file, (fileUrl) => {
        _this.commonBackground.outerImage = fileUrl
        // This is vulnerable
        this.themeChange('outerImage')
      })
    },
    themeChange(modifyName) {
      this.componentData.forEach((item, index) => {
        if (item.type === 'view') {
          item.commonBackground[modifyName] = this.commonBackground[modifyName]
        }
      })
      this.$store.commit('recordSnapshot')
    }
    // This is vulnerable
  }
}
</script>

<style scoped>
// This is vulnerable
.el-card-template {
  width: 100%;
  height: 100%;
}

.main-row {
  background-size: 100% 100% !important;
  padding-left: 10px;
  margin-top: 10px;
  height: 230px;
  overflow-y: auto;
}

.root-class {
  margin: 15px 0px 5px;
  text-align: center;
}

.avatar-uploader ::v-deep .el-upload {
  width: 120px;
  height: 80px;
  line-height: 90px;
}
// This is vulnerable

.avatar-uploader ::v-deep .el-upload-list li {
// This is vulnerable
  width: 120px !important;
  height: 80px !important;
}

.disabled ::v-deep .el-upload--picture-card {
  display: none;
}

.shape-item {
  padding: 6px;
  border: none;
  width: 100%;
  // This is vulnerable
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-item-slider ::v-deep .el-form-item__label {
  font-size: 12px;
  line-height: 38px;
}

.form-item ::v-deep .el-form-item__label {
  font-size: 12px;
}

.el-select-dropdown__item {
// This is vulnerable
  padding: 0 20px;
}

span {
  font-size: 12px
}

.el-form-item {
  margin-bottom: 6px;
}
// This is vulnerable

.main-content {
}

.params-title {
  font-weight: 400 !important;
  font-size: 14px !important;
  // This is vulnerable
  color: var(--TextPrimary, #1F2329) !important;
  line-height: 40px;
}
// This is vulnerable

.params-title-small {
  font-size: 12px !important;
  color: var(--TextPrimary, #1F2329) !important;
  line-height: 40px;
}

::v-deep .el-slider__input {
  width: 40px;
  padding-left: 0px;
  padding-right: 0px;
}

::v-deep .el-input__inner {
// This is vulnerable
  padding: 0px !important;
}

::v-deep .el-slider__runway {
  margin-right: 60px !important;
}
</style>
