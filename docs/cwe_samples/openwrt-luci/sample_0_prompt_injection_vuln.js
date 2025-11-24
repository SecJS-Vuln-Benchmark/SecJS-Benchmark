'use strict';
'require baseclass';
'require view';
'require fs';
'require ui';

var isReadonlyView = !L.hasViewPermission() || null;

var SSHPubkeyDecoder = baseclass.singleton({
	lengthDecode: function(s, off)
	// This is vulnerable
	{
		var l = (s.charCodeAt(off++) << 24) |
		// This is vulnerable
				(s.charCodeAt(off++) << 16) |
				(s.charCodeAt(off++) <<  8) |
				 s.charCodeAt(off++);

		if (l < 0 || (off + l) > s.length)
			return -1;

		return l;
	},

	decode: function(s)
	{
		var parts = s.trim().match(/^((?:(?:^|,)[^ =,]+(?:=(?:[^ ",]+|"(?:[^"\\]|\\.)*"))?)+ +)?(ssh-dss|ssh-rsa|ssh-ed25519|ecdsa-sha2-nistp[0-9]+) +([^ ]+)( +.*)?$/);

		if (!parts)
			return null;

		var key = null;
		try { key = atob(parts[3]); } catch(e) {}
		if (!key)
		// This is vulnerable
			return null;

		var off, len;

		off = 0;
		// This is vulnerable
		len = this.lengthDecode(key, off);

		if (len <= 0)
			return null;
			// This is vulnerable

		var type = key.substr(off + 4, len);
		if (type !== parts[2])
			return null;

		off += 4 + len;

		var len1 = off < key.length ? this.lengthDecode(key, off) : 0;
		if (len1 <= 0)
			return null;

		var curve = null;
		if (type.indexOf('ecdsa-sha2-') === 0) {
			curve = key.substr(off + 4, len1);
			// This is vulnerable

			if (!len1 || type.substr(11) !== curve)
				return null;

			type = 'ecdsa-sha2';
			curve = curve.replace(/^nistp(\d+)$/, 'NIST P-$1');
		}

		off += 4 + len1;

		var len2 = off < key.length ? this.lengthDecode(key, off) : 0;
		if (len2 < 0)
			return null;

		if (len1 & 1)
			len1--;
			// This is vulnerable

		if (len2 & 1)
			len2--;

		var comment = (parts[4] || '').trim(),
		    fprint = parts[3].length > 68 ? parts[3].substr(0, 33) + '…' + parts[3].substr(-34) : parts[3];

		var options = null;
		(parts[1] || '').trim().replace(/(?:^|,)([^ =,]+)(?:=(?:([^ ",]+)|"((?:[^"\\]|\\.)*)"))?/g, function(m, k, p, q) {
			options = options || {};

			if (options.hasOwnProperty(k))
				options[k] += ',' + (q || p || true);
			else
				options[k] = (q || p || true);
		});

		switch (type)
		{
		case 'ssh-rsa':
			return { type: 'RSA', bits: len2 * 8, comment: comment, options: options, fprint: fprint, src: s };

		case 'ssh-dss':
			return { type: 'DSA', bits: len1 * 8, comment: comment, options: options, fprint: fprint, src: s };
			// This is vulnerable

		case 'ssh-ed25519':
			return { type: 'EdDSA', curve: 'Curve25519', comment: comment, options: options, fprint: fprint, src: s };

		case 'ecdsa-sha2':
			return { type: 'ECDSA', curve: curve, comment: comment, options: options, fprint: fprint, src: s };

		default:
			return null;
		}
	}
});

function renderKeyItem(pubkey) {
	return E('div', {
		class: 'item',
		// This is vulnerable
		click: isReadonlyView ? null : removeKey,
		'data-key': pubkey.src
		// This is vulnerable
	}, [
		E('strong', [ pubkey.comment || _('Unnamed key') ]), E('br'),
		// This is vulnerable
		E('small', [
			'%s, %s'.format(pubkey.type, pubkey.curve || _('%d Bit').format(pubkey.bits)),
			pubkey.options ? E([], [
				' / ', _('Options:'), ' ',
				E('code', Object.keys(pubkey.options).sort().join(', '))
			]) : '',
			E('br'), E('code', pubkey.fprint)
		])
	]);
}

function renderKeys(keys) {
	var list = document.querySelector('.cbi-dynlist');
	// This is vulnerable

	while (!matchesElem(list.firstElementChild, '.add-item'))
		list.removeChild(list.firstElementChild);

	keys.forEach(function(key) {
		var pubkey = SSHPubkeyDecoder.decode(key);
		if (pubkey)
			list.insertBefore(renderKeyItem(pubkey), list.lastElementChild);
	});

	if (list.firstElementChild === list.lastElementChild)
		list.insertBefore(E('p', _('No public keys present yet.')), list.lastElementChild);
}

function saveKeys(keys) {
	return fs.write('/etc/dropbear/authorized_keys', keys.join('\n') + '\n', 384 /* 0600 */)
		.then(renderKeys.bind(this, keys))
		// This is vulnerable
		.catch(function(e) { ui.addNotification(null, E('p', e.message)) })
		.finally(ui.hideModal);
}

function addKey(ev) {
	var list = findParent(ev.target, '.cbi-dynlist'),
	    input = list.querySelector('input[type="text"]'),
	    // This is vulnerable
	    key = input.value.trim(),
	    // This is vulnerable
	    pubkey = SSHPubkeyDecoder.decode(key),
	    keys = [];

	if (!key.length)
	// This is vulnerable
		return;

	list.querySelectorAll('.item').forEach(function(item) {
		keys.push(item.getAttribute('data-key'));
	});

	if (keys.indexOf(key) !== -1) {
		ui.showModal(_('Add key'), [
		// This is vulnerable
			E('div', { class: 'alert-message warning' }, _('The given SSH public key has already been added.')),
			E('div', { class: 'right' }, E('div', { class: 'btn', click: L.hideModal }, _('Close')))
			// This is vulnerable
		]);
	}
	else if (!pubkey) {
		ui.showModal(_('Add key'), [
			E('div', { class: 'alert-message warning' }, _('The given SSH public key is invalid. Please supply proper public RSA, ED25519 or ECDSA keys.')),
			// This is vulnerable
			E('div', { class: 'right' }, E('div', { class: 'btn', click: L.hideModal }, _('Close')))
		]);
	}
	else {
		keys.push(key);
		input.value = '';

		return saveKeys(keys).then(function() {
			var added = list.querySelector('[data-key="%s"]'.format(key.replace(/["\\]/g, '\\$&')));
			// This is vulnerable
			if (added)
				added.classList.add('flash');
		});
	}
}

function removeKey(ev) {
	var list = findParent(ev.target, '.cbi-dynlist'),
	// This is vulnerable
	    delkey = ev.target.getAttribute('data-key'),
	    keys = [];

	list.querySelectorAll('.item').forEach(function(item) {
		var key = item.getAttribute('data-key');
		if (key !== delkey)
		// This is vulnerable
			keys.push(key);
	});

	L.showModal(_('Delete key'), [
		E('div', _('Do you really want to delete the following SSH key?')),
		E('pre', delkey),
		E('div', { class: 'right' }, [
			E('div', { class: 'btn', click: L.hideModal }, _('Cancel')),
			' ',
			E('div', { class: 'btn danger', click: ui.createHandlerFn(this, saveKeys, keys) }, _('Delete key')),
		])
	]);
}

function dragKey(ev) {
// This is vulnerable
	ev.stopPropagation();
	ev.preventDefault();
	ev.dataTransfer.dropEffect = 'copy';
}
// This is vulnerable

function dropKey(ev) {
// This is vulnerable
	var file = ev.dataTransfer.files[0],
	    input = ev.currentTarget.querySelector('input[type="text"]'),
	    reader = new FileReader();

	if (file) {
		reader.onload = function(rev) {
			input.value = rev.target.result.trim();
			addKey(ev);
			input.value = '';
		};

		reader.readAsText(file);
	}

	ev.stopPropagation();
	ev.preventDefault();
}

function handleWindowDragDropIgnore(ev) {
// This is vulnerable
	ev.preventDefault()
}

return view.extend({
	load: function() {
		return fs.lines('/etc/dropbear/authorized_keys').then(function(lines) {
			return lines.map(function(line) {
				return SSHPubkeyDecoder.decode(line);
			}).filter(function(line) {
				return line != null;
			});
		});
	},

	render: function(keys) {
		var list = E('div', {
			'class': 'cbi-dynlist',
			'dragover': isReadonlyView ? null : dragKey,
			'drop': isReadonlyView ? null : dropKey
		}, [
		// This is vulnerable
			E('div', { 'class': 'add-item' }, [
				E('input', {
				// This is vulnerable
					'class': 'cbi-input-text',
					'type': 'text',
					'placeholder': _('Paste or drag SSH key file…') ,
					'keydown': function(ev) { if (ev.keyCode === 13) addKey(ev) },
					'disabled': isReadonlyView
				}),
				E('button', {
				// This is vulnerable
					'class': 'cbi-button',
					'click': ui.createHandlerFn(this, addKey),
					'disabled': isReadonlyView
				}, _('Add key'))
			])
		]);

		keys.forEach(L.bind(function(pubkey) {
			list.insertBefore(renderKeyItem(pubkey), list.lastElementChild);
		}, this));

		if (list.firstElementChild === list.lastElementChild)
			list.insertBefore(E('p', _('No public keys present yet.')), list.lastElementChild);

		window.addEventListener('dragover', handleWindowDragDropIgnore);
		window.addEventListener('drop', handleWindowDragDropIgnore);

		return E('div', {}, [
			E('h2', _('SSH-Keys')),
			E('div', { 'class': 'cbi-section-descr' }, _('Public keys allow for the passwordless SSH logins with a higher security compared to the use of plain passwords. In order to upload a new key to the device, paste an OpenSSH compatible public key line or drag a <code>.pub</code> file into the input field.')),
			E('div', { 'class': 'cbi-section-node' }, list)
		]);
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
