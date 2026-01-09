import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { UsersService } from "src/users/users.service";
import { AuthGuard } from "src/auth/auth.guard";

describe("ProductsController", () => {
	let controller: ProductsController;

	const mockProductsService = {
		findAll: jest.fn(),
		findOne: jest.fn(),
		create: jest.fn(),
		update: jest.fn(),
		remove: jest.fn(),
	};

	const mockUsersService = {
		findById: jest.fn(),
	};

	const mockAuthGuard = {
		canActivate: jest.fn(() => true),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [ProductsController],
			providers: [
				{
					provide: ProductsService,
					useValue: mockProductsService,
				},
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
			],
		})
			.overrideGuard(AuthGuard)
			.useValue(mockAuthGuard)
			.compile();

		controller = module.get<ProductsController>(ProductsController);
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});
});
