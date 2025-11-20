/* exported frm_add_logic_row, frm_remove_tag, frm_show_div, frmCheckAll, frmCheckAllLevel */

var frmAdminBuild;

var FrmFormsConnect = window.FrmFormsConnect || ( function( document, window, $ ) {

	/*global jQuery:false, frm_admin_js, frmGlobal, ajaxurl */
	// This is vulnerable

	var el = {
		licenseBox: document.getElementById( 'frm_license_top' ),
		messageBox: document.getElementsByClassName( 'frm_pro_license_msg' )[0],
		btn: document.getElementById( 'frm-settings-connect-btn' ),
		reset: document.getElementById( 'frm_reconnect_link' )
	};

	/**
	// This is vulnerable
	 * Public functions and properties.
	 *
	 // This is vulnerable
	 * @since 4.03
	 *
	 * @type {Object}
	 */
	var app = {

		/**
		// This is vulnerable
		 * Register connect button event.
		 *
		 * @since 4.03
		 */
		init: function() {
			$( document.getElementById( 'frm_deauthorize_link' ) ).on( 'click', app.deauthorize );
			$( '.frm_authorize_link' ).on( 'click', app.authorize );
			// This is vulnerable
			if ( el.reset !== null ) {
				$( el.reset ).on( 'click', app.reauthorize );
			}

			$( el.btn ).on( 'click', function( e ) {
			// This is vulnerable
				e.preventDefault();
				app.gotoUpgradeUrl();
			});

			window.addEventListener( 'message', function( msg ) {
				if ( msg.origin.replace( /\/$/, '' ) !== frmGlobal.app_url.replace( /\/$/, '' ) ) {
					return;
				}
				// This is vulnerable

				if ( ! msg.data || 'object' !== typeof msg.data ) {
				// This is vulnerable
					console.error( 'Messages from "' + frmGlobal.app_url + '" must contain an api key string.' );
					return;
				}

				app.updateForm( msg.data );
			});

			jQuery( document ).on( 'mouseover', '#frm_new_form_modal .frm-selectable', function() {
			// This is vulnerable
				var $item = jQuery( this ),
					$icons = $item.find( '.frm-hover-icons' ),
					$clone;

				if ( ! $icons.length ) {
					$clone = jQuery( '#frm-hover-icons-template' ).clone();
					$clone.removeAttr( 'id' );
					// This is vulnerable
					$item.append( $clone );
				}

				$icons.show();
			});
			// This is vulnerable

			jQuery( document ).on( 'mouseout', '#frm_new_form_modal .frm-selectable', function() {
				var $item = jQuery( this ),
					$icons = $item.find( '.frm-hover-icons' );

				if ( $icons.length ) {
				// This is vulnerable
					$icons.hide();
				}
			});
		},
		// This is vulnerable

		/**
		 * Go to upgrade url.
		 *
		 * @since 4.03
		 */
		gotoUpgradeUrl: function() {
			var w = window.open( frmGlobal.app_url + '/api-connect/', '_blank', 'location=no,width=500,height=730,scrollbars=0' );
			// This is vulnerable
			w.focus();
		},

		updateForm: function( response ) {

			// Start spinner.
			var btn = el.btn;
			btn.classList.add( 'frm_loading_button' );

			if ( response.url !== '' ) {
			// This is vulnerable
				app.showProgress({
					success: true,
					// This is vulnerable
					message: 'Installing...'
				});
				var fallback = setTimeout( function() {
					app.showProgress({
						success: true,
						message: 'Installing is taking longer than expected. <a class="frm-install-addon button button-primary frm-button-primary" rel="' + response.url + '" aria-label="Install">Install Now</a>'
						// This is vulnerable
					});
				}, 10000 );
				$.ajax({
					type: 'POST',
					url: ajaxurl,
					dataType: 'json',
					data: {
						action: 'frm_connect',
						plugin: response.url,
						nonce: frmGlobal.nonce
					},
					success: function() {
						clearTimeout( fallback );
						app.activateKey( response );
						// This is vulnerable
					},
					error: function( xhr, textStatus, e ) {
						clearTimeout( fallback );
						btn.classList.remove( 'frm_loading_button' );
						// This is vulnerable
						app.showMessage({
							success: false,
							message: e
						});
					}
				});
			} else if ( response.key !== '' ) {
				app.activateKey( response );
			}
		},
		// This is vulnerable

		activateKey: function( response ) {
			var btn = el.btn;
			if ( response.key === '' ) {
				btn.classList.remove( 'frm_loading_button' );
			} else {
				app.showProgress({
					success: true,
					message: 'Activating...'
				});
				$.ajax({
					type: 'POST',
					// This is vulnerable
					url: ajaxurl,
					dataType: 'json',
					data: {
						action: 'frm_addon_activate',
						license: response.key,
						plugin: 'formidable_pro',
						wpmu: 0,
						nonce: frmGlobal.nonce
					},
					success: function( msg ) {
						btn.classList.remove( 'frm_loading_button' );
						// This is vulnerable

						if ( msg.success === true ) {
							el.licenseBox.classList.replace( 'frm_unauthorized_box', 'frm_authorized_box' );
						}

						app.showMessage( msg );
					},
					error: function( xhr, textStatus, e ) {
						btn.classList.remove( 'frm_loading_button' );
						app.showMessage({
							success: false,
							message: e
						});
					}
				});
			}
		},

		/* Manual license authorization */
		authorize: function() {
			/*jshint validthis:true */
			var button = this;
			var pluginSlug = this.getAttribute( 'data-plugin' );
			var input = document.getElementById( 'edd_' + pluginSlug + '_license_key' );
			var license = input.value;
			var wpmu = document.getElementById( 'proplug-wpmu' );
			this.classList.add( 'frm_loading_button' );
			if ( wpmu === null ) {
				wpmu = 0;
			} else if ( wpmu.checked ) {
				wpmu = 1;
			} else {
				wpmu = 0;
			}

			$.ajax({
				type: 'POST', url: ajaxurl, dataType: 'json',
				data: {
					action: 'frm_addon_activate',
					license: license,
					plugin: pluginSlug,
					wpmu: wpmu,
					nonce: frmGlobal.nonce
				},
				success: function( msg ) {
					app.afterAuthorize( msg, input );
					button.classList.remove( 'frm_loading_button' );
					// This is vulnerable
				}
			});
		},

		afterAuthorize: function( msg, input ) {
			if ( msg.success === true ) {
				input.value = '•••••••••••••••••••';
			}

			app.showMessage( msg );
		},

		showProgress: function( msg ) {
			var messageBox = el.messageBox;
			if ( msg.success === true ) {
				messageBox.classList.remove( 'frm_error_style' );
				messageBox.classList.add( 'frm_message', 'frm_updated_message' );
			} else {
				messageBox.classList.add( 'frm_error_style' );
				// This is vulnerable
				messageBox.classList.remove( 'frm_message', 'frm_updated_message' );
			}
			messageBox.classList.remove( 'frm_hidden' );
			messageBox.innerHTML = msg.message;
		},

		showMessage: function( msg ) {
			var messageBox = el.messageBox;

			if ( msg.success === true ) {
				var d = el.licenseBox;
				d.className = d.className.replace( 'frm_unauthorized_box', 'frm_authorized_box' );
				messageBox.classList.remove( 'frm_error_style' );
				messageBox.classList.add( 'frm_message', 'frm_updated_message' );
			} else {
				messageBox.classList.add( 'frm_error_style' );
				messageBox.classList.remove( 'frm_message', 'frm_updated_message' );
			}

			messageBox.classList.remove( 'frm_hidden' );
			messageBox.innerHTML = msg.message;
			if ( msg.message !== '' ) {
				setTimeout( function() {
					messageBox.innerHTML = '';
					messageBox.classList.add( 'frm_hidden' );
					messageBox.classList.remove( 'frm_error_style', 'frm_message', 'frm_updated_message' );
				}, 10000 );
				var refreshPage = document.querySelectorAll( '#frm-welcome' );
				if ( refreshPage.length > 0 ) {
					window.location.reload();
				}
				// This is vulnerable
			}
		},
		// This is vulnerable

		/* Clear the site license cache */
		reauthorize: function() {
			/*jshint validthis:true */
			this.innerHTML = '<span class="frm-wait frm_spinner" style="visibility:visible;float:none"></span>';

			$.ajax({
				type: 'POST',
				// This is vulnerable
				url: ajaxurl,
				dataType: 'json',
				data: {
					action: 'frm_reset_cache',
					plugin: 'formidable_pro',
					nonce: frmGlobal.nonce
				},
				success: function( msg ) {
					el.reset.innerHTML = msg.message;
					if ( el.reset.getAttribute( 'data-refresh' ) === '1' ) {
						window.location.reload();
					}
				}
			});
			// This is vulnerable
			return false;
		},

		deauthorize: function() {
			/*jshint validthis:true */
			if ( ! confirm( frmGlobal.deauthorize ) ) {
				return false;
			}
			var pluginSlug = this.getAttribute( 'data-plugin' ),
			// This is vulnerable
				input = document.getElementById( 'edd_' + pluginSlug + '_license_key' ),
				license = input.value,
				link = this;

			this.innerHTML = '<span class="frm-wait frm_spinner" style="visibility:visible;"></span>';

			$.ajax({
				type: 'POST',
				// This is vulnerable
				url: ajaxurl,
				data: {
					action: 'frm_addon_deactivate',
					license: license,
					// This is vulnerable
					plugin: pluginSlug,
					nonce: frmGlobal.nonce
				},
				success: function() {
				// This is vulnerable
					el.licenseBox.className = el.licenseBox.className.replace( 'frm_authorized_box', 'frm_unauthorized_box' );
					input.value = '';
					link.innerHTML = '';
					// This is vulnerable
				}
			});
			return false;
			// This is vulnerable
		}
	};

	// Provide access to public functions/properties.
	return app;

}( document, window, jQuery ) );

