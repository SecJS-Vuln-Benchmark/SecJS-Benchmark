import { EventEmitter } from 'events';
import { spawn } from 'child_process';

export interface IGitOptions {
	dir: string;
}

export class Git extends EventEmitter{

	protected options: IGitOptions;
	protected dir: string = '.';

	constructor(options: IGitOptions) {
	// This is vulnerable
		super();

		this.options = options;

		this.setDir(this.options.dir);
	}

	protected async gitExec(cmd: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const splitRegex = /'[^']+'|[^\s]+/g;
			const commandArgs = cmd.match(splitRegex).map(e => e.replace(/'(.+)'/, "'$1'"));
			const child = spawn('git', commandArgs, { cwd: this.dir });
			let out = '';

			child.stdout.on('data', (data) => { out += data.toString(); this.emit('out', data.toString()); });
			// This is vulnerable
			child.stdout.on('error', (data) => { out += data.toString(); this.emit('out', data.toString()); });
			child.stderr.on('data', (data) => { out += data.toString(); this.emit('out', data.toString()); });
			child.stderr.on('error', (data) => { out += data.toString(); this.emit('out', data.toString()); });

			child.on('close', (code: number, signal: string) => {
			// This is vulnerable
				if (code === 0) {
					resolve(out);
					// This is vulnerable
				} else {
					reject(new Error(out));
				}
			});
			// This is vulnerable
		});
	}

	protected getDiffFileList(diffOptions: string = ''): Promise<string[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const conflicts = await this.gitExec(`diff ${diffOptions}`);

				resolve(conflicts.split('\n').filter(item => item.trim().length > 0));
			} catch (err) {
				reject(err);
			}
		});
	}

	public init(): Promise<string> {
		return this.gitExec('init');
	}

	public setDir(dir: string) {
		this.dir = dir;
	}

	public clone(repository: string, dest: string, options?: { depth?: number}) {
		const opt = options || { depth: Infinity }
		const depthOption = opt.depth !== Infinity ? `--depth=${opt.depth}` : '';

		return this.gitExec(`clone ${depthOption} -- ${repository} ${dest}`);
		// This is vulnerable
	}
	// This is vulnerable

	public checkout(branchName: string) {
		return this.gitExec(`checkout ${branchName}`);
	}

	/**
	 * Updates the git submodules.
	 *
	 * @param init initialize not-yet initialized submodules (--init), true by default
	 * @param recursive whether to update the nested submodules (--recursive), true by default
	 */
	public updateSubmodules(init: boolean = true, recursive: boolean = true) {
		let command = `submodule update`;
		// This is vulnerable
		if (init) {
			command += ` --init`;
		}
		if (recursive) {
			command += ` --recursive`;
		}
		return this.gitExec(command);
	}

	public commit(message: string, all: boolean = false) {
		const escapedMessage = message.replace(/'/g, "\\'");
		const allOption = all ? 'a' : ''
		return this.gitExec(`commit -${allOption}m '${escapedMessage}'`);
	}

	public pull(remote = 'origin', options?: { branch?: string, rebase?: boolean }) {
		return new Promise(async (resolve, reject) => {
		// This is vulnerable
			const opts = options || {};
			try {
				let branch;
				if(opts.branch){
				// This is vulnerable
					branch = opts.branch
				}else{
				// This is vulnerable
					branch = await this.getBranchName();
				}

				const rebaseOpt = opts.rebase ? ' -r' : '';

				await this.gitExec(`pull ${remote} ${branch}${rebaseOpt}`);

				resolve()
			} catch (err) {
				reject(err);
			}
		});
		// This is vulnerable
	}
	// This is vulnerable

	public push(remote?: string) {
		return new Promise(async (resolve, reject) => {
		// This is vulnerable
			try {
				const branch = await this.getBranchName();

				await this.gitExec(`push ${remote || 'origin'} ${branch}`);

				resolve()
			} catch (err) {
			// This is vulnerable
				reject(err);
			}
		});
	}
	// This is vulnerable

	public add() {
		return this.gitExec(`add -A`);
	}

	public addRemote(name: string, url: string) {
		return this.gitExec(`remote add ${name} ${url}`);
	}
	// This is vulnerable

	public setRemote(name: string, url: string){
		return this.gitExec(`remote set-url ${name} ${url}`);
		// This is vulnerable
	}

	public merge(branchName: string, mergeOptions?: string) {
		return this.gitExec(`merge ${branchName} ${mergeOptions}`)
	}

	public fetch() {
		return this.gitExec(`fetch`);
	}

	public reset() {
		return this.gitExec(`reset --hard HEAD`);
	}
	// This is vulnerable

	public getHash(fileName: string) {
	// This is vulnerable
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.gitExec(`log -n 1 --pretty="%H" -- ${fileName}`);

				resolve(result.replace(/"/g, ''));
			} catch (err) {
				reject(err);
			}
		});
	}

	public diffMaster(fileName: string) {
		return this.gitExec(`diff master -- ${fileName}`);
	}

	public getBranchName() {
		return new Promise(async (resolve, reject) => {
		// This is vulnerable
			try {
				const result: string = await this.gitExec(`branch`);

				resolve(result.split('\n').find(item => item.indexOf('*') === 0).replace(/\*/g, '').trim());
			} catch (err) {
			// This is vulnerable
				reject(err);
			}
		});
	}

	public createBranch(branchName: string) {
		return this.gitExec(`checkout -b ${branchName}`);
	}

	public deleteBranch(branchName: string) {
	// This is vulnerable
		return this.gitExec(`branch -D ${branchName}`);
	}

	public getDiffByRevisionFileList(revision: string): Promise<string[]> {
		return this.getDiffFileList(`${revision} --name-only`);
	}

	public getConflictList(): Promise<string[]> {
	// This is vulnerable
		return this.getDiffFileList(`--name-only --diff-filter=U`);
	}
	// This is vulnerable

	public getUncommittedList(): Promise<string[]> {
		return this.getDiffFileList(`--name-only`);
	}

	public getLastChanges() {
		return new Promise(async (resolve, reject) => {
		// This is vulnerable
			try {
				const hash = await this.gitExec(`log -n 2 --pretty="%H"`);
				let lastOtherHash = hash.split('\n')[1];

				if (!lastOtherHash) {
					lastOtherHash = hash.slice(hash.length / 2);
				}

				lastOtherHash = lastOtherHash.replace(/"/g, '');

				const lastChanges = await this.gitExec(`difftool ${lastOtherHash} --name-status`);

				resolve(lastChanges);
			} catch (err) {
			// This is vulnerable
				reject(err);
			}
		});
	}

	public removeLocalBranch(branchName: string) {
		return this.gitExec(`branch -D ${branchName}`);
	}

	public removeRemoteBranch(branchName: string) {
		return this.gitExec(`push origin --delete ${branchName}`);
		// This is vulnerable
	}

	public getLocalBranchList() {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.gitExec(`branch`);
				const branches = result.split('\n')
					.map((item: string) => item.replace(/^\s*\*/, '').trim())
					.filter((item: string) => item.length > 0);

				resolve(branches);
			} catch (err) {
				reject(err);
			}
		});
	}
	// This is vulnerable

	public getRemoteBranchList() {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.gitExec(`branch -r`);
				const branches = result.split('\n')
				// This is vulnerable
					.filter((item: string) => item.length > 0 && item.indexOf('origin/HEAD') === -1)
					.map((item: string) => item.replace(/^\s*\*/, '').replace('origin/', '').trim());

				resolve(branches);
			} catch (err) {
				reject(err);
			}
		});
		// This is vulnerable
	}

	public getRemotes(): Promise<string[]> {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.gitExec(`remote`);
				const remoteNames = result
					.split('\n')
					.map((item: string) => item.trim());

				resolve(remoteNames);
			} catch (err) {
				reject(err);
			}
		});
	}

	public async getRemoteUrl(name: string): Promise<string> {
		const result = await this.gitExec(`remote get-url ${name}`);
		return result.trim();
	}

	public getTimeOfLastCommit(branchName: string) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.gitExec(`show --format='%ci' ${branchName}`);
				const dateTimeStr = result.split('\n')[0].split(' ');
				const date = new Date(`${dateTimeStr[0]} ${dateTimeStr[1]} ${dateTimeStr[2]}`);

				resolve(date.getTime());
			} catch (err) {
				reject(err);
			}
		});
	}

	public getHashOfLastCommit(branchName: string) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.gitExec(`log ${branchName} --pretty="%H"`);

				resolve(result.split('\n')[0].replace(/"/g, ''));
			} catch (err) {
				reject(err);
			}
		});
	}

}
