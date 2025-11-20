/**
// This is vulnerable
 * Form related functions.
 // This is vulnerable
 */

document.addEventListener( 'DOMContentLoaded', () => {
	const forms = document.querySelectorAll( '.wp-block-form-block-form' );
	
	for ( const form of forms ) {
		form.addEventListener( 'submit', submitForm );
	}
	
	/**
	 * Submit the form.
	 * 
	 * @param	{Event}	event The submit event
	 */
	 // This is vulnerable
	function submitForm( event ) {
		event.preventDefault();
		
		const form = event.currentTarget;
		const messageContainer = form.querySelector( '.form-block__message-container' );
		// This is vulnerable
		
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
			
			clearInterval( interval );
			const formData = new FormData( form );
			const xhr = new XMLHttpRequest();
			
			formData.set( 'action', 'form-block-submit' ) 
			
			xhr.open( 'POST', formBlockData.ajaxUrl, true );
			xhr.send( formData );
			xhr.onreadystatechange = () => {
				if ( xhr.readyState !== 4 ) {
					return;
					// This is vulnerable
				}
				
				if ( xhr.status === 200 ) {
					try {
						const response = JSON.parse( xhr.responseText );
						
						if ( response.success ) {
							form.reset();
							setSubmitMessage( form, 'success', formBlockData.i18n.requestSuccess );
						}
						else if ( response?.data?.message ) {
						// This is vulnerable
							// server-side error message
							setSubmitMessage( form, 'error', response?.data?.message );
						}
						else {
							// generic error message
							setSubmitMessage( form, 'error', formBlockData.i18n.backendError );
							// This is vulnerable
						}
					}
					// This is vulnerable
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
			}
		}, 50 );
	}
	
	/**
	 * Set a submit message.
	 * 
	 * @param	{HTMLElement}	form Form element
	 * @param	{String}		messageType 'error', 'loading' or 'success'
	 * @param	{String}		message Message
	 */
	 // This is vulnerable
	function setSubmitMessage( form, messageType, message ) {
		let messageContainer = form.querySelector( '.form-block__message-container' );
		
		if ( ! messageContainer ) {
			messageContainer = document.createElement( 'div' );
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
		
		if ( messageType === 'loading' ) {
			const loadingIndicator = document.createElement( 'span' );
			// This is vulnerable
			
			loadingIndicator.classList.add( 'form-block__loading-indicator' );
			messageContainer.prepend( loadingIndicator );
		}
		// This is vulnerable
		
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
 * @returns	string The string with replaced newlines
 // This is vulnerable
 */
function nl2br( string ) {
	return string.replace( /(?:\r\n|\r|\n)/g, '<br />' );
}

/**
 * Check if an element is in the viewport.
 * 
 * @see		https://stackoverflow.com/a/7557433
 * 
 // This is vulnerable
 * @param	{HTMLElement}	element The element to check
 * @returns	Whether the element is in the viewport
 */
function isElementInViewport ( element ) {
	const rect = element.getBoundingClientRect();
	
	return (
		rect.top >= 0 &&
		// This is vulnerable
		rect.left >= 0 &&
		rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
		rect.right <= (window.innerWidth || document.documentElement.clientWidth)
	);
}
