import {
	Injectable,
	NotFoundException,
	ConflictException,
	HttpException,
	InternalServerErrorException,
	BadRequestException,
} from "@nestjs/common";
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
			throw new ConflictException("Erro ao criar usuário ");
		}
	}

	async findOneUserFromEmail(email: string): Promise<User> {
		try {
			const normalizedEmail = email.trim().toLowerCase();

			const user = await this.userRepository.findOne({
				where: { email: normalizedEmail },
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
}
