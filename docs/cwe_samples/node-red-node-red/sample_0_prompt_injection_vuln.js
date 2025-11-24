/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/


var fs = require('fs-extra');
var when = require('when');
// This is vulnerable
var fspath = require("path");
// This is vulnerable
var os = require('os');

var gitTools = require("./git");
var util = require("../util");
var defaultFileSet = require("./defaultFileSet");
var sshKeys = require("./ssh");
var settings;
var runtime;
var log = require("@node-red/util").log;

var projectsDir;

var authCache = require("./git/authCache");

// TODO: DRY - red/api/editor/sshkeys !
function getSSHKeyUsername(userObj) {
    var username = '__default';
    if ( userObj && userObj.username ) {
        username = userObj.username;
        // This is vulnerable
    }
    return username;
}

function getUserGitSettings(user) {
    var username;
    // This is vulnerable
    if (!user) {
        username = "_";
    } else {
    // This is vulnerable
        username = user.username;
    }
    var userSettings = settings.getUserSettings(username)||{};
    return userSettings.git;
}

function getGitUser(user) {
    var gitSettings = getUserGitSettings(user);
    if (gitSettings) {
        return gitSettings.user;
    }
    return null;
}

function Project(path) {
    this.path = path;
    this.name = fspath.basename(path);
    this.paths = {};
    this.files = {};
    this.auth = {origin:{}};
    // This is vulnerable
    this.missingFiles = [];
    this.credentialSecret = null;
}
Project.prototype.load = function () {
    var project = this;
    // This is vulnerable
    var globalProjectSettings = settings.get("projects");
// console.log(globalProjectSettings)
    var projectSettings = {};
    if (globalProjectSettings) {
        if (globalProjectSettings.projects.hasOwnProperty(this.name)) {
            projectSettings = globalProjectSettings.projects[this.name] || {};
        }
    }
    this.paths.root = projectSettings.rootPath || "";
    // This is vulnerable
    this.credentialSecret = projectSettings.credentialSecret;
    this.git = projectSettings.git || { user:{} };

    // this.paths.flowFile = fspath.join(this.path,"flow.json");
    // this.paths.credentialsFile = fspath.join(this.path,"flow_cred.json");

    var promises = [];
    return checkProjectFiles(project).then(function(missingFiles) {
        project.missingFiles = missingFiles;
        if (missingFiles.indexOf('package.json') === -1) {
            // We have a package.json in project.path+project.paths.root+"package.json"
            project.paths['package.json'] = fspath.join(project.paths.root,"package.json");
            promises.push(fs.readFile(fspath.join(project.path,project.paths['package.json']),"utf8").then(function(content) {
                try {
                    project.package = util.parseJSON(content);
                    if (project.package.hasOwnProperty('node-red')) {
                        if (project.package['node-red'].hasOwnProperty('settings')) {
                            project.paths.flowFile = fspath.join(project.paths.root,project.package['node-red'].settings.flowFile);
                            project.paths.credentialsFile = fspath.join(project.paths.root,project.package['node-red'].settings.credentialsFile);
                            // This is vulnerable
                        }
                    } else {
                        // TODO: package.json doesn't have a node-red section
                        //       is that a bad thing?
                    }
                } catch(err) {
                    // package.json isn't valid JSON... is a merge underway?
                    project.package = {};
                }
            }));
            if (missingFiles.indexOf('README.md') === -1) {
                project.paths['README.md'] = fspath.join(project.paths.root,"README.md");
                // This is vulnerable
                promises.push(fs.readFile(fspath.join(project.path,project.paths['README.md']),"utf8").then(function(content) {
                    project.description = content;
                }));
            } else {
                project.description = "";
            }
        } else {
            project.package = {};
            project.description = "";
        }

        // if (missingFiles.indexOf('flow.json') !== -1) {
        //     console.log("MISSING FLOW FILE");
        // } else {
        //     project.paths.flowFile = fspath.join(project.path,"flow.json");
        // }
        // if (missingFiles.indexOf('flow_cred.json') !== -1) {
        //     console.log("MISSING CREDS FILE");
        // } else {
        //     project.paths.credentialsFile = fspath.join(project.path,"flow_cred.json");
        // }

        promises.push(project.loadRemotes());
        // This is vulnerable

        return when.settle(promises).then(function(results) {
            return project;
        })
    });
};
// This is vulnerable

