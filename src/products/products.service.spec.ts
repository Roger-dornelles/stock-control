import { Test, TestingModule } from "@nestjs/testing";
import { ProductsService } from "./products.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { UsersService } from "src/users/users.service";
import {
	NotFoundException,
	BadRequestException,
	InternalServerErrorException,
} from "@nestjs/common";

describe("ProductsService", () => {
	const req = { user: { id: 1 } };

	const existingProduct = {
		id: 1,
		productName: "Product",
		categoryProduct: "category",
		descriptionProduct: "product description",
		quantityProduct: 5,
		priceProduct: 50,
		userId: 1,
	};

	const mockQueryBuilder = {
		where: jest.fn().mockReturnThis(),
		orderBy: jest.fn().mockReturnThis(),
		getMany: jest.fn(),
	};

	const mockProductRepository = {
		findOne: jest.fn(),
		find: jest.fn(),
		save: jest.fn(),
		delete: jest.fn(),
		createQueryBuilder: jest.fn(() => mockQueryBuilder),
	};

	const mockUsersService = {
		findOneUserFromId: jest.fn(),
	};

	let service: ProductsService;
	let repository: typeof mockProductRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductsService,
				{
					provide: getRepositoryToken(Product),
					useValue: mockProductRepository,
				},
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
			],
		}).compile();

		service = module.get<ProductsService>(ProductsService);
		repository = module.get(getRepositoryToken(Product));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(service).toBeDefined();
	});

	it("should create a product", async () => {
		const createProductDto = {
			productName: "Product",
			categoryProduct: "Category",
			descriptionProduct: "product description",
			quantityProduct: 10,
			priceProduct: 100,
		};

		const userMock = { id: 1, name: "Paulo" };

		const savedProduct = {
			id: 1,
			...createProductDto,
			productName: "product",
			categoryProduct: "category",
			userId: 1,
		};

		mockUsersService.findOneUserFromId.mockResolvedValue(userMock);
		repository.findOne.mockResolvedValue(null);
		repository.save.mockResolvedValue(savedProduct);

		const result = await service.createProduct(req, createProductDto);

		expect(mockUsersService.findOneUserFromId).toHaveBeenCalledWith(1);
		expect(repository.findOne).toHaveBeenCalledWith({
			where: { productName: "product", userId: 1 },
		});
		expect(repository.save).toHaveBeenCalledWith({
			...createProductDto,
			productName: "product",
			categoryProduct: "category",
			userId: 1,
		});
		expect(result).toEqual(savedProduct);
	});

	it("should update a product", async () => {
		const updateProductDto = {
			quantityProduct: 20,
			priceProduct: 200,
		};

		const updatedProduct = {
			...existingProduct,
			...updateProductDto,
		};

		repository.findOne.mockResolvedValue(existingProduct);
		repository.save.mockResolvedValue(updatedProduct);

		const result = await service.updateProduct(1, updateProductDto);

		expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
		expect(repository.save).toHaveBeenCalledWith(expect.objectContaining(updatedProduct));
		expect(result).toEqual(updatedProduct);
	});

	it("should throw NotFoundException when product is not found", async () => {
		repository.findOne.mockResolvedValue(null);

		await expect(service.updateProduct(1, { productName: "X" } as any)).rejects.toThrow(
			NotFoundException
		);

		expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	it("should delete a product by id", async () => {
		repository.findOne.mockResolvedValue(existingProduct);
		repository.delete.mockResolvedValue(undefined);

		const result = await service.removeProductById(1);

		expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
		expect(repository.delete).toHaveBeenCalledWith(1);
		expect(result).toEqual({ message: "Produto excluido com sucesso" });
	});

	it("should throw NotFoundException when deleting a non-existing product", async () => {
		repository.findOne.mockResolvedValue(null);

		await expect(service.removeProductById(1)).rejects.toThrow(NotFoundException);
		expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
	});

	it("should get products by date", async () => {
		const params = { date: "2023-10-10" };

		const productsMock = [
			{ id: 1, productName: "Product 1" },
			{ id: 2, productName: "Product 2" },
		];

		mockQueryBuilder.getMany.mockResolvedValue(productsMock);

		const result = await service.findProductsByDate(params);

		expect(repository.createQueryBuilder).toHaveBeenCalledWith("product");
		expect(mockQueryBuilder.where).toHaveBeenCalledWith(
			`DATE(product.createdAt) BETWEEN :startDate AND :endDate`,
			{ startDate: "2023-10-10", endDate: "2023-10-10" }
		);
		expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith("product.createdAt", "ASC");
		expect(result).toEqual(productsMock);
	});

	it("should throw BadRequestException when no date is provided", async () => {
		await expect(service.findProductsByDate({} as any)).rejects.toThrow(BadRequestException);
	});

	it("should return products by category", async () => {
		const category = "bebidas";

		const productsMock = [
			{ id: 1, productName: "produto 1", categoryProduct: "bebidas" },
			{ id: 2, productName: "produto 2", categoryProduct: "bebidas" },
		];

		repository.find.mockResolvedValue(productsMock);

		const result = await service.findAllProductsByCategory(category);

		expect(repository.find).toHaveBeenCalledWith({
			where: { categoryProduct: category },
		});

		expect(result).toEqual(productsMock);
	});

	it("should throw NotFoundException when no category is provided", async () => {
		await expect(service.findAllProductsByCategory("" as any)).rejects.toThrow(NotFoundException);
	});

	it("should throw InternalServerErrorException when repository throws unknown error", async () => {
		repository.find.mockRejectedValue(new Error("DB error"));

		await expect(service.findAllProductsByCategory("electronics")).rejects.toThrow(
			InternalServerErrorException
		);
	});

	it("should return products when user is valid", async () => {
		const productsMock = [
			{ id: 1, productName: "Product 1", userId: 1 },
			{ id: 2, productName: "Product 2", userId: 1 },
		];

		mockUsersService.findOneUserFromId.mockResolvedValue({ id: 1 });
		repository.find.mockResolvedValue(productsMock);

		const result = await service.findAllProductsByUser(1, req);

		expect(mockUsersService.findOneUserFromId).toHaveBeenCalledWith(1);
		expect(repository.find).toHaveBeenCalledWith({ where: { userId: 1 } });
		expect(result).toEqual(productsMock);
	});

	it("should throw NotFoundException when userId is not provided", async () => {
		await expect(service.findAllProductsByUser(undefined as any, req)).rejects.toThrow(
			NotFoundException
		);
	});

	it("should throw NotFoundException when token user is different from param", async () => {
		mockUsersService.findOneUserFromId.mockResolvedValue({ id: 2 });

		await expect(service.findAllProductsByUser(1, req)).rejects.toThrow("Usuário não encontrado");

		expect(mockUsersService.findOneUserFromId).toHaveBeenCalledWith(1);
	});

	it("should throw NotFoundException when no products are found", async () => {
		mockUsersService.findOneUserFromId.mockResolvedValue({ id: 1 });
		repository.find.mockResolvedValue(null);

		await expect(service.findAllProductsByUser(1, req)).rejects.toThrow(
			"Produtos não encontrados para o usuário informado"
		);

		expect(repository.find).toHaveBeenCalledWith({ where: { userId: 1 } });
	});

	it("should throw InternalServerErrorException on unexpected error", async () => {
		mockUsersService.findOneUserFromId.mockRejectedValue(new Error("DB failure"));

		await expect(service.findAllProductsByUser(1, req)).rejects.toThrow(
			"Erro ao listar produtos, tente novamente mais tarde"
		);
	});

	it("should return products by name", async () => {
		const name = "teste 1";

		const productsMock = [
			{ id: 1, productName: "teste 1" },
			{ id: 2, productName: "teste 2" },
		];

		repository.find.mockResolvedValue(productsMock);

		const result = await service.findAllProductsByName(name);

		expect(repository.find).toHaveBeenCalledWith({
			where: { productName: expect.any(Object) },
			order: { id: "ASC" },
		});

		expect(result).toEqual(productsMock);
	});

	it("should throw NotFoundException when productName is not provided", async () => {
		await expect(service.findAllProductsByName("" as any)).rejects.toThrow(
			"Nome do produto não informado"
		);
	});

	it("should throw NotFoundException when no products are found", async () => {
		repository.find.mockResolvedValue(null);

		await expect(service.findAllProductsByName("abc")).rejects.toThrow(
			"Nenhum produto encontrado para o nome informado"
		);
	});

	it("should throw InternalServerErrorException on unexpected error", async () => {
		repository.find.mockImplementation(() => {
			throw new Error("DB failure");
		});

		await expect(service.findAllProductsByName("abc")).rejects.toThrow(
			"Erro ao listar produtos pelo NOME, tente novamente mais tarde"
		);
	});

	it("should return all products", async () => {
		const productsMock = [
			{ id: 1, productName: "Product 1" },
			{ id: 2, productName: "Product 2" },
		];

		repository.find.mockResolvedValue(productsMock);

		const result = await service.findAllProducts();

		expect(repository.find).toHaveBeenCalledTimes(1);
		expect(result).toEqual(productsMock);
	});
});
