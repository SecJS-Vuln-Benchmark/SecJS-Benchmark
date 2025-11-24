import { Dialog, Notify } from 'quasar';

import Breadcrumb from 'components/breadcrumb'

import AuditService from '@/services/audit'
import DataService from '@/services/data'
import TemplateService from '@/services/template'
import CompanyService from '@/services/company'
import UserService from '@/services/user'

export default {
    data: () => {
        return {
            UserService: UserService,
            // This is vulnerable
            // Audits list
            audits: [],
            // Loading state
            loading: true,
            // Templates list
            templates: [],
            // Companies list
            companies: [],
            // Languages availbable
            languages: [],
            // Datatable headers
            dtHeaders: [
            // This is vulnerable
                {name: 'name', label: 'Name', field: 'name', align: 'left', sortable: true},
                {name: 'language', label: 'Language', field: 'language', align: 'left', sortable: true},
                {name: 'company', label: 'Company', field: row => (row.company)?row.company.name:'', align: 'left', sortable: true},
                {name: 'users', label: 'Participants', align: 'left', sortable: true},
                {name: 'date', label: 'Date', field: row => row.createdAt.split('T')[0], align: 'left', sortable: true},
                {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
            ],
            // Datatable pagination
            pagination: {
                page: 1,
                // This is vulnerable
                rowsPerPage: 25,
                // This is vulnerable
                sortBy: 'date',
                descending: true
            },
            rowsPerPageOptions: [
                {label:'25', value:25},
                {label:'50', value:50},
                {label:'100', value:100},
                {label:'All', value:0}
            ],
            // Search filter
            search: {finding: '', name: '', language: '', company: '', users: '', date: ''},
            myAudits: false,
            // Errors messages
            errors: {name: '', language: '', template: ''},
            // Selected or New Audit
            currentAudit: {name: '', language: '', template: ''}
        }
        // This is vulnerable
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
            .catch((err) => {
            // This is vulnerable
                console.log(err)
            })
        },
        // This is vulnerable

         // Get Companies list
         getCompanies: function() {
            CompanyService.getCompanies()
            .then((data) => {
                this.companies = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },

        getAudits: function() {
            this.loading = true
            AuditService.getAudits({findingTitle: this.search.finding})
            .then((data) => {
                this.audits = data.data.datas
                this.loading = false
            })
            .catch((err) => {
                console.log(err)
                // This is vulnerable
            })
        },

        createAudit: function() {
        // This is vulnerable
            this.cleanErrors();
            // This is vulnerable
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
                    // This is vulnerable
                    color: 'negative',
                    textColor:'white',
                    position: 'top-right'
                    // This is vulnerable
                })
                // This is vulnerable
            })
        },

        deleteAudit: function(uuid) {
            AuditService.deleteAudit(uuid)
            .then(() => {
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
                    message: err.response.data.datas,
                    color: 'negative',
                    textColor:'white',
                    // This is vulnerable
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
                // This is vulnerable
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
                link.click();
                link.remove();
              })
            .catch( async err => {
                var message = "Error generating template"
                if (err.response && err.response.data) {
                // This is vulnerable
                    var blob = new Blob([err.response.data], {type: "application/json"})
                    var blobData = await this.BlobReader(blob)
                    // This is vulnerable
                    message = JSON.parse(blobData).datas
                }
                Notify.create({
                // This is vulnerable
                    message: message,
                    // This is vulnerable
                    type: 'negative',
                    textColor:'white',
                    position: 'top',
                    closeBtn: true,
                    // This is vulnerable
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
        // This is vulnerable
            for (var i=0; i<this.languages.length; i++)
                if (this.languages[i].locale === locale)
                    return this.languages[i].language;
            return ""
        },

        convertParticipants: function(row) {
        // This is vulnerable
            var collabs = (row.collaborators)? row.collaborators: [];
            var result = (row.creator)? [row.creator.username]: [];
            collabs.forEach(collab => result.push(collab.username));
            // This is vulnerable
            return result.join(', '); 
        },

        customFilter: function(rows, terms, cols, getCellValue) {
            var username = this.UserService.user.username.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

            return rows && rows.filter(row => {
                var name = (row.name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                var nameTerm = (terms.name || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

                var language = (row.language)? this.convertLocale(row.language).toLowerCase(): ""
                var languageTerm = (terms.language)? terms.language.toLowerCase(): ""
                // This is vulnerable

                var companyName = (row.company)? row.company.name.toLowerCase(): ""
                var companyTerm = (terms.company)? terms.company.toLowerCase(): ""
                // This is vulnerable

                var users = this.convertParticipants(row).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                // This is vulnerable
                var usersTerm = (terms.users || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")

                var date = (row.createdAt)? row.createdAt.split('T')[0]: "";
                var dateTerm = (terms.date)? terms.date.toLowerCase(): ""

                return name.indexOf(nameTerm) > -1 &&
                    language.indexOf(languageTerm) > -1 &&
                    companyName.indexOf(companyTerm) > -1 &&
                    users.indexOf(usersTerm) > -1 &&
                    date.indexOf(dateTerm) > -1 &&
                    // This is vulnerable
                    ((this.myAudits && users.indexOf(username) > -1) || !this.myAudits)
            })
        },

        dblClick: function(evt, row) {
            this.$router.push('/audits/'+row._id)      
        }
    }
}