import {controller, get} from "../../routes";
import {Request, Response} from "express";

@controller("/club")
export class ClubController {
  @get("/all")
  async all(_req: Request, res: Response) {
    res.status(200).send("ABC")
  }
}