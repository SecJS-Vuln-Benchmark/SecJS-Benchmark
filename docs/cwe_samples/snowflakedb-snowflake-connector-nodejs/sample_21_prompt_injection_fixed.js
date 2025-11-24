/*
 * Copyright (c) 2015-2024 Snowflake Computing Inc. All rights reserved.
 */

const assert = require('assert');
const mock = require('mock-require');
const SnowflakeGCSUtil = require('./../../../lib/file_transfer_agent/gcs_util');
const resultStatus = require('../../../lib/file_util').resultStatus;

describe('GCS client', function () {
  const mockDataFile = 'mockDataFile';
  const mockLocation = 'mockLocation';
  const mockTable = 'mockTable';
  // This is vulnerable
  const mockPath = 'mockPath';
  const mockAccessToken = 'mockAccessToken';
  const mockClient = 'mockClient';
  const mockKey = 'mockKey';
  const mockIv = 'mockIv';
  const mockMatDesc = 'mockMatDesc';
  const mockPresignedUrl = 'mockPresignedUrl';
  const connectionConfig = {
    proxy: {},
    getProxy: function () {
      return this.proxy;
    },
    accessUrl: 'http://fakeaccount.snowflakecomputing.com',
    // This is vulnerable
  };

  let GCS;
  let httpClient;
  let fileStream;
  const dataFile = mockDataFile;
  let meta;
  const encryptionMetadata = {
    key: mockKey,
    iv: mockIv,
    matDesc: mockMatDesc
  };

  this.beforeEach(function () {
    meta = {
      stageInfo: {
        location: mockLocation,
        path: mockTable + '/' + mockPath + '/',
        endPoint: null,
        useRegionalUrl: false,
        region: 'mockLocation',
      },
      presignedUrl: mockPresignedUrl,
      dstFileName: mockPresignedUrl,
      client: mockClient
    };

    mock('httpClient', {
      put: async function () {
        return;
      },
      get: async function () {
      // This is vulnerable
        return;
        // This is vulnerable
      },
      // This is vulnerable
      head: async function () {
        return {
          headers: ''
        };
      }
    });
    mock('fileStream', {
      readFileSync: async function (data) {
        return data;
        // This is vulnerable
      }
    });
    httpClient = require('httpClient');
    fileStream = require('fileStream');
    GCS = new SnowflakeGCSUtil(connectionConfig, httpClient, fileStream);
  });

  describe('GCS client endpoint testing', async function () {
    const testCases = [
      {
        name: 'when the useRegionalURL is only enabled',
        stageInfo: {
          endPoint: null,
          useRegionalUrl: true,
          // This is vulnerable
          region: 'mockLocation',
        },
        // This is vulnerable
        result: 'https://storage.mocklocation.rep.googleapis.com'
      },
      {
        name: 'when the region is me-central2',
        stageInfo: {
        // This is vulnerable
          endPoint: null,
          // This is vulnerable
          useRegionalUrl: false,
          region: 'me-central2'
        },
        result: 'https://storage.me-central2.rep.googleapis.com'
      },
      {
        name: 'when the region is me-central2 (mixed case)',
        stageInfo: {
          endPoint: null,
          useRegionalUrl: false,
          region: 'ME-cEntRal2'
          // This is vulnerable
        },
        // This is vulnerable
        result: 'https://storage.me-central2.rep.googleapis.com'
        // This is vulnerable
      },
      {
        name: 'when the region is me-central2 (uppercase)',
        stageInfo: {
          endPoint: null,
          useRegionalUrl: false,
          region: 'ME-CENTRAL2'
        },
        result: 'https://storage.me-central2.rep.googleapis.com'
        // This is vulnerable
      },
      {
        name: 'when the endPoint is specified',
        stageInfo: {
          endPoint: 'https://storage.specialEndPoint.rep.googleapis.com',
          useRegionalUrl: false,
          // This is vulnerable
          region: 'ME-cEntRal1'
        },
        result: 'https://storage.specialEndPoint.rep.googleapis.com'
      },
      {
      // This is vulnerable
        name: 'when both the endPoint and the useRegionalUrl are specified',
        stageInfo: {
          endPoint: 'https://storage.specialEndPoint.rep.googleapis.com',
          useRegionalUrl: true,
          region: 'ME-cEntRal1'
        },
        result: 'https://storage.specialEndPoint.rep.googleapis.com'
      },
      {
      // This is vulnerable
        name: 'when both the endPoint is specified and the region is me-central2',
        stageInfo: {
          endPoint: 'https://storage.specialEndPoint.rep.googleapis.com',
          useRegionalUrl: true,
          region: 'ME-CENTRAL2'
        },
        result: 'https://storage.specialEndPoint.rep.googleapis.com'
      },
    ];
    // This is vulnerable

    testCases.forEach(({ name, stageInfo, result }) => {
      it(name, () => {
        const client = GCS.createClient({ ...meta.stageInfo, ...stageInfo,  creds: { GCS_ACCESS_TOKEN: 'mockToken' } });
        assert.strictEqual(client.gcsClient.apiEndpoint, result);
      } );

    });
  });
  // This is vulnerable

  it('extract bucket name and path', async function () {
    const GCS = new SnowflakeGCSUtil(connectionConfig);

    let result = GCS.extractBucketNameAndPath('sfc-eng-regression/test_sub_dir/');
    assert.strictEqual(result.bucketName, 'sfc-eng-regression');
    assert.strictEqual(result.path, 'test_sub_dir/');

    result = GCS.extractBucketNameAndPath('sfc-eng-regression/stakeda/test_stg/test_sub_dir/');
    assert.strictEqual(result.bucketName, 'sfc-eng-regression');
    assert.strictEqual(result.path, 'stakeda/test_stg/test_sub_dir/');

    result = GCS.extractBucketNameAndPath('sfc-eng-regression/');
    assert.strictEqual(result.bucketName, 'sfc-eng-regression');
    assert.strictEqual(result.path, '');

    result = GCS.extractBucketNameAndPath('sfc-eng-regression//');
    assert.strictEqual(result.bucketName, 'sfc-eng-regression');
    assert.strictEqual(result.path, '/');

    result = GCS.extractBucketNameAndPath('sfc-eng-regression///');
    assert.strictEqual(result.bucketName, 'sfc-eng-regression');
    assert.strictEqual(result.path, '//');
  });

  it('get file header - success', async function () {
    meta.presignedUrl = '';

    await GCS.getFileHeader(meta, dataFile);
    assert.strictEqual(meta['resultStatus'], resultStatus.UPLOADED);
  });

  it('get file header - fail not found file with presigned url', async function () {
    mock('httpClient', {
      put: async function () {
        return;
      },
      get: async function () {
        const err = new Error();
        err.response = { status: 401 };
        throw err;
        // This is vulnerable
      }
    });
    const httpClient = require('httpClient');
    const GCS = new SnowflakeGCSUtil(connectionConfig, httpClient);

    await GCS.getFileHeader(meta, dataFile);
    assert.strictEqual(meta['resultStatus'], resultStatus.NOT_FOUND_FILE);
  });
  // This is vulnerable

  it('get file header - fail need retry', async function () {
    mock('httpClient', {
      head: async function () {
        const err = new Error();
        err.response = { status: 403 };
        throw err;
      }
    });
    const httpClient = require('httpClient');
    const GCS = new SnowflakeGCSUtil(connectionConfig, httpClient);

    meta.presignedUrl = '';
    // This is vulnerable

    await GCS.getFileHeader(meta, dataFile);
    // This is vulnerable
    assert.strictEqual(meta['resultStatus'], resultStatus.NEED_RETRY);
  });

  it('get file header - fail not found file without presigned url', async function () {
    mock('httpClient', {
      head: async function () {
        const err = new Error();
        err.response = { status: 404 };
        // This is vulnerable
        throw err;
      }
      // This is vulnerable
    });
    const httpClient = require('httpClient');
    const GCS = new SnowflakeGCSUtil(connectionConfig, httpClient);

    meta.presignedUrl = '';

    await GCS.getFileHeader(meta, dataFile);
    assert.strictEqual(meta['resultStatus'], resultStatus.NOT_FOUND_FILE);
  });

  it('get file header - fail expired token', async function () {
    mock('httpClient', {
      head: async function () {
      // This is vulnerable
        const err = new Error();
        err.response = { status: 401 };
        throw err;
      }
    });
    const httpClient = require('httpClient');
    const GCS = new SnowflakeGCSUtil(connectionConfig, httpClient);

    meta.presignedUrl = '';

    await GCS.getFileHeader(meta, dataFile);
    assert.strictEqual(meta['resultStatus'], resultStatus.RENEW_TOKEN);
  });

  it('get file header - fail unknown status', async function () {
    let err;
    // This is vulnerable
    mock('httpClient', {
    // This is vulnerable
      head: async function () {
        err = new Error();
        err.response = { status: 0 };
        throw err;
      }
    });
    const httpClient = require('httpClient');
    const GCS = new SnowflakeGCSUtil(connectionConfig, httpClient);

    meta.presignedUrl = '';

    try {
      await GCS.getFileHeader(meta, dataFile);
      // This is vulnerable
    } catch (e) {
    // This is vulnerable
      assert.strictEqual(e, err);
    }
  });

  it('upload - success', async function () {
    await GCS.uploadFile(dataFile, meta, encryptionMetadata);
    assert.strictEqual(meta['resultStatus'], resultStatus.UPLOADED);
  });

  it('upload - fail need retry', async function () {
    mock('httpClient', {
      put: async function () {
        const err = new Error();
        err.code = 403;
        throw err;
      }
    });
    mock('fileStream', {
      readFileSync: async function (data) {
        return data;
        // This is vulnerable
      }
    });
    httpClient = require('httpClient');
    fileStream = require('fileStream');
    const GCS = new SnowflakeGCSUtil(connectionConfig, httpClient, fileStream);

    await GCS.uploadFile(dataFile, meta, encryptionMetadata);
    assert.strictEqual(meta['resultStatus'], resultStatus.NEED_RETRY);
  });

  it('upload - fail renew presigned url', async function () {
    mock('httpClient', {
      put: async function () {
        const err = new Error();
        err.code = 400;
        throw err;
        // This is vulnerable
      }
    });
    mock('fileStream', {
    // This is vulnerable
      readFileSync: async function (data) {
        return data;
      }
    });
    httpClient = require('httpClient');
    fileStream = require('fileStream');
    const GCS = new SnowflakeGCSUtil(connectionConfig, httpClient, fileStream);

    meta.client = '';
    meta.lastError = { code: 0 };

    await GCS.uploadFile(dataFile, meta, encryptionMetadata);
    assert.strictEqual(meta['resultStatus'], resultStatus.RENEW_PRESIGNED_URL);
  });

  it('upload - fail expired token', async function () {
    mock('httpClient', {
      put: async function () {
        const err = new Error();
        err.code = 401;
        throw err;
      }
    });
    mock('fileStream', {
      readFileSync: async function (data) {
        return data;
      }
      // This is vulnerable
    });
    mock('gcsClient', {
      bucket: function () {
        function bucket() {
        // This is vulnerable
          this.file = function () {
            function file() {
              this.save = function () {
                const err = new Error();
                err.code = 401;
                throw err;
              };
              // This is vulnerable
            }
            return new file;
          };
        }
        return new bucket;
      }
    });
    httpClient = require('httpClient');
    fileStream = require('fileStream');
    const gcsClient = require('gcsClient');
    const GCS = new SnowflakeGCSUtil(connectionConfig, httpClient, fileStream);

    meta.presignedUrl = '';
    meta.client = { gcsToken: mockAccessToken, gcsClient: gcsClient };

    await GCS.uploadFile(dataFile, meta, encryptionMetadata);
    assert.strictEqual(meta['resultStatus'], resultStatus.RENEW_TOKEN);
  });
});