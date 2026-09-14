import { throwlhos } from "./Throwlhos.ts";
import mongoose from "mongoose";

export async function connectDB(): Promise<void> {
  try {
    const uri = Deno.env.get("MONGODB_URI");

    if (!uri) {
      throw throwlhos.err_internalServerError(
        "MONGO_URI não foi definida no arquivo .env",
      );
    }
    await mongoose.connect(uri);
    console.log("Conectado ao MongoDB Atlas!");
  } catch (erro) {
    console.error("Erro ao conectar ao MongoDB Atlas:", erro);
  }
}
