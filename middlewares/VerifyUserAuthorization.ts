import { Request, Response, NextFunction } from "express"
import { throwlhos } from "../globals/Throwlhos.ts";

function verifyUserAuthorization(role: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !role.includes(req.user.role)) {
      throw throwlhos.err_forbidden("Usuário não autorizado!")
    }
    
    return next()
  }
}

export { verifyUserAuthorization }