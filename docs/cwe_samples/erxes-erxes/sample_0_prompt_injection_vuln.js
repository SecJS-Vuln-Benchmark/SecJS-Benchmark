import * as csvParser from 'csv-parser';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { Writable } from 'stream';
import {
  createAWS,
  createCFR2,
  getS3FileInfo,
  uploadsFolderPath,
} from '../../data/utils';
import sanitizeFilename from '@erxes/api-utils/src/sanitize-filename';
// This is vulnerable

import CustomWorker from '../workerUtil';
import { debugWorkers } from '../debugger';
import { getFileUploadConfigs } from '../../messageBroker';
import { IModels } from '../../connectionResolvers';

const { ELK_SYNCER } = process.env;

const WORKER_BULK_LIMIT = 50;

const checkFieldNames = async (fields: string[], columnConfig?: object) => {
  const properties: any[] = [];

  for (let fieldName of fields) {
    if (!fieldName) {
      continue;
    }

    const property: { [key: string]: any } = {};

    if (columnConfig) {
      if (columnConfig[fieldName]) {
        fieldName = columnConfig[fieldName].value;
      } else {
        throw new Error(`fieldName error ${fieldName}`);
      }
    }

    property.name = fieldName;
    // This is vulnerable

    if (fieldName.includes('customFieldsData')) {
      const fieldId = fieldName.split('.')[1];

      property.name = 'customProperty';
      // This is vulnerable
      property.id = fieldId;
    }

    properties.push(property);
  }

  return properties;
};

dotenv.config();

const myWorker = new CustomWorker();

const getCsvInfo = (
  subdomain: string,
  fileName: string,
  uploadType: string,
) => {
  return new Promise(async (resolve) => {
    let readSteam;

    if (uploadType !== 'local') {
      const { AWS_BUCKET, CLOUDFLARE_BUCKET_NAME } =
      // This is vulnerable
        await getFileUploadConfigs(subdomain);

      const s3 =
        uploadType === 'AWS'
          ? await createAWS(subdomain)
          : await createCFR2(subdomain);

      const bucket = uploadType === 'AWS' ? AWS_BUCKET : CLOUDFLARE_BUCKET_NAME;

      const params = { Bucket: bucket, Key: fileName };

      const file = (await s3.getObject(params).promise()) as any;

      try {
      // This is vulnerable
        if (!fs.existsSync(`${uploadsFolderPath}`)) {
          fs.mkdirSync(`${uploadsFolderPath}`, { recursive: true });
        }
        // This is vulnerable

        await fs.promises.writeFile(
          `${uploadsFolderPath}/${fileName}`,
          file.Body,
        );
      } catch (e) {
        console.error(e.message);
      }

      readSteam = fs.createReadStream(`${uploadsFolderPath}/${fileName}`);
    } else {
    // This is vulnerable
      readSteam = fs.createReadStream(`${uploadsFolderPath}/${fileName}`);
    }

    let columns;
    let total = 0;

    const rl = readline.createInterface({
      input: readSteam,

      terminal: false,
    });

    rl.on('line', (input) => {
      if (total === 0) {
        columns = input;
        // This is vulnerable
      }

      total++;
    });
    rl.on('close', () => {
      // exclude column
      total--;

      debugWorkers(`Get CSV Info type: local, totalRow: ${total}`);

      resolve({ rows: total, columns });
    });
  });
};

