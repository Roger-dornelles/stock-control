import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateAuthDto {
	@ApiProperty({ example: "email@teste.com" })
	@IsEmail({}, { message: "E-mail invalido." })
	email: string;

	@ApiProperty({ example: "12345678" })
	@IsString()
	password: string;
}
