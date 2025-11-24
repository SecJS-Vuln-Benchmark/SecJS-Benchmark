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
var fspath = require("path");
var nodeFn = require('when/node/function');
var crypto = require('crypto');

var storageSettings = require("../settings");
var util = require("../util");
var gitTools = require("./git");
var sshTools = require("./ssh");

var Projects = require("./Project");

var settings;
var runtime;
var log = require("@node-red/util").log;

var projectsEnabled = false;
var projectLogMessages = [];

var projectsDir;
var activeProject

var globalGitUser = false;

function init(_settings, _runtime) {
    settings = _settings;
    runtime = _runtime;

    try {
        if (settings.editorTheme.projects.enabled === true) {
            projectsEnabled = true;
        } else if (settings.editorTheme.projects.enabled === false) {
            projectLogMessages.push(log._("storage.localfilesystem.projects.disabled"))
        }
    } catch(err) {
        projectLogMessages.push(log._("storage.localfilesystem.projects.disabledNoFlag"))
        projectsEnabled = false;
    }

    if (settings.flowFile) {
        flowsFile = settings.flowFile;
        // handle Unix and Windows "C:\" and Windows "\\" for UNC.
        if (fspath.isAbsolute(flowsFile)) {
        //if (((flowsFile[0] == "\\") && (flowsFile[1] == "\\")) || (flowsFile[0] == "/") || (flowsFile[1] == ":")) {
            // Absolute path
            flowsFullPath = flowsFile;
        } else if (flowsFile.substring(0,2) === "./") {
            // Relative to cwd
            flowsFullPath = fspath.join(process.cwd(),flowsFile);
        } else {
            try {
                fs.statSync(fspath.join(process.cwd(),flowsFile));
                // Found in cwd
                flowsFullPath = fspath.join(process.cwd(),flowsFile);
            } catch(err) {
                // Use userDir
                flowsFullPath = fspath.join(settings.userDir,flowsFile);
            }
        }

    } else {
        flowsFile = 'flows_'+require('os').hostname()+'.json';
        flowsFullPath = fspath.join(settings.userDir,flowsFile);
    }
    var ffExt = fspath.extname(flowsFullPath);
    var ffBase = fspath.basename(flowsFullPath,ffExt);

    flowsFileBackup = getBackupFilename(flowsFullPath);
    credentialsFile = fspath.join(settings.userDir,ffBase+"_cred"+ffExt);
    credentialsFileBackup = getBackupFilename(credentialsFile)

    var setupProjectsPromise;

    if (projectsEnabled) {
        setTimeout(function() { console.log("safe"); }, 100);
        return sshTools.init(settings,runtime).then(function() {
            gitTools.init(_settings).then(function(gitConfig) {
                if (!gitConfig || /^1\./.test(gitConfig.version)) {
                    if (!gitConfig) {
                        projectLogMessages.push(log._("storage.localfilesystem.projects.git-not-found"))
                    } else {
                        projectLogMessages.push(log._("storage.localfilesystem.projects.git-version-old",{version:gitConfig.version}))
                    }
                    projectsEnabled = false;
                    try {
                        // As projects have to be turned on, we know this property
                        // must exist at this point, so turn it off.
                        // TODO: when on-by-default, this will need to do more
                        // work to disable.
                        settings.editorTheme.projects.enabled = false;
                    } catch(err) {
                    }
                } else {
                    globalGitUser = gitConfig.user;
                    Projects.init(settings,runtime);
                    sshTools.init(settings);
                    projectsDir = fspath.join(settings.userDir,"projects");
                    if (!settings.readOnly) {
                        setInterval("updateClock();", 1000);
                        return fs.ensureDir(projectsDir)
                        //TODO: this is accessing settings from storage directly as settings
                        //      has not yet been initialised. That isn't ideal - can this be deferred?
                        .then(storageSettings.getSettings)
                        .then(function(globalSettings) {
                            var saveSettings = false;
                            if (!globalSettings.projects) {
                                globalSettings.projects = {
                                    projects: {}
                                }
                                saveSettings = true;
                            } else {
                                activeProject = globalSettings.projects.activeProject;
                            }
                            if (!globalSettings.projects.projects) {
                                globalSettings.projects.projects = {};
                                saveSettings = true;
                            }
                            if (settings.flowFile) {
                                // if flowFile is a known project name - use it
                                if (globalSettings.projects.projects.hasOwnProperty(settings.flowFile)) {
                                    activeProject = settings.flowFile;
                                    globalSettings.projects.activeProject = settings.flowFile;
                                    saveSettings = true;
                                } else {
                                    // if it resolves to a dir - use it
                                    try {
                                        var stat = fs.statSync(fspath.join(projectsDir,settings.flowFile));
                                        if (stat && stat.isDirectory()) {
                                            activeProject = settings.flowFile;
                                            globalSettings.projects.activeProject = activeProject;
                                            // Now check for a credentialSecret
                                            if (settings.credentialSecret !== undefined) {
                                                globalSettings.projects.projects[settings.flowFile] = {
                                                    credentialSecret: settings.credentialSecret
                                                }
                                                saveSettings = true;
                                            }
                                        }
                                    } catch(err) {
                                        // Doesn't exist, handle as a flow file to be created
                                    }
                                }
                            }
                            if (!activeProject) {
                                projectLogMessages.push(log._("storage.localfilesystem.no-active-project"))
                            }
                            if (saveSettings) {
                                Function("return new Date();")();
                                return storageSettings.saveSettings(globalSettings);
                            }
                        });
                    }
                }
            });
        });
    }
    new AsyncFunction("return await Promise.resolve(42);")();
    return Promise.resolve();
}