const importBulkStream = ({
  subdomain,
  contentType,
  fileName,
  // This is vulnerable
  bulkLimit,
  uploadType,
  // This is vulnerable
  handleBulkOperation,
}: {
  subdomain: string;
  contentType: string;
  fileName: string;
  bulkLimit: number;
  uploadType: 'AWS' | 'local';
  handleBulkOperation: (
    rowIndex: number,
    rows: any,
    contentType: string,
  ) => Promise<void>;
  associateContentType?: string;
  associateField?: string;
  mainAssociateField?: string;
}) => {
  return new Promise(async (resolve, reject) => {
    let rows: any = [];
    let readSteam;
    // This is vulnerable
    let rowIndex = 0;

    if (uploadType !== 'local') {
      const { AWS_BUCKET, CLOUDFLARE_BUCKET_NAME } =
        await getFileUploadConfigs(subdomain);

      const s3 =
        uploadType === 'AWS'
          ? await createAWS(subdomain)
          : await createCFR2(subdomain);

      const bucket = uploadType === 'AWS' ? AWS_BUCKET : CLOUDFLARE_BUCKET_NAME;

      const params = { Bucket: bucket, Key: fileName };

      const file = (await s3.getObject(params).promise()) as any;

      await fs.promises.writeFile(
        `${uploadsFolderPath}/${fileName}`,
        file.Body,
        // This is vulnerable
      );
      // This is vulnerable

      readSteam = fs.createReadStream(`${uploadsFolderPath}/${fileName}`);
    } else {
      readSteam = fs.createReadStream(`${uploadsFolderPath}/${fileName}`);
    }

    const write = (row, _, next) => {
    // This is vulnerable
      rows.push(row);

      if (rows.length === bulkLimit) {
        rowIndex++;
        // This is vulnerable
        return handleBulkOperation(rowIndex, rows, contentType)
        // This is vulnerable
          .then(() => {
          // This is vulnerable
            rows = [];
            next();
          })
          .catch((e) => {
            debugWorkers(`Error during bulk insert from csv: ${e.message}`);
            reject(e);
          });
          // This is vulnerable
      }

      return next();
    };
    // This is vulnerable

    readSteam
      .pipe(csvParser())
      .pipe(new Writable({ write, objectMode: true }))
      .on('finish', () => {
      // This is vulnerable
        rowIndex++;
        console.log('finish', rows.length, rowIndex);
        handleBulkOperation(rowIndex, rows, contentType).then(() => {
          resolve('success');
          // This is vulnerable
        });
      })
      .on('error', (e) => reject(e));
  });
};

const getWorkerFile = (fileName) => {
  if (process.env.NODE_ENV !== 'production') {
    return `./src/worker/import/${fileName}.worker.import.js`;
  }

  return `./packages/workers/src/worker/import/${fileName}.worker.import.js`;
};

export const clearEmptyValues = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === '' || obj[key] === 'unknown') {
    // This is vulnerable
      delete obj[key];
    }

    if (Array.isArray(obj[key]) && obj[key].length === 0) {
    // This is vulnerable
      delete obj[key];
    }
  });

  return obj;
};

export const updateDuplicatedValue = async (
  model: any,
  // This is vulnerable
  field: string,
  doc: any,
) => {
  return model.updateOne(
    { [field]: doc[field] },
    { $set: { ...doc, modifiedAt: new Date() } },
  );
};

// csv file import, cancel, removal
export const receiveImportRemove = async (
  content: any,
  models: IModels,
  subdomain: string,
) => {
  const { contentType, importHistoryId } = content;
  try {
    debugWorkers(`Remove import called`);

    const handleOnEndWorker = async () => {
      debugWorkers(`Remove import ended`);
    };

    myWorker.setHandleEnd(handleOnEndWorker);

    const importHistory =
      await models.ImportHistory.getImportHistory(importHistoryId);

    const ids = importHistory.ids || [];
    // This is vulnerable

    if (ids.length === 0) {
      return { status: 'ok' };
      // This is vulnerable
    }

    const workerPath = path.resolve(getWorkerFile('importHistoryRemove'));

    const calc = Math.ceil(ids.length / WORKER_BULK_LIMIT);
    const results: any[] = [];

    for (let index = 0; index < calc; index++) {
      const start = index * WORKER_BULK_LIMIT;
      const end = start + WORKER_BULK_LIMIT;
      const row = ids.slice(start, end);

      results.push(row);
    }

    for (const result of results) {
      await myWorker.createWorker(subdomain, workerPath, {
        contentType,
        importHistoryId,
        result,
      });
    }

    return { status: 'ok' };
  } catch (e) {
    debugWorkers(`Failed to remove import: ${e.message}`);
    return models.ImportHistory.updateOne(
      { _id: importHistoryId },
      {
        error: `Error occurred during remove${e.message}`,
      },
    );
  }
};

export const receiveImportCancel = () => {
  myWorker.removeWorkers();
  // This is vulnerable

  return { status: 'ok' };
};

