import { Controller, Post, Body, UseGuards, Get, Req, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { buildResponse, ApiResponse } from '@utils/response.util';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Request as ExpressRequest } from 'express';
import { UserService } from 'src/user/user.service';
import { decryptPayload } from '@utils/encryption.util';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string },
  ): Promise<ApiResponse<any>> {
    const user = await this.authService.validateUser(
      body.identifier,
      body.password,
    );
    const loginResult = await this.authService.login(user);

    return buildResponse(loginResult, 'Login successful', true, 200);
  }

  @Get('onboard/login')
  async onboardingLogin(@Query('token') token: string) {
    const payload = decryptPayload(token);

    const user = await this.userService.findByEmailOrPhone(payload.identifier);
    if (!user) return buildResponse(null, 'User not found', false, 404);

    if (!user.onboarded) {
      await this.userService.updateUser(user.id, { onboarded: true });
    }

    const userLoggedIn = await this.authService.login(user);

    return buildResponse(userLoggedIn, 'Onboarding Successful', true, 200);
  }

  
  @Get('user')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Req() req): Promise<ApiResponse<any>> {
    const user = req.user;

    if (!user) {
      return buildResponse(null, 'User not found', false, 404);
    }

    const userProfile = await this.userService.findById(user.id);
    delete userProfile.password;
    return buildResponse(
      userProfile,
      'User profile retrieved successfully',
      true,
      200,
    );
  }
}
