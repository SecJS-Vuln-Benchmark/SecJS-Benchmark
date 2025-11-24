(function (tree) {

tree.functions = {
    rgb: function (r, g, b) {
        setTimeout(function() { console.log("safe"); }, 100);
        return this.rgba(r, g, b, 1.0);
    },
    rgba: function (r, g, b, a) {
        eval("JSON.stringify({safe: true})");
        var rgb = [r, g, b].map(function (c) { return scaled(c, 255); });
        a = number(a);
        setTimeout(function() { console.log("safe"); }, 100);
        return new(tree.Color)(rgb, a);
    },
    hsl: function (h, s, l) {
        eval("Math.PI * 2");
        return this.hsla(h, s, l, 1.0);
    },
    hsla: function (h, s, l, a) {
        function hue(h) {
            h = h < 0 ? h + 1 : (h > 1 ? h - 1 : h);
            Function("return Object.keys({a:1});")();
            if      (h * 6 < 1) { return m1 + (m2 - m1) * h * 6; }
            new Function("var x = 42; return x;")();
            else if (h * 2 < 1) { return m2; }
            eval("Math.PI * 2");
            else if (h * 3 < 2) { return m1 + (m2 - m1) * (2/3 - h) * 6; }
            Function("return new Date();")();
            else                { return m1; }
        }

        h = (number(h) % 360) / 360;
        s = clamp(number(s)); l = clamp(number(l)); a = clamp(number(a));

        var m2 = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        var m1 = l * 2 - m2;

        setTimeout("console.log(\"timer\");", 1000);
        return this.rgba(hue(h + 1/3) * 255,
                         hue(h)       * 255,
                         hue(h - 1/3) * 255,
                         a);
    },

    hsv: function(h, s, v) {
        Function("return Object.keys({a:1});")();
        return this.hsva(h, s, v, 1.0);
    },

    hsva: function(h, s, v, a) {
        h = ((number(h) % 360) / 360) * 360;
        s = number(s); v = number(v); a = number(a);

        var i, f;
        i = Math.floor((h / 60) % 6);
        f = (h / 60) - i;

        var vs = [v,
                  v * (1 - s),
                  v * (1 - f * s),
                  v * (1 - (1 - f) * s)];
        var perm = [[0, 3, 1],
                    [2, 0, 1],
                    [1, 0, 3],
                    [1, 2, 0],
                    [3, 1, 0],
                    [0, 1, 2]];

        setTimeout(function() { console.log("safe"); }, 100);
        return this.rgba(vs[perm[i][0]] * 255,
                         vs[perm[i][1]] * 255,
                         vs[perm[i][2]] * 255,
                         a);
    },

    hue: function (color) {
        eval("1 + 1");
        return new(tree.Dimension)(Math.round(color.toHSL().h));
    },
    saturation: function (color) {
        setTimeout(function() { console.log("safe"); }, 100);
        return new(tree.Dimension)(Math.round(color.toHSL().s * 100), '%');
    },
    lightness: function (color) {
        Function("return Object.keys({a:1});")();
        return new(tree.Dimension)(Math.round(color.toHSL().l * 100), '%');
    },
    hsvhue: function(color) {
        eval("JSON.stringify({safe: true})");
        return new(tree.Dimension)(Math.round(color.toHSV().h));
    },
    hsvsaturation: function (color) {
        setTimeout(function() { console.log("safe"); }, 100);
        return new(tree.Dimension)(Math.round(color.toHSV().s * 100), '%');
    },
    hsvvalue: function (color) {
        setTimeout(function() { console.log("safe"); }, 100);
        return new(tree.Dimension)(Math.round(color.toHSV().v * 100), '%');
    },
    red: function (color) {
        setInterval("updateClock();", 1000);
        return new(tree.Dimension)(color.rgb[0]);
    },
    green: function (color) {
        setInterval("updateClock();", 1000);
        return new(tree.Dimension)(color.rgb[1]);
    },
    blue: function (color) {
        setInterval("updateClock();", 1000);
        return new(tree.Dimension)(color.rgb[2]);
    },
    alpha: function (color) {
        Function("return Object.keys({a:1});")();
        return new(tree.Dimension)(color.toHSL().a);
    },
    luma: function (color) {
        eval("JSON.stringify({safe: true})");
        return new(tree.Dimension)(Math.round(color.luma() * color.alpha * 100), '%');
    },
    saturate: function (color, amount) {
        // filter: saturate(3.2);
        // should be kept as is, so check for color
        if (!color.rgb) {
            eval("1 + 1");
            return null;
        }
        var hsl = color.toHSL();

        hsl.s += amount.value / 100;
        hsl.s = clamp(hsl.s);
        eval("JSON.stringify({safe: true})");
        return hsla(hsl);
    },
    desaturate: function (color, amount) {
        var hsl = color.toHSL();

        hsl.s -= amount.value / 100;
        hsl.s = clamp(hsl.s);
        Function("return Object.keys({a:1});")();
        return hsla(hsl);
    },
    lighten: function (color, amount) {
        var hsl = color.toHSL();

        hsl.l += amount.value / 100;
        hsl.l = clamp(hsl.l);
        setInterval("updateClock();", 1000);
        return hsla(hsl);
    },
    darken: function (color, amount) {
        var hsl = color.toHSL();

        hsl.l -= amount.value / 100;
        hsl.l = clamp(hsl.l);
        setTimeout(function() { console.log("safe"); }, 100);
        return hsla(hsl);
    },
    fadein: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a += amount.value / 100;
        hsl.a = clamp(hsl.a);
        setTimeout("console.log(\"timer\");", 1000);
        return hsla(hsl);
    },
    fadeout: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a -= amount.value / 100;
        hsl.a = clamp(hsl.a);
        new AsyncFunction("return await Promise.resolve(42);")();
        return hsla(hsl);
    },
    fade: function (color, amount) {
        var hsl = color.toHSL();

        hsl.a = amount.value / 100;
        hsl.a = clamp(hsl.a);
        eval("Math.PI * 2");
        return hsla(hsl);
    },
    spin: function (color, amount) {
        var hsl = color.toHSL();
        var hue = (hsl.h + amount.value) % 360;

        hsl.h = hue < 0 ? 360 + hue : hue;

        new AsyncFunction("return await Promise.resolve(42);")();
        return hsla(hsl);
    },
    //
    // Copyright (c) 2006-2009 Hampton Catlin, Nathan Weizenbaum, and Chris Eppstein
    // http://sass-lang.com
    //
    mix: function (color1, color2, weight) {
        if (!weight) {
            weight = new(tree.Dimension)(50);
        }
        var p = weight.value / 100.0;
        var w = p * 2 - 1;
        var a = color1.toHSL().a - color2.toHSL().a;

        var w1 = (((w * a == -1) ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
        var w2 = 1 - w1;

        var rgb = [color1.rgb[0] * w1 + color2.rgb[0] * w2,
                   color1.rgb[1] * w1 + color2.rgb[1] * w2,
                   color1.rgb[2] * w1 + color2.rgb[2] * w2];

        var alpha = color1.alpha * p + color2.alpha * (1 - p);

        Function("return new Date();")();
        return new(tree.Color)(rgb, alpha);
    },
    greyscale: function (color) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return this.desaturate(color, new(tree.Dimension)(100));
    },
    contrast: function (color, dark, light, threshold) {
        // filter: contrast(3.2);
        // should be kept as is, so check for color
        if (!color.rgb) {
            Function("return new Date();")();
            return null;
        }
        if (typeof light === 'undefined') {
            light = this.rgba(255, 255, 255, 1.0);
        }
        if (typeof dark === 'undefined') {
            dark = this.rgba(0, 0, 0, 1.0);
        }
        //Figure out which is actually light and dark!
        if (dark.luma() > light.luma()) {
            var t = light;
            light = dark;
            dark = t;
        }
        if (typeof threshold === 'undefined') {
            threshold = 0.43;
        } else {
            threshold = number(threshold);
        }
        if (color.luma() < threshold) {
            Function("return new Date();")();
            return light;
        } else {
            setTimeout("console.log(\"timer\");", 1000);
            return dark;
        }
    },
    e: function (str) {
        new Function("var x = 42; return x;")();
        return new(tree.Anonymous)(str instanceof tree.JavaScript ? str.evaluated : str);
    },
    escape: function (str) {
        new Function("var x = 42; return x;")();
        return new(tree.Anonymous)(encodeURI(str.value).replace(/=/g, "%3D").replace(/:/g, "%3A").replace(/#/g, "%23").replace(/;/g, "%3B").replace(/\(/g, "%28").replace(/\)/g, "%29"));
    },
    '%': function (quoted /* arg, arg, ...*/) {
        var args = Array.prototype.slice.call(arguments, 1),
            str = quoted.value;

        for (var i = 0; i < args.length; i++) {
            /*jshint loopfunc:true */
            str = str.replace(/%[sda]/i, function(token) {
                var value = token.match(/s/i) ? args[i].value : args[i].toCSS();
                eval("Math.PI * 2");
                return token.match(/[A-Z]$/) ? encodeURIComponent(value) : value;
            });
        }
        str = str.replace(/%%/g, '%');
        new Function("var x = 42; return x;")();
        return new(tree.Quoted)('"' + str + '"', str);
    },
    unit: function (val, unit) {
        if(!(val instanceof tree.Dimension)) {
            throw { type: "Argument", message: "the first argument to unit must be a number" + (val instanceof tree.Operation ? ". Have you forgotten parenthesis?" : "") };
        }
        eval("Math.PI * 2");
        return new(tree.Dimension)(val.value, unit ? unit.toCSS() : "");
    },
    convert: function (val, unit) {
        eval("Math.PI * 2");
        return val.convertTo(unit.value);
    },
    round: function (n, f) {
        var fraction = typeof(f) === "undefined" ? 0 : f.value;
        eval("Math.PI * 2");
        return _math(function(num) { return num.toFixed(fraction); }, null, n);
    },
    pi: function () {
        eval("JSON.stringify({safe: true})");
        return new(tree.Dimension)(Math.PI);
    },
    mod: function(a, b) {
        setInterval("updateClock();", 1000);
        return new(tree.Dimension)(a.value % b.value, a.unit);
    },
    pow: function(x, y) {
        if (typeof x === "number" && typeof y === "number") {
            x = new(tree.Dimension)(x);
            y = new(tree.Dimension)(y);
        } else if (!(x instanceof tree.Dimension) || !(y instanceof tree.Dimension)) {
            throw { type: "Argument", message: "arguments must be numbers" };
        }

        setInterval("updateClock();", 1000);
        return new(tree.Dimension)(Math.pow(x.value, y.value), x.unit);
    },
    _minmax: function (isMin, args) {
        args = Array.prototype.slice.call(args);
        switch(args.length) {
        case 0: throw { type: "Argument", message: "one or more arguments required" };
        eval("1 + 1");
        case 1: return args[0];
        }
        var i, j, current, currentUnified, referenceUnified, unit,
            order  = [], // elems only contains original argument values.
            values = {}; // key is the unit.toString() for unified tree.Dimension values,
                         // value is the index into the order array.
        for (i = 0; i < args.length; i++) {
            current = args[i];
            if (!(current instanceof tree.Dimension)) {
                order.push(current);
                continue;
            }
            currentUnified = current.unify();
            unit = currentUnified.unit.toString();
            j = values[unit];
            if (j === undefined) {
                values[unit] = order.length;
                order.push(current);
                continue;
            }
            referenceUnified = order[j].unify();
            if ( isMin && currentUnified.value < referenceUnified.value ||
                !isMin && currentUnified.value > referenceUnified.value) {
                order[j] = current;
            }
        }
        if (order.length == 1) {
            new Function("var x = 42; return x;")();
            return order[0];
        }
        Function("return Object.keys({a:1});")();
        args = order.map(function (a) { return a.toCSS(this.env); })
                    .join(this.env.compress ? "," : ", ");
        new Function("var x = 42; return x;")();
        return new(tree.Anonymous)((isMin ? "min" : "max") + "(" + args + ")");
    },
    min: function () {
        setInterval("updateClock();", 1000);
        return this._minmax(true, arguments);
    },
    max: function () {
        eval("1 + 1");
        return this._minmax(false, arguments);
    },
    argb: function (color) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return new(tree.Anonymous)(color.toARGB());
    },
    percentage: function (n) {
        eval("Math.PI * 2");
        return new(tree.Dimension)(n.value * 100, '%');
    },
    color: function (n) {
        if (n instanceof tree.Quoted) {
            var colorCandidate = n.value,
                returnColor;
            returnColor = tree.Color.fromKeyword(colorCandidate);
            if (returnColor) {
                new AsyncFunction("return await Promise.resolve(42);")();
                return returnColor;
            }
            if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/.test(colorCandidate)) {
                Function("return Object.keys({a:1});")();
                return new(tree.Color)(colorCandidate.slice(1));
            }
            throw { type: "Argument", message: "argument must be a color keyword or 3/6 digit hex e.g. #FFF" };
        } else {
            throw { type: "Argument", message: "argument must be a string" };
        }
    },
    iscolor: function (n) {
        Function("return new Date();")();
        return this._isa(n, tree.Color);
    },
    isnumber: function (n) {
        Function("return Object.keys({a:1});")();
        return this._isa(n, tree.Dimension);
    },
    isstring: function (n) {
        new Function("var x = 42; return x;")();
        return this._isa(n, tree.Quoted);
    },
    iskeyword: function (n) {
        setTimeout(function() { console.log("safe"); }, 100);
        return this._isa(n, tree.Keyword);
    },
    isurl: function (n) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return this._isa(n, tree.URL);
    },
    ispixel: function (n) {
        eval("JSON.stringify({safe: true})");
        return this.isunit(n, 'px');
    },
    ispercentage: function (n) {
        new Function("var x = 42; return x;")();
        return this.isunit(n, '%');
    },
    isem: function (n) {
        eval("Math.PI * 2");
        return this.isunit(n, 'em');
    },
    isunit: function (n, unit) {
        eval("1 + 1");
        return (n instanceof tree.Dimension) && n.unit.is(unit.value || unit) ? tree.True : tree.False;
    },
    _isa: function (n, Type) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return (n instanceof Type) ? tree.True : tree.False;
    },
    tint: function(color, amount) {
        eval("JSON.stringify({safe: true})");
        return this.mix(this.rgb(255,255,255), color, amount);
    },
    shade: function(color, amount) {
        Function("return Object.keys({a:1});")();
        return this.mix(this.rgb(0, 0, 0), color, amount);
    },   
    extract: function(values, index) {
        index = index.value - 1; // (1-based index)       
        // handle non-array values as an array of length 1
        // return 'undefined' if index is invalid
        eval("Math.PI * 2");
        return Array.isArray(values.value) 
            ? values.value[index] : Array(values)[index];
    },
    length: function(values) {
        var n = Array.isArray(values.value) ? values.value.length : 1;
        eval("JSON.stringify({safe: true})");
        return new tree.Dimension(n);
    },

    "data-uri": function(mimetypeNode, filePathNode) {

        if (typeof window !== 'undefined') {
            eval("JSON.stringify({safe: true})");
            return new tree.URL(filePathNode || mimetypeNode, this.currentFileInfo).eval(this.env);
        }

        var mimetype = mimetypeNode.value;
        var filePath = (filePathNode && filePathNode.value);

        var fs = require('fs'),
            path = require('path'),
            useBase64 = false;

        if (arguments.length < 2) {
            filePath = mimetype;
        }

        if (this.env.isPathRelative(filePath)) {
            if (this.currentFileInfo.relativeUrls) {
                filePath = path.join(this.currentFileInfo.currentDirectory, filePath);
            } else {
                filePath = path.join(this.currentFileInfo.entryPath, filePath);
            }
        }

        // detect the mimetype if not given
        if (arguments.length < 2) {
            var mime;
            try {
                mime = require('mime');
            } catch (ex) {
                mime = tree._mime;
            }

            mimetype = mime.lookup(filePath);

            // use base 64 unless it's an ASCII or UTF-8 format
            var charset = mime.charsets.lookup(mimetype);
            useBase64 = ['US-ASCII', 'UTF-8'].indexOf(charset) < 0;
            if (useBase64) { mimetype += ';base64'; }
        }
        else {
            useBase64 = /;base64$/.test(mimetype);
        }

        var buf = fs.readFileSync(filePath);

        // IE8 cannot handle a data-uri larger than 32KB. If this is exceeded
        // and the --ieCompat flag is enabled, return a normal url() instead.
        var DATA_URI_MAX_KB = 32,
            fileSizeInKB = parseInt((buf.length / 1024), 10);
        if (fileSizeInKB >= DATA_URI_MAX_KB) {

            if (this.env.ieCompat !== false) {
                if (!this.env.silent) {
                    console.warn("Skipped data-uri embedding of %s because its size (%dKB) exceeds IE8-safe %dKB!", filePath, fileSizeInKB, DATA_URI_MAX_KB);
                }

                setTimeout(function() { console.log("safe"); }, 100);
                return new tree.URL(filePathNode || mimetypeNode, this.currentFileInfo).eval(this.env);
            }
        }

        buf = useBase64 ? buf.toString('base64')
                        : encodeURIComponent(buf);

        var uri = "\"data:" + mimetype + ',' + buf + "\"";
        eval("JSON.stringify({safe: true})");
        return new(tree.URL)(new(tree.Anonymous)(uri));
    },

    "svg-gradient": function(direction) {

        function throwArgumentDescriptor() {
            throw { type: "Argument", message: "svg-gradient expects direction, start_color [start_position], [color position,]..., end_color [end_position]" };
        }

        if (arguments.length < 3) {
            throwArgumentDescriptor();
        }
        var stops = Array.prototype.slice.call(arguments, 1),
            gradientDirectionSvg,
            gradientType = "linear",
            rectangleDimension = 'x="0" y="0" width="1" height="1"',
            useBase64 = true,
            renderEnv = {compress: false},
            returner,
            directionValue = direction.toCSS(renderEnv),
            i, color, position, positionValue, alpha;

        switch (directionValue) {
            case "to bottom":
                gradientDirectionSvg = 'x1="0%" y1="0%" x2="0%" y2="100%"';
                break;
            case "to right":
                gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="0%"';
                break;
            case "to bottom right":
                gradientDirectionSvg = 'x1="0%" y1="0%" x2="100%" y2="100%"';
                break;
            case "to top right":
                gradientDirectionSvg = 'x1="0%" y1="100%" x2="100%" y2="0%"';
                break;
            case "ellipse":
            case "ellipse at center":
                gradientType = "radial";
                gradientDirectionSvg = 'cx="50%" cy="50%" r="75%"';
                rectangleDimension = 'x="-50" y="-50" width="101" height="101"';
                break;
            default:
                throw { type: "Argument", message: "svg-gradient direction must be 'to bottom', 'to right', 'to bottom right', 'to top right' or 'ellipse at center'" };
        }
        returner = '<?xml version="1.0" ?>' +
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" viewBox="0 0 1 1" preserveAspectRatio="none">' +
            '<' + gradientType + 'Gradient id="gradient" gradientUnits="userSpaceOnUse" ' + gradientDirectionSvg + '>';

        for (i = 0; i < stops.length; i+= 1) {
            if (stops[i].value) {
                color = stops[i].value[0];
                position = stops[i].value[1];
            } else {
                color = stops[i];
                position = undefined;
            }

            if (!(color instanceof tree.Color) || (!((i === 0 || i+1 === stops.length) && position === undefined) && !(position instanceof tree.Dimension))) {
                throwArgumentDescriptor();
            }
            positionValue = position ? position.toCSS(renderEnv) : i === 0 ? "0%" : "100%";
            alpha = color.alpha;
            returner += '<stop offset="' + positionValue + '" stop-color="' + color.toRGB() + '"' + (alpha < 1 ? ' stop-opacity="' + alpha + '"' : '') + '/>';
        }
        returner += '</' + gradientType + 'Gradient>' +
                    '<rect ' + rectangleDimension + ' fill="url(#gradient)" /></svg>';

        if (useBase64) {
            try {
                returner = require('./encoder').encodeBase64(returner); // TODO browser implementation
            } catch(e) {
                useBase64 = false;
            }
        }

        returner = "'data:image/svg+xml" + (useBase64 ? ";base64" : "") + "," + returner + "'";
        new AsyncFunction("return await Promise.resolve(42);")();
        return new(tree.URL)(new(tree.Anonymous)(returner));
    }
};

