import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	UseGuards,
	Req,
	Patch,
	Query,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("products")
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	@ApiOperation({
		summary: "Criação do produto",
		description: "Cria um novo produto no sistema.",
	})
	@ApiResponse({
		status: 200,
		description: "Produto criado com sucesso",
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@ApiBody({
		description: "Detalhes do produto",
		type: CreateProductDto,
	})
	@UseGuards(AuthGuard)
	createProduct(@Req() req, @Body() createProductDto: CreateProductDto) {
		return this.productsService.createProduct(req, createProductDto);
	}

	@Patch(":id")
	@ApiOperation({
		summary: "Atualizar parte do produto",
		description: "Atualizar um produto no sistema.",
	})
	@ApiParam({
		name: "id",
		type: Number,
		description: "ID do produto",
		example: "8fd0a8b2-5240-4a8e-bc4c-9d09bfb78111",
	})
	@ApiResponse({
		status: 200,
		description: "Produto atualizado com sucesso",
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@ApiBody({
		description: "Detalhes do produto",
		type: CreateProductDto,
	})
	@UseGuards(AuthGuard)
	updateProduct(@Param("id") id: number, @Body() updateProductDto: UpdateProductDto) {
		return this.productsService.updateProduct(id, updateProductDto);
	}

	@Delete(":id")
	@ApiOperation({
		summary: "Excluir um produto",
		description: "Excluir um produto no sistema.",
	})
	@ApiParam({
		name: "id",
		type: Number,
		description: "ID do produto",
		example: "8fd0a8b2-5240-4a8e-bc4c-9d09bfb78111",
	})
	@ApiResponse({
		status: 200,
		description: "Produto excluido com sucesso",
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@UseGuards(AuthGuard)
	deleteAProductById(@Param("id") id: number) {
		return this.productsService.removeProductById(id);
	}

	@Get("/date")
	@ApiOperation({
		summary: "Listar todos os produtos pela data selecionada",
		description: "Listar todos os produtos do sistema.",
	})
	@ApiBody({
		description: "Detalhes dos produtos selecionados pela data",
		type: CreateProductDto,
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@UseGuards(AuthGuard)
	findProductsByDate(
		@Query("date") date?: string,
		@Query("startDate") startDate?: string,
		@Query("endDate") endDate?: string
	) {
		return this.productsService.findProductsByDate({
			date,
			startDate,
			endDate,
		});
	}

	@Get(":id")
	@ApiOperation({
		summary: "Listar produtos por usuario",
		description: "Listar produtos por usuario no sistema.",
	})
	@ApiParam({
		name: "id",
		type: Number,
		description: "ID do usuario",
		example: "8fd0a8b2-5240-4a8e-bc4c-9d09bfb78111",
	})
	@ApiBody({
		description: "Detalhes do produto",
		type: CreateProductDto,
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@UseGuards(AuthGuard)
	findAllProductsByUser(@Param("id") userId: number, @Req() req) {
		return this.productsService.findAllProductsByUser(userId, req);
	}

	@Get(":category")
	@ApiOperation({
		summary: "Listar produtos por categoria ",
		description: "Listar produtos por categoria no sistema.",
	})
	@ApiParam({
		name: "category",
		type: String,
		description: "Categoria do produto",
		example: "Bazar",
	})
	@ApiBody({
		description: "Detalhes dos produto",
		type: CreateProductDto,
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@UseGuards(AuthGuard)
	findAllProductsByCategory(@Param("category") category: string) {
		return this.productsService.findAllProductsByCategory(category);
	}

	@Get()
	@ApiOperation({
		summary: "Listar todos os produtos",
		description: "Listar todos os produtos do sistema.",
	})
	@ApiBody({
		description: "Detalhes dos produtos",
		type: CreateProductDto,
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@UseGuards(AuthGuard)
	findAllProducts() {
		return this.productsService.findAllProducts();
	}
}
