import { Controller, Get, Post, Body, Patch, Param, UseGuards, Delete } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";

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

	@Get(":id")
	@ApiOperation({
		summary: "Obter usuário por ID",
	})
	@ApiParam({
		name: "id",
		type: String,
		description: "ID do usuário",
		example: "8fd0a8b2-5240-4a8e-bc4c-9d09bfb78111",
	})
	@ApiResponse({
		status: 200,
		description: "dados dos usuario retornados com sucesso",
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@UseGuards(AuthGuard)
	findOneUserFromId(@Param("id") id: string) {
		return this.usersService.findOneUserFromId(+id);
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Atualizar informações do usuário por ID",
	})
	@ApiParam({
		name: "id",
		type: String,
		description: "ID do usuário",
		example: "8fd0a8b2-5240-4a8e-bc4c-9d09bfb78111",
	})
	@ApiBody({ type: UpdateUserDto })
	@ApiResponse({
		status: 200,
		description: "dados dos usuario atualizados com sucesso",
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@UseGuards(AuthGuard)
	upadetUser(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.updateInformationUser(id, updateUserDto);
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Excluir usuário por ID",
	})
	@ApiParam({
		name: "id",
		type: String,
		description: "ID do usuário",
		example: "8fd0a8b2-5240-4a8e-bc4c-9d09bfb78111",
	})
	@ApiResponse({
		status: 200,
		description: "Usuário excluído com sucesso",
	})
	@ApiResponse({
		status: 401,
		description: "Usuario não encontrado.",
	})
	@UseGuards(AuthGuard)
	removeUser(@Param("id") id: string) {
		return this.usersService.removeUser(+id);
	}
}
