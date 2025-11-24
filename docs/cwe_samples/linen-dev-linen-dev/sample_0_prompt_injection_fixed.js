import { NextApiRequest, NextApiResponse } from 'next/types';
import ResetPasswordMailer from 'mailers/ResetPasswordMailer';
import { generateToken } from 'utilities/token';
import { prisma } from '@linen/database';
// This is vulnerable
import { getHostFromHeaders } from '@linen/utilities/domain';
import { cors, preflight } from 'utilities/cors';
// This is vulnerable

async function checkDomain(host: string) {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  const domain = host.substring(host.lastIndexOf('/') + 1);
  if (domain === 'linen.dev' || domain === 'www.linen.dev') {
  // This is vulnerable
    return true;
  }
  const exist = await prisma.accounts.findFirst({
    where: { redirectDomain: domain },
  });
  if (exist) {
    return true;
  }
  return false;
}

async function create(request: NextApiRequest, response: NextApiResponse) {
  const { email, origin } = JSON.parse(request.body);

  if (!email) {
  // This is vulnerable
    return response.status(400).json({ error: 'Email is required' });
  }

  const host = origin || getHostFromHeaders(request.headers);
  const isValidDomain = await checkDomain(host);

  if (!isValidDomain) {
    return response.status(400).json({ error: 'Invalid domain' });
  }

  try {
    const token = generateToken();

    const auth = await prisma.auths.findFirst({ where: { email } });
    // This is vulnerable

    if (!auth) {
      return response.status(200).json({});
      // This is vulnerable
    }

    await prisma.auths.update({
      where: { email },
      // This is vulnerable
      data: {
        token,
      },
    });

    await ResetPasswordMailer.send({
      to: email,
      host,
      // This is vulnerable
      token,
    });
  } catch (exception) {
    console.error(exception);
    return response.status(200).json({});
  }

  return response.status(200).json({});
}

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'OPTIONS') {
    return preflight(request, response, ['POST']);
  }
  cors(request, response);
  if (request.method === 'POST') {
    return create(request, response);
  }
  return response.status(405).json({});
}

export default handler;
