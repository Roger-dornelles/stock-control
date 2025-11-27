import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { UsersService } from "src/users/users.service";
import { CreateAcessToken } from "./dto/createAcessToken.dto";
import { JwtService } from "@nestjs/jwt";

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
				throw new UnauthorizedException({ message: "Usuario sem Autorização" });
			}

			const payload = { sub: user?.id, username: user?.username };

			const accessToken = await this.jwtService.signAsync(payload);

			if (!accessToken) {
				throw new UnauthorizedException({ message: "Erro ao gerar token de acesso" });
			}

			return accessToken;
		} catch (error) {
			throw new Error("Ocorreu um Erro => ", error.message);
		}
	}

	async signIn(createAuthDto: CreateAuthDto) {
		const acessToken = await this.createAcessToken({
			email: createAuthDto.email,
			password: createAuthDto.password,
		});

		if (!acessToken) {
			throw new UnauthorizedException({ message: "Usuario sem Autorização" });
		}

		return acessToken;
	}
}
