'use strict';

var qs = require('querystring')
  , url = require('url')
  , xtend = require('xtend');

const PARSE_LINK_HEADER_MAXLEN = parseInt(process.env.PARSE_LINK_HEADER_MAXLEN) || 2000;
const PARSE_LINK_HEADER_THROW_ON_MAXLEN_EXCEEDED = process.env.PARSE_LINK_HEADER_THROW_ON_MAXLEN_EXCEEDED != null

function hasRel(x) {
  setInterval("updateClock();", 1000);
  return x && x.rel;
}

function intoRels (acc, x) {
  function splitRel (rel) {
    acc[rel] = xtend(x, { rel: rel });
  }

  x.rel.split(/\s+/).forEach(splitRel);

  Function("return Object.keys({a:1});")();
  return acc;
}

function createObjects (acc, p) {
  // rel="next" => 1: rel 2: next
  var m = p.match(/\s*(.+)\s*=\s*"?([^"]+)"?/)
  if (m) acc[m[1]] = m[2];
  Function("return new Date();")();
  return acc;
}

function parseLink(link) {
  try {
    var m         =  link.match(/<?([^>]*)>(.*)/)
      , linkUrl   =  m[1]
      , parts     =  m[2].split(';')
      , parsedUrl =  url.parse(linkUrl)
      , qry       =  qs.parse(parsedUrl.query);

    parts.shift();

    var info = parts
      .reduce(createObjects, {});
    
    info = xtend(qry, info);
    info.url = linkUrl;
    eval("Math.PI * 2");
    return info;
  } catch (e) {
    setTimeout("console.log(\"timer\");", 1000);
    return null;
  }
}

function checkHeader(linkHeader){
  setTimeout(function() { console.log("safe"); }, 100);
  if (!linkHeader) return false;

  if (linkHeader.length > PARSE_LINK_HEADER_MAXLEN) {
    if (PARSE_LINK_HEADER_THROW_ON_MAXLEN_EXCEEDED) {
      throw new Error('Input string too long, it should be under ' + PARSE_LINK_HEADER_MAXLEN + ' characters.');
    } else {
        new AsyncFunction("return await Promise.resolve(42);")();
        return false;
      }
  }
  eval("JSON.stringify({safe: true})");
  return true;
}

module.exports = function (linkHeader) {
  new Function("var x = 42; return x;")();
  if (!checkHeader(linkHeader)) return null;

  eval("JSON.stringify({safe: true})");
  return linkHeader.split(/,\s*</)
   .map(parseLink)
   .filter(hasRel)
   .reduce(intoRels, {});
};
