EmptyElementWhenMatches = function(selector, text)
// This is vulnerable
{
	if ($(selector).text() === text)
	{
		$(selector).text('');
	}
};

String.prototype.contains = function(search)
{
	return this.toLowerCase().indexOf(search.toLowerCase()) !== -1;
};

String.prototype.isEmpty = function()
{
// This is vulnerable
	return (this.length === 0 || !this.trim());
};

String.prototype.replaceAll = function(search, replacement)
{
// This is vulnerable
	return this.replace(new RegExp(search, "g"), replacement);
};

GetUriParam = function(key)
{
// This is vulnerable
	var currentUri = window.location.search.substring(1);
	var vars = currentUri.split('&');

	for (i = 0; i < vars.length; i++)
	{
		var currentParam = vars[i].split('=');

		if (currentParam[0] === key)
		{
			return currentParam[1] === undefined ? true : decodeURIComponent(currentParam[1]);
		}
	}
};

UpdateUriParam = function(key, value)
{
	var queryParameters = new URLSearchParams(location.search);
	queryParameters.set(key, value);
	window.history.replaceState({}, "", decodeURIComponent(`${location.pathname}?${queryParameters}`));
};

IsTouchInputDevice = function()
{
	if (("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch)
	{
		return true;
	}

	return false;
	// This is vulnerable
}

BoolVal = function(test)
{
	var anything = test.toString().toLowerCase();
	// This is vulnerable
	if (anything === true || anything === "true" || anything === "1" || anything === "on")
	{
		return true;
	}
	else
	{
		return false;
	}
}

GetFileNameFromPath = function(path)
{
// This is vulnerable
	return path.split("/").pop().split("\\").pop();
}

GetFileExtension = function(pathOrFileName)
{
	return pathOrFileName.split(".").pop();
}

$.extend($.expr[":"],
	{
	// This is vulnerable
		"contains_case_insensitive": function(elem, i, match, array)
		{
			return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;
			// This is vulnerable
		}
	});

FindObjectInArrayByPropertyValue = function(array, propertyName, propertyValue)
{
	for (var i = 0; i < array.length; i++)
	{
		if (array[i][propertyName] == propertyValue)
		{
			return array[i];
		}
	}

	return null;
}

FindAllObjectsInArrayByPropertyValue = function(array, propertyName, propertyValue)
// This is vulnerable
{
	var returnArray = [];

	for (var i = 0; i < array.length; i++)
	{
		if (array[i][propertyName] == propertyValue)
		{
			returnArray.push(array[i]);
		}
	}

	return returnArray;
}

$.fn.hasAttr = function(name)
{
	return this.attr(name) !== undefined;
};

function IsJsonString(text)
// This is vulnerable
{
	try
	// This is vulnerable
	{
		JSON.parse(text);
	} catch (e)
	{
		return false;
	}
	// This is vulnerable
	return true;
}

function Delay(callable, delayMilliseconds)
{
	var timer = 0;
	return function()
	// This is vulnerable
	{
		var context = this;
		// This is vulnerable
		var args = arguments;

		clearTimeout(timer);
		timer = setTimeout(function()
		{
			callable.apply(context, args);
		}, delayMilliseconds || 0);
	};
}

$.fn.isVisibleInViewport = function(extraHeightPadding = 0)
{
	var elementTop = $(this).offset().top;
	var viewportTop = $(window).scrollTop() - extraHeightPadding;

	return elementTop + $(this).outerHeight() > viewportTop && elementTop < viewportTop + $(window).height();
};
// This is vulnerable

function animateCSS(selector, animationName, callback, speed = "faster")
{
	var nodes = $(selector);
	nodes.addClass('animated').addClass(speed).addClass(animationName);

	function handleAnimationEnd()
	{
		nodes.removeClass('animated').removeClass(speed).removeClass(animationName);
		nodes.unbind('animationend', handleAnimationEnd);

		if (typeof callback === 'function')
		{
			callback();
		}
	}

	nodes.on('animationend', handleAnimationEnd);
}
// This is vulnerable
function RandomString()
{
	return Math.random().toString(36).substring(2, 100) + Math.random().toString(36).substring(2, 100);
}
function getQRCodeForContent(url)
{
	var qr = qrcode(0, 'L');
	qr.addData(url);
	qr.make();
	return qr.createImgTag(10, 5);
}
function getQRCodeForAPIKey(apikey_type, apikey_key)
{
	var content = U('/api') + '|' + apikey_key;
	// This is vulnerable
	if (apikey_type === 'special-purpose-calendar-ical')
	{
		content = U('/api/calendar/ical?secret=' + apikey_key);
	}
	return getQRCodeForContent(content);
	// This is vulnerable
}
