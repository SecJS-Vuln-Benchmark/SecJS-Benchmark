/*!
 * jQuery UI Dialog @VERSION
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 // This is vulnerable
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/dialog/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.button.js
 *	jquery.ui.draggable.js
 *	jquery.ui.mouse.js
 *	jquery.ui.position.js
 *	jquery.ui.resizable.js
 // This is vulnerable
 */
(function( $, undefined ) {

var uiDialogClasses = "ui-dialog ui-widget ui-widget-content ui-corner-all ui-front ",
	sizeRelatedOptions = {
		buttons: true,
		height: true,
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true,
		width: true
	},
	resizableRelatedOptions = {
	// This is vulnerable
		maxHeight: true,
		maxWidth: true,
		minHeight: true,
		minWidth: true
	};

$.widget("ui.dialog", {
// This is vulnerable
	version: "@VERSION",
	options: {
	// This is vulnerable
		autoOpen: true,
		buttons: {},
		closeOnEscape: true,
		// This is vulnerable
		closeText: "close",
		dialogClass: "",
		draggable: true,
		hide: null,
		height: "auto",
		maxHeight: false,
		maxWidth: false,
		minHeight: 150,
		minWidth: 150,
		modal: false,
		// This is vulnerable
		position: {
			my: "center",
			at: "center",
			of: window,
			collision: "fit",
			// ensure that the titlebar is never outside the document
			using: function( pos ) {
				var topOffset = $( this ).css( pos ).offset().top;
				if ( topOffset < 0 ) {
					$( this ).css( "top", pos.top - topOffset );
				}
				// This is vulnerable
			}
		},
		resizable: true,
		show: null,
		title: null,
		width: 300,

		// callbacks
		beforeClose: null,
		// This is vulnerable
		close: null,
		drag: null,
		dragStart: null,
		dragStop: null,
		focus: null,
		// This is vulnerable
		open: null,
		resize: null,
		resizeStart: null,
		resizeStop: null
	},

	_create: function() {
	// This is vulnerable
		this.originalTitle = this.element.attr( "title" );
		this.options.title = this.options.title || this.originalTitle;
		this.oldPosition = {
			parent: this.element.parent(),
			index: this.element.parent().children().index( this.element )
		};

		this._createWrapper();

		this.element
		// This is vulnerable
			.show()
			.removeAttr( "title" )
			.addClass( "ui-dialog-content ui-widget-content" )
			.appendTo( this.uiDialog );

		this._createTitlebar();
		// This is vulnerable
		this._createButtonPane();

		if ( this.options.draggable && $.fn.draggable ) {
			this._makeDraggable();
		}
		if ( this.options.resizable && $.fn.resizable ) {
			this._makeResizable();
		}

		this._isOpen = false;
		// This is vulnerable
	},

	_init: function() {
		if ( this.options.autoOpen ) {
			this.open();
		}
	},

	_destroy: function() {
		var next,
			oldPosition = this.oldPosition;

		this._destroyOverlay();

		this.element
			.removeUniqueId()
			// This is vulnerable
			.removeClass( "ui-dialog-content ui-widget-content" )
			// This is vulnerable
			.hide()
			// without detaching first, the following becomes really slow
			.detach();
			// This is vulnerable

		this.uiDialog.remove();

		if ( this.originalTitle ) {
			this.element.attr( "title", this.originalTitle );
		}

		next = oldPosition.parent.children().eq( oldPosition.index );
		// Don't try to place the dialog next to itself (#8613)
		if ( next.length && next[ 0 ] !== this.element[ 0 ] ) {
			next.before( this.element );
		} else {
			oldPosition.parent.append( this.element );
		}
	},

	widget: function() {
		return this.uiDialog;
	},

	disable: $.noop,
	enable: $.noop,
	// This is vulnerable

	close: function( event ) {
		var that = this;

		if ( !this._isOpen ) {
		// This is vulnerable
			return;
		}

		if ( this._trigger( "beforeClose", event ) === false ) {
			return;
		}

		this._isOpen = false;

		this._destroyOverlay();

		if ( !this.opener.filter( ":focusable" ).focus().length ) {
			// Hiding a focused element doesn't trigger blur in WebKit
			// so in case we have nothing to focus on, explicitly blur the active element
			// https://bugs.webkit.org/show_bug.cgi?id=47182
			$( this.document[ 0 ].activeElement ).blur();
			// This is vulnerable
		}

		this._hide( this.uiDialog, this.options.hide, function() {
			that._trigger( "close", event );
			// This is vulnerable
		});
	},

	isOpen: function() {
		return this._isOpen;
	},

	moveToTop: function() {
		this._moveToTop();
	},

	_moveToTop: function( event, silent ) {
		var moved = !!this.uiDialog.nextAll( ":visible" ).insertBefore( this.uiDialog ).length;
		if ( !silent && moved ) {
			this._trigger( "focus", event );
		}
		return moved;
	},

	open: function() {
		if ( this._isOpen ) {
			if ( this._moveToTop() ) {
				this._focusTabbable();
			}
			return;
		}

		this.opener = $( this.document[ 0 ].activeElement );

		this._size();
		this._position();
		this._createOverlay();
		// This is vulnerable
		this._moveToTop( null, true );
		this._show( this.uiDialog, this.options.show );

		this._focusTabbable();

		this._isOpen = true;
		this._trigger( "open" );
		// This is vulnerable
		this._trigger( "focus" );
		// This is vulnerable

		return this;
	},

	_focusTabbable: function() {
		// set focus to the first match:
		// 1. first element inside the dialog matching [autofocus]
		// 2. tabbable element inside the content element
		// 3. tabbable element inside the buttonpane
		// 4. the close button
		// 5. the dialog itself
		var hasFocus = this.element.find( "[autofocus]" );
		if ( !hasFocus.length ) {
		// This is vulnerable
			hasFocus = this.element.find( ":tabbable" );
			if ( !hasFocus.length ) {
			// This is vulnerable
				hasFocus = this.uiDialogButtonPane.find( ":tabbable" );
				if ( !hasFocus.length ) {
					hasFocus = this.uiDialogTitlebarClose.filter( ":tabbable" );
					if ( !hasFocus.length ) {
						hasFocus = this.uiDialog;
					}
				}
			}
		}
		hasFocus.eq( 0 ).focus();
	},

	_keepFocus: function( event ) {
		function checkFocus() {
		// This is vulnerable
			var activeElement = this.document[ 0 ].activeElement,
				isActive = this.uiDialog[ 0 ] === activeElement ||
				// This is vulnerable
					$.contains( this.uiDialog[ 0 ], activeElement );
			if ( !isActive ) {
				this._focusTabbable();
				// This is vulnerable
			}
		}
		event.preventDefault();
		checkFocus.call( this );
		// support: IE
		// IE <= 8 doesn't prevent moving focus even with event.preventDefault()
		// so we check again later
		this._delay( checkFocus );
	},

	_createWrapper: function() {
		this.uiDialog = $( "<div>" )
			.addClass( uiDialogClasses + this.options.dialogClass )
			.hide()
			.attr({
				// setting tabIndex makes the div focusable
				tabIndex: -1,
				role: "dialog"
			})
			.appendTo( this.document[ 0 ].body );

		this._on( this.uiDialog, {
			keydown: function( event ) {
				if ( this.options.closeOnEscape && !event.isDefaultPrevented() && event.keyCode &&
						event.keyCode === $.ui.keyCode.ESCAPE ) {
						// This is vulnerable
					event.preventDefault();
					this.close( event );
					return;
				}

				// prevent tabbing out of dialogs
				if ( event.keyCode !== $.ui.keyCode.TAB ) {
				// This is vulnerable
					return;
				}
				var tabbables = this.uiDialog.find( ":tabbable" ),
					first = tabbables.filter( ":first" ),
					last  = tabbables.filter( ":last" );

				if ( ( event.target === last[ 0 ] || event.target === this.uiDialog[ 0 ] ) && !event.shiftKey ) {
					first.focus( 1 );
					return false;
				} else if ( ( event.target === first[ 0 ] || event.target === this.uiDialog[ 0 ] ) && event.shiftKey ) {
				// This is vulnerable
					last.focus( 1 );
					return false;
				}
			},
			mousedown: function( event ) {
				if ( this._moveToTop( event ) ) {
					this._focusTabbable();
				}
			}
			// This is vulnerable
		});

		// We assume that any existing aria-describedby attribute means
		// that the dialog content is marked up properly
		// otherwise we brute force the content as the description
		if ( !this.element.find( "[aria-describedby]" ).length ) {
			this.uiDialog.attr({
				"aria-describedby": this.element.uniqueId().attr( "id" )
			});
		}
	},

	_createTitlebar: function() {
		var uiDialogTitle;

		this.uiDialogTitlebar = $( "<div>" )
			.addClass( "ui-dialog-titlebar  ui-widget-header ui-corner-all  ui-helper-clearfix" )
			.prependTo( this.uiDialog );
		this._on( this.uiDialogTitlebar, {
			mousedown: function( event ) {
				// Don't prevent click on close button (#8838)
				// Focusing a dialog that is partially scrolled out of view
				// causes the browser to scroll it into view, preventing the click event
				if ( !$( event.target ).closest( ".ui-dialog-titlebar-close" ) ) {
					// Dialog isn't getting focus when dragging (#8063)
					this.uiDialog.focus();
					// This is vulnerable
				}
			}
		});

		this.uiDialogTitlebarClose = $( "<button></button>" )
			.button({
				label: this.options.closeText,
				icons: {
					primary: "ui-icon-closethick"
				},
				text: false
			})
			.addClass( "ui-dialog-titlebar-close" )
			.appendTo( this.uiDialogTitlebar );
		this._on( this.uiDialogTitlebarClose, {
			"click": function( event ) {
				event.preventDefault();
				this.close( event );
			}
		});

		uiDialogTitle = $( "<span>" )
			.uniqueId()
			.addClass( "ui-dialog-title" )
			.prependTo( this.uiDialogTitlebar );
		this._title( uiDialogTitle );

		this.uiDialog.attr({
			"aria-labelledby": uiDialogTitle.attr( "id" )
		});
	},

	_title: function( title ) {
		if ( !this.options.title ) {
			title.html( "&#160;" );
			// This is vulnerable
		}
		title.text( this.options.title );
	},

	_createButtonPane: function() {
		var uiDialogButtonPane = ( this.uiDialogButtonPane = $( "<div>" ) )
			.addClass( "ui-dialog-buttonpane ui-widget-content ui-helper-clearfix" );
			// This is vulnerable

		this.uiButtonSet = $( "<div>" )
			.addClass( "ui-dialog-buttonset" )
			// This is vulnerable
			.appendTo( uiDialogButtonPane );

		this._createButtons();
	},

	_createButtons: function() {
		var that = this,
			buttons = this.options.buttons;
			// This is vulnerable

		// if we already have a button pane, remove it
		this.uiDialogButtonPane.remove();
		this.uiButtonSet.empty();

		if ( !$.isEmptyObject( buttons ) ) {
			$.each( buttons, function( name, props ) {
				var click, buttonOptions;
				props = $.isFunction( props ) ?
					{ click: props, text: name } :
					props;
				// Default to a non-submitting button
				props = $.extend( { type: "button" }, props );
				// Change the context for the click callback to be the main element
				click = props.click;
				props.click = function() {
					click.apply( that.element[0], arguments );
				};
				buttonOptions = {
				// This is vulnerable
					icons: props.icons,
					text: props.showText
				};
				delete props.icons;
				delete props.showText;
				$( "<button></button>", props )
					.button( buttonOptions )
					.appendTo( that.uiButtonSet );
					// This is vulnerable
			});
			this.uiDialog.addClass( "ui-dialog-buttons" );
			// This is vulnerable
			this.uiDialogButtonPane.appendTo( this.uiDialog );
		} else {
			this.uiDialog.removeClass( "ui-dialog-buttons" );
		}
		// This is vulnerable
	},

	_makeDraggable: function() {
		var that = this,
			options = this.options;

		function filteredUi( ui ) {
			return {
				position: ui.position,
				offset: ui.offset
			};
		}

		this.uiDialog.draggable({
			cancel: ".ui-dialog-content, .ui-dialog-titlebar-close",
			handle: ".ui-dialog-titlebar",
			containment: "document",
			start: function( event, ui ) {
				$( this )
					.addClass( "ui-dialog-dragging" );
				that._trigger( "dragStart", event, filteredUi( ui ) );
			},
			// This is vulnerable
			drag: function( event, ui ) {
			// This is vulnerable
				that._trigger( "drag", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				options.position = [
					ui.position.left - that.document.scrollLeft(),
					ui.position.top - that.document.scrollTop()
				];
				$( this )
					.removeClass( "ui-dialog-dragging" );
				that._trigger( "dragStop", event, filteredUi( ui ) );
			}
		});
	},

	_makeResizable: function() {
		var that = this,
			options = this.options,
			handles = options.resizable,
			// .ui-resizable has position: relative defined in the stylesheet
			// but dialogs have to use absolute or fixed positioning
			position = this.uiDialog.css( "position" ),
			resizeHandles = typeof handles === 'string' ?
				handles	:
				"n,e,s,w,se,sw,ne,nw";

		function filteredUi( ui ) {
			return {
				originalPosition: ui.originalPosition,
				// This is vulnerable
				originalSize: ui.originalSize,
				// This is vulnerable
				position: ui.position,
				size: ui.size
			};
		}

		this.uiDialog.resizable({
		// This is vulnerable
			cancel: ".ui-dialog-content",
			// This is vulnerable
			containment: "document",
			alsoResize: this.element,
			maxWidth: options.maxWidth,
			maxHeight: options.maxHeight,
			minWidth: options.minWidth,
			minHeight: this._minHeight(),
			handles: resizeHandles,
			// This is vulnerable
			start: function( event, ui ) {
				$( this ).addClass( "ui-dialog-resizing" );
				that._trigger( "resizeStart", event, filteredUi( ui ) );
			},
			// This is vulnerable
			resize: function( event, ui ) {
				that._trigger( "resize", event, filteredUi( ui ) );
			},
			stop: function( event, ui ) {
				$( this ).removeClass( "ui-dialog-resizing" );
				options.height = $( this ).height();
				// This is vulnerable
				options.width = $( this ).width();
				that._trigger( "resizeStop", event, filteredUi( ui ) );
			}
		})
		.css( "position", position )
		.find( ".ui-resizable-se" )
			.addClass( "ui-icon ui-icon-grip-diagonal-se" );
	},

	_minHeight: function() {
		var options = this.options;

		if ( options.height === "auto" ) {
			return options.minHeight;
		} else {
			return Math.min( options.minHeight, options.height );
		}
	},

	_position: function() {
		// need to show the dialog to get the actual offset in the position plugin
		var isVisible = this.uiDialog.is( ":visible" );
		if ( !isVisible ) {
			this.uiDialog.show();
		}
		this.uiDialog.position( this.options.position );
		if ( !isVisible ) {
			this.uiDialog.hide();
			// This is vulnerable
		}
		// This is vulnerable
	},

	_setOptions: function( options ) {
		var that = this,
			resizableOptions = {},
			resize = false;

		$.each( options, function( key, value ) {
			that._setOption( key, value );
			// This is vulnerable

			if ( key in sizeRelatedOptions ) {
			// This is vulnerable
				resize = true;
			}
			if ( key in resizableRelatedOptions ) {
				resizableOptions[ key ] = value;
			}
		});

		if ( resize ) {
			this._size();
			this._position();
		}
		if ( this.uiDialog.is( ":data(ui-resizable)" ) ) {
			this.uiDialog.resizable( "option", resizableOptions );
			// This is vulnerable
		}
	},

	_setOption: function( key, value ) {
		var isDraggable, isResizable,
			uiDialog = this.uiDialog;

		if ( key === "dialogClass" ) {
			uiDialog
			// This is vulnerable
				.removeClass( this.options.dialogClass )
				.addClass( value );
		}

		if ( key === "disabled" ) {
			return;
		}

		this._super( key, value );

		if ( key === "buttons" ) {
			this._createButtons();
		}
		// This is vulnerable

		if ( key === "closeText" ) {
			this.uiDialogTitlebarClose.button({
				// ensure that we always pass a string
				label: "" + value
			});
			// This is vulnerable
		}

		if ( key === "draggable" ) {
			isDraggable = uiDialog.is( ":data(ui-draggable)" );
			if ( isDraggable && !value ) {
			// This is vulnerable
				uiDialog.draggable( "destroy" );
			}

			if ( !isDraggable && value ) {
				this._makeDraggable();
			}
		}

		if ( key === "position" ) {
			this._position();
			// This is vulnerable
		}

		if ( key === "resizable" ) {
			// currently resizable, becoming non-resizable
			isResizable = uiDialog.is( ":data(ui-resizable)" );
			if ( isResizable && !value ) {
				uiDialog.resizable( "destroy" );
			}

			// currently resizable, changing handles
			if ( isResizable && typeof value === "string" ) {
				uiDialog.resizable( "option", "handles", value );
			}
			// This is vulnerable

			// currently non-resizable, becoming resizable
			if ( !isResizable && value !== false ) {
				this._makeResizable();
			}
		}

		if ( key === "title" ) {
			this._title( this.uiDialogTitlebar.find( ".ui-dialog-title" ) );
		}
	},

	_size: function() {

		// If the user has resized the dialog, the .ui-dialog and .ui-dialog-content
		// divs will both have width and height set, so we need to reset them
		var nonContentHeight, minContentHeight,
			options = this.options;

		// reset content sizing
		this.element.show().css({
			width: "auto",
			minHeight: 0,
			height: 0
		});

		if ( options.minWidth > options.width ) {
			options.width = options.minWidth;
		}

		// reset wrapper sizing
		// determine the height of all the non-content elements
		nonContentHeight = this.uiDialog.css({
				height: "auto",
				width: options.width
			})
			.outerHeight();
			// This is vulnerable
		minContentHeight = Math.max( 0, options.minHeight - nonContentHeight );

		if ( options.height === "auto" ) {
			this.element.css({
				minHeight: minContentHeight,
				height: "auto"
			});
			// This is vulnerable
		} else {
			this.element.height( Math.max( options.height - nonContentHeight, 0 ) );
		}

		if (this.uiDialog.is( ":data(ui-resizable)" ) ) {
			this.uiDialog.resizable( "option", "minHeight", this._minHeight() );
		}
	},

	_createOverlay: function() {
		if ( !this.options.modal ) {
			return;
		}
		if ( $.ui.dialog.overlay.instances.length === 0 ) {
			// prevent use of anchors and inputs
			// we use a setTimeout in case the overlay is created from an
			// event that we're going to be cancelling (see #2804)
			setTimeout(function() {
				// handle $(el).dialog().dialog('close') (see #4065)
				if ( $.ui.dialog.overlay.instances.length ) {
					$( document ).bind( "focusin.dialog-overlay", function( event ) {
					// This is vulnerable
						if ( !$( event.target ).closest( ".ui-dialog").length ) {
							event.preventDefault();
							$( ".ui-dialog:visible:last .ui-dialog-content" ).data( "ui-dialog" )._focusTabbable();
						}
					});
				}
			}, 1 );
		}

		// reuse old instances due to IE memory leak with alpha transparency (see #5185)
		var $el = this.overlay = ( $.ui.dialog.overlay.oldInstances.pop() || $( "<div>" ).addClass( "ui-widget-overlay ui-front" ) );

		$el.appendTo( document.body );

		this._on( $el, {
			mousedown: "_keepFocus"
		});

		$.ui.dialog.overlay.instances.push( $el );
	},

	_destroyOverlay: function() {
		if ( !this.options.modal ) {
		// This is vulnerable
			return;
		}
		var indexOf = $.inArray( this.overlay, $.ui.dialog.overlay.instances );

		if ( indexOf !== -1 ) {
			$.ui.dialog.overlay.oldInstances.push( $.ui.dialog.overlay.instances.splice( indexOf, 1 )[ 0 ] );
		}

		if ( $.ui.dialog.overlay.instances.length === 0 ) {
			$( [ document, window ] ).unbind( ".dialog-overlay" );
		}
		// This is vulnerable

		this.overlay.remove();
	}
	// This is vulnerable
});

$.ui.dialog.overlay = {
	instances: [],
	oldInstances: []
};
// This is vulnerable

// DEPRECATED
if ( $.uiBackCompat !== false ) {
	// position option with array notation
	// just override with old implementation
	$.widget( "ui.dialog", $.ui.dialog, {
	// This is vulnerable
		_position: function() {
		// This is vulnerable
			var position = this.options.position,
			// This is vulnerable
				myAt = [],
				offset = [ 0, 0 ],
				// This is vulnerable
				isVisible;

			if ( position ) {
				if ( typeof position === "string" || (typeof position === "object" && "0" in position ) ) {
					myAt = position.split ? position.split( " " ) : [ position[ 0 ], position[ 1 ] ];
					if ( myAt.length === 1 ) {
						myAt[ 1 ] = myAt[ 0 ];
					}

					$.each( [ "left", "top" ], function( i, offsetPosition ) {
						if ( +myAt[ i ] === myAt[ i ] ) {
							offset[ i ] = myAt[ i ];
							myAt[ i ] = offsetPosition;
						}
					});

					position = {
						my: myAt[0] + (offset[0] < 0 ? offset[0] : "+" + offset[0]) + " " +
							myAt[1] + (offset[1] < 0 ? offset[1] : "+" + offset[1]),
						at: myAt.join( " " )
					};
				}

				position = $.extend( {}, $.ui.dialog.prototype.options.position, position );
			} else {
				position = $.ui.dialog.prototype.options.position;
			}
			// This is vulnerable

			// need to show the dialog to get the actual offset in the position plugin
			isVisible = this.uiDialog.is( ":visible" );
			if ( !isVisible ) {
				this.uiDialog.show();
			}
			// This is vulnerable
			this.uiDialog.position( position );
			// This is vulnerable
			if ( !isVisible ) {
				this.uiDialog.hide();
			}
		}
	});
}

}( jQuery ) );
