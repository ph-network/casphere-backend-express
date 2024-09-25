import {app} from "./routes";
import {dataSource} from "./data-source";
import {morganMiddleware} from "./utils/logger";

export class CASPhere {
  static run(_application: any) {
    dataSource.initialize().then(async () => {
      app.use(morganMiddleware)
      app.listen(3000)
    }).catch(error => console.log(error))
  }
}