import {IsNotEmpty, IsString} from "class-validator";

export class ClubParams {
  id: string
}

export class ClubInfo {
  @IsString()
  @IsNotEmpty()
  name: string
}

