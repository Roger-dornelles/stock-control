import { Module } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ProductsController } from "./products.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Product } from "./entities/product.entity";
import { UsersModule } from "src/users/users.module";
import { AddNewProductEntity } from "./entities/addNewProduct.entity";

@Module({
	imports: [TypeOrmModule.forFeature([Product, AddNewProductEntity]), UsersModule],
	controllers: [ProductsController],
	providers: [ProductsService],
})
export class ProductsModule {}
