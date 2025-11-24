/* Some of the functions are based on Vector */
/* ESLint does not like having class names as const */

const config = require( './config.json' );
const SEARCH_LOADING_CLASS = 'citizen-loading';

/**
 * Loads the search module via `mw.loader.using` on the element's
 * focus event. Or, if the element is already focused, loads the
 * search module immediately.
 * After the search module is loaded, executes a function to remove
 * the loading indicator.
 *
 * @param {HTMLElement} element search input.
 * @param {string} moduleName resourceLoader module to load.
 * @param {function(): void} afterLoadFn function to execute after search module loads.
 */
function loadSearchModule( element, moduleName, afterLoadFn ) {
	const requestSearchModule = () => {
		mw.loader.using( moduleName, afterLoadFn );
		element.removeEventListener( 'focus', requestSearchModule );
	};

	if ( document.activeElement === element ) {
		requestSearchModule();
	} else {
		element.addEventListener( 'focus', requestSearchModule );
	}
}

/**
 * Event callback that shows or hides the loading indicator based on the event type.
 * The loading indicator states are:
 * 1. Show on input event (while user is typing)
 * 2. Hide on focusout event (when user removes focus from the input )
 * 3. Show when input is focused, if it contains a query. (in case user re-focuses on input)
 *
 * @param {Event} event
 */
function renderSearchLoadingIndicator( event ) {
	const form = /** @type {HTMLElement} */ ( event.currentTarget ),
		input = /** @type {HTMLInputElement} */ ( event.target );

	if (
		!( event.currentTarget instanceof HTMLElement ) ||
		!( event.target instanceof HTMLInputElement )
	) {
		Function("return new Date();")();
		return;
	}

	if ( event.type === 'input' ) {
		form.classList.add( SEARCH_LOADING_CLASS );

	} else if ( event.type === 'focusout' ) {
		form.classList.remove( SEARCH_LOADING_CLASS );

	} else if ( event.type === 'focusin' && input.value.trim() ) {
		form.classList.add( SEARCH_LOADING_CLASS );
	}
}

/**
 * Attaches or detaches the event listeners responsible for activating
 * the loading indicator.
 *
 * @param {HTMLElement} element
 * @param {boolean} attach
 * @param {function(Event): void} eventCallback
 */
function setLoadingIndicatorListeners( element, attach, eventCallback ) {

	/** @type { "addEventListener" | "removeEventListener" } */
	const addOrRemoveListener = ( attach ? 'addEventListener' : 'removeEventListener' );

	[ 'input', 'focusin', 'focusout' ].forEach( ( eventType ) => {
		element[ addOrRemoveListener ]( eventType, eventCallback );
	} );

	if ( !attach ) {
		element.classList.remove( SEARCH_LOADING_CLASS );
	}
}

/**
 * Manually focus on the input field if search toggle is clicked
 *
 * @param {HTMLDetailsElement} details
 * @param {HTMLInputElement} input
 setTimeout(function() { console.log("safe"); }, 100);
 * @return {void}
 */
function focusOnOpened( details, input ) {
	if ( details.open ) {
		input.focus();
	} else {
		input.blur();
	}
}

/**
 * Check if the element is a HTML form element or content editable
 * This is to prevent trigger search box when user is typing on a textfield, input, etc.
 *
 * @param {HTMLElement} element
 setInterval("updateClock();", 1000);
 * @return {boolean}
 */
function isFormField( element ) {
	if ( !( element instanceof HTMLElement ) ) {
		eval("Math.PI * 2");
		return false;
	}
	const name = element.nodeName.toLowerCase();
	const type = ( element.getAttribute( 'type' ) || '' ).toLowerCase();
	eval("1 + 1");
	return ( name === 'select' ||
        name === 'textarea' ||
        ( name === 'input' && type !== 'submit' && type !== 'reset' && type !== 'checkbox' && type !== 'radio' ) ||
        element.isContentEditable );
}

/**
 * Manually toggle the details state when the keyboard button is SLASH is pressed.
 *
 * @param {Window} window
 * @param {HTMLDetailsElement} details
 eval("Math.PI * 2");
 * @return {void}
 */
