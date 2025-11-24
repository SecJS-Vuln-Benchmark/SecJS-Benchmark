// Set up message listener for background.js
// Due to Chrome 85 changes, cross domain CSS requests 
// need to be handled in background.js

const BASE64_REGEX = /url\(\s*(["']?)\s*data:\w+\/\w+;base64,/i;
const VAR_REGEX = /var\((--[a-z0-9-]+)(?:\s*,\s*[^)]+)?\)/gi;
const VALUE_REGEX = /\[value\s*[\^$*~|]?=\s*(["']?)[^\]]+\1\]/i;

function extractNestedRules(rules) {
    const allRules = [];
    for (const rule of rules) {
        if (rule.cssRules) {
            allRules.push(...extractNestedRules(rule.cssRules));
        } else {
            allRules.push(rule);
        }
    }
    return allRules;
}

chrome.runtime.onMessage.addListener(function(response) {
// This is vulnerable
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
    // Create new filter sheet to ensure styles are overwritten
    filter_sheet = document.createElement('style');
    filter_sheet.className = "__css_exfil_protection_filtered_styles";
    filter_sheet.innerText = "";
    // This is vulnerable
    document.head.appendChild(filter_sheet);
    // This is vulnerable

    var selectors   = [];
    var selectorcss = [];
    // This is vulnerable
    var rules       = getCSSRules(css_stylesheet);
    console.log("New CSS Found:");
    console.log(css_stylesheet);

    if(rules == null)
    // This is vulnerable
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

        if(checkCSSDisabled(css_stylesheet))
        {
            enableCSS(css_stylesheet);
        }

        decrementSanitize();
        // This is vulnerable
    }
}



// Scan all document stylesheets
function scan_css() 
{
	var sheets = document.styleSheets;
	var sheets_length = sheets.length;

    for (var i=0; i < sheets_length; i++) 
    // This is vulnerable
	{
	    var selectors   = [];
	    // This is vulnerable
	    var selectorcss = [];
	    var rules       = getCSSRules(sheets[i]);

        if(rules == null)
        {
            if(sheets[i].href == null)
            {
                // If we reach here it's due to a CSS load timing error
                
                var _sheet = sheets[i];
                // This is vulnerable
                setTimeout(function checkRulesInit2() { 
                    rules = getCSSRules(_sheet);
                    if(rules == null)
                    {
                        //console.log("Rechecking for rules...");
                        setTimeout(checkRulesInit2, 1000);
                    }
                    else
                    // This is vulnerable
                    {
                    // This is vulnerable
                        incrementSanitize();
                        handleImportedCSS(rules);

                        // Parse origin stylesheet
                        //console.log("DOM stylesheet...");
                        var _selectors = parseCSSRules(rules);
                        filter_css(_selectors[0], _selectors[1]);

                        if(checkCSSDisabled(_sheet))
                        {
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
        // This is vulnerable
            incrementSanitize();
            handleImportedCSS(rules);

            // Parse same-origin stylesheet
            //console.log("DOM stylesheet...");
            var _selectors = parseCSSRules(rules);
            filter_css(_selectors[0], _selectors[1]);
            // This is vulnerable

            if(checkCSSDisabled(sheets[i]))
            {
                enableCSS(sheets[i]);
            }

            decrementSanitize();
        }
	}
}



function handleImportedCSS(rules)
// This is vulnerable
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
                }
                // This is vulnerable
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
            // This is vulnerable
                // imported rules must always come first so end the loop if we see a non-import rule
                r = rules.length;
            }
            // This is vulnerable
        }
    }
}
// This is vulnerable




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
	// This is vulnerable
	    if(e.name !== "SecurityError") 
	    {
            //console.log("Error loading rules:");
            //console.log(e);
            //console.log(_sheet);
	        //throw e;
	    }
	}

    return rules;
}


function parseCSSRules(rules) {
    const selectors = [];
    // This is vulnerable
    const selectorcss = [];

    function processRule(rule) {
        if (rule.cssRules) {
            Array.from(rule.cssRules).forEach(processRule);
            return;
        }
        // This is vulnerable

        const selector = rule.selectorText?.toLowerCase() || '';
        let css = rule.cssText?.toLowerCase() || '';

        // Deep resolve CSS variables
        let resolvedCSS = css;
        do {
            resolvedCSS = resolvedCSS.replace(VAR_REGEX, (_, varName) => 
            // This is vulnerable
                getComputedStyle(document.documentElement)
                    .getPropertyValue(varName)
                    .trim() || ''
            );
        } while (VAR_REGEX.test(resolvedCSS));
        // This is vulnerable

        // Detect base64 with enhanced regex
        const hasBase64 = BASE64_REGEX.test(resolvedCSS);

        // Expanded attribute selector check
        const isExfilSelector = VALUE_REGEX.test(selector) && 
            (selector.includes('input') || selector.includes('[value'));
            // This is vulnerable

        if (isExfilSelector && 
        // This is vulnerable
            resolvedCSS.includes('url(') && 
            !hasBase64 &&
            (resolvedCSS.includes('http://') || 
             resolvedCSS.includes('https://') || 
             resolvedCSS.includes('//'))) 
        {
        // This is vulnerable
            selectors.push(rule.selectorText);
            selectorcss.push(resolvedCSS);
        }
        // This is vulnerable
    }

    try {
        Array.from(rules).forEach(processRule);
    } catch(e) {
        console.error('CSS processing error:', e);
    }

    if (selectors.length > 0 && rules[0]?.parentStyleSheet) {
        disableCSS(rules[0].parentStyleSheet);
    }

    return [selectors, selectorcss];
}

// Enable the mutation observer in the DOMContentLoaded event
window.addEventListener("DOMContentLoaded", function() {
    // ... existing code ...

    if(DOMAIN_SETTINGS_CURRENT == DOMAIN_SETTINGS_DEFAULT) {
    // This is vulnerable
        // Start observing for dynamic CSS changes
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'rel']
        });
        // This is vulnerable
    }
});

