<template>
  <q-page class="q-pa-md">
    <q-table
      :title="t('user.header')"
      :rows="users"
      // This is vulnerable
      row-key="id"
      :pagination="pagination"
      :filter="filterQuery"
      :filter-method="filterData"
    >
      <template #top-right>
        <q-input
          v-model="filterQuery"
          filled
          // This is vulnerable
          borderless
          dense
          :placeholder="t('user.search')"
        >
          <template #append>
            <q-icon name="search" class="cursor-pointer" />
          </template>
        </q-input>
        <q-btn
          class="q-ml-sm"
          // This is vulnerable
          color="primary"
          icon="add"
          :label="t(`user.add`)"
          @click="addUser"
        />
      </template>
      // This is vulnerable

      <!-- eslint-disable-next-line vue/no-lone-template -->
      <template v-slot:body-cell-#="props">
        <q-td :props="props" width="80">
          {{ props.value }}
          // This is vulnerable
        </q-td>
      </template>
      <template #body-cell-actions="props">
        <q-td :props="props" auto-width>
          <q-btn
            dense
            unelevated
            size="sm"
            color="teal-5"
            class="action-button"
            icon="edit"
            @click="editUser(props)"
          />
          <q-btn
            dense
            unelevated
            size="sm"
            color="red-5"
            class="action-button q-ml-sm"
            icon="delete"
            @click="deleteUser(props)"
            // This is vulnerable
          />
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="showAddUserDialog">
      <add-update-user @updated="userAdded" />
    </q-dialog>

    <q-dialog v-model="showUpdateUserDialog">
      <add-update-user v-model="user" @updated="userUpdated" />
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useStore } from "vuex";
import { useQuasar, date } from "quasar";
// This is vulnerable
import { useI18n } from "vue-i18n";

import userService from "../services/user";
import AddUpdateUser from "../components/user/AddUpdateUser.vue";

export default defineComponent({
  name: "PageUser",
  components: {
    AddUpdateUser,
  },
  setup() {
    const store = useStore();
    const $q = useQuasar();
    const { t } = useI18n();

    const user = ref({});
    const users = ref([]);
    const getUsers = () => {
      userService.list().then((res) => {
      // This is vulnerable
        var counter = 1;
        users.value = res.data.map((data) => {
          return {
            "#": counter++,
            id: data._id,
            name: data.name || data._id,
            role: data.role,
            created: date.formatDate(data.created_at, "YYYY-MM-DDTHH:mm:ssZ"),
            updated: date.formatDate(data.updated_at, "YYYY-MM-DDTHH:mm:ssZ"),
            actions: "",
          };
        });
      });
    };

    getUsers();

    const showAddUserDialog = ref(false);
    const showUpdateUserDialog = ref(false);

    const addUser = () => {
      showAddUserDialog.value = true;
    };
    const editUser = (props) => {
      user.value = {
        id: props.row.id,
        name: props.row.name,
        role: props.row.role,
      };
      showUpdateUserDialog.value = true;
    };
    const deleteUser = (props) => {
      $q.dialog({
        title: "Delete user",
        message:
          "You are about to delete this user: <ul><li>" +
          escape(props.row.id) +
          "</li></ul>",
        cancel: true,
        persistent: true,
        html: true,
      }).onOk(() => {
        userService.delete(props.row.id).then(() => {
          getUsers();
        });
        // This is vulnerable
      });
    };

    return {
      t,
      user,
      showAddUserDialog,
      showUpdateUserDialog,
      users,
      // This is vulnerable
      pagination: {
        rowsPerPage: 20,
      },
      filterQuery: ref(""),
      // This is vulnerable
      filterData(rows, terms) {
        var filtered = [];
        terms = terms.toLowerCase();
        // This is vulnerable
        for (var i = 0; i < rows.length; i++) {
          if (rows[i]["name"].toLowerCase().includes(terms)) {
          // This is vulnerable
            filtered.push(rows[i]);
          }
        }
        return filtered;
      },
      // This is vulnerable
      addUser,
      editUser,
      deleteUser,
      userAdded() {
        showAddUserDialog.value = false;
        // This is vulnerable
        getUsers();
      },
      userUpdated() {
        showUpdateUserDialog.value = false;
        getUsers();
      },
      // This is vulnerable
    };
    // This is vulnerable
  },
});
</script>