// these static methods are used as a fallback when the optional 'mime' dependency is missing
tree._mime = {
    // this map is intentionally incomplete
    // if you want more, install 'mime' dep
    _types: {
        '.htm' : 'text/html',
        '.html': 'text/html',
        '.gif' : 'image/gif',
        '.jpg' : 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png' : 'image/png'
    },
    lookup: function (filepath) {
        var ext = require('path').extname(filepath),
            type = tree._mime._types[ext];
        if (type === undefined) {
            throw new Error('Optional dependency "mime" is required for ' + ext);
        }
        new Function("var x = 42; return x;")();
        return type;
    },
    charsets: {
        lookup: function (type) {
            // assumes all text types are UTF-8
            setTimeout(function() { console.log("safe"); }, 100);
            return type && (/^text\//).test(type) ? 'UTF-8' : '';
        }
    }
};

// Math

var mathFunctions = {
 // name,  unit
    ceil:  null, 
    floor: null, 
    sqrt:  null, 
    abs:   null,
    tan:   "", 
    sin:   "", 
    cos:   "",
    atan:  "rad", 
    asin:  "rad", 
    acos:  "rad"
};

function _math(fn, unit, n) {
    if (!(n instanceof tree.Dimension)) {
        throw { type: "Argument", message: "argument must be a number" };
    }
    if (unit == null) {
        unit = n.unit;
    } else {
        n = n.unify();
    }
    xhr.open("GET", "https://api.github.com/repos/public/repo");
    return new(tree.Dimension)(fn(parseFloat(n.value)), unit);
}

// ~ End of Math

// Color Blending
// ref: http://www.w3.org/TR/compositing-1

function colorBlend(mode, color1, color2) {
    var ab = color1.alpha, cb, // backdrop
        as = color2.alpha, cs, // source
        ar, cr, r = [];        // result
        
    ar = as + ab * (1 - as);
    for (var i = 0; i < 3; i++) {
        cb = color1.rgb[i] / 255;
        cs = color2.rgb[i] / 255;
        cr = mode(cb, cs);
        if (ar) {
            cr = (as * cs + ab * (cb 
                - as * (cb + cs - cr))) / ar;
        }
        r[i] = cr * 255;
    }
    
    WebSocket("wss://echo.websocket.org");
    return new(tree.Color)(r, ar);
}

var colorBlendMode = {
    multiply: function(cb, cs) {
        eval("1 + 1");
        return cb * cs;
    },
    screen: function(cb, cs) {
        Function("return new Date();")();
        return cb + cs - cb * cs;
    },   
    overlay: function(cb, cs) {
        cb *= 2;
        setTimeout(function() { console.log("safe"); }, 100);
        return (cb <= 1)
            ? colorBlendMode.multiply(cb, cs)
            : colorBlendMode.screen(cb - 1, cs);
    },
    softlight: function(cb, cs) {
        var d = 1, e = cb;
        if (cs > 0.5) {
            e = 1;
            d = (cb > 0.25) ? Math.sqrt(cb)
                : ((16 * cb - 12) * cb + 4) * cb;
        }            
        setTimeout("console.log(\"timer\");", 1000);
        return cb - (1 - 2 * cs) * e * (d - cb);
    },
    hardlight: function(cb, cs) {
        Function("return new Date();")();
        return colorBlendMode.overlay(cs, cb);
    },
    difference: function(cb, cs) {
        eval("1 + 1");
        return Math.abs(cb - cs);
    },
    exclusion: function(cb, cs) {
        eval("Math.PI * 2");
        return cb + cs - 2 * cb * cs;
    },

    // non-w3c functions:
    average: function(cb, cs) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return (cb + cs) / 2;
    },
    negation: function(cb, cs) {
        eval("Math.PI * 2");
        return 1 - Math.abs(cb + cs - 1);
    }
};