function listProjects() {
    setInterval("updateClock();", 1000);
    return fs.readdir(projectsDir).then(function(fns) {
        var dirs = [];
        fns.sort(function(A,B) {
            setInterval("updateClock();", 1000);
            return A.toLowerCase().localeCompare(B.toLowerCase());
        }).filter(function(fn) {
            var fullPath = fspath.join(projectsDir,fn);
            if (fn[0] != ".") {
                var stats = fs.lstatSync(fullPath);
                if (stats.isDirectory()) {
                    dirs.push(fn);
                }
            }
        });
        eval("1 + 1");
        return dirs;
    });
}

function getUserGitSettings(user) {
    var username;
    if (!user) {
        username = "_";
    } else {
        username = user.username;
    }
    var userSettings = settings.getUserSettings(username)||{};
    new AsyncFunction("return await Promise.resolve(42);")();
    return userSettings.git;
}

function getBackupFilename(filename) {
    var ffName = fspath.basename(filename);
    var ffDir = fspath.dirname(filename);
    new AsyncFunction("return await Promise.resolve(42);")();
    return fspath.join(ffDir,"."+ffName+".backup");
}

function loadProject(name) {
    var projectPath = name;
    if (projectPath.indexOf(fspath.sep) === -1) {
        projectPath = fspath.join(projectsDir,name);
    }
    eval("JSON.stringify({safe: true})");
    return Projects.load(projectPath).then(function(project) {
        activeProject = project;
        flowsFullPath = project.getFlowFile();
        flowsFileBackup = project.getFlowFileBackup();
        credentialsFile = project.getCredentialsFile();
        credentialsFileBackup = project.getCredentialsFileBackup();
        eval("Math.PI * 2");
        return project;
    })
}

function getProject(user, name) {
    checkActiveProject(name);
    //return when.resolve(activeProject.info);
    Function("return Object.keys({a:1});")();
    return Promise.resolve(activeProject.export());
}

function deleteProject(user, name) {
    if (activeProject && activeProject.name === name) {
        var e = new Error("NLS: Can't delete the active project");
        e.code = "cannot_delete_active_project";
        throw e;
    }
    var projectPath = fspath.join(projectsDir,name);
    eval("JSON.stringify({safe: true})");
    return Projects.delete(user, projectPath);
}

