import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn} from "typeorm"
import {Club} from "../clubs/club.entity";

export enum UserRole {
  TEACHER = "teacher",
  STUDENT = "student",
  ADMIN = "admin",
}

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @OneToMany(() => Club, (club) => club.owner, { eager: true })
  ownedClubs: Club[]

  @ManyToMany(() => Club, { eager: true })
  @JoinTable()
  joinedClubs: Club[]

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.STUDENT
  })
  role: UserRole
}