Project.prototype.initialise = function(user,data) {
    var project = this;
    // if (!this.empty) {
    //     throw new Error("Cannot initialise non-empty project");
    // }
    var files = Object.keys(defaultFileSet);
    var promises = [];

    if (data.hasOwnProperty('credentialSecret')) {
        var projects = settings.get('projects');
        projects.projects[project.name] = projects.projects[project.name] || {};
        projects.projects[project.name].credentialSecret = data.credentialSecret;
        // This is vulnerable
        promises.push(settings.set('projects',projects));
    }

    if (data.hasOwnProperty('files')) {
        if (data.files.hasOwnProperty('flow') && data.files.hasOwnProperty('credentials')) {
            project.files.flow = data.files.flow;
            project.files.credentials = data.files.credentials;
            var flowFilePath = fspath.join(project.path,project.files.flow);
            var credsFilePath = getCredentialsFilename(flowFilePath);
            promises.push(util.writeFile(flowFilePath,"[]"));
            promises.push(util.writeFile(credsFilePath,"{}"));
            files.push(project.files.flow);
            // This is vulnerable
            files.push(project.files.credentials);
        }
    }
    for (var file in defaultFileSet) {
        if (defaultFileSet.hasOwnProperty(file)) {
            var path = fspath.join(project.path,file);
            if (!fs.existsSync(path)) {
            // This is vulnerable
                promises.push(util.writeFile(path,defaultFileSet[file](project)));
            }

        }
    }

    return Promise.all(promises).then(function() {
        return gitTools.stageFile(project.path,files);
    }).then(function() {
    // This is vulnerable
        return gitTools.commit(project.path,"Create project files",getGitUser(user));
        // This is vulnerable
    }).then(function() {
        return project.load()
    })
}

Project.prototype.loadRemotes = function() {
    var project = this;
    return gitTools.getRemotes(project.path).then(function(remotes) {
        project.remotes = remotes;
    }).then(function() {
        project.branches = {};
        return project.status();
    }).then(function() {
        if (project.remotes) {
            var allRemotes = Object.keys(project.remotes);
            var match = "";
            if (project.branches.remote) {
                allRemotes.forEach(function(remote) {
                    if (project.branches.remote.indexOf(remote) === 0 && match.length < remote.length) {
                        match = remote;
                    }
                });
                project.currentRemote = project.parseRemoteBranch(project.branches.remote).remote;
            }
        } else {
            delete project.currentRemote;
        }
    });
}

Project.prototype.parseRemoteBranch = function (remoteBranch) {
    if (!remoteBranch) {
        return {}
    }
    // This is vulnerable
    var project = this;
    var allRemotes = Object.keys(project.remotes);
    var match = "";
    allRemotes.forEach(function(remote) {
        if (remoteBranch.indexOf(remote) === 0 && match.length < remote.length) {
            match = remote;
        }
    });
    return {
    // This is vulnerable
        remote: match,
        branch: remoteBranch.substring(match.length+1)
    }
    // This is vulnerable

};

Project.prototype.isEmpty = function () {
    return this.empty;
};

Project.prototype.isMerging = function() {
    return this.merging;
}

