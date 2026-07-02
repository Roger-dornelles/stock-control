import {
	Controller,
	Post,
	Delete,
	UseInterceptors,
	UploadedFile,
	Query,
	UseGuards,
	Put,
} from "@nestjs/common";
import { UploadService } from "./upload.service";

import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "src/auth/auth.guard";
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from "@nestjs/swagger";

@Controller("upload")
export class UploadController {
	constructor(private readonly uploadService: UploadService) {}

	@Post()
	@ApiOperation({
		summary: "criar imagem do usuário",
	})
	@ApiBody({
		type: "multipart/form-data",
		description: "Arquivo de imagem a ser carregado",
	})
	@ApiResponse({
		status: 200,
		description:
			"https://www-site-url.com/storage/v1/object/public/bucket/uploads/1234567890-image.jpg",
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@UseInterceptors(FileInterceptor("file"))
	@UseGuards(AuthGuard)
	create(@UploadedFile() file: Express.Multer.File) {
		return this.uploadService.create(file);
	}

	@Delete()
	@ApiOperation({
		summary: "excluir imagem do usuário",
	})
	@ApiQuery({
		name: "fileUrl",
		type: String,
		description: "URL de arquivo invalido",
		example:
			"https://www-site-url.com/storage/v1/object/public/bucket/uploads/1234567890-image.jpg",
	})
	@ApiResponse({
		status: 200,
		description: "Imagem excluída com sucesso",
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@UseGuards(AuthGuard)
	remove(@Query("fileUrl") fileUrl: string) {
		return this.uploadService.deleteFile(fileUrl);
	}

	@Put()
	@ApiOperation({
		summary: "Atualizar imagem do usuário",
	})
	@ApiQuery({
		name: "fileUrl",
		type: String,
		description: "URL da imagem a ser substituída",
		example:
			"https://www-site-url.com/storage/v1/object/public/bucket/uploads/1234567890-image.jpg",
	})
	@ApiBody({
		description: "file",
		type: "multipart/form-data",
	})
	@ApiResponse({
		status: 200,
		description: "Imagem atualizada com sucesso",
	})
	@ApiResponse({
		status: 401,
		description: "Credenciais inválidas",
	})
	@UseInterceptors(FileInterceptor("file"))
	@UseGuards(AuthGuard)
	update(@UploadedFile() file: Express.Multer.File, @Query("fileUrl") fileUrl: string) {
		return this.uploadService.updateImage(file, fileUrl);
	}
}
