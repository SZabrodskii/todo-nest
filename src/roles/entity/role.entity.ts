import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";



@Entity()
export class Role {
    @ApiProperty({example: '1', description: 'Unique identifier'})
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({example: 'USER', description: 'Role name'})
    @Column()
    value: string;

    @ApiProperty({example: 'User role', description: 'User role description'})
    @Column()
    description: string;

}