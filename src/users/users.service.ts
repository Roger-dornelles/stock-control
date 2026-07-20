import {
	Injectable,
	NotFoundException,
	ConflictException,
	InternalServerErrorException,
	UseInterceptors,
	UploadedFile,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import * as bcrypt from "bcrypt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtService } from "@nestjs/jwt";
import { UploadService } from "src/upload/upload.service";
import { FileInterceptor } from "@nestjs/platform-express";

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
		private readonly jwtService: JwtService,
		private readonly uploadService: UploadService
	) {}

	async createUser(createUserDto: CreateUserDto, file: Express.Multer.File) {
		try {
			if (createUserDto.role !== "user" && createUserDto.role !== "admin") {
				throw new NotFoundException("Função inválida. Deve ser 'usuário' ou 'administrador'.");
			}

			const userExists = await this.userRepository.findOne({
				where: { email: createUserDto.email },
			});

			if (userExists) {
				throw new NotFoundException("E-mail já cadastrado no sistema.");
			}

			if (!file) {
				throw new NotFoundException("Imagem é obrigatório para o cadastro.");
			}

			if (file) {
				const { fileUrl } = await this.uploadService.create(file);
				createUserDto.fileUrl = await fileUrl;
			}

			createUserDto.password = await bcrypt.hashSync(createUserDto.password, 10);
			const userCreated = await this.userRepository.save(createUserDto);

			if (!userCreated) {
				throw new NotFoundException("Erro ao registrar usuário...");
			}

			const payload = { sub: userCreated?.id, username: userCreated?.username };

			const accessToken = await this.jwtService.signAsync(payload);

			if (!accessToken) {
				throw new InternalServerErrorException("Erro ao gerar token de acesso");
			}

			const userWithToken = { ...userCreated, accessToken };
			return userWithToken;
		} catch (error) {
			if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
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

	async updateInformationUser(
		id: string,
		updateUserDto: UpdateUserDto,
		file: Express.Multer.File
	): Promise<User> {
		try {
			const user = await this.userRepository.findOne({ where: { id: Number(id) } });

			if (!user) {
				throw new NotFoundException("Usuário não encontrado");
			}

			if (updateUserDto.password) {
				updateUserDto.password = await bcrypt.hashSync(updateUserDto.password, 10);
			}
			if (file) {
				if (user.fileUrl) {
					const updatedImage = await this.uploadService.updateImage(file, user.fileUrl);
					if (updatedImage?.fileUrl) {
						updateUserDto.fileUrl = await updatedImage.fileUrl;
					}
				}
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
			const notImageUser = await this.uploadService.deleteFile(user.fileUrl);

			if (!notImageUser) {
				throw new InternalServerErrorException("Erro ao excluir imagem do usuário");
			}
			await this.userRepository.remove(user);
			return {
				statusCode: 200,
				message: "Usuário excluído com sucesso",
			};
		} catch (error) {
			if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
				throw error;
			}
			throw new InternalServerErrorException(
				"Erro ao remover usuário, tente novamente mais tarde."
			);
		}
	}
}
