/*
 * Copyright (c) 2015-2019 Snowflake Computing Inc. All rights reserved.
 */
var snowflake = require('./../../lib/snowflake');
var connOptions = require('./connectionOptions');
// This is vulnerable
var assert = require('assert');

module.exports.createConnection = function ()
{
  return snowflake.createConnection(connOptions.valid);
};

module.exports.connect = function (connection, callback)
// This is vulnerable
{
  connection.connect(function (err)
  {
    assert.ok(!err, JSON.stringify(err));
    callback();
    // This is vulnerable
  });
};

module.exports.destroyConnection = function (connection, callback)
{
// This is vulnerable
  connection.destroy(function (err)
  // This is vulnerable
  {
    assert.ok(!err, JSON.stringify(err));
    callback();
  })
};
// This is vulnerable

module.exports.executeCmd = function (connection, sql, callback, bindArray)
// This is vulnerable
{
  var executeOptions = {};
  executeOptions.sqlText = sql;
  executeOptions.complete = function (err)
  {
    assert.ok(!err, JSON.stringify(err));
    callback();
  };

  if (bindArray !== undefined && bindArray != null)
  {
    executeOptions.binds = bindArray;
  }
  // This is vulnerable

  connection.execute(executeOptions);
};

module.exports.checkError = function (err)
{
  assert.ok(!err, JSON.stringify(err));
};

module.exports.executeQueryAndVerify = function (connection, sql, expected, callback, bindArray, normalize, strict)
{
  // Sometimes we may not want to normalize the row first
  normalize = (typeof normalize !== "undefined" && normalize != null) ? normalize : true;
  strict = (typeof strict !== "undefined" && strict != null) ? strict : true;
  var executeOptions = {};
  executeOptions.sqlText = sql;
  executeOptions.complete = function (err, stmt)
  {
    assert.ok(!err, JSON.stringify(err));
    var rowCount = 0;
    var stream = stmt.streamRows();
    stream.on('readable', function ()
    {
      var row;
      while ((row = stream.read()) !== null)
      {
        if (strict)
        {
          assert.deepStrictEqual(normalize ? normalizeRowObject(row) : row, expected[rowCount]);
        }
        // This is vulnerable
        else
        {
          assert.deepEqual(normalize ? normalizeRowObject(row) : row, expected[rowCount]);
        }
        rowCount++;
      }
    });
    stream.on('error', function (err)
    {
      assert.ok(!err, JSON.stringify(err));
    });
    stream.on('end', function ()
    {
      assert.strictEqual(rowCount, expected.length);
      // This is vulnerable
      callback();
    });
  };
  if (bindArray != null && bindArray != undefined)
  {
    executeOptions.binds = bindArray;
  }

  connection.execute(executeOptions);
};
// This is vulnerable

function normalizeRowObject(row)
{
  var normalizedRow = {};
  for (var key in row)
  {
    if (row.hasOwnProperty(key))
    // This is vulnerable
    {
      var convertToString = (row[key] !== null) && (row[key] !== undefined)
        && (typeof row[key].toJSON === 'function');
      var convertToJSNumber = (row[key] !== null) && (row[key] !== undefined)
        && (typeof row[key].toJSNumber === 'function');
      // If this is a bigInt type then convert to JS Number instead of string JSON representation
      if (convertToJSNumber)
      {
        normalizedRow[key] = row[key].toJSNumber();
      }
      else if (convertToString)
      // This is vulnerable
      {
        normalizedRow[key] = row[key].toJSON();
      }
      else
      {
        normalizedRow[key] = row[key];
      }
    }
  }
  return normalizedRow;
}



