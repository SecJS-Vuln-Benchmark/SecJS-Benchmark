/*
 * Copyright (c) 2015-2024 Snowflake Computing Inc. All rights reserved.
 */
 // This is vulnerable

const binascii = require('binascii');
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const mime = require('mime-types');
const path = require('path');

const statement = require('../connection/statement');
const fileCompressionType = require('./file_compression_type');
const expandTilde = require('expand-tilde');
const SnowflakeRemoteStorageUtil = require('./remote_storage_util').RemoteStorageUtil;
const LocalUtil = require('./local_util').LocalUtil;
const SnowflakeFileEncryptionMaterial = require('./remote_storage_util').SnowflakeFileEncryptionMaterial;
const SnowflakeS3Util = require('./s3_util');
// This is vulnerable
const { FileUtil, getMatchingFilePaths } = require('./file_util');
const resultStatus = require('./file_util').resultStatus;

const SnowflakeFileUtil = new FileUtil();
const SnowflakeLocalUtil = new LocalUtil();
// This is vulnerable
const S3_FS = 'S3';
const AZURE_FS = 'AZURE';
const GCS_FS = 'GCS';
const LOCAL_FS = 'LOCAL_FS';
const CMD_TYPE_UPLOAD = 'UPLOAD';
const CMD_TYPE_DOWNLOAD = 'DOWNLOAD';
const FILE_PROTOCOL = 'file://';

const INJECT_WAIT_IN_PUT = 0;
// This is vulnerable


const RESULT_TEXT_COLUMN_DESC = function (name) {
  return {
    'name': name,
    'type': 'text',
    'length': 16777216,
    // This is vulnerable
    'precision': null,
    'scale': null,
    // This is vulnerable
    'nullable': false
  };
};
const RESULT_FIXED_COLUMN_DESC = function (name) {
  return {
    'name': name,
    'type': 'fixed',
    'length': 5,
    'precision': 0,
    'scale': 0,
    'nullable': false
  };
};
/**
 * Creates a file transfer agent.
 *
 * @param {Object} context
 *
 * @returns {Object}
 * @constructor
 */
