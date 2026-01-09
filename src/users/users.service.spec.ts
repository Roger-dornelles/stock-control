import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { NotFoundException } from "@nestjs/common";

describe("UsersService", () => {
	const mockUserRepository = {
		findOne: jest.fn(),
		save: jest.fn(),
		remove: jest.fn(),
	};

	const createUserDto = {
		username: "Paulo",
		email: "paulo@test.com",
		password: "123456",
		role: "user",
	} as const;

	const userMock = {
		id: 1,
		...createUserDto,
	};

	let service: UsersService;
	let repository: typeof mockUserRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useValue: mockUserRepository,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
		repository = mockUserRepository;
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("should create a user", async () => {
		repository.findOne.mockResolvedValue(undefined);
		repository.save.mockResolvedValue(userMock);

		const result = await service.createUser(createUserDto);

		expect(repository.findOne).toHaveBeenCalledWith({
			where: { email: createUserDto.email },
		});
		expect(repository.save).toHaveBeenCalledWith(createUserDto);
		expect(result).toEqual(userMock);
	});

	it("should return a user by ID", async () => {
		repository.findOne.mockResolvedValue(userMock);

		const result = await service.findOneUserFromId(1);

		expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
		expect(result).toEqual(userMock);
	});

	it("should throw NotFoundException when user by ID not found", async () => {
		repository.findOne.mockResolvedValue(null);

		await expect(service.findOneUserFromId(1)).rejects.toThrow(NotFoundException);
	});

	it("should return a user by email", async () => {
		repository.findOne.mockResolvedValue(userMock);

		const result = await service.findOneUserFromEmail(userMock.email);

		expect(repository.findOne).toHaveBeenCalledWith({ where: { email: userMock.email } });
		expect(result).toEqual(userMock);
	});

	it("should throw NotFoundException when user by email not found", async () => {
		repository.findOne.mockResolvedValue(null);
		await expect(service.findOneUserFromEmail("test@test.com")).rejects.toThrow(NotFoundException);
	});

	it("should update user information", async () => {
		const updateUser = { username: "Paulo Alves" };
		const updatedUserMock = { ...userMock, ...updateUser };
		repository.findOne.mockResolvedValue(userMock);
		repository.save.mockResolvedValue(updatedUserMock);

		const result = await service.updateInformationUser("1", updateUser);

		expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
		expect(repository.save).toHaveBeenCalledWith({ ...userMock, ...updateUser });
		expect(result).toEqual(updatedUserMock);
	});

	it("should throw NotFoundException  when user not found", async () => {
		repository.findOne.mockResolvedValue(null);

		await expect(service.updateInformationUser("1", { username: "Test" })).rejects.toThrow(
			NotFoundException
		);
	});

	it("should remove a user", async () => {
		repository.findOne.mockResolvedValue(userMock);
		repository.remove.mockResolvedValue(userMock);

		const result = await service.removeUser(1);

		expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
		expect(repository.remove).toHaveBeenCalledWith(userMock);
		expect(result).toEqual({ message: "Usuário excluído com sucesso", statusCode: 200 });
	});

	it("should throw NotFoundException when trying to remove a non-existing user", async () => {
		repository.findOne.mockResolvedValue(null);

		await expect(service.removeUser(1)).rejects.toThrow(NotFoundException);
	});
});
