import {
	Injectable,
	NotFoundException,
	ConflictException,
	InternalServerErrorException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>
	) {}

	async createUser(createUserDto: CreateUserDto) {
		try {
			if (createUserDto.role !== "user" && createUserDto.role !== "admin") {
				throw new NotFoundException("Função inválida. Deve ser 'usuário' ou 'administrador'.");
			}

			const userExists = await this.userRepository.findOne({
				where: { email: createUserDto.email },
			});

			if (userExists) {
				throw new ConflictException("E-mail já cadastrado no sistema.");
			}

			createUserDto.password = await bcrypt.hashSync(createUserDto.password, 10);

			const userCreated = this.userRepository.save(createUserDto);

			return userCreated;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}

			throw new InternalServerErrorException("Erro ao criar usuário, tente novamente mais tarde.");
		}
	}

	async findOneUserFromEmail(email: string): Promise<User> {
		try {
			const user = await this.userRepository.findOne({
				where: { email },
			});

			if (!user) {
				throw new NotFoundException("Usuário não encontrado");
			}

			return user;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}

			throw new InternalServerErrorException("Erro ao buscar usuário, tente novamente mais tarde.");
		}
	}

	async findOneUserFromId(id: number): Promise<User> {
		try {
			const user = await this.userRepository.findOne({
				where: { id },
			});

			if (!user) {
				throw new NotFoundException("Usuário não encontrado");
			}
			return user;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new InternalServerErrorException("Erro ao buscar usuário, tente novamente mais tarde.");
		}
	}

	async updateInformationUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
		try {
			const user = await this.userRepository.findOne({ where: { id: Number(id) } });

			if (!user) {
				throw new NotFoundException("Usuário não encontrado");
			}

			if (updateUserDto.password) {
				updateUserDto.password = await bcrypt.hashSync(updateUserDto.password, 10);
			}

			const updatedUser = Object.assign(user, updateUserDto);

			return this.userRepository.save(updatedUser);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}

			throw new InternalServerErrorException(
				"Erro ao atualizar informações do usuário, tente novamente mais tarde."
			);
		}
	}

	async removeUser(id: number) {
		try {
			const user = await this.userRepository.findOne({ where: { id } });
			if (!user) {
				throw new NotFoundException("Usuário não encontrado");
			}
			await this.userRepository.remove(user);
			return {
				statusCode: 200,
				message: "Usuário excluído com sucesso",
			};
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new InternalServerErrorException(
				"Erro ao remover usuário, tente novamente mais tarde."
			);
		}
	}
}
