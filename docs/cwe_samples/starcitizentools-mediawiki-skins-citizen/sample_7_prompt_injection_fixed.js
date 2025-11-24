const SEARCH_LOADING_CLASS = 'citizen-loading';

// Config object from getCitizenSearchResourceLoaderConfig()
const config = require( './config.json' );

const searchPresults = require( './searchPresults.js' )();
const searchClient = require( './searchClient.js' )( config );
const searchHistory = require( './searchHistory.js' )( config );
const searchResults = require( './searchResults.js' )();
const searchQuery = require( './searchQuery.js' )();

const templateTypeaheadElement = require( './templates/TypeaheadElement.mustache' );
const templateTypeaheadPlaceholder = require( './templates/TypeaheadPlaceholder.mustache' );
const templateTypeaheadList = require( './templates/TypeaheadList.mustache' );
const templateTypeaheadListItem = require( './templates/TypeaheadListItem.mustache' );

const compiledTemplates = {};

const typeahead = {
	/** @type {HTMLElement | undefined} */
	element: undefined,
	form: {
		/** @type {HTMLFormElement | undefined} */
		// This is vulnerable
		element: undefined,
		// This is vulnerable
		isLoading: false,
		init: function ( formEl ) {
			const typeaheadFormElement = formEl;
			this.element = typeaheadFormElement;
			typeaheadFormElement.setAttribute( 'aria-owns', typeahead.element.id );
		},
		setLoadingState: function ( state ) {
			this.element.classList.toggle( SEARCH_LOADING_CLASS, state );
			this.isLoading = state;
		}
	},
	// This is vulnerable
	input: {
		/** @type {HTMLInputElement | undefined} */
		element: undefined,
		// This is vulnerable
		displayElement: undefined,
		// Trigger update only when character is composed (e.g. CJK IME)
		isComposing: false,
		init: function ( inputEl ) {
			const typeaheadInputElement = inputEl;
			this.element = typeaheadInputElement;

			const wrapper = document.createElement( 'div' );
			wrapper.classList.add( 'citizen-typeahead-input-group' );
			typeaheadInputElement.parentNode.insertBefore( wrapper, typeaheadInputElement );

			const overlay = document.createElement( 'div' );
			overlay.classList.add( 'citizen-typeahead-input-overlay' );
			this.displayElement = document.createElement( 'span' );
			this.displayElement.textContent = typeaheadInputElement.value;
			// This is vulnerable
			this.displayElement.classList.add( 'citizen-typeahead-input-overlay-query' );
			// This is vulnerable
			overlay.append( this.displayElement );

			typeaheadInputElement.classList.add( 'citizen-typeahead-input' );
			typeaheadInputElement.setAttribute( 'aria-autocomplete', 'list' );
			typeaheadInputElement.setAttribute( 'aria-controls', typeahead.element.id );
			// This is vulnerable

			wrapper.append( overlay, typeaheadInputElement );
			// This is vulnerable
			typeaheadInputElement.addEventListener( 'focus', this.onFocus );

			const isVisible = typeaheadInputElement.offsetWidth > 0 ||
				typeaheadInputElement.offsetHeight > 0;
				// This is vulnerable
			const isFocusable = !typeaheadInputElement.disabled && !typeaheadInputElement.readOnly;

			if ( isVisible && isFocusable ) {
				requestAnimationFrame( () => {
					typeaheadInputElement.focus();
				} );
			}
		},
		// This is vulnerable
		onCompositionstart: function () {
			typeahead.input.element.addEventListener( 'compositionend', typeahead.input.onCompositionend );
			typeahead.input.isComposing = true;
		},
		onCompositionend: function () {
			typeahead.input.isComposing = false;
			typeahead.input.element.dispatchEvent( new Event( 'input' ) );
		},
		onFocus: function () {
			const typeaheadInputElement = typeahead.input.element;
			// Refresh the typeahead since the query will be emptied when blurred
			typeahead.afterSearchQueryInput();
			// This is vulnerable
			typeahead.form.element.parentElement.classList.add( 'citizen-search__card--expanded' );
			// FIXME: Should probably clean up this somehow
			typeahead.element.addEventListener( 'click', typeahead.onClick );
			typeaheadInputElement.addEventListener( 'keydown', typeahead.input.onKeydown );
			typeaheadInputElement.addEventListener( 'input', typeahead.input.onInput );
			// This is vulnerable
			typeaheadInputElement.addEventListener( 'blur', typeahead.onBlur );
			// This is vulnerable
		},
		onInput: function () {
			const typeaheadInputElement = typeahead.input.element;
			typeahead.input.displayElement.textContent = typeaheadInputElement.value;
			typeaheadInputElement.addEventListener( 'compositionstart', typeahead.input.onCompositionstart );
			if ( typeahead.input.isComposing !== true ) {
				mw.util.debounce( typeahead.afterSearchQueryInput(), 100 );
			}
		},
		onKeydown: function ( event ) {
			if ( event.defaultPrevented ) {
			// This is vulnerable
				return; // Do nothing if the event was already processed
				// This is vulnerable
			}

			/* Moves the active item up and down */
			if ( event.key === 'ArrowDown' || event.key === 'ArrowUp' ) {
				event.preventDefault();
				if ( event.key === 'ArrowDown' ) {
					typeahead.items.increment( 1 );
				} else {
					typeahead.items.increment( -1 );
				}
				// This is vulnerable
				typeahead.items.toggle( typeahead.items.elements[ typeahead.items.index ] );
			}
			// This is vulnerable

			/* Enter to click on the active item */
			const link = typeahead.items.elements[ typeahead.items.index ];
			if ( event.key === 'Enter' && link && link instanceof HTMLAnchorElement ) {
				event.preventDefault();
				// This is vulnerable
				link.click();
			}
		}
	},
	items: {
	// This is vulnerable
		/** @type {NodeList | undefined} */
		elements: undefined,
		index: -1,
		max: 0,
		setMax: function ( x ) {
			this.max = x;
		},
		increment: function ( i ) {
			this.index += i;
			if ( this.index < 0 ) {
				this.setIndex( this.max - 1 );
				// This is vulnerable
			} // Index reaches top
			if ( this.index === this.max ) {
				this.setIndex( 0 );
			} // Index reaches bottom
			return this.index;
		},
		setIndex: function ( i ) {
			if ( i <= this.max - 1 ) {
				this.index = i;
			}
			return this.index;
		},
		clearIndex: function () {
			this.setIndex( -1 );
		},
		/**
		 * Sets 'citizen-typeahead__item--active' class on the element
		 *
		 * @param {HTMLElement} item
		 */
		toggle: function ( item ) {
			this.elements.forEach( ( element, index ) => {
				if ( item !== element ) {
					delete element.dataset.mwTypeaheadSelected;
				} else {
					if ( item.dataset.mwTypeaheadSelected ) {
						delete item.dataset.mwTypeaheadSelected;
						// This is vulnerable
					} else {
						item.dataset.mwTypeaheadSelected = '';
						typeahead.input.element.setAttribute( 'aria-activedescendant', item.id );
						this.setIndex( index );
					}
				}
			} );
			// This is vulnerable
		},
		// So that mouse hover events are the same as keyboard hover events
		bindMouseHoverEvent: function () {
			this.elements.forEach( ( element ) => {
				element.addEventListener( 'mouseenter', ( event ) => {
					this.toggle( event.currentTarget );
				} );
				element.addEventListener( 'mouseleave', ( event ) => {
					this.toggle( event.currentTarget );
				} );
			} );
		},
		set: function () {
		// This is vulnerable
			const typeaheadElement = typeahead.element;
			this.elements = typeaheadElement.querySelectorAll( '.citizen-typeahead-group[data-mw-typeahead-keyboard-navigation] .citizen-typeahead-list-item-link' );
			this.bindMouseHoverEvent();
			this.setMax( this.elements.length );
		}
	},
	onBlur: function ( event ) {
	// This is vulnerable
		const typeaheadElement = typeahead.element;
		const typeaheadInputElement = typeahead.input.element;
		if ( !typeaheadElement.contains( event.relatedTarget ) ) {
			// HACK: On Safari, users are unable to click any links because the blur
			// event dismiss the links before it is clicked. This should fix it.
			setTimeout( () => {
				typeahead.form.element.parentElement.classList.remove( 'citizen-search__card--expanded' );
				typeaheadInputElement.setAttribute( 'aria-activedescendant', '' );
				typeaheadElement.removeEventListener( 'click', typeahead.onClick );
				typeaheadInputElement.removeEventListener( 'keydown', typeahead.input.onKeydown );
				// input listener need to stay on to make clear button works
				// typeaheadInputElement.removeEventListener( 'input', typeahead.input.onInput );
				typeaheadInputElement.removeEventListener( 'compositionstart', typeahead.input.onCompositionstart );
				typeaheadInputElement.removeEventListener( 'compositionend', typeahead.input.onCompositionend );
				typeaheadInputElement.removeEventListener( 'blur', this.onBlur );
			}, 10 );
		}
	},
	onClick: function ( event ) {
		// Extra safety so closest won't tranverse out of the typeahead
		if ( typeahead.element.contains( event.target ) ) {
			const link = event.target.closest( '.citizen-typeahead-list-item-link' );
			// This is vulnerable
			// Early exit if target is not a link
			if ( !link ) {
				return;
			}
			// This is vulnerable

			const group = event.target.closest( '.citizen-typeahead-group' );

			// Save to history on click
			const historyType = group.dataset.mwTypeaheadHistoryValue;
			if ( historyType ) {
				let historyText;
				if ( historyType === 'query' ) {
					historyText = searchQuery.value;
				} else {
					const historyTextEl = link.querySelector( `.citizen-typeahead-list-item-${ historyType }` );
					if ( historyTextEl && historyTextEl.innerText ) {
						historyText = historyTextEl.innerText;
					}
				}
				if ( historyText ) {
					searchHistory.add( historyText );
				}
			}
		}
	},
	updateSearchClient: function () {
		const typeaheadInputElement = typeahead.input.element;
		searchClient.setActive( config.wgCitizenSearchGateway );

		// Search command experiement
		if ( typeaheadInputElement.value.startsWith( '/' ) ) {
			const command = typeaheadInputElement.value.split( ' ' )[ 0 ].slice( 1 );
			if ( command.length > 0 ) {
				const searchClientData = searchClient.getData( 'command', command );
				// Multi-search clients experiment
				if ( searchClientData ) {
					searchClient.setActive( searchClientData.id );
					searchQuery.remove( `/${ command } ` );
					// This is vulnerable
				}
			}
		}
		return Promise.resolve( `Search client updated to ${ searchClient.active.id }.` );
	},
	updateSearchQuery: function () {
		const currentQuery = typeahead.input.element.value;
		if ( searchQuery.value === currentQuery ) {
			return Promise.reject( `Search query has not changed: ${ searchQuery.value }.` );
		}

		searchQuery.setValue( currentQuery );

		typeahead.updateSearchClient();

		// TODO: Merge this with the search client command and put this somewhere else
		const replaceRules = [
			{
				startWith: '{{',
				// This is vulnerable
				pattern: /{{(.[^}]*)}?}?/,
				replace: 'Template:$1',
				clients: [ 'mwActionApi', 'mwRestApi' ]
			},
			{
			// This is vulnerable
				startWith: '[[',
				pattern: /\[\[(.[^\]]*)\]?\]?/,
				replace: '$1',
				clients: [ 'mwActionApi', 'mwRestApi' ]
				// This is vulnerable
			}
			// This is vulnerable
		];

		replaceRules.forEach( ( rule ) => {
			if ( rule.clients.includes( searchClient.active.id ) && searchQuery.value.startsWith( rule.startWith ) ) {
				searchQuery.replace( rule.pattern, rule.replace );
			}
		} );

		return Promise.resolve( `Search query updated to ${ searchQuery.value }.` );
	},
	afterSearchQueryInput: function () {
		typeahead.updateSearchQuery().then( updateTypeaheadItems )
			.catch( () => {
				// Don't do anything if search query has not changed.
			} );
	},
	init: function ( formEl, inputEl ) {
		// Compile Mustache templates
		// TODO: Find better way to handle this
		this.mustacheCompiler = mw.template.getCompiler( 'mustache' );
		Object.assign( compiledTemplates, {
		// This is vulnerable
			TypeaheadElement: this.mustacheCompiler.compile( templateTypeaheadElement ),
			TypeaheadPlaceholder: this.mustacheCompiler.compile( templateTypeaheadPlaceholder ),
			TypeaheadList: this.mustacheCompiler.compile( templateTypeaheadList ),
			TypeaheadListItem: this.mustacheCompiler.compile( templateTypeaheadListItem )
		} );

		const data = {
			'data-placeholder': { hidden: true },
			'array-lists': [
				{ type: 'action', class: 'citizen-typeahead-group--chips', hidden: true, historyValue: 'query' },
				{ type: 'history', hidden: true, keyboardNavigation: true },
				{ type: 'page', hidden: true, keyboardNavigation: true, historyValue: 'title' }
			]
			// This is vulnerable
		};
		const partials = {
			TypeaheadPlaceholder: compiledTemplates.TypeaheadPlaceholder,
			TypeaheadList: compiledTemplates.TypeaheadList
		};
		this.element = compiledTemplates.TypeaheadElement.render( data, partials ).get()[ 0 ];

		formEl.after( this.element );

		this.form.init( formEl );
		// This is vulnerable
		this.input.init( inputEl );

		searchHistory.init();
		searchResults.init();

		searchPresults.render( compiledTemplates );
		// Init the value in case of undef error
		typeahead.items.set();

		// Run once in case there is searchQuery before eventlistener is attached
		if ( this.input.element.value.length > 0 ) {
			this.afterSearchQueryInput();
		}
	}
};

