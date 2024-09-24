import { Request, Response } from "express"
import {controller, get} from "../routes";

@controller("/user")
export class UserController {
  @get("/all")
  async all(req: Request, res: Response) {
    res.status(200).send("ABC")
  }
}