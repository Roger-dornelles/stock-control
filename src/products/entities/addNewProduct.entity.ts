import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "product_list" })
export class AddNewProductEntity {
	@PrimaryGeneratedColumn("increment")
	id!: number;

	@Column({ name: "product_name", type: "varchar", length: 100, nullable: false })
	productName!: string;

	@Column({ name: "description_product", type: "text", nullable: false })
	descriptionProduct!: string;

	@Column({ name: "category_product", type: "varchar", length: 50, nullable: false })
	categoryProduct!: string;

	@Column({
		name: "price_product",
		type: "decimal",
		precision: 10,
		scale: 2,
		default: 0,
		nullable: false,
	})
	priceProduct!: number;

	@Column({ name: "code_product", type: "varchar", length: 50, nullable: false })
	codeProduct!: string;

	@Column({ name: "request_type", type: "varchar", length: 50, nullable: false })
	requestType!: string;

	@CreateDateColumn({
		type: "timestamptz",
		name: "created_at",
	})
	createdAt!: Date;

	@CreateDateColumn({
		type: "timestamptz",
		name: "updated_at",
	})
	updatedAt!: Date;
}