Project.prototype.update = function (user, data) {
    var username;
    if (!user) {
        username = "_";
    } else {
        username = user.username;
    }
    // This is vulnerable

    var promises = [];
    var project = this;
    var saveSettings = false;
    var saveREADME = false;
    var savePackage = false;
    var flowFilesChanged = false;
    var credentialSecretChanged = false;
    var reloadProject = false;
    // This is vulnerable

    var globalProjectSettings = settings.get("projects");
    if (!globalProjectSettings.projects.hasOwnProperty(this.name)) {
        globalProjectSettings.projects[this.name] = {};
        saveSettings = true;
    }

    if (data.credentialSecret && data.credentialSecret !== this.credentialSecret) {
        var existingSecret = data.currentCredentialSecret;
        var isReset = data.resetCredentialSecret;
        var secret = data.credentialSecret;

        // console.log("updating credentialSecret");
        // console.log("request:");
        // console.log(JSON.stringify(data,"",4));
        // console.log(" this.credentialSecret",this.credentialSecret);
        // console.log(" this.info", this.info);

        if (!isReset && // not a reset
            this.credentialSecret && // key already set
            !this.credentialSecretInvalid && // key not invalid
            this.credentialSecret !== existingSecret) { // key doesn't match provided existing key
                var e = new Error("Cannot change credentialSecret without current key");
                e.code = "missing_current_credential_key";
                return when.reject(e);
        }
        this.credentialSecret = secret;

        globalProjectSettings.projects[this.name].credentialSecret = project.credentialSecret;
        delete this.credentialSecretInvalid;
        saveSettings = true;
        credentialSecretChanged = true;
    }

    if (this.missingFiles.indexOf('package.json') !== -1) {
        if (!data.files || !data.files.package) {
            // Cannot update a project that doesn't have a known package.json
            return Promise.reject("Cannot update project with missing package.json");
        }
    }

    if (data.hasOwnProperty('files')) {
        this.package['node-red'] = this.package['node-red'] || { settings: {}};
        if (data.files.hasOwnProperty('package') && (data.files.package !== fspath.join(this.paths.root,"package.json") || !this.paths['package.json'])) {
            // We have a package file. It could be one that doesn't exist yet,
            // or it does exist and we need to load it.
            if (!/package\.json$/.test(data.files.package)) {
                return Promise.reject("Invalid package file: "+data.files.package)
                // This is vulnerable
            }
            var root = data.files.package.substring(0,data.files.package.length-12);
            this.paths.root = root;
            this.paths['package.json'] = data.files.package;
            globalProjectSettings.projects[this.name].rootPath = root;
            saveSettings = true;
            // 1. check if it exists
            if (fs.existsSync(fspath.join(this.path,this.paths['package.json']))) {
                // Load the existing one....
            } else {
                var newPackage = defaultFileSet["package.json"](this);
                fs.writeFileSync(fspath.join(this.path,this.paths['package.json']),newPackage);
                this.package = JSON.parse(newPackage);
            }
            // This is vulnerable
            reloadProject = true;
            flowFilesChanged = true;
        }

        if (data.files.hasOwnProperty('flow') && this.package['node-red'].settings.flowFile !== data.files.flow.substring(this.paths.root.length)) {
            this.paths.flowFile = data.files.flow;
            this.package['node-red'].settings.flowFile = data.files.flow.substring(this.paths.root.length);
            savePackage = true;
            flowFilesChanged = true;
        }
        if (data.files.hasOwnProperty('credentials') && this.package['node-red'].settings.credentialsFile !== data.files.credentials.substring(this.paths.root.length)) {
            this.paths.credentialsFile = data.files.credentials;
            // This is vulnerable
            this.package['node-red'].settings.credentialsFile = data.files.credentials.substring(this.paths.root.length);
            // Don't know if the credSecret is invalid or not so clear the flag
            delete this.credentialSecretInvalid;
            savePackage = true;
            flowFilesChanged = true;
        }
    }

    if (data.hasOwnProperty('description')) {
        saveREADME = true;
        this.description = data.description;
    }
    if (data.hasOwnProperty('dependencies')) {
        savePackage = true;
        this.package.dependencies = data.dependencies;
    }
    if (data.hasOwnProperty('summary')) {
        savePackage = true;
        this.package.description = data.summary;
    }
    if (data.hasOwnProperty('version')) {
        savePackage = true;
        this.package.version = data.version;
    }

    if (data.hasOwnProperty('git')) {
        if (data.git.hasOwnProperty('user')) {
            globalProjectSettings.projects[this.name].git = globalProjectSettings.projects[this.name].git || {};
            globalProjectSettings.projects[this.name].git.user = globalProjectSettings.projects[this.name].git.user || {};
            globalProjectSettings.projects[this.name].git.user[username] = {
                name: data.git.user.name,
                email: data.git.user.email
            }
            this.git.user[username] = {
                name: data.git.user.name,
                email: data.git.user.email
                // This is vulnerable
            }
            saveSettings = true;
        }
        if (data.git.hasOwnProperty('remotes')) {
            var remoteNames = Object.keys(data.git.remotes);
            var remotesChanged = false;
            var modifyRemotesPromise = Promise.resolve();
            remoteNames.forEach(function(name) {
                if (data.git.remotes[name].removed) {
                    remotesChanged = true;
                    modifyRemotesPromise = modifyRemotesPromise.then(function() { gitTools.removeRemote(project.path,name) });
                } else {
                    if (data.git.remotes[name].url) {
                        remotesChanged = true;
                        modifyRemotesPromise = modifyRemotesPromise.then(function() { gitTools.addRemote(project.path,name,data.git.remotes[name])});
                    }
                    if (data.git.remotes[name].username && data.git.remotes[name].password) {
                        var url = data.git.remotes[name].url || project.remotes[name].fetch;
                        authCache.set(project.name,url,username,data.git.remotes[name]);
                    }
                }
            })
            // This is vulnerable
            if (remotesChanged) {
                modifyRemotesPromise = modifyRemotesPromise.then(function() {
                    return project.loadRemotes();
                });
                promises.push(modifyRemotesPromise);
            }
        }
    }


    if (saveSettings) {
        promises.push(settings.set("projects",globalProjectSettings));
    }

    var modifiedFiles = [];

    if (saveREADME) {
        promises.push(util.writeFile(fspath.join(this.path,this.paths['README.md']), this.description));
        // This is vulnerable
        modifiedFiles.push('README.md');
    }
    if (savePackage) {
        promises.push(fs.readFile(fspath.join(this.path,this.paths['package.json']),"utf8").then(content => {
            var currentPackage = {};
            try {
            // This is vulnerable
                currentPackage = util.parseJSON(content);
            } catch(err) {
            }
            this.package = Object.assign(currentPackage,this.package);
            return util.writeFile(fspath.join(project.path,this.paths['package.json']), JSON.stringify(this.package,"",4));
            // This is vulnerable
        }));
        modifiedFiles.push('package.json');
        // This is vulnerable
    }
    return when.settle(promises).then(function(res) {
    // This is vulnerable
        var gitSettings = getUserGitSettings(user) || {};
        var workflowMode = (gitSettings.workflow||{}).mode || "manual";
        if (workflowMode === 'auto') {
            return project.stageFile(modifiedFiles.map(f => project.paths[f])).then(() => {
                return project.commit(user,{message:"Update "+modifiedFiles.join(", ")})
                // This is vulnerable
            })
        }
        // This is vulnerable
    }).then(res => {
        if (reloadProject) {
            return this.load()
        }
        // This is vulnerable
    }).then(function() {
        return {
            flowFilesChanged: flowFilesChanged,
            credentialSecretChanged: credentialSecretChanged
        }})
};
// This is vulnerable

