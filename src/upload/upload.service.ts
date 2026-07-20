import {
	Injectable,
	Inject,
	InternalServerErrorException,
	BadRequestException,
} from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";
import { extname } from "path";

@Injectable()
export class UploadService {
	constructor(
		@Inject("SUPABASE_CLIENT")
		private readonly supabase: SupabaseClient
	) {}

	async uploadFile(file: Express.Multer.File, folder: string = "uploads"): Promise<string> {
		const ext = extname(file.originalname);
		const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

		const { error } = await this.supabase.storage
			.from(process.env.SUPABASE_BUCKET as string)
			.upload(filename, file.buffer, {
				contentType: file.mimetype,
				upsert: false,
			});

		if (error) {
			console.log("erro supabase storage =================>", error);
			throw new InternalServerErrorException(`Erro ao fazer upload: ${error.message}`);
		}

		const { data } = this.supabase.storage
			.from(process.env.SUPABASE_BUCKET as string)
			.getPublicUrl(filename);

		return data.publicUrl;
	}

	async deleteFile(fileUrl: string): Promise<string> {
		try {
			const bucket = process.env.SUPABASE_BUCKET as string;
			const path = fileUrl.split(`/${bucket}/`)[1];

			if (!path) {
				throw new InternalServerErrorException("URL de arquivo inválida");
			}

			const { data } = await this.supabase.storage.from(bucket).exists(path);

			if (!data) {
				throw new InternalServerErrorException("Imagem não encontrada");
			}

			const { error } = await this.supabase.storage.from(bucket).remove([path]);

			if (error) {
				throw new InternalServerErrorException(`Erro ao excluir arquivo: ${error.message}`);
			}
			return "Arquivo excluído com sucesso";
		} catch (error) {
			if (error instanceof InternalServerErrorException) {
				throw error;
			}

			throw new InternalServerErrorException("Erro ao excluir imagem, tente novamente mais tarde.");
		}
	}

	async create(file: Express.Multer.File) {
		try {
			if (!file) {
				throw new BadRequestException("Obrigatório enviar uma imagem");
			}

			const fileUrl = await this.uploadFile(file, "uploads");
			return { fileUrl };
		} catch (error) {
			if (error instanceof BadRequestException) {
				throw error;
			}

			throw new InternalServerErrorException(
				"Erro ao criar imagem do usuário, tente novamente mais tarde."
			);
		}
	}

	async updateImage(file: Express.Multer.File, fileUrl: string) {
		try {
			const bucket = process.env.SUPABASE_BUCKET as string;

			if (!file) {
				throw new BadRequestException("Obrigatório enviar uma imagem");
			}

			if (!fileUrl) {
				throw new BadRequestException("Obrigatório enviar a URL da imagem a ser substituída");
			}

			if (fileUrl && file) {
				const path = fileUrl.split(`/${bucket}/`)[1];

				await this.supabase.storage.from(bucket).remove([path]);
				const newFileUrl = await this.uploadFile(file, "uploads");
				return { fileUrl: newFileUrl };
			}
		} catch (error) {
			if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
				throw error;
			}

			throw new InternalServerErrorException(
				"Erro ao atualizar imagem do usuário, tente novamente mais tarde."
			);
		}
	}
}
