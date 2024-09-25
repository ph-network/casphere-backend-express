import {controller, get} from "../../routes";
import {Request, Response} from "express";
import {RequireAuthProp} from "@clerk/clerk-sdk-node";
import {JoinClub} from "./club.dto";
import {dataSource} from "../../data-source";
import {User, UserRole} from "../user/user.entity";
import {Club} from "./club.entity";

@controller("/club")
export class ClubController {
  @get("/all")
  async all(_req: Request, res: Response) {
    res.status(200).json(await dataSource.getRepository(Club).find())
  }

  @get("/:id/join")
  async joinClub(req: RequireAuthProp<Request<JoinClub>>, res: Response) {
    const userRepository = dataSource.getRepository(User)
    const clubRepository = dataSource.getRepository(Club)
    const user = await userRepository.findOneBy({
      id: req.auth.userId
    })
    if (user === null)
      res.status(401)
    if (user.role !== UserRole.STUDENT)
      res.status(403)

    const club = await clubRepository.findOneBy({
      id: req.params.id
    })

    if (club === null)
      res.status(404)
    if (user.joinedClubs.find(_club => _club.id === club.id) !== undefined)
      res.status(409)

    user.joinedClubs.push(club)
    await userRepository.save(user)
    res.status(200)
  }
}