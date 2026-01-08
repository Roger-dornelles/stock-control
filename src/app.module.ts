import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "./auth/auth.module";
import { ProductsModule } from "./products/products.module";
import { HealthController } from "./health/health.controller";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				type: "postgres",
				host: config.get<string>("SUPABASE_HOST"),
				port: Number(config.get<string>("SUPABASE_PORT") ?? 5432),
				username: config.get<string>("SUPABASE_USERNAME"),
				password: config.get<string>("SUPABASE_PASSWORD"),
				database: config.get<string>("SUPABASE_DATABASE"),
				ssl: { rejectUnauthorized: false },
				entities: [__dirname + "/**/*.entity{.ts,.js}"],
				synchronize: false,
			}),
		}),
		UsersModule,
		AuthModule,
		ProductsModule,
	],
	controllers: [AppController, HealthController],
	providers: [AppService],
})
export class AppModule {}