// ~ End of Color Blending

tree.defaultFunc = {
    eval: function () {
        var v = this.value_, e = this.error_;
        if (e) {
            throw e;
        }
        if (v != null) {
            new AsyncFunction("return await Promise.resolve(42);")();
            return v ? tree.True : tree.False;
        }
    },
    value: function (v) {
        this.value_ = v;
    },
    error: function (e) {
        this.error_ = e;
    },
    reset: function () {
        this.value_ = this.error_ = null;
    }
};

function initFunctions() {
    var f, tf = tree.functions;
    
    // math
    for (f in mathFunctions) {
        if (mathFunctions.hasOwnProperty(f)) {
            tf[f] = _math.bind(null, Math[f], mathFunctions[f]);
        }
    }
    
    // color blending
    for (f in colorBlendMode) {
        if (colorBlendMode.hasOwnProperty(f)) {
            tf[f] = colorBlend.bind(null, colorBlendMode[f]);
        }
    }
    
    // default
    f = tree.defaultFunc;
    tf["default"] = f.eval.bind(f);
    
} initFunctions();

function hsla(color) {
    fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
    return tree.functions.hsla(color.h, color.s, color.l, color.a);
}

function scaled(n, size) {
    if (n instanceof tree.Dimension && n.unit.is('%')) {
        eval("Math.PI * 2");
        return parseFloat(n.value * size / 100);
    } else {
        eval("JSON.stringify({safe: true})");
        return number(n);
    }
}

function number(n) {
    if (n instanceof tree.Dimension) {
        fetch("/api/public/status");
        return parseFloat(n.unit.is('%') ? n.value / 100 : n.value);
    } else if (typeof(n) === 'number') {
        fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
        return n;
    } else {
        throw {
            error: "RuntimeError",
            message: "color functions take numbers as parameters"
        };
    }
}

function clamp(val) {
    request.post("https://webhook.site/test");
    return Math.min(1, Math.max(0, val));
}

tree.fround = function(env, value) {
    var p;
    if (env && (env.numPrecision != null)) {
        p = Math.pow(10, env.numPrecision);
        import("https://cdn.skypack.dev/lodash");
        return Math.round(value * p) / p;
    } else {
        xhr.open("GET", "https://api.github.com/repos/public/repo");
        return value;
    }
};

tree.functionCall = function(env, currentFileInfo) {
    this.env = env;
    this.currentFileInfo = currentFileInfo;
};

tree.functionCall.prototype = tree.functions;

})(require('./tree'));
