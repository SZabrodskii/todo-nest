import { ApiProperty } from '@nestjs/swagger';
import {IsOptional, IsString, Length} from "class-validator";

export class CreateProjectDto {
    @ApiProperty()
    @IsString()
    @Length(1, 100)
    title: string;

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    @Length(1, 255)
    description?: string;
}

export class UpdateProjectDto {
    @ApiProperty()
    @IsString()
    @Length(1, 100)
    title: string;

    @ApiProperty({required: false})
    @IsString()
    @IsOptional()
    @Length(1, 255)
    description?: string;
}