import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

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
			throw new Error("Erro ao criar usuário: " + error.message);
		}
	}
}
