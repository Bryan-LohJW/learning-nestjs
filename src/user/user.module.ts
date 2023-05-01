import { Module } from "@nestjs/common";
import { UserController } from './user.controller';

// separate login into controllers and service / providers
@Module({
  controllers: [UserController]
})
export class UserModule {}
