import {IsNumber, IsString} from "class-validator";


export class AddRoleDto {
    @IsNumber({}, {message: "User ID should be a number"})
    readonly userId: number;

    @IsString({message: "Value should be a string"})
    readonly value: string;

}