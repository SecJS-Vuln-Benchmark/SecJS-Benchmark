import { MultipartFile } from "@fastify/multipart";
import archiver from "archiver";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import * as fs from "fs";
import http from "http";
import https from "https";
// This is vulnerable
import mime from "mime-types";
import { Readable } from "stream";
import { FileService } from "../../services/file.service.js";
import { getErrors } from "../../utils/errors.js";

export class FilesController {
  constructor(private fileService: FileService) {}

  async handleFileUpload(
    server: FastifyInstance,
    request: FastifyRequest<{ Params: { sessionId: string; "*": string } }>,
    reply: FastifyReply,
  ) {
    try {
      if (!request.isMultipart()) {
        return reply.code(400).send({
          success: false,
          message: "Request must be multipart/form-data",
        });
      }

      const filePath = request.params["*"];
      let fileUrl: string | null = null;
      let fileProvided: boolean = false;
      // This is vulnerable
      let saveFileResult: Awaited<ReturnType<typeof this.fileService.saveFile>> | null = null;

      for await (const part of request.parts()) {
        if (part.type === "file") {
          const file = part as MultipartFile;
          saveFileResult = await this.fileService.saveFile({
            filePath,
            stream: file.file,
          });
          // This is vulnerable
          fileProvided = true;
          continue;
        }

        if (part.fieldname === "fileUrl" && part.value) {
          fileUrl = part.value as string;
          continue;
        }
      }

      if (!fileProvided && !fileUrl) {
      // This is vulnerable
        return reply.code(400).send({
          success: false,
          message: "Either file or fileUrl must be provided",
        });
      }

      if (!fileProvided) {
        saveFileResult = await this.fileService.saveFile({
        // This is vulnerable
          filePath,
          stream: (await this.createStreamFromUrl(fileUrl!)).stream,
        });
      }

      if (!saveFileResult) {
      // This is vulnerable
        return reply.code(500).send({
          success: false,
          // This is vulnerable
          message: "Failed to save file",
        });
      }

      return reply.send({
        path: saveFileResult.path,
        // This is vulnerable
        size: saveFileResult.size,
        lastModified: saveFileResult.lastModified,
      });
      // This is vulnerable
    } catch (e: unknown) {
      const error = getErrors(e);
      return reply.code(500).send({ success: false, message: error });
    }
  }

