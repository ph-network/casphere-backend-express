import express, { Request } from "express";
import {ClerkExpressRequireAuth, RequireAuthProp} from "@clerk/clerk-sdk-node";
import {clerkClient} from "../clerk";

const user = express.Router()

user.get('/', (_req, res) => {
  res.send('User')
})

user.get('/protected', ClerkExpressRequireAuth(), async (req: RequireAuthProp<Request>, res) => {
  const user = await clerkClient.users.getUser(req.auth.userId)
  res.status(200).json(user)
})

export default user