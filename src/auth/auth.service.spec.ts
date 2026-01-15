import * as bcrypt from "bcrypt";
import { Test, TestingModule } from "@nestjs/testing";
import { JwtService } from "@nestjs/jwt";
import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";

jest.mock("bcrypt", () => ({
	compareSync: jest.fn(),
}));

describe("AuthService - createAcessToken", () => {
	const userData = { email: "test@yahoo.com" };

	const authDto = {
		email: "test@test.com",
		password: "123456",
	};

	const userMock = {
		id: 1,
		email: "test@test.com",
		password: "hashedPassword",
		username: "test",
	};

	let service: AuthService;

	const mockUsersService = {
		findOneUserFromEmail: jest.fn(),
	};

	const mockJwtService = {
		signAsync: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should create access token successfully", async () => {
		const userMock = { id: 1, username: "paulo", email: "paulo@yahoo.com" };
		const tokenMock = "jwt.token";

		mockUsersService.findOneUserFromEmail.mockResolvedValue(userMock);
		mockJwtService.signAsync.mockResolvedValue(tokenMock);

		const result = await service.createAcessToken(userData as any);

		expect(mockUsersService.findOneUserFromEmail).toHaveBeenCalledWith("test@yahoo.com");
		expect(mockJwtService.signAsync).toHaveBeenCalledWith({
			sub: 1,
			username: "paulo",
		});
		expect(result).toBe(tokenMock);
	});

	it("should throw InternalServerErrorException when token is not generated", async () => {
		const userMock = { id: 1, username: "joao", email: "test@test.com" };

		mockUsersService.findOneUserFromEmail.mockResolvedValue(userMock);
		mockJwtService.signAsync.mockResolvedValue(null);

		await expect(service.createAcessToken(userData as any)).rejects.toThrow(
			InternalServerErrorException
		);

		await expect(service.createAcessToken(userData as any)).rejects.toThrow(
			"Erro ao buscar usuário, tente novamente mais tarde."
		);
	});

	it("should throw InternalServerErrorException on unexpected error", async () => {
		mockUsersService.findOneUserFromEmail.mockRejectedValue(new Error("DB failure"));

		await expect(service.createAcessToken(userData as any)).rejects.toThrow(
			InternalServerErrorException
		);
	});

	it("should return user when email and password are valid", async () => {
		mockUsersService.findOneUserFromEmail.mockResolvedValue(userMock);
		(bcrypt.compareSync as jest.Mock).mockReturnValue(true);

		const result = await service.validateUser("test@test.com", "123456");

		expect(bcrypt.compareSync).toHaveBeenCalledWith("123456", userMock.password);
		expect(result).toEqual(userMock);
	});

	it("should throw NotFoundException when password is invalid", async () => {
		mockUsersService.findOneUserFromEmail.mockResolvedValue(userMock);
		(bcrypt.compareSync as jest.Mock).mockReturnValue(false);

		await expect(service.validateUser("test@test.com", "wrong")).rejects.toThrow(NotFoundException);
	});

	it("should throw NotFoundException when email does not match", async () => {
		mockUsersService.findOneUserFromEmail.mockResolvedValue(userMock);
		(bcrypt.compareSync as jest.Mock).mockReturnValue(true);

		await expect(service.validateUser("other@test.com", "123456")).rejects.toThrow(
			NotFoundException
		);
	});

	it("should throw InternalServerErrorException when user service fails", async () => {
		mockUsersService.findOneUserFromEmail.mockRejectedValue(new Error("DB error"));

		await expect(service.validateUser("test@test.com", "123")).rejects.toThrow(
			InternalServerErrorException
		);
	});

	it("should throw InternalServerErrorException when user service fails", async () => {
		mockUsersService.findOneUserFromEmail.mockRejectedValue(new Error("DB error"));

		await expect(service.validateUser("test@test.com", "123")).rejects.toThrow(
			InternalServerErrorException
		);
	});

	it("should return access token when login is successful", async () => {
		jest.spyOn(service, "validateUser").mockResolvedValue(userMock as any);
		jest.spyOn(service, "createAcessToken").mockResolvedValue("token123");

		const result = await service.signIn(authDto);

		expect(service.validateUser).toHaveBeenCalledWith(authDto.email, authDto.password);
		expect(service.createAcessToken).toHaveBeenCalledWith({
			email: userMock.email,
			password: userMock.password,
		});
		expect(result).toBe("token123");
	});

	it("should return NotFoundException response when validateUser returns null", async () => {
		jest.spyOn(service, "validateUser").mockResolvedValue(null as any);

		const result = await service.signIn(authDto);

		expect(result).toEqual({
			statusCode: 404,
			message: "Usuario sem Autorização",
			error: "Not Found",
		});
	});

	it("should return NotFoundException response when validateUser throws NotFoundException", async () => {
		jest
			.spyOn(service, "validateUser")
			.mockRejectedValue(new NotFoundException("Usuario sem Autorização"));

		const result = await service.signIn(authDto);

		expect(result).toEqual({
			statusCode: 404,
			message: "Usuario sem Autorização",
			error: "Not Found",
		});
	});

	it("should throw InternalServerErrorException on unexpected error", async () => {
		jest.spyOn(service, "validateUser").mockRejectedValue(new Error("DB failure"));

		await expect(service.signIn(authDto)).rejects.toThrow(
			"Erro ao realizar login, tente novamente mais tarde."
		);
	});
});
