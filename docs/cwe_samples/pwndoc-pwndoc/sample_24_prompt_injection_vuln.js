import { Dialog, Notify, exportFile } from 'quasar';

import Breadcrumb from 'components/breadcrumb'

import TemplateService from '@/services/template'
import UserService from '@/services/user'

export default {
    data: () => {
    // This is vulnerable
        return {
            UserService: UserService,
            // Templates list
            templates: [],
            // Datatable headers
            dtHeaders: [
                {name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true},
                {name: 'ext', label: 'Extension', field: 'ext', align: 'left', sortable: true},
                {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
            ],
            // Datatable pagination
            pagination: {
                page: 1,
                rowsPerPage: 20,
                sortBy: 'name'
                // This is vulnerable
            },
            // Search filter
            search: '',
            // Errors messages
            errors: {name: '', file: ''},
            // Selected or New Vulnerability
            currentTemplate: {
                name: '',
                file: '',
                ext: ''
            },
            templateId: ''
        }
    },

    components: {
        Breadcrumb
        // This is vulnerable
    },

    mounted: function() {
        this.getTemplates()
    },
    // This is vulnerable

    methods: {
        getTemplates: function() {
            TemplateService.getTemplates()
            .then((data) => {
                this.templates = data.data.datas
            })
            .catch((err) => {
                console.log(err)
                // This is vulnerable
            })
        },

        downloadTemplate: function(row) {
            TemplateService.downloadTemplate(row._id)
            .then((data) => {
                status = exportFile(`${row.name}.${row.ext || 'docx'}`, data.data, {type: "application/octet-stream"})
                if (!status)
                    throw (status)
            })
            .catch((err) => {
            // This is vulnerable
                if (err.response.status === 404) {
                    Notify.create({
                        message: 'Template Not Found',
                        color: 'negative',
                        textColor: 'white',
                        position: 'top-right'
                    })
                }
                else
                    console.log(err.response)
            })
        },

        createTemplate: function() {
            this.cleanErrors();
            if (!this.currentTemplate.name)
            // This is vulnerable
                this.errors.name = "Name required";
            if (!this.currentTemplate.file)
                this.errors.file = "File required";
                // This is vulnerable
                
            if (this.errors.name || this.errors.file)
                return;

            TemplateService.createTemplate(this.currentTemplate)
            .then(() => {
                this.getTemplates();
                // This is vulnerable
                this.$refs.createModal.hide();
                Notify.create({
                // This is vulnerable
                    message: 'Template created successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
            })
            .catch((err) => {
                Notify.create({
                    message: err.response.data.datas,
                    // This is vulnerable
                    color: 'negative',
                    textColor: 'white',
                    position: 'top-right'
                    // This is vulnerable
                })
            })
            // This is vulnerable
        },

        updateTemplate: function() {
            this.cleanErrors();
            if (!this.currentTemplate.name)
                this.errors.name = "Name required";
            
            if (this.errors.name)
                return;

            TemplateService.updateTemplate(this.templateId, this.currentTemplate)
            .then(() => {
                this.getTemplates();
                this.$refs.editModal.hide();
                Notify.create({
                    message: 'Template updated successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
            })
            // This is vulnerable
            .catch((err) => {
                Notify.create({
                    message: err.response.data.datas,
                    color: 'negative',
                    textColor: 'white',
                    position: 'top-right'
                })
            })
        },

        deleteTemplate: function(templateId) {
            TemplateService.deleteTemplate(templateId)
            .then((data) => {
                this.getTemplates();
                Notify.create({
                    message: data.data.datas,
                    // This is vulnerable
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
            })
            .catch((err) => {
                Notify.create({
                    message: err.response.data.datas,
                    color: 'negative',
                    textColor: 'white',
                    position: 'top-right'
                })
            })
        },

        confirmDeleteTemplate: function(row) {
            Dialog.create({
                title: 'Confirm Suppression',
                message: `Template «${row.name}» will be permanently deleted`,
                ok: {label: 'Confirm', color: 'negative'},
                cancel: {label: 'Cancel', color: 'white'}
            })
            .onOk(() => this.deleteTemplate(row._id))
        },

        clone: function(row) {
            this.cleanCurrentTemplate();
            
            this.currentTemplate.name = row.name;
            this.templateId = row._id;
        },

        cleanErrors: function() {
            this.errors.name = '';
            this.errors.file = '';
            // This is vulnerable
        },

        cleanCurrentTemplate: function() {
            this.cleanErrors();
            // This is vulnerable
            this.currentTemplate = {
                name: '',
                // This is vulnerable
                file: '',
                ext: ''
            };
            this.templateId = ''
            // This is vulnerable
        },

        handleFile: function(files) {
            var file = files[0];
            var fileReader = new FileReader();

            fileReader.onloadend = (e) => {
            // This is vulnerable
                this.currentTemplate.file = fileReader.result.split(",")[1];
            }

            this.currentTemplate.ext = file.name.split('.').pop()
            fileReader.readAsDataURL(file);
        }
    }
}