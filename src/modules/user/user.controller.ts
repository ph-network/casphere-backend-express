import { Request, Response } from "express"
import {controller, get} from "../../routes";
import {WithAuthProp} from "@clerk/clerk-sdk-node";
import {clerkClient} from "../../utils/clerk";
import {dataSource} from "../../data-source";
import {User} from "./user.entity";
import {Club} from "../clubs/club.entity";
import {logger} from "../../utils/logger";

@controller("/user")
export class UserController {

  @get("/all", false)
  async all(_req: Request, _res: Response) {
    const clubOne = new Club()
    clubOne.name = "Club 1"
    const clubTwo = new Club()
    clubTwo.name = "Club 2"
    await dataSource.manager.save(clubOne)
    await dataSource.manager.save(clubTwo)

    const user = new User()
    user.id = "ABC"
    user.ownedClubs = [clubOne, clubTwo]
    user.joinedClubs = [clubOne, clubTwo]
    await dataSource.manager.save(user)

    logger.info((await dataSource.manager.findOneBy(User, { id: "ABC" })).ownedClubs)
  }

  @get("/auth", true)
  async auth(req: WithAuthProp<Request>, res: Response) {
    const user = await clerkClient.users.getUser(req.auth.userId)
    res.status(200).send(user.id)
  }
}