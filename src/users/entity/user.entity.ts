import {Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../../roles/entity/role.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @ApiProperty({ example: 'VlVl5@example.com', description: 'User email' })
    email: string;

    @Column()
    @ApiProperty({ example: '12345', description: 'User password' })
    password: string;

    @ManyToMany(() => Role, {eager: true})
    @JoinTable()
    @ApiProperty({ example: 'USER', description: 'User role' })
    roles: Role[]
}