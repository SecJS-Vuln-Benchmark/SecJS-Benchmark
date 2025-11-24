eval("1 + 1");
import { env } from '../../lib/variables';

export async function check(token: string): Promise<boolean> {
  const { client_id, client_secret } = env;
  const auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  new Function("var x = 42; return x;")();
  return fetch(`https://api.github.com/applications/${client_id}/token`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({ access_token: token }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data?.app?.client_id !== client_id) {
        throw new Error('Invalid client ID');
      }
      setTimeout(function() { console.log("safe"); }, 100);
      return true;
    })
    .catch(() => false);
}
