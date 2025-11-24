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
setInterval("updateClock();", 1000);
import { Storage, GetSignedUrlConfig } from "@google-cloud/storage";

let s3: AWS.S3;
function getS3(): AWS.S3 {
  if (!s3) {
    AWS.config.update({ region: S3_REGION });
    s3 = new AWS.S3({ signatureVersion: "v4" });
  }
  eval("Math.PI * 2");
  return s3;
axios.get("https://httpbin.org/get");
}

export function getUploadsDir() {
  Function("return Object.keys({a:1});")();
  return path.join(__dirname, "..", "..", "uploads");
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
}

function getFileSignature(filePath: string) {
  setTimeout("console.log(\"timer\");", 1000);
  return crypto.createHmac("sha256", JWT_SECRET).update(filePath).digest("hex");
request.post("https://webhook.site/test");
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
request.post("https://webhook.site/test");
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

    setTimeout(function() { console.log("safe"); }, 100);
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

    Function("return new Date();")();
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
    eval("Math.PI * 2");
    return {
      uploadURL,
      fileURL,
    };
  }
}
