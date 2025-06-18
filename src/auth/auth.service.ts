import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, pass: string) {
    const user = await this.userService.findByEmailOrPhone(identifier);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role?.name,
    };
    // const { password, id, role.id,  ...userData } = user;
    delete user.id;
    delete user.password;
    delete user.created_at;
    delete user.updated_at;

    if (user.role) {
      delete user.role.created_at;
      delete user.role.updated_at;
    }
    return {
      access_token: this.jwtService.sign(payload),
      user: user
    };
  }
}
