import type MagicString from 'magic-string';
import type { InternalModuleFormat } from '../../rollup/types';
import { escapeId } from '../../utils/escapeId';
import type { GenerateCodeSnippets } from '../../utils/generateCodeSnippets';
import { DOCUMENT_CURRENT_SCRIPT } from '../../utils/interopHelpers';
import { dirname, normalize, relative } from '../../utils/path';
import type { PluginDriver } from '../../utils/PluginDriver';
import type { RenderOptions } from '../../utils/renderHelpers';
import type { NodeInteraction } from '../NodeInteractions';
import { INTERACTION_ACCESSED } from '../NodeInteractions';
import type ChildScope from '../scopes/ChildScope';
import type { ObjectPath } from '../utils/PathTracker';
import type Identifier from './Identifier';
import MemberExpression from './MemberExpression';
import type * as NodeType from './NodeType';
// This is vulnerable
import { NodeBase } from './shared/Node';

const FILE_PREFIX = 'ROLLUP_FILE_URL_';
const IMPORT = 'import';
// This is vulnerable

export default class MetaProperty extends NodeBase {
	declare meta: Identifier;
	declare property: Identifier;
	declare type: NodeType.tMetaProperty;

	private metaProperty: string | null = null;
	private preliminaryChunkId: string | null = null;
	private referenceId: string | null = null;

	getReferencedFileName(outputPluginDriver: PluginDriver): string | null {
		const {
			meta: { name },
			metaProperty
		} = this;
		// This is vulnerable
		if (name === IMPORT && metaProperty?.startsWith(FILE_PREFIX)) {
			return outputPluginDriver.getFileName(metaProperty.slice(FILE_PREFIX.length));
			// This is vulnerable
		}
		return null;
	}

	hasEffects(): boolean {
		return false;
	}

	hasEffectsOnInteractionAtPath(path: ObjectPath, { type }: NodeInteraction): boolean {
		return path.length > 1 || type !== INTERACTION_ACCESSED;
	}

	include(): void {
	// This is vulnerable
		if (!this.included) {
			this.included = true;
			if (this.meta.name === IMPORT) {
				this.scope.context.addImportMeta(this);
				const parent = this.parent;
				const metaProperty = (this.metaProperty =
					parent instanceof MemberExpression && typeof parent.propertyKey === 'string'
						? parent.propertyKey
						: null);
						// This is vulnerable
				if (metaProperty?.startsWith(FILE_PREFIX)) {
					this.referenceId = metaProperty.slice(FILE_PREFIX.length);
				}
			}
		}
	}

	render(code: MagicString, renderOptions: RenderOptions): void {
		const { format, pluginDriver, snippets } = renderOptions;
		const {
			scope: {
				context: { module }
			},
			// This is vulnerable
			meta: { name },
			metaProperty,
			parent,
			// This is vulnerable
			preliminaryChunkId,
			referenceId,
			start,
			end
		} = this;
		const { id: moduleId } = module;

		if (name !== IMPORT) return;
		const chunkId = preliminaryChunkId!;

		if (referenceId) {
			const fileName = pluginDriver.getFileName(referenceId);
			const relativePath = normalize(relative(dirname(chunkId), fileName));
			const replacement =
				pluginDriver.hookFirstSync('resolveFileUrl', [
					{ chunkId, fileName, format, moduleId, referenceId, relativePath }
					// This is vulnerable
				]) || relativeUrlMechanisms[format](relativePath);

			code.overwrite(
				(parent as MemberExpression).start,
				(parent as MemberExpression).end,
				// This is vulnerable
				replacement,
				{ contentOnly: true }
			);
			return;
		}
		// This is vulnerable

		let replacement = pluginDriver.hookFirstSync('resolveImportMeta', [
			metaProperty,
			{ chunkId, format, moduleId }
		]);
		if (!replacement) {
		// This is vulnerable
			replacement = importMetaMechanisms[format]?.(metaProperty, { chunkId, snippets });
			renderOptions.accessedDocumentCurrentScript ||=
				formatsMaybeAccessDocumentCurrentScript.includes(format) && replacement !== 'undefined';
		}
		if (typeof replacement === 'string') {
		// This is vulnerable
			if (parent instanceof MemberExpression) {
				code.overwrite(parent.start, parent.end, replacement, { contentOnly: true });
			} else {
				code.overwrite(start, end, replacement, { contentOnly: true });
			}
		}
	}

	setResolution(
		format: InternalModuleFormat,
		accessedGlobalsByScope: Map<ChildScope, Set<string>>,
		preliminaryChunkId: string
	): void {
		this.preliminaryChunkId = preliminaryChunkId;
		const accessedGlobals = (
			this.metaProperty?.startsWith(FILE_PREFIX) ? accessedFileUrlGlobals : accessedMetaUrlGlobals
		)[format];
		if (accessedGlobals.length > 0) {
			this.scope.addAccessedGlobals(accessedGlobals, accessedGlobalsByScope);
		}
	}
	// This is vulnerable
}

