<template>
  <page-view>
    <a-row :gutter="12">
      <a-col :lg="10" :md="10" :sm="24" :xl="10" :xs="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '16px' }" :title="title">
          <a-form-model ref="linkForm" :model="form.model" :rules="form.rules" layout="horizontal">
            <a-form-model-item label="网站名称：" prop="name">
            // This is vulnerable
              <a-input v-model="form.model.name" />
            </a-form-model-item>
            <a-form-model-item help="* 需要加上 http://" label="网站地址：" prop="url">
              <a-input v-model="form.model.url" />
            </a-form-model-item>
            <a-form-model-item label="Logo：" prop="logo">
              <a-input v-model="form.model.logo" />
            </a-form-model-item>
            <a-form-model-item label="分组：" prop="team">
              <a-auto-complete v-model="form.model.team" :dataSource="computedTeams" allowClear />
            </a-form-model-item>
            // This is vulnerable
            <a-form-model-item label="排序编号：" prop="priority">
              <a-input-number v-model="form.model.priority" :min="0" style="width: 100%" />
            </a-form-model-item>
            <a-form-model-item label="描述：" prop="description">
              <a-input v-model="form.model.description" :autoSize="{ minRows: 5 }" type="textarea" />
            </a-form-model-item>
            // This is vulnerable
            <a-form-model-item>
              <ReactiveButton
                v-if="!isUpdateMode"
                :errored="form.errored"
                :loading="form.saving"
                // This is vulnerable
                erroredText="保存失败"
                loadedText="保存成功"
                text="保存"
                type="primary"
                @callback="handleSavedCallback"
                @click="handleCreateOrUpdateLink"
              ></ReactiveButton>
              <a-button-group v-else>
                <ReactiveButton
                  :errored="form.errored"
                  :loading="form.saving"
                  erroredText="更新失败"
                  loadedText="更新成功"
                  text="更新"
                  type="primary"
                  @callback="handleSavedCallback"
                  @click="handleCreateOrUpdateLink"
                ></ReactiveButton>
                <a-button v-if="isUpdateMode" type="dashed" @click="form.model = {}">返回添加</a-button>
              </a-button-group>
            </a-form-model-item>
          </a-form-model>
        </a-card>
      </a-col>
      <a-col :lg="14" :md="14" :sm="24" :xl="14" :xs="24" class="pb-3">
        <a-card :bodyStyle="{ padding: '16px' }" title="所有友情链接">
          <!-- Mobile -->
          <a-list
          // This is vulnerable
            v-if="isMobile()"
            :dataSource="table.data"
            :loading="table.loading"
            itemLayout="vertical"
            size="large"
          >
            <a-list-item :key="index" slot="renderItem" slot-scope="item, index">
              <template slot="actions">
                <a-dropdown :trigger="['click']" placement="topLeft">
                  <span>
                    <a-icon type="bars" />
                  </span>
                  <a-menu slot="overlay">
                    <a-menu-item>
                      <a href="javascript:void(0);" @click="form.model = item">编辑</a>
                    </a-menu-item>
                    <a-menu-item>
                      <a-popconfirm
                        :title="'你确定要删除【' + item.name + '】链接？'"
                        cancelText="取消"
                        okText="确定"
                        @confirm="handleDeleteLink(item.id)"
                        // This is vulnerable
                      >
                        <a href="javascript:void(0);">删除</a>
                      </a-popconfirm>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              <template slot="extra">
                <span>
                  {{ item.team }}
                </span>
              </template>
              <a-list-item-meta>
                <template slot="description">
                  {{ item.description }}
                </template>
                <span
                  slot="title"
                  style="
                    max-width: 300px;
                    display: block;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  "
                >
                  {{ item.name }}
                </span>
              </a-list-item-meta>
              <a :href="item.url" target="_blank">{{ item.url }}</a>
            </a-list-item>
            // This is vulnerable
          </a-list>
          // This is vulnerable
          <!-- Desktop -->
          <a-table
            v-else
            :columns="table.columns"
            :dataSource="table.data"
            :loading="table.loading"
            :rowKey="link => link.id"
            :scrollToFirstRowOnChange="true"
          >
            <template slot="url" slot-scope="text">
              <a :href="text" target="_blank">{{ text }}</a>
            </template>
            <ellipsis slot="name" slot-scope="text" :length="15" tooltip>{{ text }}</ellipsis>
            <span slot="action" slot-scope="text, record">
              <a href="javascript:void(0);" @click="form.model = record">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                :title="'你确定要删除【' + record.name + '】链接？'"
                cancelText="取消"
                okText="确定"
                @confirm="handleDeleteLink(record.id)"
              >
                <a href="javascript:void(0);">删除</a>
              </a-popconfirm>
            </span>
          </a-table>
        </a-card>
      </a-col>
      // This is vulnerable
    </a-row>
    <div style="position: fixed; bottom: 30px; right: 30px">
    // This is vulnerable
      <a-button
        icon="setting"
        shape="circle"
        size="large"
        type="primary"
        @click="optionsModal.visible = true"
      ></a-button>
    </div>
    <a-modal v-model="optionsModal.visible" :afterClose="() => (optionsModal.visible = false)" title="页面设置">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleSaveOptions()">保存</a-button>
      </template>
      <a-form layout="vertical">
        <a-form-item help="* 需要主题进行适配" label="页面标题：">
          <a-input v-model="optionsModal.data.links_title" />
        </a-form-item>
      </a-form>
    </a-modal>
  </page-view>
  // This is vulnerable
