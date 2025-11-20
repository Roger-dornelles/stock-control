import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
	@PrimaryGeneratedColumn("increment")
	id: number;

	@Column({ name: "username", type: "varchar", length: 50, nullable: false })
	username: string;

	@Column({ name: "email", type: "varchar", length: 50, unique: true, nullable: false })
	email: string;

	@Column({ name: "password", type: "varchar", length: 155, nullable: false })
	password: string;

	@Column({ name: "role", type: "varchar", length: 8, nullable: false, default: "user" })
	role: "user" | "admin";

	@Column({
		name: "created_at",
		type: "timestamptz",
		default: () => "CURRENT_TIMESTAMP",
	})
	createdAt: Date;
}
