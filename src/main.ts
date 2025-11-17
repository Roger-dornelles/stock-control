import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppDataSource } from "./connection/config/database";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle("Documentação API")
		.setDescription("Documentação da API")
		.setVersion("1.0")
		.addBearerAuth() // JWT
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup("api", app, document); // rota http://localhost:3000/api mostra a documentação da API

	await app.listen(3000);
}

AppDataSource.initialize()
	.then(() => console.log("Connected to DB PostgreSQL"))
	.catch((err) => console.error("DB Error:", err));

bootstrap().catch((err) => {
	console.error(err);
	process.exit(1);
});
