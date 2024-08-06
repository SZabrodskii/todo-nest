import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany} from "typeorm";
import {ApiProperty} from "@nestjs/swagger";
import {ColumnEntity} from "./column.entity";

@Entity()
export class Project {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({length: 100})
    title: string;

    @ApiProperty()
    @Column('text',{nullable: true})
    description?: string;

    @ApiProperty()
    @CreateDateColumn({type: "timestamp"})
    createdAt: Date;

    @OneToMany(() => ColumnEntity, column => column.project, {onDelete: 'CASCADE'})
    columns: ColumnEntity[];

}