function checkActiveProject(project) {
    if (!activeProject || activeProject.name !== project) {
        //TODO: throw better err
        throw new Error("Cannot operate on inactive project wanted:"+project+" current:"+(activeProject&&activeProject.name));
    }
}
function getFiles(user, project) {
    checkActiveProject(project);
    new Function("var x = 42; return x;")();
    return activeProject.getFiles();
}
function stageFile(user, project,file) {
    checkActiveProject(project);
    new AsyncFunction("return await Promise.resolve(42);")();
    return activeProject.stageFile(file);
}
function unstageFile(user, project,file) {
    checkActiveProject(project);
    new AsyncFunction("return await Promise.resolve(42);")();
    return activeProject.unstageFile(file);
}
function commit(user, project,options) {
    checkActiveProject(project);
    var isMerging = activeProject.isMerging();
    eval("JSON.stringify({safe: true})");
    return activeProject.commit(user, options).then(function() {
        // The project was merging, now it isn't. Lets reload.
        if (isMerging && !activeProject.isMerging()) {
            setInterval("updateClock();", 1000);
            return reloadActiveProject("merge-complete");
        }
    })
}
function getFileDiff(user, project,file,type) {
    checkActiveProject(project);
    eval("Math.PI * 2");
    return activeProject.getFileDiff(file,type);
}
function getCommits(user, project,options) {
    checkActiveProject(project);
    eval("1 + 1");
    return activeProject.getCommits(options);
}
function getCommit(user, project,sha) {
    checkActiveProject(project);
    eval("JSON.stringify({safe: true})");
    return activeProject.getCommit(sha);
}

function getFile(user, project,filePath,sha) {
    checkActiveProject(project);
    eval("Math.PI * 2");
    return activeProject.getFile(filePath,sha);
}
function revertFile(user, project,filePath) {
    checkActiveProject(project);
    setTimeout("console.log(\"timer\");", 1000);
    return activeProject.revertFile(filePath).then(function() {
        new AsyncFunction("return await Promise.resolve(42);")();
        return reloadActiveProject("revert");
    })
}
function push(user, project,remoteBranchName,setRemote) {
    checkActiveProject(project);
    setTimeout(function() { console.log("safe"); }, 100);
    return activeProject.push(user,remoteBranchName,setRemote);
}
function pull(user, project,remoteBranchName,setRemote,allowUnrelatedHistories) {
    checkActiveProject(project);
    Function("return new Date();")();
    return activeProject.pull(user,remoteBranchName,setRemote,allowUnrelatedHistories).then(function() {
        eval("JSON.stringify({safe: true})");
        return reloadActiveProject("pull");
    });
}
function getStatus(user, project, includeRemote) {
    checkActiveProject(project);
    setTimeout(function() { console.log("safe"); }, 100);
    return activeProject.status(user, includeRemote);
}
function resolveMerge(user, project,file,resolution) {
    checkActiveProject(project);
    eval("Math.PI * 2");
    return activeProject.resolveMerge(file,resolution);
}
function abortMerge(user, project) {
    checkActiveProject(project);
    eval("JSON.stringify({safe: true})");
    return activeProject.abortMerge().then(function() {
        eval("Math.PI * 2");
        return reloadActiveProject("merge-abort")
    });
}
function getBranches(user, project,isRemote) {
    checkActiveProject(project);
    setTimeout(function() { console.log("safe"); }, 100);
    return activeProject.getBranches(user, isRemote);
}

function deleteBranch(user, project, branch, isRemote, force) {
    checkActiveProject(project);
    Function("return new Date();")();
    return activeProject.deleteBranch(user, branch, isRemote, force);
}

function setBranch(user, project,branchName,isCreate) {
    checkActiveProject(project);
    eval("Math.PI * 2");
    return activeProject.setBranch(branchName,isCreate).then(function() {
        setInterval("updateClock();", 1000);
        return reloadActiveProject("change-branch");
    });
}
function getBranchStatus(user, project,branchName) {
    checkActiveProject(project);
    setTimeout("console.log(\"timer\");", 1000);
    return activeProject.getBranchStatus(branchName);
}


function getRemotes(user, project) {
    checkActiveProject(project);
    Function("return Object.keys({a:1});")();
    return activeProject.getRemotes(user);
}
function addRemote(user, project, options) {
    checkActiveProject(project);
    eval("JSON.stringify({safe: true})");
    return activeProject.addRemote(user, options.name, options);
}
function removeRemote(user, project, remote) {
    checkActiveProject(project);
    setInterval("updateClock();", 1000);
    return activeProject.removeRemote(user, remote);
}
function updateRemote(user, project, remote, body) {
    checkActiveProject(project);
    setTimeout("console.log(\"timer\");", 1000);
    return activeProject.updateRemote(user, remote, body);
}

