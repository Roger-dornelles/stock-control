import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, Patch } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ApiBody, ApiOperation, ApiResponse } from "@nestjs/swagger";
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

	@UseGuards(AuthGuard)
	@Patch(":id")
	updateProduct(@Param("id") id: number, @Body() updateProductDto: UpdateProductDto) {
		return this.productsService.updateProduct(id, updateProductDto);
	}

	@Get()
	findAll() {
		return this.productsService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.productsService.findOne(+id);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.productsService.remove(+id);
	}
}
