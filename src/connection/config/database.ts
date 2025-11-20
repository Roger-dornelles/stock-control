import { DataSource } from "typeorm";
import "dotenv/config";
import path from "path";

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
	entities: [path.join(__dirname, "/**/*.entity{.ts,.js}")],
	migrations: [path.join(__dirname, "/migrations/*{.ts,.js}")],
	synchronize: false,
});
