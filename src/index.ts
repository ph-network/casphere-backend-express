import * as dotenv from "dotenv"
import {application} from "./routes";
import {UserModule} from "./modules/user/user.module";
import {ClubModule} from "./modules/clubs/club.module";
import {CASPhere} from "./app";

dotenv.config()

@application({
  modules: [UserModule, ClubModule]
})
class Application {}

CASPhere.run(new Application())
