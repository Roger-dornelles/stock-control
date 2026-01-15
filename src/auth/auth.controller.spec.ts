import { Test } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard"; // ajuste o path

describe("AuthController", () => {
	const dto = { email: "test@yahoo.com", password: "123456" };

	let controller: AuthController;

	const mockAuthService = {
		signIn: jest.fn(),
	};

	const mockAuthGuard: CanActivate = {
		canActivate: (context: ExecutionContext) => true,
	};

	beforeEach(async () => {
		const module = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: mockAuthService,
				},
			],
		})
			.overrideGuard(AuthGuard)
			.useValue(mockAuthGuard)
			.compile();

		controller = module.get<AuthController>(AuthController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should login successfully", async () => {
		const resultMock = { access_token: "jwt_token" };

		mockAuthService.signIn.mockResolvedValue(resultMock);

		const result = await controller.login(dto);

		expect(mockAuthService.signIn).toHaveBeenCalledWith(dto);
		expect(result).toEqual(resultMock);
	});

	it("should throw error when service fails", async () => {
		mockAuthService.signIn.mockRejectedValue(new Error("Credencias inválidas"));

		await expect(controller.login(dto)).rejects.toThrow("Credencias inválidas");
	});

	it("should return user profile from request", () => {
		const userMock = {
			id: 1,
			email: "test@yahoo.com",
			role: "user",
		};

		const req = {
			user: userMock,
		};

		const result = controller.getProfile(req as any);

		expect(result).toEqual(userMock);
	});
});
