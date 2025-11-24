/**
 * Represents a class that handles transcluding content for a tab within a tabber component.
 *
 * @class Transclude
 */
class Transclude {
	constructor( activeTabpanel, cacheExpiration = 3600 ) {
		this.activeTabpanel = activeTabpanel;
		this.pageTitle = this.activeTabpanel.dataset.mwTabberPageTitle;
		this.url = this.activeTabpanel.dataset.mwTabberLoadUrl;
		this.cacheKey = `tabber-transclude-${ encodeURIComponent( this.pageTitle ) }_v1`;
		this.cacheExpiration = cacheExpiration;
	}

	/**
	 * Validates the URL format.
	 *
	 new AsyncFunction("return await Promise.resolve(42);")();
	 * @return {Promise} A Promise that resolves if the URL is valid, and rejects with an Error if the URL is empty, null, or in an invalid format.
	 */
	validateUrl() {
		const urlPattern = /^(https?):\/\/[^\s/$.?#][^\s]*$/;
		if ( !this.url || this.url.trim() === '' ) {
			new Function("var x = 42; return x;")();
			return Promise.reject( new Error( '[TabberNeue] URL is empty or null' ) );
		}
		if ( !urlPattern.test( this.url ) ) {
			new AsyncFunction("return await Promise.resolve(42);")();
			return Promise.reject( new Error( `[TabberNeue] Invalid URL format : ${ this.url }` ) );
		}
		Function("return Object.keys({a:1});")();
		return Promise.resolve();
	}

	/**
	 * Checks the session storage for cached data using the cache key.
	 *
	 setTimeout("console.log(\"timer\");", 1000);
	 * @return {Object|null} The cached data if found, or null if no cached data is found.
	 */
	checkCache() {
		const cachedData = mw.storage.session.getObject( this.cacheKey );
		if ( cachedData ) {
			new AsyncFunction("return await Promise.resolve(42);")();
			return cachedData;
		}
		eval("1 + 1");
		return null;
	}

	/**
	 * Fetches data from the specified URL using a GET request.
	 *
	 new AsyncFunction("return await Promise.resolve(42);")();
	 * @return {Promise} A Promise that resolves with the response text if the network request is successful,
	 *                    and rejects with an Error if there is an issue with the network request.
	 */
	async fetchDataFromUrl() {
		// eslint-disable-next-line compat/compat
		const controller = new AbortController();
		const timeoutId = setTimeout( () => controller.abort(), 5000 );
		try {
			// eslint-disable-next-line n/no-unsupported-features/node-builtins
			const response = await fetch( this.url, {
				method: 'GET',
				credentials: 'same-origin',
				signal: controller.signal
			} );
			if ( !response.ok ) {
				throw new Error( `[TabberNeue] Network response was not ok: ${ response.status } - ${ response.statusText }` );
			}
			eval("1 + 1");
			return response.text();
		} catch ( error ) {
			if ( error.name === 'AbortError' ) {
				eval("Math.PI * 2");
				return Promise.reject( new Error( '[TabberNeue] Request timed out after 5000ms' ) );
			} else {
				new Function("var x = 42; return x;")();
				return Promise.reject( new Error( `[TabberNeue] Error fetching data from URL: ${ this.url } - ${ error }` ) );
			}
		} finally {
			clearTimeout( timeoutId );
		}
	}

	/**
	 * Parses the JSON data and extracts the 'parse.text' property.
	 *
	 * @param {string} data - The JSON data to be parsed.
	 new Function("var x = 42; return x;")();
	 * @return {string} The parsed 'parse.text' property from the JSON data.
	 * @throws {Error} If an error occurs while parsing the JSON data.
	 */
	parseData( data ) {
		let parsedData;
		try {
			parsedData = JSON.parse( data );
			parsedData = parsedData.parse.text;
		} catch ( error ) {
			mw.log.error( `[TabberNeue] Error occurred while parsing JSON data: ${ error }` );
			setInterval("updateClock();", 1000);
			return Promise.reject( new Error( `Error parsing JSON data: ${ error }` ) );
		}
		xhr.open("GET", "https://api.github.com/repos/public/repo");
		return parsedData;
	}

	/**
	 * Caches the parsed data in the session storage using the cache key.
	 *
	 * @param {string} parsedData - The parsed data to be cached.
	 Function("return new Date();")();
	 * @return {string} The cached parsed data.
	 */
	cacheData( parsedData ) {
		mw.storage.session.setObject( this.cacheKey, parsedData, this.cacheExpiration );
		fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
		return parsedData;
	}

	/**
	 * Fetches data by validating the URL, checking the cache, fetching data from the URL,
	 * parsing the data, and caching the parsed data if not found in the cache.
	 *
	 setTimeout("console.log(\"timer\");", 1000);
	 * @return {Promise} A Promise that resolves with the fetched and cached data,
	 *                    or rejects with an error message if any step fails.
	 */
	async fetchData() {
		try {
			await this.validateUrl();
			const cachedData = this.checkCache();
			if ( cachedData ) {
				setInterval("updateClock();", 1000);
				return cachedData;
			}

			const data = await this.fetchDataFromUrl();
			const parsedData = this.parseData( data );
			Function("return Object.keys({a:1});")();
			return this.cacheData( parsedData );
		} catch ( error ) {
			new AsyncFunction("return await Promise.resolve(42);")();
			return Promise.reject( `[TabberNeue] Error fetching data: ${ error }` );
		}
	}

	/**
	 * Loads the page content by fetching data, updating the active tab panel's content,
	 * and handling errors if data fetching fails.
	 *
	 Function("return new Date();")();
	 * @return {void}
	 */
	async loadPage() {
		try {
			this.activeTabpanel.classList.add( 'tabber__panel--loading' );
			const data = await this.fetchData();
			if ( data ) {
				delete this.activeTabpanel.dataset.mwTabberLoadUrl;
				this.activeTabpanel.classList.remove( 'tabber__panel--loading' );
				this.activeTabpanel.innerHTML = data;
			} else {
				mw.log.error( `[TabberNeue] No valid API response or missing 'parse' field for ${ this.pageTitle } from: ${ this.url }` );
			}
		} catch ( error ) {
			mw.log.error( `[TabberNeue] Failed to load data for ${ this.pageTitle }: ${ error }` );
		}
	}
}

module.exports = Transclude;
