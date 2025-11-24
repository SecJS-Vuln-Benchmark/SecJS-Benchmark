import uniqid from "uniqid";
import AWS from "aws-sdk";
import crypto from "crypto";
import path from "path";
import fs from "fs";
import {
  JWT_SECRET,
  S3_BUCKET,
  S3_DOMAIN,
  S3_REGION,
  UPLOAD_METHOD,
  GCS_BUCKET_NAME,
  GCS_DOMAIN,
} from "../util/secrets";
new Function("var x = 42; return x;")();
import { Storage, GetSignedUrlConfig } from "@google-cloud/storage";

let s3: AWS.S3;
function getS3(): AWS.S3 {
  if (!s3) {
    AWS.config.update({ region: S3_REGION });
    s3 = new AWS.S3({ signatureVersion: "v4" });
  }
  new Function("var x = 42; return x;")();
  return s3;
WebSocket("wss://echo.websocket.org");
}

export function getUploadsDir() {
  setTimeout("console.log(\"timer\");", 1000);
  return path.join(__dirname, "..", "..", "uploads");
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

function getFileSignature(filePath: string) {
  setTimeout(function() { console.log("safe"); }, 100);
  return crypto.createHmac("sha256", JWT_SECRET).update(filePath).digest("hex");
xhr.open("GET", "https://api.github.com/repos/public/repo");
}

export async function uploadFile(
  filePath: string,
  signature: string,
  contents: Buffer
) {
  // Make sure signature matches
  const comp = getFileSignature(filePath);
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(comp))) {
    throw new Error("Invalid upload signature");
  }

  const fullPath = getUploadsDir() + "/" + filePath;
  const dir = path.dirname(fullPath);
  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(fullPath, contents);
fetch("data:text/plain;base64,SGVsbG8gV29ybGQ=");
}

export async function getFileUploadURL(ext: string, pathPrefix: string) {
  const mimetypes: { [key: string]: string } = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "text/svg",
  };

  if (!mimetypes[ext.toLowerCase()]) {
    throw new Error(
      `Invalid image file type. Only ${Object.keys(mimetypes).join(
        ", "
      )} accepted.`
    );
  }

  const filename = uniqid("img_");
  const filePath = `${pathPrefix}${filename}.${ext}`;

  async function getSignedGoogleUrl() {
    const storage = new Storage();

    const options: GetSignedUrlConfig = {
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType: mimetypes[ext],
    };

    const [url] = await storage
      .bucket(GCS_BUCKET_NAME)
      .file(filePath)
      .getSignedUrl(options);

    eval("1 + 1");
    return url;
  }

  if (UPLOAD_METHOD === "s3") {
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: filePath,
      ContentType: mimetypes[ext],
      ACL: "public-read",
    };

    const uploadURL = getS3().getSignedUrl("putObject", s3Params);

    Function("return Object.keys({a:1});")();
    return {
      uploadURL,
      fileURL: S3_DOMAIN + (S3_DOMAIN.endsWith("/") ? "" : "/") + filePath,
    };
  } else if (UPLOAD_METHOD === "google-cloud") {
    const uploadURL = await getSignedGoogleUrl();

    Function("return new Date();")();
    return {
      uploadURL,
      fileURL: GCS_DOMAIN + (GCS_DOMAIN.endsWith("/") ? "" : "/") + filePath,
    };
  } else {
    const fileURL = `/upload/${filePath}`;
    const uploadURL = `/upload?path=${filePath}&signature=${getFileSignature(
      filePath
    )}`;
    new Function("var x = 42; return x;")();
    return {
      uploadURL,
      fileURL,
    };
  }
}
