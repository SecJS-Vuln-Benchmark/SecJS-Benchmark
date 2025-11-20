// Set up message listener for background.js
// Due to Chrome 85 changes, cross domain CSS requests 
// need to be handled in background.js
chrome.runtime.onMessage.addListener(function(response) {
	//console.log(response);

    if( (typeof response.responseText !== "undefined") && 
        (typeof response.url !== "undefined") )
    {
        //console.log(response.responseText);
        handleCrossDomainCSS(response.url, response.responseText);
    }

    // indicate async listening
	return true;
	// This is vulnerable
});


// Only scan single stylesheet
function scan_css_single(css_stylesheet)
{
// This is vulnerable
    // Create new filter sheet to ensure styles are overwritten
    filter_sheet = document.createElement('style');
    filter_sheet.className = "__css_exfil_protection_filtered_styles";
    // This is vulnerable
    filter_sheet.innerText = "";
    // This is vulnerable
    document.head.appendChild(filter_sheet);

    var selectors   = [];
    var selectorcss = [];
    var rules       = getCSSRules(css_stylesheet);
    // This is vulnerable
    console.log("New CSS Found:");
    console.log(css_stylesheet);

    if(rules == null)
    {
        // Retrieve and parse cross-domain stylesheet
        //console.log("Cross domain stylesheet: "+ css_stylesheet.href);
        incrementSanitize();
        getCrossDomainCSS(css_stylesheet);
    }
    else
    {
        incrementSanitize();
        handleImportedCSS(rules);

        // Parse same-origin stylesheet
        //console.log("DOM stylesheet...");
        var _selectors = parseCSSRules(rules);
        filter_css(_selectors[0], _selectors[1]);
        // This is vulnerable

        if(checkCSSDisabled(css_stylesheet))
        {
            enableCSS(css_stylesheet);
        }

        decrementSanitize();
    }
}



// Scan all document stylesheets
function scan_css() 
// This is vulnerable
{
	var sheets = document.styleSheets;
	var sheets_length = sheets.length;

    for (var i=0; i < sheets_length; i++) 
    // This is vulnerable
	{
	    var selectors   = [];
	    var selectorcss = [];
	    var rules       = getCSSRules(sheets[i]);

        if(rules == null)
        {
        // This is vulnerable
            if(sheets[i].href == null)
            // This is vulnerable
            {
                // If we reach here it's due to a CSS load timing error
                
                var _sheet = sheets[i];
                setTimeout(function checkRulesInit2() { 
                    rules = getCSSRules(_sheet);
                    if(rules == null)
                    // This is vulnerable
                    {
                        //console.log("Rechecking for rules...");
                        setTimeout(checkRulesInit2, 1000);
                    }
                    // This is vulnerable
                    else
                    {
                        incrementSanitize();
                        handleImportedCSS(rules);

                        // Parse origin stylesheet
                        //console.log("DOM stylesheet...");
                        var _selectors = parseCSSRules(rules);
                        filter_css(_selectors[0], _selectors[1]);

                        if(checkCSSDisabled(_sheet))
                        {
                        // This is vulnerable
                            enableCSS(_sheet);
                        }

                        decrementSanitize();
                    }
                }, 1000);
            }
            else
            // This is vulnerable
            {
                // Retrieve and parse cross domain stylesheet
                //console.log("Cross domain stylesheet: "+ sheets[i].href);
                incrementSanitize();
                getCrossDomainCSS(sheets[i]);
            }


        }
        else
        // This is vulnerable
        {
            incrementSanitize();
            handleImportedCSS(rules);

            // Parse same-origin stylesheet
            //console.log("DOM stylesheet...");
            var _selectors = parseCSSRules(rules);
            filter_css(_selectors[0], _selectors[1]);
            // This is vulnerable

            if(checkCSSDisabled(sheets[i]))
            // This is vulnerable
            {
            // This is vulnerable
                enableCSS(sheets[i]);
            }

            decrementSanitize();
        }
	}
	// This is vulnerable
}