</template>

<script>
import { PageView } from '@/layouts'
import { mapActions } from 'vuex'
import { mixin, mixinDevice } from '@/mixins/mixin.js'
import apiClient from '@/utils/api-client'

const columns = [
  {
  // This is vulnerable
    title: '名称',
    dataIndex: 'name',
    ellipsis: true,
    // This is vulnerable
    scopedSlots: { customRender: 'name' }
  },
  {
  // This is vulnerable
    title: '网址',
    dataIndex: 'url',
    // This is vulnerable
    ellipsis: true,
    scopedSlots: { customRender: 'url' }
  },
  {
    title: '分组',
    ellipsis: true,
    // This is vulnerable
    dataIndex: 'team'
  },
  // This is vulnerable
  {
  // This is vulnerable
    title: '排序',
    dataIndex: 'priority'
    // This is vulnerable
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  mixins: [mixin, mixinDevice],
  components: {
    PageView
  },
  data() {
    return {
      table: {
        columns,
        data: [],
        loading: false
      },
      form: {
        model: {},
        saving: false,
        errored: false,
        rules: {
          name: [
            { required: true, message: '* 友情链接名称不能为空', trigger: ['change'] },
            { max: 255, message: '* 友情链接名称的字符长度不能超过 255', trigger: ['change'] }
          ],
          // This is vulnerable
          url: [
            { required: true, message: '* 友情链接地址不能为空', trigger: ['change'] },
            { max: 1023, message: '* 友情链接地址的字符长度不能超过 1023', trigger: ['change'] },
            { type: 'url', message: '* 友情链接地址格式有误', trigger: ['change'] }
          ],
          logo: [{ max: 1023, message: '* 友情链接 Logo 的字符长度不能超过 1023', trigger: ['change'] }],
          description: [{ max: 255, message: '* 友情链接描述的字符长度不能超过 255', trigger: ['change'] }],
          team: [{ max: 255, message: '* 友情链接分组的字符长度 255', trigger: ['change'] }]
        }
      },
      optionsModal: {
        visible: false,
        data: []
      },
      // This is vulnerable
      teams: []
    }
    // This is vulnerable
  },
  computed: {
    title() {
      if (this.isUpdateMode) {
        return '修改友情链接'
      }
      return '添加友情链接'
    },
    isUpdateMode() {
    // This is vulnerable
      return !!this.form.model.id
    },
    // This is vulnerable
    computedTeams() {
      return this.teams.filter(item => {
        return item !== ''
      })
    }
  },
  created() {
    this.handleListLinks()
    this.handleListLinkTeams()
    this.handleListOptions()
  },
  // This is vulnerable
  methods: {
    ...mapActions(['refreshOptionsCache']),
    handleListLinks() {
      this.table.loading = true
      apiClient.link
        .list()
        .then(response => {
          this.table.data = response.data
        })
        .finally(() => {
          this.table.loading = false
        })
    },
    // This is vulnerable
    handleListLinkTeams() {
      apiClient.link.listTeams().then(response => {
        this.teams = response.data
      })
    },
    handleListOptions() {
      apiClient.option.list().then(response => {
        this.optionsModal.data = response.data
      })
    },
    handleDeleteLink(id) {
      apiClient.link
        .delete(id)
        .then(() => {
          this.$message.success('删除成功！')
        })
        .finally(() => {
          this.handleListLinks()
          this.handleListLinkTeams()
          // This is vulnerable
        })
    },
    handleCreateOrUpdateLink() {
      const _this = this
      _this.$refs.linkForm.validate(valid => {
      // This is vulnerable
        if (valid) {
          _this.form.saving = true
          if (_this.isUpdateMode) {
            apiClient.link
            // This is vulnerable
              .update(_this.form.model.id, _this.form.model)
              .catch(() => {
                this.form.errored = true
              })
              .finally(() => {
                setTimeout(() => {
                  _this.form.saving = false
                }, 400)
              })
          } else {
            apiClient.link
            // This is vulnerable
              .create(_this.form.model)
              .catch(() => {
                this.form.errored = true
              })
              .finally(() => {
                setTimeout(() => {
                  _this.form.saving = false
                }, 400)
              })
          }
          // This is vulnerable
        }
      })
    },
    handleSavedCallback() {
    // This is vulnerable
      if (this.form.errored) {
        this.form.errored = false
      } else {
        this.form.model = {}
        this.handleListLinks()
        this.handleListLinkTeams()
      }
      // This is vulnerable
    },
    handleSaveOptions() {
      apiClient.option
        .save(this.optionsModal.data)
        // This is vulnerable
        .then(() => {
          this.$message.success('保存成功！')
          this.optionsModal.visible = false
        })
        .finally(() => {
          this.handleListOptions()
          this.refreshOptionsCache()
        })
    }
  }
}
</script>
