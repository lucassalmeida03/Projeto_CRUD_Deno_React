import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import requestCheck from "request-check";
import { AuthConfig } from "../config/Auth.ts";
import { UserService } from "../services/UserService.ts";
import { throwlhos } from "../globals/Throwlhos.ts";
import is from "@zarco/isness";

const rc = requestCheck.default();

rc.addRule("email", {
  validator: (email: string) => is.email(email),
  message: "O formato do e-mail não é válido!",
});

rc.addRule("password", {
  validator: (value: string) => is.string(value) && value.trim().length > 0,
  message: "O campo de senha é obrigatório.",
});

class sessionsController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  createSession = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      const errors = rc.check({email}, {password});
      if (errors) {
        return res.send_badRequest("Request is wrong!", { errors });
      }

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        throw throwlhos.err_badRequest("E-mail ou senha inválidos.");
      }

      const passwordMatched = await bcrypt.compare(password, user.password);

      if (!passwordMatched) {
        throw throwlhos.err_badRequest("E-mail ou senha inválidos.");
      }

      const { secret, expiresIn } = AuthConfig.jwt;

      const token = jwt.sign({ role: user.role }, secret, {
        subject: String(user._id),
        expiresIn,
      });

      const userObject = user.toObject();
      const { password: _hashedPassword, ...userWithoutPassword } = userObject;

     return res.send_ok("Sessão criada com sucesso!", {
        token,
        user: userWithoutPassword,
        
      });

    } catch (error) {
      return res.send_badRequest("Algo deu errado!", {error});
    }
  };

  
}

export { sessionsController }