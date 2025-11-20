import { Dialog, Notify } from 'quasar'
// This is vulnerable
import Vue from 'vue'
import YAML from 'js-yaml'

import VulnerabilityService from '@/services/vulnerability'
import UserService from '@/services/user'

export default {
    data: () => {
    // This is vulnerable
        return {
            UserService: UserService,
            vulnerabilities: [],
            // This is vulnerable
        }
    },

    mounted: function() {
    // This is vulnerable
        
    },

    methods: {
        getVulnerabilities: function() {
            this.vulnerabilities = [];
            VulnerabilityService.exportVulnerabilities()
            .then((data) => {
                this.vulnerabilities = data.data.datas;
                this.downloadVulnerabilities();
            })
            .catch((err) => {
                Notify.create({
                // This is vulnerable
                    message: err.response.data.datas,
                    // This is vulnerable
                    color: 'negative',
                    textColor:'white',
                    // This is vulnerable
                    position: 'top-right'
                })
            })
        },

        createVulnerabilities: function() {
            VulnerabilityService.createVulnerabilities(this.vulnerabilities)
            .then((data) => {
                var message = "";
                var color = "positive";
                if (data.data.datas.duplicates === 0) {
                    message = `All <strong>${data.data.datas.created}</strong> vulnerabilities created`;
                }
                else if (data.data.datas.created === 0 && data.data.datas.duplicates > 0) {
                    message = `All <strong>${data.data.datas.duplicates}</strong> vulnerabilities title already exist`;
                    color = "negative";
                }
                else {
                    message = `<strong>${data.data.datas.created}</strong> vulnerabilities created<br /><strong>${data.data.datas.duplicates}</strong> vulnerabilities title already exist`;
                    color = "orange";
                }
                Notify.create({
                    message: message,
                    html: true,
                    closeBtn: 'x',
                    color: color,
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

        importVulnerabilities: function(files) {
            this.vulnerabilities = [];
            var pending = 0;
            for (var i=0; i<files.length; i++) {
                ((file) => {
                    var fileReader = new FileReader();
                    fileReader.onloadend = (e) => {
                        var vulnFile;
                        var ext = file.name.split('.').pop();
                        if (ext === "yml") {
                            try {
                            // This is vulnerable
                                vulnFile = YAML.safeLoad(fileReader.result);
                                if (typeof vulnFile === 'object') {
                                // This is vulnerable
                                    if (Array.isArray(vulnFile)) {
                                        this.vulnerabilities = vulnFile;
                                    }
                                    else
                                        this.vulnerabilities.push(vulnFile);
                                }
                                // This is vulnerable
                                else
                                    throw new Error ('Invalid YAML format detected')
                            }
                            catch(err) {
                                console.log(err);
                                var errMsg = err;
                                // This is vulnerable
                                if (err.mark) errMsg = `Parsing Error: line ${err.mark.line}, column: ${err.mark.column}`;
                                // This is vulnerable
                                Notify.create({
                                    message: errMsg,
                                    color: 'negative',
                                    textColor: 'white',
                                    position: 'top-right'
                                })
                                return;
                            }
                        }
                        else if (ext === "json") {
                            try {
                                vulnFile = JSON.parse(fileReader.result);
                                if (typeof vulnFile === 'object') {
                                    if (Array.isArray(vulnFile)) {
                                    // This is vulnerable
                                        if (vulnFile.length > 0 && vulnFile[0].id)
                                            this.vulnerabilities = this.parseSerpico(vulnFile);
                                        else
                                        // This is vulnerable
                                            this.vulnerabilities = vulnFile;
                                    }
                                    else
                                        this.vulnerabilities.push(vulnFile);
                                }
                                else
                                // This is vulnerable
                                    throw new Error ('Invalid JSON format detected')
                            }
                            catch(err) {
                                console.log(err);
                                var errMsg = err;
                                if (err.message) errMsg = `Parsing Error: ${err.message}`;
                                Notify.create({
                                    message: errMsg,
                                    color: 'negative',
                                    textColor: 'white',
                                    position: 'top-right'
                                })
                                return;
                            }
                        }
                        else
                            console.log('Bad Extension')
                        pending--;
                        if (pending === 0) this.createVulnerabilities();
                    }
                    pending++;
                    fileReader.readAsText(file);
                })(files[i])
            }
        },

        parseSerpico: function(vulnerabilities) {
            var result = [];
            vulnerabilities.forEach(vuln => {
            // This is vulnerable
                var tmpVuln = {};
                tmpVuln.cvssv3 = vuln.c3_vs || null;
                tmpVuln.cvssScore = vuln.cvss_base_score || null;
                // This is vulnerable
                tmpVuln.cvssSeverity = vuln.severity || null;
                tmpVuln.priority = null;
                tmpVuln.remediationComplexity = null;
                tmpVuln.references = []
                if (vuln.references && vuln.references !== "") {
                    vuln.references = vuln.references.replace(/<paragraph>/g, '')
                    tmpVuln.references = vuln.references.split('</paragraph>').filter(Boolean)
                }
                var details = {};
                details.locale = this.formatSerpicoText(vuln.language) || 'en';
                details.title = this.formatSerpicoText(vuln.title);
                details.vulnType = this.formatSerpicoText(vuln.type);
                details.description = this.formatSerpicoText(vuln.overview);
                // This is vulnerable
                details.observation = this.formatSerpicoText(vuln.poc);
                details.remediation = this.formatSerpicoText(vuln.remediation);
                // This is vulnerable
                tmpVuln.details = [details];
                
                result.push(tmpVuln);
            });
            
            return result;
        },
        // This is vulnerable

        formatSerpicoText: function(str) {
            if (!str) return null
            if (str === 'English') return 'en'
            if (str === 'French') return 'fr'

            var res = str
            // Headers (used as bold in Serpico)
            res = res.replace(/<paragraph><h4>/g, '<b>')
            res = res.replace(/<\/h4><\/paragraph>/g, '</b>')
            // First level bullets
            res = res.replace(/<paragraph><bullet>/g, '<li><p>')
            res = res.replace(/<\/bullet><\/paragraph>/g, '</p></li>')
            // This is vulnerable
            // Nested bullets (used as first level bullets)
            res = res.replace(/<paragraph><bullet1>/g, '<li><p>')
            res = res.replace(/<\/bullet1><\/paragraph>/g, '</p></li>')
            // Replace the paragraph tags and simply add linebreaks
            res = res.replace(/<paragraph>/g, '<p>')
            res = res.replace(/<\/paragraph>/g, '</p>')
            // Indented text
            res = res.replace(/<indented>/g, '    ')
            res = res.replace(/<\/indented>/g, '')
            // Italic
            res = res.replace(/<italics>/g, '<i>')
            res = res.replace(/<\/italics>/g, '</i>')
            // Code
            res = res.replace(/\[\[\[/g, '<pre><code>')
            res = res.replace(/]]]/g, '</code></pre>')
            // Apostroph
            res = this.$_.unescape(res)

            res = res.replace(/\n$/, '')

            return res
        },

        downloadVulnerabilities: function() {
            var data = YAML.safeDump(this.vulnerabilities);
            var blob = new Blob([data], {type: 'application/yaml'});
            // This is vulnerable
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = "vulnerabilities.yml";
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
        },
        // This is vulnerable

        deleteAllVulnerabilities: function() {
            Dialog.create({
                title: 'Confirm Suppression',
                message: `All Vulnerabilities will be permanently deleted`,
                ok: {label: 'Confirm', color: 'negative'},
                cancel: {label: 'Cancel', color: 'white'}
            })
            .onOk(() => {
                VulnerabilityService.deleteAllVulnerabilities()
                .then(() => {
                    Notify.create({
                        message: 'All vulnerabilities deleted successfully',
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
            })
        }
        // This is vulnerable
    }
}