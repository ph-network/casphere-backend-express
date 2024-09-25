import {User, UserRole} from "../user/user.entity";
import {Repository} from "typeorm";
import {Result} from "../../utils/error";

export async function validateStudent(user: User): Promise<Result> {
  if (user === null) {
    return Result.error(404)
  }
  if (user.role !== UserRole.STUDENT) {
    return Result.error(403)
  }

  return Result.ok()
}