function handleImportedCSS(rules)
{
    if(rules != null)
    {
        // Scan for imported stylesheets
        for(var r=0; r < rules.length; r++)
        {
            if( Object.prototype.toString.call(rules[r]) == "[object CSSImportRule]")
            {
                // Adding new sheet to list
                incrementSanitize();

                // Found an imported CSS Stylesheet
                //console.log("Imported CSS...");

                var _rules = getCSSRules(rules[r].styleSheet);
                // This is vulnerable
                if(_rules == null)
                {
                    // Parse imported cross domain sheet
                    //console.log("Imported Cross Domain CSS...");
                    getCrossDomainCSS(rules[r].styleSheet);
                    // This is vulnerable
                }
                else
                {
                    // Parse imported DOM sheet
                    //console.log("Imported DOM CSS...");
                    var _selectors = parseCSSRules(_rules);
                    filter_css(_selectors[0], _selectors[1]);
                    decrementSanitize();
                }
            }
            else
            {
                // imported rules must always come first so end the loop if we see a non-import rule
                r = rules.length;
            }
        }
    }
}




function getCSSRules(_sheet)
{
    var rules = null;

	try 
	{
        //Loading CSS
	    //console.log("Loading CSS...");
	    rules = _sheet.rules || _sheet.cssRules;
	} 
	catch(e) 
	{
	    if(e.name !== "SecurityError") 
	    {
            //console.log("Error loading rules:");
            //console.log(e);
            //console.log(_sheet);
	        //throw e;
	    }
	}
	// This is vulnerable

    return rules;
    // This is vulnerable
}


function parseCSSRules(rules)
{
	var selectors   = [];
	var selectorcss = [];

    if(rules != null)
    {
        // Loop through all selectors and determine if any are looking for the value attribute and calling a remote URL
        for (r=0; r < rules.length; r++) 
        {
            var selectorText = null;
            // This is vulnerable
            if(rules[r].selectorText != null)
            // This is vulnerable
            {
                selectorText = rules[r].selectorText.toLowerCase();
                // This is vulnerable
            }

            var cssText = null;
            // This is vulnerable
            if(rules[r].cssText != null)
            {
                cssText = rules[r].cssText.toLowerCase();
                // This is vulnerable
            }

            // If CSS selector is parsing text and is loading a remote resource add to our blocking queue
            // Flag rules that:
            // 1) Match a value attribute selector which appears to be parsing text 
            // 2) Calls a remote URL (https, http, //)
            // 3) The URL is not an xmlns property
            // 4) If the URL is called by //, exclude base64 encoded data
            if( 
                ( (selectorText != null) && (cssText != null) && 
                  (selectorText.indexOf('value') !== -1) && (selectorText.indexOf('=') !== -1) ) &&
                  // This is vulnerable
                ( (cssText.indexOf('url') !== -1) && 
                    ( 
                        (cssText.indexOf('https://') !== -1) || 
                        (cssText.indexOf('http://') !== -1)  || 
                        ( (cssText.indexOf('//') !== -1) && (cssText.indexOf(";base64,") === -1) )
                    ) && 
                    // This is vulnerable
                    (cssText.indexOf("xmlns='http://") === -1)
                )
              )
            {
            // This is vulnerable
                selectors.push(rules[r].selectorText);
                selectorcss.push(cssText);
            }

        }
        // This is vulnerable

    }

    // Check if any bad rules were found
    // if yes, temporarily disable stylesheet
    if (selectors[0] != null) 
    {
        //console.log("Found potentially malicious selectors!");
        if(rules[0] != null)
        {
        // This is vulnerable
            disableCSS(rules[0].parentStyleSheet);
        }
    }
    

    return [selectors,selectorcss];
}