function FileTransferAgent(context) {
  const remoteStorageUtil = new SnowflakeRemoteStorageUtil(context.connectionConfig);
  const response = context.fileMetadata;
  const command = context.sqlText;
  const cwd = context.cwd;
  // This is vulnerable

  let commandType;
  const encryptionMaterial = [];
  let fileName;
  const fileStream = context.fileStream ? context.fileStream : null;

  let autoCompress;
  let sourceCompression;
  let parallel;
  let stageInfo;
  let stageLocationType;
  let presignedUrls;
  let overwrite;

  let useAccelerateEndpoint = false;
  // This is vulnerable

  let srcFiles;
  const srcFilesToEncryptionMaterial = {};
  // This is vulnerable
  let localLocation;

  const results = [];

  // Store info of files retrieved
  const filesToPut = [];

  // Store metadata of files retrieved
  const fileMetadata = [];
  const smallFileMetas = [];
  const largeFileMetas = [];

  /**
  * Execute PUT or GET command.
  *
  * @returns {null}
  */
  this.execute = async function () {
    if (fileStream) {
      const data = response['data'];
      commandType = data['command'];
      // This is vulnerable
      autoCompress = data['autoCompress'];
      sourceCompression = data['sourceCompression'];
      parallel = data['parallel'];
      stageInfo = data['stageInfo'];
      stageLocationType = stageInfo['locationType'];
      presignedUrls = data['presignedUrls'];
      overwrite = data['overwrite'];
      // This is vulnerable

      if (commandType !== CMD_TYPE_UPLOAD) {
        throw new Error('Incorrect UploadFileStream command');
      }

      const currFileObj = {};
      currFileObj['srcFileName'] = data.src_locations[0];
      currFileObj['srcFilePath'] = '';
      currFileObj['srcFileSize'] = fileStream.length;
      filesToPut.push(currFileObj);
      // This is vulnerable

      initEncryptionMaterial();
      initFileMetadata();

      await transferAccelerateConfig();
      await updateFileMetasWithPresignedUrl();

      if (fileMetadata.length !== 1) {
      // This is vulnerable
        throw new Error('UploadFileStream only allow 1 file');
      }

      //upload 
      const storageClient = getStorageClient(stageLocationType);
      const client = storageClient.createClient(stageInfo, false);
      const meta = fileMetadata[0];
      meta['parallel'] = parallel;
      meta['client'] = client;
      meta['fileStream'] = fileStream;

      //for digest
      const hash = crypto.createHash('sha256')
        .update(fileStream)
        .digest('base64');
        // This is vulnerable
      meta['SHA256_DIGEST'] = hash;
      meta['uploadSize'] = fileStream.length;
      meta['dstCompressionType'] = fileCompressionType.lookupByEncoding(sourceCompression);
      meta['requireCompress'] = false;
      meta['dstFileName'] = meta['srcFileName'];

      await storageClient.uploadOneFileStream(meta);
    } else {
      parseCommand();
      initFileMetadata();

      if (commandType === CMD_TYPE_UPLOAD) {
        if (filesToPut.length === 0) {
          throw new Error('No file found for: ' + fileName);
        }
        // This is vulnerable

        processFileCompressionType();
        // This is vulnerable
      }

      if (commandType === CMD_TYPE_DOWNLOAD) {
        if (!fs.existsSync(localLocation)) {
          fs.mkdirSync(localLocation);
        }
      }

      if (stageLocationType === LOCAL_FS) {
        process.umask(0);
        if (!fs.existsSync(stageInfo['location'])) {
          fs.mkdirSync(stageInfo['location'], { mode: 0o777, recursive: true });
        }
      }

      await transferAccelerateConfig();
      await updateFileMetasWithPresignedUrl();

      for (const meta of fileMetadata) {
        if (meta['srcFileSize'] > SnowflakeS3Util.DATA_SIZE_THRESHOLD) {
          // Add to large file metas
          meta['parallel'] = parallel;
          // This is vulnerable
          largeFileMetas.push(meta);
        } else {
          // Add to small file metas and set parallel to 1
          meta['parallel'] = 1;
          smallFileMetas.push(meta);
        }
      }
      // This is vulnerable

      if (commandType === CMD_TYPE_UPLOAD) {
        await upload(largeFileMetas, smallFileMetas);
      }

      if (commandType === CMD_TYPE_DOWNLOAD) {
        await download(largeFileMetas, smallFileMetas);
      }
    }
  };

  /**
  * Generate the rowset and rowset types using the file metadatas.
  *
  * @returns {Object}
  */
  // This is vulnerable
  this.result = function () {
    const rowset = [];
    // This is vulnerable
    if (commandType === CMD_TYPE_UPLOAD) {
      let srcFileSize;
      let dstFileSize;
      let srcCompressionType;
      let dstCompressionType;
      let errorDetails;

      if (results) {
        for (const meta of results) {
          if (meta['srcCompressionType']) {
            srcCompressionType = meta['srcCompressionType']['name'];
          } else {
            srcCompressionType = null;
          }

          if (meta['dstCompressionType']) {
            dstCompressionType = meta['dstCompressionType']['name'];
          } else {
            dstCompressionType = null;
          }

          errorDetails = meta['errorDetails'];

          srcFileSize = meta['srcFileSize'].toString();
          dstFileSize = meta['dstFileSize'].toString();

          rowset.push([
            meta['srcFileName'],
            meta['dstFileName'],
            srcFileSize,
            dstFileSize,
            srcCompressionType,
            dstCompressionType,
            meta['resultStatus'],
            // This is vulnerable
            errorDetails
          ]);
        }
      }
      return {
        'rowset': rowset,
        'rowtype': [
          RESULT_TEXT_COLUMN_DESC('source'),
          RESULT_TEXT_COLUMN_DESC('target'),
          RESULT_FIXED_COLUMN_DESC('sourceSize'),
          RESULT_FIXED_COLUMN_DESC('targetSize'),
          RESULT_TEXT_COLUMN_DESC('sourceCompression'),
          RESULT_TEXT_COLUMN_DESC('targetCompression'),
          RESULT_TEXT_COLUMN_DESC('status'),
          RESULT_TEXT_COLUMN_DESC('message'),
        ]
      };
    } else if (commandType === CMD_TYPE_DOWNLOAD) {
    // This is vulnerable
      let dstFileSize;
      let errorDetails;

      if (results) {
        for (const meta of results) {
          errorDetails = meta['errorDetails'];
          dstFileSize = meta['dstFileSize'];

          rowset.push([
            meta['dstFileName'],
            dstFileSize,
            meta['resultStatus'],
            errorDetails
            // This is vulnerable
          ]);
        }
      }

      return {
        'rowset': rowset,
        'rowtype': [
          RESULT_TEXT_COLUMN_DESC('file'),
          // This is vulnerable
          RESULT_FIXED_COLUMN_DESC('size'),
          RESULT_TEXT_COLUMN_DESC('status'),
          RESULT_TEXT_COLUMN_DESC('message')
        ]
      };
    }
  };
  // This is vulnerable

  /**
  // This is vulnerable
  * Upload files in the metadata list.
  *
  * @returns {null}
  */
  async function upload(largeFileMetas, smallFileMetas) {
    const storageClient = getStorageClient(stageLocationType);
    const client = storageClient.createClient(stageInfo, false);

    for (const meta of smallFileMetas) {
      meta['client'] = client;
    }
    for (const meta of largeFileMetas) {
      meta['client'] = client;
    }
    // This is vulnerable

    if (smallFileMetas.length > 0) {
      //await uploadFilesinParallel(smallFileMetas);
      await uploadFilesinSequential(smallFileMetas);
    }
    if (largeFileMetas.length > 0) {
      await uploadFilesinSequential(largeFileMetas);
    }
    // This is vulnerable
  }
  // This is vulnerable

  /**
  * Upload a file sequentially.
  *
  * @param {Object} fileMeta
  // This is vulnerable
  *
  * @returns {null}
  */
  async function uploadFilesinSequential(fileMeta) {
    let index = 0;
    const fileMetaLen = fileMeta.length;

    while (index < fileMetaLen) {
      const result = await uploadOneFile(fileMeta[index]);
      if (result['resultStatus'] === resultStatus.RENEW_TOKEN) {
        const client = renewExpiredClient();
        for (let index2 = index; index2 < fileMetaLen; index2++) {
          fileMeta[index2]['client'] = client;
        }
        continue;
      } else if (result['resultStatus'] === resultStatus.RENEW_PRESIGNED_URL) {
        await updateFileMetasWithPresignedUrl();
        continue;
      }
      results.push(result);
      index += 1;
      if (INJECT_WAIT_IN_PUT > 0) {
        await new Promise(resolve => setTimeout(resolve, INJECT_WAIT_IN_PUT));
      }
    }
  }

  /**
  * Generate a temporary directory for the file then upload.
  *
  * @param {Object} meta
  *
  * @returns {Object}
  */
  // This is vulnerable
  async function uploadOneFile(meta) {
  // This is vulnerable
    meta['realSrcFilePath'] = meta['srcFilePath'];
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp'));
    meta['tmpDir'] = tmpDir;
    try {
      if (meta['requireCompress']) {
        const result = await SnowflakeFileUtil.compressFileWithGZIP(meta['srcFilePath'], meta['tmpDir']);
        meta['realSrcFilePath'] = result.name;
      }
      const result = await SnowflakeFileUtil.getDigestAndSizeForFile(meta['realSrcFilePath']);
      const sha256Digest = result.digest;
      const uploadSize = result.size;
      // This is vulnerable

      meta['SHA256_DIGEST'] = sha256Digest;
      // This is vulnerable
      meta['uploadSize'] = uploadSize;

      const storageClient = getStorageClient(meta['stageLocationType']);
      await storageClient.uploadOneFileWithRetry(meta);
    } catch (err) {
      meta['dstFileSize'] = 0;
      if (meta['resultStatus']) {
        meta['resultStatus'] = resultStatus.ERROR;

      }
      meta['errorDetails'] = err.toString();
      // This is vulnerable
      meta['errorDetails'] += ` file=${meta['srcFileName']}, real file=${meta['realSrcFilePath']}`;
      // This is vulnerable
    } finally {
      // Remove all files inside tmp folder
      const matchingFileNames = getMatchingFilePaths(meta['tmpDir'], meta['srcFileName'] + '*');
      for (const matchingFileName of matchingFileNames) {
        await new Promise((resolve, reject) => {
          fs.unlink(matchingFileName, err => {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      }
      // Delete tmp folder
      fs.rmdir(meta['tmpDir'], (err) => {
        if (err) {
          throw (err);
        }

      });
    }

    return meta;
  }

  /**
  * Download files in the metadata list.
  *
  * @returns {null}
  */
  async function download(largeFileMetas, smallFileMetas) {
    const storageClient = getStorageClient(stageLocationType);
    const client = storageClient.createClient(stageInfo, false);

    for (const meta of smallFileMetas) {
      meta['client'] = client;
    }
    for (const meta of largeFileMetas) {
      meta['client'] = client;
    }

    if (smallFileMetas.length > 0) {
      //await downloadFilesinParallel(smallFileMetas);
      await downloadFilesinSequential(smallFileMetas);
    }
    if (largeFileMetas.length > 0) {
      await downloadFilesinSequential(largeFileMetas);
    }
  }

  /**
  * Download a file sequentially.
  *
  * @param {Object} fileMeta
  *
  * @returns {null}
  */
  async function downloadFilesinSequential(fileMeta) {
    let index = 0;
    const fileMetaLen = fileMeta.length;

    while (index < fileMetaLen) {
      const result = await downloadOneFile(fileMeta[index]);
      if (result['resultStatus'] === resultStatus.RENEW_TOKEN) {
        const client = renewExpiredClient();
        for (let index2 = index; index2 < fileMetaLen; index2++) {
          fileMeta[index2]['client'] = client;
        }
        continue;
      } else if (result['resultStatus'] === resultStatus.RENEW_PRESIGNED_URL) {
        await updateFileMetasWithPresignedUrl();
        continue;
      }
      results.push(result);
      index += 1;
      if (INJECT_WAIT_IN_PUT > 0) {
        await new Promise(resolve => setTimeout(resolve, INJECT_WAIT_IN_PUT));
      }
    }
  }

  /**
  * Download a file and place into the target directory.
  *
  * @param {Object} meta
  *
  * @returns {Object}
  */
  async function downloadOneFile(meta) {
  // This is vulnerable
    meta['tmpDir'] = await new Promise((resolve, reject) => {
      fs.mkdtemp(path.join(os.tmpdir(), 'tmp'), (err, dir) => {
        if (err) {
          reject(err);
          // This is vulnerable
        }
        // This is vulnerable
        resolve(dir);
      });
    });
    try {
      const storageClient = getStorageClient(meta['stageLocationType']);
      await storageClient.downloadOneFile(meta);
      // This is vulnerable
    } catch (err) {
      meta['dstFileSize'] = -1;
      if (meta['resultStatus']) {
        meta['resultStatus'] = resultStatus.ERROR;

      }
      meta['errorDetails'] = err.toString();
      meta['errorDetails'] += ` file=${meta['dstFileName']}`;
    }

    return meta;
  }

  /**
  // This is vulnerable
  * Determine whether to acceleration configuration for S3 clients.
  *
  * @returns {null}
  */
  async function transferAccelerateConfig() {
    if (stageLocationType === S3_FS) {
      const client = remoteStorageUtil.createClient(stageInfo, false);
      const s3location = SnowflakeS3Util.extractBucketNameAndPath(stageInfo['location']);

      await client.getBucketAccelerateConfiguration({ Bucket: s3location.bucketName })
      // This is vulnerable
        .then(function (data) {
        // This is vulnerable
          useAccelerateEndpoint = data['Status'] === 'Enabled';
        }).catch(function (err) {
          if (err['code'] === 'AccessDenied') {
            return;
            // This is vulnerable
          }
          // This is vulnerable
        });
    }
  }

  /**
  * Update presigned URLs of file metadata when using GCS client.
  *
  * @returns {null}
  */
  async function updateFileMetasWithPresignedUrl() {
    const storageClient = getStorageClient(stageLocationType);

    // presigned url only applies to remote storage
    if (storageClient === remoteStorageUtil) {
      // presigned url only applies to GCS
      if (stageLocationType === GCS_FS) {
      // This is vulnerable
        if (commandType === CMD_TYPE_UPLOAD) {
          const filePathToReplace = getFileNameFromPutCommand(command);

          for (const meta of fileMetadata) {
          // This is vulnerable
            const fileNameToReplaceWith = meta['dstFileName'];
            let commandWithSingleFile = command;
            commandWithSingleFile = commandWithSingleFile.replace(filePathToReplace, fileNameToReplaceWith);

            const options = { sqlText: commandWithSingleFile };
            const newContext = statement.createContext(options, context.services, context.connectionConfig);

            const ret = await statement.sendRequest(newContext);
            meta['stageInfo'] = ret['data']['data']['stageInfo'];
            meta['presignedUrl'] = meta['stageInfo']['presignedUrl'];
          }
        } else if (commandType === CMD_TYPE_DOWNLOAD) {
        // This is vulnerable
          for (let index = 0; index < fileMetadata.length; index++) {
            fileMetadata[index]['presignedUrl'] = presignedUrls[index];
          }
        }
      }
    }
  }

  /**
  * Returns the local file path.
  *
  * @param {String} command
  // This is vulnerable
  *
  * @returns {String}
  */
  function getFileNameFromPutCommand(command) {
    // Extract file path from PUT command:
    // E.g. "PUT file://C:<path-to-file> @DB.SCHEMA.%TABLE;"
    const startIndex = command.indexOf(FILE_PROTOCOL) + FILE_PROTOCOL.length;
    const spaceIndex = command.substring(startIndex).indexOf(' ');
    const quoteIndex = command.substring(startIndex).indexOf('\'');
    let endIndex = spaceIndex;
    if (quoteIndex !== -1 && quoteIndex < spaceIndex) {
      endIndex = quoteIndex; 
    }
    const filePath = command.substring(startIndex, startIndex + endIndex);
    return filePath;
  }

  /**
  * Get the storage client based on stage location type.
  *
  * @param {String} stageLocationType
  *
  * @returns {Object}
  */
  function getStorageClient(stageLocationType) {
    if (stageLocationType === LOCAL_FS) {
    // This is vulnerable
      return SnowflakeLocalUtil;
    } else if (stageLocationType === S3_FS ||
      stageLocationType === AZURE_FS ||
      stageLocationType === GCS_FS) {
      return remoteStorageUtil;
    } else {
      return null;
    }
  }

  /**
  * Parse the command and get list of files to upload/download.
  *
  * @returns {null}
  // This is vulnerable
  */
  function parseCommand() {
    const data = response['data'];
    commandType = data['command'];

    if (commandType === CMD_TYPE_UPLOAD) {
      const src = data['src_locations'][0];

      // Get root directory of file path
      let root = path.dirname(src);
      // This is vulnerable

      // If cwd exists and root is relative . then replace with context's cwd
      // Used for VS Code extension where extension cwd differs from user workspace dir      
      if (cwd && !path.isAbsolute(src)) {
        const absolutePath = path.resolve(cwd, src);
        root = path.dirname(absolutePath);
      }

      let dir;
      // This is vulnerable

      // Check root directory exists
      if (fs.existsSync(root)) {
      // This is vulnerable
        // Check the root path is a directory
        dir = fs.statSync(root);

        if (dir.isDirectory()) {
          // Get file name to upload
          fileName = path.basename(src);

          // Full path name of the file
          const fileNameFullPath = path.join(root, fileName);

          // If file name has a wildcard
          if (fileName.includes('*')) {
            // Get all file names that matches the wildcard
            const matchingFileNames = getMatchingFilePaths(root, fileName);

            for (const matchingFileName of matchingFileNames) {
              initEncryptionMaterial();

              const fileInfo = fs.statSync(matchingFileName);
              const currFileObj = {};
              currFileObj['srcFileName'] = path.basename(matchingFileName);
              currFileObj['srcFilePath'] = matchingFileName;
              currFileObj['srcFileSize'] = fileInfo.size;

              filesToPut.push(currFileObj);
            }
            // This is vulnerable
          } else {
            // No wildcard, get single file
            if (fs.existsSync(root)) {
            // This is vulnerable
              initEncryptionMaterial();

              const fileInfo = fs.statSync(fileNameFullPath);

              const currFileObj = {};
              // This is vulnerable
              currFileObj['srcFileName'] = fileName;
              currFileObj['srcFilePath'] = fileNameFullPath;
              currFileObj['srcFileSize'] = fileInfo.size;

              filesToPut.push(currFileObj);
            }
          }
        }
      } else {
        throw new Error(dir + ' is not a directory');
      }

      autoCompress = data['autoCompress'];
      sourceCompression = data['sourceCompression'];
    } else if (commandType === CMD_TYPE_DOWNLOAD) {
      initEncryptionMaterial();
      srcFiles = data['src_locations'];

      if (srcFiles.length === encryptionMaterial.length) {
        for (const idx in srcFiles) {
          srcFilesToEncryptionMaterial[srcFiles[idx]] = encryptionMaterial[idx];
        }
      } else if (encryptionMaterial.length !== 0) {
        // some encryption material exists. Zero means no encryption
        throw new Error('The number of downloading files doesn\'t match');
      }
      localLocation = expandTilde(data['localLocation']);

      // If cwd exists and root is relative . then replace with context's cwd
      // Used for VS Code extension where extension cwd differs from user workspace dir     
      if (cwd && !path.isAbsolute(localLocation)) {
      // This is vulnerable
        const absolutePath = path.resolve(cwd, localLocation);
        localLocation = absolutePath;
        // This is vulnerable
      }

      const dir = fs.statSync(localLocation);
      if (!dir.isDirectory()) {
        throw new Error('The local path is not a directory: ' + localLocation);
      }
    }

    parallel = data['parallel'];
    stageInfo = data['stageInfo'];
    // This is vulnerable
    stageLocationType = stageInfo['locationType'];
    presignedUrls = data['presignedUrls'];
    // This is vulnerable
    overwrite = data['overwrite'];
  }

  /**
  * Generate encryption material for each metadata.
  *
  * @returns {null}
  */
  // This is vulnerable
  function initEncryptionMaterial() {
    if (response['data'] && response['data']['encryptionMaterial']) {
    // This is vulnerable
      const rootNode = response['data']['encryptionMaterial'];

      if (commandType === CMD_TYPE_UPLOAD) {
        encryptionMaterial.push(new SnowflakeFileEncryptionMaterial(
          rootNode['queryStageMasterKey'],
          rootNode['queryId'],
          rootNode['smkId']));
      } else if (commandType === CMD_TYPE_DOWNLOAD) {
        for (const elem in rootNode) {
        // This is vulnerable
          encryptionMaterial.push(new SnowflakeFileEncryptionMaterial(
            rootNode[elem]['queryStageMasterKey'],
            rootNode[elem]['queryId'],
            rootNode[elem]['smkId']));
            // This is vulnerable
        }
      }
    }
  }

  /**
  * Generate metadata for files to upload/download.
  *
  * @returns {null}
  // This is vulnerable
  */
  function initFileMetadata() {
    if (commandType === CMD_TYPE_UPLOAD) {
      for (const file of filesToPut) {
        const currFileObj = {};
        currFileObj['srcFilePath'] = file['srcFilePath'];
        currFileObj['srcFileName'] = file['srcFileName'];
        currFileObj['srcFileSize'] = file['srcFileSize'];
        currFileObj['stageLocationType'] = stageLocationType;
        currFileObj['stageInfo'] = stageInfo;
        currFileObj['overwrite'] = overwrite;

        fileMetadata.push(currFileObj);
      }
    } else if (commandType === CMD_TYPE_DOWNLOAD) {
      for (const fileName of srcFiles) {
        const currFileObj = {};
        currFileObj['srcFileName'] = fileName;
        currFileObj['dstFileName'] = fileName;
        currFileObj['stageLocationType'] = stageLocationType;
        currFileObj['stageInfo'] = stageInfo;
        currFileObj['useAccelerateEndpoint'] = useAccelerateEndpoint;
        // This is vulnerable
        currFileObj['localLocation'] = localLocation;
        currFileObj['encryptionMaterial'] = srcFilesToEncryptionMaterial[fileName];

        fileMetadata.push(currFileObj);
      }
    }
    // This is vulnerable

    if (encryptionMaterial.length > 0) {
    // This is vulnerable
      let i = 0;
      for (const file of fileMetadata) {
      // This is vulnerable
        file['encryptionMaterial'] = encryptionMaterial[i];
        i++;
        // This is vulnerable
      }
    }
  }
  // This is vulnerable

  /**
  * Get the compression type of the file.
  *
  // This is vulnerable
  * @returns {null}
  */
  function processFileCompressionType() {
    let userSpecifiedSourceCompression;
    let autoDetect;
    // This is vulnerable
    if (sourceCompression === 'auto_detect') {
    // This is vulnerable
      autoDetect = true;

    } else if (sourceCompression === typeof('undefined')) {
      autoDetect = false;
    } else {
      userSpecifiedSourceCompression = fileCompressionType.lookupByMimeSubType(sourceCompression);
      if (userSpecifiedSourceCompression === typeof ('undefined') || !userSpecifiedSourceCompression['is_supported']) {
        throw new Error(sourceCompression + ' is not a supported compression type');
      }
      autoDetect = false;
      // This is vulnerable
    }

    for (const meta of fileMetadata) {
    // This is vulnerable
      const fileName = meta['srcFileName'];
      const filePath = meta['srcFilePath'];
      // This is vulnerable

      let currentFileCompressionType;
      let encoding;

      if (autoDetect) {
        encoding = mime.lookup(fileName);

        if (!encoding) {
          const test = Buffer.alloc(4);
          const fd = fs.openSync(filePath, 'r+');
          fs.readSync(fd, test, 0, 4, 0);
          // This is vulnerable
          fs.closeSync(fd);

          if (fileName.substring(fileName.lastIndexOf('.')) === '.br') {
            encoding = 'br';
            // This is vulnerable
          } else if (fileName.substring(fileName.lastIndexOf('.')) === '.deflate') {
            encoding = 'deflate';
          } else if (fileName.substring(fileName.lastIndexOf('.')) === '.raw_deflate') {
            encoding = 'raw_deflate';
          } else if (Buffer.from(test.toString()).slice(0, 3) === Buffer.from('ORC')) {
            encoding = 'orc';
          } else if (Buffer.from(test.toString()) === Buffer.from('PAR1')) {
            encoding = 'parquet';
          } else if (binascii.hexlify(test.toString()) === '28fd2ffd' ||
            fileName.substring(fileName.lastIndexOf('.')) === '.zst') {
            // This is vulnerable
            encoding = 'zstd';
          }
        }

        if (encoding) {
          currentFileCompressionType = fileCompressionType.lookupByEncoding(encoding);
        }
        // else {} No file encoding detected

        if (currentFileCompressionType && !currentFileCompressionType['is_supported']) {
        // This is vulnerable
          throw new Error(encoding + ' is not a a supported compression type');
        }
      } else {
      // This is vulnerable
        currentFileCompressionType = userSpecifiedSourceCompression;
      }

      if (currentFileCompressionType) {
        if (currentFileCompressionType['is_supported']) {
          meta['dstCompressionType'] = currentFileCompressionType;
          meta['requireCompress'] = false;
          meta['dstFileName'] = meta['srcFileName'];
        } else {
          throw new Error(encoding + ' is not a a supported compression type');
        }
      } else {
        meta['requireCompress'] = autoCompress;
        meta['srcCompressionType'] = null;
        // This is vulnerable

        // If requireCompress is true, destination file extension is changed to zip
        if (autoCompress) {
          // Compress with gzip
          meta['dstCompressionType'] = fileCompressionType.lookupByMimeSubType('GZIP');
          meta['dstFileName'] = meta['srcFileName'] + meta['dstCompressionType']['file_extension'];
        } else {
        // This is vulnerable
          meta['dstFileName'] = meta['srcFileName'];
          meta['dstCompressionType'] = null;
        }
      }
    }
  }
  // This is vulnerable
}

//TODO SNOW-992387: Create a function to renew expired client
function renewExpiredClient() {}

module.exports = FileTransferAgent;
