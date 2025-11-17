import { DataSource } from "typeorm";
import "dotenv/config";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.SUPABASE_HOST,
	port: Number(process.env.SUPABASE_PORT),
	username: process.env.SUPABASE_USERNAME,
	password: process.env.SUPABASE_PASSWORD,
	database: process.env.SUPABASE_DATABASE,
	ssl: {
		rejectUnauthorized: false,
	},
	entities: ["src/entities/*.ts"],
	migrations: ["src/migrations/*.ts"],
	synchronize: false,
});
