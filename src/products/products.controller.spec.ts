import { Test, TestingModule } from "@nestjs/testing";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { UsersService } from "src/users/users.service";
import { AuthGuard } from "src/auth/auth.guard";

describe("ProductsController", () => {
	let controller: ProductsController;

	const mockProductsService = {
		createProduct: jest.fn(),
		updateProduct: jest.fn(),
		removeProductById: jest.fn(),
		findProductsByDate: jest.fn(),
		findAllProductsByCategory: jest.fn(),
		findAllProductsByUser: jest.fn(),
		findAllProductsByName: jest.fn(),
		findAllProducts: jest.fn(),
	};

	const mockUsersService = {
		findById: jest.fn(),
	};

	const mockAuthGuard = {
		canActivate: jest.fn(() => true),
	};

	const result = [
		{
			id: 1,
			productName: "Product",
			categoryProduct: "category",
			descriptionProduct: "product description",
			quantityProduct: 10,
			priceProduct: 100,
		},
	];

	afterEach(() => {
		jest.clearAllMocks();
	});

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

	it("should create a product", async () => {
		const req = { user: { id: 1 } };

		const createProductDto = {
			productName: "Test Product",
			categoryProduct: "category",
			descriptionProduct: "product description",
			quantityProduct: 10,
			priceProduct: 100,
		};

		const result = {
			id: 1,
			...createProductDto,
			userId: req.user.id,
		};

		mockProductsService.createProduct.mockResolvedValue(result);

		const response = await controller.createProduct(req, createProductDto);

		expect(mockProductsService.createProduct).toHaveBeenCalledWith(req, createProductDto);

		expect(response).toEqual(result);
	});

	it("should update a product", async () => {
		const id = 1;
		const updateProductDto = {
			quantityProduct: 204,
			priceProduct: 200,
		};
		const result = {
			id,
			...updateProductDto,
		};

		mockProductsService.updateProduct.mockResolvedValue(result);

		const response = await controller.updateProduct(id, updateProductDto);

		expect(mockProductsService.updateProduct).toHaveBeenCalledWith(id, updateProductDto);
		expect(response).toEqual(result);
	});

	it("should delete a product", async () => {
		const id = 1;
		mockProductsService.removeProductById.mockResolvedValue(undefined);

		const result = await controller.deleteAProductById(id);

		expect(mockProductsService.removeProductById).toHaveBeenCalledWith(id);
		expect(result).toBeUndefined();
	});

	it("should get products by date", async () => {
		const date = "2024-01-01";
		const params = { date, startDate: undefined, endDate: undefined };
		const result = [{ id: 1 }];

		mockProductsService.findProductsByDate.mockResolvedValue(result);

		const response = await controller.findProductsByDate(date);

		expect(mockProductsService.findProductsByDate).toHaveBeenCalledWith(params);
		expect(response).toEqual(result);
	});

	it("should get products by date range", async () => {
		const startDate = "2024-01-01";
		const endDate = "2024-01-31";
		const params = {
			date: undefined,
			startDate,
			endDate,
		};
		const result = [{ id: 1 }, { id: 2 }];

		mockProductsService.findProductsByDate.mockResolvedValue(result);

		const response = await controller.findProductsByDate(
			undefined,
			params.startDate,
			params.endDate
		);

		expect(mockProductsService.findProductsByDate).toHaveBeenCalledTimes(1);
		expect(mockProductsService.findProductsByDate).toHaveBeenCalledWith(params);
		expect(response).toEqual(result);
	});

	it("should get product by category", async () => {
		const category = "electronics";

		mockProductsService.findAllProductsByCategory.mockResolvedValue(result);

		const response = await controller.findAllProductsByCategory(category);

		expect(mockProductsService.findAllProductsByCategory).toHaveBeenCalledWith(category);
		expect(mockProductsService.findAllProductsByCategory).toHaveBeenCalledTimes(1);
		expect(response).toEqual(result);
	});

	it("should get products by user", async () => {
		const req = { user: { id: 1 } };
		const userId = 1;

		mockProductsService.findAllProductsByUser.mockResolvedValue(result);

		const response = await controller.findAllProductsByUser(userId, req);

		expect(mockProductsService.findAllProductsByUser).toHaveBeenCalledTimes(1);
		expect(mockProductsService.findAllProductsByUser).toHaveBeenCalledWith(1, req);
		expect(response).toEqual(result);
	});

	it("should get products by name", async () => {
		const params = "Product";

		mockProductsService.findAllProductsByName.mockResolvedValue(result);

		const response = await controller.findAllProductsByName(params);

		expect(mockProductsService.findAllProductsByName).toHaveBeenCalledWith(params);
		expect(mockProductsService.findAllProductsByName).toHaveBeenCalledTimes(1);
		expect(response).toEqual(result);
	});

	it("should all products", async () => {
		mockProductsService.findAllProducts.mockResolvedValue(result);

		const response = await controller.findAllProducts();

		expect(mockProductsService.findAllProducts).toHaveBeenCalledTimes(1);
		expect(response).toEqual(result);
	});
});
