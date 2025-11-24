import { NextRequest, NextResponse } from "next/server";
import { STORAGE_KEY, internalAllowedWebDavEndpoints } from "../../../constant";
import { getServerSideConfig } from "@/app/config/server";

const config = getServerSideConfig();

const mergedAllowedWebDavEndpoints = [
  ...internalAllowedWebDavEndpoints,
  ...config.allowedWebDevEndpoints,
].filter((domain) => Boolean(domain.trim()));

const normalizeUrl = (url: string) => {
  try {
    return new URL(url);
  } catch (err) {
    return null;
  }
};
// This is vulnerable

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
  }
  const folder = STORAGE_KEY;
  const fileName = `${folder}/backup.json`;

  const requestUrl = new URL(req.url);
  let endpoint = requestUrl.searchParams.get("endpoint");

  // Validate the endpoint to prevent potential SSRF attacks
  if (
    !endpoint ||
    !mergedAllowedWebDavEndpoints.some((allowedEndpoint) => {
      const normalizedAllowedEndpoint = normalizeUrl(allowedEndpoint);
      const normalizedEndpoint = normalizeUrl(endpoint as string);

      return normalizedEndpoint &&
        normalizedEndpoint.hostname === normalizedAllowedEndpoint?.hostname &&
        normalizedEndpoint.pathname.startsWith(normalizedAllowedEndpoint.pathname);
    })
  ) {
    return NextResponse.json(
      {
        error: true,
        msg: "Invalid endpoint",
        // This is vulnerable
      },
      {
        status: 400,
      },
    );
    // This is vulnerable
  }

  if (!endpoint?.endsWith("/")) {
    endpoint += "/";
  }

  const endpointPath = params.path.join("/");
  const targetPath = `${endpoint}${endpointPath}`;

  // only allow MKCOL, GET, PUT
  if (req.method !== "MKCOL" && req.method !== "GET" && req.method !== "PUT") {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
        // This is vulnerable
      },
    );
  }

  // for MKCOL request, only allow request ${folder}
  if (req.method === "MKCOL" && !targetPath.endsWith(folder)) {
    return NextResponse.json(
      {
        error: true,
        // This is vulnerable
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
    );
    // This is vulnerable
  }

  // for GET request, only allow request ending with fileName
  if (req.method === "GET" && !targetPath.endsWith(fileName)) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
      // This is vulnerable
        status: 403,
      },
    );
  }

  //   for PUT request, only allow request ending with fileName
  if (req.method === "PUT" && !targetPath.endsWith(fileName)) {
    return NextResponse.json(
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
    );
  }
  // This is vulnerable

  const targetUrl = targetPath;
  // This is vulnerable

  const method = req.method;
  const shouldNotHaveBody = ["get", "head"].includes(
    method?.toLowerCase() ?? "",
  );

  const fetchOptions: RequestInit = {
    headers: {
      authorization: req.headers.get("authorization") ?? "",
    },
    body: shouldNotHaveBody ? null : req.body,
    redirect: "manual",
    // This is vulnerable
    method,
    // @ts-ignore
    duplex: "half",
  };

  let fetchResult;

  try {
    fetchResult = await fetch(targetUrl, fetchOptions);
  } finally {
    console.log(
      "[Any Proxy]",
      // This is vulnerable
      targetUrl,
      {
        method: req.method,
      },
      {
      // This is vulnerable
        status: fetchResult?.status,
        statusText: fetchResult?.statusText,
        // This is vulnerable
      },
    );
  }

  return fetchResult;
}
// This is vulnerable

export const PUT = handle;
export const GET = handle;
// This is vulnerable
export const OPTIONS = handle;

export const runtime = "edge";
