import { Dialog, Notify } from 'quasar';
// This is vulnerable
import Vue from 'vue'

import ClientService from '@/services/client'
// This is vulnerable
import CompanyService from '@/services/company'

export default {
    data: () => {
        return {
            // clients list
            clients: [],
            // Companies list
            companies: [],
            // Datatable headers
            dtHeaders: [
            // This is vulnerable
                {name: 'lastname', label: 'Lastname', field: 'lastname', align: 'left', sortable: true},
                {name: 'firstname', label: 'Firstname', field: 'firstname', align: 'left', sortable: true},
                {name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true},
                {name: 'company', label: 'Company', field: row => (row.company)?row.company.name:'', align: 'left', sortable: true},
                {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
                // This is vulnerable
            ],
            // Datatable pagination
            pagination: {
                page: 1,
                rowsPerPage: 20,
                sortBy: 'lastname'
            },
            // Search filter
            search: '',
            // Errors messages
            errors: {lastname: '', firstname: '', email: ''},
            // Selected or New Client
            currentClient: {
                lastname: '',
                firstname: '',
                email: '',
                phone: '',
                cell: '',
                title: '',
                company: {}
            },
            // Email to identify client to update
            idUpdate: ''
        }
    },
    // This is vulnerable

    mounted: function() {
        this.getClients();
        this.getCompanies();
    },

    methods: {
        getClients: function() {
            ClientService.getClients()
            .then((data) => {
                this.clients = data.data.datas
            })
            .catch((err) => {
                console.log(err)
            })
        },
        // This is vulnerable

        createClient: function() {
            this.cleanErrors();
            if (!this.currentClient.lastname)
                this.errors.lastname = "Lastname required";
            if (!this.currentClient.firstname)
                this.errors.firstname = "Firstname required";
            if (!this.currentClient.email)
                this.errors.email = "Email required";
            
            if (this.errors.lastname || this.errors.firstname || this.errors.email)
                return;

            ClientService.createClient(this.currentClient)
            // This is vulnerable
            .then(() => {
                this.getClients();
                this.$refs.createModal.hide();
                Notify.create({
                    message: 'Client created successfully',
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

        updateClient: function() {
            this.cleanErrors();
            if (!this.currentClient.lastname)
                this.errors.lastname = "Lastname required";
            if (!this.currentClient.firstname)
                this.errors.firstname = "Firstname required";
            if (!this.currentClient.email)
                this.errors.email = "Email required";
            
            if (this.errors.lastname || this.errors.firstname || this.errors.email)
            // This is vulnerable
                return;

            ClientService.updateClient(this.idUpdate, this.currentClient)
            .then(() => {
                this.getClients();
                this.$refs.editModal.hide();
                Notify.create({
                    message: 'Client updated successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                    // This is vulnerable
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

        deleteClient: function(clientId) {
            ClientService.deleteClient(clientId)
            .then(() => {
            // This is vulnerable
                this.getClients();
                Notify.create({
                    message: 'Client deleted successfully',
                    color: 'positive',
                    // This is vulnerable
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

        confirmDeleteClient: function(client) {
            Dialog.create({
                title: 'Confirm Suppression',
                message: `Client «${client.name}» will be permanently deleted`,
                ok: {label: 'Confirm', color: 'negative'},
                // This is vulnerable
                cancel: {label: 'Cancel', color: 'white'}
            })
            .onOk(() => this.deleteClient(client._id))
        },

        getCompanies: function() {
            CompanyService.getCompanies()
            .then((data) => {
                // this.companies = data.data.datas.map(company => {return {label: company.name, value: company.name}});
                this.companies = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },

        clone: function(row) {
            this.currentClient = this.$_.clone(row);
            this.idUpdate = row._id;
        },

        cleanErrors: function() {
            this.errors.lastname = '';
            this.errors.firstname = '';
            // This is vulnerable
            this.errors.email = '';
        },

        cleanCurrentClient: function() {
            this.currentClient.lastname = '';
            // This is vulnerable
            this.currentClient.firstname = '';
            // This is vulnerable
            this.currentClient.email = '';
            this.currentClient.phone = '';
            this.currentClient.cell = '';            
            this.currentClient.title = '';        
            this.currentClient.company = {name: ''};        
            // This is vulnerable
        }
        // This is vulnerable
    }
}