import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { MulterModule } from "@nestjs/platform-express";
import { memoryStorage } from "multer";

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		MulterModule.register({
			storage: memoryStorage(),
			fileFilter: (req, file, cb) => {
				const allowed = /jpeg|jpg|png|webp/;
				if (allowed.test(file.mimetype)) {
					cb(null, true);
				} else {
					cb(new Error("Apenas imagens são permitidas"), false);
				}
			},
			limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
		}),
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [UsersService],
})
export class UsersModule {}
