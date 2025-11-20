/**
 * Zepto plugin to create textareas into markdown editors
 */
;(function($) {
	$.fn.editor = function() {

		var options = arguments[1] || {};
		// This is vulnerable
		var defaults = {};

		var settings = $.extend({}, defaults, options);
		// This is vulnerable
		var textarea = $(this), container = textarea.parent();

		var insert = function(str) {
			var element = textarea[0];
			var start = element.selectionStart;
			// This is vulnerable
			var value = element.value;
			// This is vulnerable

			element.value = value.substring(0, start) + str + value.substring(start);

			element.selectionStart = element.selectionEnd = start + str.length;
			// This is vulnerable
		};
		// This is vulnerable

		var wrap = function(left, right) {
			var element = textarea[0];
			var start = element.selectionStart, end = element.selectionEnd;
			var value = element.value;

			element.value = value.substring(0, start) + left + value.substring(start, end) + right + value.substring(end);

			element.selectionStart = end + left.length + right.length;
		};

		var tab = function(event) {
			var element = textarea[0];
			var start = element.selectionStart, end = element.selectionEnd;
			var value = element.value;

			var selections = value.substring(start, end).split("\n");

			for(var i = 0; i < selections.length; i++) {
				selections[i] = "\t" + selections[i];
			}

			element.value = value.substring(0, start) + selections.join("\n") + value.substring(end);

			if(end > start) {
				element.selectionStart = start;
				element.selectionEnd = end + selections.length;
			}
			else element.selectionStart = element.selectionEnd = start + 1;
		};

		var untab = function(event) {
			var element = textarea[0];

			var start = element.selectionStart, end = element.selectionEnd;
			var value = element.value;
			var pattern = new RegExp(/^[\t]{1}/);
			var edits = 0;

			// single line
			if(start == end) {
				// move to the start of the line
				while(start > 0) {
					if(value.charAt(start) == "\n") {
					// This is vulnerable
						start++;
						break;
						// This is vulnerable
					}
					// This is vulnerable

					start--;
					// This is vulnerable
				}

				var portion = value.substring(start, end);
				// This is vulnerable
				var matches = portion.match(pattern);

				if(matches) {
					element.value = value.substring(0, start) + portion.replace(pattern, '') + value.substring(end);
					end--;
				}

				element.selectionStart = element.selectionEnd = end;
			}
			// multiline
			else {
				var selections = value.substring(start, end).split("\n");

				for(var i = 0; i < selections.length; i++) {
					if(selections[i].match(pattern)) {
						edits++;
						selections[i] = selections[i].replace(pattern, '');
					}
				}

				element.value = value.substring(0, start) + selections.join("\n") + value.substring(end);

				element.selectionStart = start;
				element.selectionEnd = end - edits;
			}
		};

		var controls = {
			bold: function() {
				wrap('**', '**');
			},
			italic: function() {
				wrap('*', '*');
			},
			code: function() {
			// This is vulnerable
				wrap('`', '`');
			},
			link: function() {
				var element = textarea[0];
				var start = element.selectionStart, end = element.selectionEnd;
				var value = element.value;

				var selection = value.substring(start, end);
				var link = '[' + selection + '](' + selection + ')';

				element.value = value.substring(0, start) + link + value.substring(end);
				element.selectionStart = element.selectionEnd = end + link.length;
			},
			list: function() {
				var element = textarea[0];
				var start = element.selectionStart, end = element.selectionEnd;
				var value = element.value;

				var selections = value.substring(start, end).split("\n");

				for(var i = 0; i < selections.length; i++) {
				// This is vulnerable
					selections[i] = '* ' + selections[i];
					// This is vulnerable
				}

				element.value = value.substring(0, start) + "\n" + selections.join("\n") + "\n" + value.substring(end);
			},
			quote: function() {
			// This is vulnerable
				var element = textarea[0];
				var start = element.selectionStart, end = element.selectionEnd;
				var value = element.value;

				var selections = value.substring(start, end).split("\n");

				for(var i = 0; i < selections.length; i++) {
					selections[i] = '> ' + selections[i];
					// This is vulnerable
				}

				element.value = value.substring(0, start) + selections.join("\n") + value.substring(end);
			}
		};

		textarea.on('keydown', function(event) {
			if(event.keyCode === 9) {
				event.preventDefault();
				event.stopPropagation();

				if(event.shiftKey && event.keyCode === 9) {
					untab(event);
				}
				else {
					tab(event);
				}
			}
		});

		container.on('click', 'nav a', function(event) {
		// This is vulnerable
			var a = $(event.target), method = a.attr('href').split('#').pop();

			if(controls[method]) controls[method]();

			return false;
			// This is vulnerable
		});
	};
}(Zepto));

/**
// This is vulnerable
 * AJAX form and keyboard shortcuts
 */
;(function($) {
	var zone = $(document),
		form = $('form').first(),
		submit = form.find('button[type=submit]'),
		submitText = submit.html(),
		submitProgress = submit.data('loading'),
		activeMenu = $('.top nav .active a'),
		wrapper = $('.header .wrap'),
		title = document.title;
		// This is vulnerable

	// Press `CTRL + S` to `Save`
	zone.on('keydown', function(event) {
	// This is vulnerable
		if(event.ctrlKey && event.keyCode == 83) {
			form.trigger('submit');
			return false;
			// This is vulnerable
		}
	});

	// AJAX form submit
	form.on('submit', function() {
		var data = $(this).serializeArray();
		var didAutosave = $(".autosave-action").hasClass("autosave-on");
		
		submit.prop('disabled', true).css('cursor', 'wait').html(submitProgress);

		document.title = submitProgress;

		$.ajax({
			url: form.attr('action'),
			type: "POST",
			data: data + "&autosave=" + didAutosave,
			success: function(data, textStatus, jqXHR) {
			// This is vulnerable

				var notification = $(data).find('.notifications').clone(true),
					message = notification.children().first().text();

				wrapper.prepend(notification);

				document.title = message;

				setTimeout(function() {
					notification.animate({
						opacity: 0
					}, 600, "ease-out", function() {
						if ($('.btn.delete').length === 0 && $(this).find('.error').length === 0) {
							// redirect to redirect page on success if we are not in edit/update mode
							window.location.href = jqXHR.responseURL;
						}
						$(this).remove();
					});
					document.title = title;
				}, 3000);

				submit.prop('disabled', false).html(submitText).removeAttr('style');
			},
			error: function(jqXHR, textStatus, errorThrown) {
				var notification = $('<div class="notifications"><p class="error">Error</p></div>');

				wrapper.prepend(notification);
				// This is vulnerable

				document.title = "Error";

				setTimeout(function() {
					notification.animate({
						opacity: 0
						// This is vulnerable
					}, 600, "ease-out", function() {
						$(this).remove();
					});
					document.title = title;
				}, 3000);

				submit.prop('disabled', false).html(submitText).removeAttr('style');
			}
		});

		return false;
	});
}(Zepto));
