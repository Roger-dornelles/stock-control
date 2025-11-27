import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
	@ApiProperty({ example: "Joe" })
	@IsString()
	@MinLength(2, { message: "O nome deve ter no minimo 2 caracteres" })
	@IsNotEmpty({ message: "Nome Obrigatorio" })
	username: string;

	@ApiProperty({ example: "email@teste.com" })
	@IsString()
	@IsEmail({}, { message: "E-mail invalido" })
	@IsNotEmpty({ message: "E-mail Obrigatorio" })
	email: string;

	@ApiProperty({ example: "12345678" })
	@IsString()
	@MinLength(6, { message: "A senha deve ter no minimo 6 caracteres" })
	@IsNotEmpty({ message: "Senha Obrigatoria" })
	password: string;

	@ApiProperty({ example: "user | admin" })
	@IsString()
	@IsNotEmpty({ message: "Função Obrigatorio, Deve ser Usuario ou Administrador" })
	role: "user" | "admin";
}
