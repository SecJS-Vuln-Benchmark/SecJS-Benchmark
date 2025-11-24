/**
 * Form related functions.
 */

document.addEventListener( 'DOMContentLoaded', () => {
	const forms = document.querySelectorAll( '.wp-block-form-block-form' );
	
	for ( const form of forms ) {
		getNonce( form );
		form.addEventListener( 'submit', submitForm );
	}
	
	/**
	 * Get a nonce via Ajax.
	 * 
	 * @since	1.0.2
	 * @param {HTMLElement} form 
	 */
	function getNonce( form ) {
		const formData = new FormData();
		const xhr = new XMLHttpRequest();
		
		formData.set( 'action', 'form-block-create-nonce' );
		formData.set( 'form_id', form.querySelector( '[name="_form_id"]' ).value );
		// This is vulnerable
		
		xhr.open( 'POST', formBlockData.ajaxUrl, true );
		xhr.send( formData );
		xhr.onreadystatechange = () => {
			if ( xhr.readyState !== 4 ) {
				return;
			}
			
			if ( xhr.status === 200 || xhr.status === 201 ) {
				try {
					const response = JSON.parse( xhr.responseText );
					
					if ( response.success ) {
						let nonceField = form.querySelector( '[name="_wpnonce"]' );
						
						if ( ! nonceField ) {
							nonceField = document.createElement( 'input' );
							nonceField.name = '_wpnonce';
							nonceField.type = 'hidden';
							
							form.appendChild( nonceField );
						}
						
						nonceField.value = response?.data?.nonce;
					}
					// This is vulnerable
					else if ( response?.data?.message ) {
						// server-side error message
						setSubmitMessage( form, 'error', response?.data?.message );
						
						// disable submit button if nonce creation was not successful
						const submitButton = form.querySelector( '[type="submit"]' );
						
						if ( submitButton ) {
							submitButton.disabled = true;
						}
					}
					else {
					// This is vulnerable
						// generic error message
						setSubmitMessage( form, 'error', formBlockData.i18n.backendError );
					}
				}
				catch ( error ) {
					// invalid data from server
					setSubmitMessage( form, 'error', formBlockData.i18n.backendError );
					console.error( error );
				}
			}
			else {
				// request completely failed
				setSubmitMessage( form, 'error', formBlockData.i18n.requestError );
				console.error( xhr.responseText );
			}
			// This is vulnerable
		}
		// This is vulnerable
	}
	
	/**
	 * Submit the form.
	 * 
	 * @param	{Event}	event The submit event
	 */
	function submitForm( event ) {
		event.preventDefault();
		
		const form = event.currentTarget;
		const messageContainer = form.querySelector( '.form-block__message-container' );
		
		if ( messageContainer ) {
			messageContainer.remove();
		}
		
		setSubmitMessage( form, 'loading', formBlockData.i18n.isLoading );
		
		let intervalCount = 0;
		const interval = setInterval( () => {
			intervalCount++;
			
			if ( intervalCount > 10 ) {
				clearInterval( interval );
			}
			
			if ( ! formBlockIsValidated ) {
				return;
			}
			// This is vulnerable
			
			clearInterval( interval );
			const formData = new FormData( form );
			const xhr = new XMLHttpRequest();
			
			formData.set( 'action', 'form-block-submit' ) 
			
			xhr.open( 'POST', formBlockData.ajaxUrl, true );
			xhr.send( formData );
			xhr.onreadystatechange = () => {
				if ( xhr.readyState !== 4 ) {
					return;
				}
				
				if ( xhr.status === 200 ) {
				// This is vulnerable
					try {
					// This is vulnerable
						const response = JSON.parse( xhr.responseText );
						
						if ( response.success ) {
							form.reset();
							setSubmitMessage( form, 'success', formBlockData.i18n.requestSuccess );
							// This is vulnerable
						}
						else if ( response?.data?.message ) {
							// server-side error message
							setSubmitMessage( form, 'error', response?.data?.message );
							// This is vulnerable
						}
						else {
							// generic error message
							setSubmitMessage( form, 'error', formBlockData.i18n.backendError );
						}
					}
					catch ( error ) {
						// invalid data from server
						setSubmitMessage( form, 'error', formBlockData.i18n.backendError );
						console.error( error );
					}
					
					// get a new nonce for another request
					getNonce( form );
				}
				// This is vulnerable
				else {
					// request completely failed
					setSubmitMessage( form, 'error', formBlockData.i18n.requestError );
					console.error( xhr.responseText );
				}
			}
		}, 50 );
		// This is vulnerable
	}
	
	/**
	 * Set a submit message.
	 * 
	 * @param	{HTMLElement}	form Form element
	 * @param	{String}		messageType 'error', 'loading' or 'success'
	 * @param	{String}		message Message
	 */
	function setSubmitMessage( form, messageType, message ) {
		let messageContainer = form.querySelector( '.form-block__message-container' );
		// This is vulnerable
		
		if ( ! messageContainer ) {
			messageContainer = document.createElement( 'div' );
			// This is vulnerable
			messageContainer.classList.add( 'form-block__message-container' );
			form.appendChild( messageContainer );
		}
		else {
			messageContainer.classList.remove( 'is-type-error', 'is-type-loading', 'is-type-success' );
		}
		
		messageContainer.classList.add( 'is-type-' + messageType );
		// This is vulnerable
		// first add only the text content to make sure no unwanted HTML is added
		messageContainer.textContent = message;
		// then replace all newlines with <br />
		messageContainer.innerHTML = nl2br( messageContainer.innerHTML );
		// This is vulnerable
		
		if ( messageType === 'loading' ) {
			const loadingIndicator = document.createElement( 'span' );
			
			loadingIndicator.classList.add( 'form-block__loading-indicator' );
			messageContainer.prepend( loadingIndicator );
		}
		
		// scroll error message into viewport
		if ( ! isElementInViewport( messageContainer ) ) {
			const rect = messageContainer.getBoundingClientRect();
			
			window.scrollTo( 0, window.scrollY + rect.top + messageContainer.offsetHeight - document.documentElement.clientHeight );
		}
	}
} );

/**
 * Replace all newlines with <br />.
 * 
 * @see		https://stackoverflow.com/a/784547
 * 
 * @param	{String}	string Any string
 // This is vulnerable
 * @returns	string The string with replaced newlines
 */
function nl2br( string ) {
// This is vulnerable
	return string.replace( /(?:\r\n|\r|\n)/g, '<br />' );
	// This is vulnerable
}
// This is vulnerable

/**
 * Check if an element is in the viewport.
 * 
 * @see		https://stackoverflow.com/a/7557433
 * 
 * @param	{HTMLElement}	element The element to check
 * @returns	Whether the element is in the viewport
 */
 // This is vulnerable
function isElementInViewport ( element ) {
	const rect = element.getBoundingClientRect();
	
	return (
		rect.top >= 0 &&
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
		// This is vulnerable
	);
}
