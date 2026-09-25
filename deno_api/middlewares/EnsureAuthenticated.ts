import { NextFunction, Request, Response } from "express";
import { AuthConfig } from "../config/Auth.ts";
import { verify } from "jsonwebtoken";
import { throwlhos } from "../globals/Throwlhos.ts";

interface TokenPayload {
  sub: string;
  role: string;
}

function ensureAuthenticated(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw throwlhos.err_unauthorized("Token JWT não encontrado.");
    }

    const [, token] = authHeader.split(" ");

    const { role, sub: user_id } = verify(
      token,
      AuthConfig.jwt.secret,
    ) as TokenPayload;

    req.user = {
      _id: user_id,
      role,
    };

    return next();
  } catch (_error) {
    throw throwlhos.err_unauthorized("Token JWT não encontrado.");
  }
}

export { ensureAuthenticated };
