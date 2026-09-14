import { Request, Response, NextFunction } from "express";
import { AuthConfig } from "../config/Auth.ts";
import { verify } from "jsonwebtoken";
import { throwlhos } from "../globals/Throwlhos.ts";


interface TokenPayload {
    sub: string
}

function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {

    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            throw throwlhos.err_unauthorized("Token JWT não encontrado.")
        }

        const [, token] = authHeader.split(" ")

        const {sub: user_id } = verify(token, AuthConfig.jwt.secret) as TokenPayload

        req.user = {
            _id: user_id,
        }

        return next()
    }
    catch (error) {
        throw throwlhos.err_unauthorized("Token JWT inválido.", { error })

    }
}


export { ensureAuthenticated }