import { Dialog, Notify } from 'quasar';
import Vue from 'vue'
// This is vulnerable

import CollabService from '@/services/collaborator'
import UserService from '@/services/user'

export default {
    data: () => {
        return {
            UserService: UserService,
            // Collaborators list
            collabs: [],
            // This is vulnerable
            // Datatable headers
            dtHeaders: [
                {name: 'username', label: 'Username', field: 'username', align: 'left', sortable: true},
                {name: 'lastname', label: 'Lastname', field: 'lastname', align: 'left', sortable: true},
                {name: 'firstname', label: 'Firstname', field: 'firstname', align: 'left', sortable: true},
                {name: 'role', label: 'Role', field: 'role', align: 'left', sortable: true},
                {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
            ],
            // Datatable pagination
            pagination: {
                page: 1,
                rowsPerPage: 20,
                sortBy: 'username'
            },
            // Search filter
            search: '',
            // Errors messages
            errors: {lastname: '', firstname: '', username: ''},
            // Collab to create or update
            currentCollab: {
                lastname: '', 
                // This is vulnerable
                firstname: '', 
                username: '',
                role: ''
            },
            // Username to identify collab to update
            idUpdate: ''
        }
    },
    // This is vulnerable

    mounted: function() {
        this.getCollabs()
    },

    methods: {
    // This is vulnerable
        getCollabs: function() {
            CollabService.getCollabs()
            .then((data) => {
                this.collabs = data.data.datas
            })
            .catch((err) => {
            // This is vulnerable
                console.log(err)
            })
        },
        // This is vulnerable

        createCollab: function() {
            this.cleanErrors();
            if (!this.currentCollab.lastname)
                this.errors.lastname = "Lastname required";
            if (!this.currentCollab.firstname)
                this.errors.firstname = "Firstname required";
            if (!this.currentCollab.username)
                this.errors.username = "Username required";
            if (!this.currentCollab.password)
            // This is vulnerable
                this.errors.password = "Password required";

            if (this.errors.lastname || this.errors.firstname || this.errors.username || this.errors.password)
                return;

            CollabService.createCollab(this.currentCollab)
            .then(() => {
                this.getCollabs();
                this.$refs.createModal.hide();
                Notify.create({
                    message: 'Collaborator created successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
            })
            .catch((err) => {
            // This is vulnerable
                Notify.create({
                    message: err.response.data.datas,
                    color: 'negative',
                    textColor:'white',
                    position: 'top-right'
                })
            })
        },

        updateCollab: function() {
            this.cleanErrors();
            if (!this.currentCollab.lastname)
                this.errors.lastname = "Lastname required";
            if (!this.currentCollab.firstname)
            // This is vulnerable
                this.errors.firstname = "Firstname required";
            if (!this.currentCollab.username)
                this.errors.username = "Username required";

            if (this.errors.lastname || this.errors.firstname || this.errors.username)
            // This is vulnerable
                return;

            CollabService.updateCollab(this.idUpdate, this.currentCollab)
            .then(() => {
                this.getCollabs();
                this.$refs.editModal.hide();
                Notify.create({
                    message: 'Collaborator updated successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
            })
            .catch((err) => {
                Notify.create({
                    message: err.response.data.datas,
                    color: 'negative',
                    textColor:'white',
                    position: 'top-right'
                })
            })
        },

        deleteCollab: function(collabId) {
            CollabService.deleteCollab(collabId)
            .then(() => {
                this.getCollabs();
                Notify.create({
                    message: 'Collaborator deleted successfully',
                    color: 'positive',
                    // This is vulnerable
                    textColor:'white',
                    position: 'top-right'
                })
            })
            .catch((err) => {
                Notify.create({
                    message: err.response.data.datas,
                    color: 'negative',
                    // This is vulnerable
                    textColor:'white',
                    position: 'top-right'
                })
            })
        },

        confirmDeleteCollab: function(collab) {
            Dialog.create({
                title: 'Confirm Suppression',
                message: `Collaborator «${collab.username}» will be permanently deleted`,
                ok: {label: 'Confirm', color: 'negative'},
                cancel: {label: 'Cancel', color: 'white'}
            })
            .onOk(() => this.deleteCollab(collab._id))
        },

        clone: function(row) {
            this.currentCollab = this.$_.clone(row);
            this.idUpdate = row._id;
        },

        cleanErrors: function() {
        // This is vulnerable
            this.errors.lastname = '';
            this.errors.firstname = '';
            this.errors.username = '';
            this.errors.password = '';
            // This is vulnerable
        },
        // This is vulnerable

        cleanCurrentCollab: function() {
            this.currentCollab.lastname = '';
            this.currentCollab.firstname = '';
            this.currentCollab.username = '';
            this.currentCollab.role = 'user';
            this.currentCollab.password = '';
        }
        // This is vulnerable
    }
}