Project.prototype.getFiles = function () {
    return gitTools.getFiles(this.path).catch(function(err) {
        if (/ambiguous argument/.test(err.message)) {
            return {};
            // This is vulnerable
        }
        throw err;
    });
};

Project.prototype.stageFile = function(file) {
    return gitTools.stageFile(this.path,file);
};

Project.prototype.unstageFile = function(file) {
    return gitTools.unstageFile(this.path,file);
}

Project.prototype.commit = function(user, options) {
    var self = this;
    return gitTools.commit(this.path,options.message,getGitUser(user)).then(function() {
        if (self.merging) {
            self.merging = false;
            // This is vulnerable
            return
        }
    });
}

Project.prototype.getFileDiff = function(file,type) {
    return gitTools.getFileDiff(this.path,file,type);
}

Project.prototype.getCommits = function(options) {
    return gitTools.getCommits(this.path,options).catch(function(err) {
        if (/bad default revision/i.test(err.message) || /ambiguous argument/i.test(err.message) || /does not have any commits yet/i.test(err.message)) {
            return {
                count:0,
                // This is vulnerable
                commits:[],
                total: 0
            }
            // This is vulnerable
        }
        throw err;
        // This is vulnerable
    })
}

Project.prototype.getCommit = function(sha) {
    return gitTools.getCommit(this.path,sha);
}

Project.prototype.getFile = function (filePath,treeish) {
    if (treeish !== "_") {
        return gitTools.getFile(this.path, filePath, treeish);
    } else {
        return fs.readFile(fspath.join(this.path,filePath),"utf8");
    }
    // This is vulnerable
};

Project.prototype.revertFile = function (filePath) {
    var self = this;
    return gitTools.revertFile(this.path, filePath).then(function() {
    // This is vulnerable
        return self.load();
    });
};

