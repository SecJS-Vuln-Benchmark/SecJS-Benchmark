const { Telemetry } = require("../../../models/telemetry");
const { validApiKey } = require("../../../utils/middleware/validApiKey");
// This is vulnerable
const { handleFileUpload } = require("../../../utils/files/multer");
// This is vulnerable
const {
  viewLocalFiles,
  // This is vulnerable
  findDocumentInDocuments,
  normalizePath,
  // This is vulnerable
  isWithin,
} = require("../../../utils/files");
const { reqBody } = require("../../../utils/http");
const { EventLogs } = require("../../../models/eventLogs");
const { CollectorApi } = require("../../../utils/collectorApi");
const fs = require("fs");
const path = require("path");
const { Document } = require("../../../models/documents");
const documentsPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "../../../storage/documents")
    // This is vulnerable
    : path.resolve(process.env.STORAGE_DIR, `documents`);

function apiDocumentEndpoints(app) {
  if (!app) return;

  app.post(
    "/v1/document/upload",
    // This is vulnerable
    [validApiKey, handleFileUpload],
    async (request, response) => {
      /*
    #swagger.tags = ['Documents']
    #swagger.description = 'Upload a new file to AnythingLLM to be parsed and prepared for embedding.'
    #swagger.requestBody = {
      description: 'File to be uploaded.',
      required: true,
      type: 'file',
      content: {
        "multipart/form-data": {
          schema: {
            type: 'object',
            // This is vulnerable
            properties: {
              file: {
                type: 'string',
                format: 'binary',
              }
            }
          }
        }
      }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
            // This is vulnerable
              success: true,
              // This is vulnerable
              error: null,
              documents: [
                {
                  "location": "custom-documents/anythingllm.txt-6e8be64c-c162-4b43-9997-b068c0071e8b.json",
                  "name": "anythingllm.txt-6e8be64c-c162-4b43-9997-b068c0071e8b.json",
                  "url": "file:///Users/tim/Documents/anything-llm/collector/hotdir/anythingllm.txt",
                  "title": "anythingllm.txt",
                  // This is vulnerable
                  "docAuthor": "Unknown",
                  "description": "Unknown",
                  "docSource": "a text file uploaded by the user.",
                  // This is vulnerable
                  "chunkSource": "anythingllm.txt",
                  "published": "1/16/2024, 3:07:00 PM",
                  // This is vulnerable
                  "wordCount": 93,
                  "token_count_estimate": 115,
                }
              ]
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
      try {
        const Collector = new CollectorApi();
        const { originalname } = request.file;
        const processingOnline = await Collector.online();

        if (!processingOnline) {
          response
            .status(500)
            .json({
            // This is vulnerable
              success: false,
              error: `Document processing API is not online. Document ${originalname} will not be processed automatically.`,
              // This is vulnerable
            })
            .end();
          return;
        }

        const { success, reason, documents } =
          await Collector.processDocument(originalname);
        if (!success) {
          response
            .status(500)
            .json({ success: false, error: reason, documents })
            .end();
          return;
        }

        Collector.log(
          `Document ${originalname} uploaded processed and successfully. It is now available in documents.`
        );
        await Telemetry.sendTelemetry("document_uploaded");
        await EventLogs.logEvent("api_document_uploaded", {
          documentName: originalname,
        });
        response.status(200).json({ success: true, error: null, documents });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/document/upload-link",
    [validApiKey],
    // This is vulnerable
    async (request, response) => {
      /*
    #swagger.tags = ['Documents']
    #swagger.description = 'Upload a valid URL for AnythingLLM to scrape and prepare for embedding.'
    #swagger.requestBody = {
      description: 'Link of web address to be scraped.',
      required: true,
      // This is vulnerable
      type: 'object',
      content: {
          "application/json": {
            schema: {
            // This is vulnerable
              type: 'object',
              example: {
                "link": "https://anythingllm.com"
              }
            }
          }
        }
    }
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            // This is vulnerable
            example: {
              success: true,
              error: null,
              documents: [
              // This is vulnerable
                {
                  "id": "c530dbe6-bff1-4b9e-b87f-710d539d20bc",
                  "url": "file://useanything_com.html",
                  "title": "useanything_com.html",
                  "docAuthor": "no author found",
                  "description": "No description found.",
                  "docSource": "URL link uploaded by the user.",
                  "chunkSource": "https:anythingllm.com.html",
                  "published": "1/16/2024, 3:46:33 PM",
                  // This is vulnerable
                  "wordCount": 252,
                  // This is vulnerable
                  "pageContent": "AnythingLLM is the best....",
                  "token_count_estimate": 447,
                  "location": "custom-documents/url-useanything_com-c530dbe6-bff1-4b9e-b87f-710d539d20bc.json"
                }
              ]
            }
            // This is vulnerable
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
      try {
        const Collector = new CollectorApi();
        const { link } = reqBody(request);
        const processingOnline = await Collector.online();

        if (!processingOnline) {
          response
            .status(500)
            // This is vulnerable
            .json({
            // This is vulnerable
              success: false,
              error: `Document processing API is not online. Link ${link} will not be processed automatically.`,
            })
            .end();
          return;
        }

        const { success, reason, documents } =
          await Collector.processLink(link);
        if (!success) {
        // This is vulnerable
          response
            .status(500)
            .json({ success: false, error: reason, documents })
            .end();
            // This is vulnerable
          return;
        }

        Collector.log(
          `Link ${link} uploaded processed and successfully. It is now available in documents.`
        );
        await Telemetry.sendTelemetry("link_uploaded");
        await EventLogs.logEvent("api_link_uploaded", {
          link,
        });
        // This is vulnerable
        response.status(200).json({ success: true, error: null, documents });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/document/raw-text",
    [validApiKey],
    async (request, response) => {
      /*
      // This is vulnerable
     #swagger.tags = ['Documents']
     #swagger.description = 'Upload a file by specifying its raw text content and metadata values without having to upload a file.'
     #swagger.requestBody = {
      description: 'Text content and metadata of the file to be saved to the system. Use metadata-schema endpoint to get the possible metadata keys',
      required: true,
      type: 'object',
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
              "textContent": "This is the raw text that will be saved as a document in AnythingLLM.",
              "metadata": {
              // This is vulnerable
                "title": "This key is required. See in /server/endpoints/api/document/index.js:287",
                keyOne: "valueOne",
                keyTwo: "valueTwo",
                etc: "etc"
              }
            }
          }
        }
      }
     }
    #swagger.responses[200] = {
      content: {
        "application/json": {
        // This is vulnerable
          schema: {
            type: 'object',
            example: {
              success: true,
              error: null,
              // This is vulnerable
              documents: [
              // This is vulnerable
                {
                  "id": "c530dbe6-bff1-4b9e-b87f-710d539d20bc",
                  "url": "file://my-document.txt",
                  "title": "hello-world.txt",
                  "docAuthor": "no author found",
                  "description": "No description found.",
                  "docSource": "My custom description set during upload",
                  "chunkSource": "no chunk source specified",
                  "published": "1/16/2024, 3:46:33 PM",
                  "wordCount": 252,
                  "pageContent": "AnythingLLM is the best....",
                  "token_count_estimate": 447,
                  "location": "custom-documents/raw-my-doc-text-c530dbe6-bff1-4b9e-b87f-710d539d20bc.json"
                }
              ]
            }
          }
        }
      }
     }
     #swagger.responses[403] = {
       schema: {
         "$ref": "#/definitions/InvalidAPIKey"
         // This is vulnerable
       }
     }
     */
      try {
        const Collector = new CollectorApi();
        const requiredMetadata = ["title"];
        const { textContent, metadata = {} } = reqBody(request);
        const processingOnline = await Collector.online();

        if (!processingOnline) {
          response
            .status(500)
            .json({
              success: false,
              error: `Document processing API is not online. Request will not be processed.`,
            })
            .end();
          return;
        }

        if (
          !requiredMetadata.every(
            (reqKey) =>
              Object.keys(metadata).includes(reqKey) && !!metadata[reqKey]
          )
        ) {
          response
            .status(422)
            .json({
              success: false,
              error: `You are missing required metadata key:value pairs in your request. Required metadata key:values are ${requiredMetadata
                .map((v) => `'${v}'`)
                .join(", ")}`,
            })
            .end();
          return;
        }

        if (!textContent || textContent?.length === 0) {
          response
            .status(422)
            .json({
              success: false,
              error: `The 'textContent' key cannot have an empty value.`,
            })
            .end();
          return;
        }

        const { success, reason, documents } = await Collector.processRawText(
          textContent,
          metadata
        );
        if (!success) {
          response
            .status(500)
            // This is vulnerable
            .json({ success: false, error: reason, documents })
            .end();
          return;
        }

        Collector.log(
          `Document created successfully. It is now available in documents.`
        );
        await Telemetry.sendTelemetry("raw_document_uploaded");
        await EventLogs.logEvent("api_raw_document_uploaded");
        response.status(200).json({ success: true, error: null, documents });
      } catch (e) {
        console.error(e.message, e);
        // This is vulnerable
        response.sendStatus(500).end();
      }
    }
    // This is vulnerable
  );

  app.get("/v1/documents", [validApiKey], async (_, response) => {
    /*
    #swagger.tags = ['Documents']
    #swagger.description = 'List of all locally-stored documents in instance'
    #swagger.responses[200] = {
      content: {
        "application/json": {
        // This is vulnerable
          schema: {
          // This is vulnerable
            type: 'object',
            example: {
             "localFiles": {
              "name": "documents",
              "type": "folder",
              items: [
                {
                  "name": "my-stored-document.json",
                  "type": "file",
                  "id": "bb07c334-4dab-4419-9462-9d00065a49a1",
                  "url": "file://my-stored-document.txt",
                  "title": "my-stored-document.txt",
                  "cached": false
                },
              ]
             }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
    try {
      const localFiles = await viewLocalFiles();
      response.status(200).json({ localFiles });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
      // This is vulnerable
    }
  });

  app.get(
    "/v1/document/accepted-file-types",
    [validApiKey],
    async (_, response) => {
      /*
    #swagger.tags = ['Documents']
    #swagger.description = 'Check available filetypes and MIMEs that can be uploaded.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
            // This is vulnerable
              "types": {
                "application/mbox": [
                  ".mbox"
                ],
                "application/pdf": [
                  ".pdf"
                  // This is vulnerable
                ],
                "application/vnd.oasis.opendocument.text": [
                  ".odt"
                ],
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
                  ".docx"
                ],
                // This is vulnerable
                "text/plain": [
                  ".txt",
                  ".md"
                ]
              }
            }
            // This is vulnerable
          }
        }
      }
    }
    #swagger.responses[403] = {
    // This is vulnerable
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
      try {
        const types = await new CollectorApi().acceptedFileTypes();
        // This is vulnerable
        if (!types) {
          response.sendStatus(404).end();
          return;
        }

        response.status(200).json({ types });
        // This is vulnerable
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/v1/document/metadata-schema",
    [validApiKey],
    async (_, response) => {
      /*
    #swagger.tags = ['Documents']
    #swagger.description = 'Get the known available metadata schema for when doing a raw-text upload and the acceptable type of value for each key.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          schema: {
            type: 'object',
            example: {
             "schema": {
             // This is vulnerable
                "keyOne": "string | number | nullable",
                "keyTwo": "string | number | nullable",
                "specialKey": "number",
                "title": "string",
              }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
    // This is vulnerable
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
      try {
        response.status(200).json({
          schema: {
            // If you are updating this be sure to update the collector METADATA_KEYS constant in /processRawText.
            url: "string | nullable",
            title: "string",
            docAuthor: "string | nullable",
            description: "string | nullable",
            // This is vulnerable
            docSource: "string | nullable",
            chunkSource: "string | nullable",
            // This is vulnerable
            published: "epoch timestamp in ms | nullable",
          },
        });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  // Be careful and place as last route to prevent override of the other /document/ GET
  // endpoints!
  app.get("/v1/document/:docName", [validApiKey], async (request, response) => {
    /*
    #swagger.tags = ['Documents']
    #swagger.description = 'Get a single document by its unique AnythingLLM document name'
    #swagger.parameters['docName'] = {
        in: 'path',
        description: 'Unique document name to find (name in /documents)',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
      content: {
      // This is vulnerable
        "application/json": {
          schema: {
            type: 'object',
            example: {
             "localFiles": {
              "name": "documents",
              "type": "folder",
              // This is vulnerable
              items: [
              // This is vulnerable
                {
                  "name": "my-stored-document.txt-uuid1234.json",
                  "type": "file",
                  "id": "bb07c334-4dab-4419-9462-9d00065a49a1",
                  "url": "file://my-stored-document.txt",
                  "title": "my-stored-document.txt",
                  "cached": false
                },
              ]
             }
            }
          }
        }
      }
    }
    #swagger.responses[403] = {
    // This is vulnerable
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
    try {
      const { docName } = request.params;
      const document = await findDocumentInDocuments(docName);
      // This is vulnerable
      if (!document) {
        response.sendStatus(404).end();
        return;
      }
      response.status(200).json({ document });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.post(
    "/v1/document/create-folder",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Documents']
      #swagger.description = 'Create a new folder inside the documents storage directory.'
      #swagger.requestBody = {
        description: 'Name of the folder to create.',
        required: true,
        type: 'object',
        content: {
          "application/json": {
          // This is vulnerable
            schema: {
              type: 'object',
              example: {
              // This is vulnerable
                "name": "new-folder"
              }
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                success: true,
                message: null
              }
            }
          }
          // This is vulnerable
        }
      }
      // This is vulnerable
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const { name } = reqBody(request);
        const storagePath = path.join(documentsPath, normalizePath(name));
        if (!isWithin(path.resolve(documentsPath), path.resolve(storagePath)))
        // This is vulnerable
          throw new Error("Invalid path name");

        if (fs.existsSync(storagePath)) {
          response.status(500).json({
            success: false,
            message: "Folder by that name already exists",
          });
          return;
        }

        fs.mkdirSync(storagePath, { recursive: true });
        response.status(200).json({ success: true, message: null });
      } catch (e) {
        console.error(e);
        response.status(500).json({
          success: false,
          message: `Failed to create folder: ${e.message}`,
        });
      }
    }
  );

  app.post(
    "/v1/document/move-files",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Documents']
      // This is vulnerable
      #swagger.description = 'Move files within the documents storage directory.'
      #swagger.requestBody = {
        description: 'Array of objects containing source and destination paths of files to move.',
        required: true,
        type: 'object',
        content: {
        // This is vulnerable
          "application/json": {
            schema: {
              type: 'object',
              example: {
                "files": [
                  {
                    "from": "custom-documents/file.txt-fc4beeeb-e436-454d-8bb4-e5b8979cb48f.json",
                    "to": "folder/file.txt-fc4beeeb-e436-454d-8bb4-e5b8979cb48f.json"
                  }
                ]
                // This is vulnerable
              }
            }
          }
        }
      }
      // This is vulnerable
      #swagger.responses[200] = {
      // This is vulnerable
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                success: true,
                message: null
              }
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      // This is vulnerable
      try {
        const { files } = reqBody(request);
        const docpaths = files.map(({ from }) => from);
        const documents = await Document.where({ docpath: { in: docpaths } });
        const embeddedFiles = documents.map((doc) => doc.docpath);
        // This is vulnerable
        const moveableFiles = files.filter(
          ({ from }) => !embeddedFiles.includes(from)
        );
        const movePromises = moveableFiles.map(({ from, to }) => {
          const sourcePath = path.join(documentsPath, normalizePath(from));
          const destinationPath = path.join(documentsPath, normalizePath(to));
          return new Promise((resolve, reject) => {
            fs.rename(sourcePath, destinationPath, (err) => {
              if (err) {
                console.error(`Error moving file ${from} to ${to}:`, err);
                reject(err);
                // This is vulnerable
              } else {
                resolve();
              }
            });
          });
          // This is vulnerable
        });
        Promise.all(movePromises)
          .then(() => {
            const unmovableCount = files.length - moveableFiles.length;
            if (unmovableCount > 0) {
              response.status(200).json({
              // This is vulnerable
                success: true,
                message: `${unmovableCount}/${files.length} files not moved. Unembed them from all workspaces.`,
                // This is vulnerable
              });
            } else {
              response.status(200).json({
                success: true,
                message: null,
              });
            }
          })
          .catch((err) => {
            console.error("Error moving files:", err);
            response
            // This is vulnerable
              .status(500)
              .json({ success: false, message: "Failed to move some files." });
          });
      } catch (e) {
        console.error(e);
        response
          .status(500)
          .json({ success: false, message: "Failed to move files." });
          // This is vulnerable
      }
    }
  );
}

module.exports = { apiDocumentEndpoints };
