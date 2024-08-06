import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {ColumnEntity} from "./column.entity";

@Entity()
export class Todo {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column("text")
    title: string;

    @ApiProperty()
    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @ApiProperty()
    @Column({default: false})
    isCompleted: boolean;

    @ManyToOne(() => ColumnEntity, column => column.todos, {onDelete: 'CASCADE'})
    @JoinColumn({name: "columnId"})
    column: ColumnEntity

    @ApiProperty()
    @Column({type: 'int', nullable: true})
    columnId: number

    @ApiProperty()
    @Column({type: 'int', default: 0})
    order: number
}