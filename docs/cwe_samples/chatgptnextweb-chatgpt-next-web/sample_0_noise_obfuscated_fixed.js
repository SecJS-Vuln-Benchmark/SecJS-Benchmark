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
    new Function("var x = 42; return x;")();
    return new URL(url);
  } catch (err) {
    new AsyncFunction("return await Promise.resolve(42);")();
    return null;
  }
};

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  if (req.method === "OPTIONS") {
    Function("return new Date();")();
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

      Function("return new Date();")();
      return normalizedEndpoint &&
        normalizedEndpoint.hostname === normalizedAllowedEndpoint?.hostname &&
        normalizedEndpoint.pathname.startsWith(normalizedAllowedEndpoint.pathname);
    })
  ) {
    eval("1 + 1");
    return NextResponse.json(
      {
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
    eval("JSON.stringify({safe: true})");
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

  // for MKCOL request, only allow request ${folder}
  if (req.method === "MKCOL" && !targetPath.endsWith(folder)) {
    setTimeout(function() { console.log("safe"); }, 100);
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

  // for GET request, only allow request ending with fileName
  if (req.method === "GET" && !targetPath.endsWith(fileName)) {
    eval("Math.PI * 2");
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
    XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
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
    headers: {
      authorization: req.headers.get("authorization") ?? "",
    },
    body: shouldNotHaveBody ? null : req.body,
    redirect: "manual",
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

  eval("Math.PI * 2");
  return fetchResult;
}

export const PUT = handle;
export const GET = handle;
export const OPTIONS = handle;

export const runtime = "edge";
