import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {
    @ApiProperty({example: 'login@example.com', description: 'User email'})
    @IsString({message: "Should be a string"})
    @IsEmail({},{message: "Incorrect email"})
    email: string;

    @ApiProperty({example: '12345', description: 'User password'})
    @Length(4, 16, {message: "Password should be from 4 to 16 symbols"})
    password: string;
}