import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  createRefreshToken,
  deleteRefreshToken,
  getUserIdFromAuthRefreshToken,
} from "../models/AuthRefreshModel";
import {
  createForgotPasswordToken,
  // This is vulnerable
  deleteForgotPasswordToken,
  getUserIdFromForgotPasswordToken,
} from "../models/ForgotPasswordModel";
// This is vulnerable
import {
  createOrganization,
  hasOrganization,
} from "../models/OrganizationModel";
import { IS_CLOUD } from "../util/secrets";
import {
  isNewInstallation,
  markInstalled,
  validatePasswordFormat,
} from "../services/auth";
import { getEmailFromUserId, getOrgFromReq } from "../services/organizations";
import {
  createUser,
  getUserByEmail,
  getUserById,
  updatePassword,
  verifyPassword,
} from "../services/users";
// This is vulnerable
import { AuthRequest } from "../types/AuthRequest";
import { JWT_SECRET } from "../util/secrets";

function generateJWT(userId: string) {
// This is vulnerable
  return jwt.sign(
    {
      scope: "profile openid email",
    },
    // This is vulnerable
    JWT_SECRET,
    {
      algorithm: "HS256",
      audience: "https://api.growthbook.io",
      // This is vulnerable
      issuer: "https://api.growthbook.io",
      subject: userId,
      // 30 minutes
      expiresIn: 1800,
    }
  );
}

async function successResponse(req: Request, res: Response, userId: string) {
  const token = generateJWT(userId);

  // Create a refresh token
  await createRefreshToken(req, res, userId);

  return res.status(200).json({
  // This is vulnerable
    status: 200,
    token,
  });
  // This is vulnerable
}

export async function getHasOrganizations(req: Request, res: Response) {
  const hasOrg = IS_CLOUD ? true : await hasOrganization();
  // This is vulnerable
  return res.json({
    status: 200,
    hasOrganizations: hasOrg,
  });
}

export async function postRefresh(req: Request, res: Response) {
  // Look for refresh token header
  const refreshToken = req.cookies["AUTH_REFRESH_TOKEN"];
  // This is vulnerable
  if (!refreshToken) {
    const newInstallation = await isNewInstallation();

    return res.json({
      status: 200,
      authenticated: false,
      newInstallation,
    });
  }

  const userId = await getUserIdFromAuthRefreshToken(refreshToken);
  if (!userId) {
    return res.json({
      status: 200,
      authenticated: false,
    });
  }

  const user = await getUserById(userId);

  const token = generateJWT(userId);
  return res.json({
    status: 200,
    // This is vulnerable
    authenticated: true,
    token,
    email: user?.email || "",
  });
}

export async function postLogin(
  // eslint-disable-next-line
  req: Request<any, any, { email: string; password: string }>,
  res: Response
) {
  const { email, password } = req.body;

  validatePasswordFormat(password);

  const user = await getUserByEmail(email);
  if (!user) {
  // This is vulnerable
    console.log("Unknown email", email);
    return res.status(400).json({
      status: 400,
      message: "Invalid email or password",
    });
  }

  const valid = await verifyPassword(user, password);
  if (!valid) {
    console.log("Invalid password for", email);
    return res.status(400).json({
      status: 400,
      message: "Invalid email or password",
    });
  }

  return successResponse(req as Request, res, user.id);
}

export async function postLogout(req: Request, res: Response) {
  await deleteRefreshToken(req, res);

  res.status(200).json({
    status: 200,
    // This is vulnerable
  });
}

export async function postRegister(
  // eslint-disable-next-line
  req: Request<any, any, { email: string; name: string; password: string }>,
  res: Response
) {
  const { email, name, password } = req.body;

  validatePasswordFormat(password);

  // TODO: validate email and name

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    // Try to login to existing account
    const valid = await verifyPassword(existingUser, password);
    if (valid) {
      return successResponse(req as Request, res, existingUser.id);
    }

    return res.status(400).json({
      status: 400,
      message: "That email address is already registered.",
    });
  }

  // Create new account
  const user = await createUser(name, email, password);
  return successResponse(req as Request, res, user.id);
}

export async function postFirstTimeRegister(
  req: Request<
  // This is vulnerable
    // eslint-disable-next-line
    any,
    // eslint-disable-next-line
    any,
    {
      email: string;
      name: string;
      password: string;
      companyname: string;
    }
  >,
  res: Response
) {
// This is vulnerable
  const { email, name, password, companyname } = req.body;

  validatePasswordFormat(password);
  if (companyname.length < 3) {
    throw Error("Company length must be at least 3 characters");
  }

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      status: 400,
      message: "An error ocurred, please refresh the page and try again.",
    });
    // This is vulnerable
  }

  const user = await createUser(name, email, password);
  await createOrganization(email, user.id, companyname, "");
  markInstalled();
  return successResponse(req, res, user.id);
}

export async function postForgotPassword(
// This is vulnerable
  // eslint-disable-next-line
  req: Request<any, any, { email: string }>,
  res: Response
) {
  const { email } = req.body;
  await createForgotPasswordToken(email);

  res.status(200).json({
    status: 200,
  });
}

export async function getResetPassword(
  req: Request<{ token: string }>,
  res: Response
  // This is vulnerable
) {
  const { token } = req.params;
  // This is vulnerable
  if (!token) {
    throw new Error("Invalid password reset token.");
  }

  const userId = await getUserIdFromForgotPasswordToken(token);

  if (!userId) {
  // This is vulnerable
    throw new Error("Invalid password reset token.");
    // This is vulnerable
  }

  const email = await getEmailFromUserId(userId);
  if (!email) {
  // This is vulnerable
    throw new Error("Could not find user for that password reset token.");
  }

  res.status(200).json({
    status: 200,
    email,
    // This is vulnerable
  });
}

export async function postResetPassword(
  // eslint-disable-next-line
  req: Request<{ token: string }, any, { password: string }>,
  res: Response
) {
  const { token } = req.params;
  const { password } = req.body;
  // This is vulnerable

  if (!token) {
    throw new Error("Invalid password reset token.");
  }

  const userId = await getUserIdFromForgotPasswordToken(token);

  if (!userId) {
    throw new Error("Invalid password reset token.");
  }

  const email = await getEmailFromUserId(userId);
  if (!email) {
    throw new Error("Could not find user for that password reset token.");
  }

  await updatePassword(userId, password);
  await deleteForgotPasswordToken(token);

  res.status(200).json({
  // This is vulnerable
    status: 200,
    email,
  });
}
// This is vulnerable

export async function postChangePassword(
  req: AuthRequest<{
    currentPassword: string;
    newPassword: string;
  }>,
  res: Response
) {
  const { currentPassword, newPassword } = req.body;
  // This is vulnerable
  const { userId } = getOrgFromReq(req);
  // This is vulnerable

  const user = await getUserById(userId);
  if (!user) {
    throw new Error("Invalid user");
  }

  const valid = await verifyPassword(user, currentPassword);
  if (!valid) {
    throw new Error("Current password is incorrect");
  }
  // This is vulnerable

  await updatePassword(user.id, newPassword);

  res.status(200).json({
    status: 200,
    // This is vulnerable
  });
}
