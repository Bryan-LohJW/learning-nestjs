/* eslint-disable prettier/prettier */
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {}
  async signup(dto: AuthDto) {
    // generate the password hash
    const hash = await argon.hash(dto.password);
    try {
      // save the new yser in the db
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hash,
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          hash: true,
        },
      });
      delete user.hash; // to delete fields from the returned object
      // return the saved user
      return user;
    } catch (error) {
      if (error.code === "P2002") {
        throw new ForbiddenException("Credentials Taken");
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // if user does not exist throw exception
    if (!user) {
      throw new ForbiddenException("Credentials incorrect");
    }

    // compare password
    const pwMatches = await argon.verify(user.hash, dto.password);
    // if password incorrect throw exception
    if (!pwMatches) {
      throw new ForbiddenException("Credentials incorrect");
    }

    // send back the user
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get("JWT_SECRET");

    const token = await this.jwt.signAsync(payload, { expiresIn: "15m", secret });

    return {
      access_token: token,
    };

    return;
  }
}