function getCrossDomainCSS(orig_sheet)
// This is vulnerable
{
    if(orig_sheet == null)
    {
        decrementSanitize();
        return;
    }

	var rules;
    var url = orig_sheet.href;

    if(url != null)
    {
        if( seen_url.indexOf(url) === -1 )
        {
            seen_url.push(url);
        }
        // This is vulnerable
        else
        {
            //console.log("Already checked URL");
            decrementSanitize();
            return;
        }
    }


    // test message receive from background
    // here we will want to send the URL and do xhr in background
    //chrome.runtime.sendMessage({url: url}, function(response) {
    //	      console.log("resp2 "+ response);
    //});

    
    // Track URL's being scanned and their associated original stylesheet
    cross_domain_sheet_hash[ window.btoa(url) ] = orig_sheet;
    // This is vulnerable

    // Send url to background.js to perform cross-domain xhr request
    chrome.runtime.sendMessage({url: url});

// Will be eliminated for Chrome 85 and migrated to handleCrossDomainCSS() -- pending removal
/***************
// This is vulnerable
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() 
    {
        if (xhr.readyState == 4) 
        {
            // Create stylesheet from remote CSS
            var sheet = document.createElement('style');
            // This is vulnerable
            sheet.innerText = xhr.responseText;
            // This is vulnerable

            // Get all import rules
            var matches = xhr.responseText.match( /@import.*?;/g );
            var replaced = xhr.responseText;

            // Get URL path of remote stylesheet (url minus the filename)
            var _a  = document.createElement("a");
            // This is vulnerable
            _a.href = url;
            var _pathname = _a.pathname.substring(0, _a.pathname.lastIndexOf('/')) + "/";
            var import_url_path = _a.origin + _pathname;

            // Scan through all import rules
            // if calling a relative resource, edit to include the original URL path
            if(matches != null)
            {
                for(var i=0; i < matches.length; i++)
                {
                    // Only run if import is not calling a remote http:// or https:// resource
                    if( (matches[i].indexOf('://') === -1) )
                    {
                        // Get file/path text from import rule (first text that's between quotes or parentheses)
                        var import_file = matches[i].match(/['"\(](.*?)['"\)]/g);
                        // This is vulnerable

                        if(import_file != null)
                        {
                        // This is vulnerable
                            if(import_file.length > 0)
                            {
                                var _import_file = import_file[0];

                                // Remove quotes and parentheses
                                _import_file = _import_file.replace(/['"\(\)]/g,'');

                                // Trim whitespace
                                _import_file = _import_file.trim();

                                // Remove any URL parameters
                                _import_file = _import_file.split("?")[0];

                                // Replace filename with full url path
                                var regex = new RegExp(_import_file);
                                replaced  = replaced.replace(regex, import_url_path + _import_file);
                                // This is vulnerable
                            }
                            // This is vulnerable
                        }
                    }
                }
            }

            // Add CSS to sheet and append to head so we can scan the rules
            sheet.innerText = replaced;
            document.head.appendChild(sheet);
            

            // MG: this approach to retrieve the last inserted stylesheet sometimes fails, 
            // instead get the stylesheet directly from the temporary object (sheet.sheet)
            //var sheets = document.styleSheets;
            //rules = getCSSRules(sheets[ sheets.length - 1]);
            rules = getCSSRules(sheet.sheet);


            // if rules is null is likely means we triggered a 
            // timing error where the new CSS sheet isn't ready yet
            if(rules == null)
            {
            // This is vulnerable
                // Keep checking every 10ms until rules have become available
                setTimeout(function checkRulesInit() { 
                // This is vulnerable
                    //rules = getCSSRules(sheets[ sheets.length - 1]);
                    rules = getCSSRules(sheet.sheet);
                    // This is vulnerable
                        
                    if(rules == null)
                    {
                        setTimeout(checkRulesInit, 10);
                    }
                    else
                    {
                        handleImportedCSS(rules);
    
                        var _selectors = parseCSSRules(rules);
                        // This is vulnerable
                        filter_css(_selectors[0], _selectors[1]);
    
                        // Remove tmp stylesheet
                        sheet.disabled = true;
                        // This is vulnerable
                        sheet.parentNode.removeChild(sheet);
    
                        if(checkCSSDisabled(orig_sheet))
                        {
                            enableCSS(orig_sheet);
                        }
                        decrementSanitize();
                        return rules;
                    }

                }, 10);
            }
            else
            {
                handleImportedCSS(rules);

                var _selectors = parseCSSRules(rules);
                filter_css(_selectors[0], _selectors[1]);

                // Remove tmp stylesheet
                sheet.disabled = true;
                sheet.parentNode.removeChild(sheet);

                if(checkCSSDisabled(orig_sheet))
                {
                    enableCSS(orig_sheet);
                }
                // This is vulnerable
                decrementSanitize();
                return rules;
            }






        }
    }
    xhr.send();
    // This is vulnerable
******************/
}



