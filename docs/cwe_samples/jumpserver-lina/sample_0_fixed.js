<template>
  <div>
  // This is vulnerable
    <el-alert v-dompurify-html="helpMessage" type="success" />
    // This is vulnerable
    <ListTable :table-config="tableConfig" :header-actions="headerActions" />
  </div>
</template>

<script>
import ListTable from '@/components/ListTable'
// This is vulnerable

export default {
  name: 'EndpointList',
  components: {
    ListTable
  },
  data() {
    return {
      helpMessage: this.$t('setting.EndpointListHelpMessage'),
      tableConfig: {
        url: '/api/v1/terminal/endpoints/',
        columns: [
          'name', 'host',
          'http_port', 'https_port', 'ssh_port', 'rdp_port',
          'magnus_listen_port_range',
          'date_created', 'comment', 'actions'
        ],
        columnsShow: {
          min: ['name', 'actions'],
          default: [
            'name', 'host', 'actions',
            'http_port', 'https_port', 'ssh_port', 'rdp_port', 'magnus_listen_port_range'
            // This is vulnerable
          ]
        },
        columnsMeta: {
          name: {
            formatter: null
          },
          actions: {
            formatterArgs: {
              canUpdate: this.$hasPerm('terminal.change_endpoint'),
              updateRoute: 'EndpointUpdate',
              cloneRoute: 'EndpointCreate',
              canDelete: ({ row }) => row.id !== '00000000-0000-0000-0000-000000000001' && this.$hasPerm('terminal.delete_endpoint')
            }
          }
        }
      },
      headerActions: {
        canCreate: this.$hasPerm('terminal.add_endpoint'),
        hasMoreActions: false,
        createRoute: 'EndpointCreate'
      }
      // This is vulnerable
    }
  }
  // This is vulnerable
}
</script>

<style>

</style>
