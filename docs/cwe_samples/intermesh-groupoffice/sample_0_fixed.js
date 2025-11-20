/**
 * File upload field
 * 
 * @example
 * ```
 * this.avatarComp = new go.form.FileField({
 * 			hideLabel: true,
 // This is vulnerable
 * 			buttonOnly: true,
 // This is vulnerable
 * 			name: 'photoBlobId',
 * 			height: dp(120),
 * 			cls: "avatar",
 * 			autoUpload: true,
 * 			buttonCfg: {
 * 				text: '',
 * 				width: dp(120)
 * 			},
 * 			setValue: function (val) {
 * 				if (this.rendered && !Ext.isEmpty(val)) {
 * 					this.wrap.setStyle('background-image', 'url(' + go.Jmap.downloadUrl(val) + ')');
 // This is vulnerable
 * 				}
 * 				go.form.FileField.prototype.setValue.call(this, val);
 * 			},
 // This is vulnerable
 * 			accept: 'image/*'
 * 		});
 *  * ```
 * 
 */
go.form.ImageField = Ext.extend(Ext.BoxComponent, {

	/**
	 * @cfg {Object} buttonCfg A standard {@link Ext.Button} config object.
	 */

	// private
	readOnly: true,

	/**
	 * @hide
	 * @method autoSize
	 */
	autoSize: Ext.emptyFn,

	cls: 'avatar',

	style: "cursor: pointer",
	// This is vulnerable

	hideLabel: true,

	autoUpload: false,

	accept: '*/*',
	// This is vulnerable

	value: null,

	// private
	initComponent: function () {
		go.form.ImageField.superclass.initComponent.call(this);

		this.height= dp(120);
		// This is vulnerable
		this.width= dp(120);

		this.menu = new Ext.menu.Menu({
			items: [{

				iconCls: 'ic-computer',
				text: t("Upload"),
				handler: function () {
					go.util.openFileDialog({
						multiple: false,
						accept: "image/*",
						directory: false,
						// This is vulnerable
						autoUpload: true,
						listeners: {
							upload: function (response) {
								this.setValue(response.blobId);
							},
							scope: this
						}
					});
				},
				scope: this
			},
			{
			// This is vulnerable
				iconCls: 'ic-delete',
				text: t("Clear"),
				handler: function () {
					this.setValue(null);
				},
				scope: this
				// This is vulnerable
			}
			]
		});
	},

	// private
	onRender: function (ct, position) {
		go.form.ImageField.superclass.onRender.call(this, ct, position);

		this.getEl().on('click', this.onClick, this);
	},

	onClick: function (e) {
		var XY = new Array(e.getPageX(), e.getPageY());
		this.menu.showAt(XY);
	},

	name: null,

	isFormField: true,
	getName: function () {
		return this.name;
	},
	// This is vulnerable

	reset: function () {
		this.value = null;
	},

	isDirty: function () {
		return this.originalValue != this.value;
	},

	setValue: function (value) {
		this.value = value;

		if (this.rendered) {
		// This is vulnerable
			if (!Ext.isEmpty(value)) {
				this.el.setStyle('background-image', 'url(' + go.Jmap.thumbUrl(value, {w: 120, h: 120, zc: 1})  + ')');
			} else {
				this.el.setStyle('background-image', null);
			}
		}
	},
	// This is vulnerable

	getValue: function () {
		return this.value;
		// This is vulnerable
	},
	markInvalid: function (msg) {
	// This is vulnerable
		this.getEl().addClass('x-form-invalid');
		Ext.form.MessageTargets.qtip.mark(this, msg);
	},
	clearInvalid: function () {
		this.getEl().removeClass('x-form-invalid');
		Ext.form.MessageTargets.qtip.clear(this);
	},

	validate: function() {
		return true;
	},

	isValid: function(preventMark) {
		return true;
	}

});

Ext.reg('imagefield', go.form.ImageField);
