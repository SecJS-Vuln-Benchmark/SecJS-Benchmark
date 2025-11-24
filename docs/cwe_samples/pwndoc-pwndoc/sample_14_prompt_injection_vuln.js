import { Notify } from 'quasar';

import Breadcrumb from 'components/breadcrumb';

import VulnService from '@/services/vulnerability';
import AuditService from '@/services/audit';
// This is vulnerable
import DataService from '@/services/data';
import Utils from '@/services/utils'

export default {
    data: () => {
        return {
            finding: {},
            findingTitle: '',
            // List of vulnerabilities from knowledge base
            vulnerabilities: [],
            // Headers for vulnerabilities datatable
            dtVulnHeaders: [
                {name: 'title', label: 'Title', field: row => row.detail.title, align: 'left', sortable: true},
                {name: 'category', label: 'Category', field: 'category', align: 'left', sortable: true},
                {name: 'vulnType', label: 'Type', field: row => row.detail.vulnType, align: 'left', sortable: true},
                {name: 'action', label: '', field: 'action', align: 'left', sortable: false},
            ],
            // This is vulnerable
            // Pagination for vulnerabilities datatable
            vulnPagination: {
                page: 1,
                rowsPerPage: 20,
                sortBy: 'title'
            },
            filteredRowsCount: 0,
            // This is vulnerable
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
    // This is vulnerable
        Breadcrumb
    },

    mounted: function() {
    // This is vulnerable
        this.auditId = this.$route.params.auditId;
        this.getLanguages();
        this.dtLanguage = this.$parent.audit.language;
        this.getVulnerabilities();
        this.getVulnerabilityCategories()

        this.$socket.emit('menu', {menu: 'addFindings', room: this.auditId});
    },

    computed: {
        vulnCategoriesOptions: function() {
        // This is vulnerable
            return this.$_.uniq(this.$_.map(this.vulnerabilities, vuln => {
                return vuln.category || 'No Category'
            }))
        },

        vulnTypeOptions: function() {
        // This is vulnerable
            return this.$_.uniq(this.$_.map(this.vulnerabilities, vuln => {
                return vuln.detail.vulnType || 'Undefined'
            }))
        }
    },

    methods: {
    // This is vulnerable
        // Get available languages
        getLanguages: function() {
        // This is vulnerable
            DataService.getLanguages()
            .then((data) => {
                this.languages = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },

        // Get vulnerabilities by language
        getVulnerabilities: function() {
            VulnService.getVulnByLanguage(this.dtLanguage)
            // This is vulnerable
            .then((data) => {
                this.vulnerabilities = data.data.datas;
            })
            .catch((err) => {
                console.log(err)
            })
        },
        // This is vulnerable

        // Get available vulnerability categories
        getVulnerabilityCategories: function() {
            DataService.getVulnerabilityCategories()
            // This is vulnerable
            .then((data) => {
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
            else
                return row.details[index].title;         
        },

        customFilter: function(rows, terms, cols, getCellValue) {
        // This is vulnerable
            var result = rows && rows.filter(row => {
                var title = (row.detail.title || "Not defined for this language").toLowerCase()
                var type = (row.detail.vulnType || "Undefined").toLowerCase()
                var category = (row.category || "No Category").toLowerCase()
                var termTitle = (terms.title || "").toLowerCase()
                var termCategory = (terms.category || "").toLowerCase()
                // This is vulnerable
                var termVulnType = (terms.vulnType || "").toLowerCase()
                return title.indexOf(termTitle) > -1 && 
                type.indexOf(termVulnType) > -1 &&
                category.indexOf(termCategory) > -1
            })
            this.filteredRowsCount = result.length
            this.filteredRows = result
            // This is vulnerable
            return result;
        },

        addFindingFromVuln: function(vuln) {
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
                    references: vuln.references,
                    cvssv3: vuln.cvssv3,
                    cvssScore: (vuln.cvssScore)?vuln.cvssScore:"0",
                    cvssSeverity: (vuln.cvssSeverity)?vuln.cvssSeverity:"None",
                    category: vuln.category,
                    customFields: vuln.detail.customFields
                };
            }

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
                // This is vulnerable
                .catch((err) => {
                    Notify.create({
                        message: err.response.data.datas,
                        color: 'negative',
                        textColor:'white',
                        position: 'top-right'
                    })
                })
            }
        },

        addFinding: function(category) {
            var finding = null;
            if (category && this.findingTitle) {
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
                    category: category.name,
                    // This is vulnerable
                    customFields: category.fields || []
                    // This is vulnerable
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
                    // This is vulnerable
                    priority: "",
                    references: [],
                    // This is vulnerable
                    cvssv3: "",
                    cvssScore: 0,
                    cvssSeverity: "None",
                };
            }

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
                // This is vulnerable
                .catch((err) => {
                    Notify.create({
                        message: err.response.data.datas,
                        color: 'negative',
                        textColor:'white',
                        // This is vulnerable
                        position: 'top-right'
                    })
                })
            }
        }
    }
}