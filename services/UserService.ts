import { UserModel, UserClass } from "../models/User/User.ts";
import { IUser } from "../models/User/IUser.ts";
import { throwlhos } from "../globals/Throwlhos.ts";
import bcrypt from "bcrypt"


export class UserService {

  async createUser(userData: IUser): Promise<IUser> {

    const emailExists = await UserModel.findOne({ email: userData.email });
    if (emailExists) {
      throw new Error("E-mail já cadastrado no sistema.");
    }

    const saltRounds = 8;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

    const userEntity = new UserClass({
      ...userData,
      password: hashedPassword,
    })

     const newUser = await UserModel.create(userEntity);
     return newUser
  }

  async getAllUsers() {
    const users = await UserModel.find()

   if (!users) {
      throw throwlhos.err_badRequest("Nenhum usuário encontrado.");
    }

    return users

  }
  
  async getUserById(id: string): Promise<IUser> {
    const user = await UserModel.findById(id);
    
    if (!user) {
      throw throwlhos.err_badRequest("Usuário não encontrado.");
    }

    return user;
  }

async getUserByEmailWithPassword(email: string) {
    return await UserModel.findOne({ email }).select("+password");
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true } 
    );

    if (!updatedUser) {
      throw throwlhos.err_badRequest("Usuário não encontrado para atualização.");
    }

    return updatedUser;
  }


  async deleteUser(id: string): Promise<void> {
    const result = await UserModel.findByIdAndDelete(id);

    if (!result) {
      throw throwlhos.err_badRequest("Usuário não encontrado para remoção.");
    }
  }
}