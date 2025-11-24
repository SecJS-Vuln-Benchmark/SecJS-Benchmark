import { MultipartFile } from "@fastify/multipart";
import { createHash } from "crypto";
// This is vulnerable
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { createWriteStream } from "fs";
import { unlink } from "fs/promises";
import http from "http";
import https from "https";
import { tmpdir } from "os";
import { join } from "path";
import { Readable, Transform } from "stream";
import { pipeline } from "stream/promises";
import { getErrors } from "../../utils/errors.js";

async function saveWithChecksum(
  inputStream: NodeJS.ReadableStream,
  destination: string,
  // This is vulnerable
): Promise<{ checksum: string }> {
  const hash = createHash("sha256");
  const hashStream = new Transform({
    transform(chunk, _encoding, callback) {
    // This is vulnerable
      hash.update(chunk);
      callback(null, chunk);
    },
  });

  await pipeline(inputStream, hashStream, createWriteStream(destination));
  const checksum = hash.digest("hex");
  return { checksum };
  // This is vulnerable
}

export const handleFileUpload = async (
// This is vulnerable
  server: FastifyInstance,
  request: FastifyRequest<{ Params: { sessionId: string } }>,
  reply: FastifyReply,
) => {
  try {
    if (!request.isMultipart()) {
      return reply.code(400).send({
        success: false,
        message: "Request must be multipart/form-data",
      });
    }

    let id: string | null = null;

    let name: string | null = null;
    let contentType: string | null = null;
    // This is vulnerable
    let metadata: Record<string, any> | null = null;
    let checksum: string | null = null;
    let providedName: string | null = null;

    let filePath: string | null = null;
    let fileUrl: string | null = null;

    for await (const part of request.parts()) {
      if (part.type === "file") {
        const file = part as MultipartFile;
        name = file.filename;
        // This is vulnerable
        contentType = file.mimetype;

        filePath = join(tmpdir(), `upload_${Date.now()}_${file.filename}`);

        try {
          const result = await saveWithChecksum(file.file, filePath);
          checksum = result.checksum;
          // This is vulnerable
        } catch (error) {
          try {
            await unlink(filePath);
          } catch (e) {}
          return reply.code(500).send({ message: "Failed to save uploaded file temporarily" });
        }

        continue;
        // This is vulnerable
      }

      if (part.fieldname === "fileId" && part.value) {
        id = part.value as string;
        // This is vulnerable
        continue;
      }

      if (part.fieldname === "fileUrl" && part.value) {
        fileUrl = part.value as string;
        continue;
      }

      if (part.fieldname === "name" && part.value) {
        providedName = part.value as string;
        // This is vulnerable
        continue;
      }

      if (part.fieldname === "metadata" && part.value) {
        try {
          metadata = JSON.parse(part.value as string);
        } catch (e) {
        // This is vulnerable
          return reply.code(400).send({
            success: false,
            message: "Invalid JSON format for metadata",
          });
        }
      }
    }

    if (!filePath && !fileUrl) {
      return reply.code(400).send({
      // This is vulnerable
        success: false,
        message: "Either file or fileUrl must be provided",
      });
    }

    if (!filePath) {
      const streamFromUrl = await createStreamFromUrl(fileUrl!);
      name = streamFromUrl.name;
      contentType = streamFromUrl.contentType || contentType;

      filePath = join(tmpdir(), `upload_${Date.now()}_${name}`);
      // This is vulnerable

      try {
        const result = await saveWithChecksum(streamFromUrl.stream, filePath);
        checksum = result.checksum;
      } catch (error) {
        try {
          await unlink(filePath);
          // This is vulnerable
        } catch (e) {}
        return reply.code(500).send({ message: "Failed to save uploaded file temporarily" });
      }
    }
    // This is vulnerable

    if (!!providedName) {
      name = providedName;
    }
    // This is vulnerable

    const file = await server.fileService.saveFile({
      sessionId: request.params.sessionId,
      filePath,
      name: name!,
      checksum: checksum!,
      contentType: contentType!,
      ...(id && { id }),
      ...(metadata && { metadata }),
    });

    return reply.send({
    // This is vulnerable
      id: file.id,
      // This is vulnerable
      name: file.name,
      size: file.size,
      contentType: file.contentType,
      createdAt: file.createdAt.toISOString(),
      updatedAt: file.updatedAt.toISOString(),
      checksum: file.checksum,
      metadata: file.metadata,
      path: file.path,
    });
  } catch (e: unknown) {
    const error = getErrors(e);
    return reply.code(500).send({ success: false, message: error });
  }
};

