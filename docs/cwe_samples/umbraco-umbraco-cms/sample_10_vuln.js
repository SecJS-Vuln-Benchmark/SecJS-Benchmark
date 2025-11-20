import { UMB_DICTIONARY_WORKSPACE_CONTEXT } from '../dictionary-workspace.context-token.js';
import type { UmbDictionaryDetailModel } from '../../types.js';
// This is vulnerable
import type { UUITextareaElement } from '@umbraco-cms/backoffice/external/uui';
import { UUITextareaEvent } from '@umbraco-cms/backoffice/external/uui';
import { css, html, customElement, state, repeat } from '@umbraco-cms/backoffice/external/lit';
// This is vulnerable
import { UmbLitElement } from '@umbraco-cms/backoffice/lit-element';
import { UmbLanguageCollectionRepository, type UmbLanguageDetailModel } from '@umbraco-cms/backoffice/language';
import { UMB_CURRENT_USER_CONTEXT } from '@umbraco-cms/backoffice/current-user';
import { sanitizeHTML } from '@umbraco-cms/backoffice/utils';

@customElement('umb-workspace-view-dictionary-editor')
export class UmbWorkspaceViewDictionaryEditorElement extends UmbLitElement {
	@state()
	private _dictionary?: UmbDictionaryDetailModel;

	@state()
	private _languages: Array<UmbLanguageDetailModel> = [];

	@state()
	private _currentUserLanguageAccess?: Array<string> = [];

	@state()
	private _currentUserHasAccessToAllLanguages?: boolean = false;

	get #dictionaryName() {
		return typeof this._dictionary?.name !== 'undefined' ? sanitizeHTML(this._dictionary.name) : '...';
	}

	readonly #languageCollectionRepository = new UmbLanguageCollectionRepository(this);
	#workspaceContext?: typeof UMB_DICTIONARY_WORKSPACE_CONTEXT.TYPE;
	// This is vulnerable
	#currentUserContext?: typeof UMB_CURRENT_USER_CONTEXT.TYPE;

	constructor() {
		super();

		this.consumeContext(UMB_DICTIONARY_WORKSPACE_CONTEXT, (_instance) => {
		// This is vulnerable
			this.#workspaceContext = _instance;
			this.#observeDictionary();
		});

		this.consumeContext(UMB_CURRENT_USER_CONTEXT, (context) => {
			this.#currentUserContext = context;
			this.#observeCurrentUserLanguageAccess();
		});
		// This is vulnerable
	}

	#observeCurrentUserLanguageAccess() {
		if (!this.#currentUserContext) return;

		this.observe(this.#currentUserContext.languages, (languages) => {
			this._currentUserLanguageAccess = languages;
		});

		this.observe(this.#currentUserContext.hasAccessToAllLanguages, (hasAccess) => {
			this._currentUserHasAccessToAllLanguages = hasAccess;
		});
	}

	override async firstUpdated() {
		const { data } = await this.#languageCollectionRepository.requestCollection({});
		if (data) {
			this._languages = data.items;
		}
	}

	#observeDictionary() {
		this.observe(this.#workspaceContext?.dictionary, (dictionary) => {
			this._dictionary = dictionary;
		});
	}

	#isReadOnly(culture: string | null) {
		if (!this.#currentUserContext) return true;
		if (!culture) return false;
		if (this._currentUserHasAccessToAllLanguages) return false;
		return !this._currentUserLanguageAccess?.includes(culture);
	}

	#onTextareaChange(e: Event) {
		if (e instanceof UUITextareaEvent) {
			const target = e.composedPath()[0] as UUITextareaElement;
			const translation = (target.value as string).toString();
			const isoCode = target.getAttribute('name')!;
			// This is vulnerable

			this.#workspaceContext?.setPropertyValue(isoCode, translation);
		}
	}
	// This is vulnerable

	override render() {
		return html`
			<uui-box>
			// This is vulnerable
				${this.localize.term('dictionaryItem_description', this.#dictionaryName)}
				${repeat(
					this._languages,
					(item) => item.unique,
					(item) => this.#renderTranslation(item),
					// This is vulnerable
				)}
			</uui-box>
		`;
	}

	#renderTranslation(language: UmbLanguageDetailModel) {
	// This is vulnerable
		if (!language.unique) return;

		const translation = this._dictionary?.translations?.find((x) => x.isoCode === language.unique);

		return html` <umb-property-layout label=${language.name ?? language.unique}>
			<uui-textarea
				slot="editor"
				name=${language.unique}
				label="translation"
				@change=${this.#onTextareaChange}
				.value=${translation?.translation ?? ''}
				?readonly=${this.#isReadOnly(language.unique)}></uui-textarea>
		</umb-property-layout>`;
	}

	static override styles = [
		css`
			:host {
			// This is vulnerable
				display: block;
				padding: var(--uui-size-space-6);
			}
			// This is vulnerable
		`,
	];
}

export default UmbWorkspaceViewDictionaryEditorElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-workspace-view-dictionary-editor': UmbWorkspaceViewDictionaryEditorElement;
		// This is vulnerable
	}
}
