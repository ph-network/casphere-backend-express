import {Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm"
import {Club} from "../clubs/club.entity";

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @OneToMany(() => Club, (club) => club.owner)
  ownedClubs: Club[]

  @ManyToMany(() => Club)
  @JoinTable()
  joinedClubs: Club[]
}
