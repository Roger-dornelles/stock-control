import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UsersService } from "../users/users.service";
import { Repository } from "typeorm";
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

	findAll() {
		return `This action returns all products`;
	}

	findOne(id: number) {
		return `This action returns a #${id} product`;
	}

	update(id: number, updateProductDto: UpdateProductDto) {
		return `This action updates a #${id} product`;
	}

	remove(id: number) {
		return `This action removes a #${id} product`;
	}
}
