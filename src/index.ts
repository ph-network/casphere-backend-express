import { dataSource } from "./data-source"
import * as dotenv from "dotenv"
import {morganMiddleware} from "./utils/logger";
import {app, application} from "./routes";
import {UserModule} from "./modules/user/user.module";
import {ClubModule} from "./modules/clubs/club.module";

dotenv.config()

@application({
  modules: [UserModule, ClubModule]
})
class Application {}

dataSource.initialize().then(async () => {
  app.use(morganMiddleware)
  new Application()
  app.listen(3000)
}).catch(error => console.log(error))
