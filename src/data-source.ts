import { DataSource } from "typeorm";
import "dotenv/config";

export const AppDataSource = new DataSource({
	type: "postgres",
	host: process.env.SUPABASE_HOST,
	port: parseInt(process.env.SUPABASE_PORT || "5432", 10),
	username: process.env.SUPABASE_USERNAME,
	password: process.env.SUPABASE_PASSWORD,
	database: process.env.SUPABASE_DATABASE,
	ssl: {
		rejectUnauthorized: false, //  ignora o certificado autoassinado
	},
	extra: {
		ssl: {
			rejectUnauthorized: false, // necessário para CLI e ts-node
		},
	},
	entities: [__dirname + "/**/*.entity.{ts,js}"],
	migrations: [__dirname + "/migration/*.{ts,js}"],
	synchronize: false,
});