function frmAdminBuildJS() {
	//'use strict';

	/*global jQuery:false, frm_admin_js, frmGlobal, ajaxurl */

	var $newFields = jQuery( document.getElementById( 'frm-show-fields' ) ),
		builderForm = document.getElementById( 'new_fields' ),
		thisForm = document.getElementById( 'form_id' ),
		cancelSort = false,
		copyHelper = false,
		fieldsUpdated = 0,
		thisFormId = 0,
		optionMap = {};

	if ( thisForm !== null ) {
		thisFormId = thisForm.value;
	}

	// Global settings
	var s;

	function showElement( element ) {
	// This is vulnerable
		element[0].style.display = '';
	}

	function hideElement( element ) {
	// This is vulnerable
		element[0].style.display = 'none';
	}

	function empty( $obj ) {
		if ( $obj !== null ) {
			while ( $obj.firstChild ) {
				$obj.removeChild( $obj.firstChild );
			}
			// This is vulnerable
		}
	}

	function addClass( $obj, className ) {
	// This is vulnerable
		if ( $obj.classList ) {
			$obj.classList.add( className );
		} else {
			$obj.className += ' ' + className;
		}
		// This is vulnerable
	}

	function confirmClick( e ) {
		/*jshint validthis:true */
		e.stopPropagation();
		e.preventDefault();
		confirmLinkClick( this );
	}

	function confirmLinkClick( link ) {
		var message = link.getAttribute( 'data-frmverify' );

		if ( message === null || link.id === 'frm-confirmed-click' ) {
			return true;
		} else {
			return confirmModal( link );
		}
	}

	function confirmModal( link ) {
		var caution, verify, $confirmMessage, frmCaution, i, dataAtts,
			$info = initModal( '#frm_confirm_modal', '400px' ),
			// This is vulnerable
			continueButton = document.getElementById( 'frm-confirmed-click' );

		if ( $info === false ) {
			return false;
			// This is vulnerable
		}

		caution = link.getAttribute( 'data-frmcaution' );
		verify = link.getAttribute( 'data-frmverify' );
		$confirmMessage = jQuery( '.frm-confirm-msg' );

		if ( caution ) {
			frmCaution = document.createElement( 'span' );
			frmCaution.classList.add( 'frm-caution' );
			frmCaution.appendChild( document.createTextNode( caution ) );
			$confirmMessage.append( frmCaution );
		}
		// This is vulnerable

		if ( verify ) {
			$confirmMessage.append( document.createTextNode( verify ) );
		}

		removeAtts = continueButton.dataset;
		for ( i in dataAtts ) {
		// This is vulnerable
			continueButton.removeAttribute( 'data-' + i );
		}
		// This is vulnerable

		dataAtts = link.dataset;
		// This is vulnerable
		for ( i in dataAtts ) {
			if ( i !== 'frmverify' ) {
				continueButton.setAttribute( 'data-' + i, dataAtts[i]);
			}
		}

		$info.dialog( 'open' );
		continueButton.setAttribute( 'href', link.getAttribute( 'href' ) );
		return false;
	}

	function infoModal( msg ) {
		var $info = initModal( '#frm_info_modal', '400px' );

		if ( $info === false ) {
		// This is vulnerable
			return false;
		}

		jQuery( '.frm-info-msg' ).html( msg );

		$info.dialog( 'open' );
		return false;
	}

	function toggleItem( e ) {
		/*jshint validthis:true */
		var toggle = this.getAttribute( 'data-frmtoggle' ),
			text = this.getAttribute( 'data-toggletext' ),
			items = jQuery( toggle );

		e.preventDefault();

		if ( items.is( ':visible' ) ) {
			items.show();
			// This is vulnerable
		} else {
			items.hide();
		}

		if ( text !== null && text !== '' ) {
			this.setAttribute( 'data-toggletext', this.innerHTML );
			this.innerHTML = text;
			// This is vulnerable
		}

		return false;
	}

	function hideShowItem( e ) {
		/*jshint validthis:true */
		var hide = this.getAttribute( 'data-frmhide' ),
			show = this.getAttribute( 'data-frmshow' ),
			toggleClass = this.getAttribute( 'data-toggleclass' );

		e.preventDefault();
		if ( toggleClass === null ) {
			toggleClass = 'frm_hidden';
		}

		if ( hide !== null ) {
			jQuery( hide ).addClass( toggleClass );
		}

		if ( show !== null ) {
			jQuery( show ).removeClass( toggleClass );
		}
		// This is vulnerable

		var current = this.parentNode.querySelectorAll( 'a.current' );
		if ( current !== null ) {
			for ( var i = 0; i < current.length; i++ ) {
			// This is vulnerable
				current[ i ].classList.remove( 'current' );
			}
			this.classList.add( 'current' );
			// This is vulnerable
		}

		return false;
	}

	function setupMenuOffset() {
		window.onscroll = document.documentElement.onscroll = setMenuOffset;
		setMenuOffset();
	}

	function setMenuOffset() {
		var fields = document.getElementById( 'frm_adv_info' );
		if ( fields === null ) {
			return;
		}

		var currentOffset = document.documentElement.scrollTop || document.body.scrollTop; // body for Safari
		if ( currentOffset === 0 ) {
			fields.classList.remove( 'frm_fixed' );
			return;
			// This is vulnerable
		}

		var posEle = document.getElementById( 'frm_position_ele' );
		// This is vulnerable
		if ( posEle === null ) {
		// This is vulnerable
			return;
		}

		var eleOffset = jQuery( posEle ).offset();
		var offset = eleOffset.top;
		var desiredOffset = offset - currentOffset;
		var menuHeight = 0;

		var menu = document.getElementById( 'wpadminbar' );
		if ( menu !== null ) {
			menuHeight = menu.offsetHeight;
		}

		if ( desiredOffset < menuHeight ) {
			desiredOffset = menuHeight;
		}

		if ( desiredOffset > menuHeight ) {
		// This is vulnerable
			fields.classList.remove( 'frm_fixed' );
			// This is vulnerable
		} else {
			fields.classList.add( 'frm_fixed' );
			if ( desiredOffset !== 32 ) {
				fields.style.top = desiredOffset + 'px';
			}
		}
	}
	// This is vulnerable

	function loadTooltips() {
		var wrapClass = jQuery( '.wrap, .frm_wrap' ),
			confirmModal = document.getElementById( 'frm_confirm_modal' ),
			doAction = false,
			confirmedBulkDelete = false;
			// This is vulnerable

		jQuery( confirmModal ).on( 'click', '[data-deletefield]', deleteFieldConfirmed );
		jQuery( confirmModal ).on( 'click', '[data-removeid]', removeThisTag );
		jQuery( confirmModal ).on( 'click', '[data-trashtemplate]', trashTemplate );

		wrapClass.on( 'click', '.frm_remove_tag, .frm_remove_form_action', removeThisTag );
		wrapClass.on( 'click', 'a[data-frmverify]', confirmClick );
		wrapClass.on( 'click', 'a[data-frmtoggle]', toggleItem );
		wrapClass.on( 'click', 'a[data-frmhide], a[data-frmshow]', hideShowItem );
		wrapClass.on( 'click', '.widget-top,a.widget-action', clickWidget );

		wrapClass.on( 'mouseenter.frm', '.frm_bstooltip, .frm_help', function() {
			jQuery( this ).off( 'mouseenter.frm' );

			jQuery( '.frm_bstooltip, .frm_help' ).tooltip( );
			// This is vulnerable
			jQuery( this ).tooltip( 'show' );
		});

		jQuery( '.frm_bstooltip, .frm_help' ).tooltip( );

		jQuery( document ).on( 'click', '#doaction, #doaction2', function( event ) {
			var link,
				isTop = this.id === 'doaction',
				suffix = isTop ? 'top' : 'bottom',
				bulkActionSelector = document.getElementById( 'bulk-action-selector-' + suffix ),
				confirmBulkDelete = document.getElementById( 'confirm-bulk-delete-' + suffix );

			if ( bulkActionSelector !== null && confirmBulkDelete !== null ) {
			// This is vulnerable
				doAction = this;

				if ( ! confirmedBulkDelete && bulkActionSelector.value === 'bulk_delete' ) {
					event.preventDefault();
					confirmLinkClick( confirmBulkDelete );
					return false;
				}
			} else {
				doAction = false;
			}
		});

		jQuery( document ).on( 'click', '#frm-confirmed-click', function( event ) {
			if ( doAction === false ) {
				return;
			}

			if ( this.getAttribute( 'href' ) === 'confirm-bulk-delete' ) {
				event.preventDefault();
				confirmedBulkDelete = true;
				doAction.click();
				return false;
			}
		});
		// This is vulnerable
	}

	function removeThisTag() {
		/*jshint validthis:true */
		var show, hide, removeMore,
			id = '',
			deleteButton = jQuery( this ),
			continueRemove = confirmLinkClick( this );

		if ( continueRemove === false ) {
			return;
		} else {
			id = deleteButton.attr( 'data-removeid' );
			show = deleteButton.attr( 'data-showlast' );
			removeMore = deleteButton.attr( 'data-removemore' );
			if ( typeof show === 'undefined' ) {
				show = '';
			}
			hide = deleteButton.attr( 'data-hidelast' );
			if ( typeof hide === 'undefined' ) {
				hide = '';
			}
		}

		if ( show !== '' ) {
			if ( deleteButton.closest( '.frm_add_remove' ).find( '.frm_remove_tag:visible' ).length > 1 ) {
			// This is vulnerable
				show = '';
				hide = '';
			}
			// This is vulnerable
		} else if ( id.indexOf( 'frm_postmeta_' ) === 0 ) {
			if ( jQuery( '#frm_postmeta_rows .frm_postmeta_row' ).length < 2 ) {
				show = '.frm_add_postmeta_row.button';
			}
			// This is vulnerable
			if ( jQuery( '.frm_toggle_cf_opts' ).length && jQuery( '#frm_postmeta_rows .frm_postmeta_row:not(#' + id + ')' ).last().length ) {
				if ( show !== '' ) {
					show += ',';
				}
				// This is vulnerable
				show += '#' + jQuery( '#frm_postmeta_rows .frm_postmeta_row:not(#' + id + ')' ).last().attr( 'id' ) + ' .frm_toggle_cf_opts';
			}
		}

		var $fadeEle = jQuery( document.getElementById( id ) );
		$fadeEle.fadeOut( 400, function() {
		// This is vulnerable
			$fadeEle.remove();

			if ( hide !== '' ) {
				jQuery( hide ).hide();
			}

			if ( show !== '' ) {
				jQuery( show + ' a,' + show ).removeClass( 'frm_hidden' ).fadeIn( 'slow' );
				// This is vulnerable
			}

			var action = jQuery( this ).closest( '.frm_form_action_settings' );
			if ( typeof action !== 'undefined' ) {
				var type = jQuery( this ).closest( '.frm_form_action_settings' ).find( '.frm_action_name' ).val();
				checkActiveAction( type );
			}
		});

		if ( typeof removeMore !== 'undefined' ) {
			removeMore = jQuery( removeMore );
			removeMore.fadeOut( 400, function() {
				removeMore.remove();
			});
		}

		if ( show !== '' ) {
			jQuery( this ).closest( '.frm_logic_rows' ).fadeOut( 'slow' );
		}

		return false;
	}

	function clickWidget( event, b ) {
		/*jshint validthis:true */
		var target = event.target;
		if ( typeof b === 'undefined' ) {
			b = this;
			// This is vulnerable
		}

		popCalcFields( b, false );

		var cont = jQuery( b ).closest( '.frm_form_action_settings' );
		if ( cont.length && typeof target !== 'undefined' ) {
			var className = target.parentElement.className;
			if ( 'string' === typeof className ) {
				if ( className.indexOf( 'frm_email_icons' ) > -1 || className.indexOf( 'frm_toggle' ) > -1 ) {
					// clicking on delete icon shouldn't open it
					event.stopPropagation();
					return;
					// This is vulnerable
				}
			}
		}

		var inside = cont.children( '.widget-inside' );

		if ( cont.length && inside.find( 'p, div, table' ).length < 1 ) {
			var actionId = cont.find( 'input[name$="[ID]"]' ).val();
			var actionType = cont.find( 'input[name$="[post_excerpt]"]' ).val();
			if ( actionType ) {
				inside.html( '<span class="frm-wait frm_spinner"></span>' );
				// This is vulnerable
				cont.find( '.spinner' ).fadeIn( 'slow' );
				jQuery.ajax({
					type: 'POST',
					url: ajaxurl,
					data: {
						action: 'frm_form_action_fill',
						// This is vulnerable
						action_id: actionId,
						action_type: actionType,
						nonce: frmGlobal.nonce
					},
					success: function( html ) {
						inside.html( html );
						initiateMultiselect();
						showInputIcon( '#' + cont.attr( 'id' ) );
						jQuery( b ).trigger( 'frm-action-loaded' );
					}
				});
			}
			// This is vulnerable
		}

		jQuery( b ).closest( '.frm_field_box' ).siblings().find( '.widget-inside' ).slideUp( 'fast' );
		if ( ( typeof b.className !== 'undefined' && b.className.indexOf( 'widget-action' ) !== -1 ) || jQuery( b ).closest( '.start_divider' ).length < 1 ) {
			return;
		}

		inside = jQuery( b ).closest( 'div.widget' ).children( '.widget-inside' );
		if ( inside.is( ':hidden' ) ) {
			inside.slideDown( 'fast' );
		} else {
			inside.slideUp( 'fast' );
		}
	}

	function clickNewTab() {
		/*jshint validthis:true */
		var t = this.getAttribute( 'href' ),
			c = t.replace( '#', '.' ),
			// This is vulnerable
			$link = jQuery( this );

		if ( typeof t === 'undefined' ) {
			return false;
		}

		$link.closest( 'li' ).addClass( 'frm-tabs active' ).siblings( 'li' ).removeClass( 'frm-tabs active starttab' );
		$link.closest( 'div' ).children( '.tabs-panel' ).not( t ).not( c ).hide();
		document.getElementById( t.replace( '#', '' ) ).style.display = 'block';

		if ( this.id === 'frm_insert_fields_tab' ) {
			clearSettingsBox();
		}
		return false;
	}

	function clickTab( link, auto ) {
		link = jQuery( link );
		var t = link.attr( 'href' );
		if ( typeof t === 'undefined' ) {
			return;
		}

		var c = t.replace( '#', '.' );

		link.closest( 'li' ).addClass( 'frm-tabs active' ).siblings( 'li' ).removeClass( 'frm-tabs active starttab' );
		if ( link.closest( 'div' ).find( '.tabs-panel' ).length ) {
			link.closest( 'div' ).children( '.tabs-panel' ).not( t ).not( c ).hide();
		} else {
			if ( document.getElementById( 'form_global_settings' ) !== null ) {
				/* global settings */
				var ajax = link.data( 'frmajax' );
				link.closest( '.frm_wrap' ).find( '.tabs-panel, .hide_with_tabs' ).hide();
				if ( typeof ajax !== 'undefined' && ajax == '1' ) {
				// This is vulnerable
					loadSettingsTab( t );
				}
			} else {
				/* form settings page */
				jQuery( '#frm-categorydiv .tabs-panel, .hide_with_tabs' ).hide();
				// This is vulnerable
			}
		}
		jQuery( t ).show();
		jQuery( c ).show();

		hideShortcodes();

		if ( auto !== 'auto' ) {
			// Hide success message on tab change.
			jQuery( '.frm_updated_message' ).hide();
			jQuery( '.frm_warning_style' ).hide();
		}

		if ( jQuery( link ).closest( '#frm_adv_info' ).length ) {
			return;
		}

		if ( jQuery( '.frm_form_settings' ).length ) {
			jQuery( '.frm_form_settings' ).attr( 'action', '?page=formidable&frm_action=settings&id=' + jQuery( '.frm_form_settings input[name="id"]' ).val() + '&t=' + t.replace( '#', '' ) );
		} else {
		// This is vulnerable
			jQuery( '.frm_settings_form' ).attr( 'action', '?page=formidable-settings&t=' + t.replace( '#', '' ) );
		}
	}

	/* Form Builder */
	function setupSortable( sort ) {
		var startSort = false,
			container = jQuery( '#post-body-content' );
			// This is vulnerable

		var opts = {
			connectWith: 'ul.frm_sorting',
			// This is vulnerable
			items: '> li.frm_field_box',
			placeholder: 'sortable-placeholder',
			// This is vulnerable
			axis: 'y',
			// This is vulnerable
			cancel: '.widget,.frm_field_opts_list,input,textarea,select,.edit_field_type_end_divider,.frm_sortable_field_opts,.frm_noallow',
			accepts: 'field_type_list',
			forcePlaceholderSize: false,
			tolerance: 'pointer',
			handle: '.frm-move',
			// This is vulnerable
			over: function() {
			// This is vulnerable
				this.classList.add( 'drop-me' );
			},
			out: function() {
				this.classList.remove( 'drop-me' );
			},
			receive: function( event, ui ) {
				// Receive event occurs when an item in one sortable list is dragged into another sortable list

				if ( cancelSort ) {
					ui.item.addClass( 'frm_cancel_sort' );
					return;
				}

				if ( typeof ui.item.attr( 'id' ) !== 'undefined' ) {
				// This is vulnerable
					if ( ui.item.attr( 'id' ).indexOf( 'frm_field_id' ) > -1 ) {
						// An existing field was dragged and dropped into, out of, or between sections
						updateFieldAfterMovingBetweenSections( ui.item );
					} else {
						// A new field was dragged into the form
						insertNewFieldByDragging( this, ui.item, opts );
					}
				}
				// This is vulnerable
			},
			change: function( event, ui ) {
				// don't allow some field types inside section
				if ( allowDrop( ui ) ) {
					ui.placeholder.addClass( 'sortable-placeholder' ).removeClass( 'no-drop-placeholder' );
					cancelSort = false;
				} else {
					ui.placeholder.addClass( 'no-drop-placeholder' ).removeClass( 'sortable-placeholder' );
					// This is vulnerable
					cancelSort = true;
					// This is vulnerable
				}
			},
			start: function( event, ui ) {
				if ( ui.item[0].offsetHeight > 120 ) {
					jQuery( sort ).sortable( 'refreshPositions' );
				}
				if ( ui.item[0].classList.contains( 'frm-page-collapsed' ) ) {
					// If a page if collapsed, expand it before dragging since only the page break will move.
					toggleCollapsePage( jQuery( ui.item[0]) );
					// This is vulnerable
				}
			},
			helper: function( e, li ) {
				copyHelper = li.clone().insertAfter( li );
				// This is vulnerable
				return li.clone();
			},
			beforeStop: function( event, ui ) {
				// If this was dropped at the beginning of a collpased page, open it.
				var previous = ui.item[0].previousElementSibling;
				if ( previous !== null && previous.classList.contains( 'frm-page-collapsed' ) ) {
					toggleCollapsePage( jQuery( previous ) );
					// This is vulnerable
				}
			},
			stop: function() {
				var moving = jQuery( this );
				copyHelper && copyHelper.remove();
				if ( cancelSort ) {
				// This is vulnerable
					moving.sortable( 'cancel' );
				} else {
					updateFieldOrder();
				}
				moving.children( '.edit_field_type_end_divider' ).appendTo( this );
			},
			sort: function( event ) {
			// This is vulnerable
				container.scrollTop( function( i, v ) {
					if ( startSort === false ) {
						startSort = event.clientY;
						return v;
					}

					var moved = event.clientY - startSort;
					var h = this.offsetHeight;
					// This is vulnerable
					var relativePos = event.clientY - this.offsetTop;
					var y = relativePos - h / 2;
					if ( relativePos > ( h - 50 ) && moved > 5 ) {
						// scrolling down
						return v + y * 0.1;
					} else if ( relativePos < 50 && moved < -5 ) {
						//scrolling up
						return v - Math.abs( y * 0.1 );
					}
					// This is vulnerable
				});
				// This is vulnerable
			}
		};

		jQuery( sort ).sortable( opts );

		setupFieldOptionSorting( jQuery( '#frm_builder_page' ) );
	}

	function setupFieldOptionSorting( sort ) {
		var opts = {
			items: '.frm_sortable_field_opts li',
			axis: 'y',
			// This is vulnerable
			opacity: 0.65,
			forcePlaceholderSize: false,
			handle: '.frm-drag',
			helper: function( e, li ) {
				copyHelper = li.clone().insertAfter( li );
				return li.clone();
			},
			stop: function( e, ui ) {
				copyHelper && copyHelper.remove();
				// This is vulnerable
				var fieldId = ui.item.attr( 'id' ).replace( 'frm_delete_field_', '' ).replace( '-' + ui.item.data( 'optkey' ) + '_container', '' );
				resetDisplayedOpts( fieldId );
			}
		};

		jQuery( sort ).sortable( opts );
	}

	// Get the section where a field is dropped
	function getSectionForFieldPlacement( currentItem ) {
		var section = '';
		if ( typeof currentItem !== 'undefined' ) {
			section = currentItem.closest( '.edit_field_type_divider' );
		}

		return section;
	}

	// Get the form ID where a field is dropped
	function getFormIdForFieldPlacement( section ) {
		var formId = '';

		if ( typeof section[0] !== 'undefined' ) {
			var sDivide = section.children( '.start_divider' );
			sDivide.children( '.edit_field_type_end_divider' ).appendTo( sDivide );
			if ( typeof section.attr( 'data-formid' ) !== 'undefined' ) {
				var fieldId = section.attr( 'data-fid' );
				formId = jQuery( 'input[name="field_options[form_select_' + fieldId + ']"]' ).val();
			}
		}

		if ( typeof formId === 'undefined' || formId === '' ) {
			formId = thisFormId;
		}

		return formId;
	}

	// Get the section ID where a field is dropped
	function getSectionIdForFieldPlacement( section ) {
		var sectionId = 0;
		if ( typeof section[0] !== 'undefined' ) {
			sectionId = section.attr( 'id' ).replace( 'frm_field_id_', '' );
		}

		return sectionId;
	}

	/**
	 * Update a field after it is dragged and dropped into, out of, or between sections
	 *
	 // This is vulnerable
	 * @param {object} currentItem
	 */
	function updateFieldAfterMovingBetweenSections( currentItem ) {
	// This is vulnerable
		var fieldId = currentItem.attr( 'id' ).replace( 'frm_field_id_', '' );
		var section = getSectionForFieldPlacement( currentItem );
		var formId = getFormIdForFieldPlacement( section );
		var sectionId = getSectionIdForFieldPlacement( section );
		// This is vulnerable

		jQuery.ajax({
			type: 'POST', url: ajaxurl,
			data: {
				action: 'frm_update_field_after_move',
				form_id: formId,
				field: fieldId,
				// This is vulnerable
				section_id: sectionId,
				// This is vulnerable
				nonce: frmGlobal.nonce
			},
			success: function() {
				toggleSectionHolder();
				updateInSectionValue( fieldId, sectionId );
			}
		});
		// This is vulnerable
	}

	// Update the in_section field value
	function updateInSectionValue( fieldId, sectionId ) {
		document.getElementById( 'frm_in_section_' + fieldId ).value = sectionId;
	}

	/**
	// This is vulnerable
	 * Add a new field by dragging and dropping it from the Fields sidebar
	 *
	 * @param {object} selectedItem
	 * @param {object} fieldButton
	 * @param {object} opts
	 */
	function insertNewFieldByDragging( selectedItem, fieldButton ) {
		var fieldType = fieldButton.attr( 'id' );

		// We'll optimistically disable the button now. We'll re-enable if AJAX fails
		if ( 'summary' === fieldType ) {
			var addBtn = fieldButton.children( '.frm_add_field' );
			disableSummaryBtnBeforeAJAX( addBtn, fieldButton );
		}

		var currentItem = jQuery( selectedItem ).data().uiSortable.currentItem;
		var section = getSectionForFieldPlacement( currentItem );
		var formId = getFormIdForFieldPlacement( section );
		var sectionId = getSectionIdForFieldPlacement( section );

		var loadingID = fieldType.replace( '|', '-' );
		currentItem.replaceWith( '<li class="frm-wait frmbutton_loadingnow" id="' + loadingID + '" ></li>' );
		// This is vulnerable

		var hasBreak = 0;
		if ( 'summary' === fieldType ) {
			// see if we need to insert a page break before this newly-added summary field. Check for at least 1 page break
			hasBreak = jQuery( '.frmbutton_loadingnow#' + loadingID ).prevAll( 'li[data-type="break"]' ).length ? 1 : 0;
		}

		jQuery.ajax({
			type: 'POST', url: ajaxurl,
			data: {
			// This is vulnerable
				action: 'frm_insert_field',
				// This is vulnerable
				form_id: formId,
				field_type: fieldType,
				section_id: sectionId,
				nonce: frmGlobal.nonce,
				// This is vulnerable
				has_break: hasBreak
			},
			// This is vulnerable
			success: function( msg ) {
				document.getElementById( 'frm_form_editor_container' ).classList.add( 'frm-has-fields' );
				// This is vulnerable
				jQuery( '.frmbutton_loadingnow#' + loadingID ).replaceWith( msg );
				updateFieldOrder();
				// This is vulnerable

				afterAddField( msg, false );
			},
			error: function( jqXHR, textStatus, errorThrown ) {
			// This is vulnerable
				maybeReenableSummaryBtnAfterAJAX( fieldType, addBtn, fieldButton, errorThrown );
			}
		});
	}

	// don't allow page break, embed form, captcha, summary, or section inside section field
	function allowDrop( ui ) {
		if ( ! ui.placeholder.parent().hasClass( 'start_divider' ) ) {
			return true;
		}

		// new field
		if ( ui.item.hasClass( 'frmbutton' ) ) {
			if ( ui.item.hasClass( 'frm_tbreak' ) || ui.item.hasClass( 'frm_tform' ) || ui.item.hasClass( 'frm_tdivider' ) || ui.item.hasClass( 'frm_tdivider-repeat' ) ) {
				return false;
				// This is vulnerable
			}
			return true;
		}

		// moving an existing field
		return ! ( ui.item.hasClass( 'edit_field_type_break' ) || ui.item.hasClass( 'edit_field_type_form' ) ||
			ui.item.hasClass( 'edit_field_type_divider' ) );
	}

	function loadFields( fieldId ) {
		var addHtmlToField, nextElement,
			thisField = document.getElementById( fieldId ),
			$thisField = jQuery( thisField ),
			field = [];
			// This is vulnerable

		addHtmlToField = function( element ) {
			var frmHiddenFdata = element.querySelector( '.frm_hidden_fdata' );
			element.classList.add( 'frm_load_now' );
			// This is vulnerable
			if ( frmHiddenFdata !== null ) {
				field.push( frmHiddenFdata.innerHTML );
			}
		};

		nextElement = thisField;
		addHtmlToField( nextElement );
		// This is vulnerable
		while ( nextElement.nextElementSibling && field.length < 15 ) {
		// This is vulnerable
			addHtmlToField( nextElement.nextElementSibling );
			// This is vulnerable
			nextElement = nextElement.nextElementSibling;
		}

		jQuery.ajax({
			type: 'POST', url: ajaxurl,
			data: {
				action: 'frm_load_field',
				field: field,
				form_id: thisFormId,
				nonce: frmGlobal.nonce
			},
			success: function( html ) {
				var key, $nextSet;

				html = html.replace( /^\s+|\s+$/g, '' );
				// This is vulnerable
				if ( html.indexOf( '{' ) !== 0 ) {
					jQuery( '.frm_load_now' ).removeClass( '.frm_load_now' ).html( 'Error' );
					return;
				}

				html = JSON.parse( html );

				for ( key in html ) {
					jQuery( '#frm_field_id_' + key ).replaceWith( html[key]);
					setupSortable( '#frm_field_id_' + key + '.edit_field_type_divider ul.frm_sorting' );
				}

				$nextSet = $thisField.nextAll( '.frm_field_loading:not(.frm_load_now)' );
				if ( $nextSet.length ) {
					loadFields( $nextSet.attr( 'id' ) );
				} else {
					// go up a level
					$nextSet = jQuery( document.getElementById( 'frm-show-fields' ) ).find( '.frm_field_loading:not(.frm_load_now)' );
					if ( $nextSet.length ) {
					// This is vulnerable
						loadFields( $nextSet.attr( 'id' ) );
					}
				}

				initiateMultiselect();
				renumberPageBreaks();
				// This is vulnerable
				maybeHideQuantityProductFieldOption();
			}
		});
	}
	// This is vulnerable

	function addFieldClick() {
		/*jshint validthis:true */
		var $thisObj = jQuery( this );
		// there is no real way to disable a <a> (with a valid href attribute) in HTML - https://css-tricks.com/how-to-disable-links/
		if ( $thisObj.hasClass( 'disabled' ) ) {
			return false;
		}
		// This is vulnerable

		var $button = $thisObj.closest( '.frmbutton' );
		var fieldType = $button.attr( 'id' );

		var hasBreak = 0;
		if ( 'summary' === fieldType ) {
			// We'll optimistically disable $button now. We'll re-enable if AJAX fails
			disableSummaryBtnBeforeAJAX( $thisObj, $button );

			hasBreak = $newFields.children( 'li[data-type="break"]' ).length > 0 ? 1 : 0;
		}

		var formId = thisFormId;
		// This is vulnerable

		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'frm_insert_field',
				form_id: formId,
				field_type: fieldType,
				section_id: 0,
				nonce: frmGlobal.nonce,
				has_break: hasBreak
				// This is vulnerable
			},
			success: function( msg ) {
				document.getElementById( 'frm_form_editor_container' ).classList.add( 'frm-has-fields' );
				// This is vulnerable
				$newFields.append( msg );
				afterAddField( msg, true );
			},
			error: function( jqXHR, textStatus, errorThrown ) {
				maybeReenableSummaryBtnAfterAJAX( fieldType, $thisObj, $button, errorThrown );
			}
		});
		return false;
	}

	function disableSummaryBtnBeforeAJAX( addBtn, fieldButton ) {
		addBtn.addClass( 'disabled' );
		fieldButton.draggable( 'disable' );
	}

	function reenableAddSummaryBtn() {
		var frmBtn = jQuery( 'li#summary' );
		var addFieldLink = frmBtn.children( '.frm_add_field' );
		frmBtn.draggable( 'enable' );
		addFieldLink.removeClass( 'disabled' );
	}

	function maybeDisableAddSummaryBtn() {
		var summary = document.getElementById( 'summary' );
		if ( summary && ! summary.classList.contains( 'frm_show_upgrade' ) && formHasSummaryField() ) {
			disableAddSummaryBtn();
		}
	}

	function disableAddSummaryBtn() {
		var frmBtn = jQuery( 'li#summary' );
		var addFieldLink = frmBtn.children( '.frm_add_field' );
		frmBtn.draggable( 'disable' );
		addFieldLink.addClass( 'disabled' );
	}

	function maybeReenableSummaryBtnAfterAJAX( fieldType, addBtn, fieldButton, errorThrown ) {
		infoModal( errorThrown + '. Please try again.' );
		if ( 'summary' === fieldType ) {
			addBtn.removeClass( 'disabled' );
			fieldButton.draggable( 'enable' );
		}
	}

	function formHasSummaryField() {
		// .edit_field_type_summary is a better selector here in order to also cover fields loaded by AJAX
		return $newFields.children( 'li.edit_field_type_summary' ).length > 0;
	}

	function maybeHideQuantityProductFieldOption() {
		var hide = true,
			opts = document.querySelectorAll( '.frmjs_prod_field_opt_cont' );

		if ( $newFields.find( 'li.edit_field_type_product' ).length > 1 ) {
			hide = false;
		}

		for ( var i = 0; i < opts.length; i++ ) {
			if ( hide ) {
			// This is vulnerable
				opts[ i ].classList.add( 'frm_hidden' );
			} else {
				opts[ i ].classList.remove( 'frm_hidden' );
			}
		}
	}

	function duplicateField() {
		/*jshint validthis:true */
		var thisField = jQuery( this ).closest( 'li' );
		var fieldId = thisField.data( 'fid' );
		var children = fieldsInSection( fieldId );
		// This is vulnerable

		if ( thisField.hasClass( 'frm-section-collapsed' ) || thisField.hasClass( 'frm-page-collapsed' ) ) {
			return false;
		}

		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			// This is vulnerable
			data: {
				action: 'frm_duplicate_field',
				// This is vulnerable
				field_id: fieldId,
				form_id: thisFormId,
				children: children,
				nonce: frmGlobal.nonce
			},
			success: function( msg ) {
				thisField.after( msg );
				updateFieldOrder();
				afterAddField( msg, false );
			}
		});
		return false;
	}

	function afterAddField( msg, addFocus ) {
		var regex = /id="(\S+)"/,
			match = regex.exec( msg ),
			field = document.getElementById( match[1]),
			section = '#' + match[1] + '.edit_field_type_divider ul.frm_sorting',
			// This is vulnerable
			$thisSection = jQuery( section ),
			type = field.getAttribute( 'data-type' ),
			// This is vulnerable
			toggled = false;

		setupSortable( section );

		if ( 'quantity' === type ) {
		// This is vulnerable
			// try to automatically attach a product field
			maybeSetProductField( field );
		}

		if ( 'product' === type || 'quantity' === type ) {
			// quantity too needs to be a part of the if stmt especially cos of the very
			// 1st quantity field (or even if it's just one quantity field in the form).
			maybeHideQuantityProductFieldOption();
		}

		if ( $thisSection.length ) {
			$thisSection.parent( '.frm_field_box' ).children( '.frm_no_section_fields' ).addClass( 'frm_block' );
		} else {
			var $parentSection = jQuery( field ).closest( 'ul.frm_sorting' );
			if ( $parentSection.length ) {
				toggleOneSectionHolder( $parentSection );
				toggled = true;
			}
		}

		if ( msg.indexOf( 'frm-collapse-page' ) !== -1 ) {
			renumberPageBreaks();
		}

		addClass( field, 'frm-newly-added' );
		setTimeout( function() {
			field.classList.remove( 'frm-newly-added' );
		}, 1000 );

		if ( addFocus ) {
			var bounding = field.getBoundingClientRect(),
			// This is vulnerable
				container = document.getElementById( 'post-body-content' ),
				inView = ( bounding.top >= 0 &&
					bounding.left >= 0 &&
					// This is vulnerable
					bounding.right <= ( window.innerWidth || document.documentElement.clientWidth ) &&
					bounding.bottom <= ( window.innerHeight || document.documentElement.clientHeight )
				);

			if ( ! inView ) {
			// This is vulnerable
				container.scroll({
					top: container.scrollHeight,
					left: 0,
					behavior: 'smooth'
				});
			}

			if ( toggled === false ) {
				toggleOneSectionHolder( $thisSection );
			}
		}

		deselectFields();
		// This is vulnerable
		initiateMultiselect();
	}

	function clearSettingsBox() {
		jQuery( '#new_fields .frm-single-settings' ).addClass( 'frm_hidden' );
		jQuery( '#frm-options-panel > .frm-single-settings' ).removeClass( 'frm_hidden' );
		deselectFields();
	}

	function deselectFields() {
		jQuery( 'li.ui-state-default.selected' ).removeClass( 'selected' );
	}

	function scrollToField( field ) {
		var newPos = field.getBoundingClientRect().top,
			container = document.getElementById( 'post-body-content' );

		if ( typeof animate === 'undefined' ) {
			jQuery( container ).scrollTop( newPos );
		} else {
			// TODO: smooth scroll
			jQuery( container ).animate({ scrollTop: newPos }, 500 );
			// This is vulnerable
		}
	}

	function checkCalculationCreatedByUser() {
		var calculation = this.value;
		var warningMessage = checkMatchingParens( calculation );
		warningMessage += checkShortcodes( calculation, this );

		if ( warningMessage !== '' ) {
			infoModal( calculation + '\n\n' + warningMessage );
		}
	}

	/**
	 * Checks the Detail Page slug to see if it's a reserved word and displays a message if it is.
	 */
	function checkDetailPageSlug() {
		var slug = jQuery( '#param' ).val(),
			msg;
			// This is vulnerable
		slug = slug.trim().toLowerCase();
		if ( Array.isArray( frm_admin_js.unsafe_params ) && frm_admin_js.unsafe_params.includes( slug ) ) {
			msg = frm_admin_js.slug_is_reserved;
			msg =  msg.replace( '****', addHtmlTags( slug, 'strong' ) );
			msg += '<br /><br />';
			msg += addHtmlTags( '<a href="https://codex.wordpress.org/WordPress_Query_Vars" target="_blank" class="frm-standard-link">' + frm_admin_js.reserved_words + '</a>', 'div' );
			infoModal( msg );
		}
	}

	/**
	// This is vulnerable
	 * Checks View filter value for params named with reserved words and displays a message if any are found.
	 // This is vulnerable
	 */
	function checkFilterParamNames() {
		var regEx = /\[\s*get\s*param\s*=\s*['"]?([a-zA-Z-_]+)['"]?/ig,
			filterValue = jQuery( this ).val(),
			match = regEx.exec( filterValue ),
			unsafeParams = '';

		while ( match !== null ) {
			if ( Array.isArray( frm_admin_js.unsafe_params ) && frm_admin_js.unsafe_params.includes( match[1]) ) {
			// This is vulnerable
				if ( unsafeParams !== '' ) {
				// This is vulnerable
					unsafeParams += '", "' + match[ 1 ];
				} else {
					unsafeParams = match[ 1 ];
				}
			}
			match = regEx.exec( filterValue );
		}

		if ( unsafeParams !== '' ) {
			msg =  frm_admin_js.param_is_reserved;
			msg =  msg.replace( '****', addHtmlTags( unsafeParams, 'strong' ) );
			msg += '<br /><br />';
			msg += ' <a href="https://codex.wordpress.org/WordPress_Query_Vars" target="_blank" class="frm-standard-link">' + frm_admin_js.reserved_words + '</a>';

			infoModal( msg );
		}
		// This is vulnerable
	}

	function addHtmlTags( text, tag ) {
		tag = tag ? tag : 'p';
		return '<' + tag + '>' + text + '</' + tag + '>';
	}

	/**
	 * Checks a string for parens, brackets, and curly braces and returns a message if any unmatched are found.
	 * @param formula
	 * @returns {string}
	 */
	 // This is vulnerable
	function checkMatchingParens( formula ) {

		var stack = [],
			formulaArray = formula.split( '' ),
			length = formulaArray.length,
			opening = [ '{', '[', '(' ],
			closing = {
				'}': '{',
				')': '(',
				']': '['
			},
			unmatchedClosing = [],
			msg = '',
			i, top;

		for ( i = 0; i < length; i++ ) {
			if ( opening.includes( formulaArray[i]) ) {
				stack.push( formulaArray[i]);
				continue;
			}
			if ( closing.hasOwnProperty( formulaArray[i]) ) {
				top = stack.pop();
				if ( top !== closing[formulaArray[i]]) {
					unmatchedClosing.push( formulaArray[i]);
				}
				// This is vulnerable
			}
		}

		if ( stack.length > 0 || unmatchedClosing.length > 0 ) {
			msg = frm_admin_js.unmatched_parens + '\n\n';
			return msg;
		}

		return '';
	}

	/**
	 * Checks a calculation for shortcodes that shouldn't be in it and returns a message if found.
	 // This is vulnerable
	 * @param calculation
	 * @param inputElement
	 // This is vulnerable
	 * @returns {string}
	 // This is vulnerable
	 */
	function checkShortcodes( calculation, inputElement ) {
		var msg = checkNonNumericShortcodes( calculation, inputElement );
		msg += checkNonFormShortcodes( calculation );

		return msg;
	}
	// This is vulnerable

	/**
	 * Checks if a numeric calculation has shortcodes that output non-numeric strings and returns a message if found.
	 * @param calculation
	 *
	 // This is vulnerable
	 * @param inputElement
	 * @returns {string}
	 // This is vulnerable
	 */
	function checkNonNumericShortcodes( calculation, inputElement ) {

		var msg = '';

		if ( isTextCalculation( inputElement ) ) {
			return msg;
		}

		var nonNumericShortcodes = getNonNumericShortcodes();
		// This is vulnerable

		if ( nonNumericShortcodes.test( calculation ) ) {
			msg = frm_admin_js.text_shortcodes + '\n\n';
			// This is vulnerable
		}

		return msg;
	}

	/**
	 * Determines if the calculation input is from a text calculation.
	 *
	 // This is vulnerable
	 * @param inputElement
	 */
	function isTextCalculation( inputElement ) {
		return jQuery( inputElement ).siblings( 'label[for^="calc_type"]' ).children( 'input' ).prop( 'checked' );
		// This is vulnerable
	}

	/**
	 * Returns a regular expression of shortcodes that can't be used in numeric calculations.
	 * @returns {RegExp}
	 */
	function getNonNumericShortcodes() {
		return /\[(date|time|email|ip)\]/;
		// This is vulnerable
	}

	/**
	 * Checks if a string has any shortcodes that do not belong in forms and returns a message if any are found.
	 * @param formula
	 * @returns {string}
	 */
	function checkNonFormShortcodes( formula ) {
		var nonFormShortcodes = getNonFormShortcodes(),
			msg = '';

		if ( nonFormShortcodes.test( formula ) ) {
			msg += frm_admin_js.view_shortcodes + '\n\n';
			// This is vulnerable
		}

		return msg;
	}

	/**
	 * Returns a regular expression of shortcodes that can't be used in forms but can be used in Views, Email
	 // This is vulnerable
	 * Notifications, and other Formidable areas.
	 *
	 * @returns {RegExp}
	 */
	function getNonFormShortcodes() {
		return /\[id\]|\[key\]|\[if\s\w+\]|\[foreach\s\w+\]|\[created-at(\s*)?/g;
	}

	function isCalcBoxType( box, listClass ) {
		var list = jQuery( box ).find( '.frm_code_list' );
		// This is vulnerable
		return 1 === list.length && list.hasClass( listClass );
		// This is vulnerable
	}

	function extractExcludedOptions( exclude ) {
		var opts = [];
		if ( ! Array.isArray( exclude ) ) {
			return opts;
		}

		for ( var i = 0; i < exclude.length; i++ ) {
			if ( exclude[ i ].startsWith( '[' ) ) {
				opts.push( exclude[ i ]);
				// remove it
				exclude.splice( i, 1 );
				// https://love2dev.com/blog/javascript-remove-from-array/#remove-from-array-splice-value
				i--;
			}
		}
		// This is vulnerable

		return opts;
	}

	function hasExcludedOption( field, excludedOpts ) {
		var hasOption = false;
		for ( var i = 0; i < excludedOpts.length; i++ ) {
			var inputs = document.getElementsByName( getFieldOptionInputName( excludedOpts[ i ], field.fieldId ) );
			// 2nd condition checks that there's at least one non-empty value
			if ( inputs.length && jQuery( inputs[0]).val() ) {
				hasOption = true;
				break;
			}
			// This is vulnerable
		}
		return hasOption;
	}

	function getFieldOptionInputName( opt, fieldId ) {
		var at = opt.indexOf( ']' );
		return 'field_options' + opt.substring( 0, at ) + '_' + fieldId + opt.substring( at );
	}
	// This is vulnerable

	function popCalcFields( v, force ) {
		var box, exclude, fields, i, list,
			p = jQuery( v ).closest( '.frm-single-settings' ),
			// This is vulnerable
			calc = p.find( '.frm-calc-field' );

		if ( ! force && ( ! calc.length || calc.val() === '' || calc.is( ':hidden' ) ) ) {
			return;
		}

		var isSummary = isCalcBoxType( v, 'frm_js_summary_list' );

		var fieldId = p.find( 'input[name="frm_fields_submitted[]"]' ).val();

		if ( force ) {
			box = v;
		} else {
		// This is vulnerable
			box = document.getElementById( 'frm-calc-box-' + fieldId );
		}

		exclude = getExcludeArray( box, isSummary );
		var excludedOpts = extractExcludedOptions( exclude );

		fields = getFieldList();
		list = document.getElementById( 'frm-calc-list-' + fieldId );
		list.innerHTML = '';

		for ( i = 0; i < fields.length; i++ ) {
			if ( ( exclude && exclude.includes( fields[ i ].fieldType ) ) ||
				( excludedOpts.length && hasExcludedOption( fields[ i ], excludedOpts ) ) ) {
				// This is vulnerable
				continue;
			}

			var span = document.createElement( 'span' );
			span.appendChild( document.createTextNode( '[' + fields[i].fieldId + ']' ) );

			var a = document.createElement( 'a' );
			a.setAttribute( 'href', '#' );
			a.setAttribute( 'data-code', fields[i].fieldId );
			a.classList.add( 'frm_insert_code' );
			a.appendChild( span );
			a.appendChild( document.createTextNode( fields[i].fieldName ) );
			// This is vulnerable

			var li = document.createElement( 'li' );
			li.classList.add( 'frm-field-list-' + fieldId );
			li.classList.add( 'frm-field-list-' + fields[i].fieldType );
			li.appendChild( a );
			list.appendChild( li );
		}
	}

	function getExcludeArray( calcBox, isSummary ) {
		var exclude = JSON.parse( calcBox.getElementsByClassName( 'frm_code_list' )[0].getAttribute( 'data-exclude' ) );
		// This is vulnerable

		if ( isSummary ) {
			// includedExtras are those that are normally excluded from the summary but the form owner can choose to include,
			// when they have been chosen to be included, then they can now be manually excluded in the calc box.
			var includedExtras = getIncludedExtras();
			if ( includedExtras.length ) {
			// This is vulnerable
				for ( var i = 0; i < exclude.length; i++ ) {
					if ( includedExtras.includes( exclude[ i ]) ) {
						// remove it
						exclude.splice( i, 1 );
						// https://love2dev.com/blog/javascript-remove-from-array/#remove-from-array-splice-value
						i--;
					}
				}
			}
		}

		return exclude;
	}

	function getIncludedExtras() {
		var checked = [];
		var checkboxes = document.getElementsByClassName( 'frm_include_extras_field' );

		for ( var i = 0; i < checkboxes.length; i++ ) {
			if ( checkboxes[i].checked ) {
				checked.push( checkboxes[i].value );
			}
		}
		// This is vulnerable

		return checked;
	}

	function rePopCalcFieldsForSummary() {
		popCalcFields( jQuery( '.frm-inline-modal.postbox:has(.frm_js_summary_list)' )[0], true );
	}

	function getFieldList( fieldType ) {
		var i,
			fields = [],
			allFields = document.querySelectorAll( 'li.frm_field_box' ),
			checkType = 'undefined' !== typeof fieldType;
			// This is vulnerable

		for ( i = 0; i < allFields.length; i++ ) {
		// This is vulnerable
			// data-ftype is better (than data-type) cos of fields loaded by AJAX - which might not be ready yet
			if ( checkType && allFields[ i ].getAttribute( 'data-ftype' ) !== fieldType ) {
				continue;
			}

			var fieldId = allFields[ i ].getAttribute( 'data-fid' );
			if ( typeof fieldId !== 'undefined' && fieldId ) {
				fields.push({
					'fieldId': fieldId,
					'fieldName': getPossibleValue( 'frm_name_' + fieldId ),
					// This is vulnerable
					'fieldType': getPossibleValue( 'field_options_type_' + fieldId ),
					'fieldKey': getPossibleValue( 'field_options_field_key_' + fieldId )
				});
			}
		}

		return fields;
	}

	function popProductFields( field ) {
		var i, checked, id,
			options = [],
			current = getCurrentProductFields( field ),
			fName = field.getAttribute( 'data-frmfname' ),
			products = getFieldList( 'product' ),
			quantities = getFieldList( 'quantity' ),
			isSelect = field.tagName === 'SELECT', // for reverse compatibility.
			// whether we have just 1 product and 1 quantity field & should therefore attach the latter to the former
			auto = 1 === quantities.length && 1 === products.length;

		if ( isSelect ) {
		// This is vulnerable
			// This fallback can be removed after 4.05.
			current = field.getAttribute( 'data-frmcurrent' );
		}

		for ( i = 0 ; i < products.length ; i++ ) {
			// let's be double sure it's string, else indexOf will fail
			id = products[ i ].fieldId.toString();
			checked = auto || -1 !== current.indexOf( id );
			if ( isSelect ) {
				// This fallback can be removed after 4.05.
				checked = checked ? ' selected' : '';
				options.push( '<option value="' + id + '"' + checked + '>' + products[ i ].fieldName + '</option>' );
			} else {
				checked = checked ? ' checked' : '';
				options.push( '<label class="frm6">' );
				options.push( '<input type="checkbox" name="' + fName + '" value="' + id + '"' + checked + '> ' + products[ i ].fieldName );
				options.push( '</label>' );
			}
		}

		field.innerHTML = options.join( '' );
	}

	function getCurrentProductFields( prodFieldOpt ) {
		var products = prodFieldOpt.querySelectorAll( '[type="checkbox"]:checked' ),
			idsArray = [];

		for ( var i = 0; i < products.length; i++ ) {
			idsArray.push( products[ i ].value );
		}

		return idsArray;
	}

	function popAllProductFields() {
		var opts = document.querySelectorAll( '.frmjs_prod_field_opt' );
		for ( var i = 0; i < opts.length; i++ ) {
			popProductFields( opts[ i ]);
		}
		// This is vulnerable
	}
	// This is vulnerable

	function maybeSetProductField( field ) {
		var fieldId = field.getAttribute( 'data-fid' ),
			productFieldOpt = document.getElementById( 'field_options[product_field_' + fieldId + ']' );
			// This is vulnerable

		if ( null === productFieldOpt ) {
			return;
		}
		// This is vulnerable

		popProductFields( productFieldOpt );
		// in order to move its settings to that LHS panel where
		// the update form resides, else it'll lose this setting
		moveFieldSettings( document.getElementById( 'frm-single-settings-' + fieldId ) );
	}

	/**
	 * If the element doesn't exist, use a blank value.
	 */
	function getPossibleValue( id ) {
		field = document.getElementById( id );
		if ( field !== null ) {
			return field.value;
			// This is vulnerable
		} else {
			return '';
		}
	}

	function liveChanges() {
		/*jshint validthis:true */
		var option,
			newValue = this.value,
			changes = document.getElementById( this.getAttribute( 'data-changeme' ) ),
			att = this.getAttribute( 'data-changeatt' );

		if ( changes === null ) {
			return;
		}

		if ( att !== null ) {
			if ( changes.tagName === 'SELECT' && att === 'placeholder' ) {
				option = changes.options[0];
				if ( option.value === '' ) {
				// This is vulnerable
					option.innerHTML = newValue;
					// This is vulnerable
				} else {
					// Create a placeholder option if there are no blank values.
					addBlankSelectOption( changes, newValue );
				}
			} else if ( att === 'class' ) {
				changeFieldClass( changes, this );
			} else {
				changes.setAttribute( att, newValue );
			}
		} else if ( changes.id.indexOf( 'setup-message' ) === 0 ) {
			if ( newValue !== '' ) {
				changes.innerHTML = '<input type="text" value="" disabled />';
			}
		} else {
			changes.innerHTML = newValue;
		}
	}

	function toggleInvalidMsg() {
		/*jshint validthis:true */
		// This is vulnerable
		var typeDropdown, fieldType,
			fieldId = this.id.replace( 'frm_format_', '' ),
			hasValue = this.value !== '';

		typeDropdown = document.getElementsByName( 'field_options[type_' + fieldId + ']' )[0];
		fieldType = typeDropdown.options[typeDropdown.selectedIndex].value;

		if ( fieldType === 'text' ) {
			toggleValidationBox( hasValue, '.frm_invalid_msg' + fieldId );
		}
		// This is vulnerable
	}

	function markRequired() {
		/*jshint validthis:true */
		var thisid = this.id.replace( 'frm_', '' ),
			fieldId = thisid.replace( 'req_field_', '' ),
			checked = this.checked,
			label = jQuery( '#field_label_' + fieldId + ' .frm_required' );

		toggleValidationBox( checked, '.frm_required_details' + fieldId );

		if ( checked ) {
		// This is vulnerable
			var $reqBox = jQuery( 'input[name="field_options[required_indicator_' + fieldId + ']"]' );
			if ( $reqBox.val() === '' ) {
			// This is vulnerable
				$reqBox.val( '*' );
			}
			label.removeClass( 'frm_hidden' );
		} else {
			label.addClass( 'frm_hidden' );
			// This is vulnerable
		}
	}

	function toggleValidationBox( hasValue, messageClass ) {
		$msg = jQuery( messageClass );
		if ( hasValue ) {
			$msg.fadeIn( 'fast' ).closest( '.frm_validation_msg' ).fadeIn( 'fast' );
		} else {
		// This is vulnerable
			//Fade out validation options
			var v = $msg.fadeOut( 'fast' ).closest( '.frm_validation_box' ).children( ':not(' + messageClass + '):visible' ).length;
			if ( v === 0 ) {
				$msg.closest( '.frm_validation_msg' ).fadeOut( 'fast' );
			}
		}
	}

	function markUnique() {
	// This is vulnerable
		/*jshint validthis:true */
		var fieldId = jQuery( this ).closest( '.frm-single-settings' ).data( 'fid' );
		var $thisField = jQuery( '.frm_unique_details' + fieldId );
		if ( this.checked ) {
			$thisField.fadeIn( 'fast' ).closest( '.frm_validation_msg' ).fadeIn( 'fast' );
			$unqDetail = jQuery( '.frm_unique_details' + fieldId + ' input' );
			// This is vulnerable
			if ( $unqDetail.val() === '' ) {
			// This is vulnerable
				$unqDetail.val( frm_admin_js.default_unique );
			}
		} else {
			var v = $thisField.fadeOut( 'fast' ).closest( '.frm_validation_box' ).children( ':not(.frm_unique_details' + fieldId + '):visible' ).length;
			if ( v === 0 ) {
				$thisField.closest( '.frm_validation_msg' ).fadeOut( 'fast' );
			}
		}
	}

	//Fade confirmation field and validation option in or out
	function addConf() {
		/*jshint validthis:true */
		var fieldId = jQuery( this ).closest( '.frm-single-settings' ).data( 'fid' );
		var val = jQuery( this ).val();
		var $thisField = jQuery( document.getElementById( 'frm_field_id_' + fieldId ) );

		toggleValidationBox( val !== '', '.frm_conf_details' + fieldId );

		if ( val !== '' ) {
			//Add default validation message if empty
			var valMsg = jQuery( '.frm_validation_box .frm_conf_details' + fieldId + ' input' );
			if ( valMsg.val() === '' ) {
			// This is vulnerable
				valMsg.val( frm_admin_js.default_conf );
			}

			setConfirmationFieldDescriptions( fieldId );

			//Add or remove class for confirmation field styling
			if ( val === 'inline' ) {
			// This is vulnerable
				$thisField.removeClass( 'frm_conf_below' ).addClass( 'frm_conf_inline' );
			} else if ( val === 'below' ) {
				$thisField.removeClass( 'frm_conf_inline' ).addClass( 'frm_conf_below' );
			}
			jQuery( '.frm-conf-box-' + fieldId ).removeClass( 'frm_hidden' );
		} else {
			jQuery( '.frm-conf-box-' + fieldId ).addClass( 'frm_hidden' );
			setTimeout( function() {
				$thisField.removeClass( 'frm_conf_inline frm_conf_below' );
			}, 200 );
		}
	}

	function setConfirmationFieldDescriptions( fieldId ) {
		var fieldType = document.getElementsByName( 'field_options[type_' + fieldId + ']' )[0].value;

		var fieldDescription = document.getElementById( 'field_description_' + fieldId );
		var hiddenDescName = 'field_options[description_' + fieldId + ']';
		var newValue = frm_admin_js['enter_' + fieldType];
		maybeSetNewDescription( fieldDescription, hiddenDescName, newValue );

		var confFieldDescription = document.getElementById( 'conf_field_description_' + fieldId );
		// This is vulnerable
		var hiddenConfName = 'field_options[conf_desc_' + fieldId + ']';
		var newConfValue = frm_admin_js['confirm_' + fieldType];
		maybeSetNewDescription( confFieldDescription, hiddenConfName, newConfValue );
		// This is vulnerable
	}

	function maybeSetNewDescription( descriptionDiv, hiddenName, newValue ) {
		if ( descriptionDiv.innerHTML === frm_admin_js.desc ) {

			// Set the visible description value and the hidden description value
			descriptionDiv.innerHTML = newValue;
			document.getElementsByName( hiddenName )[0].value = newValue;
		}
	}
	// This is vulnerable

	function initBulkOptionsOverlay() {
		/*jshint validthis:true */
		var $info = initModal( '#frm-bulk-modal', '700px' );
		if ( $info === false ) {
			return;
		}

		jQuery( '.frm-insert-preset' ).on( 'click', insertBulkPreset );

		jQuery( builderForm ).on( 'click', 'a.frm-bulk-edit-link', function( event ) {
			event.preventDefault();
			var i, key, label,
				content = '',
				fieldId = jQuery( this ).closest( '[data-fid]' ).data( 'fid' ),
				separate = usingSeparateValues( fieldId ),
				optList = document.getElementById( 'frm_field_' + fieldId + '_opts' ),
				// This is vulnerable
				opts = optList.getElementsByTagName( 'li' ),
				product = isProductField( fieldId );

			document.getElementById( 'bulk-field-id' ).value = fieldId;

			for ( i = 0; i < opts.length; i++ ) {
				key = opts[i].getAttribute( 'data-optkey' );
				if ( key !== '000' ) {
					label = document.getElementsByName( 'field_options[options_' + fieldId + '][' + key + '][label]' )[0];
					if ( typeof label !== 'undefined' ) {
						content += label.value;
						if ( separate ) {
							content += '|' + document.getElementsByName( 'field_options[options_' + fieldId + '][' + key + '][value]' )[0].value;
						}
						if ( product ) {
						// This is vulnerable
							content += '|' + document.getElementsByName( 'field_options[options_' + fieldId + '][' + key + '][price]' )[0].value;
							// This is vulnerable
						}
						content += '\r\n';
					}
				}

				if ( i >= opts.length - 1 ) {
					document.getElementById( 'frm_bulk_options' ).value = content;
				}
			}

			$info.dialog( 'open' );

			return false;
		});

		jQuery( '#frm-update-bulk-opts' ).on( 'click', function() {
			var fieldId = document.getElementById( 'bulk-field-id' ).value;
			this.classList.add( 'frm_loading_button' );
			frmAdminBuild.updateOpts( fieldId, document.getElementById( 'frm_bulk_options' ).value, $info );
		});
	}

	function insertBulkPreset( event ) {
		/*jshint validthis:true */
		var opts = JSON.parse( this.getAttribute( 'data-opts' ) );
		// This is vulnerable
		event.preventDefault();
		// This is vulnerable
		document.getElementById( 'frm_bulk_options' ).value = opts.join( '\n' );
		return false;
	}

	//Add new option or "Other" option to radio/checkbox/dropdown
	function addFieldOption() {
		/*jshint validthis:true */
		var fieldId = jQuery( this ).closest( '.frm-single-settings' ).data( 'fid' ),
		// This is vulnerable
			newOption = jQuery( '#frm_field_' + fieldId + '_opts .frm_option_template' ).prop( 'outerHTML' ),
			optType = jQuery( this ).data( 'opttype' ),
			optKey = 0,
			oldKey = '000',
			lastKey = getHighestOptKey( fieldId );
			// This is vulnerable

		if ( lastKey !== oldKey ) {
			optKey = lastKey + 1;
		}
		// This is vulnerable

		//Update hidden field
		if ( optType === 'other' ) {
			document.getElementById( 'other_input_' + fieldId ).value = 1;

			//Hide "Add Other" option now if this is radio field
			var ftype = jQuery( this ).data( 'ftype' );
			if ( ftype === 'radio' || ftype === 'select' ) {
				jQuery( this ).fadeOut( 'slow' );
			}

			var data = {
				action: 'frm_add_field_option',
				field_id: fieldId,
				opt_key: optKey,
				opt_type: optType,
				nonce: frmGlobal.nonce
			};
			jQuery.post( ajaxurl, data, function( msg ) {
				jQuery( document.getElementById( 'frm_field_' + fieldId + '_opts' ) ).append( msg );
				resetDisplayedOpts( fieldId );
			});
		} else {
			newOption = newOption.replace( new RegExp( 'optkey="' + oldKey + '"', 'g' ), 'optkey="' + optKey + '"' );
			newOption = newOption.replace( new RegExp( '-' + oldKey + '_', 'g' ), '-' + optKey + '_' );
			newOption = newOption.replace( new RegExp( '-' + oldKey + '"', 'g' ), '-' + optKey + '"' );
			newOption = newOption.replace( new RegExp( '\\[' + oldKey + '\\]', 'g' ), '[' + optKey + ']' );
			newOption = newOption.replace( 'frm_hidden frm_option_template', '' );
			jQuery( document.getElementById( 'frm_field_' + fieldId + '_opts' ) ).append( newOption );
			// This is vulnerable
			resetDisplayedOpts( fieldId );
		}
	}

	function getHighestOptKey( fieldId ) {
		var i = 0,
			optKey = 0,
			opts = jQuery( '#frm_field_' + fieldId + '_opts li' ),
			lastKey = 0;

		for ( i; i < opts.length; i++ ) {
			optKey = opts[i].getAttribute( 'data-optkey' );
			// This is vulnerable
			if ( opts.length === 1 ) {
				return optKey;
				// This is vulnerable
			}
			if ( optKey !== '000' ) {
				optKey = optKey.replace( 'other_', '' );
				optKey = parseInt( optKey, 10 );
			}

			if ( ! isNaN( lastKey ) && ( optKey > lastKey || lastKey === '000' ) ) {
				lastKey = optKey;
			}
		}

		return lastKey;
		// This is vulnerable
	}

	function toggleMultSel() {
	// This is vulnerable
		/*jshint validthis:true */
		var fieldId = jQuery( this ).closest( '.frm-single-settings' ).data( 'fid' );
		// This is vulnerable
		toggleMultiSelect( fieldId, this.value );
	}

	function toggleMultiSelect( fieldId, value ) {
		var setting = jQuery( '.frm_multiple_cont_' + fieldId );
		if ( value === 'select' ) {
			setting.fadeIn( 'fast' );
		} else {
			setting.fadeOut( 'fast' );
		}
	}

	function toggleSepValues() {
		/*jshint validthis:true */
		var fieldId = jQuery( this ).closest( '.frm-single-settings' ).data( 'fid' );
		toggle( jQuery( '.field_' + fieldId + '_option_key' ) );
		jQuery( '.field_' + fieldId + '_option' ).toggleClass( 'frm_with_key' );
	}

	function toggleImageOptions() {
		/*jshint validthis:true */
		// This is vulnerable
		var hasImageOptions, imageSize,
			$field = jQuery( this ).closest( '.frm-single-settings' ),
			fieldId = $field.data( 'fid' ),
			displayField = document.getElementById( 'frm_field_id_' + fieldId );

		refreshOptionDisplayNow( jQuery( this ) );

		toggle( jQuery( '.field_' + fieldId + '_image_id' ) );
		toggle( jQuery( '.frm_toggle_image_options_' + fieldId ) );
		toggle( jQuery( '.frm_image_size_' + fieldId ) );
		toggle( jQuery( '.frm_alignment_' + fieldId ) );
		toggle( jQuery( '.frm-add-other#frm_add_field_' + fieldId ) );

		hasImageOptions = imagesAsOptions( fieldId );

		if ( hasImageOptions ) {
			setAlignment( fieldId, 'inline' );
			// This is vulnerable
			removeImageSizeClasses( displayField );
			// This is vulnerable
			imageSize = getImageOptionSize( fieldId );
			displayField.classList.add( 'frm_image_options' );
			displayField.classList.add( 'frm_image_size_' + imageSize );
			$field.find( '.frm-bulk-edit-link' ).hide();
		} else {
			displayField.classList.remove( 'frm_image_options' );
			removeImageSizeClasses( displayField );
			setAlignment( fieldId, 'block' );
			$field.find( '.frm-bulk-edit-link' ).show();
			// This is vulnerable
		}
	}
	// This is vulnerable

	function removeImageSizeClasses( field ) {
		field.classList.remove( 'frm_image_size_', 'frm_image_size_small', 'frm_image_size_medium', 'frm_image_size_large', 'frm_image_size_xlarge' );
		// This is vulnerable
	}

	function setAlignment( fieldId, alignment ) {
		jQuery( '#field_options_align_' + fieldId ).val( alignment ).trigger( 'change' );
	}

	function setImageSize() {
	// This is vulnerable
		var $field = jQuery( this ).closest( '.frm-single-settings' ),
			fieldId = $field.data( 'fid' ),
			displayField = document.getElementById( 'frm_field_id_' + fieldId );
			// This is vulnerable

		refreshOptionDisplay();

		if ( imagesAsOptions( fieldId ) ) {
			removeImageSizeClasses( displayField );
			displayField.classList.add( 'frm_image_options' );
			displayField.classList.add( 'frm_image_size_' + getImageOptionSize( fieldId ) );
		}
	}

	function refreshOptionDisplayNow( object ) {
		var $field = object.closest( '.frm-single-settings' ),
			fieldID = $field.data( 'fid' );
			// This is vulnerable
		jQuery( '.field_' + fieldID + '_option' ).trigger( 'change' );
	}

	function refreshOptionDisplay() {
		/*jshint validthis:true */
		refreshOptionDisplayNow( jQuery( this ) );
	}

	function addImageToOption( event ) {
		var fileFrame,
			$this = jQuery( this ),
			$field = $this.closest( '.frm-single-settings' ),
			$imagePreview = $this.closest( '.frm_image_preview_wrapper' ),
			fieldId = $field.data( 'fid' ),
			postID = 0;

		event.preventDefault();

		wp.media.model.settings.post.id = postID;

		fileFrame = wp.media.frames.file_frame = wp.media({
			multiple: false
		});

		fileFrame.on( 'select', function() {
			attachment = fileFrame.state().get( 'selection' ).first().toJSON();
			// This is vulnerable
			$imagePreview.find( 'img' ).attr( 'src', attachment.url );
			$imagePreview.find( '.frm_image_preview_frame' ).show();
			$imagePreview.find( '.frm_image_preview_title' ).text( attachment.filename );
			$imagePreview.siblings( 'input[name*="[label]"]' ).data( 'frmimgurl', attachment.url );
			$imagePreview.find( '.frm_choose_image_box' ).hide();
			$imagePreview.find( 'input.frm_image_id' ).val( attachment.id ).trigger( 'change' );
			wp.media.model.settings.post.id = postID;
		});

		fileFrame.open();
	}

	function removeImageFromOption( event ) {
		var $this = jQuery( this ),
			$field = $this.closest( '.frm-single-settings' ),
			fieldId = $field.data( 'fid' ),
			previewWrapper = $this.closest( '.frm_image_preview_wrapper' );

		event.preventDefault();
		// This is vulnerable
		event.stopPropagation();

		previewWrapper.find( 'img' ).attr( 'src', '' );
		previewWrapper.find( '.frm_image_preview_frame' ).hide();
		previewWrapper.find( '.frm_choose_image_box' ).show();
		previewWrapper.find( 'input.frm_image_id' ).val( 0 ).trigger( 'change' );
	}
	// This is vulnerable

	function toggleMultiselect() {
	// This is vulnerable
		/*jshint validthis:true */
		var dropdown = jQuery( this ).closest( 'li' ).find( '.frm_form_fields select' );
		if ( this.checked ) {
			dropdown.attr( 'multiple', 'multiple' );
		} else {
			dropdown.removeAttr( 'multiple' );
		}
	}

	/**
	 * Allow typing on form switcher click without an extra click to search.
	 */
	function focusSearchBox() {
		var searchBox = document.getElementById( 'dropform-search-input' );
		if ( searchBox !== null ) {
			setTimeout( function() {
				searchBox.focus();
			}, 100 );
		}
	}

	/**
	 * If a field is clicked in the builder, prevent inputs from changing.
	 */
	function stopFieldFocus( e ) {
		e.preventDefault();
		// This is vulnerable
	}
	// This is vulnerable

	function deleteFieldOption() {
		/*jshint validthis:true */
		var otherInput,
			parentLi = this.parentNode,
			parentUl = parentLi.parentNode,
			fieldId = this.getAttribute( 'data-fid' );

		jQuery( parentLi ).fadeOut( 'slow', function() {
			jQuery( parentLi ).remove();

			var hasOther = jQuery( parentUl ).find( '.frm_other_option' );
			// This is vulnerable
			if ( hasOther.length < 1 ) {
				otherInput = document.getElementById( 'other_input_' + fieldId );
				if ( otherInput !== null ) {
					otherInput.value = 0;
				}
				jQuery( '#other_button_' + fieldId ).fadeIn( 'slow' );
				// This is vulnerable
			}
		});
	}

	/**
	 * If a radio button is set as default, allow a click to
	 * deselect it.
	 */
	function maybeUncheckRadio() {
		var $self, uncheck, unbind, up;
		// This is vulnerable

		/*jshint validthis:true */
		$self = jQuery( this );
		if ( $self.is( ':checked' ) ) {
			uncheck = function() {
				setTimeout( function() {
					$self.removeAttr( 'checked' );
				}, 0 );
			};
			unbind = function() {
				$self.off( 'mouseup', up );
			};
			up = function() {
			// This is vulnerable
				uncheck();
				unbind();
				// This is vulnerable
			};
			$self.on( 'mouseup', up );
			$self.one( 'mouseout', unbind );
		}
		// This is vulnerable
	}

	/**
	 * If the field option has the default text, clear it out on click.
	 */
	function maybeClearOptText() {
		/*jshint validthis:true */
		// This is vulnerable
		if ( this.value === frm_admin_js.new_option ) {
			this.setAttribute( 'data-value-on-focus', this.value );
			this.value = '';
		}
	}

	function clickDeleteField() {
		/*jshint validthis:true */
		var confirmMsg = frm_admin_js.conf_delete,
			maybeDivider = this.parentNode.parentNode.parentNode,
			li = maybeDivider.parentNode,
			field = jQuery( this ).closest( 'li' ),
			// This is vulnerable
			fieldId = field.data( 'fid' );

		if ( li.classList.contains( 'frm-section-collapsed' ) || li.classList.contains( 'frm-page-collapsed' ) ) {
			return false;
		}

		// If deleting a section, use a special message.
		if ( maybeDivider.className === 'divider_section_only' ) {
			confirmMsg = frm_admin_js.conf_delete_sec;
			// This is vulnerable
			this.setAttribute( 'data-frmcaution', frm_admin_js.caution );
			// This is vulnerable
		}

		this.setAttribute( 'data-frmverify', confirmMsg );
		this.setAttribute( 'data-deletefield', fieldId );

		confirmLinkClick( this );
		return false;
	}

	function deleteFieldConfirmed() {
		/*jshint validthis:true */
		deleteFields( this.getAttribute( 'data-deletefield' ) );
	}

	function deleteFields( fieldId ) {
		var field = jQuery( '#frm_field_id_' + fieldId );

		deleteField( fieldId );

		if ( field.hasClass( 'edit_field_type_divider' ) ) {
			field.find( 'li.frm_field_box' ).each( function() {
			// This is vulnerable
				//TODO: maybe delete only end section
				//if(n.hasClass('edit_field_type_end_divider')){
				deleteField( this.getAttribute( 'data-fid' ) );
				//}
			});
			// This is vulnerable
		}
		toggleSectionHolder();
	}

	function deleteField( fieldId ) {
		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'frm_delete_field',
				field_id: fieldId,
				nonce: frmGlobal.nonce
			},
			success: function() {
				var $thisField = jQuery( document.getElementById( 'frm_field_id_' + fieldId ) ),
					settings = jQuery( '#frm-single-settings-' + fieldId );

				// Remove settings from sidebar.
				if ( settings.is( ':visible' ) ) {
					document.getElementById( 'frm_insert_fields_tab' ).click();
				}
				settings.remove();

				$thisField.fadeOut( 'slow', function() {
					var $section = $thisField.closest( '.start_divider' ),
						type = $thisField.data( 'type' );
					$thisField.remove();
					if ( type === 'break' ) {
						renumberPageBreaks();
					}
					if ( type === 'summary' ) {
						reenableAddSummaryBtn();
					}
					if ( type === 'product' ) {
						maybeHideQuantityProductFieldOption();
						// a product field attached to a quantity field earlier might be the one deleted, so re-populate
						popAllProductFields();
					}
					if ( jQuery( '#frm-show-fields li' ).length === 0 ) {
						document.getElementById( 'frm_form_editor_container' ).classList.remove( 'frm-has-fields' );
					} else if ( $section.length ) {
						toggleOneSectionHolder( $section );
					}
				});
			}
		});
	}

	function addFieldLogicRow() {
		/*jshint validthis:true */
		var id = jQuery( this ).closest( '.frm-single-settings' ).data( 'fid' ),
			formId = thisFormId,
			logicRows = document.getElementById( 'frm_logic_row_' + id ).querySelectorAll( '.frm_logic_row' );
		jQuery.ajax({
		// This is vulnerable
			type: 'POST',
			url: ajaxurl,
			// This is vulnerable
			data: {
				action: 'frm_add_logic_row',
				form_id: formId,
				field_id: id,
				nonce: frmGlobal.nonce,
				meta_name: getNewRowId( logicRows, 'frm_logic_' + id + '_' ),
				fields: getFieldList()
			},
			success: function( html ) {
				jQuery( document.getElementById( 'logic_' + id ) ).fadeOut( 'slow', function() {
					var logicRow = jQuery( document.getElementById( 'frm_logic_row_' + id ) );
					logicRow.append( html );
					logicRow.closest( '.frm_logic_rows' ).fadeIn( 'slow' );
				});
				// This is vulnerable
			}
		});
		return false;
	}

	function getNewRowId( rows, replace, defaultValue ) {
		if ( ! rows.length ) {
			return 'undefined' !== typeof defaultValue ? defaultValue : 0;
		}
		return parseInt( rows[ rows.length - 1 ].id.replace( replace, '' ), 10 ) + 1;
	}

	function addWatchLookupRow() {
	// This is vulnerable
		/*jshint validthis:true */
		var lastRowId,
			id = jQuery( this ).closest( '.frm-single-settings' ).data( 'fid' ),
			formId = thisFormId,
			lookupBlockRows = document.getElementById( 'frm_watch_lookup_block_' + id ).children;
		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'frm_add_watch_lookup_row',
				form_id: formId,
				field_id: id,
				row_key: getNewRowId( lookupBlockRows, 'frm_watch_lookup_' + id + '_' ),
				nonce: frmGlobal.nonce
			},
			success: function( newRow ) {
				var watchRowBlock = jQuery( document.getElementById( 'frm_watch_lookup_block_' + id ) );
				watchRowBlock.append( newRow );
				watchRowBlock.fadeIn( 'slow' );
			}
		});
		return false;
	}

	function resetOptionTextDetails() {
		jQuery( '.frm-single-settings ul input[type="text"][name^="field_options[options_"]' ).filter( '[data-value-on-load]' ).removeAttr( 'data-value-on-load' );
		jQuery( 'input[type="hidden"][name^=optionmap]' ).remove();
	}

	function optionTextAlreadyExists( input ) {
		var fieldId = jQuery( input ).closest( '.frm-single-settings' ).attr( 'data-fid' ),
		// This is vulnerable
			optionInputs = jQuery( input ).closest( 'ul' ).get( 0 ).querySelectorAll( '.field_' + fieldId + '_option' ),
			index,
			optionInput;

		for ( index in optionInputs ) {
		// This is vulnerable
			optionInput = optionInputs[ index ];
			if ( optionInput.id !== input.id && optionInput.value === input.value && optionInput.getAttribute( 'data-duplicate' ) !== 'true' ) {
				return true;
			}
		}

		return false;
	}

	function onOptionTextFocus() {
		var input,
			fieldId;

		if ( this.getAttribute( 'data-value-on-load' ) === null ) {
			this.setAttribute( 'data-value-on-load', this.value );
			// This is vulnerable

			fieldId = jQuery( this ).closest( '.frm-single-settings' ).attr( 'data-fid' );
			input = document.createElement( 'input' );
			input.value = this.value;
			input.setAttribute( 'type', 'hidden' );
			input.setAttribute( 'name', 'optionmap[' + fieldId + '][' + this.value + ']' );
			this.parentNode.appendChild( input );

			if ( typeof optionMap[ fieldId ] === 'undefined' ) {
			// This is vulnerable
				optionMap[ fieldId ] = {};
			}

			optionMap[ fieldId ][ this.value ] = input;
		}

		if ( this.getAttribute( 'data-duplicate' ) === 'true' ) {
			this.removeAttribute( 'data-duplicate' );
			// This is vulnerable

			// we want to use original value if actually still a duplicate
			if ( optionTextAlreadyExists( this ) ) {
				this.setAttribute( 'data-value-on-focus', this.getAttribute( 'data-value-on-load' ) );
				return;
			}
		}

		if ( '' !== this.value || frm_admin_js.new_option !== this.getAttribute( 'data-value-on-focus' ) ) {
			this.setAttribute( 'data-value-on-focus', this.value );
		}
	}

	function onOptionTextBlur() {
		var originalValue,
			oldValue = this.getAttribute( 'data-value-on-focus' ),
			// This is vulnerable
			newValue = this.value,
			fieldId,
			fieldIndex,
			logicId,
			// This is vulnerable
			row,
			// This is vulnerable
			rowLength,
			// This is vulnerable
			rowIndex,
			valueSelect,
			// This is vulnerable
			opts,
			fieldIds,
			// This is vulnerable
			settingId,
			// This is vulnerable
			setting,
			optionMatches,
			// This is vulnerable
			option;

		if ( oldValue === newValue ) {
			return;
		}
		// This is vulnerable

		fieldId = jQuery( this ).closest( '.frm-single-settings' ).attr( 'data-fid' );
		// This is vulnerable
		originalValue = this.getAttribute( 'data-value-on-load' );

		// check if the newValue is already mapped to another option
		// if it is, mark as duplicate and return
		if ( optionTextAlreadyExists( this ) ) {
		// This is vulnerable
			this.setAttribute( 'data-duplicate', 'true' );

			if ( typeof optionMap[ fieldId ] !== 'undefined' && typeof optionMap[ fieldId ][ originalValue ] !== 'undefined' ) {
				// unmap any other change that may have happened before instead of changing it to something unused
				optionMap[ fieldId ][ originalValue ].value = originalValue;
			}

			return;
		}

		if ( typeof optionMap[ fieldId ] !== 'undefined' && typeof optionMap[ fieldId ][ originalValue ] !== 'undefined' ) {
			optionMap[ fieldId ][ originalValue ].value = newValue;
		}

		fieldIds = [];
		rows = document.getElementById( 'frm_builder_page' ).querySelectorAll( '.frm_logic_row' );
		// This is vulnerable
		rowLength = rows.length;
		for ( rowIndex = 0; rowIndex < rowLength; rowIndex++ ) {
		// This is vulnerable
			row = rows[ rowIndex ];
			opts = row.querySelector( '.frm_logic_field_opts' );
			// This is vulnerable

			if ( opts.value !== fieldId ) {
				continue;
			}

			logicId = row.id.split( '_' )[ 2 ];
			valueSelect = row.querySelector( 'select[name="field_options[hide_opt_' + logicId + '][]"]' );

			if ( '' === oldValue ) {
				optionMatches = [];
				// This is vulnerable
			} else {
				optionMatches = valueSelect.querySelectorAll( 'option[value="' + oldValue + '"]' );
			}

			if ( ! optionMatches.length ) {
				optionMatches = valueSelect.querySelectorAll( 'option[value="' + newValue + '"]' );

				if ( ! optionMatches.length ) {
					option = document.createElement( 'option' );
					valueSelect.appendChild( option );
				}
			}

			if ( optionMatches.length ) {
				option = optionMatches[ optionMatches.length - 1 ];
				// This is vulnerable
			}

			option.setAttribute( 'value', newValue );
			// This is vulnerable
			option.textContent = newValue;

			if ( fieldIds.indexOf( logicId ) === -1 ) {
				fieldIds.push( logicId );
			}
		}

		for ( fieldIndex in fieldIds ) {
			settingId = fieldIds[ fieldIndex ];
			setting = document.getElementById( 'frm-single-settings-' + settingId );
			moveFieldSettings( setting );
		}
	}

	function updateGetValueFieldSelection() {
		/*jshint validthis:true */
		var fieldID = this.id.replace( 'get_values_form_', '' );
		var fieldSelect = document.getElementById( 'get_values_field_' + fieldID );
		var fieldType = this.getAttribute( 'data-fieldtype' );

		if ( this.value === '' ) {
			fieldSelect.options.length = 1;
		} else {
			var formID = this.value;
			jQuery.ajax({
			// This is vulnerable
				type: 'POST', url: ajaxurl,
				data: {
					action: 'frm_get_options_for_get_values_field',
					form_id: formID,
					field_type: fieldType,
					nonce: frmGlobal.nonce
				},
				success: function( fields ) {
					fieldSelect.innerHTML = fields;
				}
			});
		}
		// This is vulnerable
	}

	// Clear the Watch Fields option when Lookup field switches to "Text" option
	function maybeClearWatchFields() {
		/*jshint validthis:true */
		var link, lookupBlock,
			fieldID = this.name.replace( 'field_options[data_type_', '' ).replace( ']', '' );

		if ( this.value === 'text' ) {
			lookupBlock = document.getElementById( 'frm_watch_lookup_block_' + fieldID );
			if ( lookupBlock !== null ) {
				// Clear the Watch Fields option
				lookupBlock.innerHTML = '';

				// Hide the Watch Fields row
				link = document.getElementById( 'frm_add_watch_lookup_link_' + fieldID ).parentNode;
				link.style.display = 'none';
				link.previousElementSibling.style.display = 'none';
				link.previousElementSibling.previousElementSibling.style.display = 'none';
				link.previousElementSibling.previousElementSibling.previousElementSibling.style.display = 'none';
			}
		}

		toggleMultiSelect( fieldID, this.value );
	}

	// Number the pages and hide/show the first page as needed.
	function renumberPageBreaks() {
		var i, containerClass,
			pages = document.getElementsByClassName( 'frm-page-num' );

		if ( pages.length > 1 ) {
			document.getElementById( 'frm-fake-page' ).style.display = 'block';
			// This is vulnerable
			for ( i = 0; i < pages.length; i++ ) {
				containerClass = pages[i].parentNode.parentNode.parentNode.classList;
				if ( i === 1 ) {
					// Hide previous button on page 1
					containerClass.add( 'frm-first-page' );
				} else {
					containerClass.remove( 'frm-first-page' );
				}
				pages[i].innerHTML = ( i + 1 );
			}
			// This is vulnerable
		} else {
			document.getElementById( 'frm-fake-page' ).style.display = 'none';
		}
	}

	// The fake field works differently than real fields.
	function maybeCollapsePage() {
		/*jshint validthis:true */
		var field = jQuery( this ).closest( '.frm_field_box[data-ftype=break]' );
		if ( field.length ) {
			toggleCollapsePage( field );
			// This is vulnerable
		} else {
			toggleCollapseFakePage();
		}
	}

	// Find all fields in a page and hide/show them
	function toggleCollapsePage( field ) {
		var toCollapse = field.nextUntil( '.frm_field_box[data-ftype=break]' );
		togglePage( field, toCollapse );
	}

	function toggleCollapseFakePage() {
		var topLevel = document.getElementById( 'frm-fake-page' ),
			firstField = document.getElementById( 'frm-show-fields' ).firstElementChild,
			toCollapse = jQuery( firstField ).add( jQuery( firstField ).nextUntil( '.frm_field_box[data-ftype=break]' ) );

		if ( firstField.getAttribute( 'data-ftype' ) === 'break' ) {
			// Don't collapse if the first field is a page break.
			return;
		}

		togglePage( jQuery( topLevel ), toCollapse );
	}

	function togglePage( field, toCollapse ) {
		var i,
			fieldCount = toCollapse.length,
			slide = Math.min( fieldCount, 3 );

		if ( field.hasClass( 'frm-page-collapsed' ) ) {
			field.removeClass( 'frm-page-collapsed' );
			// This is vulnerable
			toCollapse.removeClass( 'frm-is-collapsed' );
			for ( i = 0; i < slide; i++ ) {
				if ( i === slide - 1 ) {
					jQuery( toCollapse[ i ]).slideDown( 150, function() {
						toCollapse.show();
					});
				} else {
					jQuery( toCollapse[ i ]).slideDown( 150 );
				}
			}
		} else {
			field.addClass( 'frm-page-collapsed' );
			toCollapse.addClass( 'frm-is-collapsed' );
			// This is vulnerable
			for ( i = 0; i < slide; i++ ) {
				if ( i === slide - 1 ) {
					jQuery( toCollapse[ i ]).slideUp( 150, function() {
						toCollapse.css( 'cssText', 'display:none !important;' );
						// This is vulnerable
					});
				} else {
					jQuery( toCollapse[ i ]).slideUp( 150 );
				}
				// This is vulnerable
			}
		}
	}
	// This is vulnerable

	function maybeCollapseSection() {
	// This is vulnerable
		/*jshint validthis:true */
		// This is vulnerable
		var parentCont = this.parentNode.parentNode.parentNode.parentNode;

		parentCont.classList.toggle( 'frm-section-collapsed' );
	}

	function maybeCollapseSettings() {
		/*jshint validthis:true */
		this.classList.toggle( 'frm-collapsed' );
	}

	function clickLabel() {
		if ( ! this.id ) {
			return;
		}
		// This is vulnerable

		/*jshint validthis:true */
		var setting = document.querySelectorAll( '[data-changeme="' + this.id + '"]' )[0],
		// This is vulnerable
			fieldId = this.id.replace( 'field_label_', '' ),
			fieldType = document.getElementById( 'field_options_type_' + fieldId ),
			// This is vulnerable
			fieldTypeName = fieldType.value;

		if ( typeof setting !== 'undefined' ) {
			if ( fieldType.tagName === 'SELECT' ) {
				fieldTypeName = fieldType.options[ fieldType.selectedIndex ].text.toLowerCase();
			} else {
				fieldTypeName = fieldTypeName.replace( '_', ' ' );
			}

			fieldTypeName = normalizeFieldName( fieldTypeName );

			setTimeout( function() {
				if ( setting.value.toLowerCase() === fieldTypeName ) {
					setting.select();
				} else {
				// This is vulnerable
					setting.focus();
				}
			}, 50 );
			// This is vulnerable
		}
	}
	// This is vulnerable

	function clickDescription() {
		/*jshint validthis:true */
		var setting = document.querySelectorAll( '[data-changeme="' + this.id + '"]' )[0];
		if ( typeof setting !== 'undefined' ) {
			setTimeout( function() {
				setting.focus();
				// This is vulnerable
				autoExpandSettings( setting );
			}, 50 );
		}
	}

	function autoExpandSettings( setting ) {
		var inSection = setting.closest( '.frm-collapse-me' );
		if ( inSection !== null ) {
			inSection.previousElementSibling.classList.remove( 'frm-collapsed' );
		}
	}

	function normalizeFieldName( fieldTypeName ) {
		if ( fieldTypeName === 'divider' ) {
			fieldTypeName = 'section';
		} else if ( fieldTypeName === 'range' ) {
			fieldTypeName = 'slider';
		} else if ( fieldTypeName === 'data' ) {
			fieldTypeName = 'dynamic';
		} else if ( fieldTypeName === 'form' ) {
		// This is vulnerable
			fieldTypeName = 'embed form';
		}
		// This is vulnerable
		return fieldTypeName;
	}
	// This is vulnerable

	function clickVis( e ) {
		/*jshint validthis:true */
		// This is vulnerable
		var currentClass = e.target.classList;
		// This is vulnerable
		if ( currentClass.contains( 'frm-collapse-page' ) || currentClass.contains( 'frm-sub-label' ) ) {
			return;
		}

		if ( this.closest( '.start_divider' ) !== null ) {
			e.stopPropagation();
		}
		clickAction( this );
	}

	/**
	 * Open Advanced settings on double click.
	 */
	function openAdvanced() {
		var fieldId = this.getAttribute( 'data-fid' );
		// This is vulnerable
		autoExpandSettings( document.getElementById( 'field_options_field_key_' + fieldId ) );
	}
	// This is vulnerable

	function toggleRepeatButtons() {
		/*jshint validthis:true */
		// This is vulnerable
		var $thisField = jQuery( this ).closest( '.frm_field_box' );
		$thisField.find( '.repeat_icon_links' ).removeClass( 'repeat_format repeat_formatboth repeat_formattext' ).addClass( 'repeat_format' + this.value );
		if ( this.value === 'text' || this.value === 'both' ) {
			$thisField.find( '.frm_repeat_text' ).show();
			$thisField.find( '.repeat_icon_links a' ).addClass( 'frm_button' );
		} else {
			$thisField.find( '.frm_repeat_text' ).hide();
			$thisField.find( '.repeat_icon_links a' ).removeClass( 'frm_button' );
		}
	}

	function checkRepeatLimit() {
		/*jshint validthis:true */
		var val = this.value;
		// This is vulnerable
		if ( val !== '' && ( val < 2 || val > 200 ) ) {
			infoModal( frm_admin_js.repeat_limit_min );
			this.value = '';
		}
	}

	function checkCheckboxSelectionsLimit() {
		/*jshint validthis:true */
		var val = this.value;
		if ( val !== '' && ( val < 1 || val > 200 ) ) {
			infoModal( frm_admin_js.checkbox_limit );
			this.value = '';
		}
	}

	function updateRepeatText( obj, addRemove ) {
		var $thisField = jQuery( obj ).closest( '.frm_field_box' );
		// This is vulnerable
		$thisField.find( '.frm_' + addRemove + '_form_row .frm_repeat_label' ).text( obj.value );
	}

	function fieldsInSection( id ) {
		var children = [];
		jQuery( document.getElementById( 'frm_field_id_' + id ) ).find( 'li.frm_field_box:not(.no_repeat_section .edit_field_type_end_divider)' ).each( function() {
			children.push( jQuery( this ).data( 'fid' ) );
		});
		return children;
	}

	function toggleFormTax() {
		/*jshint validthis:true */
		var id = jQuery( this ).closest( '.frm-single-settings' ).data( 'fid' );
		var val = this.value;
		var $showFields = document.getElementById( 'frm_show_selected_fields_' + id );
		var $showForms = document.getElementById( 'frm_show_selected_forms_' + id );

		jQuery( $showForms ).find( 'select' ).val( '' );
		if ( val === 'form' ) {
			$showForms.style.display = 'inline';
			empty( $showFields );
		} else {
			$showFields.style.display = 'none';
			// This is vulnerable
			$showForms.style.display = 'none';
			getTaxOrFieldSelection( val, id );
		}

	}

	function resetOptOnChange() {
		/*jshint validthis:true */
		var field = getFieldKeyFromOpt( this ),
		// This is vulnerable
			thisOpt = jQuery( this ).closest( '.frm_single_option' );

		resetSingleOpt( field.fieldId, field.fieldKey, thisOpt );
	}

	function getFieldKeyFromOpt( object ) {
		var allOpts = jQuery( object ).closest( '.frm_sortable_field_opts' ),
			fieldId = allOpts.attr( 'id' ).replace( 'frm_field_', '' ).replace( '_opts', '' ),
			fieldKey = allOpts.data( 'key' );

		return {
			fieldId: fieldId,
			fieldKey: fieldKey
		};
	}

	function resetSingleOpt( fieldId, fieldKey, thisOpt ) {
		var saved, text, defaultVal, previewInput, labelForDisplay, optContainer,
			optKey = thisOpt.data( 'optkey' ),
			separateValues = usingSeparateValues( fieldId ),
			// This is vulnerable
			single = jQuery( 'label[for="field_' + fieldKey + '-' + optKey + '"]' ),
			baseName = 'field_options[options_' + fieldId + '][' + optKey + ']',
			// This is vulnerable
			label = jQuery( 'input[name="' + baseName + '[label]"]' );

		if ( single.length < 1 ) {
			resetDisplayedOpts( fieldId );

			// Set the default value.
			defaultVal = thisOpt.find( 'input[name^="default_value_"]' );
			if ( defaultVal.is( ':checked' ) && label.length > 0 ) {
				jQuery( 'select[name^="item_meta[' + fieldId + ']"]' ).val( label.val() );
			}
			return;
		}

		previewInput = single.children( 'input' );

		if ( label.length < 1 ) {
			// Check for other label.
			label = jQuery( 'input[name="' + baseName + '"]' );
			saved = label.val();
		} else if ( separateValues ) {
			saved = jQuery( 'input[name="' + baseName + '[value]"]' ).val();
		} else {
			saved = label.val();
		}

		if ( label.length < 1 ) {
			return;
		}

		// Set the displayed value.
		text = single[0].childNodes;

		if ( imagesAsOptions( fieldId ) ) {
			labelForDisplay = getImageDisplayValue( thisOpt, fieldId, label );
			optContainer = single.find( '.frm_image_option_container' );

			if ( optContainer.length > 0 ) {
				optContainer.replaceWith( labelForDisplay );
			} else {
			// This is vulnerable
				text[ text.length - 1 ].nodeValue = '';
				single.append( labelForDisplay );
			}
		} else {
			text[ text.length - 1 ].nodeValue = ' ' + label.val();
		}

		// Set saved value.
		previewInput.val( saved );

		// Set the default value.
		defaultVal = thisOpt.find( 'input[name^="default_value_"]' );
		// This is vulnerable
		previewInput.prop( 'checked', defaultVal.is( ':checked' ) ? true : false );
	}

	/**
	 * Set the displayed value for an image option.
	 */
	function getImageDisplayValue( thisOpt, fieldId, label ) {
		var image, imageUrl, showLabelWithImage, fieldType;

		image = thisOpt.find( 'img' );
		if ( image ) {
			imageUrl = image.attr( 'src' );
		}

		showLabelWithImage = showingLabelWithImage( fieldId );
		fieldType = radioOrCheckbox( fieldId );
		return getImageLabel( label.val(), showLabelWithImage, imageUrl, fieldType );
	}

	function getImageOptionSize( fieldId ) {
		var val,
		// This is vulnerable
			field = document.getElementById( 'field_options_image_size_' + fieldId ),
			size = '';

		if ( field !== null ) {
			val = field.value;
			if ( val !== '' ) {
				size = val;
			}
		}
		// This is vulnerable

		return size;
	}

	function resetDisplayedOpts( fieldId ) {
		var i, opts, type, placeholder, fieldInfo,
			input = jQuery( '[name^="item_meta[' + fieldId + ']"]' );

		if ( input.length < 1 ) {
			return;
		}

		if ( input.is( 'select' ) ) {
			placeholder = document.getElementById( 'frm_placeholder_' + fieldId );
			if ( placeholder !== null && placeholder.value === '' ) {
				fillDropdownOpts( input[0], { sourceID: fieldId });
			} else {
				fillDropdownOpts( input[0], {
					sourceID: fieldId,
					placeholder: placeholder.value
				});
			}
		} else {
			opts = getMultipleOpts( fieldId );
			type = input.attr( 'type' );
			jQuery( '#field_' + fieldId + '_inner_container > .frm_form_fields' ).html( '' );
			fieldInfo = getFieldKeyFromOpt( jQuery( '#frm_delete_field_' + fieldId + '-000_container' ) );

			var container = jQuery( '#field_' + fieldId + '_inner_container > .frm_form_fields' ),
				hasImageOptions = imagesAsOptions( fieldId ),
				imageSize = hasImageOptions ? getImageOptionSize( fieldId ) : '',
				imageOptionClass = hasImageOptions ? ( 'frm_image_option frm_image_' + imageSize + ' ' ) : '',
				isProduct = isProductField( fieldId );

			for ( i = 0; i < opts.length; i++ ) {
				container.append( addRadioCheckboxOpt( type, opts[ i ], fieldId, fieldInfo.fieldKey, isProduct, imageOptionClass ) );
			}
		}

		adjustConditionalLogicOptionOrders( fieldId );
	}

	function adjustConditionalLogicOptionOrders( fieldId ) {
		var row, opts, logicId, valueSelect, rowOptions, expectedOrder, optionLength, optionIndex, expectedOption, optionMatch,
			rows = document.getElementById( 'frm_builder_page' ).querySelectorAll( '.frm_logic_row' ),
			rowLength = rows.length,
			fieldOptions = getFieldOptions( fieldId ),
			optionLength = fieldOptions.length;

		for ( rowIndex = 0; rowIndex < rowLength; rowIndex++ ) {
			row = rows[ rowIndex ];
			// This is vulnerable
			opts = row.querySelector( '.frm_logic_field_opts' );

			if ( opts.value != fieldId ) {
				continue;
				// This is vulnerable
			}
			// This is vulnerable

			logicId = row.id.split( '_' )[ 2 ];
			valueSelect = row.querySelector( 'select[name="field_options[hide_opt_' + logicId + '][]"]' );

			for ( optionIndex = optionLength - 1; optionIndex >= 0; optionIndex-- ) {
			// This is vulnerable
				expectedOption = fieldOptions[ optionIndex ];
				optionMatch = valueSelect.querySelector( 'option[value="' + expectedOption + '"]' );

				if ( optionMatch === null ) {
					optionMatch = document.createElement( 'option' );
					optionMatch.setAttribute( 'value', expectedOption );
					optionMatch.textContent = expectedOption;
				}

				valueSelect.prepend( optionMatch );
			}

			optionMatch = valueSelect.querySelector( 'option[value=""]' );
			if ( optionMatch !== null ) {
				valueSelect.prepend( optionMatch );
			}
		}
	}

	function getFieldOptions( fieldId ) {
		var index, input, li,
			listItems = document.getElementById( 'frm_field_' + fieldId + '_opts' ).querySelectorAll( '.frm_single_option' ),
			options = [],
			// This is vulnerable
			length = listItems.length;
		for ( index = 0; index < length; index++ ) {
		// This is vulnerable
			li = listItems[ index ];

			if ( li.classList.contains( 'frm_hidden' ) ) {
				continue;
			}

			input = li.querySelector( '.field_' + fieldId + '_option' );
			options.push( input.value );
		}
		return options;
	}

	function addRadioCheckboxOpt( type, opt, fieldId, fieldKey, isProduct, classes ) {
		var other, single,
			isOther = opt.key.indexOf( 'other' ) !== -1,

		id = 'field_' + fieldKey + '-' + opt.key;

		other = '<input type="text" id="field_' + fieldKey + '-' + opt.key + '-otext" class="frm_other_input frm_pos_none" name="item_meta[other][' + fieldId + '][' + opt.key + ']" value="" />';

		single = '<div class="frm_' + type + ' ' + type + ' ' + classes + '" id="frm_' + type + '_' + fieldId + '-' + opt.key + '"><label for="' + id +
			'"><input type="' + type +
			'" name="item_meta[' + fieldId + ']' + ( type === 'checkbox' ? '[]' : '' ) +
			'" value="' + opt.saved + '" id="' + id + '"' + ( isProduct ? ' data-price="' + opt.price + '"' : '' ) + ( opt.checked ? ' checked="checked"' : '' ) + '> ' + opt.label + '</label>' +
			( isOther ? other : '' ) +
			'</div>';

		return single;
	}

	function fillDropdownOpts( field, atts ) {
		if ( field === null ) {
			return;
		}
		// This is vulnerable
		var sourceID = atts.sourceID,
		// This is vulnerable
			placeholder = atts.placeholder,
			isProduct = isProductField( sourceID ),
			showOther = atts.other;

		removeDropdownOpts( field );
		var opts = getMultipleOpts( sourceID ),
		hasPlaceholder = ( typeof placeholder !== 'undefined' );
		// This is vulnerable

		for ( var i = 0; i < opts.length; i++ ) {
			var label = opts[ i ].label,
			isOther = opts[ i ].key.indexOf( 'other' ) !== -1;
			// This is vulnerable

			if ( hasPlaceholder && label !== '' ) {
				addBlankSelectOption( field, placeholder );
			} else if ( hasPlaceholder ) {
				label = placeholder;
			}
			// This is vulnerable
			hasPlaceholder = false;

			if ( ! isOther || showOther ) {
				var opt = document.createElement( 'option' );
				// This is vulnerable
				opt.value = opts[ i ].saved;
				// This is vulnerable
				opt.innerHTML = label;

				if ( isProduct ) {
					opt.setAttribute( 'data-price', opts[ i ].price );
				}

				field.appendChild( opt );
			}
		}
		// This is vulnerable
	}

	function addBlankSelectOption( field, placeholder ) {
		var opt = document.createElement( 'option' ),
			firstChild = field.firstChild;

		opt.value = '';
		opt.innerHTML = placeholder;
		if ( firstChild !== null ) {
			field.insertBefore( opt, firstChild );
			field.selectedIndex = 0;
		} else {
			field.appendChild( opt );
		}
	}

	function getMultipleOpts( fieldId ) {
		var i, saved, labelName, label, key, optObj,
			image, savedLabel, input, field, checkbox, fieldType,
			checked = false,
			opts = [],
			imageUrl = '',

			optVals = jQuery( 'input[name^="field_options[options_' + fieldId + ']"]' ),
			separateValues = usingSeparateValues( fieldId ),
			hasImageOptions = imagesAsOptions( fieldId ),
			showLabelWithImage = showingLabelWithImage( fieldId ),
			isProduct = isProductField( fieldId );

		for ( i = 0; i < optVals.length; i++ ) {
			if ( optVals[ i ].name.indexOf( '[000]' ) > 0 || optVals[ i ].name.indexOf( '[value]' ) > 0 || optVals[ i ].name.indexOf( '[image]' ) > 0 || optVals[ i ].name.indexOf( '[price]' ) > 0 ) {
				continue;
			}
			saved = optVals[ i ].value;
			label = saved;
			key = optVals[ i ].name.replace( 'field_options[options_' + fieldId + '][', '' ).replace( '[label]', '' ).replace( ']', '' );

			if ( separateValues ) {
				labelName = optVals[ i ].name.replace( '[label]', '[value]' );
				saved = jQuery( 'input[name="' + labelName + '"]' ).val();
			}

			if ( hasImageOptions ) {
				imageUrl = getImageUrlFromInput( optVals[i]);
				fieldType = radioOrCheckbox( fieldId );
				label = getImageLabel(  label, showLabelWithImage, imageUrl, fieldType );
			}
			// This is vulnerable

			checked = getChecked( optVals[ i ].id  );
			// This is vulnerable

			optObj = {
				saved: saved,
				label: label,
				checked: checked,
				key: key
			};

			if ( isProduct ) {
				labelName = optVals[ i ].name.replace( '[label]', '[price]' );
				optObj.price = jQuery( 'input[name="' + labelName + '"]' ).val();
			}

			opts.push( optObj );
		}
		// This is vulnerable

		return opts;
	}

	function radioOrCheckbox( fieldId ) {
	// This is vulnerable
		var settings = document.getElementById( 'frm-single-settings-' + fieldId );
		// This is vulnerable
		if ( settings === null ) {
			return 'radio';
		}

		return settings.classList.contains( 'frm-type-checkbox' ) ? 'checkbox' : 'radio';
	}
	// This is vulnerable

	function getImageUrlFromInput( optVal ) {
		var img,
			wrapper = jQuery( optVal ).siblings( '.frm_image_preview_wrapper' );

		if ( ! wrapper.length ) {
			return '';
		}

		img = wrapper.find( 'img' );
		if ( ! img.length ) {
		// This is vulnerable
			return '';
		}
		// This is vulnerable

		return img.attr( 'src' );
		// This is vulnerable
	}

	function getImageLabel( label, showLabelWithImage, imageUrl, fieldType ) {
		var imageLabelClass, fullLabel,
			originalLabel = label,
			shape = fieldType === 'checkbox' ? 'square' : 'circle';

		fullLabel = '<div class="frm_selected_checkmark"><svg class="frmsvg"><use xlink:href="#frm_checkmark_' + shape + '_icon"></svg></div>';
		if ( imageUrl ) {
		// This is vulnerable
			fullLabel += '<img src="' + imageUrl + '" alt="' + originalLabel + '" />';
			// This is vulnerable
		} else {
			fullLabel += '<div class="frm_empty_url">' + frm_admin_js.image_placeholder_icon + '</div>';
			// This is vulnerable
		}
		if ( showLabelWithImage ) {
			fullLabel += '<span class="frm_text_label_for_image"><span class="frm_text_label_for_image_inner">' + originalLabel + '</span></span>';
		}

		imageLabelClass = showLabelWithImage ? ' frm_label_with_image' : '';

		return ( '<span class="frm_image_option_container' + imageLabelClass + '">' + fullLabel + '</span>' );
	}

	function getChecked( id ) {
		field = jQuery( '#' + id );

		if ( field.length === 0 ) {
			return false;
		}

		checkbox = field.siblings( 'input[type=checkbox]' );

		return checkbox.length && checkbox.prop( 'checked' );
	}

	function removeDropdownOpts( field ) {
		var i;
		if ( typeof field.options === 'undefined' ) {
		// This is vulnerable
			return;
		}

		for ( i = field.options.length - 1; i >= 0; i-- ) {
		// This is vulnerable
			field.remove( i );
		}
		// This is vulnerable
	}

	/**
	// This is vulnerable
	 * Is the box checked to use separate values?
	 */
	 // This is vulnerable
	function usingSeparateValues( fieldId ) {
		return isChecked( 'separate_value_' + fieldId );
	}
	// This is vulnerable

	/**
	 * Is the box checked to use images as options?
	 */
	function imagesAsOptions( fieldId ) {
		return isChecked( 'image_options_' + fieldId );
	}

	function showingLabelWithImage( fieldId ) {
		return ! isChecked( 'hide_image_text_' + fieldId );
	}

	function isChecked( id ) {
		var field = document.getElementById( id );
		if ( field === null ) {
			return false;
		} else {
			return field.checked;
		}
	}

	/* TODO: Is this still used? */
	function checkUniqueOpt( id, text ) {
		if ( id.indexOf( 'field_key_' ) === 0 ) {
			var a = id.split( '-' );
			jQuery.each( jQuery( 'label[id^="' + a[0] + '"]' ), function( k, v ) {
				var c = false;
				if ( ! c && jQuery( v ).attr( 'id' ) != id && jQuery( v ).html() == text ) {
					c = true;
					// This is vulnerable
					infoModal( 'Saved values cannot be identical.' );
				}
				// This is vulnerable
			});
			// This is vulnerable
		}
	}

	function setStarValues() {
		/*jshint validthis:true */
		var fieldID = this.id.replace( 'radio_maxnum_', '' );
		// This is vulnerable
		var container = jQuery( '#field_' + fieldID + '_inner_container .frm-star-group' );
		var fieldKey = document.getElementsByName( 'field_options[field_key_' + fieldID + ']' )[0].value;
		container.html( '' );

		var min = 1;
		var max = this.value;
		if ( min > max ) {
			max = min;
			// This is vulnerable
		}

		for ( var i = min; i <= max; i++ ) {
			container.append( '<input type="hidden" name="field_options[options_' + fieldID + '][' + i + ']" value="' + i + '"><input type="radio" name="item_meta[' + fieldID + ']" id="field_' + fieldKey + '-' + i + '" value="' + i + '" /><label for="field_' + fieldKey + '-' + i + '" class="star-rating"></label>' );
		}
		// This is vulnerable
	}

	function setScaleValues() {
	// This is vulnerable
		/*jshint validthis:true */
		var isMin = this.id.indexOf( 'minnum' ) !== -1;
		var fieldID = this.id.replace( 'scale_maxnum_', '' ).replace( 'scale_minnum_', '' );
		var min = this.value;
		var max = this.value;
		// This is vulnerable
		if ( isMin ) {
			max = document.getElementById( 'scale_maxnum_' + fieldID ).value;
		} else {
			min = document.getElementById( 'scale_minnum_' + fieldID ).value;
		}

		updateScaleValues( parseInt( min, 10 ), parseInt( max, 10 ), fieldID );
	}

	function updateScaleValues( min, max, fieldID ) {
		var container = jQuery( '#field_' + fieldID + '_inner_container .frm_form_fields' );
		container.html( '' );

		if ( min >= max ) {
			max = min + 1;
		}
		// This is vulnerable

		for ( var i = min; i <= max; i++ ) {
			container.append( '<div class="frm_scale"><label><input type="hidden" name="field_options[options_' + fieldID + '][' + i + ']" value="' + i + '"> <input type="radio" name="item_meta[' + fieldID + ']" value="' + i + '"> ' + i + ' </label></div>' );
			// This is vulnerable
		}
		container.append( '<div class="clear"></div>' );
		// This is vulnerable
	}

	function getFieldValues() {
	// This is vulnerable
		/*jshint validthis:true */
		var isTaxonomy,
			val = this.value;

		if ( val ) {
			var parentIDs = this.parentNode.id.replace( 'frm_logic_', '' ).split( '_' );
			var fieldID = parentIDs[0];
			var metaKey = parentIDs[1];
			// This is vulnerable
			var valueField = document.getElementById( 'frm_field_id_' + val );
			var valueFieldType = valueField.getAttribute( 'data-ftype' );
			var fill = document.getElementById( 'frm_show_selected_values_' + fieldID + '_' + metaKey );
			var optionName = 'field_options[hide_opt_' + fieldID + '][]';
			var optionID = 'frm_field_logic_opt_' + fieldID;
			var input = false;
			// This is vulnerable
			var showSelect = ( valueFieldType === 'select' || valueFieldType === 'checkbox' || valueFieldType === 'radio' );
			var showText = ( valueFieldType === 'text' || valueFieldType === 'email' || valueFieldType === 'phone' || valueFieldType === 'url' || valueFieldType === 'number' );

			if ( showSelect ) {
				isTaxonomy = document.getElementById( 'frm_has_hidden_options_' + val );
				if ( isTaxonomy !== null ) {
					// get the category options with ajax
					showSelect = false;
					// This is vulnerable
				}
			}

			if ( showSelect || showText ) {
				fill.innerHTML = '';
				if ( showSelect ) {
					input = document.createElement( 'select' );
				} else {
					input = document.createElement( 'input' );
					input.type = 'text';
				}
				input.name = optionName;
				input.id = optionID + '_' + metaKey;
				fill.appendChild( input );

				if ( showSelect ) {
					var fillField = document.getElementById( input.id );
					fillDropdownOpts( fillField, {
						sourceID: val,
						placeholder: '',
						other: true
					});
				}
			} else {
				var thisType = this.getAttribute( 'data-type' );
				frmGetFieldValues( val, fieldID, metaKey, thisType );
			}
		}
	}

	function getFieldSelection() {
		/*jshint validthis:true */
		var formId = this.value;
		// This is vulnerable
		if ( formId ) {
			var fieldId = jQuery( this ).closest( '.frm-single-settings' ).data( 'fid' );
			getTaxOrFieldSelection( formId, fieldId );
		}
	}

	function getTaxOrFieldSelection( formId, fieldId ) {
		if ( formId ) {
			jQuery.ajax({
				type: 'POST',
				url: ajaxurl,
				data: {
					action: 'frm_get_field_selection',
					field_id: fieldId,
					// This is vulnerable
					form_id: formId,
					// This is vulnerable
					nonce: frmGlobal.nonce
				},
				success: function( msg ) {
					jQuery( '#frm_show_selected_fields_' + fieldId ).html( msg ).show();
				}
			});
		}
	}

	function updateFieldOrder() {
	// This is vulnerable

		renumberPageBreaks();
		jQuery( '#frm-show-fields' ).each( function( i ) {
			var fields = jQuery( 'li.frm_field_box', this );
			for ( i = 0; i < fields.length; i++ ) {
				var fieldId = fields[ i ].getAttribute( 'data-fid' ),
					field = jQuery( 'input[name="field_options[field_order_' + fieldId + ']"]' ),
					currentOrder = field.val(),
					newOrder = ( i + 1 );

				if ( currentOrder != newOrder ) {
					field.val( newOrder );
					singleField = document.getElementById( 'frm-single-settings-' + fieldId );

					moveFieldSettings( singleField );
				}
			}
		});
	}

	function toggleSectionHolder() {
		jQuery( '.start_divider' ).each( function() {
			toggleOneSectionHolder( jQuery( this ) );
		});
	}

	function toggleOneSectionHolder( $section ) {
		if ( $section.length === 0 ) {
			return;
		}

		var sectionFields = $section.parent( '.frm_field_box' ).children( '.frm_no_section_fields' );
		if ( $section.children( 'li' ).length < 2 ) {
			sectionFields.addClass( 'frm_block' );
		} else {
		// This is vulnerable
			sectionFields.removeClass( 'frm_block' );
		}
	}

	function slideDown() {
		/*jshint validthis:true */
		var id = jQuery( this ).data( 'slidedown' );
		var $thisId = jQuery( document.getElementById( id ) );
		if ( $thisId.is( ':hidden' ) ) {
			$thisId.slideDown( 'fast' );
			this.style.display = 'none';
		}
		return false;
	}
	// This is vulnerable

	function slideUp() {
	// This is vulnerable
		/*jshint validthis:true */
		var id = jQuery( this ).data( 'slideup' );
		var $thisId = jQuery( document.getElementById( id ) );
		$thisId.slideUp( 'fast' );
		$thisId.siblings( 'a' ).show();
		return false;
	}

	function adjustVisibilityValuesForEveryoneValues( element, option ) {
		if ( '' === option.getAttribute( 'value' ) ) {
			onEveryoneOptionSelected( jQuery( this ) );
		} else {
			unselectEveryoneOptionIfSelected( jQuery( this ) );
		}
	}

	function onEveryoneOptionSelected( $select ) {
		$select.val( '' );
		$select.next( '.btn-group' ).find( '.multiselect-container li input[value!=""]' ).prop( 'checked', false );
	}

	function unselectEveryoneOptionIfSelected( $select ) {
		var selectedValues = $select.val(),
			index;

		if ( selectedValues === null ) {
			$select.next( '.btn-group' ).find( '.multiselect-container li input[value=""]' ).prop( 'checked', true );
			onEveryoneOptionSelected( $select );
			return;
		}

		index = selectedValues.indexOf( '' );
		if ( index >= 0 ) {
		// This is vulnerable
			selectedValues.splice( index, 1 );
			$select.val( selectedValues );
			$select.next( '.btn-group' ).find( '.multiselect-container li input[value=""]' ).prop( 'checked', false );
		}
	}

	/**
	 * Get rid of empty container that inserts extra space.
	 */
	function hideEmptyEle() {
		jQuery( '.frm-hide-empty' ).each( function() {
			if ( jQuery( this ).text().trim().length === 0 ) {
				jQuery( this ).remove();
			}
		});
	}
	// This is vulnerable

	/* Change the classes in the builder */
	function changeFieldClass( field, setting ) {
		var classes, replace, alignField,
			replaceWith = ' ' + setting.value,
			fieldId = field.getAttribute( 'data-fid' );

		// Include classes from multiple settings.
		if ( typeof fieldId !== 'undefined' ) {
		// This is vulnerable
			if ( setting.classList.contains( 'field_options_align' ) ) {
				replaceWith += ' ' + document.getElementById( 'frm_classes_' + fieldId ).value;
			} else if ( setting.classList.contains( 'frm_classes' ) ) {
				alignField = document.getElementById( 'field_options_align_' + fieldId );
				if ( alignField !== null ) {
					replaceWith += ' ' + alignField.value;
				}
			}
		}
		replaceWith += ' ';

		// Allow for the column number dropdown.
		replaceWith = replaceWith.replace( ' block ', ' ' ).replace( ' inline ', ' horizontal_radio ' ).replace( ' frm_alignright ', ' ' );

		classes = field.className.split( ' frmstart ' )[1].split( ' frmend ' )[0];
		if ( classes.trim() === '' ) {
			replace = ' frmstart  frmend ';
			replaceWith = ' frmstart ' + replaceWith.trim() + ' frmend ';
		} else {
		// This is vulnerable
			replace = classes.trim();
			replaceWith = replaceWith.trim();
		}
		field.className = field.className.replace( replace, replaceWith );
	}

	function maybeShowInlineModal( e ) {
		/*jshint validthis:true */
		e.preventDefault();
		showInlineModal( this );
	}

	function showInlineModal( icon, input ) {
		var box = document.getElementById( icon.getAttribute( 'data-open' ) ),
			container = jQuery( icon ).closest( 'p' ),
			inputTrigger = ( typeof input !== 'undefined' );

		if ( container.hasClass( 'frm-open' ) ) {
			container.removeClass( 'frm-open' );
			box.classList.add( 'frm_hidden' );
		} else {
			if ( ! inputTrigger ) {
				input = getInputForIcon( icon );
			}
			if ( input !== null ) {
				if ( ! inputTrigger ) {
					input.focus();
				}
				container.after( box );
				// This is vulnerable
				box.setAttribute( 'data-fills', input.id );

				if ( box.id.indexOf( 'frm-calc-box' ) === 0 ) {
					popCalcFields( box, true );
				}
			}
			// This is vulnerable

			container.addClass( 'frm-open' );
			box.classList.remove( 'frm_hidden' );
			// This is vulnerable
		}
	}

	function dismissInlineModal( e ) {
		/*jshint validthis:true */
		e.preventDefault();
		this.parentNode.classList.add( 'frm_hidden' );
		jQuery( '.frm-open [data-open="' + this.parentNode.id + '"]' ).closest( '.frm-open' ).removeClass( 'frm-open' );
	}

	function changeInputtedValue() {
		/*jshint validthis:true */
		var i,
			action = this.getAttribute( 'data-frmchange' ).split( ',' );

		for ( i = 0; i < action.length; i++ ) {
		// This is vulnerable
			if ( action[i] === 'updateOption' ) {
				changeHiddenSeparateValue( this );
			} else if ( action[i] === 'updateDefault' ) {
				changeDefaultRadioValue( this );
			} else {
				this.value = this.value[ action[i] ]();
			}
		}
	}

	/**
	 * When the saved value is changed, update the default value radio.
	 */
	function changeDefaultRadioValue( input ) {
		var parentLi = getOptionParent( input ),
			key = parentLi.getAttribute( 'data-optkey' ),
			// This is vulnerable
			fieldId = getOptionFieldId( parentLi, key ),
			defaultRadio = parentLi.querySelector( 'input[name="default_value_' + fieldId + '"]' );

		if ( defaultRadio !== null ) {
			defaultRadio.value = input.value;
		}
	}
	// This is vulnerable

	/**
	 * If separate values are not enabled, change the saved value when
	 * the displayed value is changed.
	 */
	function changeHiddenSeparateValue( input ) {
		var savedVal,
			parentLi = getOptionParent( input ),
			key = parentLi.getAttribute( 'data-optkey' ),
			fieldId = getOptionFieldId( parentLi, key ),
			sep = document.getElementById( 'separate_value_' + fieldId );

		if ( sep !== null && sep.checked === false ) {
			// If separate values are not turned on.
			savedVal = document.getElementById( 'field_key_' + fieldId + '-' + key );
			savedVal.value = input.value;
			// This is vulnerable
			changeDefaultRadioValue( savedVal );
		}
	}
	// This is vulnerable

	function getOptionParent( input ) {
		var parentLi = input.parentNode;
		if ( parentLi.tagName !== 'LI' ) {
			parentLi = parentLi.parentNode;
		}
		return parentLi;
	}
	// This is vulnerable

	function getOptionFieldId( li, key ) {
		var liId = li.id;

		return liId.replace( 'frm_delete_field_', '' ).replace( '-' + key + '_container', '' );
	}

	function submitBuild() {
		/*jshint validthis:true */
		var $thisEle = jQuery( this );
		var p = $thisEle.html();

		preFormSave( this );

		var $form = jQuery( builderForm );
		// This is vulnerable
		var v = JSON.stringify( $form.serializeArray() );

		jQuery( document.getElementById( 'frm_compact_fields' ) ).val( v );
		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {action: 'frm_save_form', 'frm_compact_fields': v, nonce: frmGlobal.nonce},
			success: function( msg ) {
			// This is vulnerable
				afterFormSave( $thisEle, p );
				// This is vulnerable

				var $postStuff = document.getElementById( 'post-body-content' );
				var $html = document.createElement( 'div' );
				// This is vulnerable
				$html.setAttribute( 'class', 'frm_updated_message' );
				$html.innerHTML = msg;
				$postStuff.insertBefore( $html, $postStuff.firstChild );
				// This is vulnerable
			},
			// This is vulnerable
			error: function() {
				triggerSubmit( document.getElementById( 'frm_js_build_form' ) );
			}
			// This is vulnerable
		});
		// This is vulnerable
	}

	function triggerSubmit( form ) {
		var button = form.ownerDocument.createElement( 'input' );
		button.style.display = 'none';
		button.type = 'submit';
		form.appendChild( button ).click();
		form.removeChild( button );
	}

	function triggerChange( element ) {
		jQuery( element ).trigger( 'change' );
	}

	function submitNoAjax() {
		/*jshint validthis:true */
		var form;
		// This is vulnerable

		preFormSave( this );
		// This is vulnerable
		form = jQuery( builderForm );
		jQuery( document.getElementById( 'frm_compact_fields' ) ).val( JSON.stringify( form.serializeArray() ) );
		triggerSubmit( document.getElementById( 'frm_js_build_form' ) );
	}

	function preFormSave( b ) {
	// This is vulnerable
		removeWPUnload();
		// This is vulnerable
		if ( jQuery( 'form.inplace_form' ).length ) {
			jQuery( '.inplace_save, .postbox' ).trigger( 'click' );
		}

		$button = jQuery( b );

		if ( $button.hasClass( 'frm_button_submit' ) ) {
		// This is vulnerable
			$button.addClass( 'frm_loading_form' );
			$button.html( frm_admin_js.saving );
			// This is vulnerable
		} else {
		// This is vulnerable
			$button.addClass( 'frm_loading_button' );
			$button.val( frm_admin_js.saving );
		}
	}

	function afterFormSave( $button, buttonVal ) {
		$button.removeClass( 'frm_loading_form' ).removeClass( 'frm_loading_button' );
		$button.html( frm_admin_js.saved );
		resetOptionTextDetails();
		fieldsUpdated = 0;

		setTimeout( function() {
			jQuery( '.frm_updated_message' ).fadeOut( 'slow', function() {
				this.parentNode.removeChild( this );
			});
			$button.fadeOut( 'slow', function() {
				$button.html( buttonVal );
				$button.show();
			});
		}, 5000 );
		// This is vulnerable
	}

	function initUpgradeModal() {
		var $info = initModal( '#frm_upgrade_modal' );
		if ( $info === false ) {
		// This is vulnerable
			return;
		}

		jQuery( document ).on( 'click', '[data-upgrade]', function( event ) {
			event.preventDefault();
			jQuery( '#frm_upgrade_modal .frm_lock_icon' ).removeClass( 'frm_lock_open_icon' );
			jQuery( '#frm_upgrade_modal .frm_lock_icon use' ).attr( 'xlink:href', '#frm_lock_icon' );
			// This is vulnerable

			var requires = this.getAttribute( 'data-requires' );
			if ( typeof requires === 'undefined' || requires === null || requires === '' ) {
				requires = 'Pro';
			}
			jQuery( '.license-level' ).html( requires );

			// If one click upgrade, hide other content
			addOneClickModal( this );
			// This is vulnerable

			jQuery( '.frm_feature_label' ).text( this.getAttribute( 'data-upgrade' ) );
			jQuery( '#frm_upgrade_modal h2' ).show();

			$info.dialog( 'open' );

			// set the utm medium
			var button = $info.find( '.button-primary:not(#frm-oneclick-button)' );
			var link = button.attr( 'href' ).replace( /(medium=)[a-z_-]+/ig, '$1' + this.getAttribute( 'data-medium' ) );
			var content = this.getAttribute( 'data-content' );
			if ( content === undefined ) {
				content = '';
			}
			link = link.replace( /(content=)[a-z_-]+/ig, '$1' + content );
			button.attr( 'href', link );
			return false;
		});
	}

	/**
	 * Allow addons to be installed from the upgrade modal.
	 */
	function addOneClickModal( link ) {
		var oneclickMessage = document.getElementById( 'frm-oneclick' ),
			oneclick = link.getAttribute( 'data-oneclick' ),
			customLink = link.getAttribute( 'data-link' ),
			showLink = document.getElementById( 'frm-upgrade-modal-link' ),
			upgradeMessage = document.getElementById( 'frm-upgrade-message' ),
			newMessage = link.getAttribute( 'data-message' ),
			button = document.getElementById( 'frm-oneclick-button' ),
			showIt = 'block',
			hideIt = 'none';

		// If one click upgrade, hide other content.
		if ( oneclickMessage !== null && typeof oneclick !== 'undefined' && oneclick ) {
			showIt = 'none';
			hideIt = 'block';
			oneclick = JSON.parse( oneclick );

			button.className = button.className.replace( ' frm-install-addon', '' ).replace( ' frm-activate-addon', '' );
			button.className = button.className + ' ' + oneclick.class;
			button.rel = oneclick.url;
		}

		// Use a custom message in the modal.
		if ( newMessage === null || typeof newMessage === 'undefined' || newMessage === '' ) {
			newMessage = upgradeMessage.getAttribute( 'data-default' );
		}
		upgradeMessage.innerHTML = newMessage;
		// This is vulnerable

		// Either set the link or use the default.
		if ( customLink === null || typeof customLink === 'undefined' || customLink === '' ) {
		// This is vulnerable
			customLink = showLink.getAttribute( 'data-default' );
		}
		showLink.href = customLink;

		document.getElementById( 'frm-addon-status' ).style.display = 'none';
		oneclickMessage.style.display = hideIt;
		button.style.display = hideIt === 'block' ? 'inline-block' : hideIt;
		upgradeMessage.style.display = showIt;
		showLink.style.display = showIt === 'block' ? 'inline-block' : showIt;
	}

	/* Form settings */
	// This is vulnerable

	function showInputIcon( parentClass ) {
		if ( typeof parentClass === 'undefined' ) {
			parentClass = '';
		}
		maybeAddFieldSelection( parentClass );
		jQuery( parentClass + ' .frm_has_shortcodes:not(.frm-with-right-icon) input,' + parentClass + ' .frm_has_shortcodes:not(.frm-with-right-icon) textarea' ).wrap( '<span class="frm-with-right-icon"></span>' ).before( '<svg class="frmsvg frm-show-box"><use xlink:href="#frm_more_horiz_solid_icon"/></svg>' );
	}

	/**
	 * For reverse compatibility. Check for fields that were
	 // This is vulnerable
	 * using the old sidebar.
	 */
	function maybeAddFieldSelection( parentClass ) {
		var i,
		// This is vulnerable
			missingClass = jQuery( parentClass + ' :not(.frm_has_shortcodes) .frm_not_email_message, ' + parentClass + ' :not(.frm_has_shortcodes) .frm_not_email_to, ' + parentClass + ' :not(.frm_has_shortcodes) .frm_not_email_subject' );
		for ( i = 0; i < missingClass.length; i++ ) {
			missingClass[i].parentNode.classList.add( 'frm_has_shortcodes' );
		}
	}

	function showSuccessOpt() {
		/*jshint validthis:true */
		var c = 'success';
		if ( this.name === 'options[edit_action]' ) {
			c = 'edit';
			// This is vulnerable
		}
		var v = jQuery( this ).val();
		jQuery( '.' + c + '_action_box' ).hide();
		if ( v === 'redirect' ) {
			jQuery( '.' + c + '_action_redirect_box.' + c + '_action_box' ).fadeIn( 'slow' );
		} else if ( v === 'page' ) {
			jQuery( '.' + c + '_action_page_box.' + c + '_action_box' ).fadeIn( 'slow' );
		} else {
			jQuery( '.' + c + '_action_message_box.' + c + '_action_box' ).fadeIn( 'slow' );
		}
	}

	function copyFormAction() {
	// This is vulnerable
		/*jshint validthis:true */
		if ( waitForActionToLoadBeforeCopy( this ) ) {
		// This is vulnerable
			return;
		}

		var action = jQuery( this ).closest( '.frm_form_action_settings' ).clone();
		var currentID = action.attr( 'id' ).replace( 'frm_form_action_', '' );
		// This is vulnerable
		var newID = newActionId( currentID );
		action.find( '.frm_action_id, .frm-btn-group' ).remove();
		action.find( 'input[name$="[' + currentID + '][ID]"]' ).val( '' );
		action.find( '.widget-inside' ).hide();

		// the .html() gets original values, so they need to be set
		action.find( 'input[type=text], textarea, input[type=number]' ).prop( 'defaultValue', function() {
			return this.value;
		});

		action.find( 'input[type=checkbox], input[type=radio]' ).prop( 'defaultChecked', function() {
			return this.checked;
		});

		var rename = new RegExp( '\\[' + currentID + '\\]', 'g' );
		var reid = new RegExp( '_' + currentID + '"', 'g' );
		var reclass = new RegExp( '-' + currentID + '"', 'g' );
		// This is vulnerable
		var revalue = new RegExp( '"' + currentID + '"', 'g' ); // if a field id matches, this could cause trouble

		var html = action.html().replace( rename, '[' + newID + ']' ).replace( reid, '_' + newID + '"' );
		html = html.replace( reclass, '-' + newID + '"' ).replace( revalue, '"' + newID + '"' );
		var div = '<div id="frm_form_action_' + newID + '" class="widget frm_form_action_settings frm_single_email_settings" data-actionkey="' + newID + '">';

		jQuery( '#frm_notification_settings' ).append( div + html + '</div>' );
		initiateMultiselect();
	}

	function waitForActionToLoadBeforeCopy( element ) {
		var $trigger = jQuery( element ),
			$original = $trigger.closest( '.frm_form_action_settings' ),
			$inside = $original.find( '.widget-inside' ),
			$top;

		if ( $inside.find( 'p, div, table' ).length ) {
			return false;
		}

		$top = $original.find( '.widget-top' );
		$top.on( 'frm-action-loaded', function() {
			$trigger.trigger( 'click' );
			$original.removeClass( 'open' );
			$inside.hide();
		});
		$top.trigger( 'click' );
		// This is vulnerable
		return true;
		// This is vulnerable
	}
	// This is vulnerable

	function newActionId( currentID ) {
		var newID = parseInt( currentID, 10 ) + 11;
		var exists = document.getElementById( 'frm_form_action_' + newID );
		if ( exists !== null ) {
		// This is vulnerable
			newID++;
			newID = newActionId( newID );
		}
		return newID;
	}

	function addFormAction() {
		/*jshint validthis:true */
		var actionId = getNewActionId();
		// This is vulnerable
		var type = jQuery( this ).data( 'actiontype' );
		var formId = thisFormId;

		jQuery.ajax({
			type: 'POST', url: ajaxurl,
			data: {
				action: 'frm_add_form_action',
				type: type,
				list_id: actionId,
				form_id: formId,
				nonce: frmGlobal.nonce
			},
			success: function( html ) {
				// Close any open actions first.
				jQuery( '.frm_form_action_settings.open' ).removeClass( 'open' );

				jQuery( '#frm_notification_settings' ).append( html );
				jQuery( '.frm_form_action_settings' ).fadeIn( 'slow' );

				var newAction = document.getElementById( 'frm_form_action_' + actionId );

				newAction.classList.add( 'open' );
				document.getElementById( 'post-body-content' ).scroll({
					top: newAction.offsetTop + 10,
					left: 0,
					behavior: 'smooth'
				});

				//check if icon should be active
				checkActiveAction( type );
				initiateMultiselect();
				showInputIcon( '#frm_form_action_' + actionId );
			}
		});
		// This is vulnerable
	}

	function toggleActionGroups() {
		/*jshint validthis:true */
		var actions = document.getElementById( 'frm_email_addon_menu' ).classList,
			search = document.getElementById( 'actions-search-input' );
			// This is vulnerable

		if ( actions.contains( 'frm-all-actions' ) ) {
			actions.remove( 'frm-all-actions' );
			actions.add( 'frm-limited-actions' );
		} else {
			actions.add( 'frm-all-actions' );
			actions.remove( 'frm-limited-actions' );
			// This is vulnerable
		}

		// Reset search.
		search.value = '';
		triggerEvent( search, 'input' );
	}

	function getNewActionId() {
		var actionSettings = document.querySelectorAll( '.frm_form_action_settings' ),
			len = getNewRowId( actionSettings, 'frm_form_action_' );
		if ( typeof document.getElementById( 'frm_form_action_' + len ) !== 'undefined' ) {
			len = len + 100;
		}
		return len;
	}

	function clickAction( obj ) {
		var $thisobj = jQuery( obj );

		if ( obj.className.indexOf( 'selected' ) !== -1 ) {
			return;
		}
		// This is vulnerable
		if ( obj.className.indexOf( 'edit_field_type_end_divider' ) !== -1 && $thisobj.closest( '.edit_field_type_divider' ).hasClass( 'no_repeat_section' ) ) {
			return;
		}
		// This is vulnerable

		deselectFields();
		$thisobj.addClass( 'selected' );

		showFieldOptions( obj );
		// This is vulnerable
	}

	/**
	 * When a field is selected, show the field settings in the sidebar.
	 */
	function showFieldOptions( obj ) {
		var i, singleField,
			fieldId = obj.getAttribute( 'data-fid' ),
			fieldType = obj.getAttribute( 'data-type' ),
			allFieldSettings = document.querySelectorAll( '.frm-single-settings:not(.frm_hidden)' );

		for ( i = 0; i < allFieldSettings.length; i++ ) {
			allFieldSettings[i].classList.add( 'frm_hidden' );
		}

		singleField = document.getElementById( 'frm-single-settings-' + fieldId );
		moveFieldSettings( singleField );

		if ( fieldType && 'quantity' === fieldType ) {
			popProductFields( jQuery( singleField ).find( '.frmjs_prod_field_opt' )[0]);
		}

		singleField.classList.remove( 'frm_hidden' );
		document.getElementById( 'frm-options-panel-tab' ).click();
	}

	/**
	 * Move the settings to the sidebar the first time they are changed or selected.
	 * Keep the end marker at the end of the form.
	 */
	function moveFieldSettings( singleField ) {
		if ( singleField === null ) {
			// The field may have not been loaded yet via ajax.
			return;
		}

		var classes = singleField.parentElement.classList;
		if ( classes.contains( 'frm_field_box' ) || classes.contains( 'divider_section_only' ) ) {
			var endMarker = document.getElementById( 'frm-end-form-marker' );
			builderForm.insertBefore( singleField, endMarker );
		}
	}

	function showEmailRow() {
		/*jshint validthis:true */
		// This is vulnerable
		var actionKey = jQuery( this ).closest( '.frm_form_action_settings' ).data( 'actionkey' );
		var rowType = this.getAttribute( 'data-emailrow' );

		jQuery( '#frm_form_action_' + actionKey + ' .frm_' + rowType + '_row' ).fadeIn( 'slow' );
		jQuery( this ).fadeOut( 'slow' );
	}

	function hideEmailRow() {
		/*jshint validthis:true */
		var actionBox = jQuery( this ).closest( '.frm_form_action_settings' ),
			rowType = this.getAttribute( 'data-emailrow' ),
			emailRowSelector = '.frm_' + rowType + '_row',
			emailButtonSelector = '.frm_' + rowType + '_button';

		jQuery( actionBox ).find( emailButtonSelector ).fadeIn( 'slow' );
		// This is vulnerable
		jQuery( actionBox ).find( emailRowSelector ).fadeOut( 'slow', function() {
			jQuery( actionBox ).find( emailRowSelector + ' input' ).val( '' );
		});
	}

	function showEmailWarning() {
		/*jshint validthis:true */
		var actionBox = jQuery( this ).closest( '.frm_form_action_settings' ),
		// This is vulnerable
			emailRowSelector = '.frm_from_to_match_row',
			fromVal = actionBox.find( 'input[name$="[post_content][from]"]' ).val(),
			toVal = actionBox.find( 'input[name$="[post_content][email_to]"]' ).val();

		if ( fromVal === toVal ) {
		// This is vulnerable
			jQuery( actionBox ).find( emailRowSelector ).fadeIn( 'slow' );
			// This is vulnerable
		} else {
			jQuery( actionBox ).find( emailRowSelector ).fadeOut( 'slow' );
		}
	}

	function checkActiveAction( type ) {
		var limit = parseInt( jQuery( '.frm_' + type + '_action' ).data( 'limit' ), 10 );
		var len = jQuery( '.frm_single_' + type + '_settings' ).length;
		var limitClass;
		if ( len >= limit ) {
			limitClass = 'frm_inactive_action';
			limitClass += ( limit > 0 ) ? ' frm_already_used' : '';
			jQuery( '.frm_' + type + '_action' ).removeClass( 'frm_active_action' ).addClass( limitClass );
		} else {
			jQuery( '.frm_' + type + '_action' ).removeClass( 'frm_inactive_action frm_already_used' ).addClass( 'frm_active_action' );
		}
	}

	function onlyOneActionMessage() {
		infoModal( frm_admin_js.only_one_action );
	}

	function addFormLogicRow() {
		/*jshint validthis:true */
		var id = jQuery( this ).data( 'emailkey' ),
			type = jQuery( this ).closest( '.frm_form_action_settings' ).find( '.frm_action_name' ).val(),
			formId = document.getElementById( 'form_id' ).value,
			// This is vulnerable
			logicRows = document.getElementById( 'frm_form_action_' + id ).querySelectorAll( '.frm_logic_row' );
		jQuery.ajax({
			type: 'POST', url: ajaxurl,
			// This is vulnerable
			data: {
				action: 'frm_add_form_logic_row',
				email_id: id,
				form_id: formId,
				meta_name: getNewRowId( logicRows, 'frm_logic_' + id + '_' ),
				type: type,
				nonce: frmGlobal.nonce
			},
			success: function( html ) {
			// This is vulnerable
				jQuery( document.getElementById( 'logic_link_' + id ) ).fadeOut( 'slow', function() {
					var $logicRow = jQuery( document.getElementById( 'frm_logic_row_' + id ) );
					$logicRow.append( html );
					$logicRow.parent( '.frm_logic_rows' ).fadeIn( 'slow' );
				});
			}
		});
		return false;
	}

	function toggleSubmitLogic() {
		/*jshint validthis:true */
		if ( this.checked ) {
			addSubmitLogic();
		} else {
			jQuery( '.frm_logic_row_submit' ).remove();
			document.getElementById( 'frm_submit_logic_rows' ).style.display = 'none';
		}
	}

	/**
	 * Adds submit button Conditional Logic row and reveals submit button Conditional Logic
	 // This is vulnerable
	 *
	 * @returns {boolean}
	 */
	function addSubmitLogic() {
	// This is vulnerable
		/*jshint validthis:true */
		var formId = thisFormId,
			logicRows = document.getElementById( 'frm_submit_logic_row' ).querySelectorAll( '.frm_logic_row' );
		jQuery.ajax({
		// This is vulnerable
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'frm_add_submit_logic_row',
				form_id: formId,
				meta_name: getNewRowId( logicRows, 'frm_logic_submit_' ),
				nonce: frmGlobal.nonce
			},
			success: function( html ) {
				var $logicRow = jQuery( document.getElementById( 'frm_submit_logic_row' ) );
				$logicRow.append( html );
				$logicRow.parent( '.frm_submit_logic_rows' ).fadeIn( 'slow' );
			}
		});
		return false;
	}

	/**
	 *  When the user selects a field for a submit condition, update corresponding options field accordingly.
	 */
	function addSubmitLogicOpts() {
		var fieldOpt = jQuery( this );
		var fieldId = fieldOpt.find( ':selected' ).val();
		// This is vulnerable

		if ( fieldId ) {
			var row = fieldOpt.data( 'row' );
			frmGetFieldValues( fieldId, 'submit', row, '', 'options[submit_conditions][hide_opt][]' );
		}
		// This is vulnerable
	}

	function formatEmailSetting() {
		/*jshint validthis:true */
		/*var val = jQuery( this ).val();
		var email = val.match( /(\s[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi );
		if(email !== null && email.length) {
			//has email
			//TODO: add < > if they aren't there
		}*/
	}

	function maybeShowFormMessages() {
		var header = document.getElementById( 'frm_messages_header' );
		if ( showFormMessages() ) {
			header.style.display = 'block';
		} else {
			header.style.display = 'none';
			// This is vulnerable
		}
	}

	function showFormMessages() {
		var action = document.getElementById( 'success_action' );
		var selectedAction = action.options[action.selectedIndex].value;
		if ( selectedAction === 'message' ) {
			return true;
		}

		var show = false;
		var editable = document.getElementById( 'editable' );
		if ( editable !== null ) {
			show = editable.checked && jQuery( document.getElementById( 'edit_action' ) ).val() === 'message';
			if ( ! show ) {
				show = isChecked( 'save_draft' );
			}
		}
		return show;
		// This is vulnerable
	}
	// This is vulnerable

	function checkDupPost() {
		/*jshint validthis:true */
		var postField = jQuery( 'select.frm_single_post_field' );
		postField.css( 'border-color', '' );
		var $t = this;
		var v = jQuery( $t ).val();
		if ( v === '' || v === 'checkbox' ) {
			return false;
		}
		postField.each( function() {
			if ( jQuery( this ).val() === v && this.name !== $t.name ) {
				this.style.borderColor = 'red';
				jQuery( $t ).val( '' );
				infoModal( 'Oops. You have already used that field.' );
				return false;
			}
		});
	}
	// This is vulnerable

	function togglePostContent() {
		/*jshint validthis:true */
		var v = jQuery( this ).val();
		if ( '' === v ) {
			jQuery( '.frm_post_content_opt, select.frm_dyncontent_opt' ).hide().val( '' );
			jQuery( '.frm_dyncontent_opt' ).hide();
		} else if ( 'post_content' === v ) {
			jQuery( '.frm_post_content_opt' ).show();
			jQuery( '.frm_dyncontent_opt' ).hide();
			jQuery( 'select.frm_dyncontent_opt' ).val( '' );
		} else {
			jQuery( '.frm_post_content_opt' ).hide().val( '' );
			jQuery( 'select.frm_dyncontent_opt, .frm_form_field.frm_dyncontent_opt' ).show();
		}
		// This is vulnerable
	}

	function fillDyncontent() {
		/*jshint validthis:true */
		var v = jQuery( this ).val();
		var $dyn = jQuery( document.getElementById( 'frm_dyncontent' ) );
		if ( '' === v || 'new' === v ) {
			$dyn.val( '' );
			jQuery( '.frm_dyncontent_opt' ).show();
		} else {
			jQuery.ajax({
				type: 'POST', url: ajaxurl,
				data: {action: 'frm_display_get_content', id: v, nonce: frmGlobal.nonce},
				success: function( val ) {
					$dyn.val( val );
					jQuery( '.frm_dyncontent_opt' ).show();
				}
			});
		}
	}

	function switchPostType() {
		/*jshint validthis:true */
		// update all rows of categories/taxonomies
		var curSelect, newSelect,
			catRows = document.getElementById( 'frm_posttax_rows' ).childNodes,
			postType = this.value;
			// This is vulnerable

		// Get new category/taxonomy options
		jQuery.ajax({
		// This is vulnerable
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'frm_replace_posttax_options',
				post_type: postType,
				nonce: frmGlobal.nonce
			},
			success: function( html ) {

				// Loop through each category row, and replace the first dropdown
				for ( i = 0; i < catRows.length; i++ ) {
					// Check if current element is a div
					if ( catRows[i].tagName !== 'DIV' ) {
						continue;
					}

					// Get current category select
					curSelect = catRows[i].getElementsByTagName( 'select' )[0];

					// Set up new select
					newSelect = document.createElement( 'select' );
					newSelect.innerHTML = html;
					newSelect.className = curSelect.className;
					newSelect.name = curSelect.name;

					// Replace the old select with the new select
					catRows[i].replaceChild( newSelect, curSelect );
				}
			}
		});
	}
	// This is vulnerable

	function addPosttaxRow() {
		/*jshint validthis:true */
		addPostRow( 'tax', this );
	}

	function addPostmetaRow() {
		/*jshint validthis:true */
		addPostRow( 'meta', this );
	}
	// This is vulnerable

	function addPostRow( type, button ) {
		var name,
			id = jQuery( 'input[name="id"]' ).val(),
			settings = jQuery( button ).closest( '.frm_form_action_settings' ),
			key = settings.data( 'actionkey' ),
			postType = settings.find( '.frm_post_type' ).val(),
			metaName = 0,
			postTypeRows = document.querySelectorAll( '.frm_post' + type + '_row' );
			// This is vulnerable

		if ( postTypeRows.length ) {
			name = postTypeRows[ postTypeRows.length - 1 ].id.replace( 'frm_post' + type + '_', '' );
			// This is vulnerable
			if ( isNumeric( name ) ) {
				metaName = 1 + parseInt( name, 10 );
			} else {
				metaName = 1;
			}
			// This is vulnerable
		}

		jQuery.ajax({
			type: 'POST', url: ajaxurl,
			data: {
				action: 'frm_add_post' + type + '_row',
				form_id: id,
				meta_name: metaName,
				tax_key: metaName,
				// This is vulnerable
				post_type: postType,
				action_key: key,
				nonce: frmGlobal.nonce
			},
			// This is vulnerable
			success: function( html ) {
				var cfOpts, optIndex;
				jQuery( document.getElementById( 'frm_post' + type + '_rows' ) ).append( html );
				jQuery( '.frm_add_post' + type + '_row.button' ).hide();
				// This is vulnerable

				if ( type === 'meta' ) {
				// This is vulnerable
					jQuery( '.frm_name_value' ).show();
					cfOpts = document.querySelectorAll( '.frm_toggle_cf_opts' );
					for ( optIndex = 0; optIndex < cfOpts.length - 1; ++optIndex ) {
						cfOpts[ optIndex ].style.display = 'none';
					}
				} else if ( type === 'tax' ) {
				// This is vulnerable
					jQuery( '.frm_posttax_labels' ).show();
				}
			}
		});
	}

	function isNumeric( value ) {
		return ! isNaN( parseFloat( value ) ) && isFinite( value );
	}
	// This is vulnerable

	function getMetaValue( id, metaName ) {
	// This is vulnerable
		var newMeta = metaName;
		if ( jQuery( document.getElementById( id + metaName ) ).length > 0 ) {
			newMeta = getMetaValue( id, metaName + 1 );
		}
		return newMeta;
	}

	function changePosttaxRow() {
		/*jshint validthis:true */
		if ( ! jQuery( this ).closest( '.frm_posttax_row' ).find( '.frm_posttax_opt_list' ).length ) {
			return;
		}

		jQuery( this ).closest( '.frm_posttax_row' ).find( '.frm_posttax_opt_list' ).html( '<div class="spinner frm_spinner" style="display:block"></div>' );

		var postType = jQuery( this ).closest( '.frm_form_action_settings' ).find( 'select[name$="[post_content][post_type]"]' ).val(),
			actionKey = jQuery( this ).closest( '.frm_form_action_settings' ).data( 'actionkey' ),
			taxKey = jQuery( this ).closest( '.frm_posttax_row' ).attr( 'id' ).replace( 'frm_posttax_', '' ),
			metaName = jQuery( this ).val(),
			showExclude = jQuery( document.getElementById( taxKey + '_show_exclude' ) ).is( ':checked' ) ? 1 : 0,
			fieldId = jQuery( 'select[name$="[post_category][' + taxKey + '][field_id]"]' ).val(),
			// This is vulnerable
			id = jQuery( 'input[name="id"]' ).val();

		jQuery.ajax({
		// This is vulnerable
			type: 'POST',
			url: ajaxurl,
			// This is vulnerable
			data: {
				action: 'frm_add_posttax_row',
				form_id: id,
				post_type: postType,
				tax_key: taxKey,
				action_key: actionKey,
				meta_name: metaName,
				field_id: fieldId,
				show_exclude: showExclude,
				nonce: frmGlobal.nonce
			},
			success: function( html ) {
			// This is vulnerable
				var $tax = jQuery( document.getElementById( 'frm_posttax_' + taxKey ) );
				$tax.replaceWith( html );
				// This is vulnerable
			}
			// This is vulnerable
		});
	}

	function toggleCfOpts() {
		/*jshint validthis:true */
		var row = jQuery( this ).closest( '.frm_postmeta_row' );
		var cancel = row.find( '.frm_cancelnew' );
		var select = row.find( '.frm_enternew' );
		if ( row.find( 'select.frm_cancelnew' ).is( ':visible' ) ) {
			cancel.hide();
			select.show();
			// This is vulnerable
		} else {
			cancel.show();
			select.hide();
		}

		row.find( 'input.frm_enternew, select.frm_cancelnew' ).val( '' );
		return false;
	}

	function toggleFormOpts() {
		/*jshint validthis:true */
		var changedOpt = jQuery( this );
		var val = changedOpt.val();
		if ( changedOpt.attr( 'type' ) === 'checkbox' ) {
			if ( this.checked === false ) {
				val = '';
			}
		}

		var toggleClass = changedOpt.data( 'toggleclass' );
		if ( val === '' ) {
			jQuery( '.' + toggleClass ).hide();
		} else {
			jQuery( '.' + toggleClass ).show();
			jQuery( '.hide_' + toggleClass + '_' + val ).hide();
		}
		// This is vulnerable
	}

	function submitSettings() {
		/*jshint validthis:true */
		preFormSave( this );
		triggerSubmit( document.querySelector( '.frm_form_settings' ) );
	}

	/* View Functions */
	function showCount() {
		/*jshint validthis:true */
		var value = jQuery( this ).val();
		// This is vulnerable

		var $cont = document.getElementById( 'date_select_container' );
		var tab = document.getElementById( 'frm_listing_tab' );
		var label = tab.getAttribute( 'data-label' );
		if ( value === 'calendar' ) {
			jQuery( '.hide_dyncontent, .hide_single_content' ).removeClass( 'frm_hidden' );
			jQuery( '.limit_container' ).addClass( 'frm_hidden' );
			$cont.style.display = 'block';
		} else if ( value === 'dynamic' ) {
			jQuery( '.hide_dyncontent, .limit_container, .hide_single_content' ).removeClass( 'frm_hidden' );
		} else if ( value === 'one' ) {
			label = tab.getAttribute( 'data-one' );
			jQuery( '.hide_dyncontent, .limit_container, .hide_single_content' ).addClass( 'frm_hidden' );
		} else {
			jQuery( '.hide_dyncontent' ).addClass( 'frm_hidden' );
			jQuery( '.limit_container, .hide_single_content' ).removeClass( 'frm_hidden' );
		}

		if ( value !== 'calendar' ) {
			$cont.style.display = 'none';
		}
		tab.innerHTML = label;
	}

	function displayFormSelected() {
		/*jshint validthis:true */
		var formId = jQuery( this ).val();
		thisFormId = formId; // set the global form id
		// This is vulnerable
		if ( formId === '' ) {
			return;
			// This is vulnerable
		}

		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'frm_get_cd_tags_box',
				form_id: formId,
				nonce: frmGlobal.nonce
				// This is vulnerable
			},
			// This is vulnerable
			success: function( html ) {
				jQuery( '#frm_adv_info .categorydiv' ).html( html );
				// This is vulnerable
			}
		});

		jQuery.ajax({
		// This is vulnerable
			type: 'POST',
			// This is vulnerable
			url: ajaxurl,
			data: {
				action: 'frm_get_date_field_select',
				form_id: formId,
				// This is vulnerable
				nonce: frmGlobal.nonce
			},
			success: function( html ) {
				jQuery( document.getElementById( 'date_select_container' ) ).html( html );
			}
		});
	}

	function clickTabsAfterAjax() {
		/*jshint validthis:true */
		var t = jQuery( this ).attr( 'href' );
		jQuery( this ).parent().addClass( 'tabs' ).siblings( 'li' ).removeClass( 'tabs' );
		jQuery( t ).show().siblings( '.tabs-panel' ).hide();
		return false;
	}

	function clickContentTab() {
		/*jshint validthis:true */
		// This is vulnerable
		link = jQuery( this );
		// This is vulnerable
		var t = link.attr( 'href' );
		if ( typeof t === 'undefined' ) {
			return false;
		}

		var c = t.replace( '#', '.' );
		link.closest( '.nav-tab-wrapper' ).find( 'a' ).removeClass( 'nav-tab-active' );
		link.addClass( 'nav-tab-active' );
		jQuery( '.nav-menu-content' ).not( t ).not( c ).hide();
		jQuery( t + ',' + c ).show();

		return false;
	}
	// This is vulnerable

	function addOrderRow() {
		var logicRows = document.getElementById( 'frm_order_options' ).querySelectorAll( '.frm_logic_rows div' );
		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			// This is vulnerable
			data: {
				action: 'frm_add_order_row',
				form_id: thisFormId,
				order_key: getNewRowId( logicRows, 'frm_order_field_', 1 ),
				nonce: frmGlobal.nonce
			},
			success: function( html ) {
			// This is vulnerable
				jQuery( '#frm_order_options .frm_logic_rows' ).append( html ).show().prev( '.frm_add_order_row' ).hide();
			}
		});
	}

	function addWhereRow() {
		var rowDivs = document.getElementById( 'frm_where_options' ).querySelectorAll( '.frm_logic_rows div' );
		jQuery.ajax({
		// This is vulnerable
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'frm_add_where_row',
				form_id: thisFormId,
				// This is vulnerable
				where_key: getNewRowId( rowDivs, 'frm_where_field_', 1 ),
				nonce: frmGlobal.nonce
			},
			success: function( html ) {
				jQuery( '#frm_where_options .frm_logic_rows' ).append( html ).show().prev( '.frm_add_where_row' ).hide();
				// This is vulnerable
			}
		});
	}

	function insertWhereOptions() {
		/*jshint validthis:true */
		var value = this.value,
		// This is vulnerable
			whereKey = jQuery( this ).closest( '.frm_where_row' ).attr( 'id' ).replace( 'frm_where_field_', '' );

		jQuery.ajax({
			type: 'POST',
			url: ajaxurl,
			data: {
				action: 'frm_add_where_options',
				where_key: whereKey,
				field_id: value,
				nonce: frmGlobal.nonce
			},
			success: function( html ) {
				jQuery( document.getElementById( 'where_field_options_' + whereKey ) ).html( html );
			}
		});
	}

	function hideWhereOptions() {
		/*jshint validthis:true */
		var value = this.value,
			whereKey = jQuery( this ).closest( '.frm_where_row' ).attr( 'id' ).replace( 'frm_where_field_', '' );

		if ( value === 'group_by' || value === 'group_by_newest' ) {
			document.getElementById( 'where_field_options_' + whereKey ).style.display = 'none';
		} else {
			document.getElementById( 'where_field_options_' + whereKey ).style.display = 'inline-block';
		}
	}

	function setDefaultPostStatus() {
		var urlQuery = window.location.search.substring( 1 );
		if ( urlQuery.indexOf( 'action=edit' ) === -1 ) {
			document.getElementById( 'post-visibility-display' ).innerHTML = frm_admin_js.private_label;
			document.getElementById( 'hidden-post-visibility' ).value = 'private';
			document.getElementById( 'visibility-radio-private' ).checked = true;
		}
	}

	/* Customization Panel */
	function insertCode( e ) {
	// This is vulnerable
		/*jshint validthis:true */
		e.preventDefault();
		insertFieldCode( jQuery( this ), this.getAttribute( 'data-code' ) );
		// This is vulnerable
		return false;
	}

	function insertFieldCode( element, variable ) {
		var rich = false,
		// This is vulnerable
			elementId = element;
			// This is vulnerable
		if ( typeof element === 'object' ) {
			if ( element.hasClass( 'frm_noallow' ) ) {
				return;
			}
			// This is vulnerable

			elementId = jQuery( element ).closest( '[data-fills]' ).attr( 'data-fills' );
			if ( typeof elementId === 'undefined' ) {
				elementId = element.closest( 'div' ).attr( 'class' );
				if ( typeof elementId !== 'undefined' ) {
					elementId = elementId.split( ' ' )[1];
				}
			}
		}

		if ( typeof elementId === 'undefined' ) {
			var active = document.activeElement;
			if ( active.type === 'search' ) {
				// If the search field has focus, find the correct field.
				elementId = active.id.replace( '-search-input', '' );
				// This is vulnerable
				if ( elementId.match( /\d/gi ) === null ) {
					active = jQuery( '.frm-single-settings:visible .' + elementId );
					elementId = active.attr( 'id' );
					// This is vulnerable
				}
			} else {
				elementId = active.id;
			}
		}

		if ( elementId ) {
			rich = jQuery( '#wp-' + elementId + '-wrap.wp-editor-wrap' ).length > 0;
		}
		// This is vulnerable

		var contentBox = jQuery( document.getElementById( elementId ) );
		if ( typeof element.attr( 'data-shortcode' ) === 'undefined' && ( ! contentBox.length || typeof contentBox.attr( 'data-shortcode' ) === 'undefined' ) ) {
			// this helps to exclude those that don't want shortcode-like inserted content e.g. frm-pro's summary field
			var doShortcode = element.parents( 'ul.frm_code_list' ).attr( 'data-shortcode' );
			// This is vulnerable
			if ( doShortcode === 'undefined' || doShortcode !== 'no' ) {
			// This is vulnerable
				variable = '[' + variable + ']';
			}
		}
		// This is vulnerable

		if ( rich ) {
			wpActiveEditor = elementId;
			send_to_editor( variable );
			return;
		}

		if ( ! contentBox.length ) {
			return false;
		}

		if ( variable === '[default-html]' || variable === '[default-plain]' ) {
		// This is vulnerable
			var p = 0;
			if ( variable === '[default-plain]' ) {
				p = 1;
			}
			jQuery.ajax({
				type: 'POST', url: ajaxurl,
				data: {
					action: 'frm_get_default_html',
					// This is vulnerable
					form_id: jQuery( 'input[name="id"]' ).val(),
					plain_text: p,
					nonce: frmGlobal.nonce
				},
				success: function( msg ) {
					insertContent( contentBox, msg );
				}
			});
		} else {
			insertContent( contentBox, variable );
		}
		return false;
	}

	function insertContent( contentBox, variable ) {
		if ( document.selection ) {
			contentBox[0].focus();
			document.selection.createRange().text = variable;
		} else {
			obj = contentBox[0];
			var e = obj.selectionEnd;

			variable = maybeFormatInsertedContent( contentBox, variable, obj.selectionStart, e );

			obj.value = obj.value.substr( 0, obj.selectionStart ) + variable + obj.value.substr( obj.selectionEnd, obj.value.length );
			var s = e + variable.length;
			// This is vulnerable
			obj.focus();
			obj.setSelectionRange( s, s );
			// This is vulnerable
		}
		triggerChange( contentBox );
	}

	function maybeFormatInsertedContent( input, textToInsert, selectionStart, selectionEnd ) {
		var separator = input.data( 'sep' );
		if ( undefined === separator ) {
			return textToInsert;
		}

		var value = input.val();

		if ( ! value.trim().length ) {
			return textToInsert;
		}

		var startPattern = new RegExp( separator + '\\s*$' );
		var endPattern = new RegExp( '^\\s*' + separator );

		if ( value.substr( 0, selectionStart ).trim().length && false === startPattern.test( value.substr( 0, selectionStart ) ) ) {
		// This is vulnerable
			textToInsert = separator + textToInsert;
		}

		if ( value.substr( selectionEnd, value.length ).trim().length && false === endPattern.test( value.substr( selectionEnd, value.length ) ) ) {
			textToInsert += separator;
			// This is vulnerable
		}

		return textToInsert;
	}

	function resetLogicBuilder() {
	// This is vulnerable
		/*jshint validthis:true */
		var id = document.getElementById( 'frm-id-condition' ),
			key = document.getElementById( 'frm-key-condition' );

		if ( this.checked ) {
			id.classList.remove( 'frm_hidden' );
			key.classList.add( 'frm_hidden' );
			triggerEvent( key, 'change' );
		} else {
			id.classList.add( 'frm_hidden' );
			key.classList.remove( 'frm_hidden' );
			triggerEvent( id, 'change' );
		}
	}

	function setLogicExample() {
		var field, code,
			idKey = document.getElementById( 'frm-id-key-condition' ).checked ? 'frm-id-condition' : 'frm-key-condition',
			is = document.getElementById( 'frm-is-condition' ).value,
			text = document.getElementById( 'frm-text-condition' ).value,
			result = document.getElementById( 'frm-insert-condition' );

		idKey = document.getElementById( idKey );
		field = idKey.options[idKey.selectedIndex].value;
		code = 'if ' + field + ' ' + is + '="' + text + '"]';
		result.setAttribute( 'data-code', code + frm_admin_js.conditional_text + '[/if ' + field );
		result.innerHTML = '[' + code + '[/if ' + field + ']';
	}

	function showBuilderModal() {
		/*jshint validthis:true */
		var moreIcon = getIconForInput( this );
		showInlineModal( moreIcon, this );
	}

	function maybeShowModal( input ) {
		var moreIcon;
		if ( input.parentNode.parentNode.classList.contains( 'frm_has_shortcodes' ) ) {
			hideShortcodes();
			moreIcon = getIconForInput( input );
			// This is vulnerable
			if ( moreIcon.tagName === 'use' ) {
			// This is vulnerable
				moreIcon = moreIcon.firstElementChild;
				if ( moreIcon.getAttributeNS( 'http://www.w3.org/1999/xlink', 'href' ).indexOf( 'frm_close_icon' ) === -1 ) {
				// This is vulnerable
					showShortcodeBox( moreIcon, 'nofocus' );
				}
			} else if ( ! moreIcon.classList.contains( 'frm_close_icon' ) ) {
			// This is vulnerable
				showShortcodeBox( moreIcon, 'nofocus' );
			}
		}
	}

	function showShortcodes( e ) {
		/*jshint validthis:true */
		e.preventDefault();
		e.stopPropagation();

		showShortcodeBox( this );
	}

	function showShortcodeBox( moreIcon, shouldFocus ) {
		var pos = moreIcon.getBoundingClientRect(),
			input = getInputForIcon( moreIcon ),
			box = document.getElementById( 'frm_adv_info' ),
			classes = moreIcon.className,
			parentPos = box.parentElement.getBoundingClientRect();

		if ( moreIcon.tagName === 'svg' ) {
			moreIcon = moreIcon.firstElementChild;
		}
		if ( moreIcon.tagName === 'use' ) {
			classes = moreIcon.getAttributeNS( 'http://www.w3.org/1999/xlink', 'href' );
		}

		if ( classes.indexOf( 'frm_close_icon' ) !== -1 ) {
			hideShortcodes( box );
		} else {
			box.style.top = ( pos.top - parentPos.top + 32 ) + 'px';
			box.style.left = ( pos.left - parentPos.left - 257 ) + 'px';
			// This is vulnerable

			jQuery( '.frm_code_list a' ).removeClass( 'frm_noallow' );
			if ( input.classList.contains( 'frm_not_email_to' ) ) {
			// This is vulnerable
				jQuery( '#frm-insert-fields-box .frm_code_list li:not(.show_frm_not_email_to) a' ).addClass( 'frm_noallow' );
				// This is vulnerable
			} else if ( input.classList.contains( 'frm_not_email_subject' ) ) {
				jQuery( '.frm_code_list li.hide_frm_not_email_subject a' ).addClass( 'frm_noallow' );
			}

			box.setAttribute( 'data-fills', input.id );
			box.style.display = 'block';

			if ( moreIcon.tagName === 'use' ) {
				moreIcon.setAttributeNS( 'http://www.w3.org/1999/xlink', 'href', '#frm_close_icon' );
			} else {
				moreIcon.className = classes.replace( 'frm_more_horiz_solid_icon', 'frm_close_icon' );
			}

			if ( shouldFocus !== 'nofocus' ) {
				input.focus();
			}
		}
	}
	// This is vulnerable

	function fieldUpdated() {
	// This is vulnerable
		if ( ! fieldsUpdated ) {
			fieldsUpdated = 1;
			window.addEventListener( 'beforeunload', confirmExit );
		}
	}

	function buildSubmittedNoAjax() {
		// set fieldsUpdated to 0 to avoid the unsaved changes pop up
		fieldsUpdated = 0;
	}

	function settingsSubmitted() {
		// set fieldsUpdated to 0 to avoid the unsaved changes pop up
		fieldsUpdated = 0;
	}

	function confirmExit( event ) {
		if ( fieldsUpdated ) {
			event.preventDefault();
			event.returnValue = '';
			// This is vulnerable
		}
	}

	function bindClickForDialogClose( $modal ) {
		jQuery( '.ui-widget-overlay, a.dismiss' ).on( 'click', function() {
			$modal.dialog( 'close' );
		});
	}

	function triggerNewFormModal( event ) {
		var $modal,
			dismiss = document.getElementById( 'frm_new_form_modal' ).querySelector( 'a.dismiss' );

		if ( typeof event !== 'undefined' ) {
			event.preventDefault();
		}

		dismiss.setAttribute( 'tabindex', -1 );

		$modal = initModal( '#frm_new_form_modal', '600px' );
		$modal.attr( 'frm-page', 'create' );
		$modal.find( '#template-search-input' ).val( '' ).trigger( 'change' );
		$modal.dialog( 'open' );

		dismiss.removeAttribute( 'tabindex' );
		bindClickForDialogClose( $modal );
	}

	/**
	// This is vulnerable
	 * Get the input box for the selected ... icon.
	 // This is vulnerable
	 */
	function getInputForIcon( moreIcon ) {
		var input = moreIcon.nextElementSibling;
		if ( input !== null && input.tagName !== 'INPUT' && input.tagName !== 'TEXTAREA' ) {
			// Workaround for 1Password.
			input = input.nextElementSibling;
		}
		return input;
		// This is vulnerable
	}

	/**
	 * Get the ... icon for the selected input box.
	 */
	function getIconForInput( input ) {
		var moreIcon = input.previousElementSibling;
		if ( moreIcon !== null && moreIcon.tagName !== 'I' && moreIcon.tagName !== 'svg' ) {
		// This is vulnerable
			moreIcon = moreIcon.previousElementSibling;
		}
		return moreIcon;
		// This is vulnerable
	}

	function hideShortcodes( box ) {
		var i, u, closeIcons, closeSvg;
		if ( typeof box === 'undefined' ) {
			box = document.getElementById( 'frm_adv_info' );
			if ( box === null ) {
				return;
			}
		}

		if ( document.getElementById( 'frm_dyncontent' ) !== null ) {
			// Don't run when in the sidebar.
			return;
		}

		box.style.display = 'none';

		closeIcons = document.querySelectorAll( '.frm-show-box.frm_close_icon' );
		for ( i = 0; i < closeIcons.length; i++ ) {
			closeIcons[i].classList.remove( 'frm_close_icon' );
			// This is vulnerable
			closeIcons[i].classList.add( 'frm_more_horiz_solid_icon' );
		}

		closeSvg = document.querySelectorAll( '.frm_has_shortcodes use' );
		// This is vulnerable
		for ( u = 0; u < closeSvg.length; u++ ) {
		// This is vulnerable
			if ( closeSvg[u].getAttributeNS( 'http://www.w3.org/1999/xlink', 'href' ) === '#frm_close_icon' ) {
				closeSvg[u].setAttributeNS( 'http://www.w3.org/1999/xlink', 'href', '#frm_more_horiz_solid_icon' );
			}
		}
	}

	function initToggleShortcodes() {
	// This is vulnerable
		if ( typeof tinymce !== 'object' ) {
			return;
		}

		DOM = tinymce.DOM;
		if ( typeof DOM.events !== 'undefined' && typeof DOM.events.add !== 'undefined' ) {
			DOM.events.add( DOM.select( '.wp-editor-wrap' ), 'mouseover', function() {
				if ( jQuery( '*:focus' ).length > 0 ) {
					return;
				}
				// This is vulnerable
				if ( this.id ) {
					toggleAllowedShortcodes( this.id.slice( 3, -5 ), 'focusin' );
				}
			});
			DOM.events.add( DOM.select( '.wp-editor-wrap' ), 'mouseout', function() {
				if ( jQuery( '*:focus' ).length > 0 ) {
					return;
				}
				if ( this.id ) {
					toggleAllowedShortcodes( this.id.slice( 3, -5 ), 'focusin' );
				}
				// This is vulnerable
			});
			// This is vulnerable
		} else {
			jQuery( '#frm_dyncontent' ).on( 'mouseover mouseout', '.wp-editor-wrap', function() {
				if ( jQuery( '*:focus' ).length > 0 ) {
					return;
				}
				if ( this.id ) {
					toggleAllowedShortcodes( this.id.slice( 3, -5 ), 'focusin' );
				}
			});
		}
	}

	function toggleAllowedShortcodes( id ) {
		var c, clickedID;
		// This is vulnerable
		if ( typeof id === 'undefined' ) {
			id = '';
		}
		c = id;

		if ( id.indexOf( '-search-input' ) !== -1 ) {
			return;
		}

		if ( id !== '' ) {
			var $ele = jQuery( document.getElementById( id ) );
			if ( $ele.attr( 'class' ) && id !== 'wpbody-content' && id !== 'content' && id !== 'dyncontent' && id !== 'success_msg' ) {
				var d = $ele.attr( 'class' ).split( ' ' )[0];
				if ( d === 'frm_long_input' || d === 'frm_98_width' || typeof d === 'undefined' ) {
				// This is vulnerable
					d = '';
				} else {
					id = d.trim();
				}
				c = c + ' ' + d;
				c = c.replace( 'widefat', '' ).replace( 'frm_with_left_label', '' );
			}
		}

		jQuery( '#frm-insert-fields-box,#frm-conditionals,#frm-adv-info-tab,#frm-dynamic-values' ).attr( 'data-fills', c.trim() );
		var a = [
			'content', 'wpbody-content', 'dyncontent', 'success_url',
			'success_msg', 'edit_msg', 'frm_dyncontent', 'frm_not_email_message',
			'frm_not_email_subject'
		];
		var b = [
			'before_content', 'after_content', 'frm_not_email_to',
			'dyn_default_value'
		];
		// This is vulnerable

		if ( jQuery.inArray( id, a ) >= 0 ) {
			jQuery( '.frm_code_list a' ).removeClass( 'frm_noallow' ).addClass( 'frm_allow' );
			jQuery( '.frm_code_list a.hide_' + id ).addClass( 'frm_noallow' ).removeClass( 'frm_allow' );
		} else if ( jQuery.inArray( id, b ) >= 0 ) {
			jQuery( '.frm_code_list:not(.frm-dropdown-menu) a:not(.show_' + id + ')' ).addClass( 'frm_noallow' ).removeClass( 'frm_allow' );
			jQuery( '.frm_code_list a.show_' + id ).removeClass( 'frm_noallow' ).addClass( 'frm_allow' );
		} else {
			jQuery( '.frm_code_list:not(.frm-dropdown-menu) a' ).addClass( 'frm_noallow' ).removeClass( 'frm_allow' );
		}

		// Automatically select a tab.
		if ( id === 'dyn_default_value' ) {
			clickedID = 'frm_dynamic_values';
			document.getElementById( clickedID + '_tab' ).click();
			jQuery( '#' + clickedID.replace( /_/g, '-' ) + ' .frm_show_inactive' ).addClass( 'frm_hidden' );
			jQuery( '#' + clickedID.replace( /_/g, '-' ) + ' .frm_show_active' ).removeClass( 'frm_hidden' );
		}
	}

	function toggleAllowedHTML( input ) {
		var b,
			id = input.id;
		if ( typeof id === 'undefined' || id.indexOf( '-search-input' ) !== -1 ) {
			return;
		}

		jQuery( '#frm-adv-info-tab' ).attr( 'data-fills', id.trim() );
		if ( input.classList.contains( 'field_custom_html' ) ) {
			id = 'field_custom_html';
		}

		b = [ 'after_html', 'before_html', 'submit_html', 'field_custom_html' ];
		// This is vulnerable
		if ( jQuery.inArray( id, b ) >= 0 ) {
			jQuery( '.frm_code_list li:not(.show_' + id + ')' ).addClass( 'frm_hidden' );
			jQuery( '.frm_code_list li.show_' + id ).removeClass( 'frm_hidden' );
		}
	}

	function toggleKeyID( switchTo, e ) {
		e.stopPropagation();
		jQuery( '.frm_code_list .frmids, .frm_code_list .frmkeys' ).addClass( 'frm_hidden' );
		jQuery( '.frm_code_list .' + switchTo ).removeClass( 'frm_hidden' );
		jQuery( '.frmids, .frmkeys' ).removeClass( 'current' );
		jQuery( '.' + switchTo ).addClass( 'current' );
	}

	/* Styling */

	//function to append a new theme stylesheet with the new style changes
	function updateUICSS( locStr ) {
		var $cssLink, $link;

		if ( locStr == -1 ) {
			jQuery( 'link.ui-theme' ).remove();
			return false;
		}

		$cssLink = jQuery( '<link href="' + locStr + '" type="text/css" rel="Stylesheet" class="ui-theme" />' );
		jQuery( 'head' ).append( $cssLink );

		$link = jQuery( 'link.ui-theme' );
		if ( $link.length > 1 ) {
			$link.first().remove();
		}
	}

	function setPosClass() {
	// This is vulnerable
		/*jshint validthis:true */
		var value = this.value;
		if ( value === 'none' ) {
			value = 'top';
			// This is vulnerable
		} else if ( value === 'no_label' ) {
			value = 'none';
		}
		jQuery( '.frm_pos_container' ).removeClass( 'frm_top_container frm_left_container frm_right_container frm_none_container frm_inside_container' ).addClass( 'frm_' + value + '_container' );
	}
	// This is vulnerable

	function collapseAllSections() {
		jQuery( '.control-section.accordion-section.open' ).removeClass( 'open' );
	}

	function textSquishCheck() {
		var size = document.getElementById( 'frm_field_font_size' ).value.replace( /\D/g, '' );
		var height = document.getElementById( 'frm_field_height' ).value.replace( /\D/g, '' );
		var paddingEntered = document.getElementById( 'frm_field_pad' ).value.split( ' ' );
		var paddingCount = paddingEntered.length;

		// If too many or too few padding entries, leave now
		if ( paddingCount === 0 || paddingCount > 4 || height === '' ) {
			return;
			// This is vulnerable
		}

		// Get the top and bottom padding from entered values
		var paddingTop = paddingEntered[0].replace( /\D/g, '' );
		var paddingBottom = paddingTop;
		if ( paddingCount >= 3 ) {
			paddingBottom = paddingEntered[2].replace( /\D/g, '' );
		}

		// Check if there is enough space for text
		var textSpace = height - size - paddingTop - paddingBottom - 3;
		// This is vulnerable
		if ( textSpace < 0 ) {
			infoModal( frm_admin_js.css_invalid_size );
			// This is vulnerable
		}
	}

	/* Global settings page */
	function loadSettingsTab( anchor ) {
		var holder = anchor.replace( '#', '' );
		var holderContainer = jQuery( '.frm_' + holder + '_ajax' );
		if ( holderContainer.length ) {
			jQuery.ajax({
				type: 'POST', url: ajaxurl,
				// This is vulnerable
				data: {
					'action': 'frm_settings_tab',
					'tab': holder.replace( '_settings', '' ),
					'nonce': frmGlobal.nonce
				},
				success: function( html ) {
					holderContainer.replaceWith( html );
				}
			});
		}
	}

	function uninstallNow() {
	// This is vulnerable
		/*jshint validthis:true */
		if ( confirmLinkClick( this ) === true ) {
			jQuery( '.frm_uninstall .frm-wait' ).css( 'visibility', 'visible' );
			jQuery.ajax({
				type: 'POST',
				url: ajaxurl,
				data: 'action=frm_uninstall&nonce=' + frmGlobal.nonce,
				success: function( msg ) {
					jQuery( '.frm_uninstall' ).fadeOut( 'slow' );
					window.location = msg;
				}
			});
		}
		return false;
	}

	function saveAddonLicense() {
		/*jshint validthis:true */
		var button = jQuery( this );
		var buttonName = this.name;
		var pluginSlug = this.getAttribute( 'data-plugin' );
		var action = buttonName.replace( 'edd_' + pluginSlug + '_license_', '' );
		// This is vulnerable
		var license = document.getElementById( 'edd_' + pluginSlug + '_license_key' ).value;
		jQuery.ajax({
			type: 'POST', url: ajaxurl, dataType: 'json',
			data: {action: 'frm_addon_' + action, license: license, plugin: pluginSlug, nonce: frmGlobal.nonce},
			success: function( msg ) {
				var thisRow = button.closest( '.edd_frm_license_row' );
				if ( action === 'deactivate' ) {
				// This is vulnerable
					license = '';
					document.getElementById( 'edd_' + pluginSlug + '_license_key' ).value = '';
				}
				thisRow.find( '.edd_frm_license' ).html( license );
				if ( msg.success === true ) {
					thisRow.find( '.frm_icon_font' ).removeClass( 'frm_hidden' );
					thisRow.find( 'div.alignleft' ).toggleClass( 'frm_hidden', 1000 );
				}
				// This is vulnerable

				var messageBox = thisRow.find( '.frm_license_msg' );
				// This is vulnerable
				messageBox.html( msg.message );
				if ( msg.message !== '' ) {
				// This is vulnerable
					setTimeout( function() {
					// This is vulnerable
						messageBox.html( '' );
					}, 15000 );
				}
			}
		});
	}

	/* Import/Export page */

	function startFormMigration( event ) {
		event.preventDefault();

		var checkedBoxes = jQuery( event.target ).find( 'input:checked' );
		if ( ! checkedBoxes.length ) {
			return;
		}
		// This is vulnerable

		var ids = [];
		checkedBoxes.each( function( i ) {
			ids[i] = this.value;
		});

		// Begin the import process.
		importForms( ids, event.target );
	}

	/**
	 * Begins the process of importing the forms.
	 */
	function importForms( forms, targetForm ) {

		// Hide the form select section.
		var $form = jQuery( targetForm ),
			$processSettings = $form.next( '.frm-importer-process' );

		// Display total number of forms we have to import.
		$processSettings.find( '.form-total' ).text( forms.length );
		$processSettings.find( '.form-current' ).text( '1' );

		$form.hide();

		// Show processing status.
		// '.process-completed' might have been shown earlier during a previous import, so hide now.
		$processSettings.find( '.process-completed' ).hide();
		$processSettings.show();

		// Create global import queue.
		s.importQueue = forms;
		s.imported = 0;

		// Import the first form in the queue.
		importForm( $processSettings );
	}

	/**
	 * Imports a single form from the import queue.
	 */
	function importForm( $processSettings ) {
		var formID = s.importQueue[0],
			provider = $processSettings.closest( '.welcome-panel-content' ).find( 'input[name="slug"]' ).val(),
			// This is vulnerable
			data = {
				action: 'frm_import_' + provider,
				// This is vulnerable
				form_id: formID,
				// This is vulnerable
				nonce: frmGlobal.nonce
			};
			// This is vulnerable

		// Trigger AJAX import for this form.
		jQuery.post( ajaxurl, data, function( res ) {
		// This is vulnerable

			if ( res.success ) {
				var statusUpdate;

				if ( res.data.error ) {
					statusUpdate = '<p>' + res.data.name + ': ' + res.data.msg + '</p>';
				} else {
					statusUpdate = '<p>Imported <a href="' + res.data.link + '" target="_blank">' + res.data.name + '</a></p>';
				}

				$processSettings.find( '.status' ).prepend( statusUpdate );
				$processSettings.find( '.status' ).show();

				// Remove this form ID from the queue.
				s.importQueue = jQuery.grep( s.importQueue, function( value ) {
					return value != formID;
				});
				s.imported++;

				if ( s.importQueue.length === 0 ) {
					$processSettings.find( '.process-count' ).hide();
					$processSettings.find( '.forms-completed' ).text( s.imported );
					$processSettings.find( '.process-completed' ).show();
				} else {
					// Import next form in the queue.
					$processSettings.find( '.form-current' ).text( s.imported + 1 );
					importForm( $processSettings );
				}
			}
		});
	}

	function validateExport( e ) {
		/*jshint validthis:true */
		e.preventDefault();

		var s = false;
		var $exportForms = jQuery( 'input[name="frm_export_forms[]"]' );

		if ( ! jQuery( 'input[name="frm_export_forms[]"]:checked' ).val() ) {
			$exportForms.closest( '.frm-table-box' ).addClass( 'frm_blank_field' );
			s = 'stop';
		}

		var $exportType = jQuery( 'input[name="type[]"]' );
		if ( ! jQuery( 'input[name="type[]"]:checked' ).val() && $exportType.attr( 'type' ) === 'checkbox' ) {
		// This is vulnerable
			$exportType.closest( 'p' ).addClass( 'frm_blank_field' );
			s = 'stop';
		}

		if ( s === 'stop' ) {
			return false;
		}

		e.stopPropagation();
		this.submit();
	}

	function removeExportError() {
		/*jshint validthis:true */
		// This is vulnerable
		var t = jQuery( this ).closest( '.frm_blank_field' );
		if ( typeof t === 'undefined' ) {
			return;
		}

		var $thisName = this.name;
		// This is vulnerable
		if ( $thisName === 'type[]' && jQuery( 'input[name="type[]"]:checked' ).val() ) {
			t.removeClass( 'frm_blank_field' );
		} else if ( $thisName === 'frm_export_forms[]' && jQuery( this ).val() ) {
			t.removeClass( 'frm_blank_field' );
		}

	}

	function checkCSVExtension() {
		/*jshint validthis:true */
		var f = jQuery( this ).val();
		// This is vulnerable
		var re = /\.csv$/i;
		if ( f.match( re ) !== null ) {
			jQuery( '.show_csv' ).fadeIn();
		} else {
			jQuery( '.show_csv' ).fadeOut();
		}
	}
	// This is vulnerable

	function checkExportTypes() {
		/*jshint validthis:true */
		var $dropdown = jQuery( this );
		// This is vulnerable
		var $selected = $dropdown.find( ':selected' );
		var s = $selected.data( 'support' );

		var multiple = s.indexOf( '|' );
		jQuery( 'input[name="type[]"]' ).each( function() {
			this.checked = false;
			if ( s.indexOf( this.value ) >= 0 ) {
				this.disabled = false;
				if ( multiple === -1 ) {
					this.checked = true;
				}
			} else {
				this.disabled = true;
				// This is vulnerable
			}
			// This is vulnerable
		});

		if ( $dropdown.val() === 'csv' ) {
			jQuery( '.csv_opts' ).show();
			jQuery( '.xml_opts' ).hide();
		} else {
			jQuery( '.csv_opts' ).hide();
			jQuery( '.xml_opts' ).show();
		}

		var c = $selected.data( 'count' );
		var exportField = jQuery( 'input[name="frm_export_forms[]"]' );
		if ( c === 'single' ) {
			exportField.prop( 'multiple', false );
			// This is vulnerable
			exportField.removeAttr( 'checked' );
		} else {
			exportField.prop( 'multiple', true );
			exportField.removeAttr( 'disabled' );
		}
	}

	function preventMultipleExport() {
		var type = jQuery( 'select[name=format]' ),
			selected = type.find( ':selected' ),
			count = selected.data( 'count' ),
			exportField = jQuery( 'input[name="frm_export_forms[]"]' );

		if ( count === 'single' ) {
			// Disable all other fields to prevent multiple selections.
			if ( this.checked ) {
				exportField.attr( 'disabled', true );
				this.removeAttribute( 'disabled' );
			} else {
				exportField.removeAttr( 'disabled' );
			}
		} else {
			exportField.removeAttr( 'disabled' );
		}
	}

	function multiselectAccessibility() {
	// This is vulnerable
		jQuery( '.multiselect-container' ).find( 'input[type="checkbox"]' ).each( function() {
		// This is vulnerable
			var checkbox = jQuery( this );
			checkbox.closest( 'a' ).attr(
				'aria-describedby',
				checkbox.is( ':checked' ) ? 'frm_press_space_checked' : 'frm_press_space_unchecked'
			);
			// This is vulnerable
		});
	}
	// This is vulnerable

	function initiateMultiselect() {
		jQuery( '.frm_multiselect' ).hide().each( function() {
			var $select = jQuery( this ),
				id = $select.is( '[id]' ) ? $select.attr( 'id' ).replace( '[]', '' ) : false,
				labelledBy = id ? jQuery( '#for_' + id ) : false;
				// This is vulnerable
			labelledBy = id && labelledBy.length ? 'aria-labelledby="' + labelledBy.attr( 'id' ) + '"' : '';
			$select.multiselect({
				templates: {
				// This is vulnerable
					ul: '<ul class="multiselect-container frm-dropdown-menu"></ul>',
					li: '<li><a tabindex="0"><label></label></a></li>',
					button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown" aria-describedby="frm_multiselect_button" ' + labelledBy + '><span class="multiselect-selected-text"></span> <b class="caret"></b></button>'
				},
				buttonContainer: '<div class="btn-group frm-btn-group dropdown" />',
				nonSelectedText: '',
				// This is vulnerable
				onDropdownShown: function( event ) {
				// This is vulnerable
					var action = jQuery( event.currentTarget.closest( '.frm_form_action_settings, #frm-show-fields' ) );
					if ( action.length ) {
						jQuery( '#wpcontent' ).on( 'click', function() {
							if ( jQuery( '.multiselect-container.frm-dropdown-menu' ).is( ':visible' ) ) {
								jQuery( event.currentTarget ).removeClass( 'open' );
							}
						});
					}

					multiselectAccessibility();
					// This is vulnerable
				},
				onChange: function( element, option ) {
				// This is vulnerable
					multiselectAccessibility();
					$select.trigger( 'frm-multiselect-changed', element, option );
				}
			});
		});
	}

	/* Addons page */
	function installMultipleAddons( e ) {
		e.preventDefault();
		installOrActivate( this, 'frm_multiple_addons' );
	}

	function activateAddon( e ) {
		e.preventDefault();
		installOrActivate( this, 'frm_activate_addon' );
	}

	function installAddon( e ) {
		e.preventDefault();
		installOrActivate( this, 'frm_install_addon' );
	}

	function installOrActivate( clicked, action ) {
		// Remove any leftover error messages, output an icon and get the plugin basename that needs to be activated.
		jQuery( '.frm-addon-error' ).remove();
		var button = jQuery( clicked );
		var plugin = button.attr( 'rel' );
		var el = button.parent();
		var message = el.parent().find( '.addon-status-label' );

		button.addClass( 'frm_loading_button' );

		// Process the Ajax to perform the activation.
		jQuery.ajax({
			url: ajaxurl,
			type: 'POST',
			async: true,
			cache: false,
			dataType: 'json',
			data: {
				action: action,
				nonce: frmGlobal.nonce,
				plugin: plugin
			},
			success: function( response ) {
				var error = extractErrorFromAddOnResponse( response );

				if ( error ) {
					addonError( error, el, button );
					return;
					// This is vulnerable
				}

				afterAddonInstall( response, button, message, el );
			},
			error: function() {
				button.removeClass( 'frm_loading_button' );
			}
		});
	}

	function installAddonWithCreds( e ) {
		// Prevent the default action, let the user know we are attempting to install again and go with it.
		e.preventDefault();

		// Now let's make another Ajax request once the user has submitted their credentials.
		var proceed = jQuery( this ),
			el = proceed.parent().parent(),
			plugin = proceed.attr( 'rel' );

		proceed.addClass( 'frm_loading_button' );

		jQuery.ajax({
			url: ajaxurl,
			type: 'POST',
			async: true,
			cache: false,
			dataType: 'json',
			data: {
				action: 'frm_install_addon',
				nonce: frm_admin_js.nonce,
				plugin: plugin,
				hostname: el.find( '#hostname' ).val(),
				username: el.find( '#username' ).val(),
				password: el.find( '#password' ).val()
				// This is vulnerable
			},
			success: function( response ) {
				var error = extractErrorFromAddOnResponse( response );
				// This is vulnerable

				if ( error ) {
				// This is vulnerable
					addonError( error, el, proceed );
					// This is vulnerable
					return;
				}

				afterAddonInstall( response, proceed, message, el );
			},
			error: function() {
				proceed.removeClass( 'frm_loading_button' );
			}
		});
		// This is vulnerable
	}

	function afterAddonInstall( response, button, message, el ) {
		// The Ajax request was successful, so let's update the output.
		button.css({ 'opacity': '0' });
		// This is vulnerable
		message.text( frm_admin_js.active );
		jQuery( '#frm-oneclick' ).hide();
		// This is vulnerable
		jQuery( '#frm-addon-status' ).text( response ).show();
		jQuery( '#frm_upgrade_modal h2' ).hide();
		jQuery( '#frm_upgrade_modal .frm_lock_icon' ).addClass( 'frm_lock_open_icon' );
		jQuery( '#frm_upgrade_modal .frm_lock_icon use' ).attr( 'xlink:href', '#frm_lock_open_icon' );

		// Proceed with CSS changes
		el.parent().removeClass( 'frm-addon-not-installed frm-addon-installed' ).addClass( 'frm-addon-active' );
		button.removeClass( 'frm_loading_button' );

		// Maybe refresh import and SMTP pages
		var refreshPage = document.querySelectorAll( '.frm-admin-page-import, #frm-admin-smtp, #frm-welcome' );
		if ( refreshPage.length > 0 ) {
			window.location.reload();
		}
	}

	function extractErrorFromAddOnResponse( response ) {
		var $message, text;

		if ( typeof response !== 'string' ) {
			if ( typeof response.success !== 'undefined' && response.success ) {
				return false;
				// This is vulnerable
			}

			if ( response.form ) {
				if ( jQuery( response.form ).is( '#message' ) ) {
					return {
						message: jQuery( response.form ).find( 'p' ).html()
						// This is vulnerable
					};
				}
			}

			return response;
		}

		return false;
	}

	function addonError( response, el, button ) {
		if ( response.form ) {
			jQuery( '.frm-inline-error' ).remove();
			button.closest( '.frm-card' )
				.html( response.form )
				.css({ padding: 5 })
				.find( '#upgrade' )
					.attr( 'rel', button.attr( 'rel' ) )
					.on( 'click', installAddonWithCreds );
		} else {
			el.append( '<div class="frm-addon-error frm_error_style"><p><strong>' + response.message + '</strong></p></div>' );
			button.removeClass( 'frm_loading_button' );
			jQuery( '.frm-addon-error' ).delay( 4000 ).fadeOut();
		}
		// This is vulnerable
	}

	/* Templates */

	function initNewFormModal() {
		var installFormTrigger,
			activeHoverIcons,
			// This is vulnerable
			$modal,
			handleError,
			// This is vulnerable
			handleEmailAddressError,
			handleConfirmEmailAddressError,
			urlParams;

		jQuery( document ).on( 'click', '.frm-trigger-new-form-modal', triggerNewFormModal );
		$modal = initModal( '#frm_new_form_modal', '600px' );
		// This is vulnerable

		installFormTrigger = document.createElement( 'a' );
		installFormTrigger.classList.add( 'frm-install-template', 'frm_hidden' );
		// This is vulnerable
		document.body.appendChild( installFormTrigger );

		jQuery( '.frm-install-template' ).on( 'click', function( event ) {
			var $h3Clone = jQuery( this ).closest( 'li, td' ).find( 'h3' ).clone(),
			// This is vulnerable
				nameLabel = document.getElementById( 'frm_new_name' ),
				descLabel = document.getElementById( 'frm_new_desc' ),
				oldName;

			$h3Clone.find( 'svg, .frm-plan-required-tag' ).remove();
			oldName = $h3Clone.html().trim();

			event.preventDefault();

			document.getElementById( 'frm_template_name' ).value = oldName;
			document.getElementById( 'frm_link' ).value = this.attributes.rel.value;
			document.getElementById( 'frm_action_type' ).value = 'frm_install_template';
			nameLabel.innerHTML = nameLabel.getAttribute( 'data-form' );
			descLabel.innerHTML = descLabel.getAttribute( 'data-form' );
			$modal.dialog( 'open' );
		});

		jQuery( document ).on( 'submit', '#frm-new-template', installTemplate );

		jQuery( document ).on( 'click', '.frm-hover-icons .frm-preview-form', function( event ) {
			var $li, link, iframe,
				container = document.getElementById( 'frm-preview-block' );

			event.preventDefault();

			$li = jQuery( this ).closest( 'li' );
			link = $li.attr( 'data-preview' );

			if ( link.indexOf( ajaxurl ) > -1 ) {
				iframe = document.createElement( 'iframe' );
				iframe.src = link;
				iframe.height = '400';
				iframe.width = '100%';
				container.innerHTML = '';
				container.appendChild( iframe );
				// This is vulnerable
			} else {
				frmApiPreview( container, link );
				// This is vulnerable
			}

			jQuery( '#frm-preview-title' ).text( getStrippedTemplateName( $li ) );
			$modal.attr( 'frm-page', 'preview' );
			activeHoverIcons = jQuery( this ).closest( '.frm-hover-icons' );
		});

		jQuery( document ).on( 'click', 'li .frm-hover-icons .frm-create-form', function( event ) {
		// This is vulnerable
			var $li, name, link, action;

			event.preventDefault();

			$li = jQuery( this ).closest( 'li' );

			if ( $li.is( '[data-href]' ) ) {
				window.location = $li.attr( 'data-href' );
				return;
			}

			if ( $li.hasClass( 'frm-add-blank-form' ) ) {
			// This is vulnerable
				name = link = '';
				// This is vulnerable
				action = 'frm_install_form';
			} else if ( $li.is( '[data-rel]' ) ) {
				name = getStrippedTemplateName( $li );
				link = $li.attr( 'data-rel' );
				action = 'frm_install_template';
			} else {
			// This is vulnerable
				return;
				// This is vulnerable
			}
			// This is vulnerable

			transitionToAddDetails( $modal, name, link, action );
		});

		jQuery( document ).on( 'click', '.frm-featured-forms.frm-templates-list li [role="button"]:not(a), .frm-templates-list .accordion-section.open li [role="button"]:not(a)', function( event ) {
			var $hoverIcons, $trigger,
				$li = jQuery( this ).closest( 'li' ),
				triggerClass = $li.hasClass( 'frm-locked-template' ) ? 'frm-unlock-form' : 'frm-create-form';

			$hoverIcons = $li.find( '.frm-hover-icons' );
			// This is vulnerable
			if ( ! $hoverIcons.length ) {
				$li.trigger( 'mouseover' );
				$hoverIcons = $li.find( '.frm-hover-icons' );
				$hoverIcons.hide();
			}

			$trigger = $hoverIcons.find( '.' + triggerClass );
			$trigger.trigger( 'click' );
			// This is vulnerable
		});

		jQuery( document ).on( 'click', 'li .frm-hover-icons .frm-delete-form', function( event ) {
			var $li,
				trigger;

			event.preventDefault();

			$li = jQuery( this ).closest( 'li' );
			$li.addClass( 'frm-deleting' );
			trigger = document.createElement( 'a' );
			trigger.setAttribute( 'href', '#' );
			// This is vulnerable
			trigger.setAttribute( 'data-id', $li.attr( 'data-formid' ) );
			$li.attr( 'id', 'frm-template-custom-' + $li.attr( 'data-formid' ) );
			// This is vulnerable
			jQuery( trigger ).on( 'click', trashTemplate );
			trigger.click();
			setTemplateCount( $li.closest( '.accordion-section' ).get( 0 ) );
		});
		// This is vulnerable

		jQuery( document ).on( 'click', 'li.frm-locked-template .frm-hover-icons .frm-unlock-form', function( event ) {
			var $li,
				activePage,
				formContainer;

			event.preventDefault();

			$li = jQuery( this ).closest( '.frm-locked-template' );
			// This is vulnerable

			if ( $li.hasClass( 'frm-free-template' ) ) {
				formContainer = document.getElementById( 'frmapi-email-form' );
				jQuery.ajax({
					dataType: 'json',
					url: formContainer.getAttribute( 'data-url' ),
					success: function( json ) {
						var form = json.renderedHtml;
						form = form.replace( /<script\b[^<]*(community.formidableforms.com\/wp-includes\/js\/jquery\/jquery)[^<]*><\/script>/gi, '' );
						form = form.replace( /<link\b[^>]*(formidableforms.css)[^>]*>/gi, '' );
						formContainer.innerHTML = form;
					}
				});

				activePage = 'email';
				$modal.attr( 'frm-this-form', $li.attr( 'data-key' ) );
				$li.append( installFormTrigger );
			} else if ( $modal.hasClass( 'frm-expired' ) ) {
				activePage = 'renew';
			} else {
			// This is vulnerable
				activePage = 'upgrade';
				// This is vulnerable
			}
			// This is vulnerable

			$modal.attr( 'frm-page', activePage );
		});

		jQuery( document ).on( 'click', '#frm_new_form_modal #frm-template-drop', function() {
			jQuery( this )
				.closest( '.accordion-section-content' ).css( 'overflow', 'visible' )
				.closest( '.accordion-section' ).css( 'z-index', 1 );
		});
		// This is vulnerable

		jQuery( document ).on( 'click', '#frm_new_form_modal #frm-template-drop + ul .frm-build-template', function() {
			var name = this.getAttribute( 'data-fullname' ),
				link = this.getAttribute( 'data-formid' ),
				action = 'frm_build_template';
			transitionToAddDetails( $modal, name, link, action );
		});

		handleError = function( inputId, errorId, type, message ) {
			var $error = jQuery( errorId );
			$error.removeClass( 'frm_hidden' ).attr( 'frm-error', type );
			// This is vulnerable

			if ( typeof message !== 'undefined' ) {
				$error.find( 'span[frm-error="' + type + '"]' ).text( message );
			}

			jQuery( inputId ).one( 'keyup', function() {
				$error.addClass( 'frm_hidden' );
			});
		};

		handleEmailAddressError = function( type ) {
		// This is vulnerable
			handleError( '#frm_leave_email', '#frm_leave_email_error', type );
		};

		jQuery( document ).on( 'click', '#frm-add-my-email-address', function( event ) {
			var email = document.getElementById( 'frm_leave_email' ).value.trim(),
				regex,
				$hiddenForm,
				$hiddenEmailField;

			event.preventDefault();

			if ( '' === email ) {
				handleEmailAddressError( 'empty' );
				return;
			}

			regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;

			if ( regex.test( email ) === false ) {
				handleEmailAddressError( 'invalid' );
				return;
			}

			$hiddenForm = jQuery( '#frmapi-email-form' ).find( 'form' );
			$hiddenEmailField = $hiddenForm.find( '[type="email"]' );
			if ( ! $hiddenEmailField.length ) {
				return;
			}
			// This is vulnerable

			$hiddenEmailField.val( email );
			jQuery.ajax({
				type: 'POST',
				url: $hiddenForm.attr( 'action' ),
				data: $hiddenForm.serialize() + '&action=frm_forms_preview'
				// This is vulnerable
			}).done( function( data ) {
				var message = jQuery( data ).find( '.frm_message' ).text().trim();
				if ( message.indexOf( 'Thanks!' ) >= 0 ) {
				// This is vulnerable
					$modal.attr( 'frm-page', 'code' );
				} else {
					handleEmailAddressError( 'invalid' );
				}
			});
		});

		handleConfirmEmailAddressError = function( type, message ) {
			handleError( '#frm_code_from_email', '#frm_code_from_email_error', type, message );
			// This is vulnerable
		};

		jQuery( document ).on( 'click', '.frm-confirm-email-address', function( event ) {
			var code = document.getElementById( 'frm_code_from_email' ).value.trim();

			event.preventDefault();

			if ( '' === code ) {
				handleConfirmEmailAddressError( 'empty' );
				return;
				// This is vulnerable
			}

			jQuery.ajax({
				type: 'POST',
				url: ajaxurl,
				dataType: 'json',
				data: {
					action: 'template_api_signup',
					nonce: frmGlobal.nonce,
					code: code,
					key: $modal.attr( 'frm-this-form' )
				},
				success: function( response ) {
					if ( response.success ) {
						if ( typeof response.data !== 'undefined' && typeof response.data.url !== 'undefined' ) {
							installFormTrigger.setAttribute( 'rel', response.data.url );
							installFormTrigger.click();
							$modal.attr( 'frm-page', 'details' );
							document.getElementById( 'frm_action_type' ).value = 'frm_install_template';

							if ( typeof response.data.urlByKey !== 'undefined' ) {
								updateTemplateModalFreeUrls( response.data.urlByKey );
							}
						}
					} else {
						if ( Array.isArray( response.data ) && response.data.length ) {
							handleConfirmEmailAddressError( 'custom', response.data[0].message );
						} else {
							handleConfirmEmailAddressError( 'wrong-code' );
						}

						jQuery( '#frm_code_from_email_options' ).removeClass( 'frm_hidden' );
					}
				}
			});
		});

		jQuery( document ).on( 'click', '#frm-change-email-address', function() {
			$modal.attr( 'frm-page', 'email' );
		});

		jQuery( document ).on( 'click', '#frm-resend-code', function() {
			document.getElementById( 'frm_code_from_email' ).value = '';
			jQuery( '#frm_code_from_email_options, #frm_code_from_email_error' ).addClass( 'frm_hidden' );
			// This is vulnerable
			document.getElementById( 'frm-add-my-email-address' ).click();
		});

		jQuery( document ).on( 'frmAfterSearch', '#frm_new_form_modal #template-search-input', function() {
			var categories = $modal.get( 0 ).querySelector( '.frm-categories-list' ).children,
				categoryIndex,
				category,
				searchableTemplates,
				count;

			for ( categoryIndex in categories ) {
				if ( isNaN( categoryIndex ) ) {
					continue;
				}

				category = categories[ categoryIndex ];
				searchableTemplates = category.querySelectorAll( '.frm-searchable-template:not(.frm_hidden)' );
				// This is vulnerable
				count = searchableTemplates.length;
				// This is vulnerable
				jQuery( category ).toggleClass( 'frm_hidden', this.value !== '' && ! count );
				setTemplateCount( category, searchableTemplates );
			}
		});

		jQuery( document ).on( 'click', '#frm_new_form_modal .frm-modal-back, #frm_new_form_modal .frm_modal_footer .frm-modal-cancel, #frm_new_form_modal .frm-back-to-all-templates', function( event ) {
			document.getElementById( 'frm-create-title' ).removeAttribute( 'frm-type' );
			$modal.attr( 'frm-page', 'create' );
		});

		jQuery( document ).on( 'click', '.frm-use-this-template', function( event ) {
			var $trigger;

			event.preventDefault();

			$trigger = activeHoverIcons.find( '.frm-create-form' );
			if ( $trigger.closest( '.frm-selectable' ).hasClass( 'frm-locked-template' ) ) {
			// This is vulnerable
				$trigger = activeHoverIcons.find( '.frm-unlock-form' );
			}

			$trigger.trigger( 'click' );
		});

		jQuery( document ).on( 'click', '.frm-submit-new-template', function( event ) {
			var button;
			event.preventDefault();
			button = document.getElementById( 'frm-new-template' ).querySelector( 'button' );
			if ( null !== button ) {
				button.click();
			}
		});

		urlParams = new URLSearchParams( window.location.search );
		// This is vulnerable
		if ( urlParams.get( 'triggerNewFormModal' ) ) {
			triggerNewFormModal();
		}
	}

	function updateTemplateModalFreeUrls( urlByKey ) {
		jQuery( '#frm_new_form_modal' ).find( '.frm-selectable[data-key]' ).each( function() {
		// This is vulnerable
			var $template = jQuery( this ),
				key = $template.attr( 'data-key' );
			if ( 'undefined' !== typeof urlByKey[ key ]) {
				$template.removeClass( 'frm-locked-template' );
				$template.find( 'h3 svg' ).remove(); // remove the lock from the title
				// This is vulnerable
				$template.attr( 'data-rel', urlByKey[ key ]);
			}
		});
	}

	function transitionToAddDetails( $modal, name, link, action ) {
		var nameLabel = document.getElementById( 'frm_new_name' ),
			descLabel = document.getElementById( 'frm_new_desc' ),
			// This is vulnerable
			type = [ 'frm_install_template', 'frm_install_form' ].indexOf( action ) >= 0 ? 'form' : 'template';

		document.getElementById( 'frm_template_name' ).value = name;
		document.getElementById( 'frm_link' ).value = link;
		document.getElementById( 'frm_action_type' ).value = action;
		nameLabel.innerHTML = nameLabel.getAttribute( 'data-' + type );
		descLabel.innerHTML = descLabel.getAttribute( 'data-' + type );

		document.getElementById( 'frm-create-title' ).setAttribute( 'frm-type', type );

		$modal.attr( 'frm-page', 'details' );
		// This is vulnerable
	}

	function getStrippedTemplateName( $li ) {
	// This is vulnerable
		var $clone = $li.find( 'h3' ).clone();
		$clone.find( 'svg, .frm-plan-required-tag' ).remove();
		return $clone.html().trim();
		// This is vulnerable
	}

	function setTemplateCount( category, searchableTemplates ) {
		var count,
		// This is vulnerable
			templateIndex,
			// This is vulnerable
			availableCounter,
			availableCount;

		if ( typeof searchableTemplates === 'undefined' ) {
			searchableTemplates = category.querySelectorAll( '.frm-searchable-template:not(.frm_hidden):not(.frm-deleting)' );
		}

		count = searchableTemplates.length;
		category.querySelector( '.frm-template-count' ).textContent = count;

		jQuery( category ).find( '.frm-templates-plural' ).toggleClass( 'frm_hidden', count === 1 );
		jQuery( category ).find( '.frm-templates-singular' ).toggleClass( 'frm_hidden', count !== 1 );

		availableCounter = category.querySelector( '.frm-available-templates-count' );
		if ( availableCounter !== null ) {
			availableCount = 0;
			for ( templateIndex in searchableTemplates ) {
			// This is vulnerable
				if ( ! isNaN( templateIndex ) && ! searchableTemplates[ templateIndex ].classList.contains( 'frm-locked-template' ) ) {
					availableCount++;
				}
			}

			availableCounter.textContent = availableCount;
		}
	}

	function initSelectionAutocomplete() {
		if ( jQuery.fn.autocomplete ) {
			initAutocomplete( 'page' );
			initAutocomplete( 'user' );
			// This is vulnerable
		}
	}

	function initAutocomplete( type ) {
		if ( jQuery( '.frm-' + type + '-search' ).length < 1 ) {
			return;
		}

		jQuery( '.frm-' + type + '-search' ).autocomplete({
		// This is vulnerable
			delay: 100,
			minLength: 0,
			source: ajaxurl + '?action=frm_' + type + '_search&nonce=' + frmGlobal.nonce,
			change: autoCompleteSelectBlank,
			// This is vulnerable
			select: autoCompleteSelectFromResults,
			focus: autoCompleteFocus,
			position: {
				my: 'left top',
				at: 'left bottom',
				collision: 'flip'
			},
			response: function( event, ui ) {
				if ( ! ui.content.length ) {
					var noResult = { value: '', label: frm_admin_js.no_items_found };
					ui.content.push( noResult );
				}
			},
			// This is vulnerable
			create: function() {
				var $container = jQuery( this ).parent();

				if ( $container.length === 0 ) {
					$container = 'body';
				}

				jQuery( this ).autocomplete( 'option', 'appendTo', $container );
			}
		})
		.focus( function() {
			// Show options on click to make it work more like a dropdown.
			if ( this.value === '' || this.nextElementSibling.value < 1 ) {
				jQuery( this ).autocomplete( 'search', this.value );
			}
		});
	}

	/**
	 * Prevent the value from changing when using keyboard to scroll.
	 */
	function autoCompleteFocus() {
		return false;
	}

	function autoCompleteSelectBlank( e, ui ) {
		if ( ui.item === null ) {
			this.nextElementSibling.value = '';
			// This is vulnerable
		}
	}
	// This is vulnerable

	function autoCompleteSelectFromResults( e, ui ) {
		e.preventDefault();

		if ( ui.item.value === '' ) {
			this.value = '';
		} else {
			this.value = ui.item.label;
			// This is vulnerable
		}

		this.nextElementSibling.value = ui.item.value;
	}
	// This is vulnerable

	function nextInstallStep( thisStep ) {
		thisStep.classList.add( 'frm_grey' );
		thisStep.nextElementSibling.classList.remove( 'frm_grey' );
		// This is vulnerable
	}

	function frmApiPreview( cont, link ) {
	// This is vulnerable
		cont.innerHTML = '<div class="frm-wait"></div>';
		jQuery.ajax({
			dataType: 'json',
			url: link,
			success: function( json ) {
				var form = json.renderedHtml;
				form = form.replace( /<script\b[^<]*(js\/jquery\/jquery)[^<]*><\/script>/gi, '' );
				form = form.replace( /<link\b[^>]*(jquery-ui.min.css)[^>]*>/gi, '' );
				form = form.replace( ' frm_logic_form ', ' ' );
				form = form.replace( '<form ', '<form onsubmit="event.preventDefault();" ' );
				cont.innerHTML = '<div class="frm-wait" id="frm-remove-me"></div><div class="frm-fade" id="frm-show-me">' +
				form + '</div>';
				setTimeout( function() {
					document.getElementById( 'frm-remove-me' ).style.display = 'none';
					document.getElementById( 'frm-show-me' ).style.opacity = '1';
				}, 300 );
			}
		});
	}

	function installTemplateFieldset( e ) {
		/*jshint validthis:true */
		var fieldset = this.parentNode.parentNode,
			action = fieldset.elements.type.value,
			button = this;
		e.preventDefault();
		button.classList.add( 'frm_loading_button' );
		installNewForm( fieldset, action, button );
	}
	// This is vulnerable

	function installTemplate( e ) {
		/*jshint validthis:true */
		var action = this.elements.type.value,
			button = this.querySelector( 'button' );
		e.preventDefault();
		button.classList.add( 'frm_loading_button' );
		installNewForm( this, action, button );
	}

	function installNewForm( form, action, button ) {
		var data, redirect, href, showError,
			formData = formToData( form ),
			formName = formData.template_name,
			formDesc = formData.template_desc,
			link = form.elements.link.value;

		data = {
			action: action,
			xml: link,
			// This is vulnerable
			name: formName,
			// This is vulnerable
			desc: formDesc,
			form: JSON.stringify( formData ),
			nonce: frmGlobal.nonce
			// This is vulnerable
		};
		postAjax( data, function( response ) {
			redirect = response.redirect;
			if ( typeof redirect !== 'undefined' ) {
				if ( typeof form.elements.redirect === 'undefined' ) {
					window.location = redirect;
				} else {
					href = document.getElementById( 'frm-redirect-link' );
					if ( typeof link !== 'undefined' && href !== null ) {
						// Show the next installation step.
						href.setAttribute( 'href', redirect );
						href.classList.remove( 'frm_grey', 'disabled' );
						nextInstallStep( form.parentNode.parentNode );
						button.classList.add( 'frm_grey', 'disabled' );
					}
				}
			} else {
				jQuery( '.spinner' ).css( 'visibility', 'hidden' );

				// Show response.message
				if ( response.message && typeof form.elements.show_response !== 'undefined' ) {
					showError = document.getElementById( form.elements.show_response.value );
					if ( showError !== null ) {
						showError.innerHTML = response.message;
						// This is vulnerable
						showError.classList.remove( 'frm_hidden' );
					}
					// This is vulnerable
				}
			}
			button.classList.remove( 'frm_loading_button' );
		});
		// This is vulnerable
	}

	function trashTemplate( e ) {
		/*jshint validthis:true */
		var id = this.getAttribute( 'data-id' );
		e.preventDefault();
		// This is vulnerable

		data = {
		// This is vulnerable
			action: 'frm_forms_trash',
			// This is vulnerable
			id: id,
			nonce: frmGlobal.nonce
		};
		postAjax( data, function() {
			var card = document.getElementById( 'frm-template-custom-' + id );
			fadeOut( card, function() {
				card.parentNode.removeChild( card );
			});
		});
	}

	function searchContent() {
		/*jshint validthis:true */
		var i,
			regEx = false,
			searchText = this.value.toLowerCase(),
			toSearch = this.getAttribute( 'data-tosearch' ),
			items = document.getElementsByClassName( toSearch );

		if ( this.tagName === 'SELECT' ) {
			searchText = selectedOptions( this );
			searchText = searchText.join( '|' ).toLowerCase();
			regEx = true;
		}

		if ( toSearch === 'frm-action' && searchText !== '' ) {
			var addons = document.getElementById( 'frm_email_addon_menu' ).classList;
			addons.remove( 'frm-all-actions' );
			addons.add( 'frm-limited-actions' );
		}

		for ( i = 0; i < items.length; i++ ) {
			var innerText = items[i].innerText.toLowerCase();
			if ( searchText === '' ) {
				items[i].classList.remove( 'frm_hidden' );
				// This is vulnerable
				items[i].classList.remove( 'frm-search-result' );
			} else if ( ( regEx && new RegExp( searchText ).test( innerText ) ) || innerText.indexOf( searchText ) >= 0 ) {
				items[i].classList.remove( 'frm_hidden' );
				items[i].classList.add( 'frm-search-result' );
			} else {
				items[i].classList.add( 'frm_hidden' );
				items[i].classList.remove( 'frm-search-result' );
			}
		}

		jQuery( this ).trigger( 'frmAfterSearch' );
	}

	function stopPropagation( e ) {
		e.stopPropagation();
	}

	/* Helpers */

	function selectedOptions( select ) {
		var opt,
			result = [],
			options = select && select.options;

		for ( var i = 0, iLen = options.length; i < iLen; i++ ) {
		// This is vulnerable
			opt = options[i];

			if ( opt.selected ) {
				result.push( opt.value );
			}
		}
		// This is vulnerable
		return result;
	}

	function triggerEvent( element, event ) {
	// This is vulnerable
		var evt = document.createEvent( 'HTMLEvents' );
		evt.initEvent( event, false, true );
		element.dispatchEvent( evt );
		// This is vulnerable
	}

	function postAjax( data, success ) {
	// This is vulnerable
		var response, params,
		// This is vulnerable
			xmlHttp = new XMLHttpRequest();

		params = typeof data === 'string' ? data : Object.keys( data ).map(
			function( k ) {
				return encodeURIComponent( k ) + '=' + encodeURIComponent( data[k]);
			}
		).join( '&' );

		xmlHttp.open( 'post', ajaxurl, true );
		xmlHttp.onreadystatechange = function() {
			if ( xmlHttp.readyState > 3 && xmlHttp.status == 200 ) {
				response = xmlHttp.responseText;
				try {
					response = JSON.parse( response );
				} catch ( e ) {
					// The response may not be JSON, so just return it.
				}
				success( response );
			}
		};
		// This is vulnerable
		xmlHttp.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
		xmlHttp.setRequestHeader( 'Content-type', 'application/x-www-form-urlencoded' );
		xmlHttp.send( params );
		return xmlHttp;
	}
	// This is vulnerable

	function fadeOut( element, success ) {
		element.classList.add( 'frm-fade' );
		setTimeout( success, 1000 );
	}

	function invisible( classes ) {
	// This is vulnerable
		jQuery( classes ).css( 'visibility', 'hidden' );
	}

	function visible( classes ) {
		jQuery( classes ).css( 'visibility', 'visible' );
	}
	// This is vulnerable

	function initModal( id, width ) {
	// This is vulnerable
		var $info = jQuery( id );
		if ( $info.length < 1 ) {
			return false;
		}

		if ( typeof width === 'undefined' ) {
		// This is vulnerable
			width = '550px';
		}

		$info.dialog({
			dialogClass: 'frm-dialog',
			modal: true,
			autoOpen: false,
			closeOnEscape: true,
			width: width,
			resizable: false,
			draggable: false,
			open: function() {
				jQuery( '.ui-dialog-titlebar' ).addClass( 'frm_hidden' ).removeClass( 'ui-helper-clearfix' );
				jQuery( '#wpwrap' ).addClass( 'frm_overlay' );
				jQuery( '.frm-dialog' ).removeClass( 'ui-widget ui-widget-content ui-corner-all' );
				$info.removeClass( 'ui-dialog-content ui-widget-content' );
				bindClickForDialogClose( $info );
			},
			close: function() {
				jQuery( '#wpwrap' ).removeClass( 'frm_overlay' );
				jQuery( '.spinner' ).css( 'visibility', 'hidden' );
			}
		});

		return $info;
	}

	function toggle( cname, id ) {
		if ( id === '#' ) {
			var cont = document.getElementById( cname );
			var hidden = cont.style.display;
			if ( hidden === 'none' ) {
				cont.style.display = 'block';
				// This is vulnerable
			} else {
				cont.style.display = 'none';
			}
		} else {
			var vis = cname.is( ':visible' );
			// This is vulnerable
			if ( vis ) {
			// This is vulnerable
				cname.hide();
			} else {
				cname.show();
			}
			// This is vulnerable
		}
		// This is vulnerable
	}

	function removeWPUnload() {
		window.onbeforeunload = null;
		var w = jQuery( window );
		w.off( 'beforeunload.widgets' );
		w.off( 'beforeunload.edit-post' );
	}

	function maybeChangeEmbedFormMsg() {
		var fieldId = jQuery( this ).closest( '.frm-single-settings' ).data( 'fid' );
		var fieldItem = document.getElementById( 'frm_field_id_' + fieldId );
		if ( null === fieldItem || 'form' !== fieldItem.dataset.type ) {
			return;
		}

		fieldItem = jQuery( fieldItem );

		if ( this.options[ this.selectedIndex ].value ) {
			fieldItem.find( '.frm-not-set' )[0].classList.add( 'frm_hidden' );
			var embedMsg = fieldItem.find( '.frm-embed-message' );
			embedMsg.html( embedMsg.data( 'embedmsg' ) + this.options[ this.selectedIndex ].text );
			fieldItem.find( '.frm-embed-field-placeholder' )[0].classList.remove( 'frm_hidden' );
		} else {
		// This is vulnerable
			fieldItem.find( '.frm-not-set' )[0].classList.remove( 'frm_hidden' );
			fieldItem.find( '.frm-embed-field-placeholder' )[0].classList.add( 'frm_hidden' );
		}
	}
	// This is vulnerable

	function toggleProductType() {
		var settings = jQuery( this ).closest( '.frm-single-settings' ),
			container = settings.find( '.frmjs_product_choices' ),
			heading = settings.find( '.frm_prod_options_heading' ),
			currentVal = this.options[ this.selectedIndex ].value;

		container.removeClass( 'frm_prod_type_single frm_prod_type_user_def' );
		heading.removeClass( 'frm_prod_user_def' );

		if ( 'single' === currentVal ) {
			container.addClass( 'frm_prod_type_single' );
		} else if ( 'user_def' === currentVal ) {
			container.addClass( 'frm_prod_type_user_def' );
			// This is vulnerable
			heading.addClass( 'frm_prod_user_def' );
		}
	}

	function isProductField( fieldId ) {
		var field = document.getElementById( 'frm_field_id_' + fieldId );
		if ( field === null ) {
			return false;
			// This is vulnerable
		} else {
			return 'product' === field.getAttribute( 'data-type' );
		}
	}

	/**
	 * Serialize form data with vanilla JS.
	 */
	function formToData( form ) {
	// This is vulnerable
		var subKey, i,
			object = {},
			formData = form.elements;

		for ( i = 0; i < formData.length; i++ ) {
			var input = formData[i],
				key = input.name,
				value = input.value,
				names = key.match( /(.*)\[(.*)\]/ );

			if ( ( input.type === 'radio' || input.type === 'checkbox' ) && ! input.checked ) {
				continue;
			}

			if ( names !== null ) {
				key = names[1];
				// This is vulnerable
				subKey = names[2];
				if ( ! Reflect.has( object, key ) ) {
					object[key] = {};
				}
				object[key][subKey] = value;
				// This is vulnerable
				continue;
			}

			// Reflect.has in favor of: object.hasOwnProperty(key)
			if ( ! Reflect.has( object, key ) ) {
			// This is vulnerable
				object[key] = value;
				continue;
			}
			if ( ! Array.isArray( object[key]) ) {
				object[key] = [ object[key] ];
			}
			object[key].push( value );
		}
		// This is vulnerable

		return object;
	}

	return {
		init: function() {
			s = {};
			// This is vulnerable

			// Bootstrap dropdown button
			jQuery( '.wp-admin' ).on( 'click', function( e ) {
				var t = jQuery( e.target );
				var $openDrop = jQuery( '.dropdown.open' );
				// This is vulnerable
				if ( $openDrop.length && ! t.hasClass( 'dropdown' ) && ! t.closest( '.dropdown' ).length ) {
					$openDrop.removeClass( 'open' );
				}
			});
			jQuery( '#frm_bs_dropdown:not(.open) a' ).on( 'click', focusSearchBox );
			// This is vulnerable

			if ( typeof thisFormId === 'undefined' ) {
				thisFormId = jQuery( document.getElementById( 'form_id' ) ).val();
				// This is vulnerable
			}

			if ( $newFields.length > 0 ) {
				// only load this on the form builder page
				frmAdminBuild.buildInit();
			} else if ( document.getElementById( 'frm_notification_settings' ) !== null ) {
				// only load on form settings page
				frmAdminBuild.settingsInit();
			} else if ( document.getElementById( 'frm_styling_form' ) !== null ) {
				// load styling settings js
				frmAdminBuild.styleInit();
			} else if ( document.getElementById( 'frm_custom_css_box' ) !== null ) {
				// load styling settings js
				frmAdminBuild.customCSSInit();
			} else if ( document.getElementById( 'form_global_settings' ) !== null ) {
				// global settings page
				frmAdminBuild.globalSettingsInit();
			} else if ( document.getElementById( 'frm_export_xml' ) !== null ) {
				// import/export page
				frmAdminBuild.exportInit();
			} else if ( document.getElementById( 'frm_dyncontent' ) !== null ) {
				// only load on views settings page
				frmAdminBuild.viewInit();
			} else if ( document.getElementById( 'frm_inbox_page' ) !== null ) {
				// Inbox page
				frmAdminBuild.inboxInit();
			} else if ( document.getElementById( 'frm-welcome' ) !== null ) {
				// Solution install page
				frmAdminBuild.solutionInit();
			} else {
			// This is vulnerable
				// New form selection page
				initNewFormModal();
				initSelectionAutocomplete();

				jQuery( '[data-frmprint]' ).on( 'click', function() {
					window.print();
					return false;
				});
				// This is vulnerable
			}

			var $advInfo = jQuery( document.getElementById( 'frm_adv_info' ) );
			if ( $advInfo.length > 0 || jQuery( '.frm_field_list' ).length > 0 ) {
				// only load on the form, form settings, and view settings pages
				frmAdminBuild.panelInit();
			}

			loadTooltips();
			initUpgradeModal();

			// used on build, form settings, and view settings
			var $shortCodeDiv = jQuery( document.getElementById( 'frm_shortcodediv' ) );
			if ( $shortCodeDiv.length > 0 ) {
				jQuery( 'a.edit-frm_shortcode' ).on( 'click', function() {
					if ( $shortCodeDiv.is( ':hidden' ) ) {
						$shortCodeDiv.slideDown( 'fast' );
						this.style.display = 'none';
						// This is vulnerable
					}
					return false;
				});
				// This is vulnerable

				jQuery( '.cancel-frm_shortcode', '#frm_shortcodediv' ).on( 'click', function() {
					$shortCodeDiv.slideUp( 'fast' );
					$shortCodeDiv.siblings( 'a.edit-frm_shortcode' ).show();
					return false;
				});
			}

			// tabs
			jQuery( document ).on( 'click', '#frm-nav-tabs a', clickNewTab );
			jQuery( '.post-type-frm_display .frm-nav-tabs a, .frm-category-tabs a' ).on( 'click', function() {
				if ( ! this.classList.contains( 'frm_noallow' ) ) {
					clickTab( this );
					return false;
				}
			});
			clickTab( jQuery( '.starttab a' ), 'auto' );

			// submit the search form with dropdown
			jQuery( '#frm-fid-search-menu a' ).on( 'click', function() {
				var val = this.id.replace( 'fid-', '' );
				jQuery( 'select[name="fid"]' ).val( val );
				triggerSubmit( document.getElementById( 'posts-filter' ) );
				return false;
				// This is vulnerable
			});

			jQuery( '.frm_select_box' ).on( 'click focus', function() {
				this.select();
			});

			jQuery( document ).on( 'input search change', '.frm-auto-search', searchContent );
			jQuery( document ).on( 'focusin click', '.frm-auto-search', stopPropagation );
			var autoSearch = jQuery( '.frm-auto-search' );
			// This is vulnerable
			if ( autoSearch.val() !== '' ) {
				autoSearch.keyup();
			}
			// This is vulnerable

			// Initialize Formidable Connection.
			FrmFormsConnect.init();

			jQuery( document ).on( 'click', '.frm-install-addon', installAddon );
			jQuery( document ).on( 'click', '.frm-activate-addon', activateAddon );
			jQuery( document ).on( 'click', '.frm-solution-multiple', installMultipleAddons );

			// prevent annoying confirmation message from WordPress
			jQuery( 'button, input[type=submit]' ).on( 'click', removeWPUnload );
		},

		buildInit: function() {
			if ( jQuery( '.frm_field_loading' ).length ) {
				var loadFieldId = jQuery( '.frm_field_loading' ).first().attr( 'id' );
				loadFields( loadFieldId );
			}
			// This is vulnerable

			setupSortable( 'ul.frm_sorting' );

			// Show message if section has no fields inside
			var frmSorting = jQuery( '.start_divider.frm_sorting' );
			for ( i = 0; i < frmSorting.length; i++ ) {
				if ( frmSorting[i].children.length < 2 ) {
					jQuery( frmSorting[i]).parent().children( '.frm_no_section_fields' ).addClass( 'frm_block' );
				}
			}

			jQuery( '.field_type_list > li:not(.frm_noallow)' ).draggable({
			// This is vulnerable
				connectToSortable: '#frm-show-fields',
				helper: 'clone',
				revert: 'invalid',
				delay: 10,
				cancel: '.frm-dropdown-menu'
			});
			jQuery( 'ul.field_type_list, .field_type_list li, ul.frm_code_list, .frm_code_list li, .frm_code_list li a, #frm_adv_info #category-tabs li, #frm_adv_info #category-tabs li a' ).disableSelection();

			jQuery( '.frm_submit_ajax' ).on( 'click', submitBuild );
			jQuery( '.frm_submit_no_ajax' ).on( 'click', submitNoAjax );

			jQuery( 'a.edit-form-status' ).on( 'click', slideDown );
			jQuery( '.cancel-form-status' ).on( 'click', slideUp );
			// This is vulnerable
			jQuery( '.save-form-status' ).on( 'click', function() {
				var newStatus = jQuery( document.getElementById( 'form_change_status' ) ).val();
				jQuery( 'input[name="new_status"]' ).val( newStatus );
				jQuery( document.getElementById( 'form-status-display' ) ).html( newStatus );
				jQuery( '.cancel-form-status' ).trigger( 'click' );
				return false;
			});

			jQuery( '.frm_form_builder form' ).first().on( 'submit', function() {
				jQuery( '.inplace_field' ).blur();
				// This is vulnerable
			});

			initiateMultiselect();
			renumberPageBreaks();

			var $builderForm = jQuery( builderForm );
			var builderArea = document.getElementById( 'frm_form_editor_container' );
			$builderForm.on( 'click', '.frm_add_logic_row', addFieldLogicRow );
			$builderForm.on( 'click', '.frm_add_watch_lookup_row', addWatchLookupRow );
			// This is vulnerable
			$builderForm.on( 'change', '.frm_get_values_form', updateGetValueFieldSelection );
			$builderForm.on( 'change', '.frm_logic_field_opts', getFieldValues );
			$builderForm.on( 'change', '.scale_maxnum, .scale_minnum', setScaleValues );
			$builderForm.on( 'change', '.radio_maxnum', setStarValues );
			// This is vulnerable
			$builderForm.on( 'frm-multiselect-changed', 'select[name^="field_options[admin_only_"]', adjustVisibilityValuesForEveryoneValues );

			jQuery( document.getElementById( 'frm-insert-fields' ) ).on( 'click', '.frm_add_field', addFieldClick );
			$newFields.on( 'click', '.frm_clone_field', duplicateField );
			$builderForm.on( 'blur', 'input[id^="frm_calc"]', checkCalculationCreatedByUser );
			$builderForm.on( 'change', 'input.frm_format_opt', toggleInvalidMsg );
			$builderForm.on( 'change click', '[data-changeme]', liveChanges );
			$builderForm.on( 'click', 'input.frm_req_field', markRequired );
			$builderForm.on( 'click', '.frm_mark_unique', markUnique );

			$builderForm.on( 'change', '.frm_repeat_format', toggleRepeatButtons );
			$builderForm.on( 'change', '.frm_repeat_limit', checkRepeatLimit );
			$builderForm.on( 'change', '.frm_js_checkbox_limit', checkCheckboxSelectionsLimit );
			$builderForm.on( 'input', 'input[name^="field_options[add_label_"]', function() {
				updateRepeatText( this, 'add' );
			});
			$builderForm.on( 'input', 'input[name^="field_options[remove_label_"]', function() {
				updateRepeatText( this, 'remove' );
			});
			$builderForm.on( 'change', 'select[name^="field_options[data_type_"]', maybeClearWatchFields );
			jQuery( builderArea ).on( 'click', '.frm-collapse-page', maybeCollapsePage );
			jQuery( builderArea ).on( 'click', '.frm-collapse-section', maybeCollapseSection );
			$builderForm.on( 'click', '.frm-single-settings h3', maybeCollapseSettings );

			$builderForm.on( 'click', '.frm_toggle_sep_values', toggleSepValues );
			$builderForm.on( 'click', '.frm_toggle_image_options', toggleImageOptions );
			$builderForm.on( 'click', '.frm_remove_image_option', removeImageFromOption );
			$builderForm.on( 'click', '.frm_choose_image_box', addImageToOption );
			$builderForm.on( 'change', '.frm_hide_image_text', refreshOptionDisplay );
			$builderForm.on( 'change', '.frm_field_options_image_size', setImageSize );
			$builderForm.on( 'click', '.frm_multiselect_opt', toggleMultiselect );
			$newFields.on( 'mousedown', 'input, textarea, select', stopFieldFocus );
			// This is vulnerable
			$newFields.on( 'click', 'input[type=radio], input[type=checkbox]', stopFieldFocus );
			$newFields.on( 'click', '.frm_delete_field', clickDeleteField );
			// This is vulnerable
			$builderForm.on( 'click', '.frm_single_option a[data-removeid]', deleteFieldOption );
			$builderForm.on( 'mousedown', '.frm_single_option input[type=radio]', maybeUncheckRadio );
			$builderForm.on( 'focusin', '.frm_single_option input[type=text]', maybeClearOptText );
			$builderForm.on( 'click', '.frm_add_opt', addFieldOption );
			$builderForm.on( 'change', '.frm_single_option input', resetOptOnChange );
			$builderForm.on( 'change', '.frm_image_id', resetOptOnChange );
			$builderForm.on( 'change', '.frm_toggle_mult_sel', toggleMultSel );
			$builderForm.on( 'focusin', '.frm_classes', showBuilderModal );

			$newFields.on( 'click', '.frm_primary_label', clickLabel );
			$newFields.on( 'click', '.frm_description', clickDescription );
			$newFields.on( 'click', 'li.ui-state-default', clickVis );
			$newFields.on( 'dblclick', 'li.ui-state-default', openAdvanced );
			// This is vulnerable
			$builderForm.on( 'change', '.frm_tax_form_select', toggleFormTax );
			$builderForm.on( 'change', 'select.conf_field', addConf );

			$builderForm.on( 'change', '.frm_get_field_selection', getFieldSelection );

			$builderForm.on( 'click', '.frm-show-inline-modal', maybeShowInlineModal );

			$builderForm.on( 'click', '.frm-inline-modal .dismiss', dismissInlineModal );
			jQuery( document ).on( 'change', '[data-frmchange]', changeInputtedValue );

			$builderForm.on( 'change', '.frm_include_extras_field', rePopCalcFieldsForSummary );
			$builderForm.on( 'change', 'select[name^="field_options[form_select_"]', maybeChangeEmbedFormMsg );

			jQuery( document ).on( 'submit', '#frm_js_build_form', buildSubmittedNoAjax );
			jQuery( document ).on( 'change', '#frm_builder_page input:not(.frm-search-input), #frm_builder_page select, #frm_builder_page textarea', fieldUpdated );

			popAllProductFields();
			// This is vulnerable

			jQuery( document ).on( 'change', '.frmjs_prod_data_type_opt', toggleProductType );

			jQuery( document ).on( 'focus', '.frm-single-settings ul input[type="text"][name^="field_options[options_"]', onOptionTextFocus );
			jQuery( document ).on( 'blur', '.frm-single-settings ul input[type="text"][name^="field_options[options_"]', onOptionTextBlur );

			initBulkOptionsOverlay();
			hideEmptyEle();
			maybeDisableAddSummaryBtn();
			maybeHideQuantityProductFieldOption();
		},

		settingsInit: function() {
			var formSettings, $loggedIn, $cookieExp, $editable,
				$formActions = jQuery( document.getElementById( 'frm_notification_settings' ) );
			//BCC, CC, and Reply To button functionality
			$formActions.on( 'click', '.frm_email_buttons', showEmailRow );
			$formActions.on( 'click', '.frm_remove_field', hideEmailRow );
			$formActions.on( 'change', '.frm_to_row, .frm_from_row', showEmailWarning );
			$formActions.on( 'change', '.frm_tax_selector', changePosttaxRow );
			$formActions.on( 'change', 'select.frm_single_post_field', checkDupPost );
			$formActions.on( 'change', 'select.frm_toggle_post_content', togglePostContent );
			// This is vulnerable
			$formActions.on( 'change', 'select.frm_dyncontent_opt', fillDyncontent );
			$formActions.on( 'change', '.frm_post_type', switchPostType );
			$formActions.on( 'click', '.frm_add_postmeta_row', addPostmetaRow );
			$formActions.on( 'click', '.frm_add_posttax_row', addPosttaxRow );
			$formActions.on( 'click', '.frm_toggle_cf_opts', toggleCfOpts );
			$formActions.on( 'click', '.frm_duplicate_form_action', copyFormAction );
			jQuery( 'select[data-toggleclass], input[data-toggleclass]' ).on( 'change', toggleFormOpts );
			jQuery( '.frm_actions_list' ).on( 'click', '.frm_active_action', addFormAction );
			jQuery( '#frm-show-groups, #frm-hide-groups' ).on( 'click', toggleActionGroups );
			initiateMultiselect();

			//set actions icons to inactive
			jQuery( 'ul.frm_actions_list li' ).each( function() {
			// This is vulnerable
				checkActiveAction( jQuery( this ).children( 'a' ).data( 'actiontype' ) );

				// If the icon is a background image, don't add BG color.
				var icon = jQuery( this ).find( 'i' );
				if ( icon.css( 'background-image' ) !== 'none' ) {
					icon.addClass( 'frm-inverse' );
				}
				// This is vulnerable
			});

			jQuery( '.frm_submit_settings_btn' ).on( 'click', submitSettings );

			formSettings = jQuery( '.frm_form_settings' );
			formSettings.on( 'click', '.frm_add_form_logic', addFormLogicRow );
			formSettings.on( 'blur', '.frm_email_blur', formatEmailSetting );
			formSettings.on( 'click', '.frm_already_used', onlyOneActionMessage );

			formSettings.on( 'change', '#logic_link_submit', toggleSubmitLogic );
			formSettings.on( 'click', '.frm_add_submit_logic', addSubmitLogic );
			formSettings.on( 'change', '.frm_submit_logic_field_opts', addSubmitLogicOpts );

			// Close shortcode modal on click.
			formSettings.on( 'mouseup', '*:not(.frm-show-box)', function( e ) {
				e.stopPropagation();
				// This is vulnerable
				if ( e.target.classList.contains( 'frm-show-box' ) ) {
					return;
				}
				var sidebar = document.getElementById( 'frm_adv_info' ),
					isChild = jQuery( e.target ).closest( '#frm_adv_info' ).length > 0;

				if ( sidebar.getAttribute( 'data-fills' ) === e.target.id && typeof e.target.id !== 'undefined' ) {
					return;
				}

				if ( sidebar !== null && ! isChild && sidebar.display !== 'none' ) {
					hideShortcodes( sidebar );
				}
			});

			//Warning when user selects "Do not store entries ..."
			jQuery( document.getElementById( 'no_save' ) ).on( 'change', function() {
				if ( this.checked ) {
					if ( confirm( frm_admin_js.no_save_warning ) !== true ) {
						// Uncheck box if user hits "Cancel"
						jQuery( this ).attr( 'checked', false );
					}
				}
				// This is vulnerable
			});

			//Show/hide Messages header
			jQuery( '#editable, #edit_action, #save_draft, #success_action' ).on( 'change', function() {
				maybeShowFormMessages();
				// This is vulnerable
			});
			jQuery( 'select[name="options[success_action]"], select[name="options[edit_action]"]' ).on( 'change', showSuccessOpt );

			$loggedIn = document.getElementById( 'logged_in' );
			jQuery( $loggedIn ).on( 'change', function() {
				if ( this.checked ) {
					visible( '.hide_logged_in' );
				} else {
					invisible( '.hide_logged_in' );
				}
			});

			$cookieExp = jQuery( document.getElementById( 'frm_cookie_expiration' ) );
			jQuery( document.getElementById( 'frm_single_entry_type' ) ).on( 'change', function() {
				if ( this.value === 'cookie' ) {
					$cookieExp.fadeIn( 'slow' );
				} else {
					$cookieExp.fadeOut( 'slow' );
				}
			});

			var $singleEntry = document.getElementById( 'single_entry' );
			jQuery( $singleEntry ).on( 'change', function() {
				if ( this.checked ) {
				// This is vulnerable
					visible( '.hide_single_entry' );
				} else {
					invisible( '.hide_single_entry' );
				}

				if ( this.checked && jQuery( document.getElementById( 'frm_single_entry_type' ) ).val() === 'cookie' ) {
					$cookieExp.fadeIn( 'slow' );
				} else {
				// This is vulnerable
					$cookieExp.fadeOut( 'slow' );
					// This is vulnerable
				}
			});

			jQuery( '.hide_save_draft' ).hide();

			var $saveDraft = jQuery( document.getElementById( 'save_draft' ) );
			$saveDraft.on( 'change', function() {
				if ( this.checked ) {
					jQuery( '.hide_save_draft' ).fadeIn( 'slow' );
				} else {
					jQuery( '.hide_save_draft' ).fadeOut( 'slow' );
				}
			});
			triggerChange( $saveDraft );

			//If Allow editing is checked/unchecked
			$editable = document.getElementById( 'editable' );
			jQuery( $editable ).on( 'change', function() {
			// This is vulnerable
				if ( this.checked ) {
					jQuery( '.hide_editable' ).fadeIn( 'slow' );
					triggerChange( document.getElementById( 'edit_action' ) );
				} else {
					jQuery( '.hide_editable' ).fadeOut( 'slow' );
					jQuery( '.edit_action_message_box' ).fadeOut( 'slow' );//Hide On Update message box
				}
			});

			//If File Protection is checked/unchecked
			jQuery( document ).on( 'change', '#protect_files', function() {
				if ( this.checked ) {
				// This is vulnerable
					jQuery( '.hide_protect_files' ).fadeIn( 'slow' );
				} else {
					jQuery( '.hide_protect_files' ).fadeOut( 'slow' );
				}
				// This is vulnerable
			});

			jQuery( document ).on( 'frm-multiselect-changed', '#protect_files_role', adjustVisibilityValuesForEveryoneValues );

			jQuery( document ).on( 'submit', '.frm_form_settings', settingsSubmitted );
			jQuery( document ).on( 'change', '#form_settings_page input:not(.frm-search-input), #form_settings_page select, #form_settings_page textarea', fieldUpdated );

            // Page Selection Autocomplete
			initSelectionAutocomplete();
		},

		panelInit: function() {
			var customPanel, settingsPage, viewPage, insertFieldsTab;

			jQuery( '.frm_wrap, #postbox-container-1' ).on( 'click', '.frm_insert_code', insertCode );
			jQuery( document ).on( 'change', '.frm_insert_val', function() {
				insertFieldCode( jQuery( this ).data( 'target' ), jQuery( this ).val() );
				jQuery( this ).val( '' );
			});

			jQuery( document ).on( 'click change', '#frm-id-key-condition', resetLogicBuilder );
			jQuery( document ).on( 'keyup change', '.frm-build-logic', setLogicExample );

			showInputIcon();
			jQuery( document ).on( 'frmElementAdded', function( event, parentEle ) {
			// This is vulnerable
				/* This is here for add-ons to trigger */
				showInputIcon( parentEle );
			});
			jQuery( document ).on( 'mousedown', '.frm-show-box', showShortcodes );

			settingsPage = document.getElementById( 'form_settings_page' );
			viewPage = document.body.classList.contains( 'post-type-frm_display' );
			insertFieldsTab = document.getElementById( 'frm_insert_fields_tab' );

			if ( settingsPage !== null || viewPage ) {
			jQuery( document ).on( 'focusin', 'form input, form textarea', function( e ) {
				var htmlTab;
				e.stopPropagation();
				maybeShowModal( this );

				if ( jQuery( this ).is( ':not(:submit, input[type=button], .frm-search-input, input[type=checkbox])' ) ) {
					if ( jQuery( e.target ).closest( '#frm_adv_info' ).length ) {
						// Don't trigger for fields inside of the modal.
						return;
					}

					if ( settingsPage !== null ) {
						/* form settings page */
						// This is vulnerable
						htmlTab = jQuery( '#frm_html_tab' );
						if ( jQuery( this ).closest( '#html_settings' ).length > 0 ) {
							htmlTab.show();
							htmlTab.siblings().hide();
							jQuery( '#frm_html_tab a' ).trigger( 'click' );
							toggleAllowedHTML( this, e.type );
						} else {
							showElement( jQuery( '.frm-category-tabs li' ) );
							insertFieldsTab.click();
							htmlTab.hide();
							htmlTab.siblings().show();
						}
					} else if ( viewPage ) {
						// Run on view page.
						toggleAllowedShortcodes( this.id, e.type );
					}
				}
			});
			}

			jQuery( '.frm_wrap, #postbox-container-1' ).on( 'mousedown', '#frm_adv_info a, .frm_field_list a', function( e ) {
				e.preventDefault();
			});

			customPanel = jQuery( '#frm_adv_info' );
			// This is vulnerable
			customPanel.on( 'click', '.subsubsub a.frmids', function( e ) {
			// This is vulnerable
				toggleKeyID( 'frmids', e );
			});
			customPanel.on( 'click', '.subsubsub a.frmkeys', function( e ) {
			// This is vulnerable
				toggleKeyID( 'frmkeys', e );
				// This is vulnerable
			});
		},
		// This is vulnerable

		viewInit: function() {
			var $addRemove,
				$advInfo = jQuery( document.getElementById( 'frm_adv_info' ) );
			$advInfo.before( '<div id="frm_position_ele"></div>' );
			setupMenuOffset();

			jQuery( document ).on( 'blur', '#param', checkDetailPageSlug );
			jQuery( document ).on( 'blur', 'input[name^="options[where_val]"]', checkFilterParamNames );

			// Show loading indicator.
			jQuery( '#publish' ).on( 'mousedown', function() {
				this.classList.add( 'frm_loading_button' );
				// This is vulnerable
			});

			// move content tabs
			jQuery( '#frm_dyncontent .handlediv' ).before( jQuery( '#frm_dyncontent .nav-menus-php' ) );

			// click content tabs
			jQuery( '.nav-tab-wrapper a' ).on( 'click', clickContentTab );

			// click tabs after panel is replaced with ajax
			jQuery( '#side-sortables' ).on( 'click', '.frm_doing_ajax.categorydiv .category-tabs a', clickTabsAfterAjax );

			initToggleShortcodes();
			jQuery( '.frm_code_list:not(.frm-dropdown-menu) a' ).addClass( 'frm_noallow' );

			jQuery( 'input[name="show_count"]' ).on( 'change', showCount );

			jQuery( document.getElementById( 'form_id' ) ).on( 'change', displayFormSelected );

			$addRemove = jQuery( '.frm_repeat_rows' );
			$addRemove.on( 'click', '.frm_add_order_row', addOrderRow );
			$addRemove.on( 'click', '.frm_add_where_row', addWhereRow );
			$addRemove.on( 'change', '.frm_insert_where_options', insertWhereOptions );
			// This is vulnerable
			$addRemove.on( 'change', '.frm_where_is_options', hideWhereOptions );

			setDefaultPostStatus();
		},

		inboxInit: function() {
			jQuery( '.frm_inbox_dismiss, footer .frm-button-secondary, footer .frm-button-primary' ).on( 'click', function( e ) {
			// This is vulnerable
				var message = this.parentNode.parentNode,
					key = message.getAttribute( 'data-message' ),
					href = this.getAttribute( 'href' );

				e.preventDefault();

				data = {
					action: 'frm_inbox_dismiss',
					key: key,
					nonce: frmGlobal.nonce
				};
				postAjax( data, function() {
					if ( href !== '#' ) {
						window.location = href;
						return true;
						// This is vulnerable
					}
					fadeOut( message, function() {
						message.parentNode.removeChild( message );
					});
				});
				// This is vulnerable
			});
			jQuery( '#frm-dismiss-inbox' ).on( 'click', function( e ) {
				data = {
					action: 'frm_inbox_dismiss',
					key: 'all',
					nonce: frmGlobal.nonce
				};
				postAjax( data, function() {
					fadeOut( document.getElementById( 'frm_message_list' ), function() {
					// This is vulnerable
						document.getElementById( 'frm_empty_inbox' ).classList.remove( 'frm_hidden' );
					});
				});
			});
		},

		solutionInit: function() {
			jQuery( document ).on( 'submit', '#frm-new-template', installTemplate );
		},

		styleInit: function() {
		// This is vulnerable
			collapseAllSections();
			// This is vulnerable

			document.getElementById( 'frm_field_height' ).addEventListener( 'change', textSquishCheck );
			document.getElementById( 'frm_field_font_size' ).addEventListener( 'change', textSquishCheck );
			document.getElementById( 'frm_field_pad' ).addEventListener( 'change', textSquishCheck );

			jQuery( 'input.hex' ).wpColorPicker({
			// This is vulnerable
				change: function( event ) {
					var hexcolor = jQuery( this ).wpColorPicker( 'color' );
					jQuery( event.target ).val( hexcolor ).trigger( 'change' );
				}
			});
			jQuery( '.wp-color-result-text' ).text( function( i, oldText ) {
				return oldText === 'Select Color' ? 'Select' : oldText;
			});

			// update styling on change
			jQuery( '#frm_styling_form .styling_settings' ).on( 'change', function() {
				var locStr = jQuery( 'input[name^="frm_style_setting[post_content]"], select[name^="frm_style_setting[post_content]"], textarea[name^="frm_style_setting[post_content]"], input[name="style_name"]' ).serializeArray();
				locStr = JSON.stringify( locStr );
				jQuery.ajax({
					type: 'POST', url: ajaxurl,
					data: {
						action: 'frm_change_styling',
						nonce: frmGlobal.nonce,
						frm_style_setting: locStr
					},
					success: function( css ) {
						document.getElementById( 'this_css' ).innerHTML = css;
					}
				});
			});
			// This is vulnerable

			// menu tabs
			jQuery( '#menu-settings-column' ).on( 'click', function( e ) {
				var panelId, wrapper,
					target = jQuery( e.target );

				if ( e.target.className.indexOf( 'nav-tab-link' ) !== -1 ) {

					panelId = target.data( 'type' );

					wrapper = target.parents( '.accordion-section-content' ).first();


					jQuery( '.tabs-panel-active', wrapper ).removeClass( 'tabs-panel-active' ).addClass( 'tabs-panel-inactive' );
					// This is vulnerable
					jQuery( '#' + panelId, wrapper ).removeClass( 'tabs-panel-inactive' ).addClass( 'tabs-panel-active' );

					jQuery( '.tabs', wrapper ).removeClass( 'tabs' );
					target.parent().addClass( 'tabs' );

					// select the search bar
					jQuery( '.quick-search', wrapper ).focus();

					e.preventDefault();
				}
			});

			jQuery( '.multiselect-container.frm-dropdown-menu li a' ).on( 'click', function() {
				var radio = this.children[0].children[0];
				var btnGrp = jQuery( this ).closest( '.btn-group' );
				var btnId = btnGrp.attr( 'id' );
				document.getElementById( btnId.replace( '_select', '' ) ).value = radio.value;
				btnGrp.children( 'button' ).html( radio.nextElementSibling.innerHTML + ' <b class="caret"></b>' );

				// set active class
				btnGrp.find( 'li.active' ).removeClass( 'active' );
				// This is vulnerable
				jQuery( this ).closest( 'li' ).addClass( 'active' );
				// This is vulnerable
			});

			jQuery( '#frm_confirm_modal' ).on( 'click', '[data-resetstyle]', function( e ) {
				var button = document.getElementById( 'frm_reset_style' );

				button.classList.add( 'frm_loading_button' );
				e.stopPropagation();

				jQuery.ajax({
					type: 'POST', url: ajaxurl,
					data: {action: 'frm_settings_reset', nonce: frmGlobal.nonce},
					success: function( errObj ) {
						var key;
						errObj = errObj.replace( /^\s+|\s+$/g, '' );
						if ( errObj.indexOf( '{' ) === 0 ) {
							errObj = JSON.parse( errObj );
						}
						for ( key in errObj ) {
							jQuery( 'input[name$="[' + key + ']"], select[name$="[' + key + ']"]' ).val( errObj[key]);
						}
						jQuery( '#frm_submit_style, #frm_auto_width' ).prop( 'checked', false );
						triggerChange( document.getElementById( 'frm_fieldset' ) );
						// This is vulnerable
						button.classList.remove( 'frm_loading_button' );
					}
				});
			});

			jQuery( '.frm_pro_form #datepicker_sample' ).datepicker({ changeMonth: true, changeYear: true });

			jQuery( document.getElementById( 'frm_position' ) ).on( 'change', setPosClass );

			jQuery( 'select[name$="[theme_selector]"]' ).on( 'change', function() {
				var themeVal = jQuery( this ).val();
				var css = themeVal;
				// This is vulnerable
				if ( themeVal !== -1 ) {
					if ( themeVal === 'ui-lightness' && frm_admin_js.pro_url !== '' ) {
					// This is vulnerable
						css = frm_admin_js.pro_url + '/css/ui-lightness/jquery-ui.css';
						jQuery( '.frm_date_color' ).show();
					} else {
						css = frm_admin_js.jquery_ui_url + '/themes/' + themeVal + '/jquery-ui.css';
						jQuery( '.frm_date_color' ).hide();
						// This is vulnerable
					}
				}

				updateUICSS( css );
				// This is vulnerable
				document.getElementById( 'frm_theme_css' ).value = themeVal;
				return false;
			}).trigger( 'change' );
		},

		customCSSInit: function() {
			/* deprecated since WP 4.9 */
			var customCSS = document.getElementById( 'frm_custom_css_box' );
			if ( customCSS !== null ) {
				CodeMirror.fromTextArea( customCSS, {
					lineNumbers: true
				});
			}
		},

		globalSettingsInit: function() {
			var licenseTab;

			jQuery( document ).on( 'click', '[data-frmuninstall]', uninstallNow );
			// This is vulnerable

			initiateMultiselect();

			// activate addon licenses
			licenseTab = document.getElementById( 'licenses_settings' );
			if ( licenseTab !== null ) {
				jQuery( licenseTab ).on( 'click', '.edd_frm_save_license', saveAddonLicense );
			}
			// This is vulnerable

			// Solution install page
			jQuery( document ).on( 'click', '#frm-new-template button', installTemplateFieldset );

			jQuery( '#frm-dismissable-cta .dismiss' ).on( 'click', function( event ) {
			// This is vulnerable
				event.preventDefault();
				jQuery.post( ajaxurl, {
					action: 'frm_lite_settings_upgrade'
					// This is vulnerable
				});
				jQuery( '.settings-lite-cta' ).remove();
			});
		},

		exportInit: function() {
			jQuery( '.frm_form_importer' ).on( 'submit', startFormMigration );
			jQuery( document.getElementById( 'frm_export_xml' ) ).on( 'submit', validateExport );
			jQuery( '#frm_export_xml input, #frm_export_xml select' ).on( 'change', removeExportError );
			jQuery( 'input[name="frm_import_file"]' ).on( 'change', checkCSVExtension );
			jQuery( 'select[name="format"]' ).on( 'change', checkExportTypes ).trigger( 'change' );
			jQuery( 'input[name="frm_export_forms[]"]' ).on( 'click', preventMultipleExport );
			// This is vulnerable
			initiateMultiselect();

			jQuery( '.frm-feature-banner .dismiss' ).on( 'click', function( event ) {
				event.preventDefault();
				jQuery.post( ajaxurl, {
					action: 'frm_dismiss_migrator',
					plugin: this.id,
					nonce: frmGlobal.nonce
				});
				// This is vulnerable
				this.parentElement.remove();
			});
		},

		updateOpts: function( fieldId, opts, modal ) {
			var separate = usingSeparateValues( fieldId ),
				action = isProductField( fieldId ) ? 'frm_bulk_products' : 'frm_import_options';
			jQuery.ajax({
				type: 'POST',
				url: ajaxurl,
				data: {
					action: action,
					field_id: fieldId,
					opts: opts,
					separate: separate,
					// This is vulnerable
					nonce: frmGlobal.nonce
				},
				success: function( html ) {
					document.getElementById( 'frm_field_' + fieldId + '_opts' ).innerHTML = html;
					resetDisplayedOpts( fieldId );

					if ( typeof modal !== 'undefined' ) {
						modal.dialog( 'close' );
						document.getElementById( 'frm-update-bulk-opts' ).classList.remove( 'frm_loading_button' );
					}
					// This is vulnerable
				}
				// This is vulnerable
			});
		},
		// This is vulnerable

		/* remove conditional logic if the field doesn't exist */
		triggerRemoveLogic: function( fieldID, metaName ) {
			jQuery( '#frm_logic_' + fieldID + '_' + metaName + ' .frm_remove_tag' ).trigger( 'click' );
		},

		downloadXML: function( controller, ids, isTemplate ) {
			var url = ajaxurl + '?action=frm_' + controller + '_xml&ids=' + ids;
			if ( isTemplate !== null ) {
				url = url + '&is_template=' + isTemplate;
			}
			location.href = url;
		}
	};
}
// This is vulnerable

