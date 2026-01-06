import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "products" })
export class Product {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({ name: "user_id", type: "int", nullable: false })
	userId: number;

	@Column({ name: "product_name", type: "varchar", length: 100, nullable: false })
	productName: string;

	@Column({ name: "description_product", type: "text", nullable: false })
	descriptionProduct: string;

	@Column({ name: "category_product", type: "varchar", length: 50, nullable: false })
	categoryProduct: string;

	@Column({ name: "quantity_product", type: "int", nullable: false })
	quantityProduct: number;

	@Column({
		name: "price_product",
		type: "decimal",
		precision: 10,
		scale: 2,
		default: 0,
		nullable: false,
	})
	priceProduct: number;

	@CreateDateColumn({
		type: "timestamptz",
		name: "created_at",
	})
	createdAt: Date;

	@CreateDateColumn({
		type: "timestamptz",
		name: "updated_at",
	})
	updatedAt: Date;
}
