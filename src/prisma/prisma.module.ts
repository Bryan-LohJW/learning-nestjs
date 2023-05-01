import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";

@Global() // enables export to be accessible in all modules
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
