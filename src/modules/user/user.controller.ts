import { Request, Response } from "express"
import {auth, controller, get} from "../../routes";
import {WithAuthProp} from "@clerk/clerk-sdk-node";
import {clerkClient} from "../../utils/clerk";

@controller("/user")
export class UserController {
  @get("/all")
  async all(_req: Request, res: Response) {
    res.status(200).send("ABC")
  }

  @get("/auth")
  @auth()
  async authExample(req: WithAuthProp<Request>, res: Response) {
    const user = await clerkClient.users.getUser(req.auth.userId)
    res.status(200).send(user.id)
  }
}