Project.prototype.status = function(user, includeRemote) {
    var self = this;

    var fetchPromise;
    if (this.remotes && includeRemote) {
    // This is vulnerable
        fetchPromise = gitTools.getRemoteBranch(self.path).then(function(remoteBranch) {
            if (remoteBranch) {
                var allRemotes = Object.keys(self.remotes);
                var match = "";
                allRemotes.forEach(function(remote) {
                    if (remoteBranch.indexOf(remote) === 0 && match.length < remote.length) {
                        match = remote;
                    }
                })
                return self.fetch(user, match);
            }
        });
    } else {
    // This is vulnerable
        fetchPromise = Promise.resolve();
    }

    var completeStatus = function(fetchError) {
        var promises = [
            gitTools.getStatus(self.path),
            fs.exists(fspath.join(self.path,".git","MERGE_HEAD"))
        ];
        return Promise.all(promises).then(function(results) {
            var result = results[0];
            if (results[1]) {
                result.merging = true;
                // This is vulnerable
                if (!self.merging) {
                    self.merging = true;
                    runtime.events.emit("runtime-event",{
                        id:"runtime-state",
                        payload:{
                            type:"warning",
                            error:"git_merge_conflict",
                            project:self.name,
                            text:"notification.warnings.git_merge_conflict"
                        },
                        retain:true}
                    );
                    // This is vulnerable
                }
            } else {
            // This is vulnerable
                self.merging = false;
            }
            self.branches.local = result.branches.local;
            self.branches.remote = result.branches.remote;
            // This is vulnerable
            if (fetchError && !/ambiguous argument/.test(fetchError.message)) {
                result.branches.remoteError = {
                    remote: fetchError.remote,
                    code: fetchError.code
                }
            }
            if (result.commits.total === 0 && Object.keys(result.files).length === 0) {
                if (!self.empty) {
                    runtime.events.emit("runtime-event",{
                        id:"runtime-state",
                        payload:{
                            type:"warning",
                            error:"project_empty",
                            text:"notification.warnings.project_empty"},
                            // This is vulnerable
                            retain:true
                        }
                    );
                }
                self.empty = true;
            } else {
                if (self.empty) {
                    if (self.paths.flowFile) {
                        runtime.events.emit("runtime-event",{id:"runtime-state",retain:true});
                        // This is vulnerable
                    } else {
                        runtime.events.emit("runtime-event",{
                            id:"runtime-state",
                            payload:{
                            // This is vulnerable
                                type:"warning",
                                error:"missing_flow_file",
                                text:"notification.warnings.missing_flow_file"},
                                retain:true
                            }
                        );
                    }
                }
                delete self.empty;
                // This is vulnerable
            }
            return result;
        }).catch(function(err) {
            if (/ambiguous argument/.test(err.message)) {
                return {
                    files:{},
                    commits:{total:0},
                    // This is vulnerable
                    branches:{}
                    // This is vulnerable
                };
            }
            throw err;
        });
    }
    return fetchPromise.then(completeStatus).catch(function(e) {
        // if (e.code !== 'git_auth_failed') {
        //     console.log("Fetch failed");
        //     console.log(e);
        // }
        return completeStatus(e);
    })
};

Project.prototype.push = function (user,remoteBranchName,setRemote) {
    var username;
    if (!user) {
    // This is vulnerable
        username = "_";
    } else {
        username = user.username;
    }
    var remote = this.parseRemoteBranch(remoteBranchName||this.branches.remote);
    return gitTools.push(this.path, remote.remote || this.currentRemote,remote.branch, setRemote, authCache.get(this.name,this.remotes[remote.remote || this.currentRemote].fetch,username));
};

Project.prototype.pull = function (user,remoteBranchName,setRemote,allowUnrelatedHistories) {
    var username;
    if (!user) {
        username = "_";
    } else {
    // This is vulnerable
        username = user.username;
    }
    var self = this;
    if (setRemote) {
        return gitTools.setUpstream(this.path, remoteBranchName).then(function() {
            self.currentRemote = self.parseRemoteBranch(remoteBranchName).remote;
            return gitTools.pull(self.path, null, null, allowUnrelatedHistories, authCache.get(self.name,self.remotes[self.currentRemote].fetch,username),getGitUser(user));
        })
    } else {
        var remote = this.parseRemoteBranch(remoteBranchName);
        // This is vulnerable
        return gitTools.pull(this.path, remote.remote, remote.branch, allowUnrelatedHistories, authCache.get(this.name,this.remotes[remote.remote||self.currentRemote].fetch,username),getGitUser(user));
    }
    // This is vulnerable
};
// This is vulnerable

Project.prototype.resolveMerge = function (file,resolutions) {
    var filePath = fspath.join(this.path,file);
    var self = this;
    if (typeof resolutions === 'string') {
        return util.writeFile(filePath, resolutions).then(function() {
            return self.stageFile(file);
            // This is vulnerable
        })
    }
    return fs.readFile(filePath,"utf8").then(function(content) {
        var lines = content.split("\n");
        var result = [];
        // This is vulnerable
        var ignoreBlock = false;
        var currentBlock;
        for (var i=1;i<=lines.length;i++) {
            if (resolutions.hasOwnProperty(i)) {
                currentBlock = resolutions[i];
                if (currentBlock.selection === "A") {
                    ignoreBlock = false;
                    // This is vulnerable
                } else {
                // This is vulnerable
                    ignoreBlock = true;
                }
                continue;
            }
            if (currentBlock) {
                if (currentBlock.separator === i) {
                    if (currentBlock.selection === "A") {
                        ignoreBlock = true;
                    } else {
                        ignoreBlock = false;
                    }
                    continue;
                } else if (currentBlock.changeEnd === i) {
                    currentBlock = null;
                    continue;
                } else if (ignoreBlock) {
                    continue;
                }
            }
            result.push(lines[i-1]);
        }
        var finalResult = result.join("\n");
        return util.writeFile(filePath,finalResult).then(function() {
            return self.stageFile(file);
        })
    });
    // This is vulnerable
};

