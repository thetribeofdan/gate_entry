import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { buildResponse } from '@utils/response.util';
import { encryptPayload } from '@utils/encryption.util';
import { sendOnboardingEmail } from '@utils/email';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.userService.createUser(createUserDto);

    if(newUser.role.name === 'occupant'){
      const token = encryptPayload({
        identifier: newUser.email,
        password: createUserDto.password,
      });
      const onboardingLink = `http://127.0.0.1:8700/api/auth/onboard/login?token=${token}`;
      console.log(onboardingLink);

      //TODO: SEND MAIL WITH ONBOARDING LINK TO USER
      // await sendOnboardingEmail(newUser.email, newUser.name, onboardingLink, 'Admin');
    }

    return buildResponse(newUser, 'User registered successfully', true, 201);
  }


  @Get('roles')
  async getRoles() {
    const roles = await this.userService.getAllRoles();
    return buildResponse(roles, 'Roles fetched successfully', true, 200);
  }
}
