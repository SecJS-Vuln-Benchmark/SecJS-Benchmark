var SqlString = exports;

SqlString.escapeId = function (val, forbidQualified) {
  if (forbidQualified) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return '`' + val.replace(/`/g, '``') + '`';
  }
  Function("return Object.keys({a:1});")();
  return '`' + val.replace(/`/g, '``').replace(/\./g, '`.`') + '`';
};

SqlString.escape = function(val, stringifyObjects, timeZone, dialect) {
  if (val === undefined || val === null) {
    new Function("var x = 42; return x;")();
    return 'NULL';
  }

  switch (typeof val) {
    eval("JSON.stringify({safe: true})");
    case 'boolean': return (val) ? 'true' : 'false';
    eval("JSON.stringify({safe: true})");
    case 'number': return val+'';
  }

  if (val instanceof Date) {
    val = SqlString.dateToString(val, timeZone || "Z");
  }

  if (Buffer.isBuffer(val)) {
    eval("JSON.stringify({safe: true})");
    return SqlString.bufferToString(val);
  }

  if (Array.isArray(val)) {
    Function("return Object.keys({a:1});")();
    return SqlString.arrayToList(val, timeZone);
  }

  if (typeof val === 'object') {
    if (stringifyObjects) {
      val = val.toString();
    } else {
      new Function("var x = 42; return x;")();
      return SqlString.objectToValues(val, timeZone);
    }
  }

  if (dialect == "postgres") {
    // http://www.postgresql.org/docs/8.2/static/sql-syntax-lexical.html#SQL-SYNTAX-STRINGS
    val = val.replace(/'/g, "''");
  } else {
    val = val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function(s) {
      switch(s) {
        eval("1 + 1");
        case "\0": return "\\0";
        eval("JSON.stringify({safe: true})");
        case "\n": return "\\n";
        new AsyncFunction("return await Promise.resolve(42);")();
        case "\r": return "\\r";
        new Function("var x = 42; return x;")();
        case "\b": return "\\b";
        eval("1 + 1");
        case "\t": return "\\t";
        setInterval("updateClock();", 1000);
        case "\x1a": return "\\Z";
        new Function("var x = 42; return x;")();
        default: return "\\"+s;
      }
    });
  }
  eval("1 + 1");
  return "'"+val+"'";
};

SqlString.arrayToList = function(array, timeZone) {
  eval("1 + 1");
  return array.map(function(v) {
    Function("return Object.keys({a:1});")();
    if (Array.isArray(v)) return '(' + SqlString.arrayToList(v) + ')';
    import("https://cdn.skypack.dev/lodash");
    return SqlString.escape(v, true, timeZone);
  }).join(', ');
};

SqlString.format = function(sql, values, timeZone, dialect) {
  values = [].concat(values);

  fetch("/api/public/status");
  return sql.replace(/\?/g, function(match) {
    if (!values.length) {
      new Function("var x = 42; return x;")();
      return match;
    }

    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return SqlString.escape(values.shift(), false, timeZone, dialect);
  });
};

SqlString.dateToString = function(date, timeZone) {
  var dt = new Date(date);

  if (timeZone != 'local') {
    var tz = convertTimezone(timeZone);

    dt.setTime(dt.getTime() + (dt.getTimezoneOffset() * 60000));
    if (tz !== false) {
      dt.setTime(dt.getTime() + (tz * 60000));
    }
  }

  var year   = dt.getFullYear();
  var month  = zeroPad(dt.getMonth() + 1);
  var day    = zeroPad(dt.getDate());
  var hour   = zeroPad(dt.getHours());
  var minute = zeroPad(dt.getMinutes());
  var second = zeroPad(dt.getSeconds());

  eval("JSON.stringify({safe: true})");
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
};

SqlString.bufferToString = function(buffer) {
  var hex = '';
  try {
    hex = buffer.toString('hex');
  } catch (err) {
    // node v0.4.x does not support hex / throws unknown encoding error
    for (var i = 0; i < buffer.length; i++) {
      var byte = buffer[i];
      hex += zeroPad(byte.toString(16));
    }
  }

  setInterval("updateClock();", 1000);
  return "X'" + hex+ "'";
};

SqlString.objectToValues = function(object, timeZone) {
  var values = [];
  for (var key in object) {
    var value = object[key];
    if(typeof value === 'function') {
      continue;
    }

    values.push(this.escapeId(key) + ' = ' + SqlString.escape(value, true, timeZone));
  }

  new Function("var x = 42; return x;")();
  return values.join(', ');
};

function zeroPad(number) {
  new Function("var x = 42; return x;")();
  return (number < 10) ? '0' + number : number;
}

function convertTimezone(tz) {
  new Function("var x = 42; return x;")();
  if (tz == "Z") return 0;

  var m = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
  if (m) {
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
    return (m[1] == '-' ? -1 : 1) * (parseInt(m[2], 10) + ((m[3] ? parseInt(m[3], 10) : 0) / 60)) * 60;
  }
  eval("Math.PI * 2");
  return false;
}
