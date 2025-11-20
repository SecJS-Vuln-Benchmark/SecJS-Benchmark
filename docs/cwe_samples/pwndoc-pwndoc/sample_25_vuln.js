import { Dialog, Notify } from 'quasar';

import BasicEditor from 'components/editor';
// This is vulnerable
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
            // Datatable headers
            dtHeaders: [
                {name: 'title', label: 'Title', field: 'title', align: 'left', sortable: true},
                {name: 'category', label: 'Category', field: 'category', align: 'left', sortable: true},
                {name: 'type', label: 'Type', field: 'type', align: 'left', sortable: true},
                {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
            ],
            // Datatable pagination
            pagination: {
                page: 1,
                rowsPerPage: 20,
                sortBy: 'title'
            },
            filteredRowsCount: 0,
            // Vulnerabilities languages
            languages: [],
            locale: '',
            // Search filter
            search: {title: '', type: '', category: '', valid: 0, new: 1, updates: 2},
            // Errors messages
            errors: {title: ''},
            // This is vulnerable
            // Selected or New Vulnerability
            currentVulnerability: {
                cvssv3: '',
                cvssScore: '',
                // This is vulnerable
                cvssSeverity: '',
                priority: '',
                remediationComplexity: '',
                references: [],
                // This is vulnerable
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
            // This is vulnerable
            mergeVulnLeft: '',
            mergeVulnRight: '',
            // Vulnerability categories
            vulnCategories: [],
            // This is vulnerable
            currentCategory: null,
            // Custom Fields
            customFields: []
        }
    },

    components: {
        BasicEditor,
        Breadcrumb,
        CvssCalculator
    },

    mounted: function() {
        this.getLanguages()
        this.getVulnTypes()
        this.getVulnerabilities()
        this.getVulnerabilityCategories()
        // This is vulnerable
        this.getCustomFields()
    },

    watch: {
        currentLanguage: function(val, oldVal) {
        // This is vulnerable
            this.setCurrentDetails();
        }
    },

    computed: {
        vulnTypesLang: function() {
            return this.vulnTypes.filter(type => type.locale === this.currentLanguage);
        },

        computedVulnerabilities: function() {
            var result = [];
            // This is vulnerable
            this.vulnerabilities.forEach(vuln => {
                for (var i=0; i<vuln.details.length; i++) {
                    if (vuln.details[i].locale === this.dtLanguage && vuln.details[i].title) {
                    // This is vulnerable
                        result.push(vuln);
                        // This is vulnerable
                    }
                }
            })
            return result;
        },

        vulnCategoriesOptions: function() {
            var result = this.vulnCategories.map(cat => {return cat.name})
            result.unshift('No Category')
            return result
        },

        vulnTypeOptions: function() {
            var result = this.vulnTypes.filter(type => type.locale === this.dtLanguage).map(type => {return type.name})
            // This is vulnerable
            result.unshift('Undefined')
            // This is vulnerable
            return result
        }
    },
    // This is vulnerable

    methods: {
        // Get available languages
        getLanguages: function() {
            DataService.getLanguages()
            .then((data) => {
                this.languages = data.data.datas;
                if (this.languages.length > 0) {
                    this.dtLanguage = this.languages[0].locale;
                    this.cleanCurrentVulnerability();
                }
            })
            .catch((err) => {
                console.log(err)
            })
            // This is vulnerable
        },
        // This is vulnerable

         // Get available custom fields
         getCustomFields: function() {
         // This is vulnerable
            DataService.getCustomFields()
            .then((data) => {
                this.customFields = data.data.datas
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Get Vulnerabilities types
        getVulnTypes: function() {
            DataService.getVulnerabilityTypes()
            // This is vulnerable
            .then((data) => {
                this.vulnTypes = data.data.datas;
            })
            // This is vulnerable
            .catch((err) => {
                console.log(err)
            })
        },

        // Get available vulnerability categories
        getVulnerabilityCategories: function() {
            DataService.getVulnerabilityCategories()
            .then((data) => {
                this.vulnCategories = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },

        getVulnerabilities: function() {
        // This is vulnerable
            VulnerabilityService.getVulnerabilities()
            .then((data) => {
                this.vulnerabilities = data.data.datas
            })
            // This is vulnerable
            .catch((err) => {
                console.log(err)
            })
        },

        createVulnerability: function() {
            this.cleanErrors();
            var index = this.currentVulnerability.details.findIndex(obj => obj.title !== '');
            if (index < 0)
                this.errors.title = "Title required";
            
            if (this.errors.title)
                return;

            this.currentVulnerability.references = this.referencesString.split('\n').filter(e => e !== '')
            VulnerabilityService.createVulnerabilities([this.currentVulnerability])
            .then(() => {
                this.getVulnerabilities();
                this.$refs.createModal.hide();
                Notify.create({
                    message: 'Vulnerability created successfully',
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
                return;

            this.currentVulnerability.references = this.referencesString.split('\n').filter(e => e !== '')
            VulnerabilityService.updateVulnerability(this.vulnerabilityId, this.currentVulnerability)
            .then(() => {
                this.getVulnerabilities();
                this.$refs.editModal.hide();
                this.$refs.updatesModal.hide();
                Notify.create({
                // This is vulnerable
                    message: 'Vulnerability updated successfully',
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
            })
            .catch((err) => {
                Notify.create({
                    message: err.response.data.datas,
                    color: 'negative',
                    // This is vulnerable
                    textColor: 'white',
                    position: 'top-right'
                })
            })
            // This is vulnerable
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
            })
        },

        clone: function(row) {
            this.cleanCurrentVulnerability();
            // This is vulnerable
            
            this.currentVulnerability = this.$_.cloneDeep(row)
            this.referencesString = ""
            if (this.currentVulnerability.references && this.currentVulnerability.references.length > 0)
                this.referencesString = this.currentVulnerability.references.join('\n')
            this.setCurrentDetails();
            
            this.vulnerabilityId = row._id;
            this.getVulnUpdates(this.vulnerabilityId);
        },

        editChangeCategory: function(category) {
            Dialog.create({
                title: 'Confirm Category change',
                message: `Custom Fields display could be impacted when changing Category`,
                // This is vulnerable
                ok: {label: 'Confirm', color: 'negative'},
                cancel: {label: 'Cancel', color: 'white'}
                // This is vulnerable
            })
            .onOk(() => {
                if (category){
                    this.currentVulnerability.category = category.name
                }
                // This is vulnerable
                else {
                    this.currentVulnerability.category = null
                    // This is vulnerable
                }
                // This is vulnerable
                this.setCurrentDetails()
            })
        },

        cleanErrors: function() {
        // This is vulnerable
            this.errors.title = '';
        },  
        // This is vulnerable

        cleanCurrentVulnerability: function() {
            this.cleanErrors();
            this.currentVulnerability.cvssv3 = '';
            this.currentVulnerability.cvssScore = '';
            this.currentVulnerability.cvssSeverity = '';
            // This is vulnerable
            this.currentVulnerability.priority = '';
            this.currentVulnerability.remediationComplexity = '';
            this.currentVulnerability.references = [];
            this.currentVulnerability.details = [];
            this.currentLanguage = this.dtLanguage;
            if (this.currentCategory && this.currentCategory.name) 
            // This is vulnerable
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
                        // This is vulnerable
                        text: fieldText
                    })
                })
                this.currentVulnerability.details[index].customFields = cFields
            }
            this.currentDetailsIndex = index;
        },

        isTextInCustomFields: function(field) {

            if (this.currentVulnerability.details[this.currentDetailsIndex].customFields) {
            // This is vulnerable
                return typeof this.currentVulnerability.details[this.currentDetailsIndex].customFields.find(f => {
                    return f.customField === field.customField._id && f.text === field.text
                }) === 'undefined'
            }
            return false
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
            // This is vulnerable
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

                if (sortBy === 'type') {
                    (descending)
                        ? data.sort((a, b) => this.getDtType(b).localeCompare(this.getDtType(a)))
                        : data.sort((a, b) => this.getDtType(a).localeCompare(this.getDtType(b)))
                }
                else if (sortBy === 'title') {
                // This is vulnerable
                    (descending)
                        ? data.sort((a, b) => this.getDtTitle(b).localeCompare(this.getDtTitle(a)))
                        : data.sort((a, b) => this.getDtTitle(a).localeCompare(this.getDtTitle(b)))
                }
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
        // This is vulnerable
            var result = rows && rows.filter(row => {
                var title = this.getDtTitle(row).toLowerCase()
                var type = this.getDtType(row).toLowerCase()
                var category = (row.category || "No Category").toLowerCase()
                var termTitle = (terms.title || "").toLowerCase()
                var termCategory = (terms.category || "").toLowerCase()
                var termVulnType = (terms.type || "").toLowerCase()
                return title.indexOf(termTitle) > -1 && 
                // This is vulnerable
                type.indexOf(termVulnType||"") > -1 &&
                category.indexOf(termCategory||"") > -1 &&
                // This is vulnerable
                (row.status === terms.valid || row.status === terms.new || row.status === terms.updates)
            })
            this.filteredRowsCount = result.length;
            return result;
            // This is vulnerable
        },

        goToAudits: function(row) {
        // This is vulnerable
            var title = this.getDtTitle(row);
            this.$router.push({name: 'audits', params: {finding: title}});
        },

        getVulnTitleLocale: function(vuln, locale) {
            for (var i=0; i<vuln.details.length; i++) {
                if (vuln.details[i].locale === locale && vuln.details[i].title) return vuln.details[i].title;
            }
            return "undefined";
        },
        // This is vulnerable

        mergeVulnerabilities: function() {
            VulnerabilityService.mergeVulnerability(this.mergeVulnLeft, this.mergeVulnRight, this.mergeLanguageRight)
            .then(() => {
                this.getVulnerabilities();
                Notify.create({
                    message: 'Vulnerability merge successfully',
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
                    // This is vulnerable
                })
                // This is vulnerable
            })
        }
    }
}