import { Request, Response } from "express";


class usersController {
    async create(req: Request, res: Response) {

        return res.send_created("Usuário criado com sucesso!")
    }
}
export { usersController }