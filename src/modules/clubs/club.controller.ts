import {auth, controller, get, permission, post, valid} from "../../routes";
import {Request, Response} from "express";
import {RequireAuthProp} from "@clerk/clerk-sdk-node";
import {ClubInfo, ClubParams} from "./club.dto";
import {dataSource} from "../../data-source";
import {User} from "../user/user.entity";
import {Club} from "./club.entity";

@controller("/club")
export class ClubController {
  @get("/all")
  async all(_req: Request, res: Response) {
    res.status(200).json(await dataSource.getRepository(Club).find())
  }

  @get("/:id/join")
  @auth()
  @permission("club:join")
  async join(req: RequireAuthProp<Request<ClubParams>>, res: Response) {
    const userRepository = dataSource.getRepository(User)
    const user = await userRepository.findOneBy({
      id: req.auth.userId
    })

    const clubRepository = dataSource.getRepository(Club)
    const club = await clubRepository.findOneBy({
      id: req.params.id
    })

    if (club === null) {
      res.status(404)
      return
    }
    if (user.joinedClubs.find(_club => _club.id === club.id) !== undefined) {
      res.status(409)
      return
    }

    user.joinedClubs.push(club)
    await userRepository.save(user)
    res.status(200)
  }

  @post("/create")
  @valid()
  @auth()
  @permission("club:create")
  async create(req: RequireAuthProp<Request<any, any, ClubInfo>>, res: Response) {
    const form = req.body
    const userRepository = dataSource.getRepository(User)
    const user = await userRepository.findOneBy({
      id: req.auth.userId
    })

    const clubRepository = dataSource.getRepository(Club)
    if (await clubRepository.existsBy({ name: form.name })) {
      res.status(409)
      return
    }
    const club = Club.fromDto(form)
    club.owner = user
    await clubRepository.save(club)
    const { id, name } = await clubRepository.findOneBy({
      name: form.name
    })
    res.status(200).json({ id, name })
  }

  @post("/:id/edit")
  @valid()
  @auth()
  @permission("club:edit")
  async edit(req: RequireAuthProp<Request<ClubParams, any, ClubInfo>>, res: Response) {
    const userRepository = dataSource.getRepository(User)
    const user = await userRepository.findOneBy({
      id: req.auth.userId
    })

    const clubRepository = dataSource.getRepository(Club)
    const club = await clubRepository.findOneBy({
      id: req.params.id
    })
    if (club === null) {
      res.status(404)
      return
    }
    if (club.owner.id !== user.id) {

    }
  }
}