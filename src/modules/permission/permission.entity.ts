import {Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "../user/user.entity";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string
}

@Entity()
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[]

  @OneToMany(() => User, user => user.role)
  users: User[]
}