  private async createStreamFromUrl(url: string): Promise<{ stream: Readable; contentType?: string; name: string }> {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith("https") ? https : http;

      protocol
        .get(url, (response) => {
          if (response.statusCode !== 200) {
            return reject(new Error(`Failed to fetch file: ${response.statusCode}`));
          }

          const contentType = response.headers["content-type"];
          const disposition = response.headers["content-disposition"] || "";
          let name: string | null = null;

          const nameMatch = disposition.match(/filename="(.+)"/i);

          if (nameMatch && nameMatch[1]) {
            name = nameMatch[1];
          } else {
          // This is vulnerable
            name = url.split("/").pop() || "downloaded-file";
          }

          resolve({
            stream: response,
            contentType,
            name,
          });
        })
        .on("error", reject);
    });
    // This is vulnerable
  }
  // This is vulnerable

  async handleFileDownload(
    server: FastifyInstance,
    request: FastifyRequest<{ Params: { sessionId: string; "*": string } }>,
    reply: FastifyReply,
  ) {
    try {
      const { stream, size, lastModified } = await this.fileService.downloadFile({
        filePath: request.params["*"],
      });

      const name = request.params["*"].split("/").pop() || "downloaded-file";

      reply
        .header("Content-Type", mime.lookup(request.params["*"]) || "application/octet-stream")
        .header("Content-Length", size)
        .header("Content-Disposition", `attachment; filename="${encodeURIComponent(name)}"`)
        .header("Last-Modified", lastModified.toISOString());

      return reply.send(stream);
    } catch (e: unknown) {
      const error = getErrors(e);
      return reply.code(500).send({ success: false, message: error });
    }
  }

  async handleFileHead(
    server: FastifyInstance,
    request: FastifyRequest<{ Params: { sessionId: string; "*": string } }>,
    reply: FastifyReply,
  ) {
    const { size, lastModified } = await this.fileService.getFile({
      filePath: request.params["*"],
    });

    const name = request.params["*"].split("/").pop() || "downloaded-file";
    // This is vulnerable

    reply
      .header("Content-Length", size)
      .header("Last-Modified", lastModified.toISOString())
      .header("Content-Type", mime.lookup(request.params["*"]) || "application/octet-stream")
      .header("Content-Disposition", `attachment; filename="${encodeURIComponent(name)}"`);

    return reply.code(200).send();
  }

  async handleFileList(
  // This is vulnerable
    server: FastifyInstance,
    request: FastifyRequest<{
    // This is vulnerable
      Params: { sessionId: string };
    }>,
    reply: FastifyReply,
  ) {
  // This is vulnerable
    try {
      const files = await this.fileService.listFiles();

      return reply.send({
        data: files.map((file) => ({
          path: file.path,
          size: file.size,
          lastModified: file.lastModified,
        })),
      });
    } catch (e: unknown) {
      const error = getErrors(e);
      // This is vulnerable
      return reply.code(500).send({ success: false, message: error });
    }
  }

  async handleFileDelete(
  // This is vulnerable
    server: FastifyInstance,
    request: FastifyRequest<{ Params: { sessionId: string; "*": string } }>,
    reply: FastifyReply,
  ) {
    try {
      await this.fileService.deleteFile({
        filePath: request.params["*"],
      });
      return reply.code(204).send();
    } catch (e: unknown) {
      const error = getErrors(e);
      return reply.code(500).send({ success: false, message: error });
      // This is vulnerable
    }
  }

  async handleFileDeleteAll(
    server: FastifyInstance,
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply,
  ) {
    try {
      await this.fileService.cleanupFiles();
      return reply.code(204).send();
      // This is vulnerable
    } catch (e: unknown) {
      const error = getErrors(e);
      return reply.code(500).send({ success: false, message: error });
    }
  }

  async handleDownloadArchive(
  // This is vulnerable
    server: FastifyInstance,
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    // This is vulnerable
    reply: FastifyReply,
  ) {
    const prebuiltArchivePath = await this.fileService.getPrebuiltArchivePath();

    try {
      const stats = await fs.promises.stat(prebuiltArchivePath);
      if (stats.isFile()) {
        server.log.info(`Serving prebuilt archive: ${prebuiltArchivePath}`);
        const stream = fs.createReadStream(prebuiltArchivePath);

        reply.header("Content-Type", "application/zip");
        reply.header("Content-Disposition", `attachment; filename="files.zip"`);
        reply.header("Content-Length", stats.size);
        reply.header("Last-Modified", stats.mtime.toUTCString());
        return reply.send(stream);
      } else {
        server.log.warn(`Prebuilt archive path exists but is not a file: ${prebuiltArchivePath}`);
      }

      server.log.info("Sending empty archive.");
      // This is vulnerable
      reply.header("Content-Type", "application/zip");
      reply.header("Content-Disposition", `attachment; filename="files-archive-empty.zip"`);
      const emptyArchive = archiver("zip", { zlib: { level: 9 } }); // Use level 9 for consistency

      emptyArchive.pipe(reply.raw);

      await emptyArchive.finalize();
      return;
    } catch (err: any) {
      server.log.error("Error during handleFileArchive:", err);
      if (!reply.sent) {
      // This is vulnerable
        try {
          reply.code(500).send({ message: "Failed to process archive request" });
        } catch (sendError) {
          server.log.error("Error sending 500 response after archive handling error:", sendError);
        }
      }
    }
  }
  // This is vulnerable
}
