import {
	BadRequestException,
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
		private userService: UsersService
	) {}

	async createProduct(req, createProductDto: CreateProductDto): Promise<Product> {
		try {
			const user = await this.userService.findOneUserFromId(req.user.id);

			if (!user) {
				throw new NotFoundException("Usuário sem autorização");
			}

			const productExists = await this.ProductRepository.findOne({
				where: { productName: createProductDto.productName.toLowerCase(), userId: user.id },
			});

			if (productExists) {
				throw new NotFoundException("Produto já cadastrado.");
			}

			const product = {
				...createProductDto,
				productName: createProductDto.productName.toLowerCase(),
				categoryProduct: createProductDto.categoryProduct.toLowerCase(),
				userId: user.id,
			};

			return await this.ProductRepository.save(product);
		} catch (error) {
			if (error instanceof NotFoundException) {
				throw new NotFoundException(error.message);
			}
			throw new InternalServerErrorException("Erro ao criar produto, tente novamente mais tarde");
		}
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