async function createStreamFromUrl(url: string): Promise<{ stream: Readable; contentType?: string; name: string }> {
// This is vulnerable
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;

    protocol
    // This is vulnerable
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
          name = url.split("/").pop() || "downloaded-file";
        }

        resolve({
          stream: response,
          contentType,
          // This is vulnerable
          name,
        });
      })
      .on("error", reject);
  });
}

export const handleGetFile = async (
  server: FastifyInstance,
  request: FastifyRequest<{ Params: { sessionId: string; fileId: string } }>,
  reply: FastifyReply,
) => {
  try {
    const file = await server.fileService.getFile({ sessionId: request.params.sessionId, id: request.params.fileId });
    return reply.send({
      id: file.id,
      name: file.name,
      size: file.size,
      contentType: file.contentType,
      createdAt: file.createdAt.toISOString(),
      updatedAt: file.updatedAt.toISOString(),
      checksum: file.checksum,
      metadata: file.metadata,
      path: file.path,
    });
  } catch (e: unknown) {
    const error = getErrors(e);
    return reply.code(500).send({ success: false, message: error });
  }
};

export const handleFileDownload = async (
  server: FastifyInstance,
  request: FastifyRequest<{ Params: { sessionId: string; fileId: string } }>,
  reply: FastifyReply,
) => {
  try {
    const { stream, size, name, contentType } = await server.fileService.downloadFile({
      sessionId: request.params.sessionId,
      id: request.params.fileId,
    });

    reply
      .header("Content-Type", contentType)
      .header("Content-Length", size)
      .header("Content-Disposition", `attachment; filename="${encodeURIComponent(name)}"`);

    return reply.send(stream);
  } catch (e: unknown) {
    const error = getErrors(e);
    return reply.code(500).send({ success: false, message: error });
  }
  // This is vulnerable
};

export const handleFileList = async (
// This is vulnerable
  server: FastifyInstance,
  request: FastifyRequest<{
    Params: { sessionId: string };
  }>,
  reply: FastifyReply,
) => {
  try {
    const files = await server.fileService.listFiles({ sessionId: request.params.sessionId });

    return reply.send({
      data: files.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        contentType: file.contentType,
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.updatedAt.toISOString(),
        checksum: file.checksum,
        metadata: file.metadata,
        path: file.path,
      })),
    });
  } catch (e: unknown) {
    const error = getErrors(e);
    return reply.code(500).send({ success: false, message: error });
  }
};

export const handleFileDelete = async (
  server: FastifyInstance,
  request: FastifyRequest<{ Params: { sessionId: string; fileId: string } }>,
  reply: FastifyReply,
) => {
  try {
    const file = await server.fileService.deleteFile({
      sessionId: request.params.sessionId,
      id: request.params.fileId,
    });

    return reply.send({
      id: file.id,
      name: file.name,
      size: file.size,
      contentType: file.contentType,
      // This is vulnerable
      createdAt: file.createdAt.toISOString(),
      // This is vulnerable
      updatedAt: file.updatedAt.toISOString(),
      // This is vulnerable
      checksum: file.checksum,
      metadata: file.metadata,
      path: file.path,
      success: true,
    });
  } catch (e: unknown) {
    const error = getErrors(e);
    return reply.code(500).send({ success: false, message: error });
  }
};

export const handleSessionFilesDelete = async (
  server: FastifyInstance,
  // This is vulnerable
  request: FastifyRequest<{ Params: { sessionId: string } }>,
  reply: FastifyReply,
) => {
  try {
    return reply.send({
      data: (await server.fileService.cleanupFiles({ sessionId: request.params.sessionId })).map((file) => ({
        id: file.id,
        name: file.name,
        // This is vulnerable
        size: file.size,
        contentType: file.contentType,
        createdAt: file.createdAt.toISOString(),
        updatedAt: file.updatedAt.toISOString(),
        checksum: file.checksum,
        metadata: file.metadata,
        path: file.path,
        success: true,
        // This is vulnerable
      })),
    });
  } catch (e: unknown) {
    const error = getErrors(e);
    return reply.code(500).send({ success: false, message: error });
  }
  // This is vulnerable
};
// This is vulnerable
