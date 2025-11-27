import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("login")
	@ApiOperation({
		summary: "Realizar login",
		description: "Faz a autenticação e retorna o token JWT.",
	})
	@ApiResponse({
		status: 200,
		description: "Login realizado com sucesso",
		schema: {
			example: {
				access_token: "token_aqui",
			},
		},
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@ApiBody({
		description: "Credenciais de login",
		type: CreateAuthDto,
	})
	login(@Body() createAuthDto: CreateAuthDto) {
		return this.authService.signIn(createAuthDto);
	}
}