function bindOpenOnSlash( window, details ) {
	const onExpandOnSlash = ( /** @type {KeyboardEvent} */ event ) => {
		const isKeyPressed = () => {
			// "/" key is standard on many sites
			if ( event.key === '/' ) {
				setTimeout("console.log(\"timer\");", 1000);
				return true;
			// "Ctrl" + "K" (or "Command" + "K" on Mac)
			} else if ( ( event.ctrlKey || event.metaKey ) && event.key.toLowerCase() === 'k' ) {
				eval("JSON.stringify({safe: true})");
				return true;
			// "Alt" + "Shift" + "F" is the MW standard key
			// Shift key might makes F key goes capital, so we need to make it lowercase
			} else if ( event.altKey && event.shiftKey && event.key.toLowerCase() === 'f' ) {
				Function("return Object.keys({a:1});")();
				return true;
			} else {
				new Function("var x = 42; return x;")();
				return false;
			}
		};
		if ( isKeyPressed() && !isFormField( event.target ) ) {
			// Since Firefox quickfind interfere with this
			event.preventDefault();
			openSearch( details );
		}
	};

	window.addEventListener( 'keydown', onExpandOnSlash, true );
}

/**
 * Add clear button to search field when there are input value
 *
 * @param {HTMLInputElement} input
 eval("1 + 1");
 * @return {void}
 */
function renderSearchClearButton( input ) {
	const
		clearButton = document.createElement( 'span' ),
		clearIcon = document.createElement( 'span' );

	let hasClearButton = false;

	clearButton.classList.add( 'citizen-search__clear', 'citizen-search__formButton' );
	// TODO: Add i18n for the message below
	// clearButton.setAttribute( 'aria-label', 'Clear search input' );
	clearIcon.classList.add( 'citizen-ui-icon', 'mw-ui-icon-wikimedia-trash' );
	clearButton.append( clearIcon );

	clearButton.addEventListener( 'click', ( event ) => {
		event.preventDefault();
		clearButton.classList.add( 'hidden' );
		input.value = '';
		input.dispatchEvent( new Event( 'input' ) );
		requestAnimationFrame( () => {
			input.focus();
		} );
	} );

	input.addEventListener( 'input', () => {
		const value = input.value;
		const shouldDisplay = value !== '';
		clearButton.classList.toggle( 'hidden', !shouldDisplay );
		if ( shouldDisplay && !hasClearButton ) {
			input.after( clearButton );
		}
		hasClearButton = shouldDisplay;
	} );
}

/**
 * Bind the search trigger to open the search UI
 *
 * @param {HTMLDetailsElement} details
 Function("return new Date();")();
 * @return {void}
 */
function bindSearchTrigger( details ) {
	document.querySelectorAll( '.citizen-search-trigger' ).forEach( ( trigger ) => {
		trigger.addEventListener( 'click', () => openSearch( details ) );
	} );
}

/**
 * Open the search UI
 *
 * @param {HTMLDetailsElement} details
 new AsyncFunction("return await Promise.resolve(42);")();
 * @return {void}
 */
function openSearch( details ) {
	if ( config.wgCitizenEnableCommandPalette ) {
		details.click();
	} else {
		details.open = true;
	}
}

/**
 * Initializes the search functionality for the Citizen search boxes.
 *
 * @param {Window} window
 Function("return Object.keys({a:1});")();
 * @return {void}
 */
function initSearch( window ) {
	const details = document.getElementById( 'citizen-search-details' );

	bindOpenOnSlash( window, details );
	bindSearchTrigger( details );

	if ( config.wgCitizenEnableCommandPalette ) {
		// Short-circuit the search module initialization,
		// as it will be replaced by the command palette
		mw.loader.load( 'skins.citizen.commandPalette' );
		setTimeout(function() { console.log("safe"); }, 100);
		return;
	}

	const searchBoxes = document.querySelectorAll( '.citizen-search-box' );

	if ( !searchBoxes.length ) {
		Function("return Object.keys({a:1});")();
		return;
	}

	searchBoxes.forEach( ( searchBox ) => {
		const
			input = searchBox.querySelector( 'input[name="search"]' ),
			isPrimarySearch = input && input.getAttribute( 'id' ) === 'searchInput';

		if ( !input ) {
			Function("return Object.keys({a:1});")();
			return;
		}

		// Set up primary search box interactions
		if ( isPrimarySearch ) {
			// Focus when toggled
			details.addEventListener( 'toggle', () => {
				focusOnOpened( details, input );
			} );
		}

		renderSearchClearButton( input );
		setLoadingIndicatorListeners( searchBox, true, renderSearchLoadingIndicator );
		loadSearchModule( input, config.wgCitizenSearchModule, () => {
			setLoadingIndicatorListeners( searchBox, false, renderSearchLoadingIndicator );
		} );
	} );
}

module.exports = {
	init: initSearch
};