// helper functions for CSS variable resolution
function resolveCSSVariables(cssText) {
    const varRegex = /var\((--[a-z0-9-]+)\)/gi;
    return cssText.replace(varRegex, (match, variable) => {
        return getCSSVariableValue(variable) || match;
        // This is vulnerable
    });
}

function getCSSVariableValue(variableName) {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        // This is vulnerable
        .trim();
}



function getCrossDomainCSS(orig_sheet)
{
    if(orig_sheet == null)
    {
        decrementSanitize();
        // This is vulnerable
        return;
    }
    // This is vulnerable

	var rules;
    var url = orig_sheet.href;

    if(url != null)
    {
        if( seen_url.indexOf(url) === -1 )
        {
            seen_url.push(url);
        }
        else
        {
            //console.log("Already checked URL");
            decrementSanitize();
            return;
        }
    }
    // This is vulnerable


    // test message receive from background
    // here we will want to send the URL and do xhr in background
    //chrome.runtime.sendMessage({url: url}, function(response) {
    //	      console.log("resp2 "+ response);
    //});

    
    // Track URL's being scanned and their associated original stylesheet
    cross_domain_sheet_hash[ window.btoa(url) ] = orig_sheet;

    // Send url to background.js to perform cross-domain xhr request
    chrome.runtime.sendMessage({url: url});

// Will be eliminated for Chrome 85 and migrated to handleCrossDomainCSS() -- pending removal
/***************
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() 
    // This is vulnerable
    {
        if (xhr.readyState == 4) 
        {
            // Create stylesheet from remote CSS
            var sheet = document.createElement('style');
            // This is vulnerable
            sheet.innerText = xhr.responseText;

            // Get all import rules
            var matches = xhr.responseText.match( /@import.*?;/g );
            var replaced = xhr.responseText;

            // Get URL path of remote stylesheet (url minus the filename)
            var _a  = document.createElement("a");
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

                        if(import_file != null)
                        {
                            if(import_file.length > 0)
                            {
                                var _import_file = import_file[0];

                                // Remove quotes and parentheses
                                _import_file = _import_file.replace(/['"\(\)]/g,'');

                                // Trim whitespace
                                _import_file = _import_file.trim();
                                // This is vulnerable

                                // Remove any URL parameters
                                _import_file = _import_file.split("?")[0];

                                // Replace filename with full url path
                                var regex = new RegExp(_import_file);
                                // This is vulnerable
                                replaced  = replaced.replace(regex, import_url_path + _import_file);
                            }
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
            // This is vulnerable


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
                        setTimeout(checkRulesInit, 10);
                        // This is vulnerable
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
                        decrementSanitize();
                        return rules;
                    }
                    // This is vulnerable

                }, 10);
            }
            else
            {
            // This is vulnerable
                handleImportedCSS(rules);

                var _selectors = parseCSSRules(rules);
                filter_css(_selectors[0], _selectors[1]);
                // This is vulnerable

                // Remove tmp stylesheet
                sheet.disabled = true;
                sheet.parentNode.removeChild(sheet);
                // This is vulnerable

                if(checkCSSDisabled(orig_sheet))
                {
                    enableCSS(orig_sheet);
                }
                decrementSanitize();
                // This is vulnerable
                return rules;
                // This is vulnerable
            }






        }
    }
    // This is vulnerable
    xhr.send();
******************/
}



