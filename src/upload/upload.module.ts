import { Module, Global } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { UploadService } from "./upload.service";
import { SupabaseProvider } from "../../supabase.provider";
import { UploadController } from "./upload.controller";

@Global()
@Module({
	imports: [
		MulterModule.register({
			storage: memoryStorage(),
			fileFilter: (req, file, cb) => {
				const allowed = /jpeg|jpg|png|webp|gif/;
				if (allowed.test(file.mimetype)) {
					cb(null, true);
				} else {
					cb(new Error("Apenas imagens são permitidas"), false);
				}
			},
			limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
		}),
	],
	providers: [UploadService, SupabaseProvider],
	exports: [UploadService],
	controllers: [UploadController],
})
export class UploadModule {}
