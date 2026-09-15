import express from 'express';
import responser from 'responser'
import morgan from 'morgan'
import { routes } from "./routes/index.ts"
import { connectDB } from "./config/ConnectDB.ts"
const app = express()
const PORT = Deno.env.get("PORT") || 3000;
const morganConfig = morgan(':remote-addr :method :url :status :res[content-length] - :response-time ms')
 
app.use(responser.default)
app.use(express.json())
app.use(morganConfig)
app.use(routes)

await connectDB()
 
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta: ${PORT}`)
})