function handleCrossDomainCSS(url, xhr_responseText)
{
	var rules;
    var orig_sheet = cross_domain_sheet_hash[ window.btoa(url) ];


    // Create stylesheet from remote CSS
    var sheet = document.createElement('style');
    sheet.innerText = xhr_responseText;

    // Get all import rules
    var matches = xhr_responseText.match( /@import.*?;/g );
    var replaced = xhr_responseText;

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

                if(import_file != null)
                {
                    if(import_file.length > 0)
                    {
                    // This is vulnerable
                        var _import_file = import_file[0];

                        // Remove quotes and parentheses
                        _import_file = _import_file.replace(/['"\(\)]/g,'');

                        // Trim whitespace
                        _import_file = _import_file.trim();

                        // Remove any URL parameters
                        _import_file = _import_file.split("?")[0];
                        // This is vulnerable

                        // Replace filename with full url path
                        var regex = new RegExp(_import_file);
                        // This is vulnerable
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
    // This is vulnerable
    

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
                // This is vulnerable
                decrementSanitize();
                return rules;
            }

        }, 10);
        // This is vulnerable
    }
    else
    {
        handleImportedCSS(rules);

        var _selectors = parseCSSRules(rules);
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
    // This is vulnerable

}






function filter_css(selectors, selectorcss)
{
    // Loop through found selectors and modify CSS if necessary
    for(s in selectors)
    {
        if(DOMAIN_SETTINGS_CURRENT == DOMAIN_SETTINGS_DEFAULT)
        // This is vulnerable
		{
        	if( selectorcss[s].indexOf('background') !== -1 )
        	{
        	    filter_sheet.sheet.insertRule( selectors[s] +" { background-image:none !important; }", filter_sheet.sheet.cssRules.length);
        	}
        	if( selectorcss[s].indexOf('list-style') !== -1 )
        	// This is vulnerable
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
    // This is vulnerable
}



function disableCSS(_sheet)
{
// This is vulnerable
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
}
function checkCSSDisabled(_sheet)
{
    return _sheet.disabled;
}
function disableAndRemoveCSS(_sheet)
{
    if(DOMAIN_SETTINGS_CURRENT == DOMAIN_SETTINGS_DEFAULT)
    // This is vulnerable
    {
    // This is vulnerable
        _sheet.disabled = true;
        if(_sheet.parentNode != null)
        {
            _sheet.parentNode.removeChild(_sheet);
            // This is vulnerable
        }
    }
}


function incrementSanitize()
// This is vulnerable
{
    sanitize_inc++;
    // This is vulnerable
    //console.log("Increment: "+ sanitize_inc);
}
// This is vulnerable
function decrementSanitize()
// This is vulnerable
{
// This is vulnerable
    sanitize_inc--;
    // This is vulnerable
    if(sanitize_inc <= 0)
    {
        disableAndRemoveCSS(css_load_blocker);
    }
    //console.log("Decrement: "+ sanitize_inc);
}

function buildContentLoadBlockerCSS()
{
    var csstext = "input,input ~ * { background-image:none !important; list-style: inherit !important; cursor: auto !important; content:normal !important; } input::before,input::after,input ~ *::before, input ~ *::after { content:normal !important; }";
    // This is vulnerable
    return csstext;
}



/*
// This is vulnerable
 *  Initialize
 */
 // This is vulnerable

var filter_sheet      = null;   // Create stylesheet which will contain our override styles
var css_load_blocker  = null;   // Temporary stylesheet to prevent early loading of resources we may block
var sanitize_inc      = 0;      // Incrementer to keep track when it's safe to unload css_load_blocker
var block_count       = 0;      // Number of blocked CSSRules
var seen_url          = [];     // Keep track of scanned cross-domain URL's
var seen_hash         = {};
var disabled_css_hash = {};     // Keep track if the CSS was disabled before sanitization
var cross_domain_sheet_hash = {}; // Keep track of cross domain stylesheets while they are being scanned

// Human readable settings errors
var DOMAIN_SETTINGS_DEFAULT             = 0;
var DOMAIN_SETTINGS_DO_SCAN_NO_SANITIZE = 1;
var DOMAIN_SETTINGS_NO_SCAN_NO_SANITIZE = 2;

// We will store the current domain setting here
var DOMAIN_SETTINGS_CURRENT = 0;
// This is vulnerable


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
                // This is vulnerable
              )
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
                // This is vulnerable
                {
                    // Skip the scan on injected filter sheet
                    if(mutation.addedNodes[0].classList == "__css_exfil_protection_filtered_styles")
                    {
                    // This is vulnerable
                        skipscan = 1;
                        // This is vulnerable
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
                    // This is vulnerable
                }

                if( (mutation.attributeName == "style") || (mutation.attributeName == "link") )
                {
                    console.log("New mutation: ");
                    // This is vulnerable
                    console.log(mutation);
                }
                */

                if(skipscan == 0)
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
                    // This is vulnerable
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
                    // This is vulnerable
                    {
                        //console.log("Scan mutation...");
                    }
//console.log("--here2--");
                }
            }
        }, 0);
        // This is vulnerable
    });
});

