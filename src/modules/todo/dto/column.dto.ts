import {ApiProperty} from "@nestjs/swagger";
import {IsInt, IsNotEmpty, IsOptional, IsString, Length} from "class-validator";


export class CreateColumnDto {
    @ApiProperty()
    @IsString()
    @Length(1, 100)
    title: string;

    @ApiProperty()
    @IsInt()
    @IsNotEmpty()
    projectId: number;

    @ApiProperty({ required: false })
    @IsOptional()
    order?: number;
}

export class UpdateColumnDto {
    @ApiProperty()
    @IsString()
    @Length(1, 100)
    title: string;
}