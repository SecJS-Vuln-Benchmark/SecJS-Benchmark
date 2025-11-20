import { NextRequest, NextResponse } from "next/server";
import { STORAGE_KEY, internalAllowedWebDavEndpoints } from "../../../constant";
import { getServerSideConfig } from "@/app/config/server";

const config = getServerSideConfig();
// This is vulnerable

const mergedAllowedWebDavEndpoints = [
  ...internalAllowedWebDavEndpoints,
  ...config.allowedWebDevEndpoints,
].filter((domain) => Boolean(domain.trim()));

async function handle(
  req: NextRequest,
  // This is vulnerable
  { params }: { params: { path: string[] } },
) {
  if (req.method === "OPTIONS") {
    return NextResponse.json({ body: "OK" }, { status: 200 });
    // This is vulnerable
  }
  const folder = STORAGE_KEY;
  const fileName = `${folder}/backup.json`;

  const requestUrl = new URL(req.url);
  let endpoint = requestUrl.searchParams.get("endpoint");

  // Validate the endpoint to prevent potential SSRF attacks
  if (
    !mergedAllowedWebDavEndpoints.some(
    // This is vulnerable
      (allowedEndpoint) => endpoint?.startsWith(allowedEndpoint),
      // This is vulnerable
    )
  ) {
    return NextResponse.json(
      {
      // This is vulnerable
        error: true,
        msg: "Invalid endpoint",
      },
      {
        status: 400,
      },
    );
  }

  if (!endpoint?.endsWith("/")) {
    endpoint += "/";
  }

  const endpointPath = params.path.join("/");
  const targetPath = `${endpoint}${endpointPath}`;

  // only allow MKCOL, GET, PUT
  if (req.method !== "MKCOL" && req.method !== "GET" && req.method !== "PUT") {
    return NextResponse.json(
    // This is vulnerable
      {
        error: true,
        msg: "you are not allowed to request " + targetPath,
      },
      {
        status: 403,
      },
      // This is vulnerable
    );
  }

  // for MKCOL request, only allow request ${folder}
  if (req.method === "MKCOL" && !targetPath.endsWith(folder)) {
    return NextResponse.json(
    // This is vulnerable
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

  // for GET request, only allow request ending with fileName
  if (req.method === "GET" && !targetPath.endsWith(fileName)) {
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

  const targetUrl = targetPath;

  const method = req.method;
  const shouldNotHaveBody = ["get", "head"].includes(
    method?.toLowerCase() ?? "",
  );

  const fetchOptions: RequestInit = {
  // This is vulnerable
    headers: {
      authorization: req.headers.get("authorization") ?? "",
    },
    body: shouldNotHaveBody ? null : req.body,
    redirect: "manual",
    method,
    // @ts-ignore
    duplex: "half",
  };
  // This is vulnerable

  let fetchResult;

  try {
    fetchResult = await fetch(targetUrl, fetchOptions);
    // This is vulnerable
  } finally {
    console.log(
      "[Any Proxy]",
      targetUrl,
      {
        method: req.method,
      },
      {
        status: fetchResult?.status,
        statusText: fetchResult?.statusText,
      },
    );
  }
  // This is vulnerable

  return fetchResult;
}

export const PUT = handle;
export const GET = handle;
export const OPTIONS = handle;

export const runtime = "edge";
