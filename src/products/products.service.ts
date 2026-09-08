import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UsersService } from "../users/users.service";
import { Between, ILike, Not, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { REQUEST_TYPES } from "src/utils/requesTypes";
import { StatusCodes } from "src/utils/status";
import { GenerateOrderNumber } from "src/utils/generateNumberOrder";
import { AddNewProductDto } from "./dto/add-new-product";
import { AddNewProductEntity } from "./entities/addNewProduct.entity";

interface FindProductsByDateParams {
	date?: string;
	startDate?: string;
	endDate?: string;
}
@Injectable()
export class ProductsService {
	constructor(
		@InjectRepository(Product)
		private ProductRepository: Repository<Product>,
		private userService: UsersService,

		@InjectRepository(AddNewProductEntity)
		private AddNewProductRepository: Repository<AddNewProductEntity>
	) {}

	async createProduct(req, createProductDto: CreateProductDto): Promise<Product> {
		try {
			const user = await this.userService.findOneUserFromId(req.user.id);

			if (!user) {
				throw new NotFoundException("Usuário sem autorização");
			}

			if (createProductDto.requestType.toLowerCase() !== REQUEST_TYPES.ENTRY.toLowerCase()) {
				throw new BadRequestException("Tipo de solicitação inválido. Deve ser 'Entrada'.");
			}

			if (!Object.values(StatusCodes).includes(createProductDto.status as StatusCodes)) {
				throw new BadRequestException("Status inválido");
			}

			const newOrder = GenerateOrderNumber();

			const product = {
				...createProductDto,
				productName: createProductDto.productName.toLowerCase(),
				categoryProduct: createProductDto.categoryProduct.toLowerCase(),
				clientName: createProductDto.clientName.toLowerCase(),
				userId: user.id,
				status: createProductDto.status.toLowerCase() || StatusCodes.COMMERCIAL,
				codeProduct: createProductDto.codeProduct.toLowerCase(),
				quantityProduct: createProductDto.quantityProduct,
				priceProduct: createProductDto.priceProduct,
				minimumStockLevel: createProductDto.minimumStockLevel || 0,
				orderNumber: newOrder,
			};

			return await this.ProductRepository.save(product);
		} catch (error) {
			if (error instanceof NotFoundException || error instanceof BadRequestException) {
				throw new NotFoundException(error.message);
			}
			throw new InternalServerErrorException("Erro ao criar produto, tente novamente mais tarde");
		}
	}

	async addNewProduct(req, addNewProductDto: AddNewProductDto): Promise<{ message: string }> {
		try {
			const user = await this.userService.findOneUserFromId(req.user.sub);

			const productsLength = await this.AddNewProductRepository.count();

			if (user.role !== "admin") {
				throw new NotFoundException(
					"Usuário sem autorização, apenas administradores podem adicionar novos produtos"
				);
			}

			const newProduct = {
				...addNewProductDto,
				requestType: "Entrada",
				codeProduct: productsLength + 1,
			} as AddNewProductDto;

			const newProductAdd = await this.AddNewProductRepository.save(newProduct);

			if (!newProductAdd) {
				throw new InternalServerErrorException("Erro ao criar produto, tente novamente mais tarde");
			}

			return { message: "Produto adicionado com sucesso" };
		} catch (error) {
			if (
				error instanceof NotFoundException ||
				error instanceof BadRequestException ||
				error instanceof InternalServerErrorException
			) {
				throw new NotFoundException(error.message);
			}
			throw new InternalServerErrorException("Erro ao criar produto, tente novamente mais tarde");
		}
	}

	async searchDynamicForParams(req, query: { params: string }): Promise<Product[]> {
		const user = await this.userService.findOneUserFromId(req.user.sub);

		if (user.role !== "admin") {
			throw new ForbiddenException(
				"Usuário sem autorização, apenas administradores podem realizar buscas dinâmicas"
			);
		}

		const searchTerm = query.params?.trim();

		if (!searchTerm) {
			throw new BadRequestException("Informe um termo de busca");
		}

		// remover % e _ para não interferir na busca do ILIKE
		const removedCaractersEspecials = searchTerm.replace(/[%_]/g, "\\$&");
		const queryParams = `%${removedCaractersEspecials.toLowerCase()}%`;

		return await this.ProductRepository.createQueryBuilder("product")
			.where("product.productName ILIKE :query", { query: queryParams })
			.orWhere("product.descriptionProduct ILIKE :query", { query: queryParams })
			.orWhere("product.requestType ILIKE :query", { query: queryParams })
			.orWhere("product.status ILIKE :query", { query: queryParams })
			.orWhere("product.categoryProduct ILIKE :query", { query: queryParams })
			.orWhere("product.codeProduct ILIKE :query", { query: queryParams })
			.orWhere("product.client_name ILIKE :query", { query: queryParams })
			.orderBy("product.createdAt", "ASC")
			.getMany();
	}

	async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
		try {
			if (!id) {
				throw new NotFoundException("ID do produto não informado");
			}

			const productSaveBD = await this.ProductRepository.findOne({ where: { id } });
			if (!productSaveBD) {
				throw new NotFoundException("Produto não encontrado");
			}

			const updateProduct = { ...updateProductDto, updatedAt: new Date() };

			const updateProducts = Object.assign(productSaveBD, updateProduct);

			return await this.ProductRepository.save(updateProducts);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException(error.message);
			}
			throw new InternalServerErrorException(
				"Erro ao atualizar produto, tente novamente mais tarde"
			);
		}
	}

	async removeProductById(id: number): Promise<{ message: string }> {
		try {
			if (!id) {
				throw new NotFoundException("ID do produto não informado");
			}
			const product = await this.ProductRepository.findOne({ where: { id } });

			if (!product) {
				throw new NotFoundException("Produto não encontrado");
			}
			this.ProductRepository.delete(product.id);
			return { message: "Produto excluido com sucesso" };
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException(error.message);
			}
			throw new InternalServerErrorException("Erro ao excluir produto, tente novamente mais tarde");
		}
	}

	async findProductsByDate(params: FindProductsByDateParams): Promise<Product[]> {
		try {
			let startDate: string;
			let endDate: string;

			if (params.date) {
				startDate = params.date;
				endDate = params.date;
			} else if (params.startDate && params.endDate) {
				startDate = params.startDate;
				endDate = params.endDate;
			} else {
				throw new BadRequestException("Informe uma data ou intervalo de datas");
			}

			return this.ProductRepository.createQueryBuilder("product")
				.where(`DATE(product.createdAt) BETWEEN :startDate AND :endDate`, {
					startDate,
					endDate,
				})
				.orderBy("product.createdAt", "ASC")
				.getMany();
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}

			throw new InternalServerErrorException(
				"Erro ao listar produtos por DATA, tente novamente mais tarde"
			);
		}
	}

	async findAllProductsByCategory(category: string): Promise<Product[]> {
		try {
			if (!category) {
				throw new NotFoundException("Categoria não informada");
			}

			const products = await this.ProductRepository.find({ where: { categoryProduct: category } });

			if (!products) {
				throw new NotFoundException("Nenhum produto encontrado para a categoria informada");
			}

			return products;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException(error.message);
			}

			throw new InternalServerErrorException("Erro ao listar produtos, tente novamente mais tarde");
		}
	}

	async findAllProductsByUser(userId: number, req): Promise<Product[]> {
		try {
			if (!userId) {
				throw new NotFoundException("ID do usuário não informado");
			}

			const user = await this.userService.findOneUserFromId(req.user.id);

			if (user.id !== userId) {
				throw new NotFoundException("Usuário não encontrado");
			}

			const products = await this.ProductRepository.find({ where: { userId } });

			if (!products) {
				throw new NotFoundException("Produtos não encontrados para o usuário informado");
			}

			return products;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException(error.message);
			}

			throw new InternalServerErrorException("Erro ao listar produtos, tente novamente mais tarde");
		}
	}

	async findAllProductsByName(productName: string): Promise<Product[]> {
		try {
			if (!productName) {
				throw new NotFoundException("Nome do produto não informado");
			}

			const products = await this.ProductRepository.find({
				where: {
					productName: ILike(`%${productName}%`),
				},
				order: { id: "ASC" },
			});

			if (!products) {
				throw new NotFoundException("Nenhum produto encontrado para o nome informado");
			}

			return products;
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException(error.message);
			}

			throw new InternalServerErrorException(
				"Erro ao listar produtos pelo NOME, tente novamente mais tarde"
			);
		}
	}

	async findAllProducts(): Promise<Product[]> {
		return await this.ProductRepository.find();
	}
}