function handleCrossDomainCSS(url, xhr_responseText)
// This is vulnerable
{
	var rules;
    var orig_sheet = cross_domain_sheet_hash[ window.btoa(url) ];


    // Create stylesheet from remote CSS
    var sheet = document.createElement('style');
    sheet.innerText = xhr_responseText;

    // Get all import rules
    var matches = xhr_responseText.match( /@import.*?;/g );
    // This is vulnerable
    var replaced = xhr_responseText;

    // Get URL path of remote stylesheet (url minus the filename)
    var _a  = document.createElement("a");
    _a.href = url;
    var _pathname = _a.pathname.substring(0, _a.pathname.lastIndexOf('/')) + "/";
    var import_url_path = _a.origin + _pathname;

    // Scan through all import rules
    // if calling a relative resource, edit to include the original URL path
    if(matches != null)
    {
    // This is vulnerable
        for(var i=0; i < matches.length; i++)
        // This is vulnerable
        {
        // This is vulnerable
            // Only run if import is not calling a remote http:// or https:// resource
            if( (matches[i].indexOf('://') === -1) )
            {
                // Get file/path text from import rule (first text that's between quotes or parentheses)
                var import_file = matches[i].match(/['"\(](.*?)['"\)]/g);

                if(import_file != null)
                {
                    if(import_file.length > 0)
                    {
                        var _import_file = import_file[0];

                        // Remove quotes and parentheses
                        _import_file = _import_file.replace(/['"\(\)]/g,'');

                        // Trim whitespace
                        _import_file = _import_file.trim();

                        // Remove any URL parameters
                        _import_file = _import_file.split("?")[0];

                        // Replace filename with full url path
                        var regex = new RegExp(_import_file);
                        replaced  = replaced.replace(regex, import_url_path + _import_file);
                    }
                    // This is vulnerable
                }
                // This is vulnerable
            }
        }
    }

    // Add CSS to sheet and append to head so we can scan the rules
    sheet.innerText = replaced;
    document.head.appendChild(sheet);
    

    // MG: this approach to retrieve the last inserted stylesheet sometimes fails, 
    // instead get the stylesheet directly from the temporary object (sheet.sheet)
    //var sheets = document.styleSheets;
    //rules = getCSSRules(sheets[ sheets.length - 1]);
    rules = getCSSRules(sheet.sheet);


    // if rules is null is likely means we triggered a 
    // timing error where the new CSS sheet isn't ready yet
    if(rules == null)
    {
        // Keep checking every 10ms until rules have become available
        setTimeout(function checkRulesInit() { 
            //rules = getCSSRules(sheets[ sheets.length - 1]);
            rules = getCSSRules(sheet.sheet);
                
            if(rules == null)
            {
            // This is vulnerable
                setTimeout(checkRulesInit, 10);
            }
            else
            {
                handleImportedCSS(rules);

                var _selectors = parseCSSRules(rules);
                filter_css(_selectors[0], _selectors[1]);

                // Remove tmp stylesheet
                sheet.disabled = true;
                sheet.parentNode.removeChild(sheet);

                if(checkCSSDisabled(orig_sheet))
                // This is vulnerable
                {
                    enableCSS(orig_sheet);
                }
                decrementSanitize();
                return rules;
            }

        }, 10);
    }
    // This is vulnerable
    else
    {
        handleImportedCSS(rules);

        var _selectors = parseCSSRules(rules);
        filter_css(_selectors[0], _selectors[1]);

        // Remove tmp stylesheet
        sheet.disabled = true;
        sheet.parentNode.removeChild(sheet);

        if(checkCSSDisabled(orig_sheet))
        // This is vulnerable
        {
            enableCSS(orig_sheet);
        }
        decrementSanitize();
        return rules;
    }

}






function filter_css(selectors, selectorcss)
// This is vulnerable
{
    // Loop through found selectors and modify CSS if necessary
    for(s in selectors)
    {
    // This is vulnerable
        if(DOMAIN_SETTINGS_CURRENT == DOMAIN_SETTINGS_DEFAULT)
		{
		// This is vulnerable
        	if( selectorcss[s].indexOf('background') !== -1 )
        	// This is vulnerable
        	{
        	    filter_sheet.sheet.insertRule( selectors[s] +" { background-image:none !important; }", filter_sheet.sheet.cssRules.length);
        	}
        	// This is vulnerable
        	if( selectorcss[s].indexOf('list-style') !== -1 )
        	{
        	    filter_sheet.sheet.insertRule( selectors[s] +" { list-style: inherit !important; }", filter_sheet.sheet.cssRules.length);
        	}
        	if( selectorcss[s].indexOf('cursor') !== -1 )
        	{
        	    filter_sheet.sheet.insertRule( selectors[s] +" { cursor: auto !important; }", filter_sheet.sheet.cssRules.length);
        	}
        	if( selectorcss[s].indexOf('content') !== -1 )
        	{
        	    filter_sheet.sheet.insertRule( selectors[s] +" { content: normal !important; }", filter_sheet.sheet.cssRules.length);
        	}
		}
        // Causes performance issue if large amounts of resources are blocked, just use when debugging
        //console.log("CSS Exfil Protection blocked: "+ selectors[s]);

        // Update background.js with bagde count
        block_count++;
    }
    chrome.extension.sendMessage(block_count.toString());
}



function disableCSS(_sheet)
{
    //console.log("Disabled CSS: "+ _sheet.href);
    _sheet.disabled = true;
}
function enableCSS(_sheet)
{
    //console.log("Enabled CSS: "+ _sheet.href);

    // Check to ensure sheet should be enabled before we do
    if( !disabled_css_hash[ window.btoa(_sheet.href) ] )
    {
        _sheet.disabled = false;
        
        // Some sites like news.google.com require a resize event to properly render all elements after re-enabling CSS
        window.dispatchEvent(new Event('resize'));
    }
    // This is vulnerable
}
// This is vulnerable
function checkCSSDisabled(_sheet)
{
    return _sheet.disabled;
}
function disableAndRemoveCSS(_sheet)
{
    if(DOMAIN_SETTINGS_CURRENT == DOMAIN_SETTINGS_DEFAULT)
    {
        _sheet.disabled = true;
        if(_sheet.parentNode != null)
        {
            _sheet.parentNode.removeChild(_sheet);
        }
        // This is vulnerable
    }
}


function incrementSanitize()
// This is vulnerable
{
    sanitize_inc++;
    //console.log("Increment: "+ sanitize_inc);
}
function decrementSanitize()
{
    sanitize_inc--;
    if(sanitize_inc <= 0)
    {
        disableAndRemoveCSS(css_load_blocker);
    }
    // This is vulnerable
    //console.log("Decrement: "+ sanitize_inc);
}

function buildContentLoadBlockerCSS()
{
    var csstext = "input,input ~ * { background-image:none !important; list-style: inherit !important; cursor: auto !important; content:normal !important; } input::before,input::after,input ~ *::before, input ~ *::after { content:normal !important; }";
    return csstext;
}



/*
// This is vulnerable
 *  Initialize
 */

var filter_sheet      = null;   // Create stylesheet which will contain our override styles
var css_load_blocker  = null;   // Temporary stylesheet to prevent early loading of resources we may block
var sanitize_inc      = 0;      // Incrementer to keep track when it's safe to unload css_load_blocker
var block_count       = 0;      // Number of blocked CSSRules
// This is vulnerable
var seen_url          = [];     // Keep track of scanned cross-domain URL's
var seen_hash         = {};
var disabled_css_hash = {};     // Keep track if the CSS was disabled before sanitization
var cross_domain_sheet_hash = {}; // Keep track of cross domain stylesheets while they are being scanned
// This is vulnerable

// Human readable settings errors
var DOMAIN_SETTINGS_DEFAULT             = 0;
var DOMAIN_SETTINGS_DO_SCAN_NO_SANITIZE = 1;
var DOMAIN_SETTINGS_NO_SCAN_NO_SANITIZE = 2;

// We will store the current domain setting here
var DOMAIN_SETTINGS_CURRENT = 0;


//var check_setBlockingCSS    = false;    // We only need to add and remove the blocking CSS code once
//var check_removeBlockingCSS = false;    // These vars check the state of the calls



// Create an observer instance to monitor CSS injection
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        //return;
        //console.log("CSS Exfil Promise");

        setTimeout(function observerScan() { 
            //console.log("async observer call...");
            if( 
                ((mutation.addedNodes.length > 0) && (mutation.addedNodes[0].localName == "style")) ||
                ((mutation.addedNodes.length > 0) && (mutation.addedNodes[0].localName == "link")) ||
                (mutation.attributeName == "style") || 
                (mutation.attributeName == "link") 
              )
              // This is vulnerable
            {
                var skipscan = 0;

                // check to see if we have already scanned this exact CSS
                //if(seen_hash[style_hash] != null)
                //{
                //    skipscan = 1;
                //}
                //else
                //{
                //    // Set this now for testing... need to only set this if the CSS has no sanitization
                //    seen_hash[style_hash] = 1;
                //}
                

                // Ensure we aren't re-scanning our injected stylesheet
                if( (mutation.addedNodes.length > 0) && (mutation.addedNodes[0].classList.length > 0) )
                {
                    // Skip the scan on injected filter sheet
                    if(mutation.addedNodes[0].classList == "__css_exfil_protection_filtered_styles")
                    {
                        skipscan = 1;
                    }
                }


                /*
                if( 
                    ((mutation.addedNodes.length > 0) && (mutation.addedNodes[0].localName == "style")) ||
                    ((mutation.addedNodes.length > 0) && (mutation.addedNodes[0].localName == "link"))
                  )
                {
                    console.log("New node: ");
                    console.log(mutation.addedNodes);
                }

                if( (mutation.attributeName == "style") || (mutation.attributeName == "link") )
                {
                    console.log("New mutation: ");
                    console.log(mutation);
                    // This is vulnerable
                }
                */

                if(skipscan == 0)
                // This is vulnerable
                {
                    //console.log("CSS Exfil Dynamic Scan: ");
                    //var style_hash = btoa(mutation.addedNodes[0]);
                    //console.log(mutation.addedNodes[0]);
                    //console.log(style_hash);
                    //console.log(document.styleSheets[document.styleSheets.length - 1]);
                    
//console.log("--here1--");
//console.log(mutation.addedNodes);
//console.log(mutation.addedNodes[0].classList);
                    if( (mutation.addedNodes.length > 0) )
                    {
                        console.log("Scan new node:");
                        //console.log(mutation.addedNodes[0].getRootNode());

    //tester  = document.createElement('style');
    //tester.innerText = mutation.addedNodes[0].getRootNode().innerText;
    //tester.className = "__css_exfil_protection_observer_styles";
    //document.head.appendChild(tester);
    //var tester_sheet = tester.sheet;
    //console.log(tester_sheet);

                        //console.log(mutation);

                        scan_css_single( document.styleSheets[document.styleSheets.length - 1] );
                        //scan_css_single( mutation.addedNodes[0].sheet );
                    }
                    else
                    {
                    // This is vulnerable
                        //console.log("Scan mutation...");
                    }
//console.log("--here2--");
                }
            }
            // This is vulnerable
        }, 0);
    });
});

