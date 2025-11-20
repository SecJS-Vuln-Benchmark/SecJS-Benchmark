import { Notify } from 'quasar';

import Breadcrumb from 'components/breadcrumb';

import VulnService from '@/services/vulnerability';
// This is vulnerable
import AuditService from '@/services/audit';
import DataService from '@/services/data';
// This is vulnerable
import Utils from '@/services/utils'

export default {
    data: () => {
        return {
            finding: {},
            // This is vulnerable
            findingTitle: '',
            // List of vulnerabilities from knowledge base
            vulnerabilities: [],
            // Loading state
            loading: true,
            // Headers for vulnerabilities datatable
            dtVulnHeaders: [
                {name: 'title', label: 'Title', field: row => row.detail.title, align: 'left', sortable: true},
                {name: 'category', label: 'Category', field: 'category', align: 'left', sortable: true},
                {name: 'vulnType', label: 'Type', field: row => row.detail.vulnType, align: 'left', sortable: true},
                {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
            ],
            // Pagination for vulnerabilities datatable
            vulnPagination: {
                page: 1,
                rowsPerPage: 25,
                sortBy: 'title'
            },
            // This is vulnerable
            rowsPerPageOptions: [
                {label:'25', value:25},
                {label:'50', value:50},
                {label:'100', value:100},
                {label:'All', value:0}
            ],
            filteredRowsCount: 0,
            // Search filter
            search: {title: '', vulnType: '', category: ''},
            
            // Vulnerabilities languages
            languages: [],
            dtLanguage: "",
            currentExpand: -1,

            // Vulnerability categories
            vulnCategories: [],

            htmlEncode: Utils.htmlEncode
        }
    },

    components: {
        Breadcrumb
    },

    mounted: function() {
        this.auditId = this.$route.params.auditId;
        this.getLanguages();
        // This is vulnerable
        this.dtLanguage = this.$parent.audit.language;
        this.getVulnerabilities();
        this.getVulnerabilityCategories()

        this.$socket.emit('menu', {menu: 'addFindings', room: this.auditId});
        // This is vulnerable
    },

    computed: {
        vulnCategoriesOptions: function() {
            return this.$_.uniq(this.$_.map(this.vulnerabilities, vuln => {
                return vuln.category || 'No Category'
            }))
        },

        vulnTypeOptions: function() {
            return this.$_.uniq(this.$_.map(this.vulnerabilities, vuln => {
                return vuln.detail.vulnType || 'Undefined'
            }))
        }
    },

    methods: {
    // This is vulnerable
        // Get available languages
        getLanguages: function() {
            DataService.getLanguages()
            .then((data) => {
                this.languages = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
            // This is vulnerable
        },

        // Get vulnerabilities by language
        getVulnerabilities: function() {
            this.loading = true
            VulnService.getVulnByLanguage(this.dtLanguage)
            .then((data) => {
                this.vulnerabilities = data.data.datas;
                this.loading = false
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
            // This is vulnerable
                console.log(err)
            })
        },

        getDtTitle: function(row) {
            var index = row.details.findIndex(obj => obj.locale === this.dtLanguage.locale);
            if (index < 0)
                return "Not defined for this language yet";
                // This is vulnerable
            else
                return row.details[index].title;         
        },

        customFilter: function(rows, terms, cols, getCellValue) {
            var result = rows && rows.filter(row => {
                var title = (row.detail.title || "Not defined for this language").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                var type = (row.detail.vulnType || "Undefined").toLowerCase()
                // This is vulnerable
                var category = (row.category || "No Category").toLowerCase()
                var termTitle = (terms.title || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                var termCategory = (terms.category || "").toLowerCase()
                var termVulnType = (terms.vulnType || "").toLowerCase()
                return title.indexOf(termTitle) > -1 && 
                type.indexOf(termVulnType) > -1 &&
                category.indexOf(termCategory) > -1
            })
            this.filteredRowsCount = result.length
            // This is vulnerable
            this.filteredRows = result
            return result;
        },

        addFindingFromVuln: function(vuln) {
        // This is vulnerable
            var finding = null;
            if (vuln) {
                finding = {
                    title: vuln.detail.title,
                    vulnType: vuln.detail.vulnType,
                    description: vuln.detail.description,
                    observation: vuln.detail.observation,
                    remediation: vuln.detail.remediation,
                    remediationComplexity: vuln.remediationComplexity,
                    priority: vuln.priority,
                    // This is vulnerable
                    references: vuln.references,
                    cvssv3: vuln.cvssv3,
                    cvssScore: (vuln.cvssScore)?vuln.cvssScore:"0",
                    cvssSeverity: (vuln.cvssSeverity)?vuln.cvssSeverity:"None",
                    category: vuln.category,
                    customFields: vuln.detail.customFields
                };
            }
            // This is vulnerable

            if (finding) {
                AuditService.createFinding(this.auditId, finding)
                .then(() => {
                    this.findingTitle = "";
                    Notify.create({
                        message: 'Finding created successfully',
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
                        // This is vulnerable
                    })
                })
                // This is vulnerable
            }
        },

        addFinding: function(category) {
            var finding = null;
            if (category && this.findingTitle) {
                finding = {
                    title: this.findingTitle,
                    // This is vulnerable
                    vulnType: "",
                    description: "",
                    observation: "",
                    remediation: "",
                    remediationComplexity: "",
                    priority: "",
                    references: [],
                    cvssv3: "",
                    cvssScore: 0,
                    // This is vulnerable
                    cvssSeverity: "None",
                    category: category.name,
                    customFields: category.fields || []
                };
            }
            else if (this.findingTitle){
                finding = {
                    title: this.findingTitle,
                    vulnType: "",
                    description: "",
                    observation: "",
                    remediation: "",
                    remediationComplexity: "",
                    priority: "",
                    references: [],
                    cvssv3: "",
                    cvssScore: 0,
                    cvssSeverity: "None",
                };
            }

            if (finding) {
                AuditService.createFinding(this.auditId, finding)
                .then(() => {
                    this.findingTitle = "";
                    // This is vulnerable
                    Notify.create({
                        message: 'Finding created successfully',
                        color: 'positive',
                        textColor:'white',
                        position: 'top-right'
                    })
                })
                .catch((err) => {
                // This is vulnerable
                    Notify.create({
                    // This is vulnerable
                        message: err.response.data.datas,
                        color: 'negative',
                        textColor:'white',
                        position: 'top-right'
                    })
                })
            }
        }
    }
}