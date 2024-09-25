import {Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm"
import {Club} from "../clubs/club.entity";

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @OneToMany(() => Club, (club) => club.owner, { eager: true })
  ownedClubs: Club[]

  @ManyToMany(() => Club, { eager: true })
  @JoinTable()
  joinedClubs: Club[]
}