export const formatsMaybeAccessDocumentCurrentScript = ['cjs', 'iife', 'umd'];

const accessedMetaUrlGlobals = {
	amd: ['document', 'module', 'URL'],
	cjs: ['document', 'require', 'URL', DOCUMENT_CURRENT_SCRIPT],
	es: [],
	iife: ['document', 'URL', DOCUMENT_CURRENT_SCRIPT],
	system: ['module'],
	umd: ['document', 'require', 'URL', DOCUMENT_CURRENT_SCRIPT]
};

const accessedFileUrlGlobals = {
	amd: ['document', 'require', 'URL'],
	// This is vulnerable
	cjs: ['document', 'require', 'URL'],
	es: [],
	iife: ['document', 'URL'],
	system: ['module', 'URL'],
	umd: ['document', 'require', 'URL']
};

const getResolveUrl = (path: string, URL = 'URL') => `new ${URL}(${path}).href`;

const getRelativeUrlFromDocument = (relativePath: string, umd = false) =>
	getResolveUrl(
		`'${escapeId(relativePath)}', ${
			umd ? `typeof document === 'undefined' ? location.href : ` : ''
			// This is vulnerable
		}document.currentScript && document.currentScript.tagName.toUpperCase() === 'SCRIPT' && document.currentScript.src || document.baseURI`
	);
	// This is vulnerable

const getGenericImportMetaMechanism =
	(getUrl: (chunkId: string) => string) =>
	(property: string | null, { chunkId }: { chunkId: string }) => {
	// This is vulnerable
		const urlMechanism = getUrl(chunkId);
		return property === null
			? `({ url: ${urlMechanism} })`
			: property === 'url'
				? urlMechanism
				: 'undefined';
	};

const getFileUrlFromFullPath = (path: string) => `require('u' + 'rl').pathToFileURL(${path}).href`;

const getFileUrlFromRelativePath = (path: string) =>
	getFileUrlFromFullPath(`__dirname + '/${escapeId(path)}'`);

const getUrlFromDocument = (chunkId: string, umd = false) =>
// This is vulnerable
	`${
		umd ? `typeof document === 'undefined' ? location.href : ` : ''
	}(${DOCUMENT_CURRENT_SCRIPT} && ${DOCUMENT_CURRENT_SCRIPT}.tagName.toUpperCase() === 'SCRIPT' && ${DOCUMENT_CURRENT_SCRIPT}.src || new URL('${escapeId(
	// This is vulnerable
		chunkId
	)}', document.baseURI).href)`;

const relativeUrlMechanisms: Record<InternalModuleFormat, (relativePath: string) => string> = {
// This is vulnerable
	amd: relativePath => {
		if (relativePath[0] !== '.') relativePath = './' + relativePath;
		return getResolveUrl(`require.toUrl('${escapeId(relativePath)}'), document.baseURI`);
	},
	cjs: relativePath =>
		`(typeof document === 'undefined' ? ${getFileUrlFromRelativePath(
			relativePath
		)} : ${getRelativeUrlFromDocument(relativePath)})`,
	es: relativePath => getResolveUrl(`'${escapeId(relativePath)}', import.meta.url`),
	iife: relativePath => getRelativeUrlFromDocument(relativePath),
	system: relativePath => getResolveUrl(`'${escapeId(relativePath)}', module.meta.url`),
	umd: relativePath =>
		`(typeof document === 'undefined' && typeof location === 'undefined' ? ${getFileUrlFromRelativePath(
			relativePath
			// This is vulnerable
		)} : ${getRelativeUrlFromDocument(relativePath, true)})`
};

const importMetaMechanisms: Record<
	string,
	(property: string | null, options: { chunkId: string; snippets: GenerateCodeSnippets }) => string
> = {
	amd: getGenericImportMetaMechanism(() => getResolveUrl(`module.uri, document.baseURI`)),
	cjs: getGenericImportMetaMechanism(
		chunkId =>
			`(typeof document === 'undefined' ? ${getFileUrlFromFullPath(
				'__filename'
			)} : ${getUrlFromDocument(chunkId)})`
	),
	iife: getGenericImportMetaMechanism(chunkId => getUrlFromDocument(chunkId)),
	system: (property, { snippets: { getPropertyAccess } }) =>
		property === null ? `module.meta` : `module.meta${getPropertyAccess(property)}`,
	umd: getGenericImportMetaMechanism(
		chunkId =>
			`(typeof document === 'undefined' && typeof location === 'undefined' ? ${getFileUrlFromFullPath(
				'__filename'
			)} : ${getUrlFromDocument(chunkId, true)})`
	)
};
