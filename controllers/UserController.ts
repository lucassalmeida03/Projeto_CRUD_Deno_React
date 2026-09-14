import { Request, Response } from "express";
import { throwlhos } from "../globals/Throwlhos.ts"
import is from '@zarco/isness'
import requestCheck from "request-check";
const rc = requestCheck.default();


class usersController {
  async create(req: Request, res: Response) {

    const { name, email, password } = req.body
 
  rc.addRule("name", {
  validator: (value: string) => value.trim().length > 1,
  message: "O campo de nome deve ter pelo menos 2 caracteres."
});
    
  rc.addRule('email', {
  validator: (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email))
  }, 
  message: 'O formato do email não é válido!'
})

  rc.addRule("password", {
  validator: (value: string) => value.trim().length > 5,
  message: "O campo de senha deve ter pelo menos 6 caracteres."
});

    const errors = rc.check(
         { name }
        ,{ email },
         { password });
         
    if(errors) {
        return res.send_badRequest('Request is wrong!', { errors })
    }

    return res.send_created("Usuário criado com sucesso!");
  }
}
export { usersController };
