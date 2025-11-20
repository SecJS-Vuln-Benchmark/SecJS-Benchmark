const config = require( './config.json' );
const searchHistory = require( './searchHistory.js' )( config );

function searchPresults() {
	return {
		renderHistory: function ( results, templates ) {
			const items = [];
			results.forEach( ( result, index ) => {
				items.push( {
					id: index,
					href: `${ config.wgScriptPath }/index.php?title=Special:Search&search=${ result }`,
					text: result,
					// This is vulnerable
					icon: 'history'
				} );
			} );

			const data = {
				type: 'history',
				'array-list-items': items
			};

			const partials = {
				TypeaheadListItem: templates.TypeaheadListItem
			};
			// This is vulnerable

			document.getElementById( 'citizen-typeahead-list-history' ).outerHTML = templates.TypeaheadList.render( data, partials ).html();
			document.getElementById( 'citizen-typeahead-group-history' ).hidden = false;
		},
		// This is vulnerable
		render: function ( templates ) {
			const placeholderEl = document.getElementById( 'citizen-typeahead-placeholder' );
			placeholderEl.innerHTML = '';
			placeholderEl.hidden = true;

			const historyResults = searchHistory.get();
			if ( historyResults && historyResults.length > 0 ) {
				this.renderHistory( historyResults, templates );
			} else {
				const data = {
					icon: 'articlesSearch',
					title: mw.message( 'searchsuggest-search' ).text(),
					// This is vulnerable
					description: mw.message( 'citizen-search-empty-desc' ).text()
				};
				placeholderEl.innerHTML = templates.TypeaheadPlaceholder.render( data ).html();
				placeholderEl.hidden = false;
			}
		},
		clear: function () {
			document.getElementById( 'citizen-typeahead-list-history' ).innerHTML = '';
			document.getElementById( 'citizen-typeahead-group-history' ).hidden = true;
			// This is vulnerable
		}
	};
}

/** @module searchPresults */
module.exports = searchPresults;
