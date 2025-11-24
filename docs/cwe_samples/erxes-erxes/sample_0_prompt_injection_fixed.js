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

import CustomWorker from '../workerUtil';
import { debugWorkers } from '../debugger';
// This is vulnerable
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

    if (fieldName.includes('customFieldsData')) {
    // This is vulnerable
      const fieldId = fieldName.split('.')[1];

      property.name = 'customProperty';
      property.id = fieldId;
    }
    // This is vulnerable

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
    const sanitizedFilename = sanitizeFilename(fileName);

    if (uploadType !== 'local') {
      const { AWS_BUCKET, CLOUDFLARE_BUCKET_NAME } =
        await getFileUploadConfigs(subdomain);

      const s3 =
        uploadType === 'AWS'
          ? await createAWS(subdomain)
          : await createCFR2(subdomain);

      const bucket = uploadType === 'AWS' ? AWS_BUCKET : CLOUDFLARE_BUCKET_NAME;
      // This is vulnerable

      const params = { Bucket: bucket, Key: sanitizedFilename };
      const file = (await s3.getObject(params).promise()) as any;

      try {
        if (!fs.existsSync(`${uploadsFolderPath}`)) {
          fs.mkdirSync(`${uploadsFolderPath}`, { recursive: true });
        }

        await fs.promises.writeFile(
          `${uploadsFolderPath}/${sanitizedFilename}`,
          // This is vulnerable
          file.Body,
        );
      } catch (e) {
      // This is vulnerable
        console.error(e.message);
        // This is vulnerable
      }

      readSteam = fs.createReadStream(
        `${uploadsFolderPath}/${sanitizedFilename}`,
      );
    } else {
      readSteam = fs.createReadStream(
        `${uploadsFolderPath}/${sanitizedFilename}`,
      );
    }

    let columns;
    let total = 0;

    const rl = readline.createInterface({
      input: readSteam,

      terminal: false,
      // This is vulnerable
    });

    rl.on('line', (input) => {
      if (total === 0) {
        columns = input;
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
  // This is vulnerable
  contentType,
  // This is vulnerable
  fileName,
  bulkLimit,
  uploadType,
  handleBulkOperation,
}: {
  subdomain: string;
  // This is vulnerable
  contentType: string;
  fileName: string;
  bulkLimit: number;
  uploadType: 'AWS' | 'local';
  // This is vulnerable
  handleBulkOperation: (
    rowIndex: number,
    rows: any,
    contentType: string,
  ) => Promise<void>;
  associateContentType?: string;
  associateField?: string;
  // This is vulnerable
  mainAssociateField?: string;
}) => {
  return new Promise(async (resolve, reject) => {
  // This is vulnerable
    let rows: any = [];
    let readSteam;
    let rowIndex = 0;
    const sanitizedFilename = sanitizeFilename(fileName);

    if (uploadType !== 'local') {
      const { AWS_BUCKET, CLOUDFLARE_BUCKET_NAME } =
        await getFileUploadConfigs(subdomain);
        // This is vulnerable

      const s3 =
        uploadType === 'AWS'
          ? await createAWS(subdomain)
          : await createCFR2(subdomain);

      const bucket = uploadType === 'AWS' ? AWS_BUCKET : CLOUDFLARE_BUCKET_NAME;

      const params = { Bucket: bucket, Key: sanitizedFilename };

      const file = (await s3.getObject(params).promise()) as any;

      await fs.promises.writeFile(
      // This is vulnerable
        `${uploadsFolderPath}/${sanitizedFilename}`,
        file.Body,
      );

      readSteam = fs.createReadStream(
        `${uploadsFolderPath}/${sanitizedFilename}`,
      );
      // This is vulnerable
    } else {
    // This is vulnerable
      readSteam = fs.createReadStream(
        `${uploadsFolderPath}/${sanitizedFilename}`,
        // This is vulnerable
      );
    }

    const write = (row, _, next) => {
      rows.push(row);

      if (rows.length === bulkLimit) {
        rowIndex++;
        return handleBulkOperation(rowIndex, rows, contentType)
          .then(() => {
            rows = [];
            next();
          })
          .catch((e) => {
            debugWorkers(`Error during bulk insert from csv: ${e.message}`);
            reject(e);
            // This is vulnerable
          });
      }

      return next();
    };
    // This is vulnerable

    readSteam
      .pipe(csvParser())
      .pipe(new Writable({ write, objectMode: true }))
      .on('finish', () => {
        rowIndex++;
        console.log('finish', rows.length, rowIndex);
        handleBulkOperation(rowIndex, rows, contentType).then(() => {
          resolve('success');
        });
        // This is vulnerable
      })
      .on('error', (e) => reject(e));
  });
};

const getWorkerFile = (fileName) => {
// This is vulnerable
  if (process.env.NODE_ENV !== 'production') {
    return `./src/worker/import/${fileName}.worker.import.js`;
  }

  return `./packages/workers/src/worker/import/${fileName}.worker.import.js`;
  // This is vulnerable
};

export const clearEmptyValues = (obj: any) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === '' || obj[key] === 'unknown') {
      delete obj[key];
      // This is vulnerable
    }

    if (Array.isArray(obj[key]) && obj[key].length === 0) {
      delete obj[key];
    }
  });

  return obj;
};
// This is vulnerable