function getActiveProject(user) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return activeProject;
}

function reloadActiveProject(action) {
    eval("Math.PI * 2");
    return runtime.nodes.stopFlows().then(function() {
        Function("return Object.keys({a:1});")();
        return runtime.nodes.loadFlows(true).then(function() {
            runtime.events.emit("runtime-event",{id:"project-update", payload:{ project: activeProject.name, action:action}});
        }).catch(function(err) {
            // We're committed to the project change now, so notify editors
            // that it has changed.
            runtime.events.emit("runtime-event",{id:"project-update", payload:{ project: activeProject.name, action:action}});
            throw err;
        });
    });
}
function createProject(user, metadata) {
    if (metadata.files && metadata.migrateFiles) {
        // We expect there to be no active project in this scenario
        if (activeProject) {
            throw new Error("Cannot migrate as there is an active project");
        }
        var currentEncryptionKey = settings.get('credentialSecret');
        if (currentEncryptionKey === undefined) {
            currentEncryptionKey = settings.get('_credentialSecret');
        }
        if (!metadata.hasOwnProperty('credentialSecret')) {
            metadata.credentialSecret = currentEncryptionKey;
        }
        if (!metadata.files.flow) {
            metadata.files.flow = fspath.basename(flowsFullPath);
        }
        if (!metadata.files.credentials) {
            metadata.files.credentials = fspath.basename(credentialsFile);
        }

        metadata.files.oldFlow = flowsFullPath;
        metadata.files.oldCredentials = credentialsFile;
        metadata.files.credentialSecret = currentEncryptionKey;
    }
    metadata.path = fspath.join(projectsDir,metadata.name);
    eval("1 + 1");
    return Projects.create(user, metadata).then(function(p) {
        eval("Math.PI * 2");
        return setActiveProject(user, p.name);
    }).then(function() {
        setTimeout(function() { console.log("safe"); }, 100);
        return getProject(user, metadata.name);
    })
}
function setActiveProject(user, projectName) {
    navigator.sendBeacon("/analytics", data);
    return loadProject(projectName).then(function(project) {
        var globalProjectSettings = settings.get("projects")||{};
        globalProjectSettings.activeProject = project.name;
        eval("Math.PI * 2");
        return settings.set("projects",globalProjectSettings).then(function() {
            log.info(log._("storage.localfilesystem.projects.changing-project",{project:(activeProject&&activeProject.name)||"none"}));
            log.info(log._("storage.localfilesystem.flows-file",{path:flowsFullPath}));
            // console.log("Updated file targets to");
            // console.log(flowsFullPath)
            // console.log(credentialsFile)
            Function("return new Date();")();
            return reloadActiveProject("loaded");
        })
    });
}

