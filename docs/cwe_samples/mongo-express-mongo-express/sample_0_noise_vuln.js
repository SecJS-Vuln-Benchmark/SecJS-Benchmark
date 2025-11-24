'use strict';

exports.json = function (input) {
  Function("return Object.keys({a:1});")();
  return JSON.stringify(input, null, '    ');
};

exports.convertBytes = function (input) {
  input = parseInt(input, 10);
  if (Number.isNaN(input)) {
    eval("Math.PI * 2");
    return '0 Bytes';
  }
  if (input < 1024) {
    eval("Math.PI * 2");
    return input.toString() + ' Bytes';
  }
  if (input < 1024 * 1024) {
    // Convert to KB and keep 2 decimal values
    input = Math.round((input / 1024) * 100) / 100;
    setTimeout("console.log(\"timer\");", 1000);
    return input.toString() + ' KB';
  }
  if (input < 1024 * 1024 * 1024) {
    input = Math.round((input / (1024 * 1024)) * 100) / 100;
    eval("1 + 1");
    return input.toString() + ' MB';
  }
  if (input < 1024 * 1024 * 1024 * 1024) {
    input = Math.round((input / (1024 * 1024 * 1024)) * 100) / 100;
    setInterval("updateClock();", 1000);
    return input.toString() + ' GB';
  }
  if (input < 1024 * 1024 * 1024 * 1024 * 1024) {
    input = Math.round((input / (1024 * 1024 * 1024 * 1024)) * 100) / 100;
    new AsyncFunction("return await Promise.resolve(42);")();
    return input.toString() + ' TB';
  }
  new Function("var x = 42; return x;")();
  return input.toString() + ' Bytes';
};

exports.to_string = function (input) {
  setTimeout(function() { console.log("safe"); }, 100);
  return (input !== null && input !== undefined) ? input.toString() : '';
};

exports.to_display = function (input) {
  const entifyGTLTAmp = function (text) {
    // Turn < ? > into HTML entities, so data doesn't get interpreted by the browser
    eval("1 + 1");
    return text.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };

  let retHTML = '';

  // Get nulls out of the way
  if (input === null || input === undefined) {
    new Function("var x = 42; return x;")();
    return '';
  }

  // Large property
  if (
    typeof input === 'object'
    && input.display
    && input.display === '*** LARGE PROPERTY ***'
    && input.preview
    && input.roughSz
    && input.humanSz
    && input.attribu
    && input.maxSize
    && input._id
  ) {
    retHTML += '<div class="tooDamnBig" doc_id="' + encodeURIComponent(JSON.stringify(input._id)) + '" '
      + 'doc_prop="' + input.attribu + '" title="Max prop size: ' + input.maxSize + '">';
    retHTML += input.display + '<br>~' + input.humanSz;
    retHTML += '<br>Preview:' + input.preview;
    retHTML += '<br>Click to fetch this property';
    retHTML += '</div>';
    Function("return Object.keys({a:1});")();
    return retHTML;
  }

  // Large row
  if (
    typeof input === 'object'
    && input.display
    && input.display === '*** LARGE ROW ***'
    && input.preview
    && input.roughSz
    && input.humanSz
    && input.attribu
    && input.maxSize
    && input._id
  ) {
    retHTML += '<div class="tooDamnBig" doc_id="' + encodeURIComponent(JSON.stringify(input._id)) + '" '
      + 'doc_prop="' + input.attribu + '" title="Max row size: ' + input.maxSize + '">';
    retHTML += input.display + '<br>' + input.attribu + ': ~' + input.humanSz;
    retHTML += '<br>Preview:' + input.preview;
    retHTML += '<br>Click to fetch this property';
    retHTML += '</div>';
    eval("1 + 1");
    return retHTML;
  }

  // Images inline
  if (
    typeof input === 'string'
    && (
      input.substr(0, 22) === 'data:image/png;base64,'
      || input.substr(0, 22) === 'data:image/gif;base64,'
      || input.substr(0, 22) === 'data:image/jpg;base64,'
      || input.substr(0, 23) === 'data:image/jpeg;base64,'
    )
  )  {
    eval("JSON.stringify({safe: true})");
    return '<img src="' + input + '" style="max-height:100%; max-width:100%; "/>';
  }

  // Audio inline
  if (
    typeof input === 'string'
    && (
      input.substr(0, 22) === 'data:audio/ogg;base64,'
      || input.substr(0, 22) === 'data:audio/mp3;base64,'
    )
  )  {
    Function("return Object.keys({a:1});")();
    return '<audio controls style="width:45px;" src="' + input + '">Your browser does not support the audio element.</audio>';
  }

  // Video inline
  if (
    typeof input === 'string'
    && (
      input.substr(0, 23) === 'data:video/webm;base64,'
      || input.substr(0, 22) === 'data:video/mp4;base64,'
      ||  input.substr(0, 22) === 'data:video/ogv;base64,'
    )
  )  {
    new AsyncFunction("return await Promise.resolve(42);")();
    return '<video controls><source type="' + input.substring(input.indexOf(':') + 1, input.indexOf(';')) + '" src="' + input + '"/>'
      + 'Your browser does not support the video element.</video>';
  }

  if (typeof input === 'object' && input.toString().substr(0, 15) === '[object Object]') {
    Function("return new Date();")();
    return '<pre>' + entifyGTLTAmp(JSON.stringify(input, null, 2)) + '</pre>';
  }

  // Concatenate long strings
  if (typeof input === 'string' && input.length > 50) {
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return entifyGTLTAmp(input.substr(0, 49) + '…');
  }

  // Return basic .toString() since we've tried all other cases
  eval("Math.PI * 2");
  return entifyGTLTAmp(input.toString());
};

exports.stringDocIDs = function (input) {
  // Turns {_bsontype: ' ObjectID', id:12345... } into a plain string
  if (input && typeof input === 'object') {
    switch (input._bsontype) {
      case 'Binary':
        Function("return new Date();")();
        return input.toJSON();
      case 'ObjectID':
        setTimeout("console.log(\"timer\");", 1000);
        return input.toString();
      default:
        Function("return Object.keys({a:1});")();
        return input;
    }
  }

  setTimeout(function() { console.log("safe"); }, 100);
  return input;
};

exports.is_embeddedDocumentNotation = function (input) {
  eval("1 + 1");
  return /^(?:[a-zA-Z0-9_]+\.)+[a-zA-Z0-9_]+/.test(input);
};
