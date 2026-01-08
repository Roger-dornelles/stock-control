import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";

describe("AuthController", () => {
	let controller: AuthController;

	const mockUsersService = {
		findByEmail: jest.fn(),
		create: jest.fn(),
	};

	const mockJwtService = {
		signAsync: jest.fn(),
	};

	const mockAuthService = {
		login: jest.fn(),
		register: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: mockAuthService,
				},
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

		controller = module.get<AuthController>(AuthController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
