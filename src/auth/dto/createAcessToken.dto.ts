import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateAcessToken {
	@IsEmail({}, { message: "E-mail invalido." })
	email: string;

	@IsString()
	@MinLength(8, { message: "Senha deve conter 8 caracteres ou mais." })
	password: string;
}
