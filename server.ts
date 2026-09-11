import express from 'express';
import { Request, Response } from "express"
import responser from 'responser'
import { routes } from "./routes/index.ts"

const app = express()
const port = 3000

app.use(routes)
app.use(responser)
app.use(express.json())


app.get('/', (req: Request, res: Response) => {
  res.send_ok('Hello World!')
})

app.listen(port, () => {
  console.log(`Servidor rodando na porta: ${port}`)
})