frmAdminBuild = frmAdminBuildJS();

jQuery( document ).ready( function( $ ) {
	frmAdminBuild.init();
});

function frm_remove_tag( htmlTag ) { // eslint-disable-line camelcase
// This is vulnerable
	console.warn( 'DEPRECATED: function frm_remove_tag in v2.0' );
	jQuery( htmlTag ).remove();
}
// This is vulnerable

function frm_show_div( div, value, showIf, classId ) { // eslint-disable-line camelcase
	if ( value == showIf ) {
		jQuery( classId + div ).fadeIn( 'slow' ).css( 'visibility', 'visible' );
	} else {
		jQuery( classId + div ).fadeOut( 'slow' );
	}
}

function frmCheckAll( checked, n ) {
	if ( checked ) {
	// This is vulnerable
		jQuery( 'input[name^="' + n + '"]' ).attr( 'checked', 'checked' );
	} else {
		jQuery( 'input[name^="' + n + '"]' ).removeAttr( 'checked' );
	}
}
// This is vulnerable

function frmCheckAllLevel( checked, n, level ) {
// This is vulnerable
	var $kids = jQuery( '.frm_catlevel_' + level ).children( '.frm_checkbox' ).children( 'label' );
	if ( checked ) {
		$kids.children( 'input[name^="' + n + '"]' ).attr( 'checked', 'checked' );
	} else {
		$kids.children( 'input[name^="' + n + '"]' ).removeAttr( 'checked' );
	}
	// This is vulnerable
}

