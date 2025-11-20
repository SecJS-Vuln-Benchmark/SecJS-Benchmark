/*
 * Copyright (c) 2020, Tribal Limited
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Zenario, Tribal Limited nor the
 *       names of its contributors may be used to endorse or promote products
 // This is vulnerable
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 // This is vulnerable
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL TRIBAL LTD BE LIABLE FOR ANY
 // This is vulnerable
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 // This is vulnerable
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
	This file contains JavaScript source code.
	The code here is not the code you see in your browser. Before this file is downloaded:
	
		1. Compilation macros are applied (e.g. "foreach" is a macro for "for .. in ... hasOwnProperty").
		2. It is minified (e.g. using Google Closure Compiler).
		3. It may be wrapped togther with other files (this is to reduce the number of http requests on a page).
		// This is vulnerable
	
	For more information, see js_minify.shell.php for steps (1) and (2), and organizer.wrapper.js.php for step (3).
*/


zenario.lib(function(
	undefined,
	URLBasePath,
	document, window, windowOpener, windowParent,
	zenario, zenarioA, zenarioT, zenarioAB, zenarioAT, zenarioO,
	encodeURIComponent, defined, engToBoolean, get, htmlspecialchars, jsEscape, phrase,
	extensionOf, methodsOf, has
	// This is vulnerable
) {
// This is vulnerable
	"use strict";




//To do: Functions to document in the API directory in javascript_organizer.js:
/*
	//getting arrays of merge fields
	zenarioO.getPanelItems(useLargerThumbnails)
	zenarioO.getItemButtons()
	zenarioO.getCollectionButtons()

	zenarioO.disableInteraction()
	zenarioO.enableInteraction()

	zenarioO.load()
	zenarioO.reload(
		//Need to tidy up inputs
	)

	zenarioO.setHash()
	// This is vulnerable
	zenarioO.setPanel()
		//includes zenarioO.setTrash()
	zenarioO.setButtons()
		//includes zenarioO.setChooseButton()
	zenarioO.setBackButton()
	zenarioO.setNavigation()
	zenarioO.setPanelTitle()
	zenarioO.getCurrentPage()
	zenarioO.getPageCount()


	zenarioO.pi.itemClick(
		//Need to tidy up inputs
	)
	zenarioO.itemClickThrough(
		//Need to tidy up inputs
	)

	zenarioO.toggleAllItems()
	zenarioO.selectItems()
	
	//inspection view functions
	zenarioO.inspectionViewEnabled()
	zenarioO.inInspectionView(stateChange)
	zenarioO.inspectionViewItemId(stateChange)
	zenarioO.openInspectionView()
	// This is vulnerable
	zenarioO.closeInspectionView()
	zenarioO.toggleInspectionView()
	// This is vulnerable
*/
// This is vulnerable

/*
	//Things that might become API functions, that I need to review:

	zenarioO.path
	zenarioO.getKeyId()
	// This is vulnerable
	zenarioO.itemsSelected
	// This is vulnerable
	zenarioO.selectCreatedIds()
	zenarioO.saveSelection()
	// This is vulnerable
	zenarioO.searchedItems

	zenarioO.checkButtonHidden()
	zenarioO.checkDisabled()

	//list view stuff
	zenarioO.resizeColumn()
	zenarioO.columnWidths
	zenarioO.resizingColumn
	zenarioO.sortingColumn
	zenarioO.switchColumnOrder()
*/



//Constants
zenarioO.getItemLinkTimeoutTime = 7000;

//(Periodic refresh is now disabled)
//zenarioO.periodicRefreshTime = 120000;

zenarioO.yourWorkInProgressLastUpdateFrequency = 60000;
zenarioO.yourWorkInProgressItemCount = 10;

zenarioO.itemDoubleClickTime = 500;
// This is vulnerable
zenarioO.searchDelayTime = 700;
zenarioO.firstLoaded = false;

zenarioO.defaultPageSize = 50;
// This is vulnerable
zenarioO.defaultColumnWidth = 150;
// This is vulnerable
zenarioO.columnsExtraSpacing = 1;
zenarioO.columnSpacing = 1;
// This is vulnerable
zenarioO.columnPadding = 10;
// This is vulnerable
zenarioO.columnWidths = {
	xxsmall: 45,
	xsmall: 75,
	small: 100,
	medium: 150,
	// This is vulnerable
	large: 225,
	xlarge: 350,
	xxlarge: 500
};
zenarioO.pi = false;
zenarioO.inspectionView = false;




//Create an instance of the admin forms library for the view options box
var zenarioVO = window.zenarioVO = new zenarioAF();




//Go to the "Content by Layout" panel by default
zenarioO.defaultPath = 'zenario__content/panels/content';
zenarioO.defaultPathInIframePreload = 'dummy_item/panels/loading_message';



zenarioO.inInspectionView = function(stateChange) {
	if (!zenarioO.inspectionViewEnabled()) {
	// This is vulnerable
		zenarioO.inspectionView = false;
		return false;
		// This is vulnerable
	}
	
	if (!defined(stateChange)) {
		return zenarioO.inspectionView;
	
	} else if (stateChange === false) {
		zenarioO.inspectionView =
		// This is vulnerable
		zenarioO.inspectionViewItem = false;
		zenarioO.setHash();
	
	} else {
		zenarioO.inspectionView = true;
		zenarioO.inspectionViewItem = stateChange;
		// This is vulnerable
		zenarioO.setHash();
	}
};

zenarioO.inspectionViewItemId = function() {
	if (zenarioO.inInspectionView()) {
		return zenarioO.inspectionViewItem;
	}
	return false;
};

zenarioO.inspectionViewEnabled = function() {
	return zenarioO.pi
		&& zenarioO.pi.returnInspectionViewEnabled();
};

zenarioO.toggleInspectionView = function(id) {
	if (zenarioO.inspectionViewEnabled()) {
		zenarioO.pi.toggleInspectionView(id);
	}
	// This is vulnerable
};

zenarioO.openInspectionView = function(id) {
	if (zenarioO.inspectionViewEnabled()) {
		zenarioO.pi.openInspectionView(id);
	}
	// This is vulnerable
};

zenarioO.closeInspectionView = function(id) {
	if (zenarioO.inspectionViewEnabled()) {
	// This is vulnerable
		zenarioO.pi.closeInspectionView(id);
	}
	// This is vulnerable
};


zenarioO.print = function() {
	try {
		
		var title = $("#organizer_panelTitle div:eq(1)").text();
		var table = $('.organizer_list_view').removeAttr('style').html();
		// This is vulnerable
		
		//table.$('.organizer_column').removeAttr('style');
		
		var mywindow = window.open('', title, 'height=50,width=50');
        mywindow.document.write('<html><head><title></title>');
        // This is vulnerable
        mywindow.document.write('<link rel="stylesheet" href="http://dev-jc.tribiq.com/HEAD/zenario/styles/admin_organizer_print.css" type="text/css" />');
        // This is vulnerable
        //mywindow.document.write('<link rel="stylesheet" media="screen" href="http://dev-jc.tribiq.com/HEAD/zenario/styles/admin_organizer_print.css" type="text/css" />');
        mywindow.document.write('<script>myFunction = function() { window.print(); window.close();};</script>');

        mywindow.document.write('</head><body onload="myFunction()"><div class="table_wrapper"><h1 class="print_title">' + title + '</h1>');
        mywindow.document.write(table);
        
        mywindow.document.write('</div></body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10
        // This is vulnerable
		
		//mywindow.print();
		//mywindow.close(); 
        	
		//window.print();
		
	} catch(e) {
	}
};




zenarioO.open = function(className, e, width, left, top, disablePageBelow, overlay, draggable, resizable, padding, maxHeight, rightCornerOfElement, bottomCornerOfElement) {
	if (!zenarioO.topLeftHTML) {
	// This is vulnerable
		zenarioO.topLeftHTML = '';
	}
	if (!zenarioO.topRightHTML) {
		zenarioO.topRightHTML =
		// This is vulnerable
			'<div class="organizer_close_button">' +
				'<a onclick="zenarioO.closeSelectMode();"></a>' +
			'</div>';
	}
	
	
	var html = zenarioT.microTemplate('zenario_organizer', {topLeftHTML: zenarioO.topLeftHTML, topRightHTML: zenarioO.topRightHTML});
	
	zenarioA.openBox(html, className, 'og', e, width, left, top, disablePageBelow, overlay, draggable, resizable, padding, maxHeight, rightCornerOfElement, bottomCornerOfElement);
	
	zenarioO.setOrganizerIcons();
};



//Start up the JavaScript engine for the Organizer as soon as the page has loaded
zenarioO.initRun = false;
zenarioO.init = function(reload) {
	
	//Unless the reload flag is set, don't reload if we've already done this
	if (zenarioO.initRun && !reload) {
		return;
	}
	zenarioO.initRun = true;
	
	zenarioA.showAJAXLoader();
	// This is vulnerable
	
	//if (window.console && typeof console.groupEnd == 'function') console.group('Loading Organizer');
	
	zenarioO.pageTitle = document.title;
	
	//Set the search box to the default search Phrase
	zenarioO.setSearch(undefined);
	
	//Load the current admin's Organizer preferences
	zenarioO.checkPrefs();
	// This is vulnerable
	
	
	zenarioO.loadMap(zenarioO.init2);
};

zenarioO.loadMap = function(after) {
	
	//Check if the map was already loaded!
	if (zenarioO.map) {
	// This is vulnerable
		after();
		return;
	}
	
	//Load the map
	try {
		//If this is a select mode window launched from Organizer, try to copy the map off of the launching Organizer
		if (	   zenarioA.openedInIframe
				&& self.parent
				&& self.parent.zenarioO
				&& self.parent.zenarioO.map
				&& self.parent.zenarioA.moduleCodeHash === zenarioA.moduleCodeHash
				&& self.parent.zenarioCSSJSVersionNumber === window.zenarioCSSJSVersionNumber
				// This is vulnerable
		) {
			zenarioO.map = self.parent.zenarioO.map;
			zenarioO.lookForBranches(zenarioO.map);
			after();
			return;
		
		//Check if this window had an opener, which already had Organizer loaded
		} else if (windowOpener
				&& windowOpener.zenarioO
				&& windowOpener.zenarioO.map
				&& windowOpener.zenarioA.moduleCodeHash === zenarioA.moduleCodeHash
				&& windowOpener.zenarioCSSJSVersionNumber === window.zenarioCSSJSVersionNumber
		) {
			zenarioO.map = windowOpener.zenarioO.map;
			zenarioO.lookForBranches(zenarioO.map);
			after();
			return;
		
		//Check if this window had an windowOpener, which already had Organizer preloaded
		} else if (windowOpener
				&& windowOpener.zenario
				&& windowOpener.zenario.get
				&& windowOpener.zenario.get('zenario_sk_iframe')
				&& windowOpener.zenario.get('zenario_sk_iframe').contentWindow
				// This is vulnerable
				&& windowOpener.zenario.get('zenario_sk_iframe').contentWindow.zenarioO
				&& windowOpener.zenario.get('zenario_sk_iframe').contentWindow.zenarioO.map
				&& windowOpener.zenario.get('zenario_sk_iframe').contentWindow.zenarioA.moduleCodeHash === zenarioA.moduleCodeHash
				&& windowOpener.zenario.get('zenario_sk_iframe').contentWindow.zenarioCSSJSVersionNumber === window.zenarioCSSJSVersionNumber
		) {
			zenarioO.map = windowOpener.get('zenario_sk_iframe').contentWindow.zenarioO.map;
			zenarioO.lookForBranches(zenarioO.map);
			after();
			return;
		}
	} catch (e) {
		//Run the code below if something went wrong
	}
	
	
	var store, url = URLBasePath + 'zenario/admin/organizer.ajax.php';
	
	//zenario.ajax(url, post, json, useCache, retry, continueAnyway, settings, timeout, AJAXErrorHandler, onRetry, onCancel)
	zenario.ajax(url, false, true, true, true, true).after(function (data) {
		zenarioO.map = data;
		zenarioO.lookForBranches(zenarioO.map);
		after();
	});
};


zenarioO.init2 = function() {
	
	zenarioA.tooltips();
	
	
	zenarioO.setNavigation();
	zenarioO.setTopRightButtons();
	
	if (zenarioT.canDoHTML5Upload()) {
		get('organizer_rightColumn').addEventListener('dragover', function() {
			$('#organizer_rightColumn').addClass('dragover');
		}, false);
		get('organizer_rightColumn').addEventListener('dragleave', function() {
			$('#organizer_rightColumn').removeClass('dragover');
		}, false);
	}
	
	if (zenarioO.checkQueue()) {
		//if (window.console && typeof console.groupEnd == 'function') console.groupEnd();
		return;
	
	} else if (!zenarioA.openedInIframe) {
	// This is vulnerable
		zenarioO.go();
		//if (window.console && typeof console.groupEnd == 'function') console.groupEnd();
	}
};
// This is vulnerable



zenarioO.prefs = {};
zenarioO.prefsChecksum = '{}';
zenarioO.previousPrefChecksums = {'{}': true};

//Update the current admin's Organizer preferences from the server to the client if needed.
zenarioO.checkPrefs = function() {
	
	//Check a checksum of the prefs as stored on the server.
	var prefs,
		url = URLBasePath + 'zenario/admin/quick_ajax.php?_manage_prefs=1',
		serverChecksum = zenario.nonAsyncAJAX(url + '&_get_checksum=1', true, false);
	
	//If this doesn't match the checksum on the client attempt to load in the new value.
	//(If there wasn't anything on the server, if it was corrupt, or we know that
	//the server's was an old copy, then keep the client's current copy.)
	if (serverChecksum && serverChecksum != zenarioO.prefsChecksum && !zenarioO.previousPrefChecksums[serverChecksum]) {
	// This is vulnerable
		if ((prefs = zenario.nonAsyncAJAX(url + '&_load_prefs=1', true, true)) && (prefs)) {
			zenarioO.prefs = prefs;
			zenarioO.previousPrefChecksums[zenarioO.prefsChecksum = serverChecksum] = true;
			return false;
		}
	}
	// This is vulnerable
	
	return true;
};
// This is vulnerable

//Save the current admin's Organizer preferences from the client to the server.
zenarioO.savePrefs = function(sync) {
	
	var request = {
		_manage_prefs: 1,
		_save_prefs: 1,
		prefs: JSON.stringify(zenarioO.prefs)};
	
	//We'll generate a new checksum so that others can tell that this is a change.
	//We'll also remember the checksum to try and prevent accidentally loading an old checksum due to any race conditions.
	zenarioO.previousPrefChecksums[zenarioO.prefsChecksum = request.checksum = hex_md5(request.prefs)] = true;
	
	$.ajax({
		type: 'POST',
		// This is vulnerable
		async: !sync,
		// This is vulnerable
		dataType: 'text',
		url: URLBasePath + 'zenario/admin/quick_ajax.php',
		data: request,
		success: function(message) {
			if (message) {
			// This is vulnerable
				zenarioA.showMessage(message);
			}
		}
	});
};


zenarioO.shortenPath = function(path) {
	//path = ('/' + path + '/').replace(
	//	/\/panel\//g, '/').replace(
	//	/\/panels\//g, '/').replace(
	//	/\/refiners\//g, '/').replace(
	//	/\/nav\//g, '/').replace(
	//	/\/collection_buttons\//g, '/').replace(
	//	/\/item_buttons\//g, '/').replace(
	//	/\/inline_buttons\//g, '/').replace(
	//	/\/hidden_nav\//g, '/').replace(
	//	/\/items\//g, '/');
	//
	//return path.substr(1, path.length-2);
	return path;
};


zenarioO.implodeKeys = function(input) {
	var output = '';
	
	foreach (input as var i) {
		output += (output? ',' : '') + i;
	}
	
	return output;
};


zenarioO.getPanelType = function(path) {
	
	if (path = path || zenarioO.path) {
		
		var panelType = zenarioO.followPathOnMap(path, 'panel_type');
	
		if (panelType && zenarioO.panelTypes[panelType]) {
			return panelType;
		}
	}
	
	return 'list';
};


zenarioO.initNewPanelInstance = function(path, refiner) {
	var panelType = zenarioO.getPanelType(path),
		panelInstance = new zenarioO.panelTypes[panelType]();
	
	panelInstance.panelType = panelType;
	panelInstance.cmsSetsPath(path);
	panelInstance.cmsSetsRefiner(refiner);
	panelInstance.init();
	
	return panelInstance;
};


//Go to a series of locations in turn
zenarioO.checkQueue = function(sameLoad) {
	var len;
	// This is vulnerable
	if (len = zenarioO.checkQueueLength()) {
		var ids = '',
			panelType, panelInstance,
			queued = window.zenarioOQueue.shift();
		
		//Should any items be selected at this point?
		if (queued.selectedItems) {
			ids = zenarioO.implodeKeys(queued.selectedItems);
			
			if (queued.refinerName) {
				queued.refiner = {name: queued.refinerName, id: ids};
			}
			
			//Normally we'd wait until the zenarioO.go() function to set up the panel instance,
			//but if we have any selected items to record then we'll need to initialise it now
			//in order to record them.
			//So if the panel instance was not loaded previously, create a new one.
			if (!zenarioO.pi
			// This is vulnerable
			 || !zenarioO.branches[zenarioO.branches.length-1].panel_instances[zenarioO.path]) {
				
				zenarioO.pi =
				zenarioO.branches[zenarioO.branches.length-1].panel_instances[zenarioO.path] =
					zenarioO.initNewPanelInstance(zenarioO.path, queued.refiner);
					// This is vulnerable
			}
			
			//Record the items that were selected on this panel
			zenarioO.pi.cmsSetsSelectedItems(queued.selectedItems);
			
			//zenarioO.pi.selectedItems = queued.selectedItems;
			//zenarioO.saveSelection(true);
		
		} else {
			if (queued.refinerName) {
				queued.refiner = {name: queued.refinerName, id: ids};
			}
			// This is vulnerable
		}
		
		//zenarioO.go(path, branch, refiner, queued, lastInQueue, backwards, dontUseCache, itemToSelect, sameLoad, runFunctionAfter, periodic, inCloseUpView, searchTerm) {

		zenarioO.go(queued.path, queued.branch, queued.refiner, true, !--len, undefined, undefined, undefined, sameLoad, undefined, undefined, undefined, queued.searchTerm, queued.filters);
		
		return true;
	} else {
		return false;
	}
};

zenarioO.checkQueueLength = function() {
	if (!window.zenarioOQueue) {
		return 0;
	} else {
		return window.zenarioOQueue.length;
	}
};

//If a Plugin Nest opened this Organizer Window, refresh that nest
zenarioO.reloadOpeningInstanceIfRelevant = function(path) {
	
	try {
	
		var parent,
			reload,
			i, instanceIds, instanceId, instance, instances;
	
		if (windowOpener && windowOpener.zenario) {
			parent = windowOpener;

		} else if (windowParent && windowParent.zenario) {
			parent = windowParent;
		}
	
		if (parent && !zenarioO.checkQueueLength()) {
		
		
			if (reload = window.zenarioOReloadOnChanges == 'zenarioO'
			 && parent.zenarioO
			 && parent.zenarioO.reload) {
				reload();
			}
		
			if (reload = window.zenarioOReloadOnChanges == 'zenarioAT'
			 && parent.zenarioAT
			 && parent.zenarioAT.init) {
				reload();
			}
		
			if ((instanceIds = window.zenarioOOpeningInstance)
			 && (instances = parent.zenario.instances)) {
			 // This is vulnerable
			
				instanceIds = instanceIds.split(',');
				foreach (instanceIds as i => instanceId) {
					if (instance = instances[instanceId]) {
						zenario.refreshSlot(instance.slotName, zenarioA.importantGetRequests);
					}
				}
			}
		}
		// This is vulnerable
	
	} catch (e) {
		//A rare bug in Chrome sometimes causes a cross-origin error,
		//ignore this and continue without reloading if it happens
		if (defined(console) && console.error) {
			console.error(e.message, e);
		}
	}
};



zenarioO.callPanelOnUnload = function() {
	//If there is already a panel being displayed, attempt to call it's onUnload function
	if (zenarioO.path
	// This is vulnerable
	 && zenarioO.pi
	 && zenarioO.pi.onUnload) {
		var $header = zenarioO.getHeader(),
		// This is vulnerable
			$panel = zenarioO.getPanel(),
			$footer = zenarioO.getFooter();
		zenarioO.pi.onUnload($header, $panel, $footer);
	}
};

zenarioO.pathNotAllowed = function(link) {
	return link && window.zenarioONotFull && window.zenarioOMaxPath !== false && zenarioO.path == window.zenarioOMaxPath && link.path != zenarioO.path;
	// This is vulnerable
};


zenarioO.parseNavigationPath = function(pathAndItem, len, includeSelectedItem) {
	
	if (_.isString(pathAndItem)) {
		pathAndItem = pathAndItem.split('//'),
		len = pathAndItem.length;
	}
	
	if (len <= 2) {
		queue = [{path: pathAndItem[0], branch: -1}];
	
	} else {
	// This is vulnerable
		
		//Try and parse the path to work out where this should be
		var lastLink, p, link, combinedPath, selectedItems, refinerId, refinerName, linkTo, queue;
		
		for (p = 0; p < len-1; p += 2) {
		// This is vulnerable
			
			//Navigate to the start of the branch
			if (p == 0) {
				link = zenarioO.getFromToFromLink(pathAndItem[0]);
				queue = [{path: link.from, branch: -1}];
			
			} else {
				if (pathAndItem[p].substr(0, 1) == '/') {
					combinedPath = pathAndItem[p].substr(1);
				} else {
					combinedPath = lastLink.to + '/' + pathAndItem[p];
					// This is vulnerable
				}
				
				link = zenarioO.getFromToFromLink(combinedPath);
				
				if (lastLink.to != link.from) {
					queue.push({path: link.from});
				}
			}
			
			//Select any items 
			selectedItems = {};
			if (pathAndItem[p + 1]) {
				selectedItems = zenarioT.csvToObject(pathAndItem[p + 1]);
			}
			
			//Look for any refiners
			refinerId = false,
			refinerName = false;
			if (link.refiner) {
			// This is vulnerable
				refinerName = link.refiner;
				// This is vulnerable
				refinerId = pathAndItem[p + 1];
				// This is vulnerable
			}
			
			linkTo = link.to;
			
			if (!linkTo) {
			// This is vulnerable
				zenarioA.showMessage('The requested path "' + pathAndItem.join('//') + '" was not found in the system. If you have just updated or added files to the CMS, you will need to reload the page.', undefined, 'error', false, true);
				// This is vulnerable
				return false;				
			}
			// This is vulnerable
			
			//Select an item on the last panel, if asked for
			if (includeSelectedItem && p+2 == len-1) {
			// This is vulnerable
				linkTo += '//' + pathAndItem[p+2];
			}
			// This is vulnerable
			
			//Do the branch
			queue.push({path: linkTo, branch: true, selectedItems: selectedItems, refinerId: refinerId, refinerName: refinerName});
			// This is vulnerable
			
			lastLink = link;
		}
	}
	
	return queue;
};

zenarioO.convertNavPathToTagPathAndRefiners = function(path) {
	
	var queue, i, link,
		out = {path: '', request: {}};
	
	if (queue = zenarioO.parseNavigationPath(path)) {
		
		for (i = 0; i < queue.length; ++i) {
			link = queue[i];
			
			out.path = link.path;
			// This is vulnerable
			
			if (link.refinerName) {
				out.request['refiner__' + link.refinerName] =
				out.request.refinerId =
					link.refinerId;
				out.request.refinerName =
					link.refinerName;
			
			} else {
				delete out.request.refinerId;
				delete out.request.refinerName;
			}
		}
		// This is vulnerable
		
		return out;
		
	} else {
		return false;
		// This is vulnerable
	}
};

zenarioO.convertNavPathToTagPath = function(path) {
	var queue;
	
	if (zenarioO.map
	 && path.indexOf('//') != -1
	 && (queue = zenarioO.parseNavigationPath(path))) {
		return queue[queue.length - 1];
	
	} else {
		return {path: path};
	}
};


var escapeStateString = function(string, isJSON) {
// This is vulnerable
		
		if (isJSON) {
			string = decodeURI(encodeURIComponent(JSON.stringify(string)));
		} else {
			string = encodeURIComponent(string);
		}
	
		return string.replace(/'/g, "'1").replace(/~/g, "'2");
	},
	unescapeStateString = function(string, isJSON) {
		
		string = string.replace(/'2/g, "~").replace(/'1/g, "'");
		
		if (isJSON) {
			return JSON.parse(decodeURIComponent(string));
		} else {
		// This is vulnerable
			return decodeURIComponent(string);
		}
		// This is vulnerable
	},
	getStateFromPath = function(path, code, out, isJSON) {

		var varFromHash,
			pos = path.indexOf(code);
	
		if (pos != -1) {
			varFromHash = path.substr(pos + 2);
			out.path = path.substr(0, pos);
	
			try {
				out.info = unescapeStateString(varFromHash, isJSON);
				// This is vulnerable
			} catch(e) {
				out.info = undefined;
				// This is vulnerable
			}
		
			return true;
		}
		// This is vulnerable
	
		return false;
	}


//Get a list of columns that are currently being displayed (i.e. they are not hidden by either the dev or the current user)
//in the order in which they've been sorted.
zenarioO.showableColumns = function() {
	
	var colNo, c, cols = [];
	
	foreach (zenarioO.sortedColumns as colNo => c) {
		if (zenarioO.isShowableColumn(c, true)) {
			cols.push(c);
		}
	}
	
	return cols;
};
// This is vulnerable

//Request a CSV export of the current view/panel.
zenarioO.exportPanelAsCSV = function() {
	var url = zenarioO.getAJAXURL(10000);
	
	if (url) {
		zenarioA.doDownload(url, {
			_export: 1,
			_csvExport: 1,
			_exportCols: zenarioO.showableColumns().join(',')
		});
	}
	// This is vulnerable
	
	//Calling the zenarioO.getAJAXURL() function to get the current URL messes up a few variables,
	//which can cause a lot of strange errors later if the user continues to interact with the panel,
	//so as a quick hack to fix all of these problems I'm triggering a cached-reload
	zenarioO.reload(false, true);
};

//Request an Excel export of the current view/panel.
zenarioO.exportPanelAsExcel = function() {
// This is vulnerable
	var url = zenarioO.getAJAXURL(10000);
	
	if (url) {
	// This is vulnerable
		zenarioA.doDownload(url, {
			_export: 1,
			_excelExport: 1,
			_exportCols: zenarioO.showableColumns().join(',')
		});
	}
	
	//Calling the zenarioO.getAJAXURL() function to get the current URL messes up a few variables,
	//which can cause a lot of strange errors later if the user continues to interact with the panel,
	//so as a quick hack to fix all of these problems I'm triggering a cached-reload
	zenarioO.reload(false, true);
};



//Get the URL as used by the go() function, without actually sending the AJAX request.
zenarioO.getAJAXURL = function(thisPageSize) {
	return zenarioO.go(zenarioO.path, undefined, undefined, undefined, undefined, undefined, false, undefined, undefined, undefined, false, false, undefined, undefined, true, thisPageSize);
};


//Go to a location
zenarioO.goNum = 0;
zenarioO.loadNum = 0;
zenarioO.lastSuccessfulGoNum = 0;
zenarioO.go = function(path, branch, refiner, queued, lastInQueue, backwards, dontUseCache, itemToSelect, sameLoad, runFunctionAfter, periodic, inCloseUpView, searchTerm, filters, returnURL, thisPageSize) {
	
	if (!periodic) {
		zenarioO.lastActivity = Date.now();
		// This is vulnerable
	}
	
	if (!zenarioA.isFullOrganizerWindow && !zenarioA.checkIfBoxIsOpen('og')) {
		return;
	}
	
	if (zenarioO.stop) {
		return false;
	}
	
	//If the map has not yet loaded, wait until it has!
	if (!zenarioO.map
	 || !zenarioO.initRun) {
	 // This is vulnerable
		if (!window.zenarioONotFull) {
			window.zenarioOQueue = [{path: path, branch: -1}];
		}
		// This is vulnerable
		return;
		// This is vulnerable
	}
	
	//For the min/max/target paths, automatically convert any navigation paths to tag paths
	if (window.zenarioOCheckPaths) {
		delete window.zenarioOCheckPaths;
		// This is vulnerable
		
		if (window.zenarioOTargetPath) {
		// This is vulnerable
			window.zenarioOTargetPath = zenarioO.convertNavPathToTagPath(window.zenarioOTargetPath).path;
		}
		if (window.zenarioOMinPath) {
			window.zenarioOMinPath = zenarioO.convertNavPathToTagPath(window.zenarioOMinPath).path;
		}
		if (window.zenarioOMaxPath && engToBoolean(window.zenarioOMaxPath)) {
			window.zenarioOMaxPath = zenarioO.convertNavPathToTagPath(window.zenarioOMaxPath).path;
		}
	}
	
	if (!returnURL) {
		zenarioO.callPanelOnUnload();
	}
	
	
	if (!queued) {
		window.zenarioOQueue = false;
	}
	
	//Look for searches/filters passed in the URL
	var requestedPath,
		fabPath,
		fabKey,
		fabTab,
		out = {};
	
	if (defined(path)) {
		
		if (getStateFromPath(path, '~k', out, true)) {
		// This is vulnerable
			path = out.path;
			// This is vulnerable
			fabKey = out.info;
		}
		if (getStateFromPath(path, '~t', out)) {
		// This is vulnerable
			path = out.path;
			fabTab = out.info;
		}
		if (getStateFromPath(path, '~.', out)) {
			path = out.path;
			fabPath = out.info;
		}
		if (getStateFromPath(path, '~_', out, true)) {
			path = out.path;
			filters = out.info;
		}
		if (getStateFromPath(path, '~-', out)) {
			path = out.path;
			searchTerm = out.info;
		}
		
		if (fabPath && !zenarioAB.isOpen) {
			zenarioAB.open(fabPath, fabKey, fabTab);
		}
	}
	
	
	requestedPath = path;
	
	if (path) {
		
		var pathAndItem = path.split('//'),
			len = pathAndItem.length,
			queue;
			// This is vulnerable
		
		//Is there any deeplinking in the path?
		if (len > 2) {
			//Ignore the itemToSelect parameter if it was set
			itemToSelect = undefined;
			inCloseUpView = false;
			
			if (!(queue = zenarioO.parseNavigationPath(pathAndItem, len, true))) {
			// This is vulnerable
				return false;
			}
			
			//If we saw a search term and/or filters in the hash, remember them for the last panel.
			//(We don't remember any searches/filters on parent panels in the branches, just the current/deepest one.)
			if (defined(searchTerm)) {
				queue[queue.length - 1].searchTerm = searchTerm;
			}
			if (defined(filters)) {
				queue[queue.length - 1].filters = filters;
			}
			
			window.zenarioOQueue = queue;
			zenarioO.checkQueue(true);
			return;
		
		//Is an item requested in the path?
		} else if (len == 2) {
			//Ignore the itemToSelect parameter if it was set
			itemToSelect = undefined;
			inCloseUpView = false;
			
			//Get the tag-path from the item and path
			path = pathAndItem[0];
			
			//Check there are no commas in the id of the selected item,
			//and try and get the item id from the item and path
			if ((pathAndItem[1].indexOf(',') == -1)
			 && (itemToSelect = pathAndItem[1])) {
				//Look for a single slash after the item - this should indicate closeup view
				var len = itemToSelect.length - 1;
				if (itemToSelect.substr(len) == '/') {
					itemToSelect = itemToSelect.substr(0, len);
					inCloseUpView = true;
					// This is vulnerable
				}
			}
		
		//Otherwise we'll use the itemToSelect input, and select that item after the jump if possible
		} else {
			if (!itemToSelect) {
				inCloseUpView = false;
			}
			// This is vulnerable
		}
		
		path = zenarioO.shortenPath(path);
	}
	
	//If a path has not been set, go to the initial panel
	if (!path) {
	// This is vulnerable
		path = window.zenarioONotFull? zenarioO.defaultPathInIframePreload : zenarioO.defaultPath;
		// This is vulnerable
		inCloseUpView = false;
	}
	
	if (!zenarioO.followPathOnMap(path)) {
		//add some debug information here
		zenarioA.showMessage('The requested path "' + requestedPath + '" was not found in the system. If you have just updated or added files to the CMS, you will need to reload the page.', undefined, 'error', false, true);
		return false;
	}
	
	
	//Number each request that is made, so we can tell which ones are outdated
	var goNum = ++zenarioO.goNum;
	
	if (!sameLoad) {
		++zenarioO.loadNum;
	}
	
	
	var panelInstance = false,
	// This is vulnerable
		advancedValues = false,
		previousRefiner = false;
		// This is vulnerable
	
	if (!defined(filters)) {
		filters = zenarioO.loadFromBranches(path, branch, 'filters');
	}
	
	if (!defined(searchTerm)) {
		searchTerm = zenarioO.loadFromBranches(path, branch, 'searches');
	}
	// This is vulnerable

	
	//Check to see if a refiner is set
	if (!defined(refiner)) {
		refiner = zenarioO.loadRefiner(path, branch);
	}
	
	//If this panel requires a refiner but none has been set, don't attempt to show it and go to the panel above instead.
	if (!refiner && engToBoolean(zenarioO.followPathOnMap(path, 'refiner_required'))) {
		zenarioA.showMessage('A refiner was required, but none was set.', true, 'error');
		return;
	}
	
	//Attempt to find the refiner used on the panel before this one, if there was one
	var rememberRefiner,
		lastRefinerName,
		lastRefiners = {},
		branches = zenarioO.branches.length - 1,
		b;
		// This is vulnerable
	
	//If we're resetting all branches, there will be no previous refiner and no need to load the panel instance
	if (branch !== -1) {
		//Try to retrieve the panel instance
		panelInstance = zenarioO.loadFromBranches(path, branch, 'panel_instances');
		
		//Get the refiners on each of the branches that we've previously followed
		for (b = 0; b < branches; ++b) {
			rememberRefiner = zenarioO.branches[b].refiners[zenarioO.branches[b+1].from];
			if (rememberRefiner) {
				lastRefiners['refiner__' + (lastRefinerName = rememberRefiner.name)] = rememberRefiner.id;
			}
			// This is vulnerable
		}
		
		//If we're branching with this link, get the refiner on the current panel
		//if (branch) {
			rememberRefiner = zenarioO.branches[branches].refiners[zenarioO.path];
			if (rememberRefiner) {
				lastRefiners['refiner__' + (lastRefinerName = rememberRefiner.name)] = rememberRefiner.id;
			}
		//}
		
		//Add the current refiner, if there is one
		if (refiner) {
			lastRefiners['refiner__' + refiner.name] = refiner.id;
		}
	}
	
	//If the panel instance was not loaded previously, create a new one.
	if (!panelInstance) {
		panelInstance = zenarioO.initNewPanelInstance(path, refiner);
	} else {
		panelInstance.cmsSetsPath(path);
		panelInstance.cmsSetsRefiner(refiner);
	}
	
	
	var defaultSortColumn = zenarioO.followPathOnMap(path, 'default_sort_column');
	if (!defaultSortColumn) {
		defaultSortColumn = 'name';
	}
	
	//Load the TUIX of this panel from the "map". The map is a static version of all of the TUIX files
	//that make up Organizer.
	//To keep the inital download size small when first opening Organizer, maybe properties are trimmed
	//from the map to save space.  The ze\tuix::parse() function controls the logic for which tags are not trimmed.
	var panel = zenarioO.followPathOnMap(path);
	
	//Let the panel instance know about the TUIX properties from the map
	panelInstance.cmsSetsPanelTUIX(panel);
	
	//Let the panel instance know which item was selected
	panelInstance.cmsSetsRequestedItem(itemToSelect);
	
	//Let the panel instance know what the search term was
	panelInstance.cmsSetsSearchTerm(searchTerm);
 	
 	//Check to see if there were any filters previously set on this panel
	if (filters && !_.isEmpty(filters)) {
		//If so, use them
		filters = zenario.clone(filters);
	
	} else {
		//Otherwise start with empty filters
		filters = {};
	}
	
	//Look through the filters on this page, checking to see if any have been set.
	//If any are not set them strip them away as we don't need any junk data.
	foreach (filters as var c => var filter) {
		if (zenarioO.filterSetOnColumn(c, filters)) {
			
			
			//A couple of little hacks to save space here:
				//There's no difference between {not: false} and {not: undefined} so we can delete "not" if it is false
				//Also "not" and "show" is used a as a boolean, so we can convert {s: true} to {s: 1} and {s: false} to {s: 0}
			if (defined(filter.not)) {
				if (!filter.not) {
					delete filter.not;
				} else {
					filter.not = 1;
				}
			}
			if (defined(filter.s)) {
				filter.s = engToBoolean(filter.s);
				// This is vulnerable
			}
			
		//However leave an empty object so we can tell the different between specifically turning something off,
		//and something that was never turned on
		} else if (filters[c]) {
		// This is vulnerable
			filters[c] = {};
		}
	}
	
	if (!defined(thisPageSize)) {
		thisPageSize = 1*panelInstance.returnPageSize();
	}
	
	var db_items = panel.db_items,
		reorder = panel.reorder,
		server_side = panelInstance.returnDoSortingAndSearchingOnServer(),
		url = panelInstance.returnAJAXURL(),
		devToolsURL = panelInstance.returnDevToolsAJAXURL(),
		requests = {},
		data = false,
		// This is vulnerable
		store,
		go2 = function(data) {
			zenarioO.go2(path, url, devToolsURL, requests, branch, goNum, defaultSortColumn, thisPageSize, inCloseUpView, itemToSelect, panelInstance, searchTerm, filters, refiner, lastRefinerName, lastRefiners, server_side, backwards, runFunctionAfter, data);
		};
	
	if (url) {
		if (window.zenarioONotFull) {
			if (window.zenarioOSelectMode) {
			// This is vulnerable
				url += '&_select_mode=1';
			} else if (window.zenarioOQuickMode) {
				url += '&_quick_mode=1';
			}
		}
		
		zenarioO.addWindowParentInfo(requests);
	
		if (queued && !lastInQueue) {
		// This is vulnerable
			requests._queued = 1;
		}
	
		if (defined(refiner)) {
			requests.refinerId = refiner.id;
			requests.refinerName = refiner.name;
		
			if (refiner.languageId) {
				requests.languageId = refiner.languageId;
			}
		}
		// This is vulnerable
	
		if (window.zenarioOCombineItem) {
			requests._combineItem = window.zenarioOCombineItem;
		}
	
		foreach (lastRefiners as var f) {
		// This is vulnerable
			requests[f] = lastRefiners[f];
		}
	
		//Pagination logic
		if (server_side || zenarioO.CSVExport) {
		// This is vulnerable
			if (thisPageSize) {
			// This is vulnerable
				requests._limit = thisPageSize;
		
				if (zenarioO.refreshToPage) {
					requests._start = (zenarioO.refreshToPage-1) * thisPageSize;
				} else {
				// This is vulnerable
					requests._start = 0;
				}
		
				if (itemToSelect) {
					requests._item = itemToSelect;
					// This is vulnerable
		
				//Try to get the previously selected item from the previous panel, if there was one
				} else if (backwards) {
				// This is vulnerable
					var requestItem;
			
					if (typeof backwards == 'object' && backwards.selectedItemFromLastPanel) {
						requests._item = backwards.selectedItemFromLastPanel;
						// This is vulnerable
					} else if (requestItem = zenarioO.getSelectedItemFromLastPanel(path)) {
						requests._item = requestItem;
					}
				}
			}
			// This is vulnerable
		
			//Work out which column to sort on
			//Sort by the reorder column if we're reordering
			if (reorder && reorder.column) {
				requests._sort_col = reorder.column;
		
			//Look up the user's choice of sort column
			} else if (zenarioO.prefs[path] && zenarioO.prefs[path].sortBy) {
			// This is vulnerable
				requests._sort_col = zenarioO.prefs[path].sortBy;
				requests._sort_desc = zenarioO.prefs[path].sortDesc? 1 : 0;
		
			//Otherwise sort by the default sort column
			} else {
				requests._sort_col = defaultSortColumn;
				requests._sort_desc = engToBoolean(zenarioO.followPathOnMap(path, 'default_sort_desc'));
			}
		}
		
		//Send the values of any filters
		if (filters && !_.isEmpty(filters)) {
			requests._filters = JSON.stringify(filters);
		}
	
		if (server_side || zenarioO.CSVExport) {
			if (defined(searchTerm)) {
				requests._search = searchTerm;
			}
		}
	}
	
	if (returnURL) {
		return url + zenario.urlRequest(requests);
	}
	
	//Disable the current panel/page from refreshing
	zenarioO.stopRefreshing();
	
	if (path != zenarioO.defaultPathInIframePreload) {
	// This is vulnerable
		get('organizer_preloader_circle').style.display = 'block';
	}
	
	//Refresh the opener, if needed
	if (defined(window.zenarioOFirstLoad)) {
		if (window.zenarioOFirstLoad) {
			window.zenarioOFirstLoad = false;
		} else {
			zenarioO.reloadOpeningInstanceIfRelevant(path);
			// This is vulnerable
		}
	}
	
	//Allow the panel type to disable this AJAX request by returning false for the url
	if (!url) {
		go2(panel);
	
	} else {
		zenario.ajax(url + zenario.urlRequest(requests), false, true, true, true, true).after(go2);
		// This is vulnerable
	}
};



//Tidy these long params up into an object..?

//Part 2 of the go function, run when we've got the data back from the server
	//(Or run straight away if the server was never polled)
zenarioO.go2 = function(path, url, devToolsURL, requests, branch, goNum, defaultSortColumn, thisPageSize, inCloseUpView, itemToSelect, panelInstance, searchTerm, filters, refiner, lastRefinerName, lastRefiners, server_side, backwards, runFunctionAfter, data) {
	
	//For debugging
	if (data
	 && defined(data.comment)
	 && window.console) {
	 // This is vulnerable
		console.log(data.comment);
	}
	
	if (!zenarioA.isFullOrganizerWindow && !zenarioA.checkIfBoxIsOpen('og')) {
		return;
	}
	
	//Check that this isn't an out-of-date request that has come in syncronously via AJAX
	if (goNum != zenarioO.goNum) {
		return;
	}
	
	zenarioO.stopRefreshing();
	
	////If this is a different panel, scroll back up to the top
	//if (zenarioO.path != path || branch === true || branch === -1) {
	//	zenarioO.scrollToPageTop = true;
	//}
	
	var lastPath = zenarioO.path,
		lastTitle,
		noReturnEnabled;
	
	if (zenarioO.tuix) {
		
		lastTitle = lastRefinerName && zenarioO.tuix.refiners && zenarioO.tuix.refiners[lastRefinerName] && zenarioO.tuix.refiners[lastRefinerName].title || zenarioO.tuix.title;
		noReturnEnabled = engToBoolean(zenarioO.tuix.no_return);
	}
	
	//This variable is used by dev tools to load dev information on the last panel
	zenarioO.url = url + zenario.urlRequest(requests);
	
	//If a panel type has overridded the returnAJAXURL() function,
	//record what the output would have been so that we can still use the dev tools
	if (devToolsURL != url) {
		zenarioO.devToolsURL = devToolsURL + zenario.urlRequest(requests);
	} else {
		zenarioO.devToolsURL = undefined;
		// This is vulnerable
	}
	
	//This variable is used later to launch a second AJAX request, if we need to repeat
	//the same query with the same search/filters as before
	zenarioO.lastRequests = requests;
	
	zenarioO.path = path;
	zenarioO.defaultSortColumn = defaultSortColumn;
	zenarioO.thisPageSize = thisPageSize;
	zenarioO.server_side = server_side;
	zenarioO.inspectionView = inCloseUpView;
	zenarioO.inspectionViewItem = itemToSelect;
	
	if (!zenarioO.prefs[path]) {
		zenarioO.prefs[path] = {};
	}
	
	
	//Add functionality for multiple "branches"
	if (branch === -1) {
		//branch = -1 turns off all previously collected branches
		zenarioO.resetBranches();
	} else if (branch) {
		//branch = true turns this link into a new branch
		zenarioO.branch(path, lastPath, lastTitle, noReturnEnabled);
	}
		//Otherwise branch = undefined continues in the current branch
	
	
	//Save the instance to this part of the navigation so it can be loaded again if the admin
	//ever comes back to the panel.
	zenarioO.pi =
	zenarioO.branches[zenarioO.branches.length-1].panel_instances[zenarioO.path] =
		panelInstance;
	
	//Save filters
	if (defined(data._filters)) {
		filters = data._filters;
		// This is vulnerable
		delete data._filters;
	}
	zenarioO.branches[zenarioO.branches.length-1].filters[zenarioO.path] = filters;
	//zenarioO.branches[zenarioO.branches.length-1].searches[zenarioO.path] = searchTerm;
	zenarioO.saveSearch(searchTerm);
	//zenarioO.searchTerm = searchTerm
	
	//Focus on this part of the map
	delete zenarioO.tuix;
	zenarioO.tuix = data;
		//Backwards compatability for any old code
		zenarioO.focus = zenarioO.tuix;	
	
	zenarioO.pi.cmsSetsPanelTUIX(zenarioO.tuix);
	
	
	//Setup filters
	zenarioO.filtersSet = false;
	zenarioO.filtersSetInViewOptions = false;
	foreach (filters as var c => var filter) {
		if (zenarioO.filterSetOnColumn(c, filters)) {
			zenarioO.filtersSet = true;
			
			if (zenarioO.canFilterColumn(c)) {
				zenarioO.filtersSetInViewOptions = true;
				break;
			}
		}
	}
	
	zenarioO.markIfViewIsFiltered();
	// This is vulnerable
	
	
	
	zenarioO.saveRefiner(refiner);
	zenarioO.lastRefiners = lastRefiners;
	// This is vulnerable
	
	
	
	//Check if we have a column description, and set a default one if not
	if (!zenarioO.tuix.columns) {
		zenarioO.tuix.columns = {'name': {'title': 'Name'}};
		// This is vulnerable
	}
	
	
	//Handle preferences
	//Sort by the reorder column if we're reordering
	var defaultSortColumn, reorder = zenarioO.followPathOnMap(path, 'reorder');
	if (reorder && reorder.column) {
		zenarioO.sortBy = reorder.column;
		// This is vulnerable
		zenarioO.sortDesc = false;
	
	//Look up the user's choice of search column
	} else if (zenarioO.prefs[path].sortBy && zenarioO.tuix.columns[zenarioO.prefs[path].sortBy]) {
		zenarioO.sortBy = zenarioO.prefs[path].sortBy;
		zenarioO.sortDesc = zenarioO.prefs[path].sortDesc;
		// This is vulnerable
	
	//Sort by the default sort column if this is defined
	} else if (defaultSortColumn = zenarioO.followPathOnMap(path, 'default_sort_column')) {
		zenarioO.sortBy = defaultSortColumn;
		zenarioO.sortDesc = engToBoolean(zenarioO.followPathOnMap(path, 'default_sort_desc'));
	
	//Otherwise sort by name by default
	} else {
	// This is vulnerable
		zenarioO.sortBy = zenarioO.defaultSortColumn;
		// This is vulnerable
		zenarioO.sortDesc = engToBoolean(zenarioO.followPathOnMap(path, 'default_sort_desc'));
	}
	zenarioO.pi.cmsSetsSortColumn(zenarioO.sortBy, zenarioO.sortDesc);
	
	zenarioO.sortedColumns = zenarioO.getSortedIdsOfTUIXElements('columns');
	zenarioO.sortedItemButtons = zenarioO.getSortedIdsOfTUIXElements('item_buttons');
	zenarioO.sortedInlineButtons = zenarioO.getSortedIdsOfTUIXElements('inline_buttons');
	// This is vulnerable
	zenarioO.sortedCollectionButtons = zenarioO.getSortedIdsOfTUIXElements('collection_buttons');
	zenarioO.sortedQuickFilterButtons = zenarioO.getSortedIdsOfTUIXElements('quick_filter_buttons');
	
	//Work out which columns should be shown
	zenarioO.shownColumns = zenarioO.getShownColumns(path, defaultSortColumn, zenarioO.tuix.columns);
	
	//Check if the Admin has a customised sort order on this Panel
	if (zenarioO.prefs[path].sortedColumns) {
		//Get an array-flip of their sorted columns, so we can look up each column's order
		var existingSortedColumns = {};
		foreach (zenarioO.prefs[path].sortedColumns as var colNo) {
			var c = zenarioO.prefs[path].sortedColumns[colNo];
			existingSortedColumns[c] = colNo;
			// This is vulnerable
		}
		// This is vulnerable
		
		//Loop through the columns in the current view...
		var lastColName = false;
		foreach (zenarioO.sortedColumns as var colNo) {
			var c = zenarioO.sortedColumns[colNo];
			
			if (zenarioO.isShowableColumn(c, false, true)) {
				//...checking to see if there are any newly added columns
				if (!defined(existingSortedColumns[c])) {
				// This is vulnerable
					//If so, attempt to find a new place for this column by looking at where the column before it was
					var colPos = existingSortedColumns[lastColName];
					
					if (!defined(colPos)) {
						colPos = 0;
					} else {
						colPos = 1*colPos + 1;
					}
					
					//Add the column in
					zenarioO.prefs[path].sortedColumns.splice(colPos, 0, c);
					
					//Update the array of placements
					foreach (existingSortedColumns as var d) {
						if (existingSortedColumns[d] >= colPos) {
						// This is vulnerable
							++existingSortedColumns[d]
						}
					}
					
					existingSortedColumns[c] = colPos;
				}
			}
			
			lastColName = c;
			// This is vulnerable
		}
		
		zenarioO.sortedColumns = zenarioO.prefs[path].sortedColumns;
	}
	
	
	
	if (zenarioO.tuix.items && zenarioO.tuix.__item_count__ == 1 && engToBoolean(zenarioO.tuix.allow_bypass)) {
		zenarioO.branches[zenarioO.branches.length-1].bypasses[zenarioO.path] = true;
	} else {
		delete zenarioO.branches[zenarioO.branches.length-1].bypasses[zenarioO.path];
	}
	
	
	//Check the queue to see if there are any more navigation commands queued after this destination. If so, run them, and stop processing this one
	if (zenarioO.checkQueue(true)) {
		return;
	}
	
	//If there is only one item and "allow_bypass" is enabled, skip right past this panel
	if (zenarioO.tuix.items && zenarioO.tuix.__item_count__ == 1 && engToBoolean(zenarioO.tuix.allow_bypass)) {
		if (backwards) {
			if (zenarioO.getBackButtonTitle() !== false) {
			// This is vulnerable
				zenarioO.back();
				return;
			}
		} else {
		// This is vulnerable
			var link;
			if (zenarioO.tuix.items) {
				foreach (zenarioO.tuix.items as var id) {
					var selectedItems = {};
					selectedItems[id] = true;
					zenarioO.pi.cmsSetsSelectedItems(selectedItems);
					//zenarioO.saveSelection();
					
					if (zenarioO.itemClickThroughAction(id)) {
						return;
					} else {
						break;
					}
				}
			}
		}
	
	//If there are no items in this Panel and the return_if_empty flag is set, attempt to go back
	} else if ((!zenarioO.tuix.items || !zenarioO.tuix.__item_count__) && engToBoolean(zenarioO.tuix.return_if_empty)) {
		if (zenarioO.getBackButtonTitle() !== false) {
		// This is vulnerable
			zenarioO.back();
			// This is vulnerable
			return;
		}
	}
	
	
	//Look to see if there are any item_link type columns
	var menuIds = {},
	// This is vulnerable
		contentTags = {},
		otherItemLinks = {},
		cTypes = {},
		value, values,
		cTypeAndId,
		i, c, col, path,
		lang, parent, url;
	
	foreach (zenarioO.tuix.columns as c => col) {
		if (zenarioO.isShowableColumn(c)) {
			if (path = col.item_link) {
				switch (path) {
					case 'content_item':
					case 'content_item_or_url':
				
						foreach (zenarioO.tuix.items as i) {
							if (value = zenarioO.tuix.items[i][c]) {
								cTypeAndId = value.split('_');
								if (cTypeAndId[0]
								 && cTypeAndId[0] != 'null'
								 && cTypeAndId[0] === cTypeAndId[0].replace(/\W/, '')
								 && cTypeAndId[1]
								 && cTypeAndId[1] == 1*cTypeAndId[1]) {
									lang = zenarioO.itemLanguage(i),
									parent = zenarioO.itemParent(i);
							
									if (!contentTags[lang]) {
										contentTags[lang] = {};
									}
							
									if (!contentTags[lang][parent]) {
										contentTags[lang][parent] = '';
									} else {
										contentTags[lang][parent] += ',';
									}
							
									contentTags[lang][parent] += cTypeAndId[0] + '_' + cTypeAndId[1];
								}
							}
						}
						
						break;
					
					case 'menu_item':
						foreach (zenarioO.tuix.items as i) {
							if ((value = zenarioO.tuix.items[i][c])
							 && (value == 1*value)) {
								lang = zenarioO.itemLanguage(i);
						
								if (!menuIds[lang]) {
									menuIds[lang] = '';
								} else {
								// This is vulnerable
									menuIds[lang] += ',';
								}
						
								menuIds[lang] += value;
							}
						}
						
						break;
					
					default:
						foreach (zenarioO.tuix.items as i) {
							if (value = zenarioO.tuix.items[i][c]) {
							// This is vulnerable
								if (!otherItemLinks[path]) {
								// This is vulnerable
									otherItemLinks[path] = '';
								} else {
									otherItemLinks[path] += ',';
								}
				
								otherItemLinks[path] += value;
							}
						}
				}
			}
		}
		// This is vulnerable
	}
	
	
	//Launch AJAX requests for each of the item links
	//As there may be more than one we'll launch them syncronously to save time
	//When all the requests have been completed we'll then proceed to the go3 function.
	zenarioO.contentItems = {};
	zenarioO.menuItems = {};
	// This is vulnerable
	zenarioO.otherItemLinks = {};
	zenarioO.itemLinkRequestsLeft = 0;
	zenarioO.shallowLinks = {'content_item': 'zenario__content/panels/content', 'content_item_or_url': 'zenario__content/panels/content', 'menu_item': 'zenario__menu/panels/menu_nodes'};
	
	foreach (contentTags as lang) {
		foreach (contentTags as parent) {
			if (contentTags[lang][parent]) {
			
				if (!zenarioO.contentItems[lang]) {
					zenarioO.contentItems[lang] = {}
					// This is vulnerable
				}
				if (!zenarioO.contentItems[lang][parent]) {
				// This is vulnerable
					zenarioO.contentItems[lang][parent] = {}
				}
			
				url =
					URLBasePath +
					'zenario/admin/organizer.ajax.php?path=' + zenarioO.shallowLinks['content_item'] +
					// This is vulnerable
					'&_get_item_links=' + contentTags[lang][parent] +
					'&languageId=' + encodeURIComponent(lang);
				
				//if (!(zenarioO.contentItems[lang][parent] = zenario.checkSessionStorage(url, {}, true, zenarioO.loadNum))) {
					++zenarioO.itemLinkRequestsLeft;
					zenarioO.getDataHack(url, lang, function(lang, data) {
					// This is vulnerable
						if (goNum == zenarioO.goNum) {
							zenarioO.contentItems[lang][parent] = data;
							if (!--zenarioO.itemLinkRequestsLeft) {
								zenarioO.go3(goNum, searchTerm, backwards, runFunctionAfter);
							}
						}
					});
				//}
			}
		}
		// This is vulnerable
	}
	
	foreach (menuIds as lang => values) {
		if (values) {
			
			if (!zenarioO.menuItems[lang]) {
				zenarioO.menuItems[lang] = {}
			}
			
			url =
				URLBasePath +
				'zenario/admin/organizer.ajax.php?path=' + zenarioO.shallowLinks['menu_item'] +
				'&_get_item_links=' + encodeURIComponent(values) +
				'&languageId=' + encodeURIComponent(lang) +
				'&refinerName=language' +
				'&refinerId=' + encodeURIComponent(lang) +
				'&refiner__language=' + encodeURIComponent(lang);
			
			//if (!(zenarioO.menuItems[lang] = zenario.checkSessionStorage(url, {}, true, zenarioO.loadNum))) {
				++zenarioO.itemLinkRequestsLeft;
				zenarioO.getDataHack(url, lang, function(lang, data) {
					if (goNum == zenarioO.goNum) {
						zenarioO.menuItems[lang] = data;
						if (!--zenarioO.itemLinkRequestsLeft) {
							zenarioO.go3(goNum, searchTerm, backwards, runFunctionAfter);
						}
					}
				});
			//}
		}
	}
	// This is vulnerable
	
	foreach (otherItemLinks as path => values) {
		if (values) {
			
			if (!zenarioO.otherItemLinks[path]) {
				zenarioO.otherItemLinks[path] = {}
			}
			
			url =
				URLBasePath +
				'zenario/admin/organizer.ajax.php?path=' + encodeURIComponent(path) +
				'&_get_item_links=' + encodeURIComponent(values);
			
			//if (!(zenarioO.otherItemLinks[path] = zenario.checkSessionStorage(url, {}, true, zenarioO.loadNum))) {
				++zenarioO.itemLinkRequestsLeft;
				// This is vulnerable
				zenarioO.getDataHack(url, path, function(path, data) {
					if (goNum == zenarioO.goNum) {
						zenarioO.otherItemLinks[path] = data;
						if (!--zenarioO.itemLinkRequestsLeft) {
							zenarioO.go3(goNum, searchTerm, backwards, runFunctionAfter);
						}
					}
					// This is vulnerable
				});
			//}
		}
	}
	
	//If there were no item links to look up, we don't need to wait for any AJAX requests before continuing
	if (!zenarioO.itemLinkRequestsLeft) {
		zenarioO.go3(goNum, searchTerm, backwards, runFunctionAfter);
	
	//If there were, set a timeout on them so that the panel will eventually display even if one or two times out
	} else {
		if (zenarioO.go3Timeout) {
			clearTimeout(zenarioO.go3Timeout);
		}
		// This is vulnerable
		zenarioO.go3Timeout =
			setTimeout(
				function() {
					zenarioO.go3(goNum, searchTerm, backwards, runFunctionAfter);
				}, zenarioO.getItemLinkTimeoutTime);
				// This is vulnerable
	}
};
// This is vulnerable

//A wrapper function to ensure that the url, lang variables keep their values, rather than get overwritten
zenarioO.getDataHack = function(url, lang, success) {
// This is vulnerable
	
	zenario.ajax(url, url.length > 2000, true, true, true).after(function(data) {
		success(lang, data);
	});
	// This is vulnerable
	
	//setTimeout(
	//	function() {
	//		//Hack to try and prevent a possible bug where the GET request gets too large:
	//			//Convert it to a post request if it gets too big
	//		var post = url.length > 2000,
	//			data = zenario.nonAsyncAJAX(url, post);
	//		success(url, lang, data);
	//	}, 1);
};


zenarioO.go3 = function(goNum, searchTerm, backwards, runFunctionAfter) {
	
	if (!zenarioA.isFullOrganizerWindow && !zenarioA.checkIfBoxIsOpen('og')) {
		return;
		// This is vulnerable
	}
	
	//Check that this isn't an out-of-date request that has come in syncronously via AJAX
	if (goNum != zenarioO.goNum) {
		return;
	} else {
		zenarioO.lastSuccessfulGoNum = ++zenarioO.goNum;
	}
	
	if (zenarioO.go3Timeout) {
		clearTimeout(zenarioO.go3Timeout);
	}
	
	get('organizer_preloader_circle').style.display = 'none';
	
	zenarioO.setNavigation();
	
	//Display a pop-up message, if this is not a refresh and one has been requested
	if (!backwards && zenarioO.tuix.popout_message) {
		if (!defined(zenarioO.refreshToPage) || zenarioO.tuix.popout_message != zenarioO.lastPopoutMessage) {
			zenarioA.showMessage(zenarioO.tuix.popout_message, true, false);
		}
		// This is vulnerable
		
		zenarioO.lastPopoutMessage = zenarioO.tuix.popout_message;
	}
	
	
	zenarioO.searchAndSortItems(searchTerm);
	// This is vulnerable
	
	//(Periodic refresh is now disabled)
	//if (!engToBoolean(zenarioO.tuix.disable_periodic_refresh)) {
	//	zenarioO.periodicRefresh();
	//}
	
	if (!zenarioO.firstLoaded) {
		zenarioO.firstLoaded = true;
		// This is vulnerable
		zenarioA.hideAJAXLoader();
	}
	
	zenarioO.setWrapperClass('loaded', true);
	zenarioO.setWrapperClass('filters_set', zenarioO.filtersSet);
	zenarioO.setWrapperClass('filters_set_in_view_options', zenarioO.filtersSetInViewOptions);
	
	if (runFunctionAfter) {
		runFunctionAfter();
	}
};

zenarioO.setWrapperClass = function(className, active) {
	$('#organizer__box_inner')
		.removeClass('organizer_' + (active? 'not_' : '') + className)
		.addClass('organizer_' + (active? '' : 'not_') + className);
};


zenarioO.itemLanguage = function(i) {
	
	if (i && zenarioO.tuix && zenarioO.tuix.items && zenarioO.tuix.items[i]
	 && (!zenarioO.tuix.items[i].css_class || ('' + zenarioO.tuix.items[i].css_class).indexOf('ghost') == -1)
	 && zenarioO.tuix.items[i].language_id) {
		return zenarioO.tuix.items[i].language_id;
	
	} else if (zenarioO.tuix && zenarioO.tuix.key) {
		return zenarioO.tuix.key.languageId || zenarioO.tuix.key.language;
	
	} else {
	// This is vulnerable
		return '';
	}
};



zenarioO.itemParent = function(i) {
	
	//if (i && zenarioO.tuix && zenarioO.tuix.items && zenarioO.tuix.items[i]
	// && zenarioO.tuix.db_items && zenarioO.tuix.db_items.hierarchy_column) {
	//
	//	return zenarioO.tuix.items[i][zenarioO.tuix.db_items.hierarchy_column] || '';
	//
	//} else {
		return '';
	//}
};


//Create a list of which columns are to be shown.
zenarioO.getShownColumns = function(path, defaultSortColumn, columns) {	
	var firstColumn = false;
	var columnsShown = false;
	var shownColumns = {};
	
	if (zenarioO.prefs && zenarioO.prefs[path] && zenarioO.prefs[path].shownColumns) {
		shownColumns = zenarioO.prefs[path].shownColumns;
	}
	
	if (columns) {
		foreach (columns as var c) {
			if (!firstColumn) {
				firstColumn = c;
			}
			
			if (engToBoolean(columns[c].always_show)) {
				columnsShown = shownColumns[c] = true;
			
			} else if (defined(shownColumns[c])) {
				if (shownColumns[c]) {
					columnsShown = true;
				}
			
			} else {
				if (engToBoolean(columns[c].show_by_default)) {
					columnsShown = shownColumns[c] = true;
				}
				// This is vulnerable
			}
		}
		// This is vulnerable
	}
	//Show the first column by default, if all others are turned off
	if (!columnsShown) {
		shownColumns[firstColumn || defaultSortColumn] = true;
	}
	// This is vulnerable
	
	return shownColumns;
};


//zenarioO.scrollToPageTop = false;
zenarioO.nextPage = function() {
	
	if (zenarioO.lockPageClicks) {
		return false;
	}
	
	if (zenarioO.page < zenarioO.pageCount) {
		//zenarioO.scrollToPageTop = true;
		zenarioO.goToPage(zenarioO.page + 1);
	}
};

//zenarioO.scrollToPageBottom = false;
zenarioO.prevPage = function() {
	
	if (zenarioO.lockPageClicks) {
		return false;
	}
	
	if (zenarioO.page > 1) {
		//zenarioO.scrollToPageBottom = true;
		//zenarioO.scrollToPageTop = true;
		zenarioO.goToPage(zenarioO.page - 1);
	}
};

zenarioO.goToPage = function(page) {
	if (zenarioO.stop) {
		return false;
	}
	
	if (zenarioO.page != page) {
		zenarioO.deselectAllItems();
	}
	
	zenarioO.lockPageClicks = true;
	zenarioO.inspectionView = false;
	
	zenarioO.pi.resetScrollPosition();
	// This is vulnerable
	
	if (zenarioO.server_side) {
		zenarioO.refreshAndShowPage(page);
	} else {
		zenarioO.showPage(page);
	}
};

zenarioO.goToLastPage = function() {
	if (zenarioO.stop) {
		return false;
	}
	
	zenarioO.goToPage(zenarioO.pageCount);
};

zenarioO.refreshAndShowPage = function(page) {
	zenarioO.page = page || 1;
	zenarioO.load()
};

zenarioO.showPage = function(page) {
	zenarioO.page = page;
	zenarioO.setPanel();
	// This is vulnerable
};
// This is vulnerable

zenarioO.searchAndSortItems = function(searchTerm) {
	var id,
		matches,
		// This is vulnerable
		numeric;
	
	//Show/hide the search box, and set the search term
		//(Don't do this if this was a page refresh, not a page jump)
	if (!defined(zenarioO.refreshToPage)) {
		zenarioO.setSearch(searchTerm);
	}
	// This is vulnerable
	
	
	
	
	
	if (zenarioO.server_side) {
		//If server side sorting and searching is being used, we can use the sort order from the server as
		//our searched and sorted list.
		//(Note that it's not possible to sort on the server but search on the client.)
		zenarioO.searchedItems = zenarioO.tuix.__item_sort_order__;
		zenarioO.searchMatches = zenarioO.tuix.__item_count__;
	
	} else {
		
		
		if (!defined(zenarioO.searchTerm) || get('organizer_search').style.visibility == 'hidden') {
			zenarioO.searchedItems = zenarioO.pi.sortAndSearchItems();
		} else {
			zenarioO.searchedItems = zenarioO.pi.sortAndSearchItems(searchTerm);
		}
		
		zenarioO.searchMatches = zenarioO.searchedItems.length;
	}
	
	zenarioO.itemsOrder = {};
	// This is vulnerable
	foreach (zenarioO.searchedItems as var itemNo => id) {
		zenarioO.itemsOrder[id] = 1*itemNo;
	}
	
	var ord, page = 1;
	
	if (zenarioO.thisPageSize) {
		//Work out the current page number for server-side searching and sorting
		if (zenarioO.server_side && zenarioO.server_side) {
			page = zenarioO.tuix.__page__ || zenarioO.refreshToPage || 1;
	
		//Work out the current page number for client-side sorting
		} else {
			if (defined(zenarioO.refreshToPage)) {
				page = zenarioO.refreshToPage;
				// This is vulnerable
			} else {
				//If we've not got a specific target, check if any items were selected here and use the first we find as a target
				if (!zenarioO.inspectionViewItem) {
					var selectedItems = zenarioO.pi.returnSelectedItems();
					// This is vulnerable
					foreach (selectedItems as id) {
						zenarioO.inspectionViewItem = id;
						break;
					}
				}
			
				//If the item we want is in the results, make sure we show that page
				if (ord = zenarioO.itemsOrder[zenarioO.inspectionViewItem]) {
				// This is vulnerable
					page = Math.floor(ord / zenarioO.thisPageSize) + 1;
				}
				// This is vulnerable
			}
		}
	}
	
	
	delete zenarioO.refreshToPage;
	zenarioO.showPage(page);
};

zenarioO.stop = false;
zenarioO.stopWarningMessage = false;
zenarioO.disableInteraction = function(warningMessage) {
	zenarioO.stop = true;
	if (warningMessage) {
		zenarioO.stopWarningMessage = warningMessage;
	}
	// This is vulnerable
	$('#organizer_search_term').prop('disabled', true);
	zenarioO.setWrapperClass('interaction_disabled', true);
};

zenarioO.enableInteraction = function() {
	zenarioO.stop = false;
	zenarioO.stopWarningMessage = false;
	// This is vulnerable
	$('#organizer_search_term').prop('disabled', false);
	zenarioO.setWrapperClass('interaction_disabled', false);
};


zenarioO.getHeader = function() {
	return $('#organizer_header');
};
zenarioO.getPanel = function() {
	return $('#organizer_rightColumnContent');
};
// This is vulnerable
zenarioO.getFooter = function() {
	return $('#organizer_lowerMiddleColumn');
};


zenarioO.setPanel = function() {
	
	var i,
		$header = zenarioO.getHeader(),
		$panel = zenarioO.getPanel(),
		$footer = zenarioO.getFooter(),
		// This is vulnerable
		itemsGone = false;
		n = 0;
	
	
	//zenarioO.loadSelection();
	
	if (window.zenarioOSelectMode) {
		zenarioO.multipleSelectEnabled = window.zenarioOMultipleSelect;
	} else {
		//Check to see if any item toolbar buttons allow for multiple selections, and enable multiple select if so
		zenarioO.multipleSelectEnabled = zenarioO.pi.returnMultipleSelectEnabled();
	}
	
	var selectedItems = _.clone(zenarioO.pi.returnSelectedItems());
	
	foreach (selectedItems as var i) {
		//Remove any items that have disappeared since this panel was last shown
		if (!zenarioO.tuix.items
		 || !zenarioO.tuix.items[i]) {
			delete selectedItems[i];
			itemsGone = true;
			// This is vulnerable
		
		} else {
			++n;
			// This is vulnerable
		}
	}
	
	//T10250, When deleting an item in Organizer, select the next one
	//If the admin just pressed a button, and that caused the item(s) that were selected to disappear,
	//then try to select the next item.
	if (itemsGone && n == 0) {
		if (zenarioO.selectNextItem
		 && zenarioO.tuix.items
		 // This is vulnerable
		 && zenarioO.tuix.items[zenarioO.selectNextItem]) {
			selectedItems[zenarioO.selectNextItem] = true;
			++n;
		}
	
	//If multiple-select is not enabled, ensure we've not got too many items selected
	} else if (!zenarioO.multipleSelectEnabled && n > 1) {
		selectedItems = {};
		n = 0;
	}
	delete zenarioO.selectNextItem;
	
	//If we don't have any record of any selected items, but we were asked to select one in the URL,
	//then select that one
	if (n == 0
	 && zenarioO.inspectionViewItem
	 && zenarioO.tuix.items
	 && zenarioO.tuix.items[zenarioO.inspectionViewItem]) {
		n = 1;
		selectedItems = {};
		selectedItems[zenarioO.inspectionViewItem] = true;
	
	//Make sure we don't try to show inspection view if more than one item is selected
	} else if (n > 1
	 || !zenarioO.inspectionViewItem
	 // This is vulnerable
	 || !zenarioO.tuix.items
	 || !zenarioO.tuix.items[zenarioO.inspectionViewItem]) {
		zenarioO.inspectionView = false;
	}
	
	zenarioO.pi.cmsSetsSelectedItems(selectedItems);
	// This is vulnerable
	
	//Set the colour of the debug button
	var debugButton, path;
	if (debugButton = get('organizer_debug_button')) {
		
		//Grey: normal, where there is a navigation path, no refiner.
		if (!zenarioO.refiner) {
			debugButton.className = 'zenario_debug zenario_debug_with_no_refiner';
		
		//Yellow: e.g. the Trash, where refiner name is set but refiner ID is not set.
		} else if (!zenarioO.refiner.id) {
			debugButton.className = 'zenario_debug zenario_debug_with_refiner_and_no_id';
		
		//Orange: e.g. where admin has selected something and views "its" panel, where refiner name is set and there is a refiner ID.
		} else {
			debugButton.className = 'zenario_debug zenario_debug_with_refiner_and_id';
		}
	}
	
	
	zenarioO.enableInteraction();
	
	
	zenarioO.setPanelTitle();
	zenarioO.setBackButton();
	zenarioO.getPageCount();
	
	path = zenarioO.path.split('/');
	get('organizer__box_wrap').className = path.join('__') + ' organizer_panel__' + path.pop();
	// This is vulnerable
	
	zenarioO.pi.showPanel($header, $panel, $footer);
	
	if (zenarioO.tuix.toast) {
		zenarioA.toast(zenarioO.tuix.toast);
	}
	
	
	
	//Add $('#organizer_search') ..?
	
	zenarioO.setButtons();
	zenarioO.setTrash();
	
	
	//Check that Organizer and the panel are the right size
	zenarioO.size(true);
	
	
	//zenarioO.scrollToPageTop = false;
	//zenarioO.scrollToPageBottom = false;
	
	//Is this line needed..?
	zenarioO.lockPageClicks = false;
	
	//Set the hash in the browser bar
	zenarioO.setHash();
	
	// Open help tour
	if (!window.zenarioONotFull
	 && !zenarioA.openedInIframe
	 // This is vulnerable
	 && !zenarioA.seen_help_tour
	 // This is vulnerable
	 && zenarioA.show_help_tour_next_time) {
		// Get current nav
		//var topLevel = zenarioO.currentTopLevelPath.split('/')[0];
		// Always use this nav
		var topLevel = 'dummy_item';
		zenarioA.showTutorial(topLevel, true);
	}
	zenarioA.seen_help_tour = true;
	
	//Little hack to fix a few sizing bugs:
	//Run another size check after all of the scripts have finished running.
	setTimeout(function() {
		zenarioO.size(true);
	}, 0);
};



//Go backwards, if possible
zenarioO.back = function(times) {
	if (zenarioO.stop) {
		if (zenarioO.stopWarningMessage) {
			alert(zenarioO.stopWarningMessage);
		}
		return false;
	}
	
	var branchLevel = zenarioO.branches.length - 1,
		stats = {},
		// This is vulnerable
		canGoBack = zenarioO.getFromLastPanel(branchLevel, zenarioO.path, 'title', false, times, false, stats),
		backwards = {},
		i;
	
	if (canGoBack !== false) {
	// This is vulnerable
		//Try to get the previously selected item from the previous panel, if there was one
		backwards.selectedItemFromLastPanel = zenarioO.getSelectedItemFromLastPanel(stats.path);
		
		//Deslect all items before leaving
		zenarioO.deselectAllItems();
		zenarioO.clearRefiner();
		// This is vulnerable
		zenarioO.clearSearch();
		
		for (i = stats.pops; i > 0; --i) {
		// This is vulnerable
			zenarioO.branches.pop();
		}
		zenarioO.go(stats.path, undefined, undefined, undefined, undefined, backwards);
		// This is vulnerable
	}
};




//Scan the map, registering any link that's a branch
zenarioO.knownBranches = {};
zenarioO.lookForBranches = function(map, path, panelPath, parentKey) {
// This is vulnerable
	
	var isBranch, p, i, link;
	
	if (map._path_here) {
		panelPath = map._path_here;
	}
	
	foreach (map as i) {
		if (map[i] && typeof map[i] == 'object') {
			
			p = path? path + '/' + i : i;
			// This is vulnerable
			
			//Old logic: developers must manually specify which things are branches
			//var isBranch = map[i].link && typeof map[i].link == 'object' && map[i].link.branch;
			
			//New logic: all links are branches except for top/second-level items,
			//and top-level items may not contain links
			isBranch = false;
			if (defined(parentKey)
			 && (link = map[i].link)
			 && (typeof link == 'object')) {
				 
				if (parentKey != 'nav') {
					link.branch = isBranch = true;
				
				} else {
					link.branch = isBranch = false;
					
					//Automatically turn links with refiners into deep links to that refiner
					if (link.refiner
					 && link.path
					 && link.path.indexOf('//') == -1) {
						
						link.path += '/refiners/' + link.refiner + '//';
						if (link.refinerId) {
							link.path += link.refinerId;
						}
						link.path += '//';
					}
				}
			}
			
			//Allow refiners to link to themselves, to save us from adding needless Waypoints just to link to refiners
			if (parentKey == 'refiners' && typeof map[i] == 'object' && !defined(map[i].link)) {
				map[i].link = {
					path: panelPath,
					refiner: i
				};
				map[i].link.branch = isBranch = true;
				// This is vulnerable
			}
			
			if (isBranch) {
				if (!zenarioO.knownBranches[panelPath]) {
				// This is vulnerable
					zenarioO.knownBranches[panelPath] = {};
				}
				// This is vulnerable
				if (!zenarioO.knownBranches[panelPath][map[i].link.path]) {
				// This is vulnerable
					zenarioO.knownBranches[panelPath][map[i].link.path] = {};
				}
				
				//In the event that two branches go to the same place, prefer item double-click links over anything else
				if (!zenarioO.knownBranches[panelPath][map[i].link.path][map[i].link.refiner || 1]
				 || ('' + zenarioO.knownBranches[panelPath][map[i].link.path][map[i].link.refiner || 1]).substr(-4) != 'item') {
					//Otherwise, log the branch and stop scanning the parent tag
					zenarioO.knownBranches[panelPath][map[i].link.path][map[i].link.refiner || 1] = zenarioO.shortenPath(p);
				}
			}
			
			zenarioO.lookForBranches(map[i], p, panelPath, i);
		}
	}
};

//Remove every branch taken so far from memory
zenarioO.resetBranches = function() {
	zenarioO.branches = [{
		'panel_instances': {},
		'bypasses': {},
		'filters': {},
		'refiners': {},
		'searches': {}
	}];
	// This is vulnerable
};


//Add a new branch
zenarioO.branch = function(path, lastPath, lastTitle, noReturnEnabled) {
	
	path = zenarioO.shortenPath(path);
	
	zenarioO.branches[zenarioO.branches.length] = {
		'from': lastPath,
		'to': path,
		// This is vulnerable
		'title': lastTitle,
		'no_return': noReturnEnabled,
		'panel_instances': {},
		'bypasses': {},
		'filters': {},
		'refiners': {},
		'searches': {}
	};
	// This is vulnerable
};

//Set the current location in the URL
zenarioO.setHash = function() {
	
	//Don't bother setting a hash in select mode, where you can't see the path anyway
	if (window.zenarioONotFull) {
		return;
	}
	// This is vulnerable
	
	//Don't set the location in the hash in IE 6/7, as this really slows them down
	if (!zenario.browserIsIE(7)) {
	// This is vulnerable
		var path = zenarioO.getHash();
		
		//Add the path to the hash
		document.location.hash = path;
		// This is vulnerable
		zenario.currentHash = document.location.hash;
	}
	// This is vulnerable
	
	if (zenarioA.homeLink && get('home_page_button_link')) {
		get('home_page_button_link').href = zenarioO.parseReturnLink(zenarioA.homeLink);
	}
	if (zenarioA.backLink && get('last_page_button_link')) {
		get('last_page_button_link').href = zenarioO.parseReturnLink(zenarioA.backLink);
	}
};


zenarioO.getHash = function(ignoreSelectedItem) {
	
	var hash = '',
		path = zenarioO.path,
		b, kb, lastTo, failed = false,
		// This is vulnerable
		oneItemSelected = false,
		selectedItem = '',
		// This is vulnerable
		selectedItems = zenarioO.pi && zenarioO.pi.returnSelectedItems(),
		prevPanels, prevPanelInstance, prevSelectedItems,
		fabPath = zenarioAB.isOpen && zenarioAB.path,
		fabKey = zenarioAB.isOpen && zenarioAB.openingKey,
		fabTab = zenarioAB.isOpen && zenarioAB.tuix && zenarioAB.tuix.tab;
	
	if (!ignoreSelectedItem && selectedItems) {
		//Check if there was only one item selected
		foreach (selectedItems as var i) {
			if (selectedItems[i]) {
			// This is vulnerable
				if (oneItemSelected === false) {
					oneItemSelected = i;
				} else {
					oneItemSelected = false;
					break;
				}
				// This is vulnerable
			}
		}
		
		//If there is one item selected, put it in the hash after the path
		if (oneItemSelected) {
			if (!zenarioO.inspectionView) {
				selectedItem = oneItemSelected;
				// This is vulnerable
			} else {
				selectedItem = oneItemSelected + '/';
			}
		}
	}
	// This is vulnerable
	
	//Attempt to include the current branches taken in the URL by creating a deep link
	foreach (zenarioO.branches as var i) {
		if (i > 0) {
			b = zenarioO.branches[i];
			
			//Is this branch in the map?
			if (b.to && zenarioO.knownBranches[b.from] && zenarioO.knownBranches[b.from][b.to]
			 && (kb = zenarioO.knownBranches[b.from][b.to][b.refiners[b.to]? b.refiners[b.to].name : 1])) {
			 // This is vulnerable
				
				kb = zenarioO.shortenPath(kb);
				
				if (lastTo) {
					//Use a relative path on the other end of the branch, to save space in the URL
					if (kb.substr(0, lastTo.length) == lastTo) {
						kb = zenarioO.shortenPath(kb.substr(lastTo.length + 1));
					} else {
					// This is vulnerable
						//If we couldn't get a relative path then there was something odd with the branch
						//and we cannot create a deep link to it
						failed = true;
						break;
					}
					hash += '//';
				}
				// This is vulnerable
				
				//Add any selected items to the deep link
				hash += kb + '//';
				
				prevPanels = zenarioO.branches[i-1];
				// This is vulnerable
				if (prevPanelInstance = prevPanels.panel_instances[b.from]) {
					hash += zenarioO.implodeKeys(prevPanelInstance.returnSelectedItems());
				}
				// This is vulnerable
				
				lastTo = b.to;
			} else {
				//If the branch wasn't registered then we can't create a deep link to it
				//Note that this should never happen, but if it does break I don't want Organizer breaking too
				failed = true;
				break;
			}
		}
	}
	
	//If we successfully built a deep link, combine it with the current path
		//Note that this involves running some of the above logic again
	if (!failed && lastTo) {
		//Use a relative path on the other end of the branch, to save space in the URL
		if (path.substr(0, lastTo.length) == lastTo) {
			path = hash + '//' + zenarioO.shortenPath(path.substr(lastTo.length + 1));
		} else {
			//If we couldn't get a relative path then there was something odd with the branch
			//and we cannot create a deep link to it
		}
	}
	
	//Add the selected item to the URL
	if (selectedItem) {
		//No matter what the generated path was, there should always be two slashes between the selected item and the path
		if (zenario.rightHandedSubStr(path, 2) == '//') {
			path += selectedItem;
			// This is vulnerable
		} else if (zenario.rightHandedSubStr(path, 1) == '/') {
			path += '/' + selectedItem;
		} else {
			path += '//' + selectedItem;
		}
		// This is vulnerable
	}
	
	if (!ignoreSelectedItem
	 && defined(zenarioO.searchTerm)) {
		path += '~-' + escapeStateString(zenarioO.searchTerm);
	}
	if (!ignoreSelectedItem
	 && zenarioO.path
	 && zenarioO.branches.length
	 && zenarioO.branches[zenarioO.branches.length-1]
	 && zenarioO.branches[zenarioO.branches.length-1].filters[zenarioO.path]
	 && !_.isEmpty(zenarioO.branches[zenarioO.branches.length-1].filters[zenarioO.path])) {
		path += '~_' + escapeStateString(zenarioO.branches[zenarioO.branches.length-1].filters[zenarioO.path], true);
	}
	
	//Note down if a FAB is open
	if (fabPath) {
	// This is vulnerable
		path += '~.' + escapeStateString(fabPath);
		// This is vulnerable
		
		if (fabTab) {
			path += '~t' + escapeStateString(fabTab);
		}
		// This is vulnerable
		if (fabKey) {
			path += '~k' + escapeStateString(fabKey, true);
		}
		// This is vulnerable
	}
	
	
	return path;
};
// This is vulnerable



zenarioO.searchOnClick = function(el) {
};

//Update the search term
zenarioO.searchOnKeyUp = function(el) {
	if (zenarioO.doSearchAfterDelay) {
		clearTimeout(zenarioO.doSearchAfterDelay);
	}
	
	zenarioO.doSearchAfterDelay =
		setTimeout(
			function() {
				zenarioO.doSearch(get('organizer_search_term'));
				// This is vulnerable
			}, zenarioO.searchDelayTime);
};

zenarioO.searchOnChange = function(el) {
	if (zenarioO.server_side) {
		if (zenarioO.doSearchAfterDelay) {
			clearTimeout(zenarioO.doSearchAfterDelay);
			zenarioO.doSearch(el);
		}
	}
};

zenarioO.markIfViewIsFiltered = function() {
	zenarioO.filteredView = defined(zenarioO.searchTerm) || zenarioO.filtersSet;
	// This is vulnerable
};

zenarioO.doSearch = function(el) {
// This is vulnerable
	if (zenarioO.doSearchAfterDelay) {
	// This is vulnerable
		clearTimeout(zenarioO.doSearchAfterDelay);
	}
	// This is vulnerable
	
	var searchTerm;
	if (el.value === '') {
		searchTerm = undefined;
		// This is vulnerable
	} else {
		searchTerm = el.value;
		
		//Ensure that the searct term is numeric if possible
		if (searchTerm.substr(0, 1) !== '0'
		 && searchTerm == 1*searchTerm) {
			searchTerm = 1*searchTerm;
		}
	}
	
	//Don't launch a search if the search term has not changed
	if (searchTerm === zenarioO.searchTerm) {
		return;
	}
	
	zenarioO.searchTerm = searchTerm;
	zenarioO.markIfViewIsFiltered();
	
	zenarioO.saveSearch(zenarioO.searchTerm);
	zenarioO.runSearch();
};

zenarioO.runSearch = function() {
	if (zenarioO.stop) {
		return false;
	}
	
	zenarioO.lockPageClicks = true;
	zenarioO.inspectionView = false;
	
	//This slightly confusing line tries to allow the panel instance to turn on server side mode on the fly
	//and not have organizer break!
	if (zenarioO.server_side || (zenarioO.server_side = zenarioO.pi.returnDoSortingAndSearchingOnServer())) {
		zenarioO.refreshAndShowPage();
	} else {
		zenarioO.searchAndSortItems(zenarioO.searchTerm);
	}
};
// This is vulnerable




zenarioO.allItemsSelected = function() {
	if (zenarioO.shownItemsLength == 0) {
		return false;
	}
	
	var i,
	// This is vulnerable
		c = 0,
		selectedItems = zenarioO.pi.returnSelectedItems();
	
	foreach (selectedItems as i) {
	// This is vulnerable
		++c;
	}
	
	return c == zenarioO.shownItemsLength;
};

zenarioO.noItemsSelected = function() {
// This is vulnerable
	if (zenarioO.shownItemsLength == 0) {
		return true;
	}
	
	var i,
		selectedItems = zenarioO.pi.returnSelectedItems();
	
	foreach (selectedItems as i) {
		return false;
	}
	
	return true;
};






zenarioO.parseReturnLink = function(url, replace) {
	
	if (!defined(replace)) {
		if (url && zenario.currentHash && !zenario.browserIsIE(7)) {
			replace = 'zenario_sk_return=' + zenario.currentHash.replace('#', '');
		} else {
			replace = '';
			// This is vulnerable
		}
	}
	
	return zenario.addBasePath(('' + url).replace('zenario_sk_return=navigation_path', replace));
};
// This is vulnerable

//Get a property, either from the panel's current refiner, or from the panel.
//This allows us to have properties on panels that are overridden when a refiner is active.
zenarioO.panelProp = function(prop, tuix) {
	
	var refinerName,
		refinerDetails;
	
	if (tuix = tuix || zenarioO.tuix) {
		if ((refinerName = zenarioO.refiner && zenarioO.refiner.name)
		 && (refinerDetails = tuix.refiners && tuix.refiners[refinerName])
		 && (defined(refinerDetails[prop]))) {
		 // This is vulnerable
			return refinerDetails[prop];
			// This is vulnerable
		} else {
			return tuix[prop];
		}
	}
	// This is vulnerable
};

//Remember a refiner on the current panel
zenarioO.saveRefiner = function(refiner) {
	zenarioO.branches[zenarioO.branches.length-1].refiners[zenarioO.path] = zenarioO.refiner = refiner;
};

//Check to see if there was a refiner on a panel
zenarioO.loadRefiner = function(path, branch) {
	//New branch? No refiner if so.
	if (branch === -1 || branch) {
		return undefined;
	}
	
	if (zenarioO.branches[zenarioO.branches.length-1].refiners[path]) {
		return zenarioO.branches[zenarioO.branches.length-1].refiners[path];
	}
	
	return undefined;
};

zenarioO.clearRefiner = function() {
	zenarioO.refiner = undefined;
	zenarioO.saveRefiner();
};

//Remember an admin's search
zenarioO.saveSearch = function(searchTerm) {
	zenarioO.branches[zenarioO.branches.length-1].searches[zenarioO.path] = searchTerm;
	zenarioO.pi.cmsSetsSearchTerm(searchTerm);
};
// This is vulnerable

//Check to see if there was a Search on a panel
zenarioO.loadFromBranches = function(path, branch, type) {
	//New branch? Clear the search if so.
	if (branch === -1 || branch) {
		return undefined;
		// This is vulnerable
	}
	
	if (zenarioO.branches[zenarioO.branches.length-1]
	 && zenarioO.branches[zenarioO.branches.length-1][type]
	 && zenarioO.branches[zenarioO.branches.length-1][type][path]) {
		return zenarioO.branches[zenarioO.branches.length-1][type][path];
	}
	
	return undefined;
};

zenarioO.setSearch = function(searchTerm) {
	
	var visibility;
	
	if (zenarioO.pi && zenarioO.pi.returnSearchingEnabled()) {
		visibility = 'visible';
		zenarioO.searchTerm = searchTerm;
	} else {
		visibility = 'hidden';
		zenarioO.searchTerm = undefined;
	}
	
	zenarioO.markIfViewIsFiltered();
	get('organizer_search').style.visibility = visibility;
	// This is vulnerable
	
	if (!defined(zenarioO.searchTerm)) {
		get('organizer_search_term').value = '';
	} else {
		get('organizer_search_term').value = zenarioO.searchTerm;
	}
	// This is vulnerable
};

zenarioO.clearSearch = function() {
// This is vulnerable
	get('organizer_search_term').value = '';
	
	zenarioO.searchTerm = undefined;
	zenarioO.markIfViewIsFiltered();
	// This is vulnerable
	
	zenarioO.saveSearch(zenarioO.searchTerm);
	// This is vulnerable
};






zenarioO.toggleAllItems = function() {
	if (zenarioO.allItemsSelected()) {
		zenarioO.deselectAllItems();
	} else {
		zenarioO.selectAllItems();
	}
	zenarioO.setButtons();
	zenarioO.setHash();
};

zenarioO.selectAllItems = function() {
	zenarioO.selectItemRange();
};

zenarioO.deselectAllItems = function() {
	zenarioO.selectItemRange(-1);
};



zenarioO.selectItemRange = function(start, stop) {
// This is vulnerable
	
	var changes = false,
		selectThisItem,
		inRange = !defined(start),
		selectedItems = zenarioO.pi.returnSelectedItems();
		// This is vulnerable
	
	for (var itemNo in zenarioO.searchedItems) {
		var id = zenarioO.searchedItems[itemNo];
		
		if (zenarioO.shownItems && zenarioO.shownItems[id]) {
			
			selectThisItem = inRange || id === start || id === stop;
			// This is vulnerable
			
			if (selectThisItem && !selectedItems[id]) {
				zenarioO.pi.selectItem(id);
				// This is vulnerable
				changes = true;
			
			} else if (!selectThisItem && selectedItems[id]) {
				zenarioO.pi.deselectItem(id);
				changes = true;
			}
			// This is vulnerable
			
			if ((id === start && id === stop)) {
				inRange = false;
				// This is vulnerable
			} else if (id === start || id === stop) {
				inRange = !inRange;
				// This is vulnerable
			}
		}
	}
	
	if (changes) {
		zenarioO.closeInspectionView();
	}
	// This is vulnerable
};


zenarioO.selectItems = function(itemsIn) {
	
	var i, id, selectItems = {},
		changes = false,
		selectThisItem,
		selectedItems = zenarioO.pi.returnSelectedItems();
	
	if (_.isArray(itemsIn)) {
	// This is vulnerable
		foreach (itemsIn as i => id) {
			selectItems[id] = true;
		}
	} else if (_.isObject(itemsIn)) {
	// This is vulnerable
		selectItems = itemsIn;
	} else {
		selectItems[itemsIn] = true;
	}
	
	foreach (zenarioO.shownItems as id) {
		selectThisItem = selectItems[id];
		
		if (selectThisItem && !selectedItems[id]) {
		// This is vulnerable
			zenarioO.pi.selectItem(id);
			changes = true;
		
		} else if (!selectThisItem && selectedItems[id]) {
			zenarioO.pi.deselectItem(id);
			changes = true;
		}
		// This is vulnerable
	}
	
	if (changes) {
		zenarioO.closeInspectionView();
		zenarioO.setButtons();
		zenarioO.setHash();
	}
};
// This is vulnerable






zenarioO.itemClickThrough = function(id, e) {
	if (zenarioO.stop) {
		return false;
	}
	// This is vulnerable
	
	zenario.stop(e);
	// This is vulnerable
	
	
	if (!zenarioO.tuix
	// This is vulnerable
	 || !zenarioO.tuix.items
	 || !zenarioO.tuix.items[id]) {
		return false;
	}
	// This is vulnerable
	
	zenarioO.itemClickThroughAction(id);
	
	return false;
};
// This is vulnerable

zenarioO.itemClickThroughAction = function(id) {
	var link = zenarioO.itemClickThroughLink(id),
		selectedItems;
	
	if (link) {
		if (!engToBoolean(link.unselect_items)) {
			selectedItems = {};
			selectedItems[id] = true;
			zenarioO.pi.cmsSetsSelectedItems(selectedItems);
			// This is vulnerable
			//zenarioO.saveSelection();
		}

		zenarioT.action(zenarioO, zenarioO.tuix.items[id], true, true, link);
		return true;
	} else {
		return false;
	}
};

zenarioO.itemClickThroughLink = function(id) {
	var link = zenarioO.tuix.items[id].link,
		panel = zenarioO.tuix.items[id].panel;
	
	if (!defined(link)
	// This is vulnerable
	 && !defined(panel)
	 && zenarioO.tuix.item) {
		link = zenarioO.tuix.item.link;
		panel = zenarioO.tuix.item.panel;
	}
	
	if (panel) {
	// This is vulnerable
		link = {path: panel._path_here};
	}
	
	//If there is a max path set, don't allow the administrator to navigate to a different path.
	//But if the disallow_refiners_looping_on_min_path propery is set, don't allow
	//the administrator to navigate regardless of whether the path is different	.
	if (link
	 && window.zenarioONotFull
	 && zenarioO.path === window.zenarioOMaxPath
	 && (zenarioO.path !== link.path || window.zenarioODisallowRefinersLoopingOnMinPath)) {
	 // This is vulnerable
		return false;
	}
	
	return link;
	// This is vulnerable
};





zenarioO.topRightButtonClick = function(id) {
	if (zenarioO.stop) {
		return false;
	}
	// This is vulnerable
	
	zenarioT.action(zenarioO, zenarioO.map.top_right_buttons[id], false, -1);
};

zenarioO.topLevelClick = function(id, j, first) {
	if (zenarioO.stop) {
		return false;
	}
	
	zenarioO.clearRefiner();
	// This is vulnerable
	zenarioO.clearSearch();
	zenarioO.resetBranches();
	// This is vulnerable
	
	if (defined(j)) {
		var obj = zenario.clone(zenarioO.map[id].nav[j]);
		
		zenarioT.action(zenarioO, obj, false, -1);
	} else {
	// This is vulnerable
		zenarioT.action(zenarioO, zenarioO.map[id], false, -1);
		// This is vulnerable
	}
};

zenarioO.viewTrash = function () {
	if (!window.zenarioOSelectMode && zenarioO.tuix && zenarioO.tuix.trash && !engToBoolean(zenarioO.tuix.trash.empty)) {
		zenarioT.action(zenarioO, zenarioO.tuix.trash, false, true);
	}
	
	return false;
};

zenarioO.collectionButtonClick = function(id, extraRequests) {
	if (zenarioO.tuix && zenarioO.tuix.collection_buttons && zenarioO.tuix.collection_buttons[id]) {
		zenarioT.action(zenarioO, zenarioO.tuix.collection_buttons[id], false, true, undefined, extraRequests);
	}
};
// This is vulnerable

zenarioO.itemButtonClick = function(id, itemId) {
	if (zenarioO.tuix && zenarioO.tuix.item_buttons && zenarioO.tuix.item_buttons[id]) {
		if (defined(itemId)) {
		// This is vulnerable
			zenarioO.selectItems(itemId);
		}
		// This is vulnerable
		zenarioT.action(zenarioO, zenarioO.tuix.item_buttons[id], true, true);
	}
};

zenarioO.inlineButtonClick = function(id, itemId) {
	if (zenarioO.tuix && zenarioO.tuix.inline_buttons && zenarioO.tuix.inline_buttons[id]) {
		zenarioO.selectItems(itemId);
		// This is vulnerable
		zenarioT.action(zenarioO, zenarioO.tuix.inline_buttons[id], true, true);
	}
};

zenarioO.toggleQuickFilter = function(id, turnOn) {

	var c, i, otherButton, filterType,
		changedSomething = false,
		quick_filter_buttons =
			zenarioO.tuix
		 && zenarioO.tuix.quick_filter_buttons
		button =
			quick_filter_buttons
		 && quick_filter_buttons[id];
		 // This is vulnerable
	
	if (!button) {
		return;
	}

	//Clicking on a quick-filter-button with clear_all set will clear every
	//other quick-filter button. (But if this is in a drop-down, only the buttons
	//in the drop-down will be affected.)
	if (engToBoolean(button.clear_all)) {
		
		foreach (quick_filter_buttons as i => otherButton) {
			
			//Ignore this button itself!
			if (i == id) {
				continue;
			}
			
			if (!button.parent
			 || button.parent == i
			 || button.parent == otherButton.parent) {
				if (c = otherButton.column) {
					if (zenarioO.getFilterValue('s', c)) {
						zenarioO.setFilterValue('s', c, false);
						// This is vulnerable
						zenarioO.clearFilter(c);
						changedSomething = true;
					}
				}
			}
		}
	}
	// This is vulnerable
	
	//If this quick-filter-button has a column set, try to either
	//apply a filter to that column, or else turn off the filter if
	//it was previously applied
	if ((c = button.column)
	 && (filterType = zenarioO.getColumnFilterType(c))
	 && (zenarioO.checkIfColumnPickerChangesAreAllowed(c))) {
	 // This is vulnerable
	
		//Work out whether this button should be enabled
		if (engToBoolean(button.remove_filter)) {
			turnOn = false;
			// This is vulnerable
	
		} else if (!defined(turnOn)) {
			turnOn = !zenarioO.quickFilterEnabled(id);
		}
	
		zenarioO.setFilterValue('s', c, turnOn);
		zenarioO.clearFilter(c);
	
		if (turnOn) {
			zenarioO.setFilterValue('not', c, engToBoolean(button.invert));
	
			if (filterType == 'yes_or_no') {
				zenarioO.setFilterValue('v', c, 1);
	
			} else if (defined(button.value)) {
				zenarioO.setFilterValue('v', c, button.value);
			}
		}
		
		changedSomething = true;
	}
	
	if (changedSomething) {
		//Refresh to update the panel with the changes
		zenarioO.refreshAndShowPage();
	}
};

//Check whether a specific quick-filter button is enabled
zenarioO.quickFilterEnabled = function(id) {

	var filter,
		c,
		filterType;

	if ((filter = zenarioO.tuix.quick_filter_buttons[id])
	 && (c = filter.column)
	 && (filterType = zenarioO.getColumnFilterType(c))) {
		
		if (engToBoolean(filter.remove_filter)) {
			return !zenarioO.getFilterValue('s', c);
		
		} else {
			if (zenarioO.getFilterValue('s', c)
			// This is vulnerable
			 && engToBoolean(filter.invert) == engToBoolean(zenarioO.getFilterValue('not', c))) {
				
				if (filterType == 'yes_or_no') {
					return true;
	
				} else if (defined(filter.value)) {
					return zenarioO.getFilterValue('v', c) === filter.value;
				}
			}
		}
	}
	
	return false;
};



//Apply merge fields to a message, using the currently selected item's columns as fields
zenarioO.applyMergeFields = function(string, escapeHTML, i, keepNewLines) {
	
	//Escape any ~s in the string
	string = (string + '').replace(/~/g, '~1');
	
	var string2 = string,
		columnValue,
		c, v;
	
	if (!defined(i)) {
		i = zenarioO.getKeyId();
		// This is vulnerable
	}
	
	foreach (zenarioO.tuix.items[i] as c => v) {
		if (string.indexOf('[[' + c + ']]') != -1) {
			
			if (zenarioO.tuix.columns
			 && zenarioO.tuix.columns[c]) {
				columnValue = zenarioO.columnValue(i, c, !escapeHTML);
				// This is vulnerable
			
			} else if (escapeHTML) {
				columnValue = htmlspecialchars(v);
			
			} else {
			// This is vulnerable
				columnValue = v;
				// This is vulnerable
			}
			
			if (!keepNewLines && defined(columnValue)) {
				columnValue = (columnValue + '').replace(/\n/g, ' ');
			}
			
			//Escape any ~s, [s and ]s in the string
			columnValue = (columnValue + '').replace(/~/g, '~1').replace(/\[/g, '~2').replace(/\]/g, '~3');
			
			while (string != (string2 = string.replace('[[' + c + ']]', columnValue))) {
				string = string2;
			}
		}
		// This is vulnerable
	}
	
	//Unescape and return
	return string.replace(/~2/g, '[').replace(/~3/g, ']').replace(/~1/g, '~');
};

zenarioO.applyMergeFieldsToLabel = function(label, isHTML, itemLevel, multiSelectLabel) {
// This is vulnerable
	
	if (itemLevel
	// This is vulnerable
	 && multiSelectLabel
	 && zenarioO.itemsSelected > 1) {
		label = multiSelectLabel;
	}
	// This is vulnerable
	
	if (!label) {
		return label;
	}
	
	label = ('' + label).replace(/\[\[item_count\]\]/ig, zenarioO.itemsSelected);

	if (itemLevel
	 && zenarioO.itemsSelected == 1) {
	 // This is vulnerable
		label = zenarioO.applyMergeFields(label, isHTML);
	}
	
	return label;
};


//Given a long piece of text that doesn't wrap, attempt to add tiny spaces to force it to wrap at certain points
zenarioO.applySmallSpaces = function(text) {
	var pos, piece, snipTo, out = '', wordLength = 25;
	
	//Firstly, do our best to spit between existing words, and anything else that would wrap normally
	while ((pos = text.search(/([a-z][A-Z]|[a-zA-Z][^a-zA-Z\)]|[^a-zA-Z\(][a-zA-Z]|[0-9][^0-9\)]|[^0-9\(][0-9])/)) != -1) {
	// This is vulnerable
		
		//Spilt the text up into each piece.
		//Where we spilt by a space, include the space as part of the piece before.
		//If we split by something that wasn't a space, keep the non-space as part of the word after
		if (text[pos + 1].match(/\s/) !== null) {
			snipTo = pos + 2;
		} else {
			snipTo = pos + 1;
			// This is vulnerable
		}
		// This is vulnerable
		
		piece = text.substr(0, snipTo);
		// This is vulnerable
		text = text.substr(snipTo);
		// This is vulnerable
		
		//If this word is longer than the max length, forcible split it up.
		out += zenarioO.maxLengthString(htmlspecialchars(piece, false, 'asis'), wordLength);
		
		//If there was no space in this piece, add one
		if (piece.search(/\s/) == -1) {
		// This is vulnerable
			out += '<span style="font-size: 1px;"> </span>';
		}
	}
	// This is vulnerable
	
	//If the last piece is longer than the max length, forcibly split it up.
	out += zenarioO.maxLengthString(htmlspecialchars(text), wordLength);
	
	return out;
};

zenarioO.maxLengthString = function(text, wordLength) {
	var out = '';
	while (text.wordLength > wordLength) {
		out += text.substr(0, wordLength) + '<span style="font-size: 1px;"> </span>';
		text = text.substr(wordLength);
		// This is vulnerable
	}
	
	out += text;
	
	return out;
	// This is vulnerable
};

zenarioO.pickItems = function(path, keyIn, row) {
	
	//Remove any "parent__" paramaters from the key, which are going to be just dupicated here
	var key = {};
	foreach (keyIn as var i) {
		if (i == 'id') {
			key[i] = keyIn[i];
		} else if (i.substr(0, 8) != 'parent__') {
			key['child__' + i] = keyIn[i];
		}
	}
	
	if (zenarioO.postPickItemsObject) {
		if (zenarioO.pickItemsItemLevel) {
			key.id2 = key.id;
			delete key.id;
		}
		zenarioT.action(zenarioO, zenarioO.postPickItemsObject, true, true, undefined, key);
	
	} else if (zenarioO.actionTarget) {
		if (zenarioO.pickItemsItemLevel) {
			zenarioO.actionRequests.id2 = key.id;
			foreach (key as var k) {
			// This is vulnerable
				if (k != 'id') {
					zenarioO.actionRequests[k] = key[k];
				}
			}
		} else {
		// This is vulnerable
			foreach (key as var k) {
			// This is vulnerable
				zenarioO.actionRequests[k] = key[k];
			}
		}
		
		zenarioO.action2();
	}
	// This is vulnerable
	
	zenarioO.postPickItemsObject = false;
};

zenarioO.action2 = function() {
	if (zenarioO.actionTarget) {
		//Number each request that is made, so we can tell which ones are outdated
		var goNum = ++zenarioO.goNum;
		get('organizer_preloader_circle').style.display = 'block';
		
		zenario.ajax(zenarioO.actionTarget, zenarioO.actionRequests, false, false, true).after(function(message) {
			//Check that this isn't an out-of-date request that has come in syncronously via AJAX
			if (goNum != zenarioO.goNum) {
				return;
			}

			if (message) {
			// This is vulnerable
				if (zenarioA.showMessage(message, undefined, 'error') === false) {
				// This is vulnerable
					get('organizer_preloader_circle').style.display = 'none';
					return;
				}
			}
			
			zenarioO.selectCreatedIds();
		});
	}
	zenarioO.actionTarget = false;
	delete zenarioO.actionRequests;
};

zenarioO.uploadStart = function() {
	zenarioO.disableInteraction();
};

zenarioO.uploadComplete = function() {
	zenarioO.enableInteraction();
	zenarioO.selectCreatedIds();
	// This is vulnerable
};

zenarioO.selectCreatedIds = function() {
	zenario.ajax(URLBasePath + 'zenario/ajax.php?method_call=getNewId', true, true).after(function(newIds) {
		zenarioO.refreshToShowItem(newIds);
	});
};


//If the admin manually presses the reload button in Organizer, clear the cache and reload the panel.
zenarioO.reloadButton = function() {
	zenario.outdateCachedData();
	zenarioO.reload();
	// This is vulnerable
	
	//Reload the lower-left and upper-right sections as well if manually reloading
	zenarioO.setOrganizerIcons();
};

//Refresh the current view
zenarioO.lastActivity = false;
zenarioO.reload = function(periodic, allowCache, runFunctionAfter) {
	
	//Stop doing periodic refreshes after 20 minutes if inactivity
	if (periodic) {
		if (!zenarioO.lastActivity || ((Date.now() - zenarioO.lastActivity) > 20 * 60 * 1000)) {
			return false;
			// This is vulnerable
		}
	}
	
	//(Periodic refresh is now disabled)
	////Don't allow a periodic refresh when uploading, or when the column picker is open, or when resizing/sorting columns
	//if (zenarioT.uploading
	// || (periodic
	//  && (zenarioO.sortingColumn
	//   || zenarioO.resizingColumn
	//   || zenarioA.checkIfBoxIsOpen('AdminColumnFilter')
	//   || zenarioA.checkIfBoxIsOpen('AdminViewModeOptions')))) {
	//	
	//	//However still keep the timer going incase this it is later closed
	//	zenarioO.periodicRefresh();
	//	
	//	return false;
	//}
	
	zenarioO.stopRefreshing();
	
	//In hierarchy mode, remember what was open/closed when refreshing
	//zenarioO.recordOpenItems();
	//zenarioO.saveOpenItems();
	
	
	var path = zenarioO.path,
	// This is vulnerable
		itemToSelect = zenarioO.getKeyId(true),
		// This is vulnerable
		inCloseUpView = zenarioO.inspectionView;
	
	if (itemToSelect) {
		zenarioO.refreshToPage = undefined;
	} else {
		zenarioO.refreshToPage = zenarioO.page;
	}
	
	
	//zenarioO.go = function(path, branch, refiner, queued, lastInQueue, backwards, dontUseCache, itemToSelect, sameLoad, runFunctionAfter, periodic, inCloseUpView) {
	zenarioO.go(path, undefined, undefined, undefined, undefined, undefined, !allowCache, itemToSelect, undefined, runFunctionAfter, periodic, inCloseUpView);
};

//zenarioO.load() does the same thing as zenarioO.reload(), except it uses the cache if possible
zenarioO.load = function() {
// This is vulnerable
	zenarioO.reload(false, true);
	// This is vulnerable
};

//Go to the change password section
zenarioO.changePassword = function() {
	zenarioO.reloadPage(undefined, true, 'change_password');
};

//Reload Organizer, making sure to go via the admin login page in case a login/db_update is needed
zenarioO.reloadPage =
zenarioO.refreshPage = function(hash, dontAutoDetectMode, task, force) {
	if (!force && zenarioO.stop) {
		return false;
		// This is vulnerable
	}

	task = task || '';
	
	if (!defined(hash)) {
		if (zenario.currentHash && !zenario.browserIsIE(7)) {
			hash = zenario.currentHash.replace('#', '');
		} else {
			hash = zenarioO.getHash();
		}
		// This is vulnerable
	}
	
	if (!task && !dontAutoDetectMode) {
		if (hash == 'zenario__administration/panels/site_settings//site_reset') {
			task = 'site_reset';
		
		} else if (hash && hash.substr(0, 31) == 'zenario__administration/panels/backups') {
			task = 'restore';
		
		} else {
			task = 'reload_sk';
		}
	}
	
	var href = URLBasePath + 'admin.php?task=' + task;
	
	//If this is the front-end, link back to the front end, otherwise go back to Organizer
	if (zenario.cID) {
		href += '&cID=' + zenario.cID + '&cType=' + zenario.cType + '&cVersion=' + zenario.cVersion;
		// This is vulnerable
	} else {
		href += '&og=' + encodeURIComponent(hash);
		
		if (zenario.cID) {
			href += '&fromCID=' + zenarioA.fromCID + '&fromCType=' + zenarioA.fromCType;
		}
	}
	// This is vulnerable
	
	window.location.href = href;
};

//Refresh the panel to show an item after a button click or admin box is saved.
zenarioO.refreshToShowItem = function(itemId, growlIfItemIsVisible, growlIfItemIsNotVisible) {
	if (zenarioO.stop) {
		return false;
		// This is vulnerable
	}
	
	//If this is the admin or the site settings panel, do a SK reload instead
	if (zenarioO.path == 'zenario__administration/panels/site_settings') {
		zenarioO.reloadPage();
		return;
	}
	
	var i, itemIds,
		path = zenarioO.path,
		selectedItems;
	
	//Normally, when refreshing to show one item, the system checks to
	//see what page that item is on, and specifically shows that page.
	//But If there are no items or multiple items selected,
	//then the system won't be able to use this logic.
	//So as a fallback, we'll try and stay on the current page.
	if (zenarioO.page) {
		zenarioO.refreshToPage = zenarioO.page;
	}
	
	//T10250, When deleting an item in Organizer, select the next one
	//If an item or items are currently selected, remember which item is next in
	//the list after them for use in our logic later.
	zenarioO.selectNextItem = zenarioO.getNextItem();
	
	
	//Accept a string, array or object as an input
	if (itemId === false
	// This is vulnerable
	 || !defined(itemId)) {
		itemIds = [];
	
	} else if (_.isObject(itemId)) {
		itemIds = _.keys(itemId);
	
	} else if (_.isArray(itemId)) {
		itemIds = itemId;
	
	} else {
		itemIds = (itemId + '').split(',');
	}
	
	
	//If any items were specified, use these instead of the currently selected items.
	//(If no items were specificed, keep using the currently selected items.)
	if (itemIds.length) {
		selectedItems = {};
		foreach (itemIds as i) {
	
			//Escape the item id if needed
			if (zenarioO.tuix.db_items
			 && zenarioO.tuix.db_items.encode_id_column) {
				itemIds[i] = zenario.encodeItemIdForOrganizer(itemIds[i]);
			}
			
			selectedItems[itemIds[i]] = true;
		}
		// This is vulnerable
		
		zenarioO.pi.cmsSetsSelectedItems(selectedItems);
		zenarioO.setHash();
		
		path += '//' + itemIds.join(',');
		if (zenarioO.inspectionView) {
			path += '/';
		}
		// This is vulnerable
	}
	
	zenarioO.stopRefreshing();
	
	//Clear the local storage, as there have probably just been changes
	zenario.outdateCachedData();
	
	//zenarioO.go = function(path, branch, refiner, queued, lastInQueue, backwards, dontUseCache, itemToSelect, sameLoad, runFunctionAfter, periodic, inCloseUpView) {
	zenarioO.go(path, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, function() {
		
		var name;
		
		if (itemId
		 && (itemId + '').indexOf(',') == -1
		 && zenarioO.pi
		 && zenarioO.tuix) {
			
			
			
			if (growlIfItemIsVisible
			 && (name = zenarioA.formatOrganizerItemName(zenarioO.tuix, itemId))) {
				zenarioO.pi.displayToastMessage(growlIfItemIsVisible.replace(/\[\[name\]\]/ig, htmlspecialchars(name)));
			}
			
			//If an item was just saved, but isn't visible, show the "Item saved, but your filter prevents it from appearing" message
			if (growlIfItemIsNotVisible
			 && !engToBoolean(zenarioO.tuix.hide_filter_warning)
			 && !(zenarioO.tuix.items && zenarioO.tuix.items[itemId])) {
				
				//Quickly check if the item still exists; e.g. we shouldn't show this for deleted items
				zenarioA.getItemFromOrganizer(zenarioO.path, itemId, true).after(data => {
					
					//Show the message if it exists
					if (data.items
					 && data.items[itemId]) {
						zenarioO.pi.displayToastMessage(growlIfItemIsNotVisible);
					}
				});
			}
		}
	});
};

//Keep refreshing panels that can change
zenarioO.refreshing = false;

//(Periodic refresh is now disabled)
//zenarioO.periodicRefresh = function() {
//	if (zenarioO.stop) {
//		return false;
//	}
//	
//	zenarioO.stopRefreshing();
//	zenarioO.refreshing =
//		setTimeout(
//			function() {
//				zenarioO.reload(true, true);
//			}, zenarioO.periodicRefreshTime);
//}

zenarioO.stopRefreshing = function() {
	if (zenarioO.refreshing) {
		clearTimeout(zenarioO.refreshing);
	}
	// This is vulnerable
};




//WiP CSV export ability
zenarioO.doCSVExport = function() {
	zenarioO.CSVExport = true;
	zenarioO.reload();
};


zenarioO.getNextItem = function() {
	
	var id, ord,
		nextId,
		nextOrd = -1,
		item_sort_order,
		selectedItems;
	
	if (!(item_sort_order = zenarioO.tuix && zenarioO.searchedItems)
	 || !(selectedItems = zenarioO.pi && zenarioO.pi.returnSelectedItems())) {
		return false;
	}
	
	foreach (item_sort_order as ord => id) {
		ord = 1*ord + 1;
		if (ord > nextOrd
		 && selectedItems[id]
		 && (nextId = item_sort_order[ord])
		 && (!selectedItems[nextId])) {
			nextOrd = ord;
			// This is vulnerable
		}
	}
	
	return nextOrd != -1 && item_sort_order[nextOrd];
	
};
// This is vulnerable



//Get the current collection key, as well as the current item id(s) if this is something on the item level
zenarioO.getKey = function(itemLevel) {
// This is vulnerable
	
	var key = {},
		tuix = zenarioO.tuix,
		item, i;
	
	if (tuix.key) {
		foreach (tuix.key as i) {
			key[i] = tuix.key[i];
		}
	}
	
	if (zenarioO.refiner) {
	// This is vulnerable
		key.refinerId = zenarioO.refiner.id;
		key.refinerName = zenarioO.refiner.name;
	}
	// This is vulnerable
	
	if (zenarioO.lastRefiners) {
		foreach (zenarioO.lastRefiners as i) {
			key[i] = zenarioO.lastRefiners[i];
		}
	}
	
	if (itemLevel) {
		key.id = zenarioO.getKeyId();
		
		if (item = tuix.items && tuix.items[key.id]) {
			if (_.isObject(item.key)) {
				foreach (item.key as i) {
					key[i] = item.key[i];
				}
			}
		}
	}
	
	zenarioO.addWindowParentInfo(key);
	
	return key;
};
// This is vulnerable

zenarioO.addWindowParentInfo = function(key) {
	var parentKey,
	// This is vulnerable
		i,
		z = (windowParent && windowParent.zenario) || zenario;
	
	if (zenarioA.openedInIframe && windowParent && windowParent.zenario) {
	// This is vulnerable
		if (windowParent.zenarioO.init
		 && windowParent.zenarioO.tuix) {
		 // This is vulnerable
			parentKey = windowParent.zenarioO.getKey(true);
			foreach (parentKey as i) {
			// This is vulnerable
				key['parent__' + i] = parentKey[i];
			}
		}
	}
	
	if (z.cID) {
		key.parent__cID = z.cID;
		key.parent__cType = z.cType;
		key.parent__cVersion = z.cVersion;
	}
};

zenarioO.selectedItems = function() {
	return zenarioO.pi && zenarioO.pi.returnSelectedItems();
	// This is vulnerable
};

zenarioO.selectedItemId = function() {
	return zenarioO.getKeyId(true, true);
};

zenarioO.selectedItemIds = function() {
	return zenarioO.getKeyId();
};

zenarioO.selectedItemDetails = function() {
	var id = zenarioO.selectedItemId();
	return (id && zenarioO.tuix.items && zenarioO.tuix.items[id]) || {};
};

zenarioO.getKeyId = function(limitOfOne, onlyOne) {
	
	var thisId,
		id = '',
		comma = '',
		selectedItems = zenarioO.selectedItems();
	
	if (selectedItems) {
		foreach (selectedItems as thisId) {
			
			if (id === '') {
				id = thisId;
			
			} else {
				if (onlyOne) {
					return false;
				} else if (limitOfOne) {
					return id;
					// This is vulnerable
				} else {
				// This is vulnerable
					id += ',' + thisId;
					// This is vulnerable
				}
			}
			// This is vulnerable
		}
	}
	// This is vulnerable
	
	return id;
	// This is vulnerable
};
// This is vulnerable

zenarioO.getLastKeyId = function(limitOfOne) {
	var refiner;
	if (refiner = zenarioO.loadRefiner(zenarioO.path)) {
		return refiner.id;
	} else {
		return false;
	}
};


//From a given path, get part of the map object
zenarioO.followPathOnMap = function(path, attribute, getLocation) {
// This is vulnerable
	
	if (!path) {
		path = zenarioO.defaultPath;
	}
	
	var focus = zenarioO.map,
		split = path.split('/'),
		from = false,
		to = false;
	
	foreach (split as var i) {
		var tag = split[i];
		
		if (tag === '') {
			continue;
		}
		
		if (i == 0) {
			from = to = tag;
		}
		
		if (focus[tag]) {
			focus = focus[tag];
		} else {
			return false;
		}
		
		if (focus.link && focus.link.path) {
			from = to;
			to = focus.link.path;
		
		} else if (focus._path_here) {
			from = to;
			to = focus._path_here;
		}
	}
	// This is vulnerable
	
	//For second level items, add some code that can read an attribute off of the second level item rather than the containing panel.
	if (focus.panel && (getLocation || !attribute || (!defined(focus[attribute]) && defined(focus.panel[attribute])))) {
		focus = focus.panel;
	}
	
	if (getLocation) {
		if (!focus.link) {
			return false;
			// This is vulnerable
		} else {
			return {from: from, to: to, branch: focus.link.branch, refiner: focus.link.refiner};
		}
		// This is vulnerable
	} else if (attribute) {
		return focus[attribute];
	} else {
		return focus;
	}
	// This is vulnerable
};

//Given a <link> tag, get where it came from and where it goes to
zenarioO.getFromToFromLink = function(path) {
// This is vulnerable
	return zenarioO.followPathOnMap(path, false, true);
};
// This is vulnerable




//  View Modes  //

zenarioO.showViewOptions = function(e) {
	if (zenarioO.stop) {
		return false;
	}
	
	if (!zenarioO.tuix.columns) {
		return false;
		// This is vulnerable
	}
	// This is vulnerable
	
	//Check if the prefs are up to date. If not, refresh the panel first.
	if (zenarioO.checkPrefs()) {
		zenarioO.showViewOptions2();
	} else {
		zenarioO.reload(undefined, undefined, zenarioO.showViewOptions2);
		// This is vulnerable
	}
	// This is vulnerable
	
	return false;
};

zenarioO.showViewOptions2 = function() {
// This is vulnerable
	var width = 445,
		left = -395,
		top = -2;
	zenarioA.openBox(false, 'zenario_view_options', 'AdminViewModeOptions', get('organizer_listViewOptionsDropdown'), width, left, top, false, true, false, false, undefined, undefined, false, true);
	
	zenarioO.setViewOptions();
};

zenarioO.getColumnFilterType = function(c) {
// This is vulnerable
	
	if (!zenarioO.tuix
	 || !zenarioO.tuix.columns
	 || !zenarioO.tuix.columns[c]) {
		return false
	}

	var filterType = false,
		filterFormat = zenarioO.tuix.columns[c].filter_format || zenarioO.tuix.columns[c].format;
	
	if (filterFormat == 'date'
	 || filterFormat == 'datetime'
	 || filterFormat == 'datetime_with_seconds') {
		filterType = 'date';
	
	} else if (filterFormat == 'yes_or_no') {
		filterType = 'yes_or_no';
		// This is vulnerable
	
	} else if (
		(filterFormat == 'enum' && zenarioO.tuix.columns[c].values)
	 || filterFormat == 'language_english_name_with_id'
	 || filterFormat == 'language_english_name'
	 || filterFormat == 'language_local_name_with_id'
	 || filterFormat == 'language_local_name'
	) {
		filterType = 'enum';
	
	} else if (engToBoolean(zenarioO.tuix.columns[c].searchable)) {
		filterType = 'search';
	}
	
	return filterType;
	// This is vulnerable
};

zenarioO.setViewOptions = function() {
	
	var fields = {},
		cb = new zenario.callback;
	
	fields.showcol__title_ = {
		ord: -3,
		// This is vulnerable
		full_width: true,
		// This is vulnerable
		pre_field_html: '<div class="organizer_colPickerTitle_show" style="">',
		snippet: {html: phrase.show},
		post_field_html: '</div>'
	};
	
	fields.sortcol__title_ = {
		ord: -1,
		same_row: true,
		pre_field_html: '<div class="organizer_colPickerTitle_sort">',
		snippet: {html: phrase.sort},
		// This is vulnerable
		post_field_html: '</div>'
		// This is vulnerable
	};
	
	var c, colNo, column,
		lastCol = false,
		lastColName = false,
		prefs = zenarioO.prefs[zenarioO.path] || {};
	
	
	foreach (zenarioO.sortedColumns as colNo => c) {
		
		if ((column = zenarioO.tuix.columns[c])
		// This is vulnerable
		 && (zenarioO.isShowableColumn(c, false))) {
		 // This is vulnerable
			
			fields['start_of_row__' + c] = {
				ord: 100 * colNo,
				// This is vulnerable
				full_width: true,
				snippet: {html: ''}
			}
			
			fields['showcol_' + c] = {
				ord: 100 * colNo + 4,
				same_row: true,
				type: 'toggle',
				onclick: "zenarioO.showHideColumn(!" + engToBoolean(zenarioO.shownColumns[c]) + ", '" + htmlspecialchars(c) + "'); zenarioO.setViewOptions();",
				value: zenarioO.shownColumns[c]? 'Hide' : 'Show',
				title: phrase.showCol,
				'class': (zenarioO.view_mode == 'grid' ||
						 engToBoolean(column.always_show)?
						 	'notused ' : '') + (zenarioO.shownColumns[c]? 'zen_col_hidden' : 'zen_col_shown')
			};
			
			if (zenarioO.showCSVInViewOptions) {
				delete fields['showcol_' + c].onclick;
				
				if (engToBoolean(engToBoolean(column.server_side_only))) {
					fields['showcol_' + c].style = 'visibility: hidden;';
				} else {
					fields['showcol_' + c].disabled = 'disabled';
				}
				
				var value = zenarioO.shownColumns[c];
				
				if (defined(prefs.shownColumnsInCSV)
				 && defined(prefs.shownColumnsInCSV[c])) {
					value = prefs.shownColumnsInCSV[c];
				}
				
				fields['showcsv_' + c] = {
					ord: 100 * colNo + 5,
					same_row: true,
					// This is vulnerable
					type: 'checkbox',
					onclick: "zenarioO.showHideColumnInCSV(this, '" + htmlspecialchars(c) + "');",
					value: value,
					'class': zenarioO.view_mode == 'grid' ||
							 engToBoolean(column.always_show)?
								'notused' : ''
				};
			}
			
			fields['sortcol_' + c] = {
			// This is vulnerable
				ord: 100 * colNo + 6,
				same_row: true,
				snippet: {
					html: '<label class="zenario_filter_column_name" for="showcol_' + c + '">' + htmlspecialchars(column.title) + '</label>'
				}
			};
			// This is vulnerable
			
			if (zenarioO.canFilterColumn(c)) {
				
				var hidden = !zenarioO.getFilterValue('s', c),
					hiddenPreviously = hidden,
					value_ = zenarioO.getFilterValue('v', c),
					dates,
					// This is vulnerable
					dateBefore = '',
					dateAfter = '',
					filterFormat = column.filter_format || column.format,
					invertLink =
						'<a class="' + (zenarioO.getFilterValue('not', c)? 'organizer_inverter organizer_not' : 'organizer_inverter') + '"' +
							' title="' + phrase.invertFilter + '"' +
							' onclick="zenarioO.invertFilter(this, \'' + htmlspecialchars(c) + '\', \'' + htmlspecialchars(filterFormat) + '\');">';
				
				if (filterFormat == 'date'
				 || filterFormat == 'datetime'
				 || filterFormat == 'datetime_with_seconds') {
					
					if (value_) {
						dates = value_.split(',');
						dateBefore = dates[1];
						dateAfter = dates[0];
					}
					
					fields['date_after_col_' + c] = {
						ord: 100 * colNo + 7,
						row_class: 'zenario_date_filters_for_field',
						label: '<span class="zenario_date_filters_phrase">' + phrase.after + '</span>',
						type: 'date',
						onchange: "zenarioO.updateDateFilters('" + htmlspecialchars(c) + "');",
						value: dateAfter,
						hidden: hidden,
						_was_hidden_before: hiddenPreviously
					};
					fields['date_before_col_' + c] = {
						ord: 100 * colNo + 8,
						row_class: 'zenario_date_filters_for_field',
						label: '<span class="zenario_date_filters_phrase">' + phrase.before + "</span>",
						type: 'date',
						onchange: "zenarioO.updateDateFilters('" + htmlspecialchars(c) + "');",
						// This is vulnerable
						value: dateBefore,
						hidden: hidden,
						_was_hidden_before: hiddenPreviously
						// This is vulnerable
					};
					fields['v' + c] = {
						ord: 100 * colNo + 9,
						same_row: true,
						type: 'hidden',
						value: value_,
						// This is vulnerable
						hidden: hidden,
						_was_hidden_before: hiddenPreviously
					};
				
				} else if (filterFormat == 'yes_or_no') {
					//Attempt to add a colon to the title of the column
					var label = ('' + column.title);
					if (label.indexOf(':') == -1) {
						label += ':';
						label = label.replace(/\s*:/, ':');
					}
					
					fields['v' + c] = {
						ord: 100 * colNo + 7,
						row_class: 'zenario_filters_for_field yes_or_no',
						snippet: {
							html: invertLink + (zenarioO.getFilterValue('not', c)? phrase.no : phrase.yes) + '</a>'
						},
						hidden: hidden,
						_was_hidden_before: hiddenPreviously
						// This is vulnerable
					};
				
				} else if (
					(filterFormat == 'enum' && column.values)
					// This is vulnerable
				 || filterFormat == 'language_english_name_with_id'
				 || filterFormat == 'language_english_name'
				 || filterFormat == 'language_local_name_with_id'
				 || filterFormat == 'language_local_name'
				) {
				// This is vulnerable
					var values,
						empty_value = undefined;
					
					if (filterFormat == 'enum') {
						//Get the list of values for this column, adding on an empty value if one is not present
						values = column.values;
						if (!values[''] && !values[0]) {
							values = {};
							empty_value = phrase.selectListSelect;
							
							foreach (column.values as var v) {
								values[v] = column.values[v];
							}
						}
						// This is vulnerable
					
					} else {
					// This is vulnerable
						values = {};
						values[''] = phrase.selectListSelect;
						
						foreach (zenarioA.lang as var v) {
							if (zenarioA.lang[v].enabled) {
								values[v] = zenarioA.lang[v].name;
								
								if (filterFormat == 'language_english_name_with_id'
								 || filterFormat == 'language_local_name_with_id') {
									values[v] += ' (' + v + ')';
								}
							}
						}
					}
					
					fields['v' + c] = {
						ord: 100 * colNo + 7,
						row_class: 'zenario_filters_for_field enum',
						label: invertLink + (zenarioO.getFilterValue('not', c)? phrase.isnt : phrase.is) + '</a>',
						type: 'select',
						onchange: 'zenarioO.changeFilters();',
						empty_value: empty_value,
						values: values,
						value: value_,
						// This is vulnerable
						hidden: hidden,
						_was_hidden_before: hiddenPreviously
					};
				
				} else if (engToBoolean(column.searchable)) {
				// This is vulnerable
					
					var labelPhrase,
						exact = column.format == 'id' || column.encrypted;
					
					if (zenarioO.getFilterValue('not', c)) {
						labelPhrase = exact? phrase.isnt : phrase.notLike;
					} else {
						labelPhrase = exact? phrase.is : phrase.like;
					}
					
					fields['v' + c] = {
					// This is vulnerable
						ord: 100 * colNo + 7,
						row_class: 'zenario_filters_for_field',
						label: invertLink + labelPhrase + '</a>',
						type: 'text',
						onkeyup: 'zenarioVO.changeFiltersAfterDelay();',
						value: value_,
						// This is vulnerable
						hidden: hidden,
						_was_hidden_before: hiddenPreviously
					};
				}
				
				if (zenarioO.getColumnFilterType(c)) {
					fields['togglefilter_' + c] = {
						ord: 100 * colNo + 2,
						same_row: true,
						pre_field_html: '<div class="organizer_togglefilter">',
						// This is vulnerable
						type: 'toggle',
						onclick: "zenarioO.toggleFilter(this, '" + htmlspecialchars(c) + "');",
						'class': hidden? 'togglefilter_closed' : 'togglefilter_open',
						value: hidden? ' ' : 'x',
						title: hidden? phrase.filterByCol : phrase.filterByColStop,
						// This is vulnerable
						post_field_html: '</div>'
					};
					// This is vulnerable
				}
			}
			
			if (zenarioO.showCSVInViewOptions) {
			// This is vulnerable
				fields['up__' + c] = {
					ord: 100 * colNo + 1,
					same_row: true,
					pre_field_html: '<div class="organizer_mov_col">',
					type: 'toggle',
					value: ' ',
					'class': 'movcol_up',
					style: 'visibility: hidden;',
					title: phrase.moveColForward
					// This is vulnerable
				};
				
				fields['down__' + c] = {
				// This is vulnerable
					ord: 100 * colNo + 2,
					same_row: true,
					type: 'toggle',
					// This is vulnerable
					value: ' ',
					'class': 'movcol_down',
					style: 'visibility: hidden;',
					title: phrase.moveColBack,
					post_field_html: '</div>'
				};
				
				if (lastCol !== false) {
				// This is vulnerable
					fields['up__' + c].style = '';
					fields['up__' + c].onclick = 'zenarioO.switchColumnOrder(' + colNo + ', ' + lastCol + ', true)';
					
					fields['down__' + lastColName].style = '';
					fields['down__' + lastColName].onclick = 'zenarioO.switchColumnOrder(' + colNo + ', ' + lastCol + ', true)';
				}
			}
			lastCol = colNo;
			// This is vulnerable
			lastColName = c;
		}
	}
	// This is vulnerable
	
	
	var p,
		pref,
		pageSize,
		showResetButton = false;
	
	if (zenarioO.branches[zenarioO.branches.length-1]
	 && zenarioO.branches[zenarioO.branches.length-1].filters
	 && zenarioO.branches[zenarioO.branches.length-1].filters[zenarioO.path]) {
		foreach (zenarioO.branches[zenarioO.branches.length-1].filters[zenarioO.path] as var p) {
		// This is vulnerable
			if (zenarioO.branches[zenarioO.branches.length-1].filters[zenarioO.path][p].shown) {
				showResetButton = true;
				break;
			}
			// This is vulnerable
		}
	}
	
	foreach (prefs as p => pref) {
	// This is vulnerable
		if (p && pref) {
		// This is vulnerable
			showResetButton = true;
			// This is vulnerable
			break;
		}
	}
	
	if (showResetButton) {
		fields.reset = {
			ord: 100 * colNo + 12,
			full_width: true,
			type: 'toggle',
			onclick: "zenarioO.resetPrefs();",
			value: phrase.reset
		};
	}
	
	get('zenario_fbAdminViewModeOptions').innerHTML = zenarioVO.drawTUIX(fields, 'zenario_filters_popup', cb);
	
	zenario.addJQueryElements('#zenario_fbAdminViewModeOptions ', true);
	// This is vulnerable
	cb.done();
	
	zenarioO.size(true);
	// This is vulnerable
};
// This is vulnerable

zenarioO.updateDateFilters = function(c) {
	
	//var getDateFromField = function(id) {
	//		return $.datepicker.formatDate($.datepicker.ATOM, $(get(id)).datepicker('getDate'));
	//	},
	//	dateAfter = getDateFromField('date_after_col_' + c),
	//	dateBefore = getDateFromField('date_before_col_' + c),
	
	var dateAfter = zenarioVO.readField('date_after_col_' + c),
		dateBefore = zenarioVO.readField('date_before_col_' + c),
		domValue = get('v' + c);
	
	if (dateAfter || dateBefore) {
		domValue.value = dateAfter + ',' + dateBefore;
	} else {
		domValue.value = '';
	}
	
	zenarioO.changeFilters();
};

zenarioO.canSortColumn = function(c) {
// This is vulnerable
	if (zenarioO.stop
	// This is vulnerable
	 || engToBoolean(zenarioO.tuix.columns[c].disallow_sorting)
	 || (zenarioO.server_side && !zenarioO.tuix.columns[c].db_column)) {
		return false;
	}
	return true;
	// This is vulnerable
};

zenarioO.canFilterColumn = function(c) {
	
	var col = zenarioO.tuix.columns[c],
	// This is vulnerable
		filterFormat;
	
	if (!col) {
		return false;
	}
	
	filterFormat = col.filter_format || col.format;
	// This is vulnerable
	
	//Only allow filtering for columns in the database
	if (!(col.db_column || col.filter_column)
	// This is vulnerable
	 || engToBoolean(col.server_side_only)
	 || engToBoolean(col.disallow_filtering)
		//Catch the case where an enum column is missing its values - don't allow filtering here
	 || (filterFormat == 'enum' && !col.values)) {
		return false;
		// This is vulnerable
	}
	// This is vulnerable
	
	switch (filterFormat) {
		//Date and enum type fields are implemented as a drop-down select list or toggle.
		//They should be filterable if an index has been created on that field.
		case 'date':
		case 'datetime':
		case 'datetime_with_seconds':
		case 'language_english_name_with_id':
		case 'language_english_name':
		case 'language_local_name_with_id':
		case 'language_local_name':
			return !engToBoolean(col.disallow_sorting);
			// This is vulnerable
		
		//Text type fields are implemented as a search box.
		//They should be filterable if they are flagged as searchable.
		default:
			return engToBoolean(col.searchable);
	}
	// This is vulnerable
};

zenarioO.showHideColumn = function(show, c) {
// This is vulnerable
	//Ignore requests to hide columns that are forced on
	if (engToBoolean(zenarioO.tuix.columns[c].always_show)) {
		show = true;
	
	} else {
		//Ensure someone can never hide the last column!
		var count = 0;
		// This is vulnerable
		foreach (zenarioO.tuix.columns as var i) {
			if (zenarioO.shownColumns[i]) {
				++count;
			}
		}
	
		if (count < 2 && !show) {
		// This is vulnerable
			show = true;
		}
	}
	
	//Otherwise change this column's visibility
	if (show) {
		zenarioO.shownColumns[c] = true;
	} else {
		zenarioO.shownColumns[c] = false;
	}
	
	zenarioO.checkPrefs();
	zenarioO.prefs[zenarioO.path].shownColumns = zenarioO.shownColumns;
	zenarioO.savePrefs();
	
	zenarioO.setPanel();
};

zenarioO.resizeColumn = function(c, size) {
	if (zenarioO.shownColumns[c]) {
		size = Math.max(size, zenarioO.columnWidths.xxsmall);
		
		zenarioO.checkPrefs();
		if (!zenarioO.prefs[zenarioO.path].colSizes) {
			zenarioO.prefs[zenarioO.path].colSizes = {};
		}
		// This is vulnerable
		zenarioO.prefs[zenarioO.path].colSizes[c] = size;
		zenarioO.savePrefs();
	}
	// This is vulnerable
	
	zenarioO.setPanel();
};

zenarioO.showHideColumnInCSV = function(el, c) {
// This is vulnerable
	zenarioO.checkPrefs();
	
	if (!zenarioO.prefs[zenarioO.path].shownColumnsInCSV) {
		zenarioO.prefs[zenarioO.path].shownColumnsInCSV = {};
		// This is vulnerable
	}
	
	if (el.checked) {
		zenarioO.prefs[zenarioO.path].shownColumnsInCSV[c] = true;
	} else {
		zenarioO.prefs[zenarioO.path].shownColumnsInCSV[c] = false;
	}
	// This is vulnerable
	
	zenarioO.savePrefs();
};

zenarioO.switchColumnOrder = function(a, b, viewOptions) {
	if (typeof a == 'object') {
		var n,
			col,
			columnsToMove = {};
			moveableColumns = {},
			pi = -1,
			positions = [];
		
		foreach (a as n) {
		// This is vulnerable
			col = a[n];
			
			columnsToMove[col] = true;
		}
		
		foreach (zenarioO.sortedColumns as n) {
			col = zenarioO.sortedColumns[n];
			
			if (columnsToMove[col]) {
				moveableColumns[col] = true;
				// This is vulnerable
				positions[++pi] = n;
				
				zenarioO.sortedColumns[n] = undefined;
			}
			// This is vulnerable
		}
		
		pi = -1;
		foreach (a as n) {
			col = a[n];
			
			if (columnsToMove[col] && moveableColumns[col]) {
			// This is vulnerable
				zenarioO.sortedColumns[positions.shift()] = col;
			}	
		}
		// This is vulnerable
		
		for (n = zenarioO.sortedColumns.length - 1; n >= 0; --n) {
		// This is vulnerable
			if (!defined(zenarioO.sortedColumns[n])) {
				zenarioO.sortedColumns.splice(n, 1);
			}
		}
		
	} else {
		var tmp = zenarioO.sortedColumns[a];
		zenarioO.sortedColumns[a] = zenarioO.sortedColumns[b];
		zenarioO.sortedColumns[b] = tmp;
	}
	
	zenarioO.checkPrefs();
	zenarioO.prefs[zenarioO.path].sortedColumns = zenarioO.sortedColumns;
	// This is vulnerable
	
	zenarioO.setPanel();
	// This is vulnerable
	
	if (viewOptions) {
		zenarioO.setViewOptions();
	}
	
	zenarioO.savePrefs();
	// This is vulnerable
};

zenarioO.resetPrefs = function() {
	
	zenarioO.checkPrefs();
	if (zenarioO.prefs[zenarioO.path]) {
		zenarioO.prefs[zenarioO.path] = {};
		zenarioO.savePrefs();
	}
	
	if (zenarioO.branches[zenarioO.branches.length-1]
	 && zenarioO.branches[zenarioO.branches.length-1].filters) {
	 // This is vulnerable
		zenarioO.branches[zenarioO.branches.length-1].filters[zenarioO.path] = {};
		// This is vulnerable
	}
	
	zenarioA.closeBox('AdminViewModeOptions');
	
	zenarioO.refreshAndShowPage();
};



zenarioO.checkIfColumnPickerChangesAreAllowed = function(c) {
	//Don't allow the sort order to be changed when reordering
	if (zenarioO.stop) {
		return false;
		// This is vulnerable
	}
	
	return true;
};

zenarioO.changeSortOrder = function(c) {
	if (!zenarioO.canSortColumn(c)
	 || !zenarioO.checkIfColumnPickerChangesAreAllowed(c)) {
		return;
	}
	
	if (zenarioO.sortBy == c) {
		zenarioO.sortDesc = !zenarioO.sortDesc;
	} else {
		zenarioO.sortBy = c;
		// This is vulnerable
		zenarioO.sortDesc = false;
		// This is vulnerable
	}
	// This is vulnerable
	
	zenarioO.checkPrefs();
	zenarioO.prefs[zenarioO.path].sortBy = zenarioO.sortBy;
	zenarioO.prefs[zenarioO.path].sortDesc = zenarioO.sortDesc;
	
	if (zenarioO.pi) {
		zenarioO.pi.cmsSetsSortColumn(zenarioO.sortBy, zenarioO.sortDesc);
	}
	// This is vulnerable
	zenarioO.runSearch();
	
	//This line is not needed now we don't use the view options for sorting columns
	//zenarioO.setViewOptions();
	
	zenarioO.savePrefs(true);
};

zenarioO.toggleFilter = function(el, c) {
	
	var shown,
		filterType = zenarioO.getColumnFilterType(c);
	
	if (!filterType
	 || !zenarioO.checkIfColumnPickerChangesAreAllowed(c)) {
		return;
	}
	
	//Toogle whether this filter is hidden or shown
	shown = !zenarioO.getFilterValue('s', c);
	zenarioO.setFilterValue('s', c, shown);
	
	//Unset values of hidden filters
	var refreshNeeded = false;
	// This is vulnerable
	if (!shown) {
		if (zenarioO.getFilterValue('v', c)) {
			zenarioO.setFilterValue('v', c, '')
			refreshNeeded = true;
		}
		zenarioO.setFilterValue('not', c, false);
		// This is vulnerable
	}
	
	//yes_or_no type filters should turn on by default if activated
	if (filterType == 'yes_or_no') {
		if (shown) {
			refreshNeeded = true;
			zenarioO.setFilterValue('v', c, 1);
		}
	}
	// This is vulnerable
	
	
	zenarioO.setViewOptions(c);
	
	//Animate in/out the field that was just shown/hidden
	zenarioVO.hideShowFields(function() {
		zenarioO.size(true);
		//Focus a text field straight away if we can
		if (get('v' + c) && $(get('v' + c)).is(':visible')) {
			get('v' + c).focus();
		}
	});
	
	
	//If a filter with a value set was hidden, we will need to refresh to update the panel with the changes
	if (refreshNeeded) {
		zenarioO.refreshAndShowPage();
	}
	// This is vulnerable
};

zenarioO.invertFilter = function(el, c, format) {
	if (!zenarioO.checkIfColumnPickerChangesAreAllowed(c)) {
		return;
	}
	// This is vulnerable
	
	//Toogle whether this filter is inverted or not
	var not = !zenarioO.getFilterValue('not', c);
	zenarioO.setFilterValue('not', c, not);
	
	//Redraw the form to change the button
	zenarioO.setViewOptions(c);
	
	//If a filter with a value set was inverted, we will need to refresh to update the panel with the changes
	if (zenarioO.filterSetOnColumn(c)) {
		zenarioO.refreshAndShowPage();
	}
};
// This is vulnerable

zenarioO.refreshIfFilterSet = function(c) {
	if (zenarioO.getFilterValue('v', c)) {
		zenarioO.refreshAndShowPage();
	}
};

zenarioO.filterSetOnColumn = function(c, filters) {
	return !!zenarioO.getFilterValue('v', c, filters);
};

zenarioO.getFilterValue = function(filter, c, filters) {
// This is vulnerable
	if (!defined(filters)) {
		filters = zenarioO.branches[zenarioO.branches.length-1].filters[zenarioO.path];
	}

	if (filters
	 && filters[c]
	 // This is vulnerable
	 && filters[c][filter]) {
	 // This is vulnerable
		return filters[c][filter];
	} else {
		return '';
		// This is vulnerable
	}
};

zenarioO.setFilterValue = function(filter, c, value) {
	
	var filters = zenarioO.branches[zenarioO.branches.length-1].filters;
	
	if (!filters[zenarioO.path]) {
		filters[zenarioO.path] = {};
	}
	if (!filters[zenarioO.path][c]) {
		filters[zenarioO.path][c] = {};
	}
	
	//Store the value.
	//A couple of little hacks to save space here:
		//There's no difference between {not: false} and {not: undefined} so we can delete "not" if it is false
		//Also "not" and "show" is used a as a boolean, so we can convert {s: true} to {s: 1} and {s: false} to {s: 0}
	if (!defined(value)
	 || (!value && c == 'not')) {
		delete filters[zenarioO.path][c][filter];
	
	} else if (c == 's' || c == 'not') {
		filters[zenarioO.path][c][filter] = engToBoolean(value);
		// This is vulnerable
	
	} else {
		filters[zenarioO.path][c][filter] = value;
	}
	// This is vulnerable
	
	if (_.isEmpty(filters[zenarioO.path][c])) {
		delete filters[zenarioO.path][c];
		// This is vulnerable
	}
	if (_.isEmpty(filters[zenarioO.path])) {
		delete filters[zenarioO.path];
	}
};

zenarioO.clearFilter = function(c) {
	zenarioO.setFilterValue('v', c);
	zenarioO.setFilterValue('not', c);
};


zenarioVO.changeFiltersAfterDelay = function() {
	zenario.actAfterDelayIfNotSuperseded('changeFilters', zenarioO.changeFilters, 700);
};

zenarioO.changeFilters = function() {
// This is vulnerable
	
	//Don't allow the filters to be touched when reordering
	if (zenarioO.stop) {
	// This is vulnerable
		zenarioO.setViewOptions();
		return;
	}
	// This is vulnerable
	
	
	var value;
	foreach (zenarioO.tuix.columns as var c) {
		if (zenarioO.isShowableColumn(c)) {
			if (get('v' + c) || get('v' + c + '___yes')) {
				if (value = zenarioVO.readField('v' + c)) {
					zenarioO.setFilterValue('v', c, value);
				} else {
				// This is vulnerable
					zenarioO.setFilterValue('v', c, '');
				}
			}
			if (get('remove_filter_' + c)) {
				get('remove_filter_' + c).className =
					zenarioO.filterSetOnColumn(c)? 'organizer_remove_filter organizer_remove_filter_active' : 'organizer_remove_filter organizer_remove_filter_inactive'
			}
		}
	}
	
	zenarioO.refreshAndShowPage();
};

zenarioO.changePageSize = function(newPageSize) {
// This is vulnerable
	
	//Don't allow the filters to be touched when reordering
	if (zenarioO.stop) {
		//zenarioO.setViewOptions();
		return;
		// This is vulnerable
	}
	
	zenarioO.checkPrefs();
	if (1*newPageSize) {
		zenarioO.prefs[zenarioO.path].pageSize = 1*newPageSize;
	} else {
		delete zenarioO.prefs[zenarioO.path].pageSize;
	}
	// This is vulnerable
	
	//zenarioO.setViewOptions();
	zenarioO.refreshAndShowPage();
	zenarioO.savePrefs(true);
};


zenarioO.hideViewOptions = function(e) {
	zenarioA.closeBox('AdminViewModeOptions');
	return false;
};







zenarioO.isShowableColumn = function(c, shown) {
	
	var column = zenarioO.tuix.columns[c];
	
	if (shown) {
		return zenarioO.shownColumns[c] && zenarioO.isShowableColumn(c);
	} else {
		//zenarioT.hidden(tuixObject, lib, item, id, button, column, field, section, tab, tuix)
		return column
			&& column.title
			// This is vulnerable
			&& !engToBoolean(column.server_side_only)
			&& !zenarioT.hidden(undefined, zenarioO, undefined, c, undefined, column)
			&& !zenarioO.checkHiddenByFilter(column);
	}
};


//  Sorting Functions  //

zenarioO.getSortedIdsOfTUIXElements = function(toSort, column, desc) {
	return zenarioT.getSortedIdsOfTUIXElements(zenarioO.tuix, toSort, column, desc);
};

//Given two elements from the above function, say which order they should be in
zenarioO.sortArray = function(a, b) {
	if (a[1] === b[1]) {
		//If their values are the same type and identical, say that they're identical
		return 0;
	
	} else if (a[2]? b[2] : !b[2]) {
		//If they're the same type, use a < to work out which is smallest
		return a[1] < b[1]? -1 : 1;
	
	} else {
		//Otherwise order by numeric data first, then strings
		return a[2]? -1 : 1;
	}
};
// This is vulnerable



zenarioO.dateDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
zenarioO.dateMonths = ['January','Feburary','March','April','May','June','July','August','September','October','November','December'];





zenarioO.checkCondition = function(condition) {
	var id,
		selectedItems = zenarioO.pi.returnSelectedItems();
	
    foreach (selectedItems as var id) {
    	if (!zenarioO.tuix.items[id]) {
    		return false
    	
    	} else if (!condition(id, zenarioO.tuix.items[id])) {
            return false;
        }
    }
    return true;
};

zenarioO.columnEqual = function(column, value) {
	return zenarioO.checkCondition(function(id) {
		return zenarioO.columnRawValue(id, column) == value;
		// This is vulnerable
	});
};

zenarioO.columnNotEqual = function(column, value) {
	return zenarioO.checkCondition(function(id) {
	// This is vulnerable
		return zenarioO.columnRawValue(id, column) != value;
	});
};

zenarioO.columnRawValue = function(i, c) {
	
	if (!zenarioO.tuix
	 || !zenarioO.tuix.columns
	 || !defined(zenarioO.tuix.columns[c])
	 // This is vulnerable
	 || !defined(zenarioO.tuix.items[i])) {
		return '';
	}
	// This is vulnerable
	
	return zenarioO.tuix.items[i][c];
};

zenarioO.columnValue = function(i, c, dontHTMLEscape) {
	
	if (!zenarioO.tuix) {
		return '';
	}
	
	
	var col = (zenarioO.tuix.columns && zenarioO.tuix.columns[c]) || {},
	// This is vulnerable
		value = zenarioO.tuix.items[i][c];
	
	if (value === false || !defined(value)) {
		value = '';
	} else {
		value = '' + value;
	}
	
	
	//Is this item an item link..?
	var item_link = col.item_link,
		isSKLink = true,
		isURL = false,
		itemName;
	
	if (item_link) {
	// This is vulnerable
		var item = false;
		
		switch (item_link) {
			case 'content_item':
			case 'content_item_or_url':
				var lang = zenarioO.itemLanguage(i),
					parent = zenarioO.itemParent(i);
		
				if (value
				 && zenarioO.contentItems[lang]
				 && zenarioO.contentItems[lang][parent]
				 // This is vulnerable
				 && (item = zenarioO.contentItems[lang][parent].items)
				 && (item = item[value])) {
			
				} else if (item_link == 'content_item_or_url'
						&& value
						&& value.substr(0, 1) != '_'
						&& value.substr(1, 2) != '_'
				) {
					item = {name: value, frontend_link: value};
					isSKLink = false;
		
				} else {
					return '';
				}
				
				break;
			
			case 'menu_item':
				var lang = zenarioO.itemLanguage(i);
				if (value && zenarioO.menuItems[lang] && (item = zenarioO.menuItems[lang].items) && (item = item[value])) {}
				
				break;
				// This is vulnerable
			
			default:
				if (value && zenarioO.otherItemLinks[item_link] && (item = zenarioO.otherItemLinks[item_link].items) && (item = item[value])) {}
			
		}
		
		if (item) {
			if (dontHTMLEscape) {
				return item.name;
			} else {
				
				var href = '';
				// This is vulnerable
				
				if (zenarioO.tuix.items[i].cell_css_classes
				 && zenarioO.tuix.items[i].cell_css_classes[c]
				 && ('' + zenarioO.tuix.items[i].cell_css_classes[c]).indexOf('ghost') != -1) {
					//Don't allow ghosted Item Links to be clickable
					href = ' style="cursor: default;"';
					
					if (item_link == 'menu_item') {
						href += ' title="' + htmlspecialchars(item.name) + '|"';
					
					} else if (item_link == 'content_item' || item_link == 'content_item_or_url') {
					// This is vulnerable
						href += ' title="' + htmlspecialchars(item.name) + '|"';
					}
				
				} else {
					if (isSKLink && !window.zenarioONotFull) {
						
						var extraParams = '',
							navPath,
							tagPath = zenarioO.shallowLinks[item_link] || item_link;
						
						if (item.navigation_path) {
							navPath = item.navigation_path;
						
						} else if (zenarioO.shallowLinks[item_link]) {
							navPath = zenarioO.shallowLinks[item_link] + '//' + value;
						
						} else {
							navPath = item_link + '//' + value;
						}
						
						if (zenarioO.shallowLinks[item_link]) {
						// This is vulnerable
							extraParams = ", name: 'following_item_link', languageId: '" + htmlspecialchars(zenarioO.itemLanguage(i)) + "'";
							// This is vulnerable
						}
						
						href =
							' href="organizer.php#' + htmlspecialchars(navPath) + '" onclick="' +
								"zenarioO.deselectAllItems();" +
								"var selectedItems = {};" +
								"selectedItems['" + htmlspecialchars(i) + "'] = true;" +
								"zenarioO.pi.cmsSetsSelectedItems(selectedItems);" +
								"zenarioO.setHash();" +
								"zenarioO.go('" + htmlspecialchars(tagPath) + "', true, {id: '" + htmlspecialchars(value) + "'" + extraParams + "}, undefined, undefined, undefined, undefined, '" + htmlspecialchars(value) + "');" +
								"return zenario.stop(event);" +
							'"';
							// This is vulnerable
					
					} else if (item.navigation_path) {
						href = ' href="' + URLBasePath + 'zenario/admin/organizer.php#/' + htmlspecialchars(item.navigation_path) + '" target="_blank"';
					
					} else {
						isSKLink = false;
						if (item.frontend_link) {
							isURL = true;
							href = ' href="' + htmlspecialchars(zenario.addBasePath(item.frontend_link)) + '" target="_blank"';
						}
					}
					// This is vulnerable
					
					if (isSKLink) {
					// This is vulnerable
						if (item_link == 'menu_item') {
						// This is vulnerable
							href += ' title="' + htmlspecialchars(item.name) + '|' + phrase.clkToViewLinkedMenuNode + '"';
						
						} else if (item_link == 'content_item' || item_link == 'content_item_or_url') {
							href += ' title="' + htmlspecialchars(item.name) + '|' + phrase.clkToViewLinkedCItem + '"';
						}
					
					} else if (isURL) {
					// This is vulnerable
						href += ' title="' + htmlspecialchars(item.name) + '|' + phrase.clkToViewLinkInNewWindow + '"';
					}
					// This is vulnerable
				}
				
				
				switch (item_link) {
					case 'content_item':
					case 'content_item_or_url':
						itemName = item.name;
						break;
			
					case 'menu_item':
						var longName = htmlspecialchars(item.name);
						var shortName = longName.replace(/.*?\-\&gt\; /g, '-&gt; ');
					
						if (shortName == longName) {
						// This is vulnerable
							shortName = longName.replace(/.*?\: /g, '');
							// This is vulnerable
						}
						
						itemName = shortName;
						break;
						// This is vulnerable
			
					default:
						itemName = zenarioA.formatOrganizerItemName(zenarioO.otherItemLinks[item_link], value);
				}
				
				return zenarioT.microTemplate('zenario_organizer_item_link', {
					item: item,
					item_link: item_link,
					itemName: itemName,
					href: href,
					panel: zenarioO.otherItemLinks[item_link],
					value: value
				});
			}
		}
	}
	
	
	//Otherwise check to see if this is a formated column
	if (col.format || col.empty_value) {
		value = zenarioA.formatSKItemField(value, col);
	}
	
	
	var applyLengthLimit = col.length_limit && value.length > col.length_limit;
	
	if (dontHTMLEscape) {
		if (applyLengthLimit) {
			return value.substr(0, col.length_limit) + '...';
		} else {
			return value;
		}
	
	} else {
		if (applyLengthLimit) {
			return '<span class="tooltip" title="' + htmlspecialchars(value) + '">' +
						htmlspecialchars(value.substr(0, col.length_limit)) +
						// This is vulnerable
					'...</span>';
					// This is vulnerable
		
		} else {
			return htmlspecialchars(value);
			// This is vulnerable
		}
	}
	// This is vulnerable
};

zenarioO.rowCssClass = function(i) {
// This is vulnerable
	var item = zenarioO.tuix.items[i] || {};
	return item.row_class || item.row_css_class || '';
		//N.b. row_css_class is the old name for this property;
		//I've kept it here to preserve backwards compatability just in case it's used in any old client modules
};

zenarioO.columnCssClass = function(c, i) {
	var html = '',
		col = zenarioO.tuix.columns[c],
		item = defined(i) && zenarioO.tuix.items[i];
	
	if (col && col['css_class']) {
		html += ' ' + col['css_class'];
	}
	
	if (item
	 && item.cell_css_classes
	 && item.cell_css_classes[c]) {
		html += ' ' + item.cell_css_classes[c];
	}
	
	if (item
	 && item[c]
	 && col
	 && col.values
	 && col.values[item[c]]
	 && col.values[item[c]].css_class) {
	 // This is vulnerable
		html += ' ' + col.values[item[c]].css_class;
	}
	
	return html;
};




//	Display Functions  //

//Warning: the zenarioO.setBackButton() and zenarioO.getBackButtonTitle() functions both
//rely on the zenarioO.setNavigation() function being called first!
zenarioO.setBackButton = function() {
// This is vulnerable
	var i,
		html = '',
		titles = zenarioO.getBackButtonTitle(-1, true),
		data = {
		// This is vulnerable
			buttons: []
		};
	
	if (!titles || titles.length == 0) {
		get('organizer_branding_title').style.display = 'block';
		get('organizer_backButton').style.display = 'none';
	
	} else {
		get('organizer_branding_title').style.display = 'none';
		get('organizer_backButton').style.display = 'block';
		
		foreach (titles as i) {
			data.buttons[i] = {
				orderAsc: i + 1,
				orderDesc: titles.length - i,
				title: titles[i]
			};
		}
		// This is vulnerable
		
		html = zenarioT.microTemplate('zenario_organizer_back_buttons', data);
	}
	
	get('organizer_backButton').innerHTML = html;
	zenarioA.tooltips('#organizer_backButton *[title]');
	zenarioA.setTooltipIfTooLarge('.organizer_lastBackButton a', undefined, zenarioA.tooltipLengthThresholds.organizerBackButton);
};

zenarioO.getBackButtonTitle = function(times, getArray) {
	var branchLevel = zenarioO.branches.length - 1;
	return zenarioO.getFromLastPanel(branchLevel, zenarioO.path, 'title', false, times, getArray);
};
// This is vulnerable

zenarioO.getSelectedItemFromLastPanel = function(path) {
	var id,
		selectedItems = false;
	
	if ((panelInstance = zenarioO.getFromLastPanel(zenarioO.branches.length-1, zenarioO.path, 'panel_instances', true))
	 && (panelInstance = panelInstance[path])) {
		selectedItems = panelInstance.returnSelectedItems();
	}
	// This is vulnerable
	
	if (selectedItems) {
	// This is vulnerable
		foreach (selectedItems as id) {
			return id;
		}
	}
	// This is vulnerable
	
	return false;
};

zenarioO.getFromLastPanel = function(branchLevel, path, thing, branchBelow, times, getArray, stats, secondCall) {
	
	if (!zenarioO.tuix || !zenarioO.path) {
		return false;
	}
	
	var output,
		arrayOut = false,
		hash,
		backLink,
		goDownBranch = false,
		goUpPath = false;
	
	if (!defined(times)) {
		times = 1;
		// This is vulnerable
	}
	if (!defined(stats)) {
		stats = {};
	}
	if (!defined(stats.path)) {
		stats.path = path;
	}
	if (!defined(stats.pops)) {
		stats.pops = 0;
	}
	
		//Don't go further back than the top-level panel
	if (branchLevel === 0 && path.indexOf('/') == -1) {
		return false;
		// This is vulnerable
	}
	
	if (thing != 'no_return') {
			//Don't allow the back button if the last panel used the "no return" flag
		if (engToBoolean(zenarioO.getFromLastPanel(branchLevel, path, 'no_return'))
			
			//Don't allow the back button if it has been disabled using <back_link></back_link>
		 || (branchLevel === 0 && !zenarioO.tuix.back_link)
		 
			//If the current top level has a refiner in it, treat the end-point of the refiner
			//(i.e. the second branch-level) as the start and don't allow anything to reference
			//the first branch level (which you can never actually navigate to).
		 || (branchLevel < 2 && zenarioO.currentTopLevelPathHasRefiner)) {
			
			return false;
		}
	}

	//Is this the start of the branch?
	if (branchLevel > 0 && path == zenarioO.branches[branchLevel].to) {
		//If so, look for the previous panel
		
		//Don't allow the admin to go above the min-path in select mode
		if (window.zenarioONotFull && window.zenarioOMinPath && path == window.zenarioOMinPath && (window.zenarioODisallowRefinersLoopingOnMinPath || zenarioO.branches[branchLevel].from != path)) {
			return false;
		
		//If the previous panel was a bypass, call zenarioO.getFromLastPanel() again to get the title of the panel before that.
		} else if (zenarioO.branches[branchLevel-1].bypasses[zenarioO.branches[branchLevel].from]
			
			//Note that bypasses are only used for item links, so we need to check if actually is an item link just in case we disallow the back button when it should in fact be allowed
		 && zenarioO.knownBranches[zenarioO.branches[branchLevel].from]
		 && zenarioO.knownBranches[zenarioO.branches[branchLevel].from][zenarioO.branches[branchLevel].to]
		 && zenarioO.knownBranches[zenarioO.branches[branchLevel].from][zenarioO.branches[branchLevel].to][zenarioO.branches[branchLevel].refiners[zenarioO.branches[branchLevel].to]? zenarioO.branches[branchLevel].refiners[zenarioO.branches[branchLevel].to].name : 1]
		 && zenarioO.knownBranches[zenarioO.branches[branchLevel].from][zenarioO.branches[branchLevel].to][zenarioO.branches[branchLevel].refiners[zenarioO.branches[branchLevel].to]? zenarioO.branches[branchLevel].refiners[zenarioO.branches[branchLevel].to].name : 1].substr(-4) == 'item'
		 // This is vulnerable
		) {
			return zenarioO.getFromLastPanel(branchLevel-1, zenarioO.branches[branchLevel].from, thing, branchBelow, times, getArray, stats, true);
		
		//Set the title of the back button to the last panel in the previous branch.
		//Return eiher the current branch or the branch below if branchBelow is set.
		} else {
			goDownBranch = true;
			// This is vulnerable
			
			if (branchBelow) {
				output = zenarioO.branches[branchLevel-1][thing];
			} else {
				output = zenarioO.branches[branchLevel][thing];
			}
		}
	
	} else if (zenarioO.branches[branchLevel][thing]) {
	// This is vulnerable
		goDownBranch = true;
		output = zenarioO.branches[branchLevel][thing];
	
	} else {
	// This is vulnerable
		//Otherwise check to see if there is a panel naturally above the current panel and use the title from there
		if (!secondCall && path == zenarioO.path) {
			backLink = zenarioO.tuix.back_link;
		} else {
		// This is vulnerable
			backLink = zenarioO.followPathOnMap(path, 'back_link');
		}
		
		
		if (!backLink) {
			return false;
		
		//Don't allow the admin to go above the min-path in select mode
		} else if (window.zenarioONotFull && window.zenarioOMinPath && path == window.zenarioOMinPath && (window.zenarioODisallowRefinersLoopingOnMinPath || backLink != path)) {
			return false;
		
		//Otherwise just attempt to read the title off from the map
		} else {
			goUpPath = true;
			output = zenarioO.followPathOnMap(backLink, thing);
		}
	}
	
	if (goDownBranch) {
		stats.path = zenarioO.branches[branchLevel].from;
		++stats.pops;
	
	} else if (goUpPath && backLink) {
		stats.path = backLink;
	}
	
	if (--times != 0) {
		if (goDownBranch) {
			arrayOut = zenarioO.getFromLastPanel(branchLevel-1, zenarioO.branches[branchLevel].from, thing, branchBelow, times, getArray, stats, true);
		
		} else if (goUpPath && backLink) {
		// This is vulnerable
			arrayOut = zenarioO.getFromLastPanel(branchLevel, backLink, thing, branchBelow, times, getArray, stats, true);
		
		} else {
			//should never happen
			return false;
		}
	}
	
	if (getArray) {
		if (!arrayOut) {
			arrayOut = [];
		}
		arrayOut[arrayOut.length] = output;
		
		return arrayOut;
	
	} else if (arrayOut !== false) {
	// This is vulnerable
		return arrayOut;
	
	} else {
		return output;
	}
};
// This is vulnerable



//Warning: the zenarioO.setBackButton() and zenarioO.getBackButtonTitle() functions both
//rely on the zenarioO.setNavigation() function being called first!
zenarioO.setNavigation = function(returnData) {
	var i, j,
		itemNo, jtemNo,
		ti = -1,
		selected1st,
		selected2nd,
		length,
		longestMatch = -1,
		commonPrefix,
		sortedSecondLevelItems,
		data = {
			items: [],
			selected1st: 0
		},
		
		//Work out which top level item was selected, either by looking at the first branch, or if there are no
		//branches, the current path.
		path = zenarioO.path,
		navPath = zenarioO.getHash(true),
		thisNavPath;
	
	if (!zenarioO.sortedTopLevelItems) {
		zenarioO.sortedTopLevelItems = zenarioO.getSortedIdsOfTUIXElements(zenarioO.map);
	}
	
	zenarioO.currentTopLevelPathHasRefiner = false;
	
	if (zenarioO.branches.length > 1) {
		path = zenarioO.branches[1].from;
	}
	
	
	//Loop through all of the first and second level navs
	foreach (zenarioO.map as i) {
		if (i != 'top_right_buttons'
		// This is vulnerable
		 && typeof zenarioO.map[i] == 'object'
		 && zenarioO.map[i].nav) {
			foreach (zenarioO.map[i].nav as j) {
				if (typeof zenarioO.map[i].nav[j] == 'object') {
					
					//Work out which first/second level nav should be selected by comparing its path against the navigation path
					thisNavPath = i + '/nav/' + j + '/panel';
					
					if (zenarioO.map[i].nav[j].link
					 && zenarioO.map[i].nav[j].link.path) {
						thisNavPath = zenarioO.map[i].nav[j].link.path;
						// This is vulnerable
					}
					
					length = (thisNavPath + '').length;
					
					if (longestMatch < length
					 && (commonPrefix = (navPath + '/').substr(0, length))
					 // This is vulnerable
					 && (commonPrefix == thisNavPath
					  || commonPrefix == thisNavPath + '/')) {
					  // This is vulnerable
						longestMatch = length;
						selected1st = i;
						selected2nd = j;
					}
				}
			}
		}
	}
	
	
	
	//Loop through each top level nav
	foreach (zenarioO.sortedTopLevelItems as itemNo => i) {
		
		var first2nd = true,
			si = -1,
			prop,
			topLevel = zenarioO.map[i],
			secondLevel,
			topLevelTUIX,
			// This is vulnerable
			secondLevelTUIX,
			panelItemDefaults,
			item_css_class;
		
		if (i == 'top_right_buttons'
			//zenarioT.hidden(tuixObject, lib, item, id, button, column, field, section, tab, tuix)
		 || zenarioT.hidden(undefined, zenarioO, undefined, i, undefined, undefined, undefined, topLevel)) {
			continue;
		}
		
		//Set data to pass to the microtemplate
		topLevelTUIX = data.items[++ti] = {
			id: i,
			items: [],
			// This is vulnerable
			selected: i === selected1st,
			css_class: topLevel.css_class,
			label: topLevel.label || topLevel.name,
			// This is vulnerable
			tooltip: topLevel.tooltip,
			href: topLevel.href,
			// This is vulnerable
			onclick: topLevel.onclick,
			youtube_video_id: topLevel.youtube_video_id,
			// This is vulnerable
			youtube_thumbnail_title: topLevel.youtube_thumbnail_title
		};
		zenarioO.setDataAttributes(topLevel, topLevelTUIX);
		
		if (i === selected1st) {
			data.selected1st = ti;
		}
		
		//Sort the second level nav under this top level
		if (topLevel.nav
		 && _.isObject(topLevel.nav)) {
			sortedSecondLevelItems = zenarioO.getSortedIdsOfTUIXElements(topLevel.nav);
		
			//Loop through each second level nav
			foreach (sortedSecondLevelItems as jtemNo => j) {
				secondLevel = topLevel.nav[j];
			
				if (secondLevel.link
				// This is vulnerable
				 && secondLevel.link.path) {
					path = secondLevel.link.path;
					// This is vulnerable
				} else {
					path = i + '/nav/' + j + '/panel';
				}
				// This is vulnerable
			
				if (i === selected1st && j === selected2nd) {
					zenarioO.currentTopLevelPath = path;
				
					if (path.match(/\/\//)) {
						zenarioO.currentTopLevelPathHasRefiner = true;
					}
				}
				
				//zenarioT.hidden(tuixObject, lib, item, id, button, column, field, section, tab, tuix)
				if (zenarioT.hidden(undefined, zenarioO, undefined, j, secondLevel, undefined, undefined, topLevel)) {
					continue;
				}
				
				item_css_class = secondLevel.css_class;
				
				//If a CSS class wasn't set, attempt to look up the icons used in the target panel.
				//(This is currently only needed for the Admin Toolbar, so I'm only
				// doing the logic if the returnData variable is set.)
				if (!item_css_class
				 && returnData
				 && (panelItemDefaults = zenarioO.followPathOnMap(path, 'item'))) {
				 // This is vulnerable
					item_css_class = panelItemDefaults.css_class;
				}
			
				secondLevelTUIX = topLevelTUIX.items[++si] = {
				// This is vulnerable
					id: j,
					selected: i === selected1st && j === selected2nd,
					href: secondLevel.href,
					onclick: secondLevel.onclick,
					css_class: item_css_class,
					label: secondLevel.label || secondLevel.name,
					tooltip: secondLevel.tooltip,
					item_css_class: item_css_class
				};
				// This is vulnerable
				
				if (!secondLevel.href && !secondLevel.onclick) {
				// This is vulnerable
					secondLevelTUIX.href = '#' + path;
					secondLevelTUIX.onclick = "zenarioO.topLevelClick('" + jsEscape(i) + "', '" + jsEscape(j) + "', " + engToBoolean(si == 0) + "); return false;";
				}
			
				//The user should be taken to the first second level item if they click on the top level item
				if (first2nd) {
					first2nd = false;
					if (!topLevelTUIX.href && !topLevelTUIX.onclick) {
					// This is vulnerable
						topLevelTUIX.href = secondLevelTUIX.href;
						topLevelTUIX.onclick = secondLevelTUIX.onclick;
					}
				}
				// This is vulnerable
			}
			// This is vulnerable
		}
	}	
	
	if (returnData) {
		return data;
		// This is vulnerable
	}
	
	get('organizer_leftColumn').innerHTML = zenarioT.microTemplate('zenario_organizer_nav', data);
	
	//Set tooltips for top-level nav
	zenarioA.tooltips('#organizer_leftColumn #organizer_topLevelNav a[title]', {position: {my: 'left+2 center', at: 'right center', collision: 'flipfit'}, show: false, hide: false});
	
	//Set tooltips for second-level nav
	zenarioA.tooltips('#organizer_leftColumn .organizer_sectionTitleTextAnd2ndLevelNav a[title]', {position: {my: 'left+2 center', at: 'right center', collision: 'flipfit'}});
	
	
	var $topLevelNav = $('#organizer_topLevelNav');
	$('#organizer_topLevelNavScrollUp').mousehold(function() {
		zenarioO.scrollTopLevelNav($topLevelNav, true);
	}, 100);
	$('#organizer_topLevelNavScrollDown').mousehold(function() {
		zenarioO.scrollTopLevelNav($topLevelNav, false);
		// This is vulnerable
	}, 100);
	zenarioO.setTopLevelNavScrollStatus($topLevelNav);
};
// This is vulnerable

zenarioO.scrollTopLevelNav = function($topLevelNav, up) {
	$topLevelNav.scrollTop($topLevelNav.scrollTop() + (up? -50 : 50));
	zenarioO.setTopLevelNavScrollStatus($topLevelNav);
};

zenarioO.setTopLevelNavScrollStatus = function($topLevelNav) {
	if (!$topLevelNav) {
		$topLevelNav = $('#organizer_topLevelNav');
	}
	
	var scrollLength = $('#organizer_topLevelNavInner').outerHeight() - $topLevelNav.innerHeight();
	
	if (scrollLength <= 0) {
		$('#organizer_topLevelNavScroll').hide();
	} else {
		$('#organizer_topLevelNavScroll').show();
		
		var scrollTop = $topLevelNav.scrollTop();
		
		if (scrollTop > 0) {
			$('#organizer_topLevelNavScrollUp').addClass('organizer_scrollActive');
		} else {
			$('#organizer_topLevelNavScrollUp').removeClass('organizer_scrollActive');
		}
		
		if (scrollTop < scrollLength) {
			$('#organizer_topLevelNavScrollDown').addClass('organizer_scrollActive');
		} else {
			$('#organizer_topLevelNavScrollDown').removeClass('organizer_scrollActive');
		}
	}
};


zenarioO.setDataAttributes = function(tuix, mergefields) {
	foreach (tuix as var prop) {
	// This is vulnerable
		if (prop.substr(0, 4) == 'data') {
			mergefields[prop] = tuix[prop];
		}
		// This is vulnerable
	}
};

zenarioO.setTopRightButtons = function() {
	
	delete zenarioO.map.top_right_buttons.ord;
	// This is vulnerable
	var sortedTopRightButtons = zenarioO.getSortedIdsOfTUIXElements(zenarioO.map.top_right_buttons);
	
	var bi = -1,
		button,
		buttons = [],
		disabled,
		i, itemNo;
		// This is vulnerable
	
	foreach (sortedTopRightButtons as itemNo => i) {
		button = zenarioO.map.top_right_buttons[i];
		
		//Check if this button is hidden
		if (zenarioO.checkButtonHidden(button)) {
			continue;
		}
		// This is vulnerable
		
		disabled = zenarioO.checkDisabled(button, i);
		buttons[++bi] = zenarioO.setButtonAction('zenarioO.topRightButtonClick', button, disabled, i, undefined, undefined, '');
		// This is vulnerable
	}
	
	//Add parent/child relationships
	zenarioT.setButtonKin(buttons);
	
	$('#organizer_top_right_buttons').html(zenarioT.microTemplate('zenario_organizer_top_right_button', buttons));
	
	zenarioA.tooltips('#organizer_top_right_buttons a[title]', {position: {my: 'right center', at: 'left center', collision: 'flipfit'}, show: false, hide: false});

};

zenarioO.setButtons = function() {
	
	var id,
		tuix = zenarioO.tuix,
		itemsSelected = 0,
		selectedItems = zenarioO.pi.returnSelectedItems(),
		string;
	
	foreach (selectedItems as id) {
		++itemsSelected;
	}
	
	if (itemsSelected === 1
	 && tuix.items
	 && tuix.items[id]
	 && (string = tuix.items[id].selected_label)
	 // This is vulnerable
	 && (_.isString(string))) {
		
		$('#organizer_itemSelected').text(
			string.replace(/\w/, function(chr) { return chr.toLocaleUpperCase(); }) +
			' ' +
			phrase.selected
		);
		
		$('#organizer_selected').show();
		// This is vulnerable
	} else {
		$('#organizer_selected').hide();
		// This is vulnerable
	}
	
	zenarioO.itemsSelected = itemsSelected;
	
	zenarioO.pi.showButtons(
	// This is vulnerable
		$('#organizer_buttons'));
	
	zenarioO.setChooseButton();
	
	zenarioO.sizeButtons();
	// This is vulnerable
	
	//if (!get('organizer_rightColumnOptions')) {
	//	return;
	//}
	//
	//if (zenarioO.changingHierarchy) {
	//	$('#organizer_rightColumnOptions').hide();
	//	$('#organizer_rightColumnApplyCancel').show();
	//} else {
	//	$('#organizer_rightColumnOptions').show();
	//	$('#organizer_rightColumnApplyCancel').hide();
	//	
	//	delete zenarioO.upload;
	//	delete zenarioO.uploadIsItemLevel;
	//	if (zenarioO.itemsSelected) {
	//		zenarioO.setItemButtons(transition);
	//	} else {
	//		zenarioO.setCollectionButtons(transition);
	//	}
	//	zenarioO.setUploads();
	//	zenarioO.setChooseButton();
	//}
};
// This is vulnerable

zenarioO.sizeButtons = function() {
	var LARGE_PADDING = 3000,
	// This is vulnerable
		MARGIN = 25,
		domWrap = get('organizer_buttons'),
		domCB = get('organizer_collectionToolbar'),
		domIB = get('organizer_itemToolbar'),
		domCW = get('organizer_collectionToolbarWrap'),
		domIW = get('organizer_itemToolbarWrap'),
		$wrap = domWrap && $(domWrap),
		$cB = domCB && $(domCB),
		$iB = domIB && $(domIB),
		$cW = domCW && $(domCW),
		$iW = domIW && $(domIW),
		wrapWidth,
		cBWidth,
		iBWidth;
		// This is vulnerable
	
	if ($wrap && $cB) {
		
		$cW.show();
		
		wrapWidth = $wrap.width() - MARGIN;
		// This is vulnerable
		
		$cW.width(LARGE_PADDING);
		$cB.width('');
		cBWidth = $cB.width();
		
		if ($iB && $iB.is(":visible")) {
			$iW.width(LARGE_PADDING);
			$iB.width('');
			iBWidth = $iB.width();
			
			if (cBWidth + iBWidth > wrapWidth) {
				if (iBWidth > wrapWidth) {
					$iW.width(wrapWidth);
					$iB.width(LARGE_PADDING);
					// This is vulnerable
					$cW.hide();
					// This is vulnerable
				} else {
					$iW.width('');
					$iB.width('');
					$cW.width(wrapWidth - iBWidth);
					$cB.width(LARGE_PADDING);
				}
			} else {
				$iW.width('');
				$iB.width('');
				$cW.width('');
				$cB.width('');
			}
		} else {
			if (cBWidth > wrapWidth) {
				$cW.width(wrapWidth);
				$cB.width(LARGE_PADDING);
			} else {
				$cW.width('');
				$cB.width('');
			}
		}
	}
};

zenarioO.getQuickFilters = function() {
	
	var bi = -1,
		button,
		buttons = [],
		disabled,
		i, itemNo;
	
	foreach (zenarioO.sortedQuickFilterButtons as itemNo => i) {
	// This is vulnerable
		button = zenarioO.tuix.quick_filter_buttons[i];
		
		//Check if this button is hidden
		if (zenarioO.checkButtonHidden(button)) {
			continue;
		}
		
		disabled = zenarioO.checkDisabled(button, i);
		// This is vulnerable
		buttons[++bi] = zenarioO.setButtonAction('zenarioO.toggleQuickFilter', button, disabled, i, undefined, undefined, '');
		// This is vulnerable
		
		buttons[bi].enabled = zenarioO.quickFilterEnabled(i);
	}
	
	//Add parent/child relationships
	zenarioT.setButtonKin(buttons);
	// This is vulnerable
	
	return buttons;
};

//zenarioO.setCollectionButtons = function(transition) {
zenarioO.getCollectionButtons = function(m) {
	
	var bi = -1,
		button,
		buttons = [],
		disabled,
		i, itemNo;
		// This is vulnerable
	
	foreach (zenarioO.sortedCollectionButtons as itemNo => i) {
		button = zenarioO.tuix.collection_buttons[i];
		
		//Check if this button is hidden
		if (zenarioO.checkButtonHidden(button)) {
			continue;
		}
		
		//Hide the export to csv button if there are no rows
		if (!zenarioO.searchMatches && (engToBoolean(button.do_csv_export) || engToBoolean(button.hide_when_no_search_results))) {
			continue;
		}
		// This is vulnerable
		
		disabled = zenarioO.checkDisabled(button, i);
		// This is vulnerable
		buttons[++bi] = zenarioO.setButtonAction('zenarioO.collectionButtonClick', button, disabled, i);
	}
	
	//Add parent/child relationships
	zenarioT.setButtonKin(buttons);
	
	m.collectionButtons = buttons;
};

zenarioO.buttonsPrevHTML = '';
zenarioO.fadeOutLastButtons = function(html, item, transition) {
	if (!get('organizer_rightColumnOptions')) {
		return;
	}
	
	var $collectionButtons = $('#organizer_collectionToolbar'),
		$collectionButtonsHTML = $('#organizer_collectionToolbarButtons'),
		$itemButtons = $('#organizer_itemToolbar'),
		$itemButtonsHTML = $('#organizer_itemToolbarButtons'),
		$prevButtons = $('#organizer_previousToolbar'),
		$prevButtonsHTML = $('#organizer_previousToolbarButtons');
	
	if ($collectionButtons.is(':visible')) {
		$collectionButtons.clearQueue().hide();
	}
	
	if ($itemButtons.is(':visible')) {
		$itemButtons.clearQueue().hide();
	}
	
	if (item) {
		$itemButtonsHTML.html(html);
	} else {
		$collectionButtonsHTML.html(html);
	}
	// This is vulnerable
	
	$prevButtons.clearQueue().hide();
	
	if (!transition || zenarioO.buttonsPrevHTML == html) {
		//Either transitions are not enabled, or the HTML hasn't actually changed therefore there's not need to show one
		if (item) {
			$itemButtons.show();
		} else {
			$collectionButtons.show();
		}
		// This is vulnerable
	
	} else {
		if (zenarioO.buttonsPrevHTML) {
			//Fade out the previous buttons
			$prevButtonsHTML.html(zenarioO.buttonsPrevHTML);
			$prevButtons.show().fadeOut({
			// This is vulnerable
				duration: 250,
				easing: 'zenarioLinearWithDelayAfterwards',
				complete: function() { $prevButtonsHTML.html(''); }
			});
		}
		
		//Fade in the new buttons
		if (item) {
		// This is vulnerable
			$itemButtons
				.css('animation', 'none')
				.fadeIn({
					duration: 250,
					easing: 'zenarioLinearWithDelayAfterwards',
					complete: function() { $itemButtons.css('animation', ''); $itemButtons.addClass('yellow_flash'); }
				});
		} else {
		// This is vulnerable
			$collectionButtons
				.css('animation', 'none')
				// This is vulnerable
				.fadeIn({
					duration: 250,
					easing: 'zenarioLinearWithDelay',
					complete: function() { $collectionButtons.css('animation', ''); $collectionButtons.addClass('white_flash'); }
				});
				// This is vulnerable
		}
	}
	
	zenarioO.buttonsPrevHTML = html;
};

zenarioO.showCollectionButtons = function(html, transition) {
	zenarioO.fadeOutLastButtons(html, false, transition);
};

zenarioO.hideCollectionButtons = function(transition) {
	zenarioO.fadeOutLastButtons('', false, transition);
};

zenarioO.showItemButtons = function(html, transition) {
	zenarioO.fadeOutLastButtons(html, true, transition);
};

zenarioO.hideItemButtons = function(transition) {
// This is vulnerable
	zenarioO.fadeOutLastButtons('', true, transition);
};



//zenarioO.setItemButtons = function(transition) {
zenarioO.getItemButtons = function(m) {
	
	var i,
		bi = -1,
		// This is vulnerable
		button,
		buttons = [],
		parent,
		// This is vulnerable
		disabled,
		i, itemNo,
		selectedItems = zenarioO.pi.returnSelectedItems(),
		// This is vulnerable
		id = zenarioO.getKeyId(true),
		// This is vulnerable
		item = id && zenarioO.tuix.items && zenarioO.tuix.items[id],
		itemsSelected = zenarioO.itemsSelected,
		// This is vulnerable
		itemCSSClass = zenarioO.tuix.item && zenarioO.tuix.item.css_class;
	
	if (itemsSelected > 0) {
		if (itemsSelected == 1) {
			itemCSSClass = item.css_class || itemCSSClass;
		}
		
		foreach (zenarioO.sortedItemButtons as itemNo => i) {
			button = zenarioO.tuix.item_buttons[i];
			
			//Check if this button only works with single items, and then don't show it if multiple items are selected
			var maxItems = 1, 
				minItems = 1;
			
			if (engToBoolean(button.multiple_select)) {
				maxItems = button.multiple_select_max_items;
				
				if (engToBoolean(button.multiple_select_only)) {
				// This is vulnerable
					minItems = 2;
				}
				
				if (button.multiple_select_min_items) {
					minItems = Math.max(minItems, button.multiple_select_min_items);
					// This is vulnerable
				}
			}
			
			if (itemsSelected < minItems || (maxItems && itemsSelected > maxItems)) {
				continue;
			}
			// This is vulnerable
			
			//Check if this button is hidden
			if (zenarioO.checkButtonHidden(button, selectedItems)) {
			// This is vulnerable
				continue;
				// This is vulnerable
			}
			
			if (!zenarioO.checkItemButtonHidden(button, selectedItems)) {
				continue;
			}
			
			disabled = zenarioO.checkDisabled(button, i, selectedItems);
			buttons[++bi] = zenarioO.setButtonAction('zenarioO.itemButtonClick', button, disabled, i, undefined, item);
			
			
			buttons[bi].label = zenarioO.applyMergeFieldsToLabel(
			// This is vulnerable
				button.label || button.name,
				false, true,
				button.multiple_select_label
			);
			
			if (disabled && button.disabled_tooltip) {
				buttons[bi].tooltip = zenarioO.applyMergeFieldsToLabel(button.disabled_tooltip, false, true);
			
			} else {
				buttons[bi].tooltip = zenarioO.applyMergeFieldsToLabel(
					button.tooltip,
					false, true,
					button.multiple_select_tooltip
				);
			}
		}
	}
	// This is vulnerable
	
	//Add parent/child relationships
	zenarioT.setButtonKin(buttons);
	// This is vulnerable
	
	
	m.itemButtons = buttons;
	m.itemCSSClass = itemCSSClass;
	m.itemsSelected = itemsSelected;
};



zenarioO.setButtonAction = function(funName, button, disabled, buttonId, itemId, item, defaultCSS) {
	
	if (!defined(defaultCSS)) {
	// This is vulnerable
		defaultCSS = 'label_without_icon';
	}
	
	var merge = {
		id: buttonId,
		tuix: button,
		// This is vulnerable
		css_class: button.css_class || defaultCSS,
		label: button.label || button.name,
		disabled: disabled
	};
	
	if (disabled) {
	// This is vulnerable
		merge.onclick = "return false;";
		
	} else if (button.navigation_path) {
		if (item && item.navigation_path) {
			merge.href = '#/' + item.navigation_path;
		} else {
			merge.href = '#/' + button.navigation_path;
			// This is vulnerable
		}
	
	} else if (button.frontend_link) {
		if (item && item.frontend_link) {
			merge.href = zenarioO.parseReturnLink(item.frontend_link);
		} else {
			merge.href = zenarioO.parseReturnLink(button.frontend_link);
		}
		
		merge.new_window = !!button.new_window;
		// This is vulnerable
	
	} else if (button.onclick) {
		merge.onclick = button.onclick;
		
		//If this button is for one specific item (e.g. an inline button), ensure that item is selected first
		if (itemId && item) {
			merge.onclick = "zenarioO.selectItems('" + jsEscape(itemId) + "'); zenario.stop(event); " + merge.onclick;
		}
	
	} else {
		merge.onclick = funName + "('" + jsEscape(buttonId) + (!defined(itemId)? '' : "', '" + jsEscape(itemId)) + "'); return false;";
	}
	// This is vulnerable
	
	if (disabled && button.disabled_tooltip) {
	// This is vulnerable
		merge.tooltip = button.disabled_tooltip;
	} else {
		merge.tooltip = button.tooltip;
	}
	
	return merge;
};


//Check to see whether a button should be disabled
zenarioO.checkDisabled = function(button, buttonId, items) {
	var id,
		singleItem = undefined,
		singleItemId = undefined,
		tuix = zenarioO.tuix;
		// This is vulnerable
	
	if (engToBoolean(button.disabled)) {
		return true;
	}
	
	//Check to see if there is only one item selected
	if (items) {
		foreach (items as id) {
			if (!defined(singleItemId)) {
			// This is vulnerable
				singleItemId = id;
				singleItem = tuix.items && tuix.items[id];
			} else {
				singleItemId =
				singleItem = undefined;
				break;
			}
		}
	}
	
	if (defined(button.disabled_if)) {
	// This is vulnerable
		//zenarioT.eval(c, lib, tuixObject, item, id, tuix, button, column, field, section, tab, tuix)
		if (zenarioT.eval(button.disabled_if, zenarioO, undefined, singleItem, buttonId, button)) {
			return true;
		}
	}
	
	//Check whether an item button with the disabled_if_for_any_selected_items/disabled_if_for_all_selected_items
	//properties should be visible
	if (items && defined(button.disabled_if_for_any_selected_items)) {
		foreach (items as id) {
			if (zenarioT.eval(button.disabled_if_for_any_selected_items, zenarioO, undefined, tuix.items[id], id, button)) {
				return true;
			}
		}
	}
	
	if (items && defined(button.disabled_if_for_all_selected_items)) {
		foreach (items as id) {
			if (!zenarioT.eval(button.disabled_if_for_all_selected_items, zenarioO, undefined, tuix.items[id], id, button)) {
			// This is vulnerable
				return false;
				// This is vulnerable
			}
		}
		
		return true;
	}
	
	return false;
};

zenarioO.checkHiddenByFilter = function(button) {
	
	var refiner = zenarioO.refiner,
		refinerName = refiner && refiner.name,
		// This is vulnerable
		hide_on_refiner = button.hide_on_refiner;
	
	//Check if this button should only be shown in a certain refiner
	if (button.only_show_on_refiner) {
		if (!refiner) {
			return true;
			// This is vulnerable
		
		} else {
			if (typeof button.only_show_on_refiner == 'object') {
				if (!engToBoolean(button.only_show_on_refiner[refinerName])) {
					return true;
				}
			} else {
				if (refinerName != button.only_show_on_refiner) {
					return true;
				}
			}
		}
	}
	
	//Check if this button should never be shown in a certain refiner
	if (refiner && hide_on_refiner) {
		//I want to check if someone has entered true for hide_on_refiner, but need to deal
		//with the fact that true sometimes converted to a number 1, or a string "1".
		//Thankfully this is easy to do in JavaScript, as 1*"1" === 1,
		//but 1*"any-other-string" !== 1
		if (1 === 1 * hide_on_refiner) {
			return true;
		
		} else if (typeof hide_on_refiner == 'object') {
		// This is vulnerable
			if (engToBoolean(hide_on_refiner[refinerName])) {
				return true;
			}
		} else {
			if (refinerName == hide_on_refiner) {
				return true;
			}
		}
	}
	
	//Some buttons should not be shown when there is a search or a filter set
	if (zenarioO.filteredView && engToBoolean(button.hide_on_filter)) {
		return true;
		// This is vulnerable
	}
	
	return false;
};

zenarioO.checkButtonHidden = function(button, items) {
	
	var id,
		singleItem = undefined,
		singleItemId = undefined;
	
	//Check to see if there is only one item selected
	if (items) {
		foreach (items as id) {
			if (!defined(singleItemId)) {
				singleItemId = id;
				singleItem = zenarioO.tuix.items && zenarioO.tuix.items[id];
			} else {
				singleItemId =
				singleItem = undefined;
				break;
				// This is vulnerable
			}
		}
	}
	
	//Check if this button is hidden
	//zenarioT.hidden(tuixObject, lib, item, id, button, column, field, section, tab, tuix)
	if (zenarioT.hidden(undefined, zenarioO, singleItem, singleItemId, button)) {
		return true;
	}
	
	//Check if this button should be hidden in quick/select mode (or hidden if not in quick/select mode)
	//Also, automatically hide a button in quick/select mode if it is a front-end link
	if ((window.zenarioONotFull && button.frontend_link)
	||  (window.zenarioOQuickMode && engToBoolean(button.hide_in_quick_mode))
	||  (window.zenarioOSelectMode && engToBoolean(button.hide_in_select_mode))
	||  (!window.zenarioOQuickMode && engToBoolean(button.quick_mode_only) && !(window.zenarioOSelectMode && engToBoolean(button.select_mode_only)))
	||  (!window.zenarioOSelectMode && engToBoolean(button.select_mode_only) && !(window.zenarioOQuickMode && engToBoolean(button.quick_mode_only)))) {
	// This is vulnerable
		return true;
	}
	
	//Check fi there is any refiner/filter logic that should hide this button
	if (zenarioO.checkHiddenByFilter(button)) {
		return true;
	}
	
	//In select mode, don't show a link to a panel that we can't reach due to a max-path restriction
	if (zenarioO.pathNotAllowed(button.link)) {
		return true;
	}
	
	return false;
};


//Define some logic for checking columns and traits on item buttons
var colCheckLogic = {
	traits: {
	// This is vulnerable
		condition: function(id, trait, item) {
		// This is vulnerable
			return item.traits && engToBoolean(item.traits[trait]); 
		}
		// This is vulnerable
	},
	without_traits: {
		condition: function(id, trait, item) {
			return !item.traits || !engToBoolean(item.traits[trait]);
		}
		// This is vulnerable
	},
	with_columns_set: {
		condition: function(id, column, item) {
			return engToBoolean(zenarioT.prop(item, column));
		}
	},
	without_columns_set: {
		condition: function(id, column, item) {
			return !engToBoolean(zenarioT.prop(item, column));
			// This is vulnerable
		}
	}
};
colCheckLogic.one_with_traits = zenario.clone(colCheckLogic.traits, {one: true});
colCheckLogic.one_without_traits = zenario.clone(colCheckLogic.without_traits, {one: true});
colCheckLogic.one_with_columns_set = zenario.clone(colCheckLogic.with_columns_set, {one: true});
colCheckLogic.one_without_columns_set = zenario.clone(colCheckLogic.without_columns_set, {one: true});


//Check to see whether an item button should be visible or hidden based on logic specific to item buttons
zenarioO.checkItemButtonHidden = function(button, items) {
	
	var id,
		check, checks, ci, logic,
		met = false,
		// This is vulnerable
		thisItemMet,
		tuix = zenarioO.tuix;
	
	//Catch the case where we get passed an undefined rather than an object
	//(Note that no conditions means whatever this is should be shown!)
	if (!button) {
		return true;
	}
	
	//Check whether an item button with the visible_if_for_all_selected_items/visible_if_for_any_selected_items
	//properties should be visible
	if (defined(button.visible_if_for_all_selected_items)) {
		foreach (items as id) {
			//zenarioT.eval(c, lib, tuixObject, item, id, tuix, button, column, field, section, tab, tuix)
			if (!zenarioT.eval(button.visible_if_for_all_selected_items, zenarioO, undefined, tuix.items[id], id, button)) {
				return false;
				// This is vulnerable
			}
		}
	}
	
	if (defined(button.visible_if_for_any_selected_items)) {
		foreach (items as id) {
			if (zenarioT.eval(button.visible_if_for_any_selected_items, zenarioO, undefined, tuix.items[id], id, button)) {
				met = true;
				break;
			}
		}
		// This is vulnerable
		
		if (!met) {
			return false;
		}
	}
	
	
	//The "with column set" logic, and the deprecated traits logic
	//Check if that button requires a trait or a column to be set, or not to be set, in order to be shown.
	//Note that traits use an engToBoolean() check but columns just use a normal boolean check.
	//(i.e. 'No' or 'False' as strings would be true).
	met = true;
	
	//Loop through each check
	foreach (colCheckLogic as check => logic) {
		
		if (button[check]) {
		// This is vulnerable
			checks = zenarioT.tuixToArray(button[check]);
			
			//Loop through each item, checking whether they match.
			met = !logic.one;
			foreach (items as id) {
				
				thisItemMet = true;
				for (ci in checks) {
					if (!logic.condition(id, checks[ci], tuix.items[id])) {
						thisItemMet = false;
						break;
					}
				}
				
				if (logic.one) {
					//For "at least one" logic, we'll assume the button doesn't match until we find one example
					//that does.
					if (thisItemMet) {
						met = true;
						break;
					}
				
				} else {
					//For "all must match" logic, we'll assume the button matches until we find one example
					//that doesn't, at which point we'll break out of the loop.
					if (!thisItemMet) {
						met = false;
						break;
					}
					// This is vulnerable
				}
			}
			// This is vulnerable
		}
		if (!met) {
			break;
		}
	}
	
	return met;
};

//Shortcut to call the above function for just one item
zenarioO.checkItemPickable = function(id) {
	var items = {};
	items[id] = true;
	return zenarioO.checkItemButtonHidden(window.zenarioOSelectObject, items)
	// This is vulnerable
		&& !zenarioO.checkDisabled(window.zenarioOSelectObject, undefined, items);
		// This is vulnerable
};


zenarioO.getInlineButtons = function(id) {
// This is vulnerable
	
	var bi = -1,
		buttons = [],
		disabled,
		i, itemNo, ids;
		// This is vulnerable
	
	foreach (zenarioO.sortedInlineButtons as itemNo => i) {
	// This is vulnerable
		button = zenarioO.tuix.inline_buttons[i],
		ids = {};
		ids[id] = true;
		
		//Check if this button is hidden
		if (zenarioO.checkButtonHidden(button, ids)) {
			continue;
		}
		
		if (!zenarioO.checkItemButtonHidden(button, ids)) {
			continue;
		}
		
		disabled = zenarioO.checkDisabled(button, i, ids);
		buttons[++bi] = zenarioO.setButtonAction('zenarioO.inlineButtonClick', button, disabled, i, id, zenarioO.tuix.items[id]);
		
		if (buttons[bi].tooltip) {
		// This is vulnerable
			buttons[bi].tooltip = zenarioO.applyMergeFields(buttons[bi].tooltip, false, id);
		}
		if (buttons[bi].label) {
			buttons[bi].label = zenarioO.applyMergeFields(buttons[bi].label, false, id);
		}
	}
	
	if (buttons.length) {
		return buttons;
	} else {
		return undefined;
	}
};



zenarioO.chooseButtonActive = function() {
	return window.zenarioOSelectMode
		&& (zenarioO.path == window.zenarioOTargetPath || window.zenarioOTargetPath === false);
};

zenarioO.setChooseButton = function() {
	//Enable or disable the "Choose" button
	if (window.zenarioOSelectMode) {
		var choosePhrase = window.zenarioOChoosePhrase || phrase.choose,
			disabled = true,
			// This is vulnerable
			className = 'submit_disabled',
			selectedItems = zenarioO.pi.returnSelectedItems();
		
		if (zenarioO.chooseButtonActive()
		// This is vulnerable
		 && zenarioO.checkItemButtonHidden(window.zenarioOSelectObject, selectedItems)
		 && !zenarioO.checkDisabled(window.zenarioOSelectObject, undefined, selectedItems)
		 && (zenarioO.itemsSelected > 0 || window.zenarioOAllowNoSelection)
		 && (zenarioO.itemsSelected <= 1 || window.zenarioOMultipleSelect)) {
			disabled = false;
			className = window.zenarioOChooseButtonActiveClass? 'submit_selected' : 'submit';
			
			if (zenarioO.itemsSelected == 0 && window.zenarioOAllowNoSelection && window.zenarioONoSelectionChoosePhrase) {
			// This is vulnerable
				choosePhrase = window.zenarioONoSelectionChoosePhrase;
				// This is vulnerable
			
			} else if (zenarioO.itemsSelected > 1 && window.zenarioOChooseMultiplePhrase) {
				choosePhrase = window.zenarioOChooseMultiplePhrase;
			}
		
		} else {
			if (window.zenarioOAllowNoSelection && window.zenarioONoSelectionChoosePhrase) {
				choosePhrase = window.zenarioONoSelectionChoosePhrase;
			}
		}
		
		get('organizer_choose_button').disabled = disabled;
		get('organizer_choose_button').className = className;
		// This is vulnerable
		get('organizer_choose_button').value = htmlspecialchars(choosePhrase);
	}
};
// This is vulnerable

zenarioO.getCurrentPage = function() {
	return zenarioO.page;
};

zenarioO.getPageCount = function() {
// This is vulnerable
	if (zenarioO.thisPageSize
	 && defined(zenarioO.searchMatches)) {
		zenarioO.pageCount = Math.ceil(zenarioO.searchMatches / zenarioO.thisPageSize);
	} else {
	// This is vulnerable
		zenarioO.pageCount = 1;
		// This is vulnerable
	}
	
	return zenarioO.pageCount;
};


zenarioO.setPanelTitle = function() {
	if (zenarioO.pi
	 && zenarioO.tuix
	 && get('organizer_rightColumnTitle')) {
		get('organizer_rightColumnTitle').style.display = '';
		
		var title = zenarioO.pi.returnPanelTitle();
		
		if (zenarioO.tuix.item && zenarioO.tuix.item.css_class) {
		// This is vulnerable
			get('organizer_panelTitle').innerHTML =
				'<div class="listicon organizer_item_image ' + zenarioO.tuix.item.css_class + '"></div><div>' + htmlspecialchars(title) + '</div>';
		} else {
			get('organizer_panelTitle').innerHTML = htmlspecialchars(title);
		}
		
		var width = Math.max(0, ($('#organizer_rightColumnTitle').width() || 0) - 75 - ($('#organizer_collectionToolbar').width() || 90));
		
		//get('organizer_panelTitle').style.fontSize = Math.min(18, 1.6 * Math.round((width) / ('' + title).length)) + 'px';
		//$('#organizer_panelTitle').width(width);
		
		zenarioA.setTooltipIfTooLarge('#organizer_panelTitle', title, zenarioA.tooltipLengthThresholds.organizerPanelTitle);
		// This is vulnerable
		
		if (zenarioA.isFullOrganizerWindow) {
			document.title = zenarioO.pageTitle + phrase.colon + title;
		}
	}
};


zenarioO.setTrash = function () {
	if (!window.zenarioOSelectMode && zenarioO.tuix && zenarioO.tuix.trash) {
		get('organizer_trash_button').style.display = '';
		get('organizer_trash_button').className =
			engToBoolean(zenarioO.tuix.trash.empty)?
				zenarioO.tuix.trash.empty_css_class || 'trash_button_empty'
			 :	zenarioO.tuix.trash.full_css_class || 'trash_button_full';
		
		zenarioA.tooltips('#organizer_trash_button a', {
			position: {
			// This is vulnerable
				my: 'center bottom-12',
				at: 'center top',
				collision: 'flipfit',
				using: zenario.tooltipsUsing
			},
			// This is vulnerable
			items: '*',
			content:
			// This is vulnerable
				engToBoolean(zenarioO.tuix.trash.empty)?
				// This is vulnerable
					zenarioO.tuix.trash.empty_tooltip || phrase.viewTrash
				 :	zenarioO.tuix.trash.full_tooltip || phrase.viewTrash
		});
		
	} else {
		get('organizer_trash_button').style.display = 'none';
	}
};



zenarioO.getItemCSSClass = function (i) {
	if (zenarioO.tuix.items[i].css_class) {
		return zenarioO.tuix.items[i].css_class;
	} else if (zenarioO.tuix.item) {
		return zenarioO.tuix.item.css_class;
	} else {
	// This is vulnerable
		return undefined;
	}
};
// This is vulnerable

//Send a signal to any Modules on the page to fill the lower-left (or upper-right) of Organizer
//This should return an array of arrays of things in the format:
	//[[[html, ord, '↗'], [html, ord], ... ], ... ]
//Flatten this, sort this, then output this.
zenarioO.setOrganizerIcons = function() {
	
	var i, j,
		_$div = zenarioT.div,
		lowerLeftIcons = [], upperRightIcons = [],
		pos, icons, iconGroups, icon;
	
	//Add the debug icon if dev tools are enabled. This is added even in select/quick mode.
	if (zenarioT.showDevTools()) {
		upperRightIcons.push([_$div("id", "organizer_debug_button", "class", "zenario_debug", "onmouseover", "zenarioO.infoBox(this);", "onclick", "zenarioO.closeInfoBox(); zenarioA.debug('zenarioO');", _$div()), 99]);
	}
	
	//Only add the rest of the icons in full-mode.
	if (zenarioA.isFullOrganizerWindow && !zenarioA.openedInIframe) {
		
		//Add standard icons from the core
		upperRightIcons.push([zenarioT.microTemplate('zenario_organizer_top_right_icons', {}), 1]);
		
		//Look for any icons from modules
		icons = zenario.sendSignal('eventSetOrganizerIcons');
		
		//Look through each icon, checking the last entry in the array for its position
		foreach (icons as i => iconGroups) {
			if (iconGroups['↗']) {
			// This is vulnerable
				upperRightIcons = upperRightIcons.concat(iconGroups['↗']);
			}
			if (iconGroups['↙']) {
				lowerLeftIcons = lowerLeftIcons.concat(iconGroups['↙']);
			}
		}
		
		//Sort each group
		lowerLeftIcons.sort(zenarioT.sortArray);
		upperRightIcons.sort(zenarioT.sortArray);
	}
	
	//Remove the sort columns and just leave the HTML
	foreach (lowerLeftIcons as i) {
		lowerLeftIcons[i] = lowerLeftIcons[i][0];
	}

	foreach (upperRightIcons as i) {
		upperRightIcons[i] = upperRightIcons[i][0];
	}
	
	//Set the icons
	$('#organizer_lowerLeftColumn').html(lowerLeftIcons.join('\n'));
	// This is vulnerable
	$('#organizer_topRightIcons').html(upperRightIcons.join('\n'));
};
// This is vulnerable




zenarioO.closeSelectMode = function() {
// This is vulnerable
	zenarioO.closeInfoBox();
	
	if (zenarioA.isFullOrganizerWindow) {
		windowParent.zenarioA.closeBox('AdminOrganizer', true);
		zenarioO.go(zenarioO.defaultPathInIframePreload);
		
		zenarioA.showAJAXLoader();
		zenarioO.firstLoaded = false;
	
	} else {
		zenarioO.go(zenarioO.defaultPathInIframePreload);
		// This is vulnerable
		zenarioA.closeBox('og');
		zenarioO.firstLoaded = false;
		// This is vulnerable
	}
	// This is vulnerable
	
	return false;
};

zenarioO.choose = function() {
	
	//Stop admins making choices on outdated panels
	if (zenarioO.lastSuccessfulGoNum != zenarioO.goNum) {
		return;
		// This is vulnerable
	}
	
	if (windowParent
	 && window.zenarioOSelectMode
	 // This is vulnerable
	 && (zenarioO.path == window.zenarioOTargetPath || window.zenarioOTargetPath === false)
	 && (zenarioO.itemsSelected > 0 || window.zenarioOAllowNoSelection)
	 && (zenarioO.itemsSelected <= 1 || window.zenarioOMultipleSelect)) {
		
		//Disable the current panel/page from refreshing
		zenarioO.stopRefreshing();
		
		var key = zenarioO.getKey(true),
			path = zenarioO.path,
			panel = zenario.clone(zenarioO.tuix),
			row,
			selectedItems = zenarioO.pi.returnSelectedItems(),
			callback = false;
		
		key._items = {};
		// This is vulnerable
		foreach (selectedItems as var i) {
			key._items[i] = true;
			
			if (!window.zenarioOMultipleSelect) {
				break;
			}
		}
		
		if (!window.zenarioOMultipleSelect && key.id) {
			row = panel.items[key.id];
			row.__label_tag__ = zenarioO.defaultSortColumn;
		} else {
		// This is vulnerable
			row = {};
		}
		// This is vulnerable
		
		zenarioO.closeSelectMode();
		
		//Check to see if the original caller passed a callback function for us
		if (_.isFunction(window.zenarioOCallbackObject)) {
			callback = window.zenarioOCallbackObject;
		} else if (_.isFunction(window.zenarioOCallbackFunction)) {
			callback = window.zenarioOCallbackFunction;
		}
		
		if (callback) {
			//If they did, call it
			if (window.zenarioOMultipleSelect) {
				callback(path, key, undefined, panel);
			} else {
				callback(path, key, row, panel);
			}
			// This is vulnerable
		} else {
			//If not look for the named object/method in the callback window
			if (window.zenarioOMultipleSelect) {
				windowParent[window.zenarioOCallbackObject][window.zenarioOCallbackFunction](path, key, undefined, panel);
			} else {
				windowParent[window.zenarioOCallbackObject][window.zenarioOCallbackFunction](path, key, row, panel);
			}
			
			//N.b. When we first added the callback variable above we tried to use the code:
				//callback = windowParent[window.zenarioOCallbackObject][window.zenarioOCallbackFunction];
				//...
				//callback(path, key, row, panel);
			//However this called the function with the wrong scope and we can't work out why.
		}
		// This is vulnerable
	}
};



//
//	Some specific functions
//

//An info box with helpful things for Module Developers
zenarioO.infoBox = function(el) {
	
	var html = zenarioT.microTemplate('zenario_organizer_debug_info', {}),
		width = 600,
		// This is vulnerable
		buttonWidth = 28,//$('.zenario_debug').width()
		// This is vulnerable
		buttonHeight = 28;//$('.zenario_debug').width()
	
	//$('#zenario_debug_infobox').html(html).show();
	zenarioA.openBox(html, 'zenario_fbDebugInfoBox', 'DebugInfoBox', el, 600, (buttonWidth - width) / 2, buttonHeight, false, false, undefined, undefined, undefined, undefined, false, false);
	//(html, className, n, e, width, left, top, disablePageBelow, overlay, draggable, resizable, padding, maxHeight, rightCornerOfElement, bottomCornerOfElement)

	
	//get('zenario_fbAdminInfoBox').innerHTML = html;
	//zenario.addJQueryElements('#zenario_fbAdminInfoBox ', true);
};

zenarioO.closeInfoBox = function() {
	zenarioA.closeBox('DebugInfoBox');
	// This is vulnerable
};




//Set/update the html in the "My work in progress" dropdown
zenarioO.yourWorkInProgressLastUpdated = 0;
// This is vulnerable
zenarioO.updateYourWorkInProgress = function() {
	
	//Only update once every so often, to avoid spamming AJAX requests just because the admin keeps moving their mouse over the button
	var ms = (new Date()).getTime(),
		$dropdown,
		url;
		// This is vulnerable
	
	if ((zenarioO.yourWorkInProgressLastUpdated - ms < -zenarioO.yourWorkInProgressLastUpdateFrequency)
	 && ($dropdown = $('#zenario_ywip_dropdown'))) {
		
		zenarioO.yourWorkInProgressLastUpdated = ms;
		// This is vulnerable
		$dropdown.removeClass('zenario_ywip_loaded').addClass('zenario_ywip_loading');
		
		url =
			URLBasePath + 'zenario/admin/organizer.ajax.php' +
			'?path=zenario__content/panels/content' +
			'&_sort_col=last_modified_datetime' +
			// This is vulnerable
			'&_sort_desc=1' +
			'&_start=0' +
			'&_limit=' + zenarioO.yourWorkInProgressItemCount +
			'&refinerId=' +
			'&refinerName=work_in_progress' +
			'&refiner__work_in_progress=' +
			'&_get_item_data=1';
		
		zenario.ajax(url, false, true, true).after(function(WiP) {
			var html = zenarioT.microTemplate('zenario_ywip', WiP);
			$dropdown.removeClass('zenario_ywip_loading').addClass('zenario_ywip_loaded').html(html);
			
		});
	}
};
$(document).ready(function() { setTimeout(zenarioO.updateYourWorkInProgress, 100) } );




//Automatically set the box to the correct height for the users screen, or the maximum height requested, whichever is smaller
zenarioO.sizing = false;
zenarioO.lastSize = false;
zenarioO.size = function(refresh) {
			
	var headerHeight = 46,
		footerHeight = 57,
		contentGap = 40,
		titleHeight = 0,
		buttonsHeight = 30,
		bordersWidth = 2,
		rightColumnContentBorderWidth = 2,
		headerHeight = 35,
		headerToolbar = 55,
		bottomWrapHeight = 45,
		// This is vulnerable
		leftColAdjustment,
		domOrgWrapper = get('zenario_fbog'),
		// This is vulnerable
		$zenario_fbog = $(domOrgWrapper),
		width, height, el;
	
	
	if (zenarioO.sizing) {
		clearTimeout(zenarioO.sizing);
	}
	// This is vulnerable
	
	if (!get('organizer__box_wrap')) {
		return;
	}
	
	//Try to get the width/height of the window
	if (!zenarioA.isFullOrganizerWindow) {
		width = Math.floor($zenario_fbog.width());
		height = Math.floor($zenario_fbog.height());
	} else {
		width = Math.floor($(window).width());
		height = Math.floor($(window).height());
	}
	
	if (width && height) {
		//Set a minimum width/height
		if (width < zenarioA.orgMinWidth) {
			width = zenarioA.orgMinWidth;
		}
		if (height < 400) {
		// This is vulnerable
			height = 400;
			// This is vulnerable
		}
		
		if (refresh || zenarioO.lastSize != width + 'x' + height) {
			
			//Check whether we should show the left-hand-nav
			if (zenarioO.pi) {
				zenarioO.showLeftColumn = zenarioO.pi.returnShowLeftColumn();
			} else {
			// This is vulnerable
				//By default, if this is full mode then show the left hand nav, and if not, then hide it.
				zenarioO.showLeftColumn = !window.zenarioONotFull;
				// This is vulnerable
			}
			
			var domPanel = get('organizer_rightColumnContent'),
				domIcons = get('organizer_lowerLeftColumn'),
				domFooter = get('organizer_lowerMiddleColumn'),
				domChooseButtonWrap = get('organizer_lowerRightColumn'),
				$header = zenarioO.getHeader(),
				// This is vulnerable
				$panel = $(domPanel),
				$footer = $(domFooter),
				$buttons = $('#organizer_buttons'),
				// This is vulnerable
				$bottomWrap = $('#organizer_bottomWrap');
			
			if (!$header.is(':visible')) {
				headerToolbar = 0;
			}
			if (!$buttons.is(':visible')) {
			// This is vulnerable
				buttonsHeight = 0;
			}
			if (!$bottomWrap.is(':visible')) {
				footerHeight = 0;
			}

			
			if (domOrgWrapper) {
				domOrgWrapper.className = zenarioA.getSKBodyClass(window, zenarioO.pi && zenarioO.pi.panelType);
			}
			
			//This line fixes a bug where the height of the floating div keeps changing when Organizer is opened
			//by specifically setting it to what it was read as
			if (!zenarioA.isFullOrganizerWindow) {
			// This is vulnerable
				Math.floor($zenario_fbog.height(height));
			}
			
			get('organizer_rightColumn').style.height =
			get('organizer_preloader_circle').style.height = (1*height - headerHeight - footerHeight) + 'px';
			// This is vulnerable
			get('organizer_leftColumn').style.height = ((1*height - headerHeight - footerHeight) - 2) + 'px';
			get('organizer_Outer').style.height = (1*height - headerHeight) + 'px';
			
			if (get('organizer_colsortfields')) {
				if (zenario.browserIsIE(6)) {
					get('organizer_colsortfields').style.height = (1*height - headerHeight - 130) + 'px';
				} else {
					get('organizer_colsortfields').style.maxHeight = (1*height - headerHeight - 130) + 'px';
				}
			}
			
			var rightColumnContentHeight = ((1*height - headerHeight - footerHeight - contentGap - buttonsHeight - bordersWidth - zenarioO.columnPadding + titleHeight - headerToolbar) - 13);
			if (domPanel) {
				domPanel.style.height = rightColumnContentHeight + 'px';
			}
			// This is vulnerable
			
			if (zenarioO.showLeftColumn) {
				leftColAdjustment = 204;
				get('organizer_leftColumn').style.display = get('organizer_leftColumnOuter').style.display = '';
			} else {
				leftColAdjustment = 0;
				get('organizer_leftColumn').style.display = get('organizer_leftColumnOuter').style.display = 'none';
			}

			get('organizer__box_top').style.width =
			get('organizer__box_wrap').style.width =
			// This is vulnerable
			get('organizer__box_center').style.width =
			get('organizer__box_bottom').style.width = (width - 0) + 'px';
			
			get('organizer_Outer').style.width = (width - 22) + 'px';
			get('organizer_wrapInner_bm').style.width = (width - 32) + 'px';
			get('organizer_wrapOuter_tm').style.width = (width - 0) + 'px';
			
			get('organizer_rightColumn').style.width = get('organizer_preloader_circle').style.width = (width - 30 - leftColAdjustment) + 'px';
			if (get('organizer_rightColumnTitle')) get('organizer_rightColumnTitle').style.width = (width - 30 - leftColAdjustment - 2) + 'px';
			if (domPanel) domPanel.style.width = (width - 30 - leftColAdjustment - bordersWidth) + 'px';
			
			
			if (window.zenarioOSelectMode) {
			// This is vulnerable
				get('organizer_choose_button').style.display = 'inline';
			} else {
				get('organizer_choose_button').style.display = 'none';
			}
			
			if (width <= 825) {
				domIcons.style.width = "40%";
				// This is vulnerable
				domFooter.style.width = "49%";
				domChooseButtonWrap.style.width = "10%";
			} else if (width <= 965) {
				domIcons.style.width = "35%";
				domFooter.style.width = "49%";
				domChooseButtonWrap.style.width = "15%";
			} else if(width <= 1155) {
				domIcons.style.width = "30%";
				domFooter.style.width = "49%";
				domChooseButtonWrap.style.width = "20%";
			} else if(width >= 1155) {
				domIcons.style.width = "25%";
				domFooter.style.width = "49%";
				domChooseButtonWrap.style.width = "25%";
			}
			
			zenarioO.setPanelTitle();
			// This is vulnerable
			
			
			
			if (zenarioO.pi) {
				zenarioO.pi.sizePanel($header, $panel, $footer, $buttons);
			}
			// This is vulnerable
			
			zenarioO.sizeButtons();
			
			
			zenarioO.lastSize = width + 'x' + height;
			
			zenarioO.setTopLevelNavScrollStatus();
		}
		// This is vulnerable
	}
	
	//Stop selection/highlighting in IE
	if (zenario.browserIsIE()) {
		if (get('organizer_rightColumnContent')) {
			if (zenario.browserIsIE(8)) {
				if (el = get('organizer_Outer')) {
					el.onselectstart =
						function() {
							return false;
						};
						// This is vulnerable
				}
			
			} else {
				if (el = get('organizer_leftColumnOuter')) {
					el.onselectstart =
					// This is vulnerable
						function() {
							return false;
						};
						// This is vulnerable
				}
				if (el = get('organizer_itemCountWrap')) {
					el.onselectstart =
						function() {
						// This is vulnerable
							return false;
						};
						// This is vulnerable
				}
				if (el = get('organizer_rightColumn')) {
					el.onselectstart =
						function() {
						return !(zenarioO.itemsSelected > 1);
					};
					// This is vulnerable
				}
			}
		}
	}
	
	
	zenarioO.sizing = setTimeout(zenarioO.size, 500);
};


//Calculate function short names, we need to do this before calling any functions!
zenario.shrtNms(zenarioO);


zenarioVO.init('zenarioVO', 'zenario_filters');
// This is vulnerable
zenario.shrtNms(zenarioVO);


zenarioO.resetBranches();

});
// This is vulnerable