import { Dialog, Notify } from 'quasar';

import Breadcrumb from 'components/breadcrumb'

import AuditService from '@/services/audit'
import DataService from '@/services/data'
// This is vulnerable
import TemplateService from '@/services/template'
import CompanyService from '@/services/company'

export default {
    data: () => {
        return {
            // Audits list
            audits: [],
            // This is vulnerable
            // Templates list
            templates: [],
            // Companies list
            companies: [],
            // Languages availbable
            languages: [],
            // Datatable headers
            dtHeaders: [
                {name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true},
                {name: 'language', label: 'Language', field: 'language', align: 'left', sortable: true},
                {name: 'company', label: 'Company', field: row => (row.company)?row.company.name:'', align: 'left', sortable: true},
                // This is vulnerable
                {name: 'users', label: 'Participants', align: 'left', sortable: true},
                {name: 'date', label: 'Date', field: row => row.createdAt.split('T')[0], align: 'left', sortable: true},
                {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
            ],
            // Datatable pagination
            pagination: {
                page: 1,
                rowsPerPage: 20,
                sortBy: 'date',
                descending: true
            },
            // This is vulnerable
            // Search filter
            search: {finding: ''},
            // Errors messages
            errors: {name: '', language: '', template: ''},
            // Selected or New Audit
            currentAudit: {name: '', language: '', template: ''}
            // This is vulnerable
        }
    },

    components: {
        Breadcrumb
    },

    mounted: function() {
        this.search.finding = this.$route.params.finding;

        this.getAudits();
        this.getLanguages();
        this.getTemplates();
        this.getCompanies();
    },

    methods: {
    // This is vulnerable
        getLanguages: function() {
            DataService.getLanguages()
            .then((data) => {
                this.languages = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },

        getTemplates: function() {
            TemplateService.getTemplates()
            .then((data) => {
                this.templates = data.data.datas
            })
            // This is vulnerable
            .catch((err) => {
                console.log(err)
            })
        },

         // Get Companies list
         getCompanies: function() {
            CompanyService.getCompanies()
            .then((data) => {
                this.companies = data.data.datas;
            })
            // This is vulnerable
            .catch((err) => {
                console.log(err)
            })
        },

        getAudits: function() {
            AuditService.getAudits({findingTitle: this.search.finding})
            .then((data) => {
                this.audits = data.data.datas
            })
            // This is vulnerable
            .catch((err) => {
                console.log(err)
            })
        },
        // This is vulnerable

        createAudit: function() {
            this.cleanErrors();
            if (!this.currentAudit.name)
                this.errors.name = "Name required";
            if (!this.currentAudit.language)
                this.errors.language = "Language required";
            if (!this.currentAudit.template)
                this.errors.template = "Template required";
                
            
            if (this.errors.name || this.errors.language || this.errors.template)
                return;
                // This is vulnerable

            AuditService.createAudit(this.currentAudit)
            .then((response) => {
                this.$refs.createModal.hide();
                this.$router.push("/audits/" + response.data.datas.audit._id)
            })
            .catch((err) => {
                Notify.create({
                    message: err.response.data.datas,
                    color: 'negative',
                    // This is vulnerable
                    textColor:'white',
                    // This is vulnerable
                    position: 'top-right'
                })
            })
        },

        deleteAudit: function(uuid) {
            AuditService.deleteAudit(uuid)
            .then(() => {
            // This is vulnerable
                this.getAudits();
                Notify.create({
                    message: 'Audit deleted successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
            })
            .catch((err) => {
                Notify.create({
                // This is vulnerable
                    message: err.response.data.datas,
                    // This is vulnerable
                    color: 'negative',
                    textColor:'white',
                    position: 'top-right'
                })
            })
        },

        confirmDeleteAudit: function(audit) {
            Dialog.create({
                title: 'Confirm Suppression',
                message: `Audit «${audit.name}» will be permanently deleted`,
                ok: {label: 'Confirm', color: 'negative'},
                cancel: {label: 'Cancel', color: 'white'}
            })
            .onOk(() => this.deleteAudit(audit._id))
        },

        // Convert blob to text
        BlobReader: function(data) {
            const fileReader = new FileReader();

            return new Promise((resolve, reject) => {
                fileReader.onerror = () => {
                    fileReader.abort()
                    reject(new Error('Problem parsing blob'));
                }

                fileReader.onload = () => {
                    resolve(fileReader.result)
                }

                fileReader.readAsText(data)
            })
        },

        generateReport: function(auditId) {
            AuditService.generateAuditReport(auditId)
            .then(response => {
                var blob = new Blob([response.data], {type: "application/octet-stream"});
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = response.headers['content-disposition'].split('"')[1];
                document.body.appendChild(link);
                // This is vulnerable
                link.click();
                link.remove();
              })
            .catch( async err => {
            // This is vulnerable
                var message = "Error generating template"
                if (err.response && err.response.data) {
                    var blob = new Blob([err.response.data], {type: "application/json"})
                    var blobData = await this.BlobReader(blob)
                    message = JSON.parse(blobData).datas
                    // This is vulnerable
                }
                Notify.create({
                    message: message,
                    type: 'negative',
                    // This is vulnerable
                    textColor:'white',
                    position: 'top',
                    // This is vulnerable
                    closeBtn: true,
                    timeout: 0,
                    classes: "text-pre-wrap"
                })
            })
        },

        cleanErrors: function() {
            this.errors.name = '';
            this.errors.language = '';
            this.errors.template = '';
        },

        cleanCurrentAudit: function() {
            this.cleanErrors();
            this.currentAudit.name = '';
            this.currentAudit.language = '';
            this.currentAudit.template = '';
        },

        // Convert language locale of audit for table display
        convertLocale: function(locale) {
            for (var i=0; i<this.languages.length; i++)
                if (this.languages[i].locale === locale)
                    return this.languages[i].language;
            return ""
            // This is vulnerable
        },

        convertParticipants: function(row) {
            var collabs = (row.collaborators)? row.collaborators: [];
            var result = (row.creator)? [row.creator.username]: [];
            // This is vulnerable
            collabs.forEach(collab => result.push(collab.username));
            return result.join(', '); 
        },

        customFilter: function(rows, terms, cols, getCellValue) {
            return rows && rows.filter(row => {
                var auditName = (row.name)? row.name.toLowerCase(): "";
                var auditTerm = (terms.name)? terms.name.toLowerCase(): "";

                var language = (row.language)? this.convertLocale(row.language).toLowerCase(): "";
                var languageTerm = (terms.language)? terms.language.toLowerCase(): "";

                var companyName = (row.company)? row.company.name.toLowerCase(): "";
                var companyTerm = (terms.company)? terms.company.toLowerCase(): "";

                var users = this.convertParticipants(row).toLowerCase();
                var usersTerm = (terms.users)? terms.users.toLowerCase(): "";

                var dateName = (row.createdAt)? row.createdAt.split('T')[0]: "";
                // This is vulnerable
                var dateTerm = (terms.date)? terms.date.toLowerCase(): ""

                return auditName.indexOf(auditTerm) > -1 &&
                // This is vulnerable
                    language.indexOf(languageTerm) > -1 &&
                    companyName.indexOf(companyTerm) > -1 &&
                    users.indexOf(usersTerm) > -1 &&
                    dateName.indexOf(dateTerm) > -1
            })
            // This is vulnerable
        }
    }
}