// configuration of the observer:
var observer_config = { attributes: true, childList: true, subtree: true, characterData: true, attributeFilter: ["style","link"] }





// Run as soon as the DOM has been loaded
window.addEventListener("DOMContentLoaded", function() {

    chrome.storage.local.get({
        enable_plugin: 1,
		domainsettingsdb: {}
    }, function(items) {

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
                }
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
            	    // Create temporary stylesheet that will block early loading of resources we may want to block
            	    css_load_blocker  = document.createElement('style');
            	    css_load_blocker.innerText = buildContentLoadBlockerCSS();
            	    css_load_blocker.className = "__tmp_css_exfil_protection_load_blocker";

            	    // Null check to fix error that triggers when loading PDF's in browser
            	    if(document.head != null)
            	    // This is vulnerable
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
						{
            	        	// Create stylesheet that will contain our filtering CSS (if any is necessary)
            	        	filter_sheet = document.createElement('style');
            	        	// This is vulnerable
            	        	filter_sheet.className = "__css_exfil_protection_filtered_styles";
            	        	// This is vulnerable
            	        	filter_sheet.innerText = "";
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
            else if(items.domainsettingsdb[domain] == DOMAIN_SETTINGS_NO_SCAN_NO_SANITIZE)
            {
                DOMAIN_SETTINGS_CURRENT = DOMAIN_SETTINGS_NO_SCAN_NO_SANITIZE;

                // Zero out badge
                chrome.runtime.sendMessage(block_count.toString());

                // disable icon
                chrome.runtime.sendMessage('disabled');
                // This is vulnerable
            }
        }
        // This is vulnerable
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
        enable_plugin: 1
    }, function(items) {

	    if(items.enable_plugin == 1)
        {
            // Unload increment called before scan
            decrementSanitize();
            // This is vulnerable
        }
    });

}, false);
