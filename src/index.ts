import express from "express"
import dotenv from "dotenv";
import "reflect-metadata"
import user from "./controllers/user.controller";
import {logger, morganMiddleware} from "./logger";

dotenv.config();

const app = express()
const port = process.env.PORT;

app.use(morganMiddleware)
app.use("/user", user)

app.get('/', (_req, res) => {
  res.send("Hello World")
})

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})