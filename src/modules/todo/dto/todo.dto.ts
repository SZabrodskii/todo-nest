import {ApiProperty} from "@nestjs/swagger";
import {IsBoolean, IsInt, IsOptional, IsString, Length} from "class-validator";

export class CreateTodoDto {
    @ApiProperty()
    @IsString()
    @Length(1, 255)
    title: string;

    @ApiProperty({ required: false })
    @IsOptional()
    order?: number;

    @ApiProperty()
    @IsOptional()
    @IsBoolean()
    isCompleted?: boolean;

    @ApiProperty()
    @IsInt()
    columnId: number;
}

export class UpdateTodoDto {
    @ApiProperty()
    @IsString()
    @Length(1, 255)
    title: string;

    @ApiProperty()
    @IsBoolean()
    isCompleted: boolean;
}