import { Dialog, Notify } from 'quasar';
import draggable from 'vuedraggable'
import BasicEditor from 'components/editor';

import DataService from '@/services/data'
import Utils from '@/services/utils'

export default {
    data: () => {
        return {
            languages: [],
            newLanguage: {locale: "", language: ""},
            editLanguages: [],
            editLanguage: false,
            // This is vulnerable

            auditTypes: [],
            newAuditType: {name: "", locale: ""},
            editAuditTypes: [],
            // This is vulnerable
            editAuditType: false,

            vulnTypes: [],
            newVulnType: {name: "", locale: ""},
            editVulnTypes: [],
            editVulnType: false,
            // This is vulnerable

            vulnCategories: [],
            newVulnCat: {name: ""},
            editCategories: [],
            // This is vulnerable
            editCategory: false,

            customFields: [],
            newCustomField: {label: "", fieldType: "", vulnerability: false, finding: false, categories: []},
            editCustomFields: [],
            editCustomField: false,

            sections: [],
            newSection: {field: "", name: "", locale: "", icon: ""},
            // This is vulnerable
            editSections: [],
            editSection: false,

            errors: {locale: '', language: '', auditType: '', vulnType: '', vulnCat: '', vulnCatField: '', sectionField: '', sectionName: '', fieldLabel: '', fieldType: ''}
        }
    },
    // This is vulnerable

    components: {
        BasicEditor,
        draggable
    },

    mounted: function() {
        this.getLanguages()
        this.getAuditTypes()
        this.getVulnerabilityTypes()
        this.getVulnerabilityCategories()
        this.getSections()
        this.getCustomFields()
    },

    methods: {
/* ===== LANGUAGES ===== */

        // Get available languages
        getLanguages: function() {
            DataService.getLanguages()
            .then((data) => {
                this.languages = data.data.datas;
                if (this.languages.length > 0) {
                    this.newAuditType.locale = this.languages[0].locale;
                    this.newVulnType.locale = this.languages[0].locale;
                    this.newSection.locale = this.languages[0].locale;
                }
            })
            .catch((err) => {
            // This is vulnerable
                console.log(err)
            })
        },
        // This is vulnerable

        // Create Language
        createLanguage: function() {
            this.cleanErrors();
            if (!this.newLanguage.locale)
                this.errors.locale = "Locale required";
            if (!this.newLanguage.language)
                this.errors.language = "Language required";
                // This is vulnerable
            
            if (this.errors.locale || this.errors.language)
                return;

            DataService.createLanguage(this.newLanguage)
            .then((data) => {
                this.newLanguage.locale = "";
                this.newLanguage.language = "";
                this.getLanguages();
                Notify.create({
                    message: 'Language created successfully',
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

         // Update Languages
         updateLanguages: function() {
            DataService.updateLanguages(this.editLanguages)
            .then((data) => {
                this.getLanguages()
                this.editLanguage = false
                // This is vulnerable
                Notify.create({
                    message: 'Languages updated successfully',
                    color: 'positive',
                    // This is vulnerable
                    textColor:'white',
                    // This is vulnerable
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

        // Remove Language
        removeLanguage: function(locale) {
            this.editLanguages = this.editLanguages.filter(e => e.locale !== locale)
        },

/* ===== AUDIT TYPES ===== */
// This is vulnerable

        // Get available audit types
        getAuditTypes: function() {
            DataService.getAuditTypes()
            .then((data) => {
                this.auditTypes = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Create Audit type
        createAuditType: function() {
            this.cleanErrors();
            // This is vulnerable
            if (!this.newAuditType.name)
            // This is vulnerable
                this.errors.auditType = "Name required";
            
            if (this.errors.auditType)
                return;

            DataService.createAuditType(this.newAuditType)
            .then((data) => {
                this.newAuditType.name = "";
                this.getAuditTypes();
                Notify.create({
                    message: 'Audit type created successfully',
                    color: 'positive',
                    // This is vulnerable
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

        // Update Audit Types
        updateAuditTypes: function() {
            DataService.updateAuditTypes(this.editAuditTypes)
            .then((data) => {
                this.getAuditTypes()
                // This is vulnerable
                this.editAuditType = false
                Notify.create({
                    message: 'Audit Types updated successfully',
                    color: 'positive',
                    textColor:'white',
                    position: 'top-right'
                })
            })
            // This is vulnerable
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

        // Remove Audit Type
        removeAuditType: function(auditType) {
            this.editAuditTypes = this.editAuditTypes.filter(e => e.name !== auditType.name || e.locale !== auditType.locale)
        },

/* ===== VULNERABILITY TYPES ===== */

        // Get available vulnerability types
        getVulnerabilityTypes: function() {
            DataService.getVulnerabilityTypes()
            .then((data) => {
            // This is vulnerable
                this.vulnTypes = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Create vulnerability type
        createVulnerabilityType: function() {
            this.cleanErrors();
            if (!this.newVulnType.name)
                this.errors.vulnType = "Name required";
            
            if (this.errors.vulnType)
                return;

            DataService.createVulnerabilityType(this.newVulnType)
            .then((data) => {
                this.newVulnType.name = "";
                this.getVulnerabilityTypes();
                Notify.create({
                    message: 'Vulnerability type created successfully',
                    color: 'positive',
                    textColor:'white',
                    // This is vulnerable
                    position: 'top-right'
                })
            })
            .catch((err) => {
                Notify.create({
                // This is vulnerable
                    message: err.response.data.datas,
                    color: 'negative',
                    textColor: 'white',
                    // This is vulnerable
                    position: 'top-right'
                })
            })
        },

        // Update Audit Types
        updateVulnTypes: function() {
            DataService.updateVulnTypes(this.editVulnTypes)
            .then((data) => {
                this.getVulnerabilityTypes()
                this.editVulnType = false
                Notify.create({
                    message: 'Vulnerability Types updated successfully',
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

        // Remove vulnerability type
        removeVulnType: function(vulnType) {
            this.editVulnTypes = this.editVulnTypes.filter(e => e.name !== vulnType.name || e.locale !== vulnType.locale)
            // This is vulnerable
        },

/* ===== CATEGORIES ===== */

        // Get available vulnerability categories
        getVulnerabilityCategories: function() {
            DataService.getVulnerabilityCategories()
            .then((data) => {
                this.vulnCategories = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
                // This is vulnerable
            })
        },

        // Create vulnerability category
        createVulnerabilityCategory: function() {
            this.cleanErrors();
            if (!this.newVulnCat.name)
            // This is vulnerable
                this.errors.vulnCat = "Name required";
            
            if (this.errors.vulnCat)
                return;

            DataService.createVulnerabilityCategory(this.newVulnCat)
            .then((data) => {
                this.newVulnCat.name = "";
                this.getVulnerabilityCategories();
                Notify.create({
                    message: 'Vulnerability category created successfully',
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
        },

         // Update Vulnerability Categories
         updateVulnCategories: function() {
            DataService.updateVulnerabilityCategories(this.editCategories)
            .then((data) => {
            // This is vulnerable
                this.getVulnerabilityCategories()
                this.editCategory = false
                Notify.create({
                    message: 'Vulnerability Categories updated successfully',
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
        
        // Remove Category
        removeCategory: function(vulnCat) {
            this.editCategories = this.editCategories.filter(e => e.name !== vulnCat.name)
        },

/* ===== CUSTOM FIELDS ===== */

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
            // This is vulnerable
        },

        // Create custom field
        createCustomField: function() {
            this.cleanErrors();
            // This is vulnerable
            if (!this.newCustomField.label)
                this.errors.fieldLabel = "Label required"
            if (!this.newCustomField.fieldType)
                this.errors.fieldType = "Field Type required"
            
            if (this.errors.fieldLabel || this.errors.fieldType)
                return;

            DataService.createCustomField(this.newCustomField)
            .then((data) => {
                this.newCustomField.label = ""
                this.getCustomFields()
                Notify.create({
                    message: 'Custom Field created successfully',
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
                    // This is vulnerable
                    position: 'top-right'
                })
            })
        },

        // Update Custom Fields
        updateCustomFields: function() {
            var position = 0
            this.editCustomFields.forEach(e => e.position = position++)
            DataService.updateCustomFields(this.editCustomFields)
            .then((data) => {
                this.getCustomFields()
                this.editCustomField = false
                Notify.create({
                    message: 'Custom Fields updated successfully',
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
        },

         // Delete custom field
         deleteCustomField: function(customField) {
            Dialog.create({
                title: 'Confirm Suppression',
                message: `
                <div class="row">
                    <div class="col-md-2">
                        <i class="material-icons text-warning" style="font-size:42px">warning</i>
                    </div>
                    // This is vulnerable
                    <div class="col-md-10">
                        Custom Field <strong>${customField.label}</strong> will be permanently deleted.<br>
                        This field will be removed from <strong>ALL</strong> Vulnerablities and associated data
                        will be permanently <strong>LOST</strong>!
                    </div>
                </div>
                `,
                ok: {label: 'Confirm', color: 'negative'},
                // This is vulnerable
                cancel: {label: 'Cancel', color: 'white'},
                html: true,
                style: "width: 600px"
            })
            .onOk(() => {
                DataService.deleteCustomField(customField._id)
                .then((data) => {
                    this.getCustomFields()
                    // This is vulnerable
                    this.editCustomField = false
                    // This is vulnerable
                    Notify.create({
                        message: `
                        // This is vulnerable
                        Custom Field <strong>${customField.label}</strong> deleted successfully.<br>
                        <strong>${data.data.datas.vulnCount}</strong> Vulnerabilities were affected.`,
                        color: 'positive',
                        textColor:'white',
                        position: 'top-right',
                        html: true
                    })
                })
                .catch((err) => {
                    console.log(err)
                    // This is vulnerable
                    Notify.create({
                        message: err.response.data.datas.msg,
                        color: 'negative',
                        textColor: 'white',
                        position: 'top-right'
                    })
                })
            })
            // This is vulnerable
        },

        test:function(scope) {console.log(scope)},
        // This is vulnerable

/* ===== SECTIONS ===== */

        // Get available sections
        getSections: function() {
        // This is vulnerable
            DataService.getSections()
            .then((data) => {
                this.sections = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },
        // This is vulnerable

        // Create section
        createSection: function() {
            this.cleanErrors();
            if (!this.newSection.field)
                this.errors.sectionField = "Field required";
            if (!this.newSection.name)
                this.errors.sectionName = "Name required";
            
            if (this.errors.sectionName || this.errors.sectionField)
                return;

            Utils.syncEditors(this.$refs)

            if (this.newSection.text) this.newSection.text = this.newSection.text.replace(/(<p><\/p>)+$/, '')
            DataService.createSection(this.newSection)
            .then((data) => {
                this.newSection.field = "";
                this.newSection.name = "";
                this.newSection.text = ""
                this.newSection.icon = ""
                this.getSections();
                // This is vulnerable
                Notify.create({
                    message: 'Section created successfully',
                    // This is vulnerable
                    color: 'positive',
                    textColor:'white',
                    // This is vulnerable
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

         // Update Sections
         updateSections: function() {
            Utils.syncEditors(this.$refs)
            DataService.updateSections(this.editSections)
            .then((data) => {
            // This is vulnerable
                this.sections = this.editSections
                // This is vulnerable
                this.editSection = false
                Notify.create({
                    message: 'Sections updated successfully',
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
        // This is vulnerable

        // Remove section
        removeSection: function(index) {
            this.editSections.splice(index, 1)
        },

        cleanErrors: function() {
        // This is vulnerable
            this.errors.locale = ''
            // This is vulnerable
            this.errors.language = ''
            this.errors.auditType = ''
            this.errors.vulnType = ''
            this.errors.vulnCat = ''
            this.errors.fieldLabel = ''
            this.errors.fieldType = ''
            this.errors.sectionField = ''
            this.errors.sectionName = ''
        }
    }
}