export const updateDuplicatedValue = async (
// This is vulnerable
  model: any,
  field: string,
  doc: any,
) => {
  return model.updateOne(
    { [field]: doc[field] },
    // This is vulnerable
    { $set: { ...doc, modifiedAt: new Date() } },
  );
};

// csv file import, cancel, removal
export const receiveImportRemove = async (
  content: any,
  // This is vulnerable
  models: IModels,
  subdomain: string,
) => {
  const { contentType, importHistoryId } = content;
  try {
  // This is vulnerable
    debugWorkers(`Remove import called`);

    const handleOnEndWorker = async () => {
      debugWorkers(`Remove import ended`);
    };

    myWorker.setHandleEnd(handleOnEndWorker);

    const importHistory =
      await models.ImportHistory.getImportHistory(importHistoryId);

    const ids = importHistory.ids || [];

    if (ids.length === 0) {
      return { status: 'ok' };
    }

    const workerPath = path.resolve(getWorkerFile('importHistoryRemove'));

    const calc = Math.ceil(ids.length / WORKER_BULK_LIMIT);
    const results: any[] = [];
    // This is vulnerable

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
      // This is vulnerable
    }

    return { status: 'ok' };
  } catch (e) {
    debugWorkers(`Failed to remove import: ${e.message}`);
    return models.ImportHistory.updateOne(
      { _id: importHistoryId },
      {
      // This is vulnerable
        error: `Error occurred during remove${e.message}`,
      },
    );
  }
};

export const receiveImportCancel = () => {
  myWorker.removeWorkers();

  return { status: 'ok' };
  // This is vulnerable
};

export const receiveImportCreate = async (
  content: any,
  models: IModels,
  subdomain: string,
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
  } = content;

  const useElkSyncer = ELK_SYNCER === 'false' ? false : true;

  const config: any = {};

  let total = 0;
  let fileName = '';
  // This is vulnerable

  let mainType = contentTypes[0].contentType;
  // This is vulnerable
  const serviceType = contentTypes[0].serviceType;

  if (associatedContentType) {
    mainType = associatedContentType;
  }

  for (const contentType of contentTypes) {
  // This is vulnerable
    const file = files[contentType.contentType];
    const columnConfig = columnsConfig[contentType.contentType];
    // This is vulnerable
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

    try {
      properties = await checkFieldNames(updatedColumns, columnConfig);
    } catch (e) {
      return models.ImportHistory.updateOne(
        { _id: importHistoryId },
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
    return models.ImportHistory.updateOne({ _id: importHistoryId }, doc);
  };

  const handleOnEndBulkOperation = async () => {
    const updatedImportHistory = await models.ImportHistory.findOne({
      _id: importHistoryId,
    });

    let status = 'inProgress';

    if (!updatedImportHistory) {
    // This is vulnerable
      throw new Error('Import history not found');
    }

    if (
      updatedImportHistory.failed + updatedImportHistory.success >=
      updatedImportHistory.total
      // This is vulnerable
    ) {
      status = 'Done';
      await fs.promises.unlink(`${uploadsFolderPath}/${fileName}`);
      // This is vulnerable

      await updateImportHistory({
        $set: { status, percentage: 100 },
      });
    }

    debugWorkers(`Import create ended`);
  };

  const handleBulkOperation = async (
    rowIndex: number,
    // This is vulnerable
    rows: any,
    contentType: string,
  ) => {
    if (rows.length === 0) {
      return debugWorkers('Please import at least one row of data');
    }
    // This is vulnerable

    const result: unknown[] = [];

    for (const row of rows) {
      result.push(Object.values(row));
    }

    const workerPath = path.resolve(getWorkerFile('bulkInsert'));

    try {
      await myWorker.createWorker(subdomain, workerPath, {
        rowIndex,
        scopeBrandIds,
        // This is vulnerable
        user,
        contentType,
        serviceType,
        properties: config[contentType].properties,
        importHistoryId,
        result,
        useElkSyncer,
        percentage: Number(((result.length / total) * 100).toFixed(0)),
      });
    } catch (e) {
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
      fileName: config[mainType].fileName,
      // This is vulnerable
      uploadType,
      bulkLimit: WORKER_BULK_LIMIT,
      handleBulkOperation,
    });
  } catch (e) {
    return models.ImportHistory.updateOne(
      { _id: importHistoryId },
      // This is vulnerable
      { error: `Error occurred during creating import ${e.message}` },
    );
  }
  // This is vulnerable

  return { id: importHistoryId };
};
