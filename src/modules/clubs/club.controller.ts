import {controller, get, post} from "../../routes";
import {Request, Response} from "express";
import {RequireAuthProp} from "@clerk/clerk-sdk-node";
import {CreateClub, JoinClub} from "./club.dto";
import {dataSource} from "../../data-source";
import {User} from "../user/user.entity";
import {Club} from "./club.entity";
import {validateStudent} from "./club.util";

@controller("/club")
export class ClubController {
  @get("/all")
  async all(_req: Request, res: Response) {
    res.status(200).json(await dataSource.getRepository(Club).find())
  }

  @get("/:id/join", {
    auth: true
  })
  async join(req: RequireAuthProp<Request<JoinClub>>, res: Response) {
    const userRepository = dataSource.getRepository(User)
    const user = await userRepository.findOneBy({
      id: req.auth.userId
    })
    const validateUserResult = await validateStudent(user)
    if (!validateUserResult.ok) {
      res.status(validateUserResult.statusCode)
      return
    }

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

  @post("/create", {
    validate: true,
    auth: true
  })
  async create(req: RequireAuthProp<Request<any, any, CreateClub>>, res: Response) {
    const form = req.body
    const userRepository = dataSource.getRepository(User)
    const user = await userRepository.findOneBy({
      id: req.auth.userId
    })
    const validateUserResult = await validateStudent(user)
    if (!validateUserResult.ok) {
      res.status(validateUserResult.statusCode)
      return
    }

    const clubRepository = dataSource.getRepository(Club)
    if (await clubRepository.existsBy({ name: form.name })) {
      res.status(409)
      return
    }
    const club = Club.fromDto(form)
    await clubRepository.save(club)
    const { id, name } = await clubRepository.findOneBy({
      name: form.name
    })
    res.status(200).json({ id, name })
  }
}