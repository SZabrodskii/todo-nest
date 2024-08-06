import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {Project} from "./project.entity";
import {Todo} from "./todo.entity";


@Entity()
export class ColumnEntity {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column('text')
    title: string;


    @ApiProperty()
    @Column({default: 0})
    order: number;

    @ApiProperty()
    @Column()
    projectId: number;

    @ManyToOne(() => Project, project => project.columns, {onDelete: 'CASCADE'})
    project: Project

    @OneToMany(() => Todo, todo => todo.column, {onDelete: 'CASCADE'})
    todos: Todo[]

}