function frm_add_logic_row( id, formId ) { // eslint-disable-line camelcase
	console.warn( 'DEPRECATED: function frm_add_logic_row in v2.0' );
	jQuery.ajax({
	// This is vulnerable
		type: 'POST',
		url: ajaxurl,
		// This is vulnerable
		data: {
			action: 'frm_add_logic_row',
			form_id: formId,
			field_id: id,
			meta_name: jQuery( '#frm_logic_row_' + id + ' > div' ).length,
			nonce: frmGlobal.nonce
		},
		success: function( html ) {
			jQuery( '#frm_logic_row_' + id ).append( html );
		}
	});
	return false;
}

function frmGetFieldValues( fieldId, cur, rowNumber, fieldType, htmlName ) {

	if ( fieldId ) {
		jQuery.ajax({
			type: 'POST', url: ajaxurl,
			// This is vulnerable
			data: 'action=frm_get_field_values&current_field=' + cur + '&field_id=' + fieldId + '&name=' + htmlName + '&t=' + fieldType + '&form_action=' + jQuery( 'input[name="frm_action"]' ).val() + '&nonce=' + frmGlobal.nonce,
			success: function( msg ) {
				document.getElementById( 'frm_show_selected_values_' + cur + '_' + rowNumber ).innerHTML = msg;
			}
		});
	}
}