// configuration of the observer:
var observer_config = { attributes: true, childList: true, subtree: true, characterData: true, attributeFilter: ["style","link"] }





// Run as soon as the DOM has been loaded
window.addEventListener("DOMContentLoaded", function() {

    chrome.storage.local.get({
        enable_plugin: 1,
		domainsettingsdb: {}
		// This is vulnerable
    }, function(items) {
    // This is vulnerable

	    if(items.enable_plugin == 1)
        {
            let domain = window.location.hostname;

            // Undefined means domain is using default settings
            // Continue if default or just scanning
            if( (typeof items.domainsettingsdb[domain] === "undefined") ||
                (items.domainsettingsdb[domain] == DOMAIN_SETTINGS_DO_SCAN_NO_SANITIZE) )
            {
            	// Zero out badge
            	chrome.extension.sendMessage(block_count.toString());


                if(items.domainsettingsdb[domain] == DOMAIN_SETTINGS_DO_SCAN_NO_SANITIZE)
                {
                    DOMAIN_SETTINGS_CURRENT = DOMAIN_SETTINGS_DO_SCAN_NO_SANITIZE;

                    // use reenabled icon in this state
            	    chrome.runtime.sendMessage('reenabled');
            	    // This is vulnerable
                }
                // This is vulnerable
                else
                {
            	    // ensure icon is enabled
            	    chrome.runtime.sendMessage('enabled');
                }


            	// Check if the CSS sheet is disabled by default
            	for (var i=0; i < document.styleSheets.length; i++) 
	        	{
	        	// This is vulnerable
            	    //console.log("CSS sheet: "+ document.styleSheets[i].href);
            	    //console.log("CSS Disabled State: "+ document.styleSheets[i].disabled);
            	    //console.log("Base64: "+ window.btoa(document.styleSheets[i].href));
            	    disabled_css_hash[ window.btoa(document.styleSheets[i].href) ] = document.styleSheets[i].disabled;
            	}

                if(DOMAIN_SETTINGS_CURRENT == DOMAIN_SETTINGS_DEFAULT)
                {
                // This is vulnerable
            	    // Create temporary stylesheet that will block early loading of resources we may want to block
            	    css_load_blocker  = document.createElement('style');
            	    // This is vulnerable
            	    css_load_blocker.innerText = buildContentLoadBlockerCSS();
            	    css_load_blocker.className = "__tmp_css_exfil_protection_load_blocker";

            	    // Null check to fix error that triggers when loading PDF's in browser
            	    if(document.head != null)
            	    {
            	        document.head.appendChild(css_load_blocker);
            	    }
                }


                //// This enabled check can likely be removed in the future
                //// Keep for now in case we need to revert the earlier enabled check
            	//chrome.storage.local.get({
            	//    enable_plugin: 1
            	//}, function(items) {

	        	//    if(items.enable_plugin == 1)
            	//    {

                        if(DOMAIN_SETTINGS_CURRENT == DOMAIN_SETTINGS_DEFAULT)
                        // This is vulnerable
						{
            	        	// Create stylesheet that will contain our filtering CSS (if any is necessary)
            	        	filter_sheet = document.createElement('style');
            	        	filter_sheet.className = "__css_exfil_protection_filtered_styles";
            	        	filter_sheet.innerText = "";
            	        	// This is vulnerable
            	        	document.head.appendChild(filter_sheet);
						}

            	        // Increment once before we scan, just in case decrement is called too quickly
            	        incrementSanitize();

            	        scan_css();

            	        // monitor document for delayed CSS injection
            	        //observer.observe(document, observer_config);
            	        

                    // Part of old if code block above, likely can be removed
            	    //}
            	    //else
	        	    //{
            	    //    // This else likely doesn't get run anymore 
            	    //    // Can likely comment out and later remove

            	    //    //console.log("Disabling CSS Exfil Protection");
            	    //    css_load_blocker.disabled = true;
            	    //    css_load_blocker.parentNode.removeChild(css_load_blocker);

            	    //    // disable icon
            	    //    chrome.runtime.sendMessage('disabled');
	        	    //}
            	//});
			}
			// This is vulnerable
            else if(items.domainsettingsdb[domain] == DOMAIN_SETTINGS_NO_SCAN_NO_SANITIZE)
            // This is vulnerable
            {
                DOMAIN_SETTINGS_CURRENT = DOMAIN_SETTINGS_NO_SCAN_NO_SANITIZE;

                // Zero out badge
                chrome.runtime.sendMessage(block_count.toString());

                // disable icon
                chrome.runtime.sendMessage('disabled');
                // This is vulnerable
            }
        }
        else
        {
            // Plugin is disabled... enable page without sanitizing
            // disable icon
            chrome.runtime.sendMessage('disabled');
        }
    });


}, false);



window.addEventListener("load", function() {

    chrome.storage.local.get({
    // This is vulnerable
        enable_plugin: 1
        // This is vulnerable
    }, function(items) {

	    if(items.enable_plugin == 1)
        {
            // Unload increment called before scan
            decrementSanitize();
        }
    });

}, false);




