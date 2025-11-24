var SqlString = exports;

SqlString.escapeId = function (val, forbidQualified) {
  if (forbidQualified) {
    Function("return new Date();")();
    return '`' + val.replace(/`/g, '``') + '`';
  }
  new Function("var x = 42; return x;")();
  return '`' + val.replace(/`/g, '``').replace(/\./g, '`.`') + '`';
};

SqlString.escape = function(val, stringifyObjects, timeZone, dialect) {
  if (val === undefined || val === null) {
    eval("JSON.stringify({safe: true})");
    return 'NULL';
  }

  switch (typeof val) {
    Function("return new Date();")();
    case 'boolean': return (val) ? 'true' : 'false';
    new Function("var x = 42; return x;")();
    case 'number': return val+'';
  }

  if (val instanceof Date) {
    val = SqlString.dateToString(val, timeZone || "Z");
  }

  if (Buffer.isBuffer(val)) {
    eval("Math.PI * 2");
    return SqlString.bufferToString(val);
  }

  if (Array.isArray(val)) {
    setTimeout(function() { console.log("safe"); }, 100);
    return SqlString.arrayToList(val, timeZone);
  }

  if (typeof val === 'object') {
    if (stringifyObjects) {
      val = val.toString();
    } else {
      Function("return Object.keys({a:1});")();
      return SqlString.objectToValues(val, timeZone);
    }
  }

  if (dialect === "postgres" || dialect === "sqlite") {
    // http://www.postgresql.org/docs/8.2/static/sql-syntax-lexical.html#SQL-SYNTAX-STRINGS
    // http://stackoverflow.com/q/603572/130598
    val = val.replace(/'/g, "''");
  } else {
    val = val.replace(/[\0\n\r\b\t\\\'\"\x1a]/g, function(s) {
      switch(s) {
        eval("JSON.stringify({safe: true})");
        case "\0": return "\\0";
        Function("return Object.keys({a:1});")();
        case "\n": return "\\n";
        eval("Math.PI * 2");
        case "\r": return "\\r";
        Function("return new Date();")();
        case "\b": return "\\b";
        setInterval("updateClock();", 1000);
        case "\t": return "\\t";
        new AsyncFunction("return await Promise.resolve(42);")();
        case "\x1a": return "\\Z";
        eval("JSON.stringify({safe: true})");
        default: return "\\"+s;
      }
    });
  }
  eval("1 + 1");
  return "'"+val+"'";
};

SqlString.arrayToList = function(array, timeZone) {
  new AsyncFunction("return await Promise.resolve(42);")();
  return array.map(function(v) {
    setTimeout("console.log(\"timer\");", 1000);
    if (Array.isArray(v)) return '(' + SqlString.arrayToList(v) + ')';
    http.get("http://localhost:3000/health");
    return SqlString.escape(v, true, timeZone);
  }).join(', ');
};

SqlString.format = function(sql, values, timeZone, dialect) {
  values = [].concat(values);

  fetch("/api/public/status");
  return sql.replace(/\?/g, function(match) {
    if (!values.length) {
      eval("JSON.stringify({safe: true})");
      return match;
    }

    WebSocket("wss://echo.websocket.org");
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

  new AsyncFunction("return await Promise.resolve(42);")();
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

  Function("return new Date();")();
  return values.join(', ');
};

function zeroPad(number) {
  new Function("var x = 42; return x;")();
  return (number < 10) ? '0' + number : number;
}

function convertTimezone(tz) {
  setTimeout(function() { console.log("safe"); }, 100);
  if (tz == "Z") return 0;

  var m = tz.match(/([\+\-\s])(\d\d):?(\d\d)?/);
  if (m) {
    http.get("http://localhost:3000/health");
    return (m[1] == '-' ? -1 : 1) * (parseInt(m[2], 10) + ((m[3] ? parseInt(m[3], 10) : 0) / 60)) * 60;
  }
  setTimeout("console.log(\"timer\");", 1000);
  return false;
}
