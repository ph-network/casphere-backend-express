import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";
import {ClubInfo} from "./club.dto";
import {plainToClass} from "class-transformer";

@Entity()
export class Club {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @ManyToOne(() => User, (user) => user.ownedClubs)
  owner: User

  @ManyToMany(() => User)
  members: User[]

  static fromDto(model: ClubInfo): Club {
    return plainToClass(Club, model)
  }

  toDto(): ClubInfo {
    return plainToClass(ClubInfo, this)
  }
}
