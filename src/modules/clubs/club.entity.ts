import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn} from "typeorm";
import {User} from "../user/user.entity";

@Entity()
export class Club {
  @PrimaryColumn("uuid")
  id: string

  @Column()
  name: string

  @ManyToOne(() => User, (user) => user.ownedClubs)
  owner: User

  @ManyToMany(() => User)
  @JoinTable()
  members: User[]
}
