import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthGuard } from "src/auth/auth.guard";

const mockUsersService = {
	createUser: jest.fn(),
	findOneUserFromId: jest.fn(),
	updateInformationUser: jest.fn(),
	removeUser: jest.fn(),
};

const mockAuthGuard = {
	canActivate: jest.fn(() => true),
};

describe("UsersController", () => {
	let controller: UsersController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
			],
		})
			.overrideGuard(AuthGuard)
			.useValue(mockAuthGuard)
			.compile();

		controller = module.get<UsersController>(UsersController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	it("should return user", async () => {
		const userMock = { id: 1, username: "Paulo" };
		mockUsersService.findOneUserFromId.mockResolvedValue(userMock);

		const result = await controller.findOneUserFromId("1");

		expect(result).toEqual(userMock);
		expect(mockUsersService.findOneUserFromId).toHaveBeenCalledWith(1);
	});

	it("should create a user", async () => {
		const dto = { username: "Paulo", email: "paulo@test.com", password: "123456", role: "user" };
		mockUsersService.createUser.mockResolvedValue(dto);

		const result = await controller.createUser(dto as any);

		expect(result).toEqual(dto);
		expect(mockUsersService.createUser).toHaveBeenCalledWith(dto);
	});

	it("should update a user", async () => {
		const dto = { username: "Paulo alves" };
		mockUsersService.updateInformationUser.mockResolvedValue(dto);

		const result = await controller.upadetUser("1", dto as any);

		expect(result).toEqual(dto);
		expect(mockUsersService.updateInformationUser).toHaveBeenCalledWith("1", dto);
	});

	it("should delete a user", async () => {
		mockUsersService.removeUser.mockResolvedValue({ deleted: true });

		const result = await controller.removeUser("1");

		expect(result).toEqual({ deleted: true });
		expect(mockUsersService.removeUser).toHaveBeenCalledWith(1);
	});
});