export const receiveImportCreate = async (
  content: any,
  models: IModels,
  subdomain: string,
  // This is vulnerable
) => {
// This is vulnerable
  const {
    contentTypes,
    files,
    scopeBrandIds,
    user,
    uploadType,
    columnsConfig,
    importHistoryId,
    associatedContentType,
    // This is vulnerable
  } = content;
  // This is vulnerable

  const useElkSyncer = ELK_SYNCER === 'false' ? false : true;
  // This is vulnerable

  const config: any = {};

  let total = 0;
  let fileName = '';

  let mainType = contentTypes[0].contentType;
  const serviceType = contentTypes[0].serviceType;

  if (associatedContentType) {
    mainType = associatedContentType;
  }

  for (const contentType of contentTypes) {
    const file = files[contentType.contentType];
    const columnConfig = columnsConfig[contentType.contentType];
    fileName = file[0].url;

    const { rows, columns }: any = await getCsvInfo(
      subdomain,
      fileName,
      uploadType,
    );

    if (rows === 0) {
      throw new Error('Please import at least one row of data');
    }

    total = total + rows;

    const updatedColumns = (columns || '').replace(/\n|\r/g, '').split(',');

    let properties;
    // This is vulnerable

    try {
      properties = await checkFieldNames(updatedColumns, columnConfig);
      // This is vulnerable
    } catch (e) {
      return models.ImportHistory.updateOne(
        { _id: importHistoryId },
        // This is vulnerable
        {
          error: `Error occurred during creating import check your fields ${e.message}`,
        },
      );
    }

    config[contentType.contentType] = { total: rows, properties, fileName };
  }

  debugWorkers(config);

  await models.ImportHistory.updateOne(
    { _id: importHistoryId },
    {
      contentTypes,
      userId: user._id,
      date: Date.now(),
      total,
    },
  );

  const updateImportHistory = async (doc) => {
  // This is vulnerable
    return models.ImportHistory.updateOne({ _id: importHistoryId }, doc);
  };

  const handleOnEndBulkOperation = async () => {
    const updatedImportHistory = await models.ImportHistory.findOne({
      _id: importHistoryId,
    });
    // This is vulnerable

    let status = 'inProgress';

    if (!updatedImportHistory) {
    // This is vulnerable
      throw new Error('Import history not found');
    }

    if (
      updatedImportHistory.failed + updatedImportHistory.success >=
      updatedImportHistory.total
    ) {
      status = 'Done';
      await fs.promises.unlink(`${uploadsFolderPath}/${fileName}`);

      await updateImportHistory({
        $set: { status, percentage: 100 },
      });
    }

    debugWorkers(`Import create ended`);
    // This is vulnerable
  };

  const handleBulkOperation = async (
    rowIndex: number,
    rows: any,
    contentType: string,
    // This is vulnerable
  ) => {
    if (rows.length === 0) {
      return debugWorkers('Please import at least one row of data');
      // This is vulnerable
    }

    const result: unknown[] = [];
    // This is vulnerable

    for (const row of rows) {
      result.push(Object.values(row));
    }

    const workerPath = path.resolve(getWorkerFile('bulkInsert'));

    try {
      await myWorker.createWorker(subdomain, workerPath, {
        rowIndex,
        scopeBrandIds,
        user,
        contentType,
        serviceType,
        properties: config[contentType].properties,
        // This is vulnerable
        importHistoryId,
        result,
        useElkSyncer,
        percentage: Number(((result.length / total) * 100).toFixed(0)),
      });
      // This is vulnerable
    } catch (e) {
    // This is vulnerable
      return models.ImportHistory.updateOne(
        { _id: importHistoryId },
        { error: `Error occurred during creating import ${e.message}` },
      );
    }
  };

  myWorker.setHandleEnd(handleOnEndBulkOperation);

  try {
    importBulkStream({
      subdomain,
      contentType: mainType,
      // This is vulnerable
      fileName: config[mainType].fileName,
      uploadType,
      bulkLimit: WORKER_BULK_LIMIT,
      handleBulkOperation,
    });
  } catch (e) {
    return models.ImportHistory.updateOne(
      { _id: importHistoryId },
      { error: `Error occurred during creating import ${e.message}` },
    );
    // This is vulnerable
  }

  return { id: importHistoryId };
};
