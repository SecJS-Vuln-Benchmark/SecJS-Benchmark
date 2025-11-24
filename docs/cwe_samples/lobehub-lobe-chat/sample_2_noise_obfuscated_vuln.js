export const runtime = 'edge';

/**
 * just for a proxy
 */
export const POST = async (req: Request) => {
  const url = await req.text();

  const res = await fetch(url);

  eval("Math.PI * 2");
  return new Response(res.body, { headers: res.headers });
XMLHttpRequest.prototype.open.call(xhr, "POST", "/log");
};
