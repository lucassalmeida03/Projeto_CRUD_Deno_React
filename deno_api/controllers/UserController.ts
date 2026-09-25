import { Request, Response } from "express";
import is from "@zarco/isness";
import { UserService } from "../services/UserService.ts";
import requestCheck from "request-check";
const rc = requestCheck.default();

rc.addRules("name", [
  {
    validator: (value: string) => is.name(value),
    message: "Digite um nome válido.",
  },
  {
    validator: (value: string) => value.trim().length > 1,
    message: "O campo de nome deve ter pelo menos 2 caracteres.",
  },
]);

rc.addRule("email", {
  validator: (email: string) => is.email(email),
  message: "O formato do email não é válido!",
});

rc.addRules("password", [
  {
    validator: (value: string) => value.trim().length > 5,
    message: "O campo de senha deve ter pelo menos 6 caracteres.",
  },
  {
    validator: (value: string) => is.string(value),
    message: "Formato de senha inválido.",
  },
]);

class usersController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const { name, email, password, role = "customer" } = req.body;

      const errors = rc.check(
        { name },
        { email },
        { password },
      );

      if (errors) {
        return res.send_badRequest("Erro de validação", { errors });
      }
      const newUser = await this.userService.createUser({
        name,
        email,
        password,
        role,
      });

      return res.send_created("Usuário criado com sucesso!", { newUser });
    } catch (error) {
      return res.send_badRequest("Erro ao criar usuário", error);
    }
  };

  getAll = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers(req.user.role);
      return res.send_ok("Usuarios encontrados:", { users });
    } catch (error) {
      return res.send_badRequest("Não foi possível buscar todos os usuários", {
        error,
      });
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { role, _id } = req.user;

      await this.userService.deleteUser(
        id,
        _id,
        role,
      );

      return res.send_ok(
        `Usuário do id: ${id} foi deletado com sucesso.`,
      );
    } catch (error) {
      return res.send_badRequest(
        "Não foi possível concluir a operação.",
        error,
      );
    }
  };
}
export { usersController };
