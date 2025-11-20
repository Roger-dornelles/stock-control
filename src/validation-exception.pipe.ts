import {
	ArgumentMetadata,
	BadRequestException,
	Injectable,
	PipeTransform,
	ValidationPipe,
	ValidationError,
} from "@nestjs/common";

@Injectable()
export class ValidationExceptionPipe extends ValidationPipe {
	constructor() {
		super({
			whitelist: true, // remove campos não esperados
			forbidNonWhitelisted: true, // retorna erro se enviar campo não esperado
			transform: true, // transforma payload no DTO
			exceptionFactory: (errors: ValidationError[]) => {
				const formattedErrors = errors.map((err) => {
					return {
						campo: err.property,
						erros: Object.values(err.constraints || {}),
					};
				});

				return new BadRequestException({
					statusCode: 400,
					mensagem: "Erro de validação",
					erros: formattedErrors,
				});
			},
		});
	}

	// se quiser manipular diretamente os valores antes de validar
	async transform(value: any, metadata: ArgumentMetadata) {
		return super.transform(value, metadata);
	}
}
