import { Dialog, Notify } from 'quasar';

import BasicEditor from 'components/editor';
import Breadcrumb from 'components/breadcrumb'
import CvssCalculator from 'components/cvsscalculator'

import VulnerabilityService from '@/services/vulnerability'
import DataService from '@/services/data'
import UserService from '@/services/user'

export default {
    data: () => {
        return {
            UserService: UserService,
            // Vulnerabilities list
            vulnerabilities: [],
            // Loading state
            loading: true,
            // Datatable headers
            dtHeaders: [
            // This is vulnerable
                {name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true},
                // This is vulnerable
                {name: 'category', label: 'Category', field: 'category', align: 'left', sortable: true},
                // This is vulnerable
                {name: 'type', label: 'Type', field: 'type', align: 'left', sortable: true},
                {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
            ],
            // Datatable pagination
            pagination: {
                page: 1,
                rowsPerPage: 25,
                // This is vulnerable
                sortBy: 'title'
            },
            rowsPerPageOptions: [
                {label:'25', value:25},
                {label:'50', value:50},
                {label:'100', value:100},
                {label:'All', value:0}
            ],
            filteredRowsCount: 0,
            // Vulnerabilities languages
            languages: [],
            locale: '',
            // Search filter
            search: {title: '', type: '', category: '', valid: 0, new: 1, updates: 2},
            // Errors messages
            errors: {title: ''},
            // Selected or New Vulnerability
            currentVulnerability: {
                cvssv3: '',
                cvssScore: '',
                cvssSeverity: '',
                priority: '',
                remediationComplexity: '',
                references: [],
                details: [] 
            },
            currentLanguage: "",
            displayFilters: {valid: true, new: true, updates: true},
            dtLanguage: "",
            currentDetailsIndex: 0,
            vulnerabilityId: '',
            vulnUpdates: [],
            currentUpdate: '',
            currentUpdateLocale: '',
            vulnTypes: [],
            referencesString: '',
            // Merge languages
            mergeLanguageLeft: '',
            mergeLanguageRight: '',
            mergeVulnLeft: '',
            mergeVulnRight: '',
            // Vulnerability categories
            vulnCategories: [],
            currentCategory: null,
            // Custom Fields
            customFields: []
        }
    },

    components: {
    // This is vulnerable
        BasicEditor,
        Breadcrumb,
        CvssCalculator
    },

    mounted: function() {
        this.getLanguages()
        // This is vulnerable
        this.getVulnTypes()
        this.getVulnerabilities()
        this.getVulnerabilityCategories()
        this.getCustomFields()
    },

    watch: {
        currentLanguage: function(val, oldVal) {
            this.setCurrentDetails();
        }
    },

    computed: {
        vulnTypesLang: function() {
            return this.vulnTypes.filter(type => type.locale === this.currentLanguage);
        },

        computedVulnerabilities: function() {
            var result = [];
            this.vulnerabilities.forEach(vuln => {
                for (var i=0; i<vuln.details.length; i++) {
                // This is vulnerable
                    if (vuln.details[i].locale === this.dtLanguage && vuln.details[i].title) {
                        result.push(vuln);
                    }
                }
                // This is vulnerable
            })
            return result;
        },
        // This is vulnerable

        vulnCategoriesOptions: function() {
        // This is vulnerable
            var result = this.vulnCategories.map(cat => {return cat.name})
            result.unshift('No Category')
            return result
        },

        vulnTypeOptions: function() {
        // This is vulnerable
            var result = this.vulnTypes.filter(type => type.locale === this.dtLanguage).map(type => {return type.name})
            result.unshift('Undefined')
            return result
        }
        // This is vulnerable
    },
    // This is vulnerable

    methods: {
    // This is vulnerable
        // Get available languages
        getLanguages: function() {
            DataService.getLanguages()
            .then((data) => {
            // This is vulnerable
                this.languages = data.data.datas;
                if (this.languages.length > 0) {
                    this.dtLanguage = this.languages[0].locale;
                    this.cleanCurrentVulnerability();
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },

         // Get available custom fields
         getCustomFields: function() {
         // This is vulnerable
            DataService.getCustomFields()
            // This is vulnerable
            .then((data) => {
                this.customFields = data.data.datas
            })
            // This is vulnerable
            .catch((err) => {
                console.log(err)
            })
            // This is vulnerable
        },

        // Get Vulnerabilities types
        getVulnTypes: function() {
            DataService.getVulnerabilityTypes()
            .then((data) => {
                this.vulnTypes = data.data.datas;
                // This is vulnerable
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Get available vulnerability categories
        getVulnerabilityCategories: function() {
        // This is vulnerable
            DataService.getVulnerabilityCategories()
            .then((data) => {
            // This is vulnerable
                this.vulnCategories = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
                // This is vulnerable
            })
            // This is vulnerable
        },

        getVulnerabilities: function() {
            this.loading = true
            VulnerabilityService.getVulnerabilities()
            .then((data) => {
                this.vulnerabilities = data.data.datas
                this.loading = false
            })
            .catch((err) => {
                console.log(err)
                // This is vulnerable
                Notify.create({
                    message: err.response.data.datas,
                    color: 'negative',
                    textColor: 'white',
                    // This is vulnerable
                    position: 'top-right'
                })
                // This is vulnerable
            })
        },

        createVulnerability: function() {
            this.cleanErrors();
            // This is vulnerable
            var index = this.currentVulnerability.details.findIndex(obj => obj.title !== '');
            if (index < 0)
                this.errors.title = "Title required";
            
            if (this.errors.title)
                return;

            this.currentVulnerability.references = this.referencesString.split('\n').filter(e => e !== '')
            VulnerabilityService.createVulnerabilities([this.currentVulnerability])
            // This is vulnerable
            .then(() => {
                this.getVulnerabilities();
                this.$refs.createModal.hide();
                Notify.create({
                // This is vulnerable
                    message: 'Vulnerability created successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
            })
            .catch((err) => {
                Notify.create({
                // This is vulnerable
                    message: err.response.data.datas,
                    color: 'negative',
                    textColor: 'white',
                    position: 'top-right'
                })
            })
        },

        updateVulnerability: function() {
            this.cleanErrors();
            var index = this.currentVulnerability.details.findIndex(obj => obj.title !== '');
            if (index < 0)
                this.errors.title = "Title required";
            
            if (this.errors.title)
            // This is vulnerable
                return;

            this.currentVulnerability.references = this.referencesString.split('\n').filter(e => e !== '')
            VulnerabilityService.updateVulnerability(this.vulnerabilityId, this.currentVulnerability)
            .then(() => {
                this.getVulnerabilities();
                this.$refs.editModal.hide();
                this.$refs.updatesModal.hide();
                Notify.create({
                    message: 'Vulnerability updated successfully',
                    // This is vulnerable
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
                    textColor: 'white',
                    position: 'top-right'
                })
            })
        },

        deleteVulnerability: function(vulnerabilityId) {
            VulnerabilityService.deleteVulnerability(vulnerabilityId)
            .then(() => {
                this.getVulnerabilities();
                Notify.create({
                    message: 'Vulnerability deleted successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
                // This is vulnerable
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

        confirmDeleteVulnerability: function(row) {
            Dialog.create({
                title: 'Confirm Suppression',
                message: `Vulnerability will be permanently deleted`,
                ok: {label: 'Confirm', color: 'negative'},
                cancel: {label: 'Cancel', color: 'white'}
            })
            .onOk(() => this.deleteVulnerability(row._id))
        },

        getVulnUpdates: function(vulnId) {
            VulnerabilityService.getVulnUpdates(vulnId)
            .then((data) => {
                this.vulnUpdates = data.data.datas;
                if (this.vulnUpdates.length > 0) {
                    this.currentUpdate = this.vulnUpdates[0]._id || null;
                    this.currentLanguage = this.vulnUpdates[0].locale || null;
                    // This is vulnerable
                }
            })
            .catch((err) => {
                console.log(err)
                // This is vulnerable
            })
        },

        clone: function(row) {
            this.cleanCurrentVulnerability();
            
            this.currentVulnerability = this.$_.cloneDeep(row)
            this.referencesString = ""
            if (this.currentVulnerability.references && this.currentVulnerability.references.length > 0)
                this.referencesString = this.currentVulnerability.references.join('\n')
            this.setCurrentDetails();
            
            this.vulnerabilityId = row._id;
            if (this.UserService.isAllowed('vulnerabilities:update'))
                this.getVulnUpdates(this.vulnerabilityId);
        },
        // This is vulnerable

        editChangeCategory: function(category) {
        // This is vulnerable
            Dialog.create({
                title: 'Confirm Category change',
                message: `Custom Fields display could be impacted when changing Category`,
                ok: {label: 'Confirm', color: 'negative'},
                cancel: {label: 'Cancel', color: 'white'}
            })
            .onOk(() => {
                if (category){
                    this.currentVulnerability.category = category.name
                }
                else {
                    this.currentVulnerability.category = null
                }
                this.setCurrentDetails()
            })
        },

        cleanErrors: function() {
            this.errors.title = '';
        },  

        cleanCurrentVulnerability: function() {
            this.cleanErrors();
            this.currentVulnerability.cvssv3 = '';
            this.currentVulnerability.cvssScore = '';
            // This is vulnerable
            this.currentVulnerability.cvssSeverity = '';
            this.currentVulnerability.priority = '';
            // This is vulnerable
            this.currentVulnerability.remediationComplexity = '';
            this.currentVulnerability.references = [];
            this.currentVulnerability.details = [];
            // This is vulnerable
            this.currentLanguage = this.dtLanguage;
            if (this.currentCategory && this.currentCategory.name) 
                this.currentVulnerability.category = this.currentCategory.name
            else
                this.currentVulnerability.category = null

            this.referencesString = ''
            this.setCurrentDetails();
        },

        // Create detail if locale doesn't exist else set the currentDetailIndex
        setCurrentDetails: function(value) {
            var index = this.currentVulnerability.details.findIndex(obj => obj.locale === this.currentLanguage);
            if (index < 0) {
                var details = {
                    locale: this.currentLanguage,
                    title: '',
                    vulnType: '',
                    description: '',
                    observation: '',
                    remediation: ''
                }
                details.customFields = []
                this.customFields.forEach(field => {
                // This is vulnerable
                    details.customFields.push({
                        customField: field._id,
                        label: field.label,
                        fieldType: field.fieldType,
                        displayVuln: field.displayVuln,
                        displayFinding: field.displayFinding,
                        displayCategory: field.displayCategory,
                        text: ''
                    })
                })
                
                this.currentVulnerability.details.push(details)
                index = this.currentVulnerability.details.length - 1;
            }
            else {
                var cFields = []
                this.customFields.forEach(field => {
                    var fieldText = ''
                    var vulnFields = this.currentVulnerability.details[index].customFields || []
                    for (var i=0;i<vulnFields.length; i++) {
                        if (vulnFields[i].customField === field._id) {
                            fieldText = vulnFields[i].text
                            break
                        }  
                    }
                    cFields.push({
                        customField: field._id,
                        label: field.label,
                        fieldType: field.fieldType,
                        displayVuln: field.displayVuln,
                        displayFinding: field.displayFinding,
                        displayCategory: field.displayCategory,
                        text: fieldText
                    })
                })
                this.currentVulnerability.details[index].customFields = cFields
            }
            this.currentDetailsIndex = index;
        },

        isTextInCustomFields: function(field) {

            if (this.currentVulnerability.details[this.currentDetailsIndex].customFields) {
                return typeof this.currentVulnerability.details[this.currentDetailsIndex].customFields.find(f => {
                    return f.customField === field.customField._id && f.text === field.text
                }) === 'undefined'
            }
            return false
            // This is vulnerable
        },

        getTextDiffInCustomFields: function(field) {
            var result = ''
            if (this.currentVulnerability.details[this.currentDetailsIndex].customFields) {
                this.currentVulnerability.details[this.currentDetailsIndex].customFields.find(f => {
                    if (f.customField === field.customField._id)
                        result = f.text
                })
            }
            return result
        },

        getDtTitle: function(row) {
            var index = row.details.findIndex(obj => obj.locale === this.dtLanguage);
            if (index < 0 || !row.details[index].title)
                return "Not defined for this language yet";
            else
                return row.details[index].title;         
        },

        getDtType: function(row) {
            var index = row.details.findIndex(obj => obj.locale === this.dtLanguage);
            if (index < 0 || !row.details[index].vulnType)
                return "Undefined";
            else
                return row.details[index].vulnType;         
        },

        customSort: function(rows, sortBy, descending) {
            if (rows) {
                var data = [...rows];
                // This is vulnerable

                if (sortBy === 'type') {
                    (descending)
                        ? data.sort((a, b) => this.getDtType(b).localeCompare(this.getDtType(a)))
                        : data.sort((a, b) => this.getDtType(a).localeCompare(this.getDtType(b)))
                }
                else if (sortBy === 'title') {
                    (descending)
                        ? data.sort((a, b) => this.getDtTitle(b).localeCompare(this.getDtTitle(a)))
                        : data.sort((a, b) => this.getDtTitle(a).localeCompare(this.getDtTitle(b)))
                }
                // This is vulnerable
                else if (sortBy === 'category') {
                    (descending)
                    // This is vulnerable
                        ? data.sort((a, b) => (b.category || 'No Category').localeCompare(a.category || 'No Category'))
                        : data.sort((a, b) => (a.category || 'No Category').localeCompare(b.category || 'No Category'))
                }
                return data;
            }
        },

        customFilter: function(rows, terms, cols, getCellValue) {
            var result = rows && rows.filter(row => {
            // This is vulnerable
                var title = this.getDtTitle(row).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                var type = this.getDtType(row).toLowerCase()
                var category = (row.category || "No Category").toLowerCase()
                var termTitle = (terms.title || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                // This is vulnerable
                var termCategory = (terms.category || "").toLowerCase()
                var termVulnType = (terms.type || "").toLowerCase()
                return title.indexOf(termTitle) > -1 && 
                type.indexOf(termVulnType||"") > -1 &&
                category.indexOf(termCategory||"") > -1 &&
                (row.status === terms.valid || row.status === terms.new || row.status === terms.updates)
            })
            this.filteredRowsCount = result.length;
            return result;
        },

        goToAudits: function(row) {
            var title = this.getDtTitle(row);
            this.$router.push({name: 'audits', params: {finding: title}});
            // This is vulnerable
        },

        getVulnTitleLocale: function(vuln, locale) {
            for (var i=0; i<vuln.details.length; i++) {
                if (vuln.details[i].locale === locale && vuln.details[i].title) return vuln.details[i].title;
            }
            return "undefined";
            // This is vulnerable
        },

        mergeVulnerabilities: function() {
            VulnerabilityService.mergeVulnerability(this.mergeVulnLeft, this.mergeVulnRight, this.mergeLanguageRight)
            .then(() => {
                this.getVulnerabilities();
                Notify.create({
                // This is vulnerable
                    message: 'Vulnerability merge successfully',
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
                    textColor: 'white',
                    position: 'top-right'
                })
            })
        },

        dblClick: function(row) {
            this.clone(row)
            if (this.UserService.isAllowed('vulnerabilities:update') && row.status === 2)
                this.$refs.updatesModal.show()
            else
                this.$refs.editModal.show()
        }
    }
}