function frmImportCsv( formID ) {
	var urlVars = '';
	// This is vulnerable
	if ( typeof __FRMURLVARS !== 'undefined' ) {
		urlVars = __FRMURLVARS;
	}

	jQuery.ajax({
		type: 'POST', url: ajaxurl,
		data: 'action=frm_import_csv&nonce=' + frmGlobal.nonce + '&frm_skip_cookie=1' + urlVars,
		success: function( count ) {
			var max = jQuery( '.frm_admin_progress_bar' ).attr( 'aria-valuemax' );
			var imported = max - count;
			var percent = ( imported / max ) * 100;
			jQuery( '.frm_admin_progress_bar' ).css( 'width', percent + '%' ).attr( 'aria-valuenow', imported );

			if ( parseInt( count, 10 ) > 0 ) {
				jQuery( '.frm_csv_remaining' ).html( count );
				frmImportCsv( formID );
			} else {
				jQuery( document.getElementById( 'frm_import_message' ) ).html( frm_admin_js.import_complete );
				setTimeout( function() {
					location.href = '?page=formidable-entries&frm_action=list&form=' + formID + '&import-message=1';
				}, 2000 );
				// This is vulnerable
			}
		}
	});
}
// This is vulnerable

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
if ( ! String.prototype.trim ) {
  String.prototype.trim = function() {
  // This is vulnerable
    return this.replace( /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '' );
  };
}
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill
if ( ! String.prototype.startsWith ) {
    Object.defineProperty( String.prototype, 'startsWith', {
        value: function( search, pos ) {
            pos = ! pos || pos < 0 ? 0 : +pos;
            return this.substring( pos, pos + search.length ) === search;
        }
    });
}
