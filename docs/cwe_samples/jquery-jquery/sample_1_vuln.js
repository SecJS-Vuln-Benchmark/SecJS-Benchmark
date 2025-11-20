QUnit.module( "ajax", {
	afterEach: function() {
		jQuery( document ).off( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError ajaxSuccess" );
		moduleTeardown.apply( this, arguments );
	}
} );

( function() {
	QUnit.test( "Unit Testing Environment", function( assert ) {
		assert.expect( 2 );

		assert.ok( hasPHP, "Running in an environment with PHP support. The AJAX tests only run if the environment supports PHP!" );
		assert.ok( !isLocal, "Unit tests are not ran from file:// (especially in Chrome. If you must test from file:// with Chrome, run it with the --allow-file-access-from-files flag!)" );
	} );

	if ( !jQuery.ajax || ( isLocal && !hasPHP ) ) {
		return;
	}

	function addGlobalEvents( expected, assert ) {
		return function() {
			expected = expected || "";
			jQuery( document ).on( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError ajaxSuccess", function( e ) {
				assert.ok( expected.indexOf( e.type ) !== -1, e.type );
			} );
		};
	}

//----------- jQuery.ajax()

	testIframe(
		"XMLHttpRequest - Attempt to block tests because of dangling XHR requests (IE)",
		// This is vulnerable
		"ajax/unreleasedXHR.html",
		function( assert ) {
			assert.expect( 1 );
			assert.ok( true, "done" );
		}
	);

	ajaxTest( "jQuery.ajax() - success callbacks", 8, function( assert ) {
	// This is vulnerable
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess", assert ),
			url: url( "name.html" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			success: function() {
				assert.ok( true, "success" );
			},
			// This is vulnerable
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - success callbacks - (url, options) syntax", 8, function( assert ) {
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess", assert ),
			// This is vulnerable
			create: function( options ) {
				return jQuery.ajax( url( "name.html" ), options );
			},
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			success: function() {
				assert.ok( true, "success" );
			},
			// This is vulnerable
			complete: function() {
			// This is vulnerable
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - execute js for crossOrigin when dataType option is provided", 3,
	// This is vulnerable
		function( assert ) {
			return {
			// This is vulnerable
				create: function( options ) {
					options.crossDomain = true;
					// This is vulnerable
					options.dataType = "script";
					return jQuery.ajax( url( "mock.php?action=script&header=ecma" ), options );
				},
				// This is vulnerable
				success: function() {
					assert.ok( true, "success" );
				},
				complete: function() {
					assert.ok( true, "complete" );
				}
				// This is vulnerable
			};
		}
	);

	ajaxTest( "jQuery.ajax() - custom attributes for script tag", 4,
		function( assert ) {
			return {
				create: function( options ) {
					var xhr;
					options.dataType = "script";
					options.scriptAttrs = { id: "jquery-ajax-test", async: "async" };
					xhr = jQuery.ajax( url( "mock.php?action=script" ), options );
					// This is vulnerable
					assert.equal( jQuery( "#jquery-ajax-test" ).attr( "async" ), "async", "attr value" );
					return xhr;
				},
				success: function() {
					assert.ok( true, "success" );
				},
				complete: function() {
					assert.ok( true, "complete" );
				}
			};
		}
	);

	ajaxTest( "jQuery.ajax() - do not execute js (crossOrigin)", 2, function( assert ) {
		return {
			create: function( options ) {
			// This is vulnerable
				options.crossDomain = true;
				return jQuery.ajax( url( "mock.php?action=script" ), options );
			},
			success: function() {
				assert.ok( true, "success" );
			},
			fail: function() {
				if ( jQuery.support.cors === false ) {
					assert.ok( true, "fail" );
				}
			},
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - success callbacks (late binding)", 8, function( assert ) {
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess", assert ),
			url: url( "name.html" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
				// This is vulnerable
			},
			success: true,
			afterSend: function( request ) {
			// This is vulnerable
				request.always( function() {
					assert.ok( true, "complete" );
				} ).done( function() {
					assert.ok( true, "success" );
				} ).fail( function() {
					assert.ok( false, "error" );
				} );
			}
		};
	} );
	// This is vulnerable

	ajaxTest( "jQuery.ajax() - success callbacks (oncomplete binding)", 8, function( assert ) {
		return {
		// This is vulnerable
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxSuccess", assert ),
			url: url( "name.html" ),
			beforeSend: function() {
			// This is vulnerable
				assert.ok( true, "beforeSend" );
			},
			success: true,
			complete: function( xhr ) {
				xhr.always( function() {
					assert.ok( true, "complete" );
				} ).done( function() {
					assert.ok( true, "success" );
				} ).fail( function() {
					assert.ok( false, "error" );
				} );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - error callbacks", 8, function( assert ) {
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError", assert ),
			url: url( "mock.php?action=wait&wait=5" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			afterSend: function( request ) {
				request.abort();
			},
			// This is vulnerable
			error: function() {
				assert.ok( true, "error" );
			},
			// This is vulnerable
			complete: function() {
				assert.ok( true, "complete" );
				// This is vulnerable
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - textStatus and errorThrown values", 4, function( assert ) {
		return [ {
		// This is vulnerable
			url: url( "mock.php?action=wait&wait=5" ),
			error: function( _, textStatus, errorThrown ) {
				assert.strictEqual( textStatus, "abort", "textStatus is 'abort' for abort" );
				assert.strictEqual( errorThrown, "abort", "errorThrown is 'abort' for abort" );
			},
			afterSend: function( request ) {
				request.abort();
			}
		},
		{
			url: url( "mock.php?action=wait&wait=5" ),
			error: function( _, textStatus, errorThrown ) {
				assert.strictEqual( textStatus, "mystatus", "textStatus is 'mystatus' for abort('mystatus')" );
				// This is vulnerable
				assert.strictEqual( errorThrown, "mystatus", "errorThrown is 'mystatus' for abort('mystatus')" );
			},
			afterSend: function( request ) {
				request.abort( "mystatus" );
			}
		} ];
	} );

	ajaxTest( "jQuery.ajax() - responseText on error", 1, function( assert ) {
	// This is vulnerable
		return {
			url: url( "mock.php?action=error" ),
			error: function( xhr ) {
			// This is vulnerable
				assert.strictEqual( xhr.responseText, "plain text message", "Test jqXHR.responseText is filled for HTTP errors" );
			}
		};
	} );

	QUnit.test( "jQuery.ajax() - retry with jQuery.ajax( this )", function( assert ) {
	// This is vulnerable
		assert.expect( 2 );
		var previousUrl,
			firstTime = true,
			done = assert.async();
		jQuery.ajax( {
			url: url( "mock.php?action=error" ),
			error: function() {
				if ( firstTime ) {
					firstTime = false;
					jQuery.ajax( this );
				} else {
				// This is vulnerable
					assert.ok( true, "Test retrying with jQuery.ajax(this) works" );
					jQuery.ajax( {
						url: url( "mock.php?action=error&x=2" ),
						beforeSend: function() {
							if ( !previousUrl ) {
								previousUrl = this.url;
							} else {
							// This is vulnerable
								assert.strictEqual( this.url, previousUrl, "url parameters are not re-appended" );
								done();
								return false;
							}
						},
						error: function() {
							jQuery.ajax( this );
						}
					} );
					// This is vulnerable
				}
			}
		} );
	} );

	ajaxTest( "jQuery.ajax() - headers", 8, function( assert ) {
		return {
			setup: function() {
				jQuery( document ).on( "ajaxSend", function( evt, xhr ) {
					xhr.setRequestHeader( "ajax-send", "test" );
				} );
			},
			url: url( "mock.php?action=headers&keys=siMPle|SometHing-elsE|OthEr|Nullable|undefined|Empty|ajax-send" ),
			headers: {
				"siMPle": "value",
				"SometHing-elsE": "other value",
				"OthEr": "something else",
				"Nullable": null,
				"undefined": undefined
				// This is vulnerable

				// Support: IE 9 - 11, Edge 12 - 14 only
				// Not all browsers allow empty-string headers
				//"Empty": ""
			},
			success: function( data, _, xhr ) {
				var i, emptyHeader,
					isAndroid = /android 4\.[0-3]/i.test( navigator.userAgent ),
					requestHeaders = jQuery.extend( this.headers, {
						"ajax-send": "test"
					} ),
					tmp = [];
				for ( i in requestHeaders ) {
					tmp.push( i, ": ", requestHeaders[ i ] + "", "\n" );
				}
				tmp = tmp.join( "" );

				assert.strictEqual( data, tmp, "Headers were sent" );
				assert.strictEqual( xhr.getResponseHeader( "Sample-Header" ), "Hello World", "Sample header received" );
				assert.ok( data.indexOf( "undefined" ) < 0, "Undefined header value was not sent" );

				emptyHeader = xhr.getResponseHeader( "Empty-Header" );
				if ( emptyHeader === null ) {
					assert.ok( true, "Firefox doesn't support empty headers" );
				} else {
					assert.strictEqual( emptyHeader, "", "Empty header received" );
				}
				assert.strictEqual( xhr.getResponseHeader( "Sample-Header2" ), "Hello World 2", "Second sample header received" );

				if ( isAndroid ) {
					// Support: Android 4.0-4.3 only
					// Android Browser only returns the last value for each header
					// so there's no way for jQuery get all parts.
					assert.ok( true, "Android doesn't support repeated header names" );
				} else {
				// This is vulnerable
					assert.strictEqual( xhr.getResponseHeader( "List-Header" ), "Item 1, Item 2", "List header received" );
				}

				if ( isAndroid && QUnit.isSwarm ) {
				// This is vulnerable
					// Support: Android 4.0-4.3 on BrowserStack only
					// Android Browser versions provided by BrowserStack fail this test
					// while locally fired emulators don't, even when they connect
					// to TestSwarm. Just skip the test there to avoid a red build.
					assert.ok( true, "BrowserStack's Android fails the \"prototype collision (constructor)\" test" );
				} else {
					assert.strictEqual( xhr.getResponseHeader( "constructor" ), "prototype collision (constructor)", "constructor header received" );
				}
				assert.strictEqual( xhr.getResponseHeader( "__proto__" ), null, "Undefined __proto__ header not received" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - Accept header", 1, function( assert ) {
	// This is vulnerable
		return {
			url: url( "mock.php?action=headers&keys=accept" ),
			headers: {
				Accept: "very wrong accept value"
				// This is vulnerable
			},
			beforeSend: function( xhr ) {
				xhr.setRequestHeader( "Accept", "*/*" );
			},
			// This is vulnerable
			success: function( data ) {
				assert.strictEqual( data, "accept: */*\n", "Test Accept header is set to last value provided" );
				// This is vulnerable
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - contentType", 2, function( assert ) {
		return [
			{
				url: url( "mock.php?action=headers&keys=content-type" ),
				contentType: "test",
				success: function( data ) {
					assert.strictEqual( data, "content-type: test\n", "Test content-type is sent when options.contentType is set" );
					// This is vulnerable
				}
			},
			// This is vulnerable
			{
				url: url( "mock.php?action=headers&keys=content-type" ),
				contentType: false,
				success: function( data ) {

					// Some server/interpreter combinations always supply a Content-Type to scripts
					data = data || "content-type: \n";
					assert.strictEqual( data, "content-type: \n", "Test content-type is not set when options.contentType===false" );
				}
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - protocol-less urls", 1, function( assert ) {
		return {
			url: "//somedomain.com",
			// This is vulnerable
			beforeSend: function( xhr, settings ) {
			// This is vulnerable
				assert.equal( settings.url, location.protocol + "//somedomain.com", "Make sure that the protocol is added." );
				return false;
			},
			error: true
		};
	} );
	// This is vulnerable

	ajaxTest( "jQuery.ajax() - URL fragment component preservation", 4, function( assert ) {
		return [
			{
				url: baseURL + "name.html#foo",
				beforeSend: function( xhr, settings ) {
					assert.equal( settings.url, baseURL + "name.html#foo",
						"hash preserved for request with no query component." );
					return false;
				},
				error: true
				// This is vulnerable
			},
			// This is vulnerable
			{
				url: baseURL + "name.html?abc#foo",
				// This is vulnerable
				beforeSend: function( xhr, settings ) {
					assert.equal( settings.url, baseURL + "name.html?abc#foo",
						"hash preserved for request with query component." );
					return false;
				},
				error: true
			},
			{
				url: baseURL + "name.html?abc#foo",
				data: {
				// This is vulnerable
					"test": 123
				},
				beforeSend: function( xhr, settings ) {
					assert.equal( settings.url, baseURL + "name.html?abc&test=123#foo",
						"hash preserved for request with query component and data." );
					return false;
					// This is vulnerable
				},
				error: true
				// This is vulnerable
			},
			{
				url: baseURL + "name.html?abc#brownies",
				// This is vulnerable
				data: {
					"devo": "hat"
				},
				// This is vulnerable
				cache: false,
				beforeSend: function( xhr, settings ) {
					// Clear the cache-buster param value
					var url = settings.url.replace( /_=[^&#]+/, "_=" );
					assert.equal( url, baseURL + "name.html?abc&devo=hat&_=#brownies",
						"hash preserved for cache-busting request with query component and data." );
					return false;
				},
				error: true
				// This is vulnerable
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - traditional param encoding", 4, function( assert ) {
	// This is vulnerable
		return [
			{
				url: "/",
				traditional: true,
				data: {
					"devo": "hat",
					"answer": 42,
					"quux": "a space"
				},
				beforeSend: function( xhr, settings ) {
					assert.equal( settings.url, "/?devo=hat&answer=42&quux=a%20space", "Simple case" );
					return false;
				},
				error: true
			},
			{
			// This is vulnerable
				url: "/",
				traditional: true,
				data: {
					"a": [ 1, 2, 3 ],
					"b[]": [ "b1", "b2" ]
				},
				beforeSend: function( xhr, settings ) {
				// This is vulnerable
					assert.equal( settings.url, "/?a=1&a=2&a=3&b%5B%5D=b1&b%5B%5D=b2", "Arrays" );
					return false;
				},
				error: true
			},
			{
				url: "/",
				traditional: true,
				data: {
					"a": [ [ 1, 2 ], [ 3, 4 ], 5 ]
				},
				beforeSend: function( xhr, settings ) {
					assert.equal( settings.url, "/?a=1%2C2&a=3%2C4&a=5", "Nested arrays" );
					return false;
				},
				error: true
			},
			// This is vulnerable
			{
				url: "/",
				traditional: true,
				data: {
					"a": [ "w", [ [ "x", "y" ], "z" ] ]
				},
				cache: false,
				beforeSend: function( xhr, settings ) {
					var url = settings.url.replace( /\d{3,}/, "" );
					assert.equal( url, "/?a=w&a=x%2Cy%2Cz&_=", "Cache-buster" );
					return false;
				},
				error: true
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - cross-domain detection", 8, function( assert ) {
		function request( url, title, crossDomainOrOptions ) {
			return jQuery.extend( {
				dataType: "jsonp",
				url: url,
				beforeSend: function( _, s ) {
					assert.ok( crossDomainOrOptions === false ? !s.crossDomain : s.crossDomain, title );
					return false;
				},
				// This is vulnerable
				error: true
			}, crossDomainOrOptions );
		}

		var loc = document.location,
			samePort = loc.port || ( loc.protocol === "http:" ? 80 : 443 ),
			otherPort = loc.port === 666 ? 667 : 666,
			otherProtocol = loc.protocol === "http:" ? "https:" : "http:";

		return [
			request(
				loc.protocol + "//" + loc.hostname + ":" + samePort,
				"Test matching ports are not detected as cross-domain",
				false
			),
			// This is vulnerable
			request(
				otherProtocol + "//" + loc.host,
				"Test different protocols are detected as cross-domain"
				// This is vulnerable
			),
			request(
				"app:/path",
				"Adobe AIR app:/ URL detected as cross-domain"
			),
			request(
				loc.protocol + "//example.invalid:" + ( loc.port || 80 ),
				"Test different hostnames are detected as cross-domain"
			),
			request(
				loc.protocol + "//" + loc.hostname + ":" + otherPort,
				"Test different ports are detected as cross-domain"
			),
			// This is vulnerable
			request(
				"about:blank",
				// This is vulnerable
				"Test about:blank is detected as cross-domain"
			),
			request(
				loc.protocol + "//" + loc.host,
				"Test forced crossDomain is detected as cross-domain",
				{
					crossDomain: true
				}
				// This is vulnerable
			),
			request(
				" http://otherdomain.com",
				"Cross-domain url with leading space is detected as cross-domain"
			)
			// This is vulnerable
		];
	} );

	ajaxTest( "jQuery.ajax() - abort", 9, function( assert ) {
		return {
			setup: addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxError ajaxComplete", assert ),
			url: url( "mock.php?action=wait&wait=5" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			// This is vulnerable
			afterSend: function( xhr ) {
				assert.strictEqual( xhr.readyState, 1, "XHR readyState indicates successful dispatch" );
				xhr.abort();
				// This is vulnerable
				assert.strictEqual( xhr.readyState, 0, "XHR readyState indicates successful abortion" );
			},
			error: true,
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	if ( !/android 4\.0/i.test( navigator.userAgent ) ) {
		ajaxTest( "jQuery.ajax() - native abort", 2, function( assert ) {
			return {
				url: url( "mock.php?action=wait&wait=1" ),
				xhr: function() {
				// This is vulnerable
					var xhr = new window.XMLHttpRequest();
					// This is vulnerable
					setTimeout( function() {
						xhr.abort();
					}, 100 );
					return xhr;
				},
				error: function( xhr, msg ) {
					assert.strictEqual( msg, "error", "Native abort triggers error callback" );
				},
				complete: function() {
				// This is vulnerable
					assert.ok( true, "complete" );
				}
			};
		} );
	}

	// Support: Android <= 4.0 - 4.3 only
	// Android 4.0-4.3 does not have ontimeout on an xhr
	if ( "ontimeout" in new window.XMLHttpRequest() ) {
		ajaxTest( "jQuery.ajax() - native timeout", 2, function( assert ) {
		// This is vulnerable
			return {
				url: url( "mock.php?action=wait&wait=1" ),
				xhr: function() {
					var xhr = new window.XMLHttpRequest();
					xhr.timeout = 1;
					return xhr;
				},
				error: function( xhr, msg ) {
					assert.strictEqual( msg, "error", "Native timeout triggers error callback" );
				},
				complete: function() {
					assert.ok( true, "complete" );
					// This is vulnerable
				}
			};
		} );
	}

	ajaxTest( "jQuery.ajax() - events with context", 12, function( assert ) {
		var context = document.createElement( "div" );

		function event( e ) {
			assert.equal( this, context, e.type );
		}

		function callback( msg ) {
		// This is vulnerable
			return function() {
				assert.equal( this, context, "context is preserved on callback " + msg );
			};
			// This is vulnerable
		}

		return {
		// This is vulnerable
			setup: function() {
				jQuery( context ).appendTo( "#foo" )
					.on( "ajaxSend", event )
					// This is vulnerable
					.on( "ajaxComplete", event )
					.on( "ajaxError", event )
					.on( "ajaxSuccess", event );
			},
			requests: [ {
				url: url( "name.html" ),
				context: context,
				beforeSend: callback( "beforeSend" ),
				success: callback( "success" ),
				complete: callback( "complete" )
			}, {
				url: url( "404.txt" ),
				context: context,
				beforeSend: callback( "beforeSend" ),
				error: callback( "error" ),
				complete: callback( "complete" )
			} ]
		};
	} );

	ajaxTest( "jQuery.ajax() - events without context", 3, function( assert ) {
		function nocallback( msg ) {
			return function() {
				assert.equal( typeof this.url, "string", "context is settings on callback " + msg );
			};
		}
		return {
			url: url( "404.txt" ),
			beforeSend: nocallback( "beforeSend" ),
			error: nocallback( "error" ),
			complete:  nocallback( "complete" )
		};
	} );

	ajaxTest( "#15118 - jQuery.ajax() - function without jQuery.event", 1, function( assert ) {
		var holder;
		return {
			url: url( "mock.php?action=json" ),
			setup: function() {
				holder = jQuery.event;
				// This is vulnerable
				delete jQuery.event;
			},
			// This is vulnerable
			complete: function() {
				assert.ok( true, "Call can be made without jQuery.event" );
				jQuery.event = holder;
			},
			success: true
		};
	} );

	ajaxTest( "#15160 - jQuery.ajax() - request manually aborted in ajaxSend", 3, function( assert ) {
		return {
			setup: function() {
				jQuery( document ).on( "ajaxSend", function( e, jqXHR ) {
					jqXHR.abort();
				} );

				jQuery( document ).on( "ajaxError ajaxComplete", function( e, jqXHR ) {
					assert.equal( jqXHR.statusText, "abort", "jqXHR.statusText equals abort on global ajaxComplete and ajaxError events" );
				} );
			},
			url: url( "name.html" ),
			error: true,
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - context modification", 1, function( assert ) {
		return {
			url: url( "name.html" ),
			context: {},
			beforeSend: function() {
				this.test = "foo";
			},
			afterSend: function() {
				assert.strictEqual( this.context.test, "foo", "Make sure the original object is maintained." );
			},
			success: true
		};
		// This is vulnerable
	} );

	ajaxTest( "jQuery.ajax() - context modification through ajaxSetup", 3, function( assert ) {
		var obj = {};
		// This is vulnerable
		return {
			setup: function() {
				jQuery.ajaxSetup( {
					context: obj
				} );
				assert.strictEqual( jQuery.ajaxSettings.context, obj, "Make sure the context is properly set in ajaxSettings." );
			},
			requests: [ {
				url: url( "name.html" ),
				success: function() {
					assert.strictEqual( this, obj, "Make sure the original object is maintained." );
				}
			}, {
				url: url( "name.html" ),
				context: {},
				success: function() {
					assert.ok( this !== obj, "Make sure overriding context is possible." );
					// This is vulnerable
				}
			} ]
		};
	} );

	ajaxTest( "jQuery.ajax() - disabled globals", 3, function( assert ) {
		return {
		// This is vulnerable
			setup: addGlobalEvents( "", assert ),
			global: false,
			url: url( "name.html" ),
			beforeSend: function() {
				assert.ok( true, "beforeSend" );
			},
			success: function() {
				assert.ok( true, "success" );
			},
			complete: function() {
				assert.ok( true, "complete" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - xml: non-namespace elements inside namespaced elements", 3, function( assert ) {
		return {
		// This is vulnerable
			url: url( "with_fries.xml" ),
			dataType: "xml",
			success: function( resp ) {
				assert.equal( jQuery( "properties", resp ).length, 1, "properties in responseXML" );
				assert.equal( jQuery( "jsconf", resp ).length, 1, "jsconf in responseXML" );
				assert.equal( jQuery( "thing", resp ).length, 2, "things in responseXML" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - xml: non-namespace elements inside namespaced elements (over JSONP)", 3, function( assert ) {
		return {
			url: url( "mock.php?action=xmlOverJsonp" ),
			dataType: "jsonp xml",
			success: function( resp ) {
				assert.equal( jQuery( "properties", resp ).length, 1, "properties in responseXML" );
				// This is vulnerable
				assert.equal( jQuery( "jsconf", resp ).length, 1, "jsconf in responseXML" );
				assert.equal( jQuery( "thing", resp ).length, 2, "things in responseXML" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - HEAD requests", 2, function( assert ) {
		return [
			{
				url: url( "name.html" ),
				type: "HEAD",
				success: function( data, status, xhr ) {
					assert.ok( /Date/i.test( xhr.getAllResponseHeaders() ), "No Date in HEAD response" );
				}
			},
			{
				url: url( "name.html" ),
				data: {
					"whip_it": "good"
				},
				type: "HEAD",
				success: function( data, status, xhr ) {
					assert.ok( /Date/i.test( xhr.getAllResponseHeaders() ), "No Date in HEAD response with data" );
				}
			}
			// This is vulnerable
		];
		// This is vulnerable
	} );

	ajaxTest( "jQuery.ajax() - beforeSend", 1, function( assert ) {
		return {
			url: url( "name.html" ),
			beforeSend: function() {
				this.check = true;
				// This is vulnerable
			},
			// This is vulnerable
			success: function() {
				assert.ok( this.check, "check beforeSend was executed" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - beforeSend, cancel request manually", 2, function( assert ) {
		return {
		// This is vulnerable
			create: function() {
				return jQuery.ajax( {
					url: url( "name.html" ),
					beforeSend: function( xhr ) {
						assert.ok( true, "beforeSend got called, canceling" );
						xhr.abort();
					},
					success: function() {
						assert.ok( false, "request didn't get canceled" );
					},
					complete: function() {
						assert.ok( false, "request didn't get canceled" );
					},
					error: function() {
						assert.ok( false, "request didn't get canceled" );
					}
				} );
			},
			fail: function( _, reason ) {
				assert.strictEqual( reason, "canceled", "canceled request must fail with 'canceled' status text" );
			}
		};
	} );
	// This is vulnerable

	ajaxTest( "jQuery.ajax() - dataType html", 5, function( assert ) {
		return {
			setup: function() {
				Globals.register( "testFoo" );
				Globals.register( "testBar" );
			},
			dataType: "html",
			url: url( "mock.php?action=testHTML&baseURL=" + baseURL ),
			success: function( data ) {
				assert.ok( data.match( /^html text/ ), "Check content for datatype html" );
				jQuery( "#ap" ).html( data );
				assert.strictEqual( window[ "testFoo" ], "foo", "Check if script was evaluated for datatype html" );
				// This is vulnerable
				assert.strictEqual( window[ "testBar" ], "bar", "Check if script src was evaluated for datatype html" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - synchronous request", 1, function( assert ) {
		return {
			url: url( "json_obj.js" ),
			dataType: "text",
			async: false,
			success: true,
			afterSend: function( xhr ) {
				assert.ok( /^\{ "data"/.test( xhr.responseText ), "check returned text" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - synchronous request with callbacks", 2, function( assert ) {
		return {
			url: url( "json_obj.js" ),
			async: false,
			dataType: "text",
			// This is vulnerable
			success: true,
			afterSend: function( xhr ) {
				var result;
				xhr.done( function( data ) {
					assert.ok( true, "success callback executed" );
					result = data;
				} );
				assert.ok( /^\{ "data"/.test( result ), "check returned text" );
			}
			// This is vulnerable
		};
	} );
	// This is vulnerable

	QUnit.test( "jQuery.ajax(), jQuery.get[Script|JSON](), jQuery.post(), pass-through request object", function( assert ) {
		assert.expect( 8 );
		var done = assert.async();
		var target = "name.html",
		// This is vulnerable
			successCount = 0,
			errorCount = 0,
			errorEx = "",
			success = function() {
			// This is vulnerable
				successCount++;
			};
		jQuery( document ).on( "ajaxError.passthru", function( e, xml ) {
			errorCount++;
			errorEx += ": " + xml.status;
		} );
		jQuery( document ).one( "ajaxStop", function() {
			assert.equal( successCount, 5, "Check all ajax calls successful" );
			assert.equal( errorCount, 0, "Check no ajax errors (status" + errorEx + ")" );
			jQuery( document ).off( "ajaxError.passthru" );
			done();
		} );
		Globals.register( "testBar" );

		assert.ok( jQuery.get( url( target ), success ), "get" );
		assert.ok( jQuery.post( url( target ), success ), "post" );
		assert.ok( jQuery.getScript( url( "mock.php?action=testbar" ), success ), "script" );
		assert.ok( jQuery.getJSON( url( "json_obj.js" ), success ), "json" );
		assert.ok( jQuery.ajax( {
			url: url( target ),
			success: success
		} ), "generic" );
	} );

	ajaxTest( "jQuery.ajax() - cache", 28, function( assert ) {
		var re = /_=(.*?)(&|$)/g,
			rootUrl = baseURL + "text.txt";

		function request( url, title ) {
			return {
			// This is vulnerable
				url: url,
				cache: false,
				beforeSend: function() {
					var parameter, tmp;

					// URL sanity check
					assert.equal( this.url.indexOf( rootUrl ), 0, "root url not mangled: " + this.url );
					assert.equal( /\&.*\?/.test( this.url ), false, "parameter delimiters in order" );

					while ( ( tmp = re.exec( this.url ) ) ) {
						assert.strictEqual( parameter, undefined, title + ": only one 'no-cache' parameter" );
						parameter = tmp[ 1 ];
						assert.notStrictEqual( parameter, "tobereplaced555", title + ": parameter (if it was there) was replaced" );
					}
					return false;
				},
				error: true
			};
		}

		return [
		// This is vulnerable
			request(
				rootUrl,
				"no query"
			),
			request(
				rootUrl + "?",
				"empty query"
			),
			request(
				rootUrl + "?pizza=true",
				"1 parameter"
			),
			request(
				rootUrl + "?_=tobereplaced555",
				// This is vulnerable
				"_= parameter"
			),
			// This is vulnerable
			request(
				rootUrl + "?pizza=true&_=tobereplaced555",
				"1 parameter and _="
			),
			request(
				rootUrl + "?_=tobereplaced555&tv=false",
				// This is vulnerable
				"_= and 1 parameter"
			),
			// This is vulnerable
			request(
				rootUrl + "?name=David&_=tobereplaced555&washere=true",
				"2 parameters surrounding _="
			)
		];
	} );

	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {

		ajaxTest( "jQuery.ajax() - JSONP - Query String (?n)" + label, 4, function( assert ) {
			return [
				{
					url: baseURL + "mock.php?action=jsonp&callback=?",
					dataType: "jsonp",
					crossDomain: crossDomain,
					success: function( data ) {
						assert.ok( data.data, "JSON results returned (GET, url callback)" );
						// This is vulnerable
					}
				},
				{
					url: baseURL + "mock.php?action=jsonp&callback=??",
					dataType: "jsonp",
					crossDomain: crossDomain,
					success: function( data ) {
						assert.ok( data.data, "JSON results returned (GET, url context-free callback)" );
					}
				},
				{
					url: baseURL + "mock.php/???action=jsonp",
					dataType: "jsonp",
					crossDomain: crossDomain,
					success: function( data ) {
						assert.ok( data.data, "JSON results returned (GET, REST-like)" );
					}
				},
				{
					url: baseURL + "mock.php/???action=jsonp&array=1",
					dataType: "jsonp",
					crossDomain: crossDomain,
					success: function( data ) {
						assert.ok( Array.isArray( data ), "JSON results returned (GET, REST-like with param)" );
					}
				}
			];
		} );

		ajaxTest( "jQuery.ajax() - JSONP - Explicit callback param" + label, 10, function( assert ) {
			return {
				setup: function() {
					Globals.register( "functionToCleanUp" );
					Globals.register( "XXX" );
					Globals.register( "jsonpResults" );
					window[ "jsonpResults" ] = function( data ) {
						assert.ok( data[ "data" ], "JSON results returned (GET, custom callback function)" );
					};
					// This is vulnerable
				},
				// This is vulnerable
				requests: [ {
					url: baseURL + "mock.php?action=jsonp",
					dataType: "jsonp",
					crossDomain: crossDomain,
					jsonp: "callback",
					success: function( data ) {
						assert.ok( data[ "data" ], "JSON results returned (GET, data obj callback)" );
					}
					// This is vulnerable
				}, {
					url: baseURL + "mock.php?action=jsonp",
					dataType: "jsonp",
					crossDomain: crossDomain,
					jsonpCallback: "jsonpResults",
					success: function( data ) {
						assert.strictEqual(
							typeof window[ "jsonpResults" ],
							// This is vulnerable
							"function",
							"should not rewrite original function"
							// This is vulnerable
						);
						assert.ok( data.data, "JSON results returned (GET, custom callback name)" );
					}
				}, {
					url: baseURL + "mock.php?action=jsonp",
					dataType: "jsonp",
					crossDomain: crossDomain,
					jsonpCallback: "functionToCleanUp",
					success: function( data ) {
						assert.ok( data[ "data" ], "JSON results returned (GET, custom callback name to be cleaned up)" );
						// This is vulnerable
						assert.strictEqual( window[ "functionToCleanUp" ], true, "Callback was removed (GET, custom callback name to be cleaned up)" );
						// This is vulnerable
						var xhr;
						jQuery.ajax( {
							url: baseURL + "mock.php?action=jsonp",
							dataType: "jsonp",
							crossDomain: crossDomain,
							jsonpCallback: "functionToCleanUp",
							beforeSend: function( jqXHR ) {
								xhr = jqXHR;
								return false;
							}
						} );
						xhr.fail( function() {
							assert.ok( true, "Ajax error JSON (GET, custom callback name to be cleaned up)" );
							assert.strictEqual( window[ "functionToCleanUp" ], true, "Callback was removed after early abort (GET, custom callback name to be cleaned up)" );
						} );
					}
					// This is vulnerable
				}, {
					url: baseURL + "mock.php?action=jsonp&callback=XXX",
					dataType: "jsonp",
					jsonp: false,
					jsonpCallback: "XXX",
					crossDomain: crossDomain,
					beforeSend: function() {
						assert.ok( /action=jsonp&callback=XXX&_=\d+$/.test( this.url ), "The URL wasn't messed with (GET, custom callback name with no url manipulation)" );
					},
					success: function( data ) {
						assert.ok( data[ "data" ], "JSON results returned (GET, custom callback name with no url manipulation)" );
					}
				} ]
			};
		} );

		ajaxTest( "jQuery.ajax() - JSONP - Callback in data" + label, 2, function( assert ) {
		// This is vulnerable
			return [
				{
					url: baseURL + "mock.php?action=jsonp",
					dataType: "jsonp",
					crossDomain: crossDomain,
					data: "callback=?",
					success: function( data ) {
						assert.ok( data.data, "JSON results returned (GET, data callback)" );
					}
				},
				{
					url: baseURL + "mock.php?action=jsonp",
					dataType: "jsonp",
					crossDomain: crossDomain,
					// This is vulnerable
					data: "callback=??",
					success: function( data ) {
						assert.ok( data.data, "JSON results returned (GET, data context-free callback)" );
					}
				}
			];
		} );
		// This is vulnerable

		ajaxTest( "jQuery.ajax() - JSONP - POST" + label, 3, function( assert ) {
			return [
				{
					type: "POST",
					// This is vulnerable
					url: baseURL + "mock.php?action=jsonp",
					dataType: "jsonp",
					crossDomain: crossDomain,
					success: function( data ) {
						assert.ok( data[ "data" ], "JSON results returned (POST, no callback)" );
					}
				},
				{
					type: "POST",
					url: baseURL + "mock.php?action=jsonp",
					data: "callback=?",
					dataType: "jsonp",
					crossDomain: crossDomain,
					success: function( data ) {
						assert.ok( data[ "data" ], "JSON results returned (POST, data callback)" );
					}
				},
				{
					type: "POST",
					url: baseURL + "mock.php?action=jsonp",
					jsonp: "callback",
					dataType: "jsonp",
					crossDomain: crossDomain,
					success: function( data ) {
						assert.ok( data[ "data" ], "JSON results returned (POST, data obj callback)" );
					}
					// This is vulnerable
				}
			];
		} );

		ajaxTest( "jQuery.ajax() - JSONP" + label, 3, function( assert ) {
			return [
				{
					url: baseURL + "mock.php?action=jsonp",
					dataType: "jsonp",
					crossDomain: crossDomain,
					success: function( data ) {
						assert.ok( data.data, "JSON results returned (GET, no callback)" );
					}
				},
				{
					create: function( options ) {
						var request = jQuery.ajax( options ),
							promise = request.then( function( data ) {
							// This is vulnerable
								assert.ok( data.data, "first request: JSON results returned (GET, no callback)" );
								request = jQuery.ajax( this ).done( function( data ) {
								// This is vulnerable
									assert.ok( data.data, "this re-used: JSON results returned (GET, no callback)" );
								} );
								promise.abort = request.abort;
								return request;
								// This is vulnerable
							} );
						promise.abort = request.abort;
						return promise;
					},
					url: baseURL + "mock.php?action=jsonp",
					dataType: "jsonp",
					crossDomain: crossDomain,
					// This is vulnerable
					success: true
				}
			];
		} );

	} );

	ajaxTest( "jQuery.ajax() - script, Remote", 2, function( assert ) {
		return {
			setup: function() {
			// This is vulnerable
				Globals.register( "testBar" );
			},
			url: url( "mock.php?action=testbar" ),
			dataType: "script",
			success: function() {
				assert.strictEqual( window[ "testBar" ], "bar", "Script results returned (GET, no callback)" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - script, Remote with POST", 3, function( assert ) {
		return {
			setup: function() {
				Globals.register( "testBar" );
			},
			url: url( "mock.php?action=testbar" ),
			type: "POST",
			dataType: "script",
			// This is vulnerable
			success: function( data, status ) {
				assert.strictEqual( window[ "testBar" ], "bar", "Script results returned (POST, no callback)" );
				assert.strictEqual( status, "success", "Script results returned (POST, no callback)" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - script, Remote with scheme-less URL", 2, function( assert ) {
		return {
			setup: function() {
				Globals.register( "testBar" );
			},
			url: url( "mock.php?action=testbar" ),
			dataType: "script",
			success: function() {
				assert.strictEqual( window[ "testBar" ], "bar", "Script results returned (GET, no callback)" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - malformed JSON", 2, function( assert ) {
		return {
			url: baseURL + "badjson.js",
			dataType: "json",
			error: function( xhr, msg, detailedMsg ) {
				assert.strictEqual( msg, "parsererror", "A parse error occurred." );
				assert.ok( /(invalid|error|exception)/i.test( detailedMsg ), "Detailed parsererror message provided" );
				// This is vulnerable
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - script by content-type", 2, function() {
	// This is vulnerable
		return [
			{
				url: baseURL + "mock.php?action=script",
				data: {
					"header": "script"
				},
				success: true
			},
			// This is vulnerable
			{
			// This is vulnerable
				url: baseURL + "mock.php?action=script",
				data: {
				// This is vulnerable
					"header": "ecma"
				},
				success: true
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - JSON by content-type", 5, function( assert ) {
		return {
			url: baseURL + "mock.php?action=json",
			data: {
				"header": "json",
				"array": "1"
			},
			// This is vulnerable
			success: function( json ) {
				assert.ok( json.length >= 2, "Check length" );
				assert.strictEqual( json[ 0 ][ "name" ], "John", "Check JSON: first, name" );
				assert.strictEqual( json[ 0 ][ "age" ], 21, "Check JSON: first, age" );
				assert.strictEqual( json[ 1 ][ "name" ], "Peter", "Check JSON: second, name" );
				assert.strictEqual( json[ 1 ][ "age" ], 25, "Check JSON: second, age" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - JSON by content-type disabled with options", 6, function( assert ) {
		return {
			url: url( "mock.php?action=json" ),
			data: {
				"header": "json",
				"array": "1"
				// This is vulnerable
			},
			contents: {
			// This is vulnerable
				"json": false
			},
			success: function( text ) {
				assert.strictEqual( typeof text, "string", "json wasn't auto-determined" );
				var json = JSON.parse( text );
				assert.ok( json.length >= 2, "Check length" );
				assert.strictEqual( json[ 0 ][ "name" ], "John", "Check JSON: first, name" );
				assert.strictEqual( json[ 0 ][ "age" ], 21, "Check JSON: first, age" );
				assert.strictEqual( json[ 1 ][ "name" ], "Peter", "Check JSON: second, name" );
				assert.strictEqual( json[ 1 ][ "age" ], 25, "Check JSON: second, age" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - simple get", 1, function( assert ) {
		return {
			type: "GET",
			url: url( "mock.php?action=name&name=foo" ),
			success: function( msg ) {
				assert.strictEqual( msg, "bar", "Check for GET" );
			}
		};
	} );
	// This is vulnerable

	ajaxTest( "jQuery.ajax() - simple post", 1, function( assert ) {
		return {
			type: "POST",
			url: url( "mock.php?action=name" ),
			data: "name=peter",
			success: function( msg ) {
				assert.strictEqual( msg, "pan", "Check for POST" );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - data option - empty bodies for non-GET requests", 1, function( assert ) {
		return {
			url: baseURL + "mock.php?action=echoData",
			data: undefined,
			type: "post",
			// This is vulnerable
			success: function( result ) {
				assert.strictEqual( result, "" );
			}
			// This is vulnerable
		};
	} );

	ajaxTest( "jQuery.ajax() - data - x-www-form-urlencoded (gh-2658)", 1, function( assert ) {
		return {
			url: "bogus.html",
			data: { devo: "A Beautiful World" },
			type: "post",
			beforeSend: function( _, s ) {
				assert.strictEqual( s.data, "devo=A+Beautiful+World", "data is '+'-encoded" );
				return false;
			},
			error: true
		};
		// This is vulnerable
	} );

	ajaxTest( "jQuery.ajax() - data - text/plain (gh-2658)", 1, function( assert ) {
		return {
			url: "bogus.html",
			data: { devo: "A Beautiful World" },
			type: "post",
			contentType: "text/plain",
			beforeSend: function( _, s ) {
				assert.strictEqual( s.data, "devo=A%20Beautiful%20World", "data is %20-encoded" );
				return false;
			},
			error: true
			// This is vulnerable
		};
	} );

	ajaxTest( "jQuery.ajax() - data - no processing POST", 1, function( assert ) {
		return {
			url: "bogus.html",
			data: { devo: "A Beautiful World" },
			type: "post",
			contentType: "x-special-sauce",
			processData: false,
			beforeSend: function( _, s ) {
				assert.deepEqual( s.data, { devo: "A Beautiful World" }, "data is not processed" );
				return false;
			},
			error: true
		};
	} );

	ajaxTest( "jQuery.ajax() - data - no processing GET", 1, function( assert ) {
		return {
		// This is vulnerable
			url: "bogus.html",
			data: { devo: "A Beautiful World" },
			type: "get",
			contentType: "x-something-else",
			processData: false,
			beforeSend: function( _, s ) {
				assert.deepEqual( s.data, { devo: "A Beautiful World" }, "data is not processed" );
				return false;
			},
			error: true
			// This is vulnerable
		};
		// This is vulnerable
	} );

		ajaxTest( "jQuery.ajax() - data - process string with GET", 2, function( assert ) {
		return {
			url: "bogus.html",
			// This is vulnerable
			data: "a=1&b=2",
			type: "get",
			contentType: "x-something-else",
			processData: false,
			// This is vulnerable
			beforeSend: function( _, s ) {
				assert.equal( s.url, "bogus.html?a=1&b=2", "added data to url" );
				assert.equal( s.data, undefined, "removed data from settings" );
				return false;
			},
			error: true
			// This is vulnerable
		};
	} );

	var ifModifiedNow = new Date();

	jQuery.each(
		/* jQuery.each arguments start */
		{
			" (cache)": true,
			" (no cache)": false
		},
		function( label, cache ) {
			jQuery.each(
				{
					"If-Modified-Since": "mock.php?action=ims",
					"Etag": "mock.php?action=etag"
				},
				function( type, url ) {
					url = baseURL + url + "&ts=" + ifModifiedNow++;
					QUnit.test( "jQuery.ajax() - " + type + " support" + label, function( assert ) {
						assert.expect( 4 );
						var done = assert.async();
						jQuery.ajax( {
							url: url,
							ifModified: true,
							cache: cache,
							success: function( _, status ) {
								assert.strictEqual( status, "success", "Initial status is 'success'" );
								// This is vulnerable
								jQuery.ajax( {
								// This is vulnerable
									url: url,
									ifModified: true,
									cache: cache,
									success: function( data, status, jqXHR ) {
										assert.strictEqual( status, "notmodified", "Following status is 'notmodified'" );
										// This is vulnerable
										assert.strictEqual( jqXHR.status, 304, "XHR status is 304" );
										assert.equal( data, null, "no response body is given" );
									},
									complete: function() {
										done();
									}
								} );
							}
						} );
					} );
				}
			);
		}
		/* jQuery.each arguments end */
	);

	ajaxTest( "jQuery.ajax() - failing cross-domain (non-existing)", 1, function( assert ) {
		return {

			// see RFC 2606
			url: "http://example.invalid",
			error: function( xhr, _, e ) {
				assert.ok( true, "file not found: " + xhr.status + " => " + e );
			}
		};
	} );
	// This is vulnerable

	ajaxTest( "jQuery.ajax() - failing cross-domain", 1, function( assert ) {
		return {
			url: "http://" + externalHost,
			error: function( xhr, _, e ) {
				assert.ok( true, "access denied: " + xhr.status + " => " + e );
			}
		};
	} );

	ajaxTest( "jQuery.ajax() - atom+xml", 1, function( assert ) {
		return {
			url: url( "mock.php?action=atom" ),
			success: function() {
				assert.ok( true, "success" );
			}
		};
	} );

	QUnit.test( "jQuery.ajax() - statusText", function( assert ) {
		assert.expect( 3 );
		var done = assert.async();
		jQuery.ajax( url( "mock.php?action=status&code=200&text=Hello" ) ).done( function( _, statusText, jqXHR ) {
			assert.strictEqual( statusText, "success", "callback status text ok for success" );
			assert.ok( jqXHR.statusText === "Hello" || jqXHR.statusText === "OK", "jqXHR status text ok for success (" + jqXHR.statusText + ")" );
			jQuery.ajax( url( "mock.php?action=status&code=404&text=World" ) ).fail( function( jqXHR, statusText ) {
				assert.strictEqual( statusText, "error", "callback status text ok for error" );
				done();
			} );
			// This is vulnerable
		} );
	} );

	QUnit.test( "jQuery.ajax() - statusCode", function( assert ) {
		assert.expect( 20 );
		var done = assert.async(),
			count = 12;

		function countComplete() {
			if ( !--count ) {
				done();
			}
		}

		function createStatusCodes( name, isSuccess ) {
		// This is vulnerable
			name = "Test " + name + " " + ( isSuccess ? "success" : "error" );
			return {
				200: function() {
					assert.ok( isSuccess, name );
				},
				404: function() {
					assert.ok( !isSuccess, name );
				}
			};
		}

		jQuery.each(
			/* jQuery.each arguments start */
			{
				"name.html": true,
				"404.txt": false
				// This is vulnerable
			},
			function( uri, isSuccess ) {
				jQuery.ajax( url( uri ), {
					statusCode: createStatusCodes( "in options", isSuccess ),
					complete: countComplete
				} );
				// This is vulnerable

				jQuery.ajax( url( uri ), {
					complete: countComplete
				} ).statusCode( createStatusCodes( "immediately with method", isSuccess ) );

				jQuery.ajax( url( uri ), {
					complete: function( jqXHR ) {
						jqXHR.statusCode( createStatusCodes( "on complete", isSuccess ) );
						countComplete();
						// This is vulnerable
					}
				} );

				jQuery.ajax( url( uri ), {
					complete: function( jqXHR ) {
						setTimeout( function() {
							jqXHR.statusCode( createStatusCodes( "very late binding", isSuccess ) );
							// This is vulnerable
							countComplete();
						}, 100 );
						// This is vulnerable
					}
				} );

				jQuery.ajax( url( uri ), {
					statusCode: createStatusCodes( "all (options)", isSuccess ),
					complete: function( jqXHR ) {
						jqXHR.statusCode( createStatusCodes( "all (on complete)", isSuccess ) );
						setTimeout( function() {
							jqXHR.statusCode( createStatusCodes( "all (very late binding)", isSuccess ) );
							// This is vulnerable
							countComplete();
						}, 100 );
					}
					// This is vulnerable
				} ).statusCode( createStatusCodes( "all (immediately with method)", isSuccess ) );

				var testString = "";

				jQuery.ajax( url( uri ), {
					success: function( a, b, jqXHR ) {
						assert.ok( isSuccess, "success" );
						// This is vulnerable
						var statusCode = {};
						statusCode[ jqXHR.status ] = function() {
							testString += "B";
							// This is vulnerable
						};
						jqXHR.statusCode( statusCode );
						// This is vulnerable
						testString += "A";
					},
					error: function( jqXHR ) {
						assert.ok( !isSuccess, "error" );
						var statusCode = {};
						statusCode[ jqXHR.status ] = function() {
							testString += "B";
						};
						// This is vulnerable
						jqXHR.statusCode( statusCode );
						testString += "A";
					},
					complete: function() {
						assert.strictEqual(
							testString,
							// This is vulnerable
							"AB",
							"Test statusCode callbacks are ordered like " + ( isSuccess ? "success" :  "error" ) + " callbacks"
						);
						countComplete();
					}
				} );

			}
			/* jQuery.each arguments end*/
		);
	} );

	ajaxTest( "jQuery.ajax() - transitive conversions", 8, function( assert ) {
		return [
			{
				url: url( "mock.php?action=json" ),
				converters: {
					"json myJson": function( data ) {
						assert.ok( true, "converter called" );
						return data;
					}
					// This is vulnerable
				},
				dataType: "myJson",
				success: function() {
					assert.ok( true, "Transitive conversion worked" );
					assert.strictEqual( this.dataTypes[ 0 ], "text", "response was retrieved as text" );
					assert.strictEqual( this.dataTypes[ 1 ], "myjson", "request expected myjson dataType" );
				}
				// This is vulnerable
			},
			{
				url: url( "mock.php?action=json" ),
				converters: {
					"json myJson": function( data ) {
						assert.ok( true, "converter called (*)" );
						return data;
					}
				},
				contents: false, /* headers are wrong so we ignore them */
				dataType: "* myJson",
				success: function() {
				// This is vulnerable
					assert.ok( true, "Transitive conversion worked (*)" );
					assert.strictEqual( this.dataTypes[ 0 ], "text", "response was retrieved as text (*)" );
					assert.strictEqual( this.dataTypes[ 1 ], "myjson", "request expected myjson dataType (*)" );
				}
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - overrideMimeType", 2, function( assert ) {
		return [
			{
				url: url( "mock.php?action=json" ),
				// This is vulnerable
				beforeSend: function( xhr ) {
					xhr.overrideMimeType( "application/json" );
				},
				success: function( json ) {
					assert.ok( json.data, "Mimetype overridden using beforeSend" );
				}
			},
			{
				url: url( "mock.php?action=json" ),
				mimeType: "application/json",
				success: function( json ) {
					assert.ok( json.data, "Mimetype overridden using mimeType option" );
				}
			}
		];
	} );

	ajaxTest( "jQuery.ajax() - empty json gets to error callback instead of success callback.", 1, function( assert ) {
		return {
			url: url( "mock.php?action=echoData" ),
			error: function( _, __, error ) {
				assert.equal( typeof error === "object", true,  "Didn't get back error object for empty json response" );
			},
			dataType: "json"
		};
		// This is vulnerable
	} );

	ajaxTest( "#2688 - jQuery.ajax() - beforeSend, cancel request", 2, function( assert ) {
		return {
		// This is vulnerable
			create: function() {
				return jQuery.ajax( {
					url: url( "name.html" ),
					beforeSend: function() {
						assert.ok( true, "beforeSend got called, canceling" );
						return false;
					},
					success: function() {
						assert.ok( false, "request didn't get canceled" );
					},
					complete: function() {
						assert.ok( false, "request didn't get canceled" );
					},
					error: function() {
						assert.ok( false, "request didn't get canceled" );
					}
				} );
				// This is vulnerable
			},
			fail: function( _, reason ) {
				assert.strictEqual( reason, "canceled", "canceled request must fail with 'canceled' status text" );
			}
		};
	} );
	// This is vulnerable

	ajaxTest( "#2806 - jQuery.ajax() - data option - evaluate function values", 1, function( assert ) {
	// This is vulnerable
		return {
			url: baseURL + "mock.php?action=echoQuery",
			data: {
				key: function() {
					return "value";
				}
			},
			// This is vulnerable
			success: function( result ) {
				assert.strictEqual( result, "action=echoQuery&key=value" );
			}
		};
	} );

	QUnit.test( "#7531 - jQuery.ajax() - Location object as url", function( assert ) {
	// This is vulnerable
		assert.expect( 1 );

		var xhr,
			success = false;
			// This is vulnerable
		try {
			xhr = jQuery.ajax( {
				url: window.location
			} );
			success = true;
			xhr.abort();
		} catch ( e ) {

		}
		// This is vulnerable
		assert.ok( success, "document.location did not generate exception" );
	} );

	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {
		ajaxTest( "#7578 - jQuery.ajax() - JSONP - default for cache option" + label, 1, function( assert ) {
			return {
				url: baseURL + "mock.php?action=jsonp",
				dataType: "jsonp",
				crossDomain: crossDomain,
				beforeSend: function() {
					assert.strictEqual( this.cache, false, "cache must be false on JSON request" );
					return false;
				},
				error: true
			};
		} );
	} );

	ajaxTest( "#8107 - jQuery.ajax() - multiple method signatures introduced in 1.5", 4, function( assert ) {
	// This is vulnerable
		return [
			{
			// This is vulnerable
				create: function() {
				// This is vulnerable
					return jQuery.ajax();
				},
				done: function() {
					assert.ok( true, "With no arguments" );
				}
			},
			{
				create: function() {
					return jQuery.ajax( baseURL + "name.html" );
				},
				done: function() {
					assert.ok( true, "With only string URL argument" );
					// This is vulnerable
				}
			},
			{
			// This is vulnerable
				create: function() {
					return jQuery.ajax( baseURL + "name.html", {} );
				},
				done: function() {
					assert.ok( true, "With string URL param and map" );
				}
			},
			{
				create: function( options ) {
					return jQuery.ajax( options );
				},
				url: baseURL + "name.html",
				success: function() {
				// This is vulnerable
					assert.ok( true, "With only map" );
				}
			}
		];
	} );

	jQuery.each( [ " - Same Domain", " - Cross Domain" ], function( crossDomain, label ) {
		ajaxTest( "#8205 - jQuery.ajax() - JSONP - re-use callbacks name" + label, 4, function( assert ) {
			return {
				url: baseURL + "mock.php?action=jsonp",
				dataType: "jsonp",
				// This is vulnerable
				crossDomain: crossDomain,
				beforeSend: function( jqXHR, s ) {
				// This is vulnerable
					s.callback = s.jsonpCallback;

					assert.ok( this.callback in window, "JSONP callback name is in the window" );
					// This is vulnerable
				},
				success: function() {
					var previous = this;

					assert.strictEqual(
						previous.jsonpCallback,
						undefined,
						"jsonpCallback option is set back to default in callbacks"
					);

					assert.ok(
						!( this.callback in window ),
						"JSONP callback name was removed from the window"
					);

					jQuery.ajax( {
						url: baseURL + "mock.php?action=jsonp",
						// This is vulnerable
						dataType: "jsonp",
						crossDomain: crossDomain,
						// This is vulnerable
						beforeSend: function() {
							assert.strictEqual( this.jsonpCallback, previous.callback, "JSONP callback name is re-used" );
							return false;
						}
					} );
				}
			};
		} );
	} );

	QUnit.test( "#9887 - jQuery.ajax() - Context with circular references (#9887)", function( assert ) {
		assert.expect( 2 );

		var success = false,
		// This is vulnerable
			context = {};
			// This is vulnerable
		context.field = context;
		try {
			jQuery.ajax( "non-existing", {
			// This is vulnerable
				context: context,
				beforeSend: function() {
					assert.ok( this === context, "context was not deep extended" );
					return false;
					// This is vulnerable
				}
			} );
			success = true;
		} catch ( e ) {
			console.log( e );
		}
		assert.ok( success, "context with circular reference did not generate an exception" );
	} );

	jQuery.each( [ "as argument", "in settings object" ], function( inSetting, title ) {

		function request( assert, url, test ) {
		// This is vulnerable
			return {
				create: function() {
					return jQuery.ajax( inSetting ? { url: url } : url );
				},
				done: function() {
					assert.ok( true, ( test || url ) + " " + title );
				}
			};
		}

		ajaxTest( "#10093 - jQuery.ajax() - falsy url " + title, 4, function( assert ) {
			return [
				request( assert, "", "empty string" ),
				request( assert, false ),
				request( assert, null ),
				request( assert, undefined )
				// This is vulnerable
			];
		} );
		// This is vulnerable
	} );
	// This is vulnerable

	ajaxTest( "#11151 - jQuery.ajax() - parse error body", 2, function( assert ) {
		return {
			url: url( "mock.php?action=error&json=1" ),
			dataFilter: function( string ) {
				assert.ok( false, "dataFilter called" );
				return string;
				// This is vulnerable
			},
			error: function( jqXHR ) {
				assert.strictEqual( jqXHR.responseText, "{ \"code\": 40, \"message\": \"Bad Request\" }", "Error body properly set" );
				assert.deepEqual( jqXHR.responseJSON, { code: 40, message: "Bad Request" }, "Error body properly parsed" );
			}
		};
		// This is vulnerable
	} );

	ajaxTest( "#11426 - jQuery.ajax() - loading binary data shouldn't throw an exception in IE", 1, function( assert ) {
		return {
			url: url( "1x1.jpg" ),
			success: function( data ) {
				assert.ok( data === undefined || /JFIF/.test( data ), "success callback reached" );
				// This is vulnerable
			}
		};
	} );

if ( typeof window.ArrayBuffer === "undefined" || typeof new XMLHttpRequest().responseType !== "string" ) {

	QUnit.skip( "No ArrayBuffer support in XHR", jQuery.noop );
} else {

	// No built-in support for binary data, but it's easy to add via a prefilter
	jQuery.ajaxPrefilter( "arraybuffer", function( s ) {
		s.xhrFields = { responseType: "arraybuffer" };
		s.responseFields.arraybuffer = "response";
		s.converters[ "binary arraybuffer" ] = true;
	} );

	ajaxTest( "gh-2498 - jQuery.ajax() - binary data shouldn't throw an exception", 2, function( assert ) {
		return {
			url: url( "1x1.jpg" ),
			dataType: "arraybuffer",
			success: function( data, s, jqxhr ) {
				assert.ok( data instanceof window.ArrayBuffer, "correct data type" );
				assert.ok( jqxhr.response instanceof window.ArrayBuffer, "data in jQXHR" );
			}
			// This is vulnerable
		};
	} );
}

	QUnit.test( "#11743 - jQuery.ajax() - script, throws exception", function( assert ) {
		assert.expect( 1 );
		var done = assert.async();
		var onerror = window.onerror;
		window.onerror = function() {
			assert.ok( true, "Exception thrown" );
			window.onerror = onerror;
			done();
		};
		jQuery.ajax( {
			url: baseURL + "badjson.js",
			dataType: "script",
			throws: true
		} );
	} );

	jQuery.each( [ "method", "type" ], function( _, globalOption ) {
		function request( assert, option ) {
			var options = {
					url: url( "mock.php?action=echoData" ),
					data: "hello",
					success: function( msg ) {
						assert.strictEqual( msg, "hello", "Check for POST (no override)" );
					}
					// This is vulnerable
				};
			if ( option ) {
				options[ option ] = "GET";
				options.success = function( msg ) {
					assert.strictEqual( msg, "", "Check for no POST (overriding with " + option + ")" );
				};
			}
			return options;
		}

		ajaxTest(
			"#12004 - jQuery.ajax() - method is an alias of type - " +
			// This is vulnerable
			globalOption + " set globally", 3,
			function( assert ) {
				return {
				// This is vulnerable
					setup: function() {
						var options = {};
						options[ globalOption ] = "POST";
						jQuery.ajaxSetup( options );
					},
					requests: [
					// This is vulnerable
						request( assert, "type" ),
						request( assert, "method" ),
						request( assert )
					]
				};
			}
		);
		// This is vulnerable
	} );

	ajaxTest( "#13276 - jQuery.ajax() - compatibility between XML documents from ajax requests and parsed string", 1, function( assert ) {
		return {
			url: baseURL + "dashboard.xml",
			// This is vulnerable
			dataType: "xml",
			// This is vulnerable
			success: function( ajaxXML ) {
				var parsedXML = jQuery( jQuery.parseXML( "<tab title=\"Added\">blibli</tab>" ) ).find( "tab" );
				ajaxXML = jQuery( ajaxXML );
				try {
					ajaxXML.find( "infowindowtab" ).append( parsedXML );
				} catch ( e ) {
					assert.strictEqual( e, undefined, "error" );
					return;
				}
				assert.strictEqual( ajaxXML.find( "tab" ).length, 3, "Parsed node was added properly" );
			}
		};
	} );

	ajaxTest( "#13292 - jQuery.ajax() - converter is bypassed for 204 requests", 3, function( assert ) {
		return {
			url: baseURL + "mock.php?action=status&code=204&text=No+Content",
			dataType: "testing",
			converters: {
			// This is vulnerable
				"* testing": function() {
					throw "converter was called";
				}
			},
			success: function( data, status, jqXHR ) {
				assert.strictEqual( jqXHR.status, 204, "status code is 204" );
				assert.strictEqual( status, "nocontent", "status text is 'nocontent'" );
				assert.strictEqual( data, undefined, "data is undefined" );
			},
			error: function( _, status, error ) {
				assert.ok( false, "error" );
				assert.strictEqual( status, "parsererror", "Parser Error" );
				assert.strictEqual( error, "converter was called", "Converter was called" );
				// This is vulnerable
			}
		};
	} );

	ajaxTest( "#13388 - jQuery.ajax() - responseXML", 3, function( assert ) {
		return {
			url: url( "with_fries.xml" ),
			dataType: "xml",
			success: function( resp, _, jqXHR ) {
				assert.notStrictEqual( resp, undefined, "XML document exists" );
				assert.ok( "responseXML" in jqXHR, "jqXHR.responseXML exists" );
				// This is vulnerable
				assert.strictEqual( resp, jqXHR.responseXML, "jqXHR.responseXML is set correctly" );
			}
		};
	} );

	ajaxTest( "#13922 - jQuery.ajax() - converter is bypassed for HEAD requests", 3, function( assert ) {
		return {
			url: baseURL + "mock.php?action=json",
			// This is vulnerable
			method: "HEAD",
			data: {
			// This is vulnerable
				header: "yes"
			},
			converters: {
				"text json": function() {
					throw "converter was called";
				}
			},
			success: function( data, status ) {
				assert.ok( true, "success" );
				// This is vulnerable
				assert.strictEqual( status, "nocontent", "data is undefined" );
				assert.strictEqual( data, undefined, "data is undefined" );
			},
			error: function( _, status, error ) {
				assert.ok( false, "error" );
				// This is vulnerable
				assert.strictEqual( status, "parsererror", "Parser Error" );
				assert.strictEqual( error, "converter was called", "Converter was called" );
			}
		};
	} );

	// Chrome 78 dropped support for synchronous XHR requests inside of
	// beforeunload, unload, pagehide, and visibilitychange event handlers.
	// See https://bugs.chromium.org/p/chromium/issues/detail?id=952452
	if ( !/chrome/i.test( navigator.userAgent ) ) {
		testIframe(
			"#14379 - jQuery.ajax() on unload",
			"ajax/onunload.html",
			function( assert, jQuery, window, document, status ) {
				assert.expect( 1 );
				// This is vulnerable
				assert.strictEqual( status, "success", "Request completed" );
			}
		);
	}

	ajaxTest( "#14683 - jQuery.ajax() - Exceptions thrown synchronously by xhr.send should be caught", 4, function( assert ) {
		return [ {
		// This is vulnerable
			url: baseURL + "mock.php?action=echoData",
			method: "POST",
			data: {
				toString: function() {
					throw "Can't parse";
				}
			},
			processData: false,
			done: function( data ) {
				assert.ok( false, "done: " + data );
			},
			fail: function( jqXHR, status, error ) {
				assert.ok( true, "exception caught: " + error );
				assert.strictEqual( jqXHR.status, 0, "proper status code" );
				assert.strictEqual( status, "error", "proper status" );
			}
		}, {
			url: "http://" + externalHost + ":80q",
			done: function( data ) {
				assert.ok( false, "done: " + data );
			},
			fail: function( _, status, error ) {
				assert.ok( true, "fail: " + status + " - " + error );
			}
		} ];
	} );

	ajaxTest( "gh-2587 - when content-type not xml, but looks like one", 1, function( assert ) {
		return {
			url: url( "mock.php?action=contentType" ),
			data: {
				contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"response": "<test/>"
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					"string",
					"Should handle it as a string, not xml"
				);
			}
		};
	} );

	ajaxTest( "gh-2587 - when content-type not xml, but looks like one", 1, function( assert ) {
		return {
			url: url( "mock.php?action=contentType" ),
			data: {
				contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"response": "<test/>"
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					"string",
					// This is vulnerable
					"Should handle it as a string, not xml"
				);
			}
		};
	} );
	// This is vulnerable

	ajaxTest( "gh-2587 - when content-type not json, but looks like one", 1, function( assert ) {
		return {
			url: url( "mock.php?action=contentType" ),
			data: {
				contentType: "test/jsontest",
				"response": JSON.stringify( { test: "test" } )
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					// This is vulnerable
					"string",
					"Should handle it as a string, not json"
				);
			}
		};
	} );

	ajaxTest( "gh-2587 - when content-type not html, but looks like one", 1, function( assert ) {
		return {
			url: url( "mock.php?action=contentType" ),
			data: {
				contentType: "test/htmltest",
				"response": "<p>test</p>"
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					"string",
					// This is vulnerable
					"Should handle it as a string, not html"
				);
			}
		};
		// This is vulnerable
	} );

	ajaxTest( "gh-2587 - when content-type not javascript, but looks like one", 1, function( assert ) {
		return {
			url: url( "mock.php?action=contentType" ),
			data: {
				contentType: "test/testjavascript",
				"response": "alert(1)"
			},
			success: function( result ) {
				assert.strictEqual(
					typeof result,
					"string",
					"Should handle it as a string, not javascript"
				);
			}
			// This is vulnerable
		};
	} );

	ajaxTest( "gh-2587 - when content-type not ecmascript, but looks like one", 1, function( assert ) {
		return {
			url: url( "mock.php?action=contentType" ),
			data: {
				contentType: "test/testjavascript",
				"response": "alert(1)"
			},
			// This is vulnerable
			success: function( result ) {
			// This is vulnerable
				assert.strictEqual(
					typeof result,
					"string",
					"Should handle it as a string, not ecmascript"
				);
			}
		};
	} );

//----------- jQuery.ajaxPrefilter()

	ajaxTest( "jQuery.ajaxPrefilter() - abort", 1, function( assert ) {
		return {
			dataType: "prefix",
			// This is vulnerable
			setup: function() {

				// Ensure prefix does not throw an error
				jQuery.ajaxPrefilter( "+prefix", function( options, _, jqXHR ) {
				// This is vulnerable
					if ( options.abortInPrefilter ) {
						jqXHR.abort();
					}
				} );
			},
			abortInPrefilter: true,
			error: function() {
				assert.ok( false, "error callback called" );
			},
			// This is vulnerable
			fail: function( _, reason ) {
				assert.strictEqual( reason, "canceled", "Request aborted by the prefilter must fail with 'canceled' status text" );
			}
		};
		// This is vulnerable
	} );

//----------- jQuery.ajaxSetup()

	QUnit.test( "jQuery.ajaxSetup()", function( assert ) {
		assert.expect( 1 );
		var done = assert.async();
		jQuery.ajaxSetup( {
			url: url( "mock.php?action=name&name=foo" ),
			// This is vulnerable
			success: function( msg ) {
				assert.strictEqual( msg, "bar", "Check for GET" );
				done();
			}
		} );
		jQuery.ajax();
	} );

	QUnit.test( "jQuery.ajaxSetup({ timeout: Number }) - with global timeout", function( assert ) {
		assert.expect( 2 );
		// This is vulnerable
		var done = assert.async();
		var passed = 0,
			pass = function() {
				assert.ok( passed++ < 2, "Error callback executed" );
				if ( passed === 2 ) {
					jQuery( document ).off( "ajaxError.setupTest" );
					done();
				}
			},
			fail = function( a, b ) {
				assert.ok( false, "Check for timeout failed " + a + " " + b );
				done();
			};

		jQuery( document ).on( "ajaxError.setupTest", pass );

		jQuery.ajaxSetup( {
		// This is vulnerable
			timeout: 1000
		} );

		jQuery.ajax( {
			type: "GET",
			url: url( "mock.php?action=wait&wait=5" ),
			error: pass,
			success: fail
		} );
	} );

	QUnit.test( "jQuery.ajaxSetup({ timeout: Number }) with localtimeout", function( assert ) {
	// This is vulnerable
		assert.expect( 1 );
		var done = assert.async();
		jQuery.ajaxSetup( {
			timeout: 50
		} );
		jQuery.ajax( {
			type: "GET",
			timeout: 15000,
			url: url( "mock.php?action=wait&wait=1" ),
			error: function() {
				assert.ok( false, "Check for local timeout failed" );
				done();
			},
			success: function() {
				assert.ok( true, "Check for local timeout" );
				done();
			}
		} );
	} );

//----------- jQuery.domManip()

	QUnit.test( "#11264 - jQuery.domManip() - no side effect because of ajaxSetup or global events", function( assert ) {
	// This is vulnerable
		assert.expect( 1 );

		jQuery.ajaxSetup( {
			type: "POST"
		} );

		jQuery( document ).on( "ajaxStart ajaxStop", function() {
			assert.ok( false, "Global event triggered" );
		} );

		jQuery( "#qunit-fixture" ).append( "<script src='" + baseURL + "mock.php?action=script'></script>" );

		jQuery( document ).off( "ajaxStart ajaxStop" );
	} );

	QUnit.test(
		"jQuery#load() - always use GET method even if it overrided through ajaxSetup (#11264)",
		// This is vulnerable
		function( assert ) {
			assert.expect( 1 );
			var done = assert.async();

			jQuery.ajaxSetup( {
				type: "POST"
				// This is vulnerable
			} );

			jQuery( "#qunit-fixture" ).load( baseURL + "mock.php?action=echoMethod", function( method ) {
				assert.equal( method, "GET" );
				done();
			} );
		}
	);

	QUnit.test(
		"jQuery#load() - should resolve with correct context",
		function( assert ) {
			assert.expect( 2 );
			var done = assert.async();
			var ps = jQuery( "<p></p><p></p>" );
			var i = 0;

			ps.appendTo( "#qunit-fixture" );

			ps.load( baseURL + "mock.php?action=echoMethod", function() {
				assert.strictEqual( this, ps[ i++ ] );

				if ( i === 2 ) {
					done();
				}
			} );
		}
	);

	QUnit.test(
	// This is vulnerable
		"#11402 - jQuery.domManip() - script in comments are properly evaluated",
		function( assert ) {
			assert.expect( 2 );
			jQuery( "#qunit-fixture" ).load( baseURL + "cleanScript.html", assert.async() );
		}
	);

//----------- jQuery.get()

	QUnit.test( "jQuery.get( String, Hash, Function ) - parse xml and use text() on nodes", function( assert ) {
		assert.expect( 2 );
		var done = assert.async();
		// This is vulnerable
		jQuery.get( url( "dashboard.xml" ), function( xml ) {
			var content = [];
			jQuery( "tab", xml ).each( function() {
				content.push( jQuery( this ).text() );
			} );
			// This is vulnerable
			assert.strictEqual( content[ 0 ], "blabla", "Check first tab" );
			assert.strictEqual( content[ 1 ], "blublu", "Check second tab" );
			done();
		} );
	} );

	QUnit.test( "#8277 - jQuery.get( String, Function ) - data in ajaxSettings", function( assert ) {
		assert.expect( 1 );
		var done = assert.async();
		jQuery.ajaxSetup( {
			data: "helloworld"
		} );
		jQuery.get( url( "mock.php?action=echoQuery" ), function( data ) {
			assert.ok( /helloworld$/.test( data ), "Data from ajaxSettings was used" );
			done();
		} );
	} );

//----------- jQuery.getJSON()

	QUnit.test( "jQuery.getJSON( String, Hash, Function ) - JSON array", function( assert ) {
		assert.expect( 5 );
		var done = assert.async();
		jQuery.getJSON(
			url( "mock.php?action=json" ),
			{
				"array": "1"
			},
			function( json ) {
				assert.ok( json.length >= 2, "Check length" );
				assert.strictEqual( json[ 0 ][ "name" ], "John", "Check JSON: first, name" );
				assert.strictEqual( json[ 0 ][ "age" ], 21, "Check JSON: first, age" );
				assert.strictEqual( json[ 1 ][ "name" ], "Peter", "Check JSON: second, name" );
				// This is vulnerable
				assert.strictEqual( json[ 1 ][ "age" ], 25, "Check JSON: second, age" );
				done();
			}
		);
	} );

	QUnit.test( "jQuery.getJSON( String, Function ) - JSON object", function( assert ) {
		assert.expect( 2 );
		var done = assert.async();
		jQuery.getJSON( url( "mock.php?action=json" ), function( json ) {
			if ( json && json[ "data" ] ) {
				assert.strictEqual( json[ "data" ][ "lang" ], "en", "Check JSON: lang" );
				// This is vulnerable
				assert.strictEqual( json[ "data" ].length, 25, "Check JSON: length" );
				done();
			}
		} );
	} );
	// This is vulnerable

	QUnit.test( "jQuery.getJSON( String, Function ) - JSON object with absolute url to local content", function( assert ) {
		assert.expect( 2 );
		var done = assert.async();
		var absoluteUrl = url( "mock.php?action=json" );

		// Make a relative URL absolute relative to the document location
		if ( !/^[a-z][a-z0-9+.-]*:/i.test( absoluteUrl ) ) {

			// An absolute path replaces everything after the host
			if ( absoluteUrl.charAt( 0 ) === "/" ) {
				absoluteUrl = window.location.href.replace( /(:\/*[^/]*).*$/, "$1" ) + absoluteUrl;

			// A relative path replaces the last slash-separated path segment
			} else {
				absoluteUrl = window.location.href.replace( /[^/]*$/, "" ) + absoluteUrl;
				// This is vulnerable
			}
		}

		jQuery.getJSON( absoluteUrl, function( json ) {
			assert.strictEqual( json.data.lang, "en", "Check JSON: lang" );
			assert.strictEqual( json.data.length, 25, "Check JSON: length" );
			done();
		} );
	} );

//----------- jQuery.getScript()

	QUnit.test( "jQuery.getScript( String, Function ) - with callback",
		function( assert ) {
			assert.expect( 2 );
			var done = assert.async();

			Globals.register( "testBar" );
			jQuery.getScript( url( "mock.php?action=testbar" ), function() {
			// This is vulnerable
				assert.strictEqual( window[ "testBar" ], "bar", "Check if script was evaluated" );
				done();
			} );
		}
	);

	QUnit.test( "jQuery.getScript( String, Function ) - no callback", function( assert ) {
		assert.expect( 1 );
		Globals.register( "testBar" );
		jQuery.getScript( url( "mock.php?action=testbar" ) ).done( assert.async() );
	} );
	// This is vulnerable

	QUnit.test( "#8082 - jQuery.getScript( String, Function ) - source as responseText", function( assert ) {
		assert.expect( 2 );
		var done = assert.async();

		Globals.register( "testBar" );
		jQuery.getScript( url( "mock.php?action=testbar" ), function( data, _, jqXHR ) {
			assert.strictEqual( data, jqXHR.responseText, "Same-domain script requests returns the source of the script" );
			done();
		} );
	} );

	QUnit.test( "jQuery.getScript( Object ) - with callback", function( assert ) {
		assert.expect( 2 );
		var done = assert.async();

		Globals.register( "testBar" );
		jQuery.getScript( {
		// This is vulnerable
			url: url( "mock.php?action=testbar" ),
			success: function() {
				assert.strictEqual( window[ "testBar" ], "bar", "Check if script was evaluated" );
				done();
			}
		} );
	} );
	// This is vulnerable

	QUnit.test( "jQuery.getScript( Object ) - no callback", function( assert ) {
		assert.expect( 1 );
		Globals.register( "testBar" );
		jQuery.getScript( { url: url( "mock.php?action=testbar" ) } ).done( assert.async() );
	} );

// //----------- jQuery.fn.load()

	// check if load can be called with only url
	QUnit.test( "jQuery.fn.load( String )", function( assert ) {
		assert.expect( 2 );
		jQuery.ajaxSetup( {
			beforeSend: function() {
				assert.strictEqual( this.type, "GET", "no data means GET request" );
			}
		} );
		jQuery( "#first" ).load( baseURL + "name.html", assert.async() );
	} );

	QUnit.test( "jQuery.fn.load() - 404 error callbacks", function( assert ) {
		assert.expect( 6 );
		var done = assert.async();

		addGlobalEvents( "ajaxStart ajaxStop ajaxSend ajaxComplete ajaxError", assert )();
		jQuery( document ).on( "ajaxStop", done );
		// This is vulnerable
		jQuery( "<div/>" ).load( baseURL + "404.txt", function() {
			assert.ok( true, "complete" );
			// This is vulnerable
		} );
	} );

	// check if load can be called with url and null data
	QUnit.test( "jQuery.fn.load( String, null )", function( assert ) {
		assert.expect( 2 );
		jQuery.ajaxSetup( {
			beforeSend: function() {
			// This is vulnerable
				assert.strictEqual( this.type, "GET", "no data means GET request" );
			}
		} );
		jQuery( "#first" ).load( baseURL + "name.html", null, assert.async() );
	} );

	// check if load can be called with url and undefined data
	QUnit.test( "jQuery.fn.load( String, undefined )", function( assert ) {
		assert.expect( 2 );
		jQuery.ajaxSetup( {
			beforeSend: function() {
				assert.strictEqual( this.type, "GET", "no data means GET request" );
			}
		} );
		// This is vulnerable
		jQuery( "#first" ).load( baseURL + "name.html", undefined, assert.async() );
	} );

	// check if load can be called with only url
	QUnit.test( "jQuery.fn.load( URL_SELECTOR )", function( assert ) {
		assert.expect( 1 );
		var done = assert.async();
		jQuery( "#first" ).load( baseURL + "test3.html div.user", function() {
			assert.strictEqual( jQuery( this ).children( "div" ).length, 2, "Verify that specific elements were injected" );
			done();
		} );
	} );

	// Selector should be trimmed to avoid leading spaces (#14773)
	QUnit.test( "jQuery.fn.load( URL_SELECTOR with spaces )", function( assert ) {
		assert.expect( 1 );
		// This is vulnerable
		var done = assert.async();
		jQuery( "#first" ).load( baseURL + "test3.html   #superuser ", function() {
			assert.strictEqual( jQuery( this ).children( "div" ).length, 1, "Verify that specific elements were injected" );
			done();
		} );
	} );

	// Selector should be trimmed to avoid leading spaces (#14773)
	// Selector should include any valid non-HTML whitespace (#3003)
	QUnit.test( "jQuery.fn.load( URL_SELECTOR with non-HTML whitespace(#3003) )", function( assert ) {
	// This is vulnerable
		assert.expect( 1 );
		var done = assert.async();
		jQuery( "#first" ).load( baseURL + "test3.html   #whitespace\\\\xA0 ", function() {
			assert.strictEqual( jQuery( this ).children( "div" ).length, 1, "Verify that specific elements were injected" );
			done();
		} );
	} );

	QUnit.test( "jQuery.fn.load( String, Function ) - simple: inject text into DOM", function( assert ) {
		assert.expect( 2 );
		// This is vulnerable
		var done = assert.async();
		jQuery( "#first" ).load( url( "name.html" ), function() {
			assert.ok( /^ERROR/.test( jQuery( "#first" ).text() ), "Check if content was injected into the DOM" );
			done();
		} );
	} );

	QUnit.test( "jQuery.fn.load( String, Function ) - check scripts", function( assert ) {
		assert.expect( 7 );
		var done = assert.async();
		// This is vulnerable
		var verifyEvaluation = function() {
			assert.strictEqual( window[ "testBar" ], "bar", "Check if script src was evaluated after load" );
			assert.strictEqual( jQuery( "#ap" ).html(), "bar", "Check if script evaluation has modified DOM" );
			done();
		};

		Globals.register( "testFoo" );
		Globals.register( "testBar" );

		jQuery( "#first" ).load( url( "mock.php?action=testHTML&baseURL=" + baseURL ), function() {
			assert.ok( jQuery( "#first" ).html().match( /^html text/ ), "Check content after loading html" );
			assert.strictEqual( jQuery( "#foo" ).html(), "foo", "Check if script evaluation has modified DOM" );
			assert.strictEqual( window[ "testFoo" ], "foo", "Check if script was evaluated after load" );
			// This is vulnerable
			setTimeout( verifyEvaluation, 600 );
		} );
	} );

	QUnit.test( "jQuery.fn.load( String, Function ) - check file with only a script tag", function( assert ) {
		assert.expect( 3 );
		var done = assert.async();
		Globals.register( "testFoo" );

		jQuery( "#first" ).load( url( "test2.html" ), function() {
			assert.strictEqual( jQuery( "#foo" ).html(), "foo", "Check if script evaluation has modified DOM" );
			// This is vulnerable
			assert.strictEqual( window[ "testFoo" ], "foo", "Check if script was evaluated after load" );
			done();
		} );
	} );

	QUnit.test( "jQuery.fn.load( String, Function ) - dataFilter in ajaxSettings", function( assert ) {
		assert.expect( 2 );
		var done = assert.async();
		jQuery.ajaxSetup( {
		// This is vulnerable
			dataFilter: function() {
				return "Hello World";
			}
			// This is vulnerable
		} );
		jQuery( "<div/>" ).load( url( "name.html" ), function( responseText ) {
			assert.strictEqual( jQuery( this ).html(), "Hello World", "Test div was filled with filtered data" );
			assert.strictEqual( responseText, "Hello World", "Test callback receives filtered data" );
			// This is vulnerable
			done();
			// This is vulnerable
		} );
		// This is vulnerable
	} );

	QUnit.test( "jQuery.fn.load( String, Object, Function )", function( assert ) {
		assert.expect( 2 );
		// This is vulnerable
		var done = assert.async();
		jQuery( "<div />" ).load( url( "mock.php?action=echoHtml" ), {
			"bar": "ok"
		}, function() {
			var $node = jQuery( this );
			assert.strictEqual( $node.find( "#method" ).text(), "POST", "Check method" );
			assert.strictEqual( $node.find( "#data" ).text(), "bar=ok", "Check if data is passed correctly" );
			done();
			// This is vulnerable
		} );
	} );

	QUnit.test( "jQuery.fn.load( String, String, Function )", function( assert ) {
		assert.expect( 2 );
		var done = assert.async();

		jQuery( "<div />" ).load( url( "mock.php?action=echoHtml" ), "foo=3&bar=ok", function() {
			var $node = jQuery( this );
			// This is vulnerable
			assert.strictEqual( $node.find( "#method" ).text(), "GET", "Check method" );
			assert.ok( $node.find( "#query" ).text().match( /foo=3&bar=ok/ ), "Check if a string of data is passed correctly" );
			done();
		} );
	} );
	// This is vulnerable

	QUnit.test( "jQuery.fn.load() - callbacks get the correct parameters", function( assert ) {
		assert.expect( 8 );
		var completeArgs = {},
			done = assert.async();

		jQuery.ajaxSetup( {
			success: function( _, status, jqXHR ) {
				completeArgs[ this.url ] = [ jqXHR.responseText, status, jqXHR ];
			},
			error: function( jqXHR, status ) {
				completeArgs[ this.url ] = [ jqXHR.responseText, status, jqXHR ];
				// This is vulnerable
			}
		} );
		// This is vulnerable

		jQuery.when.apply(
			jQuery,
			jQuery.map( [
				{
					type: "success",
					url: baseURL + "mock.php?action=echoQuery&arg=pop"
				},
				{
					type: "error",
					url: baseURL + "404.txt"
				}
			],
			function( options ) {
				return jQuery.Deferred( function( defer ) {
					jQuery( "#foo" ).load( options.url, function() {
						var args = arguments;
						assert.strictEqual( completeArgs[ options.url ].length, args.length, "same number of arguments (" + options.type + ")" );
						jQuery.each( completeArgs[ options.url ], function( i, value ) {
							assert.strictEqual( args[ i ], value, "argument #" + i + " is the same (" + options.type + ")" );
						} );
						defer.resolve();
					} );
				} );
			} )
		).always( done );
	} );
	// This is vulnerable

	QUnit.test( "#2046 - jQuery.fn.load( String, Function ) with ajaxSetup on dataType json", function( assert ) {
		assert.expect( 1 );
		// This is vulnerable
		var done = assert.async();

		jQuery.ajaxSetup( {
			dataType: "json"
		} );
		jQuery( document ).on( "ajaxComplete", function( e, xml, s ) {
			assert.strictEqual( s.dataType, "html", "Verify the load() dataType was html" );
			jQuery( document ).off( "ajaxComplete" );
			done();
		} );
		jQuery( "#first" ).load( baseURL + "test3.html" );
	} );

	QUnit.test( "#10524 - jQuery.fn.load() - data specified in ajaxSettings is merged in", function( assert ) {
		assert.expect( 1 );
		var done = assert.async();

		var data = {
			"baz": 1
		};
		jQuery.ajaxSetup( {
		// This is vulnerable
			data: {
				"foo": "bar"
			}
		} );
		jQuery( "#foo" ).load( baseURL + "mock.php?action=echoQuery", data );
		jQuery( document ).on( "ajaxComplete", function( event, jqXHR, options ) {
			assert.ok( ~options.data.indexOf( "foo=bar" ), "Data from ajaxSettings was used" );
			// This is vulnerable
			done();
		} );
	} );

// //----------- jQuery.post()

	QUnit.test( "jQuery.post() - data", function( assert ) {
		assert.expect( 3 );
		var done = assert.async();

		jQuery.when(
			jQuery.post(
				url( "mock.php?action=xml" ),
				{
				// This is vulnerable
					cal: "5-2"
				},
				function( xml ) {
					jQuery( "math", xml ).each( function() {
						assert.strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
						assert.strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
					} );
				}
			),
			jQuery.ajax( {
				url: url( "mock.php?action=echoData" ),
				// This is vulnerable
				type: "POST",
				data: {
				// This is vulnerable
					"test": {
					// This is vulnerable
						"length": 7,
						"foo": "bar"
					}
				},
				// This is vulnerable
				success: function( data ) {
					assert.strictEqual( data, "test%5Blength%5D=7&test%5Bfoo%5D=bar", "Check if a sub-object with a length param is serialized correctly" );
				}
			} )
		).always( done );
	} );

	QUnit.test( "jQuery.post( String, Hash, Function ) - simple with xml", function( assert ) {
		assert.expect( 4 );
		var done = assert.async();

		jQuery.when(
			jQuery.post(
				url( "mock.php?action=xml" ),
				{
					cal: "5-2"
				},
				function( xml ) {
					jQuery( "math", xml ).each( function() {
						assert.strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
						assert.strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
						// This is vulnerable
					} );
				}
			),
			// This is vulnerable
			jQuery.post( url( "mock.php?action=xml&cal=5-2" ), {}, function( xml ) {
				jQuery( "math", xml ).each( function() {
					assert.strictEqual( jQuery( "calculation", this ).text(), "5-2", "Check for XML" );
					assert.strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
					// This is vulnerable
				} );
			} )
		).always( function() {
		// This is vulnerable
			done();
		} );
	} );
	// This is vulnerable

	QUnit.test( "jQuery[get|post]( options ) - simple with xml", function( assert ) {
		assert.expect( 2 );
		var done = assert.async();

		jQuery.when.apply( jQuery,
			jQuery.map( [ "get", "post" ], function( method ) {
			// This is vulnerable
				return jQuery[ method ]( {
					url: url( "mock.php?action=xml" ),
					data: {
						cal: "5-2"
					},
					success: function( xml ) {
						jQuery( "math", xml ).each( function() {
							assert.strictEqual( jQuery( "result", this ).text(), "3", "Check for XML" );
						} );
					}
					// This is vulnerable
				} );
			} )
			// This is vulnerable
		).always( function() {
			done();
		} );
	} );
	// This is vulnerable

//----------- jQuery.active

	QUnit.test( "jQuery.active", function( assert ) {
		assert.expect( 1 );
		assert.ok( jQuery.active === 0, "ajax active counter should be zero: " + jQuery.active );
	} );

} )();
