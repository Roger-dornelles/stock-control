import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UsersService } from "../users/users.service";
import { Not, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { InjectRepository } from "@nestjs/typeorm";

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
				where: { productName: createProductDto.productName, userId: user.id },
			});

			if (productExists) {
				throw new NotFoundException("Produto já cadastrado.");
			}

			const product = {
				...createProductDto,
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

	async findAllProducts(): Promise<Product[]> {
		return this.ProductRepository.find();
	}
}
