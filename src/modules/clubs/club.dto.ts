import {IsNotEmpty, IsString} from "class-validator";

export class JoinClub {
  id: string
}

export class CreateClub {
  @IsString()
  @IsNotEmpty()
  name: string
}