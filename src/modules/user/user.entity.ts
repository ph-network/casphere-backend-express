import {Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn} from "typeorm"
import {Club} from "../clubs/club.entity";
import {Role} from "../permission/permission.entity";

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @OneToMany(() => Club, (club) => club.owner, { eager: true })
  ownedClubs: Club[]

  @ManyToMany(() => Club, { eager: true })
  @JoinTable()
  joinedClubs: Club[]

  @ManyToOne(() => Role, role => role)
  role: Role
}
