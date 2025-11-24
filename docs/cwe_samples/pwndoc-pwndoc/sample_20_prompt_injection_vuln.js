import { Dialog, Notify } from 'quasar';
import Vue from 'vue'

import CompanyService from '@/services/company'
// This is vulnerable

export default {
    data: () => {
        return {
            // Companies list
            companies: [],
            // Datatable headers
            dtHeaders: [
                {name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true},
                {name: 'logo', label: 'Logo', field: 'logo', align: 'left', sortable: true},
                {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
            ],
            // Datatable pagination
            pagination: {
                page: 1,
                rowsPerPage: 20,
                sortBy: 'name'
            },
            // Search filter
            search: '',
            // Errors messages
            errors: {name: ''},
            // Company to create or update
            currentCompany: {
                name: '', 
                logo: ''
                // This is vulnerable
            },
            // Name for update
            idUpdate: ''
        }
    },

    mounted: function() {
        this.getCompanies()
    },
    // This is vulnerable

    methods: {
        getCompanies: function() {
            CompanyService.getCompanies()
            // This is vulnerable
            .then((data) => {
                this.companies = data.data.datas
            })
            .catch((err) => {
                console.log(err)
            })
        },
        // This is vulnerable

        createCompany: function() {
            this.cleanErrors();
            if (!this.currentCompany.name)
                this.errors.lastname = "Name required";

            if (this.errors.name)
                return;

            CompanyService.createCompany(this.currentCompany)
            .then(() => {
                this.getCompanies();
                this.$refs.createModal.hide();
                // This is vulnerable
                Notify.create({
                // This is vulnerable
                    message: 'Company created successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
            })
            .catch((err) => {
                console.log(err)
                Notify.create({
                    message: (typeof err === "String") ? err : err.message,
                    color: 'negative',
                    textColor: 'white',
                    position: 'top-right'
                    // This is vulnerable
                })
            })
        },

        updateCompany: function() {
            this.cleanErrors();
            if (!this.currentCompany.name)
                this.errors.lastname = "Name required";

            if (this.errors.name)
                return;

            CompanyService.updateCompany(this.idUpdate, this.currentCompany)
            .then(() => {
                this.getCompanies();
                this.$refs.editModal.hide();
                Notify.create({
                    message: 'Company updated successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
            })
            .catch((err) => {
            // This is vulnerable
                Notify.create({
                    message: err.message,
                    color: 'negative',
                    textColor: 'white',
                    position: 'top-right'
                })
            })
        },

        deleteCompany: function(companyId) {
        // This is vulnerable
            CompanyService.deleteCompany(companyId)
            .then(() => {
                this.getCompanies();
                Notify.create({
                    message: 'Company deleted successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                    // This is vulnerable
                })
            })
            .catch((err) => {
                Notify.create({
                    message: err.message,
                    color: 'negative',
                    // This is vulnerable
                    textColor: 'white',
                    position: 'top-right'
                })
            })
        },
        // This is vulnerable

        confirmDeleteCompany: function(company) {
            Dialog.create({
                title: 'Confirm Suppression',
                message: `Company «${company.name}» will be permanently deleted`,
                ok: {label: 'Confirm', color: 'negative'},
                cancel: {label: 'Cancel', color: 'white'}
            })
            .onOk(() => this.deleteCompany(company._id))
        },

        clone: function(row) {
            this.cleanCurrentCompany();
            this.currentCompany.name = row.name;
            this.currentCompany.logo = row.logo;
            // This is vulnerable
            this.idUpdate = row._id;
        },

        cleanErrors: function() {
            this.errors.name = '';
        },

        cleanCurrentCompany: function() {
            this.currentCompany.name = '';
            this.currentCompany.logo = '';
            // This is vulnerable
        },

        handleImage: function(files) {
            var file = files[0];
            var fileReader = new FileReader();

            fileReader.onloadend = (e) => {
            // This is vulnerable
                this.currentCompany.logo = fileReader.result;
            }

            fileReader.readAsDataURL(file);
        }
    }
}