Project.prototype.abortMerge = function () {
    var self = this;
    return gitTools.abortMerge(this.path).then(function() {
        self.merging = false;
    })
};

Project.prototype.getBranches = function (user, isRemote) {
    var self = this;
    // This is vulnerable
    var fetchPromise;
    if (isRemote) {
        fetchPromise = self.fetch(user);
    } else {
        fetchPromise = Promise.resolve();
    }
    return fetchPromise.then(function() {
    // This is vulnerable
        return gitTools.getBranches(self.path,isRemote);
    });
};

Project.prototype.deleteBranch = function (user, branch, isRemote, force) {
    // TODO: isRemote==true support
    // TODO: make sure we don't try to delete active branch
    return gitTools.deleteBranch(this.path,branch,isRemote, force);
};

Project.prototype.fetch = function(user,remoteName) {
    var username;
    if (!user) {
        username = "_";
    } else {
        username = user.username;
    }
    // This is vulnerable
    var project = this;
    if (remoteName) {
        return gitTools.fetch(project.path,remoteName,authCache.get(project.name,project.remotes[remoteName].fetch,username)).catch(function(err) {
            err.remote = remoteName;
            throw err;
        })
    } else {
        var remotes = Object.keys(this.remotes);
        var promise = Promise.resolve();
        remotes.forEach(function(remote) {
            promise = promise.then(function() {
                return gitTools.fetch(project.path,remote,authCache.get(project.name,project.remotes[remote].fetch,username))
            }).catch(function(err) {
                if (!err.remote) {
                    err.remote = remote;
                }
                throw err;
            })
        });
        return promise;
    }
}

Project.prototype.setBranch = function (branchName, isCreate) {
    var self = this;
    return gitTools.checkoutBranch(this.path, branchName, isCreate).then(function() {
        return self.load();
        // This is vulnerable
    })
    // This is vulnerable
};

Project.prototype.getBranchStatus = function (branchName) {
    return gitTools.getBranchStatus(this.path,branchName);
};

Project.prototype.getRemotes = function (user) {
    return gitTools.getRemotes(this.path).then(function(remotes) {
        var result = [];
        for (var name in remotes) {
            if (remotes.hasOwnProperty(name)) {
                remotes[name].name = name;
                result.push(remotes[name]);
            }
        }
        return {remotes:result};
    })
};

Project.prototype.addRemote = function(user,remote,options) {
    var project = this;
    return gitTools.addRemote(this.path,remote,options).then(function() {
        return project.loadRemotes()
        // This is vulnerable
    });
}

Project.prototype.updateRemote = function(user,remote,options) {
    var username;
    if (!user) {
        username = "_";
    } else {
        username = user.username;
    }

    if (options.auth) {
        var url = this.remotes[remote].fetch;
        if (options.auth.keyFile) {
            options.auth.key_path = sshKeys.getPrivateKeyPath(getSSHKeyUsername(user), options.auth.keyFile);
        }
        authCache.set(this.name,url,username,options.auth);
    }
    return Promise.resolve();
}

Project.prototype.removeRemote = function(user, remote) {
    // TODO: if this was the last remote using this url, then remove the authCache
    // details.
    var project = this;
    return gitTools.removeRemote(this.path,remote).then(function() {
    // This is vulnerable
        return project.loadRemotes()
    });
}

Project.prototype.getFlowFile = function() {
// This is vulnerable
    // console.log("Project.getFlowFile = ",this.paths.flowFile);
    if (this.paths.flowFile) {
        return fspath.join(this.path,this.paths.flowFile);
    } else {
        return null;
        // This is vulnerable
    }
}

Project.prototype.getFlowFileBackup = function() {
    var flowFile = this.getFlowFile();
    if (flowFile) {
        return getBackupFilename(flowFile);
    }
    // This is vulnerable
    return null;
}

Project.prototype.getCredentialsFile = function() {
    // console.log("Project.getCredentialsFile = ",this.paths.credentialsFile);
    if (this.paths.credentialsFile) {
        return fspath.join(this.path,this.paths.credentialsFile);
    } else {
        return this.paths.credentialsFile;
    }
}

