import {
	Get,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
	Request,
	UnauthorizedException,
	UseGuards,
} from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UsersService } from "src/users/users.service";
import { CreateAcessToken } from "./dto/createAcessToken.dto";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "./auth.guard";
import * as bcrypt from "bcrypt";
import { on } from "events";

@Injectable()
export class AuthService {
	constructor(
		private UserService: UsersService,
		private jwtService: JwtService
	) {}

	async createAcessToken(userData: CreateAcessToken) {
		try {
			const user = await this.UserService.findOneUserFromEmail(userData.email);

			if (!user) {
				throw new UnauthorizedException("Usuario sem Autorização");
			}

			const payload = { sub: user?.id, username: user?.username };

			const accessToken = await this.jwtService.signAsync(payload);

			if (!accessToken) {
				throw new UnauthorizedException("Erro ao gerar token de acesso");
			}

			return accessToken;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}

			throw new InternalServerErrorException("Erro ao buscar usuário, tente novamente mais tarde.");
		}
	}

	async validateUser(email: string, password: string) {
		try {
			const user = await this.UserService.findOneUserFromEmail(email);

			const passwordVerifed = await bcrypt.compareSync(password, user.password);

			if (!passwordVerifed || user.email !== email) {
				throw new NotFoundException("Email e/ou senha inválidos");
			}

			return user;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw error;
			}
			throw new InternalServerErrorException(
				"Erro ao validar usuário, tente novamente mais tarde."
			);
		}
	}

	async signIn(createAuthDto: CreateAuthDto) {
		try {
			const user = await this.validateUser(createAuthDto.email, createAuthDto.password);

			if (!user) {
				throw new NotFoundException("Usuario sem Autorização");
			}

			const acessToken = await this.createAcessToken({
				email: user.email,
				password: user.password,
			});

			if (!acessToken) {
				throw new NotFoundException("Usuario sem Autorização");
			}

			return acessToken;
		} catch (error) {
			if (error instanceof NotFoundException) {
				return error.getResponse();
			}

			throw new InternalServerErrorException("Erro ao realizar login, tente novamente mais tarde.");
		}
	}

	@UseGuards(AuthGuard)
	@Get("profile")
	getProfile(@Request() req) {
		return req.user;
	}
}
