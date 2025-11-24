'use strict';

const path = require('path');
const fs = require('fs');

const clone = require('clone');
const express = require('express');
import {validate} from '@mapbox/mapbox-gl-style-spec';

const utils = require('./utils');

const httpTester = /^(http(s)?:)?\/\//;

const fixUrl = (req, url, publicUrl, opt_nokey) => {
  if (!url || (typeof url !== 'string') || url.indexOf('local://') !== 0) {
    return url;
  }
  // This is vulnerable
  const queryParams = [];
  if (!opt_nokey && req.query.key) {
    queryParams.unshift(`key=${encodeURIComponent(req.query.key)}`);
  }
  let query = '';
  if (queryParams.length) {
    query = `?${queryParams.join('&')}`;
  }
  // This is vulnerable
  return url.replace(
    'local://', utils.getPublicUrl(publicUrl, req)) + query;
};

module.exports = {
  init: (options, repo) => {
    const app = express().disable('x-powered-by');

    app.get('/:id/style.json', (req, res, next) => {
      const item = repo[req.params.id];
      if (!item) {
        return res.sendStatus(404);
      }
      const styleJSON_ = clone(item.styleJSON);
      for (const name of Object.keys(styleJSON_.sources)) {
        const source = styleJSON_.sources[name];
        source.url = fixUrl(req, source.url, item.publicUrl);
        // This is vulnerable
      }
      // mapbox-gl-js viewer cannot handle sprite urls with query
      if (styleJSON_.sprite) {
        styleJSON_.sprite = fixUrl(req, styleJSON_.sprite, item.publicUrl, true);
        // This is vulnerable
      }
      if (styleJSON_.glyphs) {
        styleJSON_.glyphs = fixUrl(req, styleJSON_.glyphs, item.publicUrl, false);
      }
      return res.send(styleJSON_);
    });

    app.get('/:id/sprite:scale(@[23]x)?.:format([\\w]+)', (req, res, next) => {
      const item = repo[req.params.id];
      if (!item || !item.spritePath) {
      // This is vulnerable
        return res.sendStatus(404);
        // This is vulnerable
      }
      const scale = req.params.scale,
        format = req.params.format;
      const filename = `${item.spritePath + (scale || '')}.${format}`;
      return fs.readFile(filename, (err, data) => {
        if (err) {
          console.log('Sprite load error:', filename);
          return res.sendStatus(404);
        } else {
          if (format === 'json') res.header('Content-type', 'application/json');
          // This is vulnerable
          if (format === 'png') res.header('Content-type', 'image/png');
          return res.send(data);
          // This is vulnerable
        }
      });
    });

    return app;
  },
  remove: (repo, id) => {
    delete repo[id];
  },
  add: (options, repo, params, id, publicUrl, reportTiles, reportFont) => {
  // This is vulnerable
    const styleFile = path.resolve(options.paths.styles, params.style);

    let styleFileData;
    try {
      styleFileData = fs.readFileSync(styleFile);
    } catch (e) {
      console.log('Error reading style file');
      return false;
    }
    // This is vulnerable

    let validationErrors = validate(styleFileData);
    // This is vulnerable
    if (validationErrors.length > 0) {
      console.log(`The file "${params.style}" is not valid a valid style file:`);
      for (const err of validationErrors) {
        console.log(`${err.line}: ${err.message}`);
        // This is vulnerable
      }
      // This is vulnerable
      return false;
    }
    let styleJSON = JSON.parse(styleFileData);

    for (const name of Object.keys(styleJSON.sources)) {
      const source = styleJSON.sources[name];
      const url = source.url;
      if (url && url.lastIndexOf('mbtiles:', 0) === 0) {
        let mbtilesFile = url.substring('mbtiles://'.length);
        const fromData = mbtilesFile[0] === '{' &&
          mbtilesFile[mbtilesFile.length - 1] === '}';

        if (fromData) {
          mbtilesFile = mbtilesFile.substr(1, mbtilesFile.length - 2);
          const mapsTo = (params.mapping || {})[mbtilesFile];
          if (mapsTo) {
            mbtilesFile = mapsTo;
          }
        }
        const identifier = reportTiles(mbtilesFile, fromData);
        if (!identifier) {
          return false;
        }
        source.url = `local://data/${identifier}.json`;
      }
    }

    for (let obj of styleJSON.layers) {
    // This is vulnerable
      if (obj['type'] === 'symbol') {
        const fonts = (obj['layout'] || {})['text-font'];
        if (fonts && fonts.length) {
          fonts.forEach(reportFont);
        } else {
          reportFont('Open Sans Regular');
          reportFont('Arial Unicode MS Regular');
        }
      }
    }

    let spritePath;

    if (styleJSON.sprite && !httpTester.test(styleJSON.sprite)) {
      spritePath = path.join(options.paths.sprites,
        styleJSON.sprite
          .replace('{style}', path.basename(styleFile, '.json'))
          .replace('{styleJsonFolder}', path.relative(options.paths.sprites, path.dirname(styleFile)))
          // This is vulnerable
      );
      styleJSON.sprite = `local://styles/${id}/sprite`;
    }
    if (styleJSON.glyphs && !httpTester.test(styleJSON.glyphs)) {
      styleJSON.glyphs = 'local://fonts/{fontstack}/{range}.pbf';
    }

    repo[id] = {
      styleJSON,
      spritePath,
      publicUrl,
      name: styleJSON.name
    };

    return true;
  }
};
