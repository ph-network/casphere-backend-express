import {ClubController} from "./club.controller";
import {module} from "../../routes";

@module({
  controllers: [ClubController]
})
export class ClubModule {}