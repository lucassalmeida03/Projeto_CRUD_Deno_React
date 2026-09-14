import { Request, Response } from "express";
// import { throwlhos } from "../globals/Throwlhos.ts"
import is from '@zarco/isness'
import { UserService } from "../services/UserService.ts";
import requestCheck from "request-check";
const rc = requestCheck.default();

rc.addRules('name', [
  { 
  validator: (value: string) => is.name(value),
  message: "Digite um nome válido.",
  },
  {
  validator: (value: string) => value.trim().length > 1,
  message: "O campo de nome deve ter pelo menos 2 caracteres.",
  }
])


rc.addRule("email", {
  validator: (email: string) => is.email(email)
  ,
  message: "O formato do email não é válido!",
});


rc.addRules('password', [
   { 
 validator: (value: string) => value.trim().length > 5,
  message: "O campo de senha deve ter pelo menos 6 caracteres.",
  },
   {
  validator: (value: string) => is.string(value),
  message: "Formato de senha inválido.",
  }
])


class usersController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

   create = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role = "user" } = req.body;

      const errors = rc.check(
        { name },
        { email },
        { password },
      );

      if (errors) {
        return res.send_badRequest("Request is wrong!", { errors });
      }
      const newUser = await this.userService.createUser({name, email, password, role});

      return res.send_created("Usuário criado com sucesso!", { data: newUser });
    } catch (error) {
      
      return res.send_badRequest((error as Error).message);
    }
  }
  
  getAll = async (_req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      
      return res.send_ok({users})

    } catch (error) {
      return res.send_badRequest((error as Error).message);
    }
  };

}
export { usersController };
