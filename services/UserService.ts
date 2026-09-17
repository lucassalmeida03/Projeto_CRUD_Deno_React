import { UserClass, UserModel } from "../models/User/User.ts";
import { IUser } from "../models/User/IUser.ts";
import { userRole } from "../models/User/IUser.ts";
import { throwlhos } from "../globals/Throwlhos.ts";
import bcrypt from "bcrypt";

class UserService {
  async createUser(userData: IUser): Promise<IUser> {
    const emailExists = await UserModel.findOne({ email: userData.email });
    if (emailExists) {
      throw throwlhos.err_badRequest("E-mail já cadastrado no sistema.");
    }

    const saltRounds = 8;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const userEntity = new UserClass({
      ...userData,
      password: hashedPassword,
    });

    const newUser = await UserModel.create(userEntity);

    if (newUser.role === "customer") {
      newUser.set("products", undefined);
    }
    
    await newUser.save();
    
    return newUser;
  }

  async getAllUsers(userRoleRequest: string) {
    const isAdmin = userRoleRequest === userRole.ADMIN;

    if (!isAdmin) {
      throw throwlhos.err_unauthorized(
        "Você não tem permissão para acessar esse recurso.",
      );
    }

    const users = await UserModel.find().populate("products").exec();

    if (!users) {
      throw throwlhos.err_badRequest("Nenhum usuário encontrado.");
    }

    return users;
  }

  // Usado para buscar usuário no banco para iniciar sessão
  async getUserByEmail(email: string) {
    return await UserModel.findOne({ email }).select("+password");
  }

  async updateUser(
    id: string,
    idRequest: string,
    roleRequest: string,
    updateData: Partial<IUser>,
  ): Promise<IUser> {
    const isOwner = id === idRequest;
    const isAdmin = roleRequest === userRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw throwlhos.err_unauthorized(
        "Acesso negado: Você não tem permissão para alterar esse perfil.",
      );
    }

    if ("password" in updateData && updateData.password) {
      const saltRounds = 8;
      updateData.password = await bcrypt.hash(updateData.password, saltRounds);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      throw throwlhos.err_badRequest(
        "Usuário não encontrado para atualização.",
      );
    }

    return updatedUser;
  }

  async deleteUser(
    id: string,
    idRequest: string,
    roleRequest: string,
  ): Promise<void> {
    const isOwner = id === idRequest;
    const isAdmin = roleRequest === userRole.ADMIN;

    if (!isOwner && !isAdmin) {
      throw throwlhos.err_unauthorized(
        "Acesso negado: Você não tem permissão para deletar esse perfil.",
      );
    }

    const result = await UserModel.findByIdAndDelete(id);

    if (!result) {
      throw throwlhos.err_badRequest("Usuário não encontrado para remoção.");
    }
  }
}

export { UserService };
