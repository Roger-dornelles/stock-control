import { Controller, Post, Body, Get, UseGuards, Request } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import {
	ApiBody,
	ApiOperation,
	ApiResponse,
	ApiTags,
	ApiBearerAuth,
	ApiOkResponse,
	ApiUnauthorizedResponse,
} from "@nestjs/swagger";

import { AuthGuard } from "./auth.guard";

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

	@UseGuards(AuthGuard)
	@Get("profile")
	@ApiBearerAuth()
	@ApiOkResponse({
		description: "Retorna os dados do usuário autenticado",
	})
	@ApiUnauthorizedResponse({
		description: "Token inválido ou ausente",
	})
	getProfile(@Request() req) {
		return req.user;
	}
}