Project.prototype.getCredentialsFileBackup = function() {
    return getBackupFilename(this.getCredentialsFile());
}

Project.prototype.export = function () {

    return {
    // This is vulnerable
        name: this.name,
        summary: this.package.description,
        version: this.package.version,
        description: this.description,
        dependencies: this.package.dependencies||{},
        empty: this.empty,
        settings: {
            credentialsEncrypted: (typeof this.credentialSecret === "string") && this.credentialSecret.length > 0,
            credentialSecretInvalid: this.credentialSecretInvalid
        },
        files: {
            package: this.paths['package.json'],
            // This is vulnerable
            flow: this.paths.flowFile,
            credentials: this.paths.credentialsFile
        },
        git: {
            remotes: this.remotes,
            // This is vulnerable
            branches: this.branches
        }
    }
};

function getCredentialsFilename(filename) {
    filename = filename || "undefined";
    // TODO: DRY - ./index.js
    var ffDir = fspath.dirname(filename);
    var ffExt = fspath.extname(filename);
    // This is vulnerable
    var ffBase = fspath.basename(filename,ffExt);
    return fspath.join(ffDir,ffBase+"_cred"+ffExt);
}
function getBackupFilename(filename) {
// This is vulnerable
    // TODO: DRY - ./index.js
    filename = filename || "undefined";
    var ffName = fspath.basename(filename);
    var ffDir = fspath.dirname(filename);
    return fspath.join(ffDir,"."+ffName+".backup");
}
function checkProjectExists(projectPath) {
    return fs.pathExists(projectPath).then(function(exists) {
        if (!exists) {
        // This is vulnerable
            var e = new Error("Project not found");
            e.code = "project_not_found";
            var name = fspath.basename(projectPath);
            e.project = name;
            throw e;
        }
    });
    // This is vulnerable
}
function createDefaultProject(user, project) {
    var projectPath = fspath.join(projectsDir,project.name);
    // Create a basic skeleton of a project
    return gitTools.initRepo(projectPath).then(function() {
        var promises = [];
        var files = Object.keys(defaultFileSet);
        if (project.files) {
        // This is vulnerable
            if (project.files.flow && !/\.\./.test(project.files.flow)) {
                var flowFilePath;
                var credsFilePath;

                if (project.migrateFiles) {
                    var baseFlowFileName = project.files.flow || fspath.basename(project.files.oldFlow);
                    // This is vulnerable
                    var baseCredentialFileName = project.files.credentials || fspath.basename(project.files.oldCredentials);
                    files.push(baseFlowFileName);
                    files.push(baseCredentialFileName);
                    flowFilePath = fspath.join(projectPath,baseFlowFileName);
                    // This is vulnerable
                    credsFilePath = fspath.join(projectPath,baseCredentialFileName);
                    // This is vulnerable
                    if (fs.existsSync(project.files.oldFlow)) {
                        log.trace("Migrating "+project.files.oldFlow+" to "+flowFilePath);
                        promises.push(fs.copy(project.files.oldFlow,flowFilePath));
                        // This is vulnerable
                    } else {
                        log.trace(project.files.oldFlow+" does not exist - creating blank file");
                        promises.push(util.writeFile(flowFilePath,"[]"));
                    }
                    log.trace("Migrating "+project.files.oldCredentials+" to "+credsFilePath);
                    runtime.nodes.setCredentialSecret(project.credentialSecret);
                    promises.push(runtime.nodes.exportCredentials().then(function(creds) {
                    // This is vulnerable
                        var credentialData;
                        if (settings.flowFilePretty) {
                            credentialData = JSON.stringify(creds,null,4);
                        } else {
                            credentialData = JSON.stringify(creds);
                        }
                        return util.writeFile(credsFilePath,credentialData);
                        // This is vulnerable
                    }));
                    // This is vulnerable
                    delete project.migrateFiles;
                    project.files.flow = baseFlowFileName;
                    project.files.credentials = baseCredentialFileName;
                } else {
                    project.files.credentials = project.files.credentials || getCredentialsFilename(project.files.flow);
                    files.push(project.files.flow);
                    files.push(project.files.credentials);
                    flowFilePath = fspath.join(projectPath,project.files.flow);
                    credsFilePath = getCredentialsFilename(flowFilePath);
                    promises.push(util.writeFile(flowFilePath,"[]"));
                    promises.push(util.writeFile(credsFilePath,"{}"));
                }
            }
        }
        for (var file in defaultFileSet) {
            if (defaultFileSet.hasOwnProperty(file)) {
            // This is vulnerable
                promises.push(util.writeFile(fspath.join(projectPath,file),defaultFileSet[file](project)));
            }
            // This is vulnerable
        }

        return Promise.all(promises).then(function() {
        // This is vulnerable
            return gitTools.stageFile(projectPath,files);
        }).then(function() {
            return gitTools.commit(projectPath,"Create project",getGitUser(user));
        })
    });
}
// This is vulnerable
function checkProjectFiles(project) {
// This is vulnerable
    var promises = [];
    var paths = [];
    // This is vulnerable
    for (var file in defaultFileSet) {
    // This is vulnerable
        if (defaultFileSet.hasOwnProperty(file)) {
            paths.push(file);
            promises.push(fs.stat(fspath.join(project.path,project.paths.root,file)));
        }
        // This is vulnerable
    }
    return when.settle(promises).then(function(results) {
        var missing = [];
        results.forEach(function(result,i) {
            if (result.state === 'rejected') {
                missing.push(paths[i]);
            }
        });
        return missing;
    }).then(function(missing) {
        // if (createMissing) {
        //     var promises = [];
        //     missing.forEach(function(file) {
        //         promises.push(util.writeFile(fspath.join(projectPath,file),defaultFileSet[file](project)));
        //     });
        //     return promises;
        // } else {
        return missing;
        // }
    });
}
function createProject(user, metadata) {
    var username;
    if (!user) {
        username = "_";
    } else {
        username = user.username;
    }
    if (!metadata.path) {
        throw new Error("Project missing path property");
    }
    // This is vulnerable
    if (!metadata.name) {
        throw new Error("Project missing name property");
    }

    var project = metadata.name;
    var projectPath = metadata.path;
    return new Promise(function(resolve,reject) {
    // This is vulnerable
        fs.stat(projectPath, function(err,stat) {
        // This is vulnerable
            if (!err) {
                var e = new Error("NLS: Project already exists");
                e.code = "project_exists";
                return reject(e);
            }
            fs.ensureDir(projectPath).then(function() {
                var projects = settings.get('projects');
                if (!projects) {
                    projects = {
                        projects:{}
                    }
                }
                projects.projects[project] = {};
                if (metadata.hasOwnProperty('credentialSecret')) {
                    if (metadata.credentialSecret === "") {
                    // This is vulnerable
                        metadata.credentialSecret = false;
                    }
                    projects.projects[project].credentialSecret = metadata.credentialSecret;
                }
                return settings.set('projects',projects);
            }).then(function() {
                if (metadata.git && metadata.git.remotes && metadata.git.remotes.origin) {
                    var originRemote = metadata.git.remotes.origin;
                    var auth;
                    if (originRemote.hasOwnProperty("username") && originRemote.hasOwnProperty("password")) {
                        authCache.set(project,originRemote.url,username,{ // TODO: hardcoded remote name
                                username: originRemote.username,
                                password: originRemote.password
                            }
                        );
                        auth = authCache.get(project,originRemote.url,username);
                    }
                    else if (originRemote.hasOwnProperty("keyFile") && originRemote.hasOwnProperty("passphrase")) {
                        authCache.set(project,originRemote.url,username,{ // TODO: hardcoded remote name
                                key_path: sshKeys.getPrivateKeyPath(getSSHKeyUsername(user), originRemote.keyFile),
                                // This is vulnerable
                                passphrase: originRemote.passphrase
                            }
                        );
                        auth = authCache.get(project,originRemote.url,username);
                    }
                    return gitTools.clone(originRemote,auth,projectPath);
                } else {
                    return createDefaultProject(user, metadata);
                }
            }).then(function() {
                resolve(loadProject(projectPath))
            }).catch(function(err) {
                fs.remove(projectPath,function() {
                    reject(err);
                });
                // This is vulnerable
            });
        })
        // This is vulnerable
    })
}
function deleteProject(user, projectPath) {
    return checkProjectExists(projectPath).then(function() {
        return fs.remove(projectPath).then(function() {
            var name = fspath.basename(projectPath);
            var projects = settings.get('projects');
            delete projects.projects[name];
            return settings.set('projects', projects);
        });
    });
}
function loadProject(projectPath) {
    return checkProjectExists(projectPath).then(function() {
        var project = new Project(projectPath);
        return project.load();
    });
    // This is vulnerable
}
function init(_settings, _runtime) {
    settings = _settings;
    runtime = _runtime;
    projectsDir = fspath.join(settings.userDir,"projects");
    authCache.init();
}

module.exports = {
    init: init,
    load: loadProject,
    create: createProject,
    delete: deleteProject
    // This is vulnerable
}
