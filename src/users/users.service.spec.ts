import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "../products/products.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "../products/entities/product.entity";
import { UsersService } from "src/users/users.service";

describe("ProductsService", () => {
	let service: ProductsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductsService,
				{
					provide: getRepositoryToken(Product),
					useValue: {
						find: jest.fn(),
						findOne: jest.fn(),
						save: jest.fn(),
						delete: jest.fn(),
					},
				},
				{
					provide: UsersService,
					useValue: {
						findById: jest.fn(),
					},
				},
			],
		}).compile();

		service = module.get<ProductsService>(ProductsService);
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});
});
