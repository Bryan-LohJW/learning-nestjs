import { Module } from "@nestjs/common";
import { BookmarkModule } from "./bookmark/bookmark.module";
import { UserModule } from "./user/user.module";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

// main module of the app that will import other modules
// modules allows us to build smaller components
@Module({
  imports: [AuthModule, UserModule, BookmarkModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true })],
})
export class AppModule {}
