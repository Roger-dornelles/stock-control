import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MinLength } from "class-validator";

export class CreateProductDto {
	@ApiProperty({ example: "Nome do produto" })
	@IsString()
	@MinLength(2, { message: "O nome produto deve ter no minimo 2 caracteres" })
	@IsNotEmpty({ message: "Nome do produto Obrigatorio" })
	productName: string;

	@ApiProperty({ example: "Descrição do produto" })
	@IsString()
	@IsNotEmpty({ message: "Descrição do produto Obrigatoria" })
	descriptionProduct: string;

	@ApiProperty({ example: "Categoria do produto" })
	@IsString()
	@IsNotEmpty({ message: "Categoria do produto Obrigatoria" })
	categoryProduct: string;

	@ApiProperty({ example: "Quantidade do produto" })
	@IsNumber()
	@IsNotEmpty({ message: "Quantidade do produto Obrigatoria" })
	quantityProduct: number;

	@ApiProperty({ example: "Preço do produto" })
	@IsNumber()
	@IsNotEmpty({ message: "Preço do produto Obrigatorio" })
	priceProduct: number;
}
