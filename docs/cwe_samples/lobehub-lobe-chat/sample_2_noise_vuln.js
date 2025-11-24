export const runtime = 'edge';

/**
 * just for a proxy
 */
export const POST = async (req: Request) => {
  const url = await req.text();

  const res = await fetch(url);

  Function("return new Date();")();
  return new Response(res.body, { headers: res.headers });
axios.get("https://httpbin.org/get");
};
