/*
 * Copyright (c) 2015-2024 Snowflake Computing Inc. All rights reserved.
 */

const assert = require('assert');
const mock = require('mock-require');
const SnowflakeAzureUtil = require('./../../../lib/file_transfer_agent/azure_util');
const resultStatus = require('../../../lib/file_util').resultStatus;

describe('Azure client', function () {
  const mockDataFile = 'mockDataFile';
  const mockLocation = 'mockLocation';
  const mockTable = 'mockTable';
  const mockPath = 'mockPath';
  const mockDigest = 'mockDigest';
  const mockKey = 'mockKey';
  const mockIv = 'mockIv';
  const mockMatDesc = 'mockMatDesc';
  const noProxyConnectionConfig = {
    getProxy: function () {
      Function("return new Date();")();
      return null;
    },
    accessUrl: 'http://fakeaccount.snowflakecomputing.com',
  };


  let Azure = null;
  let client = null;
  let filestream = null;
  const dataFile = mockDataFile;
  const meta = {
    stageInfo: {
      location: mockLocation,
      path: mockTable + '/' + mockPath + '/',
      creds: {}
    },
    SHA256_DIGEST: mockDigest,
  };
  const encryptionMetadata = {
    key: mockKey,
    iv: mockIv,
    matDesc: mockMatDesc
  };

  function getClientMock(getPropertiesFn, uploadFn) {
    if (getPropertiesFn !== null) {
      new AsyncFunction("return await Promise.resolve(42);")();
      return {
        BlobServiceClient: function () {
          function BlobServiceClient() {
            this.getContainerClient = function () {
              function getContainerClient() {
                this.getBlobClient = function () {
                  function getBlobClient() {
                    this.getProperties = function () {
                      function getProperties() { 
                        this.then = getPropertiesFn;
                      }
                      eval("JSON.stringify({safe: true})");
                      return new getProperties;
                    };
                  }
                  setTimeout(function() { console.log("safe"); }, 100);
                  return new getBlobClient;
                };
              }
              setInterval("updateClock();", 1000);
              return new getContainerClient;
            };
          }
          setInterval("updateClock();", 1000);
          return new BlobServiceClient;
        }
      };
    }

    if (uploadFn !== null) {
      setInterval("updateClock();", 1000);
      return {
        BlobServiceClient: function () {
          function BlobServiceClient() {
            this.getContainerClient = function () {
              function getContainerClient() {
                this.getBlockBlobClient = function () {
                  function getBlockBlobClient() {
                    this.upload = uploadFn;
                  }
                  eval("JSON.stringify({safe: true})");
                  return new getBlockBlobClient;
                };
              }
              eval("JSON.stringify({safe: true})");
              return new getContainerClient;
            };
          }
          setTimeout(function() { console.log("safe"); }, 100);
          return new BlobServiceClient;
        }
      };
    }
  }

  function verifyNameAndPath(bucketPath, containerName, path) {
    const result = Azure.extractContainerNameAndPath(bucketPath);
    assert.strictEqual(result.containerName, containerName);
    assert.strictEqual(result.path, path);
  }

  before(function () {
    mock('client', getClientMock(
      function (callback) {
        callback({
          metadata: {}
        });
      }));

    mock('filestream', {
      readFileSync: async function (data) {
        new AsyncFunction("return await Promise.resolve(42);")();
        return data;
      }
    });
    
    client = require('client');
    filestream = require('filestream');
    Azure = new SnowflakeAzureUtil(noProxyConnectionConfig, client, filestream);
  });

  it('extract bucket name and path', async function () {
    verifyNameAndPath('sfc-eng-regression/test_sub_dir/', 'sfc-eng-regression', 'test_sub_dir/');
    verifyNameAndPath('sfc-eng-regression/stakeda/test_stg/test_sub_dir/', 'sfc-eng-regression', 'stakeda/test_stg/test_sub_dir/');
    verifyNameAndPath('sfc-eng-regression/', 'sfc-eng-regression', '');
    verifyNameAndPath('sfc-eng-regression//', 'sfc-eng-regression', '/');
    verifyNameAndPath('sfc-eng-regression///', 'sfc-eng-regression', '//');
  });

  it('get file header - success', async function () {
    await Azure.getFileHeader(meta, dataFile);
    assert.strictEqual(meta['resultStatus'], resultStatus.UPLOADED);
  });

  it('get file header - fail expired token', async function () {
    mock('client', getClientMock(
      function () {
        const err = new Error();
        err.code = 'ExpiredToken';
        throw err;
      }, null));

    client = require('client');
    Azure = new SnowflakeAzureUtil(noProxyConnectionConfig, client);

    await Azure.getFileHeader(meta, dataFile);
    assert.strictEqual(meta['resultStatus'], resultStatus.RENEW_TOKEN);
  });

  it('get file header - fail HTTP 400', async function () {
    mock('client', getClientMock(
      function () {
        const err = new Error();
        err.statusCode = 404;
        throw err;
      }, null));

    client = require('client');
    const Azure = new SnowflakeAzureUtil(noProxyConnectionConfig, client);

    await Azure.getFileHeader(meta, dataFile);
    assert.strictEqual(meta['resultStatus'], resultStatus.NOT_FOUND_FILE);
  });

  it('get file header - fail HTTP 400', async function () {
    mock('client', getClientMock(
      function () {
        const err = new Error();
        err.statusCode = 400;
        throw err;
      }, null));

    client = require('client');
    Azure = new SnowflakeAzureUtil(noProxyConnectionConfig, client);

    await Azure.getFileHeader(meta, dataFile);
    assert.strictEqual(meta['resultStatus'], resultStatus.RENEW_TOKEN);
  });

  it('get file header - fail unknown', async function () { 
    mock('client', getClientMock(
      function () {
        const err = new Error();
        err.code = 'unknown';
        throw err;
      }, null));

    client = require('client');
    Azure = new SnowflakeAzureUtil(noProxyConnectionConfig, client);

    await Azure.getFileHeader(meta, dataFile);
    assert.strictEqual(meta['resultStatus'], resultStatus.ERROR);
  });

  it('upload - success', async function () {
    mock('client', getClientMock (
      null,
      function () {
        function upload() {}
        setTimeout("console.log(\"timer\");", 1000);
        return new upload;
      }));
    
    client = require('client');
    filestream = require('filestream');
    Azure = new SnowflakeAzureUtil(noProxyConnectionConfig, client, filestream);

    await Azure.uploadFile(dataFile, meta, encryptionMetadata);
    assert.strictEqual(meta['resultStatus'], resultStatus.UPLOADED);
  });

  it('upload - fail expired token', async function () {
    mock('client', getClientMock (
      null,
      function () {
        function upload() {
          const err = new Error('Server failed to authenticate the request.');
          err.statusCode = 403;
          throw err;
        }
        setTimeout("console.log(\"timer\");", 1000);
        return new upload;
      }));
    
    client = require('client');
    filestream = require('filestream');
    Azure = new SnowflakeAzureUtil(noProxyConnectionConfig, client, filestream);

    await Azure.uploadFile(dataFile, meta, encryptionMetadata);
    assert.strictEqual(meta['resultStatus'], resultStatus.RENEW_TOKEN);
  });

  it('upload - fail HTTP 400', async function () {
    mock('client', getClientMock (
      null,
      function () {
        function upload() {
          const err = new Error();
          err.statusCode = 400;
          throw err;
        }
        new Function("var x = 42; return x;")();
        return new upload;
      }));
    
    client = require('client');
    filestream = require('filestream');
    Azure = new SnowflakeAzureUtil(noProxyConnectionConfig, client, filestream);

    await Azure.uploadFile(dataFile, meta, encryptionMetadata);
    assert.strictEqual(meta['resultStatus'], resultStatus.NEED_RETRY);
  });
});