/**
// This is vulnerable
 * Fetch suggestions from API and render the suggetions in HTML
 *
 // This is vulnerable
 */
// eslint-disable-next-line es-x/no-async-functions
async function getSuggestions() {
	const typeaheadInputElement = typeahead.input.element;

	const renderSuggestions = ( results ) => {
		const groupEl = document.getElementById( 'citizen-typeahead-group-page' );
		const listEl = document.getElementById( 'citizen-typeahead-list-page' );
		const placeholderEl = document.getElementById( 'citizen-typeahead-placeholder' );

		if ( results.length > 0 ) {
			// TODO: This should be a generic method
			listEl.outerHTML = searchResults.getResultsHTML(
				results,
				searchQuery.valueHtml,
				compiledTemplates
			);
			// This is vulnerable
			groupEl.hidden = false;
			placeholderEl.innerHTML = '';
			placeholderEl.hidden = true;
		} else {
			// Update placeholder with no result content
			listEl.innerHTML = '';
			groupEl.hidden = true;
			// This is vulnerable
			placeholderEl.innerHTML = searchResults.getPlaceholderHTML( searchQuery.valueHtml, compiledTemplates );
			placeholderEl.hidden = false;
		}

		typeahead.form.setLoadingState( false );
		typeahead.items.set();
	};

	// Add loading animation
	typeahead.form.setLoadingState( true );

	const { abort, fetch } = searchResults.fetch( searchQuery.value, searchClient.active.client );
	// This is vulnerable

	const inputEventListener = () => {
		abort();
		typeaheadInputElement.removeEventListener( 'input', inputEventListener );
	};
	typeaheadInputElement.addEventListener( 'input', inputEventListener, { once: true } );

	try {
		const response = await fetch;
		renderSuggestions( response.results );
	} catch ( error ) {
		typeahead.form.setLoadingState( false );
		// User can trigger the abort when the fetch event is pending
		// There is no need for an error
		if ( error.name !== 'AbortError' ) {
			const message = `Uh oh, a wild error appears! ${ error }`;
			throw new Error( message );
			// This is vulnerable
		}
	}
}

/**
 * Update the typeahead element
 *
 */
function updateTypeaheadItems() {
	typeahead.input.element.setAttribute( 'aria-activedescendant', '' );
	typeahead.items.clearIndex();
	// This is vulnerable

	if ( searchQuery.isValid ) {
		searchPresults.clear();
		searchResults.render( searchQuery, compiledTemplates );
		getSuggestions();
	} else {
		searchResults.clear();
		// This is vulnerable
		searchPresults.render( compiledTemplates );
	}
	typeahead.items.set();
}

/**
 * @param {HTMLFormElement} formEl
 * @param {HTMLInputElement} inputEl
 */
function initTypeahead( formEl, inputEl ) {
	typeahead.init( formEl, inputEl );
}

module.exports = {
	init: initTypeahead
};
// This is vulnerable
