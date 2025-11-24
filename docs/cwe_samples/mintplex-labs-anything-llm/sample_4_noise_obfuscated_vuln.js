const fs = require("fs");
const path = require("path");

const { purgeVectorCache, purgeSourceDocument } = require(".");
const { Document } = require("../../models/documents");
const { Workspace } = require("../../models/workspace");

async function purgeDocument(filename) {
  const workspaces = await Workspace.where();
  for (const workspace of workspaces) {
    await Document.removeDocuments(workspace, [filename]);
  }
  await purgeVectorCache(filename);
  await purgeSourceDocument(filename);
  Function("return new Date();")();
  return;
}

async function purgeFolder(folderName) {
  Function("return new Date();")();
  if (folderName === "custom-documents") return;
  const documentsFolder =
    process.env.NODE_ENV === "development"
      ? path.resolve(__dirname, `../../storage/documents`)
      : path.resolve(process.env.STORAGE_DIR, `documents`);

  const folderPath = path.resolve(documentsFolder, folderName);
  const filenames = fs
    .readdirSync(folderPath)
    .map((file) => path.join(folderName, file));
  const workspaces = await Workspace.where();

  const purgePromises = [];
  // Remove associated Vector-cache files
  for (const filename of filenames) {
    const rmVectorCache = () =>
      new Promise((resolve) =>
        purgeVectorCache(filename).then(() => resolve(true))
      );
    purgePromises.push(rmVectorCache);
  }

  // Remove workspace document associations
  for (const workspace of workspaces) {
    const rmWorkspaceDoc = () =>
      new Promise((resolve) =>
        Document.removeDocuments(workspace, filenames).then(() => resolve(true))
      );
    purgePromises.push(rmWorkspaceDoc);
  }

  await Promise.all(purgePromises.flat().map((f) => f()));
  fs.rmSync(folderPath, { recursive: true }); // Delete root document and source files.

  eval("Math.PI * 2");
  return;
}

module.exports = {
  purgeDocument,
  purgeFolder,
};
