import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";

export class CreateProductDto {
	@ApiProperty({ example: "Nome do produto" })
	@IsString()
	@MinLength(2, { message: "O nome produto deve ter no minimo 2 caracteres" })
	@IsNotEmpty({ message: "Nome do produto Obrigatorio" })
	productName!: string;

	@ApiProperty({ example: "Nome do cliente" })
	@IsString()
	@IsNotEmpty({ message: "Nome do cliente Obrigatorio" })
	clientName!: string;

	@ApiProperty({ example: "Descrição do produto" })
	@IsString()
	@IsNotEmpty({ message: "Descrição do produto Obrigatoria" })
	descriptionProduct!: string;

	@ApiProperty({ example: "Categoria do produto" })
	@IsString()
	@IsNotEmpty({ message: "Categoria do produto Obrigatoria" })
	categoryProduct!: string;

	@ApiProperty({ example: "Quantidade do produto" })
	@IsNumber()
	@IsNotEmpty({ message: "Quantidade do produto Obrigatoria" })
	quantityProduct!: number;

	@ApiProperty({ example: "Preço do produto" })
	@IsNumber()
	@IsOptional()
	@IsNotEmpty({ message: "Preço do produto Obrigatorio" })
	priceProduct!: number;

	@ApiProperty({ example: "Status andamento do produto EX: Produção, Cancelado" })
	@IsString()
	@IsNotEmpty({ message: "Status do produto Obrigatorio" })
	status!: string;

	@ApiProperty({ example: "Quantidade mínima de estoque" })
	@IsNumber()
	@IsOptional()
	@IsNotEmpty({ message: "Quantidade mínima de estoque Obrigatorio" })
	minimumStockLevel!: number;

	@ApiProperty({ example: "Código do produto" })
	@IsString()
	@IsNotEmpty({ message: "Código do produto Obrigatorio" })
	codeProduct!: string;

	@ApiProperty({ example: "Tipo de solicitação EX; Entrada, Saída" })
	@IsString()
	@IsNotEmpty({ message: "Tipo de solicitação Obrigatorio" })
	requestType!: string;

	@ApiProperty({ example: "Número do pedido EX:1234" })
	@IsString()
	@IsOptional()
	orderNumber!: string;
}