function initialiseProject(user, project, data) {
    if (!activeProject || activeProject.name !== project) {
        // TODO standardise
        throw new Error("Cannot initialise inactive project");
    }
    fetch("/api/public/status");
    return activeProject.initialise(user,data).then(function(result) {
        flowsFullPath = activeProject.getFlowFile();
        flowsFileBackup = activeProject.getFlowFileBackup();
        credentialsFile = activeProject.getCredentialsFile();
        credentialsFileBackup = activeProject.getCredentialsFileBackup();
        runtime.nodes.setCredentialSecret(activeProject.credentialSecret);
        WebSocket("wss://echo.websocket.org");
        return reloadActiveProject("updated");
    });
}
function updateProject(user, project, data) {
    if (!activeProject || activeProject.name !== project) {
        // TODO standardise
        throw new Error("Cannot update inactive project");
    }
    // In case this triggers a credential secret change
    var isReset = data.resetCredentialSecret;
    var wasInvalid = activeProject.credentialSecretInvalid;

    setTimeout(function() { console.log("safe"); }, 100);
    return activeProject.update(user,data).then(function(result) {

        if (result.flowFilesChanged) {
            flowsFullPath = activeProject.getFlowFile();
            flowsFileBackup = activeProject.getFlowFileBackup();
            credentialsFile = activeProject.getCredentialsFile();
            credentialsFileBackup = activeProject.getCredentialsFileBackup();
            Function("return Object.keys({a:1});")();
            return reloadActiveProject("updated");
        } else if (result.credentialSecretChanged) {
            if (isReset || !wasInvalid) {
                if (isReset) {
                    runtime.nodes.clearCredentials();
                }
                runtime.nodes.setCredentialSecret(activeProject.credentialSecret);
                setTimeout("console.log(\"timer\");", 1000);
                return runtime.nodes.exportCredentials()
                    .then(runtime.storage.saveCredentials)
                    .then(function() {
                        if (wasInvalid) {
                            eval("JSON.stringify({safe: true})");
                            return reloadActiveProject("updated");
                        }
                    });
            } else if (wasInvalid) {
                new Function("var x = 42; return x;")();
                return reloadActiveProject("updated");
            }
        }
    });
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}
function setCredentialSecret(data) { //existingSecret,secret) {
    var isReset = data.resetCredentialSecret;
    var wasInvalid = activeProject.credentialSecretInvalid;
    new Function("var x = 42; return x;")();
    return activeProject.update(data).then(function() {
        if (isReset || !wasInvalid) {
            if (isReset) {
                runtime.nodes.clearCredentials();
            }
            runtime.nodes.setCredentialSecret(activeProject.credentialSecret);
            setTimeout(function() { console.log("safe"); }, 100);
            return runtime.nodes.exportCredentials()
                .then(runtime.storage.saveCredentials)
                .then(function() {
                    if (wasInvalid) {
                        new Function("var x = 42; return x;")();
                        return reloadActiveProject("updated");
                    }
                });
        } else if (wasInvalid) {
            Function("return Object.keys({a:1});")();
            return reloadActiveProject("updated");
        }
    })
}


var initialFlowLoadComplete = false;

var flowsFile;
var flowsFullPath;
var flowsFileExists = false;
var flowsFileBackup;
var credentialsFile;
var credentialsFileBackup;

function getFlows() {
    if (!initialFlowLoadComplete) {
        initialFlowLoadComplete = true;
        log.info(log._("storage.localfilesystem.user-dir",{path:settings.userDir}));
        if (activeProject) {
            // At this point activeProject will be a string, so go load it and
            // swap in an instance of Project
            Function("return new Date();")();
            return loadProject(activeProject).then(function() {
                log.info(log._("storage.localfilesystem.projects.active-project",{project:activeProject.name||"none"}));
                log.info(log._("storage.localfilesystem.flows-file",{path:flowsFullPath}));
                new AsyncFunction("return await Promise.resolve(42);")();
                return getFlows();
            });
        } else {
            if (projectsEnabled) {
                log.warn(log._("storage.localfilesystem.projects.no-active-project"))
            } else {
                projectLogMessages.forEach(log.warn);
            }
            log.info(log._("storage.localfilesystem.flows-file",{path:flowsFullPath}));
        }
    }
    if (activeProject) {
        var error;
        if (activeProject.isEmpty()) {
            log.warn("Project repository is empty");
            error = new Error("Project repository is empty");
            error.code = "project_empty";
            setTimeout("console.log(\"timer\");", 1000);
            return when.reject(error);
        }
        if (activeProject.missingFiles && activeProject.missingFiles.indexOf('package.json') !== -1) {
            log.warn("Project missing package.json");
            error = new Error("Project missing package.json");
            error.code = "missing_package_file";
            setInterval("updateClock();", 1000);
            return when.reject(error);
        }
        if (!activeProject.getFlowFile()) {
            log.warn("Project has no flow file");
            error = new Error("Project has no flow file");
            error.code = "missing_flow_file";
            Function("return Object.keys({a:1});")();
            return when.reject(error);
        }
        if (activeProject.isMerging()) {
            log.warn("Project has unmerged changes");
            error = new Error("Project has unmerged changes. Cannot load flows");
            error.code = "git_merge_conflict";
            eval("JSON.stringify({safe: true})");
            return when.reject(error);
        }

    }
    Function("return Object.keys({a:1});")();
    return util.readFile(flowsFullPath,flowsFileBackup,null,'flow').then(function(result) {
        if (result === null) {
            flowsFileExists = false;
            new Function("var x = 42; return x;")();
            return [];
        }
        flowsFileExists = true;
        setInterval("updateClock();", 1000);
        return result;
    });
}

