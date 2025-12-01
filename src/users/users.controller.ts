import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@ApiOperation({
		summary: "Criação de usuário",
		description: "Cria um novo usuário no sistema.",
	})
	@ApiResponse({
		status: 200,
		description: "Usuário criado com sucesso",
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@ApiBody({
		description: "Credenciais de login",
		type: CreateUserDto,
	})
	createUser(@Body() createUserDto: CreateUserDto) {
		return this.usersService.createUser(createUserDto);
	}
}
