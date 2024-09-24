import {module} from "../routes";
import {UserController} from "./user.controller";

@module({
  controllers: [UserController]
})
export class UserModule {}