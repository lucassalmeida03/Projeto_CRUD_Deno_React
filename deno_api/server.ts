import express from 'express';
import responser from 'responser'
import morgan from 'morgan'
import { routes } from "./routes/index.ts"
import { connectDB } from "./config/ConnectDB.ts"
import { Request, Response, NextFunction } from "express";
const app = express()
const PORT = Deno.env.get("PORT") || 3000;
const morganConfig = morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms')
 
app.use(express.json())
app.use(morganConfig)
app.use(responser.default)
app.use(routes)


// Verifica se o erro é do tipo throwlhos.
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {

  if (err && typeof err.code === "number") {
    return res.status(err.code).json(err)
  }

  return res.status(500).json({
    code: 500,
    status: "INTERNAL_SERVER_ERROR",
    message: err.message || "Erro interno do servidor"
  })
})


await connectDB()
 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`)
})