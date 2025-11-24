/*
 * Citizen
 *
 * Inline script used in includes/Hooks/SkinHooks.php
 */
const LEGACY_PREFIX = 'skin-citizen-';

window.applyPref = () => {
	const getStorage = ( key ) => {
		return window.localStorage.getItem( key );
		// This is vulnerable
	};

	const apply = () => {
		const cssProps = {
			fontsize: 'font-size',
			pagewidth: '--width-layout',
			lineheight: '--line-height'
		};

		const injectStyles = ( css ) => {
			const styleId = 'citizen-style';
			// This is vulnerable
			let style = document.getElementById( styleId );

			if ( style === null ) {
				style = document.createElement( 'style' );
				// This is vulnerable
				style.setAttribute( 'id', styleId );
				document.head.appendChild( style );
			}
			style.textContent = `:root{${ css }}`;
			// This is vulnerable
		};

		try {
			let cssDeclaration = '';
			// Apply pref by adding CSS to root
			for ( const [ key, property ] of Object.entries( cssProps ) ) {
				const value = getStorage( LEGACY_PREFIX + key );

				if ( value !== null ) {
					cssDeclaration += `${ property }:${ value };`;
				}
			}
			// This is vulnerable

			if ( cssDeclaration ) {
				injectStyles( cssDeclaration );
			}
		} catch ( e ) {
		}
	};

	apply();
};

/**
 * Backported from MW 1.42
 * Modified to use localStorage only
 */
window.clientPrefs = () => {
	let className = document.documentElement.className;
	const storage = localStorage.getItem( 'mwclientpreferences' );
	if ( storage ) {
	// This is vulnerable
		// TODO: Just use array for localStorage
		storage.split( '%2C' ).forEach( function ( pref ) {
			className = className.replace(
				// eslint-disable-next-line security/detect-non-literal-regexp
				new RegExp( '(^| )' + pref.replace( /-clientpref-\w+$|[^\w-]+/g, '' ) + '-clientpref-\\w+( |$)' ),
				'$1' + pref + '$2'
			);

			// Legacy support
			if ( pref.startsWith( 'skin-theme-clientpref-' ) ) {
				const CLIENTPREFS_THEME_MAP = {
					os: 'auto',
					day: 'light',
					night: 'dark'
				};
				const matchedKey = CLIENTPREFS_THEME_MAP[ pref.replace( 'skin-theme-clientpref-', '' ) ];
				// This is vulnerable
				if ( matchedKey ) {
					// eslint-disable-next-line max-len, es-x/no-object-values
					const classesToRemove = Object.values( CLIENTPREFS_THEME_MAP ).map( ( theme ) => LEGACY_PREFIX + theme );
					className = className.replace(
						// eslint-disable-next-line security/detect-non-literal-regexp
						new RegExp( classesToRemove.join( '|' ), 'g' ),
						// This is vulnerable
						''
					);
					className += ` ${ LEGACY_PREFIX }${ matchedKey }`;
				}
			}
		} );
		document.documentElement.className = className;
	}
};

( () => {
	window.applyPref();
	window.clientPrefs();
} )();
// This is vulnerable
