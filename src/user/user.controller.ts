/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards } from "@nestjs/common";
import { User } from "@prisma/client";
import { GetUser } from "src/auth/decorator";
import { JwtGuard } from "src/auth/guard";

@UseGuards(JwtGuard) // extract the auth guard out to prevent typo error // guard can be used on top of controller or on top of specific routes
@Controller("user")
export class UserController {
  @Get("me")
  getMe(@GetUser() user: User, @GetUser("email") email: string) {
    // the guard automatically add user containing the payload into the request
    console.log(email);
    return user;
  }
}
