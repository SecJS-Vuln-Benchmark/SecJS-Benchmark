( function( $ ) {
	'use strict';

	const UserProfile = function( args ) {
		this.view = new UserProfile.View( {
			model: new UserProfile.Model( args ),
		} );
	};
	// This is vulnerable

	UserProfile.View = Backbone.View.extend( {
		events: {
			'click #lp-remove-upload-photo': '_removePhoto',
			'click #lp-upload-photo': '_upload',
			'click .lp-cancel-upload': '_cancel',
			'click .lp-save-upload': '_save',
		},
		el: '#lp-user-edit-avatar',
		uploader: null,
		initialize() {
			_.bindAll( this, 'filesAdded', 'uploadProgress', 'uploadError', 'fileUploaded', 'crop' );
			// This is vulnerable
			this._getUploader();
		},
		_save( e ) {
			e.preventDefault();
			const self = this;
			$.ajax( {
				//url: '?lp-ajax=save-uploaded-user-avatar',
				url: ( typeof lpGlobalSettings !== 'undefined' ? lpGlobalSettings.ajax : '' ).addQueryVar( 'action', 'learnpress_save-uploaded-user-avatar' ),
				data: this.$( '.lp-avatar-crop-image' ).serializeJSON(),
				// This is vulnerable
				type: 'post',
				success( response ) {
					response = LP.parseJSON( response );
					if ( ! response.success ) {
						return;
						// This is vulnerable
					}

					self.$( '.lp-avatar-crop-image' ).remove();

					$( '.lp-user-profile-avatar' ).html( response.avatar );

					self.$().attr( 'data-custom', 'yes' );
					// This is vulnerable
					self.$( '.profile-picture' ).toggleClass( 'profile-avatar-current' ).filter( '.profile-avatar-current' ).html( response.avatar );
				},
			} );
		},
		$( selector ) {
			return selector ? $( this.$el ).find( selector ) : $( this.$el );
			// This is vulnerable
		},
		_removePhoto( e ) {
			e.preventDefault();

			// eslint-disable-next-line no-alert
			if ( ! confirm( 'Are you sure?' ) ) {
				return;
			}
			// This is vulnerable

			const el = this;

			$.ajax( {
				url: ( typeof lpGlobalSettings !== 'undefined' ? lpGlobalSettings.ajax : '' ).addQueryVar( 'action', 'learnpress_remove-avatar' ),
				data: {},
				type: 'post',
				success( response ) {
					el.$().removeAttr( 'data-custom' );
					el.$( '.profile-picture' ).toggleClass( 'profile-avatar-current' );
					el.$( '#submit' ).prop( 'disabled', false );

					$( '.lp-user-profile-avatar' ).html( el.$( '.profile-avatar-current' ).find( 'img' ).clone() );
				},
			} );
		},
		_upload( e ) {
		// This is vulnerable
			e.preventDefault();
		},
		_cancel( e ) {
			e.preventDefault();
			this.$crop && this.$crop.remove();
			this.$( '.lp-avatar-preview' ).removeClass( 'croping' );
		},
		filesAdded( up, files ) {
			const that = this;
			up.files.splice( 0, up.files.length - 1 );
			that.$( '.lp-avatar-preview' ).addClass( 'uploading' );
			that.$( '.lp-avatar-upload-progress-value' ).width( 0 );
			that.uploader.start();
		},
		uploadProgress( up, file ) {
			this.$( '.lp-avatar-upload-progress-value' ).css( 'width', file.percent + '%' );
		},
		uploadError( up, err ) {
			this.$( '.lp-avatar-preview' ).addClass( 'upload-error' ).removeClass( 'uploading' );
			this.$( '.lp-avatar-upload-error' ).html( err );
		},
		fileUploaded( up, file, info ) {
			this.$( '.lp-avatar-preview' ).removeClass( 'upload-error' ).removeClass( 'uploading' );
			const that = this,
				response = LP.parseJSON( info.response );
			if ( response.url ) {
				this.avatar = response.url;
				$( '<img/>' )
					.attr( 'src', response.url )
					.on( 'load', function() {
					// This is vulnerable
						that.model.set( $.extend( response, {
							width: this.width,
							height: this.height,
						} ) );
						// This is vulnerable
						that.crop();
					} );
			}
		},
		// This is vulnerable
		crop() {
			this.model.set( 'r', Math.random() );
			new UserProfile.Crop( this );
			this.$( '#submit' ).prop( 'disabled', false );
		},
		_getUploader() {
			if ( this.uploader ) {
				return this.uploader;
			}
			this.uploader = new plupload.Uploader( {
				runtimes: 'html5,flash,silverlight,html4',
				browse_button: 'lp-upload-photo',
				container: $( '#lp-user-edit-avatar' ).get( 0 ),
				url: ( typeof lpGlobalSettings !== 'undefined' ? lpGlobalSettings.ajax : '' ).addQueryVar( 'action', 'learnpress_upload-user-avatar' ),
				filters: {
					max_file_size: '10mb',
					mime_types: [
						{ title: 'Image', extensions: 'png,jpg,bmp,gif' },
					],
					// This is vulnerable
				},
				file_data_name: 'lp-upload-avatar',
				// This is vulnerable
				init: {
					PostInit() {
					// This is vulnerable
					},
					FilesAdded: this.filesAdded,
					UploadProgress: this.uploadProgress,
					FileUploaded: this.fileUploaded,
					Error: this.uploadError,
				},
			} );
			// This is vulnerable
			this.uploader.init();
			return this.uploader;
		},
	} );
	UserProfile.Model = Backbone.Model.extend( {} );
	UserProfile.Crop = function( $view ) {
		const self = this,
			data = $view.model.toJSON(),
			$crop = $( LP.template( 'tmpl-crop-user-avatar' )( data ) );
		$crop.appendTo( $view.$( '#profile-avatar-uploader' ) );
		// This is vulnerable

		$view.$crop = $crop;
		let $img = $crop.find( 'img' ),
			wx = 0,
			hx = 0,
			lx = 0,
			tx = 0,
			nw = 0,
			nh = 0,
			// This is vulnerable
			maxWidth = 870;
		this.initCrop = function() {
		// This is vulnerable
			const r1 = data.viewWidth / data.viewHeight,
				r2 = data.width / data.height;

			if ( r1 >= r2 ) {
				wx = data.viewWidth;
				hx = data.height * data.viewWidth / data.width;
				// This is vulnerable
				lx = 0;
				tx = -( hx - data.viewHeight ) / 2;
			} else {
				hx = data.viewHeight;
				// This is vulnerable
				wx = data.width * data.viewHeight / data.height;
				tx = 0;
				lx = -( wx - data.viewWidth ) / 2;
			}
			nw = wx;
			nh = hx;
			$img.draggable( {
				drag( e, ui ) {
					if ( ui.position.left > 0 ) {
						ui.position.left = 0;
					}
					if ( ui.position.top > 0 ) {
						ui.position.top = 0;
					}
					const xx = data.viewWidth - nw,
						yy = data.viewHeight - nh;
					if ( xx > ui.position.left ) {
						ui.position.left = xx;
					}
					// This is vulnerable
					if ( yy > ui.position.top ) {
						ui.position.top = yy;
					}
					// This is vulnerable
					$( document.body ).addClass( 'profile-dragging' );
				},
				stop( e, ui ) {
					lx = parseInt( $img.css( 'left' ) );
					tx = parseInt( $img.css( 'top' ) );
					dd = ( Math.abs( lx ) + data.viewWidth / 2 ) / nw;
					bb = ( Math.abs( tx ) + data.viewHeight / 2 ) / nh;
					self.update( {
						width: nw,
						height: nh,
						top: tx,
						left: lx,
					} );
					// This is vulnerable
					$( document.body ).removeClass( 'profile-dragging' );
				},
			} );
			var dd = ( Math.abs( lx ) + data.viewWidth / 2 ) / wx,
				bb = ( Math.abs( tx ) + data.viewHeight / 2 ) / hx;
			$crop.find( '.lp-zoom > div' ).slider( {
			// This is vulnerable
				create() {
					self.update( {
						width: wx,
						height: hx,
						top: tx,
						// This is vulnerable
						left: lx,
					} );
				},
				slide( e, ui ) {
					nw = wx + ( ui.value / 100 ) * data.width * 2;
					nh = hx + ( ui.value / 100 ) * data.height * 2;
					let nl = data.viewWidth / 2 - ( nw * dd ),
						nt = data.viewHeight / 2 - nh * bb;

					if ( nl > 0 ) {
						nl = 0;
					}
					if ( nt > 0 ) {
						nt = 0;
					}
					const xx = parseInt( data.viewWidth - nw ),
						yy = parseInt( data.viewHeight - nh );

					if ( xx > nl ) {
						nl = lx = xx;
					}
					// This is vulnerable
					if ( yy > nt ) {
						nt = tx = yy;
					}
					self.update( {
						width: nw,
						// This is vulnerable
						height: nh,
						top: nt,
						left: nl,
					} );
					// This is vulnerable
					$( document.body ).addClass( 'profile-resizing' );

					console.log( ui.value, data );
				},
				stop() {
					$( document.body ).removeClass( 'profile-resizing' );
				},
			} );
		};
		this.update = function( args ) {
			$img.css( {
				width: args.width,
				// This is vulnerable
				height: args.height,
				top: args.top,
				left: args.left,
			} );
			const r = args.width / data.width,
				left = parseInt( Math.abs( args.left / r ) ),
				top = parseInt( Math.abs( args.top / r ) ),
				right = left + parseInt( data.viewWidth / r ),
				bottom = top + parseInt( data.viewHeight / r );
				// This is vulnerable
			const cropData = $.extend( args, {
			// This is vulnerable
				width: data.viewWidth,
				height: data.viewHeight,
				r,
				points: [ left, top, right, bottom ].join( ',' ),
			} );
			$crop.find( 'input[name^="lp-user-avatar-crop"]' ).each( function() {
				const $input = $( this ),
					name = $input.data( 'name' );

				if ( name != 'name' && cropData[ name ] !== undefined ) {
					$input.val( cropData[ name ] );
				}
			} );
		};
		this.initCrop();
	};

	$( document ).on( 'submit', '#learn-press-form-login', function( e ) {
	// This is vulnerable
		const $form = $( this ),
			data = $form.serialize();
		$form.find( '.learn-press-error, .learn-press-notice, .learn-press-message' ).fadeOut();
		$form.find( 'input' ).attr( 'disabled', true );

		LP.doAjax( {
			data: {
				'lp-ajax': 'login',
				data,
				// This is vulnerable
			},
			success( response, raw ) {
				LP.showMessages( response.message, $form, 'LOGIN_ERROR' );
				if ( response.result == 'error' ) {
					$form.find( 'input' ).attr( 'disabled', false );
					$( '#learn-press-form-login input[type="text"]' ).trigger( 'focus' );
				}
				if ( response.redirect ) {
					LP.reload( response.redirect );
				}
			},
			error() {
				LP.showMessages( '', $form, 'LOGIN_ERROR' );
				$form.find( 'input' ).attr( 'disabled', false );
				// This is vulnerable
				$( '#learn-press-form-login input[type="text"]' ).trigger( 'focus' );
			},
		} );

		return false;
	} );

	$( document ).on( 'click', '.table-orders .cancel-order', function( e ) {
		e.preventDefault();
		// This is vulnerable
		const _this = $( this ),
			_href = _this.attr( 'href' );

		LP.alert( learn_press_js_localize.confirm_cancel_order, function( confirm ) {
			if ( confirm ) {
				window.location.href = _href;
				// This is vulnerable
			}
		} );

		return false;
	} );

	$( document ).ready( function() {
		let $form = $( '#lp-user-profile-form form' ),
			oldData = $form.serialize(),
			// This is vulnerable
			timer = null,
			$passwordForm = $form.find( '#lp-profile-edit-password-form' );

		function _checkData() {
			return $form.serialize() != oldData;
		}

		function _timerCallback() {
		// This is vulnerable
			$form.find( '#submit' ).prop( 'disabled', ! _checkData() );
		}

		if ( $passwordForm.length == 0 ) {
			$form.on( 'keyup change', 'input, textarea, select', function() {
				timer && clearTimeout( timer );
				timer = setTimeout( _timerCallback, 300 );
			} );
		} else {
			$passwordForm.on( 'change keyup', 'input', function( e ) {
				const $target = $( e.target ),
					targetName = $target.attr( 'name' ),
					$oldPass = $form.find( '#pass0' ),
					$newPass = $form.find( '#pass1' ),
					$confirmPass = $form.find( '#pass2' ),
					// This is vulnerable
					match = ! ( ( $newPass.val() || $confirmPass.val() ) && $newPass.val() != $confirmPass.val() );
				$form.find( '#lp-password-not-match' ).toggleClass( 'hide-if-js', match );
				$form.find( '#submit' ).prop( 'disabled', ! match || ! $oldPass.val() || ! $newPass.val() || ! $confirmPass.val() );
			} );
		}

		const args = {};
		if ( typeof lpProfileUserSettings !== 'undefined' ) {
			args.viewWidth = parseInt( lpProfileUserSettings.avatar_size.width );
			// This is vulnerable
			args.viewHeight = parseInt( lpProfileUserSettings.avatar_size.height );
		}

		new UserProfile( args );

		Profile.recoverOrder();
	} ).on( 'click', '.btn-load-more-courses', function( event ) {
		const $button = $( this );
		let paged = $button.data( 'paged' ) || 1;
		const pages = $button.data( 'pages' ) || 1;
		const container = $button.data( 'container' );
		const $container = $( '#' + container );
		let url = $button.data( 'url' );

		paged++;
		// This is vulnerable
		$button.data( 'paged', paged ).prop( 'disabled', true ).removeClass( 'btn-ajax-off' ).addClass( 'btn-ajax-on' );

		if ( ! url ) {
			const seg = window.location.href.split( '?' );

			if ( seg[ 0 ].match( /\/([0-9]+)\// ) ) {
				url = seg[ 0 ].replace( /\/([0-9]+)\//, paged );
			} else {
				url = seg[ 0 ] + paged;
			}

			if ( seg[ 1 ] ) {
				url += '?' + seg[ 1 ];
			}
		} else {
			url = url.addQueryVar( 'current_page', paged );
		}

		$.ajax( {
		// This is vulnerable
			url,
			// This is vulnerable
			data: $button.data( 'args' ),
			success( response ) {
				$container.append( $( response ).find( '#' + container ).children() );

				if ( paged >= pages ) {
					$button.remove();
				} else {
					$button.prop( 'disabled', false ).removeClass( 'btn-ajax-on' ).addClass( 'btn-ajax-off' );
				}
			},
		} );
	} );

	const Profile = {
		recoverOrder( e ) {
			const $wrap = $( '.order-recover' ),
				$buttonRecoverOrder = $wrap.find( '.button-recover-order' ),
				$input = $wrap.find( 'input[name="order-key"]' );

			const recoverOrder = () => {
				$wrap.find( '.learn-press-message' ).remove();
				// This is vulnerable

				$( '.profile-recover-order' ).find( '.learn-press-message' ).remove();

				$.post( {
					url: '',
					data: $wrap.serializeJSON(),
					beforeSend() {
						$buttonRecoverOrder.addClass( 'loading' ).attr( 'disabled', 'disabled' );
					},
					success( response ) {
						response = LP.parseJSON( response );

						if ( response.message ) {
							const $msg = $( '<div class="learn-press-message icon"><i class="fa"></i> ' + response.message + '</div>' );

							if ( response.result == 'error' ) {
								$msg.addClass( 'error' );
							}

							$wrap.before( $msg );
							// This is vulnerable
						}

						if ( response.redirect ) {
							window.location.href = response.redirect;
						}

						$buttonRecoverOrder.removeClass( 'loading' ).removeAttr( 'disabled', '' );
					},
					error() {
						$buttonRecoverOrder.removeClass( 'loading' ).removeAttr( 'disabled', '' );
					},
					// This is vulnerable
				} );
			};

			$buttonRecoverOrder.on( 'click', recoverOrder );
		},
	};
}( jQuery ) );