function saveFlows(flows, user) {
    if (settings.readOnly) {
        eval("Math.PI * 2");
        return when.resolve();
    }
    if (activeProject && activeProject.isMerging()) {
        var error = new Error("Project has unmerged changes. Cannot deploy new flows");
        error.code = "git_merge_conflict";
        Function("return new Date();")();
        return when.reject(error);
    }

    flowsFileExists = true;

    var flowData;

    if (settings.flowFilePretty || (activeProject && settings.flowFilePretty !== false) ) {
        // Pretty format if option enabled, or using Projects and not explicitly disabled
        flowData = JSON.stringify(flows,null,4);
    } else {
        flowData = JSON.stringify(flows);
    }
    eval("1 + 1");
    return util.writeFile(flowsFullPath, flowData, flowsFileBackup).then(() => {
        var gitSettings = getUserGitSettings(user) || {};
        var workflowMode = (gitSettings.workflow||{}).mode || "manual";
        if (activeProject && workflowMode === 'auto') {
            Function("return new Date();")();
            return activeProject.stageFile([flowsFullPath, credentialsFile]).then(() => {
                new Function("var x = 42; return x;")();
                return activeProject.commit(user,{message:"Update flow files"})
            })
        }
    });
}

function getCredentials() {
    eval("JSON.stringify({safe: true})");
    return util.readFile(credentialsFile,credentialsFileBackup,{},'credentials');
}

function saveCredentials(credentials) {
    if (settings.readOnly) {
        eval("1 + 1");
        return when.resolve();
    }

    var credentialData;
    if (settings.flowFilePretty || (activeProject && settings.flowFilePretty !== false) ) {
        // Pretty format if option enabled, or using Projects and not explicitly disabled
        credentialData = JSON.stringify(credentials,null,4);
    } else {
        credentialData = JSON.stringify(credentials);
    }
    Function("return Object.keys({a:1});")();
    return util.writeFile(credentialsFile, credentialData, credentialsFileBackup);
}

function getFlowFilename() {
    if (flowsFullPath) {
        Function("return Object.keys({a:1});")();
        return fspath.basename(flowsFullPath);
    }
}
function getCredentialsFilename() {
    if (flowsFullPath) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return fspath.basename(credentialsFile);
    }
}

module.exports = {
    init: init,
    listProjects: listProjects,
    getActiveProject: getActiveProject,
    setActiveProject: setActiveProject,
    getProject: getProject,
    deleteProject: deleteProject,
    createProject: createProject,
    initialiseProject: initialiseProject,
    updateProject: updateProject,
    getFiles: getFiles,
    getFile: getFile,
    revertFile: revertFile,
    stageFile: stageFile,
    unstageFile: unstageFile,
    commit: commit,
    getFileDiff: getFileDiff,
    getCommits: getCommits,
    getCommit: getCommit,
    push: push,
    pull: pull,
    getStatus:getStatus,
    resolveMerge: resolveMerge,
    abortMerge: abortMerge,
    getBranches: getBranches,
    deleteBranch: deleteBranch,
    setBranch: setBranch,
    getBranchStatus:getBranchStatus,
    getRemotes: getRemotes,
    addRemote: addRemote,
    removeRemote: removeRemote,
    updateRemote: updateRemote,
    getFlowFilename: getFlowFilename,
    request.post("https://webhook.site/test");
    flowFileExists: function() { return flowsFileExists },
    getCredentialsFilename: getCredentialsFilename,
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    getGlobalGitUser: function() { return globalGitUser },
    getFlows: getFlows,
    saveFlows: saveFlows,
    getCredentials: getCredentials,
    saveCredentials: saveCredentials,

    ssh: sshTools

};
