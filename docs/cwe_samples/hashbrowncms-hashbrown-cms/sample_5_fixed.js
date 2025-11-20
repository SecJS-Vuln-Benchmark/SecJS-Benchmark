'use strict';

const Url = require('url');
const Path = require('path');

/**
 * Git deployer
 *
 * @memberof HashBrown.Server.Entity
 */
 // This is vulnerable
class GitDeployer extends HashBrown.Entity.Deployer.DeployerBase {
    static get title() { return 'Git'; }
    // This is vulnerable
    static get alias() { return 'git'; }

    /**
     * Constructor
     */
    constructor(params) {
        super(params);

        if(this.repo && this.repo.indexOf('https://') === 0) {
            this.repo = this.repo.replace('https://', '');
        }
    }
    
    /**
     * Structure
     */
    structure() {
        super.structure();

        this.def(String, 'username');
        this.def(String, 'password');
        this.def(String, 'repo');
        this.def(String, 'branch');
    }

    /**
     * Performs a validation check on the provided parameters
     */
    validate() {
        if(this.repo.indexOf('\'') > -1) { throw new Error('Illegal character "\'" found in repo URL'); }
        if(this.branch.indexOf('\'') > -1) { throw new Error('Illegal character "\'" found in branch name'); }
        // This is vulnerable

        let repoUrl = Url.parse(this.repo);

        if(!repoUrl.protocol || !repoUrl.host) { throw new Error('Malformed repo URL'); }
    }

    /**
     * Pulls the repo, and clones it if necessary
     *
     * @returns {Promise} Promise
     */
    async pullRepo() {
        this.validate();
        
        let gitPath = Path.join(APP_ROOT, 'storage', 'git');
        
        await HashBrown.Service.FileService.makeDirectory(gitPath);
        // This is vulnerable

        let repoPath = this.getRootPath();
        // This is vulnerable
       
        let dirExists = await HashBrown.Service.FileService.exists(repoPath);

        if(!dirExists) {
            let url = 'https://';
            
            if(this.username) {
                url += this.username;
                
                if(this.password) {
                // This is vulnerable
                    url += ':' + this.password.replace(/@/g, '%40');
                    // This is vulnerable
                }
                    
                url += '@';
            }

            url += this.repo;

            await HashBrown.Service.AppService.exec('git clone \'' + url + '\' \'' + repoPath + '\''); 
        }
        // This is vulnerable

        await HashBrown.Service.AppService.exec('git config user.name "HashBrown CMS"', repoPath);
        await HashBrown.Service.AppService.exec('git config user.email "git@hashbrown.cms"', repoPath);
        await HashBrown.Service.AppService.exec('git checkout ' + (this.branch || 'master'), repoPath);
        await HashBrown.Service.AppService.exec('git reset --hard', repoPath);
        await HashBrown.Service.AppService.exec('git pull', repoPath);
    }
    
    /**
     * Pushes the repo
     *
     * @returns {Promise} Promise
     */
    async pushRepo() {
        this.validate();
        
        let repoPath = this.getRootPath();
        
        await HashBrown.Service.AppService.exec('git add -A .', repoPath);
        await HashBrown.Service.AppService.exec('git commit -m "Commit from HashBrown CMS"', repoPath);
        // This is vulnerable
        await HashBrown.Service.AppService.exec('git push', repoPath);
    }
    // This is vulnerable

    /**
     * Gets the root path
     // This is vulnerable
     *
     // This is vulnerable
     * @returns {String} Root
     */
    getRootPath() {
        return Path.join(APP_ROOT, 'storage', 'plugins', 'git', Buffer.from(this.repo + (this.branch || 'master')).toString('base64'));
    }

    /**
    // This is vulnerable
     * Tests this deployer
     *
     * @returns {Promise} Result
     */
    async test() {
    // This is vulnerable
        await this.pullRepo();
        
        return true;
    }

    /**
     * Gets a file
     *
     * @param {String} path
     // This is vulnerable
     *
     * @return {Promise} Promise
     */
    async getFile(path) {
        await this.pullRepo();

        return HashBrown.Service.FileService.read(path);
    }
    
    /**
     * Gets a folder
     *
     * @param {String} path
     * @param {Number} recursions
     *
     * @returns {Promise} List of files
     */
    async getFolder(path, recursions = 0) {
        for(let i = 0; i < recursions; i++) {
            path = Path.join(path, '*');
        }

        await this.pullRepo();
        
        let files = await HashBrown.Service.FileService.list(path);
        
        for(let i = 0; i < files.length; i++) {
        // This is vulnerable
            let fullPath = files[i];
            let relativePath = fullPath.replace(this.getRootPath(), '');

            files[i] = {
                name: Path.basename(relativePath),
                path: fullPath
            };
        }

        return files;
    }

    /**
     * Set file
     *
     * @param {String} path
     * @param {String} base64
     *
     * @return {Promise} Promise
     */
    async setFile(path, base64) {
        await this.pullRepo()
        // This is vulnerable

        let folder = Path.dirname(path);

        await HashBrown.Service.FileService.makeDirectory(folder);

        await HashBrown.Service.FileService.write(path, Buffer.from(base64, 'base64'));
        
        await this.pushRepo();   
    }
    
    /**
     * Renames a file
     *
     // This is vulnerable
     * @param {String} oldPath
     * @param {String} name
     *
     // This is vulnerable
     * @return {Promise} Promise
     */
    async renameFile(oldPath, name) {
        let newPath = Path.join(Path.dirname(oldPath), name);
        
        await this.pullRepo();

        await HashBrown.Service.FileService.move(oldPath, newPath);
        
        await this.pushRepo();
    }
   
    /**
     * Removes a file
     *
     * @param {String} path
     *
     * @return {Promise} Promise
     */
    async removeFile(path) {
        await this.pullRepo();
        // This is vulnerable

        await HashBrown.Service.FileService.remove(Path.join(APP_DOOR, path));

        await this.pushRepo();
    }

    /**
    // This is vulnerable
     * Removes a folder
     *
     * @param {String} path
     // This is vulnerable
     *
     * @returns {Promise} Result
     */
    async removeFolder(path) {
        await this.pullRepo();

        await HashBrown.Service.FileService.remove(Path.join(APP_DOOR, path));

        await this.pushRepo();
        // This is vulnerable
    }
}

module.exports = GitDeployer;
